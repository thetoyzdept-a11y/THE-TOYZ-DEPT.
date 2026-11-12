import { Hono } from "hono";
import type { Env, Variables } from "../types";

export const productsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// GET /api/categories
productsRouter.get("/categories", async (c) => {
  const result = await c.env.DB
    .prepare(`
      SELECT 
        c.id, c.name, c.slug, c.description, c.image, c.sort_order,
        COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.status = 'active'
      WHERE c.is_visible = 1
      GROUP BY c.id
      ORDER BY c.sort_order ASC
    `)
    .all<{
      id: string;
      name: string;
      slug: string;
      description: string | null;
      image: string | null;
      sort_order: number;
      product_count: number;
    }>();

  return c.json({ categories: result.results || [] });
});

// GET /api/products
productsRouter.get("/products", async (c) => {
  const categorySlug = c.req.query("category");
  const search = c.req.query("search");
  const sort = c.req.query("sort") || "featured";
  const featuredOnly = c.req.query("featured") === "true";
  const limit = Math.min(parseInt(c.req.query("limit") || "50", 10), 100);

  let query = `
    SELECT 
      p.id, p.name, p.slug, p.description, p.short_description,
      p.base_price, p.compare_price, p.material, p.dimensions, p.weight,
      p.status, p.is_featured, p.created_at,
      c.id as category_id, c.name as category_name, c.slug as category_slug,
      (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image,
      (SELECT SUM(stock) FROM product_variants WHERE product_id = p.id AND is_active = 1) as total_stock
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.status = 'active'
  `;

  const params: any[] = [];

  if (categorySlug) {
    query += " AND c.slug = ?";
    params.push(categorySlug);
  }

  if (search) {
    query += " AND (p.name LIKE ? OR p.description LIKE ? OR p.material LIKE ?)";
    const wildcard = `%${search}%`;
    params.push(wildcard, wildcard, wildcard);
  }

  if (featuredOnly) {
    query += " AND p.is_featured = 1";
  }

  switch (sort) {
    case "price-asc":
      query += " ORDER BY p.base_price ASC";
      break;
    case "price-desc":
      query += " ORDER BY p.base_price DESC";
      break;
    case "newest":
      query += " ORDER BY p.created_at DESC";
      break;
    case "featured":
    default:
      query += " ORDER BY p.is_featured DESC, p.created_at DESC";
      break;
  }

  query += " LIMIT ?";
  params.push(limit);

  const stmt = c.env.DB.prepare(query);
  const result = await stmt.bind(...params).all();

  return c.json({ products: result.results || [] });
});

// GET /api/products/:slug
productsRouter.get("/products/:slug", async (c) => {
  const slug = c.req.param("slug");

  const product = await c.env.DB
    .prepare(`
      SELECT 
        p.id, p.name, p.slug, p.description, p.short_description,
        p.base_price, p.compare_price, p.material, p.dimensions, p.weight,
        p.status, p.is_featured, p.meta_title, p.meta_description, p.created_at,
        c.id as category_id, c.name as category_name, c.slug as category_slug
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.status != 'archived'
    `)
    .bind(slug)
    .first<any>();

  if (!product) {
    return c.json({ error: "Not Found", message: "Product not found" }, 404);
  }

  // Fetch images
  const images = await c.env.DB
    .prepare("SELECT id, url, alt_text, sort_order, is_primary FROM product_images WHERE product_id = ? ORDER BY sort_order ASC")
    .bind(product.id)
    .all();

  // Fetch variants
  const variants = await c.env.DB
    .prepare("SELECT id, name, sku, color, size, price_modifier, stock, low_stock_threshold, is_active FROM product_variants WHERE product_id = ? AND is_active = 1 ORDER BY price_modifier ASC")
    .bind(product.id)
    .all();

  // Fetch approved reviews
  const reviews = await c.env.DB
    .prepare(`
      SELECT r.id, r.rating, r.title, r.body, r.is_verified, r.created_at, u.first_name, u.last_name
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.product_id = ? AND r.is_approved = 1
      ORDER BY r.created_at DESC
    `)
    .bind(product.id)
    .all();

  // Fetch related products from same category
  const related = await c.env.DB
    .prepare(`
      SELECT 
        p.id, p.name, p.slug, p.base_price, p.compare_price,
        (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.status = 'active'
      LIMIT 4
    `)
    .bind(product.category_id, product.id)
    .all();

  return c.json({
    product: {
      ...product,
      images: images.results || [],
      variants: variants.results || [],
      reviews: reviews.results || [],
      related: related.results || [],
    },
  });
});
