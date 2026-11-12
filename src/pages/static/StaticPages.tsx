import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ShieldCheck, Truck, Cpu, ArrowRight } from "lucide-react";

export function AboutPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="border-b-2 border-ink pb-6">
          <span className="badge-lime text-xs mb-2">Manifesto</span>
          <h1 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter">
            We Build Things You Didn't Know You Needed<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase mt-2">
            THE TOYZ DEPT. Studio • Bengaluru, India • Est. 2026
          </p>
        </div>

        <div className="space-y-6 text-sm sm:text-base font-body leading-relaxed text-ink/85">
          <p className="text-xl font-display font-bold uppercase text-ink">
            THE TOYZ DEPT. was founded to cure the sterile boredom of modern mass-produced plastic objects.
          </p>
          <p>
            We don’t think of 3D printing as a low-cost prototyping gimmick. In our Bengaluru studio,
            we treat fused deposition modeling (FDM) and stereolithography (SLA) as deliberate manufacturing arts.
            Every curve, articulated ball socket, and brutalist geometric planar facet is modeled in-house,
            iterated through dozens of physical test prints, and sliced with micrometer precision.
          </p>
          <p>
            When you hold an articulated dragon or place one of our concrete-look desk planters on your workstation,
            you immediately feel the weight, the tactile resistance of the mechanical tolerance, and the intentional absence of cheap shortcuts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
          <div className="card-brutal p-6 bg-cream-light space-y-2">
            <Cpu className="w-6 h-6 text-lime-darker" />
            <h3 className="font-display font-bold uppercase text-base">In-House Farm</h3>
            <p className="text-xs font-mono text-ink-muted leading-relaxed">
              High-speed direct-drive machines equipped with hardened steel nozzles and calibrated textured PEI plates.
            </p>
          </div>
          <div className="card-brutal p-6 bg-cream-light space-y-2">
            <ShieldCheck className="w-6 h-6 text-coral" />
            <h3 className="font-display font-bold uppercase text-base">100% Recyclable</h3>
            <p className="text-xs font-mono text-ink-muted leading-relaxed">
              We exclusively source certified food-safe, bio-based PLA+ and virgin engineering PETG filaments.
            </p>
          </div>
          <div className="card-brutal p-6 bg-cream-light space-y-2">
            <MapPin className="w-6 h-6 text-ink" />
            <h3 className="font-display font-bold uppercase text-base">Bengaluru Born</h3>
            <p className="text-xs font-mono text-ink-muted leading-relaxed">
              Designed, printed, hand-inspected, and shipped from Indiranagar, Bengaluru across all of India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ShippingPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b-2 border-ink pb-6">
          <span className="badge-lime text-xs mb-2">Logistics</span>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            Shipping & Dispatch Policy<span className="text-coral">.</span>
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-ink/80 leading-relaxed">
          <div className="card-brutal p-5 bg-cream-light space-y-2">
            <h3 className="font-display font-bold text-base uppercase text-ink">Free Express Shipping Above ₹999</h3>
            <p>All orders with subtotal ₹999 and above automatically qualify for free air express shipping anywhere in India. Orders below ₹999 carry a nominal flat ₹99 fee.</p>
          </div>

          <div className="card-brutal p-5 bg-cream-light space-y-2">
            <h3 className="font-display font-bold text-base uppercase text-ink">Fabrication & Dispatch Timeline</h3>
            <p>Standard catalogue objects in stock ship within 24 to 48 business hours. Custom 3D prints enter production immediately upon quotation acceptance and dispatch within 3 to 5 business days.</p>
          </div>

          <div className="card-brutal p-5 bg-cream-light space-y-2">
            <h3 className="font-display font-bold text-base uppercase text-ink">Courier Partners & Tracking</h3>
            <p>Shipments are dispatched via BlueDart Air, DTDC Express, or Delhivery with active air waybill tracking numbers sent via SMS and email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ReturnsPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b-2 border-ink pb-6">
          <span className="badge-coral text-xs mb-2">QC Guarantee</span>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            Returns & Quality Policy<span className="text-lime">.</span>
          </h1>
        </div>

        <div className="space-y-6 text-xs font-mono text-ink/80 leading-relaxed">
          <div className="card-brutal p-5 bg-cream-light space-y-2">
            <h3 className="font-display font-bold text-base uppercase text-ink">Zero-Defect Commitment</h3>
            <p>Every 3D printed object undergoes physical joint articulation testing and deburring. If your piece arrives damaged during transit or has layer separation defects, notify us within 48 hours for an instant complimentary reprint replacement.</p>
          </div>

          <div className="card-brutal p-5 bg-cream-light space-y-2">
            <h3 className="font-display font-bold text-base uppercase text-ink">Custom Fabrication Notice</h3>
            <p>Custom customer CAD/STL prints are manufactured specifically to customer-supplied geometry files. As such, custom orders cannot be cancelled once slicing has commenced, but we guarantee dimensional compliance with your supplied model.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b-2 border-ink pb-6">
          <span className="badge-lime text-xs mb-2">Support</span>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            Contact The Dept<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase mt-1">
            Studio Inquiries • Custom Bulk Quotes • Order Updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <Mail className="w-6 h-6 text-coral" />
            <h3 className="font-display font-bold text-base uppercase text-ink">Email Support</h3>
            <p className="text-ink-muted">General & Custom Orders:</p>
            <p className="font-bold text-ink text-sm">support@thetoyzdept.in</p>
            <p className="text-[10px] text-ink-muted">Avg response time: 2 hours</p>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <Phone className="w-6 h-6 text-lime-darker" />
            <h3 className="font-display font-bold text-base uppercase text-ink">Phone & WhatsApp</h3>
            <p className="text-ink-muted">Direct Engineering Desk:</p>
            <p className="font-bold text-ink text-sm">+91 80 4123 9900</p>
            <p className="text-[10px] text-ink-muted">Mon–Sat: 10:00 AM – 7:00 PM IST</p>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3 font-mono text-xs">
            <MapPin className="w-6 h-6 text-ink" />
            <h3 className="font-display font-bold text-base uppercase text-ink">Print Farm Studio</h3>
            <p className="text-ink-muted">Physical Facility:</p>
            <p className="font-bold text-ink">88 Creative Industrial Hub, Indiranagar, Bengaluru, KA 560038</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs font-mono text-ink/80 leading-relaxed">
        <h1 className="font-display font-black text-3xl uppercase text-ink border-b-2 border-ink pb-4">
          Privacy Policy
        </h1>
        <p>THE TOYZ DEPT. (https://thetoyzdept.in) values customer privacy. We collect only necessary contact and shipping credentials required to fulfill orders and prepare custom quotations.</p>
        <p>Customer passwords are encrypted with PBKDF2 Web Crypto hashing. Uploaded 3D CAD files are stored privately in encrypted Cloudflare R2 object storage and are never resold or shared.</p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-xs font-mono text-ink/80 leading-relaxed">
        <h1 className="font-display font-black text-3xl uppercase text-ink border-b-2 border-ink pb-4">
          Terms of Service
        </h1>
        <p>Welcome to THE TOYZ DEPT. By accessing our platform or placing an order, you agree to comply with Indian commercial laws and these standard terms.</p>
        <p>All prices are listed in Indian Rupees (INR ₹) and are inclusive of relevant GST. Quotations for customer-uploaded files remain valid for 14 calendar days from transmission.</p>
      </div>
    </div>
  );
}
