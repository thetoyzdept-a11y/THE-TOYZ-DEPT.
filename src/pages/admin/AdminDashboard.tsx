import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
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
  Camera,
  Upload,
  Lock,
  Key,
  ShieldCheck,
  EyeOff,
  Palette,
  Image as ImageIcon,
  Truck,
  Tag,
  Copy,
  Gift,
  Sparkles,
  Award,
  Star,
  ArrowLeftRight,
  RotateCcw,
  X,
} from "lucide-react";

export const STUDIO_PHOTO_PRESETS = [
  { name: "Cyber Dragon", url: "/images/products/dragon-1.jpg" },
  { name: "Flexi Rex", url: "/images/products/rex-1.jpg" },
  { name: "Crystal Serpent", url: "/images/products/serpent-1.jpg" },
  { name: "Concrete Planter", url: "/images/products/planter-1.jpg" },
  { name: "Cable Dock", url: "/images/products/dock-1.jpg" },
  { name: "Headphone Stand", url: "/images/products/stand-1.jpg" },
  { name: "Gear Cube", url: "/images/products/cube-1.jpg" },
  { name: "Geometric Wolf", url: "/images/products/wolf-1.jpg" },
  { name: "Bauhaus Caddy", url: "/images/products/caddy-1.jpg" },
  { name: "Magnetic Mounts", url: "/images/products/mount-1.jpg" },
  { name: "Test Token (₹1)", url: "/images/products/token-1.jpg" },
  { name: "Tactile Keychain (₹5)", url: "/images/products/keychain-1.jpg" },
];

export const CURATED_FILAMENT_COLORS = [
  { name: "Obsidian Matte Black", hex: "#18181B" },
  { name: "Dual-Tone Silk Cyber", hex: "#F59E0B" },
  { name: "Signal Neon Lime", hex: "#D4FF00" },
  { name: "Industrial Concrete Slate", hex: "#64748B" },
  { name: "Bauhaus Chalk White", hex: "#F8FAFC" },
  { name: "Safety Cyber Orange", hex: "#FF5522" },
  { name: "Metallic Cast Bronze", hex: "#92400E" },
  { name: "Iridescent Silk Violet", hex: "#A855F7" },
];

export function AdminDashboardPage() {
  const { user, loading: authLoading, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Admin Module synced with URL search query and path
  const VALID_MODULES = [
    "overview",
    "ledger",
    "orders",
    "products",
    "coupons",
    "surveys",
    "custom",
    "inventory",
    "customers",
    "settings",
    "inquiries",
    "security",
  ] as const;

  type AdminModule = (typeof VALID_MODULES)[number];

  const resolveModule = (): AdminModule => {
    const qTab = (searchParams.get("tab") || searchParams.get("module")) as AdminModule;
    if (qTab && VALID_MODULES.includes(qTab)) return qTab;
    for (const mod of VALID_MODULES) {
      if (location.pathname.includes(`/admin/${mod}`)) return mod;
    }
    return "overview";
  };

  const activeModule = resolveModule();

  const setActiveModule = (mod: AdminModule) => {
    setSearchParams({ tab: mod });
  };

  // State data
  const [metrics, setMetrics] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customRequests, setCustomRequests] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [storeSettings, setStoreSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccessMessage, setSettingsSuccessMessage] = useState("");
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [grievances, setGrievances] = useState<any[]>([]);
  const [adminAccounts, setAdminAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Coupons State
  const [coupons, setCoupons] = useState<any[]>([]);
  const [couponSearch, setCouponSearch] = useState("");
  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponDesc, setNewCouponDesc] = useState("");
  const [newCouponType, setNewCouponType] = useState<"percentage" | "fixed">("percentage");
  const [newCouponValue, setNewCouponValue] = useState("");
  const [newCouponMinOrder, setNewCouponMinOrder] = useState("");
  const [newCouponMaxUses, setNewCouponMaxUses] = useState("");
  const [newCouponActive, setNewCouponActive] = useState(true);
  const [savingCoupon, setSavingCoupon] = useState(false);
  const [couponActionLoading, setCouponActionLoading] = useState<string | null>(null);

  // Customer Surveys & Giveaway State
  const [surveys, setSurveys] = useState<any[]>([]);
  const [surveyStats, setSurveyStats] = useState<any>(null);
  const [surveySearch, setSurveySearch] = useState("");
  const [pickingWinner, setPickingWinner] = useState(false);
  const [winnerModal, setWinnerModal] = useState<any | null>(null);
  const [surveyActionLoading, setSurveyActionLoading] = useState<string | null>(null);

  // Transactions & Ledger State (Double-Entry Balance Sheet)
  const [transactions, setTransactions] = useState<any[]>([]);
  const [transactionSummary, setTransactionSummary] = useState<any>(null);
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<"all" | "credit_order" | "debit_refund">("all");
  const [refundModalOrder, setRefundModalOrder] = useState<any | null>(null);
  const [refundAmountInput, setRefundAmountInput] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [refundRestock, setRefundRestock] = useState(true);
  const [refundingLoading, setRefundingLoading] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [aiInsightsReport, setAiInsightsReport] = useState<{ totalAnalyzed: number; summary: string } | null>(null);
  const [aiInsightsCopied, setAiInsightsCopied] = useState(false);
  const [generatingProductCopy, setGeneratingProductCopy] = useState(false);

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
  const [editImage, setEditImage] = useState("");
  const [editColor, setEditColor] = useState("");
  const [showEditPresetsPicker, setShowEditPresetsPicker] = useState(false);

  // Modal & Edit States
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdSlug, setNewProdSlug] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("cat_collectibles");
  const [newProdMaterial, setNewProdMaterial] = useState("PLA+ (Standard)");
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdStatus, setNewProdStatus] = useState<"draft" | "active">("active");
  const [newProdImage, setNewProdImage] = useState("");
  const [newProdColor, setNewProdColor] = useState("Obsidian Matte Black");
  const [newProdStock, setNewProdStock] = useState("25");
  const [showCreatePresetsPicker, setShowCreatePresetsPicker] = useState(false);

  // Admin Password Management State
  const [currentAdminPass, setCurrentAdminPass] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");
  const [confirmAdminPass, setConfirmAdminPass] = useState("");
  const [showPassToggles, setShowPassToggles] = useState({ current: false, new: false, confirm: false });
  const [passChanging, setPassChanging] = useState(false);
  const [passChangeSuccess, setPassChangeSuccess] = useState("");
  const [passChangeError, setPassChangeError] = useState("");

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
  const [syncingAllShiprocket, setSyncingAllShiprocket] = useState(false);

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

  const handleSyncAllShiprocket = async () => {
    try {
      setSyncingAllShiprocket(true);
      const res = await api.syncAllShiprocketOrders();
      alert(`Shiprocket Sync Complete!\nSuccessfully pushed ${res.syncedCount} of ${res.totalAttempted} orders into Shiprocket Seller Dashboard (Channel 12931117: THE TOYZ DEPT.).`);
      await loadAllAdminData();
    } catch (err: any) {
      alert("Shiprocket Sync Error: " + err.message);
    } finally {
      setSyncingAllShiprocket(false);
    }
  };

  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "create" | "edit") => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (target === "create") {
        setNewProdImage(dataUrl);
      } else {
        setEditImage(dataUrl);
      }
    };
    reader.readAsDataURL(file);

    // Upload to Cloudflare R2 bucket
    setUploadingImage(true);
    try {
      const res = await api.uploadAdminAsset(file);
      if (res && res.url) {
        if (target === "create") {
          setNewProdImage(res.url);
        } else {
          setEditImage(res.url);
        }
      }
    } catch (err: any) {
      console.warn("R2 upload fallback to local dataUrl", err);
    } finally {
      setUploadingImage(false);
    }
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [overviewRes, prodRes, ordRes, custReqRes, invRes, custRes, setRes, compRes, acctRes, cpnRes, srvRes, txRes] = await Promise.all([
        api.getAdminOverview(),
        api.getAdminProducts(),
        api.getAdminOrders(),
        api.getAdminCustomRequests(),
        api.getAdminInventory(),
        api.getAdminCustomers(),
        api.getAdminSettings(),
        api.getAdminComplianceRecords().catch(() => ({ inquiries: [], grievances: [] })),
        api.getAdminAccounts().catch(() => ({ admins: [] })),
        api.getAdminCoupons().catch(() => ({ coupons: [] })),
        api.getAdminSurveys().catch(() => ({ surveys: [], stats: null })),
        api.getAdminTransactions().catch(() => ({ summary: null, transactions: [] })),
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
      setAdminAccounts(acctRes.admins || []);
      setCoupons(cpnRes.coupons || []);
      setSurveys(srvRes.surveys || []);
      setSurveyStats(srvRes.stats || null);
      setTransactions(txRes?.transactions || []);
      setTransactionSummary(txRes?.summary || null);
    } catch (err) {
      console.error("Admin data load error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleProcessRefundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundModalOrder) return;
    setRefundingLoading(true);
    try {
      const amountPaise = Math.round(parseFloat(refundAmountInput) * 100);
      const res = await api.refundAdminOrder(refundModalOrder.id, {
        amount: amountPaise,
        reason: refundReason,
        restock: refundRestock,
      });
      alert(`Success! Refund processed.\n${res.message}`);
      setRefundModalOrder(null);
      await loadAllAdminData();
    } catch (err: any) {
      alert("Refund Error: " + err.message);
    } finally {
      setRefundingLoading(false);
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
    setSavingProduct(true);
    try {
      const pricePaise = Math.round(parseFloat(editPrice) * 100);
      const stockNum = parseInt(editStock, 10);

      await api.updateAdminProduct(quickEditProduct.id, {
        name: quickEditProduct.name,
        slug: quickEditProduct.slug,
        basePrice: pricePaise,
        categoryId: quickEditProduct.category_id || undefined,
        material: editColor || quickEditProduct.material || undefined,
        description: quickEditProduct.description || undefined,
        status: editStatus,
        isFeatured: quickEditProduct.is_featured,
        image: editImage || undefined,
        stock: !isNaN(stockNum) ? stockNum : undefined,
      });

      const invRow = inventory.find((i) => i.product_id === quickEditProduct.id);
      if (invRow && !isNaN(stockNum)) {
        await api.updateAdminInventory(invRow.variant_id, stockNum).catch((err) => {
          console.warn("Inventory variant sync skipped", err);
        });
      }

      setQuickEditProduct(null);
      await loadAllAdminData();
      alert("Product details, photo, and inventory updated successfully!");
    } catch (err: any) {
      alert("Failed to update product: " + err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError("");
    setPassChangeSuccess("");

    if (newAdminPass.length < 8) {
      setPassChangeError("New password must be at least 8 characters long.");
      return;
    }
    if (newAdminPass !== confirmAdminPass) {
      setPassChangeError("New password and confirm password do not match.");
      return;
    }

    setPassChanging(true);
    try {
      const res = await api.changeAdminPassword({
        currentPassword: currentAdminPass || undefined,
        newPassword: newAdminPass,
      });
      setPassChangeSuccess((res.message || "Admin password successfully updated!") + " Redirecting to login to verify your new credentials...");
      setCurrentAdminPass("");
      setNewAdminPass("");
      setConfirmAdminPass("");
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 2200);
    } catch (err: any) {
      setPassChangeError(err.message || "Failed to update admin password.");
    } finally {
      setPassChanging(false);
    }
  };

  const handleSaveStoreSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccessMessage("");
    try {
      await api.saveAdminSettings(storeSettings);
      setSettingsSuccessMessage("Store operations configuration successfully updated and synced across customer portal & checkout!");
      await loadAllAdminData();
    } catch (err: any) {
      alert("Failed to save settings: " + err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      navigate("/account");
      return;
    }
    loadAllAdminData();
  }, [isAdmin, authLoading, navigate]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const basePricePaise = Math.round(parseFloat(newProdPrice) * 100);
      const stockUnits = parseInt(newProdStock, 10) || 10;
      await api.createAdminProduct({
        name: newProdName,
        slug: newProdSlug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        basePrice: basePricePaise,
        categoryId: newProdCategory,
        material: newProdColor ? `${newProdMaterial} (${newProdColor})` : newProdMaterial,
        description: newProdDesc,
        status: newProdStatus,
        isFeatured: true,
        images: newProdImage ? [newProdImage] : [],
        variants: [
          {
            name: newProdColor || "Standard Edition",
            color: newProdColor,
            stock: stockUnits,
            priceModifier: 0,
          },
        ],
      });
      setShowCreateProductModal(false);
      setNewProdName("");
      setNewProdSlug("");
      setNewProdPrice("");
      setNewProdDesc("");
      setNewProdImage("");
      await loadAllAdminData();
      alert("Product created successfully and published to live catalogue!");
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

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCouponCode.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!cleanCode) {
      alert("Please enter a valid coupon code (letters and numbers only).");
      return;
    }
    const val = parseFloat(newCouponValue);
    if (isNaN(val) || val <= 0) {
      alert("Please enter a valid discount value greater than 0.");
      return;
    }
    if (newCouponType === "percentage" && val > 100) {
      alert("Percentage discount cannot exceed 100%.");
      return;
    }

    setSavingCoupon(true);
    try {
      const res = await api.createAdminCoupon({
        code: cleanCode,
        description: newCouponDesc.trim() || undefined,
        discount_type: newCouponType,
        discount_value: val,
        minimum_order_amount: newCouponMinOrder ? parseFloat(newCouponMinOrder) : 0,
        max_uses: newCouponMaxUses ? parseInt(newCouponMaxUses, 10) : undefined,
        is_active: newCouponActive ? 1 : 0,
      });

      alert(res.message || `Coupon '${cleanCode}' created successfully!`);
      setShowCreateCouponModal(false);
      setNewCouponCode("");
      setNewCouponDesc("");
      setNewCouponValue("");
      setNewCouponMinOrder("");
      setNewCouponMaxUses("");
      setNewCouponActive(true);
      await loadAllAdminData();
    } catch (err: any) {
      alert("Failed to create coupon: " + (err.message || "Unknown error"));
    } finally {
      setSavingCoupon(false);
    }
  };

  const handleToggleCoupon = async (couponId: string) => {
    setCouponActionLoading(couponId);
    try {
      const res = await api.toggleAdminCoupon(couponId);
      setCoupons((prev) =>
        prev.map((c) => (c.id === couponId ? { ...c, is_active: res.is_active } : c))
      );
    } catch (err: any) {
      alert("Failed to toggle coupon status: " + (err.message || "Unknown error"));
    } finally {
      setCouponActionLoading(null);
    }
  };

  const handleDeleteCoupon = async (couponId: string, code: string) => {
    if (!confirm(`Are you sure you want to permanently delete coupon '${code}'?`)) {
      return;
    }
    setCouponActionLoading(couponId);
    try {
      await api.deleteAdminCoupon(couponId);
      setCoupons((prev) => prev.filter((c) => c.id !== couponId));
    } catch (err: any) {
      alert("Failed to delete coupon: " + (err.message || "Unknown error"));
    } finally {
      setCouponActionLoading(null);
    }
  };

  const handlePickWinner = async () => {
    if (!confirm("Are you ready to randomly draw a winner from all active survey participants?")) {
      return;
    }
    setPickingWinner(true);
    try {
      const res = await api.pickAdminSurveyWinner();
      setWinnerModal(res.winner);
      await loadAllAdminData();
    } catch (err: any) {
      alert("Failed to pick winner: " + (err.message || "Unknown error"));
    } finally {
      setPickingWinner(false);
    }
  };

  const handleToggleSurveyWinner = async (id: string) => {
    setSurveyActionLoading(id);
    try {
      const res = await api.toggleAdminSurveyWinner(id);
      setSurveys((prev) =>
        prev.map((s) => (s.id === id ? { ...s, winner_selected: res.winner_selected } : s))
      );
    } catch (err: any) {
      alert("Failed to toggle winner: " + (err.message || "Unknown error"));
    } finally {
      setSurveyActionLoading(null);
    }
  };

  const handleGenerateAiInsights = async () => {
    setAiInsightsLoading(true);
    try {
      const res = await api.getAdminAiSurveyInsights();
      setAiInsightsReport({
        totalAnalyzed: res.totalAnalyzed || surveys.length,
        summary: res.summary,
      });
    } catch (err: any) {
      alert("AI Survey synthesis error: " + (err.message || "Failed to analyze surveys"));
    } finally {
      setAiInsightsLoading(false);
    }
  };

  const handleGenerateProductCopy = async () => {
    if (!newProdName.trim()) {
      alert("Please enter a Product Name first so TOYZ-AI knows what to write about.");
      return;
    }
    setGeneratingProductCopy(true);
    try {
      const res = await api.generateProductCopy({
        name: newProdName,
        category: newProdCategory,
        material: newProdColor ? `${newProdMaterial} (${newProdColor})` : newProdMaterial,
      });
      setNewProdDesc(res.description);
    } catch (err: any) {
      alert("AI copy generation error: " + (err.message || "Failed to generate copy"));
    } finally {
      setGeneratingProductCopy(false);
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
              className="p-2 bg-cream/10 hover:bg-cream/20 text-cream border border-cream/30 text-xs font-mono uppercase flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Live Ops
            </button>
          </div>
        </div>

        {/* ── Navigation Tabs ─────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 font-display font-bold text-xs uppercase tracking-wider">
          {[
            { id: "overview", label: "Overview & Revenue", icon: DollarSign },
            { id: "ledger", label: `Balance Sheet (${transactions.length})`, icon: ArrowLeftRight },
            { id: "orders", label: `Orders (${orders.length})`, icon: Package },
            { id: "products", label: `Products (${products.length})`, icon: Layers },
            { id: "coupons", label: `Coupons (${coupons.length})`, icon: Tag },
            { id: "surveys", label: `Surveys & Raffle (${surveys.length})`, icon: Gift },
            { id: "inventory", label: "Inventory & Stock", icon: Sliders },
            { id: "inquiries", label: `Inquiries (${inquiries.length + grievances.length})`, icon: Mail },
            { id: "security", label: "Security & Passwords", icon: ShieldCheck },
            { id: "customers", label: `Customers (${customers.length})`, icon: Users },
            { id: "settings", label: "Store Settings", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id as any)}
                className={`px-4 py-2.5 border-2 flex items-center gap-2 flex-shrink-0 transition-all cursor-pointer ${
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
                <p className="font-mono text-xs uppercase text-ink-muted font-bold">Net Settled Revenue</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {formatINR(metrics.totalRevenue)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="badge-lime text-[10px] font-mono font-bold">PAID & SETTLED</span>
                  <button
                    onClick={() => setActiveModule("ledger" as any)}
                    className="text-[10px] font-mono font-bold text-coral underline hover:text-ink cursor-pointer"
                  >
                    Ledger →
                  </button>
                </div>
                <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-lime-darker font-bold">+{formatINR(metrics.grossRevenue || metrics.totalRevenue)}</span>
                  <span className="text-coral font-bold">-{formatINR(metrics.totalRefunds || 0)}</span>
                </div>
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
                <span className="font-mono text-[10px] text-ink-muted uppercase">Active Customers 👥</span>
              </div>

              <div className="card-brutal p-5 bg-cream-light space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted">Active Catalog Drops</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {products.length}
                </p>
                <span className="badge-lime text-[10px]">Tactile Drops Live</span>
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

        {/* ── MODULE: BALANCE SHEET & FINANCIAL TRANSACTIONS LEDGER ────── */}
        {activeModule === "ledger" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-2xl uppercase">
                    Financial Ledger & Balance Sheet
                  </h2>
                  <span className="badge-lime text-[10px]">AUDITED REAL-TIME</span>
                </div>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Verified cashflow ledger: gross captured sales (+), processed refunds (-), and running net balance
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadAllAdminData}
                  className="px-3.5 py-2 bg-cream text-ink border-2 border-ink font-mono text-xs font-bold uppercase shadow-brutal-sm hover:bg-lime transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Ledger</span>
                </button>
              </div>
            </div>

            {/* Financial Summary KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Gross Captured Sales */}
              <div className="card-brutal p-5 bg-cream-light border-2 border-ink space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted font-bold">Gross Captured Sales</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  +{formatINR(transactionSummary?.grossRevenue || metrics?.grossRevenue || 0)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="badge-lime text-[10px] font-mono font-bold">+ CREDIT (PAID)</span>
                  <span className="font-mono text-[10px] text-ink-muted font-bold">{transactionSummary?.creditCount || 0} Orders</span>
                </div>
              </div>

              {/* Total Returns & Refunds */}
              <div className="card-brutal p-5 bg-cream-light border-2 border-ink space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted font-bold">Returns & Refunds</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-coral">
                  -{formatINR(transactionSummary?.totalRefunds || metrics?.totalRefunds || 0)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="badge-coral text-[10px] font-mono font-bold">- DEBIT (RETURN)</span>
                  <span className="font-mono text-[10px] text-ink-muted font-bold">{transactionSummary?.debitCount || 0} Debits</span>
                </div>
              </div>

              {/* Net Settled Balance */}
              <div className="card-brutal p-5 bg-ink text-cream border-2 border-ink space-y-1">
                <p className="font-mono text-xs uppercase text-cream/70 font-bold">Net Settled Balance</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-lime">
                  {formatINR(transactionSummary?.netSettledBalance || metrics?.totalRevenue || 0)}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="badge-lime text-[10px] font-mono font-bold">NET CASH</span>
                  <span className="font-mono text-[10px] text-cream/60">Gross − Refunds</span>
                </div>
              </div>

              {/* Completed Transactions */}
              <div className="card-brutal p-5 bg-cream-light border-2 border-ink space-y-1">
                <p className="font-mono text-xs uppercase text-ink-muted font-bold">Total Ledger Entries</p>
                <p className="font-display font-black text-2xl sm:text-3xl text-ink">
                  {transactions.length}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-mono text-[10px] text-ink-muted uppercase font-bold">100% PREPAID RAZORPAY</span>
                  <span className="font-mono text-[10px] text-lime-darker font-bold">Settled</span>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-cream-light p-2.5 border-2 border-ink">
                <Search className="w-4 h-4 text-ink-muted ml-1 flex-shrink-0" />
                <input
                  type="text"
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  placeholder="Filter by Order # (e.g. TTD-2026-6330), customer name, or payment ID..."
                  className="bg-transparent w-full font-mono text-xs focus:outline-none text-ink"
                />
                {ledgerSearch && (
                  <button onClick={() => setLedgerSearch("")} className="text-xs font-mono font-bold text-coral px-2 cursor-pointer">Clear</button>
                )}
              </div>
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 font-mono text-xs">
                {[
                  { id: "all", label: `All (${transactions.length})` },
                  { id: "credit_order", label: `Sales / Credits (${transactionSummary?.creditCount || 0})` },
                  { id: "debit_refund", label: `Refunds / Debits (${transactionSummary?.debitCount || 0})` },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setLedgerTypeFilter(flt.id as any)}
                    className={`px-3 py-2 text-[10px] uppercase font-bold border-2 transition-all flex-shrink-0 cursor-pointer ${
                      ledgerTypeFilter === flt.id
                        ? "bg-ink text-cream border-ink shadow-brutal-sm"
                        : "bg-cream-light text-ink border-ink/40 hover:border-ink"
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ledger Balance Sheet Table */}
            <div className="card-brutal bg-cream-light overflow-x-auto border-2 border-ink">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Date & Time</th>
                    <th className="p-3">Order Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Gateway Ref</th>
                    <th className="p-3 text-right">Transaction Amount</th>
                    <th className="p-3 text-right">Running Net Balance</th>
                    <th className="p-3">Audit Note</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {transactions
                    .filter((tx) => {
                      const matchesType = ledgerTypeFilter === "all" || tx.type === ledgerTypeFilter;
                      if (!ledgerSearch) return matchesType;
                      const q = ledgerSearch.toLowerCase();
                      const matchesSearch =
                        (tx.order_number && tx.order_number.toLowerCase().includes(q)) ||
                        (tx.customer_name && tx.customer_name.toLowerCase().includes(q)) ||
                        (tx.customer_email && tx.customer_email.toLowerCase().includes(q)) ||
                        (tx.gateway_payment_id && tx.gateway_payment_id.toLowerCase().includes(q)) ||
                        (tx.gateway_refund_id && tx.gateway_refund_id.toLowerCase().includes(q)) ||
                        (tx.note && tx.note.toLowerCase().includes(q));
                      return matchesType && matchesSearch;
                    })
                    .map((tx) => (
                      <tr key={tx.id} className="hover:bg-cream/50 transition-colors">
                        <td className="p-3 text-[11px] text-ink-muted whitespace-nowrap">
                          {formatDate(tx.created_at)}
                        </td>
                        <td className="p-3 font-bold">
                          <button
                            onClick={() => {
                              if (tx.order_id) handleViewOrderDetails(tx.order_id);
                            }}
                            className="text-ink hover:text-coral underline font-bold cursor-pointer"
                          >
                            {tx.order_number}
                          </button>
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-ink">{tx.customer_name || "Customer"}</p>
                          <p className="text-[10px] text-ink-muted">{tx.customer_email}</p>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          {tx.type === "credit_order" ? (
                            <span className="badge-lime text-[10px] font-bold py-0.5 px-2 inline-flex items-center gap-1">
                              + CREDIT: SALE
                            </span>
                          ) : (
                            <span className="badge-coral text-[10px] font-bold py-0.5 px-2 inline-flex items-center gap-1">
                              - DEBIT: REFUND
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-ink-muted font-mono whitespace-nowrap">
                          {tx.gateway_payment_id ? (
                            <span className="text-lime-darker font-bold">{tx.gateway_payment_id}</span>
                          ) : tx.gateway_refund_id ? (
                            <span className="text-coral font-bold">{tx.gateway_refund_id}</span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3 text-right font-bold text-sm whitespace-nowrap">
                          {tx.type === "credit_order" ? (
                            <span className="text-lime-darker font-display font-black">
                              +{formatINR(tx.amount)}
                            </span>
                          ) : (
                            <span className="text-coral font-display font-black">
                              -{formatINR(tx.amount)}
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right font-display font-black text-sm text-ink whitespace-nowrap">
                          {formatINR(tx.runningBalance)}
                        </td>
                        <td className="p-3 text-[11px] text-ink-muted max-w-xs truncate" title={tx.note}>
                          {tx.note || "Standard transaction"}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {tx.type === "credit_order" && (
                            <button
                              onClick={() => {
                                const relatedOrder = orders.find((o) => o.id === tx.order_id || o.order_number === tx.order_number);
                                setRefundModalOrder(relatedOrder || { id: tx.order_id, order_number: tx.order_number, total_amount: tx.amount, shipping_name: tx.customer_name, shipping_email: tx.customer_email });
                                setRefundAmountInput(((tx.amount || 0) / 100).toString());
                                setRefundReason("");
                                setRefundRestock(true);
                              }}
                              className="px-2 py-1 bg-coral/10 text-coral hover:bg-coral hover:text-white text-[10px] uppercase font-bold border border-coral inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="Process return / refund"
                            >
                              <RotateCcw className="w-3 h-3" /> Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="p-12 text-center text-ink-muted font-mono text-xs">
                  No financial transactions recorded yet. Transactions will automatically appear here once payments are captured.
                </div>
              )}
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
                          {!p.primary_image && (
                            <button
                              type="button"
                              onClick={() => {
                                setQuickEditProduct(p);
                                setEditPrice(String(p.base_price / 100));
                                setEditStock(String(p.total_stock || 0));
                                setEditStatus(p.status || "active");
                                setEditImage("");
                                setEditColor(p.material || "Obsidian Matte Black");
                              }}
                              className="mt-1 px-1.5 py-0.5 bg-lime text-ink text-[9px] font-bold uppercase border border-ink shadow-brutal-sm hover:bg-lime-light inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Camera className="w-2.5 h-2.5" /> + Add Photo
                            </button>
                          )}
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
                              setEditImage(p.primary_image || "");
                              setEditColor(p.material || "Obsidian Matte Black");
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
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSyncAllShiprocket}
                  disabled={syncingAllShiprocket}
                  className="px-3.5 py-2 bg-lime text-ink border-2 border-ink font-mono text-xs font-bold uppercase shadow-brutal-sm hover:bg-ink hover:text-lime transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  title="Push all confirmed website orders into Shiprocket Seller Dashboard"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingAllShiprocket ? "animate-spin" : ""}`} />
                  <span>{syncingAllShiprocket ? "Syncing Shiprocket..." : "Sync Orders to Shiprocket"}</span>
                </button>
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
                    <th className="p-3">Amount</th>
                    <th className="p-3">Lifecycle</th>
                    <th className="p-3">Payment</th>
                    <th className="p-3">Shiprocket Logistics</th>
                    <th className="p-3 text-right">Actions</th>
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
                        (ord.tracking_number && ord.tracking_number.toLowerCase().includes(q)) ||
                        (ord.courier_name && ord.courier_name.toLowerCase().includes(q));
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
                        <p className="text-[10px] text-ink-muted">{ord.customer_email || ord.shipping_email || "Guest"}</p>
                      </td>
                      <td className="p-3 text-ink-muted">{formatDate(ord.created_at)}</td>
                      <td className="p-3 font-bold">{formatINR(ord.total_amount)}</td>
                      <td className="p-3">
                        <span className={getOrderStatusBadge(ord.status).className + " px-2 py-0.5 text-[10px] uppercase font-bold"}>
                          {getOrderStatusBadge(ord.status).label}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="space-y-0.5">
                          <span className="inline-block px-1.5 py-0.5 text-[10px] uppercase font-bold bg-lime/20 text-lime-darker border border-lime-darker">
                            {ord.payment_status === "captured" ? "PAID" : ord.payment_status || "PAID"}
                          </span>
                          <p className="text-[9px] font-mono text-ink-muted truncate max-w-[90px]">
                            {ord.payment_method || "Razorpay"}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-[11px]">
                        {ord.tracking_number ? (
                          <div className="space-y-0.5">
                            <a
                              href={ord.tracking_url || `https://shiprocket.co/tracking/${ord.tracking_number}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-bold text-lime-darker hover:underline flex items-center gap-1 font-mono"
                            >
                              <Truck className="w-3 h-3" /> {ord.tracking_number}
                            </a>
                            <p className="text-[10px] text-ink-muted">{ord.courier_name || "Shiprocket Air"}</p>
                          </div>
                        ) : (
                          <span className="text-ink-muted text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {ord.status === "pending" && ord.shipping_phone && (
                            <a
                              href={`https://wa.me/91${ord.shipping_phone.replace(/[^0-9]/g, "").slice(-10)}?text=${encodeURIComponent(
                                `Hi ${ord.shipping_name || "there"}! We noticed you initiated order #${ord.order_number} (₹${(ord.total_amount / 100).toFixed(2)}) on THE TOYZ DEPT. Did you face any payment issues? Let us know if you need any assistance!`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-[#25D366] text-white hover:bg-ink hover:text-[#25D366] text-[10px] uppercase font-bold border border-ink inline-flex items-center gap-1 cursor-pointer"
                              title="Recover abandoned order via WhatsApp"
                            >
                              <Phone className="w-3 h-3" /> WhatsApp
                            </a>
                          )}
                          <button
                            onClick={() => handleViewOrderDetails(ord.id)}
                            className="px-2 py-1 bg-cream text-ink hover:bg-lime text-[10px] uppercase font-bold border border-ink inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" /> View
                          </button>
                          {ord.label_url && (
                            <a
                              href={ord.label_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 bg-coral/20 text-coral hover:bg-coral hover:text-white text-[10px] uppercase font-bold border border-coral inline-flex items-center gap-1"
                              title="Print Shipping Label PDF"
                            >
                              <Printer className="w-3 h-3" /> Label
                            </a>
                          )}
                          <button
                            onClick={() => handleShiprocketDispatch(ord.id)}
                            disabled={shiprocketLoading === ord.id || !!ord.tracking_number}
                            title={ord.tracking_number ? `AWB: ${ord.tracking_number}` : "Push order to Shiprocket"}
                            className={`px-2 py-1 text-[10px] uppercase font-mono font-bold border border-ink transition-all ${
                              ord.tracking_number
                                ? "bg-lime/20 text-ink/50 cursor-default"
                                : "bg-lime text-ink hover:bg-ink hover:text-lime cursor-pointer"
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
                            className="px-2.5 py-1 bg-ink text-cream hover:bg-lime hover:text-ink text-[10px] uppercase font-bold border border-ink cursor-pointer"
                          >
                            Status
                          </button>
                          {ord.status !== "refunded" && (ord.payment_status === "captured" || ord.status !== "pending") && (
                            <button
                              onClick={() => {
                                setRefundModalOrder(ord);
                                setRefundAmountInput(((ord.total_amount || 0) / 100).toString());
                                setRefundReason("");
                                setRefundRestock(true);
                              }}
                              className="px-2 py-1 bg-coral/10 text-coral hover:bg-coral hover:text-white text-[10px] uppercase font-bold border border-coral inline-flex items-center gap-1 cursor-pointer transition-colors"
                              title="Process return & refund"
                            >
                              <RotateCcw className="w-3 h-3" /> Refund
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE: COUPONS & PROMOTIONAL DISCOUNTS ──────────────────── */}
        {activeModule === "coupons" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-3">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Coupons & Promotional Discounts ({coupons.length})
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Manage promo codes, percentage or flat discounts, order thresholds, and redemption caps
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateCouponModal(true)}
                className="btn-primary py-2.5 px-4 text-xs font-black uppercase flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Coupon</span>
              </button>
            </div>

            {/* Coupons KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Total Coupons</span>
                  <p className="font-display font-black text-2xl text-ink">{coupons.length}</p>
                </div>
                <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center">
                  <Tag className="w-5 h-5 text-ink" />
                </div>
              </div>
              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Active Promotions</span>
                  <p className="font-display font-black text-2xl text-lime-dark">
                    {coupons.filter((c) => c.is_active === 1).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-lime border-2 border-ink flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-ink" />
                </div>
              </div>
              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Total Redemptions</span>
                  <p className="font-display font-black text-2xl text-coral">
                    {coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-coral/20 border-2 border-ink flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-ink" />
                </div>
              </div>
            </div>

            {/* Search Filter */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search coupons by code or campaign description..."
                  value={couponSearch}
                  onChange={(e) => setCouponSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream-light border-2 border-ink text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-lime"
                />
              </div>
              {couponSearch && (
                <button
                  type="button"
                  onClick={() => setCouponSearch("")}
                  className="btn-secondary py-2 px-3 text-xs uppercase font-mono"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Coupons Table */}
            <div className="card-brutal bg-cream border-2 border-ink overflow-x-auto shadow-brutal">
              <table className="w-full font-mono text-xs text-left border-collapse">
                <thead className="bg-ink text-cream uppercase text-[11px] border-b-2 border-ink">
                  <tr>
                    <th className="p-3">Coupon Code</th>
                    <th className="p-3">Discount Type & Value</th>
                    <th className="p-3">Min Order</th>
                    <th className="p-3">Uses / Cap</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/20">
                  {coupons.filter(
                    (c) =>
                      !couponSearch ||
                      c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
                      (c.description && c.description.toLowerCase().includes(couponSearch.toLowerCase()))
                  ).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-ink-muted font-mono">
                        No coupons found in database. Click "Create New Coupon" to add your first promotion.
                      </td>
                    </tr>
                  ) : (
                    coupons
                      .filter(
                        (c) =>
                          !couponSearch ||
                          c.code.toLowerCase().includes(couponSearch.toLowerCase()) ||
                          (c.description && c.description.toLowerCase().includes(couponSearch.toLowerCase()))
                      )
                      .map((cpn) => {
                        const isPercentage = cpn.discount_type === "percentage";
                        const isExpired = cpn.max_uses && cpn.used_count >= cpn.max_uses;
                        return (
                          <tr key={cpn.id} className="hover:bg-cream-light transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-black text-sm uppercase tracking-wider text-ink bg-cream-light px-2 py-0.5 border border-ink">
                                  {cpn.code}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(cpn.code);
                                    alert(`Copied '${cpn.code}' to clipboard!`);
                                  }}
                                  title="Copy coupon code"
                                  className="p-1 hover:bg-lime border border-ink/40 text-ink transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                              {cpn.description && (
                                <p className="text-[11px] text-ink-muted mt-1 max-w-xs truncate font-mono">
                                  {cpn.description}
                                </p>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-ink text-xs">
                                {isPercentage ? (
                                  <span className="text-lime-dark bg-lime/20 px-2 py-0.5 border border-ink font-black">
                                    {cpn.discount_value}% OFF
                                  </span>
                                ) : (
                                  <span className="text-ink bg-cream-light px-2 py-0.5 border border-ink font-black">
                                    {formatINR(cpn.discount_value)} FLAT OFF
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="p-3 font-mono">
                              {cpn.minimum_order_amount && cpn.minimum_order_amount > 0 ? (
                                <span className="font-bold text-ink">
                                  {formatINR(cpn.minimum_order_amount)}
                                </span>
                              ) : (
                                <span className="text-ink-muted">No Minimum</span>
                              )}
                            </td>
                            <td className="p-3 font-mono">
                              <span className="font-bold">
                                {cpn.used_count || 0}
                              </span>
                              <span className="text-ink-muted">
                                {" / "}{cpn.max_uses ? cpn.max_uses : "∞"}
                              </span>
                              {isExpired && (
                                <span className="block text-[10px] text-coral font-bold uppercase">
                                  Cap Reached
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {cpn.is_active === 1 ? (
                                <span className="badge-lime text-[10px] inline-flex items-center gap-1 font-bold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-ink animate-pulse" />
                                  ACTIVE
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 bg-ink/10 text-ink-muted border border-ink/20 text-[10px] font-bold uppercase">
                                  INACTIVE
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  disabled={couponActionLoading === cpn.id}
                                  onClick={() => handleToggleCoupon(cpn.id)}
                                  className={`px-2.5 py-1 text-[10px] uppercase font-bold border border-ink transition-colors cursor-pointer ${
                                    cpn.is_active === 1
                                      ? "bg-cream-light hover:bg-coral hover:text-cream text-ink"
                                      : "bg-lime hover:bg-ink hover:text-cream text-ink"
                                  } disabled:opacity-50`}
                                >
                                  {couponActionLoading === cpn.id
                                    ? "..."
                                    : cpn.is_active === 1
                                    ? "Deactivate"
                                    : "Activate"}
                                </button>
                                <button
                                  type="button"
                                  disabled={couponActionLoading === cpn.id}
                                  onClick={() => handleDeleteCoupon(cpn.id, cpn.code)}
                                  title="Delete coupon permanently"
                                  className="p-1 text-ink-muted hover:text-coral hover:bg-coral/10 border border-ink/30 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODULE: CUSTOMER SURVEYS & MONTHLY GIVEAWAY ────────────── */}
        {activeModule === "surveys" && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-2xl uppercase">
                    Customer Surveys & Giveaway ({surveys.length})
                  </h2>
                  <span className="badge-lime text-[10px] font-mono font-bold">MONTHLY RAFFLE</span>
                </div>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Collector feedback, product ideas, filament demands, and giveaway drawing console
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  disabled={aiInsightsLoading || surveys.length === 0}
                  onClick={handleGenerateAiInsights}
                  className="btn-secondary py-2.5 px-4 text-xs font-black uppercase flex items-center gap-2 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 cursor-pointer bg-cream"
                >
                  <Sparkles className="w-4 h-4 text-coral" />
                  <span>{aiInsightsLoading ? "Synthesizing with AI..." : "🧠 AI Survey Insights"}</span>
                </button>

                <button
                  type="button"
                  disabled={pickingWinner || surveys.filter((s) => s.winner_selected === 0).length === 0}
                  onClick={handlePickWinner}
                  className="btn-primary py-2.5 px-4 text-xs font-black uppercase flex items-center gap-2 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-ink" />
                  <span>{pickingWinner ? "Drawing Random Winner..." : "🎲 Draw Monthly Winner"}</span>
                </button>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Total Responses</span>
                  <p className="font-display font-black text-2xl text-ink">{surveys.length}</p>
                </div>
                <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center">
                  <FileText className="w-5 h-5 text-ink" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Average Rating</span>
                  <p className="font-display font-black text-2xl text-lime-dark flex items-center gap-1">
                    <span>{surveyStats?.averageRating || 5.0}</span>
                    <Star className="w-5 h-5 fill-lime-dark text-lime-dark" />
                  </p>
                </div>
                <div className="w-10 h-10 bg-lime border-2 border-ink flex items-center justify-center">
                  <Award className="w-5 h-5 text-ink" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Winners Awarded</span>
                  <p className="font-display font-black text-2xl text-coral">
                    {surveys.filter((s) => s.winner_selected === 1).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-coral/20 border-2 border-ink flex items-center justify-center">
                  <Gift className="w-5 h-5 text-coral" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Active Ticket Pool</span>
                  <p className="font-display font-black text-2xl text-ink">
                    {surveys.filter((s) => s.winner_selected === 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-ink" />
                </div>
              </div>
            </div>

            {/* AI Survey Intelligence & Executive R&D Briefing */}
            {aiInsightsReport && (
              <div className="card-brutal p-5 bg-cream border-3 border-ink shadow-brutal-lg space-y-4 animate-in fade-in duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-lime text-ink flex items-center justify-center border border-ink shadow-brutal-xs font-black">
                      <Sparkles className="w-4 h-4 text-coral" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-lg uppercase text-ink flex items-center gap-2">
                        <span>Executive Product R&D Briefing</span>
                        <span className="badge-lime text-[9px] font-mono font-bold">GPT-4O-MINI</span>
                      </h3>
                      <p className="font-mono text-[10px] text-ink-muted uppercase">
                        AI synthesis of {aiInsightsReport.totalAnalyzed} collector responses from database
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(aiInsightsReport.summary);
                        setAiInsightsCopied(true);
                        setTimeout(() => setAiInsightsCopied(false), 2000);
                      }}
                      className="btn-dark py-1.5 px-3 text-[11px] font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-brutal-xs"
                    >
                      {aiInsightsCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-lime" />
                          <span>COPIED BRIEFING!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>COPY BRIEFING</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiInsightsReport(null)}
                      className="btn-secondary py-1.5 px-3 text-[11px] font-mono font-bold cursor-pointer"
                    >
                      DISMISS
                    </button>
                  </div>
                </div>

                <div className="font-mono text-xs text-ink leading-relaxed whitespace-pre-wrap bg-cream-light p-4 border-2 border-ink shadow-inner">
                  {aiInsightsReport.summary}
                </div>
              </div>
            )}

            {/* Search Filter */}
            <div className="flex gap-2 font-mono">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-3 text-ink-muted" />
                <input
                  type="text"
                  placeholder="Search participants by name, email, raffle code, product idea, or Instagram..."
                  value={surveySearch}
                  onChange={(e) => setSurveySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-cream-light border-2 border-ink text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-lime"
                />
              </div>
              {surveySearch && (
                <button
                  type="button"
                  onClick={() => setSurveySearch("")}
                  className="btn-secondary py-2 px-3 text-xs uppercase"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Survey Submissions Table */}
            <div className="card-brutal bg-cream border-2 border-ink overflow-x-auto shadow-brutal">
              <table className="w-full font-mono text-xs text-left border-collapse">
                <thead className="bg-ink text-cream uppercase text-[11px] border-b-2 border-ink">
                  <tr>
                    <th className="p-3">Participant & Contact</th>
                    <th className="p-3">Raffle Ticket</th>
                    <th className="p-3">Favorite Category & Pick</th>
                    <th className="p-3">Wishlist Colors & Budget</th>
                    <th className="p-3">Dream Drop Ideas</th>
                    <th className="p-3">Rating</th>
                    <th className="p-3">Giveaway Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-ink/20">
                  {surveys.filter((s) => {
                    if (!surveySearch) return true;
                    const q = surveySearch.toLowerCase();
                    return (
                      s.name?.toLowerCase().includes(q) ||
                      s.email?.toLowerCase().includes(q) ||
                      s.raffle_code?.toLowerCase().includes(q) ||
                      s.instagram?.toLowerCase().includes(q) ||
                      s.product_ideas?.toLowerCase().includes(q) ||
                      s.favorite_category?.toLowerCase().includes(q)
                    );
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-ink-muted font-mono">
                        No survey responses found. When customers complete the survey at /survey, entries will appear here in real time.
                      </td>
                    </tr>
                  ) : (
                    surveys
                      .filter((s) => {
                        if (!surveySearch) return true;
                        const q = surveySearch.toLowerCase();
                        return (
                          s.name?.toLowerCase().includes(q) ||
                          s.email?.toLowerCase().includes(q) ||
                          s.raffle_code?.toLowerCase().includes(q) ||
                          s.instagram?.toLowerCase().includes(q) ||
                          s.product_ideas?.toLowerCase().includes(q) ||
                          s.favorite_category?.toLowerCase().includes(q)
                        );
                      })
                      .map((srv) => (
                        <tr key={srv.id} className="hover:bg-cream-light transition-colors">
                          <td className="p-3">
                            <span className="font-display font-black text-sm uppercase text-ink block">
                              {srv.name}
                            </span>
                            <a
                              href={`mailto:${srv.email}`}
                              className="text-xs text-ink-muted hover:text-coral underline block"
                            >
                              {srv.email}
                            </a>
                            {srv.phone && (
                              <a
                                href={`tel:${srv.phone}`}
                                className="text-[10px] text-ink-muted hover:text-ink block mt-0.5"
                              >
                                📞 {srv.phone}
                              </a>
                            )}
                            {srv.instagram && (
                              <a
                                href={`https://instagram.com/${srv.instagram.replace(/^@/, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[10px] text-coral hover:underline font-bold inline-flex items-center gap-1 mt-0.5"
                              >
                                <span>📸 @{srv.instagram.replace(/^@/, "")}</span>
                                <span className="badge-coral text-[8px] py-0 px-1 font-mono">+1 TICKET</span>
                              </a>
                            )}
                          </td>

                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display font-black text-xs uppercase bg-cream-light border border-ink px-2 py-0.5">
                                {srv.raffle_code}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(srv.raffle_code);
                                  alert(`Copied raffle code ${srv.raffle_code}!`);
                                }}
                                className="p-1 hover:bg-lime border border-ink/40 text-ink cursor-pointer"
                                title="Copy code"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[10px] text-ink-muted mt-1 block">
                              {formatDate(srv.created_at)}
                            </span>
                          </td>

                          <td className="p-3">
                            <span className="font-bold text-ink block text-xs">
                              {srv.favorite_category}
                            </span>
                            {srv.favorite_product && (
                              <span className="text-[11px] text-ink-muted block mt-0.5">
                                Pick: {srv.favorite_product}
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-[11px]">
                            {srv.desired_colors && (
                              <p className="text-ink font-bold">
                                🎨 {srv.desired_colors}
                              </p>
                            )}
                            {srv.price_preference && (
                              <p className="text-ink-muted mt-0.5">
                                💰 {srv.price_preference}
                              </p>
                            )}
                          </td>

                          <td className="p-3 max-w-xs">
                            {srv.product_ideas ? (
                              <p className="text-xs text-ink/90 font-mono bg-cream-light p-2 border border-ink/20 line-clamp-3">
                                "{srv.product_ideas}"
                              </p>
                            ) : (
                              <span className="text-ink-muted text-[11px]">No specific idea entered</span>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="inline-flex items-center gap-1 font-bold text-xs bg-lime/20 px-2 py-0.5 border border-ink text-ink">
                              <Star className="w-3 h-3 fill-ink text-ink" />
                              <span>{srv.rating || 5}/5</span>
                            </span>
                          </td>

                          <td className="p-3">
                            {srv.winner_selected === 1 ? (
                              <span className="badge-lime text-[10px] font-black inline-flex items-center gap-1">
                                <Award className="w-3.5 h-3.5 text-ink" />
                                WINNER 🏆
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 bg-ink/10 text-ink-muted border border-ink/20 text-[10px] font-bold uppercase">
                                Active Raffle
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                disabled={surveyActionLoading === srv.id}
                                onClick={() => handleToggleSurveyWinner(srv.id)}
                                className={`px-2 py-1 text-[10px] uppercase font-bold border border-ink transition-colors cursor-pointer ${
                                  srv.winner_selected === 1
                                    ? "bg-coral text-cream hover:bg-ink"
                                    : "bg-lime text-ink hover:bg-ink hover:text-cream"
                                } disabled:opacity-50`}
                              >
                                {surveyActionLoading === srv.id
                                  ? "..."
                                  : srv.winner_selected === 1
                                  ? "Revoke"
                                  : "Award 🏆"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  )}
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
          <div className="space-y-6 animate-in fade-in duration-150">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-black text-2xl uppercase">
                    3D Print Queue & Inventory Radar ({inventory.length})
                  </h2>
                  <span className="badge-lime text-[10px] font-mono font-bold">DSA VELOCITY ENGINE</span>
                </div>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Time-series sales velocity, days until runout, and recommended printer queue batches
                </p>
              </div>
            </div>

            {/* Inventory KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Total SKUs</span>
                  <p className="font-display font-black text-2xl text-ink">{inventory.length}</p>
                </div>
                <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center">
                  <Sliders className="w-5 h-5 text-ink" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-coral text-[10px] uppercase font-bold font-mono">Critical Runouts</span>
                  <p className="font-display font-black text-2xl text-coral">
                    {inventory.filter((i) => i.urgency === "CRITICAL_PRINT_QUEUE").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-coral/20 border-2 border-ink flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-coral" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Restock Warnings</span>
                  <p className="font-display font-black text-2xl text-lime-dark">
                    {inventory.filter((i) => i.urgency === "RESTOCK_WARNING").length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-lime border-2 border-ink flex items-center justify-center">
                  <Package className="w-5 h-5 text-ink" />
                </div>
              </div>

              <div className="card-brutal p-4 bg-cream-light border-2 border-ink flex items-center justify-between">
                <div>
                  <span className="text-ink-muted text-[10px] uppercase font-bold font-mono">Total Units on Shelf</span>
                  <p className="font-display font-black text-2xl text-ink">
                    {inventory.reduce((sum, i) => sum + (i.stock || 0), 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-cream border-2 border-ink flex items-center justify-center">
                  <Layers className="w-5 h-5 text-ink" />
                </div>
              </div>
            </div>

            <div className="card-brutal bg-cream-light overflow-x-auto border-2 border-ink">
              <table className="w-full text-left font-mono text-xs">
                <thead className="bg-cream border-b-2 border-ink text-ink-muted uppercase">
                  <tr>
                    <th className="p-3">Object Specification</th>
                    <th className="p-3">Variant / SKU</th>
                    <th className="p-3">On-Hand Stock</th>
                    <th className="p-3">14D Run Rate</th>
                    <th className="p-3">Days of Buffer</th>
                    <th className="p-3">Recommended Print Batch</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10">
                  {inventory.map((inv) => (
                    <tr key={inv.id} className="hover:bg-cream/50 transition-colors">
                      <td className="p-3 font-bold text-ink">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={inv.primary_image || "/images/placeholder-product.svg"}
                            alt={inv.product_name}
                            className="w-8 h-8 object-cover border border-ink/40 flex-shrink-0"
                          />
                          <span>{inv.product_name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-bold">{inv.variant_name}</span>
                        <span className="block text-[10px] text-ink-muted">{inv.sku || "—"}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={
                            inv.urgency === "CRITICAL_PRINT_QUEUE"
                              ? "badge-coral font-bold"
                              : inv.urgency === "RESTOCK_WARNING"
                              ? "bg-amber-200 text-ink border border-ink px-2 py-0.5 font-bold"
                              : "badge-lime"
                          }
                        >
                          {inv.stock} Units
                        </span>
                      </td>
                      <td className="p-3 text-ink">
                        <span className="font-bold">{inv.dailyVelocity || 0}</span>
                        <span className="text-[10px] text-ink-muted"> units/day</span>
                      </td>
                      <td className="p-3">
                        {inv.daysRemaining !== null ? (
                          <span
                            className={
                              inv.daysRemaining <= 3
                                ? "text-coral font-bold"
                                : inv.daysRemaining <= 7
                                ? "text-amber-600 font-bold"
                                : "text-lime-dark font-bold"
                            }
                          >
                            ~{inv.daysRemaining} Days
                          </span>
                        ) : (
                          <span className="text-ink-muted text-[10px]">Zero Recent Burn</span>
                        )}
                      </td>
                      <td className="p-3">
                        {inv.urgency === "CRITICAL_PRINT_QUEUE" ? (
                          <span className="badge-coral text-[10px] font-bold">
                            ⚡ Print {inv.recommendedPrintBatch} Units
                          </span>
                        ) : inv.urgency === "RESTOCK_WARNING" ? (
                          <span className="bg-lime text-ink border border-ink px-2 py-0.5 text-[10px] font-bold">
                            Queue {inv.recommendedPrintBatch} Units
                          </span>
                        ) : (
                          <span className="text-ink-muted text-[10px]">Stock Optimal ✓</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleUpdateStock(inv.id, inv.stock)}
                          className="px-2.5 py-1 bg-ink text-cream hover:bg-lime hover:text-ink text-[10px] uppercase font-bold cursor-pointer transition-colors"
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
          <div className="card-brutal p-8 bg-cream-light space-y-6 max-w-2xl font-mono text-xs">
            <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Store & Operations Configuration
                </h2>
                <p className="text-ink-muted text-[11px] mt-0.5">
                  Synchronizes legal business profile, free shipping limits, and support contact across the website and customer dashboard.
                </p>
              </div>
              <span className="badge-lime text-[10px] uppercase">Live Sync</span>
            </div>

            {settingsSuccessMessage && (
              <div className="p-3 bg-lime/30 border-2 border-ink text-ink font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-darker flex-shrink-0" />
                {settingsSuccessMessage}
              </div>
            )}

            <form onSubmit={handleSaveStoreSettings} className="space-y-4">
              <div>
                <label className="block text-ink font-bold uppercase mb-1">Brand Name</label>
                <input
                  type="text"
                  value={storeSettings.store_name || "THE TOYZ DEPT."}
                  onChange={(e) => setStoreSettings({ ...storeSettings, store_name: e.target.value })}
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Brand Tagline</label>
                <input
                  type="text"
                  value={storeSettings.store_tagline || "THINGS YOU DIDN'T KNOW YOU NEEDED."}
                  onChange={(e) => setStoreSettings({ ...storeSettings, store_tagline: e.target.value })}
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold text-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-ink font-bold uppercase mb-1">Free Shipping Threshold (Paise)</label>
                  <input
                    type="number"
                    value={storeSettings.free_shipping_threshold || "99900"}
                    onChange={(e) => setStoreSettings({ ...storeSettings, free_shipping_threshold: e.target.value })}
                    className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                  />
                  <span className="text-[10px] text-ink-muted">₹{parseInt(storeSettings.free_shipping_threshold || "99900", 10) / 100}</span>
                </div>
                <div>
                  <label className="block text-ink font-bold uppercase mb-1">Standard Shipping Fee (Paise)</label>
                  <input
                    type="number"
                    value={storeSettings.standard_shipping_rate || "9900"}
                    onChange={(e) => setStoreSettings({ ...storeSettings, standard_shipping_rate: e.target.value })}
                    className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                  />
                  <span className="text-[10px] text-ink-muted">₹{parseInt(storeSettings.standard_shipping_rate || "9900", 10) / 100}</span>
                </div>
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Contact Email</label>
                <input
                  type="email"
                  value={storeSettings.contact_email || BUSINESS_PROFILE.contact.email}
                  onChange={(e) => setStoreSettings({ ...storeSettings, contact_email: e.target.value })}
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold text-lime-darker"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={storeSettings.contact_phone || BUSINESS_PROFILE.contact.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, contact_phone: e.target.value })}
                  className="w-full bg-cream border-2 border-ink p-2.5 font-bold"
                />
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Principal Place of Business</label>
                <textarea
                  rows={2}
                  value={storeSettings.address || BUSINESS_PROFILE.address.formatted}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  className="w-full bg-cream border-2 border-ink p-2.5"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="btn-primary py-2.5 px-6 text-xs uppercase flex items-center gap-2"
                >
                  {savingSettings ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Configuration...
                    </>
                  ) : (
                    "Save & Sync Store Operations"
                  )}
                </button>
              </div>
            </form>
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

        {/* ── MODULE 9: SECURITY & ADMIN PASSWORDS ───────────────────────── */}
        {activeModule === "security" && (
          <div className="space-y-6 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b-2 border-ink gap-2">
              <div>
                <h2 className="font-display font-black text-2xl uppercase">
                  Security, Passwords & Access Control
                </h2>
                <p className="font-mono text-xs text-ink-muted uppercase">
                  Manage master admin credentials, audit authorized personnel & inspect cryptographic policy
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Change Admin Password */}
              <div className="card-brutal bg-cream-light p-6 space-y-4">
                <div className="border-b border-ink/15 pb-2 flex items-center justify-between">
                  <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                    <Key className="w-4 h-4 text-coral" /> Master Admin Password
                  </h3>
                  <span className="badge-lime text-[10px] uppercase">Encrypted Storage</span>
                </div>

                <p className="text-xs text-ink-muted">
                  Update the password for your administrator profile (<strong>{user?.email}</strong>). Requires at least 8 characters.
                </p>

                {passChangeSuccess && (
                  <div className="p-3 bg-lime/30 border-2 border-ink text-ink font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-lime-darker flex-shrink-0" />
                    {passChangeSuccess}
                  </div>
                )}

                {passChangeError && (
                  <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark font-bold text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    {passChangeError}
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold uppercase mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showPassToggles.current ? "text" : "password"}
                        value={currentAdminPass}
                        onChange={(e) => setCurrentAdminPass(e.target.value)}
                        placeholder="Enter your current password"
                        className="w-full bg-cream border-2 border-ink p-2.5 pr-9 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassToggles({ ...showPassToggles, current: !showPassToggles.current })}
                        className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink cursor-pointer"
                      >
                        {showPassToggles.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1">New Strong Password</label>
                    <div className="relative">
                      <input
                        type={showPassToggles.new ? "text" : "password"}
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Min 8 characters (letters + numbers)"
                        required
                        minLength={8}
                        className="w-full bg-cream border-2 border-ink p-2.5 pr-9 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassToggles({ ...showPassToggles, new: !showPassToggles.new })}
                        className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink cursor-pointer"
                      >
                        {showPassToggles.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase mb-1">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showPassToggles.confirm ? "text" : "password"}
                        value={confirmAdminPass}
                        onChange={(e) => setConfirmAdminPass(e.target.value)}
                        placeholder="Retype new password"
                        required
                        minLength={8}
                        className="w-full bg-cream border-2 border-ink p-2.5 pr-9 text-xs font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassToggles({ ...showPassToggles, confirm: !showPassToggles.confirm })}
                        className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink cursor-pointer"
                      >
                        {showPassToggles.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={passChanging}
                    className="btn-primary w-full py-2.5 text-xs uppercase flex items-center justify-center gap-2 mt-2"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    {passChanging ? "Updating Security..." : "Apply New Admin Password"}
                  </button>
                </form>
              </div>

              {/* Card 2: Authorized Admin Personnel & Sessions */}
              <div className="space-y-6">
                <div className="card-brutal bg-cream-light p-6 space-y-4">
                  <div className="border-b border-ink/15 pb-2 flex items-center justify-between">
                    <h3 className="font-display font-black text-base uppercase flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-lime-darker" /> Authorized Administrators
                    </h3>
                    <span className="badge-coral text-[10px]">{adminAccounts.length} Admins</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {adminAccounts.map((adm: any) => (
                      <div key={adm.id} className="p-3 bg-cream border border-ink flex items-center justify-between">
                        <div>
                          <p className="font-bold text-ink uppercase">{adm.first_name} {adm.last_name || ""}</p>
                          <p className="text-[11px] text-ink-muted">{adm.email}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-lime text-ink text-[10px] font-bold uppercase border border-ink">
                            {adm.role}
                          </span>
                          <p className="text-[9px] text-ink-muted mt-1">Verified Admin</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-brutal bg-cream-light p-6 space-y-3 text-xs">
                  <h3 className="font-display font-black text-base uppercase border-b border-ink/15 pb-2">
                    Access Control & Data Security
                  </h3>
                  <div className="space-y-1.5 text-ink-muted text-[11px]">
                    <p>• <strong>Strict Separation:</strong> The Admin Dashboard is strictly locked to the company account (thetoyzdept@gmail.com). Customers are separated completely and routed to their own accounts.</p>
                    <p>• <strong>Live Persistence:</strong> Orders, customer accounts, live inventory, and fulfillment sync in real-time.</p>
                    <p>• <strong>Payment & Logistics:</strong> Direct integration with Razorpay Webhooks and Shiprocket fulfillment.</p>
                  </div>
                </div>
              </div>
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

                {/* ── PHOTO UPLOAD & PRESET SECTION ── */}
                <div className="p-3 bg-cream border-2 border-ink space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold uppercase text-ink flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-lime-darker" /> Primary Object Photo
                    </label>
                    {newProdImage && (
                      <button
                        type="button"
                        onClick={() => setNewProdImage("")}
                        className="text-[10px] text-coral hover:underline font-bold uppercase"
                      >
                        Clear Photo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-cream-light border-2 border-ink overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={newProdImage || "/images/placeholder-product.svg"}
                        alt="Object drop preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex gap-2">
                        <label className="flex-1 py-1.5 px-2 bg-ink text-cream hover:bg-lime hover:text-ink border border-ink text-center cursor-pointer font-bold text-[10px] uppercase flex items-center justify-center gap-1 transition-all">
                          <Upload className="w-3 h-3" /> Upload Device File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, "create")}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowCreatePresetsPicker(!showCreatePresetsPicker)}
                          className="py-1.5 px-2 bg-cream-dark border border-ink text-ink font-bold text-[10px] uppercase hover:bg-lime flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" /> Studio Presets
                        </button>
                      </div>

                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        placeholder="Or paste image URL (e.g. /images/products/dragon-1.jpg)"
                        className="w-full bg-cream-light border border-ink p-1.5 text-[10px]"
                      />
                    </div>
                  </div>

                  {/* Studio Presets Drawer */}
                  {showCreatePresetsPicker && (
                    <div className="p-2 bg-cream-light border border-ink space-y-1.5 mt-2">
                      <p className="text-[10px] uppercase font-bold text-ink-muted">
                        Select Photorealistic Studio Asset:
                      </p>
                      <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                        {STUDIO_PHOTO_PRESETS.map((pst) => (
                          <button
                            key={pst.url}
                            type="button"
                            onClick={() => {
                              setNewProdImage(pst.url);
                              setShowCreatePresetsPicker(false);
                            }}
                            className={`p-1 border text-center transition-all ${
                              newProdImage === pst.url ? "border-ink bg-lime shadow-sm" : "border-ink/30 hover:border-ink bg-cream"
                            }`}
                          >
                            <img src={pst.url} alt={pst.name} className="w-full aspect-square object-cover mb-1 border border-ink/20" />
                            <span className="block text-[8px] font-bold truncate">{pst.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── COLOR FINISH & INITIAL STOCK ── */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase mb-1 flex items-center gap-1">
                      <Palette className="w-3 h-3" /> Color Finish
                    </label>
                    <select
                      value={newProdColor}
                      onChange={(e) => setNewProdColor(e.target.value)}
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold uppercase text-[10px]"
                    >
                      {CURATED_FILAMENT_COLORS.map((col) => (
                        <option key={col.name} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">Stock on Hand (Units)</label>
                    <input
                      type="number"
                      min="0"
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      placeholder="25"
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold uppercase">Description</label>
                    <button
                      type="button"
                      onClick={handleGenerateProductCopy}
                      disabled={generatingProductCopy || !newProdName.trim()}
                      className="text-[10px] font-mono font-bold text-ink bg-lime border border-ink px-2 py-0.5 shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-coral" />
                      <span>{generatingProductCopy ? "Drafting..." : "✨ AI Auto-Write"}</span>
                    </button>
                  </div>
                  <textarea
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    rows={4}
                    placeholder="Detailed specifications, joint mechanics, desk styling..."
                    className="w-full bg-cream-light border-2 border-ink p-2 text-xs"
                  />
                </div>

                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button type="submit" className="btn-primary flex-1 py-2 text-xs">
                    Drop Product to Store 🚀
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

        {/* ── MODAL: CREATE COUPON ─────────────────────────────────────── */}
        {showCreateCouponModal && (
          <div className="fixed inset-0 z-50 bg-ink/75 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream p-6 w-full max-w-lg space-y-4 shadow-brutal-xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-lime border-2 border-ink flex items-center justify-center">
                    <Tag className="w-4 h-4 text-ink" />
                  </div>
                  <h3 className="font-display font-black text-xl uppercase">
                    Create Discount Coupon
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreateCouponModal(false)}
                  className="font-mono text-sm font-bold hover:text-coral transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">
                    Coupon Promo Code <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) =>
                      setNewCouponCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ""))
                    }
                    placeholder="e.g. FLASH30, DIWALI250, VIPMEMBER"
                    required
                    className="w-full bg-cream-light border-2 border-ink p-2.5 font-black uppercase text-sm tracking-wider focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                  <p className="text-[10px] text-ink-muted mt-1">
                    Uppercase alphanumeric only. Customers enter this exact code at cart or checkout.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1">
                      Discount Type <span className="text-coral">*</span>
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as "percentage" | "fixed")}
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold focus:outline-none focus:ring-2 focus:ring-lime"
                    >
                      <option value="percentage">Percentage (%) Off</option>
                      <option value="fixed">Flat Amount (₹ INR) Off</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">
                      {newCouponType === "percentage" ? "Percentage Value (%) *" : "Flat Off Amount (₹) *"}
                    </label>
                    <input
                      type="number"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(e.target.value)}
                      placeholder={newCouponType === "percentage" ? "e.g. 15 (for 15%)" : "e.g. 250 (for ₹250 off)"}
                      min="1"
                      max={newCouponType === "percentage" ? "100" : undefined}
                      required
                      className="w-full bg-cream-light border-2 border-ink p-2 font-bold focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold uppercase mb-1">
                      Min Order Requirement (₹)
                    </label>
                    <input
                      type="number"
                      value={newCouponMinOrder}
                      onChange={(e) => setNewCouponMinOrder(e.target.value)}
                      placeholder="e.g. 999 (0 for no min)"
                      min="0"
                      className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                    <p className="text-[10px] text-ink-muted mt-0.5">Minimum cart subtotal in ₹ to apply.</p>
                  </div>
                  <div>
                    <label className="block font-bold uppercase mb-1">
                      Max Redemptions Cap
                    </label>
                    <input
                      type="number"
                      value={newCouponMaxUses}
                      onChange={(e) => setNewCouponMaxUses(e.target.value)}
                      placeholder="Leave blank for unlimited"
                      min="1"
                      className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                    <p className="text-[10px] text-ink-muted mt-0.5">Total times coupon can be redeemed.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    Campaign Description (Internal & Customer facing)
                  </label>
                  <input
                    type="text"
                    value={newCouponDesc}
                    onChange={(e) => setNewCouponDesc(e.target.value)}
                    placeholder="e.g. Limited Festive Flash Drop - 15% off orders above ₹999"
                    className="w-full bg-cream-light border-2 border-ink p-2 focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                </div>

                <div className="p-3 bg-cream-light border-2 border-ink">
                  <label className="flex items-center gap-2.5 cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={newCouponActive}
                      onChange={(e) => setNewCouponActive(e.target.checked)}
                      className="w-4 h-4 accent-ink"
                    />
                    <span className="text-xs">Activate coupon immediately upon creation</span>
                  </label>
                  <p className="text-[10px] text-ink-muted mt-1 ml-6">
                    If checked, customers can immediately apply this coupon code at checkout.
                  </p>
                </div>

                <div className="flex gap-2 pt-2 border-t-2 border-ink">
                  <button
                    type="submit"
                    disabled={savingCoupon}
                    className="btn-primary flex-1 py-2.5 text-xs font-black uppercase flex items-center justify-center gap-1.5 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{savingCoupon ? "Saving to Cloudflare D1..." : "Deploy Coupon 🏷️"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateCouponModal(false)}
                    disabled={savingCoupon}
                    className="btn-secondary py-2.5 px-4 text-xs font-bold uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL: RAFFLE WINNER DRAWN CELEBRATION ─────────────────── */}
        {winnerModal && (
          <div className="fixed inset-0 z-50 bg-ink/80 flex items-center justify-center p-4">
            <div className="card-brutal bg-cream border-4 border-ink p-6 sm:p-8 w-full max-w-lg space-y-5 shadow-brutal-xl animate-in zoom-in-95 duration-200">
              <div className="text-center space-y-2 border-b-2 border-ink pb-4">
                <div className="w-16 h-16 bg-lime border-2 border-ink rounded-full flex items-center justify-center mx-auto shadow-brutal-sm">
                  <Award className="w-8 h-8 text-ink animate-bounce" />
                </div>
                <span className="badge-coral text-xs font-mono font-bold uppercase">GIVEAWAY DRAW COMPLETED</span>
                <h3 className="font-display font-black text-2xl sm:text-3xl uppercase text-ink">
                  Winner Selected! 🏆
                </h3>
                <p className="font-mono text-xs text-ink-muted">
                  Randomly drawn from eligible survey participants in Cloudflare D1
                </p>
              </div>

              <div className="p-4 bg-cream-light border-2 border-ink font-mono text-xs space-y-2">
                <div className="flex justify-between border-b border-ink/20 pb-1.5">
                  <span className="text-ink-muted uppercase">Winner Name:</span>
                  <span className="font-display font-black text-sm uppercase text-ink">{winnerModal.name}</span>
                </div>
                <div className="flex justify-between border-b border-ink/20 pb-1.5">
                  <span className="text-ink-muted uppercase">Email Address:</span>
                  <a href={`mailto:${winnerModal.email}`} className="font-bold text-coral underline">
                    {winnerModal.email}
                  </a>
                </div>
                {winnerModal.phone && (
                  <div className="flex justify-between border-b border-ink/20 pb-1.5">
                    <span className="text-ink-muted uppercase">Phone / WhatsApp:</span>
                    <a href={`https://wa.me/${winnerModal.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer" className="font-bold text-ink underline">
                      {winnerModal.phone}
                    </a>
                  </div>
                )}
                {winnerModal.instagram && (
                  <div className="flex justify-between border-b border-ink/20 pb-1.5">
                    <span className="text-ink-muted uppercase">Instagram:</span>
                    <a href={`https://instagram.com/${winnerModal.instagram.replace(/^@/, "")}`} target="_blank" rel="noreferrer" className="font-bold text-coral underline">
                      @{winnerModal.instagram.replace(/^@/, "")}
                    </a>
                  </div>
                )}
                <div className="flex justify-between border-b border-ink/20 pb-1.5">
                  <span className="text-ink-muted uppercase">Raffle Ticket Code:</span>
                  <span className="font-black text-ink uppercase bg-lime px-2 py-0.5 border border-ink">
                    {winnerModal.raffleCode}
                  </span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-ink-muted uppercase">Favorite Product:</span>
                  <span className="font-bold text-ink">{winnerModal.favoriteProduct || "Custom 3D Print Drop"}</span>
                </div>
              </div>

              <div className="p-3 bg-lime/20 border-2 border-ink font-mono text-[11px] text-ink/80 space-y-1">
                <p className="font-bold uppercase text-ink">Next Steps for Fulfillment:</p>
                <p>1. Send an email or WhatsApp to the winner notifying them of their prize.</p>
                <p>2. Confirm their preferred shipping address and choice of filament color.</p>
                <p>3. Dispatch their free collector drop via Shiprocket express courier!</p>
              </div>

              <div className="flex gap-2 pt-2 border-t-2 border-ink">
                <a
                  href={`mailto:${winnerModal.email}?subject=${encodeURIComponent("🎉 Congratulations! You won THE TOYZ DEPT. Monthly 3D Print Giveaway!")}&body=${encodeURIComponent(`Hi ${winnerModal.name},\n\nGreat news! Your raffle ticket (#${winnerModal.raffleCode}) was randomly selected as this month's winner in THE TOYZ DEPT. Giveaway!\n\nPlease reply with your full delivery address and phone number so we can dispatch your free custom 3D print.\n\nCheers,\nTHE TOYZ DEPT. Studio`)}`}
                  className="btn-primary flex-1 py-3 text-xs font-black uppercase text-center flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Winner Now</span>
                </a>
                <button
                  type="button"
                  onClick={() => setWinnerModal(null)}
                  className="btn-secondary py-3 px-5 text-xs font-bold uppercase"
                >
                  Close
                </button>
              </div>
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
                  <p className="text-ink/80">{viewingOrderDetails.customer_email || viewingOrderDetails.shipping_email || "Guest"}</p>
                  <p className="text-ink/80 font-bold mt-1">📞 {viewingOrderDetails.shipping_phone || "—"}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-ink-muted font-bold block mb-1">Delivery Destination:</span>
                  <p className="text-ink">{viewingOrderDetails.shipping_address_1 || viewingOrderDetails.shipping_address_line1}</p>
                  {(viewingOrderDetails.shipping_address_2 || viewingOrderDetails.shipping_address_line2) && (
                    <p className="text-ink">{viewingOrderDetails.shipping_address_2 || viewingOrderDetails.shipping_address_line2}</p>
                  )}
                  <p className="text-ink">{viewingOrderDetails.shipping_city}, {viewingOrderDetails.shipping_state} - {viewingOrderDetails.shipping_postal_code}</p>
                  <p className="text-ink-muted text-[10px] mt-1">{viewingOrderDetails.shipping_country || "India"}</p>
                </div>
              </div>

              {/* Payment & Logistics Telemetry */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-cream-light p-4 border-2 border-ink font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-ink-muted font-bold block mb-1">💳 Razorpay Settlement:</span>
                  <p className="font-bold text-ink">
                    Payment Status: <span className="text-lime-darker uppercase">{viewingOrderDetails.payment_status || viewingOrderDetails.payment?.status || "PAID"}</span>
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    Payment ID: {viewingOrderDetails.razorpay_payment_id || viewingOrderDetails.payment?.razorpay_payment_id || "Direct Verified"}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    Order ID: {viewingOrderDetails.razorpay_order_id || viewingOrderDetails.payment?.razorpay_order_id || "rzp_live"}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    Method: {viewingOrderDetails.payment_method || viewingOrderDetails.payment?.method || "UPI / Cards"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-ink-muted font-bold block mb-1">🚀 Shiprocket Fulfillment:</span>
                  <p className="font-bold text-ink">
                    Courier: {viewingOrderDetails.courier_name || (viewingOrderDetails.tracking_number ? "Shiprocket Express" : "Unassigned")}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    AWB Code: {viewingOrderDetails.awb_code || viewingOrderDetails.tracking_number || "Pending dispatch"}
                  </p>
                  {viewingOrderDetails.pickup_scheduled_date && (
                    <p className="text-[11px] text-ink-muted">
                      Pickup Scheduled: {viewingOrderDetails.pickup_scheduled_date}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {viewingOrderDetails.label_url && (
                      <a
                        href={viewingOrderDetails.label_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-coral underline hover:text-ink inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" /> Shipping Label (PDF)
                      </a>
                    )}
                    {viewingOrderDetails.tracking_url && (
                      <a
                        href={viewingOrderDetails.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-bold text-lime-darker underline hover:text-ink inline-flex items-center gap-1"
                      >
                        <Truck className="w-3 h-3" /> Live Radar Tracking
                      </a>
                    )}
                  </div>
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
                    <span>{(viewingOrderDetails.shipping_cost ?? viewingOrderDetails.shipping_amount ?? 0) === 0 ? "FREE" : formatINR(viewingOrderDetails.shipping_cost ?? viewingOrderDetails.shipping_amount ?? 0)}</span>
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
                {/* ── PHOTO UPLOAD & PRESET SECTION IN QUICK EDIT ── */}
                <div className="p-3 bg-cream border-2 border-ink space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold uppercase text-ink flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-lime-darker" /> Product Photo
                    </label>
                    {editImage && (
                      <button
                        type="button"
                        onClick={() => setEditImage("")}
                        className="text-[10px] text-coral hover:underline font-bold uppercase"
                      >
                        Clear Photo
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-cream-light border-2 border-ink overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={editImage || "/images/placeholder-product.svg"}
                        alt={quickEditProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex gap-2">
                        <label className="flex-1 py-1.5 px-2 bg-ink text-cream hover:bg-lime hover:text-ink border border-ink text-center cursor-pointer font-bold text-[10px] uppercase flex items-center justify-center gap-1 transition-all">
                          <Upload className="w-3 h-3" /> Upload File
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageFileUpload(e, "edit")}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowEditPresetsPicker(!showEditPresetsPicker)}
                          className="py-1.5 px-2 bg-cream-dark border border-ink text-ink font-bold text-[10px] uppercase hover:bg-lime flex items-center gap-1"
                        >
                          <ImageIcon className="w-3 h-3" /> Studio Presets
                        </button>
                      </div>

                      <input
                        type="text"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        placeholder="Or paste image URL"
                        className="w-full bg-cream-light border border-ink p-1.5 text-[10px]"
                      />
                      {uploadingImage && (
                        <p className="text-[10px] text-lime-darker font-bold flex items-center gap-1 animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Uploading image to Cloudflare R2...
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Studio Presets Drawer in Edit */}
                  {showEditPresetsPicker && (
                    <div className="p-2 bg-cream-light border border-ink space-y-1.5 mt-2">
                      <p className="text-[10px] uppercase font-bold text-ink-muted">
                        Select Photorealistic Studio Asset:
                      </p>
                      <div className="grid grid-cols-4 gap-1.5 max-h-36 overflow-y-auto">
                        {STUDIO_PHOTO_PRESETS.map((pst) => (
                          <button
                            key={pst.url}
                            type="button"
                            onClick={() => {
                              setEditImage(pst.url);
                              setShowEditPresetsPicker(false);
                            }}
                            className={`p-1 border text-center transition-all ${
                              editImage === pst.url ? "border-ink bg-lime shadow-sm" : "border-ink/30 hover:border-ink bg-cream"
                            }`}
                          >
                            <img src={pst.url} alt={pst.name} className="w-full aspect-square object-cover mb-1 border border-ink/20" />
                            <span className="block text-[8px] font-bold truncate">{pst.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

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
                  <button
                    type="submit"
                    disabled={savingProduct || uploadingImage}
                    className="btn-primary flex-1 py-2 text-xs uppercase flex items-center justify-center gap-1.5"
                  >
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading Photo...
                      </>
                    ) : savingProduct ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving Changes...
                      </>
                    ) : (
                      "Save Changes"
                    )}
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

        {/* ── Refund & Return Processing Modal ── */}
        {refundModalOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/75 backdrop-blur-xs">
            <div className="relative w-full max-w-lg bg-cream border-2 border-ink shadow-brutal-xl p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-ink">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-coral text-cream flex items-center justify-center font-bold border border-ink">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-lg uppercase leading-tight">
                      Issue Customer Return & Refund
                    </h3>
                    <p className="font-mono text-[10px] text-ink-muted uppercase">
                      Order #{refundModalOrder.order_number}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setRefundModalOrder(null)}
                  className="p-1.5 hover:bg-cream-dark border border-ink cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 bg-coral/10 border-2 border-coral font-mono text-xs space-y-1">
                <p className="font-bold text-coral-dark uppercase">Balance Sheet Impact:</p>
                <p className="text-ink text-[11px]">
                  Confirming this action will immediately deduct the refund amount from your total net revenue balance sheet, update the order status to &quot;Refunded&quot;, and log a debit transaction.
                </p>
              </div>

              <form onSubmit={handleProcessRefundSubmit} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block font-bold uppercase text-ink mb-1">
                    Customer Name & Email:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${refundModalOrder.shipping_name || "Customer"} (${refundModalOrder.shipping_email || refundModalOrder.customer_email || "N/A"})`}
                    className="w-full bg-cream-light border border-ink px-3 py-2 text-ink opacity-80"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-ink mb-1">
                    Refund Amount (₹ INR):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-ink">₹</span>
                    <input
                      type="number"
                      step="0.01"
                      min="1"
                      required
                      value={refundAmountInput}
                      onChange={(e) => setRefundAmountInput(e.target.value)}
                      className="w-full bg-cream border-2 border-ink pl-7 pr-3 py-2 font-mono font-bold text-ink focus:outline-none focus:border-coral"
                    />
                  </div>
                  <p className="text-[10px] text-ink-muted mt-0.5">
                    Full Order Total: {formatINR(refundModalOrder.total_amount || 0)}
                  </p>
                </div>

                <div>
                  <label className="block font-bold uppercase text-ink mb-1">
                    Reason for Return / Refund:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 48h unboxing defect reported / Transit damage / Customer cancellation"
                    value={refundReason}
                    onChange={(e) => setRefundReason(e.target.value)}
                    className="w-full bg-cream border border-ink px-3 py-2 text-ink focus:outline-none focus:border-ink"
                  />
                </div>

                <div className="flex items-center gap-2 p-2 bg-cream-light border border-ink">
                  <input
                    type="checkbox"
                    id="refundRestockCheck"
                    checked={refundRestock}
                    onChange={(e) => setRefundRestock(e.target.checked)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="refundRestockCheck" className="text-xs cursor-pointer select-none">
                    <strong>Restock item units</strong> back into studio inventory (+stock)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-ink">
                  <button
                    type="button"
                    onClick={() => setRefundModalOrder(null)}
                    className="px-4 py-2 bg-cream border border-ink hover:bg-cream-dark uppercase font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={refundingLoading}
                    className="px-4 py-2 bg-coral text-white border-2 border-ink hover:bg-ink font-bold uppercase shadow-brutal-sm cursor-pointer disabled:opacity-50"
                  >
                    {refundingLoading ? "Processing Refund..." : `Confirm Refund (-₹${refundAmountInput})`}
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
