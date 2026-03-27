"use client";

import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#F5F0E8", cream: "#F5F0E8", white: "#FFFFFF", char: "#1A1A1A",
  sage: "#6B8F71", sageDk: "#4A6B50", mustard: "#C9A227",
  muted: "#8C8C8C", light: "#B5B5B5", border: "#E5E0D5",
  red: "#C4453C", green: "#2D8F4E", rBg: "#FFF5F4", gBg: "#F0FAF3",
};
const Sf = "'Playfair Display', serif";
const Bf = "'DM Sans', sans-serif";
const Mf = "'JetBrains Mono', monospace";
const Hf = "'Caveat', cursive";
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@400;700&display=swap";

interface RoastResult {
  headline: string;
  roast: string;
  verdict: string;
  shareText: string;
  fundName: string;
  category: string;
  fundHouse: string;
  nav: string;
  return1Y: string;
  schemeCode: string;
}

export default function RoastPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<RoastResult | null>(null);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<any>(null);

  // Auto-search as user types
  useEffect(() => {
    if (query.length < 3) { setSuggestions([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearching(true);
      fetch(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(data => { setSuggestions((data || []).slice(0, 8)); setSearching(false); })
        .catch(() => { setSuggestions([]); setSearching(false); });
    }, 300);
  }, [query]);

  const generateRoast = async (code: string, name: string) => {
    setSuggestions([]);
    setQuery(name);
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeCode: code, schemeName: name }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch {
      setError("Couldn't roast this fund. The API might be overwhelmed by our savagery. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const shareOnWhatsApp = () => {
    if (!result) return;
    const text = `${result.shareText}\n\n🔥 Get your fund roasted: https://boredfolio.com/roast`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareOnX = () => {
    if (!result) return;
    const text = `${result.headline}\n\n${result.verdict}\n\n🔥 Roast your fund at boredfolio.com/roast`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <style>{`@import url('${FONTS}');*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::selection{background:${C.sage};color:#fff}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ background: C.bg, minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: "0 auto" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>bored</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: C.sage }}>folio</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.sage }}>.</span>
          </a>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="/sarvam" style={{ fontFamily: Bf, fontSize: 13, color: "#E07A2F", fontWeight: 600, textDecoration: "none" }}>Hindi Audio Roast</a>
            <a href="/explore" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>← Back to Explore</a>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: Mf, fontSize: 10, fontWeight: 600, letterSpacing: 4, color: C.red, textTransform: "uppercase", marginBottom: 16 }}>
            AI-POWERED FUND ROAST
          </div>
          <h1 style={{ fontFamily: Sf, fontSize: isMobile ? 32 : 52, fontWeight: 900, color: C.char, lineHeight: 1.08, marginBottom: 12 }}>
            Your fund is about to<br />have a <span style={{ background: C.red, color: C.cream, padding: "2px 12px", borderRadius: 4 }}>bad day</span>.
          </h1>
          <p style={{ fontFamily: Bf, fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 32 }}>
            Enter any mutual fund. Our AI will roast it with real data.<br />
            No feelings were considered in the making of this tool.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a fund name — 'HDFC Flexi Cap', 'SBI Blue Chip'..."
              style={{
                width: "100%", fontFamily: Bf, fontSize: 16, padding: "16px 22px",
                border: `2px solid ${C.border}`, borderRadius: 10, background: C.white,
                outline: "none", color: C.char,
              }}
              onFocus={e => (e.target.style.borderColor = C.sage)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
            {searching && (
              <div style={{ position: "absolute", right: 16, top: 18, fontFamily: Mf, fontSize: 10, color: C.light }}>searching...</div>
            )}
            {suggestions.length > 0 && (
              <div style={{
                position: "absolute", top: "100%", left: 0, right: 0, background: C.white,
                border: `1px solid ${C.border}`, borderRadius: 10, marginTop: 4,
                boxShadow: "0 8px 32px rgba(0,0,0,0.08)", zIndex: 10, overflow: "hidden",
              }}>
                {suggestions.map((s: any, i: number) => (
                  <div
                    key={s.schemeCode}
                    onClick={() => generateRoast(s.schemeCode, s.schemeName)}
                    style={{
                      padding: "12px 18px", cursor: "pointer", borderBottom: i < suggestions.length - 1 ? `1px solid ${C.border}` : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.cream)}
                    onMouseLeave={e => (e.currentTarget.style.background = C.white)}
                  >
                    <div style={{ fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.char }}>{s.schemeName}</div>
                    <div style={{ fontFamily: Mf, fontSize: 10, color: C.light, marginTop: 2 }}>Code: {s.schemeCode}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Loading state */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px 28px" }}>
            <div style={{ width: 32, height: 32, border: `3px solid ${C.border}`, borderTopColor: C.sage, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
            <div style={{ fontFamily: Mf, fontSize: 12, color: C.light, marginBottom: 8 }}>
              Generating roast with AI...
            </div>
            <div style={{ fontFamily: Hf, fontSize: 18, color: C.sage }}>
              This fund is about to learn what honesty feels like.
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ maxWidth: 500, margin: "20px auto", padding: "16px 20px", background: C.rBg, border: `1px solid ${C.red}30`, borderRadius: 10, textAlign: "center" }}>
            <p style={{ fontFamily: Bf, fontSize: 14, color: C.red }}>{error}</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div ref={resultRef} style={{ maxWidth: 640, margin: "20px auto 60px", padding: "0 28px", animation: "fadeUp 0.5s ease-out" }}>
            {/* Roast card */}
            <div style={{ background: C.char, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              {/* Header */}
              <div style={{ padding: isMobile ? "24px 20px 16px" : "32px 36px 20px" }}>
                <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 3, color: C.red, textTransform: "uppercase", marginBottom: 8 }}>
                  🔥 FUND ROAST
                </div>
                <h2 style={{ fontFamily: Sf, fontSize: isMobile ? 24 : 36, fontWeight: 900, color: C.cream, lineHeight: 1.1, marginBottom: 8 }}>
                  {result.headline}
                </h2>
                <div style={{ fontFamily: Bf, fontSize: 13, color: C.light }}>
                  {result.fundName}
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 1, background: C.char, padding: "0 20px" }}>
                {[
                  { label: "NAV", value: `₹${result.nav}` },
                  { label: "1Y Return", value: `${result.return1Y}%` },
                  { label: "Category", value: result.category?.split(" ").slice(0, 3).join(" ") },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.05)", padding: "10px 12px", borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0 }}>
                    <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 1, color: C.light, textTransform: "uppercase", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: C.cream }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Roast text */}
              <div style={{ padding: isMobile ? "20px 20px 24px" : "24px 36px 32px" }}>
                {result.roast.split("\n\n").map((p: string, i: number) => (
                  <p key={i} style={{ fontFamily: Bf, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 14 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Verdict */}
              <div style={{ background: C.red, padding: "16px 24px" }}>
                <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 2, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", marginBottom: 4 }}>VERDICT</div>
                <div style={{ fontFamily: Sf, fontSize: isMobile ? 16 : 20, fontWeight: 400, fontStyle: "italic", color: C.cream, lineHeight: 1.3 }}>
                  {result.verdict}
                </div>
              </div>

              {/* Branding */}
              <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>boredfolio.com/roast</span>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>AI-generated roast</span>
              </div>
            </div>

            {/* Share buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <button
                onClick={shareOnWhatsApp}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.white,
                  background: "#25D366", border: "none", padding: "14px 20px", borderRadius: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Share on WhatsApp
              </button>
              <button
                onClick={shareOnX}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.cream,
                  background: C.char, border: "none", padding: "14px 20px", borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                Post on 𝕏
              </button>
            </div>

            {/* Roast another */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <button
                onClick={() => { setResult(null); setQuery(""); }}
                style={{
                  fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.sage,
                  background: "none", border: `1px solid ${C.sage}40`, padding: "12px 28px",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                🔥 Roast another fund
              </button>
            </div>

            {/* CTA */}
            <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
              <p style={{ fontFamily: Bf, fontSize: 14, color: C.muted, marginBottom: 12 }}>
                Want the full picture? See what your fund actually holds.
              </p>
              <a
                href={`/fund/${result.schemeCode}`}
                style={{
                  fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.cream,
                  background: C.sage, padding: "12px 28px", borderRadius: 8,
                  textDecoration: "none", display: "inline-block",
                }}
              >
                View full fund analysis →
              </a>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: Bf, fontSize: 12, color: C.light, lineHeight: 1.6 }}>
            Roasts are AI-generated using fund data from mfapi.in. For entertainment and education only.
            Boredfolio doesn't sell funds or give investment advice.
          </p>
        </div>
      </div>
    </>
  );
}
