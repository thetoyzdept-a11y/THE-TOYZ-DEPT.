import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, AlertTriangle, Scale, FileText } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function TermsPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-coral text-xs">Statutory Agreement</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Commercial Terms</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-ink">
            Terms & Conditions of Sale<span className="text-lime">.</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase mt-2">
            Last Updated: November 2026 • Effective Immediately
          </p>
        </div>

        {/* Choking Hazard Banner */}
        <div className="p-4 bg-coral/15 border-2 border-coral flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
          <div className="font-mono text-xs text-ink">
            <strong className="font-display font-bold uppercase text-coral">
              Statutory Safety Warning & Choking Hazard Notice:
            </strong>
            <p className="mt-1 leading-relaxed">
              Many products sold on this website feature fine articulated segments, micro-joints, and small detachable parts.
              These items are intended strictly as tactile desk sculptures, collectibles, and novelty art for individuals aged 14 and older.
              They are <strong>NOT SUITABLE FOR CHILDREN UNDER 3 YEARS</strong> due to choking hazards. Do not allow pets or infants to chew on 3D-printed thermoplastic parts.
            </p>
          </div>
        </div>

        {/* 24 Sections */}
        <div className="space-y-8 font-mono text-xs sm:text-sm text-ink/85 leading-relaxed">
          {/* Section 1 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              1. Introduction & Acceptance of Terms
            </h2>
            <p>
              These Terms and Conditions of Sale ("Terms", "Agreement") constitute a legally binding electronic contract between you ("User", "Customer", "Buyer") and the business operating under the trade name <strong>THE TOYZ DEPT.</strong> ("Seller", "we", "us", "our"). By browsing, registering on, or purchasing any physical goods or custom 3D printing services via <strong>https://thetoyzdept.in</strong> (the "Website"), you expressly acknowledge and agree to be bound by these Terms, together with our Privacy Policy, Pricing Details, and Refund Policy. If you do not agree to these Terms, you must discontinue use of the Website immediately.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              2. Business Entity Information
            </h2>
            <p>
              In compliance with Rule 5(1) of the Consumer Protection (E-Commerce) Rules, 2020, the business entity operating the Website is disclosed as follows:
            </p>
            <div className="bg-cream-light p-4 border border-ink/20 space-y-1 text-xs">
              <p><strong>Legal Entity Name:</strong> {BUSINESS_PROFILE.legalEntityName}</p>
              <p><strong>Trade Name:</strong> {BUSINESS_PROFILE.brandName}</p>
              <p><strong>Business Constitution:</strong> {BUSINESS_PROFILE.constitution}</p>
              <p><strong>Authorized Proprietor:</strong> {BUSINESS_PROFILE.proprietorName}</p>
              <p><strong>Principal Place of Business:</strong> {BUSINESS_PROFILE.address.formatted}</p>
              <p><strong>Customer Support Email:</strong> {BUSINESS_PROFILE.contact.email}</p>
              <p><strong>Customer Support Telephone:</strong> {BUSINESS_PROFILE.contact.phone}</p>
              <p><strong>Website:</strong> {BUSINESS_PROFILE.websiteUrl}</p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              3. Eligibility to Use the Website
            </h2>
            <p>
              Use of the Website is available only to persons who can form legally binding contracts under the Indian Contract Act, 1872. Persons who are "incompetent to contract" within the meaning of the Indian Contract Act, 1872, including un-discharged insolvents and minors (below 18 years of age), are not eligible to register or make commercial transactions on the Website without parental or legal guardian supervision.
            </p>
          </div>

          {/* Section 4 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              4. Account Registration, Security & Credentials
            </h2>
            <p>
              Customers may purchase as guests or create a registered customer account. If you create an account, you are solely responsible for maintaining the confidentiality of your username, password, and session access. You agree to notify us immediately of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that provide fraudulent or inaccurate personal information.
            </p>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              5. Product Catalog, Accuracy & 3D Print Characteristics
            </h2>
            <p>
              Products listed on the Website are produced using additive manufacturing (Fused Deposition Modeling / FDM). Additive manufacturing constructs physical items layer-by-layer from molten engineering thermoplastics (such as PLA+ and PETG). Consequently:
            </p>
            <ul className="list-disc list-inside pl-3 space-y-1 text-xs">
              <li>Uniform horizontal layer lines and microscopic surface seams are inherent and natural characteristics of 3D printing and do not constitute manufacturing defects.</li>
              <li>Slight variations in color hue may occur between different master batches of raw filament.</li>
              <li>Dimensions are held within standard additive manufacturing tolerances of ±0.20mm.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              6. Pricing, Currency & Taxes
            </h2>
            <p>
              All prices displayed on the Website are denominated in <strong>Indian Rupees (INR ₹)</strong>. THE TOYZ DEPT. is an individual sole proprietorship currently exempt from GST registration under Section 22 of the Central Goods and Services Tax Act, 2017 (aggregate turnover below the statutory threshold limit). Therefore, no Goods and Services Tax (GST) is collected or added to the bill. All catalog prices are net and final.
            </p>
          </div>

          {/* Section 7 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              7. Order Placement, Acceptance & Contract Formation
            </h2>
            <p>
              Placing an order constitutes an offer to purchase. An order is formally accepted and a binding sales contract is formed only when we confirm dispatch of the item or initiate machine fabrication for custom orders. We reserve the right to cancel or refuse any order due to stock unavailability, pricing errors, or unserviceable delivery pincodes, in which case any payment made will be refunded in full within 5–7 business days.
            </p>
          </div>

          {/* Section 8 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              8. Payment Terms & Third-Party Payment Gateway
            </h2>
            <p>
              Payments on the Website are processed securely through <strong>Razorpay</strong>, an authorized payment aggregator compliant with PCI-DSS Level 1 standards. Customers may pay via UPI, Debit/Credit Cards, Net Banking, or supported Wallets. THE TOYZ DEPT. does NOT store, process, or have access to your sensitive card CVV, PIN, or net banking passwords. You agree that chargebacks or fraudulent disputes raised without first contacting our customer support shall be defended with complete transaction and courier proof.
            </p>
          </div>

          {/* Section 9 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              9. Shipping, Logistics & Delivery Terms
            </h2>
            <p>
              Deliveries are handled through reputable logistics aggregators (Shiprocket) and courier partners including Delhivery, BlueDart, and DTDC. Free shipping is provided on orders with cart subtotals of ₹999 and above; orders below ₹999 carry a flat ₹99 fee across India. Standard in-stock catalog products are dispatched within 24–48 business hours; transit times generally take 3–7 business days depending on customer pincode.
            </p>
          </div>

          {/* Section 10 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              10. Title & Risk of Loss
            </h2>
            <p>
              Title and risk of loss for all physical products purchased pass to you upon successful delivery of the consignment by the courier partner to the address specified in your order.
            </p>
          </div>

          {/* Section 11 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              11. Inspection & Acceptance Window
            </h2>
            <p>
              Customers are required to inspect parcels upon delivery. Any claim regarding physical damage incurred during transit, missing items, or manufacturing defects must be reported to our customer support desk within <strong>48 hours of delivery</strong> accompanied by clear photographic evidence and an unboxing video.
            </p>
          </div>

          {/* Section 12 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              12. Cancellation Policy
            </h2>
            <p>
              <strong>Standard Catalog Orders:</strong> May be cancelled freely prior to order dispatch by contacting our support desk. Once dispatched and assigned an Air Waybill (AWB), the order cannot be cancelled in transit.
              <br />
              <strong>Custom 3D Printing Orders:</strong> Custom customer-uploaded CAD prints are manufactured on-demand to unique customer specifications. Once digital slicing is approved and machine printing begins, custom orders cannot be cancelled or refunded.
            </p>
          </div>

          {/* Section 13 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              13. Replacement, Return & Refund Policy
            </h2>
            <p>
              If a product is verified to have arrived damaged or with functional layer separation, we will provide a complimentary replacement reprint shipped at our expense. If a reprint is not feasible, a full refund will be credited back to the customer's original payment method via Razorpay within 5–7 business days. Products cannot be returned for buyer's remorse or minor cosmetic layer seam appearances.
            </p>
          </div>

          {/* Section 14 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              14. Custom 3D Printing Service Terms
            </h2>
            <p>
              Customers uploading 3D CAD files (.STL, .STEP, .OBJ) agree that our custom printing service manufactures physical objects according to the geometry provided. We perform basic automated wall-thickness and manifold checks, but we do not guarantee the structural fitness, mechanical suitability, or engineering load-bearing capacity of customer-designed parts for critical or hazardous applications.
            </p>
          </div>

          {/* Section 15 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              15. Intellectual Property Rights & Customer Warranty on Uploaded Files
            </h2>
            <p>
              All trademarks, product photos, graphics, brand logos, and 3D designs displayed on the Website are the exclusive intellectual property of THE TOYZ DEPT. or its licensors.
              <br />
              When you upload a 3D model for custom fabrication, you expressly warrant and represent that you own all copyright, trademark, and patent rights in the model, or hold a valid commercial license. You agree to defend, indemnify, and hold harmless THE TOYZ DEPT. and its proprietor against any claims, losses, or legal costs arising from intellectual property infringement claims related to files you submitted.
            </p>
          </div>

          {/* Section 16 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              16. Prohibited 3D Printing Items & Content
            </h2>
            <p>
              We strictly prohibit and reject the submission or manufacturing of:
            </p>
            <ul className="list-disc list-inside pl-3 space-y-1 text-xs">
              <li>Firearms, firearm components, weapons, knives, ammunition, or explosive devices.</li>
              <li>Lock-picking tools, surveillance disguises, or illicit bypass equipment.</li>
              <li>Defamatory, obscene, hateful, or pornographic content.</li>
              <li>Unauthorized commercial counterfeits of protected intellectual property.</li>
            </ul>
          </div>

          {/* Section 17 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              17. Product Safety, Warnings & Disclaimer of Warranties
            </h2>
            <p>
              Except as expressly stated herein, all products are provided on an "as-is" and "as-available" basis without warranties of any kind, whether express or implied. 3D-printed thermoplastic objects are not certified food-contact containers unless explicitly marked, and should not be exposed to temperatures exceeding 55°C (130°F) to avoid thermal deformation.
            </p>
          </div>

          {/* Section 18 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              18. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable Indian law, in no event shall THE TOYZ DEPT., its proprietor, affiliates, or logistics partners be liable for any indirect, incidental, punitive, or consequential damages resulting from the use of products purchased on the Website. Our aggregate liability for any claim shall not exceed the actual monetary amount paid by the customer for the specific item in dispute.
            </p>
          </div>

          {/* Section 19 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              19. Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless THE TOYZ DEPT., its proprietor Abhishek H, and service partners from and against any claims, liabilities, damages, losses, and legal expenses arising out of your violation of these Terms, submission of unlawful 3D files, or misuse of products.
            </p>
          </div>

          {/* Section 20 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              20. User Conduct & Acceptable Website Use
            </h2>
            <p>
              You agree not to use the Website to engage in any unlawful activity, inject malicious code, attempt unauthorized access to server infrastructure, scrape data automatically, or interfere with payment gateway transactions.
            </p>
          </div>

          {/* Section 21 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              21. Third-Party Links & Services
            </h2>
            <p>
              The Website may contain links or integrations with third-party services (such as Razorpay and Shiprocket). We are not responsible for the privacy practices, uptime, or terms of third-party platforms.
            </p>
          </div>

          {/* Section 22 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              22. Modification of Terms
            </h2>
            <p>
              We reserve the right to revise or update these Terms at any time. Any changes will be posted on this page with an updated "Last Updated" timestamp. Your continued use of the Website following any modifications constitutes acceptance of the amended Terms.
            </p>
          </div>

          {/* Section 23 */}
          <div className="space-y-2">
            <h2 className="font-display font-bold text-lg uppercase text-ink">
              23. Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms and any dispute or claim arising out of or in connection with them or their subject matter shall be governed by and construed in accordance with the laws of the Republic of India. In the event of any legal dispute that cannot be resolved amicably, the courts in <strong>Gadag, Karnataka, India</strong> shall have exclusive jurisdiction.
            </p>
          </div>

          {/* Section 24 */}
          <div className="space-y-2 pt-2 border-t-2 border-ink">
            <h2 className="font-display font-bold text-lg uppercase text-ink flex items-center gap-2">
              <Scale className="w-5 h-5 text-coral" />
              24. Grievance Redressal Mechanism & Officer Contact
            </h2>
            <p>
              In accordance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020 and the Information Technology Act, 2000, the designated Grievance Officer is:
            </p>
            <div className="bg-cream-light p-4 border border-ink/20 space-y-1 text-xs">
              <p><strong>Grievance Officer:</strong> {BUSINESS_PROFILE.grievanceOfficer.name}</p>
              <p><strong>Designation:</strong> {BUSINESS_PROFILE.grievanceOfficer.designation}</p>
              <p><strong>Registered Address:</strong> {BUSINESS_PROFILE.grievanceOfficer.address}</p>
              <p><strong>Email:</strong> {BUSINESS_PROFILE.grievanceOfficer.email}</p>
              <p><strong>Telephone:</strong> {BUSINESS_PROFILE.grievanceOfficer.phone}</p>
              <p><strong>Acknowledgement SLA:</strong> {BUSINESS_PROFILE.grievanceOfficer.acknowledgementSLA}</p>
              <p><strong>Redressal SLA:</strong> {BUSINESS_PROFILE.grievanceOfficer.resolutionSLA}</p>
            </div>
            <p className="pt-2 text-xs">
              Consumers may submit grievances online directly via our dedicated{" "}
              <Link to="/grievance-redressal" className="text-coral underline font-bold">
                Grievance Redressal Portal
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
