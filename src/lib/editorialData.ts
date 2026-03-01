/*
 * EDITORIAL DATA — The Soul of Boredfolio
 * ────────────────────────────────────────
 * All the snarky, sharp, editorial content that gives
 * Boredfolio its personality. Every nickname, every one-liner,
 * every collection description that makes fund houses nervous.
 *
 * "Wendy's Twitter meets expense ratios."
 */

/* ── Ticker Messages (Scrolling Truths) — 30 lines, shuffled on load ── */
export const TICKER_MESSAGES = [
  "Your SIP isn\u2019t a personality trait",
  "Expense ratio 2%? That\u2019s not a fee, that\u2019s a heist",
  "\u201cMutual Funds Sahi Hai\u201d \u2014 but which one?",
  "Your bank RM profits when YOU invest more",
  "NFO at \u20b910 NAV is NOT cheap",
  "67% of large-cap funds can\u2019t beat the Nifty",
  "Direct plan exists. Distributors hope you never find out",
  "Past performance guarantees past commissions",
  "Your fund manager takes a 2.5% cut even when he loses your money",
  "\u201cLong term\u201d is not a strategy. It\u2019s a prayer",
  "A \u20b9500 SIP in the wrong fund is still the wrong fund",
  "Index funds don\u2019t need a corner office in BKC",
  "Your portfolio has 7 funds and they all own HDFC Bank",
  "\u201cWealth creation\u201d is what your distributor calls his commission",
  "SEBI made direct plans mandatory. Nobody told you. Funny, that",
  "Sectoral funds: because FOMO needed a DEMAT account",
  "Exit load exists so you can\u2019t leave when the fund underperforms",
  "Your mid-cap fund\u2019s biggest holding is a large-cap stock",
  "The \u20b910 NAV myth has survived longer than most marriages",
  "If your advisor can\u2019t explain Sharpe ratio, fire your advisor",
  "Regular plan investors are subsidizing their distributor\u2019s EMI",
  "Your fund\u2019s alpha disappeared after adjusting for risk",
  "ELSS lock-in: 3 years of pretending you\u2019re a long-term investor",
  "Dividend option doesn\u2019t create income. It returns your own money",
  "AUM of \u20b950,000 Cr in a small-cap fund. Read that again",
  "Benchmark change mid-year? Nothing suspicious at all",
  "Your liquid fund lost money in 2019. Liquid was doing heavy lifting",
  "Star ratings change quarterly. Stars are for restaurants, not funds",
  "Consistent means the fund manager didn\u2019t panic-sell. Low bar",
  "Your distributor earns more from your SIP than you earn from your job",
];

/* ── Stats Strip (Homepage) ── */
export const HOMEPAGE_STATS = [
  { number: "1,547", label: "Schemes in India", snark: "You own 5. Can you explain any?" },
  { number: "\u20b9847", label: "Hidden commission / lakh / year", snark: "YOUR money. Walking away." },
  { number: "67%", label: "Large-caps losing to Nifty", snark: "Paying someone to lose to a spreadsheet." },
];

/* ── Finance Dictionary Terms ── */
export interface DictionaryTerm {
  term: string;
  group: "BASICS" | "METRICS" | "TRAPS";
  oneLiner: string;
  fullExplanation: string;
}

export const DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    term: "Expense Ratio", group: "BASICS",
    oneLiner: "The invisible hand in your pocket.",
    fullExplanation: "Your fund charges you every single day. Not a bill \u2014 they silently shave it off your NAV. A 2% expense ratio on \u20b910L means \u20b920,000/year vanishing. Over 20 years? That\u2019s a car. Your fund manager\u2019s car.",
  },
  {
    term: "Direct vs Regular Plan", group: "BASICS",
    oneLiner: "Same food. Different bill.",
    fullExplanation: "Same biryani, two counters. Counter B charges 1% more because a guy in a tie pointed you there. The \u20b98\u201318 lakh difference over 20 years? His kids\u2019 school fees.",
  },
  {
    term: "NFO (New Fund Offer)", group: "TRAPS",
    oneLiner: "The trailer looked amazing. The movie doesn\u2019t exist yet.",
    fullExplanation: "Fund houses launch NFOs like Bollywood sequels \u2014 because the original made money. That \u20b910 NAV isn\u2019t \u2018cheap.\u2019 90% of NFOs have an identical twin with 5+ years of data.",
  },
  {
    term: "Alpha", group: "METRICS",
    oneLiner: "The only reason your fund manager deserves breakfast.",
    fullExplanation: "Alpha is return ABOVE what the market gave for free. Zero alpha? You paid lakhs for index photocopying. Negative? You paid someone to do WORSE than nothing.",
  },
  {
    term: "NAV", group: "BASICS",
    oneLiner: "A price tag that means absolutely nothing by itself.",
    fullExplanation: "NAV \u20b9500 is not \u2018expensive.\u2019 \u20b910 is not \u2018cheap.\u2019 \u20b910K in either gives the same % growth. Most misunderstood concept in Indian mutual funds.",
  },
  {
    term: "Exit Load", group: "BASICS",
    oneLiner: "A breakup fee. The fund wants commitment.",
    fullExplanation: "Most equity funds charge 1% if you leave within 1 year. The real traps are in debt funds with longer lock-ins.",
  },
  {
    term: "AUM", group: "BASICS",
    oneLiner: "How big the fund is. In small-caps, \u2018big\u2019 IS the problem.",
    fullExplanation: "\u20b950,000 crore small-cap = sumo wrestler in a phone booth. Can\u2019t buy without moving prices.",
  },
  {
    term: "SIP", group: "BASICS",
    oneLiner: "An auto-debit. Not a financial plan. Not a personality trait.",
    fullExplanation: "SIP + bad fund = disciplined losses. The method matters less than WHAT you invest in.",
  },
  {
    term: "CAGR", group: "METRICS",
    oneLiner: "The smooth version of a very bumpy ride.",
    fullExplanation: "Your \u20b91L became \u20b92L in 5 years? CAGR says 14.9%. Hides the year it dropped to \u20b970K.",
  },
  {
    term: "Sharpe Ratio", group: "METRICS",
    oneLiner: "Return per unit of risk.",
    fullExplanation: "Above 1 = good. Below 0.5 = you\u2019re taking risk for nothing.",
  },
  {
    term: "Portfolio Overlap", group: "TRAPS",
    oneLiner: "Five restaurants. Same dal makhani.",
    fullExplanation: "If 4 of 5 funds hold HDFC Bank, ICICI, Infosys, Reliance \u2014 you have 1.5 funds and a false sense of security.",
  },
  {
    term: "Tracking Error", group: "METRICS",
    oneLiner: "How badly your index fund fails at its one job.",
    fullExplanation: "Even 0.2% annually on \u20b91 crore over 20 years = several lakhs. Two Nifty 50 funds are NOT identical.",
  },
];

/* ── Fund Autopsies (with editorial nicknames) ── */
export interface FundAutopsy {
  name: string;
  category: string;
  nickname: string;
  oneLiner: string;
  signal: "green" | "yellow" | "red";
}

export const FUND_AUTOPSIES: FundAutopsy[] = [
  { name: "Parag Parikh Flexi Cap", category: "FLEXI CAP", nickname: "The Sensible Friend", oneLiner: "India\u2019s most loved fund. Even your CA aunty approves.", signal: "green" },
  { name: "Quant Small Cap", category: "SMALL CAP", nickname: "The Unhinged Genius", oneLiner: "Made people rich. Heart attacks. SEBI investigation. Never boring.", signal: "yellow" },
  { name: "SBI Blue Chip", category: "LARGE CAP", nickname: "The Index in Disguise", oneLiner: "Your bank RM\u2019s favourite recommendation. Which tells you everything.", signal: "yellow" },
  { name: "Nippon India Small Cap", category: "SMALL CAP", nickname: "Too Big for Its Boots", oneLiner: "\u20b950,000 crore in small-cap stocks. That sentence is its own punchline.", signal: "red" },
  { name: "HDFC Mid-Cap Opportunities", category: "MID CAP", nickname: "The Old Reliable", oneLiner: "Since 2007. Survived everything. Made money through everything.", signal: "green" },
  { name: "Mirae Asset Large Cap", category: "LARGE CAP", nickname: "Korean Efficiency", oneLiner: "Best case for active large-cap. Also the best argument against it.", signal: "yellow" },
  { name: "Axis Bluechip", category: "LARGE CAP", nickname: "The Fallen Star", oneLiner: "From darling to front-running scandal. Past glory is not a strategy.", signal: "red" },
  { name: "ICICI Pru Value Discovery", category: "VALUE", nickname: "The Patient One", oneLiner: "When value works, genius. When it doesn\u2019t, existential crisis. Both temporary.", signal: "green" },
];

/* ── Curated Collections ── */
export interface Collection {
  id: string;
  number: string;
  name: string;
  description: string;
  count: number;
  tag: string;
  funds: string[];
}

export const COLLECTIONS: Collection[] = [
  {
    id: "rm-recommended", number: "01",
    name: "Funds Your Bank RM Gets Paid to Push",
    description: "Your RM called. Again. Not for your retirement \u2014 for his commission.",
    count: 12, tag: "EXPOS\u00c9",
    funds: ["SBI Blue Chip", "Axis Bluechip", "HDFC Top 100", "ICICI Pru Bluechip", "Kotak Bluechip"],
  },
  {
    id: "actually-good", number: "02",
    name: "The 3 AM Portfolio",
    description: "Three funds. One SIP. Delete your brokerage app. Live your life.",
    count: 5, tag: "EDITOR\u2019S PICK",
    funds: ["Parag Parikh Flexi Cap", "HDFC Mid-Cap Opportunities", "UTI Nifty 50 Index", "ICICI Pru Value Discovery", "Kotak Equity Opportunities"],
  },
  {
    id: "small-cap-circus", number: "03",
    name: "The Small-Cap Circus",
    description: "Where \u20b91L becomes \u20b95L. Or \u20b960K. Sometimes in the same week.",
    count: 8, tag: "HIGH RISK",
    funds: ["Quant Small Cap", "Nippon India Small Cap", "SBI Small Cap", "Axis Small Cap", "HDFC Small Cap"],
  },
  {
    id: "nfo-graveyard", number: "04",
    name: "NFO Graveyard",
    description: "Remember when your RM said \u2018ground floor opportunity\u2019? These funds had full-page ads in the Times of India, celebrity fund managers, and \u20b910 NAV \u2018because it\u2019s cheap.\u2019 We checked how they\u2019re doing.",
    count: 15, tag: "REALITY CHECK",
    funds: ["Whiteoak Capital Large Cap", "Quant Flexi Cap", "Bajaj Finserv Large Cap", "Bandhan Sterling Value", "Trust MF Value"],
  },
  {
    id: "aum-bomb", number: "05",
    name: "Too Fat to Run",
    description: "A \u20b950,000 crore small-cap fund is like stuffing an elephant into an auto-rickshaw. It can\u2019t buy small stocks without moving the price up. It can\u2019t sell without crashing them down.",
    count: 6, tag: "WARNING",
    funds: ["Nippon India Small Cap", "SBI Small Cap", "SBI Contra", "HDFC Flexi Cap", "Axis Small Cap"],
  },
  {
    id: "index-killers", number: "06",
    name: "Worth Their Fee. Actually.",
    description: "67% of large-cap managers lose to a spreadsheet called \u2018Nifty 50.\u2019 These are the ones who earned their biryani. For now. We\u2019ll be checking back. Annually. With receipts.",
    count: 9, tag: "DATA",
    funds: ["Parag Parikh Flexi Cap", "ICICI Pru Value Discovery", "HDFC Mid-Cap Opportunities", "Mirae Asset Large Cap", "Canara Robeco Bluechip"],
  },
  {
    id: "tax-traps", number: "07",
    name: "Tax Traps in Fund Clothing",
    description: "Your ELSS \u2018saved\u2019 you \u20b946,800 in tax. Then the LTCG bill arrived. Then you realised debt fund taxation changed in 2023 and nobody told you. The government giveth. The fine print taketh away.",
    count: 7, tag: "TRAPS",
    funds: ["Axis ELSS", "Mirae Asset ELSS", "SBI Magnum ELSS", "HDFC ELSS", "Canara Robeco ELSS"],
  },
  {
    id: "one-man-show", number: "08",
    name: "One Resignation Letter Away",
    description: "Brilliant fund. One manager. No succession plan. If Rajeev Thakkar decides he\u2019d rather farm organic tomatoes in Nashik, your flexi-cap thesis evaporates overnight.",
    count: 8, tag: "INVESTIGATION",
    funds: ["Parag Parikh Flexi Cap", "Quant Small Cap", "SBI Small Cap", "Motilal Oswal Midcap", "Axis Bluechip"],
  },
];

/* ── Blog Articles ── */
export interface BlogArticle {
  title: string;
  description: string;
  tag: string;
  readTime: string;
  featured?: boolean;
}

export const BLOG_ARTICLES: BlogArticle[] = [
  { title: "The \u20b950,000 Crore Commission Industry", description: "We mapped every rupee from your SIP to your distributor\u2019s pocket.", tag: "INVESTIGATION", readTime: "12 min", featured: true },
  { title: "Why Your Fund\u2019s 1-Year Return Is a Lie", description: "Same fund: +45% or +8% depending on date.", tag: "DATA", readTime: "8 min" },
  { title: "Your Bank RM\u2019s Commission: A Love Story", description: "They called. They smiled. Here\u2019s the missing part.", tag: "EXPOS\u00c9", readTime: "6 min" },
  { title: "NFOs: Bollywood Sequels of Finance", description: "Maximum hype. Zero track record. Same plot.", tag: "ANALYSIS", readTime: "7 min" },
  { title: "Small-Cap Funds: The AUM Time Bomb", description: "How many days to sell 25% of the portfolio?", tag: "INVESTIGATION", readTime: "10 min" },
  { title: "Fund Manager Musical Chairs", description: "The manager who made your returns might be gone.", tag: "DATA", readTime: "9 min" },
];

/* ── Fund slug to nickname mapping (for scheme detail pages) ── */
export const FUND_NICKNAMES: Record<string, { nickname: string; oneLinerTruth: string }> = {
  "ppfas-flexi-cap": {
    nickname: "The Sensible Friend",
    oneLinerTruth: "India\u2019s most loved flexi-cap. Even your CA aunty approves. But even cult favourites deserve a colonoscopy.",
  },
  "quant-small-cap": {
    nickname: "The Unhinged Genius",
    oneLinerTruth: "Returns that make your CA call you. SEBI investigation that makes your CA call their lawyer. Buckle up.",
  },
  "hdfc-mid-cap-opportunities": {
    nickname: "The Old Reliable",
    oneLinerTruth: "Since 2007. Survived everything. Made money through everything. The Toyota Innova of mutual funds.",
  },
  "sbi-bluechip": {
    nickname: "The Index in Disguise",
    oneLinerTruth: "Your bank RM\u2019s favourite pitch. Which tells you everything about who it\u2019s actually built to serve.",
  },
  "nippon-india-small-cap": {
    nickname: "Too Big for Its Boots",
    oneLinerTruth: "\u20b950,000 crore in small-cap stocks. That sentence is its own punchline. Sumo wrestler in a phone booth.",
  },
  "mirae-asset-large-cap": {
    nickname: "Korean Efficiency",
    oneLinerTruth: "The strongest argument for active large-cap. Also accidentally the strongest argument against it.",
  },
  "axis-bluechip": {
    nickname: "The Fallen Star",
    oneLinerTruth: "2019: India\u2019s favourite AMC. 2022: Front-running scandal. 2024: Star managers gone. Read the full autopsy.",
  },
  "icici-pru-value-discovery": {
    nickname: "The Patient One",
    oneLinerTruth: "When value works, genius. When it doesn\u2019t, existential crisis. Both temporary. Patience required.",
  },
  "hdfc-flexi-cap": {
    nickname: "The Shape-Shifter",
    oneLinerTruth: "Was large-cap. Became flexi-cap. The fund that changed its name so it could do whatever it wanted.",
  },
  "kotak-emerging-equity": {
    nickname: "The Quiet Compounder",
    oneLinerTruth: "Nobody talks about it at parties. Nobody regrets owning it either. The Toyota Camry of mid-caps.",
  },
  "motilal-oswal-midcap": {
    nickname: "The Chainsaw",
    oneLinerTruth: "High-conviction, concentrated, the kind of portfolio that makes your heart rate a health concern.",
  },
  "sbi-small-cap": {
    nickname: "The Gatekeeper",
    oneLinerTruth: "So popular they had to stop accepting new money. When a fund closes its doors, pay attention.",
  },
  "uti-nifty-50-index": {
    nickname: "The No-Brainer",
    oneLinerTruth: "Buys the entire Nifty 50. Charges almost nothing. Beats 67% of active large-cap managers. That\u2019s the joke.",
  },
  "hdfc-liquid": {
    nickname: "The Parking Lot",
    oneLinerTruth: "Where money waits between ideas. Not exciting. Not supposed to be. Does exactly what it says.",
  },
  "icici-pru-short-term": {
    nickname: "The FD Alternative",
    oneLinerTruth: "Better than your bank FD. Barely. But \u2018barely better\u2019 on \u20b91 crore over 5 years? That\u2019s a holiday.",
  },
  "dsp-nifty-50-index": {
    nickname: "The Photocopy Machine",
    oneLinerTruth: "Copies the Nifty 50. Charges 0.16% for the privilege. The cheapest financial decision you\u2019ll ever make.",
  },
  "canara-robeco-bluechip": {
    nickname: "The Dark Horse",
    oneLinerTruth: "No one recommends it. No scandals. No headlines. Just quietly beating peers. The introvert of large-caps.",
  },
};

/* ── Signal dot color helper ── */
export function signalColor(signal: "green" | "yellow" | "red"): string {
  if (signal === "green") return "bg-good-500";
  if (signal === "red") return "bg-ugly-500";
  return "bg-mustard-500";
}

/* ── Collection tag color helper ── */
export function tagColor(tag: string): string {
  const danger = ["EXPOSÉ", "WARNING", "HIGH RISK", "TRAPS", "REALITY CHECK"];
  const positive = ["EDITOR\u2019S PICK", "DATA"];
  if (danger.includes(tag)) return "ugly";
  if (positive.includes(tag)) return "sage";
  return "mustard";
}
