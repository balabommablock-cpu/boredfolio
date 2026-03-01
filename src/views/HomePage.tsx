"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  TICKER_MESSAGES, HOMEPAGE_STATS, DICTIONARY_TERMS,
  FUND_AUTOPSIES, COLLECTIONS, BLOG_ARTICLES,
} from "@/lib/editorialData";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MobileBottomNav, TickerStrip } from "@/components/layout/PageLayout";

// UI
import { Badge } from "@/components/ui/Badge";

/*
 * HOME PAGE
 * ─────────
 * The first impression. Not another boring fund aggregator.
 * "Wendy's Twitter meets expense ratios."
 *
 * Sections:
 *   1. Ticker Strip (30 snarky truths, shuffled on load)
 *   2. Hero (dramatic headline + typewriter search — NO label above)
 *   3. Stats Strip (charcoal — the uncomfortable numbers)
 *   4. The Dictionary (accordion preview, correct term count)
 *   5. Fund Autopsies (dark — with nicknames + View All button)
 *   6. Curated Collections (max 80-char descriptions)
 *   7. Blog (featured + sidebar, no stale dates)
 *   8. Newsletter (wired with validation + success state)
 */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/" />

      {/* Phase 2: Text ticker ONLY — market data ticker removed */}
      <TickerStrip messages={TICKER_MESSAGES} />

      {/* ═══ HERO ═══ */}
      <HeroSection />

      {/* ═══ STATS STRIP ═══ */}
      <StatsStrip />

      {/* ═══ DICTIONARY PREVIEW ═══ */}
      <DictionaryPreview />

      {/* ═══ FUND AUTOPSIES ═══ */}
      <FundAutopsiesSection />

      {/* ═══ CURATED COLLECTIONS ═══ */}
      <CollectionsSection />

      {/* ═══ BLOG ═══ */}
      <BlogSection />

      {/* ═══ NEWSLETTER ═══ */}
      <NewsletterStrip />

      <GlobalFooter />
      <MobileBottomNav currentPath="/" />
    </div>
  );
}


/* ═══════════════════════════════════════════
   HERO SECTION — Phase 3
   No label above h1. Typewriter in search bar.
   Full paragraph always visible. Mobile responsive.
   ═══════════════════════════════════════════ */
function HeroSection() {
  const [typed, setTyped] = useState("");
  const query = "Where\u2019s my money actually going?";
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Small delay so it feels intentional, not broken
    const delay = setTimeout(() => setStarted(true), 600);
    return () => clearTimeout(delay);
  }, []);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i <= query.length) {
        setTyped(query.slice(0, i));
        i++;
      } else {
        clearInterval(iv);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [started, query]);

  return (
    <section className="bg-cream-100 relative overflow-hidden py-14 sm:py-24 lg:py-28 px-5 sm:px-12">
      {/* ₹ Watermark */}
      <div
        className="absolute top-2 sm:top-3 right-2 sm:right-12 font-serif text-[120px] sm:text-[240px] leading-none select-none pointer-events-none text-cream-300 opacity-30"
        aria-hidden="true"
      >
        ₹
      </div>

      <div className="max-w-[720px] mx-auto relative z-10">
        {/* Phase 3.1: "Financial Advice You Didn't Ask For" label REMOVED.
            The ticker already establishes tone. The label was redundant. */}

        {/* Dramatic headline — 28px on mobile (Phase 3.4) */}
        <h1 className="font-serif text-[28px] sm:text-5xl lg:text-[72px] leading-[1.15] sm:leading-[1.05] text-ink-900 font-bold -tracking-[0.5px] mb-8">
          Your mutual fund
          <br />
          has a{" "}
          <span className="inline-block bg-ink-900 text-cream-100 px-2 pb-0.5 rounded-sm -rotate-[1.5deg]">
            secret
          </span>
          .
          <br />
          <span className="text-sage-500">We&rsquo;ll tell you.</span>
        </h1>

        {/* Phase 3.2: Body paragraph — always fully rendered, never typewritten */}
        <p className="font-sans text-base sm:text-lg text-ink-500 max-w-[520px] mb-6 sm:mb-10 leading-relaxed">
          Every fund in India, stripped naked. Every term, translated to human.
          Every fee they hope you&rsquo;ll never notice.
        </p>

        {/* Typewriter search bar */}
        <div className="bg-white rounded-lg p-1 flex max-w-[480px] shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-cream-300">
          <div className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 font-sans text-sm sm:text-[15px] text-ink-300 min-h-[44px] flex items-center">
            {typed || <span className="opacity-0">|</span>}
            {typed && <span className="animate-pulse ml-px">|</span>}
          </div>
          <a
            href="/explore"
            className="shrink-0 bg-ink-900 text-white font-sans text-[13px] font-semibold px-4 sm:px-6 rounded-md hover:bg-ink-800 transition-colors flex items-center min-h-[44px] w-full sm:w-auto justify-center mt-1 sm:mt-0"
          >
            Find Out →
          </a>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   STATS STRIP — Phase 4
   Numbers 56px / 40px mobile. Rewritten descriptions.
   Mobile single column with dividers.
   ═══════════════════════════════════════════ */
function StatsStrip() {
  const descriptions = [
    "You own 5. Can you name what they hold?",
    "Your money. Leaving without saying goodbye.",
    "Paying a human to lose to a spreadsheet.",
  ];

  return (
    <section className="bg-ink-900 py-9 sm:py-14 px-5 sm:px-12">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-12">
        {HOMEPAGE_STATS.map((stat, i) => (
          <div
            key={i}
            className={cn(
              "text-center py-6 sm:py-0",
              i < HOMEPAGE_STATS.length - 1 && "border-b border-white/10 sm:border-b-0"
            )}
          >
            {/* 56px desktop, 40px mobile */}
            <div className="font-serif text-[40px] sm:text-[56px] text-mustard-400 font-bold -tracking-[1px] leading-none">
              {stat.number}
            </div>
            <div className="font-sans text-[10px] text-white font-bold uppercase tracking-[2.5px] mt-2 mb-1.5">
              {stat.label}
            </div>
            <div className="font-sans text-[13px] text-white/50 italic">
              {descriptions[i]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   DICTIONARY PREVIEW — Phase 5
   Correct term count (12). Link to /explore.
   Accordion: single open, + rotates to ×.
   Mobile tap targets 48px.
   ═══════════════════════════════════════════ */
function DictionaryPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const terms = DICTIONARY_TERMS.slice(0, 4);
  const totalTerms = DICTIONARY_TERMS.length;

  const groupColor = (g: string) =>
    g === "TRAPS" ? "ugly" : g === "METRICS" ? "mustard" : "sage";

  return (
    <section className="bg-cream-50 py-12 sm:py-20 px-5 sm:px-12">
      <div className="max-w-[860px] mx-auto">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8 sm:mb-12">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[4px] text-mustard-500 font-semibold mb-4">
              The Dictionary
            </div>
            <h2 className="font-serif text-3xl sm:text-[44px] text-ink-900 font-bold leading-[1.18] -tracking-[0.5px]">
              {totalTerms} terms. Zero jargon.
              <br />
              <span className="text-sage-500">Maximum discomfort.</span>
            </h2>
          </div>
          {/* Phase 5.3: Link to /explore renamed */}
          <a
            href="/explore"
            className="font-sans text-[13px] text-sage-500 font-semibold border-b-[1.5px] border-sage-500 pb-0.5 shrink-0 hover:text-sage-600 transition-colors"
          >
            Explore All Funds →
          </a>
        </div>

        {/* Term accordion — one open at a time, + rotates to × */}
        {terms.map((t, i) => (
          <div
            key={i}
            className={cn(
              "cursor-pointer",
              i === 0 ? "border-t-2 border-ink-900" : "border-t border-cream-300"
            )}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            {/* Phase 5.4: 48px min height tap target on mobile */}
            <div className="py-4 sm:py-6 min-h-[48px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3.5 flex-wrap">
                  <Badge variant={groupColor(t.group) as any} size="sm">{t.group}</Badge>
                  <span className="font-serif text-lg sm:text-[22px] text-ink-900 font-semibold">
                    {t.term}
                  </span>
                </div>
                {/* Phase 5.2: + rotates to × with 200ms transition */}
                <span
                  className={cn(
                    "font-sans text-xl text-sage-500 shrink-0 ml-3 transition-transform duration-200 w-12 h-12 flex items-center justify-center",
                    openIndex === i && "rotate-45"
                  )}
                >
                  +
                </span>
              </div>

              {/* One-liner always visible */}
              <div className="font-sans text-[13px] sm:text-sm text-mustard-500 italic mt-1.5 sm:pl-[90px] font-medium">
                &ldquo;{t.oneLiner}&rdquo;
              </div>

              {/* Expanded explanation */}
              {openIndex === i && (
                <div className="mt-3.5 sm:pl-[90px] font-sans text-[13.5px] sm:text-[14.5px] text-ink-700 leading-[1.9] max-w-[580px] animate-fade-in">
                  {t.fullExplanation}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   FUND AUTOPSIES — Phase 6
   "View All 1,547 Schemes →" button below cards.
   Header link removed (button replaces it).
   Mobile single column.
   ═══════════════════════════════════════════ */
function FundAutopsiesSection() {
  const signalEmoji = (s: string) =>
    s === "green" ? "🟢" : s === "red" ? "🔴" : "🟡";

  return (
    <section className="bg-ink-900 py-12 sm:py-20 px-5 sm:px-12">
      <div className="max-w-[1060px] mx-auto">
        {/* Header — link REMOVED, replaced by button below cards */}
        <div className="mb-8 sm:mb-12">
          <div className="font-sans text-[11px] uppercase tracking-[4px] text-mustard-400 font-semibold mb-4">
            Fund Autopsies
          </div>
          <h2 className="font-serif text-3xl sm:text-[44px] text-white font-bold leading-[1.18] -tracking-[0.5px]">
            Every fund. Stripped naked.
            <br />
            <span className="text-sage-400">Nothing to hide behind.</span>
          </h2>
        </div>

        {/* Fund cards grid — single column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FUND_AUTOPSIES.slice(0, 4).map((f, i) => (
            <a
              key={i}
              href={`/fund/${f.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="block bg-[#222] p-5 sm:p-7 rounded-lg border border-[#333] hover:border-sage-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] group min-h-[180px]"
            >
              <div className="flex justify-between mb-3.5">
                <Badge variant="sage" size="sm">{f.category}</Badge>
                <span className="text-sm">{signalEmoji(f.signal)}</span>
              </div>
              <h3 className="font-serif text-lg sm:text-[22px] text-white font-semibold mb-1">
                {f.name}
              </h3>
              <div className="font-sans text-xs text-mustard-400 italic font-medium mb-3">
                a.k.a. &ldquo;{f.nickname}&rdquo;
              </div>
              <p className="font-sans text-[13px] text-white/60 leading-relaxed">
                {f.oneLiner}
              </p>
              <div className="mt-4 font-sans text-xs text-mustard-400 font-semibold group-hover:text-mustard-300 transition-colors">
                Read the autopsy →
              </div>
            </a>
          ))}
        </div>

        {/* Phase 6.1: Full-width View All button below cards */}
        <a
          href="/explore"
          className="mt-8 block w-full text-center py-4 border border-mustard-400 text-mustard-400 font-sans text-base font-semibold rounded hover:bg-mustard-400 hover:text-ink-900 transition-colors duration-200"
        >
          View All 1,547 Schemes →
        </a>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   CURATED COLLECTIONS — Phase 7
   Descriptions max 80 chars (updated in editorialData).
   Mobile single column.
   ═══════════════════════════════════════════ */
function CollectionsSection() {
  const tagBadgeColor = (tag: string) => {
    const danger = ["EXPOSÉ", "WARNING", "HIGH RISK", "TRAPS", "REALITY CHECK"];
    const positive = ["EDITOR\u2019S PICK"];
    if (danger.includes(tag)) return "ugly" as const;
    if (positive.includes(tag)) return "sage" as const;
    return "mustard" as const;
  };

  return (
    <section className="bg-cream-50 py-12 sm:py-20 px-5 sm:px-12">
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8 sm:mb-12">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[4px] text-ugly-500 font-semibold mb-4">
              Curated Collections
            </div>
            <h2 className="font-serif text-3xl sm:text-[44px] text-ink-900 font-bold leading-[1.18] -tracking-[0.5px]">
              Not categories.
              <br />
              <span className="text-sage-500">Opinions.</span>
            </h2>
          </div>
          <a
            href="/explore"
            className="font-sans text-[13px] text-ugly-500 font-semibold border-b-[1.5px] border-ugly-500 pb-0.5 shrink-0 hover:text-ugly-600 transition-colors"
          >
            All {COLLECTIONS.length} collections →
          </a>
        </div>

        {/* Collection cards — single column on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {COLLECTIONS.slice(0, 3).map((c, i) => (
            <div
              key={c.id}
              className={cn(
                "rounded-lg p-5 sm:p-7 cursor-pointer transition-all duration-300 hover:-translate-y-1",
                i === 0
                  ? "bg-ink-900 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]"
                  : "bg-white border border-cream-300 hover:border-sage-400 hover:shadow-card-hover"
              )}
            >
              {/* Big number */}
              <div
                className={cn(
                  "font-serif text-[40px] sm:text-[56px] font-bold leading-none mb-3 -tracking-[2px]",
                  i === 0 ? "text-white/15" : "text-cream-300"
                )}
              >
                {c.number}
              </div>

              <Badge variant={tagBadgeColor(c.tag)} size="sm">{c.tag}</Badge>

              <h4
                className={cn(
                  "font-serif text-base sm:text-[19px] font-bold leading-[1.25] mt-2.5 mb-2",
                  i === 0 ? "text-white" : "text-ink-900"
                )}
              >
                {c.name}
              </h4>
              {/* Phase 7.1: descriptions now max 80 chars — no truncation needed */}
              <p
                className={cn(
                  "font-sans text-[12.5px] leading-relaxed",
                  i === 0 ? "text-white/50" : "text-ink-500"
                )}
              >
                {c.description}
              </p>
              <div
                className={cn(
                  "mt-3.5 font-sans text-[11px] font-semibold",
                  i === 0 ? "text-mustard-400" : "text-sage-500"
                )}
              >
                {c.count} funds →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   BLOG — Phase 9
   No stale dates shown. Featured + sidebar layout.
   Mobile: all cards stack vertically.
   ═══════════════════════════════════════════ */
function BlogSection() {
  const featured = BLOG_ARTICLES.find((a) => a.featured);
  const rest = BLOG_ARTICLES.filter((a) => !a.featured).slice(0, 3);

  const tagColor = (tag: string) => {
    if (tag === "EXPOSÉ" || tag === "INVESTIGATION") return "ugly" as const;
    return "mustard" as const;
  };

  return (
    <section className="bg-cream-100 py-12 sm:py-20 px-5 sm:px-12">
      <div className="max-w-[900px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8 sm:mb-12">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[4px] text-ugly-500 font-semibold mb-4">
              The Uncomfortable Truth
            </div>
            <h2 className="font-serif text-3xl sm:text-[44px] text-ink-900 font-bold leading-[1.18] -tracking-[0.5px]">
              Articles that fund houses
              <br />
              <span className="text-ugly-500">wish we&rsquo;d stop writing.</span>
            </h2>
          </div>
          <a
            href="/blog"
            className="font-sans text-[13px] text-ugly-500 font-semibold border-b-[1.5px] border-ugly-500 pb-0.5 shrink-0 hover:text-ugly-600 transition-colors"
          >
            All articles →
          </a>
        </div>

        {/* Featured + sidebar grid — stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-[1.2fr_1fr] gap-3.5 sm:gap-7">
          {/* Featured card (charcoal) */}
          {featured && (
            <div className="bg-ink-900 p-6 sm:p-10 rounded-lg cursor-pointer group">
              <Badge variant="mustard" size="sm">★ {featured.tag}</Badge>
              <h3 className="font-serif text-xl sm:text-[28px] text-white font-bold leading-[1.25] mt-4 mb-4">
                {featured.title}
              </h3>
              <p className="font-sans text-[13px] sm:text-sm text-white/50 leading-[1.75] mb-5">
                {featured.description}
              </p>
              {/* Phase 9.1: No date shown */}
              <span className="font-sans text-[13px] text-mustard-400 font-semibold group-hover:text-mustard-300 transition-colors">
                {featured.readTime} read →
              </span>
            </div>
          )}

          {/* Sidebar articles — no dates */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            {rest.map((a, i) => (
              <div
                key={i}
                className="bg-white border border-cream-300 rounded-lg p-4 sm:p-5 cursor-pointer hover:border-sage-400 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300"
              >
                <Badge variant={tagColor(a.tag)} size="sm">{a.tag}</Badge>
                <h4 className="font-serif text-base sm:text-lg text-ink-900 font-semibold leading-[1.3] mt-2 mb-1.5">
                  {a.title}
                </h4>
                <span className="font-sans text-xs text-ink-400">
                  {a.readTime} read
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   NEWSLETTER STRIP — Phase 10
   Wired to Buttondown. HTML5 validation.
   Success and error states with brand copy.
   Mobile: stacked column, 100% width inputs.
   ═══════════════════════════════════════════ */
function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");

    try {
      // Buttondown embed subscription
      const formData = new FormData();
      formData.append("email", email);
      const res = await fetch(
        "https://buttondown.com/api/emails/embed-subscribe/boredfolio",
        { method: "POST", body: formData }
      );
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-mustard-400 py-8 sm:py-11 px-5 sm:px-12">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row justify-center items-center gap-5 sm:gap-10">
        <div className="text-center sm:text-left max-w-[400px]">
          <h3 className="font-serif text-xl sm:text-[25px] text-ink-900 font-bold">
            Financial Advice You Didn&rsquo;t Ask For.
          </h3>
          <p className="font-sans text-[12.5px] text-black/45 mt-1.5">
            One fund truth, every Tuesday.
          </p>
        </div>

        {status === "success" ? (
          <div className="bg-ink-900 text-white font-sans text-sm font-semibold px-6 py-4 rounded-md text-center">
            You&rsquo;re in. First uncomfortable truth arrives Tuesday. ✓
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="your@email.com"
              required
              className={cn(
                "w-full sm:w-[210px] px-4 py-3 border-2 bg-white/30 font-sans text-sm rounded-md outline-none placeholder:text-black/35 transition-colors min-h-[48px]",
                status === "error"
                  ? "border-red-400 bg-red-50/20"
                  : "border-black/8 focus:border-ink-900/20"
              )}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="bg-ink-900 text-white font-sans text-[13.5px] font-semibold px-5 sm:px-7 py-3 rounded-md hover:bg-ink-800 transition-colors shrink-0 min-h-[48px] disabled:opacity-70"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="font-sans text-xs text-ink-800 italic -mt-3 sm:hidden">
            That email looks broken. Like most large-cap funds.
          </p>
        )}
      </div>
      {status === "error" && (
        <p className="font-sans text-xs text-ink-800 italic text-center mt-3 hidden sm:block">
          That email looks broken. Like most large-cap funds.
        </p>
      )}
    </section>
  );
}
