import { Hono } from "hono";
import type { Env, Variables } from "../types";
import { BUSINESS_PROFILE } from "../config/business";

export const complianceRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// Helper to ensure tables exist in D1
async function ensureTables(db: any) {
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS contact_inquiries (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    await db.prepare(`
      CREATE TABLE IF NOT EXISTS grievances (
        id TEXT PRIMARY KEY,
        ticket_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        order_number TEXT,
        grievance_type TEXT NOT NULL,
        description TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
  } catch (err) {
    console.error("ensureTables error:", err);
  }
}

/**
 * GET /api/business-profile
 * Public endpoint returning verified business identity and statutory disclosures.
 */
complianceRouter.get("/business-profile", (c) => {
  return c.json({
    status: "ok",
    business: BUSINESS_PROFILE,
  });
});

/**
 * POST /api/contact
 * Handles contact form inquiries with backend validation & storage.
 */
complianceRouter.post("/contact", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { name, email, phone, subject, message } = body;

    // Validate fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return c.json({ error: "Please enter your valid full name." }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return c.json({ error: "Please provide a valid email address." }, 400);
    }

    if (!subject || typeof subject !== "string" || subject.trim().length < 3) {
      return c.json({ error: "Please enter a subject (minimum 3 characters)." }, 400);
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return c.json({ error: "Please enter your message (minimum 10 characters)." }, 400);
    }

    await ensureTables(c.env.DB);

    const id = `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanPhone = phone ? String(phone).trim() : null;

    await c.env.DB.prepare(`
      INSERT INTO contact_inquiries (id, name, email, phone, subject, message)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(id, name.trim(), email.trim().toLowerCase(), cleanPhone, subject.trim(), message.trim()).run();

    return c.json({
      status: "success",
      message: "Thank you for contacting THE TOYZ DEPT. Your message has been received.",
      inquiryId: id,
      expectedResponseTime: "Within 24 business hours",
    });
  } catch (err: any) {
    console.error("POST /api/contact error:", err);
    return c.json({ error: "Failed to submit contact inquiry. Please try again or email thetoyzdept@gmail.com directly." }, 500);
  }
});

/**
 * POST /api/grievance
 * Handles statutory consumer grievance redressal submissions.
 * Conforms to Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020.
 */
complianceRouter.post("/grievance", async (c) => {
  try {
    const body = await c.req.json().catch(() => ({}));
    const { name, email, phone, orderNumber, grievanceType, description } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return c.json({ error: "Complainant name is required." }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return c.json({ error: "A valid contact email is required for grievance acknowledgement." }, 400);
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 8) {
      return c.json({ error: "A valid contact telephone number is required." }, 400);
    }

    if (!grievanceType || typeof grievanceType !== "string") {
      return c.json({ error: "Please specify the nature of your grievance." }, 400);
    }

    if (!description || typeof description !== "string" || description.trim().length < 15) {
      return c.json({ error: "Please describe the grievance in detail (minimum 15 characters)." }, 400);
    }

    await ensureTables(c.env.DB);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const year = new Date().getFullYear();
    const ticketId = `GRV-${year}-${randomSuffix}`;
    const id = `grv_${Date.now()}`;
    const cleanOrderNumber = orderNumber ? String(orderNumber).trim() : null;

    await c.env.DB.prepare(`
      INSERT INTO grievances (id, ticket_id, name, email, phone, order_number, grievance_type, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      ticketId,
      name.trim(),
      email.trim().toLowerCase(),
      phone.trim(),
      cleanOrderNumber,
      grievanceType.trim(),
      description.trim()
    ).run();

    return c.json({
      status: "success",
      ticketId,
      message: `Your grievance ticket has been formally recorded under Ticket #${ticketId}.`,
      acknowledgementSLA: BUSINESS_PROFILE.grievanceOfficer.acknowledgementSLA,
      resolutionSLA: BUSINESS_PROFILE.grievanceOfficer.resolutionSLA,
      officer: {
        name: BUSINESS_PROFILE.grievanceOfficer.name,
        designation: BUSINESS_PROFILE.grievanceOfficer.designation,
        email: BUSINESS_PROFILE.grievanceOfficer.email,
        phone: BUSINESS_PROFILE.grievanceOfficer.phone,
      },
    });
  } catch (err: any) {
    console.error("POST /api/grievance error:", err);
    return c.json({ error: "Failed to record grievance. Please contact the Grievance Officer directly at thetoyzdept@gmail.com." }, 500);
  }
});

/**
 * POST /api/survey
 * Public endpoint to submit customer product feedback & enter monthly free drop giveaway.
 */
complianceRouter.post("/survey", async (c) => {
  try {
    const body = (await c.req.json().catch(() => ({}))) as any;
    const {
      name,
      email,
      phone,
      instagram,
      favorite_category,
      favorite_product,
      desired_colors,
      price_preference,
      product_ideas,
      rating,
      feedback,
    } = body;

    // Validate essential fields
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return c.json({ error: "Please provide your name (minimum 2 characters)." }, 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== "string" || !emailRegex.test(email.trim())) {
      return c.json({ error: "Please provide a valid email address so we can notify you if you win." }, 400);
    }

    if (!favorite_category || typeof favorite_category !== "string") {
      return c.json({ error: "Please select your favorite product category." }, 400);
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone ? String(phone).trim() : null;
    const cleanInstagram = instagram ? String(instagram).trim().replace(/^@/, "") : null;
    const cleanCategory = String(favorite_category).trim();
    const cleanProduct = favorite_product ? String(favorite_product).trim() : null;
    const cleanColors = desired_colors ? String(desired_colors).trim() : null;
    const cleanPrice = price_preference ? String(price_preference).trim() : null;
    const cleanIdeas = product_ideas ? String(product_ideas).trim() : null;
    const numRating = Number(rating) >= 1 && Number(rating) <= 5 ? Math.round(Number(rating)) : 5;
    const cleanFeedback = feedback ? String(feedback).trim() : null;
    const ip = c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || "unknown";

    // Check if user has already entered with this email
    const existing = await c.env.DB
      .prepare("SELECT id, raffle_code FROM customer_surveys WHERE email = ?")
      .bind(cleanEmail)
      .first<any>();

    if (existing) {
      // Update existing response so customer's latest thoughts are captured without duplicate entries
      await c.env.DB
        .prepare(`
          UPDATE customer_surveys SET
            name = ?,
            phone = COALESCE(?, phone),
            instagram = COALESCE(?, instagram),
            favorite_category = ?,
            favorite_product = COALESCE(?, favorite_product),
            desired_colors = COALESCE(?, desired_colors),
            price_preference = COALESCE(?, price_preference),
            product_ideas = COALESCE(?, product_ideas),
            rating = ?,
            feedback = COALESCE(?, feedback),
            ip_address = ?
          WHERE id = ?
        `)
        .bind(
          cleanName,
          cleanPhone,
          cleanInstagram,
          cleanCategory,
          cleanProduct,
          cleanColors,
          cleanPrice,
          cleanIdeas,
          numRating,
          cleanFeedback,
          ip,
          existing.id
        )
        .run();

      return c.json({
        success: true,
        message: `Welcome back! Your survey preferences have been updated and your Giveaway Raffle ticket (${existing.raffle_code}) is active!`,
        raffleCode: existing.raffle_code,
        couponCode: "SURVEY15",
        couponDiscount: "15% OFF",
        winnerPrize: "Free Collector 3D Print (Articulated Dragon or Desk Companion) + Free Express Shipping",
        isExisting: true,
      });
    }

    // Generate unique raffle code: DROP-WIN-XXXX-XX
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    const randomSuffix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const raffleCode = `DROP-WIN-${randomChars}-${randomSuffix}`;
    const surveyId = "srv_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);

    await c.env.DB
      .prepare(`
        INSERT INTO customer_surveys (
          id, name, email, phone, instagram, favorite_category, favorite_product,
          desired_colors, price_preference, product_ideas, rating, feedback,
          raffle_code, winner_selected, ip_address, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, datetime('now'))
      `)
      .bind(
        surveyId,
        cleanName,
        cleanEmail,
        cleanPhone,
        cleanInstagram,
        cleanCategory,
        cleanProduct,
        cleanColors,
        cleanPrice,
        cleanIdeas,
        numRating,
        cleanFeedback,
        raffleCode,
        ip
      )
      .run();

    return c.json({
      success: true,
      message: "Survey submitted successfully! You're officially enrolled in this month's Free 3D Print Drop Giveaway.",
      raffleCode,
      couponCode: "SURVEY15",
      couponDiscount: "15% OFF",
      winnerPrize: "Free Collector 3D Print (Articulated Dragon or Desk Companion) + Free Express Shipping",
      isExisting: false,
    });
  } catch (err: any) {
    console.error("POST /api/survey error:", err);
    return c.json({ error: "Failed to record survey response: " + err.message }, 500);
  }
});
