# THE TOYZ DEPT. — Project Brief & Requirements

## 1. Executive Summary & Brand Positioning
- **Brand Name**: THE TOYZ DEPT.
- **Production Domain**: `https://thetoyzdept.in`
- **Official Tagline**: *"THINGS YOU DIDN'T KNOW YOU NEEDED."*
- **Origin & Studio**: Indiranagar, Bengaluru, Karnataka, India
- **Currency & Market**: Indian Rupee (INR ₹), Primary Market: India
- **Timezone**: Asia/Kolkata (`IST`, `UTC+05:30`)

THE TOYZ DEPT. is an independent, design-led 3D-printed products and creative objects brand. The company operates at the intersection of parametric industrial design, tactile play, and on-demand precision additive manufacturing.

### Brand Principles
1. **Design-Led, Not a Commodity Print Farm**: Not an anonymous job-shop. THE TOYZ DEPT. is an intentional consumer brand with personality, distinctive art-direction, and recognizable industrial aesthetics.
2. **Neo-Brutalism with Editorial Polish**: Bold ink borders (`#191919`), warm cream grounding (`#F5F1E8`), high-voltage acid lime accents (`#D9FF43`), and sharp coral energy (`#FF694B`). High typographic contrast with Space Grotesk, Inter, and JetBrains Mono.
3. **Tactile & Mechanical**: Every object is designed to be touched, posed, and displayed—featuring fluid interlocking ball joints, parametric gyroid drainage, or weighted desktop stances.
4. **Local-First & Serverless**: Built natively for Cloudflare Workers, Cloudflare D1 (relational SQLite), and Cloudflare R2 (object storage).

---

## 2. Product Catalog Categories
1. **Collectibles**: Articulated dragons, mecha flexi dinosaurs, crystal serpents, and low-poly polygonal sculptures.
2. **Desk Objects**: Cable management docks, counter-balanced headphone stands, kinetic gear cubes, and Bauhaus tool caddies.
3. **Home Stuff**: Brutalist geometric planters with hidden drainage reservoirs, hexagonal magnetic wall mounts, and sculptural vessels.
4. **Custom Creations**: Customer CAD/STL model quotation and additive fabrication service.

---

## 3. Platform Experiences & Scope

### Experience A: Public Customer Storefront
- **Brand Announcement Ticker**: Real-time store benefits (Free shipping above ₹999, Bengaluru design studio, Indian manufacturing).
- **Responsive Header & Drawer**: Wordmark, category navigation, live search overlay, customer account link, and real-time sliding cart drawer.
- **Neo-Brutalist Hero Section**: Headline, manifesto, flagship product showcase card, and animated ribbon ticker.
- **Curated Category Grid**: 4 departments with item counts and quick navigation.
- **Featured Drops / Latest Off Bed**: Responsive card grid with savings badges, material tags, and quick add-to-cart.
- **Brand Story & Manifesto**: Studio philosophy, recyclable PLA+ commitment, and Bengaluru origin.
- **4-Stage Process Flow**: 01 Design (CAD) → 02 Slice (Toolpaths) → 03 Print (FDM/SLA) → 04 Finish (QC & Deburr).
- **Custom 3D Print CTA**: High-visibility callout leading directly to the 3D model uploader.
- **Customer Field Reports**: Genuine reviews from verified buyers.
- **Shop / Catalogue**: Filter by department, keyword search, price/date sort, in-stock badges.
- **Product Detail View**: Multi-image selector, variant selector with dynamic price adjustment, stock alert (low stock warning / sold out), technical specifications table, reviews feed, review submission form, and complementary recommendations.
- **Shopping Bag / Cart Drawer**: Live D1 cart sync, free shipping progress bar, coupon code validation (`WELCOME10`, `TOYZ20`), quantity adjustments.
- **Checkout**: Server-authoritative calculations, Indian address validation, Razorpay checkout with instant development mock fallback adapter.
- **Order Confirmation & Tracker**: Real-time order timeline tracking.

### Experience B: Authenticated Customer Dashboard
- **Secure Authentication**: Registration and login using PBKDF2 Web Crypto password hashing and HTTP-only signed cookie sessions.
- **Overview & Stats**: Active orders count, quotations pending, saved addresses.
- **Orders & Invoices**: Full historical orders list, status badges, tracking numbers, and invoice itemization.
- **Custom 3D Printing Quotations**: Track submitted STL requests, review itemized quotation breakdowns (material, machine hours, post-processing), 1-click accept or decline.
- **Saved Shipping Addresses**: Add, edit, remove, and toggle default shipping destinations.
- **Saved Wishlist**: Bookmark drops and transfer items directly into the cart tray.
- **Profile Info**: Name, phone, and account security details.

### Experience C: Protected Administration Dashboard
- **Backend Role Guard**: Protected via `requireAdmin` middleware; rejects non-admins with 401/403.
- **Overview & Revenue Analytics**: Real D1 financial calculations (total captured revenue, pending order count, completed orders, registered customers, low-stock warnings, and recent order stream).
- **Product Management**: Create, edit, and archive products; assign prices in paise, set materials, dimensions, and manage image URLs.
- **Order Lifecycle Management**: Transition orders along the 8-stage manufacturing flow (`pending` → `payment_confirmed` → `processing` → `printing` → `quality_check` → `packed` → `shipped` → `delivered`), enter air waybill tracking numbers, and attach internal notes.
- **Custom 3D Printing Quotation Engine**: Review customer-uploaded STL/3MF files, download CAD files securely from R2, prepare itemized quotations with breakdown and validity periods, and transmit quotes directly to customer dashboards.
- **Inventory & Stock**: Variant-level stock tracking with low-stock alerts and inline quantity adjustments.
- **Customer Roster**: View customer records, lifetime order totals, and total spend.
- **Store Settings**: Real-time adjustment of shipping thresholds, tax rates, studio address, and contact details.

---

## 4. Custom 3D Printing Workflow (Differentiating Feature)
1. Customer navigates to `/custom-prints`.
2. Customer uploads `.stl`, `.3mf`, `.obj`, or `.step` file (up to 50MB).
3. Customer selects material (PLA+, PETG, Silk PLA, Carbon Fiber, Tough SLA Resin), colorway, and quantity.
4. Customer adds specific dimensional requirements or tolerance notes.
5. System validates file format, stores model in private Cloudflare R2 bucket (`custom-models/{userId}/...`), and records request in D1.
6. Admin inspects geometry, calculates slicing toolpaths, material weight, and machine time.
7. Admin prepares an itemized quotation via the Admin Console.
8. Customer receives notification, reviews cost breakdown in their dashboard, and accepts the quote.
9. Upon acceptance, the order is scheduled for production.
