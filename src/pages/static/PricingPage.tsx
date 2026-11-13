import React from "react";
import { Link } from "react-router-dom";
import { CreditCard, Truck, HelpCircle, CheckCircle2, ShieldCheck, Tag } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function PricingPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-lime text-xs">Payment & Pricing Transparency</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Razorpay Compliance</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            Pricing & Fee Structure<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-ink-muted uppercase mt-2">
            Clear, transparent pricing in Indian Rupees (INR ₹) • Zero hidden charges • Upfront quotations
          </p>
        </div>

        {/* Core Pricing Principles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center border border-ink">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Currency & Net Prices</h3>
            <p className="text-ink-muted leading-relaxed">
              All prices displayed across our storefront, cart, and checkout are strictly denominated in{" "}
              <strong className="text-ink">Indian Rupees (INR ₹)</strong>. The price shown on the product card is the exact unit price you pay.
            </p>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center border border-ink">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Statutory Tax Status</h3>
            <p className="text-ink-muted leading-relaxed">
              THE TOYZ DEPT. is operated by Abhishek H as an individual sole proprietorship exempt from GST registration under Section 22 of the CGST Act, 2017. No GST is charged or collected from buyers.
            </p>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-ink text-cream flex items-center justify-center border border-ink">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Transparent Logistics</h3>
            <p className="text-ink-muted leading-relaxed">
              Enjoy <strong className="text-ink">Free Express Delivery</strong> on all orders with cart subtotal ₹999 and above. Orders below ₹999 carry a flat delivery fee of ₹99 anywhere in India.
            </p>
          </div>
        </div>

        {/* Catalog Pricing Details */}
        <div className="card-brutal p-6 sm:p-8 bg-cream-light space-y-6">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink border-b border-ink/20 pb-3">
            1. Standard Catalogue Products
          </h2>
          <div className="font-mono text-xs text-ink/80 leading-relaxed space-y-4">
            <p>
              Every manufactured standard product in our catalog (such as articulated toys, desk objects, and home decor items) is listed with its explicit base unit price.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-cream p-4 border border-ink/20 space-y-2">
                <h4 className="font-display font-bold text-sm uppercase text-ink">Variant-Based Adjustments</h4>
                <p className="text-[11px] text-ink-muted">
                  When selecting options such as size (e.g. Standard 150mm vs Large 220mm) or engineering material (PLA+ vs Heat-Resistant PETG), the real-time price updates immediately on the product detail page before you add the item to your tray.
                </p>
              </div>
              <div className="bg-cream p-4 border border-ink/20 space-y-2">
                <h4 className="font-display font-bold text-sm uppercase text-ink">No Surprise Fees at Checkout</h4>
                <p className="text-[11px] text-ink-muted">
                  Your checkout screen clearly displays the itemized summary: Product Subtotal, Shipping Fee (₹0 or ₹99), Applied Promotional Discounts (if any), and the Final Total Payable in INR.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Terms & Gateway */}
        <div className="card-brutal p-6 sm:p-8 bg-cream-light space-y-6">
          <div className="flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-lime-darker" />
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink">
              2. Payment Terms & Supported Modes
            </h2>
          </div>
          <div className="font-mono text-xs text-ink/80 leading-relaxed space-y-4">
            <p>
              All online payments on <strong>https://thetoyzdept.in</strong> are processed securely via{" "}
              <strong className="text-ink">Razorpay Standard Web Checkout</strong> (authorized by the Reserve Bank of India, PCI-DSS Level 1 compliant).
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-cream p-4 border border-ink/20 space-y-1">
                <p className="font-bold text-ink">Accepted Payment Methods:</p>
                <ul className="list-disc list-inside text-ink-muted space-y-1 text-[11px]">
                  <li>UPI (Google Pay, PhonePe, Paytm, CRED, BHIM)</li>
                  <li>Debit & Credit Cards (Visa, Mastercard, RuPay, Maestro)</li>
                  <li>Net Banking across 50+ major Indian banks</li>
                  <li>Popular digital wallets</li>
                </ul>
              </div>
              <div className="bg-cream p-4 border border-ink/20 space-y-1">
                <p className="font-bold text-ink">When Payment is Required:</p>
                <ul className="list-disc list-inside text-ink-muted space-y-1 text-[11px]">
                  <li>
                    <strong>All Store Drops:</strong> Full payment at online checkout prior to order dispatch.
                  </li>
                  <li>
                    <strong>Order Confirmation:</strong> An instant order confirmation with invoice receipt is emailed immediately upon payment completion.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Clarification Desk */}
        <div className="card-brutal p-6 bg-ink text-cream space-y-3 font-mono text-xs">
          <div className="flex items-center gap-2 text-lime">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-display font-bold text-sm uppercase">Need Clarification on Pricing or Quotations?</h3>
          </div>
          <p className="text-cream/70 text-[11px] leading-relaxed">
            If you have questions about commercial bulk pricing, educational discounts for students/designers, or specific custom print tolerances, please contact our desk:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-2 text-[11px]">
            <a href={`mailto:${BUSINESS_PROFILE.contact.email}`} className="text-lime underline">
              Email: {BUSINESS_PROFILE.contact.email}
            </a>
            <span className="hidden sm:inline text-cream/40">•</span>
            <a href={`tel:${BUSINESS_PROFILE.contact.phone.replace(/\s+/g, "")}`} className="text-lime underline">
              Phone: {BUSINESS_PROFILE.contact.phone}
            </a>
            <span className="hidden sm:inline text-cream/40">•</span>
            <span className="text-cream/60">{BUSINESS_PROFILE.contact.supportHours}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
