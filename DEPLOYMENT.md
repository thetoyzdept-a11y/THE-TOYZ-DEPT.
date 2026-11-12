# THE TOYZ DEPT. — Cloudflare Deployment Guide

> **IMPORTANT**: This guide documents the exact commands for deploying THE TOYZ DEPT. to production on Cloudflare. As specified in the brief, **NO live deployment or chargeable infrastructure creation has occurred during this initial development milestone.**

---

## 1. Cloudflare Serverless Architecture

When deploying to production, the application utilizes:
1. **Cloudflare Workers**: Server-side routing, REST APIs, and auth processing.
2. **Cloudflare Workers Assets**: Fast global edge delivery of compiled React static assets (`./dist`).
3. **Cloudflare D1**: Distributed relational SQLite database (`toyz-dept-db`).
4. **Cloudflare R2**: Zero-egress object storage bucket (`toyz-dept-assets`) for customer STL/3MF files and product media.
5. **Custom Domain**: `https://thetoyzdept.in` with automated SSL and edge caching.

---

## 2. Pre-Deployment Cloudflare Provisioning

Run the following commands using the logged-in Wrangler CLI:

### 1. Authenticate with Cloudflare
```bash
npx wrangler login
```

### 2. Create Production D1 Database
```bash
npx wrangler d1 create toyz-dept-db
```
*Note the generated `database_id` from the output and update `wrangler.jsonc`:*
```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "toyz-dept-db",
      "database_id": "<YOUR_PRODUCTION_DATABASE_ID>"
    }
  ]
}
```

### 3. Create Production R2 Bucket
```bash
npx wrangler r2 bucket create toyz-dept-assets
```

### 4. Execute Remote Database Migrations & Seeds
```bash
# Execute schema migration on remote production D1
npx wrangler d1 execute toyz-dept-db --remote --file=./drizzle/migrations/0000_initial.sql

# Seed initial categories, sample products, and admin account
npx wrangler d1 execute toyz-dept-db --remote --file=./drizzle/seed.sql
```

### 5. Set Production Secrets
Encrypt sensitive secrets into Cloudflare Worker environment:
```bash
# Production session signing secret (min 32 random characters)
npx wrangler secret put SESSION_SECRET

# Production Razorpay Live Credentials
npx wrangler secret put RAZORPAY_KEY_ID
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put RAZORPAY_WEBHOOK_SECRET
```

---

## 3. Build & Deploy Commands

### Step 1: Compile the Production Frontend
```bash
npm run build
```
This compiles the React 18 application, transforms Tailwind CSS, and outputs optimized bundles to `./dist`.

### Step 2: Deploy Worker & Assets
```bash
npx wrangler deploy
```
Wrangler will package `server/index.ts`, upload `./dist` to Cloudflare Workers Assets, bind the D1 database and R2 bucket, and publish the worker globally.

---

## 4. Custom Domain Configuration (`https://thetoyzdept.in`)

1. In the Cloudflare Dashboard, navigate to **Workers & Pages** → **the-toyz-dept**.
2. Go to **Settings** → **Triggers** → **Custom Domains**.
3. Click **Add Custom Domain** and enter:
   ```
   thetoyzdept.in
   ```
   (and optionally `www.thetoyzdept.in`).
4. Cloudflare automatically handles DNS routing, provisions Universal SSL/TLS certificates, and activates HTTP/3 and Brotli compression.

---

## 5. Webhook Configuration (Razorpay Production)

1. Open your [Razorpay Dashboard](https://dashboard.razorpay.com/) → **Settings** → **Webhooks**.
2. Click **Add New Webhook**.
3. **Webhook URL**: `https://thetoyzdept.in/api/checkout/webhooks/razorpay`
4. **Secret**: Enter the value configured in `RAZORPAY_WEBHOOK_SECRET`.
5. **Active Events**:
   - `order.paid`
   - `payment.captured`
   - `payment.failed`
6. Click **Save**.
