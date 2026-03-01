/*
 * SLUG UTILITIES
 * ──────────────
 * Smart slug-to-name conversion with acronym awareness.
 * Used across all dynamic route pages for consistent metadata.
 */

/** Map of lowercase tokens to their proper display forms */
const ACRONYM_MAP: Record<string, string> = {
  // Fund houses
  ppfas: "PPFAS",
  hdfc: "HDFC",
  sbi: "SBI",
  uti: "UTI",
  icici: "ICICI",
  dsp: "DSP",
  mo: "Motilal Oswal",
  pru: "Prudential",

  // Industry terms
  amc: "AMC",
  mf: "MF",
  baf: "Balanced Advantage Fund",
  elss: "ELSS",
  nifty: "Nifty",
  bse: "BSE",
  nfo: "NFO",
  sip: "SIP",
  nav: "NAV",
  ter: "TER",
  cagr: "CAGR",
  etf: "ETF",
  nse: "NSE",
  ltcg: "LTCG",
  stcg: "STCG",
  swp: "SWP",
  xirr: "XIRR",
};

/**
 * Convert a URL slug to a human-readable name,
 * handling acronyms and fund house abbreviations.
 *
 * @example smartSlugToName("ppfas-flexi-cap") → "PPFAS Flexi Cap"
 * @example smartSlugToName("hdfc-baf") → "HDFC Balanced Advantage Fund"
 * @example smartSlugToName("mo-nifty-50") → "Motilal Oswal Nifty 50"
 */
export function smartSlugToName(slug: string): string {
  return slug
    .split("-")
    .map((token) => {
      const lower = token.toLowerCase();
      if (ACRONYM_MAP[lower]) return ACRONYM_MAP[lower];
      // Capitalize first letter of normal words
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join(" ");
}
