# THE TOYZ DEPT. — E-Commerce Platform

> **"THINGS YOU DIDN'T KNOW YOU NEEDED."**  
> Official Domain: [https://thetoyzdept.in](https://thetoyzdept.in)  
> Studio Origin: Indiranagar, Bengaluru, Karnataka, India  
> Currency: INR (₹) • Timezone: Asia/Kolkata (IST)

---

## 1. Project Overview

**THE TOYZ DEPT.** is a complete, production-grade e-commerce application designed for deployment on **Cloudflare's serverless infrastructure**.

The brand creates and curates tactile 3D-printed mechanical collectibles, brutalist desk accessories, architectural home objects, and custom on-demand CAD fabrication.

The application contains **three distinct experiences**:
1. **Public Customer Storefront**: High-impact neo-brutalist shopping experience with live search, department filtering, interactive product specification pages, dynamic variant pricing, real-time cart tray with free-shipping meter, and Razorpay checkout.
2. **Authenticated Customer Dashboard**: Complete customer command center with PBKDF2 Web Crypto authentication, order status tracking with timeline milestones, custom 3D printing quotation review and 1-click acceptance, saved shipping address manager, and saved wishlist.
3. **Protected Administration Dashboard**: Real-world operations console backed by `requireAdmin` role authorization, displaying real D1 revenue analytics, an 8-stage manufacturing order lifecycle updater, product catalog CRUD, custom 3D model CAD file inspection and quotation engine, and variant inventory monitoring with low-stock warnings.

---

## 2. Architecture & Tech Stack

```
                          https://thetoyzdept.in
                                   │
                    ┌──────────────┴──────────────┐
                    │  Cloudflare Global Edge     │
                    └──────────────┬──────────────┘
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
  ┌───────────────────┐                         ┌───────────────────┐
  │  Workers Assets   │                         │ Cloudflare Worker │
  │ (React SPA, Vite) │                         │  (Hono REST API)  │
  └───────────────────┘                         └─────────┬─────────┘
                                                          │
                                ┌─────────────────────────┴─────────────────────────┐
                                ▼                                                   ▼
                    ┌───────────────────────┐                           ┌───────────────────────┐
                    │     Cloudflare D1     │                           │     Cloudflare R2     │
                    │  (Relational SQLite)  │                           │   (Object Storage)    │
                    └───────────────────────┘                           └───────────────────────┘
```

- **Runtime & Edge Compute**: Cloudflare Workers
- **Backend API**: Hono v4 (lightweight, zero-overhead Web Standards framework)
- **Database**: Cloudflare D1 (serverless relational SQLite with foreign keys and ACID transactions)
- **Object Storage**: Cloudflare R2 (for customer-submitted `.stl` / `.3mf` files and media)
- **Frontend SPA**: React 18, Vite 6, React Router DOM 7
- **Styling**: Tailwind CSS 3.4 (Neo-brutalist theme with Space Grotesk, Inter, and JetBrains Mono)
- **Security & Auth**: PBKDF2 Web Crypto hashing (100,000 iterations), signed HTTP-only cookies
- **Payment Processing**: Razorpay with server-side HMAC-SHA256 signature verification and development mock adapter

---

## 3. Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Database Migrations & Seeds
Execute the D1 SQLite schema and populate realistic commercial development fixtures:
```bash
# Execute schema migration in local D1 SQLite
npm run db:migrate:local

# Seed with 10 sample products, admin account, customer account, and coupons
npm run db:seed:local
```

### 3. Start the Application

You can run the application in two ways:

#### Option A: Concurrent Development (Recommended for Coding)
```bash
# Terminal 1: Start Wrangler local worker server (port 8787)
npm run worker:dev

# Terminal 2: Start Vite frontend dev server (port 5173 with proxy to 8787)
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

#### Option B: Unified Cloudflare Worker with Compiled Static Assets
```bash
npm run build
npm run start
```
Wrangler will serve the full-stack application and API at **[http://127.0.0.1:8787](http://127.0.0.1:8787)**.

---

## 4. Default Seed Credentials (Local Development)

| Account Role | Email Address | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@thetoyzdept.in` | `Admin@123456` | Full administrative console at `/admin` (revenue stats, order status updates, catalog creation, custom quotation dispatch) |
| **Customer** | `customer@thetoyzdept.in` | `Customer@123456` | Customer portal at `/account` (order history, custom quotes, address book, wishlist) |

*A "Quick Test Credentials" switcher is also provided directly on the `/login` page for seamless local evaluation.*

---

## 5. Verification & Testing Commands

To verify that the application satisfies all technical constraints and runs cleanly:

```bash
# 1. Verify TypeScript type safety across both frontend and backend (0 errors)
npm run typecheck

# 2. Build the production React application to ./dist
npm run build

# 3. Query local Cloudflare D1 database
npx wrangler d1 execute toyz-dept-db --local --command="SELECT id, name, base_price, status FROM products LIMIT 5;"

# 4. Check Worker health endpoint
curl http://127.0.0.1:8787/api/health
```

---

## 6. Directory Structure

```
├── app/                      # Schema and database definitions
│   └── lib/db/schema.ts      # Drizzle ORM schema specification
├── dist/                     # Compiled production assets for Cloudflare Workers Assets
├── docs/                     # Project documentation
│   ├── ARCHITECTURE.md       # Topology and data flow diagrams
│   ├── API_DOCUMENTATION.md  # Comprehensive REST API reference
│   ├── BRAND_GUIDELINES.md   # Neo-brutalist visual design tokens & type system
│   ├── DATABASE_SCHEMA.md    # D1 SQLite table schemas and indexes
│   ├── DEPLOYMENT.md         # Production Cloudflare deployment guide
│   ├── ENVIRONMENT_SETUP.md  # Local dev environment bindings guide
│   ├── IMPLEMENTATION_PLAN.md# Feature completion & QA test matrix
│   └── PROJECT_BRIEF.md      # Master product and business brief
├── drizzle/                  # Database migrations and seed fixtures
│   ├── migrations/
│   │   └── 0000_initial.sql  # D1 SQLite table DDL
│   └── seed.sql              # Realistic seed fixtures (10 products, users, orders)
├── public/                   # Static assets (favicons, SVGs, product graphics)
│   ├── favicon.svg
│   └── images/products/      # Custom SVG product technical drawings
├── server/                   # Cloudflare Worker Backend (Hono)
│   ├── auth.ts               # PBKDF2 hashing, cookie session management & RBAC
│   ├── index.ts              # Worker entry point & route registration
│   ├── types.ts              # Worker environment bindings & session types
│   └── routes/
│       ├── admin.ts          # Protected administrative management & revenue stats
│       ├── auth.ts           # Customer register, login, session validation
│       ├── cart.ts           # Server-side cart calculations & coupon validation
│       ├── checkout.ts       # Server-authoritative checkout & Razorpay flow
│       ├── customer.ts       # Customer dashboard, orders, addresses, wishlist
│       ├── custom-requests.ts# Custom 3D model upload to R2 & quotation workflow
│       └── products.ts       # Catalogue search, filtering, and detail lookups
├── src/                      # Frontend Application (React 18 + Vite + Tailwind)
│   ├── App.tsx               # Client-side router & route registration
│   ├── main.tsx              # React DOM mounting
│   ├── index.css             # Tailwind imports & neo-brutal component classes
│   ├── components/
│   │   └── layout/           # Header, Footer, CartDrawer
│   ├── context/              # AuthContext & CartContext
│   ├── lib/                  # Typed API client (`api.ts`) & utilities (`utils.ts`)
│   └── pages/                # Storefront, Dashboard, Checkout, Admin, Auth, Static
├── wrangler.jsonc            # Cloudflare Worker, D1, R2, and Assets configuration
├── vite.config.ts            # Vite configuration with API proxy
├── tailwind.config.js        # Brand color palette and neo-brutalist shadows
└── tsconfig.json             # TypeScript compiler configuration
```

---

## 7. Production Deployment to Cloudflare

When ready to publish to production on Cloudflare:
```bash
# 1. Login to Cloudflare
npx wrangler login

# 2. Create remote production D1 database and R2 bucket
npx wrangler d1 create toyz-dept-db
npx wrangler r2 bucket create toyz-dept-assets

# 3. Apply schema migration and seed remote D1
npx wrangler d1 execute toyz-dept-db --remote --file=./drizzle/migrations/0000_initial.sql
npx wrangler d1 execute toyz-dept-db --remote --file=./drizzle/seed.sql

# 4. Set production secrets
npx wrangler secret put SESSION_SECRET
npx wrangler secret put RAZORPAY_KEY_ID
npx wrangler secret put RAZORPAY_KEY_SECRET
npx wrangler secret put RAZORPAY_WEBHOOK_SECRET

# 5. Build frontend and deploy globally
npm run build
npx wrangler deploy
```
*Refer to [DEPLOYMENT.md](file:///Users/abhishekholagundi/Desktop/THE%20BOYZ%20DEPT./DEPLOYMENT.md) for custom domain setup for `thetoyzdept.in`.*
