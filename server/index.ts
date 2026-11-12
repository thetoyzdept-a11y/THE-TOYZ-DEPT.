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

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

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
// In production, when the route is not an API call, serve the compiled SPA
app.all("*", async (c) => {
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(c.req.raw);
  }
  return c.text("THE TOYZ DEPT. API Server Running. Start frontend with `npm run dev`.", 200);
});

export default app;
