import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, Lock, ArrowRight } from "lucide-react";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate("/account");
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickCredentials = (role: "admin" | "customer") => {
    if (role === "admin") {
      setEmail("admin@thetoyzdept.in");
      setPassword("Admin@123456");
    } else {
      setEmail("customer@thetoyzdept.in");
      setPassword("Customer@123456");
    }
  };

  return (
    <div className="bg-cream min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-brutal bg-cream-light p-8 sm:p-10 w-full max-w-md space-y-6 shadow-brutal-xl">
        <div className="text-center space-y-1">
          <span className="badge-lime text-xs">Customer & Admin Access</span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight">
            Sign In to The Dept<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase">
            Access your orders, custom 3D quotations, and wishlist
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div>
            <label className="block text-ink font-bold uppercase mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className="w-full bg-cream border-2 border-ink p-3 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-ink font-bold uppercase">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-cream border-2 border-ink p-3 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2"
          >
            <Lock className="w-3.5 h-3.5" />
            {submitting ? "Authenticating..." : "Sign In to Account"}
          </button>
        </form>

        {/* Quick Dev Switcher for Seamless Testing */}
        <div className="p-3 bg-cream border border-ink/20 space-y-2 text-xs font-mono">
          <p className="text-ink-muted text-[10px] uppercase font-bold text-center">
            ⚡ Quick Test Credentials (Local DB):
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillQuickCredentials("customer")}
              className="flex-1 py-1 bg-cream-dark border border-ink text-[10px] uppercase font-bold hover:bg-lime"
            >
              Customer Test
            </button>
            <button
              type="button"
              onClick={() => fillQuickCredentials("admin")}
              className="flex-1 py-1 bg-ink text-cream border border-ink text-[10px] uppercase font-bold hover:bg-lime hover:text-ink"
            >
              Admin Test
            </button>
          </div>
        </div>

        <div className="text-center font-mono text-xs border-t border-ink/20 pt-4 text-ink-muted">
          New to THE TOYZ DEPT.?{" "}
          <Link to="/register" className="text-coral font-bold uppercase hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
