import { Hono } from "hono";
import { z } from "zod";
import type { Env, Variables } from "../types";
import { requireAuth } from "../auth";

export const customerRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// All customer routes require authentication
customerRouter.use("*", requireAuth);

// GET /api/customer/profile
customerRouter.get("/profile", async (c) => {
  const user = c.get("user")!;
  const profile = await c.env.DB
    .prepare("SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?")
    .bind(user.userId)
    .first<any>();

  return c.json({ profile });
});

// PUT /api/customer/profile
customerRouter.put("/profile", async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  const schema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid data", details: parsed.error.flatten() }, 400);
  }

  await c.env.DB
    .prepare("UPDATE users SET first_name = ?, last_name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(parsed.data.firstName, parsed.data.lastName, parsed.data.phone || null, user.userId)
    .run();

  return c.json({ message: "Profile updated successfully." });
});

// GET /api/customer/orders
customerRouter.get("/orders", async (c) => {
  const user = c.get("user")!;
  const orders = await c.env.DB
    .prepare(`
      SELECT 
        o.id, o.order_number, o.status, o.total_amount, o.subtotal, o.shipping_cost,
        o.discount_amount, o.tracking_number, o.tracking_url, o.shipped_at, o.delivered_at,
        o.created_at,
        (SELECT COUNT(id) FROM order_items WHERE order_id = o.id) as item_count,
        (SELECT product_name FROM order_items WHERE order_id = o.id LIMIT 1) as first_item_name,
        p.status as payment_status, p.method as payment_method
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC
    `)
    .bind(user.userId)
    .all<any>();

  return c.json({ orders: orders.results || [] });
});

// GET /api/customer/orders/:id
customerRouter.get("/orders/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  const order = await c.env.DB
    .prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?")
    .bind(id, user.userId)
    .first<any>();

  if (!order) {
    return c.json({ error: "Order not found" }, 404);
  }

  const items = await c.env.DB
    .prepare(`
      SELECT 
        oi.*,
        p.slug as product_slug,
        (SELECT url FROM product_images WHERE product_id = oi.product_id AND is_primary = 1 LIMIT 1) as product_image
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `)
    .bind(id)
    .all<any>();

  const history = await c.env.DB
    .prepare("SELECT to_status, note, created_at FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC")
    .bind(id)
    .all();

  const payment = await c.env.DB
    .prepare("SELECT razorpay_order_id, razorpay_payment_id, amount, status, method, created_at FROM payments WHERE order_id = ?")
    .bind(id)
    .first<any>();

  return c.json({
    order: {
      ...order,
      items: items.results || [],
      history: history.results || [],
      payment: payment || null,
    },
  });
});

// GET /api/customer/addresses
customerRouter.get("/addresses", async (c) => {
  const user = c.get("user")!;
  const addresses = await c.env.DB
    .prepare("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC")
    .bind(user.userId)
    .all<any>();

  return c.json({ addresses: addresses.results || [] });
});

// POST /api/customer/addresses
customerRouter.post("/addresses", async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();

  const schema = z.object({
    label: z.string().default("Home"),
    fullName: z.string().min(1),
    phone: z.string().min(10),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(5),
    country: z.string().default("India"),
    isDefault: z.boolean().default(false),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid data", details: parsed.error.flatten() }, 400);
  }

  const data = parsed.data;
  const addressId = "addr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  if (data.isDefault) {
    await c.env.DB.prepare("UPDATE addresses SET is_default = 0 WHERE user_id = ?").bind(user.userId).run();
  }

  await c.env.DB
    .prepare(`
      INSERT INTO addresses (id, user_id, label, full_name, phone, address_line_1, address_line_2, city, state, postal_code, country, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      addressId, user.userId, data.label, data.fullName, data.phone,
      data.addressLine1, data.addressLine2 || null, data.city, data.state,
      data.postalCode, data.country, data.isDefault ? 1 : 0
    )
    .run();

  return c.json({ message: "Address saved", addressId }, 201);
});

// DELETE /api/customer/addresses/:id
customerRouter.delete("/addresses/:id", async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  await c.env.DB
    .prepare("DELETE FROM addresses WHERE id = ? AND user_id = ?")
    .bind(id, user.userId)
    .run();

  return c.json({ message: "Address deleted" });
});

// GET /api/customer/wishlist
customerRouter.get("/wishlist", async (c) => {
  const user = c.get("user")!;

  const items = await c.env.DB
    .prepare(`
      SELECT 
        w.id as wishlist_id, w.created_at as added_at,
        p.id, p.name, p.slug, p.base_price, p.compare_price, p.material,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `)
    .bind(user.userId)
    .all<any>();

  return c.json({ wishlist: items.results || [] });
});

// POST /api/customer/wishlist/:productId
customerRouter.post("/wishlist/:productId", async (c) => {
  const user = c.get("user")!;
  const productId = c.req.param("productId");
  const id = "wsh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  await c.env.DB
    .prepare("INSERT OR IGNORE INTO wishlist_items (id, user_id, product_id) VALUES (?, ?, ?)")
    .bind(id, user.userId, productId)
    .run();

  return c.json({ message: "Added to wishlist" });
});

// DELETE /api/customer/wishlist/:productId
customerRouter.delete("/wishlist/:productId", async (c) => {
  const user = c.get("user")!;
  const productId = c.req.param("productId");

  await c.env.DB
    .prepare("DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?")
    .bind(user.userId, productId)
    .run();

  return c.json({ message: "Removed from wishlist" });
});

// POST /api/customer/reviews
customerRouter.post("/reviews", async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();

  const schema = z.object({
    productId: z.string(),
    orderId: z.string().optional(),
    rating: z.number().int().min(1).max(5),
    title: z.string().min(1),
    body: z.string().min(5),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid review", details: parsed.error.flatten() }, 400);
  }

  const { productId, orderId, rating, title, body: reviewBody } = parsed.data;

  // Check if verified buyer
  let isVerified = false;
  if (orderId) {
    const verifiedOrder = await c.env.DB
      .prepare(`
        SELECT o.id FROM orders o
        JOIN order_items oi ON oi.order_id = o.id
        WHERE o.id = ? AND o.user_id = ? AND oi.product_id = ? AND o.status IN ('delivered', 'shipped', 'payment_confirmed')
      `)
      .bind(orderId, user.userId, productId)
      .first();

    if (verifiedOrder) isVerified = true;
  }

  const reviewId = "rev_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

  await c.env.DB
    .prepare(`
      INSERT INTO reviews (id, product_id, user_id, order_id, rating, title, body, is_verified, is_approved)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `)
    .bind(reviewId, productId, user.userId, orderId || null, rating, title, reviewBody, isVerified ? 1 : 0)
    .run();

  return c.json({ message: "Review submitted successfully!", reviewId }, 201);
});
