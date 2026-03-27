"use client";

import { useState, useRef, useEffect } from "react";

const C = {
  bg: "#F5F0E8", cream: "#F5F0E8", white: "#FFFFFF", char: "#1A1A1A",
  sage: "#6B8F71", sageDk: "#4A6B50", mustard: "#C9A227",
  muted: "#8C8C8C", light: "#B5B5B5", border: "#E5E0D5",
  red: "#C4453C", green: "#2D8F4E", rBg: "#FFF5F4", gBg: "#F0FAF3",
  orange: "#E07A2F",
};
const Sf = "'Playfair Display', serif";
const Bf = "'DM Sans', sans-serif";
const Mf = "'JetBrains Mono', monospace";
const Hf = "'Caveat', cursive";
const FONTS = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Caveat:wght@400;700&display=swap";

interface AudioRoastResult {
  audioBase64: string;
  roastScript: string;
  fundName: string;
  category: string;
  fundHouse: string;
  nav: string;
  return1Y: string;
  return3M: string;
  schemeCode: string;
}

export default function SarvamPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<AudioRoastResult | null>(null);
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const generateAudioRoast = async (code: string, name: string) => {
    setSuggestions([]);
    setQuery(name);
    setLoading(true);
    setError("");
    setResult(null);
    setIsPlaying(false);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }

    setLoadingStage("Fetching fund data...");
    setTimeout(() => setLoadingStage("Writing Hindi roast script..."), 2000);
    setTimeout(() => setLoadingStage("Converting to voice with Sarvam AI..."), 6000);

    try {
      const res = await fetch("/api/audio-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schemeCode: code, schemeName: name }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: "Something went wrong" }));
        throw new Error(errData.error || "API error");
      }
      const data = await res.json();
      setResult(data);

      // Create audio element from base64
      const audio = new Audio(`data:audio/mp3;base64,${data.audioBase64}`);
      audio.addEventListener("ended", () => setIsPlaying(false));
      audioRef.current = audio;

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (err: any) {
      setError(err.message || "Couldn't generate the audio roast. Try again.");
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (!result) return;
    const link = document.createElement("a");
    link.href = `data:audio/mp3;base64,${result.audioBase64}`;
    link.download = `boredfolio-roast-${result.schemeCode}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareOnWhatsApp = () => {
    if (!result) return;
    const text = `Yeh suno — ${result.fundName} ka Hindi roast by Boredfolio AI\n\n🔊 Listen here: https://boredfolio.com/sarvam`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  return (
    <>
      <style>{`@import url('${FONTS}');*{margin:0;padding:0;box-sizing:border-box}body{background:${C.bg}}::selection{background:${C.sage};color:#fff}@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes soundWave{0%,100%{height:8px}50%{height:24px}}`}</style>
      <div style={{ background: C.bg, minHeight: "100vh" }}>
        {/* Nav */}
        <nav style={{ padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: 1080, margin: "0 auto" }}>
          <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "baseline" }}>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.char }}>bored</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 400, fontStyle: "italic", color: C.sage }}>folio</span>
            <span style={{ fontFamily: Sf, fontSize: 22, fontWeight: 900, color: C.sage }}>.</span>
          </a>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href="/roast" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>Text Roast</a>
            <a href="/explore" style={{ fontFamily: Bf, fontSize: 13, color: C.muted, textDecoration: "none" }}>Explore</a>
          </div>
        </nav>

        {/* Hero */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px 20px", textAlign: "center" }}>
          <div style={{ fontFamily: Mf, fontSize: 10, fontWeight: 600, letterSpacing: 4, color: C.orange, textTransform: "uppercase", marginBottom: 16 }}>
            HINDI AUDIO ROAST — POWERED BY SARVAM AI
          </div>
          <h1 style={{ fontFamily: Sf, fontSize: isMobile ? 30 : 48, fontWeight: 900, color: C.char, lineHeight: 1.08, marginBottom: 12 }}>
            Ab fund ki <span style={{ background: C.orange, color: C.cream, padding: "2px 12px", borderRadius: 4 }}>class lagegi</span>
            <br />in Hindi.
          </h1>
          <p style={{ fontFamily: Bf, fontSize: 16, color: C.muted, lineHeight: 1.6, marginBottom: 12 }}>
            Pick any mutual fund. Our AI writes a Hinglish roast and Sarvam converts it to voice.
            <br />Download it. Send it on WhatsApp. Watch uncle-ji lose it in the chai group.
          </p>
          <p style={{ fontFamily: Hf, fontSize: 20, color: C.sage, marginBottom: 32 }}>
            India's first AI voice roast for mutual funds
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: 500, margin: "0 auto" }}>
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Type a fund name — 'HDFC Flexi Cap', 'Axis Bluechip'..."
              style={{
                width: "100%", fontFamily: Bf, fontSize: 16, padding: "16px 22px",
                border: `2px solid ${C.border}`, borderRadius: 10, background: C.white,
                outline: "none", color: C.char,
              }}
              onFocus={e => (e.target.style.borderColor = C.orange)}
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
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginBottom: 20, height: 32 }}>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: 4, height: 8, background: C.orange, borderRadius: 2,
                  animation: `soundWave 0.8s ease-in-out ${i * 0.15}s infinite`,
                }} />
              ))}
            </div>
            <div style={{ fontFamily: Mf, fontSize: 12, color: C.orange, marginBottom: 8 }}>
              {loadingStage || "Generating audio roast..."}
            </div>
            <div style={{ fontFamily: Hf, fontSize: 18, color: C.sage }}>
              This takes 10-15 seconds. Worth the wait.
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
            {/* Audio Card */}
            <div style={{ background: C.char, borderRadius: 16, overflow: "hidden", marginBottom: 20 }}>
              {/* Header */}
              <div style={{ padding: isMobile ? "24px 20px 16px" : "32px 36px 20px" }}>
                <div style={{ fontFamily: Mf, fontSize: 9, letterSpacing: 3, color: C.orange, textTransform: "uppercase", marginBottom: 8 }}>
                  HINDI AUDIO ROAST
                </div>
                <h2 style={{ fontFamily: Sf, fontSize: isMobile ? 22 : 32, fontWeight: 900, color: C.cream, lineHeight: 1.1, marginBottom: 8 }}>
                  {result.fundName}
                </h2>
                <div style={{ fontFamily: Bf, fontSize: 13, color: C.light }}>
                  {result.fundHouse} &middot; {result.category?.split(" ").slice(0, 3).join(" ")}
                </div>
              </div>

              {/* Stats bar */}
              <div style={{ display: "flex", gap: 1, background: C.char, padding: "0 20px" }}>
                {[
                  { label: "NAV", value: `₹${result.nav}` },
                  { label: "1Y Return", value: `${result.return1Y}%` },
                  { label: "3M Return", value: `${result.return3M}%` },
                ].map((s, i) => (
                  <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.05)", padding: "10px 12px", borderRadius: i === 0 ? "8px 0 0 8px" : i === 2 ? "0 8px 8px 0" : 0 }}>
                    <div style={{ fontFamily: Mf, fontSize: 8, letterSpacing: 1, color: C.light, textTransform: "uppercase", marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontFamily: Mf, fontSize: 12, fontWeight: 700, color: C.cream }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Audio Player */}
              <div style={{ padding: isMobile ? "24px 20px" : "28px 36px" }}>
                <div style={{
                  background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: 16,
                }}>
                  {/* Play/Pause button */}
                  <button
                    onClick={togglePlay}
                    style={{
                      width: 56, height: 56, borderRadius: "50%", border: "none",
                      background: C.orange, cursor: "pointer", display: "flex",
                      alignItems: "center", justifyContent: "center", flexShrink: 0,
                      transition: "transform 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  >
                    {isPlaying ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={C.cream}>
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={C.cream}>
                        <polygon points="6,4 20,12 6,20" />
                      </svg>
                    )}
                  </button>

                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.cream, marginBottom: 4 }}>
                      {isPlaying ? "Playing..." : "Tap to play"}
                    </div>
                    <div style={{ fontFamily: Mf, fontSize: 10, color: C.light }}>
                      Hinglish roast by AI &middot; Sarvam TTS
                    </div>
                    {/* Visual waveform */}
                    {isPlaying && (
                      <div style={{ display: "flex", gap: 2, marginTop: 8, alignItems: "center", height: 16 }}>
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={i} style={{
                            width: 3, height: 4, background: C.orange, borderRadius: 1,
                            animation: `soundWave 0.6s ease-in-out ${i * 0.05}s infinite`,
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Roast script (expandable) */}
              <div style={{ padding: isMobile ? "0 20px 20px" : "0 36px 28px" }}>
                <details>
                  <summary style={{
                    fontFamily: Mf, fontSize: 10, letterSpacing: 1, color: C.light,
                    cursor: "pointer", textTransform: "uppercase", marginBottom: 8,
                    listStyle: "none",
                  }}>
                    Read the script ▾
                  </summary>
                  <p style={{ fontFamily: Bf, fontSize: 14, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginTop: 8 }}>
                    {result.roastScript}
                  </p>
                </details>
              </div>

              {/* Branding */}
              <div style={{ padding: "12px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>boredfolio.com/sarvam</span>
                <span style={{ fontFamily: Mf, fontSize: 9, color: C.light }}>Sarvam AI + Gemini</span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <button
                onClick={downloadAudio}
                style={{
                  flex: 1, fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.cream,
                  background: C.orange, border: "none", padding: "14px 20px", borderRadius: 10,
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                Download MP3
              </button>
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
            </div>

            {/* Roast another */}
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <button
                onClick={() => { setResult(null); setQuery(""); setIsPlaying(false); if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } }}
                style={{
                  fontFamily: Bf, fontSize: 14, fontWeight: 600, color: C.orange,
                  background: "none", border: `1px solid ${C.orange}40`, padding: "12px 28px",
                  borderRadius: 8, cursor: "pointer",
                }}
              >
                Roast another fund
              </button>
            </div>

            {/* Cross-sell */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
              <a
                href={`/roast`}
                style={{
                  flex: 1, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: 16, textAlign: "center", textDecoration: "none",
                }}
              >
                <div style={{ fontFamily: Mf, fontSize: 9, color: C.red, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>TEXT ROAST</div>
                <div style={{ fontFamily: Bf, fontSize: 13, color: C.char, fontWeight: 600 }}>Read the English roast</div>
              </a>
              <a
                href={`/fund/${result.schemeCode}`}
                style={{
                  flex: 1, background: C.cream, border: `1px solid ${C.border}`, borderRadius: 12,
                  padding: 16, textAlign: "center", textDecoration: "none",
                }}
              >
                <div style={{ fontFamily: Mf, fontSize: 9, color: C.sage, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>FULL ANALYSIS</div>
                <div style={{ fontFamily: Bf, fontSize: 13, color: C.char, fontWeight: 600 }}>View fund details</div>
              </a>
            </div>
          </div>
        )}

        {/* How it works - shown when no result */}
        {!result && !loading && (
          <div style={{ maxWidth: 640, margin: "40px auto", padding: "0 28px" }}>
            <div style={{ display: "flex", gap: 16, flexDirection: isMobile ? "column" : "row" }}>
              {[
                { step: "1", title: "Pick a fund", desc: "Search any mutual fund from 40,000+ schemes" },
                { step: "2", title: "AI writes the roast", desc: "Gemini generates a savage Hinglish script with real data" },
                { step: "3", title: "Sarvam speaks it", desc: "Converted to natural Hindi voice. Download & send on WhatsApp" },
              ].map((s, i) => (
                <div key={i} style={{
                  flex: 1, background: C.white, border: `1px solid ${C.border}`,
                  borderRadius: 12, padding: 20, textAlign: "center",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", background: C.orange,
                    color: C.cream, fontFamily: Mf, fontSize: 14, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 12px",
                  }}>{s.step}</div>
                  <div style={{ fontFamily: Bf, fontSize: 14, fontWeight: 700, color: C.char, marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontFamily: Bf, fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 28px", textAlign: "center", borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontFamily: Bf, fontSize: 12, color: C.light, lineHeight: 1.6 }}>
            Audio roasts are AI-generated using fund data from mfapi.in and Sarvam AI text-to-speech.
            For entertainment and education only. Boredfolio doesn't sell funds or give investment advice.
          </p>
        </div>
      </div>
    </>
  );
}
