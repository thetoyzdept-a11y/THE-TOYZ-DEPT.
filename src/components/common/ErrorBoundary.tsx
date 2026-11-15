import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home, MessageSquare } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an unhandled application error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      const phoneDigits = BUSINESS_PROFILE.contact.phone.replace(/[^0-9]/g, "");
      const waUrl = `https://wa.me/91${phoneDigits.slice(-10)}?text=${encodeURIComponent(
        "Hi THE TOYZ DEPT! I ran into an error while browsing your store: " + (this.state.error?.message || "Unknown error")
      )}`;

      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-6 font-mono text-ink">
          <div className="card-brutal max-w-lg w-full bg-cream-light p-6 sm:p-8 space-y-6 shadow-brutal-xl border-2 border-ink">
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-ink">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-coral text-cream border border-ink text-xs font-bold uppercase tracking-wider shadow-brutal-sm">
                <AlertTriangle className="w-3.5 h-3.5" />
                TELEMETRY GLITCH // RECOVERY ACTIVE
              </div>
              <span className="font-display font-black text-sm uppercase">THE TOYZ DEPT.</span>
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h1 className="font-display font-black text-2xl sm:text-3xl uppercase tracking-tight text-ink">
                Don't Panic, Beds Are Still Spinning<span className="text-coral">.</span>
              </h1>
              <p className="text-xs sm:text-sm text-ink-muted leading-relaxed font-body">
                Our application caught a visual rendering issue. Your cart, orders, and payment records remain 100% safe in our Cloudflare serverless database.
              </p>
            </div>

            {/* Diagnostic Box */}
            {this.state.error && (
              <div className="p-3 bg-cream border-2 border-ink text-[11px] font-mono overflow-x-auto text-ink-muted">
                <p className="font-bold text-coral uppercase mb-1">Diagnostic Log:</p>
                <p className="font-mono text-[10px] break-all">{this.state.error.message}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary py-3 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer flex-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Store</span>
              </button>
              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn-secondary py-3 px-5 text-xs flex items-center justify-center gap-2 cursor-pointer flex-1"
              >
                <Home className="w-4 h-4" />
                <span>Return Home</span>
              </button>
            </div>

            {/* WhatsApp Support shortcut */}
            <div className="pt-2 border-t border-ink/20 text-center">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-ink hover:text-coral hover:underline"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                Report Glitch Directly to Studio WhatsApp (+91 90194 65897)
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
