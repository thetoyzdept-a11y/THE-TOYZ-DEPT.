import React from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Package, Printer, FileText } from "lucide-react";

export function OrderSuccessPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="bg-cream min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="card-brutal bg-cream-light p-8 sm:p-12 text-center space-y-6 shadow-brutal-xl">
          <div className="w-16 h-16 bg-lime text-ink border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="badge-lime text-xs mb-2">Payment Confirmed</span>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
              Order Confirmed!
            </h1>
            <p className="font-mono text-xs text-ink-muted mt-1 uppercase">
              Assigned to print queue // Est. Dispatch in 24-48 Hours
            </p>
          </div>

          <div className="p-4 bg-cream border-2 border-ink text-left space-y-2 font-mono text-xs">
            <div className="flex justify-between border-b border-ink/15 pb-2">
              <span className="text-ink-muted uppercase">Order Reference:</span>
              <span className="font-bold text-ink">{orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-ink/15 pb-2">
              <span className="text-ink-muted uppercase">Status:</span>
              <span className="text-lime-darker font-bold">QUEUED FOR 3D PRINTING</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted uppercase">Delivery:</span>
              <span className="font-bold text-ink">Express Air (All India)</span>
            </div>
          </div>

          <div className="text-xs text-ink-muted font-body leading-relaxed max-w-md mx-auto">
            We have begun preheating the print bed and compiling toolpaths for your objects.
            You will receive live tracking updates via SMS and email when your package ships.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link to={`/track-order?ref=${orderNumber}`} className="btn-primary text-xs">
              <Package className="w-4 h-4" /> Track Status
            </Link>
            <Link to="/shop" className="btn-secondary text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
