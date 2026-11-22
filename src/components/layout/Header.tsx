import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { api } from "../../lib/api";
import { formatINR } from "../../lib/utils";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Shield,
  LogOut,
  ChevronRight,
  Package,
  Heart,
  MapPin,
  Sparkles,
} from "lucide-react";

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Global hotkey: Cmd+K / Ctrl+K to open search anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Automatically dismiss mobile drawer and search popup on ANY page transition or query change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  }, [location.pathname, location.search]);

  // Live Typo-Tolerant Auto-Suggest using DSA fuzzy search
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSuggestionsLoading(true);
      try {
        const res = await api.getProductSuggestions(searchQuery.trim());
        setSuggestions(res.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const cartCount = cart?.itemCount || 0;

  // Gracefully normalize user display name so "THE" from thetoyzdept is never shown raw
  const accountDisplayName =
    user?.firstName &&
    user.firstName.trim().toLowerCase() !== "the" &&
    user.firstName.trim().length > 1
      ? user.firstName
      : "Account";

  // Active navigation helper
  const isCurrent = (path: string, exactSearch = "") => {
    if (exactSearch) {
      return location.pathname === path && location.search.includes(exactSearch);
    }
    return location.pathname === path && !location.search;
  };

  return (
    <>
      {/* ── Top Announcement Ticker ──────────────────────────────────── */}
      <div className="bg-ink text-cream py-1.5 sm:py-2 border-b-2 border-ink overflow-hidden whitespace-nowrap select-none flex font-mono text-[11px] sm:text-xs uppercase tracking-widest">
        <div className="inline-flex gap-8 sm:gap-12 animate-marquee">
          <span className="text-lime font-bold">⚡ FREE EXPRESS SHIPPING ABOVE ₹999</span>
          <Link to="/survey" className="text-lime underline font-bold hover:text-cream">
            🎁 WIN A FREE DROP // TAKE 2-MIN SURVEY →
          </Link>
          <span>✦ DISPATCHED FROM BENGALURU IN 24-48H</span>
          <span>✦ 100% ADHD APPROVED TACTILE FIDGETS</span>
          <span>✦ 0.12MM LAYER PRECISION</span>
          <span>✦ 100% PREPAID STUDIO // ZERO COD</span>
        </div>
        <div className="inline-flex gap-8 sm:gap-12 animate-marquee" aria-hidden="true">
          <span className="text-lime font-bold">⚡ FREE EXPRESS SHIPPING ABOVE ₹999</span>
          <span className="text-lime underline font-bold">
            🎁 WIN A FREE DROP // TAKE 2-MIN SURVEY →
          </span>
          <span>✦ DISPATCHED FROM BENGALURU IN 24-48H</span>
          <span>✦ 100% ADHD APPROVED TACTILE FIDGETS</span>
          <span>✦ 0.12MM LAYER PRECISION</span>
          <span>✦ 100% PREPAID STUDIO // ZERO COD</span>
        </div>
      </div>

      {/* ── Main Navigation Header (Clean, Premium, Architectural) ───── */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-ink shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Left: Mobile menu toggle + Brand Wordmark */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-ink hover:bg-cream-dark border-2 border-ink shadow-brutal-xs cursor-pointer transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Brand Wordmark (Guaranteed Never-Wrap Architecture) */}
              <Link
                to="/"
                className="group flex items-center gap-2.5 sm:gap-3 flex-shrink-0 whitespace-nowrap"
                aria-label="THE TOYZ DEPT. Home"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-ink border-2 border-ink flex items-center justify-center text-lime font-display font-black text-base sm:text-lg shadow-brutal-xs group-hover:bg-lime group-hover:text-ink group-hover:-rotate-3 transition-all duration-150 flex-shrink-0">
                  T
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-display font-black text-lg sm:text-2xl tracking-tighter uppercase leading-none whitespace-nowrap group-hover:text-coral transition-colors">
                    THE TOYZ DEPT<span className="text-coral">.</span>
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-ink-muted uppercase font-bold mt-1 leading-none whitespace-nowrap">
                    BENGALURU // EST. 2026
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation (Refined, Non-Crowded, High-End) */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-8 font-display font-bold text-xs uppercase tracking-wider whitespace-nowrap">
              <Link
                to="/shop"
                className={`py-1.5 transition-colors border-b-2 ${
                  isCurrent("/shop")
                    ? "text-coral border-coral font-black"
                    : "text-ink border-transparent hover:text-coral hover:border-ink/30"
                }`}
              >
                Store Drops
              </Link>

              <Link
                to="/shop?category=collectibles"
                className={`py-1.5 transition-colors border-b-2 ${
                  isCurrent("/shop", "category=collectibles")
                    ? "text-coral border-coral font-black"
                    : "text-ink border-transparent hover:text-coral hover:border-ink/30"
                }`}
              >
                Collectibles
              </Link>

              <Link
                to="/shop?category=desk-objects"
                className={`py-1.5 transition-colors border-b-2 ${
                  isCurrent("/shop", "category=desk-objects")
                    ? "text-coral border-coral font-black"
                    : "text-ink border-transparent hover:text-coral hover:border-ink/30"
                }`}
              >
                Desk Gear
              </Link>

              <Link
                to="/about"
                className={`py-1.5 transition-colors border-b-2 ${
                  isCurrent("/about")
                    ? "text-coral border-coral font-black"
                    : "text-ink border-transparent hover:text-coral hover:border-ink/30"
                }`}
              >
                Studio
              </Link>

              <Link
                to="/track-order"
                className={`py-1.5 transition-colors border-b-2 ${
                  isCurrent("/track-order")
                    ? "text-coral border-coral font-black"
                    : "text-ink-muted border-transparent hover:text-ink hover:border-ink/30"
                }`}
              >
                Track Order
              </Link>

              <Link
                to="/survey"
                className={`py-1.5 flex items-center gap-1.5 transition-colors border-b-2 ${
                  isCurrent("/survey")
                    ? "text-coral border-coral font-black"
                    : "text-ink border-transparent hover:text-coral"
                }`}
              >
                <span>Win Free Drop</span>
                <span className="text-coral animate-bounce">🎁</span>
              </Link>
            </nav>

            {/* Right: Action Utilities Toolbar */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              
              {/* Quick Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 p-2 sm:px-2.5 sm:py-1.5 bg-cream hover:bg-cream-dark border-2 border-ink shadow-brutal-xs transition-all cursor-pointer"
                aria-label="Search catalogue"
                title="Search studio catalog (⌘K)"
              >
                <Search className="w-4 h-4 text-ink" />
                <span className="hidden xl:inline font-mono text-[11px] text-ink-muted uppercase font-bold">
                  Search...
                </span>
                <kbd className="hidden xl:inline font-mono text-[9px] bg-cream-dark px-1 py-0.5 border border-ink/20 text-ink-muted font-bold">
                  ⌘K
                </kbd>
              </button>

              {/* Admin Portal Shortcut (If Logged in as Admin) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-ink text-lime border-2 border-ink text-xs font-mono font-bold tracking-wider uppercase shadow-brutal-xs hover:bg-lime hover:text-ink transition-all"
                  title="Administrative Operations Portal"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}

              {/* Account Trigger & Dropdown */}
              {user ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-cream hover:bg-cream-dark border-2 border-ink shadow-brutal-xs text-ink transition-all cursor-pointer"
                    aria-label="Customer Account"
                  >
                    <User className="w-4 h-4 text-ink" />
                    <span className="hidden md:inline font-mono text-xs font-bold uppercase truncate max-w-[85px]">
                      {accountDisplayName}
                    </span>
                    <span className="w-2 h-2 rounded-full bg-lime border border-ink" title="Active session" />
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-cream border-2 border-ink shadow-brutal-lg hidden group-hover:block z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-3 border-b-2 border-ink bg-cream-light">
                      <p className="font-display font-bold text-xs uppercase truncate text-ink">
                        {user.firstName} {user.lastName || ""}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1 font-display text-xs font-bold uppercase tracking-wider divide-y divide-ink/10">
                      <Link to="/account?tab=orders" className="flex items-center gap-2 px-4 py-2 hover:bg-lime transition-colors">
                        <Package className="w-3.5 h-3.5 text-ink-muted" /> Orders & Invoices
                      </Link>
                      <Link to="/account?tab=wishlist" className="flex items-center gap-2 px-4 py-2 hover:bg-lime transition-colors">
                        <Heart className="w-3.5 h-3.5 text-coral" /> Saved Wishlist
                      </Link>
                      <Link to="/account?tab=addresses" className="flex items-center gap-2 px-4 py-2 hover:bg-lime transition-colors">
                        <MapPin className="w-3.5 h-3.5 text-ink-muted" /> Saved Addresses
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="flex items-center gap-2 px-4 py-2 bg-ink text-lime hover:bg-lime hover:text-ink transition-colors">
                          <Shield className="w-3.5 h-3.5" /> Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-coral hover:bg-coral hover:text-cream transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <span>Sign Out</span>
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cream hover:bg-lime border-2 border-ink shadow-brutal-xs text-ink font-mono text-xs font-bold uppercase transition-all"
                  aria-label="Sign In"
                >
                  <User className="w-4 h-4 text-ink" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Cart Drawer Trigger Button */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 px-3 py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink border-2 border-ink shadow-brutal-xs hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="font-mono text-xs font-black uppercase hidden sm:inline">BAG</span>
                <span
                  className={`font-mono text-[10px] font-black px-1.5 py-0.2 border border-ink ${
                    cartCount > 0 ? "bg-coral text-cream animate-pulse" : "bg-lime text-ink"
                  }`}
                >
                  {cartCount}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Search Modal Overlay ─────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
          <div className="bg-cream border-2 border-ink shadow-brutal-xl w-full max-w-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-4 right-4 p-1 hover:bg-cream-dark border border-transparent hover:border-ink transition-all"
              aria-label="Close search modal"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="font-display font-black text-xl uppercase mb-1">
              Search Catalogue
            </h3>
            <div className="flex items-center justify-between mb-4">
              <p className="font-mono text-xs text-ink-muted uppercase">
                Collectibles // Desk Tools // Architectural Home Objects
              </p>
              <span className="hidden sm:inline-block font-mono text-[10px] text-ink-muted bg-cream-dark px-2 py-0.5 border border-ink/20">
                ESC to close • ⌘K
              </span>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dragon, planter, gear cube, flexi rex..."
                className="flex-1 bg-cream-light border-2 border-ink px-4 py-3 font-body text-base font-medium focus:outline-none focus:ring-2 focus:ring-lime"
                aria-label="Search drops catalog"
                autoFocus
              />
              <button type="submit" className="btn-primary">
                Search
              </button>
            </form>

            {/* Live DSA Fuzzy Search Suggestions */}
            {searchQuery.trim().length >= 2 && (
              <div className="mt-3 border-2 border-ink bg-cream-light divide-y divide-ink/15 max-h-72 overflow-y-auto shadow-brutal-sm">
                {suggestionsLoading ? (
                  <div className="p-3 text-center font-mono text-xs text-ink-muted uppercase">
                    Scouring studio inventory...
                  </div>
                ) : suggestions.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="font-mono text-xs text-ink-muted">
                      No exact drop found for "{searchQuery}". Hit Search to explore the full archive.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="bg-lime/30 px-3 py-1 text-[10px] font-mono font-bold uppercase text-ink flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-coral" />
                        <span>Instant Drops Found ({suggestions.length})</span>
                      </span>
                      <span>Typo-Tolerant Engine</span>
                    </div>
                    {suggestions.map((item) => (
                      <Link
                        key={item.id}
                        to={`/products/${item.slug}`}
                        onClick={() => setSearchOpen(false)}
                        className="p-2.5 flex items-center justify-between hover:bg-cream transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cream border border-ink flex-shrink-0 overflow-hidden">
                            <img
                              src={item.primaryImage || "/images/placeholder-product.svg"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-display font-bold text-xs uppercase text-ink group-hover:text-coral transition-colors">
                              {item.name}
                            </p>
                            <span className="font-mono text-[10px] text-ink-muted uppercase">
                              {item.categoryName || "Drop"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-display font-black text-xs text-ink">
                            {formatINR(item.basePrice || 0)}
                          </p>
                          <span className="badge-lime text-[8px] py-0 px-1 font-mono">
                            {item.matchReason === "exact" ? "EXACT" : item.matchReason === "prefix" ? "PREFIX" : "FUZZY"}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-ink/20 flex flex-wrap gap-2 text-xs font-mono">
              <span className="text-ink-muted">Quick Tags:</span>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); navigate("/shop?category=collectibles"); }}
                className="hover:underline text-coral font-bold"
              >
                #collectibles
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); navigate("/shop?category=desk-objects"); }}
                className="hover:underline text-coral font-bold"
              >
                #desk-objects
              </button>
              <button
                type="button"
                onClick={() => { setSearchOpen(false); navigate("/shop?category=home-stuff"); }}
                className="hover:underline text-coral font-bold"
              >
                #home-decor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile Drawer Navigation (Architectural & Fluid) ─────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/75 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-cream h-full border-r-2 border-ink shadow-brutal-xl flex flex-col justify-between p-6 z-10 overflow-y-auto animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-5 border-b-2 border-ink">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-display font-black text-xl uppercase tracking-tighter"
                >
                  THE TOYZ DEPT<span className="text-coral">.</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-cream-dark border-2 border-ink shadow-brutal-xs cursor-pointer"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-2 font-display font-bold text-sm uppercase tracking-wider">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 border-2 transition-all ${
                    isCurrent("/shop")
                      ? "bg-ink text-lime border-ink shadow-brutal-xs"
                      : "bg-cream-light text-ink border-ink/30 hover:bg-lime hover:border-ink"
                  }`}
                >
                  <span>Store Drops</span>
                  <span className="badge-lime text-[10px] font-mono">12 Drops</span>
                </Link>

                <Link
                  to="/shop?category=collectibles"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 border-2 transition-all ${
                    isCurrent("/shop", "category=collectibles")
                      ? "bg-ink text-lime border-ink shadow-brutal-xs"
                      : "bg-cream-light text-ink border-ink/30 hover:bg-lime hover:border-ink"
                  }`}
                >
                  <span>🐉 Collectibles</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/shop?category=desk-objects"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 border-2 transition-all ${
                    isCurrent("/shop", "category=desk-objects")
                      ? "bg-ink text-lime border-ink shadow-brutal-xs"
                      : "bg-cream-light text-ink border-ink/30 hover:bg-lime hover:border-ink"
                  }`}
                >
                  <span>⚡ Desk Gear</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 border-2 transition-all ${
                    isCurrent("/about")
                      ? "bg-ink text-lime border-ink shadow-brutal-xs"
                      : "bg-cream-light text-ink border-ink/30 hover:bg-lime hover:border-ink"
                  }`}
                >
                  <span>Our Studio</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between py-3 px-3 border-2 transition-all ${
                    isCurrent("/track-order")
                      ? "bg-ink text-lime border-ink shadow-brutal-xs"
                      : "bg-cream-light text-ink border-ink/30 hover:bg-lime hover:border-ink"
                  }`}
                >
                  <span>Track Drop</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>

                <Link
                  to="/survey"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 bg-lime/30 border-2 border-ink text-ink font-bold transition-all shadow-brutal-xs hover:bg-lime"
                >
                  <span className="flex items-center gap-2">
                    <span>🎁</span>
                    <span>Win A Free Drop</span>
                  </span>
                  <span className="badge-coral text-[9px] font-mono">GIVEAWAY</span>
                </Link>
              </nav>

              {/* Quick Department Tags */}
              <div className="mt-6 pt-4 border-t border-ink/20 space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-ink-muted">Quick Departments</p>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  <Link
                    to="/shop?category=collectibles"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px] font-bold"
                  >
                    🐉 Dragons
                  </Link>
                  <Link
                    to="/shop?category=desk-objects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px] font-bold"
                  >
                    ⚡ Fidgets
                  </Link>
                  <Link
                    to="/shop?category=home-stuff"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2.5 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px] font-bold"
                  >
                    🏠 Monoliths
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Account & System Links */}
            <div className="pt-6 border-t-2 border-ink space-y-2">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-dark w-full text-xs flex items-center justify-center gap-2 mb-2"
                >
                  <Shield className="w-4 h-4 text-lime" />
                  Admin Dashboard
                </Link>
              )}

              {user ? (
                <div className="space-y-1.5 font-mono text-xs">
                  <div className="p-2.5 bg-cream-light border border-ink mb-2">
                    <p className="font-bold text-ink uppercase truncate">
                      {user.firstName} {user.lastName || ""}
                    </p>
                    <p className="text-[10px] text-ink-muted truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/account?tab=orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 bg-cream hover:bg-lime border border-ink/40 font-bold uppercase transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Package className="w-4 h-4" /> My Orders & Invoices
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                  </Link>

                  <Link
                    to="/account?tab=wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 bg-cream hover:bg-lime border border-ink/40 font-bold uppercase transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-coral" /> Saved Wishlist
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center text-xs font-mono font-bold uppercase text-coral hover:bg-coral hover:text-cream border border-coral py-2 mt-2 transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary w-full text-xs"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
