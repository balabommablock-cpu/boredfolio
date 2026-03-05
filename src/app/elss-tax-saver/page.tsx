import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Best ELSS Tax Saving Mutual Funds 2025 — Last Date March 31 | Boredfolio",
  description:
    "Compare all ELSS tax saver mutual funds in India. Save up to ₹46,800 in tax under Section 80C. Direct plans only. Updated daily with real NAV data. March 31 deadline approaching.",
  keywords: [
    "ELSS funds",
    "tax saving mutual funds",
    "best ELSS 2025",
    "section 80C",
    "tax saver funds India",
    "ELSS direct plan",
    "tax saving SIP",
    "ELSS vs PPF",
    "mutual fund tax benefit",
    "80C investment",
  ],
  openGraph: {
    title: "Best ELSS Tax Saving Funds 2025 — March 31 Deadline | Boredfolio",
    description: "Compare all ELSS funds. Save ₹46,800 in tax. Real data, no spin.",
    url: "https://boredfolio.com/elss-tax-saver",
  },
};

interface FundItem {
  schemeCode: number;
  schemeName: string;
}

async function fetchELSSFunds(): Promise<FundItem[]> {
  try {
    const res = await fetch("https://api.mfapi.in/mf", {
      next: { revalidate: 3600 },
    });
    const allFunds: FundItem[] = await res.json();

    return allFunds
      .filter((f) => {
        const name = f.schemeName.toUpperCase();
        const isELSS = name.includes("ELSS") || name.includes("TAX SAV") || name.includes("TAX ADVANTAGE");
        const isDirect = name.includes("DIRECT") || name.includes("- DIRECT");
        const isGrowth = name.includes("GROWTH");
        return isELSS && isDirect && isGrowth;
      })
      .sort((a, b) => a.schemeName.localeCompare(b.schemeName));
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
  green: "#2D8F4E",
  mustard: "#C9A227",
};
const Sf = "'Playfair Display', serif";
const Bf = "'DM Sans', sans-serif";
const Mf = "'JetBrains Mono', monospace";
const Hf = "'Caveat', cursive";
const FONTS =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@400;700&display=swap";

export default async function ELSSPage() {
  const funds = await fetchELSSFunds();

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date("2025-03-31").getTime() - Date.now()) / (1000 * 60 * 60 * 24))
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
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="/top-funds" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>
              ← All Categories
            </a>
            <a href="/roast" style={{ fontFamily: Bf, fontSize: 13, color: C.red, textDecoration: "none", fontWeight: 600 }}>
              Roast 🔥
            </a>
          </div>
        </nav>

        {/* Urgency Banner */}
        {daysLeft > 0 && daysLeft <= 30 && (
          <div
            style={{
              background: C.mustard,
              padding: "10px 28px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: Bf, fontSize: 13, fontWeight: 700, color: C.white, margin: 0 }}>
              ⏰ {daysLeft} days left to save tax under Section 80C. Deadline: March 31, 2025.
            </p>
          </div>
        )}

        {/* Hero */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 28px 10px" }}>
          <div
            style={{
              fontFamily: Mf,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: 4,
              color: C.red,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            TAX SAVING · SECTION 80C · 3-YEAR LOCK-IN
          </div>
          <h1
            style={{
              fontFamily: Sf,
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              color: C.char,
              lineHeight: 1.08,
              marginBottom: 16,
            }}
          >
            Best ELSS Tax Saving Funds 2025
          </h1>
          <p style={{ fontFamily: Bf, fontSize: 16, color: C.muted, lineHeight: 1.7, marginBottom: 12 }}>
            ELSS funds let you save up to <strong style={{ color: C.char }}>₹46,800 in tax</strong> by investing up to
            ₹1.5 lakh under Section 80C. 3-year lock-in. Equity exposure. The only 80C option with real growth
            potential.
          </p>
          <p style={{ fontFamily: Hf, fontSize: 18, color: C.sage }}>
            Your bank will push their ELSS. We&apos;ll show you all of them.
          </p>
        </div>

        {/* Quick Facts */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 28px" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {[
              { label: "Tax Saved (30% bracket)", value: "₹46,800/yr" },
              { label: "Lock-in Period", value: "3 Years" },
              { label: "Max Deduction", value: "₹1,50,000" },
              { label: "Deadline", value: "March 31" },
            ].map((fact) => (
              <div
                key={fact.label}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 10,
                  padding: "16px 20px",
                }}
              >
                <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 1, color: C.light, textTransform: "uppercase", marginBottom: 4 }}>
                  {fact.label}
                </div>
                <div style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>
                  {fact.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ELSS vs Other 80C */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 28px" }}>
          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "20px 28px" }}>
              <h2 style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char, margin: "0 0 4px" }}>
                ELSS vs Other 80C Options
              </h2>
              <p style={{ fontFamily: Bf, fontSize: 13, color: C.muted }}>
                Shortest lock-in. Highest potential returns. Lowest guaranteed returns.
              </p>
            </div>
            <div style={{ borderTop: `1px solid ${C.border}` }}>
              {[
                { option: "ELSS", lockIn: "3 years", returns: "10-15%*", risk: "High", taxOnGains: "Yes (LTCG)" },
                { option: "PPF", lockIn: "15 years", returns: "7.1%", risk: "Zero", taxOnGains: "No" },
                { option: "NPS", lockIn: "Till 60", returns: "8-10%", risk: "Medium", taxOnGains: "Partial" },
                { option: "FD (Tax Saver)", lockIn: "5 years", returns: "6-7%", risk: "Zero", taxOnGains: "Yes" },
                { option: "SSY", lockIn: "21 years", returns: "8.2%", risk: "Zero", taxOnGains: "No" },
              ].map((row, i) => (
                <div
                  key={row.option}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "12px 28px",
                    borderBottom: i < 4 ? `1px solid ${C.border}` : "none",
                    background: row.option === "ELSS" ? `${C.sage}10` : "transparent",
                  }}
                >
                  <div>
                    <div style={{ fontFamily: Bf, fontSize: 14, fontWeight: row.option === "ELSS" ? 700 : 500, color: C.char }}>
                      {row.option}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontFamily: Mf, fontSize: 12, color: C.char }}>{row.lockIn}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: Mf, fontSize: 12, color: row.option === "ELSS" ? C.sage : C.char }}>
                      {row.returns}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: "8px 28px 12px", fontFamily: Mf, fontSize: 9, color: C.light }}>
              * ELSS returns are market-linked and not guaranteed. Historical averages.
            </div>
          </div>
        </div>

        {/* Fund List */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 28px" }}>
          <h2 style={{ fontFamily: Sf, fontSize: 24, fontWeight: 900, color: C.char, marginBottom: 4 }}>
            All ELSS Funds (Direct-Growth)
          </h2>
          <p style={{ fontFamily: Mf, fontSize: 11, color: C.light, marginBottom: 16 }}>
            {funds.length} schemes found · Direct plans only · Click for full analysis
          </p>

          <div
            style={{
              background: C.white,
              border: `1px solid ${C.border}`,
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {funds.map((fund, i) => (
              <a
                key={fund.schemeCode}
                href={`/fund/${fund.schemeCode}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 28px",
                  borderBottom: i < funds.length - 1 ? `1px solid ${C.border}` : "none",
                  textDecoration: "none",
                }}
              >
                <span
                  style={{
                    fontFamily: Mf,
                    fontSize: 11,
                    color: C.light,
                    minWidth: 28,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.char }}>
                    {fund.schemeName}
                  </div>
                  <div style={{ fontFamily: Mf, fontSize: 10, color: C.light, marginTop: 2 }}>
                    Scheme Code: {fund.schemeCode}
                  </div>
                </div>
                <span style={{ fontFamily: Bf, fontSize: 12, color: C.sage }}>Analyze →</span>
              </a>
            ))}
          </div>
        </div>

        {/* How to invest */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "32px 28px" }}>
          <div
            style={{
              background: C.char,
              borderRadius: 14,
              padding: "32px 28px",
            }}
          >
            <h3 style={{ fontFamily: Sf, fontSize: 24, fontWeight: 900, color: C.cream, marginBottom: 16 }}>
              How to Pick an ELSS Fund
            </h3>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                {
                  step: "01",
                  title: "Direct plan only",
                  text: "Regular plans give 0.5-1% to your distributor every year. For 3 years of lock-in, that's real money.",
                },
                {
                  step: "02",
                  title: "Check expense ratio",
                  text: "Lower is better. Anything above 0.5% for a Direct ELSS is overcharging. Some charge 0.3%.",
                },
                {
                  step: "03",
                  title: "Don't chase 1-year returns",
                  text: "Look at 3-year and 5-year returns. ELSS has a 3-year lock-in — 1-year returns are noise.",
                },
                {
                  step: "04",
                  title: "Start before March 31",
                  text: "Even ₹500 counts. You don't have to invest the full ₹1.5 lakh at once. SIP works too.",
                },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: 16 }}>
                  <div style={{ fontFamily: Mf, fontSize: 18, fontWeight: 700, color: C.sage, minWidth: 32 }}>
                    {item.step}
                  </div>
                  <div>
                    <div style={{ fontFamily: Bf, fontSize: 15, fontWeight: 700, color: C.cream, marginBottom: 4 }}>
                      {item.title}
                    </div>
                    <div style={{ fontFamily: Bf, fontSize: 13, color: C.light, lineHeight: 1.6 }}>{item.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA to Roast */}
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 28px 40px" }}>
          <div
            style={{
              background: `${C.red}15`,
              border: `1px solid ${C.red}30`,
              borderRadius: 14,
              padding: "28px",
              textAlign: "center",
            }}
          >
            <h3 style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char, marginBottom: 8 }}>
              Already invested in an ELSS? Let&apos;s roast it.
            </h3>
            <p style={{ fontFamily: Bf, fontSize: 14, color: C.muted, marginBottom: 16 }}>
              Our AI will tell you whether your ELSS actually deserved your money.
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
              🔥 Roast Your ELSS Fund
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
            Fund data from mfapi.in. This is not investment advice. ELSS returns are market-linked and not guaranteed.
            Consult a SEBI-registered advisor before investing. Boredfolio doesn&apos;t sell funds or earn commissions.
          </p>
        </div>
      </div>
    </>
  );
}
