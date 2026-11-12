import { Hono } from "hono";
import { z } from "zod";
import type { Env, Variables } from "../types";
import { requireAuth } from "../auth";

export const customRequestsRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

// POST /api/custom-requests (Submit custom 3D print request with STL/3MF file)
customRequestsRouter.post("/", async (c) => {
  try {
    const user = c.get("user");
    const formData = await c.req.parseBody();

    const description = formData["description"] as string;
    const material = (formData["material"] as string) || "PLA+ (Standard)";
    const color = (formData["color"] as string) || "Acid Lime";
    const quantity = parseInt((formData["quantity"] as string) || "1", 10);
    const additionalNotes = (formData["additionalNotes"] as string) || "";
    const guestEmail = formData["email"] as string;
    const guestName = formData["name"] as string;
    const guestPhone = formData["phone"] as string;

    if (!description || description.trim().length < 5) {
      return c.json({ error: "Description is required (minimum 5 characters)." }, 400);
    }

    // Handle User ID (logged in or guest)
    let finalUserId = user?.userId;
    if (!finalUserId) {
      if (!guestEmail) {
        return c.json({ error: "Email is required to submit a custom print request." }, 400);
      }
      const existing = await c.env.DB
        .prepare("SELECT id FROM users WHERE email = ?")
        .bind(guestEmail.toLowerCase())
        .first<{ id: string }>();

      if (existing) {
        finalUserId = existing.id;
      } else {
        finalUserId = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
        await c.env.DB
          .prepare("INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, 'guest_no_pwd', ?, ?, ?, 'customer')")
          .bind(finalUserId, guestEmail.toLowerCase(), guestName || "Customer", "", guestPhone || null)
          .run();
      }
    }

    const requestId = "req_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const requestNumber = "CST-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000);

    // Save Request record in D1
    await c.env.DB
      .prepare(`
        INSERT INTO custom_requests (
          id, request_number, user_id, description, material, color, quantity, additional_notes, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'submitted')
      `)
      .bind(requestId, requestNumber, finalUserId, description, material, color, quantity, additionalNotes)
      .run();

    // Handle 3D File Upload (STL / 3MF)
    const file = formData["file"] as File | undefined;
    if (file && typeof file === "object" && file.name) {
      const fileName = file.name;
      const fileExt = fileName.split(".").pop()?.toLowerCase();

      if (fileExt !== "stl" && fileExt !== "3mf" && fileExt !== "obj" && fileExt !== "step") {
        return c.json({ error: "Invalid file format. Allowed: .stl, .3mf, .obj, .step" }, 400);
      }

      // Max 50MB
      if (file.size > 50 * 1024 * 1024) {
        return c.json({ error: "File exceeds 50MB limit." }, 400);
      }

      const r2Key = `custom-models/${finalUserId}/${requestId}_${fileName.replace(/[^a-zA-Z0-9._-]/g, "_")}`;

      // Upload directly to Cloudflare R2 bucket!
      if (c.env.R2_BUCKET) {
        const fileBuffer = await file.arrayBuffer();
        await c.env.R2_BUCKET.put(r2Key, fileBuffer, {
          httpMetadata: {
            contentType: file.type || "application/octet-stream",
          },
          customMetadata: {
            requestId,
            userId: finalUserId,
            originalName: fileName,
          },
        });
      }

      const fileRecordId = "cfile_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      await c.env.DB
        .prepare("INSERT INTO custom_request_files (id, request_id, file_name, file_type, file_size, r2_key) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(fileRecordId, requestId, fileName, fileExt, file.size, r2Key)
        .run();
    }

    return c.json({
      success: true,
      requestId,
      requestNumber,
      message: "Custom printing request submitted successfully! Our engineers will inspect your model and prepare a quotation within 24 hours.",
    }, 201);
  } catch (err: any) {
    return c.json({ error: "Submission Error", message: err.message }, 500);
  }
});

// GET /api/custom-requests/my (Customer view of their requests)
customRequestsRouter.get("/my", requireAuth, async (c) => {
  const user = c.get("user")!;

  const requests = await c.env.DB
    .prepare(`
      SELECT 
        cr.id, cr.request_number, cr.description, cr.material, cr.color, cr.quantity,
        cr.additional_notes, cr.status, cr.created_at,
        q.id as quotation_id, q.amount as quotation_amount, q.breakdown as quotation_breakdown,
        q.status as quotation_status, q.valid_until as quotation_valid_until, q.notes as quotation_notes,
        (SELECT file_name FROM custom_request_files WHERE request_id = cr.id LIMIT 1) as file_name
      FROM custom_requests cr
      LEFT JOIN quotations q ON q.request_id = cr.id
      WHERE cr.user_id = ?
      ORDER BY cr.created_at DESC
    `)
    .bind(user.userId)
    .all<any>();

  return c.json({ requests: requests.results || [] });
});

// GET /api/custom-requests/:id
customRequestsRouter.get("/:id", requireAuth, async (c) => {
  const user = c.get("user")!;
  const id = c.req.param("id");

  const request = await c.env.DB
    .prepare("SELECT * FROM custom_requests WHERE id = ? AND (user_id = ? OR ? = 'admin')")
    .bind(id, user.userId, user.role)
    .first<any>();

  if (!request) {
    return c.json({ error: "Not found" }, 404);
  }

  const files = await c.env.DB
    .prepare("SELECT id, file_name, file_type, file_size, r2_key, created_at FROM custom_request_files WHERE request_id = ?")
    .bind(id)
    .all();

  const quotations = await c.env.DB
    .prepare("SELECT * FROM quotations WHERE request_id = ? ORDER BY created_at DESC")
    .bind(id)
    .all();

  return c.json({
    request: {
      ...request,
      files: files.results || [],
      quotations: quotations.results || [],
    },
  });
});

// POST /api/custom-requests/:id/quotations/:quotationId/respond (Accept / Reject)
customRequestsRouter.post("/:id/quotations/:quotationId/respond", requireAuth, async (c) => {
  const user = c.get("user")!;
  const requestId = c.req.param("id");
  const quotationId = c.req.param("quotationId");
  const body = await c.req.json();
  const action = body.action; // 'accepted' or 'rejected'

  if (action !== "accepted" && action !== "rejected") {
    return c.json({ error: "Invalid action. Must be 'accepted' or 'rejected'." }, 400);
  }

  // Verify ownership
  const reqRow = await c.env.DB
    .prepare("SELECT id FROM custom_requests WHERE id = ? AND user_id = ?")
    .bind(requestId, user.userId)
    .first();

  if (!reqRow) {
    return c.json({ error: "Custom request not found" }, 404);
  }

  // Update Quotation Status
  await c.env.DB
    .prepare("UPDATE quotations SET status = ?, responded_at = datetime('now'), updated_at = datetime('now') WHERE id = ? AND request_id = ?")
    .bind(action, quotationId, requestId)
    .run();

  // Update Custom Request Status
  const newReqStatus = action === "accepted" ? "accepted" : "rejected";
  await c.env.DB
    .prepare("UPDATE custom_requests SET status = ?, updated_at = datetime('now') WHERE id = ?")
    .bind(newReqStatus, requestId)
    .run();

  return c.json({
    success: true,
    message: action === "accepted"
      ? "Quotation accepted! You can now proceed to payment to start production."
      : "Quotation rejected.",
  });
});

// GET /api/custom-requests/:id/download-file (Secure file download from R2)
customRequestsRouter.get("/:id/download-file", requireAuth, async (c) => {
  const user = c.get("user")!;
  const requestId = c.req.param("id");

  // Verify user has access (customer owner or admin)
  const reqRow = await c.env.DB
    .prepare("SELECT user_id FROM custom_requests WHERE id = ?")
    .bind(requestId)
    .first<{ user_id: string }>();

  if (!reqRow || (reqRow.user_id !== user.userId && user.role !== "admin")) {
    return c.json({ error: "Access denied" }, 403);
  }

  const fileRow = await c.env.DB
    .prepare("SELECT file_name, r2_key, file_type FROM custom_request_files WHERE request_id = ? LIMIT 1")
    .bind(requestId)
    .first<{ file_name: string; r2_key: string; file_type: string }>();

  if (!fileRow) {
    return c.json({ error: "File record not found" }, 404);
  }

  if (!c.env.R2_BUCKET) {
    return c.json({ error: "Storage bucket not configured" }, 500);
  }

  const r2Object = await c.env.R2_BUCKET.get(fileRow.r2_key);
  if (!r2Object) {
    return c.json({ error: "File not found in storage" }, 404);
  }

  c.header("Content-Type", "application/octet-stream");
  c.header("Content-Disposition", `attachment; filename="${fileRow.file_name}"`);
  return c.body(r2Object.body as any);
});
