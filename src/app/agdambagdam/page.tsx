import type { Metadata } from "next";
import Link from "next/link";
import { Inter, JetBrains_Mono } from "next/font/google";
import { FrameworkTabs } from "./framework-tabs";

/**
 * boredfolio.com/agdambagdam — premium enterprise SaaS marketing landing.
 *
 * Dark-mode first. Sharp sans-serif (Inter). Monospace accents (JetBrains Mono).
 * Indigo → violet → pink gradient brand language. Mesh-gradient hero. Glass
 * cards with subtle hover lift. Server-rendered; only the framework-tabs
 * block is a client island.
 *
 * Keep color values as CSS variables defined on a wrapper div — it lets the
 * client tabs component reuse them via var() without prop drilling.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title:
    "Agdam Bagdam — Open-source A/B testing with better statistics than $500K tools",
  description:
    "Self-hostable A/B testing and feature flags with Bayesian + Frequentist stats, CUPED, sequential testing, SRM, and multi-armed bandits. MIT licensed. Zero egress.",
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
    "Optimizely alternative",
    "LaunchDarkly alternative",
    "VWO alternative",
    "Statsig alternative",
    "GrowthBook alternative",
    "Eppo alternative",
  ],
  alternates: { canonical: "https://boredfolio.com/agdambagdam" },
  openGraph: {
    title: "Agdam Bagdam — Test everything. Pay nothing.",
    description:
      "Free, open-source A/B testing with better statistics than Optimizely, VWO, and LaunchDarkly. Self-host it. Own your data. Forever.",
    siteName: "Agdam Bagdam",
    type: "website",
    url: "https://boredfolio.com/agdambagdam",
  },
  twitter: {
    card: "summary_large_image",
    title: "Agdam Bagdam — Test everything. Pay nothing.",
    description:
      "Open-source A/B testing that makes $500K/year tools obsolete. Bayesian + Frequentist stats, sequential testing, CUPED, contextual bandits.",
  },
  robots: { index: true, follow: true },
};

// ── Scoped CSS: keyframes, hover states, gradients ─────────────────────────
const GLOBAL_CSS = `
  .agdam-root {
    --bg: #0A0A0F;
    --bg-elev: rgba(255,255,255,0.025);
    --bg-elev-2: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.14);
    --fg: #FAFAFA;
    --fg-2: #A1A1AA;
    --fg-3: #71717A;
    --fg-4: #52525B;
    --accent-1: #6366F1;
    --accent-2: #8B5CF6;
    --accent-3: #EC4899;
    --success: #10B981;
    --warning: #F59E0B;
    background: var(--bg);
    color: var(--fg);
    font-family: var(--font-sans), -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    letter-spacing: -0.011em;
  }
  .agdam-root *, .agdam-root *::before, .agdam-root *::after {
    box-sizing: border-box;
  }

  /* Hero mesh background */
  @keyframes agdam-drift-1 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(40px, -30px) scale(1.1); }
  }
  @keyframes agdam-drift-2 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(-50px, 20px) scale(1.05); }
  }
  @keyframes agdam-drift-3 {
    0%, 100% { transform: translate(0, 0) scale(1); }
    50% { transform: translate(20px, 40px) scale(1.08); }
  }
  .agdam-orb { position: absolute; border-radius: 9999px; filter: blur(70px); opacity: 0.55; pointer-events: none; will-change: transform; }
  .agdam-orb-1 { background: #6366F1; width: 420px; height: 420px; top: -120px; left: 10%; animation: agdam-drift-1 14s ease-in-out infinite; }
  .agdam-orb-2 { background: #8B5CF6; width: 360px; height: 360px; top: 60px; right: 10%; animation: agdam-drift-2 18s ease-in-out infinite; }
  .agdam-orb-3 { background: #EC4899; width: 300px; height: 300px; top: 200px; left: 40%; animation: agdam-drift-3 16s ease-in-out infinite; opacity: 0.38; }

  /* Noise overlay — very subtle film grain */
  .agdam-noise {
    position: absolute; inset: 0; pointer-events: none; opacity: 0.04; z-index: 1; mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  }

  /* Sticky nav */
  .agdam-nav {
    position: sticky; top: 0; z-index: 50;
    background: rgba(10,10,15,0.6); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  /* Buttons */
  .agdam-btn { display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px; padding: 11px 20px; border-radius: 10px; transition: all 0.18s cubic-bezier(0.2,0.8,0.2,1); text-decoration: none; cursor: pointer; border: none; font-family: inherit; line-height: 1; }
  .agdam-btn-primary { background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%); color: white; box-shadow: 0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.06) inset, 0 4px 14px rgba(99,102,241,0.25); }
  .agdam-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 1px 2px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.08) inset, 0 6px 20px rgba(139,92,246,0.35); }
  .agdam-btn-secondary { background: rgba(255,255,255,0.04); color: #FAFAFA; border: 1px solid rgba(255,255,255,0.1); }
  .agdam-btn-secondary:hover { background: rgba(255,255,255,0.07); border-color: rgba(255,255,255,0.18); }
  .agdam-btn-ghost { background: transparent; color: #A1A1AA; padding: 8px 12px; font-size: 14px; font-weight: 500; }
  .agdam-btn-ghost:hover { color: #FAFAFA; }

  /* Gradient text */
  .agdam-gradient-text { background: linear-gradient(135deg, #A78BFA 0%, #F472B6 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent; }

  /* Feature card */
  .agdam-card {
    position: relative;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    transition: all 0.25s cubic-bezier(0.2,0.8,0.2,1);
    overflow: hidden;
  }
  .agdam-card::before {
    content: "";
    position: absolute; inset: 0;
    border-radius: inherit;
    padding: 1px;
    background: linear-gradient(135deg, rgba(99,102,241,0) 0%, rgba(236,72,153,0) 100%);
    -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    -webkit-mask-composite: xor; mask-composite: exclude;
    pointer-events: none;
    transition: background 0.3s;
  }
  .agdam-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.14); background: var(--bg-elev-2); }
  .agdam-card:hover::before { background: linear-gradient(135deg, rgba(99,102,241,0.5) 0%, rgba(236,72,153,0.5) 100%); }

  /* Pill / badge */
  .agdam-pill { display: inline-flex; align-items: center; gap: 6px; font-family: var(--font-mono); font-size: 11px; font-weight: 600; letter-spacing: 0.04em; padding: 5px 10px; border-radius: 9999px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #A1A1AA; text-transform: uppercase; }
  .agdam-pill-dot { width: 6px; height: 6px; border-radius: 9999px; background: #10B981; box-shadow: 0 0 8px #10B981; }

  /* Comparison table */
  .agdam-table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; }
  .agdam-table th, .agdam-table td { padding: 14px 16px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .agdam-table th:first-child, .agdam-table td:first-child { text-align: left; }
  .agdam-table th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: #A1A1AA; font-weight: 600; padding-top: 18px; padding-bottom: 18px; }
  .agdam-table .agdam-us-col { background: linear-gradient(180deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.04) 100%); border-left: 1px solid rgba(99,102,241,0.25); border-right: 1px solid rgba(99,102,241,0.25); }
  .agdam-table thead .agdam-us-col { border-top: 1px solid rgba(99,102,241,0.25); border-top-left-radius: 8px; border-top-right-radius: 8px; }
  .agdam-table tbody tr:last-child .agdam-us-col { border-bottom: 1px solid rgba(99,102,241,0.25); border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
  .agdam-table tbody tr:hover td { background: rgba(255,255,255,0.01); }
  .agdam-table tbody tr:hover .agdam-us-col { background: linear-gradient(180deg, rgba(99,102,241,0.12) 0%, rgba(236,72,153,0.06) 100%); }

  /* Reveal-on-scroll — pure CSS, triggers as section enters viewport via animation-timeline */
  @supports (animation-timeline: view()) {
    .agdam-reveal {
      animation: agdam-fade-up linear forwards;
      animation-timeline: view();
      animation-range: entry 0% cover 20%;
    }
    @keyframes agdam-fade-up {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
  }

  /* Responsive */
  @media (max-width: 760px) {
    .agdam-hero-h1 { font-size: 42px !important; line-height: 1.05 !important; }
    .agdam-nav-links { display: none !important; }
    .agdam-hide-mobile { display: none !important; }
    .agdam-grid-cols-3 { grid-template-columns: 1fr !important; }
    .agdam-grid-cols-4 { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

// ── Data ────────────────────────────────────────────────────────────────

type Cell = "yes" | "no" | "paid" | "partial" | "soon";

const COMPARISON: { feature: string; us: Cell; vwo: Cell; optim: Cell; ld: Cell; statsig: Cell; eppo: Cell }[] = [
  { feature: "Bayesian inference",        us: "yes", vwo: "yes",     optim: "no",      ld: "no",      statsig: "yes",  eppo: "no" },
  { feature: "Frequentist tests",         us: "yes", vwo: "yes",     optim: "yes",     ld: "partial", statsig: "yes",  eppo: "yes" },
  { feature: "CUPED variance reduction",  us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "paid", eppo: "paid" },
  { feature: "Sequential testing",        us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "paid", eppo: "paid" },
  { feature: "SRM detection",             us: "yes", vwo: "partial", optim: "partial", ld: "no",      statsig: "yes",  eppo: "yes" },
  { feature: "Multi-armed bandits",       us: "yes", vwo: "paid",    optim: "paid",    ld: "no",      statsig: "yes",  eppo: "no" },
  { feature: "Contextual bandits",        us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "paid", eppo: "no" },
  { feature: "Feature flags",             us: "yes", vwo: "partial", optim: "yes",     ld: "yes",     statsig: "yes",  eppo: "yes" },
  { feature: "Self-hostable",             us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "paid", eppo: "paid" },
  { feature: "MIT open source",           us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "no",   eppo: "no" },
  { feature: "Zero data egress",          us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "no",   eppo: "no" },
  { feature: "Free unlimited MAU",        us: "yes", vwo: "no",      optim: "no",      ld: "no",      statsig: "no",   eppo: "no" },
];

function CellGlyph({ v }: { v: Cell }) {
  if (v === "yes")
    return <span style={{ color: "#10B981", fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 15 }}>✓</span>;
  if (v === "no") return <span style={{ color: "#3F3F46", fontWeight: 700 }}>—</span>;
  if (v === "paid") return <span style={{ fontSize: 11, fontWeight: 600, color: "#F59E0B", fontFamily: "var(--font-mono)" }}>$$$</span>;
  if (v === "partial") return <span style={{ fontSize: 11, fontWeight: 500, color: "#71717A" }}>partial</span>;
  return <span style={{ fontSize: 11, fontWeight: 600, color: "#A78BFA" }}>soon</span>;
}

const FEATURES = [
  {
    title: "Dual statistics",
    desc: "Bayesian + Frequentist analysis on the same result payload. Execs get 'probability it's better', data scientists get p-values.",
    ref: "Only Convert ships both.",
    icon: "🧮",
  },
  {
    title: "Sequential testing + SRM",
    desc: "Peek without inflating Type I error. Detect sample-ratio mismatch before it corrupts decisions.",
    ref: "Statsig paywalls these. We don't.",
    icon: "📉",
  },
  {
    title: "CUPED variance reduction",
    desc: "Cut experiment runtime 20–50% using pre-experiment covariates. The technique Facebook and Microsoft built in-house.",
    ref: "Deng et al. 2013 (WSDM).",
    icon: "⚡",
  },
  {
    title: "Contextual bandits (LinUCB)",
    desc: "Thompson, UCB1, ε-greedy, and LinUCB. Only Statsig has contextual bandits commercially — behind an enterprise contract.",
    ref: "Li et al. 2010 (WWW).",
    icon: "🎰",
  },
  {
    title: "Deterministic assignment",
    desc: "MurmurHash3(experiment + user) returns the same 32-bit int on the server and in every SDK, forever. No drift.",
    ref: "Appleby reference impl.",
    icon: "🔑",
  },
  {
    title: "Privacy-first",
    desc: "No third-party cookies. Respects DNT. Self-host mode has zero data egress — your event stream never leaves your VPC.",
    ref: "GDPR + CCPA by default.",
    icon: "🛡️",
  },
];

const TRUST_LINKS = [
  { title: "SECURITY.md", body: "Coordinated disclosure, CVSS SLAs, safe harbor. Private reporting enabled.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SECURITY.md" },
  { title: "BENCHMARKS.md", body: "10k-trial Monte Carlo. SciPy + R reference parity. Every method cites its paper.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" },
  { title: "ARCHITECTURE.md", body: "Design, flow diagrams, schema, and explicit trust boundaries.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/ARCHITECTURE.md" },
  { title: "FEATURES.md", body: "Honest competitor matrix with a gap column. If it's not done, we say so.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/FEATURES.md" },
  { title: "Troubleshooting", body: "Every error code → plain-English fix → direct link.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/docs/troubleshooting.md" },
  { title: "CI pipeline", body: "Tests on Node 20/22/24, semgrep, gitleaks, bundle-size, Monte Carlo.", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/.github/workflows/ci.yml" },
];

// ── Styles ──────────────────────────────────────────────────────────────

const CONTAINER: React.CSSProperties = { maxWidth: 1180, margin: "0 auto", padding: "0 24px" };
const SECTION_PAD: React.CSSProperties = { padding: "120px 0" };

// ── Components ──────────────────────────────────────────────────────────

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 600, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 16 }}>
      {children}
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.025em", margin: 0, color: "#FAFAFA" }}>
      {children}
    </h2>
  );
}

function Lead({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 18, lineHeight: 1.6, color: "#A1A1AA", margin: "16px 0 0 0", maxWidth: 640 }}>
      {children}
    </p>
  );
}

// ── Page ────────────────────────────────────────────────────────────────

export default function AgdamBagdamLanding() {
  return (
    <main className={`agdam-root ${inter.variable} ${mono.variable}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_CSS }} />

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav className="agdam-nav">
        <div style={{ ...CONTAINER, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "#FAFAFA" }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "linear-gradient(135deg, #6366F1, #EC4899)", boxShadow: "0 0 12px rgba(139,92,246,0.5)" }} />
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Agdam Bagdam</span>
            <span className="agdam-pill" style={{ marginLeft: 4 }}>
              <span className="agdam-pill-dot" />
              v0.1.0
            </span>
          </Link>
          <div className="agdam-nav-links" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <a href="#features" className="agdam-btn agdam-btn-ghost">Features</a>
            <Link href="/agdambagdam/docs" className="agdam-btn agdam-btn-ghost">Docs</Link>
            <a href="https://github.com/balabommablock-cpu/agdambagdam" target="_blank" rel="noopener" className="agdam-btn agdam-btn-ghost">GitHub</a>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Link href="/agdambagdam/app" className="agdam-btn agdam-btn-secondary">Dashboard</Link>
            <a href="#quickstart" className="agdam-btn agdam-btn-primary agdam-hide-mobile">Get started →</a>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "100px 0 120px" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div className="agdam-orb agdam-orb-1" />
          <div className="agdam-orb agdam-orb-2" />
          <div className="agdam-orb agdam-orb-3" />
          <div className="agdam-noise" />
          {/* Radial fade to hide orbs at the edges */}
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center top, transparent 0%, rgba(10,10,15,0.6) 60%, var(--bg) 100%)" }} />
        </div>
        <div style={{ ...CONTAINER, position: "relative", zIndex: 2, textAlign: "center" }}>
          <a
            href="https://github.com/balabommablock-cpu/agdambagdam"
            target="_blank"
            rel="noopener"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 6px 6px 14px",
              borderRadius: 9999,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.03)",
              fontSize: 13,
              color: "#A1A1AA",
              textDecoration: "none",
              marginBottom: 28,
              transition: "all 0.2s",
            }}
          >
            <span style={{ color: "#FAFAFA" }}>New:</span> 10,000-trial Monte Carlo validation shipped
            <span style={{ background: "linear-gradient(135deg, #6366F1, #EC4899)", padding: "3px 8px", borderRadius: 9999, fontSize: 11, fontWeight: 600, color: "white" }}>Read →</span>
          </a>
          <h1
            className="agdam-hero-h1"
            style={{
              fontSize: "clamp(48px, 7.5vw, 96px)",
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              margin: "0 auto",
              maxWidth: 980,
              color: "#FAFAFA",
            }}
          >
            A/B testing that makes{" "}
            <span className="agdam-gradient-text">$500K tools</span>
            <br />
            look like a scam.
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.55, color: "#A1A1AA", marginTop: 28, maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            Bayesian + Frequentist stats. CUPED, sequential testing, SRM detection, contextual bandits.
            Self-hostable. MIT licensed. Zero data egress. The features incumbents charge{" "}
            <span style={{ color: "#FAFAFA", fontWeight: 600 }}>$50,000–$200,000/year</span> for — free, forever.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
            <a href="#quickstart" className="agdam-btn agdam-btn-primary" style={{ padding: "14px 22px", fontSize: 15 }}>
              Ship your first test in 60s →
            </a>
            <a
              href="https://github.com/balabommablock-cpu/agdambagdam"
              target="_blank"
              rel="noopener"
              className="agdam-btn agdam-btn-secondary"
              style={{ padding: "14px 22px", fontSize: 15 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.58v-2.05c-3.34.73-4.04-1.6-4.04-1.6-.54-1.4-1.33-1.77-1.33-1.77-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.66-.3-5.47-1.33-5.47-5.93 0-1.3.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.87.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.6-2.8 5.63-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .3" /></svg>
              Star on GitHub
            </a>
          </div>

          {/* Live metric strip */}
          <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 52, fontFamily: "var(--font-mono)", fontSize: 13, color: "#71717A" }}>
            <div><span style={{ color: "#FAFAFA", fontWeight: 600 }}>14.7 KB</span> SDK gzipped</div>
            <div><span style={{ color: "#FAFAFA", fontWeight: 600 }}>10,000</span> Monte Carlo trials</div>
            <div><span style={{ color: "#FAFAFA", fontWeight: 600 }}>57 / 57</span> tests passing</div>
            <div><span style={{ color: "#FAFAFA", fontWeight: 600 }}>0</span> runtime deps</div>
          </div>
        </div>
      </section>

      {/* ── Price wall of shame ─────────────────────────────────────── */}
      <section style={{ padding: "0 0 80px" }}>
        <div style={CONTAINER}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 1,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {[
              { label: "VWO", price: "$12K–$75K" },
              { label: "Optimizely", price: "$50K–$200K" },
              { label: "LaunchDarkly", price: "$8K–$100K" },
              { label: "Statsig", price: "$20K–$100K" },
              { label: "Eppo", price: "$30K–$150K" },
              { label: "Agdam Bagdam", price: "$0", highlight: true },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  background: p.highlight ? "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(236,72,153,0.08) 100%)" : "rgba(10,10,15,0.98)",
                  padding: "28px 20px",
                  textAlign: "center",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 600,
                    color: p.highlight ? "#A78BFA" : "#71717A",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginBottom: 10,
                  }}
                >
                  {p.label}
                </div>
                <div
                  style={{
                    fontFamily: p.highlight ? "var(--font-sans)" : "var(--font-mono)",
                    fontSize: p.highlight ? 34 : 22,
                    fontWeight: p.highlight ? 800 : 600,
                    color: p.highlight ? "#FAFAFA" : "#52525B",
                    letterSpacing: "-0.02em",
                    textDecoration: p.highlight ? "none" : "line-through",
                  }}
                >
                  {p.price}
                </div>
                <div style={{ fontSize: 11, color: p.highlight ? "#10B981" : "#3F3F46", marginTop: 4, fontWeight: 500 }}>
                  {p.highlight ? "forever" : "per year"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section id="features" style={{ ...SECTION_PAD }}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 720, marginBottom: 56 }}>
            <Eyebrow>What's inside</Eyebrow>
            <H2>
              Six things the incumbents charge
              <br />
              <span className="agdam-gradient-text">enterprise rates</span> for.
            </H2>
            <Lead>
              Every capability below ships in the free tier. Every claim links to a committed artifact —
              paper, test, reference implementation, or Monte Carlo proof.
            </Lead>
          </div>
          <div
            className="agdam-grid-cols-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {FEATURES.map((f) => (
              <div key={f.title} className="agdam-card">
                <div style={{ fontSize: 24, marginBottom: 14, filter: "grayscale(0.2)" }}>{f.icon}</div>
                <h3 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 8px 0", color: "#FAFAFA" }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.55, color: "#A1A1AA", margin: 0 }}>{f.desc}</p>
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.06)", fontFamily: "var(--font-mono)", fontSize: 11, color: "#71717A" }}>
                  {f.ref}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quickstart with framework tabs ──────────────────────────── */}
      <section id="quickstart" style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 48 }}>
            <div style={{ maxWidth: 720 }}>
              <Eyebrow>60-second integration</Eyebrow>
              <H2>Drop it in. It works.</H2>
              <Lead>
                A single script tag is the entire install. No build step. No framework adapter. Works on
                plain HTML, any SPA, any SSR. Pick your stack:
              </Lead>
            </div>
            <FrameworkTabs />
            <div
              className="agdam-grid-cols-3"
              style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
            >
              {[
                { n: "01", title: "Loads in ~15 KB gzipped", body: "Smaller than a logo image. First-party path, no trackers, sails past ad-blockers." },
                { n: "02", title: "Deterministic forever", body: "MurmurHash3 produces the same variant for the same user on every SDK, every time." },
                { n: "03", title: "Fails safe", body: "API unreachable → SDK returns 'control' and logs a kid-friendly error with a docs link." },
              ].map((x) => (
                <div key={x.n} style={{ padding: "4px 0" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 700, color: "#A78BFA", letterSpacing: "0.1em", marginBottom: 10 }}>
                    STEP {x.n}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: "#FAFAFA", marginBottom: 6 }}>{x.title}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55, color: "#A1A1AA" }}>{x.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats / metrics ─────────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div
            className="agdam-grid-cols-4"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24 }}
          >
            {[
              { n: "0", unit: "runtime deps", body: "The stats engine is 2,947 lines of pure TypeScript. No supply-chain risk." },
              { n: "10K", unit: "MC trials per PR", body: "Every change runs through a Monte Carlo validation harness in CI. Type I error must stay ≤ α." },
              { n: "6/6", unit: "suites passing", body: "Z-test, sequential (OBF + Pocock), SRM, CUPED, reference parity. Receipts in the repo." },
              { n: "MIT", unit: "license", body: "Fork it, embed it, sell it. No vendor contract. No rug pull." },
            ].map((s) => (
              <div key={s.n} style={{ padding: 24, background: "var(--bg-elev)", border: "1px solid var(--border)", borderRadius: 14 }}>
                <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, color: "#FAFAFA" }}>{s.n}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6, marginBottom: 12 }}>{s.unit}</div>
                <div style={{ fontSize: 14, lineHeight: 1.55, color: "#A1A1AA" }}>{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparison matrix ───────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 720, marginBottom: 40 }}>
            <Eyebrow>The honest comparison</Eyebrow>
            <H2>Receipts, not marketing.</H2>
            <Lead>
              If a cell is wrong, file an issue with a citation. We keep this matrix honest because the
              alternative is embarrassing. Last verified April 2026.
            </Lead>
          </div>
          <div
            style={{
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              overflow: "auto",
              background: "rgba(10,10,15,0.4)",
            }}
          >
            <table className="agdam-table">
              <thead>
                <tr>
                  <th style={{ minWidth: 240 }}>Capability</th>
                  <th className="agdam-us-col" style={{ color: "#FAFAFA" }}>Agdam Bagdam</th>
                  <th>VWO</th>
                  <th>Optimizely</th>
                  <th>LaunchDarkly</th>
                  <th>Statsig</th>
                  <th>Eppo</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((r) => (
                  <tr key={r.feature}>
                    <td style={{ color: "#E5E7EB", fontWeight: 500 }}>{r.feature}</td>
                    <td className="agdam-us-col"><CellGlyph v={r.us} /></td>
                    <td><CellGlyph v={r.vwo} /></td>
                    <td><CellGlyph v={r.optim} /></td>
                    <td><CellGlyph v={r.ld} /></td>
                    <td><CellGlyph v={r.statsig} /></td>
                    <td><CellGlyph v={r.eppo} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 18, fontFamily: "var(--font-mono)", fontSize: 11, color: "#71717A" }}>
            <span><span style={{ color: "#10B981" }}>✓</span> supported</span>
            <span>— not supported</span>
            <span><span style={{ color: "#F59E0B" }}>$$$</span> paid tier only</span>
            <span>partial = workaround required</span>
            <span><span style={{ color: "#A78BFA" }}>soon</span> on roadmap</span>
          </div>
        </div>
      </section>

      {/* ── Statistical rigor ───────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 40 }}>
            <div style={{ maxWidth: 720 }}>
              <Eyebrow>Statistical rigor</Eyebrow>
              <H2>
                The math is public.
                <br />
                <span className="agdam-gradient-text">So is the proof.</span>
              </H2>
              <Lead>
                Most A/B tools hide their assumptions behind NDAs. We ship a 10,000-trial Monte Carlo
                harness that verifies Type I error, SRM false-positive rates, and CUPED variance reduction
                on every pull request. Reproduce it locally:
              </Lead>
            </div>
            <div
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
                maxWidth: 900,
              }}
            >
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontFamily: "var(--font-mono)", color: "#71717A", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <div style={{ width: 11, height: 11, borderRadius: 9999, background: "#EF4444" }} />
                  <div style={{ width: 11, height: 11, borderRadius: 9999, background: "#F59E0B" }} />
                  <div style={{ width: 11, height: 11, borderRadius: 9999, background: "#10B981" }} />
                </div>
                <span style={{ marginLeft: 12 }}>~/agdambagdam$</span>
              </div>
              <pre style={{ margin: 0, padding: 22, fontSize: 13, lineHeight: 1.7, fontFamily: "var(--font-mono)", color: "#E5E7EB", overflowX: "auto" }}>
                <code>
                  <span style={{ color: "#71717A" }}># Clone, install, prove our stats are correct</span>{"\n"}
                  <span style={{ color: "#F472B6" }}>$</span> git clone <span style={{ color: "#A5E3A5" }}>github.com/balabommablock-cpu/agdambagdam</span>{"\n"}
                  <span style={{ color: "#F472B6" }}>$</span> cd agdambagdam && npm install{"\n"}
                  <span style={{ color: "#F472B6" }}>$</span> npx tsx packages/stats/benchmarks/monte-carlo.ts --seed <span style={{ color: "#FBBF77" }}>42</span>{"\n\n"}
                  <span style={{ color: "#71717A" }}># Output (2026-04-16, seed=42, 10,000 trials):</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> Frequentist z-test — reference parity          <span style={{ color: "#71717A" }}>0.1529</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> Frequentist z-test — Type I error under H₀    <span style={{ color: "#71717A" }}>0.0484</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> Sequential (O'Brien-Fleming) — Type I × 4      <span style={{ color: "#71717A" }}>0.0377</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> Sequential (Pocock) — Type I × 4               <span style={{ color: "#71717A" }}>0.0347</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> SRM detector — Type I under 50/50               <span style={{ color: "#71717A" }}>0.0116</span>{"\n"}
                  <span style={{ color: "#10B981" }}>{"  ✓"}</span> CUPED empirical variance reduction (ρ=0.7)      <span style={{ color: "#71717A" }}>0.4863</span>{"\n\n"}
                  <span style={{ color: "#10B981" }}>All 6 suites passed</span>
                </code>
              </pre>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" target="_blank" rel="noopener" className="agdam-btn agdam-btn-primary">
                Read BENCHMARKS.md
              </a>
              <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/scipy_reference.py" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary">
                SciPy parity
              </a>
              <a href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/r_reference.R" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary">
                gsDesign (R) parity
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Self-host ───────────────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }} className="agdam-grid-cols-3">
            <div>
              <Eyebrow>Self-host in 3 minutes</Eyebrow>
              <H2>Your data. Your VPC. Your call.</H2>
              <Lead>
                Enterprises can't have their experimentation stream leaving the network. Good news: the
                entire stack ships as Docker Compose. Postgres, API server, dashboard — one command.
              </Lead>
              <div style={{ marginTop: 28, display: "grid", gap: 12 }}>
                {[
                  "Zero egress — events never leave the box",
                  "Runs anywhere Docker runs: laptop → K8s",
                  "Immutable audit log on every mutation, queryable SQL",
                  "MIT license — fork it, embed it, sell it",
                ].map((line) => (
                  <div key={line} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 14, lineHeight: 1.55, color: "#D4D4D8" }}>
                    <span style={{ color: "#10B981", fontFamily: "var(--font-mono)", fontWeight: 700, paddingTop: 2 }}>✓</span>
                    <span>{line}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "#000",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 14,
                overflow: "hidden",
              }}
            >
              <div style={{ padding: "10px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", fontSize: 12, fontFamily: "var(--font-mono)", color: "#71717A" }}>
                docker-compose.yml
              </div>
              <pre style={{ margin: 0, padding: 22, fontSize: 13, lineHeight: 1.7, fontFamily: "var(--font-mono)", color: "#E5E7EB" }}>
                <code>
                  <span style={{ color: "#F472B6" }}>$</span> git clone <span style={{ color: "#A5E3A5" }}>github.com/.../agdambagdam</span>{"\n"}
                  <span style={{ color: "#F472B6" }}>$</span> cd agdambagdam{"\n"}
                  <span style={{ color: "#F472B6" }}>$</span> docker-compose up -d{"\n\n"}
                  <span style={{ color: "#71717A" }}># Postgres ready</span>{"\n"}
                  <span style={{ color: "#71717A" }}># API       → :3456</span>{"\n"}
                  <span style={{ color: "#71717A" }}># Dashboard → :3457</span>{"\n\n"}
                  <span style={{ color: "#10B981" }}>→ paste the printed key, done.</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust grid ──────────────────────────────────────────────── */}
      <section style={{ ...SECTION_PAD, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={CONTAINER}>
          <div style={{ maxWidth: 720, marginBottom: 40 }}>
            <Eyebrow>Trust, not claims</Eyebrow>
            <H2>
              Every claim is a link to a
              <br />
              <span className="agdam-gradient-text">committed artifact.</span>
            </H2>
          </div>
          <div
            className="agdam-grid-cols-3"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
          >
            {TRUST_LINKS.map((x) => (
              <a
                key={x.title}
                href={x.href}
                target="_blank"
                rel="noopener"
                className="agdam-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#A78BFA", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 10 }}>
                  {x.title}
                </div>
                <div style={{ fontSize: 14, color: "#D4D4D8", lineHeight: 1.55 }}>{x.body}</div>
                <div style={{ marginTop: 14, fontSize: 12, color: "#71717A", display: "flex", alignItems: "center", gap: 6 }}>
                  View on GitHub
                  <span>↗</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section style={{ position: "relative", padding: "120px 0 140px", borderTop: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div className="agdam-orb" style={{ background: "#6366F1", width: 520, height: 520, top: -100, left: "50%", transform: "translateX(-50%)", opacity: 0.4 }} />
          <div className="agdam-noise" />
        </div>
        <div style={{ ...CONTAINER, textAlign: "center", position: "relative", zIndex: 2 }}>
          <Eyebrow>Ship first, license later</Eyebrow>
          <h2 style={{ fontSize: "clamp(40px, 5.5vw, 72px)", fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em", margin: 0, maxWidth: 900, marginLeft: "auto", marginRight: "auto", color: "#FAFAFA" }}>
            Your competitor just paid <span className="agdam-gradient-text">$75K</span>
            <br />
            for what you can use free.
          </h2>
          <p style={{ fontSize: 18, color: "#A1A1AA", marginTop: 24, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Fork the repo, star it, run a test this afternoon. If it doesn't make the paid tools look
            absurd, open an issue and tell us why.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 36 }}>
            <Link href="/agdambagdam/app" className="agdam-btn agdam-btn-primary" style={{ padding: "14px 22px", fontSize: 15 }}>
              Open dashboard →
            </Link>
            <a href="https://github.com/balabommablock-cpu/agdambagdam" target="_blank" rel="noopener" className="agdam-btn agdam-btn-secondary" style={{ padding: "14px 22px", fontSize: 15 }}>
              Star on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "56px 0 40px" }}>
        <div style={CONTAINER}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 32 }} className="agdam-grid-cols-4">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg, #6366F1, #EC4899)" }} />
                <span style={{ fontWeight: 700, fontSize: 15 }}>Agdam Bagdam</span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: "#71717A", margin: 0, maxWidth: 280 }}>
                Open-source A/B testing and feature flags. MIT licensed. Self-hostable. Zero data egress.
              </p>
            </div>
            <FooterCol
              title="Product"
              links={[
                { label: "Dashboard", href: "/agdambagdam/app" },
                { label: "Docs", href: "/agdambagdam/docs" },
                { label: "Changelog", href: "https://github.com/balabommablock-cpu/agdambagdam/releases" },
                { label: "Status", href: "#" },
              ]}
            />
            <FooterCol
              title="Developers"
              links={[
                { label: "Quickstart", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/QUICKSTART.md" },
                { label: "Examples", href: "https://github.com/balabommablock-cpu/agdambagdam/tree/main/examples" },
                { label: "npx scaffolder", href: "https://github.com/balabommablock-cpu/agdambagdam/tree/main/packages/create-agdambagdam" },
                { label: "Architecture", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/ARCHITECTURE.md" },
              ]}
            />
            <FooterCol
              title="Trust"
              links={[
                { label: "Security", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SECURITY.md" },
                { label: "Benchmarks", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md" },
                { label: "Features matrix", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/FEATURES.md" },
                { label: "Troubleshooting", href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/docs/troubleshooting.md" },
              ]}
            />
          </div>
          <div style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, fontSize: 12, color: "#52525B", fontFamily: "var(--font-mono)" }}>
            <span>© 2026 · MIT LICENSED · MADE IN INDIA</span>
            <span>
              A product of{" "}
              <Link href="/" style={{ color: "#A1A1AA", textDecoration: "none" }}>
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
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
        {title}
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
        {links.map((l) => {
          const isExt = l.href.startsWith("http");
          const LinkTag: any = isExt ? "a" : Link;
          const extra = isExt ? { target: "_blank", rel: "noopener" } : {};
          return (
            <li key={l.label}>
              <LinkTag href={l.href} {...extra} style={{ fontSize: 13, color: "#A1A1AA", textDecoration: "none", transition: "color 0.15s" }}>
                {l.label}
              </LinkTag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
