import type { Metadata } from "next";
import Link from "next/link";

/**
 * boredfolio.com/agdambagdam — marketing landing page for the Agdam Bagdam
 * open-source A/B testing platform.
 *
 * Standalone Next.js page (not inside BoredfolioApp SPA), so normal
 * TSX + inline styles — following boredfolio's "inline styles only" aesthetic
 * convention but not its React.createElement / var-only JS convention
 * (those apply inside the BoredfolioApp SPA).
 *
 * The page is pure static render — no client-side state. Any interactivity
 * (copy-to-clipboard, demo A/B widget) is loaded lazily via a client component.
 */

// ── Boredfolio palette (mirrors BoredfolioApp's `C` constant) ───────────
const C = {
  cream: "#F5F0E8",
  sage: "#6B8F71",
  sageDk: "#5A7A5F",
  mustard: "#C9A227",
  char: "#1A1A1A",
  body: "#3D3D3D",
  muted: "#6B6B6B",
  light: "#999",
  white: "#FFFFFF",
  border: "#E5DFD3",
  red: "#C14E4E",
  green: "#4F7B4F",
  ab: "#4F46E5", // indigo — the distinctive Agdam Bagdam accent in the boredfolio nav
};

// Font stacks — match boredfolio's Sf (Playfair) / Bf (DM Sans) / Mf (JetBrains Mono).
const Sf = '"Playfair Display", Georgia, serif';
const Bf = '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const Mf = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

export const metadata: Metadata = {
  title: "Agdam Bagdam — Free, open-source A/B testing. Better stats than $500K tools.",
  description:
    "Self-hostable A/B testing and feature flags with Bayesian + Frequentist stats, CUPED, sequential testing, SRM detection, and multi-armed bandits. MIT licensed. Zero data egress.",
  keywords: [
    "A/B testing",
    "open source A/B testing",
    "feature flags",
    "Bayesian A/B testing",
    "frequentist A/B testing",
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
      "Free, open-source A/B testing that makes $500K/year tools obsolete. Bayesian + Frequentist stats, sequential testing, SRM, CUPED, contextual bandits.",
  },
  robots: { index: true, follow: true },
};

// ── Shared styles ───────────────────────────────────────────────────────

const pageWrapStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: C.cream,
  color: C.char,
  fontFamily: Bf,
  WebkitFontSmoothing: "antialiased",
};

const sectionStyle: React.CSSProperties = {
  maxWidth: 1100,
  margin: "0 auto",
  padding: "0 24px",
};

const h1Style: React.CSSProperties = {
  fontFamily: Sf,
  fontSize: "clamp(44px, 6vw, 76px)",
  lineHeight: 1.05,
  letterSpacing: "-0.02em",
  fontWeight: 900,
  margin: 0,
  color: C.char,
};

const h2Style: React.CSSProperties = {
  fontFamily: Sf,
  fontSize: "clamp(30px, 4vw, 46px)",
  lineHeight: 1.15,
  letterSpacing: "-0.01em",
  fontWeight: 900,
  margin: 0,
  color: C.char,
};

const eyebrowStyle: React.CSSProperties = {
  fontFamily: Mf,
  fontSize: 12,
  fontWeight: 700,
  color: C.sage,
  letterSpacing: 2,
  textTransform: "uppercase",
  marginBottom: 14,
};

const btnPrimaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: Bf,
  fontSize: 14,
  fontWeight: 700,
  color: C.cream,
  background: C.char,
  padding: "14px 24px",
  borderRadius: 8,
  textDecoration: "none",
  transition: "transform 0.15s",
};

const btnSecondaryStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: Bf,
  fontSize: 14,
  fontWeight: 700,
  color: C.char,
  background: "transparent",
  padding: "14px 24px",
  borderRadius: 8,
  border: `2px solid ${C.char}`,
  textDecoration: "none",
};

const codeBlockStyle: React.CSSProperties = {
  fontFamily: Mf,
  fontSize: 13,
  lineHeight: 1.6,
  background: "#0F1116",
  color: "#E6E6E6",
  padding: "22px 24px",
  borderRadius: 12,
  overflow: "auto",
  whiteSpace: "pre",
};

// ── Comparison matrix data ──────────────────────────────────────────────

type Cell = "yes" | "no" | "paid" | "partial" | "coming";

interface Row {
  feature: string;
  ab: Cell;
  vwo: Cell;
  optim: Cell;
  ldkly: Cell;
  statsig: Cell;
  eppo: Cell;
}

const COMPARISON_ROWS: Row[] = [
  { feature: "Bayesian analysis", ab: "yes", vwo: "yes", optim: "no", ldkly: "no", statsig: "yes", eppo: "no" },
  { feature: "Frequentist tests", ab: "yes", vwo: "yes", optim: "yes", ldkly: "partial", statsig: "yes", eppo: "yes" },
  { feature: "CUPED variance reduction", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "paid", eppo: "paid" },
  { feature: "Sequential testing", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "paid", eppo: "paid" },
  { feature: "SRM detection", ab: "yes", vwo: "partial", optim: "partial", ldkly: "no", statsig: "yes", eppo: "yes" },
  { feature: "Multi-armed bandits", ab: "yes", vwo: "paid", optim: "paid", ldkly: "no", statsig: "yes", eppo: "no" },
  { feature: "Contextual bandits (LinUCB)", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "paid", eppo: "no" },
  { feature: "Feature flags", ab: "yes", vwo: "partial", optim: "yes", ldkly: "yes", statsig: "yes", eppo: "yes" },
  { feature: "Self-hostable", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "paid", eppo: "paid" },
  { feature: "MIT open source", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "no", eppo: "no" },
  { feature: "Zero data egress", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "no", eppo: "no" },
  { feature: "Free tier (unlimited MAU)", ab: "yes", vwo: "no", optim: "no", ldkly: "no", statsig: "no", eppo: "no" },
];

function CellGlyph({ v }: { v: Cell }) {
  const commonStyle: React.CSSProperties = {
    fontFamily: Mf,
    fontWeight: 700,
    fontSize: 13,
    display: "inline-block",
    minWidth: 38,
    textAlign: "center",
  };
  if (v === "yes")
    return <span style={{ ...commonStyle, color: C.green }}>✓</span>;
  if (v === "no")
    return <span style={{ ...commonStyle, color: C.light }}>—</span>;
  if (v === "paid")
    return <span style={{ ...commonStyle, color: C.mustard, fontSize: 10 }}>$$$</span>;
  if (v === "partial")
    return <span style={{ ...commonStyle, color: C.muted, fontSize: 10 }}>partial</span>;
  return <span style={{ ...commonStyle, color: C.ab, fontSize: 10 }}>soon</span>;
}

// ── Feature cards data ──────────────────────────────────────────────────

const FEATURE_CARDS = [
  {
    title: "Dual statistics engine",
    body: "Bayesian and Frequentist analysis in the same result payload. PMs get 'probability this is better,' data scientists get p-values. Nobody has to translate.",
    ref: "Only Convert offers both commercially.",
  },
  {
    title: "Sequential testing + SRM",
    body: "Peek at results without inflating Type I error. Spot sample-ratio-mismatch before it corrupts your decisions. Statsig and Eppo charge for these — we don't.",
    ref: "Monte Carlo verified: 10,000 trials, Type I ≤ α.",
  },
  {
    title: "CUPED variance reduction",
    body: "Reduce experiment runtime 20–50% by using pre-experiment covariates. Facebook and Microsoft built this into their platforms. So did we. For free.",
    ref: "Deng et al. 2013, reference-validated.",
  },
  {
    title: "Multi-armed + contextual bandits",
    body: "Thompson sampling, UCB1, Epsilon-greedy, and LinUCB for contextual bandits. Only Statsig has this commercially — and gates it behind an enterprise contract.",
    ref: "LinUCB from Li et al. 2010.",
  },
  {
    title: "Deterministic assignment",
    body: "MurmurHash3(experiment_key + user_id) produces the same 32-bit int on the server and in every SDK, forever. Same input, same variant, no drift.",
    ref: "Canonical Appleby reference impl.",
  },
  {
    title: "Privacy-first by design",
    body: "No third-party cookies. Respects Do Not Track. First-party data only. In self-host mode, no egress — your event stream never leaves your VPC.",
    ref: "GDPR + CCPA compliant by default.",
  },
];

// ── Page ────────────────────────────────────────────────────────────────

export default function AgdamBagdamLandingPage() {
  return (
    <main style={pageWrapStyle}>
      {/* ── Top nav ── */}
      <nav style={{ ...sectionStyle, padding: "22px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ fontFamily: Sf, fontSize: 22, color: C.char, textDecoration: "none" }}>
          <span style={{ fontWeight: 900 }}>bored</span>
          <span style={{ fontWeight: 400 }}>folio</span>
          <span style={{ color: C.sage }}>.</span>
          <span style={{ color: C.muted, fontFamily: Bf, fontSize: 14, fontWeight: 400, marginLeft: 10 }}>/agdambagdam</span>
        </Link>
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link href="/agdambagdam/docs" style={{ fontFamily: Bf, fontSize: 14, color: C.body, textDecoration: "none" }}>
            Docs
          </Link>
          <a
            href="https://github.com/balabommablock-cpu/agdambagdam"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: Bf, fontSize: 14, color: C.body, textDecoration: "none" }}
          >
            GitHub
          </a>
          <Link href="/agdambagdam/app" style={btnPrimaryStyle}>
            Open dashboard →
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ ...sectionStyle, padding: "80px 24px 40px" }}>
        <div style={eyebrowStyle}>AGDAM BAGDAM · OPEN SOURCE · MIT LICENSED</div>
        <h1 style={h1Style}>
          A/B testing that makes{" "}
          <span style={{ color: C.sage, fontStyle: "italic", fontWeight: 400 }}>$500K/year tools</span>
          <br />
          look like a scam.
        </h1>
        <p style={{ fontFamily: Bf, fontSize: 19, lineHeight: 1.55, color: C.body, maxWidth: 700, marginTop: 24 }}>
          VWO bills you $75K. Optimizely starts at $200K. LaunchDarkly adds a zero for "enterprise." They are
          selling marketing copy wrapped around a z-test. We wrote the better math, open-sourced it under MIT,
          and made it free. Forever.
        </p>
        <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link href="#quickstart" style={btnPrimaryStyle}>
            Ship your first test in 60s ↓
          </Link>
          <a
            href="https://github.com/balabommablock-cpu/agdambagdam"
            target="_blank"
            rel="noopener noreferrer"
            style={btnSecondaryStyle}
          >
            Star on GitHub
          </a>
        </div>
        <div style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 26, color: C.muted, fontSize: 13, fontFamily: Mf }}>
          <span>✓ Zero vendor lock-in</span>
          <span>✓ Self-hosted or managed</span>
          <span>✓ Better stats than the incumbents</span>
          <span>✓ Kid-integrable in 60s</span>
        </div>
      </section>

      {/* ── What they charge vs what you pay ── */}
      <section style={{ ...sectionStyle, padding: "40px 24px 40px" }}>
        <div
          style={{
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 16,
            padding: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
          }}
        >
          {[
            { label: "VWO", price: "$12K–$75K/yr" },
            { label: "Optimizely", price: "$50K–$200K/yr" },
            { label: "LaunchDarkly", price: "$8K–$100K/yr" },
            { label: "Statsig", price: "$20K–$100K/yr" },
            { label: "Agdam Bagdam", price: "$0", highlight: true },
          ].map((p) => (
            <div key={p.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: Bf,
                  fontSize: 13,
                  fontWeight: 700,
                  color: p.highlight ? C.sage : C.muted,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                {p.label}
              </div>
              <div
                style={{
                  fontFamily: Sf,
                  fontSize: p.highlight ? 36 : 22,
                  fontWeight: 900,
                  color: p.highlight ? C.sage : C.char,
                  marginTop: 6,
                  textDecoration: p.highlight ? "none" : "line-through",
                  textDecorationColor: C.light,
                }}
              >
                {p.price}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 60-second quickstart ── */}
      <section id="quickstart" style={{ ...sectionStyle, padding: "80px 24px" }}>
        <div style={eyebrowStyle}>SIXTY-SECOND QUICKSTART</div>
        <h2 style={h2Style}>Paste. Save. Ship.</h2>
        <p style={{ fontFamily: Bf, fontSize: 17, color: C.body, marginTop: 14, maxWidth: 700 }}>
          No account for the demo. No build step. No framework required. Drop this before{" "}
          <code style={{ fontFamily: Mf, background: "#F0EBE0", padding: "1px 6px", borderRadius: 4 }}>
            &lt;/body&gt;
          </code>{" "}
          on any HTML page. It works.
        </p>

        <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 20 }}>
          <pre style={codeBlockStyle}>{`<script src="https://unpkg.com/agdambagdam@latest/dist/abacus.js"></script>
<script>
  const ab = new Abacus({
    apiKey:  'demo-public-key',
    baseUrl: 'https://boredfolio.com/agdambagdam/api'
  });

  ab.getVariant('button-color-test').then((variant) => {
    const btn = document.querySelector('#signup');
    if (variant === 'green') btn.style.backgroundColor = 'green';
  });

  document.querySelector('#signup').onclick = () => ab.track('signup-click');
</script>`}</pre>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {[
              {
                step: "01",
                title: "Loads in ~15 KB gz",
                body: "Smaller than a logo image. Uses your first-party path, no third-party cookies, sails past ad-blockers.",
              },
              {
                step: "02",
                title: "Deterministic forever",
                body: "MurmurHash3(experiment + user) → same visitor always sees the same variant. No drift between server and browser.",
              },
              {
                step: "03",
                title: "Fails safe",
                body: "If the API is unreachable, the SDK returns 'control' and logs a kid-friendly console error with a direct fix link.",
              },
            ].map((x) => (
              <div
                key={x.step}
                style={{
                  background: C.white,
                  border: `1px solid ${C.border}`,
                  borderRadius: 12,
                  padding: 20,
                }}
              >
                <div style={{ fontFamily: Mf, fontSize: 11, color: C.sage, fontWeight: 700, letterSpacing: 1 }}>STEP {x.step}</div>
                <div style={{ fontFamily: Sf, fontSize: 18, fontWeight: 900, color: C.char, marginTop: 6 }}>
                  {x.title}
                </div>
                <div style={{ fontFamily: Bf, fontSize: 14, color: C.body, marginTop: 8, lineHeight: 1.55 }}>{x.body}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", flexWrap: "wrap", gap: 14 }}>
          <Link href="/agdambagdam/docs" style={btnSecondaryStyle}>
            Read the full docs
          </Link>
          <a
            href="https://github.com/balabommablock-cpu/agdambagdam/tree/main/examples"
            target="_blank"
            rel="noopener noreferrer"
            style={btnSecondaryStyle}
          >
            Next.js · React · Vue · Shopify · WordPress
          </a>
        </div>
      </section>

      {/* ── Comparison matrix ── */}
      <section style={{ ...sectionStyle, padding: "80px 24px" }}>
        <div style={eyebrowStyle}>THE HONEST COMPARISON</div>
        <h2 style={h2Style}>What you get for $0 vs what they charge for.</h2>
        <p style={{ fontFamily: Bf, fontSize: 17, color: C.body, marginTop: 14, maxWidth: 720 }}>
          If a cell is wrong, open an issue with a citation and we'll fix it. We keep this matrix
          honest because the alternative is embarrassing.
        </p>

        <div
          style={{
            marginTop: 30,
            background: C.white,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            overflow: "auto",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, fontFamily: Bf, minWidth: 720 }}>
            <thead style={{ background: "#FAF6EE" }}>
              <tr>
                <th style={thStyle(true)}>Capability</th>
                <th style={{ ...thStyle(), color: C.ab }}>Agdam Bagdam</th>
                <th style={thStyle()}>VWO</th>
                <th style={thStyle()}>Optimizely</th>
                <th style={thStyle()}>LaunchDarkly</th>
                <th style={thStyle()}>Statsig</th>
                <th style={thStyle()}>Eppo</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((r, i) => (
                <tr key={r.feature} style={{ background: i % 2 === 0 ? C.white : "#FCFAF5" }}>
                  <td style={{ ...tdStyle(true), color: C.char, fontWeight: 600 }}>{r.feature}</td>
                  <td style={{ ...tdStyle(), background: "rgba(79,70,229,0.06)" }}>
                    <CellGlyph v={r.ab} />
                  </td>
                  <td style={tdStyle()}><CellGlyph v={r.vwo} /></td>
                  <td style={tdStyle()}><CellGlyph v={r.optim} /></td>
                  <td style={tdStyle()}><CellGlyph v={r.ldkly} /></td>
                  <td style={tdStyle()}><CellGlyph v={r.statsig} /></td>
                  <td style={tdStyle()}><CellGlyph v={r.eppo} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ marginTop: 18, fontFamily: Mf, fontSize: 12, color: C.muted }}>
          ✓ = fully supported · — = not supported · $$$ = paid tier · partial = workaround required · soon = on roadmap
        </p>
      </section>

      {/* ── Feature cards ── */}
      <section style={{ ...sectionStyle, padding: "40px 24px 80px" }}>
        <div style={eyebrowStyle}>WHAT'S INSIDE THE BOX</div>
        <h2 style={h2Style}>Seven things the incumbents charge enterprise rates for.</h2>
        <div
          style={{
            marginTop: 40,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 20,
          }}
        >
          {FEATURE_CARDS.map((f) => (
            <div
              key={f.title}
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 26,
              }}
            >
              <div style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>{f.title}</div>
              <div style={{ fontFamily: Bf, fontSize: 14, color: C.body, marginTop: 10, lineHeight: 1.6 }}>
                {f.body}
              </div>
              <div style={{ fontFamily: Mf, fontSize: 11, color: C.sage, marginTop: 14, letterSpacing: 0.5 }}>
                {f.ref}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Statistical rigor ── */}
      <section style={{ background: C.white, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ ...sectionStyle, padding: "80px 24px" }}>
          <div style={eyebrowStyle}>STATISTICAL RIGOR</div>
          <h2 style={h2Style}>The math is public. So is the proof.</h2>
          <p style={{ fontFamily: Bf, fontSize: 17, color: C.body, marginTop: 14, maxWidth: 740, lineHeight: 1.6 }}>
            Most A/B tools hide their assumptions behind NDAs. We checked in a{" "}
            <strong style={{ color: C.char }}>10,000-trial Monte Carlo validation harness</strong> that verifies
            Type I error, SRM false-positive rates, and CUPED variance reduction on every pull request.
            Every method cites its academic reference inline. You can reproduce the whole suite locally:
          </p>

          <pre style={{ ...codeBlockStyle, marginTop: 24 }}>{`# Clone, install, prove our stats are correct
git clone https://github.com/balabommablock-cpu/agdambagdam
cd agdambagdam && npm install
npx tsx packages/stats/benchmarks/monte-carlo.ts --seed 42

# Output (2026-04-16 run):
#   ✅ Frequentist z-test — reference parity (unpooled)
#   ✅ Frequentist z-test — Type I error under H₀           0.0484
#   ✅ Sequential (O'Brien-Fleming) Type I across 4 looks   0.0377
#   ✅ Sequential (Pocock) Type I across 4 looks            0.0347
#   ✅ SRM detector Type I under true 50/50                  0.0116
#   ✅ CUPED empirical variance reduction (ρ=0.7)            0.4863
#   All 6 suites passed`}</pre>

          <div style={{ marginTop: 24, display: "flex", flexWrap: "wrap", gap: 14 }}>
            <a
              href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md"
              target="_blank"
              rel="noopener noreferrer"
              style={btnPrimaryStyle}
            >
              Read BENCHMARKS.md
            </a>
            <a
              href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/scipy_reference.py"
              target="_blank"
              rel="noopener noreferrer"
              style={btnSecondaryStyle}
            >
              SciPy reference parity
            </a>
            <a
              href="https://github.com/balabommablock-cpu/agdambagdam/blob/main/packages/stats/benchmarks/r_reference.R"
              target="_blank"
              rel="noopener noreferrer"
              style={btnSecondaryStyle}
            >
              gsDesign (R) parity
            </a>
          </div>
        </div>
      </section>

      {/* ── Self-host ── */}
      <section style={{ ...sectionStyle, padding: "80px 24px" }}>
        <div style={eyebrowStyle}>SELF-HOST IN 3 MINUTES</div>
        <h2 style={h2Style}>Your data. Your VPC. Your call.</h2>
        <p style={{ fontFamily: Bf, fontSize: 17, color: C.body, marginTop: 14, maxWidth: 720, lineHeight: 1.6 }}>
          Enterprises don't want their experimentation data leaving the network. Good news: the entire stack
          ships as Docker Compose. Postgres, API server, dashboard — one command.
        </p>

        <pre style={{ ...codeBlockStyle, marginTop: 28 }}>{`git clone https://github.com/balabommablock-cpu/agdambagdam
cd agdambagdam
docker-compose up -d
# Postgres ready.  API on :3456.  Dashboard on :3457.
# Visit http://localhost:3457, paste the printed API key, done.`}</pre>

        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {[
            "Zero data egress — your events never leave the box.",
            "Runs anywhere Docker runs: laptop, single VM, Kubernetes.",
            "Audit log on every mutation, queryable SQL.",
            "MIT license — fork it, embed it, sell it. Whatever.",
          ].map((line) => (
            <div
              key={line}
              style={{
                background: C.cream,
                borderLeft: `3px solid ${C.sage}`,
                padding: "14px 18px",
                fontFamily: Bf,
                fontSize: 14,
                color: C.body,
                lineHeight: 1.5,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust / security ── */}
      <section style={{ ...sectionStyle, padding: "40px 24px 80px" }}>
        <div style={eyebrowStyle}>TRUST, NOT CLAIMS</div>
        <h2 style={h2Style}>Every claim is a link to a committed artifact.</h2>
        <div
          style={{
            marginTop: 30,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {[
            {
              title: "SECURITY.md",
              body: "Coordinated disclosure, CVSS-tiered SLAs, scope, safe harbor. Private GitHub vulnerability reporting enabled.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/SECURITY.md",
            },
            {
              title: "BENCHMARKS.md",
              body: "10k-trial Monte Carlo validation. SciPy + R reference parity. Every method cites its paper inline.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/BENCHMARKS.md",
            },
            {
              title: "ARCHITECTURE.md",
              body: "11-section system design with data-flow diagrams, schema, and explicit trust boundaries.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/ARCHITECTURE.md",
            },
            {
              title: "FEATURES.md",
              body: "Honest competitor matrix with a gap column. If it's not done, we say so.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/FEATURES.md",
            },
            {
              title: "Troubleshooting docs",
              body: "Every error code → plain-English fix → direct link. Indexed by error string.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/docs/troubleshooting.md",
            },
            {
              title: "CI on every PR",
              body: "Tests on Node 20/22/24, semgrep, gitleaks, npm audit, bundle-size budget, license check, Monte Carlo validation.",
              href: "https://github.com/balabommablock-cpu/agdambagdam/blob/main/.github/workflows/ci.yml",
            },
          ].map((x) => (
            <a
              key={x.title}
              href={x.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: C.white,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: 22,
                textDecoration: "none",
                color: C.char,
                display: "block",
              }}
            >
              <div style={{ fontFamily: Mf, fontSize: 12, color: C.sage, fontWeight: 700, letterSpacing: 1 }}>
                {x.title}
              </div>
              <div style={{ fontFamily: Bf, fontSize: 14, color: C.body, marginTop: 8, lineHeight: 1.55 }}>
                {x.body}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ background: C.char, color: C.cream }}>
        <div style={{ ...sectionStyle, padding: "80px 24px", textAlign: "center" }}>
          <div style={{ ...eyebrowStyle, color: C.mustard }}>SHIP FIRST, LICENSE LATER</div>
          <h2 style={{ ...h2Style, color: C.cream }}>
            Your competitor just paid $75K for what you can use free.
          </h2>
          <p style={{ fontFamily: Bf, fontSize: 17, color: "#D9D0BF", marginTop: 18, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Fork the repo, star it, run a test this afternoon. If it doesn't make the paid tools look absurd,
            open an issue and tell us why.
          </p>
          <div style={{ marginTop: 36, display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center" }}>
            <Link
              href="/agdambagdam/app"
              style={{ ...btnPrimaryStyle, background: C.cream, color: C.char }}
            >
              Open dashboard →
            </Link>
            <a
              href="https://github.com/balabommablock-cpu/agdambagdam"
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...btnSecondaryStyle, borderColor: C.cream, color: C.cream }}
            >
              Star on GitHub
            </a>
          </div>
          <div style={{ marginTop: 32, fontFamily: Mf, fontSize: 12, color: "#8A8A8A", letterSpacing: 1 }}>
            MIT LICENSED · ZERO VENDOR LOCK-IN · MADE IN INDIA
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Table helpers ────────────────────────────────────────────────────────

function thStyle(first: boolean = false): React.CSSProperties {
  return {
    padding: "14px 16px",
    textAlign: first ? "left" : "center",
    fontFamily: Bf,
    fontSize: 12,
    fontWeight: 700,
    color: C.char,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
    borderBottom: `2px solid ${C.border}`,
    whiteSpace: "nowrap" as const,
  };
}

function tdStyle(first: boolean = false): React.CSSProperties {
  return {
    padding: "14px 16px",
    textAlign: first ? "left" : "center",
    color: C.body,
    borderBottom: `1px solid ${C.border}`,
  };
}
