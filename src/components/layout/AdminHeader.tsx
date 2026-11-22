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
} from "lucide-react";

export function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);

  const currentTab = searchParams.get("tab") || "overview";

  // Auto-close admin mobile menu on navigation
  useEffect(() => {
    setAdminMenuOpen(false);
  }, [location.pathname, location.search]);

  const navModules = [
    { id: "overview", label: "Overview", icon: DollarSign },
    { id: "ledger", label: "Balance Sheet", icon: ArrowLeftRight },
    { id: "orders", label: "Orders", icon: Package },
    { id: "products", label: "Products", icon: Layers },
    { id: "coupons", label: "Coupons", icon: Tag },
    { id: "surveys", label: "Surveys", icon: Gift },
    { id: "inventory", label: "Inventory", icon: Sliders },
    { id: "customers", label: "Customers", icon: Users },
    { id: "inquiries", label: "Inquiries", icon: Mail },
    { id: "security", label: "Security", icon: ShieldCheck },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const handleSelectModule = (tabId: string) => {
    setAdminMenuOpen(false);
    navigate(`/admin?tab=${tabId}`);
  };

  return (
    <>
      {/* ── Top Ops Status Bar ────────────────────────────────────────── */}
      <div className="bg-ink text-cream py-1.5 px-4 border-b-2 border-ink flex items-center justify-between font-mono text-[11px] uppercase tracking-wider select-none overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="flex items-center gap-1.5 text-lime font-bold flex-shrink-0">
            <span className="w-2 h-2 rounded-full bg-lime animate-pulse border border-ink flex-shrink-0" />
            OPS RUNTIME: PRODUCTION
          </span>
          <span className="text-cream/50">•</span>
          <span className="text-cream/80">Cloudflare D1 Database Active</span>
          <span className="text-cream/50">•</span>
          <span className="text-cream/80">Shiprocket Channel: 12931117</span>
          <span className="text-cream/50">•</span>
          <span className="text-cream/80">Razorpay Live</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-cream/70 flex-shrink-0">
          <span className="badge-coral text-[9px] py-0.5 px-1.5 font-bold">ADMIN CONSOLE</span>
          <span className="font-mono text-xs">{user?.email}</span>
        </div>
      </div>

      {/* ── Main Admin Navigation Bar ─────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-ink shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Admin Brand Treatment (Guaranteed Never Wrap) */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Link to="/admin?tab=overview" className="group flex items-center gap-2.5 flex-shrink-0 whitespace-nowrap">
                <div className="w-9 h-9 bg-ink border-2 border-ink flex items-center justify-center text-lime font-display font-black text-lg shadow-brutal-sm group-hover:bg-lime group-hover:text-ink transition-all flex-shrink-0">
                  T
                </div>
                <div className="flex flex-col flex-shrink-0 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 whitespace-nowrap">
                    <span className="font-display font-black text-lg sm:text-xl tracking-tighter uppercase leading-none whitespace-nowrap">
                      THE TOYZ DEPT<span className="text-coral">.</span>
                    </span>
                    <span className="badge-coral text-[9px] py-0.5 px-1.5 font-bold uppercase font-mono flex-shrink-0">
                      OPS
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-ink-muted uppercase font-bold whitespace-nowrap leading-tight mt-0.5">
                    OPERATIONS CONTROL CENTER
                  </span>
                </div>
              </Link>
            </div>

            {/* Center Status Pill */}
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-ink-muted">
              <span className="w-2 h-2 rounded-full bg-lime border border-ink" />
              <span className="uppercase font-bold tracking-wider text-ink text-[11px]">ADMINISTRATIVE CONSOLE</span>
            </div>

            {/* Right Action Utilities */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 whitespace-nowrap">
              {/* Jump to Public Storefront */}
              <Link
                to="/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-lime text-ink border-2 border-ink text-xs font-mono font-bold uppercase shadow-brutal-sm hover:bg-ink hover:text-lime transition-all flex-shrink-0 whitespace-nowrap"
                title="Preview public storefront in new tab"
              >
                <span>Storefront View</span>
                <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              </Link>

              {/* Sign Out */}
              <button
                onClick={() => logout()}
                className="p-1.5 sm:px-3 sm:py-1.5 border-2 border-ink bg-cream hover:bg-coral hover:text-cream text-xs font-mono font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0 whitespace-nowrap"
                title="Sign out of operations console"
              >
                <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
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
                  <p className="font-mono text-[10px] text-ink-muted uppercase">
                    Admin: {user?.email}
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
                      onClick={() => handleSelectModule(mod.id)}
                      className={`w-full text-left py-3 px-3.5 border-2 flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? "bg-ink text-lime border-ink shadow-brutal-sm"
                          : "bg-cream-light text-ink border-ink/30 hover:border-ink hover:bg-cream-dark"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-lime" : "text-ink"}`} />
                        <span>{mod.label}</span>
                      </span>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Utilities */}
            <div className="pt-6 border-t-2 border-ink space-y-2">
              <Link
                to="/"
                onClick={() => setAdminMenuOpen(false)}
                className="btn-secondary w-full text-xs flex items-center justify-center gap-2"
              >
                <span>View Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <button
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
