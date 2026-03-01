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
import { FundManagerCard } from "@/components/domain/FundManagerCard";

/*
 * AMC (FUND HOUSE) PAGE
 * ─────────────────────
 * Everything about a specific AMC.
 * The fund house matters as much as the fund.
 */

const AMC = {
  name: "HDFC Asset Management Company",
  shortName: "HDFC AMC",
  logo: null,
  parent: "HDFC Group / abrdn (Standard Life)",
  incorporated: "1999",
  hq: "Mumbai, Maharashtra",
  totalAUM: 612000,
  schemeCount: 156,
  ceoName: "Navneet Munot",
  sebiReg: "INP000000506",
  marketShare: 11.2,
};

const AMC_FUNDS = [
  { id: "hdfc-flexi", name: "HDFC Flexi Cap Fund", category: "Flexi Cap", aum: 38600, return3Y: 17.5, ter: 0.77, verdict: "hold" as const },
  { id: "hdfc-mid", name: "HDFC Mid-Cap Opportunities", category: "Mid Cap", aum: 52400, return3Y: 26.4, ter: 0.82, verdict: "buy" as const },
  { id: "hdfc-baf", name: "HDFC Balanced Advantage", category: "Balanced Advantage", aum: 62500, return3Y: 16.4, ter: 0.74, verdict: "buy" as const },
  { id: "hdfc-large", name: "HDFC Top 100 Fund", category: "Large Cap", aum: 28200, return3Y: 14.2, ter: 0.92, verdict: "hold" as const },
  { id: "hdfc-small", name: "HDFC Small Cap Fund", category: "Small Cap", aum: 24800, return3Y: 28.2, ter: 0.68, verdict: "buy" as const },
  { id: "hdfc-liquid", name: "HDFC Liquid Fund", category: "Liquid", aum: 45200, return3Y: 6.4, ter: 0.20, verdict: "hold" as const },
  { id: "hdfc-short", name: "HDFC Short Term Debt", category: "Short Duration", aum: 14500, return3Y: 7.2, ter: 0.32, verdict: "buy" as const },
  { id: "hdfc-elss", name: "HDFC ELSS Tax Saver", category: "ELSS", aum: 12800, return3Y: 16.8, ter: 0.85, verdict: "hold" as const },
];

const AMC_MANAGERS = [
  { name: "Prashant Jain", tenure: "Retired (2022)", fundsManaged: 0, totalAUM: 0, avgAlpha: 2.1 },
  { name: "Chirag Setalvad", tenure: "18 years", fundsManaged: 4, totalAUM: 142000, avgAlpha: 3.8 },
  { name: "Gopal Agrawal", tenure: "8 years", fundsManaged: 3, totalAUM: 98000, avgAlpha: 2.4 },
  { name: "Shobhit Mehrotra", tenure: "12 years", fundsManaged: 5, totalAUM: 85000, avgAlpha: 1.8 },
];

const REPORT_CARD = {
  overall: "B+",
  strengths: [
    "Largest fund house by AUM — institutional stability",
    "Strong debt fund management team",
    "Mid-cap and BAF are genuine category leaders",
    "Declining TER trend across most schemes",
  ],
  weaknesses: [
    "Large cap funds have been mediocre for years",
    "ELSS fund charges premium TER for average returns",
    "Too many overlapping schemes in same categories",
    "Post-Prashant Jain transition still settling",
  ],
  bestFund: "HDFC Mid-Cap Opportunities — consistently in top quartile for 10+ years",
  worstFund: "HDFC Top 100 — pays 0.92% TER to underperform a ₹0.10 index fund",
};

export default function AMCPage() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "funds", label: "Fund Lineup" },
    { id: "managers", label: "Managers" },
    { id: "costs", label: "Costs" },
    { id: "verdict", label: "Report Card" },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/explore" />
      <PageLayout>
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "AMCs", href: "/amc" }, { label: AMC.shortName }]}
          title={AMC.name}
          subtitle={`${AMC.parent} · Est. ${AMC.incorporated}`}
          badges={
            <>
              <Badge variant="sage">{AMC.schemeCount} schemes</Badge>
              <Badge variant="outline">{AMC.marketShare}% market share</Badge>
            </>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Total AUM" value={formatAUM(AMC.totalAUM)} subtext="#1 in India" />
          <StatCard label="Schemes" value={AMC.schemeCount.toString()} />
          <StatCard label="CEO" value={AMC.ceoName} />
          <StatCard label="HQ" value={AMC.hq} />
        </div>

        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="underline" className="mb-8" />

        {/* ═══ OVERVIEW ═══ */}
        <TabContent activeTab={tab} tabId="overview">
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title="AUM Breakdown" />
              <div className="mt-4">
                <div className="flex items-center gap-1 h-8 rounded-md overflow-hidden">
                  {[
                    { label: "Equity", pct: 48, color: "bg-sage-400" },
                    { label: "Debt", pct: 32, color: "bg-mustard-400" },
                    { label: "Hybrid", pct: 14, color: "bg-sage-200" },
                    { label: "Others", pct: 6, color: "bg-cream-400" },
                  ].map((seg) => (
                    <div key={seg.label} className={cn("h-full flex items-center justify-center text-2xs font-semibold text-white", seg.color)}
                      style={{ width: `${seg.pct}%` }} title={`${seg.label}: ${seg.pct}%`}>
                      {seg.pct > 10 && `${seg.label} ${seg.pct}%`}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {[
                    { label: "Equity", color: "bg-sage-400" },
                    { label: "Debt", color: "bg-mustard-400" },
                    { label: "Hybrid", color: "bg-sage-200" },
                    { label: "Others", color: "bg-cream-400" },
                  ].map((l) => (
                    <div key={l.label} className="flex items-center gap-1.5">
                      <div className={cn("w-2.5 h-2.5 rounded-sm", l.color)} />
                      <span className="text-2xs text-ink-500">{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Key Facts" />
              <div className="mt-3">
                <MetricRow label="SEBI Registration" value={<span className="font-mono text-xs">{AMC.sebiReg}</span>} />
                <MetricRow label="Parent Company" value={AMC.parent} />
                <MetricRow label="Year of Incorporation" value={AMC.incorporated} />
                <MetricRow label="Headquarters" value={AMC.hq} />
                <MetricRow label="CEO / MD" value={AMC.ceoName} />
                <MetricRow label="Active Schemes" value={AMC.schemeCount.toString()} />
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ FUND LINEUP ═══ */}
        <TabContent activeTab={tab} tabId="funds">
          <Card padding="none">
            <DataTable
              columns={[
                { key: "name", label: "Fund", sortable: true, sticky: true, minWidth: "200px",
                  render: (_, r) => (
                    <div className="py-1">
                      <p className="text-sm font-medium text-ink-900">{r.name}</p>
                      <CategoryBadge category={r.category} />
                    </div>
                  ),
                },
                { key: "aum", label: "AUM", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{formatAUM(v)}</span> },
                { key: "return3Y", label: "3Y CAGR", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
                { key: "ter", label: "TER", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}%</span> },
                { key: "verdict", label: "", align: "center", render: (v) => <VerdictBadge verdict={v} /> },
              ]}
              data={AMC_FUNDS}
              keyField="id"
              compact
            />
          </Card>
        </TabContent>

        {/* ═══ MANAGERS ═══ */}
        <TabContent activeTab={tab} tabId="managers">
          <div className="space-y-4">
            {AMC_MANAGERS.filter((m) => m.fundsManaged > 0).map((mgr) => (
              <FundManagerCard
                key={mgr.name}
                name={mgr.name}
                amcName={AMC.shortName}
                tenureOnFund={mgr.tenure}
                totalAUM={mgr.totalAUM}
                fundsManaged={mgr.fundsManaged}
                averageAlpha={mgr.avgAlpha}
                variant="default"
              />
            ))}
          </div>
        </TabContent>

        {/* ═══ COSTS ═══ */}
        <TabContent activeTab={tab} tabId="costs">
          <div className="space-y-6">
            <Card padding="lg">
              <CardHeader title="Expense Ratio Analysis" label="Is this AMC expensive?" />
              <div className="mt-4 overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-300">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Category</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">HDFC TER</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Industry Avg</th>
                      <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cat: "Large Cap", hdfc: 0.92, avg: 0.78 },
                      { cat: "Mid Cap", hdfc: 0.82, avg: 0.85 },
                      { cat: "Flexi Cap", hdfc: 0.77, avg: 0.82 },
                      { cat: "Liquid", hdfc: 0.20, avg: 0.22 },
                      { cat: "BAF / Hybrid", hdfc: 0.74, avg: 0.80 },
                    ].map((r) => (
                      <tr key={r.cat} className="border-b border-cream-200 last:border-0">
                        <td className="py-2.5 text-sm text-ink-700">{r.cat}</td>
                        <td className="py-2.5 text-right font-mono text-sm">{r.hdfc.toFixed(2)}%</td>
                        <td className="py-2.5 text-right font-mono text-sm text-ink-500">{r.avg.toFixed(2)}%</td>
                        <td className={cn("py-2.5 text-right font-mono text-sm", r.hdfc > r.avg ? "text-ugly-500" : "text-good-600")}>
                          {r.hdfc > r.avg ? "+" : ""}{((r.hdfc - r.avg) * 100).toFixed(0)} bps
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-ink-500 mt-4 p-3 bg-cream-50 rounded-md">
                <span className="font-semibold">Verdict:</span> HDFC AMC is competitive on mid-cap and hybrid costs, but charges a premium for large cap and ELSS. Their scale should translate to lower TERs — it often doesn't.
              </p>
            </Card>
          </div>
        </TabContent>

        {/* ═══ REPORT CARD ═══ */}
        <TabContent activeTab={tab} tabId="verdict">
          <Card padding="lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-lg bg-sage-100 flex items-center justify-center">
                <span className="font-serif text-3xl font-bold text-sage-700">{REPORT_CARD.overall}</span>
              </div>
              <div>
                <h2 className="font-serif text-xl text-ink-900">The Boredfolio Report Card</h2>
                <p className="text-sm text-ink-500">Overall grade for {AMC.shortName}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-good-50 border border-good-100 rounded-lg p-5">
                <h3 className="font-serif text-base text-good-700 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {REPORT_CARD.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-good-800">
                      <span className="text-good-500 mt-0.5 shrink-0">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-ugly-50 border border-ugly-100 rounded-lg p-5">
                <h3 className="font-serif text-base text-ugly-700 mb-3">Weaknesses</h3>
                <ul className="space-y-2">
                  {REPORT_CARD.weaknesses.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ugly-800">
                      <span className="text-ugly-500 mt-0.5 shrink-0">✗</span>{w}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card padding="md" className="border-l-4 border-l-good-400">
                <p className="text-2xs font-semibold uppercase tracking-wider text-good-600 mb-1">Best Fund Here</p>
                <p className="text-sm text-ink-700">{REPORT_CARD.bestFund}</p>
              </Card>
              <Card padding="md" className="border-l-4 border-l-ugly-400">
                <p className="text-2xs font-semibold uppercase tracking-wider text-ugly-600 mb-1">Worst Fund Here</p>
                <p className="text-sm text-ink-700">{REPORT_CARD.worstFund}</p>
              </Card>
            </div>
          </Card>
        </TabContent>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/explore" />
    </div>
  );
}
