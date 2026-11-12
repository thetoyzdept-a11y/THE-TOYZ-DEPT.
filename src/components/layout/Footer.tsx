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
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">Razorpay Verified</p>
                <p className="font-mono text-[11px] text-cream/60">UPI, Cards, NetBanking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center flex-shrink-0 border border-ink">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <p className="font-display font-bold text-xs uppercase tracking-wider text-cream">48h QC Guarantee</p>
                <p className="font-mono text-[11px] text-cream/60">Free damage replacement</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main 4-Column Structured Compliance Footer ─────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand & Identity */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tight uppercase text-cream">
                THE TOYZ DEPT<span className="text-coral">.</span>
              </span>
            </Link>
            <p className="font-mono text-xs uppercase tracking-wider text-lime font-bold">
              "{BUSINESS_PROFILE.tagline}"
            </p>
            <p className="text-cream/70 text-xs leading-relaxed">
              {BUSINESS_PROFILE.description}
            </p>
            <div className="pt-2 text-[11px] font-mono text-cream/60 space-y-1 border-t border-cream/15">
              <p>
                <span className="text-cream/40">Entity:</span> {BUSINESS_PROFILE.legalEntityName}
              </p>
              <p>
                <span className="text-cream/40">Structure:</span> Individual Sole Proprietorship
              </p>
              <p>
                <span className="text-cream/40">Made & Dispatched in:</span> Karnataka, India
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href={BUSINESS_PROFILE.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BUSINESS_PROFILE.social.twitter}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 bg-cream/10 hover:bg-lime hover:text-ink flex items-center justify-center transition-colors border border-cream/20"
                aria-label="Twitter / X"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Customer Service */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime mb-4">
              Customer Support
            </h4>
            <ul className="space-y-2.5 font-display text-sm tracking-wider uppercase">
              <li>
                <Link to="/contact" className="text-cream/80 hover:text-coral transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="text-cream/80 hover:text-coral transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-cream/80 hover:text-coral transition-colors">
                  Pricing Details
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
                <Link to="/grievance-redressal" className="text-cream/80 hover:text-coral transition-colors flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-coral" />
                  <span>Grievance Redressal</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-cream/80 hover:text-coral transition-colors">
                  About Our Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Statutory */}
          <div>
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 font-display text-sm tracking-wider uppercase">
              <li>
                <Link to="/terms" className="text-cream/80 hover:text-coral transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-cream/80 hover:text-coral transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refunds" className="text-cream/80 hover:text-coral transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/custom-prints" className="text-cream/80 hover:text-coral transition-colors">
                  Custom CAD Printing
                </Link>
              </li>
              <li>
                <Link to="/sample-invoice" className="text-cream/80 hover:text-coral transition-colors flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-lime" />
                  <span>Specimen Invoice</span>
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-cream/80 hover:text-coral transition-colors">
                  Shop All Products
                </Link>
              </li>
            </ul>
            <div className="mt-6 p-3 bg-cream/5 border border-cream/15 text-[11px] font-mono text-cream/70 space-y-1">
              <p className="font-bold text-coral uppercase flex items-center gap-1">
                <span>⚠️</span> Safety Notice
              </p>
              <p>Choking hazard for kids under 3. Novelty/desk tactile art for ages 14+.</p>
            </div>
          </div>

          {/* Column 4: Business Information & Verification */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-sm tracking-wider uppercase text-lime">
              Business Information
            </h4>
            <div className="space-y-2.5 font-mono text-xs text-cream/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-coral flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  {BUSINESS_PROFILE.address.formatted}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lime flex-shrink-0" />
                <a
                  href={`mailto:${BUSINESS_PROFILE.contact.email}`}
                  className="text-[11px] hover:text-lime transition-colors underline"
                >
                  {BUSINESS_PROFILE.contact.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime flex-shrink-0" />
                <a
                  href={`tel:${BUSINESS_PROFILE.contact.phone.replace(/\s+/g, "")}`}
                  className="text-[11px] hover:text-lime transition-colors underline"
                >
                  {BUSINESS_PROFILE.contact.phone}
                </a>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-cream/50 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-cream/60">
                  {BUSINESS_PROFILE.contact.supportHours}
                </p>
              </div>

              <div className="pt-2 border-t border-cream/15 text-[11px] text-cream/60 space-y-1">
                <p>
                  <strong className="text-cream/80">GST Status:</strong> {BUSINESS_PROFILE.taxation.gstStatus} (Small Business Exemption)
                </p>
                <p>
                  <strong className="text-cream/80">Payments:</strong> Razorpay Standard Checkout
                </p>
                <p>
                  <strong className="text-cream/80">Logistics:</strong> Shiprocket Partner Network
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────────── */}
      <div className="border-t-2 border-cream/20 bg-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-cream/60">
          <div>
            © {new Date().getFullYear()} {BUSINESS_PROFILE.brandName} (https://{BUSINESS_PROFILE.domain}). All rights reserved. Operated by {BUSINESS_PROFILE.legalEntityName}.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="text-lime">INR (₹)</span>
            <span>•</span>
            <span>CONSUMER PROTECTION (E-COMMERCE) RULES 2020</span>
            <span>•</span>
            <span>IT ACT 2000 COMPLIANT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
