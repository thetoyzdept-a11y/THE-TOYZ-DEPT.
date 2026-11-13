import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { formatINR } from "../../lib/utils";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, Truck } from "lucide-react";

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeItem, refreshCart } = useCart();
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      await refreshCart(couponInput.trim());
      setCouponInput("");
    } catch {
      setCouponError("Invalid or expired coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleCheckoutClick = () => {
    closeCart();
    navigate("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/75 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream border-l-2 border-ink shadow-brutal-xl flex flex-col justify-between">
          {/* ── Drawer Header ─────────────────────────────────────────── */}
          <div className="p-5 border-b-2 border-ink flex items-center justify-between bg-cream-light">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-ink" />
              <h2 className="font-display font-black text-lg uppercase tracking-wider">
                Cart ({cart?.itemCount || 0})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 hover:bg-cream-dark border border-ink transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Free Shipping Progress Bar ────────────────────────────── */}
          {cart && (
            <div className="bg-ink text-cream px-5 py-3 border-b-2 border-ink">
              {cart.amountToFreeShipping > 0 ? (
                <div>
                  <div className="flex items-center justify-between text-xs font-mono uppercase mb-1.5">
                    <span className="flex items-center gap-1.5 text-lime font-bold">
                      <Truck className="w-3.5 h-3.5" />
                      Add {formatINR(cart.amountToFreeShipping)} for Free Shipping
                    </span>
                    <span>{formatINR(cart.freeShippingThreshold)}</span>
                  </div>
                  <div className="w-full bg-cream/20 h-2 border border-cream/30">
                    <div
                      className="bg-lime h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, Math.round((cart.subtotal / cart.freeShippingThreshold) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs font-mono uppercase text-lime font-bold">
                  <Truck className="w-4 h-4" />
                  ✨ Free Express Shipping Unlocked! The universe approves.
                </div>
              )}
            </div>
          )}

          {/* ── Items List ────────────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-ink/15">
            {!cart || cart.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-cream-dark border-2 border-ink flex items-center justify-center mb-4 shadow-brutal-sm">
                  <ShoppingBag className="w-8 h-8 text-ink/40" />
                </div>
                <h3 className="font-display font-black text-lg uppercase mb-1">
                  Your Tray is Dry
                </h3>
                <p className="font-mono text-xs text-ink-muted mb-6 max-w-xs leading-relaxed">
                  Your desk called. It's still boring. Drop an articulated beast or fidget gear to fix it.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="btn-primary text-xs cursor-pointer"
                >
                  Feed Your Desk Dopamine ⚡
                </Link>
              </div>
            ) : (
              cart.items.map((item) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-cream-light border-2 border-ink flex-shrink-0 overflow-hidden relative">
                    <img
                      src={item.productImage || "/images/placeholder-product.svg"}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="font-display font-bold text-sm uppercase leading-tight hover:text-coral transition-colors line-clamp-1"
                        >
                          {item.productName}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-ink-muted hover:text-coral p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variantName && (
                        <p className="font-mono text-xs text-ink-muted uppercase mt-0.5">
                          {item.variantName}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-ink bg-cream-light">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                          className="p-1 hover:bg-cream-dark text-ink"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs font-bold px-2.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-cream-dark text-ink"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Total */}
                      <span className="font-display font-black text-sm text-ink">
                        {formatINR(item.totalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Drawer Footer & Checkout ──────────────────────────────── */}
          {cart && cart.items.length > 0 && (
            <div className="p-5 border-t-2 border-ink bg-cream-light space-y-4">
              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon (e.g. WELCOME10)"
                    className="w-full bg-cream border border-ink px-3 py-1.5 text-xs font-mono uppercase focus:outline-none focus:border-lime"
                  />
                  <Tag className="w-3.5 h-3.5 text-ink-muted absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={couponLoading || !couponInput.trim()}
                  className="px-3 py-1.5 bg-ink text-cream font-mono text-xs uppercase font-bold hover:bg-lime hover:text-ink transition-colors disabled:opacity-50"
                >
                  Apply
                </button>
              </form>

              {couponError && (
                <p className="text-[11px] font-mono text-coral font-bold">{couponError}</p>
              )}

              {cart.appliedCoupon && (
                <div className="flex items-center justify-between bg-lime/30 border border-lime-dark p-2 text-xs font-mono">
                  <span className="font-bold text-ink">✓ {cart.appliedCoupon.code}</span>
                  <span className="text-ink">-{formatINR(cart.appliedCoupon.discount)}</span>
                </div>
              )}

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs font-mono uppercase border-t border-ink/20 pt-3">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="font-bold text-ink">{formatINR(cart.subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Estimated Shipping</span>
                  <span className="font-bold text-ink">
                    {cart.shipping === 0 ? (
                      <span className="text-lime-darker font-bold">FREE</span>
                    ) : (
                      formatINR(cart.shipping)
                    )}
                  </span>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-coral font-bold">
                    <span>Discount</span>
                    <span>-{formatINR(cart.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-display font-black pt-2 border-t-2 border-ink text-ink">
                  <span>Total</span>
                  <span>{formatINR(cart.total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="btn-primary w-full py-3.5 text-sm cursor-pointer"
              >
                Lock In The Drop 🚀
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
