import { Hono } from "hono";
import { z } from "zod";
import type { Env, Variables } from "../types";
import { requireAuth, getCookie } from "../auth";
import { getRazorpayCredentials, verifyRazorpaySignature } from "./razorpay";
import { sendEmail, buildOrderConfirmationEmail } from "../email";

export const checkoutRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/checkout/track (Public order tracking lookup)
checkoutRouter.get("/track", async (c) => {
  const orderNumber = c.req.query("number");
  if (!orderNumber) {
    return c.json({ error: "Order number required" }, 400);
  }

  const order = await c.env.DB
    .prepare("SELECT * FROM orders WHERE order_number = ?")
    .bind(orderNumber.trim().toUpperCase())
    .first<any>();

  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }

  return c.json({ order });
});

const CheckoutSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  addressLine1: z.string().min(1, "Address line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().default("India"),
  couponCode: z.string().optional(),
  customerNotes: z.string().optional(),
});

// Helper: verifyRazorpaySignature imported from ./razorpay

// POST /api/checkout/create-order
checkoutRouter.post("/create-order", async (c) => {
  try {
    const user = c.get("user");
    const cookieHeader = c.req.header("Cookie") || null;
    const cartId = getCookie(cookieHeader, "toyz_cart_id");

    if (!cartId) {
      return c.json({ error: "Cart not found or empty." }, 400);
    }

    const body = await c.req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation Failed", details: parsed.error.flatten() }, 400);
    }

    const shipping = parsed.data;

    // Get Cart Items directly from database to enforce server-authoritative pricing!
    const itemsResult = await c.env.DB
      .prepare(`
        SELECT 
          ci.id, ci.product_id, ci.variant_id, ci.quantity,
          p.name as product_name, p.base_price,
          v.name as variant_name, v.price_modifier, v.stock
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        LEFT JOIN product_variants v ON ci.variant_id = v.id
        WHERE ci.cart_id = ?
      `)
      .bind(cartId)
      .all<any>();

    const items = itemsResult.results || [];
    if (items.length === 0) {
      return c.json({ error: "Your cart is empty." }, 400);
    }

    // Verify stock for all items
    for (const item of items) {
      if (item.stock !== null && item.stock < item.quantity) {
        return c.json({
          error: "Stock unavailable",
          message: `Item "${item.product_name} (${item.variant_name || "Standard"})" is out of stock.`,
        }, 400);
      }
    }

    // Calculate subtotal in paise
    let subtotal = 0;
    const orderItemsToInsert: any[] = [];

    for (const item of items) {
      const unitPrice = item.base_price + (item.price_modifier || 0);
      const totalPrice = unitPrice * item.quantity;
      subtotal += totalPrice;
      orderItemsToInsert.push({
        id: "oit_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16),
        productId: item.product_id,
        variantId: item.variant_id || null,
        productName: item.product_name,
        variantName: item.variant_name || "Standard",
        unitPrice,
        quantity: item.quantity,
        totalPrice,
      });
    }

    // Calculate shipping from store settings
    const freeShipSetting = await c.env.DB
      .prepare("SELECT value FROM store_settings WHERE key = 'free_shipping_threshold'")
      .first<{ value: string }>();
    const stdShipSetting = await c.env.DB
      .prepare("SELECT value FROM store_settings WHERE key = 'standard_shipping_rate'")
      .first<{ value: string }>();

    const freeThreshold = freeShipSetting ? parseInt(freeShipSetting.value, 10) : 99900;
    const stdShipping = stdShipSetting ? parseInt(stdShipSetting.value, 10) : 9900;
    const shippingCost = (subtotal >= freeThreshold || subtotal <= 500) ? 0 : stdShipping;

    // Calculate coupon discount
    let discountAmount = 0;
    let validCouponCode = null;

    if (shipping.couponCode) {
      const coupon = await c.env.DB
        .prepare("SELECT * FROM coupons WHERE code = ? AND is_active = 1")
        .bind(shipping.couponCode.toUpperCase())
        .first<any>();

      if (coupon && (!coupon.minimum_order_amount || subtotal >= coupon.minimum_order_amount)) {
        validCouponCode = coupon.code;
        if (coupon.discount_type === "percentage") {
          discountAmount = Math.round((subtotal * coupon.discount_value) / 100);
        } else {
          discountAmount = Math.min(coupon.discount_value, subtotal);
        }
      }
    }

    const totalAmount = Math.max(0, subtotal - discountAmount + shippingCost);

    // Ensure we have a user account (either authenticated or create guest user)
    let finalUserId = user?.userId;
    if (!finalUserId) {
      // Find or create guest user record
      const existingUser = await c.env.DB
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(shipping.email.toLowerCase())
        .first<{ id: string }>();

      if (existingUser) {
        finalUserId = existingUser.id;
      } else {
        finalUserId = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        await c.env.DB
          .prepare(
            "INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, 'guest_no_login', ?, ?, ?, 'customer')"
          )
          .bind(finalUserId, shipping.email.toLowerCase(), shipping.fullName.split(" ")[0] || "Customer", shipping.fullName.split(" ")[1] || "", shipping.phone)
          .run();
      }
    }

    const orderId = "ord_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const orderNumber = "TTD-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    // Save order in D1
    await c.env.DB
      .prepare(`
        INSERT INTO orders (
          id, order_number, user_id, status, subtotal, shipping_cost, tax_amount, discount_amount, total_amount,
          coupon_code, shipping_name, shipping_phone, shipping_email, shipping_address_1, shipping_address_2,
          shipping_city, shipping_state, shipping_postal_code, shipping_country, internal_notes, payment_status
        ) VALUES (?, ?, ?, 'pending', ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'created')
      `)
      .bind(
        orderId, orderNumber, finalUserId, subtotal, shippingCost, discountAmount, totalAmount,
        validCouponCode, shipping.fullName, shipping.phone, shipping.email.toLowerCase(), shipping.addressLine1, shipping.addressLine2 || null,
        shipping.city, shipping.state, shipping.postalCode, shipping.country, shipping.customerNotes || null
      )
      .run();

    // Insert Order Items
    for (const oi of orderItemsToInsert) {
      await c.env.DB
        .prepare(`
          INSERT INTO order_items (id, order_id, product_id, variant_id, product_name, variant_name, unit_price, quantity, total_price)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(oi.id, orderId, oi.productId, oi.variantId, oi.productName, oi.variantName, oi.unitPrice, oi.quantity, oi.totalPrice)
        .run();
    }

    // Record initial status history
    await c.env.DB
      .prepare("INSERT INTO order_status_history (id, order_id, to_status, note) VALUES (?, ?, 'pending', 'Order placed, awaiting payment.')")
      .bind("osh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), orderId)
      .run();

    // Setup Razorpay Order (or Mock if credentials not supplied)
    let razorpayOrderId = "order_mock_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    let isMockPayment = true;
    const { keyId, keySecret } = getRazorpayCredentials(c);

    if (keyId && keySecret) {
      const authHeader = btoa(`${keyId}:${keySecret}`);
      const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount),
          currency: "INR",
          receipt: orderNumber,
          notes: {
            order_id: orderId,
            order_number: orderNumber,
          },
        }),
      });

      if (rzpRes.status === 401) {
        return c.json(
          { error: "Razorpay authentication failed. Please check your Key ID and Key Secret." },
          401
        );
      }

      if (!rzpRes.ok) {
        const errData = (await rzpRes.json().catch(() => ({}))) as any;
        return c.json(
          { error: "Failed to create Razorpay payment order", details: errData },
          500
        );
      }

      const rzpData = (await rzpRes.json()) as any;
      razorpayOrderId = rzpData.id;
      isMockPayment = false;
    }

    // Create payment entry in D1 and link razorpay_order_id to orders table
    const paymentId = "pay_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await c.env.DB
      .prepare("INSERT INTO payments (id, order_id, razorpay_order_id, amount, currency, status) VALUES (?, ?, ?, ?, 'INR', 'created')")
      .bind(paymentId, orderId, razorpayOrderId, totalAmount)
      .run();

    await c.env.DB
      .prepare("UPDATE orders SET razorpay_order_id = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(razorpayOrderId, orderId)
      .run();

    return c.json({
      orderId,
      orderNumber,
      amount: totalAmount,
      currency: "INR",
      razorpayOrderId,
      razorpayKeyId: keyId || "rzp_test_placeholder",
      isMockPayment,
      customerDetails: {
        name: shipping.fullName,
        email: shipping.email,
        phone: shipping.phone,
      },
    });
  } catch (err: any) {
    return c.json({ error: "Checkout Failed", message: err.message }, 500);
  }
});

// POST /api/checkout/verify
checkoutRouter.post("/verify", async (c) => {
  try {
    const body = await c.req.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature, isMock } = body;

    const order = await c.env.DB
      .prepare("SELECT * FROM orders WHERE id = ?")
      .bind(orderId)
      .first<any>();

    if (!order) {
      return c.json({ error: "Order not found" }, 404);
    }

    const { keySecret } = getRazorpayCredentials(c);
    let isValid = false;

    if (isMock || !keySecret) {
      // Development mock payment adapter (only if no secret configured or explicitly requested)
      isValid = true;
    } else {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return c.json(
          { error: "Missing required Razorpay fields (razorpayOrderId, razorpayPaymentId, razorpaySignature)" },
          400
        );
      }
      isValid = await verifyRazorpaySignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        keySecret
      );
    }

    if (!isValid) {
      await c.env.DB
        .prepare("UPDATE payments SET status = 'failed', failure_reason = 'Signature verification failed' WHERE order_id = ?")
        .bind(orderId)
        .run();
      return c.json({ success: false, error: "Payment verification failed: Signature mismatch." }, 400);
    }

    // Payment successfully confirmed!
    await c.env.DB
      .prepare(`
        UPDATE payments SET 
          razorpay_payment_id = ?,
          razorpay_signature = ?,
          status = 'captured',
          updated_at = datetime('now')
        WHERE order_id = ?
      `)
      .bind(razorpayPaymentId || "pay_mock_" + Date.now(), razorpaySignature || "mock_sig", orderId)
      .run();

    // Transition Order to payment_confirmed and store payment references
    await c.env.DB
      .prepare(`
        UPDATE orders SET 
          status = 'payment_confirmed',
          razorpay_payment_id = ?,
          payment_status = 'captured',
          payment_method = 'razorpay',
          updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(razorpayPaymentId || "pay_mock_" + Date.now(), orderId)
      .run();

    // Update stock in variants
    const orderItems = await c.env.DB
      .prepare("SELECT variant_id, quantity FROM order_items WHERE order_id = ?")
      .bind(orderId)
      .all<any>();

    for (const it of (orderItems.results || [])) {
      if (it.variant_id) {
        await c.env.DB
          .prepare("UPDATE product_variants SET stock = MAX(0, stock - ?), updated_at = datetime('now') WHERE id = ?")
          .bind(it.quantity, it.variant_id)
          .run();
      }
    }

    // Record status history
    await c.env.DB
      .prepare("INSERT INTO order_status_history (id, order_id, from_status, to_status, note) VALUES (?, ?, 'pending', 'payment_confirmed', 'Payment verified successfully.')")
      .bind("osh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), orderId)
      .run();

    // Clear cart items
    const cookieHeader = c.req.header("Cookie") || null;
    const cartId = getCookie(cookieHeader, "toyz_cart_id");
    if (cartId) {
      await c.env.DB.prepare("DELETE FROM cart_items WHERE cart_id = ?").bind(cartId).run();
    }

    // Trigger Branded Order Confirmation Email via Resend
    try {
      const customerEmail =
        order.shipping_email ||
        order.user_email ||
        (order.shipping_address_2 && order.shipping_address_2.includes("@") ? order.shipping_address_2 : null);

      if (customerEmail) {
        const emailContent = buildOrderConfirmationEmail(order, orderItems.results || []);
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
            }).catch((err) => console.error("Email dispatch failed:", err));
      }
    } catch (emailErr) {
      console.warn("Could not send confirmation email:", emailErr);
    }

    return c.json({
      success: true,
      orderNumber: order.order_number,
      message: "Payment verified successfully. Order confirmed!",
    });
  } catch (err: any) {
    return c.json({ error: "Verification Error", message: err.message }, 500);
  }
});

// POST /api/webhooks/razorpay
checkoutRouter.post("/webhooks/razorpay", async (c) => {
  try {
    const rawBody = await c.req.text();
    const signature = c.req.header("X-Razorpay-Signature");
    const secret = c.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret && signature) {
      const enc = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      const signatureBytes = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
      const computedHex = Array.from(new Uint8Array(signatureBytes))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      if (computedHex !== signature) {
        return c.text("Invalid webhook signature", 400);
      }
    }

    const event = JSON.parse(rawBody);
    const eventId = event.event_id || event.id || "evt_" + Date.now();

    // Idempotency: Check if already processed
    const alreadyProcessed = await c.env.DB
      .prepare("SELECT id FROM payment_events WHERE event_id = ?")
      .bind(eventId)
      .first();

    if (alreadyProcessed) {
      return c.json({ status: "already_processed" });
    }

    // Record event
    const eventRecordId = "pevt_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    await c.env.DB
      .prepare("INSERT INTO payment_events (id, event_type, event_id, payload, processed_at) VALUES (?, ?, ?, ?, datetime('now'))")
      .bind(eventRecordId, event.event || "unknown", eventId, rawBody)
      .run();

    // Process event
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const orderEntity = event.payload?.order?.entity;
      const razorpayOrderId = orderEntity?.id || paymentEntity?.order_id;

      if (razorpayOrderId) {
        const paymentRow = await c.env.DB
          .prepare("SELECT order_id FROM payments WHERE razorpay_order_id = ?")
          .bind(razorpayOrderId)
          .first<{ order_id: string }>();

        if (paymentRow) {
          await c.env.DB
            .prepare("UPDATE orders SET status = 'payment_confirmed', updated_at = datetime('now') WHERE id = ?")
            .bind(paymentRow.order_id)
            .run();
          await c.env.DB
            .prepare("UPDATE payments SET status = 'captured', razorpay_payment_id = ?, updated_at = datetime('now') WHERE razorpay_order_id = ?")
            .bind(paymentEntity?.id || null, razorpayOrderId)
            .run();
        }
      }
    }

    return c.json({ status: "ok" });
  } catch (err: any) {
    return c.json({ error: "Webhook Error", message: err.message }, 500);
  }
});
