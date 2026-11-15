import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MessageSquare, X } from "lucide-react";
import { BUSINESS_PROFILE } from "../../config/business";

export function WhatsAppWidget() {
  const location = useLocation();
  const [showTooltip, setShowTooltip] = useState(false);

  // Do not render in admin console or checkout payment screen to avoid distractions
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Show tooltip after 2.5 seconds on customer storefront if not dismissed
    const dismissed = sessionStorage.getItem("ttd_wa_tooltip_dismissed");
    if (!dismissed && !isAdmin) {
      const timer = setTimeout(() => setShowTooltip(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isAdmin]);

  if (isAdmin) return null;

  const phoneDigits = BUSINESS_PROFILE.contact.phone.replace(/[^0-9]/g, "");
  const defaultMessage = "Hi THE TOYZ DEPT! I have a question about a drop / order delivery.";
  const waUrl = `https://wa.me/91${phoneDigits.slice(-10)}?text=${encodeURIComponent(defaultMessage)}`;

  const dismissTooltip = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowTooltip(false);
    sessionStorage.setItem("ttd_wa_tooltip_dismissed", "true");
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 print:hidden">
      {/* Speech Bubble Greeting */}
      {showTooltip && (
        <div className="bg-cream-light text-ink border-2 border-ink shadow-brutal p-3 max-w-[240px] text-xs font-mono animate-in fade-in slide-in-from-bottom-2 duration-200 relative">
          <button
            onClick={dismissTooltip}
            className="absolute -top-2 -left-2 bg-ink text-cream hover:bg-coral border border-ink rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer"
            aria-label="Dismiss chat prompt"
          >
            <X className="w-3 h-3" />
          </button>
          <p className="font-bold text-[11px] uppercase text-ink flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full bg-lime border border-ink animate-pulse" />
            Live Collector Desk
          </p>
          <p className="text-[10px] text-ink-muted leading-tight">
            Got questions on filament colors, shipping speed, or drop availability? Chat with us live!
          </p>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setShowTooltip(false)}
            className="mt-2 block bg-lime hover:bg-ink hover:text-lime text-ink border border-ink px-2.5 py-1 text-center font-bold text-[10px] uppercase tracking-wider transition-colors"
          >
            Open WhatsApp &rarr;
          </a>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with THE TOYZ DEPT. on WhatsApp"
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] text-white border-2 border-ink shadow-brutal hover:shadow-brutal-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150 rounded-none cursor-pointer"
        title="Chat with us on WhatsApp (+91 90194 65897)"
      >
        {/* Pulsing notification dot */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-lime border border-ink" />
        </span>

        {/* WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 fill-current text-white group-hover:scale-110 transition-transform"
          viewBox="0 0 24 24"
        >
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.53 7.5C9.36 7.5 9.09 7.57 8.85 7.83C8.62 8.08 7.96 8.7 7.96 9.96C7.96 11.22 8.88 12.43 9.01 12.6C9.14 12.77 10.79 15.32 13.32 16.41C13.92 16.67 14.39 16.83 14.75 16.94C15.36 17.14 15.91 17.11 16.35 17.04C16.84 16.97 17.86 16.42 18.07 15.82C18.28 15.23 18.28 14.72 18.21 14.61C18.15 14.51 17.98 14.44 17.72 14.31C17.47 14.18 16.24 13.58 16.01 13.5C15.79 13.41 15.62 13.37 15.46 13.62C15.29 13.88 14.81 14.44 14.66 14.61C14.52 14.78 14.37 14.8 14.12 14.67C13.86 14.55 12.78 14.19 11.5 13.05C10.5 12.16 9.83 11.06 9.7 10.84C9.58 10.63 9.69 10.51 9.82 10.38C9.93 10.27 10.07 10.09 10.2 9.94C10.33 9.79 10.37 9.68 10.46 9.51C10.54 9.34 10.5 9.19 10.44 9.06C10.37 8.93 9.88 7.73 9.68 7.24C9.48 6.76 9.28 6.82 9.13 6.81C8.98 6.81 8.81 6.81 8.65 6.81L9.53 7.5Z" />
        </svg>
      </a>
    </div>
  );
}
