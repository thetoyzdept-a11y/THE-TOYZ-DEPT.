import type { Env } from "./types";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(env: Env, params: SendEmailParams): Promise<{ success: boolean; id?: string; error?: string }> {
  const fromEmail = "THE TOYZ DEPT. <support@thetoyzdept.in>";

  // If Resend API key is configured in Cloudflare Environment
  if (env.RESEND_API_KEY) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [params.to],
          subject: params.subject,
          html: params.html,
          text: params.text || params.html.replace(/<[^>]+>/g, ""),
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        console.error("Resend delivery failed:", errJson);
        return { success: false, error: JSON.stringify(errJson) };
      }

      const data = await res.json() as { id: string };
      console.log(`[EMAIL DISPATCHED] ID: ${data.id} -> ${params.to} ("${params.subject}")`);
      return { success: true, id: data.id };
    } catch (err: any) {
      console.error("Resend API exception:", err);
      return { success: false, error: err.message };
    }
  }

  // Graceful Fallback Mode: Log email contents for immediate local testing
  console.log(`
════════════════════════════════════════════════════════════════
[TRANSACTIONAL EMAIL NOTICE - AWAITING RESEND_API_KEY]
To: ${params.to}
From: ${fromEmail}
Subject: ${params.subject}
Content:
${params.text || params.html.replace(/<[^>]+>/g, "")}
════════════════════════════════════════════════════════════════
  `);

  return { success: true, id: "mock_logged_" + Date.now() };
}

export function buildPasswordResetEmail(resetUrl: string, userFirstName: string): { subject: string; html: string; text: string } {
  const subject = "Reset Your Password — THE TOYZ DEPT.";
  const text = `Hello ${userFirstName},\n\nWe received a request to reset your password for THE TOYZ DEPT.\n\nClick the link below to set a new password:\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not make this request, you can safely ignore this email.\n\n— THE TOYZ DEPT. Studio`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace; background-color: #F8F5EE; margin: 0; padding: 24px; color: #111111; }
    .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border: 2px solid #111111; box-shadow: 4px 4px 0px #111111; padding: 32px; }
    .badge { display: inline-block; background-color: #E2F952; color: #111111; border: 1px solid #111111; padding: 4px 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; }
    h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 16px 0; letter-spacing: -0.5px; }
    p { font-size: 13px; line-height: 1.6; margin: 0 0 16px 0; color: #333333; }
    .btn { display: inline-block; background: #111111; color: #E2F952; text-decoration: none; padding: 12px 24px; font-weight: bold; text-transform: uppercase; font-size: 12px; border: 2px solid #111111; margin: 16px 0; }
    .footer { font-size: 11px; color: #888888; border-top: 1px solid #EEEEEE; padding-top: 16px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Security & Access Control</div>
    <h1>THE TOYZ DEPT<span style="color: #FF5C35;">.</span></h1>
    <p>Hello <strong>${userFirstName}</strong>,</p>
    <p>We received a statutory request to reset the login password for your customer account at <strong>thetoyzdept.in</strong>.</p>
    <p>Click the button below to configure your new credentials securely:</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn" style="color: #E2F952;">Reset My Password</a>
    </div>
    <p style="font-size: 11px; color: #666666;">Or copy and paste this link into your browser:</p>
    <p style="font-size: 10px; word-break: break-all; color: #666666; background: #F8F5EE; padding: 8px; border: 1px solid #DDD;">${resetUrl}</p>
    <p style="font-size: 11px; color: #888888;">This security link expires in <strong>60 minutes</strong>. If you did not initiate this request, no action is needed; your current password remains safe.</p>
    <div class="footer">
      THE TOYZ DEPT. • MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, KA 582101, India<br>
      Consumer Protection (E-Commerce) Rules, 2020 & IT Act 2000 Compliant
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html, text };
}

export function buildOrderConfirmationEmail(
  order: any,
  items: any[]
): { subject: string; html: string; text: string } {
  const subject = `Order Confirmed #${order.order_number} ⚡ — THE TOYZ DEPT.`;
  const itemsText = items
    .map(
      (it) =>
        `- ${it.product_name || "Drop"}${it.variant_name ? ` (${it.variant_name})` : ""} x${it.quantity} — ₹${((it.unit_price * it.quantity) / 100).toFixed(2)}`
    )
    .join("\n");

  const text = `Yo ${order.shipping_name || "Collector"}!\n\nYour order #${order.order_number} is locked in and paid. We are queueing your drops on our 3D print beds in Bengaluru/Gadag.\n\nOrder Items:\n${itemsText}\n\nTotal Paid: ₹${(order.total_amount / 100).toFixed(2)}\n\nTrack your drop live at:\nhttps://thetoyzdept.in/track-order?ref=${order.order_number}\n\n— THE TOYZ DEPT. Studio`;

  const itemsHtml = items
    .map(
      (it) => `
    <tr>
      <td style="padding: 10px 0; border-bottom: 1px solid #EEEEEE; font-size: 13px;">
        <strong>${it.product_name || "3D Drop"}</strong>
        ${it.variant_name ? `<br><span style="font-size: 11px; color: #666666;">Edition: ${it.variant_name}</span>` : ""}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #EEEEEE; font-size: 13px; text-align: center;">
        x${it.quantity}
      </td>
      <td style="padding: 10px 0; border-bottom: 1px solid #EEEEEE; font-size: 13px; text-align: right; font-weight: bold;">
        ₹${((it.unit_price * it.quantity) / 100).toFixed(2)}
      </td>
    </tr>
  `
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Space Grotesk", "Segoe UI", Roboto, monospace; background-color: #F8F5EE; margin: 0; padding: 24px; color: #191919; }
    .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border: 2px solid #191919; box-shadow: 5px 5px 0px #191919; padding: 32px; }
    .badge { display: inline-block; background-color: #D9FF43; color: #191919; border: 1px solid #191919; padding: 4px 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; }
    h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: -0.5px; }
    p { font-size: 13px; line-height: 1.6; margin: 0 0 16px 0; color: #333333; }
    .btn { display: inline-block; background: #191919; color: #D9FF43 !important; text-decoration: none; padding: 12px 24px; font-weight: bold; text-transform: uppercase; font-size: 12px; border: 2px solid #191919; box-shadow: 3px 3px 0px #191919; }
    .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .footer { font-size: 11px; color: #888888; border-top: 1px solid #EEEEEE; padding-top: 16px; margin-top: 24px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Payment Verified // Print Bed Queued</div>
    <h1>THE TOYZ DEPT<span style="color: #FF694B;">.</span></h1>
    <p>Yo <strong>${order.shipping_name || "Collector"}</strong>,</p>
    <p>Your drop <strong>#${order.order_number}</strong> is confirmed. Our print farm is spinning up toolpaths in 0.12mm high-precision FDM.</p>

    <table class="items-table">
      <thead>
        <tr style="border-bottom: 2px solid #191919; font-size: 11px; text-transform: uppercase; color: #666666;">
          <th style="text-align: left; padding-bottom: 6px;">Drop</th>
          <th style="text-align: center; padding-bottom: 6px;">Qty</th>
          <th style="text-align: right; padding-bottom: 6px;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top: 12px; font-weight: bold; text-transform: uppercase; font-size: 13px;">Total Paid (Net Final)</td>
          <td style="padding-top: 12px; font-weight: 900; text-align: right; font-size: 16px; color: #191919;">₹${(order.total_amount / 100).toFixed(2)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="background: #F8F5EE; border: 1px solid #191919; padding: 12px; margin: 16px 0; font-family: monospace; font-size: 11px;">
      <strong>Shipping To:</strong><br>
      ${order.shipping_name}<br>
      ${order.shipping_address_1}${order.shipping_address_2 ? `, ${order.shipping_address_2}` : ""}<br>
      ${order.shipping_city}, ${order.shipping_state} — ${order.shipping_postal_code}
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="https://thetoyzdept.in/track-order?ref=${order.order_number}" class="btn">
        Track Your Drop Live ⚡
      </a>
    </div>

    <div class="footer">
      THE TOYZ DEPT. • MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, KA 582101, India<br>
      Razorpay Verified • Express Pan-India Delivery via Shiprocket Network
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html, text };
}

export function buildShipmentDispatchedEmail(
  order: any,
  awbCode: string,
  courierName: string,
  trackingUrl: string
): { subject: string; html: string; text: string } {
  const subject = `Your Drop Has Shipped! #${order.order_number} 🚀 — THE TOYZ DEPT.`;
  const text = `Yo ${order.shipping_name || "Collector"}!\n\nYour 3D prints for order #${order.order_number} just passed QC inspection and are handed to ${courierName}!\n\nAir Waybill (AWB): ${awbCode}\nTracking URL: ${trackingUrl}\n\n— THE TOYZ DEPT. Studio`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Space Grotesk", "Segoe UI", Roboto, monospace; background-color: #F8F5EE; margin: 0; padding: 24px; color: #191919; }
    .container { max-width: 540px; margin: 0 auto; background: #FFFFFF; border: 2px solid #191919; box-shadow: 5px 5px 0px #191919; padding: 32px; }
    .badge { display: inline-block; background-color: #FF694B; color: #FFFFFF; border: 1px solid #191919; padding: 4px 8px; font-size: 11px; font-weight: bold; text-transform: uppercase; margin-bottom: 12px; }
    h1 { font-size: 24px; font-weight: 900; text-transform: uppercase; margin: 0 0 8px 0; letter-spacing: -0.5px; }
    p { font-size: 13px; line-height: 1.6; margin: 0 0 16px 0; color: #333333; }
    .btn { display: inline-block; background: #191919; color: #D9FF43 !important; text-decoration: none; padding: 12px 24px; font-weight: bold; text-transform: uppercase; font-size: 12px; border: 2px solid #191919; box-shadow: 3px 3px 0px #191919; }
    .footer { font-size: 11px; color: #888888; border-top: 1px solid #EEEEEE; padding-top: 16px; margin-top: 24px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="container">
    <div class="badge">Dispatched // En Route</div>
    <h1>THE TOYZ DEPT<span style="color: #FF694B;">.</span></h1>
    <p>Yo <strong>${order.shipping_name || "Collector"}</strong>,</p>
    <p>Good news: your tactile drop <strong>#${order.order_number}</strong> has cleared quality inspection, packed with protective padding, and handed over to <strong>${courierName}</strong>!</p>

    <div style="background: #F8F5EE; border: 2px solid #191919; padding: 16px; margin: 18px 0; font-family: monospace; font-size: 12px;">
      <p style="margin: 0 0 6px 0;"><strong>Courier:</strong> ${courierName}</p>
      <p style="margin: 0 0 6px 0;"><strong>Air Waybill (AWB):</strong> ${awbCode}</p>
      <p style="margin: 0;"><strong>Status:</strong> Dispatched from Gadag Studio Hub</p>
    </div>

    <div style="text-align: center; margin: 24px 0;">
      <a href="${trackingUrl}" class="btn">
        Track Package Live on Courier Radar →
      </a>
    </div>

    <p style="font-size: 11px; color: #666666;">You can also check live telemetry anytime on our website using your order number.</p>

    <div class="footer">
      THE TOYZ DEPT. • MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, KA 582101, India<br>
      Shiprocket Partner Network (Delhivery, BlueDart, DTDC Express)
    </div>
  </div>
</body>
</html>
  `;

  return { subject, html, text };
}
