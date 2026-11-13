import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ═══════════════════════════════════════════════════════════
// USERS & AUTH
// ═══════════════════════════════════════════════════════════

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    phone: text("phone"),
    role: text("role", { enum: ["customer", "admin"] })
      .notNull()
      .default("customer"),
    isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
    emailVerified: integer("email_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("users_email_idx").on(table.email),
    index("users_role_idx").on(table.role),
  ]
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: text("expires_at").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("sessions_user_idx").on(table.userId),
    index("sessions_expires_idx").on(table.expiresAt),
  ]
);

export const addresses = sqliteTable(
  "addresses",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    label: text("label").default("Home"),
    fullName: text("full_name").notNull(),
    phone: text("phone").notNull(),
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    state: text("state").notNull(),
    postalCode: text("postal_code").notNull(),
    country: text("country").notNull().default("India"),
    isDefault: integer("is_default", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("addresses_user_idx").on(table.userId)]
);

// ═══════════════════════════════════════════════════════════
// PRODUCTS & CATALOGUE
// ═══════════════════════════════════════════════════════════

export const categories = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    image: text("image"),
    sortOrder: integer("sort_order").notNull().default(0),
    isVisible: integer("is_visible", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [uniqueIndex("categories_slug_idx").on(table.slug)]
);

export const products = sqliteTable(
  "products",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    shortDescription: text("short_description"),
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null",
    }),
    basePrice: integer("base_price").notNull(), // stored in paise (INR * 100)
    comparePrice: integer("compare_price"), // strikethrough price in paise
    material: text("material"),
    dimensions: text("dimensions"),
    weight: real("weight"), // in grams
    status: text("status", {
      enum: ["draft", "active", "archived"],
    })
      .notNull()
      .default("draft"),
    isFeatured: integer("is_featured", { mode: "boolean" })
      .notNull()
      .default(false),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("products_slug_idx").on(table.slug),
    index("products_category_idx").on(table.categoryId),
    index("products_status_idx").on(table.status),
    index("products_featured_idx").on(table.isFeatured),
  ]
);

export const productImages = sqliteTable(
  "product_images",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    url: text("url").notNull(), // R2 object key or URL
    altText: text("alt_text"),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: integer("is_primary", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("product_images_product_idx").on(table.productId)]
);

export const productVariants = sqliteTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(), // e.g., "Red / Large"
    sku: text("sku"),
    color: text("color"),
    size: text("size"),
    priceModifier: integer("price_modifier").notNull().default(0), // in paise, added to base
    stock: integer("stock").notNull().default(0),
    lowStockThreshold: integer("low_stock_threshold").notNull().default(5),
    isActive: integer("is_active", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("variants_product_idx").on(table.productId),
    uniqueIndex("variants_sku_idx").on(table.sku),
  ]
);

// ═══════════════════════════════════════════════════════════
// CART
// ═══════════════════════════════════════════════════════════

export const carts = sqliteTable(
  "carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    sessionId: text("session_id"), // for guest carts
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("carts_user_idx").on(table.userId),
    index("carts_session_idx").on(table.sessionId),
  ]
);

export const cartItems = sqliteTable(
  "cart_items",
  {
    id: text("id").primaryKey(),
    cartId: text("cart_id")
      .notNull()
      .references(() => carts.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    quantity: integer("quantity").notNull().default(1),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("cart_items_cart_idx").on(table.cartId)]
);

// ═══════════════════════════════════════════════════════════
// ORDERS
// ═══════════════════════════════════════════════════════════

export const orders = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    orderNumber: text("order_number").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    status: text("status", {
      enum: [
        "pending",
        "payment_confirmed",
        "processing",
        "printing",
        "quality_check",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
    })
      .notNull()
      .default("pending"),
    subtotal: integer("subtotal").notNull(), // in paise
    shippingCost: integer("shipping_cost").notNull().default(0),
    taxAmount: integer("tax_amount").notNull().default(0),
    discountAmount: integer("discount_amount").notNull().default(0),
    totalAmount: integer("total_amount").notNull(), // in paise
    couponCode: text("coupon_code"),

    // Shipping address snapshot
    shippingName: text("shipping_name").notNull(),
    shippingPhone: text("shipping_phone").notNull(),
    shippingAddress1: text("shipping_address_1").notNull(),
    shippingAddress2: text("shipping_address_2"),
    shippingCity: text("shipping_city").notNull(),
    shippingState: text("shipping_state").notNull(),
    shippingPostalCode: text("shipping_postal_code").notNull(),
    shippingCountry: text("shipping_country").notNull().default("India"),

    // Tracking & Logistics
    trackingNumber: text("tracking_number"),
    trackingUrl: text("tracking_url"),
    shippedAt: text("shipped_at"),
    deliveredAt: text("delivered_at"),

    // Customer & Logistics Mapping
    shippingEmail: text("shipping_email"),
    shiprocketOrderId: text("shiprocket_order_id"),
    shiprocketShipmentId: text("shiprocket_shipment_id"),
    courierName: text("courier_name"),
    awbCode: text("awb_code"),
    pickupScheduledDate: text("pickup_scheduled_date"),
    pickupTokenNumber: text("pickup_token_number"),
    labelUrl: text("label_url"),
    manifestUrl: text("manifest_url"),
    invoiceUrl: text("invoice_url"),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    paymentStatus: text("payment_status").default("created"),
    paymentMethod: text("payment_method"),

    // Admin
    internalNotes: text("internal_notes"),

    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("orders_number_idx").on(table.orderNumber),
    index("orders_user_idx").on(table.userId),
    index("orders_status_idx").on(table.status),
    index("orders_created_idx").on(table.createdAt),
  ]
);

export const orderItems = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id),
    variantId: text("variant_id").references(() => productVariants.id),
    // Snapshot at time of order
    productName: text("product_name").notNull(),
    variantName: text("variant_name"),
    unitPrice: integer("unit_price").notNull(), // in paise
    quantity: integer("quantity").notNull(),
    totalPrice: integer("total_price").notNull(), // in paise
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("order_items_order_idx").on(table.orderId)]
);

export const orderStatusHistory = sqliteTable(
  "order_status_history",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: text("from_status"),
    toStatus: text("to_status").notNull(),
    note: text("note"),
    changedBy: text("changed_by").references(() => users.id),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("order_history_order_idx").on(table.orderId)]
);

// ═══════════════════════════════════════════════════════════
// PAYMENTS
// ═══════════════════════════════════════════════════════════

export const payments = sqliteTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id),
    razorpayOrderId: text("razorpay_order_id"),
    razorpayPaymentId: text("razorpay_payment_id"),
    razorpaySignature: text("razorpay_signature"),
    amount: integer("amount").notNull(), // in paise
    currency: text("currency").notNull().default("INR"),
    status: text("status", {
      enum: [
        "created",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "partially_refunded",
      ],
    })
      .notNull()
      .default("created"),
    method: text("method"), // card, upi, netbanking, etc.
    refundAmount: integer("refund_amount").default(0),
    refundId: text("refund_id"),
    failureReason: text("failure_reason"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("payments_order_idx").on(table.orderId),
    uniqueIndex("payments_rzp_order_idx").on(table.razorpayOrderId),
    index("payments_rzp_payment_idx").on(table.razorpayPaymentId),
  ]
);

export const paymentEvents = sqliteTable(
  "payment_events",
  {
    id: text("id").primaryKey(),
    paymentId: text("payment_id").references(() => payments.id),
    eventType: text("event_type").notNull(),
    eventId: text("event_id"), // Razorpay webhook event ID for idempotency
    payload: text("payload"), // JSON string of webhook payload
    processedAt: text("processed_at"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("payment_events_payment_idx").on(table.paymentId),
    uniqueIndex("payment_events_event_id_idx").on(table.eventId),
  ]
);

// ═══════════════════════════════════════════════════════════
// CUSTOM PRINTING REQUESTS
// ═══════════════════════════════════════════════════════════

export const customRequests = sqliteTable(
  "custom_requests",
  {
    id: text("id").primaryKey(),
    requestNumber: text("request_number").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    description: text("description").notNull(),
    material: text("material"),
    color: text("color"),
    quantity: integer("quantity").notNull().default(1),
    additionalNotes: text("additional_notes"),
    status: text("status", {
      enum: [
        "submitted",
        "under_review",
        "quoted",
        "accepted",
        "rejected",
        "in_production",
        "completed",
        "cancelled",
      ],
    })
      .notNull()
      .default("submitted"),
    adminNotes: text("admin_notes"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    uniqueIndex("custom_requests_number_idx").on(table.requestNumber),
    index("custom_requests_user_idx").on(table.userId),
    index("custom_requests_status_idx").on(table.status),
  ]
);

export const customRequestFiles = sqliteTable(
  "custom_request_files",
  {
    id: text("id").primaryKey(),
    requestId: text("request_id")
      .notNull()
      .references(() => customRequests.id, { onDelete: "cascade" }),
    fileName: text("file_name").notNull(),
    fileType: text("file_type").notNull(), // stl, 3mf
    fileSize: integer("file_size").notNull(), // bytes
    r2Key: text("r2_key").notNull(), // R2 object key
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [index("custom_files_request_idx").on(table.requestId)]
);

export const quotations = sqliteTable(
  "quotations",
  {
    id: text("id").primaryKey(),
    requestId: text("request_id")
      .notNull()
      .references(() => customRequests.id),
    amount: integer("amount").notNull(), // in paise
    breakdown: text("breakdown"), // JSON: { material, labor, etc }
    validUntil: text("valid_until"),
    notes: text("notes"),
    status: text("status", {
      enum: ["draft", "sent", "accepted", "rejected", "expired"],
    })
      .notNull()
      .default("draft"),
    respondedAt: text("responded_at"),
    orderId: text("order_id").references(() => orders.id),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("quotations_request_idx").on(table.requestId),
    index("quotations_status_idx").on(table.status),
  ]
);

// ═══════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════

export const reviews = sqliteTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    orderId: text("order_id").references(() => orders.id),
    rating: integer("rating").notNull(), // 1-5
    title: text("title"),
    body: text("body"),
    isVerified: integer("is_verified", { mode: "boolean" })
      .notNull()
      .default(false),
    isApproved: integer("is_approved", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("reviews_product_idx").on(table.productId),
    index("reviews_user_idx").on(table.userId),
  ]
);

// ═══════════════════════════════════════════════════════════
// WISHLIST
// ═══════════════════════════════════════════════════════════

export const wishlistItems = sqliteTable(
  "wishlist_items",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("wishlist_user_idx").on(table.userId),
    uniqueIndex("wishlist_user_product_idx").on(table.userId, table.productId),
  ]
);

// ═══════════════════════════════════════════════════════════
// COUPONS
// ═══════════════════════════════════════════════════════════

export const coupons = sqliteTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    description: text("description"),
    discountType: text("discount_type", {
      enum: ["percentage", "fixed"],
    }).notNull(),
    discountValue: integer("discount_value").notNull(), // percentage or paise
    minimumOrderAmount: integer("minimum_order_amount"), // in paise
    maxUses: integer("max_uses"),
    usedCount: integer("used_count").notNull().default(0),
    validFrom: text("valid_from"),
    validUntil: text("valid_until"),
    isActive: integer("is_active", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
    updatedAt: text("updated_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [uniqueIndex("coupons_code_idx").on(table.code)]
);

// ═══════════════════════════════════════════════════════════
// STORE SETTINGS
// ═══════════════════════════════════════════════════════════

export const storeSettings = sqliteTable("store_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// ═══════════════════════════════════════════════════════════
// AUDIT LOG
// ═══════════════════════════════════════════════════════════

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    details: text("details"), // JSON
    ipAddress: text("ip_address"),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(datetime('now'))`),
  },
  (table) => [
    index("audit_logs_user_idx").on(table.userId),
    index("audit_logs_entity_idx").on(table.entityType, table.entityId),
    index("audit_logs_created_idx").on(table.createdAt),
  ]
);
