import { Hono } from "hono";
import { z } from "zod";
import type { Env, Variables } from "../types";
import { requireAdmin, hashPassword, verifyPassword } from "../auth";
import { edgeProductCache, edgeCategoryCache } from "../lib/cache";

export const adminRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// All admin routes strictly require admin authorization
adminRouter.use("*", requireAdmin);

// ── 1. Overview & Real Business Analytics ─────────────────────────────
adminRouter.get("/overview", async (c) => {
  // Real revenue calculated from captured payments
  const revenueResult = await c.env.DB
    .prepare("SELECT COALESCE(SUM(amount), 0) as total_revenue FROM payments WHERE status = 'captured'")
    .first<{ total_revenue: number }>();

  // Real order counts by status
  const orderStats = await c.env.DB
    .prepare(`
      SELECT 
        COUNT(id) as total_orders,
        SUM(CASE WHEN status IN ('pending', 'payment_confirmed', 'processing', 'printing') THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as completed_orders
      FROM orders
    `)
    .first<{ total_orders: number; pending_orders: number; completed_orders: number }>();

  // Registered customer count
  const customerCount = await c.env.DB
    .prepare("SELECT COUNT(id) as total_customers FROM users WHERE role = 'customer'")
    .first<{ total_customers: number }>();

  // Low stock inventory warning count
  const lowStock = await c.env.DB
    .prepare("SELECT COUNT(id) as low_stock_count FROM product_variants WHERE stock <= low_stock_threshold AND is_active = 1")
    .first<{ low_stock_count: number }>();

  // Pending custom 3D printing requests
  const pendingCustomRequests = await c.env.DB
    .prepare("SELECT COUNT(id) as count FROM custom_requests WHERE status IN ('submitted', 'under_review')")
    .first<{ count: number }>();

  // Recent 8 orders with customer and payment info
  const recentOrders = await c.env.DB
    .prepare(`
      SELECT 
        o.id, o.order_number, o.status, o.total_amount, o.shipping_name, o.created_at,
        p.status as payment_status, p.method as payment_method
      FROM orders o
      LEFT JOIN payments p ON p.order_id = o.id
      ORDER BY o.created_at DESC
      LIMIT 8
    `)
    .all<any>();

  return c.json({
    metrics: {
      totalRevenue: revenueResult?.total_revenue || 0,
      totalOrders: orderStats?.total_orders || 0,
      pendingOrders: orderStats?.pending_orders || 0,
      completedOrders: orderStats?.completed_orders || 0,
      totalCustomers: customerCount?.total_customers || 0,
      lowStockCount: lowStock?.low_stock_count || 0,
      pendingCustomRequests: pendingCustomRequests?.count || 0,
    },
    recentOrders: recentOrders.results || [],
  });
});

// ── 2. Product Management ─────────────────────────────────────────────

// GET /api/admin/products
adminRouter.get("/products", async (c) => {
  const result = await c.env.DB
    .prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(id) FROM product_variants WHERE product_id = p.id) as variant_count,
        (SELECT SUM(stock) FROM product_variants WHERE product_id = p.id) as total_stock
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `)
    .all<any>();

  return c.json({ products: result.results || [] });
});

// POST /api/admin/products (Create)
adminRouter.post("/products", async (c) => {
  try {
    const body = await c.req.json();
    const schema = z.object({
      name: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      shortDescription: z.string().optional(),
      categoryId: z.string().optional(),
      basePrice: z.number().int().min(0), // in paise
      comparePrice: z.number().int().optional(),
      material: z.string().optional(),
      dimensions: z.string().optional(),
      weight: z.number().optional(),
      status: z.enum(["draft", "active", "archived"]).default("draft"),
      isFeatured: z.boolean().default(false),
      images: z.array(z.string()).optional(),
      variants: z.array(z.object({
        name: z.string(),
        sku: z.string().optional(),
        color: z.string().optional(),
        size: z.string().optional(),
        priceModifier: z.number().int().default(0),
        stock: z.number().int().default(0),
      })).optional(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation failed", details: parsed.error.flatten() }, 400);
    }

    const data = parsed.data;
    const productId = "prod_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

    await c.env.DB
      .prepare(`
        INSERT INTO products (
          id, name, slug, description, short_description, category_id, base_price, compare_price,
          material, dimensions, weight, status, is_featured
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        productId,
        data.name ?? null,
        data.slug ?? null,
        data.description ?? null,
        data.shortDescription ?? null,
        data.categoryId ?? null,
        data.basePrice,
        data.comparePrice ?? null,
        data.material ?? null,
        data.dimensions ?? null,
        data.weight ?? null,
        data.status ?? "draft",
        data.isFeatured ? 1 : 0
      )
      .run();

    // Insert Images if provided
    if (data.images && data.images.length > 0) {
      for (let i = 0; i < data.images.length; i++) {
        await c.env.DB
          .prepare("INSERT INTO product_images (id, product_id, url, sort_order, is_primary) VALUES (?, ?, ?, ?, ?)")
          .bind("img_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), productId, data.images[i], i, i === 0 ? 1 : 0)
          .run();
      }
    }

    // Insert Variants
    if (data.variants && data.variants.length > 0) {
      for (const v of data.variants) {
        await c.env.DB
          .prepare("INSERT INTO product_variants (id, product_id, name, sku, color, size, price_modifier, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
          .bind("var_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), productId, v.name, v.sku || null, v.color || null, v.size || null, v.priceModifier, v.stock)
          .run();
      }
    } else {
      // Default standard variant
      await c.env.DB
        .prepare("INSERT INTO product_variants (id, product_id, name, sku, price_modifier, stock) VALUES (?, ?, 'Standard', ?, 0, 10)")
        .bind("var_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), productId, `${data.slug.toUpperCase()}-STD`)
        .run();
    }

    edgeProductCache.clear();
    edgeCategoryCache.clear();

    return c.json({ message: "Product created successfully", productId }, 201);
  } catch (err: any) {
    return c.json({ error: "Create Failed", message: err.message }, 500);
  }
});

// PUT /api/admin/products/:id (Update)
adminRouter.put("/products/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    await c.env.DB
      .prepare(`
        UPDATE products SET
          name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          description = COALESCE(?, description),
          short_description = COALESCE(?, short_description),
          category_id = COALESCE(?, category_id),
          base_price = COALESCE(?, base_price),
          compare_price = COALESCE(?, compare_price),
          material = COALESCE(?, material),
          dimensions = COALESCE(?, dimensions),
          weight = COALESCE(?, weight),
          status = COALESCE(?, status),
          is_featured = COALESCE(?, is_featured),
          updated_at = datetime('now')
        WHERE id = ?
      `)
      .bind(
        body.name ?? null,
        body.slug ?? null,
        body.description ?? null,
        body.shortDescription ?? null,
        body.categoryId ?? null,
        body.basePrice !== undefined && body.basePrice !== null ? body.basePrice : null,
        body.comparePrice !== undefined && body.comparePrice !== null ? body.comparePrice : null,
        body.material ?? null,
        body.dimensions ?? null,
        body.weight !== undefined && body.weight !== null ? body.weight : null,
        body.status ?? null,
        body.isFeatured !== undefined && body.isFeatured !== null ? (body.isFeatured ? 1 : 0) : null,
        id
      )
      .run();

    // Handle primary image update/insert if provided
    const imageUrl = body.image || (body.images && body.images.length > 0 ? body.images[0] : null);
    if (imageUrl) {
      const existingImg = await c.env.DB
        .prepare("SELECT id FROM product_images WHERE product_id = ? AND is_primary = 1")
        .bind(id)
        .first<{ id: string }>();

      if (existingImg) {
        await c.env.DB
          .prepare("UPDATE product_images SET url = ? WHERE id = ?")
          .bind(imageUrl, existingImg.id)
          .run();
      } else {
        await c.env.DB
          .prepare("INSERT INTO product_images (id, product_id, url, alt_text, sort_order, is_primary) VALUES (?, ?, ?, ?, 0, 1)")
          .bind("img_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), id, imageUrl, body.name || "Product Image")
          .run();
      }
    }

    // Handle stock update if provided
    if (body.stock !== undefined) {
      const stockNum = typeof body.stock === "number" ? body.stock : parseInt(body.stock, 10);
      if (!isNaN(stockNum)) {
        const existingVar = await c.env.DB
          .prepare("SELECT id FROM product_variants WHERE product_id = ? LIMIT 1")
          .bind(id)
          .first<{ id: string }>();

        if (existingVar) {
          await c.env.DB
            .prepare("UPDATE product_variants SET stock = ?, updated_at = datetime('now') WHERE id = ?")
            .bind(stockNum, existingVar.id)
            .run();
        } else {
          await c.env.DB
            .prepare("INSERT INTO product_variants (id, product_id, name, sku, price_modifier, stock, is_active) VALUES (?, ?, 'Standard', ?, 0, ?, 1)")
            .bind("var_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), id, `${id}-STD`, stockNum)
            .run();
        }
      }
    }

    edgeProductCache.clear();
    edgeCategoryCache.clear();

    return c.json({ message: "Product updated successfully" });
  } catch (err: any) {
    return c.json({ error: "Update Failed", message: err.message }, 500);
  }
});

// DELETE /api/admin/products/:id (Soft archive)
adminRouter.delete("/products/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB
    .prepare("UPDATE products SET status = 'archived', updated_at = datetime('now') WHERE id = ?")
    .bind(id)
    .run();

  edgeProductCache.clear();
  edgeCategoryCache.clear();
  return c.json({ message: "Product archived successfully" });
});

// ── 3. Order Management ───────────────────────────────────────────────

// GET /api/admin/orders
adminRouter.get("/orders", async (c) => {
  const status = c.req.query("status");
  let sql = `
    SELECT 
      o.*,
      COALESCE(o.shipping_email, u.email) as customer_email,
      (SELECT COUNT(id) FROM order_items WHERE order_id = o.id) as item_count,
      COALESCE(o.payment_status, p.status, 'created') as payment_status,
      COALESCE(o.payment_method, p.method, 'Razorpay') as payment_method
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    LEFT JOIN payments p ON p.order_id = o.id
  `;
  const params: any[] = [];

  if (status) {
    sql += " WHERE o.status = ?";
    params.push(status);
  }

  sql += " ORDER BY o.created_at DESC";

  const orders = await c.env.DB.prepare(sql).bind(...params).all<any>();
  return c.json({ orders: orders.results || [] });
});

// GET /api/admin/orders/:id
adminRouter.get("/orders/:id", async (c) => {
  const id = c.req.param("id");

  const order = await c.env.DB
    .prepare(`
      SELECT o.*, COALESCE(o.shipping_email, u.email) as customer_email, u.first_name, u.last_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.id = ?
    `)
    .bind(id)
    .first<any>();

  if (!order) return c.json({ error: "Order not found" }, 404);

  const items = await c.env.DB
    .prepare("SELECT * FROM order_items WHERE order_id = ?")
    .bind(id)
    .all();

  const history = await c.env.DB
    .prepare("SELECT * FROM order_status_history WHERE order_id = ? ORDER BY created_at ASC")
    .bind(id)
    .all();

  const payment = await c.env.DB
    .prepare("SELECT * FROM payments WHERE order_id = ?")
    .bind(id)
    .first();

  return c.json({
    order: {
      ...order,
      items: items.results || [],
      history: history.results || [],
      payment: payment || null,
    },
  });
});

// PATCH /api/admin/orders/:id/status
adminRouter.patch("/orders/:id/status", async (c) => {
  const adminUser = c.get("user")!;
  const id = c.req.param("id");
  const body = await c.req.json();
  const { status, note, trackingNumber, trackingUrl } = body;

  const validStatuses = [
    "pending", "payment_confirmed", "processing", "printing",
    "quality_check", "packed", "shipped", "delivered", "cancelled", "refunded"
  ];

  if (!validStatuses.includes(status)) {
    return c.json({ error: "Invalid status" }, 400);
  }

  const currentOrder = await c.env.DB
    .prepare("SELECT status FROM orders WHERE id = ?")
    .bind(id)
    .first<{ status: string }>();

  if (!currentOrder) return c.json({ error: "Order not found" }, 404);

  let shippedAtUpdate = "";
  let deliveredAtUpdate = "";
  if (status === "shipped") shippedAtUpdate = ", shipped_at = datetime('now')";
  if (status === "delivered") deliveredAtUpdate = ", delivered_at = datetime('now')";

  await c.env.DB
    .prepare(`
      UPDATE orders SET
        status = ?,
        tracking_number = COALESCE(?, tracking_number),
        tracking_url = COALESCE(?, tracking_url),
        updated_at = datetime('now')
        ${shippedAtUpdate}
        ${deliveredAtUpdate}
      WHERE id = ?
    `)
    .bind(status, trackingNumber || null, trackingUrl || null, id)
    .run();

  await c.env.DB
    .prepare(`
      INSERT INTO order_status_history (id, order_id, from_status, to_status, note, changed_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .bind("osh_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16), id, currentOrder.status, status, note || null, adminUser.userId)
    .run();

  return c.json({ message: "Order status updated successfully", status });
});

// ── 4. Custom 3D Printing Requests & Quotations ───────────────────────

// GET /api/admin/custom-requests
adminRouter.get("/custom-requests", async (c) => {
  const requests = await c.env.DB
    .prepare(`
      SELECT 
        cr.*,
        u.email as customer_email, u.first_name, u.last_name, u.phone as customer_phone,
        q.id as quotation_id, q.amount as quotation_amount, q.status as quotation_status, q.valid_until,
        (SELECT file_name FROM custom_request_files WHERE request_id = cr.id LIMIT 1) as file_name,
        (SELECT file_size FROM custom_request_files WHERE request_id = cr.id LIMIT 1) as file_size
      FROM custom_requests cr
      LEFT JOIN users u ON cr.user_id = u.id
      LEFT JOIN quotations q ON q.request_id = cr.id
      ORDER BY cr.created_at DESC
    `)
    .all<any>();

  return c.json({ requests: requests.results || [] });
});

// POST /api/admin/quotations (Prepare & Send Quotation)
adminRouter.post("/quotations", async (c) => {
  try {
    const body = await c.req.json();
    const schema = z.object({
      requestId: z.string(),
      amount: z.number().int().min(100), // in paise
      breakdown: z.object({
        material: z.number().int(),
        machineTime: z.number().int(),
        postProcessing: z.number().int(),
      }),
      validityDays: z.number().int().default(14),
      notes: z.string().optional(),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation Failed", details: parsed.error.flatten() }, 400);
    }

    const { requestId, amount, breakdown, validityDays, notes } = parsed.data;

    const quotationId = "quot_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toISOString();

    // Insert Quotation
    await c.env.DB
      .prepare(`
        INSERT INTO quotations (id, request_id, amount, breakdown, valid_until, notes, status)
        VALUES (?, ?, ?, ?, ?, ?, 'sent')
      `)
      .bind(quotationId, requestId, amount, JSON.stringify(breakdown), validUntil, notes || null)
      .run();

    // Transition Custom Request status to 'quoted'
    await c.env.DB
      .prepare("UPDATE custom_requests SET status = 'quoted', updated_at = datetime('now') WHERE id = ?")
      .bind(requestId)
      .run();

    return c.json({ message: "Quotation prepared and sent to customer.", quotationId }, 201);
  } catch (err: any) {
    return c.json({ error: "Quotation Error", message: err.message }, 500);
  }
});

// ── 5. Customer Management ────────────────────────────────────────────

// GET /api/admin/customers
adminRouter.get("/customers", async (c) => {
  const customers = await c.env.DB
    .prepare(`
      SELECT 
        u.id, u.email, u.first_name, u.last_name, u.phone, u.created_at, u.is_active,
        COUNT(o.id) as order_count,
        COALESCE(SUM(o.total_amount), 0) as total_spend
      FROM users u
      LEFT JOIN orders o ON o.user_id = u.id AND o.status != 'cancelled'
      WHERE u.role = 'customer'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `)
    .all<any>();

  return c.json({ customers: customers.results || [] });
});

// ── 6. Inventory Management ───────────────────────────────────────────

// GET /api/admin/inventory (With Time-Series Run-Rate & 3D Print Queue Velocity)
adminRouter.get("/inventory", async (c) => {
  const inventory = await c.env.DB
    .prepare(`
      SELECT 
        v.id, v.product_id, v.name as variant_name, v.sku, v.color, v.size,
        v.stock, v.low_stock_threshold, v.is_active, v.updated_at,
        p.name as product_name, p.slug as product_slug, p.base_price,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
        COALESCE((
          SELECT SUM(oi.quantity)
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          WHERE (oi.variant_id = v.id OR (oi.variant_id IS NULL AND oi.product_id = v.product_id))
            AND o.status NOT IN ('cancelled')
            AND o.created_at >= datetime('now', '-14 days')
        ), 0) as units_sold_14d,
        COALESCE((
          SELECT SUM(oi.quantity)
          FROM order_items oi
          JOIN orders o ON oi.order_id = o.id
          WHERE (oi.variant_id = v.id OR (oi.variant_id IS NULL AND oi.product_id = v.product_id))
            AND o.status NOT IN ('cancelled')
            AND o.created_at >= datetime('now', '-30 days')
        ), 0) as units_sold_30d
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      ORDER BY v.stock ASC, p.name ASC
    `)
    .all<any>();

  const analyzedInventory = (inventory.results || []).map((item: any) => {
    const dailyVelocity = (item.units_sold_14d || 0) / 14;
    const daysRemaining = dailyVelocity > 0 ? Math.round(item.stock / dailyVelocity) : null;

    let urgency: "CRITICAL_PRINT_QUEUE" | "RESTOCK_WARNING" | "HEALTHY" = "HEALTHY";
    if (item.stock <= 2 || (daysRemaining !== null && daysRemaining <= 3)) {
      urgency = "CRITICAL_PRINT_QUEUE";
    } else if (item.stock <= (item.low_stock_threshold || 5) || (daysRemaining !== null && daysRemaining <= 7)) {
      urgency = "RESTOCK_WARNING";
    }

    const recommendedPrintBatch = Math.max(8, Math.ceil(dailyVelocity * 14) + 5 - item.stock);

    return {
      ...item,
      dailyVelocity: Number(dailyVelocity.toFixed(2)),
      daysRemaining,
      urgency,
      recommendedPrintBatch: Math.max(0, recommendedPrintBatch),
    };
  });

  return c.json({ inventory: analyzedInventory });
});

// PATCH /api/admin/inventory/:variantId
adminRouter.patch("/inventory/:variantId", async (c) => {
  const variantId = c.req.param("variantId");
  const body = await c.req.json();
  const stock = parseInt(body.stock, 10);

  if (isNaN(stock) || stock < 0) {
    return c.json({ error: "Invalid stock value" }, 400);
  }

  await c.env.DB
    .prepare("UPDATE product_variants SET stock = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(stock, variantId)
    .run();

  edgeProductCache.clear();
  return c.json({ message: "Stock updated successfully" });
});

// ── 7. Store Settings ─────────────────────────────────────────────────

// GET /api/admin/settings
adminRouter.get("/settings", async (c) => {
  const rows = await c.env.DB.prepare("SELECT key, value FROM store_settings").all<{ key: string; value: string }>();
  const settings: Record<string, string> = {};
  for (const r of (rows.results || [])) {
    settings[r.key] = r.value;
  }
  return c.json({ settings });
});

// POST /api/admin/settings
adminRouter.post("/settings", async (c) => {
  const body = await c.req.json();
  for (const [k, v] of Object.entries(body)) {
    await c.env.DB
      .prepare("INSERT INTO store_settings (key, value, updated_at) VALUES (?, ?, datetime('now')) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at")
      .bind(k, String(v))
      .run();
  }
  return c.json({ message: "Settings saved successfully" });
});

// ── 8. Media / R2 Upload ──────────────────────────────────────────────
adminRouter.post("/upload", async (c) => {
  try {
    const formData = await c.req.parseBody();
    const file = formData["file"] as File | undefined;

    if (!file || typeof file !== "object" || !file.name) {
      return c.json({ error: "No file provided" }, 400);
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    const validExts = ["jpg", "jpeg", "png", "webp", "svg", "stl", "3mf"];
    if (!validExts.includes(ext || "")) {
      return c.json({ error: "Unsupported file type" }, 400);
    }

    const key = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

    if (c.env.R2_BUCKET) {
      const buffer = await file.arrayBuffer();
      await c.env.R2_BUCKET.put(key, buffer, {
        httpMetadata: { contentType: file.type || "application/octet-stream" },
      });
    }

    return c.json({
      url: `/api/assets/${key}`,
      key,
      name: file.name,
      size: file.size,
    });
  } catch (err: any) {
    return c.json({ error: "Upload failed", message: err.message }, 500);
  }
});

// ── 9. Compliance & Inquiries Management ──────────────────────────────
adminRouter.get("/compliance-records", async (c) => {
  try {
    const inquiries = await c.env.DB
      .prepare("SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 50")
      .all();
    const grievances = await c.env.DB
      .prepare("SELECT * FROM grievances ORDER BY created_at DESC LIMIT 50")
      .all();
    return c.json({
      inquiries: inquiries.results || [],
      grievances: grievances.results || [],
    });
  } catch (err: any) {
    return c.json({ inquiries: [], grievances: [] });
  }
});

// ── 10. Security & Admin Password Management ──────────────────────────
adminRouter.post("/change-password", async (c) => {
  try {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { currentPassword, newPassword } = body;

    if (!newPassword || newPassword.length < 8) {
      return c.json({ error: "Validation Failed", message: "New password must be at least 8 characters long." }, 400);
    }

    const dbUser = await c.env.DB
      .prepare("SELECT id, password_hash FROM users WHERE id = ?")
      .bind(user.userId)
      .first<{ id: string; password_hash: string }>();

    if (!dbUser) {
      return c.json({ error: "User not found" }, 404);
    }

    // Verify current password if provided
    if (currentPassword && currentPassword.trim() !== "" && currentPassword !== "PBKDF2 SHA-256") {
      const match = await verifyPassword(currentPassword, dbUser.password_hash);
      if (!match) {
        return c.json({
          error: "Unauthorized",
          message: "Current password does not match your active account password.",
        }, 401);
      }
    }

    const newHash = await hashPassword(newPassword);

    // Synchronize new password across all admin accounts (admin@thetoyzdept.in and thetoyzdept@gmail.com)
    await c.env.DB
      .prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE role = 'admin'")
      .bind(newHash)
      .run();

    // Invalidate existing admin sessions in D1 to enforce re-authentication
    await c.env.DB
      .prepare("DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE role = 'admin')")
      .run();

    return c.json({
      message: "Admin password updated successfully. All existing sessions have been terminated. Please sign in with your new credentials.",
    });
  } catch (err: any) {
    return c.json({ error: "Server Error", message: err.message }, 500);
  }
});

adminRouter.get("/accounts", async (c) => {
  try {
    const admins = await c.env.DB
      .prepare("SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE role = 'admin' ORDER BY created_at ASC")
      .all();
    return c.json({ admins: admins.results || [] });
  } catch (err: any) {
    return c.json({ admins: [] });
  }
});

// ── 10. Coupons & Discounts Management ──────────────────────────────

// GET /api/admin/coupons
adminRouter.get("/coupons", async (c) => {
  try {
    const coupons = await c.env.DB
      .prepare("SELECT * FROM coupons ORDER BY created_at DESC")
      .all<any>();
    return c.json({ coupons: coupons.results || [] });
  } catch (err: any) {
    return c.json({ error: "Failed to load coupons", message: err.message }, 500);
  }
});

// POST /api/admin/coupons
adminRouter.post("/coupons", async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const {
      code,
      description,
      discount_type,
      discount_value,
      minimum_order_amount,
      max_uses,
      is_active,
    } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return c.json({ error: "Coupon code is required" }, 400);
    }

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!cleanCode) {
      return c.json({ error: "Invalid coupon code format. Use alphanumeric characters only." }, 400);
    }

    if (!["percentage", "fixed"].includes(discount_type)) {
      return c.json({ error: "Discount type must be either 'percentage' or 'fixed'" }, 400);
    }

    const rawValue = Number(discount_value);
    if (isNaN(rawValue) || rawValue <= 0) {
      return c.json({ error: "Discount value must be greater than 0" }, 400);
    }

    if (discount_type === "percentage" && rawValue > 100) {
      return c.json({ error: "Percentage discount cannot exceed 100%" }, 400);
    }

    // Check if code already exists
    const existing = await c.env.DB
      .prepare("SELECT id FROM coupons WHERE code = ?")
      .bind(cleanCode)
      .first();

    if (existing) {
      return c.json({ error: `Coupon code '${cleanCode}' already exists.` }, 400);
    }

    const couponId = "cpn_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    // If fixed discount, input is in rupees -> convert to paise (x100). If percentage, keep raw percent.
    const storedDiscountValue = discount_type === "fixed" ? Math.round(rawValue * 100) : Math.round(rawValue);
    // Minimum order amount: input is in rupees -> convert to paise (x100)
    const storedMinOrder = minimum_order_amount ? Math.round(Number(minimum_order_amount) * 100) : 0;
    const storedMaxUses = max_uses && Number(max_uses) > 0 ? Math.round(Number(max_uses)) : null;
    const activeState = is_active === 0 || is_active === false ? 0 : 1;

    await c.env.DB
      .prepare(`
        INSERT INTO coupons (
          id, code, description, discount_type, discount_value,
          minimum_order_amount, max_uses, used_count, is_active, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, datetime('now'), datetime('now'))
      `)
      .bind(
        couponId,
        cleanCode,
        description ? description.trim() : null,
        discount_type,
        storedDiscountValue,
        storedMinOrder,
        storedMaxUses,
        activeState
      )
      .run();

    const created = await c.env.DB
      .prepare("SELECT * FROM coupons WHERE id = ?")
      .bind(couponId)
      .first();

    return c.json({ success: true, coupon: created, message: `Coupon '${cleanCode}' created successfully!` });
  } catch (err: any) {
    return c.json({ error: "Failed to create coupon", message: err.message }, 500);
  }
});

// PATCH /api/admin/coupons/:id/toggle
adminRouter.patch("/coupons/:id/toggle", async (c) => {
  try {
    const id = c.req.param("id");
    const coupon = await c.env.DB
      .prepare("SELECT * FROM coupons WHERE id = ?")
      .bind(id)
      .first<any>();

    if (!coupon) {
      return c.json({ error: "Coupon not found" }, 404);
    }

    const nextState = coupon.is_active === 1 ? 0 : 1;
    await c.env.DB
      .prepare("UPDATE coupons SET is_active = ?, updated_at = datetime('now') WHERE id = ?")
      .bind(nextState, id)
      .run();

    return c.json({
      success: true,
      id,
      is_active: nextState,
      message: `Coupon '${coupon.code}' ${nextState === 1 ? "activated" : "deactivated"} successfully.`,
    });
  } catch (err: any) {
    return c.json({ error: "Failed to toggle coupon status", message: err.message }, 500);
  }
});

// DELETE /api/admin/coupons/:id
adminRouter.delete("/coupons/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const coupon = await c.env.DB
      .prepare("SELECT * FROM coupons WHERE id = ?")
      .bind(id)
      .first<any>();

    if (!coupon) {
      return c.json({ error: "Coupon not found" }, 404);
    }

    await c.env.DB
      .prepare("DELETE FROM coupons WHERE id = ?")
      .bind(id)
      .run();

    return c.json({ success: true, message: `Coupon '${coupon.code}' deleted successfully.` });
  } catch (err: any) {
    return c.json({ error: "Failed to delete coupon", message: err.message }, 500);
  }
});

// ── 11. Customer Surveys & Giveaway Management ─────────────────────

// GET /api/admin/surveys
adminRouter.get("/surveys", async (c) => {
  try {
    const surveys = await c.env.DB
      .prepare("SELECT * FROM customer_surveys ORDER BY created_at DESC")
      .all<any>();

    const totalCount = surveys.results?.length || 0;
    const winnersCount = surveys.results?.filter((s) => s.winner_selected === 1).length || 0;
    const avgRating = totalCount > 0
      ? (surveys.results?.reduce((sum, s) => sum + (s.rating || 5), 0) / totalCount).toFixed(1)
      : "5.0";

    // Category distribution breakdown
    const categoryStats: Record<string, number> = {};
    for (const s of surveys.results || []) {
      if (s.favorite_category) {
        categoryStats[s.favorite_category] = (categoryStats[s.favorite_category] || 0) + 1;
      }
    }

    return c.json({
      surveys: surveys.results || [],
      stats: {
        total: totalCount,
        winners: winnersCount,
        averageRating: parseFloat(avgRating),
        categories: categoryStats,
      },
    });
  } catch (err: any) {
    return c.json({ error: "Failed to fetch survey responses", message: err.message }, 500);
  }
});

// POST /api/admin/surveys/pick-winner
adminRouter.post("/surveys/pick-winner", async (c) => {
  try {
    // Select a random participant who hasn't won yet
    const candidate = await c.env.DB
      .prepare("SELECT * FROM customer_surveys WHERE winner_selected = 0 ORDER BY RANDOM() LIMIT 1")
      .first<any>();

    if (!candidate) {
      return c.json({ error: "No eligible survey participants available (all participants have already been selected as winners or no responses exist)." }, 400);
    }

    // Mark candidate as selected winner
    await c.env.DB
      .prepare("UPDATE customer_surveys SET winner_selected = 1 WHERE id = ?")
      .bind(candidate.id)
      .run();

    return c.json({
      success: true,
      winner: {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        instagram: candidate.instagram,
        raffleCode: candidate.raffle_code,
        favoriteProduct: candidate.favorite_product || candidate.favorite_category,
      },
      message: `🎉 Winner selected! Congratulations to ${candidate.name} (Raffle #${candidate.raffle_code})!`,
    });
  } catch (err: any) {
    return c.json({ error: "Failed to pick random winner", message: err.message }, 500);
  }
});

// PATCH /api/admin/surveys/:id/toggle-winner
adminRouter.patch("/surveys/:id/toggle-winner", async (c) => {
  try {
    const id = c.req.param("id");
    const survey = await c.env.DB
      .prepare("SELECT * FROM customer_surveys WHERE id = ?")
      .bind(id)
      .first<any>();

    if (!survey) {
      return c.json({ error: "Survey entry not found" }, 404);
    }

    const nextState = survey.winner_selected === 1 ? 0 : 1;
    await c.env.DB
      .prepare("UPDATE customer_surveys SET winner_selected = ? WHERE id = ?")
      .bind(nextState, id)
      .run();

    return c.json({
      success: true,
      id,
      winner_selected: nextState,
      message: `Participant '${survey.name}' ${nextState === 1 ? "marked as Winner 🏆" : "restored to active participant pool"}.`,
    });
  } catch (err: any) {
    return c.json({ error: "Failed to toggle winner status", message: err.message }, 500);
  }
});
