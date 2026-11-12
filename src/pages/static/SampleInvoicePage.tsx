import React from "react";
import { Link } from "react-router-dom";
import { Printer, CheckCircle, ShieldCheck, Download, ArrowLeft } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function SampleInvoicePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-16 print:bg-white print:py-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation / Action Bar (Hidden on print) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-ink pb-4 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase text-ink hover:text-coral transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Storefront
          </Link>
          <div className="flex items-center gap-3">
            <span className="badge-lime text-xs">Specimen for Razorpay Verification</span>
            <button
              onClick={handlePrint}
              className="btn-primary text-xs flex items-center gap-1.5 py-1.5 px-3"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Specimen Invoice Document Container */}
        <div className="card-brutal p-8 sm:p-12 bg-white text-ink border-2 border-ink print:border-none print:p-0 print:shadow-none space-y-8 font-mono">
          {/* Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-ink pb-8">
            <div className="space-y-2">
              <div className="inline-block bg-ink text-white px-3 py-1 font-display font-black text-xs uppercase tracking-wider mb-1">
                Commercial Specimen Invoice
              </div>
              <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-ink">
                THE TOYZ DEPT<span className="text-coral">.</span>
              </h1>
              <p className="text-xs text-ink/70">
                Operated by: <strong>{BUSINESS_PROFILE.legalEntityName}</strong> (Sole Proprietor)
              </p>
              <p className="text-xs text-ink/70 max-w-sm">
                {BUSINESS_PROFILE.address.formatted}
              </p>
              <p className="text-xs text-ink/70">
                Email: {BUSINESS_PROFILE.contact.email} • Tel: {BUSINESS_PROFILE.contact.phone}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1.5 text-xs bg-cream-light p-4 sm:p-0 sm:bg-transparent border sm:border-0 border-ink/20">
              <p>
                <span className="text-ink-muted uppercase">Invoice Number:</span>{" "}
                <strong className="text-ink">SPECIMEN-2026-0001</strong>
              </p>
              <p>
                <span className="text-ink-muted uppercase">Order Reference:</span>{" "}
                <strong className="text-ink">ORD-2026-7841</strong>
              </p>
              <p>
                <span className="text-ink-muted uppercase">Invoice Date:</span>{" "}
                <strong className="text-ink">November 13, 2026</strong>
              </p>
              <p>
                <span className="text-ink-muted uppercase">Place of Supply:</span>{" "}
                <strong className="text-ink">Karnataka, India</strong>
              </p>
              <p>
                <span className="text-ink-muted uppercase">Payment Mode:</span>{" "}
                <strong className="text-ink">Razorpay Standard Web Checkout</strong>
              </p>
            </div>
          </div>

          {/* Bill To & Ship To Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs border-b-2 border-ink pb-6">
            <div className="space-y-1">
              <span className="font-display font-bold uppercase text-ink-muted text-[10px] tracking-wider">
                Billed To (Customer):
              </span>
              <p className="font-bold text-ink text-sm">Sample Customer / Buyer</p>
              <p className="text-ink/80">Flat 402, Lotus Enclave, 12th Main Road</p>
              <p className="text-ink/80">Indiranagar, Bengaluru, Karnataka 560038</p>
              <p className="text-ink/80">Phone: +91 98765 43210</p>
              <p className="text-ink/80">Email: customer.sample@example.com</p>
            </div>

            <div className="space-y-1 sm:text-right">
              <span className="font-display font-bold uppercase text-ink-muted text-[10px] tracking-wider">
                Logistics & Carrier Details:
              </span>
              <p className="font-bold text-ink">Shiprocket / Delhivery Air Express</p>
              <p className="text-ink/80">Air Waybill (AWB): DEL9019465897IN</p>
              <p className="text-ink/80">Dispatch Origin: Gadag, KA 582101</p>
              <p className="text-ink/80">Weight: 0.35 kg • 1 Box</p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-ink font-display font-bold uppercase tracking-wider text-ink text-[11px]">
                  <th className="py-2.5">#</th>
                  <th className="py-2.5">Item Description & Specifications</th>
                  <th className="py-2.5 text-center">HSN/SAC</th>
                  <th className="py-2.5 text-center">Qty</th>
                  <th className="py-2.5 text-right">Unit Price</th>
                  <th className="py-2.5 text-right">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/20">
                <tr>
                  <td className="py-3">1</td>
                  <td className="py-3">
                    <p className="font-bold text-ink">Articulated Cyber Dragon (Large)</p>
                    <p className="text-[10px] text-ink-muted">Variant: Matte Black / Length: 220mm / Material: Virgin PLA+</p>
                  </td>
                  <td className="py-3 text-center text-ink-muted">39269099</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">₹899.00</td>
                  <td className="py-3 text-right font-bold">₹899.00</td>
                </tr>
                <tr>
                  <td className="py-3">2</td>
                  <td className="py-3">
                    <p className="font-bold text-ink">Tactile Mini Fidget Gearbox</p>
                    <p className="text-[10px] text-ink-muted">Variant: Neon Lime / Planetary 3-Gear / Material: Tough PLA+</p>
                  </td>
                  <td className="py-3 text-center text-ink-muted">39269099</td>
                  <td className="py-3 text-center">1</td>
                  <td className="py-3 text-right">₹199.00</td>
                  <td className="py-3 text-right font-bold">₹199.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="border-t-2 border-ink pt-4 flex flex-col sm:flex-row justify-between items-start gap-6">
            {/* Tax Exemption Declaration */}
            <div className="sm:max-w-md bg-cream-light p-4 border border-ink/20 text-[11px] text-ink/80 space-y-1">
              <p className="font-bold text-ink uppercase">Statutory Tax Declaration:</p>
              <p>
                {BUSINESS_PROFILE.taxation.statusNotice}
              </p>
              <p className="text-[10px] text-ink-muted pt-1">
                This document is a commercial sales invoice for goods supplied. As the supplier is unregistered under GST laws, no tax is charged and no input tax credit is admissible.
              </p>
            </div>

            {/* Calculations Table */}
            <div className="w-full sm:w-72 space-y-2 text-xs">
              <div className="flex justify-between text-ink/80">
                <span>Items Subtotal:</span>
                <span>₹1,098.00</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span>Shipping & Handling (Orders ₹999+):</span>
                <span className="font-bold text-lime-darker">FREE (₹0.00)</span>
              </div>
              <div className="flex justify-between text-ink/80">
                <span>Applicable GST:</span>
                <span>₹0.00 (Exempt)</span>
              </div>
              <div className="border-t-2 border-ink pt-2 flex justify-between font-display font-black text-base text-ink">
                <span>Total Amount Paid:</span>
                <span>₹1,098.00 INR</span>
              </div>
            </div>
          </div>

          {/* Payment Gateway Verification Box */}
          <div className="p-4 bg-lime/20 border-2 border-lime-darker flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-ink flex-shrink-0" />
              <div>
                <p className="font-bold text-ink">Payment Verified & Settled via Razorpay</p>
                <p className="text-[10px] text-ink-muted">
                  Razorpay Order ID: <span className="font-mono font-bold">order_Nw89aBsample01</span> • Payment ID: <span className="font-mono font-bold">pay_Nw89aBsample02</span>
                </p>
              </div>
            </div>
            <div className="font-display font-bold uppercase text-[11px] text-ink bg-white px-2.5 py-1 border border-ink">
              Status: CAPTURED
            </div>
          </div>

          {/* Signatory & Legal Terms Footer */}
          <div className="border-t-2 border-ink pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-[11px] text-ink-muted">
            <div className="space-y-1">
              <p>Terms: Governed by the laws of India. Subject to Gadag jurisdiction.</p>
              <p>For return / warranty inquiries, email: {BUSINESS_PROFILE.contact.email}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="font-bold text-ink">For THE TOYZ DEPT.</p>
              <p className="text-[10px]">Authorized Signatory: {BUSINESS_PROFILE.proprietorName}</p>
              <p className="text-[10px] text-ink-muted">(Digitally Generated Invoice)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
