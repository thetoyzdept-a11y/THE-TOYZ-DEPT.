import type { D1Database, R2Bucket } from "@cloudflare/workers-types";

export interface Env {
  DB: D1Database;
  R2_BUCKET: R2Bucket;
  ENVIRONMENT: string;
  SITE_URL: string;
  SESSION_SECRET: string;
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
  RAZORPAY_WEBHOOK_SECRET?: string;
  SHIPROCKET_EMAIL?: string;
  SHIPROCKET_PASSWORD?: string;
  SHIPROCKET_PICKUP_LOCATION?: string;
  ASSETS?: Fetcher;
}

export interface UserSession {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "customer" | "admin";
  sessionId: string;
}

export type Variables = {
  user?: UserSession;
  sessionToken?: string;
};
