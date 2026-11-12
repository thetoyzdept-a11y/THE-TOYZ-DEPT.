// API client for THE TOYZ DEPT.

const API_BASE = "/api";

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include", // send and receive HttpOnly session cookies
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const errorMsg = typeof data === "object" && data !== null && (data as any).message
      ? (data as any).message
      : typeof data === "string"
      ? data
      : "Request failed";
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  // Auth
  getMe: () => request<{ user: any }>("/auth/me"),
  register: (data: any) => request<any>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data: any) => request<any>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  logout: () => request<any>("/auth/logout", { method: "POST" }),

  // Products & Categories
  getCategories: () => request<{ categories: any[] }>("/categories"),
  getProducts: (params?: { category?: string; search?: string; sort?: string; featured?: boolean }) => {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.search) query.set("search", params.search);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.featured) query.set("featured", "true");
    const qs = query.toString();
    return request<{ products: any[] }>(`/products${qs ? `?${qs}` : ""}`);
  },
  getProductBySlug: (slug: string) => request<{ product: any }>(`/products/${slug}`),

  // Cart
  getCart: (coupon?: string) => request<{ cart: any }>(`/cart${coupon ? `?coupon=${encodeURIComponent(coupon)}` : ""}`),
  addToCart: (data: { productId: string; variantId?: string; quantity?: number }) =>
    request<{ cart: any; message: string }>("/cart/items", { method: "POST", body: JSON.stringify(data) }),
  updateCartItem: (itemId: string, quantity: number) =>
    request<{ cart: any }>("/cart/items/" + itemId, { method: "PATCH", body: JSON.stringify({ quantity }) }),
  removeCartItem: (itemId: string) =>
    request<{ cart: any; message: string }>("/cart/items/" + itemId, { method: "DELETE" }),

  // Checkout & Payments
  createCheckoutOrder: (shippingDetails: any) =>
    request<any>("/checkout/create-order", { method: "POST", body: JSON.stringify(shippingDetails) }),
  verifyPayment: (paymentDetails: any) =>
    request<any>("/checkout/verify", { method: "POST", body: JSON.stringify(paymentDetails) }),

  // Custom 3D Printing Service
  submitCustomRequest: (formData: FormData) =>
    request<any>("/custom-requests", { method: "POST", body: formData }),
  getMyCustomRequests: () => request<{ requests: any[] }>("/custom-requests/my"),
  getCustomRequestDetails: (id: string) => request<{ request: any }>(`/custom-requests/${id}`),
  respondToQuotation: (requestId: string, quotationId: string, action: "accepted" | "rejected") =>
    request<any>(`/custom-requests/${requestId}/quotations/${quotationId}/respond`, {
      method: "POST",
      body: JSON.stringify({ action }),
    }),

  // Customer Dashboard
  getCustomerProfile: () => request<{ profile: any }>("/customer/profile"),
  updateCustomerProfile: (data: any) => request<any>("/customer/profile", { method: "PUT", body: JSON.stringify(data) }),
  getCustomerOrders: () => request<{ orders: any[] }>("/customer/orders"),
  getCustomerOrderDetails: (id: string) => request<{ order: any }>(`/customer/orders/${id}`),
  getCustomerAddresses: () => request<{ addresses: any[] }>("/customer/addresses"),
  saveCustomerAddress: (data: any) => request<any>("/customer/addresses", { method: "POST", body: JSON.stringify(data) }),
  deleteCustomerAddress: (id: string) => request<any>(`/customer/addresses/${id}`, { method: "DELETE" }),
  getWishlist: () => request<{ wishlist: any[] }>("/customer/wishlist"),
  addToWishlist: (productId: string) => request<any>(`/customer/wishlist/${productId}`, { method: "POST" }),
  removeFromWishlist: (productId: string) => request<any>(`/customer/wishlist/${productId}`, { method: "DELETE" }),
  submitReview: (data: any) => request<any>("/customer/reviews", { method: "POST", body: JSON.stringify(data) }),

  // Admin Dashboard
  getAdminOverview: () => request<{ metrics: any; recentOrders: any[] }>("/admin/overview"),
  getAdminProducts: () => request<{ products: any[] }>("/admin/products"),
  createAdminProduct: (data: any) => request<any>("/admin/products", { method: "POST", body: JSON.stringify(data) }),
  updateAdminProduct: (id: string, data: any) => request<any>(`/admin/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  archiveAdminProduct: (id: string) => request<any>(`/admin/products/${id}`, { method: "DELETE" }),
  getAdminOrders: (status?: string) => request<{ orders: any[] }>(`/admin/orders${status ? `?status=${status}` : ""}`),
  getAdminOrderDetails: (id: string) => request<{ order: any }>(`/admin/orders/${id}`),
  updateAdminOrderStatus: (id: string, data: { status: string; note?: string; trackingNumber?: string; trackingUrl?: string }) =>
    request<any>(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify(data) }),
  getAdminCustomRequests: () => request<{ requests: any[] }>("/admin/custom-requests"),
  sendAdminQuotation: (data: any) => request<any>("/admin/quotations", { method: "POST", body: JSON.stringify(data) }),
  getAdminCustomers: () => request<{ customers: any[] }>("/admin/customers"),
  getAdminInventory: () => request<{ inventory: any[] }>("/admin/inventory"),
  updateAdminInventory: (variantId: string, stock: number) =>
    request<any>(`/admin/inventory/${variantId}`, { method: "PATCH", body: JSON.stringify({ stock }) }),
  getAdminSettings: () => request<{ settings: Record<string, string> }>("/admin/settings"),
  saveAdminSettings: (data: Record<string, string>) =>
    request<any>("/admin/settings", { method: "POST", body: JSON.stringify(data) }),
};
