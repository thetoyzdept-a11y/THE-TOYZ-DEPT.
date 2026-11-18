import React from "react";
import { Link } from "react-router-dom";
import { RefreshCw, AlertCircle, CheckCircle2, ShieldCheck, Clock, ArrowRight } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function RefundPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-coral text-xs">Customer Protection</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Quality Guarantee</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink">
            Refund & Cancellation Policy<span className="text-lime">.</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase mt-2">
            100% Prepaid Store • Strict No COD • 48-Hour Unboxing Damage Guarantee • 5–7 Day Refunds
          </p>
        </div>

        {/* Strict No COD & 100% Prepaid Policy Alert */}
        <div className="p-5 bg-lime/20 border-2 border-ink flex items-start gap-3 shadow-brutal-sm font-mono text-xs">
          <ShieldCheck className="w-5 h-5 text-ink flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-display font-black uppercase text-sm text-ink block">
              100% Prepaid Store // Strict No Cash on Delivery (COD) Policy
            </strong>
            <p className="text-ink/80 text-[11px] leading-relaxed">
              To guarantee that every drop arrives in pristine, factory-fresh collector condition, <strong>THE TOYZ DEPT. operates strictly on a 100% prepaid model</strong>. We do <strong>NOT offer Cash on Delivery (COD)</strong>. In e-commerce, COD incurs heavy 35%+ return rates from fake bookings, forcing sellers to inflate prices to cover courier losses. By accepting only verified prepaid checkouts via Razorpay (UPI, GPay, PhonePe, Cards, NetBanking), we eliminate logistics waste, protect our precision 3D printing inventory, and maintain honest, competitive pricing for our community.
            </p>
          </div>
        </div>

        {/* 3 Core Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Clock className="w-4 h-4 text-coral" />
              <span>48-Hour Damage Window</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Report transit damage or structural defects within 48 hours of delivery for a free reprint or refund.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <RefreshCw className="w-4 h-4 text-lime-darker" />
              <span>Instant Reprint Priority</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Verified defective items receive rush machine queue priority and complimentary express shipping.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <ShieldCheck className="w-4 h-4 text-ink" />
              <span>5–7 Days Razorpay Refund</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Monetary refunds credit directly back to your original source payment method via Razorpay.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 font-mono text-xs sm:text-sm text-ink/85 leading-relaxed">
          {/* Section 1: Standard Catalog */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              1. Standard Catalog Products (Articulated Toys & Desk Objects)
            </h2>
            <p>
              We inspect every single print by hand before packing. However, because our products are shipped through national logistics networks, packages can occasionally suffer severe transit impacts.
            </p>
            <div className="bg-cream-light p-4 border border-ink/20 space-y-2 text-xs">
              <p className="font-bold text-ink uppercase">Eligibility for Return or Replacement:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-ink-muted">
                <li>The parcel arrived broken, crushed, or visibly damaged in courier transit.</li>
                <li>The item has severe structural delamination or non-functioning articulated joints.</li>
                <li>An incorrect model, color, or variant was accidentally packed.</li>
              </ul>
              <div className="p-3 bg-cream border-2 border-ink mt-2">
                <p className="font-bold text-ink uppercase text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-coral" />
                  <span>Mandatory Unboxing Video Requirement:</span>
                </p>
                <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">
                  To protect our business against fraudulent claims and courier tampering, all damage or defect claims <strong>MUST be accompanied by a single, continuous, uncut 360° unboxing video</strong>. The video must start by clearly showing the sealed outer cardboard box with the visible Shiprocket shipping label before opening, and capture the item being unpacked. Claims without a continuous unboxing video cannot be entertained.
                </p>
              </div>
              <p className="pt-1 text-ink">
                <strong>Reporting Deadline:</strong> Email <strong>{BUSINESS_PROFILE.contact.email}</strong> or WhatsApp us within <strong>48 hours of delivery</strong> with your Order Number and unboxing video link.
              </p>
            </div>
          </div>

          {/* Section 2: Non-Returnable Scenarios */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              2. Non-Returnable Conditions & Exclusions
            </h2>
            <p>Returns and refunds are NOT accepted under the following conditions:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-3 text-xs">
              <li>
                <strong>Inherent 3D Print Surface Characteristics:</strong> Faint horizontal layer lines (0.12mm–0.20mm), micro-textures, and minor z-seam lines are authentic characteristics of precision FDM additive manufacturing and are not defects.
              </li>
              <li>
                <strong>Buyer's Remorse:</strong> Change of mind, accidental orders, or selecting the wrong color or model variant after the order is processed.
              </li>
              <li>
                <strong>Misuse & Thermal Exposure:</strong> Leaving thermoplastic PLA+ objects inside hot parked cars or direct sunlight exceeding 55°C, dropping prints on hard concrete, or forceful joint hyperextension.
              </li>
              <li>
                <strong>Delayed Reporting:</strong> Inquiries reported after the 48-hour post-delivery window has expired.
              </li>
              <li>
                <strong>Absence of Unboxing Video:</strong> Claims lacking an uncut video recording of the package opening.
              </li>
            </ul>
          </div>

          {/* Section 3: Cancellation Policy */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              3. Order Cancellation Policy (Strict 2-Hour Window)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-cream-light p-4 border border-ink/20 space-y-1">
                <p className="font-bold text-ink uppercase">Within 2 Hours of Ordering:</p>
                <p className="text-ink-muted leading-relaxed">
                  You may cancel your order strictly within 2 hours of payment before printing schedules and material slicers are allocated. Email {BUSINESS_PROFILE.contact.email} with your order number. A 100% full refund is immediately credited via Razorpay.
                </p>
              </div>
              <div className="bg-cream-light p-4 border border-ink/20 space-y-1">
                <p className="font-bold text-ink uppercase">After 2 Hours or After Dispatch:</p>
                <p className="text-ink-muted leading-relaxed">
                  Once high-precision printing begins or an Air Waybill (AWB) is booked with Shiprocket, orders cannot be cancelled, recalled, or diverted in transit.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Refund Mode & Timeline */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              4. Refund Timeline & Processing Method
            </h2>
            <p>
              Upon approving a return or cancellation request:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-3 text-xs">
              <li>Our desk initiates the refund via the <strong>Razorpay payment gateway</strong> within 24 business hours.</li>
              <li>The funds are credited directly back to the original source account (UPI account, Bank Account, or Credit/Debit Card) used during checkout.</li>
              <li>Depending on your issuing bank, the credit typically reflects on your bank statement within <strong>5 to 7 business days</strong>.</li>
              <li>You will receive an automated Razorpay Refund ID notification as proof of reversal.</li>
            </ul>
          </div>

          {/* Section 5: Return Logistics Costs */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              5. Return Logistics & Courier Expenses
            </h2>
            <p>
              For any verified damaged shipment or manufacturing error on our part, THE TOYZ DEPT. covers all return shipping expenses or coordinates a reverse pickup via Shiprocket at our sole cost.
            </p>
          </div>

          {/* Support Strip */}
          <div className="card-brutal p-6 bg-ink text-cream space-y-3 font-mono text-xs">
            <h3 className="font-display font-bold text-sm uppercase text-lime">
              Need Help With an Existing Order?
            </h3>
            <p className="text-cream/70 text-[11px] leading-relaxed">
              Our support desk is ready to resolve any quality or delivery concerns promptly:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 text-[11px]">
              <a href={`mailto:${BUSINESS_PROFILE.contact.email}`} className="text-lime underline">
                {BUSINESS_PROFILE.contact.email}
              </a>
              <span className="hidden sm:inline text-cream/40">•</span>
              <a href={`tel:${BUSINESS_PROFILE.contact.phone.replace(/\s+/g, "")}`} className="text-lime underline">
                {BUSINESS_PROFILE.contact.phone}
              </a>
              <span className="hidden sm:inline text-cream/40">•</span>
              <Link to="/track-order" className="text-coral underline">
                Track Live Shipment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
