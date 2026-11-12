import { Hono } from "hono";
import { z } from "zod";
import type { Env, Variables } from "../types";
import {
  hashPassword,
  verifyPassword,
  createSession,
  destroySession,
  createSessionCookie,
  deleteSessionCookie,
} from "../auth";

export const authRouter = new Hono<{ Bindings: Env; Variables: Variables }>();

const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// GET /api/auth/me
authRouter.get("/me", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ user: null });
  }

  // Get freshest user details from D1
  const dbUser = await c.env.DB
    .prepare("SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?")
    .bind(user.userId)
    .first<{
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
      role: "customer" | "admin";
      created_at: string;
    }>();

  if (!dbUser) {
    return c.json({ user: null });
  }

  return c.json({
    user: {
      id: dbUser.id,
      email: dbUser.email,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      phone: dbUser.phone,
      role: dbUser.role,
      createdAt: dbUser.created_at,
    },
  });
});

// POST /api/auth/register
authRouter.post("/register", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation Failed", details: parsed.error.flatten() }, 400);
    }

    const { email, password, firstName, lastName, phone } = parsed.data;

    // Check if user already exists
    const existing = await c.env.DB
      .prepare("SELECT id FROM users WHERE email = ?")
      .bind(email.toLowerCase())
      .first();

    if (existing) {
      return c.json({ error: "Conflict", message: "An account with this email already exists." }, 409);
    }

    const userId = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
    const passwordHash = await hashPassword(password);

    await c.env.DB
      .prepare(
        "INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role) VALUES (?, ?, ?, ?, ?, ?, 'customer')"
      )
      .bind(userId, email.toLowerCase(), passwordHash, firstName, lastName, phone || null)
      .run();

    const token = await createSession(c.env.DB, c.env.SESSION_SECRET, {
      id: userId,
      email: email.toLowerCase(),
      firstName,
      lastName,
      role: "customer",
    });

    c.header("Set-Cookie", createSessionCookie(token));

    return c.json({
      message: "Account created successfully.",
      user: {
        id: userId,
        email: email.toLowerCase(),
        firstName,
        lastName,
        role: "customer",
      },
    }, 201);
  } catch (err: any) {
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
  }
});

// POST /api/auth/login
authRouter.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: "Validation Failed", details: parsed.error.flatten() }, 400);
    }

    const { email, password } = parsed.data;

    const user = await c.env.DB
      .prepare(
        "SELECT id, email, password_hash, first_name, last_name, phone, role, is_active FROM users WHERE email = ?"
      )
      .bind(email.toLowerCase())
      .first<{
        id: string;
        email: string;
        password_hash: string;
        first_name: string;
        last_name: string;
        phone: string | null;
        role: "customer" | "admin";
        is_active: number;
      }>();

    if (!user || !user.is_active) {
      return c.json({ error: "Unauthorized", message: "Invalid email or password." }, 401);
    }

    const passwordMatch = await verifyPassword(password, user.password_hash);
    if (!passwordMatch) {
      return c.json({ error: "Unauthorized", message: "Invalid email or password." }, 401);
    }

    const token = await createSession(c.env.DB, c.env.SESSION_SECRET, {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    });

    c.header("Set-Cookie", createSessionCookie(token));

    return c.json({
      message: "Logged in successfully.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
  }
});

// POST /api/auth/google (Google One-Tap / OAuth SSO)
authRouter.post("/google", async (c) => {
  try {
    const body = await c.req.json();
    let email = body.email;
    let firstName = body.firstName || "Google";
    let lastName = body.lastName || "User";

    // If client sent credential JWT from Google Identity Services
    if (body.credential) {
      try {
        const parts = body.credential.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(
            new TextDecoder().decode(
              Uint8Array.from(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0))
            )
          );
          if (payload.email) email = payload.email;
          if (payload.given_name) firstName = payload.given_name;
          if (payload.family_name) lastName = payload.family_name;
          else if (payload.name && !payload.family_name) {
            const nameParts = payload.name.split(" ");
            firstName = nameParts[0];
            lastName = nameParts.slice(1).join(" ") || "User";
          }
        }
      } catch (err) {
        // Fall back to direct body params
      }
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return c.json({ error: "Validation Failed", message: "A valid email is required from Google." }, 400);
    }

    email = email.toLowerCase().trim();

    // Check if user exists in D1
    let user = await c.env.DB
      .prepare("SELECT id, email, first_name, last_name, phone, role, is_active FROM users WHERE email = ?")
      .bind(email)
      .first<{
        id: string;
        email: string;
        first_name: string;
        last_name: string;
        phone: string | null;
        role: "customer" | "admin";
        is_active: number;
      }>();

    if (!user) {
      // Auto-provision new customer account verified via Google
      const userId = "usr_" + crypto.randomUUID().replace(/-/g, "").slice(0, 16);
      const randomPassword = "G_" + crypto.randomUUID();
      const passwordHash = await hashPassword(randomPassword);

      await c.env.DB
        .prepare(
          "INSERT INTO users (id, email, password_hash, first_name, last_name, role, email_verified) VALUES (?, ?, ?, ?, ?, 'customer', 1)"
        )
        .bind(userId, email, passwordHash, firstName, lastName)
        .run();

      user = {
        id: userId,
        email,
        first_name: firstName,
        last_name: lastName,
        phone: null,
        role: "customer",
        is_active: 1,
      };
    }

    if (!user.is_active) {
      return c.json({ error: "Forbidden", message: "This account has been disabled. Please contact support." }, 403);
    }

    const token = await createSession(c.env.DB, c.env.SESSION_SECRET, {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
    });

    c.header("Set-Cookie", createSessionCookie(token));

    return c.json({
      message: "Google authentication successful.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (err: any) {
    return c.json({ error: "Internal Server Error", message: err.message }, 500);
  }
});

// POST /api/auth/logout
authRouter.post("/logout", async (c) => {
  const user = c.get("user");
  if (user?.sessionId) {
    await destroySession(c.env.DB, user.sessionId);
  }
  c.header("Set-Cookie", deleteSessionCookie());
  return c.json({ message: "Logged out successfully." });
});
