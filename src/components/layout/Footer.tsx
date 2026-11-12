import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Instagram, Twitter, ShieldCheck, Truck, RefreshCw, Cpu } from "lucide-react";

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
      <div className="border-b-2 border-cream/20 bg-ink-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center flex-shrink-0 border border-ink">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">Free Shipping</p>
                <p className="font-mono text-[11px] text-cream/60">On orders above ₹999</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">Precision FDM</p>
                <p className="font-mono text-[11px] text-cream/60">0.12mm layer tolerances</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center flex-shrink-0 border border-ink">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">Secure Payments</p>
                <p className="font-mono text-[11px] text-cream/60">UPI, Cards, NetBanking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">Quality Guaranteed</p>
                <p className="font-mono text-[11px] text-cream/60">Hand-finished & tested</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Footer Links & Newsletter ─────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tight uppercase text-cream">
                THE TOYZ DEPT<span className="text-coral">.</span>
              </span>
            </Link>
            <p className="font-mono text-xs uppercase tracking-wider text-lime font-bold">
              "THINGS YOU DIDN'T KNOW YOU NEEDED."
            </p>
            <p className="text-cream/70 text-sm max-w-sm leading-relaxed">
              An independent, design-led 3D-printing brand engineering tactile collectibles,
              creative desk accessories, architectural home objects, and precision customer CAD fabrication.
            </p>
            <div className="pt-2 text-xs font-mono text-cream/50 space-y-1">
              <p>📍 Studio: 88 Creative Industrial Hub, Indiranagar, Bengaluru, KA 560038</p>
              <p>🕒 Timezone: Asia/Kolkata (IST)</p>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime mb-4">
              Catalogue
            </h4>
            <ul className="space-y-2.5 font-display text-sm tracking-wider uppercase">
              <li>
                <Link to="/shop" className="text-cream/80 hover:text-coral transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop?category=collectibles" className="text-cream/80 hover:text-coral transition-colors">
                  Collectibles
                </Link>
              </li>
              <li>
                <Link to="/shop?category=desk-objects" className="text-cream/80 hover:text-coral transition-colors">
                  Desk Objects
                </Link>
              </li>
              <li>
                <Link to="/shop?category=home-stuff" className="text-cream/80 hover:text-coral transition-colors">
                  Home Stuff
                </Link>
              </li>
              <li>
                <Link to="/custom-prints" className="text-cream/80 hover:text-coral transition-colors">
                  Custom 3D Printing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime mb-4">
              Help & Policies
            </h4>
            <ul className="space-y-2.5 font-display text-sm tracking-wider uppercase">
              <li>
                <Link to="/track-order" className="text-cream/80 hover:text-coral transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-cream/80 hover:text-coral transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-cream/80 hover:text-coral transition-colors">
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
              <li>
                <Link to="/contact" className="text-cream/80 hover:text-coral transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime mb-4">
              Join The Dept.
            </h4>
            <p className="text-cream/70 text-xs mb-4">
              Subscribe for secret drops, prototype previews, and limited filament batch runs.
            </p>
            {subscribed ? (
              <div className="bg-lime text-ink p-3 border border-ink text-xs font-mono font-bold uppercase flex items-center gap-2">
                <Check className="w-4 h-4" /> Subscribed to The Dept.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-cream-light text-ink border-2 border-cream px-3 py-2 text-xs font-mono focus:outline-none focus:border-lime"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-coral text-cream font-display font-bold text-xs uppercase tracking-wider border-2 border-cream hover:bg-coral-dark transition-all flex items-center justify-center gap-1.5"
                >
                  Get Drop Alerts <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://instagram.com/thetoyzdept"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/thetoyzdept"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div className="border-t-2 border-cream/20 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/50">
          <div>
            © {new Date().getFullYear()} THE TOYZ DEPT. (https://thetoyzdept.in). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-lime">INR (₹)</span>
            <span>•</span>
            <span>CLOUDFLARE SERVERLESS</span>
            <span>•</span>
            <span>MADE IN BENGALURU</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
