/*
 * PER-FUND MOCK DATA
 * ──────────────────
 * Each fund slug maps to unique, realistic data.
 * Uses a compact metadata map + generator functions
 * to produce full detail objects per fund.
 */

/* ── Core fund metadata (compact) ── */
interface FundMeta {
  slug: string;
  id: string;
  name: string;
  shortName: string;
  amcName: string;
  category: string;
  subCategory: string;
  plan: "Direct" | "Regular";
  benchmark: string;
  riskLevel: 1 | 2 | 3 | 4 | 5;
  amfiCode: string;
  isin: string;
  launchDate: string;
  nav: number;
  dayChangePct: number;
  aum: number;
  ter: number;
  returns: { "1Y": number; "3Y": number; "5Y": number; "10Y": number | null; sinceInception: number };
  verdict: "buy" | "hold" | "avoid" | "watch";
  managers: { name: string; tenure: string; tenureStart: string; totalAUM: number; fundsManaged: number; qualifications: string }[];
}

const FUND_META: FundMeta[] = [
  {
    slug: "ppfas-flexi-cap", id: "ppfas-flexi", name: "Parag Parikh Flexi Cap Fund - Direct Growth", shortName: "PPFAS Flexi Cap",
    amcName: "PPFAS Mutual Fund", category: "Flexi Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 500 TRI", riskLevel: 4, amfiCode: "122639", isin: "INF879O01027", launchDate: "2013-05-28",
    nav: 91.95, dayChangePct: 0.68, aum: 48000, ter: 0.63,
    returns: { "1Y": 24.5, "3Y": 18.2, "5Y": 21.1, "10Y": 17.8, sinceInception: 19.8 },
    verdict: "buy",
    managers: [
      { name: "Rajeev Thakkar", tenure: "11 years", tenureStart: "2013-05-28", totalAUM: 58000, fundsManaged: 3, qualifications: "CFA, CA" },
      { name: "Raunak Onkar", tenure: "11 years", tenureStart: "2013-05-28", totalAUM: 58000, fundsManaged: 2, qualifications: "PGDM" },
    ],
  },
  {
    slug: "hdfc-flexi-cap", id: "hdfc-flexi", name: "HDFC Flexi Cap Fund - Direct Plan - Growth", shortName: "HDFC Flexi Cap",
    amcName: "HDFC AMC", category: "Flexi Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 500 TRI", riskLevel: 4, amfiCode: "125497", isin: "INF179KA1JN0", launchDate: "2019-11-06",
    nav: 22.48, dayChangePct: 0.42, aum: 38600, ter: 0.77,
    returns: { "1Y": 19.8, "3Y": 17.5, "5Y": 18.9, "10Y": null, sinceInception: 16.4 },
    verdict: "hold",
    managers: [
      { name: "Gopal Agrawal", tenure: "8 years", tenureStart: "2016-07-01", totalAUM: 98000, fundsManaged: 3, qualifications: "CA, CFA" },
    ],
  },
  {
    slug: "mirae-large-cap", id: "mirae-large", name: "Mirae Asset Large Cap Fund - Direct Plan - Growth", shortName: "Mirae Large Cap",
    amcName: "Mirae Asset MF", category: "Large Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 100 TRI", riskLevel: 4, amfiCode: "120505", isin: "INF769K01EH0", launchDate: "2015-01-01",
    nav: 108.52, dayChangePct: 0.35, aum: 35200, ter: 0.53,
    returns: { "1Y": 18.2, "3Y": 14.8, "5Y": 16.5, "10Y": null, sinceInception: 15.2 },
    verdict: "buy",
    managers: [
      { name: "Gaurav Misra", tenure: "9 years", tenureStart: "2016-01-01", totalAUM: 42000, fundsManaged: 4, qualifications: "MBA, CFA" },
    ],
  },
  {
    slug: "quant-small-cap", id: "quant-small", name: "Quant Small Cap Fund - Direct Plan - Growth", shortName: "Quant Small Cap",
    amcName: "Quant Mutual Fund", category: "Small Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty Smallcap 250 TRI", riskLevel: 5, amfiCode: "120823", isin: "INF966L01689", launchDate: "2018-10-28",
    nav: 218.65, dayChangePct: -0.82, aum: 22800, ter: 0.64,
    returns: { "1Y": 32.4, "3Y": 35.8, "5Y": 42.1, "10Y": null, sinceInception: 24.6 },
    verdict: "hold",
    managers: [
      { name: "Sanjeev Sharma", tenure: "6 years", tenureStart: "2019-05-01", totalAUM: 85000, fundsManaged: 8, qualifications: "MBA" },
    ],
  },
  {
    slug: "axis-small-cap", id: "axis-small", name: "Axis Small Cap Fund - Direct Plan - Growth", shortName: "Axis Small Cap",
    amcName: "Axis AMC", category: "Small Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty Smallcap 250 TRI", riskLevel: 5, amfiCode: "125354", isin: "INF846K01ET8", launchDate: "2019-10-15",
    nav: 98.42, dayChangePct: -0.54, aum: 18400, ter: 0.68,
    returns: { "1Y": 26.8, "3Y": 24.2, "5Y": 28.5, "10Y": null, sinceInception: 22.1 },
    verdict: "buy",
    managers: [
      { name: "Anupam Tiwari", tenure: "5 years", tenureStart: "2020-01-01", totalAUM: 18000, fundsManaged: 2, qualifications: "CA, CFA" },
    ],
  },
  {
    slug: "hdfc-mid-cap", id: "hdfc-mid", name: "HDFC Mid-Cap Opportunities Fund - Direct Growth", shortName: "HDFC Mid-Cap",
    amcName: "HDFC AMC", category: "Mid Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty Midcap 150 TRI", riskLevel: 5, amfiCode: "101762", isin: "INF179K01BC9", launchDate: "2007-06-25",
    nav: 148.22, dayChangePct: 0.28, aum: 52400, ter: 0.82,
    returns: { "1Y": 28.6, "3Y": 26.4, "5Y": 24.8, "10Y": 19.2, sinceInception: 18.5 },
    verdict: "buy",
    managers: [
      { name: "Chirag Setalvad", tenure: "18 years", tenureStart: "2007-06-25", totalAUM: 142000, fundsManaged: 4, qualifications: "MBA, CFA" },
    ],
  },
  {
    slug: "sbi-contra", id: "sbi-contra", name: "SBI Contra Fund - Direct Plan - Growth", shortName: "SBI Contra",
    amcName: "SBI Mutual Fund", category: "Contra", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 500 TRI", riskLevel: 4, amfiCode: "120578", isin: "INF200K01RJ1", launchDate: "2013-01-01",
    nav: 342.18, dayChangePct: 0.52, aum: 28500, ter: 0.72,
    returns: { "1Y": 22.1, "3Y": 28.5, "5Y": 26.2, "10Y": 16.8, sinceInception: 15.4 },
    verdict: "buy",
    managers: [
      { name: "R Srinivasan", tenure: "15 years", tenureStart: "2010-01-01", totalAUM: 68000, fundsManaged: 3, qualifications: "CA, MBA" },
    ],
  },
  {
    slug: "hdfc-baf", id: "hdfc-baf", name: "HDFC Balanced Advantage Fund - Direct Growth", shortName: "HDFC BAF",
    amcName: "HDFC AMC", category: "Balanced Advantage", subCategory: "Hybrid", plan: "Direct",
    benchmark: "CRISIL Hybrid 35+65 Aggressive", riskLevel: 3, amfiCode: "119212", isin: "INF179KA1JK6", launchDate: "2014-09-12",
    nav: 452.18, dayChangePct: 0.39, aum: 62500, ter: 0.74,
    returns: { "1Y": 15.8, "3Y": 16.4, "5Y": 18.2, "10Y": 14.5, sinceInception: 16.1 },
    verdict: "buy",
    managers: [
      { name: "Gopal Agrawal", tenure: "8 years", tenureStart: "2016-07-01", totalAUM: 98000, fundsManaged: 3, qualifications: "CA, CFA" },
      { name: "Anil Bamboli", tenure: "10 years", tenureStart: "2014-09-12", totalAUM: 98000, fundsManaged: 2, qualifications: "CA" },
    ],
  },
  {
    slug: "mo-nifty-50", id: "mo-nifty50", name: "Motilal Oswal Nifty 50 Index Fund - Direct Growth", shortName: "MO Nifty 50",
    amcName: "Motilal Oswal AMC", category: "Index – Large Cap", subCategory: "Index", plan: "Direct",
    benchmark: "Nifty 50 TRI", riskLevel: 4, amfiCode: "127042", isin: "INF247L01AX2", launchDate: "2020-09-01",
    nav: 28.14, dayChangePct: 0.57, aum: 5200, ter: 0.10,
    returns: { "1Y": 17.8, "3Y": 13.5, "5Y": null as any, "10Y": null, sinceInception: 14.2 },
    verdict: "buy",
    managers: [
      { name: "Swapnil Mayekar", tenure: "4 years", tenureStart: "2020-09-01", totalAUM: 8000, fundsManaged: 6, qualifications: "MBA" },
    ],
  },
  {
    slug: "kotak-flexicap", id: "kotak-flexi", name: "Kotak Flexicap Fund - Direct Plan - Growth", shortName: "Kotak Flexicap",
    amcName: "Kotak Mahindra AMC", category: "Flexi Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 500 TRI", riskLevel: 4, amfiCode: "112090", isin: "INF174K01LN1", launchDate: "2009-09-11",
    nav: 72.85, dayChangePct: 0.31, aum: 42100, ter: 0.59,
    returns: { "1Y": 20.4, "3Y": 15.2, "5Y": 17.8, "10Y": 15.1, sinceInception: 14.8 },
    verdict: "hold",
    managers: [
      { name: "Harsha Upadhyaya", tenure: "12 years", tenureStart: "2012-06-01", totalAUM: 52000, fundsManaged: 5, qualifications: "CFA, MBA" },
    ],
  },
  {
    slug: "nippon-small-cap", id: "nippon-small", name: "Nippon India Small Cap Fund - Direct Growth", shortName: "Nippon Small Cap",
    amcName: "Nippon India MF", category: "Small Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty Smallcap 250 TRI", riskLevel: 5, amfiCode: "113177", isin: "INF204KB17I1", launchDate: "2010-09-16",
    nav: 172.45, dayChangePct: -0.64, aum: 46200, ter: 0.78,
    returns: { "1Y": 25.4, "3Y": 30.2, "5Y": 34.5, "10Y": 22.8, sinceInception: 20.4 },
    verdict: "hold",
    managers: [
      { name: "Samir Rachh", tenure: "7 years", tenureStart: "2017-11-01", totalAUM: 46000, fundsManaged: 2, qualifications: "CA" },
    ],
  },
  {
    slug: "uti-nifty-50", id: "uti-nifty50", name: "UTI Nifty 50 Index Fund - Direct Growth", shortName: "UTI Nifty 50",
    amcName: "UTI AMC", category: "Index – Large Cap", subCategory: "Index", plan: "Direct",
    benchmark: "Nifty 50 TRI", riskLevel: 4, amfiCode: "120716", isin: "INF789F01UN0", launchDate: "2000-03-09",
    nav: 168.92, dayChangePct: 0.56, aum: 14800, ter: 0.18,
    returns: { "1Y": 17.6, "3Y": 13.4, "5Y": 15.9, "10Y": 12.8, sinceInception: 12.4 },
    verdict: "buy",
    managers: [
      { name: "Sharwan Goyal", tenure: "5 years", tenureStart: "2020-04-01", totalAUM: 28000, fundsManaged: 8, qualifications: "CFA, MBA" },
    ],
  },
  {
    slug: "mirae-elss", id: "mirae-elss", name: "Mirae Asset ELSS Tax Saver Fund - Direct Growth", shortName: "Mirae ELSS",
    amcName: "Mirae Asset MF", category: "ELSS", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 200 TRI", riskLevel: 4, amfiCode: "129354", isin: "INF769K01FE1", launchDate: "2015-12-28",
    nav: 48.62, dayChangePct: 0.44, aum: 22600, ter: 0.58,
    returns: { "1Y": 21.4, "3Y": 17.2, "5Y": 19.8, "10Y": null, sinceInception: 18.2 },
    verdict: "buy",
    managers: [
      { name: "Gaurav Misra", tenure: "9 years", tenureStart: "2016-01-01", totalAUM: 42000, fundsManaged: 4, qualifications: "MBA, CFA" },
    ],
  },
  {
    slug: "hdfc-liquid", id: "hdfc-liquid", name: "HDFC Liquid Fund - Direct Plan - Growth", shortName: "HDFC Liquid",
    amcName: "HDFC AMC", category: "Liquid", subCategory: "Debt", plan: "Direct",
    benchmark: "CRISIL Liquid Fund AI", riskLevel: 1, amfiCode: "119065", isin: "INF179KA1IF8", launchDate: "2000-10-17",
    nav: 4852.42, dayChangePct: 0.02, aum: 45200, ter: 0.20,
    returns: { "1Y": 7.2, "3Y": 6.4, "5Y": 5.8, "10Y": 6.8, sinceInception: 7.1 },
    verdict: "hold",
    managers: [
      { name: "Anil Bamboli", tenure: "10 years", tenureStart: "2014-01-01", totalAUM: 98000, fundsManaged: 5, qualifications: "CA" },
    ],
  },
  {
    slug: "icici-short-term", id: "icici-short", name: "ICICI Prudential Short Term Fund - Direct Growth", shortName: "ICICI Short Term",
    amcName: "ICICI Prudential AMC", category: "Short Duration", subCategory: "Debt", plan: "Direct",
    benchmark: "CRISIL Short Term Bond Fund AI", riskLevel: 2, amfiCode: "120176", isin: "INF109K01Y27", launchDate: "2013-01-01",
    nav: 58.42, dayChangePct: 0.01, aum: 18200, ter: 0.36,
    returns: { "1Y": 7.8, "3Y": 6.9, "5Y": 7.1, "10Y": 7.4, sinceInception: 7.6 },
    verdict: "buy",
    managers: [
      { name: "Manish Banthia", tenure: "12 years", tenureStart: "2013-01-01", totalAUM: 52000, fundsManaged: 6, qualifications: "CA, CFA" },
    ],
  },
  {
    slug: "canara-elss", id: "canara-elss", name: "Canara Robeco ELSS Tax Saver - Direct Growth", shortName: "Canara ELSS",
    amcName: "Canara Robeco AMC", category: "ELSS", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty 200 TRI", riskLevel: 4, amfiCode: "100052", isin: "INF760K01EH4", launchDate: "1993-03-31",
    nav: 186.45, dayChangePct: 0.38, aum: 8200, ter: 0.62,
    returns: { "1Y": 20.8, "3Y": 18.5, "5Y": 20.2, "10Y": 15.8, sinceInception: 14.2 },
    verdict: "buy",
    managers: [
      { name: "Shridatta Bhandwaldar", tenure: "8 years", tenureStart: "2016-09-01", totalAUM: 12000, fundsManaged: 4, qualifications: "MBA, CFA" },
    ],
  },
  {
    slug: "motilal-midcap", id: "motilal-mid", name: "Motilal Oswal Midcap Fund - Direct Growth", shortName: "Motilal Midcap",
    amcName: "Motilal Oswal AMC", category: "Mid Cap", subCategory: "Equity", plan: "Direct",
    benchmark: "Nifty Midcap 150 TRI", riskLevel: 5, amfiCode: "147658", isin: "INF247L01CT2", launchDate: "2014-02-03",
    nav: 82.56, dayChangePct: 0.62, aum: 12500, ter: 0.72,
    returns: { "1Y": 38.2, "3Y": 28.4, "5Y": 26.8, "10Y": null, sinceInception: 22.4 },
    verdict: "buy",
    managers: [
      { name: "Ankit Agarwal", tenure: "5 years", tenureStart: "2020-01-01", totalAUM: 28000, fundsManaged: 4, qualifications: "MBA" },
    ],
  },
];

/* ── Holdings pools by category ── */
const EQUITY_HOLDINGS_POOLS: Record<string, { name: string; sector: string; weight: number; change: number; type: string }[]> = {
  "large-bank-heavy": [
    { name: "HDFC Bank Ltd", sector: "Banking", weight: 7.2, change: 0.3, type: "increased" },
    { name: "ICICI Bank Ltd", sector: "Banking", weight: 5.8, change: 0.5, type: "increased" },
    { name: "Infosys Ltd", sector: "Technology", weight: 5.1, change: -0.2, type: "decreased" },
    { name: "Reliance Industries", sector: "Energy", weight: 4.8, change: 0, type: "unchanged" },
    { name: "TCS Ltd", sector: "Technology", weight: 4.5, change: 0, type: "unchanged" },
    { name: "Bajaj Finance", sector: "Financial Services", weight: 4.2, change: 0.3, type: "increased" },
    { name: "Kotak Mahindra Bank", sector: "Banking", weight: 3.8, change: -0.1, type: "decreased" },
    { name: "Larsen & Toubro", sector: "Infrastructure", weight: 3.5, change: 0.4, type: "new" },
    { name: "ITC Ltd", sector: "FMCG", weight: 3.2, change: 0, type: "unchanged" },
    { name: "Hindustan Unilever", sector: "FMCG", weight: 2.8, change: -0.3, type: "decreased" },
  ],
  "global-diversified": [
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
  "small-cap": [
    { name: "Apar Industries", sector: "Capital Goods", weight: 4.2, change: 0.8, type: "increased" },
    { name: "KPIT Technologies", sector: "Technology", weight: 3.8, change: 0, type: "unchanged" },
    { name: "Kaynes Technology", sector: "Electronics", weight: 3.5, change: 1.2, type: "new" },
    { name: "CG Power", sector: "Capital Goods", weight: 3.2, change: 0.2, type: "increased" },
    { name: "PB Fintech (Policybazaar)", sector: "Financial Services", weight: 2.9, change: -0.4, type: "decreased" },
    { name: "Tata Elxsi", sector: "Technology", weight: 2.8, change: 0, type: "unchanged" },
    { name: "Coforge Ltd", sector: "Technology", weight: 2.6, change: 0.3, type: "increased" },
    { name: "Ratnamani Metals", sector: "Metals", weight: 2.4, change: -0.2, type: "decreased" },
    { name: "Navin Fluorine", sector: "Chemicals", weight: 2.2, change: 0, type: "exited" },
    { name: "Deepak Nitrite", sector: "Chemicals", weight: 2.0, change: 0.5, type: "new" },
  ],
  "mid-cap": [
    { name: "Persistent Systems", sector: "Technology", weight: 5.2, change: 0.6, type: "increased" },
    { name: "Max Healthcare", sector: "Healthcare", weight: 4.8, change: 0.3, type: "increased" },
    { name: "Tube Investments", sector: "Auto Ancillary", weight: 4.2, change: 0, type: "unchanged" },
    { name: "Cholamandalam Fin", sector: "NBFC", weight: 3.8, change: 0.4, type: "increased" },
    { name: "Indian Hotels", sector: "Hospitality", weight: 3.5, change: -0.2, type: "decreased" },
    { name: "Voltas Ltd", sector: "Consumer Durables", weight: 3.2, change: 0, type: "unchanged" },
    { name: "Crompton Greaves", sector: "Electricals", weight: 2.8, change: 0.5, type: "new" },
    { name: "Mphasis Ltd", sector: "Technology", weight: 2.6, change: -0.3, type: "decreased" },
    { name: "Dixon Technologies", sector: "Electronics", weight: 2.4, change: 0, type: "unchanged" },
    { name: "Supreme Industries", sector: "Plastics", weight: 2.2, change: 0, type: "exited" },
  ],
  "contra-value": [
    { name: "Coal India Ltd", sector: "Mining", weight: 5.5, change: 0.8, type: "increased" },
    { name: "NTPC Ltd", sector: "Power", weight: 4.8, change: 0.4, type: "increased" },
    { name: "Oil & Natural Gas Corp", sector: "Energy", weight: 4.2, change: 0, type: "unchanged" },
    { name: "State Bank of India", sector: "Banking", weight: 3.9, change: 0.5, type: "increased" },
    { name: "NHPC Ltd", sector: "Power", weight: 3.5, change: 1.2, type: "new" },
    { name: "Bharat Electronics", sector: "Defence", weight: 3.2, change: 0.3, type: "increased" },
    { name: "Hindustan Aeronautics", sector: "Defence", weight: 2.9, change: -0.2, type: "decreased" },
    { name: "Tata Steel", sector: "Metals", weight: 2.6, change: 0, type: "unchanged" },
    { name: "Gail India", sector: "Gas", weight: 2.4, change: -0.5, type: "decreased" },
    { name: "Indian Oil Corp", sector: "Energy", weight: 2.2, change: 0, type: "exited" },
  ],
  "hybrid": [
    { name: "HDFC Bank Ltd", sector: "Banking", weight: 5.5, change: 0.2, type: "increased" },
    { name: "ICICI Bank Ltd", sector: "Banking", weight: 4.2, change: 0, type: "unchanged" },
    { name: "Infosys Ltd", sector: "Technology", weight: 3.8, change: -0.3, type: "decreased" },
    { name: "GOI 7.18% 2033", sector: "Government Bond", weight: 8.5, change: 0, type: "unchanged" },
    { name: "GOI 7.26% 2033", sector: "Government Bond", weight: 6.2, change: 0.5, type: "increased" },
    { name: "Reliance Industries", sector: "Energy", weight: 3.5, change: 0, type: "unchanged" },
    { name: "Bajaj Finance", sector: "Financial Services", weight: 3.2, change: 0.4, type: "new" },
    { name: "AAA Corp Bond Pool", sector: "Corporate Bond", weight: 5.8, change: -0.2, type: "decreased" },
    { name: "TCS Ltd", sector: "Technology", weight: 2.8, change: 0, type: "unchanged" },
    { name: "ITC Ltd", sector: "FMCG", weight: 2.5, change: 0, type: "unchanged" },
  ],
  "debt-liquid": [
    { name: "GOI T-Bill 91D", sector: "Government", weight: 22.5, change: 2.0, type: "increased" },
    { name: "GOI T-Bill 182D", sector: "Government", weight: 18.2, change: -1.5, type: "decreased" },
    { name: "HDFC Bank CD", sector: "Banking CD", weight: 12.4, change: 0, type: "unchanged" },
    { name: "SBI CD", sector: "Banking CD", weight: 10.8, change: 1.2, type: "new" },
    { name: "ICICI Bank CD", sector: "Banking CD", weight: 8.5, change: 0, type: "unchanged" },
    { name: "Kotak Bank CD", sector: "Banking CD", weight: 7.2, change: -0.5, type: "decreased" },
    { name: "Axis Bank CP", sector: "Commercial Paper", weight: 6.8, change: 0, type: "unchanged" },
    { name: "Bajaj Finance CP", sector: "Commercial Paper", weight: 5.4, change: 0.8, type: "increased" },
    { name: "NABARD Bond", sector: "PSU Bond", weight: 4.5, change: 0, type: "unchanged" },
    { name: "CBLO/Tri-Party Repo", sector: "Money Market", weight: 3.7, change: -1.0, type: "decreased" },
  ],
  "debt-short": [
    { name: "GOI 7.18% 2026", sector: "Government Bond", weight: 15.8, change: 0.5, type: "increased" },
    { name: "GOI 7.26% 2027", sector: "Government Bond", weight: 12.4, change: 0, type: "unchanged" },
    { name: "HDFC Ltd NCD AAA", sector: "Corporate Bond", weight: 8.5, change: -0.3, type: "decreased" },
    { name: "REC Ltd NCD AAA", sector: "PSU Bond", weight: 7.8, change: 0.4, type: "increased" },
    { name: "PFC Ltd NCD AAA", sector: "PSU Bond", weight: 6.5, change: 0, type: "unchanged" },
    { name: "NABARD Bond 2027", sector: "PSU Bond", weight: 6.2, change: 0.8, type: "new" },
    { name: "SBI Bond 2026", sector: "Banking Bond", weight: 5.8, change: 0, type: "unchanged" },
    { name: "IRFC NCD AAA", sector: "PSU Bond", weight: 5.2, change: -0.2, type: "decreased" },
    { name: "Bajaj Finance NCD", sector: "Corporate Bond", weight: 4.8, change: 0, type: "unchanged" },
    { name: "CBLO/Tri-Party Repo", sector: "Money Market", weight: 8.5, change: 1.2, type: "increased" },
  ],
  "index": [
    { name: "HDFC Bank Ltd", sector: "Banking", weight: 12.8, change: 0, type: "unchanged" },
    { name: "Reliance Industries", sector: "Energy", weight: 10.5, change: 0, type: "unchanged" },
    { name: "ICICI Bank Ltd", sector: "Banking", weight: 8.2, change: 0, type: "unchanged" },
    { name: "Infosys Ltd", sector: "Technology", weight: 6.8, change: 0, type: "unchanged" },
    { name: "TCS Ltd", sector: "Technology", weight: 5.4, change: 0, type: "unchanged" },
    { name: "Bharti Airtel", sector: "Telecom", weight: 4.2, change: 0, type: "unchanged" },
    { name: "ITC Ltd", sector: "FMCG", weight: 3.8, change: 0, type: "unchanged" },
    { name: "Larsen & Toubro", sector: "Infrastructure", weight: 3.5, change: 0, type: "unchanged" },
    { name: "Kotak Mahindra Bank", sector: "Banking", weight: 3.2, change: 0, type: "unchanged" },
    { name: "Bajaj Finance", sector: "Financial Services", weight: 2.8, change: 0, type: "unchanged" },
  ],
};

/* ── Sector allocations by type ── */
const SECTOR_POOLS: Record<string, { name: string; value: number }[]> = {
  "equity-diversified": [
    { name: "Banking & Financial", value: 28.5 }, { name: "Technology", value: 16.2 }, { name: "Consumer", value: 10.8 },
    { name: "Healthcare", value: 8.4 }, { name: "Energy", value: 7.2 }, { name: "Industrials", value: 6.8 },
    { name: "Automobile", value: 5.5 }, { name: "FMCG", value: 4.8 }, { name: "Others", value: 6.6 }, { name: "Cash", value: 5.2 },
  ],
  "global-equity": [
    { name: "Banking & Financial", value: 24.5 }, { name: "Technology", value: 18.2 }, { name: "Consumer Discretionary", value: 12.8 },
    { name: "Utilities", value: 8.4 }, { name: "FMCG", value: 7.2 }, { name: "Mining & Metals", value: 5.8 },
    { name: "Automobile", value: 5.1 }, { name: "Healthcare", value: 4.6 }, { name: "Others", value: 8.2 }, { name: "Cash", value: 5.2 },
  ],
  "small-mid": [
    { name: "Technology", value: 18.4 }, { name: "Capital Goods", value: 14.2 }, { name: "Financial Services", value: 12.8 },
    { name: "Healthcare", value: 10.5 }, { name: "Chemicals", value: 8.8 }, { name: "Consumer", value: 7.2 },
    { name: "Electronics", value: 6.5 }, { name: "Auto Ancillary", value: 5.8 }, { name: "Others", value: 10.6 }, { name: "Cash", value: 5.2 },
  ],
  "contra-value": [
    { name: "Power & Utilities", value: 18.5 }, { name: "Mining & Metals", value: 14.2 }, { name: "Banking", value: 12.8 },
    { name: "Energy", value: 11.5 }, { name: "Defence", value: 8.8 }, { name: "Infrastructure", value: 7.2 },
    { name: "PSU", value: 6.5 }, { name: "Automobile", value: 5.8 }, { name: "Others", value: 8.5 }, { name: "Cash", value: 6.2 },
  ],
  "hybrid": [
    { name: "Government Bonds", value: 28.5 }, { name: "Banking & Financial", value: 18.2 }, { name: "Corporate Bonds", value: 12.8 },
    { name: "Technology", value: 8.4 }, { name: "Energy", value: 6.2 }, { name: "FMCG", value: 5.5 },
    { name: "Consumer", value: 4.8 }, { name: "Healthcare", value: 3.2 }, { name: "Others", value: 4.9 }, { name: "Cash", value: 7.5 },
  ],
  "debt": [
    { name: "Government Securities", value: 35.5 }, { name: "PSU Bonds", value: 22.4 }, { name: "Corporate Bonds", value: 15.8 },
    { name: "Banking CDs", value: 12.2 }, { name: "Commercial Paper", value: 6.8 }, { name: "Cash & Money Market", value: 7.3 },
  ],
  "index": [
    { name: "Banking & Financial", value: 35.2 }, { name: "Technology", value: 14.8 }, { name: "Energy", value: 12.5 },
    { name: "FMCG", value: 8.2 }, { name: "Automobile", value: 6.8 }, { name: "Telecom", value: 5.4 },
    { name: "Infrastructure", value: 4.8 }, { name: "Healthcare", value: 4.2 }, { name: "Others", value: 8.1 },
  ],
};

/* ── Verdict summaries per fund ── */
const VERDICTS: Record<string, { summary: string; pros: string[]; cons: string[]; who: string; whoNot: string; alts: string[] }> = {
  "ppfas-flexi-cap": {
    summary: "PPFAS Flexi Cap remains one of the most genuinely differentiated funds in India. Its global allocation provides diversification no other flexi cap offers. The team has skin in the game. Only concern: AUM bloat at ₹48K Cr.",
    pros: ["True global diversification (not window dressing)", "Same team since inception (11 years)", "Lowest portfolio turnover in category", "Management invests personal money in the fund", "Consistently low TER (0.63%)"],
    cons: ["AUM ballooned 4x in 3 years — capacity risk", "International allocation drags in strong India markets", "Concentrated portfolio (35-40 stocks)", "No track record at this AUM scale"],
    who: "Investors wanting a set-and-forget diversified equity fund with genuine global exposure. Min 5-year horizon.",
    whoNot: "If you already have international funds, you're double-dipping. Not for those who can't stomach 20-25% drawdowns.",
    alts: ["UTI Flexi Cap Fund", "Kotak Flexicap Fund", "HDFC Flexi Cap Fund"],
  },
  "hdfc-flexi-cap": {
    summary: "HDFC Flexi Cap benefits from the AMC's massive research team but lacks a distinct identity. It's the Honda Civic of flexi caps — reliable, boring, gets the job done. Won't blow your mind, won't blow up either.",
    pros: ["HDFC AMC's deep research bench", "Consistent top-quartile performance", "Good downside protection historically", "Reasonable TER at 0.77%"],
    cons: ["Manager manages multiple funds — attention split", "No unique edge over peers", "AUM size limits agility", "Relatively new fund (2019 launch)"],
    who: "Conservative equity investors who want large-cap-heavy flexi cap exposure with HDFC's institutional backing.",
    whoNot: "If you want concentrated bets or high-conviction picks. This is a committee-driven fund.",
    alts: ["PPFAS Flexi Cap Fund", "Kotak Flexicap Fund", "UTI Flexi Cap Fund"],
  },
  "mirae-large-cap": {
    summary: "Mirae Large Cap is the gold standard for active large cap investing. Gaurav Misra has consistently outperformed Nifty 100 without taking excessive risk. Low TER. The only question: can active large cap justify itself over an index fund?",
    pros: ["Consistent benchmark outperformance", "One of the lowest TERs in active large cap (0.53%)", "Clean, disciplined portfolio construction", "Experienced manager (9 years)"],
    cons: ["Large cap alpha is shrinking — index funds are catching up", "0.53% TER vs 0.10% for index — is the alpha worth it?", "Large AUM (₹35K Cr) limits stock-picking edge", "Category itself is losing relevance"],
    who: "Investors who believe active large cap still has legs and want the best-in-class option.",
    whoNot: "Cost-conscious investors. A Nifty 50 index fund at 0.10% TER does 90% of the job.",
    alts: ["MO Nifty 50 Index Fund", "UTI Nifty 50 Index Fund", "Canara Robeco Bluechip Equity"],
  },
  "quant-small-cap": {
    summary: "Spectacular returns. Erratic style. Questionable AUM surge. Quant Small Cap is the fund equivalent of dating someone exciting but unpredictable. The momentum-driven approach works brilliantly until it doesn't.",
    pros: ["Highest returns in category over 3Y and 5Y", "Quant-driven approach removes emotional bias", "Low TER for an active small cap (0.64%)", "Aggressive stock rotation captures momentum"],
    cons: ["Manager runs 8 funds — that's a red flag", "AUM tripled in 18 months — capacity concern", "Extreme portfolio turnover (150%+ annually)", "Style works until momentum reverses — then it crashes hard"],
    who: "Aggressive investors with strong stomachs who understand momentum investing and its risks.",
    whoNot: "Anyone who checks their portfolio daily. Or weekly. Maybe even monthly. This fund will test your patience.",
    alts: ["Nippon Small Cap Fund", "Axis Small Cap Fund", "HDFC Small Cap Fund"],
  },
  "axis-small-cap": {
    summary: "Axis Small Cap takes a quality-first approach to small caps — fewer names, higher conviction. It won't match Quant's returns in momentum markets, but it'll hurt less in corrections. The mature choice in a wild category.",
    pros: ["Quality-focused stock selection", "Lower drawdowns than peers", "Concentrated portfolio = higher conviction", "Cleaner corporate governance filter"],
    cons: ["Underperforms in momentum-driven rallies", "Relatively new manager (5 years)", "Moderate AUM but growing fast", "Higher TER than some alternatives"],
    who: "Small cap investors who want quality over quantity. Pairs well with a more aggressive fund.",
    whoNot: "Return chasers. If you want the highest number on the screen, look elsewhere.",
    alts: ["Quant Small Cap Fund", "Nippon Small Cap Fund", "SBI Small Cap Fund"],
  },
  "hdfc-mid-cap": {
    summary: "Chirag Setalvad has run this fund for 18 years. Eighteen. That's almost unheard of in Indian MFs. The track record is HIS, not someone who left 3 years ago. HDFC Mid-Cap is the real deal in mid-cap investing.",
    pros: ["Same manager since inception — 18 years!", "Entire track record belongs to current manager", "Consistent top-quartile performance", "One of the largest mid-cap funds for a reason"],
    cons: ["AUM at ₹52K Cr — very large for mid-cap", "Higher TER (0.82%) than some peers", "Size limits ability to buy true mid-caps", "Has had brief underperformance patches"],
    who: "Anyone wanting mid-cap exposure managed by arguably India's best mid-cap manager.",
    whoNot: "If you believe AUM kills alpha. At ₹52K Cr, it's essentially a large-cap fund buying mid-caps.",
    alts: ["Motilal Oswal Midcap Fund", "Kotak Emerging Equity Fund", "Axis Midcap Fund"],
  },
  "sbi-contra": {
    summary: "SBI Contra buys what others won't touch. PSUs, coal, oil — the ugliest ducklings in the market. R Srinivasan has made contrarian investing work brilliantly. But contrarian funds are cyclical — this one's had its run.",
    pros: ["True contrarian philosophy — not just marketing", "Brilliant PSU and value stock picks", "15-year tenured manager", "Outperformed category by wide margins"],
    cons: ["Contrarian style is inherently cyclical", "Recent outperformance may mean-revert", "PSU-heavy portfolio = government policy risk", "SBI AMC's overall equity track record is mixed"],
    who: "Investors who understand value investing cycles and have a 7+ year horizon.",
    whoNot: "Anyone expecting recent returns to continue. Contra funds revert to mean — it's math, not pessimism.",
    alts: ["ICICI Prudential Value Discovery", "Invesco India Contra", "HDFC Capital Builder Value"],
  },
  "hdfc-baf": {
    summary: "The boring fund that quietly makes money while you panic about mid-caps. HDFC BAF auto-rebalances between equity and debt so you don't have to. For people who know they can't handle volatility but still want equity returns.",
    pros: ["Auto-rebalancing removes emotional decisions", "Lower volatility than pure equity", "Tax-efficient rebalancing (equity taxation)", "Two experienced co-managers"],
    cons: ["Underperforms pure equity in bull markets", "Debt allocation can drag returns significantly", "0.74% TER is high for what's partially a debt fund", "Asset allocation model is a black box"],
    who: "First-time equity investors, retirees wanting partial equity, or anyone who panics in corrections.",
    whoNot: "Aggressive investors with a 10+ year horizon. Just buy pure equity and ride the waves.",
    alts: ["ICICI Prudential BAF", "Edelweiss BAF", "Kotak BAF"],
  },
  "mo-nifty-50": {
    summary: "0.10% TER. Tracks the index. Does exactly what it says. In a world of marketing lies, this is refreshingly honest. The best index fund available, period.",
    pros: ["Lowest TER among Nifty 50 funds (0.10%)", "Near-zero tracking error", "No fund manager risk — it's an index", "Transparent, rules-based investing"],
    cons: ["You'll never beat the market (by design)", "No downside protection", "Missing mid/small cap opportunities", "Boring — no cocktail party stories"],
    who: "Everyone. Seriously. This should be your core holding. Build around it, not despite it.",
    whoNot: "Nobody. Every investor should have index exposure. The only question is how much.",
    alts: ["UTI Nifty 50 Index Fund", "HDFC Nifty 50 Index Fund", "Nippon India Nifty 50 Index"],
  },
  "kotak-flexicap": {
    summary: "Kotak Flexicap is the middle child of flexi caps — not flashy enough to grab headlines, not bad enough to worry about. Harsha Upadhyaya runs a tight, diversified ship. Solid but uninspiring.",
    pros: ["12-year tenured manager", "Low TER for the category (0.59%)", "Balanced large/mid/small allocation", "Consistent risk-adjusted returns"],
    cons: ["Never the top performer — always 'above average'", "No unique investment edge", "Large AUM (₹42K Cr) limits agility", "Doesn't stand out in a crowded category"],
    who: "Investors wanting a safe, diversified flexi cap pick. Won't excite you, won't disappoint you.",
    whoNot: "If you want outperformance. This fund is the definition of 'market return plus a little'.",
    alts: ["PPFAS Flexi Cap Fund", "HDFC Flexi Cap Fund", "UTI Flexi Cap Fund"],
  },
  "nippon-small-cap": {
    summary: "India's largest small cap fund at ₹46K Cr. The irony is thick — it's a 'small' cap fund bigger than most AMCs. Samir Rachh has delivered strong returns, but at this size, it's practically a multi-cap fund.",
    pros: ["Excellent long-term track record (22.8% 10Y CAGR)", "Experienced manager since 2017", "Wide stock universe = good diversification", "Strong in small/micro cap discovery"],
    cons: ["₹46K Cr AUM — can it still buy small caps?", "Size forces it into larger 'small caps'", "Higher TER (0.78%)", "Redemption pressure risk during corrections"],
    who: "Long-term investors comfortable with the size paradox. It's big, but the returns still show up.",
    whoNot: "Purists who want true small cap exposure. Look at smaller AUM funds for that.",
    alts: ["Quant Small Cap Fund", "Axis Small Cap Fund", "HDFC Small Cap Fund"],
  },
  "uti-nifty-50": {
    summary: "India's oldest index fund. UTI Nifty 50 has the longest track record of any passive fund in the country. Slightly higher TER than MO's offering but rock-solid tracking and the backing of India's oldest AMC.",
    pros: ["Longest track record among index funds (20+ years)", "Excellent tracking accuracy", "Large AUM = better liquidity", "UTI AMC's institutional strength"],
    cons: ["0.18% TER — almost double MO Nifty 50's 0.10%", "No advantages over cheaper alternatives", "Higher tracking error than some newer funds", "Passive = no downside protection"],
    who: "Investors wanting a time-tested index fund who value track record length over 0.08% TER difference.",
    whoNot: "Cost-optimizers. MO Nifty 50 does the same thing for 0.10% TER.",
    alts: ["MO Nifty 50 Index Fund", "HDFC Nifty 50 Index Fund", "SBI Nifty 50 Index"],
  },
  "mirae-elss": {
    summary: "If you must save tax through ELSS, Mirae's is the one. Gaurav Misra's quality-growth approach works perfectly with a 3-year lock-in. You're forced to stay invested long enough for the strategy to work.",
    pros: ["Best risk-adjusted returns in ELSS category", "Lock-in forces discipline (feature, not bug)", "Same top manager as Mirae Large Cap", "Low TER for ELSS (0.58%)"],
    cons: ["3-year lock-in means illiquidity", "Tax benefit is only ₹46,800/year (max)", "New tax regime makes ELSS less relevant", "Better alternatives exist if you don't need tax savings"],
    who: "Old tax regime investors who need Section 80C deduction and want equity exposure.",
    whoNot: "New tax regime taxpayers. You don't need ELSS — buy a flexi cap instead with no lock-in.",
    alts: ["Canara Robeco ELSS", "Quant ELSS Tax Saver", "HDFC ELSS Tax Saver"],
  },
  "hdfc-liquid": {
    summary: "Your emergency fund lives here. HDFC Liquid does one thing: park your money safely and give you slightly more than a savings account. Zero excitement. Maximum safety. That's the point.",
    pros: ["HDFC AMC's creditworthiness", "Instant redemption up to ₹50K", "Near-zero default risk", "Most predictable returns in MF universe"],
    cons: ["Returns barely beat inflation", "0.20% TER eats into already-thin returns", "Could use a regular savings account instead", "No capital appreciation potential"],
    who: "Emergency funds, short-term parking (1-3 months), or money waiting to be deployed elsewhere.",
    whoNot: "Anyone looking for returns. This is a parking lot, not an investment.",
    alts: ["ICICI Prudential Liquid Fund", "SBI Liquid Fund", "Axis Liquid Fund"],
  },
  "icici-short-term": {
    summary: "Manish Banthia is one of India's best debt fund managers. ICICI Short Term delivers consistent, boring returns with minimal credit risk. The anchor for any conservative portfolio.",
    pros: ["Top-tier debt fund manager (12 years)", "Excellent credit quality maintenance", "Consistent outperformance vs category", "Low TER for active debt (0.36%)"],
    cons: ["Returns won't excite anyone (7-8%)", "Interest rate risk in rising rate cycles", "Tax treatment less favorable post-2023", "Opportunity cost vs equity over long term"],
    who: "Conservative investors, retirees, or anyone building a debt allocation in their portfolio.",
    whoNot: "Long-term investors who don't need debt allocation yet. Equity will compound better over 10+ years.",
    alts: ["HDFC Short Term Debt Fund", "Axis Short Term Fund", "SBI Short Term Debt"],
  },
  "canara-elss": {
    summary: "The quiet overachiever. Canara Robeco ELSS consistently lands in the top quartile of ELSS funds but never gets the marketing push of larger AMCs. Bhandwaldar's steady hand makes this a set-and-forget tax saver.",
    pros: ["Top-quartile performance consistently", "Clean, low-risk portfolio construction", "Reasonable TER (0.62%)", "30-year track record (fund, not manager)"],
    cons: ["Small AMC — less research bandwidth", "Manager tenure is 8 years (previous track record is others')", "Lower AUM means less scale advantages", "ELSS category itself losing relevance"],
    who: "Tax savers who want consistent, low-drama ELSS exposure from a fund that doesn't chase trends.",
    whoNot: "Aggressive investors looking for max returns within ELSS. Quant ELSS takes more risk for more reward.",
    alts: ["Mirae Asset ELSS", "Quant ELSS Tax Saver", "HDFC ELSS Tax Saver"],
  },
  "motilal-midcap": {
    summary: "Motilal Midcap follows the QGLP framework (Quality, Growth, Longevity, Price) with religious discipline. Ankit Agarwal is young but already proving himself. Concentrated, high-conviction mid-cap picking at its best.",
    pros: ["Clear, repeatable QGLP investment process", "Highest 1Y returns in mid-cap category", "Concentrated portfolio = high conviction", "Emerging star in fund management"],
    cons: ["Young manager (5 years) — unproven in bear markets", "Small AUM could struggle scaling", "Concentrated = higher single-stock risk", "Motilal AMC's overall track record is mixed"],
    who: "Mid-cap investors who value process over pedigree. The QGLP framework is transparent and logical.",
    whoNot: "Risk-averse investors. This is concentrated mid-cap — drawdowns can be brutal.",
    alts: ["HDFC Mid-Cap Opportunities", "Kotak Emerging Equity", "Axis Midcap Fund"],
  },
};

/* ── Slug-to-pool mapping ── */
function getHoldingsKey(meta: FundMeta): string {
  if (meta.category === "Liquid") return "debt-liquid";
  if (meta.category === "Short Duration") return "debt-short";
  if (meta.subCategory === "Index") return "index";
  if (meta.subCategory === "Hybrid") return "hybrid";
  if (meta.category === "Contra") return "contra-value";
  if (meta.category === "Small Cap") return "small-cap";
  if (meta.category === "Mid Cap") return "mid-cap";
  if (meta.slug === "ppfas-flexi-cap") return "global-diversified";
  return "large-bank-heavy";
}

function getSectorKey(meta: FundMeta): string {
  if (meta.category === "Liquid" || meta.category === "Short Duration") return "debt";
  if (meta.subCategory === "Index") return "index";
  if (meta.subCategory === "Hybrid") return "hybrid";
  if (meta.category === "Contra") return "contra-value";
  if (meta.category === "Small Cap" || meta.category === "Mid Cap") return "small-mid";
  if (meta.slug === "ppfas-flexi-cap") return "global-equity";
  return "equity-diversified";
}

function getMarketCap(meta: FundMeta): { large: number; mid: number; small: number; foreign: number } {
  if (meta.category === "Liquid" || meta.category === "Short Duration") return { large: 0, mid: 0, small: 0, foreign: 0 };
  if (meta.subCategory === "Index") return { large: 100, mid: 0, small: 0, foreign: 0 };
  if (meta.category === "Large Cap") return { large: 85, mid: 10, small: 5, foreign: 0 };
  if (meta.category === "Mid Cap") return { large: 15, mid: 65, small: 20, foreign: 0 };
  if (meta.category === "Small Cap") return { large: 5, mid: 20, small: 75, foreign: 0 };
  if (meta.subCategory === "Hybrid") return { large: 45, mid: 10, small: 5, foreign: 0 };
  if (meta.slug === "ppfas-flexi-cap") return { large: 62, mid: 18, small: 8, foreign: 12 };
  if (meta.category === "Contra") return { large: 55, mid: 25, small: 20, foreign: 0 };
  return { large: 60, mid: 25, small: 15, foreign: 0 };
}

/* ── Risk metrics generator ── */
function genRiskMetrics(meta: FundMeta) {
  const base = meta.riskLevel;
  const stdDev3Y = 6 + base * 3.5 + (Math.random() * 2 - 1);
  const sharpe3Y = meta.returns["3Y"] > 15 ? 0.9 + Math.random() * 0.6 : 0.4 + Math.random() * 0.5;
  const alpha3Y = meta.returns["3Y"] - 12 - base + Math.random() * 3;
  return {
    standardDeviation: { "1Y": +(stdDev3Y * 0.85).toFixed(1), "3Y": +stdDev3Y.toFixed(1), "5Y": +(stdDev3Y * 1.15).toFixed(1) },
    sharpe: { "1Y": +(sharpe3Y * 1.2).toFixed(2), "3Y": +sharpe3Y.toFixed(2), "5Y": +(sharpe3Y * 0.9).toFixed(2) },
    sortino: { "3Y": +(sharpe3Y * 1.4).toFixed(2) },
    alpha: { "1Y": +(alpha3Y * 1.3).toFixed(1), "3Y": +alpha3Y.toFixed(1), "5Y": +(alpha3Y * 0.85).toFixed(1) },
    beta: +(0.6 + base * 0.08 + Math.random() * 0.1).toFixed(2),
    rSquared: +(0.65 + Math.random() * 0.2).toFixed(2),
    treynor: +(10 + meta.returns["3Y"] * 0.5 + Math.random() * 5).toFixed(1),
    informationRatio: +(0.3 + Math.random() * 0.6).toFixed(2),
    maxDrawdown: {
      amount: +(-(15 + base * 5 + Math.random() * 8)).toFixed(1),
      peakDate: "2020-01-14", troughDate: "2020-03-23", recoveryDate: "2020-09-08",
      daysToRecover: 120 + Math.floor(base * 15 + Math.random() * 40),
    },
    upsideCapture: +(80 + Math.random() * 20).toFixed(0),
    downsideCapture: +(55 + base * 5 + Math.random() * 15).toFixed(0),
    var95: +(-(1.5 + base * 0.5 + Math.random())).toFixed(1),
  };
}

/* ── Returns table generator ── */
function genReturnsTable(meta: FundMeta) {
  const r = meta.returns;
  const bScale = 0.78;
  const cScale = 0.88;
  return [
    { period: "1M", fund: +(r["1Y"] / 14 + Math.random() * 2 - 1).toFixed(1), benchmark: +(r["1Y"] / 14 * bScale).toFixed(1), categoryAvg: +(r["1Y"] / 14 * cScale).toFixed(1), rank: 10 + Math.floor(Math.random() * 25) },
    { period: "3M", fund: +(r["1Y"] / 5 + Math.random() * 2).toFixed(1), benchmark: +(r["1Y"] / 5 * bScale).toFixed(1), categoryAvg: +(r["1Y"] / 5 * cScale).toFixed(1), rank: 8 + Math.floor(Math.random() * 20) },
    { period: "6M", fund: +(r["1Y"] / 2.2 + Math.random() * 2).toFixed(1), benchmark: +(r["1Y"] / 2.2 * bScale).toFixed(1), categoryAvg: +(r["1Y"] / 2.2 * cScale).toFixed(1), rank: 5 + Math.floor(Math.random() * 20) },
    { period: "1Y", fund: r["1Y"], benchmark: +(r["1Y"] * bScale).toFixed(1), categoryAvg: +(r["1Y"] * cScale).toFixed(1), rank: 5 + Math.floor(Math.random() * 15) },
    { period: "3Y", fund: r["3Y"], benchmark: +(r["3Y"] * bScale).toFixed(1), categoryAvg: +(r["3Y"] * cScale).toFixed(1), rank: 5 + Math.floor(Math.random() * 20) },
    { period: "5Y", fund: r["5Y"] ?? null, benchmark: r["5Y"] ? +(r["5Y"] * bScale).toFixed(1) : null, categoryAvg: r["5Y"] ? +(r["5Y"] * cScale).toFixed(1) : null, rank: r["5Y"] ? 3 + Math.floor(Math.random() * 15) : null },
    { period: "Since Inception", fund: r.sinceInception, benchmark: +(r.sinceInception * bScale).toFixed(1), categoryAvg: null as any, rank: null as any },
  ];
}

/* ── TER history generator ── */
function genTERHistory(meta: FundMeta) {
  const current = meta.ter;
  return [
    { date: "2023-01", ter: +(current + 0.12).toFixed(2) },
    { date: "2023-06", ter: +(current + 0.08).toFixed(2) },
    { date: "2024-01", ter: +(current + 0.04).toFixed(2) },
    { date: "2024-06", ter: +(current + 0.02).toFixed(2) },
    { date: "2025-01", ter: current },
  ];
}

/* ── Year returns generator ── */
function genYearReturns(meta: FundMeta) {
  const base = meta.returns["3Y"];
  const vol = meta.riskLevel * 4;
  return [
    { year: "2020", fund: +(base * 1.5 + vol * (Math.random() - 0.3)).toFixed(1), benchmark: +(base * 1.1).toFixed(1), categoryAvg: +(base * 1.3).toFixed(1) },
    { year: "2021", fund: +(base * 2.0 + vol * (Math.random() - 0.2)).toFixed(1), benchmark: +(base * 1.5).toFixed(1), categoryAvg: +(base * 1.7).toFixed(1) },
    { year: "2022", fund: +(-(2 + Math.random() * vol * 0.5)).toFixed(1), benchmark: +(2 + Math.random() * 3).toFixed(1), categoryAvg: +(-(1 + Math.random() * vol * 0.3)).toFixed(1) },
    { year: "2023", fund: +(base * 1.3 + Math.random() * 5).toFixed(1), benchmark: +(base * 1.0).toFixed(1), categoryAvg: +(base * 1.1).toFixed(1) },
    { year: "2024", fund: +(base * 0.9 + Math.random() * 4).toFixed(1), benchmark: +(base * 0.7).toFixed(1), categoryAvg: +(base * 0.8).toFixed(1) },
    { year: "2025 YTD", fund: +(base * 0.4 + Math.random() * 3).toFixed(1), benchmark: +(base * 0.3).toFixed(1), categoryAvg: +(base * 0.35).toFixed(1) },
  ];
}

/* ── Peers generator ── */
function genPeers(meta: FundMeta) {
  const peers = FUND_META.filter(f => f.slug !== meta.slug && (f.category === meta.category || f.subCategory === meta.subCategory)).slice(0, 4);
  const result = [
    { id: meta.id, name: meta.shortName, aum: meta.aum, return1Y: meta.returns["1Y"], return3Y: meta.returns["3Y"], return5Y: meta.returns["5Y"], ter: meta.ter, sharpe: +(0.8 + Math.random() * 0.6).toFixed(2), maxDD: +(-(15 + meta.riskLevel * 4 + Math.random() * 5)).toFixed(1) },
  ];
  for (const p of peers) {
    result.push({
      id: p.id, name: p.shortName, aum: p.aum, return1Y: p.returns["1Y"], return3Y: p.returns["3Y"], return5Y: p.returns["5Y"], ter: p.ter, sharpe: +(0.7 + Math.random() * 0.6).toFixed(2), maxDD: +(-(15 + p.riskLevel * 4 + Math.random() * 5)).toFixed(1),
    });
  }
  while (result.length < 5) {
    result.push({ id: "generic", name: "Category Average", aum: 20000, return1Y: meta.returns["1Y"] * 0.9, return3Y: meta.returns["3Y"] * 0.88, return5Y: (meta.returns["5Y"] ?? meta.returns["3Y"]) * 0.85, ter: meta.ter * 1.2, sharpe: +(0.6 + Math.random() * 0.4).toFixed(2), maxDD: +(-(20 + meta.riskLevel * 5)).toFixed(1) });
  }
  return result;
}

/* ═══════════════════════════════════
   PUBLIC API — getFundData(slug)
   ═══════════════════════════════════ */

export function getFundData(slug: string) {
  const meta = FUND_META.find(f => f.slug === slug) ?? FUND_META[0];
  const v = VERDICTS[meta.slug] ?? VERDICTS["ppfas-flexi-cap"];
  const holdingsKey = getHoldingsKey(meta);
  const sectorKey = getSectorKey(meta);

  return {
    // Core scheme info (matches MOCK_SCHEME_DETAIL shape)
    id: meta.id,
    name: meta.name,
    shortName: meta.shortName,
    amcName: meta.amcName,
    category: meta.category,
    subCategory: meta.subCategory,
    plan: meta.plan,
    amfiCode: meta.amfiCode,
    isin: meta.isin,
    launchDate: meta.launchDate,
    benchmark: meta.benchmark,
    riskLevel: meta.riskLevel,
    ter: meta.ter,
    aum: meta.aum,
    nav: { current: meta.nav, date: "2026-02-27", previousClose: +(meta.nav / (1 + meta.dayChangePct / 100)).toFixed(2), dayChange: +(meta.nav - meta.nav / (1 + meta.dayChangePct / 100)).toFixed(2), dayChangePercent: meta.dayChangePct },
    returns: { "1Y": meta.returns["1Y"], "3Y": meta.returns["3Y"], "5Y": meta.returns["5Y"], "10Y": meta.returns["10Y"], sinceInception: meta.returns.sinceInception },
    fundManagers: meta.managers.map(m => ({ name: m.name, tenure: m.tenure, tenureStart: m.tenureStart, totalAUM: m.totalAUM, fundsManaged: m.fundsManaged, photo: undefined, qualifications: m.qualifications })),
    returnsTable: genReturnsTable(meta),
    riskMetrics: genRiskMetrics(meta),
    topHoldings: EQUITY_HOLDINGS_POOLS[holdingsKey] ?? EQUITY_HOLDINGS_POOLS["large-bank-heavy"],
    sectorAllocation: SECTOR_POOLS[sectorKey] ?? SECTOR_POOLS["equity-diversified"],
    marketCap: getMarketCap(meta),
    terHistory: genTERHistory(meta),
    verdict: {
      rating: meta.verdict as "buy" | "hold" | "avoid" | "watch",
      summary: v.summary,
      pros: v.pros,
      cons: v.cons,
      whoShouldInvest: v.who,
      whoShouldAvoid: v.whoNot,
      alternatives: v.alts,
    },
  };
}

/** Get peer comparison data for a fund */
export function getFundPeers(slug: string) {
  const meta = FUND_META.find(f => f.slug === slug) ?? FUND_META[0];
  return genPeers(meta);
}

/** Get calendar year returns for a fund */
export function getFundYearReturns(slug: string) {
  const meta = FUND_META.find(f => f.slug === slug) ?? FUND_META[0];
  return genYearReturns(meta);
}

/** Get all available fund slugs */
export function getAllFundSlugs(): string[] {
  return FUND_META.map(f => f.slug);
}
