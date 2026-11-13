import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { formatINR, formatDate, getOrderStatusBadge } from "../lib/utils";
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react";

const STAGES = [
  { key: "pending", label: "Placed" },
  { key: "payment_confirmed", label: "Paid" },
  { key: "processing", label: "Toolpaths Sliced" },
  { key: "printing", label: "3D Printing" },
  { key: "quality_check", label: "QC Checked" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

export function TrackOrderPage() {
  const [searchParams] = useSearchParams();
  const [orderQuery, setOrderQuery] = useState(searchParams.get("ref") || "");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const searchOrder = async (queryToSearch: string) => {
    if (!queryToSearch.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setOrder(null);

    try {
      // Fetch order by number using public check or customer order endpoint
      const res = await fetch(`/api/checkout/track?number=${encodeURIComponent(queryToSearch.trim())}`);
      if (res.ok) {
        const data = await res.json() as any;
        setOrder(data.order);
      } else {
        // Fallback: search in customer orders if logged in
        setErrorMsg("Order not found. Please verify your order reference number (e.g. TTD-2026-XXXX).");
      }
    } catch {
      setErrorMsg("Unable to retrieve order details at this moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialRef = searchParams.get("ref");
    if (initialRef) {
      setOrderQuery(initialRef);
      searchOrder(initialRef);
    }
  }, [searchParams]);

  const getStageIndex = (status: string) => {
    const idx = STAGES.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 1;
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-2 border-ink pb-6 mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral text-cream border border-ink text-xs font-mono font-bold uppercase tracking-wider shadow-brutal-sm mb-3">
            <Package className="w-3.5 h-3.5" />
            LIVE DISPATCH RADAR
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-ink">
            Track Your Drop<span className="text-lime">.</span>
          </h1>
          <p className="text-ink-muted text-xs sm:text-sm font-mono uppercase mt-2 max-w-md mx-auto">
            Check real-time 3D print progress, quality check, and courier dispatch.
          </p>
        </div>

        {/* ── Search Input ───────────────────────────────────────────── */}
        <div className="card-brutal p-4 sm:p-6 bg-cream-light mb-8 max-w-xl mx-auto shadow-brutal">
          <form
            onSubmit={(e) => { e.preventDefault(); searchOrder(orderQuery); }}
            className="flex flex-col sm:flex-row gap-2.5 w-full"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Order Reference (e.g. TTD-2026-8912)"
                required
                className="w-full bg-cream border-2 border-ink px-3.5 py-3 font-mono text-xs sm:text-sm uppercase font-bold text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full sm:w-auto py-3 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "LOCATING..." : "TRACK DROP"}</span>
            </button>
          </form>
          {errorMsg && (
            <p className="font-mono text-xs text-coral font-bold mt-3 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
            </p>
          )}
        </div>

        {/* ── Order Status Result ────────────────────────────────────── */}
        {order && (
          <div className="card-brutal bg-cream-light p-6 sm:p-8 space-y-8 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-ink gap-4">
              <div>
                <span className="badge-lime text-xs mb-1">Active Shipment</span>
                <h2 className="font-display font-black text-2xl uppercase">
                  Order #{order.order_number}
                </h2>
                <p className="font-mono text-xs text-ink-muted">
                  Placed on {formatDate(order.created_at)}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className={getOrderStatusBadge(order.status).className + " px-3 py-1 font-mono text-xs uppercase"}>
                  {getOrderStatusBadge(order.status).label}
                </span>
                <p className="font-display font-black text-lg text-ink mt-1">
                  {formatINR(order.total_amount)}
                </p>
              </div>
            </div>

            {/* Visual Timeline Stepper */}
            <div className="py-4">
              <p className="font-mono text-xs font-bold uppercase text-ink mb-6">
                Fabrication & Delivery Timeline:
              </p>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {STAGES.map((stage, idx) => {
                  const currentIdx = getStageIndex(order.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div key={stage.key} className="text-center space-y-1.5">
                      <div
                        className={`w-8 h-8 mx-auto flex items-center justify-center font-mono text-xs font-bold border-2 border-ink transition-all ${
                          isCurrent
                            ? "bg-lime text-ink shadow-brutal-sm animate-pulse"
                            : isCompleted
                            ? "bg-ink text-cream"
                            : "bg-cream-dark text-ink-muted border-ink/30"
                        }`}
                      >
                        {isCompleted ? "✓" : idx + 1}
                      </div>
                      <p className={`font-mono text-[9px] uppercase leading-tight ${
                        isCurrent ? "font-bold text-ink" : "text-ink-muted"
                      }`}>
                        {stage.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking Info if Shipped */}
            {order.tracking_number && (
              <div className="p-4 bg-lime/30 border-2 border-ink flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <p className="font-bold text-ink flex items-center gap-1.5">
                    <Truck className="w-4 h-4" /> Air Courier Waybill: {order.tracking_number}
                  </p>
                  <p className="text-ink-muted text-[11px]">Shipped with DTDC / BlueDart Express</p>
                </div>
                {order.tracking_url && (
                  <a
                    href={order.tracking_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-dark text-[11px] py-1.5 px-3"
                  >
                    Open Courier Portal <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Destination Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-ink/20 font-mono text-xs">
              <div>
                <p className="font-bold text-ink uppercase mb-1">Destination Address:</p>
                <p className="text-ink-muted">{order.shipping_name}</p>
                <p className="text-ink-muted">{order.shipping_address_1}</p>
                {order.shipping_address_2 && <p className="text-ink-muted">{order.shipping_address_2}</p>}
                <p className="text-ink-muted">{order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</p>
              </div>

              <div>
                <p className="font-bold text-ink uppercase mb-1">Customer Care Support:</p>
                <p className="text-ink-muted">Need to modify shipping notes or rush delivery?</p>
                <p className="text-ink font-bold mt-1">support@thetoyzdept.in</p>
                <p className="text-ink font-bold">+91 80 4123 9900</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
