import React, { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import {
  UploadCloud,
  FileCode,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Clock,
} from "lucide-react";

export function CustomPrintsPage() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState("");
  const [material, setMaterial] = useState("PLA+ (Standard)");
  const [color, setColor] = useState("Acid Lime");
  const [quantity, setQuantity] = useState(1);
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [guestName, setGuestName] = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [guestEmail, setGuestEmail] = useState(user?.email || "");
  const [guestPhone, setGuestPhone] = useState(user?.phone || "");
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (!["stl", "3mf", "obj", "step"].includes(ext || "")) {
      setErrorMsg("Please upload a valid 3D file (.stl, .3mf, .obj, .step)");
      return;
    }
    if (selectedFile.size > 50 * 1024 * 1024) {
      setErrorMsg("File size exceeds 50MB limit");
      return;
    }
    setErrorMsg("");
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg("Please describe your project or 3D model requirements.");
      return;
    }
    if (!user && !guestEmail.trim()) {
      setErrorMsg("Please provide your email address to receive the quotation.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("material", material);
      formData.append("color", color);
      formData.append("quantity", String(quantity));
      formData.append("additionalNotes", additionalNotes);
      formData.append("name", guestName);
      formData.append("email", guestEmail);
      formData.append("phone", guestPhone);
      if (file) {
        formData.append("file", file);
      }

      const res = await api.submitCustomRequest(formData);
      setSuccessData(res);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit custom request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="border-b-2 border-ink pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime text-ink border border-ink text-xs font-mono font-bold uppercase tracking-wider mb-3 shadow-brutal-sm">
            <Sparkles className="w-3.5 h-3.5" /> CUSTOM 3D LAB // BENGALURU
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-ink">
            Print Your Custom 3D Model<span className="text-coral">.</span>
          </h1>
          <p className="text-ink-muted text-sm sm:text-base max-w-2xl font-body mt-2 leading-relaxed">
            Got an STL, OBJ, or STEP file? Upload your 3D model below. We slice the toolpaths, check wall tolerances, and email you an exact quote in under 2 hours.
          </p>
        </div>

        {/* ── Success Screen ─────────────────────────────────────────── */}
        {successData ? (
          <div className="card-brutal bg-cream-light p-8 sm:p-12 max-w-2xl mx-auto text-center space-y-6 shadow-brutal-xl">
            <div className="w-16 h-16 bg-lime text-ink border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="badge-coral text-xs mb-2">Request Lodged</span>
              <h2 className="font-display font-black text-3xl uppercase tracking-tight">
                Request {successData.requestNumber} Received!
              </h2>
              <p className="text-xs font-mono text-ink-muted mt-1 uppercase">
                Model successfully queued for engineering inspection
              </p>
            </div>

            <div className="p-4 bg-cream border-2 border-ink text-left space-y-2 font-mono text-xs">
              <p>
                <span className="text-ink-muted">Request Ref:</span> <span className="font-bold">{successData.requestNumber}</span>
              </p>
              <p>
                <span className="text-ink-muted">Status:</span> <span className="text-lime-darker font-bold">SUBMITTED (In Slicing Queue)</span>
              </p>
              <p>
                <span className="text-ink-muted">Turnaround:</span> <span>Commercial quote within 24 hours</span>
              </p>
            </div>

            <p className="text-xs text-ink-muted font-body leading-relaxed">
              Our engineering team is calculating infill toolpaths, material weight, and machine hours in Bambu Studio.
              You will receive an email and a notification in your customer portal once your formal quotation is ready for review.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Link to="/account/custom-requests" className="btn-primary text-xs">
                View in Customer Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => { setSuccessData(null); setFile(null); setDescription(""); }}
                className="btn-secondary text-xs"
              >
                Submit Another Model
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* ── Submission Form ─────────────────────────────────────── */}
            <div className="lg:col-span-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* 1. Drag & Drop File Upload */}
                <div className="card-brutal p-6 bg-cream-light space-y-3">
                  <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                    <label className="font-display font-bold uppercase text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-ink text-cream text-xs flex items-center justify-center font-mono">1</span>
                      Upload 3D CAD Geometry
                    </label>
                    <span className="font-mono text-[11px] text-ink-muted">
                      STL, 3MF, OBJ, STEP (Max 50MB)
                    </span>
                  </div>

                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-8 text-center transition-all cursor-pointer relative ${
                      dragActive
                        ? "border-coral bg-coral/10"
                        : file
                        ? "border-ink bg-lime/20"
                        : "border-ink/40 bg-cream hover:border-ink hover:bg-cream-dark"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".stl,.3mf,.obj,.step"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {file ? (
                      <div className="space-y-2">
                        <FileCode className="w-10 h-10 mx-auto text-ink" />
                        <p className="font-display font-bold text-base uppercase text-ink">{file.name}</p>
                        <p className="font-mono text-xs text-ink-muted">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB • File verified ready for upload
                        </p>
                        <span className="badge-lime text-[10px]">Click or drag to change file</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-10 h-10 mx-auto text-ink/60" />
                        <p className="font-display font-bold text-base uppercase text-ink">
                          Drag & drop your 3D model here
                        </p>
                        <p className="font-mono text-xs text-ink-muted">
                          or click to browse your local device files
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Material & Color Preferences */}
                <div className="card-brutal p-6 bg-cream-light space-y-4">
                  <div className="border-b border-ink/20 pb-2">
                    <label className="font-display font-bold uppercase text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-ink text-cream text-xs flex items-center justify-center font-mono">2</span>
                      Material & Appearance Preferences
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                        Filament Grade
                      </label>
                      <select
                        value={material}
                        onChange={(e) => setMaterial(e.target.value)}
                        className="w-full bg-cream border-2 border-ink px-3 py-2 font-mono text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-lime"
                      >
                        <option value="PLA+ (Standard)">PLA+ (Standard - Collectibles & Desk)</option>
                        <option value="PETG (Tough)">PETG (Tough & Heat Resistant)</option>
                        <option value="Silk Dual-Tone">Silk Dual-Tone (Iridescent Sheen)</option>
                        <option value="Carbon Fiber PLA">Carbon Fiber PLA (Structural & Matte)</option>
                        <option value="Tough SLA Resin">Tough SLA Resin (Ultra High Detail)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                        Colorway
                      </label>
                      <select
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="w-full bg-cream border-2 border-ink px-3 py-2 font-mono text-xs font-bold uppercase focus:outline-none focus:ring-2 focus:ring-lime"
                      >
                        <option value="Acid Lime">Acid Lime (Brand Signature)</option>
                        <option value="Obsidian Matte Black">Obsidian Matte Black</option>
                        <option value="Architectural Cream">Architectural Cream</option>
                        <option value="Coral Flame">Coral Flame</option>
                        <option value="Granite Gray">Granite Gray</option>
                        <option value="Translucent Smoke">Translucent Smoke</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-xs font-bold uppercase text-ink mb-1.5">
                        Quantity Required
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                        className="w-full bg-cream border-2 border-ink px-3 py-2 font-mono text-xs font-bold focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Description & Additional Instructions */}
                <div className="card-brutal p-6 bg-cream-light space-y-4">
                  <div className="border-b border-ink/20 pb-2">
                    <label className="font-display font-bold uppercase text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-ink text-cream text-xs flex items-center justify-center font-mono">3</span>
                      Project Specification & Notes
                    </label>
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                      Brief Project Description *
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g. Custom artisan mechanical keyboard keycap modeled in Fusion360. Needs tight tolerance on MX cross-stem."
                      rows={3}
                      required
                      className="w-full bg-cream border-2 border-ink p-3 font-body text-xs focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs font-bold uppercase text-ink mb-1">
                      Engineering Instructions (Optional)
                    </label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="Infill percentage preference (e.g. 20% gyroid), wall thickness, critical fit dimensions, or orientation requests..."
                      rows={2}
                      className="w-full bg-cream border-2 border-ink p-3 font-body text-xs focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                </div>

                {/* 4. Customer Contact Info */}
                {!user && (
                  <div className="card-brutal p-6 bg-cream-light space-y-4">
                    <div className="border-b border-ink/20 pb-2">
                      <label className="font-display font-bold uppercase text-sm flex items-center gap-2">
                        <span className="w-5 h-5 bg-ink text-cream text-xs flex items-center justify-center font-mono">4</span>
                        Your Contact Information
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                      <div>
                        <label className="block font-bold uppercase mb-1">Full Name</label>
                        <input
                          type="text"
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="Rohan Verma"
                          required
                          className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          value={guestEmail}
                          onChange={(e) => setGuestEmail(e.target.value)}
                          placeholder="rohan@example.com"
                          required
                          className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                        />
                      </div>
                      <div>
                        <label className="block font-bold uppercase mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={guestPhone}
                          onChange={(e) => setGuestPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-4 bg-coral/20 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-base"
                >
                  {submitting ? "Uploading CAD Geometry..." : "Submit 3D Model for Quotation"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* ── Quotation Process Roadmap Sidebar ─────────────────── */}
            <div className="lg:col-span-4 space-y-6">
              <div className="card-brutal bg-ink text-cream p-6 shadow-brutal-lg">
                <h3 className="font-display font-black text-lg uppercase mb-4 text-lime flex items-center gap-2">
                  <Clock className="w-5 h-5" /> The Quotation Flow
                </h3>
                <div className="space-y-4 font-mono text-xs">
                  <div className="flex gap-3">
                    <span className="w-5 h-5 bg-lime text-ink flex items-center justify-center font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="font-bold text-cream">Upload Geometry</p>
                      <p className="text-cream/60 text-[11px]">Submit your STL, 3MF, or STEP file securely.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 bg-lime text-ink flex items-center justify-center font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="font-bold text-cream">Slicing & Toolpaths</p>
                      <p className="text-cream/60 text-[11px]">Our engineer inspects wall thicknesses and overhangs.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 bg-lime text-ink flex items-center justify-center font-bold flex-shrink-0">3</span>
                    <div>
                      <p className="font-bold text-cream">Formal Quote Ready</p>
                      <p className="text-cream/60 text-[11px]">Itemized breakdown of material, machine hours, and QC.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-5 h-5 bg-lime text-ink flex items-center justify-center font-bold flex-shrink-0">4</span>
                    <div>
                      <p className="font-bold text-cream">Accept & Fabricate</p>
                      <p className="text-cream/60 text-[11px]">Accept in one click, pay via UPI/card, and printing begins!</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
                <p className="font-display font-bold uppercase text-ink text-sm border-b border-ink/20 pb-2">
                  Storage & IP Security
                </p>
                <div className="flex items-start gap-2 text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-lime-darker flex-shrink-0 mt-0.5" />
                  <span>Files stored privately in encrypted Cloudflare R2 object storage.</span>
                </div>
                <div className="flex items-start gap-2 text-ink-muted">
                  <ShieldCheck className="w-4 h-4 text-lime-darker flex-shrink-0 mt-0.5" />
                  <span>Your proprietary CAD designs are never shared, resold, or redistributed.</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
