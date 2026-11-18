import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Instagram,
  ShieldCheck,
  Truck,
  RefreshCw,
  Cpu,
  Mail,
  Phone,
  MapPin,
  Clock,
  Scale,
  FileText,
  CreditCard,
  Lock,
  ExternalLink,
} from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-ink text-cream border-t-2 border-ink">
      {/* ── Brand Trust Features Strip ─────────────────────────────── */}
      <div className="border-b-2 border-cream/15 bg-ink-light py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-lime text-ink flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <Lock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">100% Prepaid Only</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">No COD // Zero Fraud Risk</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">Pan-India Express</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Free on orders &gt; ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-lime text-ink flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">0.12mm Precision</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Micrometer tolerance check</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">48h QC Promise</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Unboxing damage replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 4-Column Structured Footer ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand Wordmark (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-block group">
              <span className="font-display font-black text-2xl sm:text-3xl tracking-tight uppercase text-cream group-hover:text-lime transition-colors">
                THE TOYZ DEPT<span className="text-coral">.</span>
              </span>
            </Link>
            <p className="font-mono text-xs uppercase tracking-wider text-lime font-bold">
              "{BUSINESS_PROFILE.tagline}"
            </p>
            <p className="text-cream/70 text-xs leading-relaxed font-body max-w-sm">
              Design-led additive manufacturing studio engineering tactile articulated fidget creatures, brutalist desk gear, and kinetic collectors in Bengaluru, India.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cream/50 space-y-1 border-t border-cream/15">
              <p>📍 Studio: Bengaluru, Karnataka, India</p>
              <p>⚡ Ages 14+ // Desk Art & Tactile Collectibles</p>
              <p>📦 Dispatched Pan-India via Shiprocket Network</p>
            </div>
            {/* Social Links — Instagram ONLY */}
            <div className="pt-2">
              <a
                href={BUSINESS_PROFILE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-cream/10 hover:bg-lime hover:text-ink text-cream text-xs font-mono font-bold uppercase transition-colors border border-cream/20 cursor-pointer shadow-brutal-xs"
                aria-label="Follow THE TOYZ DEPT. on Instagram"
              >
                <Instagram className="w-4 h-4 text-coral" />
                <span>@thetoyzdept on Instagram</span>
              </a>
            </div>
          </div>

          {/* Column 2: Curated Drops (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime border-b border-cream/10 pb-1">
              Curated Drops
            </h4>
            <ul className="space-y-2 font-display text-xs sm:text-sm uppercase tracking-wide">
              <li>
                <Link to="/shop?category=collectibles" className="text-cream/80 hover:text-coral transition-colors flex items-center gap-1.5">
                  <span>🐉</span> <span>Collectibles & Dragons</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=desk-objects" className="text-cream/80 hover:text-coral transition-colors flex items-center gap-1.5">
                  <span>⚡</span> <span>Desk Gear & Fidgets</span>
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-stuff" className="text-cream/80 hover:text-coral transition-colors flex items-center gap-1.5">
                  <span>🏠</span> <span>Brutalist Planters & Decor</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-coral hover:underline flex items-center gap-1.5 pt-1 font-bold">
                  <span>✦</span> <span>View Full Catalog →</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-cream/10 font-mono text-[11px] text-cream/60 space-y-1">
              <p className="font-bold uppercase text-cream/80">Support Desk:</p>
              <p>Email: <a href={`mailto:${BUSINESS_PROFILE.contact.email}`} className="text-cream hover:text-lime underline">{BUSINESS_PROFILE.contact.email}</a></p>
              <p>WhatsApp: <a href="https://wa.me/919019465897" target="_blank" rel="noreferrer" className="text-lime hover:underline">+91 90194 65897</a></p>
              <p>Hours: Mon–Sat 10 AM – 7 PM IST</p>
            </div>
          </div>

          {/* Column 3: Customer Care & Assistance (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime border-b border-cream/10 pb-1">
              Customer Desk
            </h4>
            <ul className="space-y-2 font-display text-xs sm:text-sm uppercase tracking-wide">
              <li>
                <Link to="/track-order" className="text-cream/80 hover:text-coral transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/account" className="text-cream/80 hover:text-coral transition-colors">
                  My Orders & Account
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream/80 hover:text-coral transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/80 hover:text-coral transition-colors">
                  About Our Studio
                </Link>
              </li>
              <li>
                <Link to="/grievance-redressal" className="text-cream/80 hover:text-coral transition-colors">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <Link to="/sample-invoice" className="text-cream/80 hover:text-coral transition-colors">
                  Commercial Invoice
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime border-b border-cream/10 pb-1">
              Store Policies & T&C
            </h4>
            <ul className="space-y-2 font-display text-xs sm:text-sm uppercase tracking-wide">
              <li>
                <Link to="/terms" className="text-cream/80 hover:text-coral transition-colors flex items-center justify-between">
                  <span>Terms & Conditions</span>
                  <span className="text-[10px] text-cream/40 font-mono">T&C</span>
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-cream/80 hover:text-coral transition-colors flex items-center justify-between">
                  <span>Returns & Refunds</span>
                  <span className="badge-coral text-[9px] py-0 px-1 font-mono">NO COD</span>
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-cream/80 hover:text-coral transition-colors flex items-center justify-between">
                  <span>Shipping & Delivery</span>
                  <span className="text-[10px] text-cream/40 font-mono">24-48H</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-cream/80 hover:text-coral transition-colors flex items-center justify-between">
                  <span>Privacy Policy</span>
                  <span className="text-[10px] text-cream/40 font-mono">IT ACT</span>
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-cream/80 hover:text-coral transition-colors flex items-center justify-between">
                  <span>Pricing & Taxes</span>
                  <span className="text-[10px] text-cream/40 font-mono">INR ₹</span>
                </Link>
              </li>
            </ul>

            {/* Newsletter Subscription */}
            <div className="pt-3 border-t border-cream/10 space-y-2">
              <p className="font-mono text-[10px] text-cream/70 uppercase">Priority Drops Newsletter:</p>
              {subscribed ? (
                <div className="p-2 bg-lime/20 border border-lime text-lime font-mono text-[11px] font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>Subscribed for rare drops!</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-1">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="bg-cream/10 border border-cream/30 text-cream px-2.5 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-lime flex-1 min-w-0"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-lime text-ink font-mono text-xs font-bold uppercase hover:bg-cream transition-colors cursor-pointer flex-shrink-0"
                  >
                    Join
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Pre-Footer Payment & No-COD Profitability Trust Banner ─── */}
      <div className="border-t-2 border-cream/15 bg-ink-light py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge-lime text-[10px] font-bold">100% PREPAID STORE</span>
            <span className="text-cream/80 text-[11px]">
              No Cash on Delivery (COD) • Zero Return Losses • Factory-Direct Pricing
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-cream/60 uppercase">
            <span className="text-lime font-bold">PAY SECURELY:</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">UPI</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">GPAY</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">PHONEPE</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">RUPAY</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">CARDS</span>
            <span className="px-1.5 py-0.5 bg-cream/10 border border-cream/20 text-cream font-bold">NETBANKING</span>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div className="border-t-2 border-cream/15 bg-ink py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/60">
          <div>
            © {new Date().getFullYear()} {BUSINESS_PROFILE.brandName}. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-lime font-bold">INR (₹)</span>
            <span>•</span>
            <span>DISPATCHED VIA SHIPROCKET</span>
            <span>•</span>
            <span>ENGINEERED IN BENGALURU, INDIA 🇮🇳</span>
            <span>•</span>
            <span>RAZORPAY 256-BIT ENCRYPTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
