/**
 * THE TOYZ DEPT. — Central Business Profile & Legal Compliance Configuration
 *
 * CRITICAL COMPLIANCE NOTICE:
 * This configuration contains verified, truthful business identity data for
 * Razorpay Merchant Onboarding and compliance under the Consumer Protection
 * (E-Commerce) Rules, 2020 and the Information Technology Act, 2000.
 *
 * NEVER FABRICATE OR SUBSTITUTE ANY DETAILS WITH FICTIONAL DATA.
 */

export const BUSINESS_PROFILE = {
  // Brand & Consumer Facing Identity
  brandName: "THE TOYZ DEPT.",
  tagline: "THINGS YOU DIDN'T KNOW YOU NEEDED.",
  description:
    "An independent, design-led 3D-printing brand engineering tactile collectibles, creative desk accessories, architectural home objects, and precision customer CAD fabrication.",

  // Legal Entity & Constitution
  legalEntityName: "ABHISHEK H",
  constitution: "Individual / Sole Proprietorship (Unregistered Small Business)",
  proprietorName: "Abhishek H",
  authorizedRepresentative: "Abhishek H",

  // Physical Business Address (Principal Place of Business)
  address: {
    line1: "MIG 146, KHB Colony",
    line2: "Rajiv Gandhi Nagar",
    city: "Gadag",
    state: "Karnataka",
    pincode: "582101",
    country: "India",
    formatted:
      "MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, Karnataka 582101, India",
  },

  // Customer Support & Communication Channels
  contact: {
    email: "thetoyzdept@gmail.com",
    phone: "+91 90194 65897",
    displayPhone: "+91 90194 65897",
    whatsapp: "+91 90194 65897",
    supportHours: "Monday to Saturday, 10:00 AM – 7:00 PM IST",
    workingDays: "Monday – Saturday (Closed on National Holidays)",
    timezone: "Asia/Kolkata (IST, UTC+5:30)",
  },

  // Statutory Grievance Redressal Officer (Rule 5(9) of Consumer Protection E-Commerce Rules, 2020)
  grievanceOfficer: {
    name: "Abhishek H",
    designation: "Grievance Redressal Officer & Proprietor",
    email: "thetoyzdept@gmail.com",
    phone: "+91 90194 65897",
    address:
      "MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, Karnataka 582101, India",
    acknowledgementSLA: "Within 48 hours of ticket receipt",
    resolutionSLA: "Within 30 calendar days of ticket receipt",
  },

  // Taxation & Statutory Registrations
  taxation: {
    gstStatus: "Unregistered",
    gstin: null,
    statusNotice:
      "Exempt from GST registration under Section 22 of the Central Goods and Services Tax Act, 2017 (Aggregate annual turnover below statutory threshold limit for supply of goods). All displayed prices are final and net.",
  },

  // Digital Presence
  domain: "thetoyzdept.in",
  websiteUrl: "https://thetoyzdept.in",
  social: {
    instagram: "https://instagram.com/thetoyzdept",
    twitter: "https://twitter.com/thetoyzdept",
  },

  // Logistics & Fulfilment Rules
  logistics: {
    pickupWarehouse: "Primary (Gadag, Karnataka)",
    freeShippingThreshold: 999, // in INR
    flatShippingFee: 99, // in INR
    courierPartners: ["Delhivery", "BlueDart", "DTDC", "Xpressbees", "Ekart"],
    standardProcessingTime: "24–48 business hours",
    customProcessingTime: "3–5 business days",
    standardDeliveryMetros: "3–5 business days",
    standardDeliveryRestOfIndia: "4–7 business days",
  },

  // Payment Gateway
  payment: {
    gateway: "Razorpay Standard Checkout",
    acceptedMethods: [
      "UPI (GPay, PhonePe, Paytm, BHIM, CRED)",
      "Credit & Debit Cards (Visa, Mastercard, RuPay, Maestro)",
      "Net Banking (50+ Indian Banks)",
      "Wallets & PayLater",
    ],
    currency: "INR (₹)",
  },
} as const;

export type BusinessProfile = typeof BUSINESS_PROFILE;
