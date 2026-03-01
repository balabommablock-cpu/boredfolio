/*
 * MFAPI CLIENT — https://api.mfapi.in
 * ─────────────────────────────────────
 * Free, open API for Indian mutual fund data. No auth required.
 *
 * Endpoints (from https://www.mfapi.in/docs/):
 *   GET /mf/search?q={query}                    → search schemes by name
 *   GET /mf?limit={n}&offset={n}                → paginated list of all schemes
 *   GET /mf/{code}?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD  → NAV history (with optional date range)
 *   GET /mf/{code}/latest                        → latest NAV only
 *
 * Caching strategy (Next.js ISR):
 *   - Scheme list/search: 24h (rarely changes)
 *   - NAV history: 1h (updates end-of-day)
 *   - Latest NAV: 5 min (for live display)
 */

const BASE = "https://api.mfapi.in";

/* ══════════════════════════════════
   TYPES
   ══════════════════════════════════ */

export interface MFScheme {
  schemeCode: number;
  schemeName: string;
}

export interface MFNavPoint {
  date: string; // DD-MM-YYYY from API
  nav: string;  // string number from API
}

export interface MFSchemeMeta {
  fund_house: string;
  scheme_type: string;
  scheme_category: string;
  scheme_code: number;
  scheme_name: string;
  isin_growth: string | null;
  isin_div_reinvestment: string | null;
}

export interface MFSchemeResponse {
  meta: MFSchemeMeta;
  data: MFNavPoint[];
  status: string;
}

/** Parsed NAV point with ISO date and numeric nav */
export interface NavPoint {
  date: string; // YYYY-MM-DD
  nav: number;
}

/* ══════════════════════════════════
   API FETCHERS
   ══════════════════════════════════ */

/**
 * Search mutual fund schemes by name.
 * Uses the server-side /mf/search endpoint.
 *
 * @example const results = await searchSchemes("HDFC");
 */
export async function searchSchemes(query: string): Promise<MFScheme[]> {
  if (!query || query.trim().length < 2) return [];
  const res = await fetch(`${BASE}/mf/search?q=${encodeURIComponent(query.trim())}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) return [];
  return res.json();
}

/**
 * List all schemes with pagination.
 * ~10,000+ schemes total. Use search for user-facing queries.
 *
 * @example const batch = await listSchemes(100, 0);
 */
export async function listSchemes(limit = 100, offset = 0): Promise<MFScheme[]> {
  const res = await fetch(`${BASE}/mf?limit=${limit}&offset=${offset}`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`MFAPI /mf error: ${res.status}`);
  return res.json();
}

/**
 * Fetch all schemes (no pagination — full list).
 * Warning: ~10K+ entries. Cache aggressively.
 */
export async function fetchAllSchemes(): Promise<MFScheme[]> {
  const res = await fetch(`${BASE}/mf`, {
    next: { revalidate: 86400 },
  });
  if (!res.ok) throw new Error(`MFAPI /mf error: ${res.status}`);
  return res.json();
}

/**
 * Fetch NAV history for a scheme. Optionally filter by date range.
 * Returns newest-first from API; use parseNavHistory() to reverse.
 *
 * @example
 * const data = await fetchSchemeHistory(125497);
 * const filtered = await fetchSchemeHistory(125497, "2023-01-01", "2023-12-31");
 */
export async function fetchSchemeHistory(
  schemeCode: number,
  startDate?: string,
  endDate?: string,
): Promise<MFSchemeResponse> {
  let url = `${BASE}/mf/${schemeCode}`;
  const params = new URLSearchParams();
  if (startDate) params.set("startDate", startDate);
  if (endDate) params.set("endDate", endDate);
  const qs = params.toString();
  if (qs) url += `?${qs}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) throw new Error(`MFAPI /mf/${schemeCode} error: ${res.status}`);
  return res.json();
}

/**
 * Fetch latest NAV for a scheme.
 *
 * @example const { meta, nav, date } = await fetchLatestNAV(125497);
 */
export async function fetchLatestNAV(schemeCode: number): Promise<{
  meta: MFSchemeMeta;
  nav: number;
  date: string;
}> {
  const res = await fetch(`${BASE}/mf/${schemeCode}/latest`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`MFAPI /mf/${schemeCode}/latest error: ${res.status}`);
  const data: MFSchemeResponse = await res.json();
  const point = data.data[0];
  return {
    meta: data.meta,
    nav: parseFloat(point.nav),
    date: parseIndianDate(point.date),
  };
}

/* ══════════════════════════════════
   PARSERS
   ══════════════════════════════════ */

/**
 * Parse raw API nav data into sorted, typed array.
 * API returns newest-first; this returns oldest-first (chronological).
 */
export function parseNavHistory(data: MFNavPoint[]): NavPoint[] {
  return data
    .map((d) => ({ date: parseIndianDate(d.date), nav: parseFloat(d.nav) }))
    .filter((d) => !isNaN(d.nav) && d.nav > 0)
    .reverse();
}

/** DD-MM-YYYY → YYYY-MM-DD */
function parseIndianDate(dateStr: string): string {
  const [day, month, year] = dateStr.split("-");
  return `${year}-${month}-${day}`;
}

/* ══════════════════════════════════
   RETURN CALCULATIONS
   ══════════════════════════════════ */

/** Calculate absolute and CAGR returns for standard periods */
export function calculateReturns(navHistory: NavPoint[]): Record<string, number | null> {
  if (navHistory.length === 0) return {};

  const latest = navHistory[navHistory.length - 1];
  const latestDate = new Date(latest.date);
  const returns: Record<string, number | null> = {};

  const periods = [
    { key: "1D", days: 1 }, { key: "1W", days: 7 }, { key: "1M", days: 30 },
    { key: "3M", days: 90 }, { key: "6M", days: 180 }, { key: "YTD", days: daysSinceYearStart(latestDate) },
    { key: "1Y", days: 365 }, { key: "2Y", days: 730 }, { key: "3Y", days: 1095 },
    { key: "5Y", days: 1825 }, { key: "7Y", days: 2555 }, { key: "10Y", days: 3650 },
  ];

  for (const p of periods) {
    const targetDate = new Date(latestDate);
    targetDate.setDate(targetDate.getDate() - p.days);
    const pastNav = findClosestNAV(navHistory, targetDate);

    if (pastNav === null) {
      returns[p.key] = null;
    } else if (p.days <= 365) {
      returns[p.key] = ((latest.nav - pastNav) / pastNav) * 100;
    } else {
      const years = p.days / 365;
      returns[p.key] = (Math.pow(latest.nav / pastNav, 1 / years) - 1) * 100;
    }
  }

  // Since inception
  const first = navHistory[0];
  const totalDays = (latestDate.getTime() - new Date(first.date).getTime()) / 86400000;
  returns["SI"] = totalDays > 365
    ? (Math.pow(latest.nav / first.nav, 365 / totalDays) - 1) * 100
    : ((latest.nav - first.nav) / first.nav) * 100;

  return returns;
}

/** Calendar year returns */
export function calculateCalendarYearReturns(navHistory: NavPoint[]): { year: string; return: number }[] {
  const byYear = new Map<string, { first: number; last: number }>();

  for (const p of navHistory) {
    const year = p.date.substring(0, 4);
    const entry = byYear.get(year);
    if (!entry) {
      byYear.set(year, { first: p.nav, last: p.nav });
    } else {
      entry.last = p.nav;
    }
  }

  return [...byYear.entries()]
    .map(([year, { first, last }]) => ({
      year,
      return: ((last - first) / first) * 100,
    }))
    .sort((a, b) => a.year.localeCompare(b.year));
}

/** Rolling return windows */
export function calculateRollingReturns(
  navHistory: NavPoint[],
  windowYears: number,
): { date: string; return: number }[] {
  const windowDays = Math.round(windowYears * 365);
  const results: { date: string; return: number }[] = [];

  for (let i = windowDays; i < navHistory.length; i += 7) { // weekly sampling for perf
    const endNav = navHistory[i].nav;
    const startNav = navHistory[i - windowDays]?.nav;
    if (startNav && startNav > 0) {
      results.push({
        date: navHistory[i].date,
        return: (Math.pow(endNav / startNav, 1 / windowYears) - 1) * 100,
      });
    }
  }

  return results;
}

/** SIP return simulation on real NAV data */
export function calculateSIPReturns(
  navHistory: NavPoint[],
  monthlyAmount: number,
): {
  totalInvested: number;
  currentValue: number;
  totalUnits: number;
  xirr: number;
  installments: number;
} {
  let totalUnits = 0, totalInvested = 0, lastMonth = -1;
  const cashflows: { date: Date; amount: number }[] = [];

  for (const point of navHistory) {
    const date = new Date(point.date);
    const month = date.getMonth() + date.getFullYear() * 12;
    if (month !== lastMonth) {
      const units = monthlyAmount / point.nav;
      totalUnits += units;
      totalInvested += monthlyAmount;
      cashflows.push({ date, amount: -monthlyAmount });
      lastMonth = month;
    }
  }

  const latestNav = navHistory[navHistory.length - 1].nav;
  const currentValue = totalUnits * latestNav;
  cashflows.push({ date: new Date(navHistory[navHistory.length - 1].date), amount: currentValue });

  return {
    totalInvested,
    currentValue: Math.round(currentValue),
    totalUnits,
    xirr: calculateXIRR(cashflows),
    installments: cashflows.length - 1,
  };
}

/** Drawdown analysis */
export function calculateDrawdowns(navHistory: NavPoint[]): {
  data: { date: string; drawdown: number }[];
  maxDrawdown: number;
  maxDrawdownDate: string;
  peakDate: string;
  recoveryDate: string | null;
  daysToRecover: number | null;
} {
  let peak = 0, maxDD = 0, maxDDDate = "", peakDate = "";

  const data = navHistory.map((d) => {
    if (d.nav > peak) { peak = d.nav; peakDate = d.date; }
    const dd = ((d.nav - peak) / peak) * 100;
    if (dd < maxDD) { maxDD = dd; maxDDDate = d.date; }
    return { date: d.date, drawdown: Math.round(dd * 100) / 100 };
  });

  // Find recovery
  if (maxDDDate) {
    const peakNav = navHistory.find((n) => n.date === peakDate)?.nav || 0;
    const recovery = navHistory.find((n) => n.date > maxDDDate && n.nav >= peakNav);
    if (recovery) {
      const days = Math.ceil((new Date(recovery.date).getTime() - new Date(maxDDDate).getTime()) / 86400000);
      return { data, maxDrawdown: maxDD, maxDrawdownDate: maxDDDate, peakDate, recoveryDate: recovery.date, daysToRecover: days };
    }
  }

  return { data, maxDrawdown: maxDD, maxDrawdownDate: maxDDDate, peakDate, recoveryDate: null, daysToRecover: null };
}

/** Standard deviation of monthly returns */
export function calculateStdDev(returns: number[]): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  return Math.sqrt(returns.map((r) => (r - mean) ** 2).reduce((a, b) => a + b, 0) / (returns.length - 1));
}

/** Annualized Sharpe ratio */
export function calculateSharpe(navHistory: NavPoint[], riskFreeRate = 6.5): number {
  const monthlyReturns = getMonthlyReturns(navHistory);
  if (monthlyReturns.length < 12) return 0;
  const annualizedReturn = (monthlyReturns.reduce((a, b) => a + b, 0) / monthlyReturns.length) * 12;
  const annualizedStdDev = calculateStdDev(monthlyReturns) * Math.sqrt(12);
  return annualizedStdDev === 0 ? 0 : (annualizedReturn - riskFreeRate) / annualizedStdDev;
}

/* ══════════════════════════════════
   HELPERS
   ══════════════════════════════════ */

function findClosestNAV(navHistory: NavPoint[], targetDate: Date): number | null {
  const target = targetDate.toISOString().split("T")[0];
  let lo = 0, hi = navHistory.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (navHistory[mid].date < target) lo = mid + 1;
    else if (navHistory[mid].date > target) hi = mid - 1;
    else return navHistory[mid].nav;
  }
  if (lo >= navHistory.length) return navHistory[navHistory.length - 1]?.nav ?? null;
  if (hi < 0) return null;
  return navHistory[lo].nav;
}

function daysSinceYearStart(date: Date): number {
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((date.getTime() - yearStart.getTime()) / 86400000);
}

function getMonthlyReturns(navHistory: NavPoint[]): number[] {
  const monthly: number[] = [];
  let lastMonth = -1, lastNav = 0;
  for (const p of navHistory) {
    const month = new Date(p.date).getMonth() + new Date(p.date).getFullYear() * 12;
    if (month !== lastMonth && lastNav > 0) {
      monthly.push(((p.nav - lastNav) / lastNav) * 100);
    }
    lastMonth = month;
    lastNav = p.nav;
  }
  return monthly;
}

function calculateXIRR(cashflows: { date: Date; amount: number }[]): number {
  let rate = 0.1;
  const first = cashflows[0].date.getTime();
  for (let i = 0; i < 100; i++) {
    let f = 0, df = 0;
    for (const cf of cashflows) {
      const y = (cf.date.getTime() - first) / (365.25 * 86400000);
      const factor = Math.pow(1 + rate, y);
      f += cf.amount / factor;
      df -= (y * cf.amount) / (factor * (1 + rate));
    }
    if (Math.abs(df) < 1e-10) break;
    const next = rate - f / df;
    if (Math.abs(next - rate) < 0.0001) return next * 100;
    rate = next;
  }
  return rate * 100;
}
