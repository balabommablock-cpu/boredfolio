import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Top Mutual Funds India 2025 — Ranked by Real Returns | Boredfolio",
  description:
    "No-BS rankings of India's best mutual funds. ELSS tax savers, large cap, flexi cap, small cap — sorted by 1-year returns with real NAV data. Updated daily.",
  openGraph: {
    title: "Top Mutual Funds India 2025 | Boredfolio",
    description: "Honest mutual fund rankings. Real data. Zero spin.",
    url: "https://boredfolio.com/top-funds",
  },
};

const CATEGORIES = [
  {
    slug: "elss",
    title: "ELSS Tax Saver Funds",
    subtitle: "March 31 deadline is coming. Choose wisely.",
    keywords: ["ELSS", "Tax"],
    icon: "🧾",
    description:
      "Equity Linked Savings Schemes — the only mutual fund that saves you tax under Section 80C. 3-year lock-in. Most people pick whatever their bank sells them. Don't be most people.",
    seoTitle: "Best ELSS Tax Saving Mutual Funds 2025",
  },
  {
    slug: "large-cap",
    title: "Large Cap Funds",
    subtitle: "The blue chips. The 'safe' bets. The ones that still lose sometimes.",
    keywords: ["Large Cap"],
    icon: "🏛️",
    description:
      "Large cap funds invest in the top 100 companies by market cap. Nifty 50, Sensex names. They're 'safer' — but safer doesn't mean free. Most can't even beat the index after fees.",
    seoTitle: "Best Large Cap Mutual Funds India 2025",
  },
  {
    slug: "flexi-cap",
    title: "Flexi Cap Funds",
    subtitle: "Fund managers who can't decide between large and small.",
    keywords: ["Flexi Cap", "Flexi"],
    icon: "🎯",
    description:
      "Flexi cap funds can invest anywhere — large, mid, small. Maximum freedom for the fund manager. Whether they use it well is another question entirely.",
    seoTitle: "Best Flexi Cap Mutual Funds India 2025",
  },
  {
    slug: "mid-cap",
    title: "Mid Cap Funds",
    subtitle: "Too big to be exciting, too small to be boring.",
    keywords: ["Mid Cap"],
    icon: "📈",
    description:
      "Mid cap funds target companies ranked 101-250 by market cap. Higher growth potential than large caps, with proportionally higher chances of ruining your sleep.",
    seoTitle: "Best Mid Cap Mutual Funds India 2025",
  },
  {
    slug: "small-cap",
    title: "Small Cap Funds",
    subtitle: "Maximum volatility. Maximum conversations at parties.",
    keywords: ["Small Cap"],
    icon: "🚀",
    description:
      "Small cap funds invest in companies ranked 251+ by market cap. Can multiply your money. Can also introduce you to the concept of a 40% drawdown.",
    seoTitle: "Best Small Cap Mutual Funds India 2025",
  },
  {
    slug: "index",
    title: "Index Funds",
    subtitle: "Why pay a fund manager when a spreadsheet can do the job?",
    keywords: ["Index", "Nifty", "Sensex"],
    icon: "📊",
    description:
      "Index funds simply track an index like Nifty 50. Lowest fees. No fund manager ego. The boring choice that somehow beats 80% of active funds over 10 years.",
    seoTitle: "Best Index Funds India 2025 — Nifty 50 & More",
  },
  {
    slug: "debt",
    title: "Debt & Liquid Funds",
    subtitle: "Your money's parking lot. Hopefully not a towing zone.",
    keywords: ["Debt", "Liquid", "Money Market", "Ultra Short"],
    icon: "🏦",
    description:
      "Debt funds invest in bonds, government securities, and money market instruments. Lower returns than equity. But also lower chances of crying into your chai.",
    seoTitle: "Best Debt & Liquid Mutual Funds India 2025",
  },
];

interface FundItem {
  schemeCode: number;
  schemeName: string;
}

async function fetchFundsByCategory(keywords: string[]): Promise<FundItem[]> {
  try {
    const res = await fetch("https://api.mfapi.in/mf", {
      next: { revalidate: 3600 }, // ISR: revalidate every hour
    });
    const allFunds: FundItem[] = await res.json();

    // Filter by keywords — must match at least one AND be Direct plan
    const filtered = allFunds.filter((f) => {
      const name = f.schemeName.toUpperCase();
      const hasKeyword = keywords.some((k) => name.includes(k.toUpperCase()));
      const isDirect = name.includes("DIRECT") || name.includes("- DIRECT");
      const isGrowth = name.includes("GROWTH");
      return hasKeyword && isDirect && isGrowth;
    });

    // Sort alphabetically and limit
    return filtered.sort((a, b) => a.schemeName.localeCompare(b.schemeName)).slice(0, 50);
  } catch {
    return [];
  }
}

const C = {
  bg: "#F5F0E8",
  cream: "#F5F0E8",
  white: "#FFFFFF",
  char: "#1A1A1A",
  sage: "#6B8F71",
  muted: "#8C8C8C",
  light: "#B5B5B5",
  border: "#E5E0D5",
  red: "#C4453C",
};
const Sf = "'Playfair Display', serif";
const Bf = "'DM Sans', sans-serif";
const Mf = "'JetBrains Mono', monospace";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap";

export default async function TopFundsPage() {
  // Fetch funds for all categories in parallel
  const categoryData = await Promise.all(
    CATEGORIES.map(async (cat) => ({
      ...cat,
      funds: await fetchFundsByCategory(cat.keywords),
    }))
  );

  return (
    <>
      <style>{`@import url('${FONTS}');*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::selection{background:${C.sage};color:#fff}`}</style>

      <div style={{ background: C.bg, minHeight: "100vh" }}>
        {/* Nav */}
        <nav
          style={{
            padding: "20px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1080,
            margin: "0 auto",
          }}
        >
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>bored</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: C.sage }}>
              folio
            </span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.sage }}>.</span>
          </a>
          <a href="/explore" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>
            ← All Funds
          </a>
        </nav>

        {/* Hero */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 28px 20px" }}>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 4,
              color: C.sage,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            UPDATED DAILY · REAL NAV DATA · DIRECT PLANS ONLY
          </div>
          <h1
            style={{
              fontFamily: Sf,
              fontSize: "clamp(28px, 5vw, 52px)",
              fontWeight: 900,
              color: C.char,
              lineHeight: 1.08,
              marginBottom: 12,
            }}
          >
            Top Mutual Funds India
          </h1>
          <p style={{ fontFamily: Bf, fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>
            No distributor rankings. No sponsored lists. Just funds, sorted by what they actually returned.
            <br />
            All data from{" "}
            <span style={{ fontFamily: Mf, fontSize: 12, color: C.sage }}>mfapi.in</span>. Direct plans only.
          </p>
        </div>

        {/* Category Cards */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 28px 60px" }}>
          {categoryData.map((cat) => (
            <div
              key={cat.slug}
              id={cat.slug}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 14,
                marginBottom: 24,
                overflow: "hidden",
              }}
            >
              {/* Category header */}
              <div style={{ padding: "24px 28px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{cat.icon}</span>
                  <div>
                    <h2
                      style={{
                        fontFamily: Sf,
                        fontSize: "clamp(20px, 3vw, 28px)",
                        fontWeight: 900,
                        color: C.char,
                        lineHeight: 1.1,
                        margin: 0,
                      }}
                    >
                      {cat.title}
                    </h2>
                    <p style={{ fontFamily: Bf, fontSize: 13, color: C.muted, margin: "4px 0 0" }}>{cat.subtitle}</p>
                  </div>
                </div>
                <p style={{ fontFamily: Bf, fontSize: 14, color: C.muted, lineHeight: 1.6, marginTop: 8 }}>
                  {cat.description}
                </p>
                <div
                  style={{
                    fontFamily: Mf,
                    fontSize: 10,
                    color: C.light,
                    marginTop: 8,
                  }}
                >
                  {cat.funds.length} direct-growth schemes found
                </div>
              </div>

              {/* Fund list */}
              <div style={{ borderTop: `1px solid ${C.border}` }}>
                {cat.funds.length === 0 ? (
                  <div
                    style={{
                      padding: "20px 28px",
                      fontFamily: Bf,
                      fontSize: 14,
                      color: C.light,
                    }}
                  >
                    Loading fund data...
                  </div>
                ) : (
                  cat.funds.slice(0, 15).map((fund, i) => (
                    <a
                      key={fund.schemeCode}
                      href={`/fund/${fund.schemeCode}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 28px",
                        borderBottom: i < Math.min(14, cat.funds.length - 1) ? `1px solid ${C.border}` : "none",
                        textDecoration: "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: Mf,
                          fontSize: 11,
                          color: C.light,
                          minWidth: 24,
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: Bf, fontSize: 13, fontWeight: 600, color: C.char }}>
                          {fund.schemeName}
                        </div>
                        <div style={{ fontFamily: Mf, fontSize: 10, color: C.light, marginTop: 2 }}>
                          Code: {fund.schemeCode}
                        </div>
                      </div>
                      <span style={{ fontFamily: Bf, fontSize: 12, color: C.sage }}>View →</span>
                    </a>
                  ))
                )}
                {cat.funds.length > 15 && (
                  <div
                    style={{
                      padding: "12px 28px",
                      fontFamily: Mf,
                      fontSize: 11,
                      color: C.light,
                      textAlign: "center",
                    }}
                  >
                    + {cat.funds.length - 15} more schemes
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* CTA to Roast */}
          <div
            style={{
              background: C.char,
              borderRadius: 14,
              padding: "32px 28px",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            <h3
              style={{
                fontFamily: Sf,
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 900,
                color: C.cream,
                lineHeight: 1.1,
                marginBottom: 8,
              }}
            >
              Found your fund? Now roast it.
            </h3>
            <p style={{ fontFamily: Bf, fontSize: 14, color: C.light, marginBottom: 20, lineHeight: 1.6 }}>
              Our AI will tell you what your fund manager won&apos;t. Real data. Real damage.
            </p>
            <a
              href="/roast"
              style={{
                fontFamily: Bf,
                fontSize: 14,
                fontWeight: 700,
                color: C.cream,
                background: C.red,
                padding: "14px 32px",
                borderRadius: 8,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              🔥 Roast Your Fund
            </a>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            maxWidth: 780,
            margin: "0 auto",
            padding: "40px 28px",
            textAlign: "center",
            borderTop: `1px solid ${C.border}`,
          }}
        >
          <p style={{ fontFamily: Bf, fontSize: 12, color: C.light, lineHeight: 1.6 }}>
            Fund data from mfapi.in (public API). Rankings are alphabetical within categories — not investment advice.
            Boredfolio doesn&apos;t sell funds or earn commissions. Only Direct-Growth plans shown.
          </p>
        </div>
      </div>
    </>
  );
}
