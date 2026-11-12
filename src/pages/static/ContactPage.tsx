import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ShieldAlert, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: true,
  });

  const [loading, setLoading] = useState(false);
  const [successResponse, setSuccessResponse] = useState<{
    inquiryId: string;
    message: string;
    expectedResponseTime: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (!formData.subject.trim()) {
      setErrorMessage("Please specify an inquiry subject.");
      return;
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      setErrorMessage("Message must contain at least 10 characters.");
      return;
    }
    if (!formData.consent) {
      setErrorMessage("Please consent to contact terms to proceed.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || undefined,
          subject: formData.subject,
          message: formData.message,
        }),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setSuccessResponse({
        inquiryId: data.inquiryId,
        message: data.message,
        expectedResponseTime: data.expectedResponseTime || "Within 24 business hours",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        consent: true,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred. Please contact us directly via email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-lime text-xs">Direct Support & Inquiries</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Commercial Desk</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            Contact The Dept<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-ink-muted uppercase mt-2">
            Order Inquiries • Custom 3D Print Quotations • Studio Visits
          </p>
        </div>

        {/* 3 Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Support */}
          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center border border-ink">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Email Support</h3>
            <p className="text-ink-muted">General, Orders & Quotes:</p>
            <a
              href={`mailto:${BUSINESS_PROFILE.contact.email}`}
              className="font-bold text-ink text-sm block hover:text-coral transition-colors underline"
            >
              {BUSINESS_PROFILE.contact.email}
            </a>
            <p className="text-[11px] text-ink-muted">Typical response: 2–4 hours</p>
          </div>

          {/* Phone & WhatsApp */}
          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center border border-ink">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Direct Telephone</h3>
            <p className="text-ink-muted">Call & WhatsApp Desk:</p>
            <a
              href={`tel:${BUSINESS_PROFILE.contact.phone.replace(/\s+/g, "")}`}
              className="font-bold text-ink text-sm block hover:text-coral transition-colors underline"
            >
              {BUSINESS_PROFILE.contact.phone}
            </a>
            <p className="text-[11px] text-ink-muted">{BUSINESS_PROFILE.contact.supportHours}</p>
          </div>

          {/* Physical Address */}
          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <div className="w-10 h-10 bg-ink text-cream flex items-center justify-center border border-ink">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-base uppercase text-ink">Principal Place of Business</h3>
            <p className="text-ink-muted">Registered Postal Address:</p>
            <p className="font-bold text-ink leading-relaxed">
              {BUSINESS_PROFILE.address.formatted}
            </p>
          </div>
        </div>

        {/* Contact Form & Statutory Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3 card-brutal p-6 sm:p-8 bg-cream-light">
            <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink mb-2">
              Send Us a Message
            </h2>
            <p className="font-mono text-xs text-ink-muted mb-6">
              Fill in your inquiry details below. All submissions are logged and acknowledged by our engineering desk.
            </p>

            {successResponse ? (
              <div className="p-6 bg-lime/20 border-2 border-lime-darker space-y-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-ink font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-ink" />
                  <span>Message Successfully Transmitted</span>
                </div>
                <p className="text-ink/80">{successResponse.message}</p>
                <div className="bg-cream p-3 border border-ink/20 space-y-1">
                  <p>
                    <strong className="text-ink">Reference ID:</strong>{" "}
                    <span className="font-bold text-coral">{successResponse.inquiryId}</span>
                  </p>
                  <p>
                    <strong className="text-ink">SLA Response Window:</strong>{" "}
                    {successResponse.expectedResponseTime}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="btn-secondary text-xs mt-2"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMessage && (
                  <div className="p-3 bg-coral/20 border border-coral text-ink font-mono text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-coral flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Abhishek Sharma"
                      className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@domain.com"
                      className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                      Inquiry Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Order #1004 inquiry, Custom 3D quote"
                      className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                    Your Message / Specifications *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide detailed questions regarding products, materials, shipping timelines, or custom print specifications..."
                    className="w-full bg-cream text-ink border-2 border-ink p-3 text-xs font-mono focus:outline-none focus:border-coral"
                  />
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="consent"
                    checked={formData.consent}
                    onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                    className="mt-0.5"
                  />
                  <label htmlFor="consent" className="font-mono text-[11px] text-ink-muted">
                    I consent to THE TOYZ DEPT. processing my contact details strictly for the purpose of answering this inquiry and resolving my request in accordance with the{" "}
                    <Link to="/privacy-policy" className="text-coral underline">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span>Transmitting Inquiry...</span>
                  ) : (
                    <>
                      <span>Submit Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Statutory & Grievance Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Legal Entity Card */}
            <div className="card-brutal p-6 bg-ink text-cream space-y-3 font-mono text-xs">
              <h3 className="font-display font-bold text-sm uppercase text-lime">
                Commercial Entity Details
              </h3>
              <div className="space-y-2 text-[11px] text-cream/70 leading-relaxed border-t border-cream/20 pt-3">
                <p>
                  <strong className="text-cream">Brand Name:</strong> {BUSINESS_PROFILE.brandName}
                </p>
                <p>
                  <strong className="text-cream">Legal Entity:</strong> {BUSINESS_PROFILE.legalEntityName}
                </p>
                <p>
                  <strong className="text-cream">Business Constitution:</strong> {BUSINESS_PROFILE.constitution}
                </p>
                <p>
                  <strong className="text-cream">Proprietor:</strong> {BUSINESS_PROFILE.proprietorName}
                </p>
                <p>
                  <strong className="text-cream">Principal Place:</strong> {BUSINESS_PROFILE.address.formatted}
                </p>
                <p>
                  <strong className="text-cream">GST Status:</strong> {BUSINESS_PROFILE.taxation.gstStatus} (Turnover exemption)
                </p>
                <p>
                  <strong className="text-cream">Official Domain:</strong> {BUSINESS_PROFILE.domain}
                </p>
              </div>
            </div>

            {/* Consumer Grievance Notice */}
            <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs border-2 border-coral">
              <div className="flex items-center gap-2 text-coral">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <h3 className="font-display font-bold text-sm uppercase text-ink">
                  Consumer Grievance Desk
                </h3>
              </div>
              <p className="text-ink-muted text-[11px] leading-relaxed">
                Have an escalated order issue or consumer rights complaint under the Consumer Protection (E-Commerce) Rules, 2020?
              </p>
              <div className="bg-cream p-3 border border-ink/20 text-[11px] space-y-1">
                <p>
                  <strong>Grievance Officer:</strong> {BUSINESS_PROFILE.grievanceOfficer.name}
                </p>
                <p>
                  <strong>Email:</strong> {BUSINESS_PROFILE.grievanceOfficer.email}
                </p>
                <p>
                  <strong>Acknowledgement:</strong> Within 48 hours
                </p>
              </div>
              <Link
                to="/grievance-redressal"
                className="btn-secondary w-full text-xs text-center block mt-2"
              >
                Access Grievance Redressal Mechanism
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
