import {
  fetchSchemeHistory,
  fetchLatestNAV,
  searchSchemes,
  parseNavHistory,
  calculateReturns,
  calculateCalendarYearReturns,
  calculateRollingReturns,
  calculateSIPReturns,
  calculateDrawdowns,
  calculateSharpe,
  calculateStdDev,
  type MFSchemeMeta,
  type NavPoint,
} from "./mfapi";

/*
 * SERVER-SIDE DATA LAYER
 * ──────────────────────
 * Pre-processed data for page components.
 * Used in Next.js Server Components / generateStaticParams.
 * All functions are server-only (no "use client").
 *
 * This replaces mockData.ts for production pages.
 */

/* ══════════════════════════════════
   SCHEME DETAIL — /fund/[slug]
   ══════════════════════════════════ */

export interface SchemePageData {
  meta: MFSchemeMeta;
  latestNAV: number;
  latestDate: string;
  dayChange: number;
  dayChangePct: number;
  returns: Record<string, number | null>;
  calendarYearReturns: { year: string; return: number }[];
  rollingReturns3Y: { date: string; return: number }[];
  sipReturns: { totalInvested: number; currentValue: number; xirr: number; installments: number };
  drawdown: {
    maxDrawdown: number;
    maxDrawdownDate: string;
    recoveryDate: string | null;
    daysToRecover: number | null;
  };
  sharpe: number;
  navHistory: NavPoint[];
}

/**
 * Fetch all data needed for SchemeDetailPage.
 * Single function call → everything the page needs.
 */
export async function getSchemePageData(schemeCode: number): Promise<SchemePageData> {
  const response = await fetchSchemeHistory(schemeCode);
  const navHistory = parseNavHistory(response.data);

  if (navHistory.length < 2) {
    throw new Error(`Insufficient NAV data for scheme ${schemeCode}`);
  }

  const latest = navHistory[navHistory.length - 1];
  const prev = navHistory[navHistory.length - 2];
  const dayChange = latest.nav - prev.nav;
  const dayChangePct = (dayChange / prev.nav) * 100;

  const returns = calculateReturns(navHistory);
  const calendarYearReturns = calculateCalendarYearReturns(navHistory);
  const rollingReturns3Y = calculateRollingReturns(navHistory, 3);
  const sipReturns = calculateSIPReturns(navHistory, 10000); // ₹10K/mo
  const drawdown = calculateDrawdowns(navHistory);
  const sharpe = calculateSharpe(navHistory);

  return {
    meta: response.meta,
    latestNAV: latest.nav,
    latestDate: latest.date,
    dayChange: Math.round(dayChange * 100) / 100,
    dayChangePct: Math.round(dayChangePct * 100) / 100,
    returns,
    calendarYearReturns,
    rollingReturns3Y,
    sipReturns: {
      totalInvested: sipReturns.totalInvested,
      currentValue: sipReturns.currentValue,
      xirr: Math.round(sipReturns.xirr * 100) / 100,
      installments: sipReturns.installments,
    },
    drawdown: {
      maxDrawdown: Math.round(drawdown.maxDrawdown * 100) / 100,
      maxDrawdownDate: drawdown.maxDrawdownDate,
      recoveryDate: drawdown.recoveryDate,
      daysToRecover: drawdown.daysToRecover,
    },
    sharpe: Math.round(sharpe * 100) / 100,
    navHistory,
  };
}

/* ══════════════════════════════════
   SEARCH — /search, GlobalSearch
   ══════════════════════════════════ */

export interface SearchResultItem {
  type: "scheme";
  schemeCode: number;
  schemeName: string;
  fundHouse: string;
  category: string;
  plan: "Direct" | "Regular";
}

/**
 * Search + enrich with fund house & category from latest NAV metadata.
 * For the autocomplete, we do a quick search and return top results.
 */
export async function searchAndEnrich(query: string): Promise<SearchResultItem[]> {
  const raw = await searchSchemes(query);

  // Quick categorization from scheme name (no extra API calls)
  return raw.slice(0, 15).map((s) => ({
    type: "scheme" as const,
    schemeCode: s.schemeCode,
    schemeName: s.schemeName,
    fundHouse: extractFundHouse(s.schemeName),
    category: extractCategory(s.schemeName),
    plan: s.schemeName.includes("Direct") ? "Direct" as const : "Regular" as const,
  }));
}

/* ══════════════════════════════════
   COMPARE — /compare
   ══════════════════════════════════ */

export interface CompareSchemeData {
  meta: MFSchemeMeta;
  latestNAV: number;
  returns: Record<string, number | null>;
  sharpe: number;
  maxDrawdown: number;
}

/**
 * Fetch comparison data for multiple schemes.
 */
export async function getCompareData(schemeCodes: number[]): Promise<CompareSchemeData[]> {
  const results = await Promise.all(
    schemeCodes.map(async (code) => {
      const response = await fetchSchemeHistory(code);
      const navHistory = parseNavHistory(response.data);
      const returns = calculateReturns(navHistory);
      const sharpe = calculateSharpe(navHistory);
      const dd = calculateDrawdowns(navHistory);
      const latest = navHistory[navHistory.length - 1];

      return {
        meta: response.meta,
        latestNAV: latest?.nav || 0,
        returns,
        sharpe: Math.round(sharpe * 100) / 100,
        maxDrawdown: Math.round(dd.maxDrawdown * 100) / 100,
      };
    })
  );
  return results;
}

/* ══════════════════════════════════
   WELL-KNOWN SCHEME CODES
   ══════════════════════════════════ */

/** Map of popular fund slugs to AMFI scheme codes */
export const SCHEME_CODES: Record<string, number> = {
  "ppfas-flexi-cap": 122639,
  "hdfc-flexi-cap": 125497,
  "mirae-large-cap": 120505,
  "quant-small-cap": 120823,
  "axis-small-cap": 125354,
  "hdfc-mid-cap": 101762,
  "sbi-contra": 120578,
  "hdfc-baf": 119212,
  "mo-nifty-50": 127042,
  "kotak-flexicap": 112090,
  "nippon-small-cap": 113177,
  "uti-nifty-50": 120716,
  "mirae-elss": 129354,
  "hdfc-liquid": 119065,
  "icici-short-term": 120176,
  "canara-elss": 100052,
  "motilal-midcap": 147658,
};

/**
 * Resolve a URL slug to a scheme code.
 * Falls back to search if not in known map.
 */
export async function resolveSlugToCode(slug: string): Promise<number | null> {
  if (SCHEME_CODES[slug]) return SCHEME_CODES[slug];

  // Try searching
  const name = slug.replace(/-/g, " ");
  const results = await searchSchemes(name);
  const directMatch = results.find((r) =>
    r.schemeName.toLowerCase().includes("direct") &&
    r.schemeName.toLowerCase().includes("growth")
  );
  return directMatch?.schemeCode || results[0]?.schemeCode || null;
}

/* ══════════════════════════════════
   HELPERS
   ══════════════════════════════════ */

function extractFundHouse(name: string): string {
  const houses = [
    "HDFC", "SBI", "ICICI Prudential", "Axis", "Kotak", "Nippon India",
    "Mirae Asset", "Motilal Oswal", "Quant", "PPFAS", "UTI", "DSP",
    "Canara Robeco", "Tata", "Aditya Birla Sun Life", "Franklin Templeton",
    "PGIM India", "Bandhan", "Edelweiss", "Invesco India",
  ];
  for (const h of houses) {
    if (name.toLowerCase().startsWith(h.toLowerCase())) return h;
  }
  return name.split(" ").slice(0, 2).join(" ");
}

function extractCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("flexi cap") || lower.includes("flexicap")) return "Flexi Cap";
  if (lower.includes("small cap")) return "Small Cap";
  if (lower.includes("mid cap") || lower.includes("midcap")) return "Mid Cap";
  if (lower.includes("large cap")) return "Large Cap";
  if (lower.includes("elss") || lower.includes("tax saver")) return "ELSS";
  if (lower.includes("liquid")) return "Liquid";
  if (lower.includes("balanced advantage") || lower.includes("bal adv")) return "Balanced Advantage";
  if (lower.includes("nifty 50") || lower.includes("index")) return "Index";
  if (lower.includes("short") && lower.includes("term")) return "Short Duration";
  if (lower.includes("contra")) return "Contra";
  if (lower.includes("value")) return "Value";
  return "Equity";
}
