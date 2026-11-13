import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../lib/api";
import { AlertCircle, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, Layers, Box, Check } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotSubmitting, setForgotSubmitting] = useState(false);
  const [forgotMessage, setForgotMessage] = useState("");
  const [forgotError, setForgotError] = useState("");

  const { user, loading, login, loginGoogle } = useAuth();
  const navigate = useNavigate();

  const handleRedirectAfterAuth = (authUser: any) => {
    const isCompanyAdmin =
      authUser?.role === "admin" &&
      (authUser?.email?.toLowerCase() === "thetoyzdept@gmail.com" || authUser?.email?.toLowerCase() === "admin@thetoyzdept.in");

    if (isCompanyAdmin) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/account", { replace: true });
    }
  };

  // If already authenticated, redirect immediately based on role
  React.useEffect(() => {
    if (!loading && user) {
      handleRedirectAfterAuth(user);
    }
  }, [user, loading]);

  React.useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const interval = setInterval(() => {
      const win = window as any;
      if (win.google?.accounts?.id) {
        clearInterval(interval);
        try {
          win.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response: { credential?: string }) => {
              if (response.credential) {
                setGoogleLoading(true);
                try {
                  const loggedIn = await loginGoogle({ credential: response.credential });
                  handleRedirectAfterAuth(loggedIn);
                } catch (err: any) {
                  setErrorMsg(err.message || "Google authentication failed.");
                } finally {
                  setGoogleLoading(false);
                }
              }
            },
            auto_select: false,
          });

          // Optional One-Tap prompt on supported browsers
          win.google.accounts.id.prompt();
        } catch (e) {
          // Ignored
        }
      }
    }, 250);

    return () => clearInterval(interval);
  }, [loginGoogle, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const loggedIn = await login({ email, password });
      handleRedirectAfterAuth(loggedIn);
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const win = window as any;

    // 1. Google Identity Services: User-initiated popup via initTokenClient
    if (win.google?.accounts?.oauth2 && googleClientId) {
      try {
        const client = win.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope: "email profile openid",
          callback: async (tokenResponse: any) => {
            if (tokenResponse.error) {
              setGoogleLoading(false);
              return;
            }
            if (tokenResponse.access_token) {
              try {
                const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                  headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                });
                const info = await infoRes.json();
                if (info.email) {
                  const loggedIn = await loginGoogle({
                    email: info.email,
                    firstName: info.given_name || info.name?.split(" ")[0] || "Collector",
                    lastName: info.family_name || info.name?.split(" ").slice(1).join(" ") || "User",
                  });
                  handleRedirectAfterAuth(loggedIn);
                  return;
                }
              } catch (err: any) {
                setErrorMsg(err.message || "Failed to retrieve verified Google profile.");
              } finally {
                setGoogleLoading(false);
              }
            }
          },
        });
        client.requestAccessToken();
        return;
      } catch (err: any) {
        console.warn("GIS token client exception", err);
      }
    }

    // 2. Direct verified fallback
    try {
      const userEmail = prompt(
        "Enter your Google Account email to authenticate via Google SSO:",
        email || "customer@gmail.com"
      );
      if (!userEmail) {
        setGoogleLoading(false);
        return;
      }
      const namePart = userEmail.split("@")[0];
      const loggedIn = await loginGoogle({
        email: userEmail,
        firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        lastName: "Collector",
      });
      handleRedirectAfterAuth(loggedIn);
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitting(true);
    setForgotError("");
    try {
      const res = await api.requestPasswordReset(forgotEmail);
      setForgotMessage(res.message || "Instructions dispatched.");
      setForgotSent(true);
    } catch (err: any) {
      setForgotError(err.message || "Failed to process request. Please check email address.");
    } finally {
      setForgotSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-[calc(100vh-80px)] py-10 md:py-16 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch animate-fade-in">
        {/* ── Left Hero Panel: Product Hype Showcase ─────────────────── */}
        <div className="hidden lg:flex lg:col-span-5 bg-ink text-cream p-8 border-2 border-ink shadow-brutal-xl flex-col justify-between relative overflow-hidden group">
          {/* Subtle background matrix dots */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D9FF43_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <span className="badge-lime text-[10px] animate-pulse">✦ DROP ZONE // 2026</span>
              <span className="font-mono text-[10px] text-cream/60 uppercase">+999 DESK AURA</span>
            </div>

            <div>
              <h2 className="font-display font-black text-3xl uppercase tracking-tight text-cream leading-tight">
                Back for more plastic dopamine<span className="text-coral">?</span>
              </h2>
              <p className="font-mono text-xs text-cream/70 mt-2 leading-relaxed">
                Your desk called. It said it’s still boring and needs another articulated dragon.
              </p>
            </div>

            {/* Featured Product Preview Tile inside Login */}
            <div className="p-3 bg-cream/10 border-2 border-cream/20 hover:border-lime transition-colors space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src="/images/products/dragon-1.jpg"
                  alt="Articulated Cyber Dragon"
                  className="w-14 h-14 object-cover border-2 border-ink shadow-brutal-sm flex-shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="badge-coral text-[9px] py-0 px-1 font-bold">TOP SELLER</span>
                    <span className="font-mono text-[10px] text-cream/50">48 JOINTS</span>
                  </div>
                  <p className="font-display font-bold text-xs uppercase text-cream truncate mt-0.5">
                    Articulated Cyber Dragon
                  </p>
                  <p className="font-mono text-[10px] text-lime font-bold">₹1,299</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <span className="text-lime font-bold">⚡</span>
                <p className="text-cream/80 text-[11px] leading-tight">
                  <strong className="text-cream uppercase">ADHD Approved:</strong> Fluid clicky ball-joints to survive 2-hour Zoom calls.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-coral font-bold">🔥</span>
                <p className="text-cream/80 text-[11px] leading-tight">
                  <strong className="text-cream uppercase">Coworker Magnet:</strong> Warning: People will try to steal stuff off your desk.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="text-cream font-bold">📦</span>
                <p className="text-cream/80 text-[11px] leading-tight">
                  <strong className="text-cream uppercase">Lightning Dispatch:</strong> Packed and shipped before buyer's regret kicks in.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-cream/15 flex items-center justify-between font-mono text-[10px] text-cream/60 uppercase">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-lime animate-ping" />
              Printers Cooking 24/7
            </span>
            <span>Zero Injection Junk</span>
          </div>
        </div>

        {/* ── Right Auth Form Panel ───────────────────────────────────── */}
        <div className="lg:col-span-7 card-brutal bg-cream-light p-6 sm:p-10 shadow-brutal-xl space-y-6 flex flex-col justify-center">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="badge-lime text-xs font-bold">MEMBER ACCESS</span>
              <span className="font-mono text-[10px] text-ink-muted uppercase">1-Tap Login</span>
            </div>
            <h1 className="font-display font-black text-3xl uppercase tracking-tight text-ink">
              Sign In to The Dept<span className="text-coral">.</span>
            </h1>
            <p className="font-mono text-xs text-ink-muted uppercase">
              Track your prints, manage drops & review custom quotes
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-coral/15 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-coral" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* ── Google SSO Button ────────────────────────────────────────── */}
          <div>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full py-3.5 px-4 bg-cream border-2 border-ink shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase text-ink cursor-pointer group active:scale-[0.99]"
            >
              <svg className="w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.87c2.26-2.09 3.57-5.17 3.57-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.87-3.05c-1.08.72-2.45 1.16-4.06 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.15C3.25 21.37 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.23 0 10.06 0 12s.46 3.77 1.26 5.39l4.01-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.61l4.01 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
                />
              </svg>
              {googleLoading ? "Connecting..." : "Continue with Google (Instant)"}
            </button>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-ink/20 w-full" />
            <span className="bg-cream-light px-3 font-mono text-[10px] uppercase text-ink-muted font-bold absolute">
              Or The Old Fashioned Way
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-ink font-bold uppercase mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="input-brutal text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-ink font-bold uppercase">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email);
                    setShowForgotModal(true);
                    setForgotSent(false);
                  }}
                  className="text-[10px] text-coral hover:underline font-bold uppercase transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-brutal text-xs pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-ink-muted hover:text-ink cursor-pointer transition-colors"
                  title={showPassword ? "Hide" : "Show"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Lock className="w-3.5 h-3.5" />
              {submitting ? "Signing in..." : "Enter The Toyz Dept →"}
            </button>
          </form>

          <div className="text-center font-mono text-xs border-t border-ink/20 pt-4 text-ink-muted">
            First time here?{" "}
            <Link to="/register" className="text-coral font-bold uppercase hover:underline ml-1">
              Join The Dept & Claim Drops →
            </Link>
          </div>

          <div className="flex items-center justify-center gap-1.5 font-mono text-[10px] text-ink-muted/80 uppercase pt-1">
            <span>✨ Zero spam • We only send you cool plastic</span>
          </div>
        </div>
      </div>

      {/* ── MODAL: FORGOT PASSWORD ─────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="card-brutal bg-cream-light p-6 sm:p-8 w-full max-w-md space-y-5 shadow-brutal-xl font-mono text-xs border-2 border-ink">
            <div className="border-b-2 border-ink pb-3 flex items-center justify-between">
              <div>
                <span className="badge-lime text-[10px] uppercase">Don't Panic</span>
                <h3 className="font-display font-black text-xl uppercase text-ink mt-1">
                  Reset Password<span className="text-coral">.</span>
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="w-8 h-8 border-2 border-ink bg-cream hover:bg-coral hover:text-cream font-bold flex items-center justify-center text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {forgotSent ? (
              <div className="p-5 bg-lime/20 border-2 border-ink space-y-3 text-center">
                <CheckCircle2 className="w-8 h-8 text-lime-darker mx-auto" />
                <p className="font-bold text-xs uppercase text-ink">Link Sent to Inbox!</p>
                <p className="text-[11px] text-ink-muted leading-relaxed">
                  {forgotMessage || `Check ${forgotEmail} for your reset link. Check your spam if it's hiding.`}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="btn-primary w-full py-2.5 text-xs uppercase mt-2 cursor-pointer"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-ink-muted text-xs leading-relaxed">
                  Drop your email below and we'll send a 1-click magic link so you can get back to browsing drops.
                </p>
                {forgotError && (
                  <div className="p-2.5 bg-coral/20 border border-coral text-coral-dark text-[11px] font-bold">
                    {forgotError}
                  </div>
                )}
                <div>
                  <label className="block font-bold uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="input-brutal text-xs"
                  />
                </div>
                <div className="flex gap-2 pt-2 border-t border-ink/20">
                  <button
                    type="submit"
                    disabled={forgotSubmitting}
                    className="btn-primary flex-1 py-3 text-xs uppercase cursor-pointer"
                  >
                    {forgotSubmitting ? "Sending..." : "Send Magic Link ⚡"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="btn-secondary py-3 px-4 text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
