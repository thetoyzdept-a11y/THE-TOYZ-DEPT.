# THE TOYZ DEPT. — Serverless REST API Reference

Base URL in Local Development: `http://localhost:5173/api` or `http://127.0.0.1:8787/api`  
Base URL in Production: `https://thetoyzdept.in/api`

---

## 1. Authentication & Session Management

All authenticated routes utilize secure, signed HTTP-only cookies (`toyz_session`).

### `POST /api/auth/register`
Creates a customer account and establishes an authenticated session.
- **Payload**:
  ```json
  {
    "firstName": "Rohan",
    "lastName": "Verma",
    "email": "rohan@example.com",
    "phone": "+91 98765 43210",
    "password": "Password@123"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "message": "Account created successfully.",
    "user": {
      "id": "usr_...",
      "email": "rohan@example.com",
      "firstName": "Rohan",
      "lastName": "Verma",
      "role": "customer"
    }
  }
  ```

### `POST /api/auth/login`
Authenticates credentials against PBKDF2 hash and returns a signed session cookie.
- **Payload**:
  ```json
  {
    "email": "admin@thetoyzdept.in",
    "password": "Admin@123456"
  }
  ```

### `GET /api/auth/me`
Returns the currently authenticated user or `{ "user": null }`.

### `POST /api/auth/logout`
Destroys the session in Cloudflare D1 and clears the session cookie.

---

## 2. Storefront & Catalogue

### `GET /api/categories`
Returns all visible categories along with live product counts.

### `GET /api/products`
Retrieves filtered and sorted products.
- **Query Parameters**:
  - `category` (string, slug): e.g. `collectibles`, `desk-objects`
  - `search` (string): Full-text keyword match on name, material, and description
  - `sort` (string): `featured` (default), `price-asc`, `price-desc`, `newest`
  - `featured` (boolean): `true` to return only highlighted homepage drops

### `GET /api/products/:slug`
Returns full product detail with variants, images, approved reviews, and related products.

---

## 3. Shopping Cart

### `GET /api/cart`
Returns the current cart with server-calculated subtotals, shipping thresholds, and applied coupon discounts.
- **Optional Query**: `?coupon=WELCOME10`

### `POST /api/cart/items`
Adds an item to the cart or increments existing quantity with server-side stock verification.
- **Payload**:
  ```json
  {
    "productId": "prod_001",
    "variantId": "var_001_lime",
    "quantity": 1
  }
  ```

### `PATCH /api/cart/items/:id`
Updates item quantity (`quantity: 0` deletes item).

### `DELETE /api/cart/items/:id`
Removes an item from the cart.

---

## 4. Checkout & Razorpay Payments

### `POST /api/checkout/create-order`
Creates a server-authoritative order in Cloudflare D1, verifies inventory, computes discounts and shipping fees, and creates a Razorpay order (or development mock order).
- **Payload**:
  ```json
  {
    "fullName": "Priya Sharma",
    "email": "priya@example.com",
    "phone": "+91 99887 76655",
    "addressLine1": "Plot 14, 5th Cross",
    "city": "Bengaluru",
    "state": "Karnataka",
    "postalCode": "560034",
    "couponCode": "WELCOME10"
  }
  ```

### `POST /api/checkout/verify`
Validates the Razorpay HMAC-SHA256 signature, transitions the order status to `payment_confirmed`, decrements stock from `product_variants`, and logs status history.

### `POST /api/webhooks/razorpay`
Idempotent webhook processor verifying `X-Razorpay-Signature`. Records raw payload in `payment_events` table and reconciles order states.

### `GET /api/checkout/track`
Public tracking lookup by order reference number (e.g. `?number=TTD-2026-8912`).

---

## 5. Custom 3D Printing Pipeline

### `POST /api/custom-requests`
Submits a custom 3D printing request with model file upload.
- **Headers**: `multipart/form-data`
- **Fields**:
  - `file`: `.stl`, `.3mf`, `.obj`, or `.step` binary (streamed to R2)
  - `description`: String
  - `material`: String
  - `color`: String
  - `quantity`: Number
  - `name`, `email`, `phone` (if guest)

### `GET /api/custom-requests/my`
Retrieves customer's submitted 3D requests with active quotation status.

### `POST /api/custom-requests/:id/quotations/:quotationId/respond`
Customer accepts or rejects the prepared quotation (`{ "action": "accepted" }`).

### `GET /api/custom-requests/:id/download-file`
Secure download endpoint streaming the uploaded 3D CAD model directly from Cloudflare R2. (Restricted to owner or admin).

---

## 6. Administration APIs (Protected: `role = admin`)

- `GET /api/admin/overview`: Real D1 metrics (revenue in paise, order counts, customer count, inventory alerts).
- `GET /api/admin/products`: Full product roster including drafts and inventory counts.
- `POST /api/admin/products`: Creates a new product with variants and pricing.
- `PUT /api/admin/products/:id`: Updates an existing product.
- `DELETE /api/admin/products/:id`: Soft-archives a product (`status = 'archived'`).
- `GET /api/admin/orders`: List orders filtered by status (`pending`, `printing`, etc.).
- `PATCH /api/admin/orders/:id/status`: Transitions order lifecycle, sets courier tracking waybill, and logs internal notes.
- `GET /api/admin/custom-requests`: Lists all customer 3D models with quotation statuses.
- `POST /api/admin/quotations`: Prepares and sends itemized commercial quotation to customer.
- `GET /api/admin/inventory`: Variant-level stock monitoring and low-stock alerts.
- `PATCH /api/admin/inventory/:variantId`: Inline stock quantity adjustment.
- `GET /api/admin/customers`: Customer database with order counts and lifetime value.
- `GET /api/admin/settings` & `POST /api/admin/settings`: Store configurations.
