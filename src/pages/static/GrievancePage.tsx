import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Scale, ShieldAlert, CheckCircle2, Clock, AlertCircle, Send, FileText } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function GrievancePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    orderNumber: "",
    grievanceType: "Delivery Delay",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [ticketResponse, setTicketResponse] = useState<{
    ticketId: string;
    message: string;
    acknowledgementSLA: string;
    resolutionSLA: string;
    officer: {
      name: string;
      designation: string;
      email: string;
      phone: string;
    };
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage("Please enter the complainant full name.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please provide a valid contact email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage("Please provide a valid contact phone number.");
      return;
    }
    if (!formData.description.trim() || formData.description.trim().length < 15) {
      setErrorMessage("Please describe the grievance in detail (minimum 15 characters).");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(data.error || "Failed to register grievance. Please contact the officer directly.");
      }

      setTicketResponse(data);
      setFormData({
        name: "",
        email: "",
        phone: "",
        orderNumber: "",
        grievanceType: "Delivery Delay",
        description: "",
      });
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting grievance. Please email thetoyzdept@gmail.com.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-coral text-xs">Statutory Redressal Desk</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Consumer Protection Rules 2020</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            Grievance Redressal<span className="text-lime">.</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-ink-muted uppercase mt-2">
            In compliance with Rule 5(9) of the Consumer Protection (E-Commerce) Rules, 2020
          </p>
        </div>

        {/* Statutory Disclosures Card */}
        <div className="card-brutal p-6 sm:p-8 bg-cream-light space-y-6">
          <div className="flex items-center gap-3 border-b border-ink/20 pb-4">
            <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center border border-ink">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg uppercase text-ink">
                Designated Statutory Grievance Redressal Officer
              </h2>
              <p className="font-mono text-xs text-ink-muted">
                Appointed pursuant to the Consumer Protection Act, 2019 & E-Commerce Rules
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
            <div className="bg-cream p-4 border border-ink/20">
              <p className="text-ink-muted text-[10px] uppercase">Officer Name & Title</p>
              <p className="font-bold text-ink text-sm mt-0.5">{BUSINESS_PROFILE.grievanceOfficer.name}</p>
              <p className="text-[11px] text-ink-muted">{BUSINESS_PROFILE.grievanceOfficer.designation}</p>
            </div>

            <div className="bg-cream p-4 border border-ink/20">
              <p className="text-ink-muted text-[10px] uppercase">Direct Contact</p>
              <a
                href={`mailto:${BUSINESS_PROFILE.grievanceOfficer.email}`}
                className="font-bold text-ink text-sm mt-0.5 block hover:text-coral underline"
              >
                {BUSINESS_PROFILE.grievanceOfficer.email}
              </a>
              <p className="text-[11px] text-ink-muted">{BUSINESS_PROFILE.grievanceOfficer.phone}</p>
            </div>

            <div className="bg-cream p-4 border border-ink/20">
              <p className="text-ink-muted text-[10px] uppercase">Statutory SLAs</p>
              <p className="font-bold text-ink mt-0.5">Ack: Within 48 Hours</p>
              <p className="text-[11px] text-ink-muted">Resolution: Within 30 Calendar Days</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3 bg-cream p-4 border border-ink/20">
              <p className="text-ink-muted text-[10px] uppercase">Office Postal Address</p>
              <p className="font-bold text-ink mt-0.5">{BUSINESS_PROFILE.grievanceOfficer.address}</p>
              <p className="text-[11px] text-ink-muted mt-0.5">
                Working Hours: {BUSINESS_PROFILE.contact.supportHours}
              </p>
            </div>
          </div>
        </div>

        {/* Grievance Submission Form */}
        <div className="card-brutal p-6 sm:p-8 bg-cream-light">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink mb-2">
            Submit a Formal Grievance
          </h2>
          <p className="font-mono text-xs text-ink-muted mb-6">
            If your order or service inquiry was not resolved satisfactorily by regular customer support, file a formal complaint ticket below. A statutory ticket ID will be generated immediately.
          </p>

          {ticketResponse ? (
            <div className="p-6 bg-lime/20 border-2 border-lime-darker space-y-4 font-mono text-xs">
              <div className="flex items-center gap-2 text-ink font-bold text-base">
                <CheckCircle2 className="w-6 h-6 text-ink" />
                <span>Formal Grievance Registered Successfully</span>
              </div>
              <p className="text-ink/80 text-sm">{ticketResponse.message}</p>
              <div className="bg-cream p-4 border border-ink/20 space-y-2">
                <p>
                  <strong className="text-ink">Grievance Ticket ID:</strong>{" "}
                  <span className="font-bold text-coral text-sm">{ticketResponse.ticketId}</span>
                </p>
                <p>
                  <strong className="text-ink">Statutory Acknowledgement SLA:</strong>{" "}
                  {ticketResponse.acknowledgementSLA}
                </p>
                <p>
                  <strong className="text-ink">Statutory Resolution SLA:</strong>{" "}
                  {ticketResponse.resolutionSLA}
                </p>
                <p>
                  <strong className="text-ink">Assigned Officer:</strong>{" "}
                  {ticketResponse.officer.name} ({ticketResponse.officer.designation})
                </p>
              </div>
              <button
                onClick={() => setTicketResponse(null)}
                className="btn-secondary text-xs"
              >
                Submit Another Grievance
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                    Complainant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full legal name"
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

                <div>
                  <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                    Contact Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                    Order Number (If applicable)
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="e.g. ORD-1002"
                    className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                    Nature of Grievance *
                  </label>
                  <select
                    value={formData.grievanceType}
                    onChange={(e) => setFormData({ ...formData, grievanceType: e.target.value })}
                    className="w-full bg-cream text-ink border-2 border-ink px-3 py-2 text-xs font-mono focus:outline-none focus:border-coral"
                  >
                    <option value="Delivery Delay">Logistics / Courier Delivery Delay</option>
                    <option value="Damaged Goods">Received Damaged / Broken Physical Item</option>
                    <option value="Refund Issue">Payment / Refund Processing Delay</option>
                    <option value="Product Quality">Manufacturing Layer Defect / Spec Deviation</option>
                    <option value="Custom 3D Print">Custom 3D CAD Print Tolerance Discrepancy</option>
                    <option value="Privacy / Data">Data Protection / Privacy Concern</option>
                    <option value="Other">Other Statutory Violation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-ink font-bold mb-1">
                  Detailed Description of Grievance *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail the complete timeline, facts, prior support communications, and requested remedy..."
                  className="w-full bg-cream text-ink border-2 border-ink p-3 text-xs font-mono focus:outline-none focus:border-coral"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <span>Recording Grievance Ticket...</span>
                ) : (
                  <>
                    <span>Submit Grievance to Statutory Officer</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
