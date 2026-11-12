import React from "react";
import { Link } from "react-router-dom";
import { Cpu, ShieldCheck, MapPin, Mail, Phone, Layers, Hammer, Sparkles, CheckCircle2 } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function AboutPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Breadcrumb & Title */}
        <div className="border-b-2 border-ink pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="badge-lime text-xs">About Our Brand & Studio</span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="font-mono text-xs text-ink-muted">Commercial Disclosure</span>
          </div>
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tight text-ink">
            Things You Didn't Know You Needed<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-ink-muted uppercase mt-3">
            {BUSINESS_PROFILE.brandName} • Tactile 3D Printing & Additive Fabrication • Karnataka, India
          </p>
        </div>

        {/* Visual Studio Gallery Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-brutal p-2 bg-cream-light overflow-hidden">
            <div className="aspect-square overflow-hidden border border-ink">
              <img src="/images/products/dragon-1.jpg" alt="Articulated 3D Prints" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-mono text-[11px] font-bold text-center uppercase pt-2 text-ink">Articulated Precision Mechanics</p>
          </div>
          <div className="card-brutal p-2 bg-cream-light overflow-hidden">
            <div className="aspect-square overflow-hidden border border-ink">
              <img src="/images/products/dock-1.jpg" alt="Brutalist Desk Gear" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-mono text-[11px] font-bold text-center uppercase pt-2 text-ink">Brutalist Desk Tools</p>
          </div>
          <div className="card-brutal p-2 bg-cream-light overflow-hidden">
            <div className="aspect-square overflow-hidden border border-ink">
              <img src="/images/products/planter-1.jpg" alt="Architectural Planters" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <p className="font-mono text-[11px] font-bold text-center uppercase pt-2 text-ink">Architectural Decor</p>
          </div>
        </div>

        {/* Brand Story & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6 text-sm sm:text-base font-body leading-relaxed text-ink/85">
            <p className="text-xl font-display font-bold uppercase text-ink leading-snug">
              THE TOYZ DEPT. was created to bring tactile personality, precision mechanical design, and functional art back to everyday desks and living spaces.
            </p>
            <p>
              We operate an independent additive manufacturing and design studio based in Karnataka, India.
              Rather than viewing 3D printing as a generic prototyping gimmick or mass-market plastic injection shortcut,
              we treat fused deposition modeling (FDM) as an intentional craft. Every curved facet, articulated ball-and-socket joint,
              and brutalist desk organizer in our catalog is engineered in-house, sliced with micrometer layer precision,
              and carefully printed and hand-finished before it leaves our workbench.
            </p>
            <p>
              When you pick up one of our articulated collectibles or place an architectural planter on your workspace,
              you immediately feel the dense structural gyroid infill, the smooth mechanical tolerances, and the distinctive tactile micro-texture
              that makes genuine 3D-printed design so engaging.
            </p>
          </div>

          {/* Quick Facts Card */}
          <div className="card-brutal p-6 bg-cream-light space-y-4 font-mono text-xs">
            <h3 className="font-display font-bold text-sm uppercase text-ink border-b border-ink/20 pb-2">
              Studio Quick Facts
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-ink-muted text-[10px] uppercase">Core Technology</p>
                <p className="font-bold text-ink">Precision FDM Additive Manufacturing</p>
              </div>
              <div>
                <p className="text-ink-muted text-[10px] uppercase">Filament Materials</p>
                <p className="font-bold text-ink">Virgin Bio-based PLA+, Tough PETG</p>
              </div>
              <div>
                <p className="text-ink-muted text-[10px] uppercase">Layer Heights</p>
                <p className="font-bold text-ink">0.12mm – 0.20mm Fine Resolution</p>
              </div>
              <div>
                <p className="text-ink-muted text-[10px] uppercase">Dispatch Location</p>
                <p className="font-bold text-ink">Gadag, Karnataka, India</p>
              </div>
              <div>
                <p className="text-ink-muted text-[10px] uppercase">Delivery Network</p>
                <p className="font-bold text-ink">All serviceable pincodes across India</p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Make: 3 Pillars */}
        <div className="space-y-6 pt-4">
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-ink">
            What We Engineer & Sell
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-brutal p-6 bg-cream-light space-y-3">
              <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center border border-ink">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold uppercase text-base text-ink">Articulated Collectibles</h3>
              <p className="text-xs font-mono text-ink-muted leading-relaxed">
                Interlocking multi-segment figures, kinetic flexi creatures, and tactile dragons engineered to print in-place without assembly hardware.
              </p>
            </div>

            <div className="card-brutal p-6 bg-cream-light space-y-3">
              <div className="w-10 h-10 bg-coral text-cream flex items-center justify-center border border-ink">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold uppercase text-base text-ink">Desk & Workspace Gear</h3>
              <p className="text-xs font-mono text-ink-muted leading-relaxed">
                Brutalist pen docks, modular headphone stands, mechanical phone mounts, and magnetic cable organizers designed for creative workstations.
              </p>
            </div>

            <div className="card-brutal p-6 bg-cream-light space-y-3">
              <div className="w-10 h-10 bg-ink text-cream flex items-center justify-center border border-ink">
                <Hammer className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold uppercase text-base text-ink">Custom 3D Printing Service</h3>
              <p className="text-xs font-mono text-ink-muted leading-relaxed">
                On-demand CAD model slicing, tolerance checking, and custom print fabrication for mechanical engineers, designers, architecture students, and makers.
              </p>
            </div>
          </div>
        </div>

        {/* Understanding 3D Printing Characteristics */}
        <div className="card-brutal p-6 sm:p-8 bg-cream-light space-y-4">
          <h2 className="font-display font-black text-xl uppercase tracking-tight text-ink flex items-center gap-2">
            <Cpu className="w-5 h-5 text-coral" />
            The Nature of 3D-Printed Objects
          </h2>
          <div className="text-xs font-mono text-ink/80 leading-relaxed space-y-3">
            <p>
              Unlike mass-manufactured molded plastics produced by millions in overseas factories, 3D printing builds objects one thin layer of thermoplastic at a time.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Microscopic Layer Lines:</strong> You will observe delicate, uniform horizontal layer ridges. These are the hallmark proof of authentic digital craftsmanship.
              </li>
              <li>
                <strong>Structural Density:</strong> We utilize specialized infill geometries (such as 3D Gyroid) that provide exceptional strength-to-weight ratios while remaining lightweight.
              </li>
              <li>
                <strong>Hand Finishing:</strong> Each print is individually removed from textured PEI build surfaces, deburred, joint-articulated, and visually inspected by hand.
              </li>
              <li>
                <strong>Eco-Conscious Thermoplastics:</strong> Our primary material is premium PLA+ (Polylactic Acid), derived from renewable plant starches like corn and sugarcane.
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Entity & Commercial Disclosure */}
        <div className="card-brutal p-6 sm:p-8 bg-ink text-cream space-y-4 border-2 border-ink">
          <div className="flex items-center gap-2 text-lime">
            <ShieldCheck className="w-5 h-5" />
            <span className="font-display font-bold text-sm uppercase tracking-wider">
              Legal Business Identity & Commercial Disclosure
            </span>
          </div>
          <div className="font-mono text-xs text-cream/80 leading-relaxed space-y-2">
            <p>
              In full compliance with the Consumer Protection (E-Commerce) Rules, 2020 and Indian commercial regulations, the business entity details are transparently disclosed:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] bg-ink-light p-4 border border-cream/20">
              <div>
                <span className="text-cream/50 uppercase">Legal Entity Name:</span>
                <p className="font-bold text-cream">{BUSINESS_PROFILE.legalEntityName}</p>
              </div>
              <div>
                <span className="text-cream/50 uppercase">Trade / Brand Name:</span>
                <p className="font-bold text-cream">{BUSINESS_PROFILE.brandName}</p>
              </div>
              <div>
                <span className="text-cream/50 uppercase">Business Constitution:</span>
                <p className="font-bold text-cream">{BUSINESS_PROFILE.constitution}</p>
              </div>
              <div>
                <span className="text-cream/50 uppercase">Authorized Proprietor:</span>
                <p className="font-bold text-cream">{BUSINESS_PROFILE.proprietorName}</p>
              </div>
              <div className="sm:col-span-2">
                <span className="text-cream/50 uppercase">Principal Place of Business:</span>
                <p className="font-bold text-cream">{BUSINESS_PROFILE.address.formatted}</p>
              </div>
              <div>
                <span className="text-cream/50 uppercase">Support Email:</span>
                <p className="font-bold text-lime">{BUSINESS_PROFILE.contact.email}</p>
              </div>
              <div>
                <span className="text-cream/50 uppercase">Support Telephone:</span>
                <p className="font-bold text-lime">{BUSINESS_PROFILE.contact.phone}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-lime text-ink border-2 border-ink">
          <div>
            <h3 className="font-display font-black text-lg uppercase">Ready to explore our catalog?</h3>
            <p className="font-mono text-xs">Browse our tactile collectibles or request a custom quotation.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/shop" className="btn-primary text-xs">
              Explore Shop
            </Link>
            <Link to="/custom-prints" className="btn-secondary text-xs">
              Custom Prints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
