import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Instagram,
  Twitter,
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
                <Truck className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">Express Dispatch</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Free on orders &gt; ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">0.12mm Precision</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Micrometer tolerance check</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-lime text-ink flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">Instant Payments</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">UPI, Cards & NetBanking</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-cream/5 border border-cream/10 hover:border-lime transition-colors">
              <div className="w-9 h-9 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink shadow-brutal-xs">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream truncate">48h QC Promise</p>
                <p className="font-mono text-[10px] text-cream/60 truncate">Free damage replacement</p>
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
              Design-led 3D printing studio engineering tactile articulated creatures, brutalist desk gear, and bespoke CAD geometry in Bengaluru.
            </p>
            <div className="pt-2 text-[11px] font-mono text-cream/50 space-y-1 border-t border-cream/15">
              <p>Made & Dispatched in Karnataka, India</p>
              <p>Ages 14+ // Desk Art & Tactile Collectibles</p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={BUSINESS_PROFILE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20 cursor-pointer"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_PROFILE.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20 cursor-pointer"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Curated Departments (2.5 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime">
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
                <Link to="/shop" className="text-coral hover:underline flex items-center gap-1.5 pt-1">
                  <span>✦</span> <span>View Full Catalog →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies (2.5 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime">
              Assistance
            </h4>
            <ul className="space-y-2 font-display text-xs sm:text-sm uppercase tracking-wide">
              <li>
                <Link to="/track-order" className="text-cream/80 hover:text-coral transition-colors">
                  Track Your Drop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-cream/80 hover:text-coral transition-colors">
                  Contact Studio
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-cream/80 hover:text-coral transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-cream/80 hover:text-coral transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-cream/80 hover:text-coral transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-cream/80 hover:text-coral transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase text-lime">
              Drop Notifications
            </h4>
            <p className="font-mono text-xs text-cream/70 leading-relaxed">
              Get notified when rare filament editions or limited batch 3D prints drop. Zero spam.
            </p>

            {subscribed ? (
              <div className="p-3 bg-lime/20 border border-lime text-lime font-mono text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>You're on the priority drop list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="bg-cream/10 border border-cream/30 text-cream px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-lime flex-1"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-lime text-ink font-mono text-xs font-bold uppercase hover:bg-cream transition-colors cursor-pointer"
                  >
                    Join
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 border-t border-cream/15 text-[11px] font-mono text-cream/60 space-y-1">
              <p>Email: <a href={`mailto:${BUSINESS_PROFILE.contact.email}`} className="text-cream hover:text-lime underline">{BUSINESS_PROFILE.contact.email}</a></p>
              <p>Phone: <a href={`tel:${BUSINESS_PROFILE.contact.phone.replace(/\s+/g, "")}`} className="text-cream hover:text-lime underline">{BUSINESS_PROFILE.contact.phone}</a></p>
              <p>Hours: Mon–Sat 10:00 AM – 7:00 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div className="border-t-2 border-cream/15 bg-ink py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/60">
          <div>
            © {new Date().getFullYear()} {BUSINESS_PROFILE.brandName}. Operated by {BUSINESS_PROFILE.legalEntityName}.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-lime font-bold">INR (₹)</span>
            <span>•</span>
            <span>MADE IN BENGALURU, INDIA 🇮🇳</span>
            <span>•</span>
            <span>RAZORPAY 100% SECURE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
