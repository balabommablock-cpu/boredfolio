import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* ═══════════════════════════════════════════════
   FORMATTING: Numbers, Currency, Returns, Dates
   ═══════════════════════════════════════════════ */

/** Format number with Indian numbering system (1,00,000) */
export function formatIndianNumber(num: number, decimals = 0): string {
  if (num === null || num === undefined || isNaN(num)) return "—";
  const isNeg = num < 0;
  const abs = Math.abs(num);
  const fixed = abs.toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");

  // Indian grouping: last 3 digits, then groups of 2
  let result = "";
  const len = intPart.length;
  if (len <= 3) {
    result = intPart;
  } else {
    result = intPart.slice(-3);
    let remaining = intPart.slice(0, -3);
    while (remaining.length > 2) {
      result = remaining.slice(-2) + "," + result;
      remaining = remaining.slice(0, -2);
    }
    if (remaining.length > 0) {
      result = remaining + "," + result;
    }
  }

  if (decPart) result += "." + decPart;
  return isNeg ? "-" + result : result;
}

/** Format as INR currency: ₹1,23,456.78 */
export function formatINR(num: number, decimals = 0): string {
  if (num === null || num === undefined || isNaN(num)) return "—";
  return "₹" + formatIndianNumber(num, decimals);
}

/** Format large numbers: 1.2L, 45.3Cr, etc. */
export function formatCompact(num: number): string {
  if (num === null || num === undefined || isNaN(num)) return "—";
  const abs = Math.abs(num);
  const sign = num < 0 ? "-" : "";

  if (abs >= 1e7) return sign + (abs / 1e7).toFixed(2) + " Cr";
  if (abs >= 1e5) return sign + (abs / 1e5).toFixed(2) + " L";
  if (abs >= 1e3) return sign + (abs / 1e3).toFixed(1) + " K";
  return sign + abs.toFixed(0);
}

/** Format AUM: ₹45,231 Cr */
export function formatAUM(crores: number): string {
  if (crores === null || crores === undefined || isNaN(crores)) return "—";
  if (crores >= 100) return "₹" + formatIndianNumber(Math.round(crores)) + " Cr";
  return "₹" + crores.toFixed(2) + " Cr";
}

/** Format percentage: +12.45% or -3.21% */
export function formatPercent(num: number, decimals = 2): string {
  if (num === null || num === undefined || isNaN(num)) return "—";
  const sign = num > 0 ? "+" : "";
  return sign + num.toFixed(decimals) + "%";
}

/** Format NAV: 456.7821 */
export function formatNAV(nav: number): string {
  if (nav === null || nav === undefined || isNaN(nav)) return "—";
  return nav.toFixed(4);
}

/** Format date: 28 Feb 2025 */
export function formatDate(date: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format relative date: "2 days ago", "3 months ago" */
export function formatRelativeDate(date: string | Date): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

/* ═══════════════════════════════════════════════
   DATA HELPERS
   ═══════════════════════════════════════════════ */

/** Determine if a return value is positive, negative, or neutral */
export function returnSentiment(value: number | null | undefined): "positive" | "negative" | "neutral" {
  if (value === null || value === undefined || isNaN(value) || value === 0) return "neutral";
  return value > 0 ? "positive" : "negative";
}

/** Get CSS class for return sentiment (uses Boredfolio brand: good/ugly) */
export function returnColorClass(value: number | null | undefined): string {
  const s = returnSentiment(value);
  if (s === "positive") return "num-good";
  if (s === "negative") return "num-ugly";
  return "num-neutral";
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Generate a slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ═══════════════════════════════════════════════
   CHART COLORS
   ═══════════════════════════════════════════════ */

export const CHART_COLORS = [
  "#6B8F71", // Sage (primary series)
  "#B8963E", // Mustard
  "#C4453C", // Red
  "#7B68A8", // Muted purple
  "#4A7C59", // Dark green
  "#D4AF5C", // Light mustard
  "#8B5E3C", // Warm brown
  "#5A8FA8", // Steel blue
  "#C47A5C", // Terracotta
  "#6B6B9E", // Slate violet
] as const;

/* Brand-specific semantic colors */
export const BRAND_COLORS = {
  sage: "#6B8F71",
  mustard: "#B8963E",
  charcoal: "#1A1A1A",
  cream: "#F5F0E8",
  good: "#4A7C59",
  ugly: "#C4453C",
  border: "#DDD8CC",
  surface: "#FAF8F4",
} as const;

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}
