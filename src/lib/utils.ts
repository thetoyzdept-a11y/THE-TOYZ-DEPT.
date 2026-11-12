import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats paise (e.g., 129900) into ₹1,299
export function formatINR(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

// Formats dates in Asia/Kolkata timezone style
export function formatDate(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function formatDateTime(dateString: string | Date | null | undefined): string {
  if (!dateString) return "—";
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return String(dateString);
  }
}

export function getOrderStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "pending":
      return { label: "Payment Pending", className: "bg-cream-dark text-ink border border-ink" };
    case "payment_confirmed":
      return { label: "Paid & Queued", className: "bg-lime text-ink border border-ink" };
    case "processing":
      return { label: "Processing", className: "bg-lime-light text-ink border border-ink" };
    case "printing":
      return { label: "3D Printing", className: "bg-lime text-ink border border-ink font-bold animate-pulse" };
    case "quality_check":
      return { label: "Quality Check", className: "bg-coral-light text-ink border border-ink" };
    case "packed":
      return { label: "Packed", className: "bg-cream-dark text-ink border border-ink" };
    case "shipped":
      return { label: "Shipped", className: "bg-lime text-ink border border-ink" };
    case "delivered":
      return { label: "Delivered", className: "bg-ink text-cream border border-ink" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-coral text-cream border border-ink" };
    case "refunded":
      return { label: "Refunded", className: "bg-coral-dark text-cream border border-ink" };
    default:
      return { label: status, className: "bg-cream-dark text-ink border border-ink" };
  }
}

export function getCustomRequestStatusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "submitted":
      return { label: "Submitted", className: "bg-cream-dark text-ink border border-ink" };
    case "under_review":
      return { label: "Slicing & Review", className: "bg-lime-light text-ink border border-ink" };
    case "quoted":
      return { label: "Quote Ready", className: "bg-lime text-ink border border-ink font-bold" };
    case "accepted":
      return { label: "Quote Accepted", className: "bg-lime text-ink border border-ink" };
    case "rejected":
      return { label: "Quote Declined", className: "bg-coral-light text-ink border border-ink" };
    case "in_production":
      return { label: "In Production", className: "bg-lime text-ink border border-ink animate-pulse" };
    case "completed":
      return { label: "Completed", className: "bg-ink text-cream border border-ink" };
    case "cancelled":
      return { label: "Cancelled", className: "bg-coral text-cream border border-ink" };
    default:
      return { label: status, className: "bg-cream-dark text-ink border border-ink" };
  }
}
