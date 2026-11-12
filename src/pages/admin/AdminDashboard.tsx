import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { formatINR, formatDate, getOrderStatusBadge, getCustomRequestStatusBadge } from "../../lib/utils";
import { BUSINESS_PROFILE } from "../../config/business";
import {
  Shield,
  DollarSign,
  Package,
  Layers,
  FileCode,
  Users,
  Settings,
  AlertTriangle,
  CheckCircle2,
  Download,
  Plus,
  RefreshCw,
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Send,
  Eye,
  Sliders,
  Mail,
  Printer,
  FileText,
  Check,
  Phone,
  MapPin,
} from "lucide-react";

export function AdminDashboardPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Active Admin Module
  const [activeModule, setActiveModule] = useState<
    "overview" | "products" | "orders" | "custom" | "inventory" | "customers" | "settings" | "inquiries"
  >("overview");

  // State data
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [productSearch, setProductSearch] = useState("");

  // Detailed Modal Views
  const [viewingOrderDetails, setViewingOrderDetails] = useState<any>(null);
  const [orderDetailsLoading, setOrderDetailsLoading] = useState(false);

  // Quick Product Editor State
  const [quickEditProduct, setQuickEditProduct] = useState<any>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editStatus, setEditStatus] = useState("active");

  // Modal & Edit States
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdSlug, setNewProdSlug] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cat_collectibles");
  const [newProdMaterial, setNewProdMaterial] = useState("PLA+ (Standard)");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdStatus, setNewProdStatus] = useState<"draft" | "active">("active");

  // Quotation Preparation State
  const [selectedRequestForQuote, setSelectedRequestForQuote] = useState<any>(null);
  const [quoteMaterialCost, setQuoteMaterialCost] = useState("450");
  const [quoteMachineCost, setQuoteMachineCost] = useState("700");
  const [quotePostCost, setQuotePostCost] = useState("250");
  const [quoteNotes, setQuoteNotes] = useState("Sliced in Bambu Studio. 0.12mm layer height with high-density infill.");

  // Order Status Updater State
  const [selectedOrderForStatus, setSelectedOrderForStatus] = useState<any>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusTrackingNum, setStatusTrackingNum] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [shiprocketLoading, setShiprocketLoading] = useState<string | null>(null);

  const handleShiprocketDispatch = async (orderId: string) => {
    try {
      setShiprocketLoading(orderId);
      const res = await api.createShiprocketShipment(orderId);
      alert(`Success! Created Shiprocket shipment #${res.shipmentId}.\nCourier: ${res.courierName}\nAWB: ${res.awbCode}`);
      await loadAllAdminData();
      setSelectedOrderForStatus(null);
    } catch (err: any) {
      alert("Shiprocket Error: " + err.message);
    } finally {
      setShiprocketLoading(null);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, prodRes, ordRes, custReqRes, invRes, custRes, setRes, compRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminProducts(),
        api.getAdminOrders(),
        api.getAdminCustomRequests(),
        api.getAdminInventory(),
        api.getAdminCustomers(),
        api.getAdminSettings(),
        api.getAdminComplianceRecords().catch(() => ({ inquiries: [], grievances: [] })),
      ]);

      setMetrics(overviewRes.metrics);
      setRecentOrders(overviewRes.recentOrders || []);
      setProducts(prodRes.products || []);
      setOrders(ordRes.orders || []);
      setCustomRequests(custReqRes.requests || []);
      setInventory(invRes.inventory || []);
      setCustomers(custRes.customers || []);
      setStoreSettings(setRes.settings || {});
      setInquiries(compRes.inquiries || []);
      setGrievances(compRes.grievances || []);
    } catch (err) {
      console.error("Admin data load error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrderDetails = async (orderId: string) => {
    setOrderDetailsLoading(true);
    try {
      const res = await api.getAdminOrderDetails(orderId);
      setViewingOrderDetails(res.order);
    } catch (err: any) {
      alert("Failed to fetch order details: " + err.message);
    } finally {
      setOrderDetailsLoading(false);
    }
  };

  const handleQuickEditSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEditProduct) return;
    try {
      const pricePaise = Math.round(parseFloat(editPrice) * 100);
      const stockNum = parseInt(editStock, 10);

      await api.updateAdminProduct(quickEditProduct.id, {
        name: quickEditProduct.name,
        slug: quickEditProduct.slug,
        basePrice: pricePaise,
        categoryId: quickEditProduct.category_id,
        material: quickEditProduct.material,
        description: quickEditProduct.description,
        status: editStatus,
        isFeatured: quickEditProduct.is_featured,
      });

      const invRow = inventory.find((i) => i.product_id === quickEditProduct.id);
      if (invRow && !isNaN(stockNum)) {
        await api.updateAdminInventory(invRow.variant_id, stockNum);
      }

      setQuickEditProduct(null);
      await loadAllAdminData();
      alert("Product details updated successfully!");
    } catch (err: any) {
      alert("Failed to update product: " + err.message);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }
    loadAllAdminData();
  }, [isAdmin, navigate]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const basePricePaise = Math.round(parseFloat(newProdPrice) * 100);
      await api.createAdminProduct({
        name: newProdName,
        slug: newProdSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        basePrice: basePricePaise,
        categoryId: newProdCategory,
        material: newProdMaterial,
        description: newProdDesc,
        status: newProdStatus,
        isFeatured: true,
      });
      setShowCreateProductModal(false);
      await loadAllAdminData();
      alert("Product created successfully!");
    } catch (err: any) {
      alert(err.message || "Product creation failed");
    }
  };

  const handleUpdateOrderStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForStatus) return;
    try {
      await api.updateAdminOrderStatus(selectedOrderForStatus.id, {
        status: newStatus,
        trackingNumber: statusTrackingNum || undefined,
        note: statusNote || undefined,
      });
      setSelectedOrderForStatus(null);
      await loadAllAdminData();
      alert("Order status updated!");
    } catch (err: any) {
      alert(err.message || "Failed to update order status");
    }
  };

  const handleSendQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequestForQuote) return;
    try {
      const mat = Math.round(parseFloat(quoteMaterialCost) * 100);
      const mac = Math.round(parseFloat(quoteMachineCost) * 100);
      const post = Math.round(parseFloat(quotePostCost) * 100);
      const totalPaise = mat + mac + post;

      await api.sendAdminQuotation({
        requestId: selectedRequestForQuote.id,
        amount: totalPaise,
        breakdown: {
          material: mat,
          machineTime: mac,
          postProcessing: post,
        },
        validityDays: 14,
        notes: quoteNotes,
      });

      setSelectedRequestForQuote(null);
      await loadAllAdminData();
      alert("Formal commercial quotation generated and transmitted to customer!");
    } catch (err: any) {
      alert(err.message || "Quotation generation failed");
    }
  };

  const handleUpdateStock = async (variantId: string, currentStock: number) => {
    const input = prompt("Enter new inventory count:", String(currentStock));
    if (input === null) return;
    const newStock = parseInt(input, 10);
    if (isNaN(newStock) || newStock < 0) {
      alert("Invalid number");
      return;
    }
    try {
      await api.updateAdminInventory(variantId, newStock);
      await loadAllAdminData();
    } catch (err: any) {
      alert(err.message || "Failed to update stock");
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Admin Header ────────────────────────────────────────────── */}
        <div className="bg-ink text-cream p-6 border-2 border-ink shadow-brutal-xl mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-lime text-ink flex items-center justify-center font-black text-xl border-2 border-ink shadow-brutal-sm">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display font-black text-2xl uppercase tracking-wider text-cream">
                  Operations Control
                </h1>
                <span className="badge-lime text-[10px]">ADMIN VERIFIED</span>
              </div>
              <p className="font-mono text-xs text-cream/60 uppercase">
                THE TOYZ DEPT. // Production & Commerce Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/" className="px-3 py-2 bg-cream text-ink text-xs font-mono font-bold uppercase hover:bg-lime transition-colors border border-cream">
              Storefront View
            </Link>
            <button
              onClick={loadAllAdminData}
              className="p-2 bg-cream/10 hover:bg-cream/20 text-cream border border-cream/30 text-xs font-mono uppercase flex items-center gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Refresh D1
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 font-display font-bold text-xs uppercase tracking-wider">
          {[
            { id: "overview", label: "Overview & Revenue", icon: DollarSign },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "products", label: `Products (${products.length})`, icon: Layers },
            { id: "custom", label: `3D Requests (${customRequests.length})`, icon: FileCode },
            { id: "inventory", label: "Inventory & Stock", icon: Sliders },
            { id: "inquiries", label: `Inquiries (${inquiries.length + grievances.length})`, icon: Mail },
            { id: "customers", label: `Customers (${customers.length})`, icon: Users },
            { id: "settings", label: "Store Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`px-4 py-2.5 border-2 flex items-center gap-2 flex-shrink-0 transition-all ${
                  isActive
                    ? "bg-ink text-cream border-ink shadow-brutal-sm"
                    : "bg-cream-light text-ink border-ink hover:bg-cream-dark"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-lime" : ""}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── MODULE 1: OVERVIEW & ANALYTICS ──────────────────────────── */}
        {activeModule === "overview" && metrics && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Metric KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="card-brutal p-5 bg-cream-light space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted">Total Captured Revenue</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {formatINR(metrics.totalRevenue)}
                </p>
                <span className="badge-lime text-[10px]">Real D1 Payment Records</span>
              </div>

              <div className="card-brutal p-5 bg-cream-light space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted">Orders (All / Pending)</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {metrics.totalOrders} <span className="text-coral text-lg font-mono">({metrics.pendingOrders} Active)</span>
                </p>
                <span className="badge-coral text-[10px]">{metrics.pendingOrders} Needs Action</span>
              </div>

              <div className="card-brutal p-5 bg-cream-light space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted">Registered Customers</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {metrics.totalCustomers}
                </p>
                <span className="font-mono text-[10px] text-ink-muted uppercase">Profiles in D1</span>
              </div>

              <div className="card-brutal p-5 bg-cream-light space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted">Custom STL Requests</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {customRequests.length}
                </p>
                <span className="badge-lime text-[10px]">{customRequests.filter((r) => r.status === "submitted").length} In Queue</span>
              </div>
            </div>

            {/* Recent Orders Feed */}
            <div className="card-brutal bg-cream-light p-6 space-y-4">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <h3 className="font-display font-black text-lg uppercase">
                  Recent Production Orders
                </h3>
                <button
                  onClick={() => setActiveModule("orders")}
                  className="font-mono text-xs uppercase text-coral font-bold hover:underline"
                >
                  View All ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                    <tr>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-cream/50">
                        <td className="p-3 font-bold text-ink">{ord.order_number}</td>
                        <td className="p-3">{ord.shipping_name}</td>
                        <td className="p-3 text-ink-muted">{formatDate(ord.created_at)}</td>
                        <td className="p-3 font-bold">{formatINR(ord.total_amount)}</td>
                        <td className="p-3">
                          <span className={getOrderStatusBadge(ord.status).className + " px-2 py-0.5 text-[10px] uppercase font-bold"}>
                            {getOrderStatusBadge(ord.status).label}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrderForStatus(ord);
                              setNewStatus(ord.status);
                            }}
                            className="px-2 py-1 bg-ink text-cream hover:bg-lime hover:text-ink text-[10px] uppercase font-bold"
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 2: PRODUCT MANAGEMENT ────────────────────────────── */}
        {activeModule === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-3">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Product Catalogue ({products.length})
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Manage drops, update pricing, live inventory & images
                </p>
              </div>
              <button
                onClick={() => setShowCreateProductModal(true)}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create New Object Drop
              </button>
            </div>

            {/* Product Search Bar */}
            <div className="flex items-center gap-2 bg-cream-light p-2.5 border-2 border-ink">
              <Search className="w-4 h-4 text-ink-muted ml-1" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name, slug, or material..."
                className="bg-transparent w-full font-mono text-xs focus:outline-none text-ink"
              />
              {productSearch && (
                <button
                  onClick={() => setProductSearch("")}
                  className="text-xs font-mono font-bold text-coral px-2"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="card-brutal bg-cream-light overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Object</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Inventory</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {products
                    .filter((p) => {
                      if (!productSearch) return true;
                      const q = productSearch.toLowerCase();
                      return (
                        p.name.toLowerCase().includes(q) ||
                        p.slug.toLowerCase().includes(q) ||
                        (p.category_name && p.category_name.toLowerCase().includes(q)) ||
                        (p.material && p.material.toLowerCase().includes(q))
                      );
                    })
                    .map((p) => (
                    <tr key={p.id} className="hover:bg-cream/50">
                      <td className="p-3 font-bold text-ink flex items-center gap-3">
                        <div className="w-10 h-10 bg-cream border border-ink overflow-hidden flex-shrink-0">
                          <img src={p.primary_image || "/images/placeholder-product.svg"} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-sm uppercase">{p.name}</p>
                          <p className="text-[10px] text-ink-muted">{p.slug}</p>
                        </div>
                      </td>
                      <td className="p-3 uppercase">{p.category_name}</td>
                      <td className="p-3 font-bold">{formatINR(p.base_price)}</td>
                      <td className="p-3">
                        <span className={p.total_stock <= 5 ? "text-coral font-bold" : "text-ink"}>
                          {p.total_stock || 0} Units
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-bold border border-ink ${
                          p.status === "active" ? "bg-lime text-ink" : "bg-cream-dark text-ink"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setQuickEditProduct(p);
                              setEditPrice(String(p.base_price / 100));
                              setEditStock(String(p.total_stock || 0));
                              setEditStatus(p.status || "active");
                            }}
                            className="px-2 py-1 bg-ink text-cream hover:bg-lime hover:text-ink uppercase font-bold text-[10px] inline-flex items-center gap-1 border border-ink"
                          >
                            <Edit className="w-3 h-3" /> Quick Edit
                          </button>
                          <Link
                            to={`/products/${p.slug}`}
                            className="px-2 py-1 bg-cream border border-ink hover:bg-lime uppercase font-bold text-[10px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE 3: ORDER MANAGEMENT ──────────────────────────────── */}
        {activeModule === "orders" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-2">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Customer Orders ({orders.length})
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Monitor payments, print slips, update production status & dispatch via Shiprocket
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-cream-light p-2.5 border-2 border-ink">
                <Search className="w-4 h-4 text-ink-muted ml-1" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order #, customer name, email, or AWB tracking..."
                  className="bg-transparent w-full font-mono text-xs focus:outline-none text-ink"
                />
                {orderSearch && (
                  <button onClick={() => setOrderSearch("")} className="text-xs font-mono font-bold text-coral px-2">Clear</button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                {["all", "pending", "payment_confirmed", "processing", "shipped", "delivered"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setOrderStatusFilter(st)}
                    className={`px-3 py-2 text-[10px] font-mono uppercase font-bold border-2 transition-all flex-shrink-0 ${
                      orderStatusFilter === st
                        ? "bg-ink text-cream border-ink"
                        : "bg-cream-light text-ink border-ink/40 hover:border-ink"
                    }`}
                  >
                    {st === "all" ? "All" : st.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-brutal bg-cream-light overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Order Number</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Total Amount</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3">Air Tracking</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {orders
                    .filter((ord) => {
                      const matchesStatus = orderStatusFilter === "all" || ord.status === orderStatusFilter;
                      if (!orderSearch) return matchesStatus;
                      const q = orderSearch.toLowerCase();
                      const matchesSearch =
                        ord.order_number.toLowerCase().includes(q) ||
                        (ord.shipping_name && ord.shipping_name.toLowerCase().includes(q)) ||
                        (ord.customer_email && ord.customer_email.toLowerCase().includes(q)) ||
                        (ord.tracking_number && ord.tracking_number.toLowerCase().includes(q));
                      return matchesStatus && matchesSearch;
                    })
                    .map((ord) => (
                    <tr key={ord.id} className="hover:bg-cream/50">
                      <td className="p-3 font-bold text-ink">
                        <button
                          onClick={() => handleViewOrderDetails(ord.id)}
                          className="hover:text-coral underline text-left"
                        >
                          {ord.order_number}
                        </button>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-ink">{ord.shipping_name}</p>
                        <p className="text-[10px] text-ink-muted">{ord.customer_email}</p>
                      </td>
                      <td className="p-3 text-ink-muted">{formatDate(ord.created_at)}</td>
                      <td className="p-3 font-bold">{formatINR(ord.total_amount)}</td>
                      <td className="p-3">
                        <span className={getOrderStatusBadge(ord.status).className + " px-2 py-0.5 text-[10px] uppercase font-bold"}>
                          {getOrderStatusBadge(ord.status).label}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-lime-darker font-bold">
                        {ord.tracking_number || "—"}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewOrderDetails(ord.id)}
                            className="px-2 py-1 bg-cream text-ink hover:bg-lime text-[10px] uppercase font-bold border border-ink inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                          <button
                            onClick={() => handleShiprocketDispatch(ord.id)}
                            disabled={shiprocketLoading === ord.id || !!ord.tracking_number}
                            title={ord.tracking_number ? `AWB: ${ord.tracking_number}` : "Push order to Shiprocket"}
                            className={`px-2 py-1 text-[10px] uppercase font-mono font-bold border border-ink transition-all ${
                              ord.tracking_number
                                ? "bg-lime/20 text-ink/50 cursor-default"
                                : "bg-lime text-ink hover:bg-ink hover:text-lime"
                            }`}
                          >
                            {shiprocketLoading === ord.id ? "Shipping..." : ord.tracking_number ? "AWB Active" : "Shiprocket"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrderForStatus(ord);
                              setNewStatus(ord.status);
                              setStatusTrackingNum(ord.tracking_number || "");
                            }}
                            className="px-2.5 py-1 bg-ink text-cream hover:bg-lime hover:text-ink text-[10px] uppercase font-bold border border-ink"
                          >
                            Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE 4: CUSTOM 3D PRINTING REQUESTS & QUOTATIONS ──────── */}
        {activeModule === "custom" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Custom 3D Printing Pipeline ({customRequests.length})
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Inspect geometry, prepare quotations, schedule production
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {customRequests.map((req) => (
                <div key={req.id} className="card-brutal bg-cream-light p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-ink/15 gap-2">
                    <div>
                      <span className="font-display font-bold text-lg uppercase">
                        #{req.request_number}
                      </span>
                      <p className="font-mono text-xs text-ink-muted">
                        From: <span className="font-bold text-ink">{req.first_name || "Customer"} ({req.customer_email})</span> • Phone: {req.customer_phone || "—"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={getCustomRequestStatusBadge(req.status).className + " px-3 py-1 font-mono text-xs uppercase font-bold"}>
                        {getCustomRequestStatusBadge(req.status).label}
                      </span>
                      {req.file_name && (
                        <a
                          href={`/api/custom-requests/${req.id}/download-file`}
                          className="btn-dark text-xs py-1.5 px-3 flex items-center gap-1.5"
                          download
                        >
                          <Download className="w-3.5 h-3.5" /> Download STL
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs bg-cream p-4 border border-ink/20">
                    <div>
                      <span className="text-ink-muted uppercase block">Material:</span>
                      <span className="font-bold text-ink">{req.material || "PLA+"}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted uppercase block">Colorway:</span>
                      <span className="font-bold text-ink">{req.color || "Standard"}</span>
                    </div>
                    <div>
                      <span className="text-ink-muted uppercase block">Quantity:</span>
                      <span className="font-bold text-ink">{req.quantity} Units</span>
                    </div>
                  </div>

                  <div className="text-xs font-body text-ink leading-relaxed">
                    <p className="font-bold font-mono uppercase text-ink-muted mb-1">Customer Description:</p>
                    <p>{req.description}</p>
                    {req.additional_notes && (
                      <p className="mt-2 text-ink-muted font-mono text-[11px]">
                        Engineering Notes: {req.additional_notes}
                      </p>
                    )}
                  </div>

                  {/* Quotation Controls */}
                  <div className="pt-3 border-t border-ink/15 flex items-center justify-between">
                    <div>
                      {req.quotation_id ? (
                        <div className="font-mono text-xs">
                          <span className="text-ink-muted">Quote Amount: </span>
                          <span className="font-bold text-ink">{formatINR(req.quotation_amount)}</span>
                          <span className="badge-lime text-[10px] ml-2 uppercase">Status: {req.quotation_status}</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-coral font-bold uppercase">
                          ⚠ Needs Commercial Quotation
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setSelectedRequestForQuote(req)}
                      className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" /> Prepare / Edit Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MODULE 5: INVENTORY & STOCK ─────────────────────────────── */}
        {activeModule === "inventory" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
              <h2 className="font-display font-black text-2xl uppercase">
                Filament & Variant Inventory
              </h2>
            </div>

            <div className="card-brutal bg-cream-light overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Object Specification</th>
                    <th className="p-3">Variant Name</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3">Threshold</th>
                    <th className="p-3 text-right">Quick Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-cream/50">
                      <td className="p-3 font-bold text-ink">{inv.product_name}</td>
                      <td className="p-3">{inv.variant_name}</td>
                      <td className="p-3 text-ink-muted">{inv.sku || "—"}</td>
                      <td className="p-3 font-bold">
                        <span className={inv.stock <= inv.low_stock_threshold ? "badge-coral" : "badge-lime"}>
                          {inv.stock} Units
                        </span>
                      </td>
                      <td className="p-3 text-ink-muted">{inv.low_stock_threshold} Units</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleUpdateStock(inv.id, inv.stock)}
                          className="px-2.5 py-1 bg-ink text-cream hover:bg-lime hover:text-ink text-[10px] uppercase font-bold"
                        >
                          Adjust Count
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE 6: CUSTOMERS ROSTER ──────────────────────────────── */}
        {activeModule === "customers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
              <h2 className="font-display font-black text-2xl uppercase">
                Customer Database ({customers.length})
              </h2>
            </div>

            <div className="card-brutal bg-cream-light overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Orders Count</th>
                    <th className="p-3">Lifetime Value</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-cream/50">
                      <td className="p-3 font-bold text-ink">{c.first_name} {c.last_name}</td>
                      <td className="p-3">{c.email}</td>
                      <td className="p-3 text-ink-muted">{c.phone || "—"}</td>
                      <td className="p-3 font-bold">{c.order_count} Orders</td>
                      <td className="p-3 font-bold text-coral">{formatINR(c.total_spend)}</td>
                      <td className="p-3 text-ink-muted">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE 7: STORE SETTINGS ────────────────────────────────── */}
        {activeModule === "settings" && (
          <div className="card-brutal p-8 bg-cream-light space-y-6 max-w-2xl">
            <h2 className="font-display font-black text-2xl uppercase border-b-2 border-ink pb-3">
              Store & Operations Configuration
            </h2>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-ink font-bold uppercase mb-1">Brand Name</label>
                <input
                  type="text"
                  value={storeSettings.store_name || "THE TOYZ DEPT."}
                  readOnly
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={storeSettings.store_tagline || "THINGS YOU DIDN'T KNOW YOU NEEDED."}
                  readOnly
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold text-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold uppercase mb-1">Free Shipping Threshold</label>
                  <input
                    type="text"
                    value={storeSettings.free_shipping_threshold ? formatINR(parseInt(storeSettings.free_shipping_threshold, 10)) : "₹999"}
                    readOnly
                    className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-bold uppercase mb-1">Standard Shipping Fee</label>
                  <input
                    type="text"
                    value={storeSettings.standard_shipping_rate ? formatINR(parseInt(storeSettings.standard_shipping_rate, 10)) : "₹99"}
                    readOnly
                    className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Contact Email</label>
                <input
                  type="text"
                  value={BUSINESS_PROFILE.contact.email}
                  readOnly
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold text-lime-darker"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Principal Place of Business</label>
                <input
                  type="text"
                  value={BUSINESS_PROFILE.address.formatted}
                  readOnly
                  className="w-full bg-cream border-2 border-ink p-2.5"
                />
              </div>
            </div>
          </div>
        )}

        {/* ── MODULE 8: INQUIRIES & GRIEVANCES ────────────────────────── */}
        {activeModule === "inquiries" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-2">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Customer Inquiries & Grievances ({inquiries.length + grievances.length})
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Messages submitted via /contact and statutory consumer complaints from /grievance-redressal
                </p>
              </div>
            </div>

            {/* Grievances Section */}
            <div className="card-brutal bg-cream-light p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <h3 className="font-display font-black text-base uppercase text-coral flex items-center gap-2">
                  <span>Consumer Grievance Tickets (Statutory Rule 5(9))</span>
                </h3>
                <span className="badge-coral text-[10px]">{grievances.length} Active</span>
              </div>
              {grievances.length === 0 ? (
                <p className="font-mono text-xs text-ink-muted">No consumer grievances logged.</p>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {grievances.map((g: any) => (
                    <div key={g.id} className="p-4 bg-cream border-2 border-ink space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-ink/10 pb-2">
                        <div>
                          <span className="font-bold text-coral text-sm">{g.ticket_id}</span>
                          <span className="mx-2">•</span>
                          <span className="font-bold text-ink">{g.name}</span>
                          <span className="text-ink-muted"> ({g.email} | {g.phone})</span>
                        </div>
                        <span className="text-[10px] text-ink-muted">{formatDate(g.created_at)}</span>
                      </div>
                      <p className="text-[11px] text-ink font-bold">Nature: {g.grievance_type} {g.order_number ? `• Ref Order #${g.order_number}` : ""}</p>
                      <p className="text-xs text-ink/80 leading-relaxed bg-white p-2.5 border border-ink/20">{g.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contact Inquiries Section */}
            <div className="card-brutal bg-cream-light p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-ink/15 pb-2">
                <h3 className="font-display font-black text-base uppercase text-ink flex items-center gap-2">
                  <span>Contact Inquiries</span>
                </h3>
                <span className="badge-lime text-[10px]">{inquiries.length} Inquiries</span>
              </div>
              {inquiries.length === 0 ? (
                <p className="font-mono text-xs text-ink-muted">No contact inquiries logged yet.</p>
              ) : (
                <div className="space-y-3 font-mono text-xs">
                  {inquiries.map((inq: any) => (
                    <div key={inq.id} className="p-4 bg-cream border border-ink space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-ink/10 pb-2">
                        <div>
                          <span className="font-bold text-ink">{inq.name}</span>
                          <span className="text-ink-muted"> ({inq.email} {inq.phone ? `| ${inq.phone}` : ""})</span>
                        </div>
                        <span className="text-[10px] text-ink-muted">{formatDate(inq.created_at)}</span>
                      </div>
                      <p className="font-bold text-ink text-xs">Subject: {inq.subject}</p>
                      <p className="text-xs text-ink/80 leading-relaxed bg-white p-2.5 border border-ink/20">{inq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MODAL: PREPARE 3D QUOTATION ─────────────────────────────── */}
        {selectedRequestForQuote && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 sm:p-8 w-full max-w-lg space-y-5 shadow-brutal-xl">
              <div className="border-b-2 border-ink pb-3">
                <span className="badge-lime text-[10px] mb-1">Commercial Slicing Cost Sheet</span>
                <h3 className="font-display font-black text-xl uppercase">
                  Quotation for #{selectedRequestForQuote.request_number}
                </h3>
              </div>

              <form onSubmit={handleSendQuotation} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1">Material (₹)</label>
                    <input
                      type="number"
                      value={quoteMaterialCost}
                      onChange={(e) => setQuoteMaterialCost(e.target.value)}
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Machine (₹)</label>
                    <input
                      type="number"
                      value={quoteMachineCost}
                      onChange={(e) => setQuoteMachineCost(e.target.value)}
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Post QC (₹)</label>
                    <input
                      type="number"
                      value={quotePostCost}
                      onChange={(e) => setQuotePostCost(e.target.value)}
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-ink text-cream flex justify-between items-center text-sm font-display font-black uppercase">
                  <span>Calculated Total Quotation:</span>
                  <span className="text-lime text-lg">
                    ₹{(parseFloat(quoteMaterialCost || "0") + parseFloat(quoteMachineCost || "0") + parseFloat(quotePostCost || "0")).toFixed(0)}
                  </span>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Engineering Notes & Tolerances</label>
                  <textarea
                    value={quoteNotes}
                    onChange={(e) => setQuoteNotes(e.target.value)}
                    rows={2}
                    className="w-full bg-cream-light border-2 border-ink p-2 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-3 text-xs">
                    Send Quote to Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRequestForQuote(null)}
                    className="btn-secondary py-3 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: UPDATE ORDER STATUS ──────────────────────────────── */}
        {selectedOrderForStatus && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-md space-y-4 shadow-brutal-xl">
              <h3 className="font-display font-black text-lg uppercase border-b-2 border-ink pb-2">
                Order #{selectedOrderForStatus.order_number} Lifecycle
              </h3>

              <form onSubmit={handleUpdateOrderStatus} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Next Production Stage</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-cream-light border-2 border-ink p-2 font-bold uppercase"
                  >
                    <option value="pending">Pending</option>
                    <option value="payment_confirmed">Payment Confirmed</option>
                    <option value="processing">Processing & Slicing</option>
                    <option value="printing">3D Printing</option>
                    <option value="quality_check">Quality Check (QC)</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Air Waybill / Tracking Number</label>
                  <input
                    type="text"
                    value={statusTrackingNum}
                    onChange={(e) => setStatusTrackingNum(e.target.value)}
                    placeholder="e.g. BLR-DTDC-77491"
                    className="w-full bg-cream-light border-2 border-ink p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Internal Log Note</label>
                  <input
                    type="text"
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                    placeholder="e.g. Sliced on PEI sheet 0.12mm"
                    className="w-full bg-cream-light border-2 border-ink p-2"
                  />
                </div>

                {/* Shiprocket Automated Dispatch Option */}
                <div className="p-3 bg-lime/20 border-2 border-ink space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[11px] uppercase">Shiprocket Integration</span>
                    <span className="text-[10px] font-mono text-ink-muted">Auto-AWB</span>
                  </div>
                  <p className="text-[10px] text-ink-muted">
                    Automatically create order in Shiprocket, assign courier (Bluedart/Delhivery), generate live AWB & update order to Shipped.
                  </p>
                  <button
                    type="button"
                    disabled={shiprocketLoading === selectedOrderForStatus.id || !!selectedOrderForStatus.tracking_number}
                    onClick={() => handleShiprocketDispatch(selectedOrderForStatus.id)}
                    className="btn-dark w-full py-1.5 text-[10px] font-mono tracking-wider uppercase disabled:opacity-40"
                  >
                    {shiprocketLoading === selectedOrderForStatus.id
                      ? "Contacting Shiprocket..."
                      : selectedOrderForStatus.tracking_number
                      ? `AWB Active (${selectedOrderForStatus.tracking_number})`
                      : "🚀 Dispatch via Shiprocket"}
                  </button>
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                    Apply Status
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForStatus(null)}
                    className="btn-secondary py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: CREATE PRODUCT ───────────────────────────────────── */}
        {showCreateProductModal && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-lg space-y-4 shadow-brutal-xl max-h-[90vh] overflow-y-auto">
              <h3 className="font-display font-black text-xl uppercase border-b-2 border-ink pb-2">
                Create New Object Drop
              </h3>

              <form onSubmit={handleCreateProduct} className="space-y-3 font-mono text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">Product Name</label>
                  <input
                    type="text"
                    value={newProdName}
                    onChange={(e) => {
                      setNewProdName(e.target.value);
                      setNewProdSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }}
                    placeholder="Articulated Mecha Scorpion"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase mb-1">Slug</label>
                    <input
                      type="text"
                      value={newProdSlug}
                      onChange={(e) => setNewProdSlug(e.target.value)}
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Base Price (INR ₹)</label>
                    <input
                      type="number"
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      placeholder="1299"
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase mb-1">Category</label>
                    <select
                      value={newProdCategory}
                      onChange={(e) => setNewProdCategory(e.target.value)}
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold uppercase"
                    >
                      <option value="cat_collectibles">Collectibles</option>
                      <option value="cat_desk">Desk Objects</option>
                      <option value="cat_home">Home Stuff</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Material</label>
                    <input
                      type="text"
                      value={newProdMaterial}
                      onChange={(e) => setNewProdMaterial(e.target.value)}
                      className="w-full bg-cream-light border-2 border-ink p-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Description</label>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    rows={3}
                    placeholder="Detailed specifications, joint mechanics, desk styling..."
                    className="w-full bg-cream-light border-2 border-ink p-2"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                    Create Product in D1
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateProductModal(false)}
                    className="btn-secondary py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {/* ── MODAL: VIEW ORDER DETAILS & PACKING SLIP ───────────────── */}
        {viewingOrderDetails && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 sm:p-8 w-full max-w-2xl space-y-5 shadow-brutal-xl max-h-[90vh] overflow-y-auto font-mono text-xs">
              <div className="flex items-center justify-between border-b-2 border-ink pb-3">
                <div>
                  <span className="font-display font-black text-xl uppercase text-ink">
                    Order #{viewingOrderDetails.order_number}
                  </span>
                  <p className="text-[10px] text-ink-muted">
                    Placed on {formatDate(viewingOrderDetails.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={getOrderStatusBadge(viewingOrderDetails.status).className + " px-2.5 py-1 text-[10px] uppercase font-bold"}>
                    {getOrderStatusBadge(viewingOrderDetails.status).label}
                  </span>
                  <button
                    onClick={() => setViewingOrderDetails(null)}
                    className="p-1 hover:bg-cream-dark text-ink font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Shipping Address & Customer Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-light p-4 border-2 border-ink">
                <div>
                  <span className="text-[10px] uppercase text-ink-muted font-bold block mb-1">Customer & Recipient:</span>
                  <p className="font-bold text-ink text-sm">{viewingOrderDetails.shipping_name}</p>
                  <p className="text-ink/80">{viewingOrderDetails.customer_email || viewingOrderDetails.shipping_email}</p>
                  <p className="text-ink/80 font-bold mt-1">📞 {viewingOrderDetails.shipping_phone || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ink-muted font-bold block mb-1">Delivery Destination:</span>
                  <p className="text-ink">{viewingOrderDetails.shipping_address_line1}</p>
                  {viewingOrderDetails.shipping_address_line2 && <p className="text-ink">{viewingOrderDetails.shipping_address_line2}</p>}
                  <p className="text-ink">{viewingOrderDetails.shipping_city}, {viewingOrderDetails.shipping_state} - {viewingOrderDetails.shipping_postal_code}</p>
                  <p className="text-ink-muted text-[10px] mt-1">{viewingOrderDetails.shipping_country || "India"}</p>
                </div>
              </div>

              {/* Ordered Items Table */}
              <div>
                <span className="font-bold uppercase text-ink text-xs block mb-2">Ordered Tray Items:</span>
                <div className="border-2 border-ink overflow-x-auto">
                  <table className="w-full text-left bg-white text-xs">
                    <thead className="bg-cream border-b border-ink font-bold uppercase text-[10px] text-ink-muted">
                      <tr>
                        <th className="p-2.5">Item Description</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Unit Price</th>
                        <th className="p-2.5 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10">
                      {viewingOrderDetails.items?.map((it: any) => (
                        <tr key={it.id}>
                          <td className="p-2.5">
                            <p className="font-bold text-ink">{it.product_name}</p>
                            <p className="text-[10px] text-ink-muted">{it.variant_name || "Standard Edition"}</p>
                          </td>
                          <td className="p-2.5 text-center">{it.quantity}</td>
                          <td className="p-2.5 text-right">{formatINR(it.unit_price)}</td>
                          <td className="p-2.5 text-right font-bold">{formatINR(it.total_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total & Payment details */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
                <div className="space-y-1 text-[11px] text-ink-muted">
                  <p><strong>Tracking AWB:</strong> {viewingOrderDetails.tracking_number || "Pending dispatch"}</p>
                  {viewingOrderDetails.customer_notes && (
                    <p className="bg-lime/20 p-2 border border-ink text-ink">
                      <strong>Note:</strong> {viewingOrderDetails.customer_notes}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-60 bg-cream-light p-3 border-2 border-ink space-y-1 text-right">
                  <div className="flex justify-between text-ink-muted">
                    <span>Subtotal:</span>
                    <span>{formatINR(viewingOrderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Shipping:</span>
                    <span>{viewingOrderDetails.shipping_amount === 0 ? "FREE" : formatINR(viewingOrderDetails.shipping_amount)}</span>
                  </div>
                  <div className="flex justify-between font-display font-black text-sm text-ink pt-1 border-t border-ink/20">
                    <span>Total Paid:</span>
                    <span className="text-coral">{formatINR(viewingOrderDetails.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-ink">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-2 bg-cream-dark text-ink hover:bg-lime border border-ink text-xs font-bold uppercase flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Packing Slip
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOrderForStatus(viewingOrderDetails);
                      setNewStatus(viewingOrderDetails.status);
                      setStatusTrackingNum(viewingOrderDetails.tracking_number || "");
                      setViewingOrderDetails(null);
                    }}
                    className="btn-primary py-2 px-4 text-xs uppercase"
                  >
                    Update Lifecycle
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewingOrderDetails(null)}
                    className="btn-secondary py-2 px-4 text-xs uppercase"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL: QUICK EDIT PRODUCT ───────────────────────────────── */}
        {quickEditProduct && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-md space-y-4 shadow-brutal-xl font-mono text-xs">
              <div className="border-b-2 border-ink pb-2">
                <span className="badge-lime text-[10px] uppercase">Quick Inventory & Price Editor</span>
                <h3 className="font-display font-black text-lg uppercase text-ink mt-1">
                  {quickEditProduct.name}
                </h3>
              </div>

              <form onSubmit={handleQuickEditSave} className="space-y-4">
                <div>
                  <label className="block font-bold uppercase mb-1">Base Price in INR (₹)</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full bg-cream-light border-2 border-ink p-2 text-sm font-bold text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Stock Units on Hand</label>
                  <input
                    type="number"
                    step="1"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full bg-cream-light border-2 border-ink p-2 text-sm font-bold text-ink"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">Catalogue Status</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-cream-light border-2 border-ink p-2 font-bold uppercase"
                  >
                    <option value="active">Active (Visible in Store)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs uppercase">
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickEditProduct(null)}
                    className="btn-secondary py-2 text-xs uppercase"
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
