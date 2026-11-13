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

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="border-b-2 border-ink pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-ink-muted uppercase mb-1">
              <Link to="/" className="hover:underline">Home</Link>
              <span>/</span>
              <span className="text-ink font-bold">Catalogue</span>
              {selectedCategory && (
                <>
                  <span>/</span>
                  <span className="text-coral font-bold">{selectedCategory}</span>
                </>
              )}
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name || "Department"
                : "All Objects & Drops"}
            </h1>
            <p className="font-mono text-xs text-ink-muted uppercase mt-1">
              {products.length} Plastic Dopamine Drops • Dispatched from Bengaluru
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => updateParam("search", e.target.value)}
              placeholder="Filter by keyword..."
              className="w-full bg-cream-light border-2 border-ink px-3 py-2 pl-9 font-body text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
            <Search className="w-4 h-4 text-ink-muted absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                onClick={() => updateParam("search", "")}
                className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Filter & Sort Bar ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 bg-cream-light p-4 border-2 border-ink shadow-brutal-sm">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="font-mono text-xs uppercase text-ink-muted font-bold mr-1 flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Dept:
            </span>
            <button
              onClick={() => updateParam("category", "")}
              className={`px-3 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                selectedCategory === ""
                  ? "bg-ink text-cream border-ink shadow-brutal-sm"
                  : "bg-cream text-ink border-ink hover:bg-cream-dark"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                className={`px-3 py-1 text-xs font-mono font-bold uppercase border-2 transition-all ${
                  selectedCategory === cat.slug
                    ? "bg-ink text-lime border-ink shadow-brutal-sm"
                    : "bg-cream text-ink border-ink hover:bg-cream-dark"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-xs">
            <span className="text-ink-muted flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
            </span>
            <select
              value={selectedSort}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-cream border-2 border-ink px-2.5 py-1 font-mono text-xs font-bold uppercase focus:outline-none focus:ring-1 focus:ring-lime cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Arrivals</option>
            </select>
          </div>
        </div>

        {/* ── Active Filter Tags ─────────────────────────────────────── */}
        {(selectedCategory || searchQuery) && (
          <div className="flex items-center gap-2 mb-6 font-mono text-xs">
            <span className="text-ink-muted uppercase">Active Filters:</span>
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 bg-lime text-ink px-2 py-0.5 border border-ink font-bold">
                Dept: {selectedCategory}
                <button onClick={() => updateParam("category", "")} className="hover:text-coral">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 bg-lime text-ink px-2 py-0.5 border border-ink font-bold">
                Query: "{searchQuery}"
                <button onClick={() => updateParam("search", "")} className="hover:text-coral">
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={clearAllFilters}
              className="text-coral underline hover:text-coral-dark uppercase font-bold ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* ── Product Grid ───────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-12">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-brutal p-4 animate-pulse space-y-3">
                <div className="aspect-square bg-cream-dark border border-ink" />
                <div className="h-4 bg-cream-dark w-2/3" />
                <div className="h-3 bg-cream-dark w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="card-brutal bg-cream-light p-12 text-center max-w-lg mx-auto my-12 space-y-4">
            <span className="badge-coral text-xs">404 DROPS NOT FOUND</span>
            <h3 className="font-display font-black text-2xl uppercase mb-1">Nothing Here.</h3>
            <p className="font-mono text-xs text-ink-muted leading-relaxed">
              Either you typed pure gibberish, or our 3D printers haven't fabricated that yet. Hit the reset button to browse the good stuff.
            </p>
            <button onClick={clearAllFilters} className="btn-primary text-xs cursor-pointer">
              Reset Filters & Feed Dopamine ⚡
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="card-brutal-hover flex flex-col justify-between overflow-hidden group bg-cream-light"
              >
                {/* Image */}
                <Link
                  to={`/products/${product.slug}`}
                  className="block relative aspect-square bg-cream border-b-2 border-ink overflow-hidden"
                >
                  <img
                    src={product.primary_image || "/images/placeholder-product.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.compare_price && product.compare_price > product.base_price && (
                    <div className="absolute top-2 left-2">
                      <span className="badge-coral text-[9px] sm:text-[10px]">
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

                {/* Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-wider">
                      {product.category_name}
                    </span>
                    <Link
                      to={`/products/${product.slug}`}
                      className="block font-display font-bold text-sm sm:text-base uppercase leading-snug hover:text-coral transition-colors mt-0.5 line-clamp-1"
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
                      <span className="text-[9px] font-mono font-bold text-ink-muted uppercase ml-0.5">Editions</span>
                    </div>
                    <p className="hidden sm:block text-xs text-ink-muted line-clamp-2 mt-1 font-body">
                      {product.short_description || product.description}
                    </p>
                  </div>

                  <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-ink/15 flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
                      <span className="font-display font-black text-base sm:text-lg text-ink">
                        {formatINR(product.base_price)}
                      </span>
                      {product.compare_price && (
                        <span className="font-mono text-[10px] sm:text-xs text-ink-muted line-through">
                          {formatINR(product.compare_price)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart({ productId: product.id, quantity: 1 })}
                      className="px-2.5 sm:px-3 py-1.5 bg-ink text-cream hover:bg-lime hover:text-ink border border-ink text-xs font-display font-bold uppercase transition-all shadow-brutal-sm flex items-center gap-1"
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
