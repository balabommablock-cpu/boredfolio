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

interface AudioRoastResult {
  headline: string;
  roastHindi: string;
  verdict: string;
  shareText: string;
  fundName: string;
  category: string;
  fundHouse: string;
  nav: string;
  return1Y: string;
  schemeCode: string;
  audioBase64: string | null;
  audioError: string | null;
}

export default function SarvamPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<AudioRoastResult | null>(null);
  const [error, setError] = useState("");
  const [playing, setPlaying] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
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

  const generateAudioRoast = async (code: string, name: string) => {
    setSuggestions([]);
    setQuery(name);
    setLoading(true);
    setError("");
    setResult(null);
    setPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    try {
      const res = await fetch("/api/audio-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeCode: code, schemeName: name }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "API error");
      }
      const data = await res.json();
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err: any) {
      setError(err.message || "Audio roast generate nahi ho payi. Phir try karo.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (!result?.audioBase64) return;
    if (audioRef.current) {
      if (playing) { audioRef.current.pause(); setPlaying(false); return; }
      audioRef.current.play(); setPlaying(true); return;
    }
    const audio = new Audio(`data:audio/wav;base64,${result.audioBase64}`);
    audio.onended = () => setPlaying(false);
    audio.play();
    setPlaying(true);
    audioRef.current = audio;
  };

  const downloadAudio = () => {
    if (!result?.audioBase64) return;
    const byteChars = atob(result.audioBase64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `boredfolio-roast-${result.schemeCode || "fund"}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareOnWhatsApp = () => {
    if (!result) return;
    const text = `${result.shareText}\n\n🔊 Hindi mein fund roast suno: https://boredfolio.com/sarvam`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Loading messages cycle
  const loadingMessages = [
    "Fund ka data utha rahe hain...",
    "Hindi mein roast likh rahe hain...",
    "Sarvam AI se audio bana rahe hain...",
    "Thoda patience — uncle-ji ke WhatsApp ke liye taiyaar ho raha hai.",
  ];
  const [loadingIdx, setLoadingIdx] = useState(0);
  useEffect(() => {
    if (!loading) { setLoadingIdx(0); return; }
    const t = setInterval(() => setLoadingIdx(i => (i + 1) % loadingMessages.length), 3000);
    return () => clearInterval(t);
  }, [loading]);

  return (
    <>
      <style>{`@import url('${FONTS}');*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::selection{background:${C.sage};color:#fff}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes waveform{0%,100%{height:8px}50%{height:24px}}`}</style>
      <div style={{ background: C.bg, minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: "0 auto" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>bored</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: C.sage }}>folio</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.sage }}>.</span>
          </a>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="/roast" style={{ fontFamily: Bf, fontSize: 13, color: C.red, textDecoration: "none", fontWeight: 600 }}>English Roast</a>
            <a href="/explore" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>Explore</a>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: Mf, fontSize: 10, fontWeight: 600, letterSpacing: 4, color: C.mustard, textTransform: "uppercase", marginBottom: 16 }}>
            HINDI AUDIO ROAST — POWERED BY SARVAM AI
          </div>
          <h1 style={{ fontFamily: Sf, fontSize: isMobile ? 30 : 48, fontWeight: 900, color: C.char, lineHeight: 1.08, marginBottom: 12 }}>
            Fund ki roast,<br />ab <span style={{ background: C.mustard, color: C.cream, padding: "2px 12px", borderRadius: 4 }}>Hindi mein suno</span>.
          </h1>
          <p style={{ fontFamily: Bf, fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 8 }}>
            Enter any mutual fund. We roast it in Hindi. You get audio.<br />
            Download. Forward on WhatsApp. Watch uncle-ji forward it to 47 groups.
          </p>
          <p style={{ fontFamily: Hf, fontSize: isMobile ? 16 : 20, color: C.sage, marginBottom: 32 }}>
            Voice notes &gt; screenshots. Always.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Fund ka naam likho — 'HDFC Flexi Cap', 'SBI Blue Chip'..."
              style={{
                width: "100%", fontFamily: Bf, fontSize: 16, padding: "16px 22px",
                border: `2px solid ${C.border}`, borderRadius: 10, background: C.white,
                outline: "none", color: C.char,
              }}
              onFocus={e => (e.target.style.borderColor = C.mustard)}
              onBlur={e => (e.target.style.borderColor = C.border)}
            />
            {searching && (
              <div style={{ position: "absolute", right: 16, top: 18, fontFamily: Mf, fontSize: 10, color: C.light }}>dhundh rahe hain...</div>
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
                    onClick={() => generateAudioRoast(s.schemeCode, s.schemeName)}
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 4, height: 32, marginBottom: 20 }}>
              {[0, 1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} style={{
                  width: 4, background: C.mustard, borderRadius: 2,
                  animation: `waveform 0.8s ease-in-out ${i * 0.1}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ fontFamily: Mf, fontSize: 12, color: C.light, marginBottom: 8 }}>
              {loadingMessages[loadingIdx]}
            </div>
            <div style={{ fontFamily: Hf, fontSize: 18, color: C.mustard }}>
              Chai pe charcha, fund pe roast.
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
            {/* Audio Player Card */}
            <div style={{ background: C.char, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              {/* Header */}
              <div style={{ padding: isMobile ? "24px 20px 16px" : "32px 36px 20px" }}>
                <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 3, color: C.mustard, textTransform: "uppercase", marginBottom: 8 }}>
                  🔊 HINDI AUDIO ROAST
                </div>
                <h2 style={{ fontFamily: Sf, fontSize: isMobile ? 22 : 32, fontWeight: 900, color: C.cream, lineHeight: 1.1, marginBottom: 8 }}>
                  {result.headline}
                </h2>
                <div style={{ fontFamily: Bf, fontSize: 13, color: C.light }}>
                  {result.fundName}
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 1, background: C.char, padding: "0 20px" }}>
                {[
                  { label: "NAV", value: `\u20B9${result.nav}` },
                  { label: "1Y Return", value: `${result.return1Y}%` },
                  { label: "Category", value: result.category?.split(" ").slice(0, 3).join(" ") },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.05)", padding: "10px 12px", borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0 }}>
                    <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 1, color: C.light, textTransform: "uppercase", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: C.cream }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Audio Player */}
              {result.audioBase64 ? (
                <div style={{ padding: isMobile ? "20px 20px" : "24px 36px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 16,
                    background: "rgba(201,162,39,0.12)", borderRadius: 12, padding: "16px 20px",
                  }}>
                    {/* Play/Pause Button */}
                    <button
                      onClick={playAudio}
                      style={{
                        width: 56, height: 56, borderRadius: "50%", border: "none",
                        background: C.mustard, cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      {playing ? (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <rect x="4" y="3" width="4" height="14" rx="1" fill={C.char} />
                          <rect x="12" y="3" width="4" height="14" rx="1" fill={C.char} />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M6 3L17 10L6 17V3Z" fill={C.char} />
                        </svg>
                      )}
                    </button>

                    {/* Waveform animation */}
                    <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 2, height: 32, overflow: "hidden" }}>
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div key={i} style={{
                          width: 3, borderRadius: 1.5, background: playing ? C.mustard : "rgba(201,162,39,0.4)",
                          height: playing ? undefined : `${8 + Math.sin(i * 0.8) * 8}px`,
                          animation: playing ? `waveform 0.6s ease-in-out ${i * 0.04}s infinite` : "none",
                          transition: "background 0.3s",
                        }} />
                      ))}
                    </div>

                    {/* Download */}
                    <button
                      onClick={downloadAudio}
                      title="Download for WhatsApp"
                      style={{
                        width: 44, height: 44, borderRadius: 10, border: `1px solid rgba(201,162,39,0.3)`,
                        background: "transparent", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M9 2V12M9 12L5 8M9 12L13 8" stroke={C.mustard} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 14H16" stroke={C.mustard} strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : result.audioError ? (
                <div style={{ padding: isMobile ? "16px 20px" : "20px 36px" }}>
                  <div style={{
                    background: "rgba(196,69,60,0.1)", borderRadius: 10, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12,
                  }}>
                    <span style={{ fontSize: 20 }}>🔇</span>
                    <div>
                      <div style={{ fontFamily: Bf, fontSize: 13, fontWeight: 600, color: C.cream, marginBottom: 2 }}>
                        Audio nahi ban payi
                      </div>
                      <div style={{ fontFamily: Mf, fontSize: 10, color: C.light }}>
                        {result.audioError.includes("not configured")
                          ? "Sarvam API key setup nahi hai. Admin se bolo!"
                          : "Sarvam API ne mana kar diya. Thodi der baad try karo."}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Hindi Roast Text */}
              <div style={{ padding: isMobile ? "12px 20px 24px" : "12px 36px 32px" }}>
                <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 2, color: C.light, textTransform: "uppercase", marginBottom: 10 }}>TRANSCRIPT</div>
                {result.roastHindi.split("\n\n").map((p: string, i: number) => (
                  <p key={i} style={{ fontFamily: Bf, fontSize: 15, color: "rgba(255,255,255,0.85)", lineHeight: 1.7, marginBottom: 14 }}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Verdict */}
              <div style={{ background: C.mustard, padding: "16px 24px" }}>
                <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 2, color: "rgba(0,0,0,0.4)", textTransform: "uppercase", marginBottom: 4 }}>VERDICT</div>
                <div style={{ fontFamily: Sf, fontSize: isMobile ? 16 : 20, fontWeight: 400, fontStyle: "italic", color: C.char, lineHeight: 1.3 }}>
                  {result.verdict}
                </div>
              </div>

              {/* Branding */}
              <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>boredfolio.com/sarvam</span>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>Sarvam AI + Gemini</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              {result.audioBase64 && (
                <button
                  onClick={downloadAudio}
                  style={{
                    flex: 1, fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.char,
                    background: C.mustard, border: "none", padding: "14px 20px", borderRadius: 10,
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  }}
                >
                  📥 Download for WhatsApp
                </button>
              )}
              <button
                onClick={shareOnWhatsApp}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.white,
                  background: "#25D366", border: "none", padding: "14px 20px", borderRadius: 10,
                  cursor: "pointer",
                }}
              >
                Share on WhatsApp
              </button>
            </div>

            {/* Roast another */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <button
                onClick={() => { setResult(null); setQuery(""); setPlaying(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }}
                style={{
                  fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.mustard,
                  background: "none", border: `1px solid ${C.mustard}40`, padding: "12px 28px",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                🔊 Ek aur fund ki sunaao
              </button>
            </div>

            {/* Cross-links */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <a
                href={`/roast`}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 13, fontWeight: 600, color: C.red,
                  background: C.rBg, border: `1px solid ${C.red}20`, padding: "14px 16px", borderRadius: 10,
                  textDecoration: "none", textAlign: "center",
                }}
              >
                🔥 English Roast
              </a>
              <a
                href={`/fund/${result.schemeCode}`}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 13, fontWeight: 600, color: C.sage,
                  background: C.gBg, border: `1px solid ${C.sage}20`, padding: "14px 16px", borderRadius: 10,
                  textDecoration: "none", textAlign: "center",
                }}
              >
                📊 Full Fund Analysis
              </a>
            </div>
          </div>
        )}

        {/* How it works — shown when no result */}
        {!result && !loading && (
          <div style={{ maxWidth: 640, margin: "40px auto 0", padding: "0 28px" }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 16, marginBottom: 40 }}>
              {[
                { step: "01", emoji: "🔍", title: "Fund chuno", desc: "Koi bhi mutual fund search karo — HDFC, SBI, Axis, koi bhi" },
                { step: "02", emoji: "🤖", title: "AI roast likhe", desc: "Gemini AI Hindi mein savage roast likhta hai — real data ke saath" },
                { step: "03", emoji: "🔊", title: "Audio suno", desc: "Sarvam AI audio banaata hai — download karo, WhatsApp pe forward karo" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: C.white, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, textAlign: "center",
                }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.emoji}</div>
                  <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 2, color: C.mustard, textTransform: "uppercase", marginBottom: 6 }}>Step {s.step}</div>
                  <div style={{ fontFamily: Bf, fontSize: 15, fontWeight: 700, color: C.char, marginBottom: 6 }}>{s.title}</div>
                  <div style={{ fontFamily: Bf, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Why audio */}
            <div style={{
              background: C.char, borderRadius: 14, padding: isMobile ? 24 : 36, textAlign: "center", marginBottom: 40,
            }}>
              <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 3, color: C.mustard, textTransform: "uppercase", marginBottom: 12 }}>WHY AUDIO?</div>
              <h2 style={{ fontFamily: Sf, fontSize: isMobile ? 22 : 32, fontWeight: 400, color: C.cream, lineHeight: 1.2, marginBottom: 16 }}>
                Screenshots get ignored.<br />Voice notes get <span style={{ fontStyle: "italic", color: C.mustard }}>forwarded</span>.
              </h2>
              <p style={{ fontFamily: Bf, fontSize: 14, color: C.light, lineHeight: 1.6, maxWidth: 420, margin: "0 auto" }}>
                Uncle-ji won't read a 4-paragraph roast. But a 30-second Hindi voice note roasting his HDFC fund? That's getting forwarded to the entire family group, the office group, and the society group.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: Bf, fontSize: 12, color: C.light, lineHeight: 1.6 }}>
            Hindi roasts are AI-generated using Gemini + Sarvam TTS. Fund data from mfapi.in. For entertainment and education only.
            Boredfolio doesn't sell funds or give investment advice.
          </p>
        </div>
      </div>
    </>
  );
}
