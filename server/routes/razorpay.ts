import { Hono } from "hono";
import type { Env, Variables } from "../types";

export const razorpayRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Helper: HMAC SHA-256 for Razorpay signature verification
export async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const enc = new TextEncoder();
  const data = `${orderId}|${paymentId}`;
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signatureBytes = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  const computedHex = Array.from(new Uint8Array(signatureBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computedHex.toLowerCase() === signature.toLowerCase();
}

export function getRazorpayCredentials(c: any) {
  const keyId =
    c.env?.RAZORPAY_KEY_ID ||
    (typeof process !== "undefined" ? process.env?.RAZORPAY_KEY_ID : "") ||
    "";
  const keySecret =
    c.env?.RAZORPAY_KEY_SECRET ||
    (typeof process !== "undefined" ? process.env?.RAZORPAY_KEY_SECRET : "") ||
    "";
  return { keyId, keySecret };
}

/**
 * STEP 1: POST /api/create-order
 * Request: { amount (paise), currency?, receipt?, notes? }
 * Minimum amount: 100 paise (₹1.00)
 * Calls Razorpay API: POST https://api.razorpay.com/v1/orders
 * Returns: { order_id, amount, currency, key_id }
 */
razorpayRouter.post("/create-order", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const amount = Number(body.amount);
    const currency = body.currency || "INR";
    const receipt = body.receipt || `rcpt_${Date.now()}`;

    // Validate minimum amount (>= 100 paise)
    if (isNaN(amount) || amount < 100) {
      return c.json(
        { error: "Invalid amount. Minimum amount is 100 paise (₹1.00)." },
        400
      );
    }

    const { keyId, keySecret } = getRazorpayCredentials(c);
    if (!keyId || !keySecret) {
      return c.json(
        { error: "Razorpay credentials not configured on the server." },
        500
      );
    }

    const authHeader = btoa(`${keyId}:${keySecret}`);
    const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: Math.round(amount),
        currency,
        receipt,
        notes: body.notes || {},
      }),
    });

    if (rzpRes.status === 401) {
      return c.json(
        { error: "Razorpay authentication failed. Invalid Key ID or Key Secret." },
        401
      );
    }

    if (!rzpRes.ok) {
      const errData = (await rzpRes.json().catch(() => ({}))) as any;
      return c.json(
        { error: "Razorpay order creation failed", details: errData },
        500
      );
    }

    const rzpData = (await rzpRes.json()) as any;

    return c.json({
      order_id: rzpData.id,
      amount: rzpData.amount,
      currency: rzpData.currency,
      key_id: keyId,
    });
  } catch (err: any) {
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
  }
});

/**
 * STEP 3: POST /api/verify-payment
 * Request: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
 * Compares computed signature with received signature
 */
razorpayRouter.post("/verify-payment", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const order_id = body.razorpay_order_id || body.order_id;
    const payment_id = body.razorpay_payment_id || body.payment_id;
    const signature = body.razorpay_signature || body.signature;

    // Validate required fields
    if (!order_id || !payment_id || !signature) {
      return c.json(
        {
          error:
            "Missing required fields. Both order_id, payment_id, and signature are required.",
          received: {
            order_id: !!order_id,
            payment_id: !!payment_id,
            signature: !!signature,
          },
        },
        400
      );
    }

    const { keySecret } = getRazorpayCredentials(c);
    if (!keySecret) {
      return c.json(
        { error: "Razorpay KEY_SECRET not configured on server." },
        500
      );
    }

    const isValid = await verifyRazorpaySignature(
      order_id,
      payment_id,
      signature,
      keySecret
    );

    if (!isValid) {
      return c.json(
        {
          success: false,
          error: "Payment verification failed: Signature mismatch.",
        },
        400
      );
    }

    return c.json({
      success: true,
      message: "Payment verified successfully",
      order_id,
      payment_id,
    });
  } catch (err: any) {
    return c.json({ error: "Verification Failed", message: err.message }, 500);
  }
});
