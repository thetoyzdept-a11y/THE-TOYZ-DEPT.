/**
 * THE TOYZ DEPT. — Backend Central Business Profile & Legal Compliance Configuration
 */

export const BUSINESS_PROFILE = {
  brandName: "THE TOYZ DEPT.",
  tagline: "THINGS YOU DIDN'T KNOW YOU NEEDED.",
  legalEntityName: "ABHISHEK H",
  constitution: "Individual / Sole Proprietorship (Unregistered Small Business)",
  proprietorName: "Abhishek H",
  authorizedRepresentative: "Abhishek H",
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
  contact: {
    email: "thetoyzdept@gmail.com",
    phone: "+91 90194 65897",
    supportHours: "Monday to Saturday, 10:00 AM – 7:00 PM IST",
    timezone: "Asia/Kolkata",
  },
  grievanceOfficer: {
    name: "Abhishek H",
    designation: "Grievance Redressal Officer & Proprietor",
    email: "thetoyzdept@gmail.com",
    phone: "+91 90194 65897",
    address:
      "MIG 146, KHB Colony, Rajiv Gandhi Nagar, Gadag, Karnataka 582101, India",
    acknowledgementSLA: "Within 48 hours",
    resolutionSLA: "Within 30 calendar days",
  },
  taxation: {
    gstStatus: "Unregistered",
    gstin: null,
    statusNotice:
      "Exempt from GST registration under Section 22 of the CGST Act, 2017 (Turnover below statutory threshold).",
  },
  domain: "thetoyzdept.in",
  websiteUrl: "https://thetoyzdept.in",
} as const;
