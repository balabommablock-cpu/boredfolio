import { MetadataRoute } from "next";

/*
 * SITEMAP GENERATION
 * ──────────────────
 * In production: fetch scheme slugs from DB/API.
 * For now: static routes + sample dynamic routes.
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://boredfolio.com";

// In production, these would come from API/DB
const SAMPLE_SCHEME_SLUGS = [
  "ppfas-flexi-cap", "hdfc-flexi-cap", "mirae-large-cap", "quant-small-cap",
  "axis-small-cap", "hdfc-mid-cap", "sbi-contra", "hdfc-baf", "mo-nifty-50",
  "kotak-flexicap", "nippon-small-cap", "canara-elss", "uti-nifty-50",
];

const CATEGORY_SLUGS = [
  "flexi-cap", "large-cap", "mid-cap", "small-cap", "elss", "contra",
  "balanced-advantage", "index", "liquid", "short-duration", "value",
];

const AMC_SLUGS = [
  "hdfc-amc", "sbi-mf", "icici-pru", "ppfas-mf", "motilal-oswal",
  "mirae-asset", "kotak-amc", "axis-amc", "dsp-mf", "nippon-india",
];

const BLOG_SLUGS = [
  "why-your-mutual-fund-returns-are-lying",
  "fund-roast-quant-small-cap",
  "the-nfo-trap-why-you-dont-need-new-funds",
  "nfo-or-no-manufacturing-fund",
  "elss-old-vs-new-regime",
  "monthly-recap-may-2025",
  "jargon-buster-tracking-error",
  "fund-roast-sbi-small-cap",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/explore`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/compare`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/search`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${BASE_URL}/managers`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${BASE_URL}/tools/sip`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/overlap`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/tools/tax`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  // Dynamic: schemes
  const schemePages: MetadataRoute.Sitemap = SAMPLE_SCHEME_SLUGS.map((slug) => ({
    url: `${BASE_URL}/fund/${slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Dynamic: categories
  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/category/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Dynamic: AMCs
  const amcPages: MetadataRoute.Sitemap = AMC_SLUGS.map((slug) => ({
    url: `${BASE_URL}/amc/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Dynamic: blog
  const blogPages: MetadataRoute.Sitemap = BLOG_SLUGS.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...schemePages, ...categoryPages, ...amcPages, ...blogPages];
}
