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
