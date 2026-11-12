import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatINR } from "../lib/utils";
import {
  ShieldCheck,
  CreditCard,
  Truck,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
} from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh"
];

export function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState(user ? `${user.firstName} ${user.lastName}` : "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Bengaluru");
  const [state, setState] = useState("Karnataka");
  const [postalCode, setPostalCode] = useState("");
  const [customerNotes, setCustomerNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // If user has saved addresses, load default
    async function loadAddress() {
      if (user) {
        try {
          const res = await api.getCustomerAddresses();
          const def = res.addresses?.find((a: any) => a.is_default) || res.addresses?.[0];
          if (def) {
            setFullName(def.full_name);
            setPhone(def.phone);
            setAddressLine1(def.address_line_1);
            setAddressLine2(def.address_line_2 || "");
            setCity(def.city);
            setState(def.state);
            setPostalCode(def.postal_code);
          }
        } catch {
          // ignore
        }
      }
    }
    loadAddress();
  }, [user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="bg-cream min-h-screen py-24 text-center">
        <div className="card-brutal max-w-md mx-auto p-8">
          <h2 className="font-display font-black text-2xl uppercase mb-2">Cart is Empty</h2>
          <p className="font-mono text-xs text-ink-muted mb-6">
            There are no items currently in your tray to checkout.
          </p>
          <Link to="/shop" className="btn-primary text-xs">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      // 1. Create Server-Authoritative Order
      const orderPayload = {
        fullName,
        email,
        phone,
        addressLine1,
        addressLine2,
        city,
        state,
        postalCode,
        country: "India",
        couponCode: cart.appliedCoupon?.code,
        customerNotes,
      };

      const orderData = await api.createCheckoutOrder(orderPayload);

      // 2. Process Payment (Razorpay Live or Development Mock Adapter)
      if (orderData.isMockPayment || !(window as any).Razorpay) {
        // Run Development Mock Payment Flow
        const verifyRes = await api.verifyPayment({
          orderId: orderData.orderId,
          razorpayOrderId: orderData.razorpayOrderId,
          razorpayPaymentId: "pay_mock_" + Date.now(),
          razorpaySignature: "mock_signature_approved",
          isMock: true,
        });

        await refreshCart();
        navigate(`/order-success/${orderData.orderNumber}`);
      } else {
        // Open Razorpay Standard Checkout Modal
        const keyId =
          orderData.razorpayKeyId && orderData.razorpayKeyId !== "rzp_test_placeholder"
            ? orderData.razorpayKeyId
            : ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID || "rzp_test_TzPLspqdiriZ2Q");

        const options = {
          key: keyId,
          amount: orderData.amount,
          currency: orderData.currency || "INR",
          name: "THE TOYZ DEPT.",
          description: `Order #${orderData.orderNumber}`,
          order_id: orderData.razorpayOrderId,
          prefill: {
            name: orderData.customerDetails.name,
            email: orderData.customerDetails.email,
            contact: orderData.customerDetails.phone,
          },
          theme: {
            color: "#191919",
          },
          // Explicitly request all supported payment methods including UPI
          method: {
            upi: true,
            card: true,
            netbanking: true,
            wallet: true,
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              setErrorMsg("Payment cancelled by user. You can try again whenever you're ready.");
            },
          },
          handler: async (response: any) => {
            try {
              setLoading(true);
              await api.verifyPayment({
                orderId: orderData.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                isMock: false,
              });
              await refreshCart();
              navigate(`/order-success/${orderData.orderNumber}`);
            } catch (err: any) {
              setErrorMsg("Payment verification failed: " + err.message);
            } finally {
              setLoading(false);
            }
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", (response: any) => {
          setLoading(false);
          const desc = response.error?.description || "Payment failed or was declined.";
          setErrorMsg(`Payment Failed: ${desc} (Code: ${response.error?.code || "PAYMENT_ERROR"})`);
        });
        rzp.open();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to initiate order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b-2 border-ink pb-6 mb-10">
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            Secure Checkout<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase mt-1">
            Server-Authoritative Pricing • 256-Bit SSL Encrypted
          </p>
        </div>

        <form onSubmit={handleCheckoutSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* ── Left Column: Shipping Form ─────────────────────────── */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact */}
              <div className="card-brutal p-6 bg-cream-light space-y-4">
                <h3 className="font-display font-bold uppercase text-base border-b border-ink/20 pb-2">
                  1. Contact Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rohan@example.com"
                      required
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Phone Number (UPI/SMS) *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      required
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="card-brutal p-6 bg-cream-light space-y-4">
                <h3 className="font-display font-bold uppercase text-base border-b border-ink/20 pb-2">
                  2. Delivery Address
                </h3>

                <div className="space-y-4 font-mono text-xs">
                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Recipient Full Name *</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Rohan Verma"
                      required
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Address Line 1 *</label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      placeholder="House / Flat / Building No., Street"
                      required
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>

                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Address Line 2 (Optional)</label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      placeholder="Landmark, Area, Floor"
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        required
                        className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>

                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">State *</label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime cursor-pointer font-bold"
                      >
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">PIN Code *</label>
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="560038"
                        required
                        className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-ink font-bold uppercase mb-1">Delivery Notes (Optional)</label>
                    <input
                      type="text"
                      value={customerNotes}
                      onChange={(e) => setCustomerNotes(e.target.value)}
                      placeholder="Leave with security, call on arrival, etc."
                      className="w-full bg-cream border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Notice */}
              <div className="card-brutal p-6 bg-lime/25 border-2 border-ink space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 font-display font-bold uppercase text-ink text-sm">
                  <CreditCard className="w-5 h-5 text-ink" /> Payment Provider
                </div>
                <p className="text-ink-muted leading-relaxed">
                  Powered by Razorpay (UPI, Google Pay, PhonePe, Credit/Debit Cards, NetBanking).
                  In local dev test mode, a development payment adapter verifies transactions seamlessly.
                </p>
              </div>
            </div>

            {/* ── Right Column: Order Summary ────────────────────────── */}
            <div className="lg:col-span-5 space-y-6">
              <div className="card-brutal p-6 bg-cream-light space-y-4 shadow-brutal-lg">
                <h3 className="font-display font-black text-lg uppercase border-b-2 border-ink pb-3 flex items-center justify-between">
                  <span>Order Tray</span>
                  <span className="badge-lime text-xs font-mono">{cart.itemCount} Items</span>
                </h3>

                {/* Items preview list */}
                <div className="divide-y divide-ink/10 max-h-72 overflow-y-auto pr-1">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-cream border border-ink flex-shrink-0 overflow-hidden">
                          <img src={item.productImage || "/images/placeholder-product.svg"} alt={item.productName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-display font-bold text-xs uppercase line-clamp-1">{item.productName}</p>
                          <p className="font-mono text-[10px] text-ink-muted">Qty: {item.quantity} • {item.variantName || "Standard"}</p>
                        </div>
                      </div>
                      <span className="font-display font-bold text-xs text-ink">{formatINR(item.totalPrice)}</span>
                    </div>
                  ))}
                </div>

                {/* Cost Calculations */}
                <div className="border-t-2 border-ink pt-4 space-y-2 font-mono text-xs uppercase">
                  <div className="flex justify-between text-ink-muted">
                    <span>Subtotal</span>
                    <span className="font-bold text-ink">{formatINR(cart.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-ink-muted">
                    <span>Shipping</span>
                    <span className="font-bold text-ink">
                      {cart.shipping === 0 ? <span className="text-lime-darker font-bold">FREE</span> : formatINR(cart.shipping)}
                    </span>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between text-coral font-bold">
                      <span>Discount ({cart.appliedCoupon?.code})</span>
                      <span>-{formatINR(cart.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-display font-black pt-3 border-t-2 border-ink text-ink">
                    <span>Grand Total</span>
                    <span className="text-coral">{formatINR(cart.total)}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {errorMsg}
                  </div>
                )}

                {/* Statutory Compliance & Policy Agreement */}
                <div className="pt-2 border-t border-ink/10 space-y-2 font-mono text-[11px] text-ink/80">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      required
                      defaultChecked={true}
                      className="mt-0.5"
                    />
                    <span>
                      I have read and agree to the{" "}
                      <Link to="/terms" target="_blank" className="font-bold underline text-ink hover:text-coral">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link to="/privacy-policy" target="_blank" className="font-bold underline text-ink hover:text-coral">
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link to="/refund-policy" target="_blank" className="font-bold underline text-ink hover:text-coral">
                        Refund & Cancellation Policy
                      </Link>
                      . I understand that articulated products contain small parts and have a 48-hour transit inspection window.
                    </span>
                  </label>
                  <p className="text-[10px] text-ink-muted">
                    Prices are final in INR (₹). Exempt from GST under Section 22 of the CGST Act.
                  </p>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-sm"
                >
                  <Lock className="w-4 h-4" />
                  {loading ? "Verifying with Razorpay..." : `Pay ${formatINR(cart.total)}`}
                </button>

                <p className="font-mono text-[10px] text-ink-muted text-center uppercase tracking-wider">
                  🔒 Encrypted • Razorpay Certified • No Hidden Surcharges
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
