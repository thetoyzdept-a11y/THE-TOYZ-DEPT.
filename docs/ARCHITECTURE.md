# THE TOYZ DEPT. — System Architecture & Cloudflare Design

## 1. Architectural Overview & Cloudflare Topology

THE TOYZ DEPT. is engineered as a modern, unified serverless application running entirely within the Cloudflare ecosystem.

```
                    ┌──────────────────────────────────────────────┐
                    │               CLIENT DEVICES                 │
                    │   (Desktop, Mobile 320px–430px, Tablets)     │
                    └──────────────────────┬───────────────────────┘
                                           │
                                    HTTPS Requests
                                           │
                                           ▼
                    ┌──────────────────────────────────────────────┐
                    │       CLOUDFLARE GLOBAL EDGE NETWORK         │
                    │         (https://thetoyzdept.in)             │
                    └──────────────────────┬───────────────────────┘
                                           │
                     ┌─────────────────────┴──────────────────────┐
                     │                                            │
                     ▼                                            ▼
       ┌───────────────────────────┐                ┌───────────────────────────┐
       │     WORKERS ASSETS        │                │    CLOUDFLARE WORKER      │
       │    (Compiled React SPA)   │                │     (Hono REST API)       │
       │  • HTML, CSS, Bundled JS  │                │  • Server-authoritative   │
       │  • Global Edge Caching    │                │  • Cookie sessions        │
       └───────────────────────────┘                └─────────────┬─────────────┘
                                                                  │
                                   ┌──────────────────────────────┴──────────────────────────────┐
                                   │                                                             │
                                   ▼                                                             ▼
                    ┌─────────────────────────────┐                               ┌─────────────────────────────┐
                    │        CLOUDFLARE D1        │                               │        CLOUDFLARE R2        │
                    │     (Relational SQLite)     │                               │      (Object Storage)       │
                    │  • Users & Sessions         │                               │  • Product photography      │
                    │  • Products & Variants      │                               │  • Customer STL/3MF models  │
                    │  • Carts & Orders           │                               │  • Private CAD downloads    │
                    │  • Quotations & Payments    │                               └─────────────────────────────┘
                    └─────────────────────────────┘
```

---

## 2. Technology Selection & Justification

| Layer | Selected Technology | Technical Justification |
| :--- | :--- | :--- |
| **Edge Compute** | **Cloudflare Workers** | 0ms cold starts, native global distribution, integrated bindings for D1, R2, and KV. Eliminates traditional VPS maintenance and operating costs. |
| **API Framework** | **Hono v4** | Lightweight (14kB), purpose-built for Cloudflare Workers/V8 isolates, type-safe middleware, zero external Node.js binary dependencies. |
| **Database** | **Cloudflare D1 (SQLite)** | Native Cloudflare serverless relational database. Provides ACID compliance, foreign key constraints, transactional integrity, and zero connection pooling overhead. |
| **Object Storage** | **Cloudflare R2** | S3-compatible, zero egress fees, direct Worker stream bindings for customer 3D models (.stl/.3mf) and product media. |
| **Frontend SPA** | **React 18 + Vite 6 + React Router 7** | Ultra-fast build times (<1s), hot module replacement in local development, client-side routing, and seamless mobile responsiveness. |
| **Styling** | **Tailwind CSS 3.4** | Utility-first, comprehensive neo-brutalist design tokens (ink borders, brutal shadows, high-voltage accents), zero runtime CSS overhead. |
| **Auth & Crypto** | **Web Crypto API (PBKDF2)** | 100,000 iterations of SHA-256 with cryptographic salting. Secure HTTP-only Lax signed session cookies. Runs natively inside Cloudflare Workers without bcrypt native binaries. |
| **Payments** | **Razorpay + Mock Adapter** | Server-authoritative order creation, HMAC-SHA256 signature verification, idempotent webhook processing. Complete with mock adapter for local testing. |

---

## 3. Data Flow & Security Boundaries

### A. Cart & Checkout (Server-Authoritative)
1. The client adds an item to cart (`POST /api/cart/items`).
2. The server queries `products` and `product_variants` in D1 to verify active status and stock availability.
3. The server computes all prices, discounts, and shipping thresholds server-side. **Client-submitted price tampering is architecturally impossible.**
4. When checking out (`POST /api/checkout/create-order`), the server queries the database cart items, re-verifies stock, computes the exact total in paise, and creates an order in D1 with `pending` status.
5. The server creates a Razorpay order (or development mock order) with the server-verified amount.
6. The payment is verified server-side (`POST /api/checkout/verify`) using HMAC-SHA256. Upon verification, the order transitions to `payment_confirmed` and inventory stock is atomically decremented.

### B. Custom 3D Model Ingestion
1. Customer uploads an STL/3MF model via `multipart/form-data`.
2. The server validates the file extension (`.stl`, `.3mf`, `.obj`, `.step`) and enforces a 50MB file size ceiling.
3. The server generates a unique R2 storage key: `custom-models/{userId}/{requestId}_{fileName}`.
4. The server pipes the file stream directly into `c.env.R2_BUCKET`.
5. File metadata (size, format, key) is linked to the custom request record in D1.
6. Download access is gated by `requireAuth` and strictly restricted to the owning customer or authorized administrators.

---

## 4. Local Development vs. Production Parity
- **Local Dev**: Wrangler local runtime (`wrangler dev server/index.ts`) emulates D1 and R2 using local SQLite files in `.wrangler/state/v3/`. Vite dev server (`http://localhost:5173`) proxies `/api/*` requests to Wrangler on port 8787.
- **Production**: A single `wrangler deploy` publishes the Worker code to Cloudflare Workers, connects to the production D1 database and R2 bucket, and serves the pre-compiled static assets from `./dist` using Cloudflare Workers Assets.
