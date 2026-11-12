import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertCircle, UserPlus } from "lucide-react";

export function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      navigate("/account");
    } catch (err: any) {
      setErrorMsg(err.message || "Registration failed. Email may already be in use.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-16 flex items-center justify-center px-4">
      <div className="card-brutal bg-cream-light p-8 sm:p-10 w-full max-w-md space-y-6 shadow-brutal-xl">
        <div className="text-center space-y-1">
          <span className="badge-lime text-xs">Join The Dept.</span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight">
            Create Account<span className="text-coral">.</span>
          </h1>
          <p className="font-mono text-xs text-ink-muted uppercase">
            Save shipping addresses, track prints & upload STL models
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark font-mono text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

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
                className="w-full bg-cream border-2 border-ink p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
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
                className="w-full bg-cream border-2 border-ink p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
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
              className="w-full bg-cream border-2 border-ink p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div>
            <label className="block text-ink font-bold uppercase mb-1">Phone Number (For Delivery SMS)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-cream border-2 border-ink p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <div>
            <label className="block text-ink font-bold uppercase mb-1">Password (Min 8 chars) *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full bg-cream border-2 border-ink p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-lime"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn-primary w-full py-3.5 text-xs flex items-center justify-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {submitting ? "Creating Account..." : "Create Account & Sign In"}
          </button>
        </form>

        <div className="text-center font-mono text-xs border-t border-ink/20 pt-4 text-ink-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-coral font-bold uppercase hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
