/*
 * MOCK DATA
 * ─────────
 * Realistic sample data for all Boredfolio pages.
 * Replace with API calls in production.
 */

import type {
  Scheme, IndexData, BlogArticle, NFO, FundManager,
  SectorAllocation, EquityHolding, RiskMetrics, ReturnEntry,
} from "@/types";

/* ── Market Indices ── */
export const MOCK_INDICES: IndexData[] = [
  { name: "NIFTY 50", value: 22456.80, change: 127.35, changePercent: 0.57 },
  { name: "SENSEX", value: 73852.94, change: 454.12, changePercent: 0.62 },
  { name: "NIFTY MIDCAP", value: 52318.45, change: -218.60, changePercent: -0.42 },
  { name: "NIFTY SMALLCAP", value: 15842.70, change: -95.30, changePercent: -0.60 },
  { name: "INDIA VIX", value: 14.82, change: -0.45, changePercent: -2.95 },
  { name: "10Y G-SEC", value: 7.12, change: 0.02, changePercent: 0.28 },
  { name: "USD/INR", value: 84.32, change: -0.15, changePercent: -0.18 },
];

/* ── Ticker Messages ── */
export const MOCK_TICKER_MESSAGES = [
  "82% of active large cap funds underperformed Nifty 50 over 5 years. Sleep on that.",
  "The average Indian investor holds 7.2 mutual funds. You need 4, max.",
  "Regular plan investors paid ₹14,200 Cr in commissions last year. Direct exists, btw.",
  "NFOs raised ₹8,400 Cr last month. Most will underperform their category in 3 years.",
  "Your fund manager changed? That's not a 'notification' — it's a portfolio review trigger.",
  "The best SIP date is the one you actually stick to. Stop optimizing for 0.02% difference.",
  "If your 'large cap' fund has 30% mid-caps, it's not a large cap fund. It's a lie.",
];

/* ── Category Performance Heatmap Data ── */
export const MOCK_CATEGORY_RETURNS = [
  { category: "Large Cap", "1M": 2.1, "3M": 5.4, "6M": 8.2, "1Y": 18.5, "3Y": 14.2, "5Y": 16.8 },
  { category: "Mid Cap", "1M": -0.8, "3M": 3.2, "6M": 5.1, "1Y": 24.3, "3Y": 22.1, "5Y": 21.5 },
  { category: "Small Cap", "1M": -2.4, "3M": 1.5, "6M": 2.8, "1Y": 28.6, "3Y": 26.4, "5Y": 25.2 },
  { category: "Flexi Cap", "1M": 1.2, "3M": 4.1, "6M": 6.8, "1Y": 20.4, "3Y": 17.8, "5Y": 18.6 },
  { category: "ELSS", "1M": 0.9, "3M": 3.8, "6M": 7.1, "1Y": 19.2, "3Y": 15.6, "5Y": 17.4 },
  { category: "Hybrid Aggressive", "1M": 1.0, "3M": 3.5, "6M": 5.8, "1Y": 14.2, "3Y": 12.8, "5Y": 14.1 },
  { category: "Liquid", "1M": 0.6, "3M": 1.7, "6M": 3.4, "1Y": 7.2, "3Y": 6.4, "5Y": 5.8 },
  { category: "Short Duration", "1M": 0.7, "3M": 1.9, "6M": 3.8, "1Y": 7.8, "3Y": 6.9, "5Y": 7.1 },
  { category: "Index – Nifty 50", "1M": 2.0, "3M": 5.2, "6M": 8.0, "1Y": 17.8, "3Y": 13.8, "5Y": 16.2 },
  { category: "International", "1M": 3.5, "3M": 8.2, "6M": 12.4, "1Y": 22.1, "3Y": 10.5, "5Y": 12.8 },
];

/* ── Staff Picks ── */
export const MOCK_STAFF_PICKS: Partial<Scheme>[] = [
  {
    id: "ppfas-flexi",
    name: "Parag Parikh Flexi Cap Fund - Direct Growth",
    shortName: "PPFAS Flexi Cap",
    amcName: "PPFAS Mutual Fund",
    category: "Flexi Cap",
    subCategory: "Equity",
    plan: "Direct",
    nav: { current: 78.42, date: "2025-05-28", previousClose: 77.89, dayChange: 0.53, dayChangePercent: 0.68 },
    returns: { "1Y": 24.5, "3Y": 18.2, "5Y": 21.1, "10Y": null, sinceInception: 19.8 },
    ter: 0.63,
    aum: 48000,
    riskLevel: 4,
    verdict: "buy",
  },
  {
    id: "hdfc-balanced",
    name: "HDFC Balanced Advantage Fund - Direct Growth",
    shortName: "HDFC BAF",
    amcName: "HDFC AMC",
    category: "Balanced Advantage",
    subCategory: "Hybrid",
    plan: "Direct",
    nav: { current: 452.18, date: "2025-05-28", previousClose: 450.42, dayChange: 1.76, dayChangePercent: 0.39 },
    returns: { "1Y": 15.8, "3Y": 16.4, "5Y": 18.2, "10Y": 14.5, sinceInception: 16.1 },
    ter: 0.74,
    aum: 62500,
    riskLevel: 3,
    verdict: "buy",
  },
  {
    id: "quant-small",
    name: "Quant Small Cap Fund - Direct Growth",
    shortName: "Quant Small Cap",
    amcName: "Quant Mutual Fund",
    category: "Small Cap",
    subCategory: "Equity",
    plan: "Direct",
    nav: { current: 218.65, date: "2025-05-28", previousClose: 217.10, dayChange: 1.55, dayChangePercent: 0.71 },
    returns: { "1Y": 32.4, "3Y": 35.8, "5Y": 42.1, "10Y": null, sinceInception: 24.6 },
    ter: 0.64,
    aum: 22800,
    riskLevel: 5,
    verdict: "hold",
  },
  {
    id: "motilal-nifty",
    name: "Motilal Oswal Nifty 50 Index Fund - Direct Growth",
    shortName: "MO Nifty 50",
    amcName: "Motilal Oswal AMC",
    category: "Index – Large Cap",
    subCategory: "Index",
    plan: "Direct",
    nav: { current: 28.14, date: "2025-05-28", previousClose: 27.98, dayChange: 0.16, dayChangePercent: 0.57 },
    returns: { "1Y": 17.8, "3Y": 13.5, "5Y": 16.0, "10Y": null, sinceInception: 14.2 },
    ter: 0.10,
    aum: 5200,
    riskLevel: 4,
    verdict: "buy",
  },
];

export const MOCK_STAFF_PICK_TAKES: Record<string, string> = {
  "ppfas-flexi": "One of the few funds that actually justifies its existence. Global diversification + genuine conviction. Wish the AUM bloat doesn't kill it.",
  "hdfc-balanced": "The boring fund that quietly makes money while you panic about mid-caps. Auto-rebalancing for people who can't rebalance themselves.",
  "quant-small": "Spectacular returns, erratic style, questionable AUM surge. The fund equivalent of dating someone exciting but unpredictable.",
  "motilal-nifty": "0.10% TER. Tracks the index. Does exactly what it says. In a world of lies, this is refreshingly honest.",
};

/* ── NFOs ── */
export const MOCK_NFOS: Partial<NFO>[] = [
  {
    id: "nfo-1",
    schemeName: "ICICI Prudential Innovation Fund - NFO",
    amcName: "ICICI Prudential AMC",
    category: "Thematic",
    openDate: "2025-05-20",
    closeDate: "2025-06-03",
    minInvestment: 5000,
    benchmark: "Nifty 500",
  },
  {
    id: "nfo-2",
    schemeName: "Axis Manufacturing Fund - NFO",
    amcName: "Axis AMC",
    category: "Sectoral",
    openDate: "2025-05-25",
    closeDate: "2025-06-08",
    minInvestment: 500,
    benchmark: "Nifty India Manufacturing Index",
  },
];

export const MOCK_NFO_TAKES: Record<string, { verdict: "legit" | "fomo" | "skip" | "wait"; take: string }> = {
  "nfo-1": {
    verdict: "skip",
    take: "\"Innovation\" is the new \"ESG\" — a marketing label to launch funds nobody asked for. 14 existing flexi caps already hold these stocks.",
  },
  "nfo-2": {
    verdict: "wait",
    take: "Manufacturing theme has legs, but why not wait for a track record? Plenty of existing diversified funds with 20%+ manufacturing exposure.",
  },
};

/* ── Blog Articles ── */
export const MOCK_ARTICLES: Partial<BlogArticle>[] = [
  {
    id: "blog-1",
    slug: "small-cap-stress-test-truth",
    title: "Small Cap Stress Tests: The Numbers AMCs Don't Want You to See",
    excerpt: "SEBI mandated stress tests. AMCs complied. The results are... concerning. We break down what 'liquidity risk' actually means for your money.",
    category: "Analysis",
    publishDate: "2025-05-27",
    readTime: 8,
  },
  {
    id: "blog-2",
    slug: "fund-roast-quant-small-cap",
    title: "Fund Roast: Quant Small Cap — Genius or Just Lucky?",
    excerpt: "42% CAGR over 5 years. A fund manager who bets like a trader. AUM that tripled in 18 months. We pour cold water on the hottest fund in India.",
    category: "Fund Roast",
    publishDate: "2025-05-24",
    readTime: 12,
  },
  {
    id: "blog-3",
    slug: "regular-plan-commission-calculator",
    title: "Your Distributor Made ₹47,000 From Your SIP Last Year. Here's the Math.",
    excerpt: "We built a calculator that shows exactly how much you're paying in commissions. The results will make you switch to Direct. Today.",
    category: "Education",
    publishDate: "2025-05-21",
    readTime: 6,
  },
];

/* ── Scheme Detail Mock (PPFAS Flexi Cap) ── */
export const MOCK_SCHEME_DETAIL = {
  ...MOCK_STAFF_PICKS[0],
  amfiCode: "122639",
  isin: "INF879O01027",
  launchDate: "2013-05-28",
  benchmark: "Nifty 500 TRI",
  fundManagers: [
    {
      name: "Rajeev Thakkar",
      tenure: "11 years",
      tenureStart: "2013-05-28",
      totalAUM: 58000,
      fundsManaged: 3,
      photo: undefined,
      qualifications: "CFA, CA",
    },
    {
      name: "Raunak Onkar",
      tenure: "11 years",
      tenureStart: "2013-05-28",
      totalAUM: 58000,
      fundsManaged: 2,
      photo: undefined,
      qualifications: "PGDM",
    },
  ] as Partial<FundManager>[],
  
  returnsTable: [
    { period: "1M", fund: 2.8, benchmark: 2.1, categoryAvg: 1.9, rank: 22 },
    { period: "3M", fund: 5.6, benchmark: 5.2, categoryAvg: 4.5, rank: 18 },
    { period: "6M", fund: 9.4, benchmark: 8.0, categoryAvg: 7.2, rank: 12 },
    { period: "1Y", fund: 24.5, benchmark: 18.2, categoryAvg: 20.1, rank: 8 },
    { period: "3Y", fund: 18.2, benchmark: 14.5, categoryAvg: 16.4, rank: 15 },
    { period: "5Y", fund: 21.1, benchmark: 16.8, categoryAvg: 18.2, rank: 6 },
    { period: "Since Inception", fund: 19.8, benchmark: 14.2, categoryAvg: null, rank: null },
  ],

  riskMetrics: {
    standardDeviation: { "1Y": 12.4, "3Y": 14.2, "5Y": 18.6 },
    sharpe: { "1Y": 1.82, "3Y": 1.14, "5Y": 1.02 },
    sortino: { "3Y": 1.68 },
    alpha: { "1Y": 6.3, "3Y": 3.7, "5Y": 4.3 },
    beta: 0.82,
    rSquared: 0.74,
    treynor: 22.4,
    informationRatio: 0.85,
    maxDrawdown: { amount: -28.4, peakDate: "2020-01-14", troughDate: "2020-03-23", recoveryDate: "2020-09-08", daysToRecover: 169 },
    upsideCapture: 92,
    downsideCapture: 68,
    var95: -2.8,
  },

  topHoldings: [
    { name: "HDFC Bank Ltd", sector: "Banking", weight: 7.2, change: 0.3, type: "increased" },
    { name: "Alphabet Inc (Google)", sector: "Technology", weight: 5.8, change: -0.2, type: "decreased" },
    { name: "Bajaj Holdings", sector: "Financial Services", weight: 5.1, change: 0, type: "unchanged" },
    { name: "ICICI Bank Ltd", sector: "Banking", weight: 4.9, change: 0.5, type: "increased" },
    { name: "Amazon.com Inc", sector: "Consumer Discretionary", weight: 4.5, change: 0, type: "new" },
    { name: "Power Grid Corp", sector: "Utilities", weight: 4.2, change: -0.4, type: "decreased" },
    { name: "ITC Ltd", sector: "FMCG", weight: 3.8, change: 0, type: "unchanged" },
    { name: "Coal India Ltd", sector: "Mining", weight: 3.5, change: 0.1, type: "increased" },
    { name: "Microsoft Corp", sector: "Technology", weight: 3.2, change: 0, type: "unchanged" },
    { name: "Maruti Suzuki", sector: "Automobile", weight: 2.9, change: 0, type: "exited" },
  ],

  sectorAllocation: [
    { name: "Banking & Financial", value: 24.5 },
    { name: "Technology", value: 18.2 },
    { name: "Consumer Discretionary", value: 12.8 },
    { name: "Utilities", value: 8.4 },
    { name: "FMCG", value: 7.2 },
    { name: "Mining & Metals", value: 5.8 },
    { name: "Automobile", value: 5.1 },
    { name: "Healthcare", value: 4.6 },
    { name: "Others", value: 8.2 },
    { name: "Cash & Equivalents", value: 5.2 },
  ],

  marketCap: { large: 62, mid: 18, small: 8, foreign: 12 },

  terHistory: [
    { date: "2023-01", ter: 0.72 },
    { date: "2023-06", ter: 0.68 },
    { date: "2024-01", ter: 0.65 },
    { date: "2024-06", ter: 0.64 },
    { date: "2025-01", ter: 0.63 },
  ],

  verdict: {
    rating: "buy" as const,
    summary: "PPFAS Flexi Cap remains one of the most genuinely differentiated funds in India. Its global allocation (20-30% international) provides diversification that no other flexi cap offers. The management team has skin in the game — they eat their own cooking. The only concern is AUM bloat: at ₹48,000 Cr, finding new ideas becomes harder.",
    pros: [
      "True global diversification (not just window dressing)",
      "Longest-tenured fund manager in category (11 years, same team since inception)",
      "Lowest portfolio turnover among flexi caps",
      "Management invests personal money in the fund",
      "Consistently low expense ratio (0.63%)",
    ],
    cons: [
      "AUM has ballooned 4x in 3 years — capacity risk is real",
      "International allocation can drag in strong India markets",
      "Concentrated portfolio (35-40 stocks) means higher single-stock risk",
      "No track record of navigating AUM at this scale",
    ],
    whoShouldInvest: "Investors who want a 'set and forget' diversified equity fund with genuine global exposure. Minimum 5-year horizon.",
    whoShouldAvoid: "If you already have international funds, you're double-dipping. Also not for those who can't stomach 20-25% drawdowns.",
    alternatives: ["UTI Flexi Cap Fund", "Kotak Flexicap Fund", "HDFC Flexi Cap Fund"],
  },
};

/* ── NAV Chart mock data generator ── */
export function generateNAVData(days: number = 365 * 3, startNAV: number = 45): { date: string; nav: number; benchmark?: number }[] {
  const data: { date: string; nav: number; benchmark?: number }[] = [];
  let nav = startNAV;
  let bench = 100;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Random walk with slight upward bias
    const navChange = (Math.random() - 0.47) * 1.2;
    const benchChange = (Math.random() - 0.48) * 1.0;
    nav = Math.max(nav * (1 + navChange / 100), startNAV * 0.5);
    bench = Math.max(bench * (1 + benchChange / 100), 50);

    if (date.getDay() !== 0 && date.getDay() !== 6) {
      data.push({
        date: date.toISOString().split("T")[0],
        nav: Math.round(nav * 100) / 100,
        benchmark: Math.round(bench * 100) / 100,
      });
    }
  }
  return data;
}

/* ── Rolling Returns mock data generator ── */
export function generateRollingReturns(days: number = 365 * 5): { date: string; fund: number; benchmark?: number }[] {
  const data: { date: string; fund: number; benchmark?: number }[] = [];
  const now = new Date();

  for (let i = days; i >= 0; i -= 7) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    data.push({
      date: date.toISOString().split("T")[0],
      fund: 8 + Math.random() * 30 - 5 + Math.sin(i / 180) * 8,
      benchmark: 6 + Math.random() * 25 - 5 + Math.sin(i / 180) * 6,
    });
  }
  return data;
}

/* ── Drawdown mock data generator ── */
export function generateDrawdownData(days: number = 365 * 5): { date: string; drawdown: number }[] {
  const data: { date: string; drawdown: number }[] = [];
  const now = new Date();
  let peak = 100;
  let current = 100;

  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    const change = (Math.random() - 0.47) * 2;
    current = current * (1 + change / 100);
    if (current > peak) peak = current;

    if (date.getDay() !== 0 && date.getDay() !== 6) {
      data.push({
        date: date.toISOString().split("T")[0],
        drawdown: Math.round(((current - peak) / peak) * 10000) / 100,
      });
    }
  }
  return data;
}

/* ── Peer comparison data ── */
export const MOCK_PEERS = [
  { id: "ppfas-flexi", name: "PPFAS Flexi Cap", aum: 48000, return1Y: 24.5, return3Y: 18.2, return5Y: 21.1, ter: 0.63, sharpe: 1.14, maxDD: -28.4 },
  { id: "uti-flexi", name: "UTI Flexi Cap", aum: 26500, return1Y: 22.1, return3Y: 16.8, return5Y: 19.4, ter: 0.95, sharpe: 0.98, maxDD: -32.1 },
  { id: "kotak-flexi", name: "Kotak Flexicap", aum: 42100, return1Y: 20.4, return3Y: 15.2, return5Y: 17.8, ter: 0.59, sharpe: 0.92, maxDD: -30.5 },
  { id: "hdfc-flexi", name: "HDFC Flexi Cap", aum: 38600, return1Y: 19.8, return3Y: 17.5, return5Y: 18.9, ter: 0.77, sharpe: 1.02, maxDD: -33.8 },
  { id: "dsp-flexi", name: "DSP Flexi Cap", aum: 12400, return1Y: 21.6, return3Y: 15.9, return5Y: 17.2, ter: 0.72, sharpe: 0.88, maxDD: -31.2 },
];

/* ── Year-by-year returns ── */
export const MOCK_YEAR_RETURNS = [
  { year: "2020", fund: 34.2, benchmark: 16.1, categoryAvg: 22.5 },
  { year: "2021", fund: 42.8, benchmark: 28.5, categoryAvg: 32.1 },
  { year: "2022", fund: -4.2, benchmark: 4.3, categoryAvg: -1.8 },
  { year: "2023", fund: 28.5, benchmark: 22.4, categoryAvg: 24.1 },
  { year: "2024", fund: 18.6, benchmark: 14.2, categoryAvg: 16.8 },
  { year: "2025 YTD", fund: 8.4, benchmark: 6.2, categoryAvg: 7.1 },
];
