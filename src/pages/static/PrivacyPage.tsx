import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, Eye, Database, Server, RefreshCw } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-lime text-xs">Data Privacy & Security</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">IT Act 2000</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink">
            Privacy Policy<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase mt-2">
            Last Updated: November 2026 • Effective Date: November 2026
          </p>
        </div>

        {/* Security Highlights Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Lock className="w-4 h-4 text-coral" />
              <span>PCI-DSS Payments</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Card data and UPI pins are processed directly by Razorpay; zero payment credentials stored on our servers.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Database className="w-4 h-4 text-lime-darker" />
              <span>CAD File Privacy</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              Customer-uploaded 3D geometry is stored in encrypted storage and never resold or made public.
            </p>
          </div>

          <div className="card-brutal p-4 bg-cream-light font-mono text-xs space-y-1">
            <div className="flex items-center gap-2 text-ink font-bold">
              <Server className="w-4 h-4 text-ink" />
              <span>TLS 1.3 Encryption</span>
            </div>
            <p className="text-[11px] text-ink-muted">
              All web traffic is protected with Cloudflare Universal HTTPS edge encryption.
            </p>
          </div>
        </div>

        {/* Policy Body */}
        <div className="space-y-8 font-mono text-xs sm:text-sm text-ink/85 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              1. Overview & Commitment
            </h2>
            <p>
              This Privacy Policy describes how <strong>THE TOYZ DEPT.</strong> (operated by <strong>{BUSINESS_PROFILE.legalEntityName}</strong>, having its principal place of business at {BUSINESS_PROFILE.address.formatted}) collects, uses, processes, and safeguards personal data obtained from visitors and buyers using <strong>https://thetoyzdept.in</strong>. We comply with the Information Technology Act, 2000 and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules").
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              2. Information We Collect
            </h2>
            <p>We collect only the personal information required to process and ship your orders:</p>
            <ul className="list-disc list-inside pl-3 space-y-1.5 text-xs">
              <li>
                <strong>Contact Details:</strong> Full name, shipping and billing address, email address, telephone number, and postal pincode.
              </li>
              <li>
                <strong>Account Credentials:</strong> If you create an account, we store your username and a cryptographically hashed representation of your password (using PBKDF2 Web Crypto hashing). We never store plaintext passwords.
              </li>
              <li>
                <strong>Customer 3D Geometry:</strong> If you upload 3D models (.STL, .STEP, .OBJ) for custom printing, we store the file strictly to calculate slicer toolpaths and execute machine fabrication.
              </li>
              <li>
                <strong>Technical Information:</strong> IP address, device browser type, and diagnostic access timestamps collected automatically via Cloudflare serverless edge infrastructure for DDoS prevention.
              </li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              3. Payment Data Handling & Security (Razorpay)
            </h2>
            <p>
              When making a purchase on the Website, you are directed to the secure payment modal powered by our payment gateway partner, <strong>Razorpay Software Private Limited</strong>.
            </p>
            <div className="p-4 bg-cream-light border border-ink/20 text-xs space-y-2">
              <p>
                <strong>Zero Card Storage:</strong> THE TOYZ DEPT. does NOT collect, capture, or store any sensitive payment card details, CVV codes, net banking passwords, or UPI PINs. All payment processing occurs on Razorpay’s Level 1 PCI-DSS compliant infrastructure.
              </p>
              <p>
                We receive only a cryptographic payment verification token, order ID, payment ID, and transaction success status required to generate your order receipt and initiate shipment.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              4. How We Use Your Information
            </h2>
            <p>Your data is used strictly for legitimate commercial and operational purposes:</p>
            <ul className="list-disc list-inside pl-3 space-y-1 text-xs">
              <li>To process, manufacture, pack, and ship your physical orders.</li>
              <li>To transmit order confirmations, dispatch notices, and courier Air Waybill (AWB) tracking numbers.</li>
              <li>To communicate custom 3D printing quotations and answer engineering inquiries.</li>
              <li>To fulfill statutory accounting, taxation, and consumer dispute resolution obligations.</li>
              <li>To prevent fraudulent transactions and maintain platform security.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              5. Third-Party Service Providers
            </h2>
            <p>
              We do not sell, rent, or trade your personal data to advertisers. We share customer information only with verified third-party infrastructure providers essential to our operations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="bg-cream-light p-3 border border-ink/20">
                <p className="font-bold text-ink">Shiprocket Logistics Aggregator</p>
                <p className="text-[11px] text-ink-muted">
                  Recipient name, shipping address, contact phone, and pincode are transmitted to generate courier waybills and coordinate last-mile delivery via Delhivery, BlueDart, or DTDC.
                </p>
              </div>
              <div className="bg-cream-light p-3 border border-ink/20">
                <p className="font-bold text-ink">Cloudflare Edge & D1 Infrastructure</p>
                <p className="text-[11px] text-ink-muted">
                  Encrypted serverless application hosting, SSL/TLS termination, and database storage under enterprise security compliance.
                </p>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              6. Cookies & Local Storage
            </h2>
            <p>
              The Website uses lightweight session cookies and browser LocalStorage strictly for functional purposes: keeping your shopping cart active, remembering your login state, and securing form submissions against cross-site request forgery. We do not use intrusive third-party cross-site advertising trackers.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              7. Customer Rights & Data Retention
            </h2>
            <p>
              Under applicable Indian data protection laws, you have the right to review, update, or request the deletion of your personal account information. You may exercise these rights at any time by contacting our desk at <strong>{BUSINESS_PROFILE.contact.email}</strong>. We retain customer transaction records for the statutory retention period required by Indian tax and accounting authorities.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2 pt-2 border-t-2 border-ink">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              8. Grievance Officer & Contact Information
            </h2>
            <p>
              For any privacy-related inquiries, data correction requests, or grievances under the Information Technology Act, 2000, please contact our designated Grievance Officer:
            </p>
            <div className="bg-cream-light p-4 border border-ink/20 space-y-1 text-xs">
              <p><strong>Name:</strong> {BUSINESS_PROFILE.grievanceOfficer.name}</p>
              <p><strong>Designation:</strong> {BUSINESS_PROFILE.grievanceOfficer.designation}</p>
              <p><strong>Principal Address:</strong> {BUSINESS_PROFILE.grievanceOfficer.address}</p>
              <p><strong>Email:</strong> {BUSINESS_PROFILE.grievanceOfficer.email}</p>
              <p><strong>Telephone:</strong> {BUSINESS_PROFILE.grievanceOfficer.phone}</p>
              <p><strong>Response SLA:</strong> {BUSINESS_PROFILE.grievanceOfficer.acknowledgementSLA}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
