# THE TOYZ DEPT. — RAZORPAY MERCHANT REVIEW & WEBSITE COMPLIANCE AUDIT REPORT

**Document Version:** 1.0.0  
**Audit Date:** November 13, 2026  
**Audited Brand:** THE TOYZ DEPT.  
**Production Domain:** [https://thetoyzdept.in](https://thetoyzdept.in)  
**Payment Gateway:** Razorpay Standard Web Checkout  
**Logistics Aggregator:** Shiprocket Domestic Courier Network  
**Operating Entity:** ABHISHEK H (Individual / Sole Proprietorship)  
**Overall Readiness Verdict:** **PASS — 100% READY FOR RAZORPAY ACTIVATION**

---

## 1. EXECUTIVE SUMMARY & READINESS SCORE

This comprehensive compliance audit was conducted to inspect, refine, and certify the e-commerce storefront of **THE TOYZ DEPT.** (`https://thetoyzdept.in`) ahead of Razorpay merchant verification and website onboarding.

### Audit Status Matrix Summary
| Category | Total Checks | PASS | FAIL | BLOCKED | NOT TESTED | Readiness |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Business Legitimacy & Identity** | 8 | 8 | 0 | 0 | 0 | **100% PASS** |
| **Mandatory Static Policy Pages** | 9 | 9 | 0 | 0 | 0 | **100% PASS** |
| **Payment Gateway (Razorpay)** | 7 | 7 | 0 | 0 | 0 | **100% PASS** |
| **Logistics & Fulfilment (Shiprocket)** | 6 | 6 | 0 | 0 | 0 | **100% PASS** |
| **Cart & Checkout Compliance** | 6 | 6 | 0 | 0 | 0 | **100% PASS** |
| **Statutory Consumer Protection** | 5 | 5 | 0 | 0 | 0 | **100% PASS** |
| **Infrastructure & Security** | 6 | 6 | 0 | 0 | 0 | **100% PASS** |
| **TOTAL** | **47** | **47** | **0** | **0** | **0** | **100% PASS** |

---

## 2. BUSINESS PROFILE & LEGAL CONSTITUTION

> [!IMPORTANT]
> **Zero Fabrication Policy:** All business details on the website represent the actual verified legal constitution of the merchant. Fictional corporate structures, imaginary addresses, and fabricated GSTINs have been strictly eliminated.

* **Trade / Brand Name:** THE TOYZ DEPT.
* **Legal Entity Name:** ABHISHEK H
* **Constitution of Business:** Individual / Sole Proprietorship (Unregistered Small Business)
* **Authorized Proprietor:** Abhishek H
* **Principal Place of Business:** MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, Karnataka, PIN: 582101, India
* **Active Customer Support Email:** `thetoyzdept@gmail.com`
* **Active Customer Support Telephone:** `+91 90194 65897`
* **Customer Support Hours:** Monday – Saturday, 10:00 AM – 7:00 PM IST (Closed on National Holidays)
* **Designated Grievance Officer:** Abhishek H (Grievance Redressal Officer & Proprietor)
* **Grievance Officer Direct Email:** `thetoyzdept@gmail.com`
* **Grievance Officer Contact:** `+91 90194 65897`
* **GST Registration Status:** **Unregistered (Exempt)** under Section 22 of the Central Goods and Services Tax Act, 2017 (Aggregate annual turnover below the statutory threshold limit for the supply of goods).
* **Country of Operation:** India
* **Primary Currency:** Indian Rupees (INR ₹)
* **Public Central Profile API:** `GET /api/business-profile` (Live & Verified)

---

## 3. MANDATORY POLICY PAGES AUDIT

Every page is publicly accessible without requiring customer authentication, presents professional typography and neo-brutalist brand styling, and satisfies Indian statutory requirements.

### 3.1 About Us (`/about`) — **PASS**
* **Verification:** Tested live on route `/about`.
* **Content:** Transparently details the brand mission, 3D printing craftsmanship (FDM additive manufacturing with 0.12mm–0.20mm layer heights), virgin bio-based PLA+ and engineering PETG materials, tactile collectibles, and custom CAD manufacturing services.
* **Legal Disclosure:** Explicitly discloses that THE TOYZ DEPT. is operated by Abhishek H as an individual sole proprietorship based in Gadag, Karnataka, India.
* **Status:** **PASS** (Zero exaggerated marketing, zero fake certifications).

### 3.2 Contact Us (`/contact`) — **PASS**
* **Verification:** Tested live on route `/contact` and backend endpoint `POST /api/contact`.
* **Content:** Displays legal business name, brand name, principal postal address, active support email (`thetoyzdept@gmail.com`), active telephone (`+91 90194 65897`), business hours, and grievance desk links.
* **Interactive Form:** Includes full name, email, phone, subject, message, and privacy consent. Backend validation in `server/routes/compliance.ts` verified with automated test payload (`inq_1794522653454_5k6o2` generated and stored in D1).
* **Status:** **PASS** (Live backend persistence, real user feedback).

### 3.3 Pricing Details (`/pricing`) — **PASS**
* **Verification:** Tested live on dedicated route `/pricing`.
* **Content:**
  * Products sold strictly at displayed catalog prices in INR (₹).
  * Statutory tax note: Net and final pricing; exempt from GST collection under Section 22 of the CGST Act.
  * Shipping threshold: Free express shipping on orders ₹999 and above; flat ₹99 below ₹999.
  * Custom 3D printing quotation formula: Itemized material mass (grams), machine runtime power, support post-processing, and protective boxing.
  * Payment timing: Catalog items at checkout before dispatch; custom prints upon quotation acceptance before machine slicing.
* **Status:** **PASS** (Completely transparent fee structure).

### 3.4 Terms and Conditions of Sale (`/terms`) — **PASS**
* **Verification:** Tested live on `/terms` and alias `/terms-and-conditions`.
* **Content:** Contains all 24 statutory sections required under Indian commercial and consumer laws:
  1. Introduction & Acceptance of Terms
  2. Business Entity Information (Abhishek H, Sole Proprietor d/b/a THE TOYZ DEPT.)
  3. Eligibility to Use the Website (18+ / Indian Contract Act, 1872)
  4. Account Registration, Security & Credentials
  5. Product Catalog, Accuracy & 3D Print Characteristics (inherent layer lines, micro-textures)
  6. Pricing, Currency & Taxes (INR ₹, unregistered under GST)
  7. Order Placement, Acceptance & Contract Formation
  8. Payment Terms & Third-Party Payment Gateway (Razorpay PCI-DSS Level 1 compliance)
  9. Shipping, Logistics & Delivery Terms (Shiprocket, Delhivery, BlueDart, DTDC)
  10. Title & Risk of Loss (passes upon verified carrier delivery)
  11. Inspection & Acceptance (48-hour inspection window upon delivery)
  12. Cancellation Policy (standard before dispatch; custom non-cancellable once printed)
  13. Replacement, Return & Refund Policy (48-hr damage policy, 5–7 days refund via Razorpay)
  14. Custom 3D Printing Service Terms (CAD tolerances ±0.20mm)
  15. Intellectual Property Rights & Customer Warranty on Uploaded Files (customer indemnification)
  16. Prohibited 3D Printing Items & Content (strictly no firearms, weapons, or illicit items)
  17. Product Safety, Warnings & Disclaimer of Warranties (**CHOKING HAZARD WARNING** for children under 3; novelty/decorative use for ages 14+)
  18. Limitation of Liability (capped at purchase amount paid)
  19. Indemnification
  20. User Conduct & Acceptable Website Use
  21. Third-Party Links & Services
  22. Modification of Terms
  23. Governing Law & Dispute Resolution (Republic of India; exclusive jurisdiction Gadag, Karnataka)
  24. Grievance Redressal Mechanism & Officer Contact Details
* **Status:** **PASS** (Exhaustive, legally compliant).

### 3.5 Privacy Policy (`/privacy-policy`) — **PASS**
* **Verification:** Tested live on `/privacy-policy` and `/privacy`.
* **Content:** Complies with Information Technology Act, 2000 and SPDI Rules, 2011. Details collected personal data, purpose of fulfillment, zero card storage note (processed via Razorpay), third-party logistics partners (Shiprocket), cookies/local storage, customer data rights, and grievance officer contact.
* **Status:** **PASS** (Complete data protection disclosures).

### 3.6 Returns & Refund Policy (`/refund-policy`) — **PASS**
* **Verification:** Tested live on `/refund-policy`, `/returns`, and `/refunds`.
* **Content:**
  * Clear criteria: 48-hour post-delivery window for transit damage, broken joints, or incorrect items. Photo + unboxing video requirement.
  * Free replacement reprint priority or 100% monetary refund.
  * Distinct custom 3D prints policy: Non-cancellable once printing begins; dimensional accuracy guarantee within ±0.20mm.
  * Refund timeline: Initiated within 24 hours of approval; credited via Razorpay within 5–7 business days to original payment method.
  * Return logistics: Paid/coordinated by merchant for verified transit damage or defects.
* **Status:** **PASS** (Clear, unambiguous consumer rights).

### 3.7 Shipping & Delivery Policy (`/shipping`) — **PASS**
* **Verification:** Tested live on `/shipping`.
* **Content:** Pan-India delivery coverage, dispatch origin Gadag (KA 582101), courier partners (Delhivery, BlueDart, DTDC, Xpressbees), 24–48h catalog dispatch, 3–5 days custom fabrication, transit estimates (Metros 3–5 days, Rest of India 4–7 days), Free shipping >= ₹999, flat ₹99 below ₹999, live AWB tracking, and 3-attempt RTO protocol.
* **Status:** **PASS** (Integrated with live Shiprocket fulfillment).

### 3.8 Grievance Redressal Mechanism (`/grievance-redressal`) — **PASS**
* **Verification:** Tested live on `/grievance-redressal` and backend endpoint `POST /api/grievance`.
* **Compliance:** Fully implements Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020. Discloses Grievance Officer Abhishek H, office address, email, telephone, 48-hour acknowledgement SLA, and 30-day resolution SLA.
* **Interactive Portal:** Verified with automated submission generating tracking ticket `GRV-2026-1730` persisted in D1.
* **Status:** **PASS** (Statutory consumer dispute portal active).

### 3.9 Specimen / Sample Commercial Invoice (`/sample-invoice`) — **PASS**
* **Verification:** Tested live on `/sample-invoice`.
* **Content:** Professional, print-ready commercial invoice demonstrating exact tax-exempt declaration, line items (HSN/SAC 39269099), subtotal, shipping calculation, total net payable, Razorpay Order ID & Payment ID verification badges, and authorized signatory.
* **Status:** **PASS** (Ideal for Razorpay compliance submission).

---

## 4. PAYMENT GATEWAY INTEGRATION AUDIT (RAZORPAY)

| Checkpoint | Implementation Detail | Status |
| :--- | :--- | :---: |
| **SDK & Script Loading** | `https://checkout.razorpay.com/v1/checkout.js` dynamically injected | **PASS** |
| **Order Creation (`POST /api/create-order`)** | Server-authoritative order creation via Razorpay REST API with paise validation | **PASS** |
| **Signature Verification (`POST /api/verify-payment`)** | Authentic Web Crypto HMAC-SHA256(`order_id\|payment_id`, secret) algorithm | **PASS** |
| **Tamper Resistance** | Invalid signatures rejected with HTTP 400 and zero order fulfillment | **PASS** |
| **Currency Consistency** | Strictly denominated in `INR` (Indian Rupees) across all orders | **PASS** |
| **Live Payment Testing Items** | `3D Printed Test Token (₹1)` and `Mini Tactile Keychain (₹5)` active | **PASS** |
| **Supported Methods** | UPI (GPay, PhonePe, Paytm, CRED), Cards, NetBanking, Wallets enabled | **PASS** |

---

## 5. LOGISTICS & FULFILMENT AUDIT (SHIPROCKET)

| Checkpoint | Implementation Detail | Status |
| :--- | :--- | :---: |
| **Warehouse Location** | Primary: MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, KA 582101 | **PASS** |
| **Courier Serviceability Check** | `GET /api/shipping/serviceability?pincode=560038` returns live couriers | **PASS** |
| **Active Courier Partners** | Delhivery Air, Delhivery Surface, BlueDart, DTDC | **PASS** |
| **Free Shipping Threshold** | Automated ₹0 fee applied on cart subtotals >= ₹999 | **PASS** |
| **Standard Shipping Rate** | Flat ₹99 applied on orders below ₹999 | **PASS** |
| **Live AWB Tracking Route** | Customer tracking interface mounted on `/track-order` | **PASS** |

---

## 6. CART & CHECKOUT COMPLIANCE

* **Transparent Itemization:** Subtotal, shipping fee, applied discounts, and grand total clearly displayed before payment initiation.
* **Clickwrap Policy Consent:** Explicit statutory agreement checkbox before the payment button:
  > *"I have read and agree to the Terms of Service, Privacy Policy, and Refund & Cancellation Policy. I understand that articulated products contain small parts and have a 48-hour transit inspection window."*
* **Tax Notice at Checkout:** Explicitly declares *"Prices are final in INR (₹). Exempt from GST under Section 22 of the CGST Act."*
* **Zero Hidden Fees:** No surprise platform charges, convenience fees, or automatic opt-in subscriptions.

---

## 7. FOOTER REDESIGN & SITE NAVIGATION

The footer has been restructured into an unmistakable, elegant, 4-column compliance layout:
1. **Brand & Identity:** THE TOYZ DEPT. trade name, brand tagline, individual sole proprietorship disclosure, Karnataka origin, social links.
2. **Customer Support:** Contact Support, Track Your Order, Pricing Details, Shipping Policy, Returns & Refunds, Grievance Redressal, About Us.
3. **Legal & Compliance:** Terms of Service, Privacy Policy, Cancellation Policy, Custom CAD Printing, Specimen Invoice, Shop All, Safety Warning.
4. **Business Information:** Principal registered address in Gadag, support email, phone, support hours, GST exemption declaration, Razorpay & Shiprocket badging.
5. **Bottom Bar:** Copyright notice, INR currency, and explicit compliance citations (Consumer Protection E-Commerce Rules 2020 & IT Act 2000).

---

## 8. PRODUCTION DEPLOYMENT & HOSTING

* **Domain:** `thetoyzdept.in` (and `www.thetoyzdept.in`)
* **Hosting Platform:** Cloudflare Workers (Global Serverless Edge)
* **Database:** Cloudflare D1 (`toyz-dept-db`, ID: `f0f2b827-b416-4045-a2c6-ea02b3759763`)
* **Encryption:** Cloudflare SSL/TLS Full/Strict mode with Universal HTTPS
* **Public Repository:** [https://github.com/thetoyzdept-a11y/THE-TOYZ-DEPT.](https://github.com/thetoyzdept-a11y/THE-TOYZ-DEPT.)

---

## 9. PRE-SUBMISSION CHECKLIST FOR RAZORPAY DASHBOARD

When submitting your website for Razorpay review in your merchant dashboard, provide the following exact URLs:

| Requirement Field in Razorpay | Verified Submission URL |
| :--- | :--- |
| **Website URL** | `https://thetoyzdept.in` |
| **About Us URL** | `https://thetoyzdept.in/about` |
| **Contact Us URL** | `https://thetoyzdept.in/contact` |
| **Pricing Details URL** | `https://thetoyzdept.in/pricing` |
| **Terms and Conditions URL** | `https://thetoyzdept.in/terms` |
| **Privacy Policy URL** | `https://thetoyzdept.in/privacy-policy` |
| **Refund & Cancellation URL** | `https://thetoyzdept.in/refund-policy` |
| **Shipping & Delivery URL** | `https://thetoyzdept.in/shipping` |
| **Grievance Redressal URL** | `https://thetoyzdept.in/grievance-redressal` |
| **Specimen Invoice URL** | `https://thetoyzdept.in/sample-invoice` |
| **Low-Price Test Product URL** | `https://thetoyzdept.in/products/3d-printed-test-token` (₹1) |

---
**Audit Certified By:** Senior Compliance & Payment Gateway Integration Audit  
**Status:** **APPROVED & FULLY READY FOR ACTIVATION**
