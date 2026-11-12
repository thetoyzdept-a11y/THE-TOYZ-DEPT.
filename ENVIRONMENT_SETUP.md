# THE TOYZ DEPT. — Environment Setup & Local Development

## 1. Prerequisites
- **Node.js**: v20+ or v24+
- **Wrangler**: v4.161.0+ (installed locally via `npm` or globally via `npm i -g wrangler`)
- **Git**
- **Operating System**: macOS, Linux, or Windows (WSL recommended)

---

## 2. Environment Variables & Bindings

The application uses Cloudflare Worker bindings configured in `wrangler.jsonc` and optionally `.dev.vars` for local secrets.

### Variable Reference
| Variable | Scope | Description | Development Default |
| :--- | :--- | :--- | :--- |
| `DB` | D1 Binding | Relational database binding in Worker | `toyz-dept-db` (local SQLite) |
| `R2_BUCKET` | R2 Binding | Object storage bucket for STL/images | `toyz-dept-assets` |
| `ENVIRONMENT` | Var | Environment identifier | `"development"` |
| `SITE_URL` | Var | Canonical site URL | `"http://localhost:5173"` |
| `SESSION_SECRET` | Secret | Minimum 32-char key for signing sessions | (pre-configured dev secret) |
| `RAZORPAY_KEY_ID` | Secret | Razorpay API Key ID (`rzp_test_...`) | Optional in dev (mock adapter kicks in) |
| `RAZORPAY_KEY_SECRET`| Secret | Razorpay API Secret | Optional in dev |
| `RAZORPAY_WEBHOOK_SECRET` | Secret | Razorpay Webhook Secret | Optional in dev |

---

## 3. Local Setup Commands

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Initialize & Seed Local D1 Database
Execute the initial schema migration and realistic development fixtures:
```bash
# Run initial table schema migration
npm run db:migrate:local

# Seed with 10 sample products, admin account, test customer, and coupons
npm run db:seed:local
```

### Step 3: Start the Development Environment

You can run the full-stack system in two complementary ways:

#### Option A: Concurrent Development (Frontend Vite HMR + Backend Worker)
In terminal 1:
```bash
npm run worker:dev
# Starts Wrangler local worker server on http://127.0.0.1:8787
```

In terminal 2:
```bash
npm run dev
# Starts Vite frontend on http://localhost:5173 with instant HMR and API proxy
```

#### Option B: Unified Cloudflare Worker with Compiled Assets
```bash
npm run build
npm run start
# Wrangler serves both the compiled React SPA and the Worker backend from http://127.0.0.1:8787
```

---

## 4. Default Seed Credentials (Local Development)

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@thetoyzdept.in` | `Admin@123456` | Full administrative control, catalog, orders, custom quotes |
| **Customer** | `customer@thetoyzdept.in` | `Customer@123456` | Storefront buyer, order history, custom STL quote submissions |

---

## 5. Razorpay Development & Test Mode
When `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are left blank, the application automatically uses its **Development Mock Payment Adapter**:
- Orders generate synthetic checkout references (`order_mock_...`).
- Payment verification automatically succeeds with valid signatures.
- Orders transition cleanly to `payment_confirmed` and stock is decremented.
- No real card or UPI charges occur.
