import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Gift,
  Check,
  Copy,
  Star,
  ArrowRight,
  ShieldCheck,
  Instagram,
  AlertCircle,
  Package,
  Layers,
  Heart,
  Tag,
} from "lucide-react";
import { api } from "../lib/api";

const PRODUCT_CATEGORIES = [
  {
    id: "cat_articulated",
    label: "Articulated Creatures & Beasts",
    desc: "Multi-jointed dragons, flexi scorpions, and tactile serpents that print in place.",
    icon: "🐉",
  },
  {
    id: "cat_fidgets",
    label: "Kinetic Desk Fidgets & Toys",
    desc: "Gear cubes, haptic sliders, and clicky mechanical desk companions.",
    icon: "⚡",
  },
  {
    id: "cat_desk_gear",
    label: "Brutalist Workspace Organizers",
    desc: "Pen docks, headphone stands, phone mounts, and magnetic cable docks.",
    icon: "📐",
  },
  {
    id: "cat_decor",
    label: "Architectural Planters & Living Decor",
    desc: "Gyroid concrete vessels, geometric desk planters, and brutalist pots.",
    icon: "🌿",
  },
];

const CURRENT_DROPS = [
  "Cyber Dragon (Articulated Jointed Leviathan)",
  "Flexi Rex (Desktop Kinetic Dinosaur)",
  "Crystal Serpent (Coiling Multi-Segment Snake)",
  "Concrete Planter (Brutalist Architectural Vessel)",
  "Cable Dock & Stand (Precision Workspace Tools)",
  "I'm new to THE TOYZ DEPT. and exploring!",
];

const FILAMENT_FINISHES = [
  "Dual-Tone Silk (Color-shifting golden sheen)",
  "UV Glow-in-the-Dark (Night luminescence)",
  "Matte Carbon Fiber Black (Ultra-tactile stealth)",
  "Metallic Cast Bronze & Copper (Industrial aged finish)",
  "Bauhaus Chalk White & Signal Orange",
  "Iridescent Violet & Cyber Lime",
];

const PRICE_PREFERENCES = [
  "Under ₹799 (Everyday tactile desk fidgets)",
  "₹799 – ₹1,499 (Standard articulated collector drops)",
  "₹1,499 – ₹2,999 (Large multi-part centerpieces)",
  "₹2,999+ (Exclusive limited-batch commission art)",
];

export function CustomerSurveyPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    favorite_category: PRODUCT_CATEGORIES[0].label,
    favorite_product: CURRENT_DROPS[0],
    desired_colors: [] as string[],
    price_preference: PRICE_PREFERENCES[1],
    product_ideas: "",
    rating: 5,
    feedback: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [resultData, setResultData] = useState<{
    raffleCode: string;
    couponCode: string;
    couponDiscount: string;
    message: string;
    isExisting?: boolean;
  } | null>(null);

  const [copiedRaffle, setCopiedRaffle] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // AI Idea Sparker State
  const [sparkPrompt, setSparkPrompt] = useState("");
  const [sparkLoading, setSparkLoading] = useState(false);
  const [sparkedIdea, setSparkedIdea] = useState<{
    title: string;
    concept: string;
    suggestedColors: string;
    tag: string;
  } | null>(null);

  const handleSparkIdea = async () => {
    setSparkLoading(true);
    try {
      const res = await api.sparkAiSurveyIdea(sparkPrompt, formData.favorite_category);
      if (res && res.idea) {
        setSparkedIdea(res.idea);
      }
    } catch (err: any) {
      alert("AI Idea Spark failed: " + (err.message || "Please try again"));
    } finally {
      setSparkLoading(false);
    }
  };

  const toggleColorChoice = (color: string) => {
    setFormData((prev) => {
      const exists = prev.desired_colors.includes(color);
      if (exists) {
        return { ...prev, desired_colors: prev.desired_colors.filter((c) => c !== color) };
      } else {
        return { ...prev, desired_colors: [...prev.desired_colors, color] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErrorMessage("Please provide a valid email address so we can notify you if you win!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitSurvey({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        instagram: formData.instagram.trim() || undefined,
        favorite_category: formData.favorite_category,
        favorite_product: formData.favorite_product,
        desired_colors: formData.desired_colors.join(", ") || undefined,
        price_preference: formData.price_preference,
        product_ideas: formData.product_ideas.trim() || undefined,
        rating: formData.rating,
        feedback: formData.feedback.trim() || undefined,
      });

      setResultData({
        raffleCode: res.raffleCode,
        couponCode: res.couponCode || "SURVEY15",
        couponDiscount: res.couponDiscount || "15% OFF",
        message: res.message,
        isExisting: res.isExisting,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit survey. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, type: "raffle" | "coupon") => {
    navigator.clipboard.writeText(text);
    if (type === "raffle") {
      setCopiedRaffle(true);
      setTimeout(() => setCopiedRaffle(false), 2500);
    } else {
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Breadcrumb & Title */}
        <div className="border-b-2 border-ink pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="badge-coral text-xs flex items-center gap-1 font-mono font-bold">
              <Gift className="w-3.5 h-3.5" />
              MONTHLY RAFFLE GIVEAWAY
            </span>
            <span className="font-mono text-xs text-ink-muted">/</span>
            <span className="badge-lime text-xs font-mono font-bold">15% INSTANT REWARD</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-ink">
            Tell Us What To Print<span className="text-coral">.</span> Win A Free Drop<span className="text-lime-dark">!</span>
          </h1>
          <p className="font-mono text-xs sm:text-sm text-ink-muted uppercase mt-2 leading-relaxed">
            Take this 2-minute product survey to help shape future drops. You'll be automatically entered into our Monthly Collector Giveaway to win a free custom 3D print shipped to your door!
          </p>
        </div>

        {/* ── SUCCESS STATE: RAFFLE ENTRY & INSTANT COUPON ─────────────── */}
        {resultData ? (
          <div className="card-brutal bg-cream-light border-4 border-ink p-6 sm:p-10 space-y-8 shadow-brutal-xl animate-in fade-in duration-300">
            <div className="text-center space-y-3 border-b-2 border-ink pb-6">
              <div className="w-16 h-16 bg-lime border-2 border-ink rounded-full flex items-center justify-center mx-auto shadow-brutal-sm">
                <Sparkles className="w-8 h-8 text-ink animate-bounce" />
              </div>
              <h2 className="font-display font-black text-2xl sm:text-4xl uppercase text-ink">
                You're In The Draw 🎉
              </h2>
              <p className="font-mono text-xs sm:text-sm text-ink/80 max-w-xl mx-auto leading-relaxed">
                {resultData.message}
              </p>
            </div>

            {/* Official Raffle Ticket Card */}
            <div className="p-6 bg-cream border-2 border-ink shadow-brutal space-y-4">
              <div className="flex items-center justify-between border-b border-ink/20 pb-2">
                <span className="font-mono text-[11px] font-bold uppercase text-ink-muted flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-coral" />
                  Your Official Raffle Ticket Code
                </span>
                <span className="badge-lime text-[10px] font-bold">CONFIRMED ACTIVE</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ink text-cream p-4 border-2 border-ink">
                <div>
                  <p className="text-[10px] font-mono text-cream/60 uppercase">Ticket ID // Verified Entry</p>
                  <p className="font-display font-black text-2xl sm:text-3xl text-lime tracking-widest uppercase">
                    {resultData.raffleCode}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(resultData.raffleCode, "raffle")}
                  className="btn-primary py-2 px-4 text-xs font-mono font-bold uppercase flex items-center gap-1.5 cursor-pointer shadow-brutal-xs"
                >
                  {copiedRaffle ? <Check className="w-4 h-4 text-ink" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedRaffle ? "Copied!" : "Copy Ticket"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs text-ink/75 pt-1">
                <div className="bg-cream-light p-2.5 border border-ink/20">
                  <span className="block font-bold text-ink text-[11px] uppercase">Draw Date:</span>
                  <span>1st of every month</span>
                </div>
                <div className="bg-cream-light p-2.5 border border-ink/20">
                  <span className="block font-bold text-ink text-[11px] uppercase">Winner Prize:</span>
                  <span>Free Collector 3D Print Drop</span>
                </div>
                <div className="bg-cream-light p-2.5 border border-ink/20">
                  <span className="block font-bold text-ink text-[11px] uppercase">Announced On:</span>
                  <a
                    href="https://instagram.com/thetoyzdept"
                    target="_blank"
                    rel="noreferrer"
                    className="text-coral underline font-bold"
                  >
                    @thetoyzdept Instagram
                  </a>
                </div>
              </div>
            </div>

            {/* Instant Gratification Reward: 15% OFF Coupon */}
            <div className="card-brutal bg-lime/20 border-2 border-ink p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-ink text-lime flex items-center justify-center font-black text-sm border border-ink">
                  %
                </div>
                <div>
                  <h3 className="font-display font-black text-lg uppercase text-ink">
                    Instant Reward: 15% Off Your Next Order!
                  </h3>
                  <p className="font-mono text-xs text-ink-muted">
                    Don't wait for the giveaway draw — take 15% off any catalog drop immediately:
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-cream p-3 border-2 border-ink font-mono">
                <div className="flex items-center gap-3">
                  <span className="font-display font-black text-xl text-ink tracking-wider bg-cream-light px-3 py-1 border border-ink">
                    {resultData.couponCode}
                  </span>
                  <span className="text-xs text-ink-muted font-bold">
                    (15% Off Cart • No Minimum Requirement)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(resultData.couponCode, "coupon")}
                  className="btn-dark py-2 px-4 text-xs uppercase font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCoupon ? <Check className="w-4 h-4 text-lime" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedCoupon ? "Copied Coupon!" : "Copy Code"}</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link to="/shop" className="btn-primary text-xs py-3 text-center flex-1 font-black uppercase flex items-center justify-center gap-2">
                  <span>Explore Available Drops</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/track-order" className="btn-secondary text-xs py-3 text-center flex-1 font-bold uppercase">
                  Track Live Orders
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* ── MAIN SURVEY FORM ────────────────────────────────────────── */
          <form onSubmit={handleSubmit} className="space-y-8 font-mono">
            {/* Giveaway Prize Highlight Box */}
            <div className="p-5 bg-lime/20 border-2 border-ink shadow-brutal flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-lime text-ink flex items-center justify-center border-2 border-ink shadow-brutal-xs flex-shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display font-black text-base uppercase text-ink">
                    The Monthly Mystery Drop Giveaway
                  </h3>
                  <p className="text-xs text-ink/80 leading-relaxed">
                    Every month, we randomly select one survey participant to win an exclusive 3D printed piece (e.g. <strong>Cyber Dragon, Crystal Serpent, or Brutalist Dock</strong>) shipped 100% free with priority express courier.
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right sm:border-l-2 sm:border-ink/20 sm:pl-4">
                <span className="badge-coral text-[10px] uppercase font-bold">NEXT DRAW</span>
                <p className="font-display font-black text-sm text-ink mt-0.5">1ST OF NEXT MONTH</p>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-coral/20 border-2 border-coral text-coral-dark text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* QUESTION 1: Category Preference */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
                <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">1</span>
                <h2 className="font-display font-black text-base uppercase text-ink">
                  What type of 3D objects get you most excited? *
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRODUCT_CATEGORIES.map((cat) => {
                  const isSelected = formData.favorite_category === cat.label;
                  return (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormData({ ...formData, favorite_category: cat.label })}
                      className={`p-4 border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-lime border-ink shadow-brutal-sm font-bold"
                          : "bg-cream border-ink/40 hover:border-ink hover:bg-cream-dark"
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xl mb-1">
                        <span>{cat.icon}</span>
                        <span className="font-display font-bold text-xs uppercase text-ink">{cat.label}</span>
                      </div>
                      <p className="text-[11px] text-ink-muted leading-tight">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 2: Current Catalog Favorite */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
                <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">2</span>
                <h2 className="font-display font-black text-base uppercase text-ink">
                  Which piece from our current collection is your favorite?
                </h2>
              </div>

              <div className="space-y-2">
                {CURRENT_DROPS.map((drop) => {
                  const isSelected = formData.favorite_product === drop;
                  return (
                    <label
                      key={drop}
                      className={`flex items-center gap-3 p-3 border-2 transition-all cursor-pointer select-none text-xs ${
                        isSelected
                          ? "bg-ink text-cream border-ink font-bold"
                          : "bg-cream text-ink border-ink/30 hover:border-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="favorite_product"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, favorite_product: drop })}
                        className="accent-lime w-4 h-4"
                      />
                      <span>{drop}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 3: Colors & Materials Wishlist */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">3</span>
                  <h2 className="font-display font-black text-base uppercase text-ink">
                    What filament finishes should we introduce next?
                  </h2>
                </div>
                <span className="text-[10px] text-ink-muted uppercase">Select all that apply</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {FILAMENT_FINISHES.map((color) => {
                  const isSelected = formData.desired_colors.includes(color);
                  return (
                    <button
                      type="button"
                      key={color}
                      onClick={() => toggleColorChoice(color)}
                      className={`p-3 border-2 text-left text-xs transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-lime border-ink shadow-brutal-xs font-bold"
                          : "bg-cream border-ink/40 hover:border-ink"
                      }`}
                    >
                      <span>{color}</span>
                      <span className={`w-4 h-4 border border-ink flex items-center justify-center text-[10px] ${isSelected ? "bg-ink text-lime" : "bg-cream"}`}>
                        {isSelected ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 4: Budget Range */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
                <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">4</span>
                <h2 className="font-display font-black text-base uppercase text-ink">
                  What is your sweet-spot budget for desk companions?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {PRICE_PREFERENCES.map((price) => {
                  const isSelected = formData.price_preference === price;
                  return (
                    <label
                      key={price}
                      className={`p-3 border-2 transition-all cursor-pointer flex items-center gap-2.5 ${
                        isSelected
                          ? "bg-lime border-ink font-bold shadow-brutal-xs"
                          : "bg-cream border-ink/30 hover:border-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="price_preference"
                        checked={isSelected}
                        onChange={() => setFormData({ ...formData, price_preference: price })}
                        className="accent-ink w-4 h-4"
                      />
                      <span>{price}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 5: Dream Drop Idea with AI Concept Sparker */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center justify-between border-b-2 border-ink pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">5</span>
                  <h2 className="font-display font-black text-base uppercase text-ink">
                    Your Dream Drop: What should we 3D print next?
                  </h2>
                </div>
                <span className="badge-lime text-[10px] font-mono font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-ink" />
                  AI POWERED
                </span>
              </div>
              <p className="text-[11px] text-ink-muted">
                What kinetic gadget, articulated monster, desk tool, or brutalist concept do you wish existed? We build the best community ideas into real production drops!
              </p>

              {/* AI Drop Sparker Input Bar */}
              <div className="p-3 bg-cream border-2 border-ink shadow-brutal-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold text-ink flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-coral" />
                    Need Inspiration? Ask AI To Spark A 3D Concept:
                  </span>
                  <span className="text-[9px] font-mono text-ink-muted">GPT-4O-MINI</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sparkPrompt}
                    onChange={(e) => setSparkPrompt(e.target.value)}
                    placeholder="e.g. Steampunk scorpion, magnetic pen rest, mechanical fidget spinner..."
                    className="flex-1 bg-cream-light border border-ink px-2.5 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-lime"
                  />
                  <button
                    type="button"
                    disabled={sparkLoading}
                    onClick={handleSparkIdea}
                    className="btn-primary py-1.5 px-3 text-xs font-mono font-bold uppercase flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-brutal-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-ink" />
                    <span>{sparkLoading ? "Sparking..." : "Spark Idea ✨"}</span>
                  </button>
                </div>

                {sparkedIdea && (
                  <div className="mt-2 p-3 bg-lime/20 border-2 border-ink space-y-2 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-black text-sm uppercase text-ink">
                        {sparkedIdea.title}
                      </span>
                      <span className="badge-coral text-[9px] font-mono font-bold">
                        {sparkedIdea.tag || "3D Drop Concept"}
                      </span>
                    </div>
                    <p className="text-xs text-ink/90 font-mono leading-relaxed">
                      {sparkedIdea.concept}
                    </p>
                    {sparkedIdea.suggestedColors && (
                      <p className="text-[10px] text-ink-muted font-mono font-bold">
                        🎨 Recommended Palette: {sparkedIdea.suggestedColors}
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const formatted = `${sparkedIdea.title}: ${sparkedIdea.concept} (Palette: ${sparkedIdea.suggestedColors})`;
                        setFormData((prev) => ({ ...prev, product_ideas: formatted }));
                      }}
                      className="btn-dark py-1 px-2.5 text-[10px] uppercase font-mono font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3 text-lime" />
                      <span>Insert This Concept Into My Survey</span>
                    </button>
                  </div>
                )}
              </div>

              <textarea
                rows={3}
                value={formData.product_ideas}
                onChange={(e) => setFormData({ ...formData, product_ideas: e.target.value })}
                placeholder="e.g. A cyberpunk praying mantis with magnetic joints and pen holder claws..."
                className="w-full bg-cream border-2 border-ink p-3 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
              />
            </div>

            {/* QUESTION 6: Experience Rating */}
            <div className="card-brutal p-6 bg-cream-light space-y-4">
              <div className="flex items-center gap-2 border-b-2 border-ink pb-2">
                <span className="w-6 h-6 bg-ink text-cream font-bold text-xs flex items-center justify-center">6</span>
                <h2 className="font-display font-black text-base uppercase text-ink">
                  How would you rate THE TOYZ DEPT. overall?
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`w-12 h-12 border-2 border-ink flex flex-col items-center justify-center transition-all cursor-pointer ${
                      formData.rating >= star
                        ? "bg-lime shadow-brutal-xs"
                        : "bg-cream hover:bg-cream-dark opacity-60"
                    }`}
                  >
                    <Star className="w-5 h-5 fill-ink text-ink" />
                    <span className="text-[9px] font-black">{star}★</span>
                  </button>
                ))}
                <span className="font-display font-black text-sm ml-2 uppercase text-ink">
                  {formData.rating === 5
                    ? "Absolute Fire 🔥"
                    : formData.rating === 4
                    ? "Great Vibes ⚡"
                    : formData.rating === 3
                    ? "Pretty Good 👍"
                    : "Needs Polish 🛠️"}
                </span>
              </div>
            </div>

            {/* QUESTION 7: Giveaway Entry Credentials */}
            <div className="card-brutal p-6 sm:p-8 bg-cream border-4 border-ink space-y-5 shadow-brutal">
              <div className="border-b-2 border-ink pb-3">
                <span className="badge-lime text-[10px] font-bold uppercase mb-1 inline-block">FINAL STEP</span>
                <h2 className="font-display font-black text-xl uppercase text-ink">
                  Where Should We Send Your Giveaway Ticket?
                </h2>
                <p className="text-xs text-ink-muted">
                  We use this strictly to notify you if your ticket is drawn in our Monthly Drop Raffle:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold uppercase mb-1">
                    Your Full Name <span className="text-coral">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Arjun Mehta"
                    className="w-full bg-cream-light border-2 border-ink p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    Email Address (Winner Notice) <span className="text-coral">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="arjun@gmail.com"
                    className="w-full bg-cream-light border-2 border-ink p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    WhatsApp / Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-cream-light border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                  />
                  <p className="text-[10px] text-ink-muted mt-0.5">Used for instant SMS/WhatsApp win notification.</p>
                </div>

                <div>
                  <label className="block font-bold uppercase mb-1">
                    Instagram Handle (Optional • Bonus Entry!)
                  </label>
                  <div className="flex">
                    <span className="bg-ink text-cream px-2.5 py-2.5 text-xs font-bold border-2 border-r-0 border-ink">@</span>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      placeholder="your_handle"
                      className="flex-1 bg-cream-light border-2 border-ink p-2.5 focus:outline-none focus:ring-2 focus:ring-lime"
                    />
                  </div>
                  <p className="text-[10px] text-coral font-bold mt-0.5">🎁 Grants +1 Bonus Raffle Entry in the monthly draw!</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t-2 border-ink">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full py-4 text-sm sm:text-base font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 disabled:opacity-50 cursor-pointer"
                >
                  <Gift className="w-5 h-5 text-ink" />
                  <span>{submitting ? "Submitting & Generating Raffle Ticket..." : "Submit Survey & Claim Giveaway Ticket 🎟️"}</span>
                </button>
                <p className="text-center text-[10px] text-ink-muted uppercase mt-2">
                  100% Free Entry • No purchase necessary • Unlocks instant 15% discount code
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default CustomerSurveyPage;
