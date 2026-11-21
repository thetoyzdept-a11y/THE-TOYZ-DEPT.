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
  Layers,
  FileCode,
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

  return (
    <>
      {/* ── Top Announcement Ticker ──────────────────────────────────── */}
      <div className="bg-ink text-cream py-2 border-b-2 border-ink overflow-hidden whitespace-nowrap select-none flex font-mono text-xs uppercase tracking-widest">
        <div className="inline-flex gap-8 animate-marquee">
          <span className="text-lime font-bold">⚡ FREE EXPRESS SHIPPING ABOVE ₹999</span>
          <Link to="/survey" className="text-lime underline font-bold hover:text-cream">🎁 WIN A FREE DROP // TAKE 2-MIN SURVEY →</Link>
          <span>✦ +999 DESK AURA GUARANTEED</span>
          <span>✦ DISPATCHED FROM BENGALURU IN 24-48H</span>
          <span>✦ 100% ADHD APPROVED TACTILE FIDGETS</span>
          <span>✦ ZERO BORING CORPORATE MERCH</span>
        </div>
        <div className="inline-flex gap-8 animate-marquee" aria-hidden="true">
          <span className="text-lime font-bold">⚡ FREE EXPRESS SHIPPING ABOVE ₹999</span>
          <Link to="/survey" className="text-lime underline font-bold hover:text-cream">🎁 WIN A FREE DROP // TAKE 2-MIN SURVEY →</Link>
          <span>✦ +999 DESK AURA GUARANTEED</span>
          <span>✦ DISPATCHED FROM BENGALURU IN 24-48H</span>
          <span>✦ 100% ADHD APPROVED TACTILE FIDGETS</span>
          <span>✦ ZERO BORING CORPORATE MERCH</span>
        </div>
      </div>

      {/* ── Main Navigation Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b-2 border-ink shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-ink hover:bg-cream-dark border-2 border-transparent hover:border-ink transition-colors cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Wordmark Treatment */}
            <div className="flex items-center">
              <Link to="/" className="group flex items-center gap-2.5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-ink border-2 border-ink flex items-center justify-center text-lime font-display font-black text-lg shadow-brutal-sm group-hover:bg-lime group-hover:text-ink group-hover:rotate-6 transition-all duration-200">
                  T
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase leading-none group-hover:text-coral transition-colors">
                    THE TOYZ DEPT<span className="text-coral">.</span>
                  </span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-ink-muted uppercase font-bold">
                    EST. 2026 // BENGALURU
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation (Sleek, unique, non-redundant) */}
            <nav className="hidden lg:flex items-center gap-8 font-display font-bold text-xs uppercase tracking-wider">
              <Link
                to="/shop"
                className="hover:text-coral transition-colors py-1 flex items-center gap-2 group"
              >
                <span>Store Drops</span>
                <span className="badge-lime text-[9px] py-0 px-1 font-mono group-hover:bg-ink group-hover:text-lime transition-colors">
                  12 Drops
                </span>
              </Link>
              <Link
                to="/shop?category=collectibles"
                className="hover:text-coral transition-colors py-1 flex items-center gap-2 group"
              >
                <span>Collectibles</span>
              </Link>
              <Link
                to="/shop?category=desk-objects"
                className="hover:text-coral transition-colors py-1 flex items-center gap-2 group"
              >
                <span>Desk Gear</span>
              </Link>
              <Link
                to="/about"
                className="hover:text-coral transition-colors py-1"
              >
                Our Studio
              </Link>
              <Link
                to="/track-order"
                className="hover:text-coral transition-colors py-1 text-ink-muted hover:text-ink"
              >
                Track Order
              </Link>
              <Link
                to="/survey"
                className="hover:text-coral transition-colors py-1 flex items-center gap-1.5 text-ink font-bold"
              >
                <span>Win Free Drop</span>
                <span className="badge-coral text-[9px] py-0 px-1 font-mono">
                  GIVEAWAY 🎁
                </span>
              </Link>
            </nav>

            {/* Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-ink hover:bg-cream-dark border-2 border-transparent hover:border-ink transition-all"
                aria-label="Search catalogue"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Admin Portal Shortcut if Admin */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-lime border-2 border-ink text-xs font-mono font-bold tracking-wider uppercase shadow-brutal-sm hover:bg-lime hover:text-ink transition-all"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}

              {/* Account Dropdown / Link */}
              {user ? (
                <div className="relative group">
                  <Link
                    to="/account"
                    className="flex items-center gap-1.5 p-2 text-ink hover:bg-cream-dark border-2 border-transparent hover:border-ink transition-all"
                    aria-label="Customer Account"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline font-mono text-xs font-bold uppercase truncate max-w-[80px]">
                      {user.firstName}
                    </span>
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-1 w-48 bg-cream-light border-2 border-ink shadow-brutal-lg hidden group-hover:block z-50">
                    <div className="p-3 border-b-2 border-ink bg-cream">
                      <p className="font-display font-bold text-xs uppercase truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="font-mono text-[10px] text-ink-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1 font-display text-xs font-bold uppercase tracking-wider">
                      <Link to="/account?tab=orders" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Orders & Invoices
                      </Link>
                      <Link to="/account?tab=wishlist" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Saved Wishlist
                      </Link>
                      <Link to="/account?tab=addresses" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Saved Addresses
                      </Link>
                      <Link to="/account?tab=profile" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Profile Info
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 bg-ink text-lime hover:bg-lime hover:text-ink transition-colors border-t border-ink">
                          Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-coral hover:bg-coral hover:text-cream border-t border-ink transition-colors flex items-center justify-between cursor-pointer"
                      >
                        Sign Out
                        <LogOut className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="p-2 text-ink hover:bg-cream-dark border-2 border-transparent hover:border-ink transition-all"
                  aria-label="Sign In"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 bg-ink text-cream border-2 border-ink hover:bg-lime hover:text-ink shadow-brutal-sm transition-all"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-coral text-cream font-mono font-bold text-[10px] w-5 h-5 flex items-center justify-center border-2 border-ink shadow-sm">
                    {cartCount}
                  </span>
                )}
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

      {/* ── Mobile Drawer Navigation ─────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-ink/75"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-cream h-full border-r-2 border-ink shadow-brutal-xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b-2 border-ink">
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
                  className="p-1.5 hover:bg-cream-dark border border-ink"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-6 flex flex-col gap-2 font-display font-bold text-base uppercase tracking-wider">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  <span>Store Drops</span>
                  <span className="badge-lime text-[10px] font-mono">12 Drops</span>
                </Link>
                <Link
                  to="/shop?category=collectibles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  <span>🐉 Collectibles</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>
                <Link
                  to="/shop?category=desk-objects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  <span>⚡ Desk Gear & Fidgets</span>
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Our Studio
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Track Your Drop
                  <ChevronRight className="w-4 h-4 text-ink-muted" />
                </Link>
                <Link
                  to="/survey"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-3 bg-lime/20 border-2 border-ink text-ink font-bold transition-all shadow-brutal-xs"
                >
                  <span className="flex items-center gap-2">
                    <span>🎁</span>
                    <span>Win A Free Drop (Survey)</span>
                  </span>
                  <span className="badge-coral text-[9px] font-mono">RAFFLE</span>
                </Link>
              </nav>

              {/* Quick Department Tags */}
              <div className="mt-6 pt-4 border-t border-ink/20 space-y-2">
                <p className="font-mono text-[10px] uppercase font-bold text-ink-muted">Quick Departments</p>
                <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                  <Link
                    to="/shop?category=collectibles"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px]"
                  >
                    🐉 Collectibles
                  </Link>
                  <Link
                    to="/shop?category=desk-objects"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px]"
                  >
                    ⚡ Desk Gear
                  </Link>
                  <Link
                    to="/shop?category=home-stuff"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-2 py-1 bg-cream-light border border-ink text-ink hover:bg-lime text-[11px]"
                  >
                    🏠 Decor
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

                  <Link
                    to="/account?tab=addresses"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 bg-cream hover:bg-lime border border-ink/40 font-bold uppercase transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Saved Addresses
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-ink-muted" />
                  </Link>

                  <Link
                    to="/account?tab=profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between p-2 bg-cream hover:bg-lime border border-ink/40 font-bold uppercase transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile Details
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
