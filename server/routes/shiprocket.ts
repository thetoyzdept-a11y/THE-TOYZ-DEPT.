import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { requireAdmin } from "../auth";
import {
  checkCourierServiceability,
  createShiprocketOrder,
  generateShiprocketAWB,
  generateShiprocketLabel,
  requestShiprocketPickup,
  trackShiprocketShipment,
} from "../shiprocket";
import { sendEmail, buildShipmentDispatchedEmail } from "../email";

export const shippingRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

/**
 * Public: GET /api/shipping/serviceability?pincode=560038
 * Check delivery availability and estimated transit time
 */
shippingRouter.get("/serviceability", async (c) => {
  const pincode = c.req.query("pincode");
  if (!pincode || pincode.length !== 6) {
    return c.json({ error: "Please enter a valid 6-digit Indian PIN code." }, 400);
  }

  const result = await checkCourierServiceability(c.env, pincode);
  return c.json(result);
});

/**
 * Admin: POST /api/shipping/create-shipment/:orderId
 * Push order to Shiprocket, assign courier & generate live AWB
 */
shippingRouter.post("/create-shipment/:orderId", requireAdmin, async (c) => {
  const orderId = c.req.param("orderId");

  const order = await c.env.DB
    .prepare("SELECT * FROM orders WHERE id = ?")
    .bind(orderId)
    .first<any>();

  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }

  const itemsRes = await c.env.DB
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .bind(orderId)
    .all<any>();

  const items = itemsRes.results || [];

  // 1. Create Order in Shiprocket
  const shipRes = await createShiprocketOrder(c.env, order, items);
  if (!shipRes.success || !shipRes.shipmentId) {
    return c.json(
      { error: "Failed to create shipment in Shiprocket: " + (shipRes.error || "Unknown error") },
      500
    );
  }

  // 2. Assign Courier & Generate AWB
  const awbRes = await generateShiprocketAWB(c.env, shipRes.shipmentId);
  const awbCode = awbRes.awbCode || `SR-${shipRes.shipmentId}`;
  const courierName = awbRes.courierName || "Shiprocket Express";
  const trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;

  // 3. Generate Printable Shipping Label (PDF)
  let labelUrl: string | null = null;
  try {
    const labelRes = await generateShiprocketLabel(c.env, shipRes.shipmentId);
    if (labelRes.success && labelRes.labelUrl) {
      labelUrl = labelRes.labelUrl;
    }
  } catch (lblErr) {
    console.warn("Shipping label auto-generation non-blocking warning:", lblErr);
  }

  // 4. Request Hub Courier Pickup
  let pickupDate: string | null = null;
  let pickupToken: string | null = null;
  try {
    const pickupRes = await requestShiprocketPickup(c.env, shipRes.shipmentId);
    if (pickupRes.success) {
      pickupDate = pickupRes.pickupDate || null;
      pickupToken = pickupRes.tokenNumber || null;
    }
  } catch (pkErr) {
    console.warn("Pickup scheduling non-blocking warning:", pkErr);
  }

  // 5. Update order in D1 with full Shiprocket telemetry and metadata
  await c.env.DB
    .prepare(`
      UPDATE orders SET 
        status = 'shipped',
        shiprocket_order_id = ?,
        shiprocket_shipment_id = ?,
        courier_name = ?,
        awb_code = ?,
        tracking_number = ?,
        tracking_url = ?,
        label_url = COALESCE(?, label_url),
        pickup_scheduled_date = COALESCE(?, pickup_scheduled_date),
        pickup_token_number = COALESCE(?, pickup_token_number),
        shipped_at = datetime('now'),
        updated_at = datetime('now')
      WHERE id = ?
    `)
    .bind(
      shipRes.shiprocketOrderId?.toString() || null,
      shipRes.shipmentId?.toString() || null,
      courierName,
      awbCode,
      awbCode,
      trackingUrl,
      labelUrl,
      pickupDate,
      pickupToken,
      orderId
    )
    .run();

  // 6. Record status history
  await c.env.DB
    .prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, note)
      VALUES (?, ?, ?, 'shipped', ?)
    `)
    .bind(
      "osh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16),
      orderId,
      order.status,
      `Shipped via ${courierName}. AWB: ${awbCode}${pickupDate ? ` (Pickup scheduled: ${pickupDate})` : ""}`
    )
    .run();

  // 7. Trigger Shipment Dispatched Email via Resend
  try {
    const customerEmail =
      order.shipping_email ||
      order.user_email ||
      (order.shipping_address_2 && order.shipping_address_2.includes("@") ? order.shipping_address_2 : null);

    if (customerEmail) {
      const emailContent = buildShipmentDispatchedEmail(order, awbCode, courierName, trackingUrl);
      c.executionCtx?.waitUntil
        ? c.executionCtx.waitUntil(
            sendEmail(c.env, {
              to: customerEmail,
              subject: emailContent.subject,
              html: emailContent.html,
              text: emailContent.text,
            })
          )
        : sendEmail(c.env, {
            to: customerEmail,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text,
          }).catch((err) => console.error("Dispatch email failed:", err));
    }
  } catch (emailErr) {
    console.warn("Could not send dispatch email:", emailErr);
  }

  return c.json({
    success: true,
    message: "Shipment successfully created in Shiprocket!",
    shiprocketOrderId: shipRes.shiprocketOrderId,
    shipmentId: shipRes.shipmentId,
    awbCode,
    courierName,
    trackingUrl,
    labelUrl,
    pickupDate,
    pickupToken,
  });
});

/**
 * Public: GET /api/shipping/track/:awb
 * Live shipment milestone tracking
 */
shippingRouter.get("/track/:awb", async (c) => {
  const awb = c.req.param("awb");
  if (!awb) {
    return c.json({ error: "AWB tracking number is required" }, 400);
  }

  const result = await trackShiprocketShipment(c.env, awb);
  return c.json(result);
});

/**
 * Webhook: POST /api/webhooks/shiprocket
 * Receives automatic status milestones from Shiprocket
 */
shippingRouter.post("/webhook", async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const awb = body.awb;
    const currentStatus = body.current_status?.toUpperCase();

    if (!awb) {
      return c.json({ error: "Missing AWB" }, 400);
    }

    // Map Shiprocket statuses to THE TOYZ DEPT. order status
    let newStatus: string | null = null;
    if (currentStatus === "DELIVERED") {
      newStatus = "delivered";
    } else if (currentStatus === "OUT FOR DELIVERY" || currentStatus === "IN TRANSIT" || currentStatus === "PICKED UP") {
      newStatus = "shipped";
    } else if (currentStatus === "CANCELED" || currentStatus === "RTO INITIATED") {
      newStatus = "cancelled";
    }

    if (newStatus) {
      await c.env.DB
        .prepare("UPDATE orders SET status = ?, updated_at = datetime('now') WHERE tracking_number = ?")
        .bind(newStatus, awb)
        .run();
    }

    return c.json({ success: true, processed: !!newStatus });
  } catch (err: any) {
    return c.json({ error: err.message }, 500);
  }
});
