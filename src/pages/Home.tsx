import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { formatINR } from "../lib/utils";
import { useCart } from "../context/CartContext";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  CheckCircle,
  ShieldCheck,
  Star,
  UploadCloud,
  ChevronRight,
  Truck,
  RotateCcw,
  Plus,
  Box,
} from "lucide-react";

export function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({ featured: true }),
          api.getCategories(),
        ]);
        setFeaturedProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.error("Failed to load home data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="bg-cream">
      {/* ── HERO SECTION ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2 border-ink bg-ink text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime text-ink border border-ink text-xs font-mono font-bold uppercase tracking-wider shadow-brutal-sm">
                <Sparkles className="w-3.5 h-3.5" />
                +999 DESK AURA // TACTILE 3D DROPS
              </div>

              <h1 className="font-display font-black text-3xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.95]">
                YOUR DESK IS <br className="hidden sm:inline" />
                <span className="text-lime underline decoration-coral decoration-4 underline-offset-8">
                  DEPRESSING
                </span>{" "}
                <br className="hidden sm:inline" />
                WE FIXED THAT<span className="text-coral">.</span>
              </h1>

              <p className="text-cream/80 text-sm sm:text-lg max-w-xl mx-auto lg:mx-0 font-body leading-relaxed">
                Tactile articulated dragons, kinetic gear cubes, and unapologetic desk companions designed to cure corporate burnout, satisfy your ADHD, and make your coworkers thoroughly jealous.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link to="/shop" className="btn-primary w-full sm:w-auto text-sm sm:text-base py-3.5 sm:py-4 px-6 sm:px-8 text-center flex items-center justify-center gap-2 cursor-pointer">
                  <span>Feed Your Dopamine</span> <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                <Link to="/custom-prints" className="btn-secondary w-full sm:w-auto text-sm sm:text-base py-3.5 sm:py-4 px-6 sm:px-8 bg-transparent text-cream border-cream hover:bg-cream hover:text-ink text-center cursor-pointer">
                  Upload Custom STL
                </Link>
              </div>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-6 border-t border-cream/20 text-center">
                <div>
                  <p className="font-display font-black text-xl sm:text-3xl text-lime">48+</p>
                  <p className="font-mono text-[10px] sm:text-xs text-cream/60 uppercase">Fluid Joints</p>
                </div>
                <div>
                  <p className="font-display font-black text-xl sm:text-3xl text-coral">10/10</p>
                  <p className="font-mono text-[10px] sm:text-xs text-cream/60 uppercase">Tactile Dopamine</p>
                </div>
                <div>
                  <p className="font-display font-black text-xl sm:text-3xl text-cream">24–48h</p>
                  <p className="font-mono text-[10px] sm:text-xs text-cream/60 uppercase">Dispatched Quick</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="card-brutal bg-cream text-ink p-3 sm:p-5 shadow-brutal-xl relative hover:shadow-brutal transition-all animate-float">
                {/* Hero Product Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="badge-coral text-xs py-1 px-3 shadow-brutal-sm font-bold animate-pulse">
                    FLAGSHIP DROP
                  </span>
                </div>

                <div className="aspect-square bg-cream-light border-2 border-ink overflow-hidden relative mb-3">
                  <img
                    src="/images/products/dragon-1.jpg"
                    alt="Articulated Cyber Dragon"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-ink text-cream px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                    48-Segment Fluid Joints
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-ink-muted">COLLECTIBLES // SPEC 001</span>
                    <h3 className="font-display font-bold text-lg sm:text-xl uppercase">Articulated Cyber Dragon</h3>
                  </div>
                  <span className="font-display font-black text-lg sm:text-xl text-coral">₹1,299</span>
                </div>

                <p className="text-xs text-ink-muted mb-3 font-body line-clamp-2">
                  Interlocking ball-and-socket micro-vertebrae in dual-color emerald silk PLA+.
                </p>

                <Link
                  to="/products/articulated-cyber-dragon"
                  className="btn-dark w-full text-xs py-2.5 sm:py-3 text-center block"
                >
                  View Details & Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee Ribbon ─────────────────────────────────────────── */}
        <div className="bg-lime text-ink py-2.5 sm:py-3 border-t-2 border-ink overflow-hidden whitespace-nowrap font-mono text-xs font-bold uppercase tracking-widest select-none flex">
          <div className="inline-flex gap-8 animate-marquee">
            <span>✦ ARTICULATED DRAGONS</span>
            <span>✦ CLICKY GEAR CUBES</span>
            <span>✦ TACTILE PLASTIC DOPAMINE</span>
            <span>✦ YOUR COWORKERS WILL TRY TO STEAL THIS</span>
            <span>✦ 100% ADHD APPROVED</span>
            <span>✦ MECHA FLEXI REX</span>
            <span>✦ +999 DESK AURA</span>
            <span>✦ PRINTED IN BENGALURU</span>
            <span>✦ DISPATCHED BEFORE REGRET</span>
          </div>
          <div className="inline-flex gap-8 animate-marquee" aria-hidden="true">
            <span>✦ ARTICULATED DRAGONS</span>
            <span>✦ CLICKY GEAR CUBES</span>
            <span>✦ TACTILE PLASTIC DOPAMINE</span>
            <span>✦ YOUR COWORKERS WILL TRY TO STEAL THIS</span>
            <span>✦ 100% ADHD APPROVED</span>
            <span>✦ MECHA FLEXI REX</span>
            <span>✦ +999 DESK AURA</span>
            <span>✦ PRINTED IN BENGALURU</span>
            <span>✦ DISPATCHED BEFORE REGRET</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION (Mobile Friendly 2-col) ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-2 border-ink">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
              CURATED DEPARTMENTS
            </p>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-2 sm:mt-0 font-display font-bold text-xs sm:text-sm uppercase tracking-wider hover:text-coral transition-colors flex items-center gap-1"
          >
            All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={cat.slug === "custom-creations" ? "/custom-prints" : `/shop?category=${cat.slug}`}
              className="card-brutal-hover p-4 sm:p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-ink-muted">
                    0{idx + 1} //
                  </span>
                  {cat.slug === "custom-creations" ? (
                    <span className="badge-coral text-[9px] sm:text-[10px]">Instant Quote</span>
                  ) : (
                    <span className="badge-lime text-[9px] sm:text-[10px]">{cat.product_count} Items</span>
                  )}
                </div>
                <h3 className="font-display font-black text-base sm:text-xl uppercase mb-1 sm:mb-2 group-hover:text-coral transition-colors line-clamp-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] sm:text-xs text-ink-muted leading-relaxed font-body line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-ink/15 flex items-center justify-between text-[11px] sm:text-xs font-display font-bold uppercase tracking-wider text-ink group-hover:text-coral">
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (LATEST DROPS - 2 COL MOBILE) ─────────── */}
      <section className="bg-cream-light border-y-2 border-ink py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b-2 border-ink">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-lime-darker tracking-widest mb-1">
                HOT OFF THE PRINT BED
              </p>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
                Featured Drops
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-2 sm:mt-0 font-display font-bold text-xs sm:text-sm uppercase tracking-wider hover:text-coral transition-colors flex items-center gap-1"
            >
              View Full Drop List <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="card-brutal-hover flex flex-col justify-between overflow-hidden group bg-cream">
                <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-cream-light border-b-2 border-ink overflow-hidden">
                  <img
                    src={product.primary_image || "/images/placeholder-product.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {product.compare_price && product.compare_price > product.base_price && (
                    <div className="absolute top-2 left-2">
                      <span className="badge-coral text-[8px] sm:text-[10px]">
                        SAVE {formatINR(product.compare_price - product.base_price)}
                      </span>
                    </div>
                  )}
                  {product.material && (
                    <div className="hidden sm:block absolute bottom-2 left-2 bg-ink text-cream text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                      {product.material}
                    </div>
                  )}
                </Link>

                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-wider block">
                      {product.category_name}
                    </span>
                    <Link
                      to={`/products/${product.slug}`}
                      className="block font-display font-bold text-xs sm:text-base uppercase leading-snug hover:text-coral transition-colors mt-0.5 line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    {/* Aesthetic Filament Colorway Swatches */}
                    <div className="flex items-center gap-1.5 my-1.5">
                      <span className="w-2.5 h-2.5 rounded-full border border-ink/40 bg-zinc-900 shadow-sm" title="Obsidian Matte Black" />
                      <span className="w-2.5 h-2.5 rounded-full border border-ink/40 bg-gradient-to-tr from-amber-400 to-emerald-400 shadow-sm" title="Silk Dual-Tone Coextrusion" />
                      <span className="w-2.5 h-2.5 rounded-full border border-ink/40 bg-lime-400 shadow-sm" title="Signal Neon Lime" />
                      <span className="w-2.5 h-2.5 rounded-full border border-ink/40 bg-slate-200 shadow-sm" title="Bauhaus Chalk White" />
                      <span className="w-2.5 h-2.5 rounded-full border border-ink/40 bg-amber-700 shadow-sm" title="Metallic Cast Bronze" />
                      <span className="text-[8px] font-mono font-bold text-ink-muted uppercase ml-0.5">Editions</span>
                    </div>
                    <p className="hidden sm:block text-xs text-ink-muted line-clamp-2 mt-1 font-body">
                      {product.short_description || product.description}
                    </p>
                  </div>

                  <div className="pt-2.5 sm:pt-4 mt-2.5 sm:mt-4 border-t border-ink/15 flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                      <span className="font-display font-black text-sm sm:text-lg text-ink">
                        {formatINR(product.base_price)}
                      </span>
                      {product.compare_price && (
                        <span className="font-mono text-[9px] sm:text-xs text-ink-muted line-through">
                          {formatINR(product.compare_price)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink border border-ink text-[10px] sm:text-xs font-display font-bold uppercase transition-all shadow-brutal-sm flex items-center gap-1"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOM 3D PRINTING SERVICE CALLOUT ─────────────────────── */}
      <section className="bg-lime border-b-2 border-ink py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-brutal bg-ink text-cream p-6 sm:p-12 shadow-brutal-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime text-ink text-xs font-mono font-bold uppercase tracking-wider">
                  <UploadCloud className="w-4 h-4" /> Got A Weird 3D Idea?
                </div>
                <h2 className="font-display font-black text-2xl sm:text-4xl lg:text-5xl uppercase tracking-tight text-cream">
                  Have an STL or STEP file? <br />
                  <span className="text-lime">We Print It In Bengaluru.</span>
                </h2>
                <p className="text-cream/80 text-xs sm:text-base font-body max-w-2xl leading-relaxed">
                  Got a custom CAD prototype, mechanical bracket, or desk figurine? Drop your .STL or .STEP file. We check wall thickness, calculate exact material costs, and deliver a clean quotation in under 2 hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-mono text-cream/70">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime" />
                    <span>0.12mm Ultra Detail</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime" />
                    <span>PLA+, Silk Dual-Tone, PETG</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-lime" />
                    <span>Express Pan-India Delivery</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <Link
                  to="/custom-prints"
                  className="btn-primary text-center py-4 text-xs sm:text-sm uppercase tracking-wider cursor-pointer"
                >
                  Upload 3D Model Now ⚡
                </Link>
                <Link
                  to="/pricing"
                  className="btn-secondary text-center py-3 bg-transparent text-cream border-cream hover:bg-cream hover:text-ink text-xs uppercase cursor-pointer"
                >
                  View Slicing Rates
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CUSTOMER SOCIAL PROOF / REVIEWS ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
            VERIFIED DESK IMPRESSIONS
          </p>
          <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tight">
            Loved by Desk Dwellers & Makers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-brutal p-6 bg-cream-light space-y-3">
            <div className="flex items-center gap-1 text-coral">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-coral" />
              ))}
            </div>
            <h4 className="font-display font-bold uppercase text-sm">
              "10/10 Desk Security"
            </h4>
            <p className="font-mono text-xs text-ink/80 leading-relaxed">
              "My coworker reached for my Cyber Dragon during standup and I nearly bit his hand off. The dual-color green shift is mesmerizing. Best purchase of 2026."
            </p>
            <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ink">Aditya K.</span>
              <span className="badge-lime text-[9px]">Verified Collector (Bengaluru)</span>
            </div>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3">
            <div className="flex items-center gap-1 text-coral">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-coral" />
              ))}
            </div>
            <h4 className="font-display font-bold uppercase text-sm">
              "Meeting Survival Tool"
            </h4>
            <p className="font-mono text-xs text-ink/80 leading-relaxed">
              "I haven't listened to a single word in our 9 AM Zoom calls because I was twirling this gear cube. Aggressively satisfying tactile click. Everyone asks where I got it."
            </p>
            <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ink">Sneha M.</span>
              <span className="badge-lime text-[9px]">Verified Buyer (Gurugram)</span>
            </div>
          </div>

          <div className="card-brutal p-6 bg-cream-light space-y-3">
            <div className="flex items-center gap-1 text-coral">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-coral" />
              ))}
            </div>
            <h4 className="font-display font-bold uppercase text-sm">
              "+500 Desk Aura Instantly"
            </h4>
            <p className="font-mono text-xs text-ink/80 leading-relaxed">
              "The Mecha Flexi Rex stands guard beside my dual monitors judging my pull requests. Arrived in 2 days from Bengaluru packed like a military artifact."
            </p>
            <div className="pt-2 border-t border-ink/10 flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-ink">Tanmay P.</span>
              <span className="badge-lime text-[9px]">Verified Buyer (Pune)</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
