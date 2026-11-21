/**
 * Utility for on-demand lazy loading of external third-party SDKs
 * Prevents third-party cookie flags and bundle bloat on initial storefront load.
 */

let razorpayPromise: Promise<boolean> | null = null;
let googlePromise: Promise<boolean> | null = null;

export function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).Razorpay) return Promise.resolve(true);

  if (!razorpayPromise) {
    razorpayPromise = new Promise((resolve) => {
      const existing = document.querySelector('script[src*="checkout.razorpay.com"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        razorpayPromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  return razorpayPromise;
}

export function loadGoogleScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if ((window as any).google?.accounts) return Promise.resolve(true);

  if (!googlePromise) {
    googlePromise = new Promise((resolve) => {
      const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener("load", () => resolve(true));
        existing.addEventListener("error", () => resolve(false));
        return;
      }

      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(true);
      script.onerror = () => {
        googlePromise = null;
        resolve(false);
      };
      document.head.appendChild(script);
    });
  }

  return googlePromise;
}
