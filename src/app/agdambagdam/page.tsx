import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { FrameworkTabs } from "./framework-tabs";

/**
 * boredfolio.com/agdambagdam — editorial, restrained enterprise landing.
 *
 * Voice: humble. Show the work; don't shout about it. Admit gaps.
 * Design: warm-dark background, single violet accent (no rainbow), solid
 * surfaces (no glass morphism), numbered cards (no emoji icons), generous
 * whitespace, left-aligned editorial layout, no animated orbs — one static
 * soft gradient wash behind the hero and that's it.
 *
 * Server component. Only the framework tabs are a client island.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Agdam Bagdam — Open-source A/B testing",
  description:
    "Bayesian + Frequentist statistics, sequential testing, SRM detection, CUPED, and multi-armed bandits — in a readable, auditable TypeScript stats engine. Self-hostable under MIT.",
  keywords: [
    "A/B testing",
    "open source A/B testing",
    "feature flags",
    "Bayesian A/B testing",
    "Frequentist A/B testing",
    "SRM detection",
    "sequential testing",
    "CUPED",
    "multi-armed bandits",
    "contextual bandits",
    "self-hosted experimentation",
  ],
  alternates: { canonical: "https://boredfolio.com/agdambagdam" },
  openGraph: {
    title: "Agdam Bagdam — Open-source A/B testing",
    description:
      "Bayesian + Frequentist statistics, sequential testing, SRM, CUPED. Self-hostable under MIT.",
    siteName: "Agdam Bagdam",
    type: "website",
    url: "https://boredfolio.com/agdambagdam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agdam Bagdam — Open-source A/B testing",
    description:
      "Bayesian + Frequentist statistics, sequential testing, SRM, CUPED. Self-hostable under MIT.",
  },
  robots: { index: true, follow: true },
};

// ── Palette ─────────────────────────────────────────────────────────────
// Warm-dark neutral, single violet accent. No rainbow. Inspired by Linear.
const GLOBAL_CSS = `
  .agdam-root {
    --bg: #0B0B0E;
    --bg-2: #101014;
    --surface: rgba(255,255,255,0.018);
    --surface-2: rgba(255,255,255,0.034);
    --border: rgba(255,255,255,0.07);
    --border-2: rgba(255,255,255,0.12);
    --fg: #F7F7F8;
    --fg-2: #C4C4C9;
    --fg-3: #8B8B93;
    --fg-4: #5B5B63;
    --fg-5: #3B3B42;
    --accent: #8B7CFF;
    --accent-tint: rgba(139,124,255,0.14);
    --accent-ring: rgba(139,124,255,0.32);

    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
    font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    letter-spacing: -0.011em;
  }
  .agdam-root *, .agdam-root *::before, .agdam-root *::after { box-sizing: border-box; }

  /* Hero background — one static soft radial wash, no animation, no orbs */
  .agdam-hero-bg {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background:
      radial-gradient(ellipse 800px 500px at 50% -80px, rgba(139,124,255,0.18) 0%, rgba(139,124,255,0.05) 40%, transparent 70%),
      radial-gradient(ellipse 600px 400px at 80% 20%, rgba(236,72,153,0.04) 0%, transparent 50%);
  }

  /* Fine grid behind hero — subtle, hairline, very low opacity */
  .agdam-hero-grid {
    position: absolute; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%);
    -webkit-mask-image: radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, transparent 70%);
  }

  /* Nav */
  .agdam-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(11,11,14,0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }

  /* Pills */
  .agdam-pill { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; font-weight: 500; letter-spacing: 0.02em; padding: 5px 11px 5px 9px; border-radius: 9999px; background: var(--surface); border: 1px solid var(--border); color: var(--fg-2); }
  .agdam-pill-dot { width: 5px; height: 5px; border-radius: 9999px; background: var(--accent); box-shadow: 0 0 0 3px var(--accent-tint); }

  /* Buttons */
  .agdam-btn { display: inline-flex; align-items: center; gap: 8px; font-weight: 500; font-size: 14px; padding: 9px 18px; border-radius: 8px; transition: all 0.16s cubic-bezier(0.2,0.8,0.2,1); text-decoration: none; cursor: pointer; border: none; font-family: inherit; line-height: 1; letter-spacing: -0.005em; }
  .agdam-btn-primary { background: var(--fg); color: var(--bg); }
  .agdam-btn-primary:hover { background: white; transform: translateY(-0.5px); }
  .agdam-btn-secondary { background: var(--surface); color: var(--fg); border: 1px solid var(--border); }
  .agdam-btn-secondary:hover { background: var(--surface-2); border-color: var(--border-2); }
  .agdam-btn-ghost { background: transparent; color: var(--fg-2); padding: 7px 11px; font-size: 13px; font-weight: 500; }
  .agdam-btn-ghost:hover { color: var(--fg); }

  /* Accent link */
  .agdam-accent { color: var(--accent); }

  /* Card — solid surface, no glass, subtle border */
  .agdam-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    transition: border-color 0.18s, background 0.18s;
  }
  .agdam-card:hover { border-color: var(--border-2); background: var(--surface-2); }

  /* Number prefix on cards — large monospace with accent underline */
  .agdam-num {
    font-family: var(--font-mono); font-size: 12px; font-weight: 500; letter-spacing: 0.02em;
    color: var(--fg-4); display: inline-flex; align-items: center; gap: 8px;
  }
  .agdam-num::after { content: ""; width: 24px; height: 1px; background: var(--border-2); }

  /* Reveal — only if browser supports animation-timeline */
  @supports (animation-timeline: view()) {
    .agdam-reveal {
      animation: agdam-fade-up linear forwards;
      animation-timeline: view();
      animation-range: entry 0% cover 18%;
    }
    @keyframes agdam-fade-up {
      from { opacity: 0; transform: translateY(18px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }

  /* Responsive */
  @media (max-width: 820px) {
    .agdam-hero-h1 { font-size: 44px !important; line-height: 1.05 !important; }
    .agdam-nav-links { display: none !important; }
    .agdam-hide-mobile { display: none !important; }
    .agdam-grid-3 { grid-template-columns: 1fr !important; }
    .agdam-grid-2 { grid-template-columns: 1fr !important; }
    .agdam-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

// ── Style objects ──────────────────────────────────────────────────────
const CONTAINER: React.CSSProperties = { maxWidth: 1080, margin: "0 auto", padding: "0 32px" };
const SECTION_PAD: React.CSSProperties = { padding: "128px 0" };

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: "var(--fg-4)", textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: 20 }}>
      {children}
    </div>
  );
}

function H2({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <h2
      style={{
        fontSize: "clamp(32px, 3.8vw, 44px)",
        fontWeight: 600,
        lineHeight: 1.1,
        letterSpacing: "-0.025em",
        margin: 0,
        color: "var(--fg)",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--fg-2)", margin: "18px 0 0 0", maxWidth: 620, fontWeight: 400 }}>
      {children}
    </p>
  );
}

// ── Content ────────────────────────────────────────────────────────────

const WHATS_SHIPPED = [
  {
    n: "01",
    kicker: "Stats",
    title: "Bayesian + Frequentist",
    body: "Beta-Binomial and Normal-Normal posteriors with HDI intervals. Z-test, Welch's t, Bonferroni / Holm / BH corrections. One payload returns both.",
    ref: "Gelman et al., BDA3 · Kruschke, DBDA2",
  },
  {
    n: "02",
    kicker: "Stats",
    title: "Sequential testing",
    body: "O'Brien-Fleming, Pocock, and Lan-DeMets alpha spending. Peek at interim looks without inflating overall Type I error.",
    ref: "Johari et al., 2017 · parity with gsDesign (R)",
  },
  {
    n: "03",
    kicker: "Stats",
    title: "CUPED variance reduction",
    body: "Pre-experiment covariate adjustment. Shortens experiment runtime when a stable pre-period signal exists for the user.",
    ref: "Deng, Xu, Kohavi, Walker — WSDM 2013",
  },
  {
    n: "04",
    kicker: "Health",
    title: "SRM detection",
    body: "Chi-squared test against expected variant ratios. Catches traffic-split bugs before they quietly bias your results.",
    ref: "Fabijan et al. — KDD 2019",
  },
  {
    n: "05",
    kicker: "Allocation",
    title: "Bandits (contextual)",
    body: "Thompson sampling, UCB1, ε-greedy, and LinUCB for contextual allocation. Library-only today; REST endpoints are pending.",
    ref: "Li, Chu, Langford, Schapire — WWW 2010",
  },
  {
    n: "06",
    kicker: "Assignment",
    title: "Deterministic hashing",
    body: "MurmurHash3(experiment_key + user_id) returns the same 32-bit integer on the server and in every SDK. No drift, ever.",
    ref: "Austin Appleby reference implementation",
  },
];

const KNOWN_LIMITS = [
  {
    title: "v0.1.0, pre-1.0",
    body: "Semver minor bumps can include breaking changes until 1.0. Pin an exact version if that matters for your stack.",
  },
  {
    title: "CUPED + bandits are library-only",
    body: "The TypeScript functions exist and are Monte Carlo-validated. REST endpoints exposing them via the dashboard aren't written yet.",
  },
  {
    title: "SDKs install from GitHub",
    body: "The publish workflow is wired but hasn't been run. Until v0.2.0, you install via GitHub URL or unpkg, not the npm registry.",
  },
  {
    title: "No hosted signup flow",
    body: "Self-host to get an API key — the migration prints one on first run. A managed multi-tenant cloud isn't on the near-term roadmap.",
  },
  {
    title: "Dashboard search is stubbed",
    body: "The sidebar search bar is disabled with a TODO. The /api/experiments?q= endpoint isn't written yet.",
  },
  {
    title: "Mobile dashboard is rough",
    body: "Landing + docs are mobile-responsive; the authenticated dashboard currently assumes a laptop viewport.",
  },
];

const TRUST_LINKS = [
  { title: "SECURITY.md", body: "Disclosure policy, CVSS SLAs, scope, safe harbor.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SECURITY.md" },
  { title: "BENCHMARKS.md", body: "Validation methodology and the latest Monte Carlo results.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" },
  { title: "ARCHITECTURE.md", body: "Data flow, schema, and explicit trust boundaries.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/ARCHITECTURE.md" },
  { title: "FEATURES.md", body: "What's shipping, what's planned — with honest gap notes.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/FEATURES.md" },
  { title: "docs/troubleshooting.md", body: "Every error code → plain-English fix.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/docs/troubleshooting.md" },
  { title: ".github/workflows/ci.yml", body: "Tests, typecheck, semgrep, gitleaks, Monte Carlo.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/.github/workflows/ci.yml" },
];

// ── Page ────────────────────────────────────────────────────────────────

export default function AgdamBagdamLanding() {
  return (
    <main className={`agdam-root ${inter.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── Nav ────────────────────────────────────────────────── */}
      <nav className="agdam-nav">
        <div style={{ ...CONTAINER, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 32px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "var(--fg)" }}>
            <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--accent)", boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 6px 14px -4px rgba(139,124,255,0.4)" }} />
            <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em" }}>Agdam Bagdam</span>
          </Link>
          <div className="agdam-nav-links" style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <a href="#shipped" className="agdam-btn agdam-btn-ghost">What ships</a>
            <a href="#validation" className="agdam-btn agdam-btn-ghost">Validation</a>
            <a href="#limits" className="agdam-btn agdam-btn-ghost">Known limits</a>
            <Link href="/agdambagdam/docs" className="agdam-btn agdam-btn-ghost">Docs</Link>
            <a href="https://github.com/balabommablock-cpu/agdambagdam" target="_blank" rel="noopener" className="agdam-btn agdam-btn-ghost">GitHub</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/agdambagdam/app" className="agdam-btn agdam-btn-secondary agdam-hide-mobile">Dashboard</Link>
            <a href="#quickstart" className="agdam-btn agdam-btn-primary">Quickstart</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 0 96px" }}>
        <div className="agdam-hero-bg" />
        <div className="agdam-hero-grid" />
        <div style={{ ...CONTAINER, position: "relative", zIndex: 2 }}>
          <div style={{ maxWidth: 780 }}>
            <div className="agdam-pill" style={{ marginBottom: 28 }}>
              <span className="agdam-pill-dot" />
              <span>Open source · MIT · v0.1.0</span>
            </div>
            <h1
              className="agdam-hero-h1"
              style={{
                fontSize: "clamp(44px, 6vw, 72px)",
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: "-0.035em",
                margin: 0,
                color: "var(--fg)",
              }}
            >
              A/B testing with a statistics
              <br />
              engine you can <em style={{ fontStyle: "italic", fontWeight: 500, color: "var(--accent)" }}>actually read</em>.
            </h1>
            <p style={{ fontSize: 19, lineHeight: 1.55, color: "var(--fg-2)", marginTop: 28, maxWidth: 640, fontWeight: 400 }}>
              Bayesian and Frequentist analysis, sequential testing, SRM detection, CUPED, and
              bandits — in about 3,000 lines of zero-dependency TypeScript. Self-hostable under MIT.
              Early, honest, and yours to audit.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 36 }}>
              <a href="#quickstart" className="agdam-btn agdam-btn-primary" style={{ padding: "11px 20px", fontSize: 14 }}>
                Read the quickstart
                <span style={{ opacity: 0.5 }}>→</span>
              </a>
              <a
                href="https://github.com/balabommablock-cpu/agdambagdam"
                target="_blank"
                rel="noopener"
                className="agdam-btn agdam-btn-secondary"
                style={{ padding: "11px 20px", fontSize: 14 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.58v-2.05c-3.34.73-4.04-1.6-4.04-1.6-.54-1.4-1.33-1.77-1.33-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.87.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.6-2.8 5.63-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3" /></svg>
                Read the source
              </a>
            </div>

            {/* Metric strip — quiet, dividers, no boast */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0,
                marginTop: 56,
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--fg-3)",
                borderTop: "1px solid var(--border)",
                paddingTop: 24,
              }}
            >
              {[
                ["14.7 KB", "SDK gzipped"],
                ["0", "runtime deps in stats"],
                ["57 / 57", "tests passing"],
                ["10,000", "Monte Carlo trials per PR"],
              ].map(([n, label], i) => (
                <div
                  key={label}
                  style={{
                    flex: "1 1 180px",
                    paddingRight: 24,
                    borderRight: i < 3 ? "1px solid var(--border)" : "none",
                    paddingLeft: i > 0 ? 24 : 0,
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 500, color: "var(--fg)", letterSpacing: "-0.02em", fontFamily: "var(--font-sans)", lineHeight: 1 }}>
                    {n}
                  </div>
                  <div style={{ marginTop: 6, fontSize: 11, letterSpacing: "0.04em", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What ships ─────────────────────────────────────────── */}
      <section id="shipped" style={SECTION_PAD}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 620, marginBottom: 56 }}>
            <Eyebrow>What ships today</Eyebrow>
            <H2>The stack most teams need, written in the open.</H2>
            <Lead>
              Every method below lives in{" "}
              <code style={{ fontFamily: "var(--font-mono)", fontSize: 15, color: "var(--fg)", background: "var(--surface)", padding: "2px 7px", borderRadius: 4, border: "1px solid var(--border)" }}>
                packages/stats/
              </code>
              , cites its paper inline, and is exercised by the Monte Carlo harness. If something here
              is wrong, that's a P0.
            </Lead>
          </div>
          <div
            className="agdam-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}
          >
            {WHATS_SHIPPED.map((f) => (
              <div
                key={f.n}
                style={{
                  background: "var(--bg)",
                  padding: 32,
                  transition: "background 0.2s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <span className="agdam-num">{f.n}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--fg-4)", letterSpacing: "0.12em", textTransform: "uppercase" }}>{f.kicker}</span>
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: "var(--fg)", letterSpacing: "-0.015em" }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--fg-2)", margin: "10px 0 0 0" }}>{f.body}</p>
                <div style={{ marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--fg-4)" }}>
                  {f.ref}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quickstart ─────────────────────────────────────────── */}
      <section id="quickstart" style={{ ...SECTION_PAD, borderTop: "1px solid var(--border)" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            <div style={{ maxWidth: 620 }}>
              <Eyebrow>Quickstart</Eyebrow>
              <H2>A script tag, a hook, or a Server Component.</H2>
              <Lead>
                No framework adapter. The browser SDK is a single UMD bundle, about 15 KB gzipped.
                If the API is unreachable,{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg)", background: "var(--surface)", padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border)" }}>
                  getVariant
                </code>{" "}
                resolves to{" "}
                <code style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--fg)", background: "var(--surface)", padding: "1px 6px", borderRadius: 4, border: "1px solid var(--border)" }}>
                  'control'
                </code>{" "}
                — your UI never breaks.
              </Lead>
            </div>
            <FrameworkTabs />
          </div>
        </div>
      </section>

      {/* ── Validation ─────────────────────────────────────────── */}
      <section id="validation" style={{ ...SECTION_PAD, borderTop: "1px solid var(--border)" }}>
        <div style={CONTAINER}>
          <div
            className="agdam-grid-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}
          >
            <div>
              <Eyebrow>Validation</Eyebrow>
              <H2>Monte Carlo runs on every pull request.</H2>
              <Lead>
                Ten thousand simulated trials per suite; CI fails if any operational guarantee
                drifts — Type I error, SRM false-positive rate, CUPED variance reduction. Reference
                values are cross-checked against SciPy / statsmodels and R's gsDesign.
              </Lead>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 28 }}>
                <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary" style={{ fontSize: 13, padding: "9px 14px" }}>
                  BENCHMARKS.md
                </a>
                <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/scipy_reference.py" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary" style={{ fontSize: 13, padding: "9px 14px" }}>
                  SciPy reference
                </a>
                <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/r_reference.R" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary" style={{ fontSize: 13, padding: "9px 14px" }}>
                  gsDesign (R)
                </a>
              </div>
            </div>
            <div
              style={{
                background: "#08080B",
                border: "1px solid var(--border)",
                borderRadius: 10,
                overflow: "hidden",
                boxShadow: "0 1px 0 rgba(255,255,255,0.03) inset",
              }}
            >
              <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-4)", display: "flex", alignItems: "center", gap: 12, letterSpacing: "0.04em" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 9, height: 9, borderRadius: 9999, background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ width: 9, height: 9, borderRadius: 9999, background: "rgba(255,255,255,0.08)" }} />
                  <div style={{ width: 9, height: 9, borderRadius: 9999, background: "rgba(255,255,255,0.08)" }} />
                </div>
                <span>monte-carlo.ts</span>
              </div>
              <pre style={{ margin: 0, padding: "20px 22px", fontSize: 12.5, lineHeight: 1.75, fontFamily: "var(--font-mono)", color: "var(--fg-2)", overflowX: "auto" }}>
                <code>
                  <span style={{ color: "var(--fg-4)" }}>{"$"}</span> npx tsx monte-carlo.ts --seed <span style={{ color: "#B4A1FF" }}>42</span>{"\n\n"}
                  <span style={{ color: "var(--fg-4)" }}>{"# seed=42 · 10,000 trials/suite"}</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  Frequentist z-test — parity         <span style={{ color: "var(--fg-4)" }}>0.1529</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  Frequentist Type I error            <span style={{ color: "var(--fg-4)" }}>0.0484</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  Sequential O'Brien-Fleming × 4      <span style={{ color: "var(--fg-4)" }}>0.0377</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  Sequential Pocock × 4               <span style={{ color: "var(--fg-4)" }}>0.0347</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  SRM detector under 50/50            <span style={{ color: "var(--fg-4)" }}>0.0116</span>{"\n"}
                  <span style={{ color: "#7FD1A8" }}>{"✓"}</span>  CUPED empirical VR (ρ=0.7)          <span style={{ color: "var(--fg-4)" }}>0.4863</span>{"\n\n"}
                  <span style={{ color: "var(--fg-2)" }}>All 6 suites passed</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Self-host ──────────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid var(--border)" }}>
        <div style={CONTAINER}>
          <div
            className="agdam-grid-2"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}
          >
            <div>
              <Eyebrow>Self-host</Eyebrow>
              <H2>Your data, on your boxes.</H2>
              <Lead>
                The reference deployment is a Docker Compose stack — Postgres, API server, dashboard.
                One command. No telemetry back to us, ever. Under MIT, you can fork, embed, or relicense
                a derivative. A mention is appreciated; not required.
              </Lead>
            </div>
            <div
              style={{
                background: "#08080B",
                border: "1px solid var(--border)",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "11px 16px", borderBottom: "1px solid var(--border)", fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--fg-4)", letterSpacing: "0.04em" }}>
                docker-compose.yml
              </div>
              <pre style={{ margin: 0, padding: "20px 22px", fontSize: 12.5, lineHeight: 1.75, fontFamily: "var(--font-mono)", color: "var(--fg-2)" }}>
                <code>
                  <span style={{ color: "var(--fg-4)" }}>{"$"}</span> git clone <span style={{ color: "#B4A1FF" }}>github.com/.../agdambagdam</span>{"\n"}
                  <span style={{ color: "var(--fg-4)" }}>{"$"}</span> cd agdambagdam{"\n"}
                  <span style={{ color: "var(--fg-4)" }}>{"$"}</span> docker-compose up -d{"\n\n"}
                  <span style={{ color: "var(--fg-4)" }}>{"# API :3456 · Dashboard :3457"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Known limits ───────────────────────────────────────── */}
      <section id="limits" style={{ ...SECTION_PAD, borderTop: "1px solid var(--border)" }}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 620, marginBottom: 48 }}>
            <Eyebrow>Known limits</Eyebrow>
            <H2>What we haven't done yet.</H2>
            <Lead>
              A comparison page where a vendor ticks every box is a marketing artifact. The opposite
              is easier to verify. Pulled straight from the repo's{" "}
              <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/SHIP_CHECKLIST.md" target="_blank" rel="noopener" style={{ color: "var(--fg)", textDecoration: "underline", textDecorationColor: "var(--border-2)", textUnderlineOffset: 3 }}>
                SHIP_CHECKLIST.md
              </a>{" "}
              and code comments.
            </Lead>
          </div>
          <div
            className="agdam-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {KNOWN_LIMITS.map((l, i) => (
              <div
                key={l.title}
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 24,
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span className="agdam-num" style={{ color: "var(--fg-3)" }}>{String(i + 1).padStart(2, "0")}</span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#F59E0B", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 500 }}>
                    Not yet
                  </span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", marginBottom: 8, letterSpacing: "-0.01em" }}>{l.title}</div>
                <div style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--fg-2)" }}>{l.body}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: 32, fontSize: 13, color: "var(--fg-3)", maxWidth: 620 }}>
            PRs that move any of these from "not yet" to "shipped" are especially welcome.
          </p>
        </div>
      </section>

      {/* ── Trust grid ─────────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid var(--border)" }}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 620, marginBottom: 44 }}>
            <Eyebrow>If you want to audit</Eyebrow>
            <H2>The repo is the product.</H2>
            <Lead>
              Six files worth reading before running anything in production.
            </Lead>
          </div>
          <div
            className="agdam-grid-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {TRUST_LINKS.map((x) => (
              <a
                key={x.title}
                href={x.href}
                target="_blank"
                rel="noopener"
                className="agdam-card"
                style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", gap: 10, minHeight: 140 }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--fg)", fontWeight: 500, letterSpacing: "-0.005em" }}>
                  {x.title}
                </div>
                <div style={{ fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6, flex: 1 }}>{x.body}</div>
                <div style={{ fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: 4 }}>
                  view on github <span>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing ────────────────────────────────────────────── */}
      <section style={{ padding: "128px 0 128px", borderTop: "1px solid var(--border)" }}>
        <div style={{ ...CONTAINER, maxWidth: 680 }}>
          <H2>It's early, it's open, it's yours to break.</H2>
          <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--fg-2)", marginTop: 20 }}>
            Clone the repo. Read the stats code. Run the Monte Carlo harness. If the math is wrong,
            open an issue with a reference value and we'll treat it as a P0. If something's stubbed,
            it's probably on the ship checklist already.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: 32, flexWrap: "wrap" }}>
            <Link href="/agdambagdam/app" className="agdam-btn agdam-btn-primary" style={{ padding: "11px 20px", fontSize: 14 }}>
              Open the dashboard
            </Link>
            <a href="https://github.com/balabommablock-cpu/agdambagdam" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary" style={{ padding: "11px 20px", fontSize: 14 }}>
              Read the source
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid var(--border)", padding: "56px 0 40px" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }} className="agdam-grid-4">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, background: "var(--accent)" }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>Agdam Bagdam</span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.65, color: "var(--fg-3)", margin: 0, maxWidth: 280 }}>
                Open-source A/B testing. Bayesian + Frequentist. MIT. Self-hostable. v0.1.0.
              </p>
            </div>
            <FooterCol
              title="Product"
              links={[
                { label: "Dashboard", href: "/agdambagdam/app" },
                { label: "Docs", href: "/agdambagdam/docs" },
                { label: "Changelog", href: "https://github.com/balabommablock-cpu/agdambagdam/releases" },
              ]}
            />
            <FooterCol
              title="Code"
              links={[
                { label: "Quickstart", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/QUICKSTART.md" },
                { label: "Examples", href: "https://github.com/balabommablock-cpu/agdambagdam/tree/main/examples" },
                { label: "Architecture", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/ARCHITECTURE.md" },
              ]}
            />
            <FooterCol
              title="Trust"
              links={[
                { label: "Security", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SECURITY.md" },
                { label: "Benchmarks", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" },
                { label: "Ship checklist", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SHIP_CHECKLIST.md" },
              ]}
            />
          </div>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14, fontSize: 11, color: "var(--fg-4)", fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            <span>© 2026 · MIT</span>
            <span>
              A product of{" "}
              <Link href="/" style={{ color: "var(--fg-2)", textDecoration: "none" }}>
                boredfolio.
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: 14 }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 9 }}>
        {links.map((l) => {
          const isExt = l.href.startsWith("http");
          const LinkTag: any = isExt ? "a" : Link;
          const extra = isExt ? { target: "_blank", rel: "noopener" } : {};
          return (
            <li key={l.label}>
              <LinkTag
                href={l.href}
                {...extra}
                style={{ fontSize: 13, color: "var(--fg-2)", textDecoration: "none", letterSpacing: "-0.005em" }}
              >
                {l.label}
              </LinkTag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
