import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { formatINR, formatDate } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  Plus,
  Minus,
  Check,
  AlertCircle,
  ArrowRight,
  Share2,
} from "lucide-react";

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlistSaved, setWishlistSaved] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Shiprocket Pincode Check State
  const [deliveryPincode, setDeliveryPincode] = useState("");
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<any>(null);

  const handleCheckPincode = async () => {
    if (deliveryPincode.length !== 6) return;
    setPincodeLoading(true);
    setPincodeResult(null);
    try {
      const res = await api.checkShippingServiceability(deliveryPincode);
      setPincodeResult(res);
    } catch {
      setPincodeResult({ available: false, message: "Could not verify delivery right now" });
    } finally {
      setPincodeLoading(false);
    }
  };

  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProduct() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        const prod = res.product;
        setProduct(prod);

        // Select primary image
        const primary = prod.images?.find((img: any) => img.is_primary) || prod.images?.[0];
        setSelectedImage(primary?.url || "/images/placeholder-product.svg");

        // Select first active variant
        if (prod.variants && prod.variants.length > 0) {
          setSelectedVariant(prod.variants[0]);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-cream min-h-screen py-24 flex items-center justify-center">
        <div className="card-brutal p-8 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-ink border-t-lime rounded-full animate-spin mx-auto" />
          <p className="font-mono text-xs uppercase font-bold">Retrieving Spec Data...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-cream min-h-screen py-24 text-center">
        <div className="card-brutal max-w-md mx-auto p-8">
          <h2 className="font-display font-black text-2xl uppercase mb-2">Object Not Found</h2>
          <p className="font-mono text-xs text-ink-muted mb-6">
            The requested 3D model specification does not exist in our catalog.
          </p>
          <Link to="/shop" className="btn-primary text-xs">
            Return to Catalogue
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.base_price + (selectedVariant?.price_modifier || 0);
  const isOutOfStock = selectedVariant ? selectedVariant.stock <= 0 : false;
  const isLowStock = selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= selectedVariant.low_stock_threshold;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
  };

  const handleBuyNow = () => {
    addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      quantity,
    });
    navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      if (wishlistSaved) {
        await api.removeFromWishlist(product.id);
        setWishlistSaved(false);
      } else {
        await api.addToWishlist(product.id);
        setWishlistSaved(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setReviewSubmitting(true);
    try {
      await api.submitReview({
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        body: reviewBody,
      });
      setReviewSuccess(true);
      setReviewTitle("");
      setReviewBody("");
    } catch (err: any) {
      alert(err.message || "Could not submit review");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Breadcrumb Navigation ──────────────────────────────────── */}
        <div className="flex items-center gap-2 font-mono text-xs text-ink-muted uppercase mb-8">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:underline">Catalogue</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category_slug}`} className="hover:underline">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-ink font-bold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* ── Product Main Layout Grid ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 pb-16 border-b-2 border-ink">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="card-brutal bg-cream-light p-2 sm:p-4 aspect-square flex items-center justify-center relative overflow-hidden">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.compare_price && product.compare_price > currentPrice && (
                <div className="absolute top-4 left-4">
                  <span className="badge-coral text-xs py-1 px-2.5 font-bold shadow-brutal-sm">
                    SAVE {formatINR(product.compare_price - currentPrice)}
                  </span>
                </div>
              )}

              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-2.5 border-2 border-ink shadow-brutal-sm transition-all ${
                  wishlistSaved ? "bg-coral text-cream" : "bg-cream text-ink hover:bg-cream-dark"
                }`}
                aria-label="Save to wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlistSaved ? "fill-cream" : ""}`} />
              </button>
            </div>

            {/* Thumbnails row */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img: any) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`w-20 h-20 border-2 flex-shrink-0 bg-cream-light p-1 transition-all ${
                      selectedImage === img.url
                        ? "border-ink shadow-brutal"
                        : "border-ink/30 hover:border-ink opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img.url} alt={img.alt_text || "spec thumbnail"} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Tactile Aura Highlights */}
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="card-brutal p-3 bg-cream-light text-center">
                <Sparkles className="w-4 h-4 mx-auto mb-1 text-lime-darker" />
                <p className="font-mono text-[10px] font-bold uppercase text-ink">+999 Desk Aura</p>
                <p className="font-mono text-[9px] text-ink-muted">Immediate presence</p>
              </div>
              <div className="card-brutal p-3 bg-cream-light text-center">
                <Cpu className="w-4 h-4 mx-auto mb-1 text-ink" />
                <p className="font-mono text-[10px] font-bold uppercase text-ink">ADHD Approved</p>
                <p className="font-mono text-[9px] text-ink-muted">10/10 tactile joints</p>
              </div>
              <div className="card-brutal p-3 bg-cream-light text-center">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-coral" />
                <p className="font-mono text-[10px] font-bold uppercase text-ink">Coworker Magnet</p>
                <p className="font-mono text-[9px] text-ink-muted">High theft risk</p>
              </div>
            </div>
          </div>

          {/* Right Column: Purchasing Options */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="badge-lime text-xs mb-2">
                {product.category_name} // 3D SPEC
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight mt-1 mb-2">
                {product.name}
              </h1>

              {/* Pricing Display */}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="font-display font-black text-3xl text-ink">
                  {formatINR(currentPrice)}
                </span>
                {product.compare_price && (
                  <span className="font-mono text-base text-ink-muted line-through">
                    {formatINR(product.compare_price)}
                  </span>
                )}
                <span className="font-mono text-xs text-lime-darker font-bold">
                  Net Final Price • GST Exempt
                </span>
              </div>
            </div>

            {/* Short Narrative */}
            <p className="text-sm text-ink-muted font-body leading-relaxed border-t border-ink/15 pt-4">
              {product.short_description || product.description}
            </p>

            {/* Tactical Zoom Meeting Hazard Warning */}
            <div className="p-3 bg-coral/15 border-2 border-coral font-mono text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-coral-dark uppercase">
                <span>⚠️</span> Tactical Meeting Hazard
              </div>
              <p className="text-ink-muted text-[11px] leading-relaxed">
                Aggressively satisfying. Fidgeting with this during 9 AM Zoom calls may cause complete loss of focus on whatever slide deck your manager is presenting.
              </p>
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold uppercase text-ink">Color / Edition:</span>
                  <span className="text-coral font-bold">{selectedVariant?.name}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.variants.map((v: any) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 text-left border-2 font-mono text-xs transition-all ${
                        selectedVariant?.id === v.id
                          ? "bg-ink text-cream border-ink shadow-brutal-sm"
                          : "bg-cream-light text-ink border-ink/40 hover:border-ink"
                      }`}
                    >
                      <div className="font-bold uppercase flex items-center justify-between">
                        <span>{v.name}</span>
                        {v.price_modifier !== 0 && (
                          <span className="text-[10px] opacity-80">
                            +{formatINR(v.price_modifier)}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] opacity-70 mt-1">
                        {v.stock > 0 ? `${v.stock} in stock` : "Sold Out"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Availability Callout */}
            <div className="font-mono text-xs">
              {isOutOfStock ? (
                <div className="p-3 bg-coral/20 border border-coral text-coral-dark font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> This edition is currently sold out. Slicing next batch.
                </div>
              ) : isLowStock ? (
                <div className="p-2.5 bg-lime/40 border border-ink text-ink font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-coral" /> Only {selectedVariant?.stock} units left in this colorway!
                </div>
              ) : (
                <div className="flex items-center gap-2 text-lime-darker font-bold">
                  <Check className="w-4 h-4" /> In Stock & Ready for Immediate Dispatch
                </div>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border-2 border-ink bg-cream-light shadow-brutal-sm">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={isOutOfStock || quantity <= 1}
                    className="p-3 hover:bg-cream-dark disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-sm font-bold px-4">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={isOutOfStock || (selectedVariant && quantity >= selectedVariant.stock)}
                    className="p-3 hover:bg-cream-dark disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="btn-primary flex-1 py-3 text-sm cursor-pointer"
                >
                  Add to Tray +
                </button>
              </div>

              {/* Instant Buy Now Button */}
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-dark w-full py-3.5 text-sm cursor-pointer"
              >
                Instant Buy Drop ⚡ <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Live Shiprocket Pincode Serviceability */}
            <div className="card-brutal p-3.5 bg-cream-light border-2 border-ink text-xs font-mono">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold uppercase text-[11px] text-ink flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-lime-darker" /> Check Express Courier Delivery
                </span>
                <span className="text-[10px] text-ink-muted">Shiprocket Network</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={deliveryPincode}
                  onChange={(e) => setDeliveryPincode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="Enter 6-digit PIN (e.g. 560038)"
                  className="flex-1 bg-cream border-2 border-ink px-3 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCheckPincode}
                  disabled={pincodeLoading || deliveryPincode.length !== 6}
                  className="btn-dark py-1.5 px-4 text-[11px] uppercase font-mono disabled:opacity-40"
                >
                  {pincodeLoading ? "Checking..." : "Check"}
                </button>
              </div>
              {pincodeResult && (
                <div className="mt-2.5 pt-2 border-t border-ink/20 text-xs">
                  {pincodeResult.available ? (
                    <p className="text-lime-darker font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-lime-darker" />
                      Serviceable! Est. {pincodeResult.recommendedCourier?.estimatedDeliveryDays || "2-3"} Days delivery via {pincodeResult.recommendedCourier?.courierName || "Bluedart / Delhivery"}
                    </p>
                  ) : (
                    <p className="text-coral font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-coral" />
                      {pincodeResult.message || "Pincode not currently serviceable."}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Technical Specifications Table */}
            <div className="card-brutal bg-cream-light p-4 space-y-2.5 font-mono text-xs border-2 border-ink">
              <p className="font-display font-bold uppercase tracking-wider text-ink border-b border-ink/20 pb-1.5">
                Technical Specifications
              </p>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-ink-muted">Filament Material:</span>
                <span className="font-bold text-ink">{product.material || "PLA+ High Density"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-ink-muted">Physical Dimensions:</span>
                <span className="font-bold text-ink">{product.dimensions || "See scale spec"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-ink-muted">Finished Weight:</span>
                <span className="font-bold text-ink">{product.weight ? `${product.weight}g` : "Approx 160g"}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-ink/10">
                <span className="text-ink-muted">Layer Height:</span>
                <span className="font-bold text-ink">0.12mm (Ultra High Detail)</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-ink-muted">Origin Studio:</span>
                <span className="font-bold text-ink">Bengaluru, India</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Product Full Description & Narrative ───────────────────── */}
        <div className="py-16 border-b-2 border-ink grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
              DESIGN MANIFESTO
            </p>
            <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
              Behind the Object
            </h2>
          </div>
          <div className="lg:col-span-8 space-y-4 text-ink/80 font-body text-sm sm:text-base leading-relaxed">
            <p>{product.description}</p>
            <p>
              Each production unit is 3D printed with zero infill acceleration artifacts. We inspect
              each mechanical joint and clean support interfaces by hand before sonic bath degreasing.
              The result is a substantial, tactile desk object designed to be touched, posed, and displayed.
            </p>
          </div>
        </div>

        {/* ── Customer Reviews & Field Reports ───────────────────────── */}
        <div className="py-16 border-b-2 border-ink">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-2 border-ink">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
                FIELD REPORTS ({product.reviews?.length || 0})
              </p>
              <h2 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight">
                Customer Reviews
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev: any) => (
                  <div key={rev.id} className="card-brutal p-5 bg-cream-light">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-coral">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-coral" />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-ink-muted">
                        {formatDate(rev.created_at)}
                      </span>
                    </div>
                    <h4 className="font-display font-bold text-sm uppercase mb-1">{rev.title}</h4>
                    <p className="text-xs text-ink-muted font-body leading-relaxed mb-3">{rev.body}</p>
                    <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-ink/10">
                      <span className="font-bold text-ink">
                        {rev.first_name} {rev.last_name ? rev.last_name[0] + "." : ""}
                      </span>
                      {rev.is_verified ? (
                        <span className="badge-lime text-[9px]">Verified Purchaser</span>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="card-brutal p-6 bg-cream-light text-center">
                  <p className="font-mono text-xs text-ink-muted">
                    No field reports submitted yet for this model specification. Be the first to review!
                  </p>
                </div>
              )}
            </div>

            {/* Leave a Review Form */}
            <div className="lg:col-span-5">
              <div className="card-brutal p-6 bg-cream-light">
                <h3 className="font-display font-black text-base uppercase mb-1">
                  Submit Field Report
                </h3>
                <p className="font-mono text-xs text-ink-muted mb-4 uppercase">
                  Verified customer impressions & tolerances
                </p>

                {reviewSuccess ? (
                  <div className="bg-lime p-4 border border-ink font-mono text-xs text-ink font-bold">
                    ✓ Field report submitted successfully! Thank you for the feedback.
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-3 font-mono text-xs">
                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            className={`p-1.5 border border-ink ${
                              reviewRating >= star ? "bg-coral text-cream" : "bg-cream text-ink"
                            }`}
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">Review Headline</label>
                      <input
                        type="text"
                        value={reviewTitle}
                        onChange={(e) => setReviewTitle(e.target.value)}
                        placeholder="e.g. Flawless joints, insane finish"
                        required
                        className="w-full bg-cream border border-ink p-2 text-xs focus:outline-none focus:border-lime"
                      />
                    </div>

                    <div>
                      <label className="block text-ink font-bold uppercase mb-1">Review Body</label>
                      <textarea
                        value={reviewBody}
                        onChange={(e) => setReviewBody(e.target.value)}
                        placeholder="Details on joint movement, desk fit, surface texture..."
                        rows={3}
                        required
                        className="w-full bg-cream border border-ink p-2 text-xs focus:outline-none focus:border-lime"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="btn-primary w-full py-2.5 text-xs"
                    >
                      {reviewSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── Related Product Recommendations ───────────────────────── */}
        {product.related && product.related.length > 0 && (
          <div className="pt-16">
            <div className="flex items-center justify-between mb-8 pb-4 border-b-2 border-ink">
              <h2 className="font-display font-black text-2xl uppercase tracking-tight">
                Complementary Objects
              </h2>
              <Link to="/shop" className="font-display font-bold text-xs uppercase hover:text-coral">
                Browse All
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {product.related.map((rel: any) => (
                <Link
                  key={rel.id}
                  to={`/products/${rel.slug}`}
                  className="card-brutal-hover p-3 sm:p-4 bg-cream-light group block"
                >
                  <div className="aspect-square bg-cream border border-ink mb-3 overflow-hidden">
                    <img
                      src={rel.primary_image || "/images/placeholder-product.svg"}
                      alt={rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm uppercase truncate group-hover:text-coral">
                    {rel.name}
                  </h4>
                  <p className="font-display font-black text-sm text-ink mt-1">
                    {formatINR(rel.base_price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
        {/* Sticky Mobile Add-to-Cart Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-cream border-t-2 border-ink p-3 shadow-brutal-lg flex items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] text-ink-muted uppercase block leading-none">Total</span>
            <span className="font-display font-black text-lg text-ink">{formatINR(currentPrice)}</span>
          </div>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="btn-primary py-2.5 px-3.5 text-xs uppercase"
            >
              Add +
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className="btn-dark py-2.5 px-3.5 text-xs uppercase"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
