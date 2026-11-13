import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "../lib/api";
import { formatINR } from "../lib/utils";
import { useCart } from "../context/CartContext";
import { Search, SlidersHorizontal, ArrowUpDown, X, Plus } from "lucide-react";

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const selectedCategory = searchParams.get("category") || "";
  const searchQuery = searchParams.get("search") || "";
  const selectedSort = searchParams.get("sort") || "featured";

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          api.getProducts({
            category: selectedCategory || undefined,
            search: searchQuery || undefined,
            sort: selectedSort,
          }),
          api.getCategories(),
        ]);
        setProducts(prodRes.products || []);
        setCategories(catRes.categories || []);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory, searchQuery, selectedSort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "collectibles":
        return "🐉";
      case "desk-objects":
        return "⚡";
      case "home-stuff":
        return "🏠";
      default:
        return "✦";
    }
  };

  const getProductAuraBadge = (product: any) => {
    const slug = product.slug?.toLowerCase() || "";
    if (slug.includes("dragon")) return "✨ +999 DESK AURA";
    if (slug.includes("rex")) return "⚡ ADHD APPROVED";
    if (slug.includes("serpent")) return "🔥 48 FLUID JOINTS";
    if (slug.includes("cube")) return "🔊 CLICKY DOPAMINE";
    if (slug.includes("planter") || slug.includes("caddy")) return "✦ DESK MONOLITH";
    if (slug.includes("mount") || slug.includes("stand") || slug.includes("dock")) return "⚡ WORKSTATION ESSENTIAL";
    if (slug.includes("token") || slug.includes("keychain")) return "⚡ TEST DROP";
    return "✦ BENGALURU SPEC";
  };

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header Banner ───────────────────────────────────────── */}
        <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-[11px] text-ink-muted uppercase">
              <Link to="/" className="hover:underline hover:text-ink">Store</Link>
              <span>/</span>
              <span className="text-ink font-bold">Catalog Archive</span>
              {selectedCategory && (
                <>
                  <span>/</span>
                  <span className="text-coral font-bold uppercase">{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-ink">
              Store Drops & Archive<span className="text-coral">.</span>
            </h1>
            <p className="font-mono text-xs text-ink-muted uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime border border-ink animate-pulse" />
              <span>{products.length} Tactile Drops Fabricated in Bengaluru // Ready for Dispatch</span>
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam("search", e.target.value)}
              placeholder="Search dragons, fidgets, planters..."
              className="w-full bg-cream-light border-2 border-ink px-4 py-2.5 pl-10 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-lime shadow-brutal-sm"
            />
            <Search className="w-4 h-4 text-ink-muted absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                onClick={() => updateParam("search", "")}
                className="absolute right-3 top-3 text-ink-muted hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Dynamic Category Filter Dock & Sort Bar ──────────────────── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-cream-light p-3.5 sm:p-4 border-2 border-ink shadow-brutal-sm">
          {/* Category Filter Pills (Scrollable on mobile) */}
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 items-center no-scrollbar">
            <button
              onClick={() => updateParam("category", "")}
              className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                selectedCategory === ""
                  ? "bg-ink text-lime border-ink shadow-brutal-sm"
                  : "bg-cream text-ink border-ink/40 hover:border-ink hover:bg-cream-dark"
              }`}
            >
              <span>✦</span>
              <span>All Drops</span>
              <span className="text-[10px] opacity-75">({products.length})</span>
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                className={`px-3.5 py-1.5 text-xs font-mono font-bold uppercase border-2 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  selectedCategory === cat.slug
                    ? "bg-ink text-lime border-ink shadow-brutal-sm"
                    : "bg-cream text-ink border-ink/40 hover:border-ink hover:bg-cream-dark"
                }`}
              >
                <span>{getCategoryIcon(cat.slug)}</span>
                <span>{cat.name}</span>
              </button>
            ))}

            <Link
              to="/custom-prints"
              className="px-3.5 py-1.5 text-xs font-mono font-bold uppercase border-2 border-dashed border-ink bg-lime/30 hover:bg-lime text-ink transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <span>🖨️</span>
              <span>Upload Custom STL</span>
            </Link>
          </div>

          {/* Sort Selector */}
          <div className="flex items-center justify-between md:justify-end gap-2 font-mono text-xs pt-2 md:pt-0 border-t md:border-t-0 border-ink/15">
            <span className="text-ink-muted flex items-center gap-1 text-[11px] uppercase font-bold">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-cream border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-lime cursor-pointer shadow-brutal-xs"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Drops</option>
            </select>
          </div>
        </div>

        {/* ── Active Filter Indicator Tags ─────────────────────────────── */}
        {(selectedCategory || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 font-mono text-xs">
            <span className="text-ink-muted uppercase text-[11px] font-bold">Active Filter:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-lime text-ink px-2.5 py-1 border border-ink font-bold shadow-brutal-xs">
                <span>Dept: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}</span>
                <button onClick={() => updateParam("category", "")} className="hover:text-coral cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-lime text-ink px-2.5 py-1 border border-ink font-bold shadow-brutal-xs">
                <span>Query: "{searchQuery}"</span>
                <button onClick={() => updateParam("search", "")} className="hover:text-coral cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-coral underline hover:text-coral-dark uppercase font-bold text-xs ml-2 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* ── Product Grid ───────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 py-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-brutal p-4 animate-pulse space-y-3 bg-cream-light">
                <div className="aspect-square bg-cream-dark border border-ink/30" />
                <div className="h-4 bg-cream-dark w-2/3" />
                <div className="h-3 bg-cream-dark w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card-brutal bg-cream-light p-10 sm:p-14 text-center max-w-lg mx-auto my-12 space-y-4 shadow-brutal-xl">
            <span className="badge-coral text-xs">404 DROPS NOT FOUND</span>
            <h3 className="font-display font-black text-2xl uppercase mb-1">Nothing Here.</h3>
            <p className="font-mono text-xs text-ink-muted leading-relaxed">
              Either you typed pure gibberish, or our 3D printers haven't fabricated that yet. Hit the reset button to browse the catalog.
            </p>
            <button onClick={clearAllFilters} className="btn-primary text-xs cursor-pointer">
              Reset Filters & Feed Dopamine ⚡
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-brutal-hover flex flex-col justify-between overflow-hidden group bg-cream-light hover:-translate-y-1 hover:shadow-brutal-lg transition-all duration-200"
              >
                {/* Image & Badges */}
                <Link
                  to={`/products/${product.slug}`}
                  className="block relative aspect-square bg-cream border-b-2 border-ink overflow-hidden"
                >
                  <img
                    src={product.primary_image || "/images/placeholder-product.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Aura / Spec Badge */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="badge-ink text-[8px] sm:text-[9px] py-0.5 px-1.5 font-bold shadow-sm">
                      {getProductAuraBadge(product)}
                    </span>
                    {product.compare_price && product.compare_price > product.base_price && (
                      <span className="badge-coral text-[8px] sm:text-[9px] py-0.5 px-1.5 font-bold shadow-sm">
                        SAVE {formatINR(product.compare_price - product.base_price)}
                      </span>
                    )}
                  </div>

                  {product.material && (
                    <div className="hidden sm:block absolute bottom-2 left-2 bg-ink text-cream text-[9px] font-mono font-bold px-1.5 py-0.5 uppercase border border-cream/20">
                      {product.material}
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
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
                      <span className="text-[8px] sm:text-[9px] font-mono font-bold text-ink-muted uppercase ml-0.5">Editions</span>
                    </div>

                    <p className="hidden sm:block text-xs text-ink-muted line-clamp-2 mt-1 font-body">
                      {product.short_description || product.description}
                    </p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-2 sm:pt-3 border-t border-ink/15 flex items-center justify-between">
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
                      className="px-2.5 sm:px-3 py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink border-2 border-ink text-[11px] sm:text-xs font-display font-bold uppercase transition-all shadow-brutal-sm flex items-center gap-1 cursor-pointer active:scale-95"
                      aria-label={`Add ${product.name} to cart`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
