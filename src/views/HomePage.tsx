"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  TICKER_MESSAGES, HOMEPAGE_STATS, DICTIONARY_TERMS,
  FUND_AUTOPSIES, COLLECTIONS, BLOG_ARTICLES,
  signalColor,
} from "@/lib/editorialData";
import { MOCK_INDICES } from "@/lib/mockData";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MobileBottomNav, TickerStrip } from "@/components/layout/PageLayout";

// Domain
import { MarketPulseStrip } from "@/components/domain/MarketPulseStrip";

// UI
import { Badge } from "@/components/ui/Badge";

/*
 * HOME PAGE
 * ─────────
 * The first impression. Not another boring fund aggregator.
 * "Wendy's Twitter meets expense ratios."
 *
 * Sections:
 *   1. Ticker Strip (scrolling truths)
 *   2. Market Pulse Banner
 *   3. Hero (dramatic headline + typewriter search)
 *   4. Stats Strip (charcoal — the uncomfortable numbers)
 *   5. The Dictionary (accordion preview)
 *   6. Fund Autopsies (dark — with nicknames)
 *   7. Curated Collections
 *   8. Free Tool CTA (sage banner)
 *   9. Blog (featured + sidebar)
 *  10. Newsletter (mustard strip)
 */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/" />
      <TickerStrip messages={TICKER_MESSAGES} speed="normal" />
      <MarketPulseStrip indices={MOCK_INDICES} />

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

      {/* ═══ FREE TOOL CTA ═══ */}
      <ToolCTABanner />

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
   HERO SECTION — The first thing anyone sees
   ═══════════════════════════════════════════ */
function HeroSection() {
  const [typed, setTyped] = useState("");
  const query = "Where\u2019s my money actually going?";

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i <= query.length) {
        setTyped(query.slice(0, i));
        i++;
      } else {
        clearInterval(iv);
      }
    }, 55);
    return () => clearInterval(iv);
  }, []);

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
        {/* Section label */}
        <div className="font-sans text-[11px] uppercase tracking-[4px] text-sage-500 font-semibold mb-4">
          Financial Advice You Didn&rsquo;t Ask For
        </div>

        {/* Dramatic headline */}
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[72px] leading-[1.05] text-ink-900 font-bold -tracking-[0.5px] mb-6">
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

        {/* Body text */}
        <p className="font-sans text-base sm:text-lg text-ink-500 max-w-[520px] mb-7 sm:mb-10 leading-relaxed">
          Every fund in India, stripped naked. Every term, translated to human.
          Every fee they hope you&rsquo;ll never notice.
        </p>

        {/* Typewriter search bar */}
        <div className="bg-white rounded-lg p-1 flex max-w-[480px] shadow-[0_2px_24px_rgba(0,0,0,0.04)] border border-cream-300">
          <div className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 font-sans text-sm sm:text-[15px] text-ink-300">
            {typed}
            <span className="animate-pulse">|</span>
          </div>
          <a
            href="/explore"
            className="shrink-0 bg-ink-900 text-white font-sans text-[13px] font-semibold px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-md hover:bg-ink-800 transition-colors"
          >
            Find Out →
          </a>
        </div>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   STATS STRIP — The uncomfortable numbers
   ═══════════════════════════════════════════ */
function StatsStrip() {
  return (
    <section className="bg-ink-900 py-9 sm:py-14 px-5 sm:px-12">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-12">
        {HOMEPAGE_STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="font-serif text-4xl sm:text-[52px] text-mustard-400 font-bold -tracking-[1px]">
              {stat.number}
            </div>
            <div className="font-sans text-[10px] text-white font-bold uppercase tracking-[2.5px] mt-1 mb-1.5">
              {stat.label}
            </div>
            <div className="font-sans text-xs text-white/40 italic">
              {stat.snark}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   DICTIONARY PREVIEW — 40 terms, zero jargon
   ═══════════════════════════════════════════ */
function DictionaryPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const terms = DICTIONARY_TERMS.slice(0, 4);

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
              40 terms. Zero jargon.
              <br />
              <span className="text-sage-500">Maximum discomfort.</span>
            </h2>
          </div>
          <a
            href="/explore"
            className="font-sans text-[13px] text-sage-500 font-semibold border-b-[1.5px] border-sage-500 pb-0.5 shrink-0 hover:text-sage-600 transition-colors"
          >
            All {DICTIONARY_TERMS.length} terms →
          </a>
        </div>

        {/* Term accordion */}
        {terms.map((t, i) => (
          <div
            key={i}
            className={cn(
              "cursor-pointer",
              i === 0 ? "border-t-2 border-ink-900" : "border-t border-cream-300"
            )}
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
          >
            <div className="py-5 sm:py-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 sm:gap-3.5 flex-wrap">
                  <Badge variant={groupColor(t.group)} size="sm">{t.group}</Badge>
                  <span className="font-serif text-lg sm:text-[22px] text-ink-900 font-semibold">
                    {t.term}
                  </span>
                </div>
                <span
                  className={cn(
                    "font-sans text-xl text-sage-500 shrink-0 ml-3 transition-transform duration-300",
                    openIndex === i && "rotate-45"
                  )}
                >
                  +
                </span>
              </div>

              {/* One-liner */}
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
   FUND AUTOPSIES — With the nicknames
   ═══════════════════════════════════════════ */
function FundAutopsiesSection() {
  const signalEmoji = (s: string) =>
    s === "green" ? "\ud83d\udfe2" : s === "red" ? "\ud83d\udd34" : "\ud83d\udfe1";

  return (
    <section className="bg-ink-900 py-12 sm:py-20 px-5 sm:px-12">
      <div className="max-w-[1060px] mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-3 mb-8 sm:mb-12">
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[4px] text-mustard-400 font-semibold mb-4">
              Fund Autopsies
            </div>
            <h2 className="font-serif text-3xl sm:text-[44px] text-white font-bold leading-[1.18] -tracking-[0.5px]">
              Every fund. Stripped naked.
              <br />
              <span className="text-sage-400">Nothing to hide behind.</span>
            </h2>
          </div>
          <a
            href="/explore"
            className="font-sans text-[13px] text-mustard-400 font-semibold border-b-[1.5px] border-mustard-400 pb-0.5 shrink-0 hover:text-mustard-300 transition-colors"
          >
            All 1,547 autopsies →
          </a>
        </div>

        {/* Fund cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {FUND_AUTOPSIES.slice(0, 4).map((f, i) => (
            <a
              key={i}
              href={`/fund/${f.name.toLowerCase().replace(/\s+/g, "-")}`}
              className="block bg-[#222] p-5 sm:p-7 rounded-lg border border-[#333] hover:border-sage-500/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] group"
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
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   CURATED COLLECTIONS — Not categories. Opinions.
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

        {/* Collection cards */}
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
              <p
                className={cn(
                  "font-sans text-[12.5px] leading-relaxed",
                  i === 0 ? "text-white/50" : "text-ink-500"
                )}
              >
                {c.description.length > 90
                  ? c.description.slice(0, 90) + "..."
                  : c.description}
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
   FREE TOOL CTA — Commission Calculator tease
   ═══════════════════════════════════════════ */
function ToolCTABanner() {
  return (
    <section className="bg-sage-500 py-10 sm:py-16 px-5 sm:px-12 text-center">
      <div className="max-w-[500px] mx-auto">
        <div className="font-sans text-[11px] uppercase tracking-[4px] text-white/45 font-semibold mb-4">
          Free Tool
        </div>
        <h2 className="font-serif text-2xl sm:text-[36px] text-white font-bold leading-[1.18] -tracking-[0.5px] mb-6">
          How much is your distributor making off <em className="not-italic">your</em> money?
        </h2>
        <a
          href="/tools/sip-calculator"
          className="inline-block bg-ink-900 text-white font-sans text-[13.5px] font-semibold px-7 py-3.5 rounded-md hover:bg-ink-800 transition-colors"
        >
          Open Commission Calculator →
        </a>
      </div>
    </section>
  );
}


/* ═══════════════════════════════════════════
   BLOG — Featured + sidebar layout
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

        {/* Featured + sidebar grid */}
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
              <span className="font-sans text-[13px] text-mustard-400 font-semibold group-hover:text-mustard-300 transition-colors">
                {featured.readTime} read →
              </span>
            </div>
          )}

          {/* Sidebar articles */}
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
   NEWSLETTER STRIP — Mustard, punchy
   ═══════════════════════════════════════════ */
function NewsletterStrip() {
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
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="your@email.com"
            className="w-[180px] sm:w-[210px] px-4 py-3 border-2 border-black/8 bg-white/30 font-sans text-sm rounded-md outline-none placeholder:text-black/35 focus:border-ink-900/20 transition-colors"
          />
          <a
            href="#"
            className="bg-ink-900 text-white font-sans text-[13.5px] font-semibold px-5 sm:px-7 py-3 rounded-md hover:bg-ink-800 transition-colors shrink-0"
          >
            Subscribe
          </a>
        </div>
      </div>
    </section>
  );
}
