"use client";

import React, { useState } from "react";
import { cn, formatAUM, formatPercent, BRAND_COLORS } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, SectionHeader, Divider } from "@/components/ui/Navigation";
import { Badge, VerdictBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard, MetricRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabContent } from "@/components/ui/Tabs";
import { DataTable } from "@/components/data/DataTable";
import { ReturnValue } from "@/components/data/ReturnDisplay";
import { BarChartComponent } from "@/components/charts/BarChart";
import { SchemeCard } from "@/components/domain/SchemeCard";

/*
 * CATEGORY PAGE
 * ─────────────
 * Deep dive into a mutual fund category.
 * Educate + help pick the best within a category.
 */

const CATEGORY = {
  name: "Flexi Cap",
  sebiDef: "An open ended dynamic equity scheme investing across large cap, mid cap, small cap stocks",
  boredfolioDef: "The 'I can't decide, so I'll buy everything' category. Fund managers get to roam free across market caps. Some use this freedom wisely. Most don't.",
  fundCount: 38,
  totalAUM: 312000,
  benchmarkIndex: "Nifty 500 TRI",
  avgReturn1Y: 20.1,
  avgReturn3Y: 16.4,
  avgReturn5Y: 18.2,
  bestReturn3Y: 28.5,
  worstReturn3Y: 8.2,
  medianReturn3Y: 15.8,
  avgTER: 0.82,
};

const CATEGORY_FUNDS = [
  { id: "ppfas", shortName: "PPFAS Flexi Cap", amc: "PPFAS MF", aum: 48000, return1Y: 24.5, return3Y: 18.2, return5Y: 21.1, ter: 0.63, sharpe: 1.14, verdict: "buy" as const },
  { id: "hdfc", shortName: "HDFC Flexi Cap", amc: "HDFC AMC", aum: 38600, return1Y: 19.8, return3Y: 17.5, return5Y: 18.9, ter: 0.77, sharpe: 1.02, verdict: "hold" as const },
  { id: "kotak", shortName: "Kotak Flexicap", amc: "Kotak AMC", aum: 42100, return1Y: 20.4, return3Y: 15.2, return5Y: 17.8, ter: 0.59, sharpe: 0.92, verdict: "hold" as const },
  { id: "uti", shortName: "UTI Flexi Cap", amc: "UTI AMC", aum: 26500, return1Y: 22.1, return3Y: 16.8, return5Y: 19.4, ter: 0.95, sharpe: 0.98, verdict: "hold" as const },
  { id: "dsp", shortName: "DSP Flexi Cap", amc: "DSP MF", aum: 12400, return1Y: 21.6, return3Y: 15.9, return5Y: 17.2, ter: 0.72, sharpe: 0.88, verdict: "hold" as const },
  { id: "sbi", shortName: "SBI Flexicap", amc: "SBI MF", aum: 22800, return1Y: 18.5, return3Y: 14.2, return5Y: 16.5, ter: 0.88, sharpe: 0.82, verdict: "avoid" as const },
  { id: "motilal", shortName: "Motilal Flexi Cap", amc: "Motilal Oswal AMC", aum: 8200, return1Y: 26.2, return3Y: 20.4, return5Y: 22.8, ter: 0.68, sharpe: 1.18, verdict: "buy" as const },
  { id: "pgim", shortName: "PGIM Flexi Cap", amc: "PGIM India AMC", aum: 6100, return1Y: 25.8, return3Y: 22.1, return5Y: 24.2, ter: 0.42, sharpe: 1.25, verdict: "buy" as const },
];

const LEADERBOARDS = {
  returns: CATEGORY_FUNDS.slice().sort((a, b) => b.return3Y - a.return3Y).slice(0, 5),
  riskAdj: CATEGORY_FUNDS.slice().sort((a, b) => b.sharpe - a.sharpe).slice(0, 5),
  lowCost: CATEGORY_FUNDS.slice().sort((a, b) => a.ter - b.ter).slice(0, 5),
};

const DISTRIBUTION = [
  { range: "< 10%", count: 2 }, { range: "10-15%", count: 8 }, { range: "15-20%", count: 15 },
  { range: "20-25%", count: 9 }, { range: "25-30%", count: 3 }, { range: "> 30%", count: 1 },
];

export default function CategoryPage() {
  const [tab, setTab] = useState("overview");
  const [sortKey, setSortKey] = useState("aum");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "funds", label: "All Funds" },
    { id: "education", label: "Learn" },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/explore" />
      <PageLayout>
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore", href: "/explore" }, { label: CATEGORY.name }]}
          title={CATEGORY.name}
          subtitle={CATEGORY.sebiDef}
          badges={<Badge variant="sage">{CATEGORY.fundCount} funds</Badge>}
        />

        {/* Key Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total AUM" value={formatAUM(CATEGORY.totalAUM)} />
          <StatCard label="Avg 3Y CAGR" value={formatPercent(CATEGORY.avgReturn3Y)} trend="up" />
          <StatCard label="Best 3Y" value={formatPercent(CATEGORY.bestReturn3Y)} trend="up" />
          <StatCard label="Avg TER" value={`${CATEGORY.avgTER.toFixed(2)}%`} />
        </div>

        {/* Boredfolio translation */}
        <Card padding="md" className="mb-8 border-l-4 border-l-mustard-400">
          <p className="text-sm text-ink-700 leading-relaxed italic">
            <span className="font-semibold text-mustard-600 not-italic">In Boredfolio terms:</span> {CATEGORY.boredfolioDef}
          </p>
        </Card>

        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="underline" className="mb-8" />

        {/* ═══ OVERVIEW ═══ */}
        <TabContent activeTab={tab} tabId="overview">
          <div className="space-y-8">
            {/* Return Distribution */}
            <Card padding="lg">
              <CardHeader title="3Y Return Distribution" label="Where does YOUR fund sit?" />
              <div className="mt-4">
                <div className="flex items-end gap-1 h-40">
                  {DISTRIBUTION.map((d) => {
                    const maxCount = Math.max(...DISTRIBUTION.map((x) => x.count));
                    const height = (d.count / maxCount) * 100;
                    return (
                      <div key={d.range} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-2xs font-mono text-ink-500">{d.count}</span>
                        <div className="w-full bg-sage-300 rounded-t" style={{ height: `${height}%` }} />
                        <span className="text-2xs text-ink-400 text-center leading-tight">{d.range}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-400 mt-3 text-center">3Y CAGR distribution across {CATEGORY.fundCount} funds in this category</p>
              </div>
            </Card>

            {/* Leaderboards */}
            <SectionHeader title="Who's Winning" label="Leaderboards" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <LeaderboardCard title="Top by Returns (3Y)" funds={LEADERBOARDS.returns} metric="return3Y" format={(v) => formatPercent(v)} />
              <LeaderboardCard title="Top by Risk-Adjusted" funds={LEADERBOARDS.riskAdj} metric="sharpe" format={(v) => `Sharpe ${v.toFixed(2)}`} />
              <LeaderboardCard title="Lowest Cost" funds={LEADERBOARDS.lowCost} metric="ter" format={(v) => `TER ${v.toFixed(2)}%`} />
            </div>

            {/* Category vs Benchmark */}
            <Card padding="lg">
              <CardHeader title="Category vs Benchmark" label={CATEGORY.benchmarkIndex} />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-300">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Period</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-sage-600 pb-2">Category Avg</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Benchmark</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Excess</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { period: "1Y", cat: 20.1, bench: 18.2 },
                      { period: "3Y", cat: 16.4, bench: 14.5 },
                      { period: "5Y", cat: 18.2, bench: 16.8 },
                    ].map((r) => (
                      <tr key={r.period} className="border-b border-cream-200 last:border-0">
                        <td className="py-2.5 text-sm font-medium text-ink-700">{r.period}</td>
                        <td className="py-2.5 text-right"><ReturnValue value={r.cat} size="sm" /></td>
                        <td className="py-2.5 text-right font-mono text-sm text-ink-500">{formatPercent(r.bench)}</td>
                        <td className="py-2.5 text-right"><ReturnValue value={r.cat - r.bench} size="sm" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ ALL FUNDS ═══ */}
        <TabContent activeTab={tab} tabId="funds">
          <Card padding="none">
            <DataTable
              columns={[
                { key: "shortName", label: "Fund", sortable: true, sticky: true, minWidth: "180px",
                  render: (_, r) => (
                    <div className="py-1">
                      <p className="text-sm font-medium text-ink-900">{r.shortName}</p>
                      <p className="text-2xs text-ink-400">{r.amc}</p>
                    </div>
                  ),
                },
                { key: "aum", label: "AUM", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{formatAUM(v)}</span> },
                { key: "return1Y", label: "1Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
                { key: "return3Y", label: "3Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
                { key: "return5Y", label: "5Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
                { key: "ter", label: "TER", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}%</span> },
                { key: "sharpe", label: "Sharpe", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}</span> },
                { key: "verdict", label: "", align: "center", render: (v) => <VerdictBadge verdict={v} /> },
              ]}
              data={CATEGORY_FUNDS}
              keyField="id"
              compact
            />
          </Card>
        </TabContent>

        {/* ═══ LEARN ═══ */}
        <TabContent activeTab={tab} tabId="education">
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title={`What is ${CATEGORY.name}?`} label="Education" />
              <div className="mt-4 space-y-4 text-sm text-ink-700 leading-relaxed">
                <p>
                  Flexi Cap funds are equity mutual funds that can invest across market capitalizations — large cap, mid cap, and small cap — without any mandated allocation. The fund manager has full freedom to move money where they see the best opportunities.
                </p>
                <p>
                  This is different from Multi Cap funds (which must maintain a minimum 25% each in large, mid, and small caps) and Large Cap funds (which must hold 80%+ in large caps).
                </p>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card padding="md">
                <CardHeader title="When to Invest" />
                <div className="mt-3 space-y-2 text-sm text-ink-700">
                  <p>✓ You want one-fund equity exposure across market caps</p>
                  <p>✓ You trust the fund manager to make allocation calls</p>
                  <p>✓ Your investment horizon is 5+ years</p>
                  <p>✓ You don't want to rebalance across multiple funds yourself</p>
                </div>
              </Card>
              <Card padding="md">
                <CardHeader title="Common Mistakes" />
                <div className="mt-3 space-y-2 text-sm text-ink-700">
                  <p>✗ Owning 3+ flexi cap funds (massive overlap — they all buy HDFC Bank)</p>
                  <p>✗ Expecting large cap stability (managers can go heavy into small caps)</p>
                  <p>✗ Ignoring TER differences (0.3% gap = ₹3L on ₹10L over 20 years)</p>
                  <p>✗ Chasing past returns instead of checking rolling return consistency</p>
                </div>
              </Card>
            </div>

            <Card padding="md">
              <CardHeader title="Tax Treatment" />
              <div className="mt-3">
                <MetricRow label="Classification" value="Equity (65%+ equity allocation)" />
                <MetricRow label="STCG (< 1 year)" value="20%" />
                <MetricRow label="LTCG (> 1 year)" value="12.5% above ₹1.25L" />
                <MetricRow label="Ideal Holding Period" value="5+ years" />
              </div>
            </Card>
          </div>
        </TabContent>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/explore" />
    </div>
  );
}

function LeaderboardCard({ title, funds, metric, format }: {
  title: string;
  funds: typeof CATEGORY_FUNDS;
  metric: keyof typeof CATEGORY_FUNDS[0];
  format: (v: number) => string;
}) {
  return (
    <Card padding="md">
      <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">{title}</h4>
      <div className="space-y-2.5">
        {funds.map((f, i) => (
          <div key={f.id} className="flex items-center gap-2">
            <span className={cn(
              "w-5 h-5 rounded-full flex items-center justify-center text-2xs font-semibold",
              i === 0 ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-500"
            )}>{i + 1}</span>
            <span className="text-sm text-ink-800 flex-1 truncate">{f.shortName}</span>
            <span className="font-mono text-xs text-ink-600">{format(f[metric] as number)}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
