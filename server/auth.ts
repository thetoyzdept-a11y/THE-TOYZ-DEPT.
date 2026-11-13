import type { Context, MiddlewareHandler } from "hono";
import type { Env, UserSession, Variables } from "./types";

const COOKIE_NAME = "toyz_session";

// ── Company Administrator Allowlist ─────────────────────────────────
export const COMPANY_ADMIN_EMAILS = [
  "thetoyzdept@gmail.com",
  "admin@thetoyzdept.in",
];

export function isCompanyAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return COMPANY_ADMIN_EMAILS.includes(email.toLowerCase().trim());
}

// ── PBKDF2 Password Hashing (Web Crypto API) ────────────────────────
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  const hashHex = Array.from(new Uint8Array(exported))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hashHex}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const parts = storedHash.split(":");
  if (parts.length !== 2) return false;
  const [salt, expectedHash] = parts;
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "HMAC", hash: "SHA-256", length: 256 },
    true,
    ["sign"]
  );
  const exported = await crypto.subtle.exportKey("raw", key);
  const computedHash = Array.from(new Uint8Array(exported))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return computedHash === expectedHash;
}

// ── UTF-8 Safe Base64 Helpers ────────────────────────────────────────
function toBase64Utf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function fromBase64Utf8(b64: string): string {
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return atob(b64);
  }
}

// ── Signed Token Utilities ──────────────────────────────────────────
async function signToken(payload: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  const sigHex = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${toBase64Utf8(payload)}.${sigHex}`;
}

async function verifyToken(token: string, secret: string): Promise<string | null> {
  try {
    const [b64, sigHex] = token.split(".");
    if (!b64 || !sigHex) return null;
    const payload = fromBase64Utf8(b64);
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = new Uint8Array(
      sigHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
    );
    const valid = await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(payload));
    return valid ? payload : null;
  } catch {
    return null;
  }
}

// ── Cookie Helpers ──────────────────────────────────────────────────
export function getCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function createSessionCookie(token: string, maxAgeSeconds = 60 * 60 * 24 * 30): string {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

export function deleteSessionCookie(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

// ── Session Management in D1 ────────────────────────────────────────
export async function createSession(
  db: D1Database,
  secret: string,
  user: { id: string; email: string; firstName: string; lastName: string; role: "customer" | "admin" }
): Promise<string> {
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await db
    .prepare("INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)")
    .bind(sessionId, user.id, expiresAt)
    .run();

  const payload = JSON.stringify({
    s: sessionId,
    u: user.id,
    e: user.email,
    f: user.firstName,
    l: user.lastName,
    r: user.role,
  });

  return signToken(payload, secret);
}

export async function destroySession(db: D1Database, sessionId: string): Promise<void> {
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(sessionId).run();
}

// ── Middlewares ─────────────────────────────────────────────────────
export const authMiddleware: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> = async (c, next) => {
  const cookieHeader = c.req.header("Cookie") || null;
  const token = getCookie(cookieHeader, COOKIE_NAME);

  if (token) {
    const verified = await verifyToken(token, c.env.SESSION_SECRET);
    if (verified) {
      try {
        const data = JSON.parse(verified);
        // Verify session still exists and has not expired in D1
        const sessionRow = await c.env.DB
          .prepare("SELECT user_id, expires_at FROM sessions WHERE id = ?")
          .bind(data.s)
          .first<{ user_id: string; expires_at: string }>();

        if (sessionRow && new Date(sessionRow.expires_at) > new Date()) {
          const isCompanyAdmin = isCompanyAdminEmail(data.e);
          const effectiveRole: "admin" | "customer" = (data.r === "admin" && isCompanyAdmin) ? "admin" : "customer";
          c.set("user", {
            userId: data.u,
            email: data.e,
            firstName: data.f,
            lastName: data.l,
            role: effectiveRole,
            sessionId: data.s,
          });
        }
      } catch {
        // Invalid session data
      }
    }
  }

  await next();
};

export const requireAuth: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized", message: "Please log in to continue." }, 401);
  }
  await next();
};

export const requireAdmin: MiddlewareHandler<{ Bindings: Env; Variables: Variables }> = async (c, next) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Unauthorized", message: "Authentication required to access administrative operations." }, 401);
  }
  const isAuthorizedAdmin = user.role === "admin" && isCompanyAdminEmail(user.email);
  if (!isAuthorizedAdmin) {
    return c.json({
      error: "Forbidden",
      message: "Access Denied: The Admin Operations Portal and API are strictly restricted to the official company administrator (thetoyzdept@gmail.com). Customer accounts have zero access permissions.",
    }, 403);
  }
  await next();
};
