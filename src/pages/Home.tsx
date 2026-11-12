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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime text-ink border border-ink text-xs font-mono font-bold uppercase tracking-wider shadow-brutal-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Next-Gen 3D-Printed Collectibles
              </div>

              <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter leading-[0.95]">
                THINGS YOU <br />
                <span className="text-lime underline decoration-coral decoration-4 underline-offset-8">
                  DIDN'T KNOW
                </span>{" "}
                <br />
                YOU NEEDED<span className="text-coral">.</span>
              </h1>

              <p className="text-cream/80 text-base sm:text-lg max-w-xl font-body leading-relaxed">
                We engineer tactile mechanical toys, architectural desk organizers,
                and custom industrial FDM fabrication. Designed in-house, sliced with obsession,
                and printed layer-by-layer in Bengaluru.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to="/shop" className="btn-primary text-base py-4 px-8">
                  Explore Drops <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/custom-prints" className="btn-secondary text-base py-4 px-8 bg-transparent text-cream border-cream hover:bg-cream hover:text-ink">
                  Upload 3D Model
                </Link>
              </div>

              {/* Stat badges */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-cream/20">
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-lime">0.12mm</p>
                  <p className="font-mono text-xs text-cream/60 uppercase">Layer Precision</p>
                </div>
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-coral">48-Hour</p>
                  <p className="font-mono text-xs text-cream/60 uppercase">Dispatch Target</p>
                </div>
                <div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-cream">100%</p>
                  <p className="font-mono text-xs text-cream/60 uppercase">Recyclable PLA+</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="card-brutal bg-cream text-ink p-4 sm:p-6 shadow-brutal-xl relative">
                {/* Hero Product Badge */}
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="badge-coral text-xs py-1 px-3 shadow-brutal-sm font-bold">
                    FLAGSHIP DROP
                  </span>
                </div>

                <div className="aspect-square bg-cream-light border-2 border-ink overflow-hidden relative mb-4">
                  <img
                    src="/images/products/dragon-1.svg"
                    alt="Articulated Cyber Dragon"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-ink text-cream px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                    48-SEGMENT FLUID JOINT
                  </div>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-mono uppercase text-ink-muted">COLLECTIBLES // SPEC 001</span>
                    <h3 className="font-display font-bold text-xl uppercase">Articulated Cyber Dragon</h3>
                  </div>
                  <span className="font-display font-black text-xl text-coral">₹1,299</span>
                </div>

                <p className="text-xs text-ink-muted mb-4 font-body">
                  Interlocking ball-and-socket micro-vertebrae with liquid smooth coiling dynamics.
                </p>

                <Link
                  to="/products/articulated-cyber-dragon"
                  className="btn-dark w-full text-xs py-3"
                >
                  View Details & Order Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Marquee Ribbon ─────────────────────────────────────────── */}
        <div className="bg-lime text-ink py-2.5 border-t-2 border-ink overflow-hidden select-none">
          <div className="flex whitespace-nowrap animate-marquee font-display font-black text-xs sm:text-sm tracking-widest uppercase gap-8">
            <span>⚡ THINGS YOU DIDN'T KNOW YOU NEEDED</span>
            <span>✦ ARTICULATED TOYS & COLLECTIBLES</span>
            <span>⚡ DESK OBJECTS & INDUSTRIAL TOOLS</span>
            <span>✦ ARCHITECTURAL HOME STUFF</span>
            <span>⚡ CUSTOM STL & 3MF FABRICATION</span>
            <span>✦ FREE EXPRESS SHIPPING OVER ₹999</span>
            <span>⚡ THINGS YOU DIDN'T KNOW YOU NEEDED</span>
            <span>✦ ARTICULATED TOYS & COLLECTIBLES</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES SECTION ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b-2 border-ink">
          <div>
            <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
              CURATED DEPARTMENTS
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
              Browse by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 font-display font-bold text-sm uppercase tracking-wider hover:text-coral transition-colors flex items-center gap-1"
          >
            All Products <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={cat.id}
              to={cat.slug === "custom-creations" ? "/custom-prints" : `/shop?category=${cat.slug}`}
              className="card-brutal-hover p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold text-ink-muted">
                    0{idx + 1} //
                  </span>
                  {cat.slug === "custom-creations" ? (
                    <span className="badge-coral text-[10px]">Instant Quote</span>
                  ) : (
                    <span className="badge-lime text-[10px]">{cat.product_count} Items</span>
                  )}
                </div>
                <h3 className="font-display font-black text-xl uppercase mb-2 group-hover:text-coral transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed font-body">
                  {cat.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-ink/15 flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-ink group-hover:text-coral">
                <span>Explore Department</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (LATEST DROPS) ───────────────────────── */}
      <section className="bg-cream-light border-y-2 border-ink py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b-2 border-ink">
            <div>
              <p className="font-mono text-xs font-bold uppercase text-lime-darker tracking-widest mb-1">
                HOT OFF THE PRINT BED
              </p>
              <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
                Featured Drops
              </h2>
            </div>
            <Link
              to="/shop"
              className="mt-4 sm:mt-0 font-display font-bold text-sm uppercase tracking-wider hover:text-coral transition-colors flex items-center gap-1"
            >
              View Full Drop List <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <div key={product.id} className="card-brutal-hover flex flex-col justify-between overflow-hidden group">
                <Link to={`/products/${product.slug}`} className="block relative aspect-square bg-cream border-b-2 border-ink overflow-hidden">
                  <img
                    src={product.primary_image || "/images/placeholder-product.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.compare_price && product.compare_price > product.base_price && (
                    <div className="absolute top-2 left-2">
                      <span className="badge-coral text-[10px]">SAVE {formatINR(product.compare_price - product.base_price)}</span>
                    </div>
                  )}
                  {product.material && (
                    <div className="absolute bottom-2 left-2 bg-ink text-cream text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase">
                      {product.material}
                    </div>
                  )}
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
                      {product.category_name}
                    </span>
                    <Link
                      to={`/products/${product.slug}`}
                      className="block font-display font-bold text-base uppercase leading-snug hover:text-coral transition-colors mt-0.5 line-clamp-1"
                    >
                      {product.name}
                    </Link>
                    <p className="text-xs text-ink-muted line-clamp-2 mt-1 font-body">
                      {product.short_description || product.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-ink/15 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-display font-black text-lg text-ink">
                        {formatINR(product.base_price)}
                      </span>
                      {product.compare_price && (
                        <span className="font-mono text-xs text-ink-muted line-through">
                          {formatINR(product.compare_price)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                      className="px-3 py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink border border-ink text-xs font-display font-bold uppercase transition-all shadow-brutal-sm"
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CUSTOM 3D PRINTING SERVICE CALLOUT ─────────────────────── */}
      <section className="bg-lime border-b-2 border-ink py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-brutal bg-ink text-cream p-8 sm:p-12 shadow-brutal-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime text-ink text-xs font-mono font-bold uppercase tracking-wider">
                  <UploadCloud className="w-4 h-4" /> Customer CAD Fabrications
                </div>
                <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-cream">
                  HAVE YOUR OWN 3D MODEL? <br />
                  WE FABRICATE IT WITH INDUSTRIAL PRECISION<span className="text-coral">.</span>
                </h2>
                <p className="text-cream/80 text-sm sm:text-base font-body max-w-2xl leading-relaxed">
                  Upload your proprietary STL or 3MF file. Choose from high-density PLA+, PETG,
                  carbon-fiber composite, or SLA tough resin. Our engineering team slices your geometry,
                  calculates exact print hours, and provides a formal commercial quotation in 24 hours.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/custom-prints" className="btn-primary text-sm">
                    Upload Model & Get Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/about" className="btn-secondary bg-transparent text-cream border-cream hover:bg-cream hover:text-ink text-sm">
                    View Tolerances & Specs
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 bg-ink-light p-6 border-2 border-cream/20 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-cream/10">
                  <span className="text-cream/60">Supported Formats:</span>
                  <span className="text-lime font-bold">.STL / .3MF / .OBJ / .STEP</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream/10">
                  <span className="text-cream/60">Build Volume:</span>
                  <span className="text-cream">Up to 350 x 350 x 400 mm</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-cream/10">
                  <span className="text-cream/60">Layer Height:</span>
                  <span className="text-cream">0.08mm - 0.28mm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-cream/60">Materials:</span>
                  <span className="text-coral font-bold">PLA+, PETG, CF, Tough Resin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3D PRINTING PROCESS WORKFLOW ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
            HOW IT WORKS
          </p>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
            From Pixels to Product
          </h2>
          <p className="text-ink-muted text-sm mt-2 font-body">
            Every object undergoing production at THE TOYZ DEPT. follows a strict 4-stage engineering protocol.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card-brutal p-6 relative">
            <span className="font-mono font-black text-3xl text-coral block mb-3">01 //</span>
            <h3 className="font-display font-black text-lg uppercase mb-2">CAD Design</h3>
            <p className="text-xs text-ink-muted font-body leading-relaxed">
              Every prototype starts with organic parametric modeling or mechanical joint design, optimized to print without weak layer orientations.
            </p>
          </div>

          <div className="card-brutal p-6 relative">
            <span className="font-mono font-black text-lime-darker block mb-3">02 //</span>
            <h3 className="font-display font-black text-lg uppercase mb-2">Micro Slicing</h3>
            <p className="text-xs text-ink-muted font-body leading-relaxed">
              We tune flow rates, seam positions, infill gyroid density, and cooling speeds for each distinct filament spool before toolpath compilation.
            </p>
          </div>

          <div className="card-brutal p-6 relative">
            <span className="font-mono font-black text-ink block mb-3">03 //</span>
            <h3 className="font-display font-black text-lg uppercase mb-2">FDM Printing</h3>
            <p className="text-xs text-ink-muted font-body leading-relaxed">
              Industrial grade direct-drive extruders deposit virgin filament onto calibrated textured PEI beds over 4 to 28 continuous machine hours.
            </p>
          </div>

          <div className="card-brutal p-6 relative">
            <span className="font-mono font-black text-coral block mb-3">04 //</span>
            <h3 className="font-display font-black text-lg uppercase mb-2">QC & Finish</h3>
            <p className="text-xs text-ink-muted font-body leading-relaxed">
              Every print is manually deburred, joint-flexed for smooth articulation, sanitized, and packed in shock-resistant cardboard boxes.
            </p>
          </div>
        </div>
      </section>

      {/* ── GENUINE REVIEWS SHOWCASE ───────────────────────────────── */}
      <section className="bg-cream-dark border-t-2 border-ink py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="font-mono text-xs font-bold uppercase text-coral tracking-widest mb-1">
              PROVEN TOLERANCE
            </p>
            <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight">
              Customer Field Reports
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="card-brutal bg-cream p-6">
              <div className="flex items-center gap-1 text-coral mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-coral" />
                ))}
              </div>
              <h4 className="font-display font-bold text-base uppercase mb-2">
                "Exceptional stability & clean brutalist look"
              </h4>
              <p className="text-xs text-ink-muted font-body leading-relaxed mb-4">
                "Holds my heavy planar magnetic headphones with zero sag. The matte carbon fiber finish looks insanely good on my walnut desk setup. Cleanest 3D print I have ever held."
              </p>
              <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-ink/15">
                <span className="font-bold">Rohan Verma (Bengaluru)</span>
                <span className="badge-lime text-[10px]">Verified Buyer</span>
              </div>
            </div>

            <div className="card-brutal bg-cream p-6">
              <div className="flex items-center gap-1 text-coral mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-coral" />
                ))}
              </div>
              <h4 className="font-display font-bold text-base uppercase mb-2">
                "Mesmerizing articulation right out of the box"
              </h4>
              <p className="text-xs text-ink-muted font-body leading-relaxed mb-4">
                "The tolerance on each dragon segment is unbelievable. Completely fluid right out of the box with zero stiff joints. Solid weight and metallic silk shine."
              </p>
              <div className="flex items-center justify-between text-xs font-mono pt-3 border-t border-ink/15">
                <span className="font-bold">Arjun Mehta (Mumbai)</span>
                <span className="badge-lime text-[10px]">Verified Buyer</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
