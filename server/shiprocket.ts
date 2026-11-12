import type { Env } from "./types";

interface CachedToken {
  token: string;
  expiresAt: number;
}

let memoryTokenCache: CachedToken | null = null;

export function getShiprocketCredentials(env: Env) {
  const email =
    env.SHIPROCKET_EMAIL ||
    (typeof process !== "undefined" ? process.env?.SHIPROCKET_EMAIL : "") ||
    "";
  const password =
    env.SHIPROCKET_PASSWORD ||
    (typeof process !== "undefined" ? process.env?.SHIPROCKET_PASSWORD : "") ||
    "";
  const pickupLocation =
    env.SHIPROCKET_PICKUP_LOCATION ||
    (typeof process !== "undefined" ? process.env?.SHIPROCKET_PICKUP_LOCATION : "") ||
    "Primary";

  return { email, password, pickupLocation };
}

/**
 * Obtain and cache Shiprocket API JWT Bearer token (valid for 10 days)
 */
export async function getShiprocketToken(env: Env): Promise<string | null> {
  const now = Date.now();
  if (memoryTokenCache && memoryTokenCache.expiresAt > now + 60000) {
    return memoryTokenCache.token;
  }

  const { email, password } = getShiprocketCredentials(env);
  if (!email || !password) {
    console.warn("Shiprocket credentials not configured.");
    return null;
  }

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Shiprocket login failed:", res.status, err);
      return null;
    }

    const data = (await res.json()) as { token: string };
    if (data.token) {
      // Cache token for 9 days (token valid for 10)
      memoryTokenCache = {
        token: data.token,
        expiresAt: now + 9 * 24 * 60 * 60 * 1000,
      };
      return data.token;
    }
  } catch (err) {
    console.error("Shiprocket auth error:", err);
  }

  return null;
}

/**
 * Check courier serviceability & estimated transit time for a customer pincode
 */
export async function checkCourierServiceability(
  env: Env,
  deliveryPostcode: string,
  weightKg: number = 0.25,
  pickupPostcode: string = "582101"
) {
  const token = await getShiprocketToken(env);
  if (!token) {
    return { available: false, error: "Shiprocket not authenticated" };
  }

  try {
    const url = new URL("https://apiv2.shiprocket.in/v1/external/courier/serviceability/");
    url.searchParams.set("pickup_postcode", pickupPostcode);
    url.searchParams.set("delivery_postcode", deliveryPostcode.trim());
    url.searchParams.set("weight", weightKg.toString());
    url.searchParams.set("cod", "0"); // Prepaid only

    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as any;
    if (data.status === 200 && data.data?.available_courier_companies?.length > 0) {
      const couriers = data.data.available_courier_companies.map((c: any) => ({
        courierId: c.courier_company_id,
        courierName: c.courier_name,
        estimatedDeliveryDays: c.estimated_delivery_days,
        etd: c.etd,
        rate: c.rate,
        rating: c.rating,
      }));

      return {
        available: true,
        recommendedCourier: couriers[0],
        couriers,
      };
    }

    return {
      available: false,
      message: data.message || "Pincode not currently serviceable",
    };
  } catch (err: any) {
    return { available: false, error: err.message };
  }
}

/**
 * Create a new order in Shiprocket
 */
export async function createShiprocketOrder(
  env: Env,
  order: any,
  items: any[]
): Promise<{ success: boolean; shiprocketOrderId?: number; shipmentId?: number; error?: string }> {
  const token = await getShiprocketToken(env);
  if (!token) {
    return { success: false, error: "Shiprocket credentials missing or failed login" };
  }

  const { pickupLocation } = getShiprocketCredentials(env);

  // Format order date: YYYY-MM-DD HH:mm
  const orderDate = new Date().toISOString().replace("T", " ").substring(0, 16);

  const payload = {
    order_id: order.order_number,
    order_date: orderDate,
    pickup_location: pickupLocation,
    billing_customer_name: order.shipping_name.split(" ")[0] || "Customer",
    billing_last_name: order.shipping_name.split(" ").slice(1).join(" ") || "",
    billing_address: order.shipping_address_1,
    billing_address_2: order.shipping_address_2 || "",
    billing_city: order.shipping_city,
    billing_pincode: order.shipping_postal_code,
    billing_state: order.shipping_state,
    billing_country: order.shipping_country || "India",
    billing_email: order.user_email || "thetoyzdept@gmail.com",
    billing_phone: order.shipping_phone.replace(/[^0-9]/g, "").slice(-10),
    shipping_is_billing: true,
    order_items: items.map((it: any) => ({
      name: it.product_name + (it.variant_name ? ` - ${it.variant_name}` : ""),
      sku: it.variant_sku || it.product_id || "TTD-ITEM",
      units: it.quantity,
      selling_price: (it.unit_price / 100).toFixed(2),
      discount: 0,
      tax: 0,
    })),
    payment_method: "Prepaid",
    sub_total: (order.total_amount / 100).toFixed(2),
    length: 15,
    breadth: 15,
    height: 10,
    weight: 0.25,
  };

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as any;
    if (res.ok && data.order_id) {
      return {
        success: true,
        shiprocketOrderId: data.order_id,
        shipmentId: data.shipment_id,
      };
    }

    return {
      success: false,
      error: data.message || JSON.stringify(data),
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Generate AWB for a shipment
 */
export async function generateShiprocketAWB(
  env: Env,
  shipmentId: number,
  courierId?: number
): Promise<{ success: boolean; awbCode?: string; courierName?: string; error?: string }> {
  const token = await getShiprocketToken(env);
  if (!token) return { success: false, error: "Shiprocket not authenticated" };

  try {
    const res = await fetch("https://apiv2.shiprocket.in/v1/external/courier/assign/awb", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shipment_id: shipmentId,
        ...(courierId ? { courier_id: courierId } : {}),
      }),
    });

    const data = (await res.json()) as any;
    if (res.ok && data.response?.data?.awb_code) {
      return {
        success: true,
        awbCode: data.response.data.awb_code,
        courierName: data.response.data.courier_name,
      };
    }

    return { success: false, error: data.message || "Failed to generate AWB" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Live Track Shipment by AWB
 */
export async function trackShiprocketShipment(env: Env, awbNumber: string) {
  const token = await getShiprocketToken(env);
  if (!token) return { success: false, error: "Shiprocket not authenticated" };

  try {
    const res = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awbNumber.trim()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = (await res.json()) as any;
    const tracking = data.tracking_data;
    if (tracking) {
      return {
        success: true,
        trackStatus: tracking.track_status,
        shipmentStatus: tracking.shipment_status,
        expectedDate: tracking.expected_date,
        currentLocation: tracking.current_status,
        activities: (tracking.shipment_track_activities || []).map((a: any) => ({
          date: a.date,
          status: a.activity,
          location: a.location,
        })),
      };
    }

    return { success: false, message: "No tracking data found for this AWB" };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
