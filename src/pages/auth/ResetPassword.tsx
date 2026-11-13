import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { api } from "../../lib/api";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ShieldCheck, Key } from "lucide-react";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const calculateStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = calculateStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Missing or invalid password reset security token.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("New password and confirm password do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await api.resetPassword({ token, newPassword });
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to reset password. Link may have expired.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-16 flex items-center justify-center px-4 font-mono">
      <div className="card-brutal bg-cream-light p-8 sm:p-10 w-full max-w-md space-y-6 shadow-brutal-xl">
        <div className="text-center space-y-1">
          <span className="badge-lime text-xs">Security Protocol</span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-ink">
            Set New Password<span className="text-coral">.</span>
          </h1>
          <p className="text-xs text-ink-muted uppercase">
            Configure secure credentials for your customer account
          </p>
        </div>

        {/* Missing Token Warning */}
        {!token && (
          <div className="p-4 bg-coral/20 border-2 border-coral text-coral-dark text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold uppercase">
              <AlertCircle className="w-4 h-4 flex-shrink-0" /> Invalid Reset Link
            </div>
            <p className="text-[11px] leading-relaxed">
              No security token detected in the URL. Please ensure you clicked the exact link sent to your registered email address.
            </p>
            <Link to="/login" className="inline-block mt-2 font-bold underline uppercase text-ink">
              &larr; Back to Login
            </Link>
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 bg-coral/20 border-2 border-coral text-coral-dark text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Success View */}
        {success ? (
          <div className="p-6 bg-lime/30 border-2 border-ink space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-lime-darker mx-auto" />
            <h2 className="font-display font-black text-xl uppercase text-ink">
              Password Configured!
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed">
              Your new password has been hashed with <strong>PBKDF2 SHA-256 (100k rounds)</strong> and saved to Cloudflare D1. All previous sessions have been safely terminated.
            </p>
            <Link
              to="/login"
              className="btn-primary w-full py-3 text-xs uppercase block text-center"
            >
              Sign In to Your Account
            </Link>
          </div>
        ) : (
          token && (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-ink font-bold uppercase mb-1">New Strong Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 characters (letters + numbers)"
                    className="w-full bg-cream border-2 border-ink p-2.5 pr-9 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1 h-1 w-full bg-cream-dark">
                      <div className={`h-full flex-1 ${strength >= 1 ? "bg-coral" : ""}`} />
                      <div className={`h-full flex-1 ${strength >= 2 ? "bg-amber-500" : ""}`} />
                      <div className={`h-full flex-1 ${strength >= 3 ? "bg-lime-darker" : ""}`} />
                      <div className={`h-full flex-1 ${strength >= 4 ? "bg-emerald-600" : ""}`} />
                    </div>
                    <span className="text-[10px] text-ink-muted uppercase">
                      Strength: {strength <= 1 ? "Weak" : strength === 2 ? "Fair" : strength === 3 ? "Good" : "Strong"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-ink font-bold uppercase mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Retype password"
                    className="w-full bg-cream border-2 border-ink p-2.5 pr-9 font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-2.5 text-ink-muted hover:text-ink cursor-pointer"
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full py-3 text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? "Updating Password..." : "Apply New Password"}
              </button>
            </form>
          )
        )}

        <div className="text-center text-xs border-t border-ink/20 pt-4">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-ink-muted hover:text-ink uppercase font-bold text-[11px]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-[9px] text-ink-muted/80 uppercase">
          <ShieldCheck className="w-3.5 h-3.5 text-lime-darker" />
          <span>Statutory IT Act 2000 & Consumer Protection Verified</span>
        </div>
      </div>
    </div>
  );
}
