/* ═══════════════════════════════════════════════
   BOREDFOLIO CORE TYPES
   Every entity in the Boredfolio data model
   ═══════════════════════════════════════════════ */

/* ── Return Periods ── */
export type ReturnPeriod =
  | "1D" | "1W" | "1M" | "3M" | "6M" | "YTD"
  | "1Y" | "2Y" | "3Y" | "5Y" | "7Y" | "10Y" | "SI";

export type RollingPeriod = "1Y" | "3Y" | "5Y";

/* ── Risk Level ── */
export type RiskLevel = 1 | 2 | 3 | 4 | 5;
export type RiskLabel = "Low" | "Low to Moderate" | "Moderate" | "Moderately High" | "High" | "Very High";

/* ── Plan & Option ── */
export type PlanType = "Direct" | "Regular";
export type OptionType = "Growth" | "IDCW" | "IDCW Reinvestment";

/* ── Category ── */
export type BroadCategory = "Equity" | "Debt" | "Hybrid" | "Solution Oriented" | "Other" | "Index" | "ETF";

/* ── Verdict ── */
export type Verdict = "buy" | "hold" | "avoid" | "watch";
export type NFOVerdict = "legit" | "fomo" | "skip" | "wait";

/* ── Scheme (Fund) ── */
export interface Scheme {
  id: string;
  amfiCode: string;
  isin: string;
  name: string;
  shortName: string;
  slug: string;
  amcId: string;
  amcName: string;
  amcLogo?: string;
  category: string;
  subCategory: string;
  broadCategory: BroadCategory;
  plan: PlanType;
  option: OptionType;
  benchmark: string;
  riskLevel: RiskLevel;
  riskLabel: RiskLabel;
  launchDate: string;
  status: "Open" | "Closed" | "Suspended";
}

/* ── NAV Data ── */
export interface NAVData {
  date: string;
  nav: number;
}

export interface NAVQuickStats {
  currentNAV: number;
  navDate: string;
  dailyChange: number;
  dailyChangePercent: number;
  week52High: number;
  week52HighDate: string;
  week52Low: number;
  week52LowDate: string;
  allTimeHigh: number;
  allTimeHighDate: string;
  aum: number; // in Crores
  aumDirect?: number;
  aumTotal?: number;
  ter: number;
  terRegular?: number;
  exitLoad: string;
  minInvestment: number;
  minSIP: number;
}

/* ── Returns ── */
export interface ReturnEntry {
  period: ReturnPeriod;
  fundReturn: number | null;
  benchmarkReturn: number | null;
  categoryAvg: number | null;
  percentileRank: number | null; // 1-100, higher is better
}

/* ── Risk Metrics ── */
export interface RiskMetrics {
  stdDev: { "1Y": number; "3Y": number; "5Y": number };
  sharpe: { "1Y": number; "3Y": number; "5Y": number };
  sortino: { "1Y": number; "3Y": number; "5Y": number };
  alpha: { "1Y": number; "3Y": number; "5Y": number };
  beta: number;
  rSquared: number;
  treynor: number;
  informationRatio: number;
  upsideCaptureRatio: number;
  downsideCaptureRatio: number;
  maxDrawdown: number;
  maxDrawdownDate: string;
  recoveryDays: number | null;
}

/* ── Holdings (Equity) ── */
export interface EquityHolding {
  rank: number;
  stockName: string;
  sector: string;
  percentOfPortfolio: number;
  sharesHeld: number;
  marketValue: number;
  change: "increased" | "decreased" | "new" | "exited" | "unchanged";
  changeAmount?: number;
  stock1MReturn?: number;
  stock3MReturn?: number;
  stock1YReturn?: number;
}

/* ── Holdings (Debt) ── */
export interface DebtHolding {
  issuerName: string;
  instrumentType: string;
  rating: string;
  ratingAgency: string;
  percentOfPortfolio: number;
  maturityDate: string;
  faceValue: number;
  marketValue: number;
}

/* ── Sector Allocation ── */
export interface SectorAllocation {
  sector: string;
  percentage: number;
  changeFromPrev: number;
}

/* ── Market Cap Allocation ── */
export interface MarketCapAllocation {
  large: number;
  mid: number;
  small: number;
  micro?: number;
}

/* ── Fund Manager ── */
export interface FundManager {
  id: string;
  slug: string;
  name: string;
  qualifications?: string;
  photo?: string;
  amcId: string;
  amcName: string;
  tenureOnFund?: string;
  totalAUM?: number;
  fundsManaged: number;
  careerHistory?: { amc: string; from: string; to: string }[];
  averageAlpha?: number;
}

/* ── AMC ── */
export interface AMC {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  logo?: string;
  parentCompany: string;
  established: string;
  hqLocation: string;
  totalAUM: number;
  totalSchemes: number;
  ceo: string;
  sebiRegNumber: string;
  website: string;
  marketSharePercent: number;
  industryRank: number;
}

/* ── NFO ── */
export interface NFO {
  id: string;
  slug: string;
  schemeName: string;
  amcName: string;
  amcLogo?: string;
  category: string;
  openDate: string;
  closeDate: string;
  minInvestment: number;
  minSIP: number;
  fundManagerName: string;
  benchmark: string;
  riskLevel: RiskLevel;
  verdict: NFOVerdict;
  status: "open" | "upcoming" | "closed";
}

/* ── Stock (MF perspective) ── */
export interface StockMFData {
  stockName: string;
  ticker: string;
  exchange: string;
  sector: string;
  industry: string;
  marketCap: number;
  currentPrice: number;
  dailyChange: number;
  week52High: number;
  week52Low: number;
  totalSchemesHolding: number;
  totalMFAum: number;
  avgHoldingPercent: number;
  trend: "increasing" | "decreasing" | "stable";
}

/* ── Blog Article ── */
export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Commentary" | "Fund Reviews" | "Education" | "Tax" | "Industry" | "Roasts" | "NFO Analysis";
  author: { name: string; photo?: string; bio?: string };
  publishedAt: string;
  readTimeMinutes: number;
  thumbnail?: string;
  mentionedFunds?: { id: string; name: string; slug: string }[];
  tags: string[];
}

/* ── Market Data ── */
export interface IndexData {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  pe?: number;
  pb?: number;
  week52High: number;
  week52Low: number;
}

export interface FIIDIIFlow {
  date: string;
  fiiBuy: number;
  fiiSell: number;
  fiiNet: number;
  diiBuy: number;
  diiSell: number;
  diiNet: number;
}

/* ── User Portfolio ── */
export interface PortfolioHolding {
  schemeId: string;
  schemeName: string;
  category: string;
  units: number;
  investedAmount: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
  xirr: number;
  percentOfPortfolio: number;
}

/* ── Watchlist Item ── */
export interface WatchlistItem {
  schemeId: string;
  schemeName: string;
  category: string;
  addedDate: string;
  navWhenAdded: number;
  currentNAV: number;
  changeSinceAdded: number;
  userNote?: string;
}

/* ── Alert ── */
export interface Alert {
  id: string;
  type: "nav" | "scheme_change" | "market" | "tax" | "portfolio" | "editorial";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

/* ── Model Portfolio ── */
export interface ModelPortfolio {
  id: string;
  name: string;
  riskProfile: "Conservative" | "Moderate" | "Aggressive";
  horizon: "Short" | "Medium" | "Long";
  style: "Active" | "Passive" | "Hybrid";
  totalTER: number;
  funds: { schemeId: string; name: string; allocation: number }[];
  expectedReturnRange: [number, number];
  backtestReturn3Y?: number;
}

/* ── Component Props Helpers ── */
export type SortDirection = "asc" | "desc" | null;

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}
