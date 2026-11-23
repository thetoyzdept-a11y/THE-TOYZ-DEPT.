import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Package,
  Layers,
  Sliders,
  Users,
  Settings,
  Mail,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
  DollarSign,
  ChevronRight,
  Tag,
  Gift,
  ArrowLeftRight,
  RefreshCw,
} from "lucide-react";

export interface AdminHeaderProps {
  activeModule?: string;
  setActiveModule?: (mod: any) => void;
  counts?: {
    orders?: number;
    products?: number;
    transactions?: number;
    coupons?: number;
    surveys?: number;
    inquiries?: number;
    customers?: number;
  };
  loading?: boolean;
  onRefresh?: () => void;
}

export function AdminHeader({
  activeModule,
  setActiveModule,
  counts = {},
  loading = false,
  onRefresh,
}: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const fallbackTab = searchParams.get("tab") || "overview";
  const currentTab = activeModule || fallbackTab;

  const handleSelectModule = (tabId: string) => {
    setAdminMenuOpen(false);
    if (setActiveModule) {
      setActiveModule(tabId);
    } else {
      setSearchParams({ tab: tabId });
      navigate(`/admin?tab=${tabId}`);
    }
  };

  // Auto-close admin mobile menu on navigation
  useEffect(() => {
    setAdminMenuOpen(false);
  }, [location.pathname, location.search]);

  const navModules = [
    { id: "overview", label: "Overview", icon: DollarSign, count: undefined },
    { id: "ledger", label: "Balance Sheet", icon: ArrowLeftRight, count: counts.transactions },
    { id: "orders", label: "Orders", icon: Package, count: counts.orders },
    { id: "products", label: "Products", icon: Layers, count: counts.products },
    { id: "coupons", label: "Coupons", icon: Tag, count: counts.coupons },
    { id: "surveys", label: "Surveys", icon: Gift, count: counts.surveys },
    { id: "inventory", label: "Inventory", icon: Sliders, count: undefined },
    { id: "customers", label: "Customers", icon: Users, count: counts.customers },
    { id: "inquiries", label: "Inquiries", icon: Mail, count: counts.inquiries },
    { id: "security", label: "Security", icon: ShieldCheck, count: undefined },
    { id: "settings", label: "Settings", icon: Settings, count: undefined },
  ];

  return (
    <>
      {/* ── Sticky Master Admin Header ───────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-ink shadow-sm transition-all select-none">
        {/* Tier 1: Brand & Top Utilities (48px) */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-13 sm:h-14 gap-3">
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link
                to="/admin?tab=overview"
                onClick={() => handleSelectModule("overview")}
                className="group flex items-center gap-2 flex-shrink-0 whitespace-nowrap"
              >
                <div className="w-8 h-8 bg-ink border-2 border-ink flex items-center justify-center text-lime font-display font-black text-base shadow-brutal-xs group-hover:bg-lime group-hover:text-ink transition-all flex-shrink-0">
                  T
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                  <span className="font-display font-black text-base sm:text-lg tracking-tight uppercase leading-none whitespace-nowrap">
                    THE TOYZ DEPT<span className="text-coral">.</span>
                  </span>
                  <span className="badge-coral text-[9px] py-0.5 px-1.5 font-bold uppercase font-mono flex-shrink-0">
                    OPS
                  </span>
                </div>
              </Link>

              {/* Status Pill */}
              <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-ink/20 font-mono text-[10px] text-ink-muted whitespace-nowrap">
                <span className="flex items-center gap-1.5 text-ink font-bold">
                  <span className="w-2 h-2 rounded-full bg-lime animate-pulse border border-ink" />
                  PROD // D1 ACTIVE
                </span>
                <span className="text-ink/30">•</span>
                <span>RAZORPAY LIVE</span>
                <span className="text-ink/30">•</span>
                <span>SHIPROCKET</span>
              </div>
            </div>

            {/* Right: Quick Operational Controls */}
            <div className="flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
              {/* Live Refresh Button */}
              {onRefresh && (
                <button
                  type="button"
                  onClick={onRefresh}
                  disabled={loading}
                  className="px-2.5 py-1.5 bg-cream text-ink border-2 border-ink text-xs font-mono font-bold uppercase shadow-brutal-xs hover:bg-lime transition-all inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Reload live database records"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-coral" : ""}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}

              {/* Admin Email Pill */}
              <span className="hidden xl:inline-block px-2 py-1 bg-cream-dark border border-ink/30 font-mono text-[10px] text-ink-muted">
                {user?.email}
              </span>

              {/* Storefront Link */}
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-lime text-ink border-2 border-ink text-xs font-mono font-bold uppercase shadow-brutal-xs hover:bg-ink hover:text-lime transition-all flex-shrink-0"
                title="Preview public storefront in a new tab"
              >
                <span className="hidden xs:inline">Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              {/* Sign Out */}
              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 sm:px-2.5 sm:py-1.5 border-2 border-ink bg-cream hover:bg-coral hover:text-cream text-xs font-mono font-bold uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                title="Sign out of operations console"
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Mobile Drawer Trigger */}
              <button
                type="button"
                onClick={() => setAdminMenuOpen(true)}
                className="lg:hidden p-1.5 border-2 border-ink bg-cream hover:bg-cream-dark cursor-pointer ml-1"
                aria-label="Open Admin Menu"
              >
                <Menu className="w-4 h-4 text-ink" />
              </button>
            </div>
          </div>
        </div>

        {/* Tier 2: Single Canonical Navigation Strip (Visible EXACTLY Once) */}
        <div className="border-t border-ink/15 bg-cream/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto no-scrollbar py-1.5 font-mono text-xs uppercase tracking-wider">
              {navModules.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSelectModule(tab.id)}
                    className={`px-3 py-1.5 border-2 flex items-center gap-1.5 flex-shrink-0 transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "bg-ink text-lime border-ink shadow-brutal-xs font-bold"
                        : "bg-cream text-ink border-transparent hover:border-ink/50 hover:bg-cream-dark"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-lime" : "text-ink-muted"}`} />
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isActive ? "bg-lime text-ink font-black" : "bg-cream-dark text-ink-muted border border-ink/20"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      {/* ── Admin Mobile Navigation Drawer ───────────────────────────── */}
      {adminMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/75 backdrop-blur-xs"
            onClick={() => setAdminMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-cream h-full border-r-2 border-ink shadow-brutal-xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
                <div>
                  <p className="font-display font-black text-lg uppercase tracking-tight">
                    Operations Center
                  </p>
                  <p className="font-mono text-[10px] text-ink-muted">
                    {user?.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminMenuOpen(false)}
                  className="p-1.5 hover:bg-cream-dark border border-ink"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Admin Navigation Modules */}
              <nav className="mt-4 flex flex-col gap-1.5 font-mono text-xs font-bold uppercase">
                {navModules.map((mod) => {
                  const Icon = mod.icon;
                  const isActive = currentTab === mod.id;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleSelectModule(mod.id)}
                      className={`w-full text-left py-2.5 px-3 border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? "bg-ink text-lime border-ink shadow-brutal-xs"
                          : "bg-cream-light text-ink border-ink/30 hover:border-ink hover:bg-cream-dark"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${isActive ? "text-lime" : "text-ink"}`} />
                        <span>{mod.label}</span>
                      </span>
                      {typeof mod.count === "number" ? (
                        <span className={`text-[10px] px-1.5 py-0.5 ${isActive ? "bg-lime text-ink" : "bg-cream-dark text-ink-muted"}`}>
                          {mod.count}
                        </span>
                      ) : (
                        <ChevronRight className="w-4 h-4 opacity-50" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Utilities */}
            <div className="pt-6 border-t-2 border-ink space-y-2">
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                onClick={() => setAdminMenuOpen(false)}
                className="btn-secondary w-full text-xs flex items-center justify-center gap-2"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setAdminMenuOpen(false);
                }}
                className="w-full text-center text-xs font-mono font-bold uppercase text-coral hover:bg-coral hover:text-cream border border-ink py-2 transition-colors cursor-pointer"
              >
                Sign Out of Ops
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
