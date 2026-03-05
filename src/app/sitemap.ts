import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com";

// All known static routes
const STATIC_ROUTES = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/explore", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/house/ppfas", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/house/quant", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/calculator", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/manifesto", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/top-funds", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/learn", priority: 0.8, changeFrequency: "weekly" as const },
  { path: "/learn/fees", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/returns", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/direct-vs-regular", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/sip-day-one", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/learn/fund-manager-quit", priority: 0.7, changeFrequency: "monthly" as const },
];

// PPFAS scheme codes
const PPFAS_SCHEMES = [122639, 149043, 152159, 150773, 148084, 147946];
// Quant scheme codes (top ones)
const QUANT_SCHEMES = [120828, 120847, 120843, 120825];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Editorial scheme pages
  const ppfasSchemes = PPFAS_SCHEMES.map((code) => ({
    url: `${BASE}/scheme/ppfas/${code}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const quantSchemes = QUANT_SCHEMES.map((code) => ({
    url: `${BASE}/scheme/quant/${code}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...ppfasSchemes, ...quantSchemes];
}
