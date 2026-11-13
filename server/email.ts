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
