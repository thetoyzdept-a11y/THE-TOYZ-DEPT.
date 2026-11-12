import { Hono } from "hono";
import { z } from "zod";
import type { D1Database } from "@cloudflare/workers-types";
import type { Env, Variables } from "../types";
import { getCookie } from "../auth";

export const cartRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

const CART_COOKIE = "toyz_cart_id";

function getCartId(c: any): string {
  const cookieHeader = c.req.header("Cookie") || null;
  const existing = getCookie(cookieHeader, CART_COOKIE);
  if (existing) return existing;
  return "cart_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
}

// Helper to fetch full cart with item calculations
async function getFullCart(db: D1Database, cartId: string, couponCode?: string | null) {
  const itemsResult = await db
    .prepare(`
      SELECT 
        ci.id, ci.cart_id, ci.product_id, ci.variant_id, ci.quantity,
        p.name as product_name, p.slug as product_slug, p.base_price,
        v.name as variant_name, v.price_modifier, v.stock,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as product_image
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN product_variants v ON ci.variant_id = v.id
      WHERE ci.cart_id = ?
    `)
    .bind(cartId)
    .all();

  const items = (itemsResult.results || []).map((item: any) => {
    const unitPrice = item.base_price + (item.price_modifier || 0);
    const totalPrice = unitPrice * item.quantity;
    return {
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      productName: item.product_name,
      productSlug: item.product_slug,
      variantName: item.variant_name,
      productImage: item.product_image,
      unitPrice,
      quantity: item.quantity,
      totalPrice,
      availableStock: item.stock !== null ? item.stock : 999,
    };
  });

  const subtotal = items.reduce((sum: number, it: any) => sum + it.totalPrice, 0);

  // Check store settings for free shipping threshold
  const freeShipSetting = await db
    .prepare("SELECT value FROM store_settings WHERE key = 'free_shipping_threshold'")
    .first<{ value: string }>();
  const stdShipSetting = await db
    .prepare("SELECT value FROM store_settings WHERE key = 'standard_shipping_rate'")
    .first<{ value: string }>();

  const freeThreshold = freeShipSetting ? parseInt(freeShipSetting.value, 10) : 99900;
  const stdRate = stdShipSetting ? parseInt(stdShipSetting.value, 10) : 9900;
  const shipping = subtotal >= freeThreshold || subtotal === 0 ? 0 : stdRate;

  let discount = 0;
  let appliedCoupon: any = null;

  if (couponCode) {
    const coupon = await db
      .prepare("SELECT * FROM coupons WHERE code = ? AND is_active = 1")
      .bind(couponCode.toUpperCase())
      .first<any>();

    if (coupon) {
      if (!coupon.minimum_order_amount || subtotal >= coupon.minimum_order_amount) {
        if (coupon.discount_type === "percentage") {
          discount = Math.round((subtotal * coupon.discount_value) / 100);
        } else {
          discount = Math.min(coupon.discount_value, subtotal);
        }
        appliedCoupon = {
          code: coupon.code,
          description: coupon.description,
          discount,
        };
      }
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);

  return {
    cartId,
    items,
    itemCount: items.reduce((count: number, it: any) => count + it.quantity, 0),
    subtotal,
    shipping,
    discount,
    appliedCoupon,
    total,
    freeShippingThreshold: freeThreshold,
    amountToFreeShipping: Math.max(0, freeThreshold - subtotal),
  };
}

// GET /api/cart
cartRouter.get("/", async (c) => {
  const cartId = getCartId(c);
  const coupon = c.req.query("coupon");

  // Ensure cart container exists
  await c.env.DB
    .prepare("INSERT OR IGNORE INTO carts (id, session_id) VALUES (?, ?)")
    .bind(cartId, cartId)
    .run();

  const cart = await getFullCart(c.env.DB, cartId, coupon);
  c.header("Set-Cookie", `${CART_COOKIE}=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
  return c.json({ cart });
});

// POST /api/cart/items
cartRouter.post("/items", async (c) => {
  try {
    const cartId = getCartId(c);
    const body = await c.req.json();

    const schema = z.object({
      productId: z.string(),
      variantId: z.string().optional(),
      quantity: z.number().int().min(1).default(1),
    });

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Invalid payload", details: parsed.error.flatten() }, 400);
    }

    const { productId, variantId, quantity } = parsed.data;

    // Check product exists and active
    const product = await c.env.DB
      .prepare("SELECT id, status FROM products WHERE id = ?")
      .bind(productId)
      .first<{ id: string; status: string }>();

    if (!product || product.status !== "active") {
      return c.json({ error: "Product not available" }, 400);
    }

    // Check stock if variant specified
    if (variantId) {
      const variant = await c.env.DB
        .prepare("SELECT id, stock, is_active FROM product_variants WHERE id = ? AND product_id = ?")
        .bind(variantId, productId)
        .first<{ id: string; stock: number; is_active: number }>();

      if (!variant || !variant.is_active || variant.stock < quantity) {
        return c.json({ error: "Insufficient stock for selected variant." }, 400);
      }
    }

    // Ensure cart exists
    await c.env.DB
      .prepare("INSERT OR IGNORE INTO carts (id, session_id) VALUES (?, ?)")
      .bind(cartId, cartId)
      .run();

    // Check if already in cart
    const existingItem = await c.env.DB
      .prepare("SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND (variant_id = ? OR (variant_id IS NULL AND ? IS NULL))")
      .bind(cartId, productId, variantId || null, variantId || null)
      .first<{ id: string; quantity: number }>();

    if (existingItem) {
      await c.env.DB
        .prepare("UPDATE cart_items SET quantity = quantity + ?, updated_at = datetime('now') WHERE id = ?")
        .bind(quantity, existingItem.id)
        .run();
    } else {
      const itemId = "cit_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      await c.env.DB
        .prepare("INSERT INTO cart_items (id, cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?, ?)")
        .bind(itemId, cartId, productId, variantId || null, quantity)
        .run();
    }

    const updatedCart = await getFullCart(c.env.DB, cartId);
    c.header("Set-Cookie", `${CART_COOKIE}=${cartId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`);
    return c.json({ message: "Item added to cart", cart: updatedCart });
  } catch (err: any) {
    return c.json({ error: "Server Error", message: err.message }, 500);
  }
});

// PATCH /api/cart/items/:id
cartRouter.patch("/items/:id", async (c) => {
  const cartId = getCartId(c);
  const itemId = c.req.param("id");
  const body = await c.req.json();
  const quantity = parseInt(body.quantity, 10);

  if (isNaN(quantity) || quantity < 0) {
    return c.json({ error: "Invalid quantity" }, 400);
  }

  if (quantity === 0) {
    await c.env.DB
      .prepare("DELETE FROM cart_items WHERE id = ? AND cart_id = ?")
      .bind(itemId, cartId)
      .run();
  } else {
    await c.env.DB
      .prepare("UPDATE cart_items SET quantity = ?, updated_at = datetime('now') WHERE id = ? AND cart_id = ?")
      .bind(quantity, itemId, cartId)
      .run();
  }

  const updatedCart = await getFullCart(c.env.DB, cartId);
  return c.json({ cart: updatedCart });
});

// DELETE /api/cart/items/:id
cartRouter.delete("/items/:id", async (c) => {
  const cartId = getCartId(c);
  const itemId = c.req.param("id");

  await c.env.DB
    .prepare("DELETE FROM cart_items WHERE id = ? AND cart_id = ?")
    .bind(itemId, cartId)
    .run();

  const updatedCart = await getFullCart(c.env.DB, cartId);
  return c.json({ message: "Item removed", cart: updatedCart });
});
