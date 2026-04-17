"use client";

import { useState } from "react";

/**
 * Interactive framework-tabbed code example for the Agdam Bagdam landing.
 * Four tabs, syntax-highlighted-ish code blocks, copy button on each.
 *
 * Kept as its own client component so the server-rendered page stays fast —
 * only the tabs pay the hydration tax.
 */

type TabKey = "html" | "nextjs" | "react" | "node";

interface Tab {
  key: TabKey;
  label: string;
  filename: string;
  code: string;
}

const TABS: Tab[] = [
  {
    key: "html",
    label: "HTML",
    filename: "index.html",
    code: `<script src="https://unpkg.com/agdambagdam"></script>
<script>
  const ab = new Abacus({
    apiKey:  'demo-public-key',
    baseUrl: 'https://boredfolio.com/agdambagdam/api'
  });

  ab.getVariant('button-color').then((v) => {
    if (v === 'green') cta.style.backgroundColor = 'green';
  });

  cta.onclick = () => ab.track('signup-click');
</script>`,
  },
  {
    key: "nextjs",
    label: "Next.js",
    filename: "app/page.tsx",
    code: `import { Abacus } from 'agdambagdam';
import { cookies } from 'next/headers';

export default async function Page() {
  const uid = (await cookies()).get('uid')?.value ?? 'anon';
  const ab  = new Abacus({
    apiKey:  process.env.ABACUS_API_KEY!,
    baseUrl: process.env.ABACUS_BASE_URL!,
    userId:  uid,
  });
  await ab.initialize();
  const variant = await ab.getVariant('hero-test');

  return <Hero copy={HEADLINES[variant]} />;
}`,
  },
  {
    key: "react",
    label: "React",
    filename: "useVariant.ts",
    code: `import { useEffect, useState } from 'react';
import { Abacus } from 'agdambagdam';

const ab = new Abacus({
  apiKey:  import.meta.env.VITE_ABACUS_KEY,
  baseUrl: import.meta.env.VITE_ABACUS_URL,
});

export function useVariant(key: string): string {
  const [v, set] = useState('control');
  useEffect(() => {
    ab.getVariant(key).then(set).catch(() => {});
  }, [key]);
  return v;
}`,
  },
  {
    key: "node",
    label: "Node",
    filename: "server.ts",
    code: `import { Abacus } from '@agdambagdam/sdk-node';

const ab = new Abacus({
  apiKey:  process.env.ABACUS_API_KEY!,
  baseUrl: process.env.ABACUS_BASE_URL!,
});

app.get('/checkout', async (req, res) => {
  const variant = await ab.getVariant('checkout-flow', req.cookies.uid);
  if (variant === 'one-page') return renderOnePage(res);
  return renderMultiStep(res);
});`,
  },
];

// ── Very-lightweight token colorizer (no external deps). Keyword coloring only. ──
const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "if", "else", "async", "await",
  "import", "from", "export", "default", "new", "true", "false", "null", "undefined",
]);

function Highlight({ code }: { code: string }) {
  // Tokenize by simple regex into: strings, comments, keywords, identifiers, punctuation, numbers.
  // Palette chosen to be restrained — muted violet for keywords/types, warm-beige strings,
  // dim gold numbers. Avoids the saturated pink/green/yellow of a typical editor theme so the
  // code block reads as editorial rather than "IDE screenshot".
  const tokenRe =
    /(`[^`]*`|'[^']*'|"[^"]*")|(\/\/[^\n]*)|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_$][a-zA-Z0-9_$]*\b)|(\s+)|(.)/g;

  const nodes: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = tokenRe.exec(code))) {
    const [full, str, cmt, num, ident, ws, punct] = m;
    if (str) nodes.push(<span key={i++} style={{ color: "#C7D3A8" }}>{full}</span>);
    else if (cmt) nodes.push(<span key={i++} style={{ color: "#52525B", fontStyle: "italic" }}>{full}</span>);
    else if (num) nodes.push(<span key={i++} style={{ color: "#D6B58A" }}>{full}</span>);
    else if (ident) {
      if (KEYWORDS.has(full)) {
        nodes.push(<span key={i++} style={{ color: "#B4A1FF" }}>{full}</span>);
      } else if (/^[A-Z]/.test(full)) {
        nodes.push(<span key={i++} style={{ color: "#8B7CFF" }}>{full}</span>);
      } else {
        nodes.push(<span key={i++} style={{ color: "#E5E7EB" }}>{full}</span>);
      }
    } else if (ws) nodes.push(ws);
    else if (punct) nodes.push(<span key={i++} style={{ color: "#8B8B93" }}>{full}</span>);
  }
  return <>{nodes}</>;
}

export function FrameworkTabs() {
  const [active, setActive] = useState<TabKey>("html");
  const [copied, setCopied] = useState(false);
  const tab = TABS.find((t) => t.key === active)!;

  const onCopy = () => {
    navigator.clipboard.writeText(tab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div
      style={{
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
        background: "#08080B",
        overflow: "hidden",
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          {TABS.map((t) => {
            const isActive = t.key === active;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setActive(t.key)}
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "13px 18px",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: "inherit",
                  color: isActive ? "#F7F7F8" : "#71717A",
                  cursor: "pointer",
                  position: "relative",
                  transition: "color 0.15s",
                  letterSpacing: "-0.005em",
                }}
              >
                {t.label}
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 14,
                      right: 14,
                      bottom: -1,
                      height: 1.5,
                      background: "#8B7CFF",
                      borderRadius: 2,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            paddingRight: 10,
          }}
        >
          <span style={{ fontSize: 11, color: "#52525B", fontFamily: "var(--font-mono, monospace)", letterSpacing: "0.04em" }}>
            {tab.filename}
          </span>
          <button
            type="button"
            onClick={onCopy}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: copied ? "#7FD1A8" : "#A1A1AA",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "inherit",
              padding: "5px 10px",
              borderRadius: 5,
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.02em",
            }}
          >
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>
      </div>

      {/* Code */}
      <pre
        style={{
          margin: 0,
          padding: "22px 24px",
          fontFamily: "var(--font-mono, ui-monospace, monospace)",
          fontSize: 12.5,
          lineHeight: 1.75,
          overflowX: "auto",
          color: "#E5E7EB",
        }}
      >
        <code>
          <Highlight code={tab.code} />
        </code>
      </pre>
    </div>
  );
}
