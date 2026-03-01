"use client";

import React, { useMemo } from "react";
import { cn, formatNAV, formatAUM, formatDate } from "@/lib/utils";
import { getFundData, getFundPeers, getFundYearReturns } from "@/lib/fundMockData";
import { FUND_NICKNAMES, TICKER_MESSAGES } from "@/lib/editorialData";
import { generateNAVData } from "@/lib/mockData";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { MobileBottomNav, TickerStrip } from "@/components/layout/PageLayout";

// UI
import { Badge, VerdictBadge, PlanBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, MetricRow } from "@/components/ui/Card";

// Charts
import { NAVChart } from "@/components/charts/NAVChart";

// Domain
import { RiskOMeter } from "@/components/domain/RiskOMeter";

/*
 * SCHEME DETAIL PAGE — Single-scroll layout (Phase 13)
 * ──────────────────────────────────────────────────────
 * No tabs. One continuous page. All content visible.
 * Sections in order:
 *  1. Breadcrumb + Fund Header (name, nickname, badges, one-line truth)
 *  2. Key Stats (2×2 on mobile, 4-across desktop)
 *  3. NAV Chart
 *  4. Returns Table (horizontal scroll on mobile)
 *  5. Key Facts + Fund Managers (side-by-side → stacked)
 *  6. Boredfolio's Verdict (Good / Ugly / Verdict box / Commission Gap)
 *  7. Similar Funds
 *  8. View All Schemes button
 */

export default function SchemeDetailPage({ slug = "ppfas-flexi-cap" }: { slug?: string }) {
  const scheme = useMemo(() => getFundData(slug), [slug]);
  const peers  = useMemo(() => getFundPeers(slug), [slug]);
  const navData = useMemo(
    () => generateNAVData(365 * 3, scheme.nav?.current ?? 45),
    [scheme.nav?.current]
  );

  const nick = FUND_NICKNAMES[slug];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/fund" />

      {/* Phase 2.5 / 13: Ticker on scheme page too */}
      <TickerStrip messages={TICKER_MESSAGES} />

      <div className="max-w-[1100px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">

        {/* ══════════════════════════════════════════
            BREADCRUMB + FUND HEADER (Phase 12.2, 14.1-14.2)
            ══════════════════════════════════════════ */}
        <div>
          {/* Phase 12.8: Breadcrumb — truncate on mobile */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <nav className="font-sans text-xs text-ink-400 flex items-center gap-1.5 overflow-hidden">
              <a href="/" className="hover:text-ink-700 transition-colors shrink-0">Home</a>
              <span className="shrink-0">/</span>
              <a href="/explore" className="hover:text-ink-700 transition-colors shrink-0 hidden sm:inline">Explore</a>
              <span className="shrink-0 hidden sm:inline">/</span>
              <span className="text-ink-700 truncate">{scheme.shortName || scheme.name}</span>
            </nav>
            <a
              href="/explore"
              className="font-sans text-[11px] font-semibold text-sage-500 border border-sage-500 px-2.5 py-1 rounded hover:bg-sage-500 hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              All Schemes →
            </a>
          </div>

          {/* Fund name + actions — Phase 12.2 */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Phase 12.2: 24px on mobile */}
              <h1 className="font-serif text-[24px] sm:text-[32px] lg:text-[40px] text-ink-900 font-bold leading-[1.15] -tracking-[0.5px]">
                {scheme.name}
              </h1>
              {/* Phase 14.1: nickname below h1 */}
              {nick && (
                <p className="font-sans text-sm sm:text-base text-mustard-500 italic font-medium mt-1.5">
                  a.k.a. &ldquo;{nick.nickname}&rdquo;
                </p>
              )}
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                <CategoryBadge category={scheme.category!} />
                <PlanBadge plan={scheme.plan!} />
                {/* Phase 14.3: Verdict badge — tooltip hint */}
                <span title="Boredfolio rates funds on: rolling return consistency, expense ratio vs category, and benchmark outperformance. This is an opinion, not advice.">
                  <VerdictBadge verdict={scheme.verdict?.rating!} />
                </span>
              </div>
            </div>

            {/* Action buttons — Phase 12.2 + 14.10 */}
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Phase 14.10: Disabled "Stalk" button until auth */}
              <button
                disabled
                className="font-sans text-sm font-semibold px-4 py-2.5 rounded border border-cream-400 text-ink-300 cursor-not-allowed pointer-events-none opacity-50 min-h-[44px] text-center"
              >
                Stalk This Fund
                <span className="block text-[10px] font-normal opacity-70">(Coming Soon)</span>
              </button>
              <a
                href="/compare"
                className="font-sans text-sm font-semibold px-4 py-2.5 rounded bg-ink-900 text-white hover:bg-ink-800 transition-colors text-center min-h-[44px] flex items-center justify-center"
              >
                Pit Against Others →
              </a>
            </div>
          </div>

          {/* Phase 14.2: One-Line Truth box */}
          {nick && (
            <div className="bg-ink-900 rounded-lg p-4 sm:p-6 mt-5">
              <div className="font-sans text-[10px] uppercase tracking-[3px] text-mustard-400 font-bold mb-2">
                The One-Line Truth
              </div>
              <div className="font-serif text-base sm:text-lg text-white italic leading-relaxed font-normal">
                &ldquo;{nick.oneLinerTruth}&rdquo;
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════
            KEY STATS — Phase 12.3: 2×2 on mobile
            ══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatBox
            label="NAV"
            value={`₹${formatNAV(scheme.nav?.current!)}`}
            sub={`${scheme.nav?.dayChangePercent! >= 0 ? "+" : ""}${scheme.nav?.dayChangePercent!.toFixed(2)}% today`}
            subColor={scheme.nav?.dayChangePercent! >= 0 ? "text-good-500" : "text-ugly-500"}
          />
          <StatBox
            label="AUM"
            value={formatAUM(scheme.aum!)}
            sub="Total assets"
          />
          <StatBox
            label="3Y CAGR"
            value={`${scheme.returns?.["3Y"]! >= 0 ? "+" : ""}${scheme.returns?.["3Y"]!.toFixed(1)}%`}
            valueColor={scheme.returns?.["3Y"]! >= 0 ? "text-good-500" : "text-ugly-500"}
          />
          <StatBox
            label="Expense Ratio"
            value={`${scheme.ter!.toFixed(2)}%`}
            sub="Direct plan"
          />
        </div>

        {/* ══════════════════════════════════════════
            NAV CHART — Phase 12.4: responsive
            ══════════════════════════════════════════ */}
        <div className="bg-white border border-cream-300 rounded-lg p-5 sm:p-7">
          <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">Performance</div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-900 font-bold mb-5">NAV History</h2>
          {/* Phase 12.4: width 100%, overflow hidden */}
          <div className="w-full overflow-hidden">
            <NAVChart
              data={navData}
              schemeName={scheme.shortName}
              benchmarkName={scheme.benchmark}
            />
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RETURNS TABLE — Phase 12.5: horizontal scroll
            Phase 14.5: "P 90" → "Top 10%"
            ══════════════════════════════════════════ */}
        <div className="bg-white border border-cream-300 rounded-lg p-5 sm:p-7">
          <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">Returns</div>
          <h2 className="font-serif text-xl sm:text-2xl text-ink-900 font-bold mb-5">Performance Across Periods</h2>

          {/* Horizontal scroll container */}
          <div className="overflow-x-auto -mx-5 sm:-mx-7 px-5 sm:px-7">
            <div className="min-w-[540px]">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-ink-900">
                    {["Period", "This Fund", "Benchmark", "Category Avg", "Rank"].map((h, i) => (
                      <th
                        key={h}
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-[2px] text-ink-400 pb-3",
                          i === 0 ? "text-left" : "text-right"
                        )}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {scheme.returnsTable!.map((row) => {
                    // Phase 14.5: convert percentile to human label
                    // row.rank is the percentile (e.g. 90 = "Top 10%")
                    const topPct = (row.rank != null && row.rank > 0) ? (100 - row.rank) : null;
                    const rankColor =
                      topPct == null ? "" :
                      topPct <= 25 ? "text-good-500" :
                      topPct <= 50 ? "text-mustard-500" : "text-ugly-500";

                    const fundVal = row.fund ?? null;
                    const benchVal = row.benchmark ?? null;
                    const catVal = row.categoryAvg ?? null;

                    return (
                      <tr key={row.period} className="border-b border-cream-200 last:border-0">
                        <td className="py-3 font-sans text-sm font-semibold text-ink-700">{row.period}</td>
                        <td className={cn(
                          "py-3 text-right font-mono text-sm font-semibold tabular-nums",
                          fundVal != null ? (fundVal >= 0 ? "text-good-500" : "text-ugly-500") : "text-ink-300"
                        )}>
                          {fundVal != null ? `${fundVal >= 0 ? "+" : ""}${fundVal.toFixed(1)}%` : "—"}
                        </td>
                        <td className="py-3 text-right font-mono text-sm text-ink-500 tabular-nums">
                          {benchVal != null ? `${benchVal.toFixed(1)}%` : "—"}
                        </td>
                        <td className="py-3 text-right font-mono text-sm text-ink-500 tabular-nums">
                          {catVal != null ? `${catVal.toFixed(1)}%` : "—"}
                        </td>
                        <td className={cn("py-3 text-right font-sans text-xs font-semibold", rankColor)}>
                          {topPct != null ? `Top ${topPct}%` : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Mobile scroll hint */}
            <p className="text-center text-[11px] text-ink-300 mt-2 sm:hidden">← scroll →</p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            KEY FACTS + FUND MANAGERS — Phase 12.6, 12.7, 14.8, 14.9
            Side-by-side desktop, stacked mobile
            ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          {/* Key Facts — Phase 14.8: added Min SIP, Min Lumpsum, Exit Load */}
          <div className="bg-white border border-cream-300 rounded-lg p-5 sm:p-6">
            <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">Details</div>
            <h2 className="font-serif text-xl text-ink-900 font-bold mb-4">Key Facts</h2>
            <div className="space-y-0 divide-y divide-cream-200">
              <MetricRow label="AMC" value={scheme.amcName} />
              <MetricRow label="Category" value={scheme.category} />
              <MetricRow label="Benchmark" value={scheme.benchmark} />
              <MetricRow label="Launch Date" value={formatDate(scheme.launchDate!)} />
              <MetricRow label="Risk Level" value={<RiskOMeter level={scheme.riskLevel!} variant="compact" />} />
              <MetricRow label="Exit Load" value={<span className="font-mono text-xs">1% if &lt; 365 days</span>} />
              <MetricRow label="Min SIP" value={<span className="font-mono text-xs">₹500 / month</span>} />
              <MetricRow label="Min Lumpsum" value={<span className="font-mono text-xs">₹5,000</span>} />
              <MetricRow label="AMFI Code" value={<span className="font-mono text-xs">{scheme.amfiCode}</span>} />
              <MetricRow label="ISIN" value={<span className="font-mono text-[10px]">{scheme.isin}</span>} />
            </div>
          </div>

          {/* Fund Managers — Phase 14.9: initials + one-line description */}
          <div className="bg-white border border-cream-300 rounded-lg p-5 sm:p-6">
            <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">The Humans</div>
            <h2 className="font-serif text-xl text-ink-900 font-bold mb-4">Fund Managers</h2>
            {/* Phase 12.7: stacked on mobile */}
            <div className="flex flex-col gap-5">
              {scheme.fundManagers!.map((mgr, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink-900 flex items-center justify-center text-white font-sans text-sm font-bold shrink-0">
                    {mgr.name!.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-base font-semibold text-ink-900">{mgr.name}</div>
                    <div className="font-sans text-xs text-ink-400 mt-0.5">
                      {mgr.tenure ? `${Math.round(mgr.tenure / 12)} yrs on this fund` : "Tenure unknown"}
                      {mgr.fundsManaged ? ` · ${mgr.fundsManaged} funds` : ""}
                    </div>
                    {/* Phase 14.9: one-line editorial description per manager */}
                    {i === 0 && (
                      <div className="font-sans text-xs text-mustard-500 italic mt-1 leading-relaxed">
                        {slug === "ppfas-flexi-cap"
                          ? "Buys Alphabet, holds for a decade, sleeps peacefully."
                          : `Managing ${scheme.shortName} since ${mgr.tenure ? Math.round(mgr.tenure / 12) : "?"} years.`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            BOREDFOLIO'S VERDICT — Phase 13, 14.4
            Good / Ugly / Verdict / Commission Gap / Who Should
            ══════════════════════════════════════════ */}
        <div>
          <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">Our Take</div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink-900 font-bold mb-5">Boredfolio&rsquo;s Verdict</h2>

          <div className="space-y-4">
            {/* The Good */}
            <div className="bg-good-50 border border-good-100 rounded-lg p-5 sm:p-6">
              <div className="font-sans text-[10.5px] text-good-600 font-bold uppercase tracking-[2.5px] mb-3">
                🟢 The Good
              </div>
              <ul className="space-y-2">
                {scheme.verdict?.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2 font-sans text-sm text-good-800 leading-relaxed">
                    <span className="text-good-500 mt-0.5 shrink-0">✓</span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Ugly */}
            <div className="bg-ugly-50 border border-ugly-100 rounded-lg p-5 sm:p-6">
              <div className="font-sans text-[10.5px] text-ugly-600 font-bold uppercase tracking-[2.5px] mb-3">
                🔴 The Ugly
              </div>
              <ul className="space-y-2">
                {scheme.verdict?.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2 font-sans text-sm text-ugly-800 leading-relaxed">
                    <span className="text-ugly-500 mt-0.5 shrink-0">✗</span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>

            {/* The Boredfolio Verdict — charcoal */}
            <div className="bg-ink-900 rounded-lg p-5 sm:p-7">
              <div className="font-sans text-[10.5px] text-mustard-400 font-bold uppercase tracking-[2.5px] mb-3">
                ★ The Boredfolio Verdict
              </div>
              <div className="mb-4">
                <VerdictBadge verdict={scheme.verdict?.rating!} />
              </div>
              <p className="font-serif text-base sm:text-xl text-white italic leading-[1.7] font-normal">
                {scheme.verdict?.summary}
              </p>
            </div>

            {/* Commission Gap — mustard box */}
            <div className="bg-mustard-400 rounded-lg p-5 sm:p-6">
              <div className="font-sans text-[10px] text-black/35 font-bold uppercase tracking-[2.5px] mb-3">
                💸 Commission Gap
              </div>
              <div className="font-sans text-[13px] text-black/60 font-medium mb-3">
                <strong>Direct:</strong> {(scheme.ter ?? 0).toFixed(2)}% ·{" "}
                <strong>Regular:</strong> ~{((scheme.ter ?? 0) + 0.79).toFixed(2)}%
              </div>
              <div className="bg-black/5 p-4 rounded-md">
                <div className="font-sans text-xs text-black/50">
                  ₹10K/month × 20 years in Regular plan costs you:
                </div>
                <div className="font-serif text-[28px] sm:text-[32px] text-ink-900 font-bold -tracking-[0.5px] mt-2 mb-1">
                  ₹{Math.round(10000 * 240 * 0.079 * 2.5).toLocaleString("en-IN")}+
                </div>
                <div className="font-sans text-[11.5px] text-black/40 italic">
                  Your distributor&rsquo;s vacation. Your retirement.
                </div>
              </div>
            </div>

            {/* Who Should / Shouldn't */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-cream-300 rounded-lg p-4 sm:p-5">
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-[2px] text-ink-400 mb-2">
                  Best For
                </h4>
                <p className="font-sans text-sm text-ink-700 leading-relaxed">{scheme.verdict?.whoShouldInvest}</p>
              </div>
              <div className="bg-white border border-cream-300 rounded-lg p-4 sm:p-5">
                <h4 className="font-sans text-[10px] font-bold uppercase tracking-[2px] text-ink-400 mb-2">
                  Probably Skip If
                </h4>
                <p className="font-sans text-sm text-ink-700 leading-relaxed">{scheme.verdict?.whoShouldAvoid}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            SIMILAR FUNDS — Phase 14.6
            3 peer funds from same category
            ══════════════════════════════════════════ */}
        {peers.length > 0 && (
          <div>
            <div className="font-sans text-[11px] uppercase tracking-[2.5px] text-ink-400 font-semibold mb-1">
              In The Same Ring
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink-900 font-bold mb-5">
              Compare With Similar Funds
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {peers.slice(0, 3).map((peer, i) => {
                const p = peer as any;
                const r3Y: number | null = p.return3Y ?? null;
                const ter: number | null = p.ter ?? null;
                return (
                  <a
                    key={p.id || i}
                    href={`/fund/${p.id}`}
                    className="block bg-white border border-cream-300 rounded-lg p-5 hover:border-sage-400 hover:-translate-y-0.5 hover:shadow-card-hover transition-all duration-200"
                  >
                    <div className="font-serif text-base font-semibold text-ink-900 mb-1 leading-snug">
                      {p.name}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <div className="font-sans text-[10px] uppercase tracking-[1.5px] text-ink-400">3Y CAGR</div>
                        <div className={cn(
                          "font-mono text-lg font-semibold tabular-nums",
                          r3Y != null ? (r3Y >= 0 ? "text-good-500" : "text-ugly-500") : "text-ink-300"
                        )}>
                          {r3Y != null ? `${r3Y >= 0 ? "+" : ""}${r3Y.toFixed(1)}%` : "—"}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-sans text-[10px] uppercase tracking-[1.5px] text-ink-400">Expense</div>
                        <div className="font-mono text-lg font-semibold text-ink-700 tabular-nums">
                          {ter != null ? `${ter.toFixed(2)}%` : "—"}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 font-sans text-[11px] text-sage-500 font-semibold">View autopsy →</div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════
            VIEW ALL SCHEMES — Phase 14.7
            ══════════════════════════════════════════ */}
        <div className="text-center pb-6 sm:pb-10">
          <a
            href="/explore"
            className="inline-block w-full sm:w-auto border-2 border-ink-900 text-ink-900 font-sans text-base font-semibold px-8 py-4 rounded hover:bg-ink-900 hover:text-white transition-colors"
          >
            View All 1,547 Schemes →
          </a>
          <p className="font-sans text-xs text-ink-400 mt-3 italic">
            Not SEBI registered. Not your advisor. Just better at math than your advisor.
          </p>
        </div>

      </div>

      <GlobalFooter />
      <MobileBottomNav currentPath="/fund" />
    </div>
  );
}


/* ── Reusable stat box (used for the 4-box key numbers strip) ── */
function StatBox({
  label,
  value,
  sub,
  valueColor = "text-ink-900",
  subColor = "text-ink-400",
}: {
  label: string;
  value: string;
  sub?: string;
  valueColor?: string;
  subColor?: string;
}) {
  return (
    <div className="bg-white border border-cream-300 rounded-lg p-4">
      <div className="font-sans text-[10px] uppercase tracking-[2px] text-ink-400 font-semibold mb-1.5">
        {label}
      </div>
      <div className={cn("font-mono text-xl sm:text-2xl font-semibold tabular-nums", valueColor)}>
        {value}
      </div>
      {sub && (
        <div className={cn("font-sans text-xs mt-0.5", subColor)}>{sub}</div>
      )}
    </div>
  );
}
