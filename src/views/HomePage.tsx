"use client";

import React, { useState } from "react";
import { cn, formatPercent, BRAND_COLORS } from "@/lib/utils";
import {
  MOCK_INDICES, MOCK_TICKER_MESSAGES, MOCK_CATEGORY_RETURNS,
  MOCK_STAFF_PICKS, MOCK_STAFF_PICK_TAKES, MOCK_NFOS,
  MOCK_NFO_TAKES, MOCK_ARTICLES,
} from "@/lib/mockData";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MobileBottomNav, TickerStrip, PageLayout } from "@/components/layout/PageLayout";

// Domain
import { MarketPulseStrip, MarketMoodBadge } from "@/components/domain/MarketPulseStrip";
import { SchemeCard } from "@/components/domain/SchemeCard";

// UI
import { SearchBar } from "@/components/ui/Input";
import { Badge, NFOVerdictBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SectionHeader, Divider } from "@/components/ui/Navigation";

// Charts
import { HeatmapGrid } from "@/components/charts/HeatmapGrid";
import type { HeatmapCell } from "@/components/charts/HeatmapGrid";

/*
 * HOME PAGE
 * ─────────
 * The first impression. Establish Boredfolio's voice.
 * Not another boring fund aggregator landing page.
 *
 * Sections:
 *   1. Ticker Strip (scrolling truths)
 *   2. Market Pulse Banner
 *   3. Hero Section (search + tagline)
 *   4. "What's Actually Happening" (editorial cards)
 *   5. Category Performance Heatmap
 *   6. Staff Picks (editorial fund selections)
 *   7. NFO Watch
 *   8. Newsletter CTA
 */

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Header */}
      <GlobalHeader currentPath="/" />

      {/* Ticker Strip */}
      <TickerStrip messages={MOCK_TICKER_MESSAGES} speed="normal" />

      {/* Market Pulse */}
      <MarketPulseStrip indices={MOCK_INDICES} />

      {/* ═══ Hero Section ═══ */}
      <section className="bg-cream-100 border-b border-cream-300">
        <div className="section py-16 sm:py-20 text-center">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-ink-900 leading-[1.1] max-w-3xl mx-auto">
            India&rsquo;s most honest
            <br />
            <span className="text-sage-500">mutual fund</span> platform
            <span className="text-mustard-500">.</span>
          </h1>
          <p className="mt-4 text-lg text-ink-500 max-w-xl mx-auto leading-relaxed">
            We strip funds naked so you can invest with your eyes open.
            No commissions. No BS. Just data and uncomfortable honesty.
          </p>

          {/* Hero Search */}
          <div className="mt-8 max-w-lg mx-auto">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search funds, AMCs, categories, stocks..."
              size="lg"
            />
          </div>

          {/* Quick chips */}
          <div className="mt-5 flex items-center justify-center gap-2 flex-wrap">
            <QuickChip label="Trending Funds" emoji="🔥" />
            <QuickChip label="Most Bought ≠ Best" emoji="⚠️" />
            <QuickChip label="NFO Alert" emoji="🆕" />
            <QuickChip label="Market Mood" emoji="🌡️" />
          </div>
        </div>
      </section>

      <PageLayout>
        {/* ═══ What's Actually Happening ═══ */}
        <section className="py-12">
          <SectionHeader
            label="Today's Take"
            title="What's Actually Happening"
            subtitle="Boredfolio's unfiltered take on today's mutual fund news"
            action={
              <a href="/blog" className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                All Articles →
              </a>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {MOCK_ARTICLES.map((article) => (
              <Card
                key={article.id}
                hover
                padding="md"
                as="article"
                onClick={() => {}}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={article.category === "Fund Roast" ? "ugly" : article.category === "Analysis" ? "sage" : "mustard"} size="sm">
                    {article.category}
                  </Badge>
                  <span className="text-2xs text-ink-400">{article.readTime} min read</span>
                </div>
                <h3 className="font-serif text-lg text-ink-900 leading-snug line-clamp-2">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <p className="mt-3 text-xs text-ink-400">
                  {new Date(article.publishDate!).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══ Category Performance Heatmap ═══ */}
        <section className="py-12">
          <SectionHeader
            label="Market Snapshot"
            title="Category Performance"
            subtitle="Who's winning. Who's bleeding. Who's pretending."
          />

          <CategoryHeatmap />
        </section>

        <Divider />

        {/* ═══ Staff Picks ═══ */}
        <section className="py-12">
          <SectionHeader
            label="Editorial"
            title="The Brutally Honest Picks"
            subtitle="Not 'Top Funds' — these are curated selections with reasoning. We'll tell you the ugly parts too."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MOCK_STAFF_PICKS.map((fund) => (
              <SchemeCard
                key={fund.id}
                name={fund.name!}
                shortName={fund.shortName}
                amcName={fund.amcName!}
                category={fund.category!}
                plan={fund.plan!}
                riskLevel={fund.riskLevel}
                return1Y={fund.returns?.["1Y"] ?? null}
                return3Y={fund.returns?.["3Y"] ?? null}
                return5Y={fund.returns?.["5Y"] ?? null}
                ter={fund.ter}
                aum={fund.aum}
                verdict={fund.verdict}
                boredfolioTake={MOCK_STAFF_PICK_TAKES[fund.id!]}
                onClick={() => {}}
              />
            ))}
          </div>
        </section>

        <Divider />

        {/* ═══ NFO Watch ═══ */}
        <section className="py-12">
          <SectionHeader
            label="New Fund Offers"
            title="NFO Watch"
            subtitle="Do you need this, or is it FOMO? We'll tell you."
            action={
              <a href="/nfo" className="text-sm text-sage-600 hover:text-sage-700 font-medium">
                All NFOs →
              </a>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_NFOS.map((nfo) => {
              const nfoTake = MOCK_NFO_TAKES[nfo.id!];
              const daysLeft = Math.ceil(
                (new Date(nfo.closeDate!).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              );

              return (
                <Card key={nfo.id} padding="md" hover>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0">
                      <h3 className="font-serif text-base text-ink-900 leading-snug">
                        {nfo.schemeName}
                      </h3>
                      <p className="text-xs text-ink-400 mt-0.5">{nfo.amcName}</p>
                    </div>
                    {nfoTake && <NFOVerdictBadge verdict={nfoTake.verdict} />}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-ink-500 mb-3">
                    <CategoryBadge category={nfo.category!} />
                    <span>Min ₹{nfo.minInvestment?.toLocaleString("en-IN")}</span>
                    <span className={cn(
                      "font-medium",
                      daysLeft <= 3 ? "text-ugly-500" : "text-ink-500"
                    )}>
                      {daysLeft > 0 ? `${daysLeft} days left` : "Closed"}
                    </span>
                  </div>

                  {nfoTake && (
                    <p className="text-xs text-ink-500 italic leading-relaxed border-t border-cream-200 pt-3">
                      {nfoTake.take}
                    </p>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        <Divider />

        {/* ═══ Newsletter CTA ═══ */}
        <section className="py-16">
          <div className="bg-ink-900 rounded-lg p-8 sm:p-12 text-center">
            <h2 className="font-serif text-2xl sm:text-3xl text-white leading-tight">
              Get the unfiltered truth<span className="text-mustard-400">.</span>
              <br />Weekly.
            </h2>
            <p className="mt-3 text-sm text-white/50 max-w-md mx-auto">
              No spam. No affiliate links. Just uncomfortable honesty about your money.
              Join 12,000+ investors who prefer truth over marketing.
            </p>
            <div className="mt-6 flex gap-2 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="the one you check, not the spam one"
                className="flex-1 h-10 px-4 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sage-400 focus:ring-1 focus:ring-sage-400 transition-colors"
              />
              <Button variant="accent" size="md">
                Get Roasts Weekly
              </Button>
            </div>
          </div>
        </section>
      </PageLayout>

      {/* Footer */}
      <GlobalFooter />

      {/* Mobile Nav */}
      <MobileBottomNav currentPath="/" />
    </div>
  );
}

/* ── Quick Chip Button ── */
function QuickChip({ label, emoji }: { label: string; emoji: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-cream-50 border border-cream-300 text-xs font-medium text-ink-600 hover:bg-cream-200 hover:border-cream-400 transition-colors">
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

/* ── Category Heatmap (built from mock data) ── */
function CategoryHeatmap() {
  const periods = ["1M", "3M", "6M", "1Y", "3Y", "5Y"];
  const categories = MOCK_CATEGORY_RETURNS.map((r) => r.category);

  const cells: HeatmapCell[] = [];
  MOCK_CATEGORY_RETURNS.forEach((row) => {
    periods.forEach((period) => {
      cells.push({
        row: row.category,
        col: period,
        value: row[period as keyof typeof row] as number,
      });
    });
  });

  return (
    <HeatmapGrid
      data={cells}
      rows={categories}
      cols={periods}
      colorScale="diverging"
      midpoint={0}
      formatValue={(v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`}
    />
  );
}
