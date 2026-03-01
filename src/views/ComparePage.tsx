"use client";

import React, { useState, useMemo } from "react";
import { cn, formatAUM, formatPercent, formatNAV, BRAND_COLORS } from "@/lib/utils";
import { generateNAVData } from "@/lib/mockData";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader } from "@/components/ui/Navigation";
import { Badge, VerdictBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Tabs, TabContent } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { ReturnValue } from "@/components/data/ReturnDisplay";
import { NAVChart } from "@/components/charts/NAVChart";
import { YearReturnsChart } from "@/components/charts/BarChart";
import { OverlapMatrix } from "@/components/charts/HeatmapGrid";
import { AllocationPieChart } from "@/components/charts/PieChart";

/*
 * COMPARISON PAGE — Side-by-side view of 2-5 schemes
 */

const FUNDS = [
  {
    id: "ppfas", shortName: "PPFAS Flexi Cap", amc: "PPFAS MF", category: "Flexi Cap",
    nav: 78.42, aum: 48000, ter: 0.63, verdict: "buy" as const, color: BRAND_COLORS.sage,
    returns: { "1M": 2.8, "3M": 5.6, "6M": 9.4, "1Y": 24.5, "3Y": 18.2, "5Y": 21.1 },
    risk: { sharpe: 1.14, alpha: 3.7, beta: 0.82, stdDev: 14.2, maxDD: -28.4, upCap: 92, downCap: 68 },
    sectors: [{ name: "Banking", value: 24.5 }, { name: "Tech", value: 18.2 }, { name: "Consumer", value: 12.8 }, { name: "Others", value: 44.5 }],
  },
  {
    id: "hdfc", shortName: "HDFC Flexi Cap", amc: "HDFC AMC", category: "Flexi Cap",
    nav: 1842.15, aum: 38600, ter: 0.77, verdict: "hold" as const, color: BRAND_COLORS.mustard,
    returns: { "1M": 1.8, "3M": 4.2, "6M": 7.8, "1Y": 19.8, "3Y": 17.5, "5Y": 18.9 },
    risk: { sharpe: 1.02, alpha: 2.8, beta: 0.91, stdDev: 15.8, maxDD: -33.8, upCap: 96, downCap: 82 },
    sectors: [{ name: "Banking", value: 28.2 }, { name: "FMCG", value: 11.5 }, { name: "Tech", value: 10.4 }, { name: "Others", value: 49.9 }],
  },
  {
    id: "kotak", shortName: "Kotak Flexicap", amc: "Kotak AMC", category: "Flexi Cap",
    nav: 68.52, aum: 42100, ter: 0.59, verdict: "hold" as const, color: "#7C6B8F",
    returns: { "1M": 1.5, "3M": 3.8, "6M": 6.5, "1Y": 20.4, "3Y": 15.2, "5Y": 17.8 },
    risk: { sharpe: 0.92, alpha: 1.5, beta: 0.88, stdDev: 14.8, maxDD: -30.5, upCap: 89, downCap: 78 },
    sectors: [{ name: "Banking", value: 26.8 }, { name: "Tech", value: 14.2 }, { name: "FMCG", value: 9.8 }, { name: "Others", value: 49.2 }],
  },
];

const PERIODS = ["1M", "3M", "6M", "1Y", "3Y", "5Y"] as const;
const OVERLAP = [
  { fund1: "PPFAS Flexi Cap", fund2: "HDFC Flexi Cap", value: 32 },
  { fund1: "PPFAS Flexi Cap", fund2: "Kotak Flexicap", value: 28 },
  { fund1: "HDFC Flexi Cap", fund2: "Kotak Flexicap", value: 54 },
];

export default function ComparePage() {
  const [tab, setTab] = useState("glance");
  const tabs = [
    { id: "glance", label: "At a Glance" },
    { id: "returns", label: "Returns" },
    { id: "portfolio", label: "Portfolio" },
    { id: "risk", label: "Risk" },
    { id: "verdict", label: "Verdict" },
  ];

  const gridCols = { gridTemplateColumns: `repeat(${FUNDS.length}, 1fr)` };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/compare" />
      <PageLayout variant="wide">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Compare" }]}
          title="Fund Comparison"
          subtitle="Three funds enter. One survives."
          actions={<Button variant="outline" size="sm">+ Add Fund</Button>}
        />

        {/* Fund strip */}
        <div className="grid gap-3 mb-6" style={gridCols}>
          {FUNDS.map((f) => (
            <Card key={f.id} padding="md" className="text-center" style={{ borderTopColor: f.color, borderTopWidth: 3 }}>
              <p className="font-serif text-base text-ink-900">{f.shortName}</p>
              <p className="text-2xs text-ink-400 mt-0.5">{f.amc}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <CategoryBadge category={f.category} />
                <VerdictBadge verdict={f.verdict} />
              </div>
            </Card>
          ))}
        </div>

        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="underline" className="mb-8" />

        {/* ═══ AT A GLANCE ═══ */}
        <TabContent activeTab={tab} tabId="glance">
          <Card padding="lg">
            <CardHeader title="Key Metrics" />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-300">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2 w-[140px]">Metric</th>
                    {FUNDS.map((f) => <th key={f.id} className="text-right text-xs font-semibold uppercase tracking-wider pb-2" style={{ color: f.color }}>{f.shortName}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <CRow label="NAV" vals={FUNDS.map((f) => `₹${formatNAV(f.nav)}`)} />
                  <CRow label="AUM" vals={FUNDS.map((f) => formatAUM(f.aum))} />
                  <CRow label="TER" vals={FUNDS.map((f) => `${f.ter.toFixed(2)}%`)} best="min" nums={FUNDS.map((f) => f.ter)} />
                  {PERIODS.map((p) => <CRow key={p} label={`${p} Return`} vals={FUNDS.map((f) => formatPercent(f.returns[p]))} best="max" nums={FUNDS.map((f) => f.returns[p])} />)}
                  <CRow label="Sharpe (3Y)" vals={FUNDS.map((f) => f.risk.sharpe.toFixed(2))} best="max" nums={FUNDS.map((f) => f.risk.sharpe)} />
                  <CRow label="Max Drawdown" vals={FUNDS.map((f) => `${f.risk.maxDD}%`)} best="max" nums={FUNDS.map((f) => f.risk.maxDD)} />
                </tbody>
              </table>
            </div>
          </Card>
        </TabContent>

        {/* ═══ RETURNS ═══ */}
        <TabContent activeTab={tab} tabId="returns">
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title="NAV Performance (Rebased to 100)" />
              <div className="mt-4"><NAVChart data={generateNAVData(365 * 3, 100)} schemeName={FUNDS[0].shortName} benchmarkName={FUNDS[1].shortName} /></div>
            </Card>
            <Card padding="lg">
              <CardHeader title="Calendar Year Returns" />
              <div className="mt-4"><YearReturnsChart data={[
                { year: "2020", fund: 34.2, benchmark: 28.5, categoryAvg: 22.5 },
                { year: "2021", fund: 42.8, benchmark: 32.1, categoryAvg: 32.1 },
                { year: "2022", fund: -4.2, benchmark: -2.8, categoryAvg: -1.8 },
                { year: "2023", fund: 28.5, benchmark: 24.2, categoryAvg: 24.1 },
                { year: "2024", fund: 18.6, benchmark: 16.8, categoryAvg: 16.8 },
              ]} /></div>
            </Card>
            <Card padding="md">
              <CardHeader title="Head-to-Head Win Rate" label="Rolling 3Y" />
              <div className="mt-4 space-y-3">
                {[{ name: FUNDS[1].shortName, win: 62 }, { name: FUNDS[2].shortName, win: 71 }].map((m) => (
                  <div key={m.name} className="flex items-center gap-3">
                    <span className="text-xs text-ink-500 w-40 shrink-0">{FUNDS[0].shortName} vs {m.name}</span>
                    <div className="flex-1 h-6 bg-cream-200 rounded-md overflow-hidden flex">
                      <div className="h-full bg-sage-400 flex items-center justify-center text-2xs text-white font-semibold" style={{ width: `${m.win}%` }}>{m.win}%</div>
                      <div className="h-full flex items-center justify-center text-2xs text-ink-500 font-semibold flex-1">{100 - m.win}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ PORTFOLIO ═══ */}
        <TabContent activeTab={tab} tabId="portfolio">
          <div className="space-y-6">
            <div className="grid gap-4" style={gridCols}>
              {FUNDS.map((f) => <Card key={f.id} padding="md"><AllocationPieChart data={f.sectors} title={`${f.shortName}`} donut /></Card>)}
            </div>
            <Card padding="lg">
              <CardHeader title="Portfolio Overlap" label="Are you actually diversified?" />
              <div className="mt-4"><OverlapMatrix funds={FUNDS.map((f) => f.shortName)} data={OVERLAP} /></div>
              <p className="text-sm text-ink-500 mt-4 bg-mustard-50 border border-mustard-100 rounded-md p-3">
                <span className="font-semibold text-mustard-700">💡</span> HDFC Flexi Cap and Kotak Flexicap share <span className="font-semibold">54%</span> of holdings. Owning both is redundant.
              </p>
            </Card>
          </div>
        </TabContent>

        {/* ═══ RISK ═══ */}
        <TabContent activeTab={tab} tabId="risk">
          <Card padding="lg">
            <CardHeader title="Risk Metrics Comparison" />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-300">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2 w-[160px]">Metric</th>
                    {FUNDS.map((f) => <th key={f.id} className="text-right text-xs font-semibold uppercase tracking-wider pb-2" style={{ color: f.color }}>{f.shortName}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <CRow label="Sharpe (3Y)" vals={FUNDS.map((f) => f.risk.sharpe.toFixed(2))} best="max" nums={FUNDS.map((f) => f.risk.sharpe)} />
                  <CRow label="Alpha (3Y)" vals={FUNDS.map((f) => formatPercent(f.risk.alpha))} best="max" nums={FUNDS.map((f) => f.risk.alpha)} />
                  <CRow label="Beta" vals={FUNDS.map((f) => f.risk.beta.toFixed(2))} />
                  <CRow label="Std Dev (3Y)" vals={FUNDS.map((f) => `${f.risk.stdDev}%`)} best="min" nums={FUNDS.map((f) => f.risk.stdDev)} />
                  <CRow label="Max Drawdown" vals={FUNDS.map((f) => `${f.risk.maxDD}%`)} best="max" nums={FUNDS.map((f) => f.risk.maxDD)} />
                  <CRow label="Upside Capture" vals={FUNDS.map((f) => `${f.risk.upCap}%`)} best="max" nums={FUNDS.map((f) => f.risk.upCap)} />
                  <CRow label="Downside Capture" vals={FUNDS.map((f) => `${f.risk.downCap}%`)} best="min" nums={FUNDS.map((f) => f.risk.downCap)} />
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-4 bg-cream-50 rounded-lg border border-cream-200">
              <p className="text-sm text-ink-700 leading-relaxed">
                <span className="font-serif font-semibold">Translation for humans:</span> {FUNDS[0].shortName} takes less risk while generating more return per unit of risk. But its max drawdown of {FUNDS[0].risk.maxDD}% is still a significant hole to climb out of.
              </p>
            </div>
          </Card>
        </TabContent>

        {/* ═══ VERDICT ═══ */}
        <TabContent activeTab={tab} tabId="verdict">
          <Card padding="lg">
            <div className="text-center mb-8">
              <h2 className="font-serif text-2xl text-ink-900">If You Had to Pick One...</h2>
            </div>
            <div className="grid gap-4" style={gridCols}>
              {FUNDS.map((f, i) => (
                <div key={f.id} className={cn("rounded-lg border-2 p-5 text-center", i === 0 ? "border-sage-400 bg-sage-50" : "border-cream-300 bg-cream-50")}>
                  {i === 0 && <Badge variant="sage" className="mb-3">Our Pick</Badge>}
                  <p className="font-serif text-lg text-ink-900">{f.shortName}</p>
                  <p className="font-mono text-2xl font-semibold mt-2" style={{ color: f.color }}>{formatPercent(f.returns["3Y"])}</p>
                  <p className="text-2xs text-ink-400">3Y CAGR</p>
                  <div className="mt-4 space-y-1 text-xs text-ink-600">
                    <p>TER: <span className="font-mono">{f.ter}%</span></p>
                    <p>Sharpe: <span className="font-mono">{f.risk.sharpe}</span></p>
                  </div>
                  <VerdictBadge verdict={f.verdict} className="mt-3" />
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 bg-cream-50 border border-cream-200 rounded-lg">
              <p className="font-serif text-base text-ink-900 mb-2">The Boredfolio Take</p>
              <p className="text-sm text-ink-700 leading-relaxed">
                {FUNDS[0].shortName} wins on risk-adjusted metrics. {FUNDS[1].shortName} has the longest track record.
                {FUNDS[2].shortName} is cheapest but least differentiated. If choosing one, go with {FUNDS[0].shortName}.
              </p>
            </div>
          </Card>
        </TabContent>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/compare" />
    </div>
  );
}

function CRow({ label, vals, best, nums }: { label: string; vals: string[]; best?: "min" | "max"; nums?: number[] }) {
  let bestIdx = -1;
  if (best && nums) bestIdx = best === "max" ? nums.indexOf(Math.max(...nums)) : nums.indexOf(Math.min(...nums));
  return (
    <tr className="border-b border-cream-200 last:border-0">
      <td className="py-2.5 text-sm text-ink-600">{label}</td>
      {vals.map((v, i) => (
        <td key={i} className={cn("py-2.5 text-right font-mono text-sm tabular-nums", i === bestIdx ? "text-good-600 font-semibold" : "text-ink-700")}>
          {v}{i === bestIdx && <span className="text-good-400 ml-1 text-2xs">★</span>}
        </td>
      ))}
    </tr>
  );
}
