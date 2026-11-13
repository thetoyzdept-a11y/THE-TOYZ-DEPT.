import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
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
} from "lucide-react";

export function Header() {
  const { user, isAdmin, logout } = useAuth();
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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
      <div className="bg-ink text-cream py-2 px-4 text-center border-b-2 border-ink">
        <div className="flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap text-xs font-mono tracking-wider uppercase">
          <span className="text-lime font-bold">⚡ FREE EXPRESS SHIPPING ABOVE ₹999</span>
          <span className="opacity-60 hidden sm:inline">•</span>
          <span className="hidden sm:inline">+999 DESK AURA GUARANTEED</span>
          <span className="opacity-60">•</span>
          <span>DISPATCHED FROM BENGALURU IN 24-48H</span>
        </div>
      </div>

      {/* ── Main Navigation Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-cream border-b-2 border-ink shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu toggle */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 -ml-2 text-ink hover:bg-cream-dark transition-colors"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Brand Wordmark Treatment */}
            <div className="flex items-center">
              <Link to="/" className="group flex items-center gap-2">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-ink border-2 border-ink flex items-center justify-center text-lime font-display font-black text-lg shadow-brutal-sm group-hover:bg-lime group-hover:text-ink transition-all">
                  T
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-black text-xl md:text-2xl tracking-tighter uppercase leading-none">
                    THE TOYZ DEPT<span className="text-coral">.</span>
                  </span>
                  <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-ink-muted uppercase font-bold">
                    EST. 2026 // BENGALURU
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                to="/shop"
                className="font-display font-bold text-sm tracking-wider uppercase hover:text-coral transition-colors py-1"
              >
                Shop All
              </Link>
              <Link
                to="/shop?category=collectibles"
                className="font-display font-bold text-sm tracking-wider uppercase hover:text-coral transition-colors py-1"
              >
                Collectibles
              </Link>
              <Link
                to="/shop?category=desk-objects"
                className="font-display font-bold text-sm tracking-wider uppercase hover:text-coral transition-colors py-1"
              >
                Desk Objects
              </Link>
              <Link
                to="/shop?category=home-stuff"
                className="font-display font-bold text-sm tracking-wider uppercase hover:text-coral transition-colors py-1"
              >
                Home Stuff
              </Link>
              <Link
                to="/custom-prints"
                className="font-display font-bold text-sm tracking-wider uppercase text-ink hover:text-coral transition-colors py-1 flex items-center gap-1.5"
              >
                <span className="w-2 h-2 rounded-full bg-lime border border-ink animate-ping" />
                Custom Prints
              </Link>
              <Link
                to="/track-order"
                className="font-display font-bold text-sm tracking-wider uppercase text-ink-muted hover:text-ink transition-colors py-1"
              >
                Track Order
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
                      <Link to="/account" className="block px-4 py-2 hover:bg-lime transition-colors">
                        My Dashboard
                      </Link>
                      <Link to="/account/orders" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Orders & Invoices
                      </Link>
                      <Link to="/account/custom-requests" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Custom Quotations
                      </Link>
                      <Link to="/account/wishlist" className="block px-4 py-2 hover:bg-lime transition-colors">
                        Saved Wishlist
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" className="block px-4 py-2 bg-ink text-lime hover:bg-lime hover:text-ink transition-colors border-t border-ink">
                          Admin Portal
                        </Link>
                      )}
                      <button
                        onClick={() => logout()}
                        className="w-full text-left px-4 py-2 text-coral hover:bg-coral hover:text-cream border-t border-ink transition-colors flex items-center justify-between"
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
            <p className="font-mono text-xs text-ink-muted mb-4 uppercase">
              Collectibles // Desk Tools // Architectural Home Objects
            </p>
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
                onClick={() => { setSearchOpen(false); navigate("/custom-prints"); }}
                className="hover:underline text-coral font-bold"
              >
                #custom-stl
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
              <nav className="mt-6 flex flex-col gap-2 font-display font-bold text-lg uppercase tracking-wider">
                <Link
                  to="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Shop All
                  <ChevronRight className="w-5 h-5 text-ink-muted" />
                </Link>
                <Link
                  to="/shop?category=collectibles"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Collectibles
                  <ChevronRight className="w-5 h-5 text-ink-muted" />
                </Link>
                <Link
                  to="/shop?category=desk-objects"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Desk Objects
                  <ChevronRight className="w-5 h-5 text-ink-muted" />
                </Link>
                <Link
                  to="/shop?category=home-stuff"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all"
                >
                  Home Stuff
                  <ChevronRight className="w-5 h-5 text-ink-muted" />
                </Link>
                <Link
                  to="/custom-prints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 bg-lime/40 hover:bg-lime border border-ink transition-all"
                >
                  <span>Custom Prints</span>
                  <span className="badge-coral text-[10px]">Upload STL</span>
                </Link>
                <Link
                  to="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2.5 px-3 hover:bg-lime border border-transparent hover:border-ink transition-all text-sm"
                >
                  Track Order
                </Link>
              </nav>
            </div>

            {/* Bottom Account & System Links */}
            <div className="pt-6 border-t-2 border-ink space-y-3">
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-dark w-full text-xs"
                >
                  <Shield className="w-4 h-4 text-lime" />
                  Admin Dashboard
                </Link>
              )}

              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="btn-secondary w-full text-xs"
                  >
                    <User className="w-4 h-4" />
                    Account ({user.firstName})
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full text-center text-xs font-mono uppercase text-coral hover:underline py-1"
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
