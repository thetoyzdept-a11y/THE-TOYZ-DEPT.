import React from "react";
import { Link } from "react-router-dom";
import { Truck, MapPin, Clock, ShieldCheck, Box, Navigation, AlertCircle } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function ShippingPolicyPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-lime text-xs">Logistics & Fulfilment</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Shiprocket Network</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink">
            Shipping & Delivery Policy<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase mt-2">
            Pan-India Delivery • Free Shipping on Orders ₹999+ • Live Courier Tracking
          </p>
        </div>

        {/* 4 Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Truck className="w-4 h-4 text-coral" />
              <span>Free Over ₹999</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Standard orders ₹999 and above qualify for complimentary express delivery across India.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Clock className="w-4 h-4 text-lime-darker" />
              <span>24–48h Dispatch</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              In-stock catalog pieces are deburred, quality-inspected, and handed to couriers in 1–2 business days.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Navigation className="w-4 h-4 text-ink" />
              <span>Live AWB Tracking</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Real-time Air Waybill tracking details transmitted via SMS and email immediately upon carrier pickup.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Box className="w-4 h-4 text-coral" />
              <span>Protective Pack</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Multi-layer bubble wrap and rigid corrugated boxing designed for fragile articulated 3D geometries.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 font-mono text-xs sm:text-sm text-ink/85 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              1. Geographic Shipping Coverage
            </h2>
            <p>
              THE TOYZ DEPT. delivers to all major postal pincodes across India serviced by our tier-1 logistics partners. We do not currently ship physical packages outside the Republic of India.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              2. Origin & Courier Partners
            </h2>
            <p>
              All shipments originate directly from our central 3D-printing facility in <strong>Gadag, Karnataka, PIN: 582101</strong>. We partner with India’s leading domestic couriers integrated through Shiprocket:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-center font-display font-bold text-xs uppercase text-ink">
              <div className="bg-cream-light p-3 border border-ink/20">Delhivery Express</div>
              <div className="bg-cream-light p-3 border border-ink/20">BlueDart Air</div>
              <div className="bg-cream-light p-3 border border-ink/20">DTDC Express</div>
              <div className="bg-cream-light p-3 border border-ink/20">Xpressbees</div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              3. Processing & Delivery Timelines
            </h2>
            <div className="bg-cream-light p-4 border border-ink/20 space-y-3 text-xs">
              <div>
                <p className="font-bold text-ink uppercase">Processing / Preparation Time:</p>
                <ul className="list-disc list-inside text-ink-muted pl-2 space-y-1">
                  <li><strong>Standard Catalog Objects:</strong> 24 to 48 business hours for inspection, packaging, and courier handoff.</li>
                  <li><strong>Custom 3D Printing Orders:</strong> 3 to 5 business days depending on CAD slicing complexity and print runtime.</li>
                </ul>
              </div>
              <div className="border-t border-ink/10 pt-3">
                <p className="font-bold text-ink uppercase">Estimated Transit Times (Post-Handoff):</p>
                <ul className="list-disc list-inside text-ink-muted pl-2 space-y-1">
                  <li><strong>Metro Cities (Bengaluru, Mumbai, Delhi, Hyderabad, Chennai):</strong> 3 to 5 business days.</li>
                  <li><strong>Tier 2 Cities & Rest of India:</strong> 4 to 7 business days.</li>
                  <li><strong>Remote Locations & Special Zones (J&K, North-East):</strong> 7 to 10 business days.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              4. Shipping Charges & Rate Structure
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-lime/20 border-2 border-lime-darker space-y-1">
                <p className="font-bold text-ink uppercase">Orders ₹999 & Above:</p>
                <p className="text-xl font-display font-black text-ink">FREE EXPRESS DELIVERY</p>
                <p className="text-[11px] text-ink-muted">Automatically calculated and applied at checkout.</p>
              </div>
              <div className="p-4 bg-cream-light border-2 border-ink space-y-1">
                <p className="font-bold text-ink uppercase">Orders Below ₹999:</p>
                <p className="text-xl font-display font-black text-ink">FLAT ₹99 ANYWHERE IN INDIA</p>
                <p className="text-[11px] text-ink-muted">Covers insured courier transit and protective packaging.</p>
              </div>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              5. Order Tracking & Communication
            </h2>
            <p>
              The moment your package is scanned into the courier hub, an Air Waybill (AWB) number and direct tracking URL are generated and dispatched to your registered email and mobile number. You can track your shipment anytime on our dedicated{" "}
              <Link to="/track-order" className="text-coral underline font-bold">
                Track Order
              </Link>{" "}
              page.
            </p>
          </div>

          {/* Section 6 */}
          <div className="space-y-3">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              6. Non-Delivery & Failed Delivery Protocol
            </h2>
            <p>
              Our courier partners attempt delivery up to three (3) consecutive times. If you are unavailable or the delivery address is unreachable, the courier will hold the package at the local delivery branch. If unresolved, the package is marked Return To Origin (RTO). If an order returns due to an incorrect address provided by the customer, re-dispatch charges will apply.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
