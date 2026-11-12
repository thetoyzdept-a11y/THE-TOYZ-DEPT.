import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatINR, formatDate, getOrderStatusBadge, getCustomRequestStatusBadge } from "../../lib/utils";
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
} from "lucide-react";

export function CustomerDashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Active Tab: 'orders' | 'custom' | 'addresses' | 'wishlist' | 'profile'
  const getInitialTab = () => {
    if (location.pathname.includes("/orders")) return "orders";
    if (location.pathname.includes("/custom-requests")) return "custom";
    if (location.pathname.includes("/addresses")) return "addresses";
    if (location.pathname.includes("/wishlist")) return "wishlist";
    return "orders";
  };

  const [activeTab, setActiveTab] = useState<"orders" | "custom" | "addresses" | "wishlist" | "profile">(getInitialTab());
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

    async function loadDashboardData() {
      setLoading(true);
      try {
        const [ordersRes, customRes, addrRes, wishRes] = await Promise.all([
          api.getCustomerOrders(),
          api.getMyCustomRequests(),
          api.getCustomerAddresses(),
          api.getWishlist(),
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
      // reset form
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Dashboard Header ────────────────────────────────────────── */}
        <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="badge-lime text-xs mb-1">Customer Command Center</span>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
              Welcome, {user.firstName}
            </h1>
            <p className="font-mono text-xs text-ink-muted uppercase mt-0.5">
              Account ID: {user.id} • Registered Member
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

        {/* ── Main Dashboard Layout ──────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 space-y-2">
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
            </div>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-9">
            {/* ── 1. Orders Tab ─────────────────────────────────────── */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                  <h2 className="font-display font-black text-xl uppercase">
                    Order History & Invoices
                  </h2>
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
                      <div key={ord.id} className="card-brutal bg-cream-light p-5 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ink/15 gap-2">
                          <div>
                            <span className="font-display font-bold text-base uppercase">
                              #{ord.order_number}
                            </span>
                            <p className="font-mono text-[11px] text-ink-muted">
                              Placed on {formatDate(ord.created_at)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={getOrderStatusBadge(ord.status).className + " px-2.5 py-0.5 font-mono text-[11px] uppercase font-bold"}>
                              {getOrderStatusBadge(ord.status).label}
                            </span>
                            <span className="font-display font-black text-base text-ink">
                              {formatINR(ord.total_amount)}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono gap-2">
                          <div>
                            <p className="text-ink-muted">
                              Items: <span className="font-bold text-ink">{ord.first_item_name} {ord.item_count > 1 ? `(+${ord.item_count - 1} more)` : ""}</span>
                            </p>
                            {ord.tracking_number && (
                              <p className="text-lime-darker font-bold mt-0.5">
                                Tracking: {ord.tracking_number}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
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
                  <h2 className="font-display font-black text-xl uppercase">
                    3D Print Quotations & Requests
                  </h2>
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

                        {/* If Quote Prepared by Admin */}
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
                  <h2 className="font-display font-black text-xl uppercase">
                    Saved Shipping Addresses
                  </h2>
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
                  <h2 className="font-display font-black text-xl uppercase">
                    Saved Wishlist Objects
                  </h2>
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
                      <div key={it.wishlist_id} className="card-brutal p-4 bg-cream-light flex gap-4 items-center">
                        <div className="w-16 h-16 bg-cream border border-ink flex-shrink-0 overflow-hidden">
                          <img src={it.primary_image || "/images/placeholder-product.svg"} alt={it.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <Link to={`/products/${it.slug}`} className="font-display font-bold text-sm uppercase hover:text-coral transition-colors line-clamp-1">
                            {it.name}
                          </Link>
                          <p className="font-display font-black text-sm text-ink mt-0.5">
                            {formatINR(it.base_price)}
                          </p>
                          <button
                            onClick={() => addToCart({ productId: it.id, quantity: 1 })}
                            className="mt-2 text-xs font-mono font-bold uppercase text-lime-darker hover:underline"
                          >
                            + Move to Cart Tray
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── 5. Profile Tab ────────────────────────────────────── */}
            {activeTab === "profile" && (
              <div className="card-brutal p-6 bg-cream-light space-y-4">
                <h2 className="font-display font-black text-xl uppercase pb-3 border-b border-ink/20">
                  Profile Account Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div className="p-3 bg-cream border border-ink">
                    <span className="text-ink-muted block uppercase">Full Name</span>
                    <span className="font-bold text-ink text-sm">{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="p-3 bg-cream border border-ink">
                    <span className="text-ink-muted block uppercase">Registered Email</span>
                    <span className="font-bold text-ink text-sm">{user.email}</span>
                  </div>
                  <div className="p-3 bg-cream border border-ink">
                    <span className="text-ink-muted block uppercase">Contact Phone</span>
                    <span className="font-bold text-ink text-sm">{user.phone || "Not set"}</span>
                  </div>
                  <div className="p-3 bg-cream border border-ink">
                    <span className="text-ink-muted block uppercase">Access Role</span>
                    <span className="badge-lime text-xs">{user.role}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

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
