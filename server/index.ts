import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env, Variables } from "./types";
import { authMiddleware } from "./auth";
import { authRouter } from "./routes/auth";
import { productsRouter } from "./routes/products";
import { cartRouter } from "./routes/cart";
import { checkoutRouter } from "./routes/checkout";
import { customRequestsRouter } from "./routes/custom-requests";
import { customerRouter } from "./routes/customer";
import { adminRouter } from "./routes/admin";
import { razorpayRouter } from "./routes/razorpay";
import { shippingRouter } from "./routes/shiprocket";
import { complianceRouter } from "./routes/compliance";
import { aiRouter } from "./routes/ai";
import { seoRouter } from "./routes/seo";

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Canonical Hostname Enforcement: Redirect www.thetoyzdept.in -> thetoyzdept.in
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  if (url.hostname === "www.thetoyzdept.in") {
    url.hostname = "thetoyzdept.in";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// Trust & Safety Security Headers Middleware (Lighthouse Best Practices & OWASP)
app.use("*", async (c, next) => {
  await next();
  c.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "SAMEORIGIN");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
  c.header("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  c.header(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://thetoyzdept.in https://api.razorpay.com https://accounts.google.com https://www.googleapis.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com; object-src 'none'; base-uri 'self';"
  );
});

// CORS configuration for local development and production
app.use(
  "*",
  cors({
    origin: (origin) => origin || "*",
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Razorpay-Signature"],
  })
);

// Global Authentication Middleware
app.use("*", authMiddleware);

// Health check endpoint
app.get("/api/health", async (c) => {
  let dbStatus = "ok";
  let r2Status = "ok";

  try {
    await c.env.DB.prepare("SELECT 1").first();
  } catch (err: any) {
    dbStatus = "error: " + err.message;
  }

  if (!c.env.R2_BUCKET) {
    r2Status = "not_bound (local mock)";
  }

  return c.json({
    status: "ok",
    brand: "THE TOYZ DEPT.",
    tagline: "THINGS YOU DIDN'T KNOW YOU NEEDED.",
    domain: "https://thetoyzdept.in",
    environment: c.env.ENVIRONMENT || "development",
    timestamp: new Date().toISOString(),
    services: {
      d1: dbStatus,
      r2: r2Status,
    },
  });
});

// Mount modular sub-routers
app.route("/api/auth", authRouter);
app.route("/api", productsRouter); // mounts /api/products & /api/categories
app.route("/api/cart", cartRouter);
app.route("/api/checkout", checkoutRouter);
app.route("/api", razorpayRouter); // Mounts /api/create-order & /api/verify-payment
app.route("/api/custom-requests", customRequestsRouter);
app.route("/api/customer", customerRouter);
app.route("/api/admin", adminRouter);
app.route("/api/shipping", shippingRouter);
app.route("/api", complianceRouter); // Mounts /api/contact, /api/grievance, /api/business-profile
app.route("/api/ai", aiRouter); // Mounts /api/ai/chat, /api/ai/survey-spark, /api/ai/admin/survey-insights
app.route("/", seoRouter); // Mounts /sitemap.xml and /robots.txt

// Direct Webhook aliases for external payment & logistics gateways
app.post("/api/webhooks/razorpay", async (c) => {
  const url = new URL("/webhooks/razorpay", c.req.url);
  return checkoutRouter.fetch(new Request(url.toString(), c.req.raw), c.env, c.executionCtx);
});

app.post("/api/webhooks/shiprocket", async (c) => {
  const url = new URL("/webhook", c.req.url);
  return shippingRouter.fetch(new Request(url.toString(), c.req.raw), c.env, c.executionCtx);
});

// Public R2 Asset Streaming Endpoint
app.get("/api/assets/:key{.+}", async (c) => {
  const key = c.req.param("key");
  if (!c.env.R2_BUCKET) {
    return c.json({ error: "Storage not configured" }, 500);
  }

  const object = await c.env.R2_BUCKET.get(key);
  if (!object) {
    return c.notFound();
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers as any);
  headers.set("etag", object.httpEtag);
  headers.set("Cache-Control", "public, max-age=31536000, immutable");

  return c.body(object.body as any, { headers });
});

// Cloudflare Workers Static Assets Fallback
// In production, when the route is not an API call, serve the compiled SPA with security headers
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    const assetRes = await c.env.ASSETS.fetch(c.req.raw);
    const newHeaders = new Headers(assetRes.headers);
    newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    newHeaders.set(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com https://accounts.google.com https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://thetoyzdept.in https://api.razorpay.com https://accounts.google.com https://www.googleapis.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://accounts.google.com; object-src 'none'; base-uri 'self';"
    );
    return new Response(assetRes.body, {
      status: assetRes.status,
      statusText: assetRes.statusText,
      headers: newHeaders,
    });
  }
  return c.text("THE TOYZ DEPT. API Server Running. Start frontend with `npm run dev`.", 200);
});

export default app;
