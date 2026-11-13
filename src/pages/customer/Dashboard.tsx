import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatINR, formatDate, getOrderStatusBadge, getCustomRequestStatusBadge } from "../../lib/utils";
import { BUSINESS_PROFILE } from "../../config/business";
import {
  Package,
  FileCode,
  MapPin,
  Heart,
  User,
  LogOut,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Phone,
  Clock,
  Printer,
  X,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

export function CustomerDashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab: 'orders' | 'custom' | 'addresses' | 'wishlist' | 'profile' | 'support'
  const getInitialTab = () => {
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/custom-requests")) return "custom";
    if (location.pathname.includes("/addresses")) return "addresses";
    if (location.pathname.includes("/wishlist")) return "wishlist";
    return "orders";
  };

  const [activeTab, setActiveTab] = useState<"orders" | "custom" | "addresses" | "wishlist" | "profile" | "support">(getInitialTab());
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Order Details Modal
  const [viewingOrder, setViewingOrder] = useState<any | null>(null);
  const [orderModalLoading, setOrderModalLoading] = useState(false);

  // Profile Edit State
  const [profileFirstName, setProfileFirstName] = useState("");
  const [profileLastName, setProfileLastName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // New Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newLabel, setNewLabel] = useState("Home");
  const [newFullName, setNewFullName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newAddressLine1, setNewAddressLine1] = useState("");
  const [newAddressLine2, setNewAddressLine2] = useState("");
  const [newCity, setNewCity] = useState("Bengaluru");
  const [newState, setNewState] = useState("Karnataka");
  const [newPostalCode, setNewPostalCode] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileFirstName(user.firstName || "");
    setProfileLastName(user.lastName || "");
    setProfilePhone(user.phone || "");

    async function loadDashboardData() {
      setLoading(true);
      try {
        const [ordersRes, customRes, addrRes, wishRes] = await Promise.all([
          api.getCustomerOrders().catch(() => ({ orders: [] })),
          api.getMyCustomRequests().catch(() => ({ requests: [] })),
          api.getCustomerAddresses().catch(() => ({ addresses: [] })),
          api.getWishlist().catch(() => ({ wishlist: [] })),
        ]);
        setOrders(ordersRes.orders || []);
        setCustomRequests(customRes.requests || []);
        setAddresses(addrRes.addresses || []);
        setWishlist(wishRes.wishlist || []);
      } catch (err) {
        console.error("Dashboard data load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [user, navigate]);

  const handleOpenOrderDetails = async (orderId: string) => {
    setOrderModalLoading(true);
    try {
      const res = await api.getCustomerOrderDetails(orderId);
      setViewingOrder(res.order);
    } catch (err: any) {
      alert("Failed to load order details: " + err.message);
    } finally {
      setOrderModalLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccess("");
    setProfileError("");
    try {
      await api.updateCustomerProfile({
        firstName: profileFirstName,
        lastName: profileLastName,
        phone: profilePhone,
      });
      setProfileSuccess("Profile details saved successfully!");
    } catch (err: any) {
      setProfileError(err.message || "Failed to update profile");
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveCustomerAddress({
        label: newLabel,
        fullName: newFullName,
        phone: newPhone,
        addressLine1: newAddressLine1,
        addressLine2: newAddressLine2,
        city: newCity,
        state: newState,
        postalCode: newPostalCode,
        isDefault: addresses.length === 0,
      });
      setShowAddressModal(false);
      const res = await api.getCustomerAddresses();
      setAddresses(res.addresses || []);
      setNewFullName("");
      setNewPhone("");
      setNewAddressLine1("");
      setNewAddressLine2("");
      setNewPostalCode("");
    } catch (err: any) {
      alert(err.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (confirm("Delete this saved address?")) {
      await api.deleteCustomerAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
    }
  };

  const handleRemoveWishlist = async (productId: string) => {
    try {
      await api.removeFromWishlist(productId);
      setWishlist(wishlist.filter((w) => w.id !== productId));
    } catch (err: any) {
      alert("Failed to remove item: " + err.message);
    }
  };

  const handleRespondQuotation = async (requestId: string, quotationId: string, action: "accepted" | "rejected") => {
    try {
      await api.respondToQuotation(requestId, quotationId, action);
      const res = await api.getMyCustomRequests();
      setCustomRequests(res.requests || []);
      if (action === "accepted") {
        alert("Quotation accepted! Our engineering team has been notified and scheduled the print job.");
      }
    } catch (err: any) {
      alert(err.message || "Action failed");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ── Dashboard Header ────────────────────────────────────────── */}
        <div className="border-b-2 border-ink pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="badge-lime text-xs">Customer Command Center</span>
              <span className="badge-dark text-[10px] font-mono">Member ID: {user.id.slice(0, 10)}</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
              Welcome, {user.firstName || "Customer"}
            </h1>
            <p className="font-mono text-xs text-ink-muted uppercase mt-0.5">
              Account: {user.email} • Priority Dispatch Active
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin" className="btn-dark text-xs py-2 px-3">
                <Shield className="w-3.5 h-3.5 text-lime" /> Admin Portal
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="px-3 py-2 border-2 border-ink bg-cream-light hover:bg-coral hover:text-cream text-xs font-mono font-bold uppercase transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* ── Customer Quick Metrics Overview ──────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveTab("orders")}
            className="card-brutal p-4 bg-cream-light cursor-pointer hover:bg-lime/20 transition-all font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <Package className="w-4 h-4 text-ink-muted" />
              <span className="text-xl font-display font-black text-ink">{orders.length}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-ink">Total Orders</p>
            <p className="text-[9px] text-ink-muted">Invoices & Shipments</p>
          </div>

          <div
            onClick={() => setActiveTab("custom")}
            className="card-brutal p-4 bg-cream-light cursor-pointer hover:bg-lime/20 transition-all font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <FileCode className="w-4 h-4 text-ink-muted" />
              <span className="text-xl font-display font-black text-coral">{customRequests.length}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-ink">3D Print Jobs</p>
            <p className="text-[9px] text-ink-muted">Custom STL Quotations</p>
          </div>

          <div
            onClick={() => setActiveTab("wishlist")}
            className="card-brutal p-4 bg-cream-light cursor-pointer hover:bg-lime/20 transition-all font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <Heart className="w-4 h-4 text-coral" />
              <span className="text-xl font-display font-black text-ink">{wishlist.length}</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-ink">Saved Wishlist</p>
            <p className="text-[9px] text-ink-muted">Bookmarked Objects</p>
          </div>

          <div
            onClick={() => setActiveTab("support")}
            className="card-brutal p-4 bg-lime/20 border-2 border-ink cursor-pointer hover:bg-lime/30 transition-all font-mono"
          >
            <div className="flex items-center justify-between mb-1">
              <Truck className="w-4 h-4 text-lime-darker" />
              <span className="badge-lime text-[9px] uppercase">Free &gt; ₹999</span>
            </div>
            <p className="text-[10px] uppercase font-bold text-ink">Express Shipping</p>
            <p className="text-[9px] text-ink-muted">Shiprocket Partner Network</p>
          </div>
        </div>

        {/* ── Main Dashboard Layout ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="card-brutal p-2 bg-cream-light space-y-1 font-display font-bold text-xs uppercase tracking-wider">
              <button
                onClick={() => setActiveTab("orders")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "orders" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Package className="w-4 h-4" /> Orders & Invoices
                </span>
                <span className="font-mono text-[10px]">{orders.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("custom")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "custom" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FileCode className="w-4 h-4" /> 3D Quotations
                </span>
                <span className="font-mono text-[10px]">{customRequests.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "addresses" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Saved Addresses
                </span>
                <span className="font-mono text-[10px]">{addresses.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "wishlist" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" /> Saved Wishlist
                </span>
                <span className="font-mono text-[10px]">{wishlist.length}</span>
              </button>

              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "profile" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile Info
                </span>
              </button>

              <button
                onClick={() => setActiveTab("support")}
                className={`w-full text-left px-3 py-2.5 flex items-center justify-between transition-all ${
                  activeTab === "support" ? "bg-ink text-cream" : "hover:bg-cream-dark text-ink"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Truck className="w-4 h-4" /> Operations & Support
                </span>
              </button>
            </div>

            {/* Operations Hub Summary Card */}
            <div className="card-brutal p-4 bg-cream-light font-mono text-[11px] space-y-2 border-2 border-ink">
              <span className="badge-lime text-[9px] uppercase">Fulfillment Desk</span>
              <p className="font-bold text-ink uppercase">{BUSINESS_PROFILE.brandName}</p>
              <p className="text-ink-muted text-[10px] leading-tight">
                Dispatches from: {BUSINESS_PROFILE.address.city}, {BUSINESS_PROFILE.address.state}
              </p>
              <div className="pt-2 border-t border-ink/20 space-y-1">
                <a
                  href={`mailto:${BUSINESS_PROFILE.contact.email}`}
                  className="flex items-center gap-1.5 text-lime-darker font-bold hover:underline"
                >
                  <Mail className="w-3 h-3" /> {BUSINESS_PROFILE.contact.email}
                </a>
                <p className="flex items-center gap-1.5 text-ink-muted text-[10px]">
                  <Clock className="w-3 h-3" /> {BUSINESS_PROFILE.contact.hours}
                </p>
              </div>
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-9">
            {/* ── 1. Orders Tab ─────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                  <div>
                    <h2 className="font-display font-black text-xl uppercase">
                      Order History & Invoices
                    </h2>
                    <p className="font-mono text-xs text-ink-muted">
                      Official commercial invoices with Razorpay payment references & Shiprocket tracking
                    </p>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">
                    {orders.length} Total Orders Placed
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="card-brutal p-8 bg-cream-light text-center">
                    <Package className="w-10 h-10 text-ink/30 mx-auto mb-2" />
                    <p className="font-display font-bold uppercase text-sm">No Orders Placed Yet</p>
                    <p className="font-mono text-xs text-ink-muted mt-1 mb-4">
                      Explore our shop to drop your first item onto the print bed.
                    </p>
                    <Link to="/shop" className="btn-primary text-xs">
                      Explore Catalogue
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div key={ord.id} className="card-brutal bg-cream-light p-5 space-y-4 font-mono">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ink/15 gap-2">
                          <div>
                            <span className="font-display font-bold text-base uppercase">
                              #{ord.order_number}
                            </span>
                            <p className="text-[11px] text-ink-muted">
                              Placed on {formatDate(ord.created_at)}
                            </p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={getOrderStatusBadge(ord.status).className + " px-2.5 py-0.5 text-[11px] uppercase font-bold"}>
                              {getOrderStatusBadge(ord.status).label}
                            </span>
                            <span className="font-display font-black text-base text-ink">
                              {formatINR(ord.total_amount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-3">
                          <div>
                            <p className="text-ink-muted">
                              Items: <span className="font-bold text-ink">{ord.first_item_name} {ord.item_count > 1 ? `(+${ord.item_count - 1} more)` : ""}</span>
                            </p>
                            {ord.tracking_number ? (
                              <p className="text-lime-darker font-bold mt-0.5 flex items-center gap-1">
                                <Truck className="w-3.5 h-3.5" /> AWB: {ord.tracking_number}
                              </p>
                            ) : (
                              <p className="text-ink-muted text-[10px] mt-0.5">
                                Fulfillment: Queued for Precision FDM Printing & QC
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenOrderDetails(ord.id)}
                              className="px-3 py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink text-xs font-bold uppercase transition-colors"
                            >
                              View Details & Receipt
                            </button>
                            <Link
                              to={`/track-order?ref=${ord.order_number}`}
                              className="px-3 py-1.5 bg-cream border border-ink text-xs font-bold uppercase hover:bg-lime transition-colors"
                            >
                              Live Status
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 2. Custom 3D Printing Quotations Tab ──────────────── */}
            {activeTab === "custom" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                  <div>
                    <h2 className="font-display font-black text-xl uppercase">
                      3D Print Quotations & Requests
                    </h2>
                    <p className="font-mono text-xs text-ink-muted">
                      Direct engineering estimates for customer STL / 3MF custom models
                    </p>
                  </div>
                  <Link to="/custom-prints" className="btn-primary text-xs py-1.5 px-3">
                    + New 3D Model
                  </Link>
                </div>

                {customRequests.length === 0 ? (
                  <div className="card-brutal p-8 bg-cream-light text-center">
                    <FileCode className="w-10 h-10 text-ink/30 mx-auto mb-2" />
                    <p className="font-display font-bold uppercase text-sm">No Custom Requests Lodged</p>
                    <p className="font-mono text-xs text-ink-muted mt-1 mb-4">
                      Submit an STL or 3MF file to get a transparent engineering quote.
                    </p>
                    <Link to="/custom-prints" className="btn-primary text-xs">
                      Submit 3D Model
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {customRequests.map((req) => (
                      <div key={req.id} className="card-brutal bg-cream-light p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ink/15 gap-2">
                          <div>
                            <span className="font-display font-bold text-base uppercase">
                              #{req.request_number}
                            </span>
                            <p className="font-mono text-[11px] text-ink-muted">
                              Submitted {formatDate(req.created_at)} • File: {req.file_name || "CAD Model"}
                            </p>
                          </div>

                          <span className={getCustomRequestStatusBadge(req.status).className + " px-2.5 py-0.5 font-mono text-[11px] uppercase font-bold"}>
                            {getCustomRequestStatusBadge(req.status).label}
                          </span>
                        </div>

                        <div className="text-xs font-body text-ink/80 bg-cream p-3 border border-ink/20">
                          <p className="font-bold font-mono uppercase text-ink mb-1">
                            {req.material} • {req.color} • Qty: {req.quantity}
                          </p>
                          <p>{req.description}</p>
                        </div>

                        {req.quotation_id && (
                          <div className="p-4 bg-lime/20 border-2 border-ink space-y-3 font-mono text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-ink uppercase">Commercial Quotation:</span>
                              <span className="font-display font-black text-lg text-ink">
                                {formatINR(req.quotation_amount)}
                              </span>
                            </div>

                            {req.quotation_notes && (
                              <p className="text-ink-muted text-[11px]">
                                Engineering Notes: {req.quotation_notes}
                              </p>
                            )}

                            {req.quotation_status === "sent" && (
                              <div className="flex gap-2 pt-2 border-t border-ink/20">
                                <button
                                  onClick={() => handleRespondQuotation(req.id, req.quotation_id, "accepted")}
                                  className="btn-primary text-xs py-1.5 px-4"
                                >
                                  Accept Quotation & Start Printing
                                </button>
                                <button
                                  onClick={() => handleRespondQuotation(req.id, req.quotation_id, "rejected")}
                                  className="btn-secondary text-xs py-1.5 px-3 text-coral"
                                >
                                  Decline
                                </button>
                              </div>
                            )}

                            {req.quotation_status === "accepted" && (
                              <div className="flex items-center gap-1.5 text-lime-darker font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Quotation Accepted! In Production Queue.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 3. Saved Addresses Tab ────────────────────────────── */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                  <div>
                    <h2 className="font-display font-black text-xl uppercase">
                      Saved Shipping Addresses
                    </h2>
                    <p className="font-mono text-xs text-ink-muted">
                      Stored shipping destinations for frictionless 1-click checkout
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="btn-primary text-xs py-1.5 px-3"
                  >
                    + Add New Address
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="card-brutal p-8 bg-cream-light text-center">
                    <MapPin className="w-10 h-10 text-ink/30 mx-auto mb-2" />
                    <p className="font-display font-bold uppercase text-sm">No Addresses Stored</p>
                    <p className="font-mono text-xs text-ink-muted mt-1 mb-4">
                      Save your shipping address for fast 1-click checkout.
                    </p>
                    <button onClick={() => setShowAddressModal(true)} className="btn-primary text-xs">
                      Add Shipping Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="card-brutal p-4 bg-cream-light relative space-y-2 font-mono text-xs">
                        <div className="flex justify-between items-center border-b border-ink/15 pb-2">
                          <span className="font-bold uppercase text-ink flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> {addr.label || "Address"}
                          </span>
                          {addr.is_default ? (
                            <span className="badge-lime text-[9px]">Default</span>
                          ) : (
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-ink-muted hover:text-coral"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="font-bold text-ink">{addr.full_name}</p>
                        <p className="text-ink-muted">{addr.address_line_1}</p>
                        {addr.address_line_2 && <p className="text-ink-muted">{addr.address_line_2}</p>}
                        <p className="text-ink-muted">{addr.city}, {addr.state} - {addr.postal_code}</p>
                        <p className="text-ink-muted">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 4. Wishlist Tab ───────────────────────────────────── */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                  <div>
                    <h2 className="font-display font-black text-xl uppercase">
                      Saved Wishlist Objects
                    </h2>
                    <p className="font-mono text-xs text-ink-muted">
                      Saved collectible drops ready to be transferred to your cart tray
                    </p>
                  </div>
                  <span className="font-mono text-xs text-ink-muted">
                    {wishlist.length} Objects Bookmarked
                  </span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="card-brutal p-8 bg-cream-light text-center">
                    <Heart className="w-10 h-10 text-ink/30 mx-auto mb-2" />
                    <p className="font-display font-bold uppercase text-sm">Wishlist is Empty</p>
                    <p className="font-mono text-xs text-ink-muted mt-1 mb-4">
                      Click the heart icon on any drop to save it to your wishlist.
                    </p>
                    <Link to="/shop" className="btn-primary text-xs">
                      Browse Drops
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map((it) => (
                      <div key={it.wishlist_id || it.id} className="card-brutal p-4 bg-cream-light flex gap-4 items-center font-mono">
                        <div className="w-16 h-16 bg-cream border-2 border-ink flex-shrink-0 overflow-hidden">
                          <img src={it.primary_image || "/images/placeholder-product.svg"} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <Link to={`/products/${it.slug}`} className="font-display font-bold text-sm uppercase hover:text-coral transition-colors line-clamp-1">
                            {it.name}
                          </Link>
                          <p className="font-display font-black text-sm text-ink mt-0.5">
                            {formatINR(it.base_price)}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() => {
                                addToCart({ productId: it.id, quantity: 1 });
                                alert(`Added ${it.name} to cart tray!`);
                              }}
                              className="text-xs font-bold uppercase text-lime-darker hover:underline flex items-center gap-1"
                            >
                              <ShoppingBag className="w-3 h-3" /> + Move to Cart
                            </button>
                            <button
                              onClick={() => handleRemoveWishlist(it.id)}
                              className="text-[10px] uppercase text-coral hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 5. Profile Tab (Editable) ─────────────────────────── */}
            {activeTab === "profile" && (
              <div className="card-brutal p-6 bg-cream-light space-y-6 font-mono">
                <div>
                  <h2 className="font-display font-black text-xl uppercase pb-2 border-b border-ink/20">
                    Profile & Personal Information
                  </h2>
                  <p className="text-xs text-ink-muted mt-1">
                    Manage your primary customer name, registered phone number, and security details.
                  </p>
                </div>

                {profileSuccess && (
                  <div className="p-3 bg-lime/30 border-2 border-ink text-ink font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-darker flex-shrink-0" />
                    {profileSuccess}
                  </div>
                )}

                {profileError && (
                  <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark font-bold text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {profileError}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase mb-1">First Name</label>
                      <input
                        type="text"
                        required
                        value={profileFirstName}
                        onChange={(e) => setProfileFirstName(e.target.value)}
                        className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase mb-1">Last Name</label>
                      <input
                        type="text"
                        required
                        value={profileLastName}
                        onChange={(e) => setProfileLastName(e.target.value)}
                        className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase mb-1">Primary Email (Account ID)</label>
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        disabled
                        className="w-full bg-cream-dark/50 border-2 border-ink/40 p-2.5 font-bold text-ink-muted cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase mb-1">Primary Contact Phone</label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="btn-primary py-2 px-5 text-xs uppercase flex items-center gap-2"
                    >
                      {profileSaving ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                        </>
                      ) : (
                        "Save Profile Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ── 6. Operations & Support Tab ───────────────────────── */}
            {activeTab === "support" && (
              <div className="space-y-6 font-mono text-xs">
                <div className="border-b-2 border-ink pb-3">
                  <h2 className="font-display font-black text-xl uppercase">
                    Fulfillment, Logistics & Support Hub
                  </h2>
                  <p className="text-xs text-ink-muted mt-1">
                    Authentic commercial logistics, direct support escalation, and statutory consumer redressal
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fulfillment Hub Card */}
                  <div className="card-brutal p-6 bg-cream-light space-y-4">
                    <div className="border-b border-ink/15 pb-2 flex items-center justify-between">
                      <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                        <Truck className="w-4 h-4 text-lime-darker" /> Dispatch & Manufacturing
                      </h3>
                      <span className="badge-lime text-[10px] uppercase">Karnataka Hub</span>
                    </div>

                    <div className="space-y-2 text-ink">
                      <p>
                        <strong className="uppercase">Operating Brand:</strong> {BUSINESS_PROFILE.brandName}
                      </p>
                      <p>
                        <strong className="uppercase">Legal Entity:</strong> {BUSINESS_PROFILE.legalEntityName} (Sole Proprietor)
                      </p>
                      <p>
                        <strong className="uppercase">Principal Place of Business:</strong>
                        <span className="block text-ink-muted mt-0.5">{BUSINESS_PROFILE.address.formatted}</span>
                      </p>
                      <p>
                        <strong className="uppercase">Logistics Partner:</strong> Shiprocket National Courier Network (Bluedart, Delhivery, DTDC, XpressBees)
                      </p>
                    </div>

                    <div className="p-3 bg-lime/20 border border-ink text-[11px]">
                      <strong>Free Shipping Benefit:</strong> All orders over ₹999 qualify for complimentary express standard delivery across India.
                    </div>
                  </div>

                  {/* Customer Care & Grievance Card */}
                  <div className="card-brutal p-6 bg-cream-light space-y-4">
                    <div className="border-b border-ink/15 pb-2 flex items-center justify-between">
                      <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                        <Mail className="w-4 h-4 text-coral" /> Customer Care Desk
                      </h3>
                      <span className="badge-dark text-[10px] uppercase">Active Support</span>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <strong className="uppercase">Direct Support Email:</strong>{" "}
                        <a href={`mailto:${BUSINESS_PROFILE.contact.email}`} className="text-lime-darker font-bold hover:underline">
                          {BUSINESS_PROFILE.contact.email}
                        </a>
                      </p>
                      <p>
                        <strong className="uppercase">Helpline / WhatsApp:</strong>{" "}
                        <a href={`tel:${BUSINESS_PROFILE.contact.phone}`} className="font-bold hover:underline">
                          {BUSINESS_PROFILE.contact.phone}
                        </a>
                      </p>
                      <p>
                        <strong className="uppercase">Support Hours:</strong> {BUSINESS_PROFILE.contact.hours}
                      </p>
                      <p>
                        <strong className="uppercase">Grievance Officer:</strong> {BUSINESS_PROFILE.compliance.grievanceOfficer.name} (Designation: {BUSINESS_PROFILE.compliance.grievanceOfficer.designation})
                      </p>
                    </div>

                    <div className="pt-2 flex flex-col gap-2">
                      <Link to="/contact" className="btn-dark py-2 text-xs uppercase text-center">
                        Open Contact Ticket
                      </Link>
                      <Link to="/grievance-redressal" className="btn-secondary py-2 text-xs uppercase text-center text-coral">
                        Statutory Grievance Redressal
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── MODAL: ORDER DETAILS & RECEIPT ──────────────────────────── */}
        {viewingOrder && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 shadow-brutal-xl font-mono text-xs">
              <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
                <div>
                  <span className="badge-lime text-[10px] uppercase">Official Order Receipt</span>
                  <h3 className="font-display font-black text-xl uppercase text-ink mt-0.5">
                    Order #{viewingOrder.order_number}
                  </h3>
                  <p className="text-[11px] text-ink-muted">
                    Placed on {formatDate(viewingOrder.created_at)}
                  </p>
                </div>
                <button
                  onClick={() => setViewingOrder(null)}
                  className="p-1 hover:bg-coral hover:text-white border border-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Order Status & Tracking Banner */}
              <div className="p-3 bg-cream-light border-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={getOrderStatusBadge(viewingOrder.status).className + " px-2.5 py-1 text-xs uppercase font-bold"}>
                    {getOrderStatusBadge(viewingOrder.status).label}
                  </span>
                  {viewingOrder.tracking_number && (
                    <span className="font-bold text-lime-darker flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> AWB: {viewingOrder.tracking_number}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/track-order?ref=${viewingOrder.order_number}`}
                    className="px-2.5 py-1 bg-cream border border-ink font-bold uppercase hover:bg-lime text-[10px]"
                  >
                    Live Tracking
                  </Link>
                  <button
                    onClick={() => window.print()}
                    className="px-2.5 py-1 bg-ink text-cream font-bold uppercase hover:bg-lime hover:text-ink text-[10px] flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" /> Print
                  </button>
                </div>
              </div>

              {/* Items Table */}
              <div className="border-2 border-ink overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-cream-dark border-b-2 border-ink font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Unit Price</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10 bg-cream-light">
                    {(viewingOrder.items || []).map((it: any) => (
                      <tr key={it.id}>
                        <td className="p-2.5 flex items-center gap-2.5">
                          <img
                            src={it.product_image || "/images/placeholder-product.svg"}
                            alt={it.product_name}
                            className="w-10 h-10 object-cover border border-ink"
                          />
                          <div>
                            <span className="font-bold block text-ink">{it.product_name}</span>
                            <span className="text-[10px] text-ink-muted">Finish: {it.variant_name || "Standard PLA"}</span>
                          </div>
                        </td>
                        <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                        <td className="p-2.5 text-right">{formatINR(it.unit_price)}</td>
                        <td className="p-2.5 text-right font-bold">{formatINR(it.total_price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-cream-light border-2 border-ink space-y-1.5 text-[11px]">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span>{formatINR(viewingOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Shipping Cost</span>
                  <span>{viewingOrder.shipping_cost === 0 ? "FREE" : formatINR(viewingOrder.shipping_cost)}</span>
                </div>
                {viewingOrder.discount_amount > 0 && (
                  <div className="flex justify-between text-coral font-bold">
                    <span>Discount Coupon ({viewingOrder.coupon_code || "DISCOUNT"})</span>
                    <span>-{formatINR(viewingOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-display font-black text-ink pt-2 border-t border-ink/20">
                  <span>Total Paid (INR)</span>
                  <span>{formatINR(viewingOrder.total_amount)}</span>
                </div>
              </div>

              {/* Delivery & Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 bg-cream-light border border-ink space-y-1">
                  <span className="font-bold uppercase text-ink block">Shipping Destination:</span>
                  <p className="font-bold">{viewingOrder.shipping_name}</p>
                  <p className="text-ink-muted">{viewingOrder.shipping_address_1}</p>
                  {viewingOrder.shipping_address_2 && <p className="text-ink-muted">{viewingOrder.shipping_address_2}</p>}
                  <p className="text-ink-muted">{viewingOrder.shipping_city}, {viewingOrder.shipping_state} - {viewingOrder.shipping_postal_code}</p>
                  <p className="text-ink-muted">Contact: {viewingOrder.shipping_phone}</p>
                </div>

                <div className="p-3 bg-cream-light border border-ink space-y-1">
                  <span className="font-bold uppercase text-ink block">Payment Information:</span>
                  <p>Provider: <strong>Razorpay Standard Checkout</strong></p>
                  {viewingOrder.payment?.razorpay_payment_id && (
                    <p className="text-lime-darker font-bold">
                      Payment ID: {viewingOrder.payment.razorpay_payment_id}
                    </p>
                  )}
                  {viewingOrder.payment?.razorpay_order_id && (
                    <p className="text-ink-muted text-[10px]">
                      Razorpay Order: {viewingOrder.payment.razorpay_order_id}
                    </p>
                  )}
                  <p className="text-ink-muted text-[10px]">
                    Settlement: 100% Verified Escrow Secured
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-ink/20">
                <button
                  type="button"
                  onClick={() => setViewingOrder(null)}
                  className="btn-secondary py-2 px-6 text-xs uppercase"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Modal: Add New Address ──────────────────────────────────── */}
        {showAddressModal && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-md space-y-4 shadow-brutal-xl">
              <h3 className="font-display font-black text-lg uppercase border-b-2 border-ink pb-2">
                Save Shipping Address
              </h3>

              <form onSubmit={handleSaveAddress} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Address Label</label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder="Home / Studio / Office"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Recipient Name</label>
                  <input
                    type="text"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    placeholder="Rohan Verma"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={newAddressLine1}
                    onChange={(e) => setNewAddressLine1(e.target.value)}
                    placeholder="Flat 402, Skyline Residency"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase mb-1">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="Bengaluru"
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={newPostalCode}
                      onChange={(e) => setNewPostalCode(e.target.value)}
                      placeholder="560038"
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                    Save Address
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="btn-secondary py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
