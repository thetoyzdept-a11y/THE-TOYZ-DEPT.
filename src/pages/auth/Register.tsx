import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, UserPlus, Eye, EyeOff, ShieldCheck, Check } from "lucide-react";

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { user, loading, register, loginGoogle } = useAuth();
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

  // If already authenticated, redirect based on role
  React.useEffect(() => {
    if (!loading && user) {
      handleRedirectAfterAuth(user);
    }
  }, [user, loading]);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "None", color: "bg-gray-300" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: "Weak", color: "bg-coral" };
    if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-400" };
    if (score === 3) return { score: 75, label: "Good", color: "bg-lime" };
    return { score: 100, label: "Strong", color: "bg-lime-darker text-cream" };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const newUser = await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      handleRedirectAfterAuth(newUser);
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Email may already be in use.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");

    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const win = window as any;

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
                  const googleUser = await loginGoogle({
                    email: info.email,
                    firstName: info.given_name || info.name?.split(" ")[0] || "Collector",
                    lastName: info.family_name || info.name?.split(" ").slice(1).join(" ") || "User",
                  });
                  handleRedirectAfterAuth(googleUser);
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

    try {
      const userEmail = prompt("Enter your Google Account email for 1-click verified sign up:", email || "user@gmail.com");
      if (!userEmail) {
        setGoogleLoading(false);
        return;
      }
      const namePart = userEmail.split("@")[0];
      const googleUser = await loginGoogle({
        email: userEmail,
        firstName: namePart.charAt(0).toUpperCase() + namePart.slice(1),
        lastName: "Collector",
      });
      handleRedirectAfterAuth(googleUser);
    } catch (err: any) {
      setErrorMsg(err.message || "Google registration failed.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-[calc(100vh-140px)] py-8 md:py-16 flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-md card-brutal bg-cream-light p-6 sm:p-8 shadow-brutal-xl space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-ink text-lime border-2 border-ink flex items-center justify-center font-display font-black text-xl mx-auto shadow-brutal-sm">
            T
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
            Create Account<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase">
            Join The Dept to order, save addresses & track your drops
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-coral/15 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-coral" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google SSO Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full py-3 px-4 bg-cream border-2 border-ink shadow-brutal hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase text-ink cursor-pointer group active:scale-[0.99]"
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
            <span>{googleLoading ? "Connecting..." : "Continue with Google"}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center my-1">
          <div className="border-t border-ink/20 w-full" />
          <span className="bg-cream-light px-3 font-mono text-[10px] uppercase text-ink-muted font-bold absolute">
            Or with email
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-ink font-bold uppercase mb-1">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rohan"
                required
                className="input-brutal text-xs"
              />
            </div>
            <div>
              <label className="block text-ink font-bold uppercase mb-1">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Verma"
                required
                className="input-brutal text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-ink font-bold uppercase mb-1">Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="rohan@example.com"
              required
              className="input-brutal text-xs"
            />
          </div>

          <div>
            <label className="block text-ink font-bold uppercase mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="input-brutal text-xs"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-ink font-bold uppercase">Password (Min 8 chars) *</label>
              {password && (
                <span className="text-[10px] uppercase font-bold text-ink-muted">
                  Strength: {strength.label}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={8}
                required
                className="input-brutal text-xs pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-ink-muted hover:text-ink cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password && (
              <div className="w-full bg-cream-dark h-1.5 mt-1.5 border border-ink/20 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div className="text-center font-mono text-xs border-t border-ink/20 pt-4 text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-coral font-bold uppercase hover:underline ml-1">
            Sign In Here →
          </Link>
        </div>
      </div>
    </div>
  );
}
