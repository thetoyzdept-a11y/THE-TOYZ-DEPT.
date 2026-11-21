import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { LRUCache } from "../lib/cache";

export const seoRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

const sitemapCache = new LRUCache<string>(10, 3600); // 1 hour TTL

const SITE_URL = "https://thetoyzdept.in";

/**
 * GET /sitemap.xml
 * Fully compliant XML Sitemap with Google Image extension
 * Dynamically generated from live Cloudflare D1 catalogue
 */
seoRouter.get("/sitemap.xml", async (c) => {
  const cached = sitemapCache.get("sitemap:xml");
  if (cached) {
    c.header("Content-Type", "application/xml; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
    c.header("X-Sitemap-Source", "EDGE_CACHE");
    return c.body(cached);
  }

  try {
    // 1. Fetch all active products with primary images
    const productsRes = await c.env.DB
      .prepare(`
        SELECT 
          p.id, p.name, p.slug, p.short_description, p.updated_at, p.created_at,
          (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as primary_image
        FROM products p
        WHERE p.status = 'active'
        ORDER BY p.is_featured DESC, p.created_at DESC
      `)
      .all<any>();

    const products = productsRes.results || [];

    // 2. Fetch all visible categories
    const categoriesRes = await c.env.DB
      .prepare(`
        SELECT id, name, slug, updated_at
        FROM categories
        WHERE is_visible = 1
        ORDER BY sort_order ASC
      `)
      .all<any>();

    const categories = categoriesRes.results || [];

    const nowIso = new Date().toISOString().split("T")[0];

    // Static Core Storefront Routes
    const staticRoutes = [
      { path: "/", priority: "1.0", changefreq: "daily", lastmod: nowIso },
      { path: "/shop", priority: "0.9", changefreq: "daily", lastmod: nowIso },
      { path: "/survey", priority: "0.8", changefreq: "weekly", lastmod: nowIso },
      { path: "/giveaway", priority: "0.8", changefreq: "weekly", lastmod: nowIso },
      { path: "/track-order", priority: "0.7", changefreq: "weekly", lastmod: nowIso },
      { path: "/about", priority: "0.7", changefreq: "monthly", lastmod: "2026-11-15" },
      { path: "/shipping", priority: "0.7", changefreq: "monthly", lastmod: "2026-11-15" },
      { path: "/returns", priority: "0.7", changefreq: "monthly", lastmod: "2026-11-15" },
      { path: "/contact", priority: "0.7", changefreq: "monthly", lastmod: "2026-11-15" },
      { path: "/privacy", priority: "0.5", changefreq: "yearly", lastmod: "2026-11-15" },
      { path: "/terms", priority: "0.5", changefreq: "yearly", lastmod: "2026-11-15" },
      { path: "/pricing", priority: "0.6", changefreq: "monthly", lastmod: "2026-11-15" },
      { path: "/grievance-redressal", priority: "0.5", changefreq: "yearly", lastmod: "2026-11-15" },
      { path: "/sample-invoice", priority: "0.5", changefreq: "monthly", lastmod: "2026-11-15" },
    ];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    // Append static routes
    for (const route of staticRoutes) {
      xml += `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>
`;
    }

    // Append category archive routes
    for (const cat of categories) {
      const catLastMod = cat.updated_at ? cat.updated_at.split(" ")[0] : nowIso;
      xml += `  <url>
    <loc>${SITE_URL}/shop?category=${cat.slug}</loc>
    <lastmod>${catLastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.85</priority>
  </url>
`;
    }

    // Append product detail routes with Google Image metadata
    for (const prod of products) {
      const prodLastMod = (prod.updated_at || prod.created_at || nowIso).split(" ")[0];
      const prodUrl = `${SITE_URL}/products/${prod.slug}`;

      let imageXml = "";
      if (prod.primary_image) {
        const fullImgUrl = prod.primary_image.startsWith("http")
          ? prod.primary_image
          : `${SITE_URL}${prod.primary_image.startsWith("/") ? "" : "/"}${prod.primary_image}`;

        const cleanTitle = (prod.name || "3D Printed Toy")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const cleanCaption = (prod.short_description || "Precision engineered 3D printed drop from THE TOYZ DEPT.")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        imageXml = `
    <image:image>
      <image:loc>${fullImgUrl}</image:loc>
      <image:title>${cleanTitle}</image:title>
      <image:caption>${cleanCaption}</image:caption>
    </image:image>`;
      }

      xml += `  <url>
    <loc>${prodUrl}</loc>
    <lastmod>${prodLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.80</priority>${imageXml}
  </url>
`;
    }

    xml += `</urlset>`;

    sitemapCache.set("sitemap:xml", xml, 3600);

    c.header("Content-Type", "application/xml; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400");
    c.header("X-Sitemap-Source", "LIVE_D1");
    return c.body(xml);
  } catch (err: any) {
    console.error("Sitemap generation error:", err);
    return c.text("Error generating sitemap", 500);
  }
});

/**
 * GET /robots.txt
 * Instructs Googlebot and search engine crawlers with direct sitemap index pointer
 */
seoRouter.get("/robots.txt", (c) => {
  const robots = `# Google & Search Engine Robots Protocol
# Brand: THE TOYZ DEPT. (https://thetoyzdept.in)
# Additive Manufacturing & Tactile 3D Collectibles Studio

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /account
Disallow: /account/
Disallow: /api/
Disallow: /checkout
Disallow: /order-success/

# Google XML Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml

# Agentic Resource Discovery Protocol
Agentmap: ${SITE_URL}/.well-known/ard.json
`;

  c.header("Content-Type", "text/plain; charset=utf-8");
  c.header("Cache-Control", "public, max-age=86400");
  return c.text(robots);
});

/**
 * GET /llms.txt
 * Standard machine-readable plain text Markdown guide for LLMs & AI agents
 */
seoRouter.get("/llms.txt", (c) => {
  const content = `# THE TOYZ DEPT.

> India's premier design-led additive manufacturing studio engineering precision 3D printed articulated toys, tactile fidgets, and brutalist desk gear in Bengaluru, India.

THE TOYZ DEPT. (thetoyzdept.in) fabricates print-in-place articulated creatures, kinetic desk gear, and brutalist home decor using virgin bio-based silk PLA+ and engineering PETG. Every drop is manufactured with 0.12mm to 0.16mm layer clearances and dispatched within 24 to 48 hours via Shiprocket express across all 19,000+ Indian PIN codes. 100% prepaid payments powered by Razorpay (UPI, Google Pay, PhonePe, Cards, NetBanking); strictly zero Cash on Delivery (COD) to prevent logistics damage and guarantee direct-to-collector pricing.

## Additive Manufacturing Departments
- [3D Printed Toys & Articulated Collectibles](https://thetoyzdept.in/shop?category=collectibles): 48-segment Articulated Cyber Dragon, Mecha Flexi Rex, and faceted Crystal Serpents with fluid interlocking print-in-place ball joints.
- [Tactile Fidget Toys & ADHD Focus Gear](https://thetoyzdept.in/shop?category=desk-objects): Multi-gear kinetic fidget cubes, infinity twisting geometries, and satisfying tactile objects engineered for workspace stress relief.
- [Brutalist Desk Monoliths & Home Decor](https://thetoyzdept.in/shop?category=home-stuff): Architectural geometric concrete-style planters, weighted cable organizers, and modular headphone stands.
- [Complete Catalog Archive](https://thetoyzdept.in/shop): Full catalogue of 12 additive manufactured drops and limited studio editions.

## Studio Operations & Policies
- [About Our Bengaluru Studio](https://thetoyzdept.in/about): Additive manufacturing studio based in Bengaluru, Karnataka, India.
- [Live Order Tracking](https://thetoyzdept.in/track-order): Real-time Shiprocket air courier tracking with AWB references.
- [Customer Survey & Monthly Free Drop Giveaway](https://thetoyzdept.in/survey): 2-minute community survey with instant 15% discount coupon (SURVEY15) and automated monthly free print raffle.
- [Shipping & Delivery Policy](https://thetoyzdept.in/shipping): 24-48h dispatch from Bengaluru with 100% free express shipping above ₹999.
- [Refunds, Replacements & No-COD Policy](https://thetoyzdept.in/refund-policy): 48-hour unboxing defect replacement guarantee and transparent explanation of our 100% prepaid model.
- [Terms & Conditions](https://thetoyzdept.in/terms): Official e-commerce operating policies, Consumer Protection Act compliance, and consumer terms.
- [Privacy Policy](https://thetoyzdept.in/privacy): Information Technology Act 2000 compliant data security and Razorpay tokenized transaction handling.
- [Contact Studio Desk](https://thetoyzdept.in/contact): Direct assistance via WhatsApp (+91 90194 65897) and email (thetoyzdept@gmail.com).
`;

  c.header("Content-Type", "text/plain; charset=utf-8");
  c.header("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return c.text(content);
});

const ARD_MANIFEST = {
  specVersion: "1.0",
  host: {
    displayName: "THE TOYZ DEPT.",
    identifier: "thetoyzdept.in",
    documentationUrl: "https://thetoyzdept.in/about",
    logoUrl: "https://thetoyzdept.in/logo.svg",
  },
  entries: [
    {
      identifier: "urn:air:thetoyzdept.in:agent:toyz-ai",
      displayName: "TOYZ-AI Desk Concierge",
      type: "text/markdown",
      url: "https://thetoyzdept.in/llms.txt",
      description:
        "Interactive AI concierge for 3D printed toys, articulated dragons, and tactile desk fidgets in India.",
      tags: ["3d-printing", "toys", "dragons", "fidgets", "desk-gear", "collectibles"],
      capabilities: ["ProductDiscovery", "OrderTracking", "GiveawayInfo"],
      representativeQueries: [
        "What 3D printed toys do you have in stock?",
        "Do you sell articulated dragons in India?",
        "What is the best tactile fidget toy for ADHD focus?",
        "How fast do you ship 3D printed items from Bengaluru?",
      ],
      updatedAt: "2026-11-21T00:00:00Z",
    },
    {
      identifier: "urn:air:thetoyzdept.in:catalog:store",
      displayName: "THE TOYZ DEPT. Product Catalog",
      type: "application/ld+json",
      url: "https://thetoyzdept.in/sitemap.xml",
      description:
        "Full additive manufacturing catalog featuring articulated dragons, kinetic gear cubes, and brutalist desk decor.",
      tags: ["catalog", "ecommerce", "3d-printed-toys", "india"],
      capabilities: ["CatalogBrowsing", "Pricing"],
      representativeQueries: [
        "Browse 3D printed articulated dragon drops",
        "Tactile desk fidget cubes price India",
        "Brutalist desk accessories and planters Bengaluru",
      ],
      updatedAt: "2026-11-21T00:00:00Z",
    },
  ],
};

/**
 * GET /.well-known/ard.json
 * Agentic Resource Discovery Manifest (ARD v1.0 standard)
 */
seoRouter.get("/.well-known/ard.json", (c) => {
  c.header("Content-Type", "application/json; charset=utf-8");
  c.header("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return c.json(ARD_MANIFEST);
});

/**
 * GET /.well-known/ai-catalog.json
 * Backwards-compatibility alias for older ARD crawlers
 */
seoRouter.get("/.well-known/ai-catalog.json", (c) => {
  c.header("Content-Type", "application/json; charset=utf-8");
  c.header("Cache-Control", "public, max-age=3600, s-maxage=86400");
  return c.json(ARD_MANIFEST);
});
