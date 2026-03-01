"use client";

import React, { useState, useMemo } from "react";
import { cn, formatINR, formatNAV, formatAUM, formatPercent, formatDate, BRAND_COLORS } from "@/lib/utils";
import { getFundData, getFundPeers, getFundYearReturns } from "@/lib/fundMockData";
import {
  generateNAVData, generateRollingReturns, generateDrawdownData,
} from "@/lib/mockData";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";

// UI
import { PageHeader, Breadcrumb, SectionHeader, Divider } from "@/components/ui/Navigation";
import { Badge, VerdictBadge, PlanBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, CardHeader, CardSection, StatCard, MetricRow } from "@/components/ui/Card";
import { Tabs, TabContent, ChipFilters } from "@/components/ui/Tabs";
import { Button, IconButton } from "@/components/ui/Button";
import { InfoTooltip, JargonTooltip } from "@/components/ui/Tooltip";

// Data
import { DataTable } from "@/components/data/DataTable";
import { ReturnValue, ReturnWithLabel, ChangeIndicator, PercentileRank } from "@/components/data/ReturnDisplay";

// Domain
import { RiskOMeter } from "@/components/domain/RiskOMeter";
import { FundManagerCard } from "@/components/domain/FundManagerCard";
import { SIPCalculatorWidget } from "@/components/domain/SIPCalculatorWidget";

// Charts
import { NAVChart } from "@/components/charts/NAVChart";
import { AllocationPieChart, MarketCapBar } from "@/components/charts/PieChart";
import { YearReturnsChart } from "@/components/charts/BarChart";
import { DrawdownChart } from "@/components/charts/AdvancedCharts";
import { RollingReturnChart } from "@/components/charts/AdvancedCharts";

/*
 * SCHEME DETAIL PAGE
 * ──────────────────
 * The single most important page. Everything an investor needs
 * to decide whether to buy, hold, or run away.
 *
 * Tabs: Overview | Returns | Holdings | Risk | Manager | Costs | Verdict
 */

export default function SchemeDetailPage({ slug = "ppfas-flexi-cap" }: { slug?: string }) {
  const scheme = useMemo(() => getFundData(slug), [slug]);
  const peers = useMemo(() => getFundPeers(slug), [slug]);
  const yearReturns = useMemo(() => getFundYearReturns(slug), [slug]);
  const [activeTab, setActiveTab] = useState("overview");

  // Generate chart data seeded by NAV value for consistency per fund
  const navData = useMemo(() => generateNAVData(365 * 3, scheme.nav?.current ?? 45), [scheme.nav?.current]);
  const rollingData = useMemo(() => generateRollingReturns(), []);
  const drawdownData = useMemo(() => generateDrawdownData(), []);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "returns", label: "Returns" },
    { id: "holdings", label: "Holdings" },
    { id: "risk", label: "Risk" },
    { id: "manager", label: "Manager" },
    { id: "costs", label: "Costs & Tax" },
    { id: "verdict", label: "Verdict" },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/fund" />

      <PageLayout>
        {/* ═══ Page Header ═══ */}
        <PageHeader
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Explore", href: "/explore" },
            { label: scheme.category!, href: `/category/${scheme.category!.toLowerCase().replace(/\s+/g, "-")}` },
            { label: scheme.shortName || scheme.name! },
          ]}
          title={scheme.name!}
          subtitle={scheme.amcName}
          badges={
            <>
              <CategoryBadge category={scheme.category!} />
              <PlanBadge plan={scheme.plan!} />
              <RiskOMeter level={scheme.riskLevel!} variant="inline" />
              <VerdictBadge verdict={scheme.verdict?.rating!} />
            </>
          }
          actions={
            <>
              <Button variant="outline" size="sm" icon={<BookmarkIcon />}>
                Stalk This Fund
              </Button>
              <Button variant="primary" size="sm">
                Pit Against Others
              </Button>
            </>
          }
        />

        {/* ═══ Key Numbers Strip ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard
            label="NAV"
            value={`₹${formatNAV(scheme.nav?.current!)}`}
            subtext={`${scheme.nav?.dayChangePercent! >= 0 ? "+" : ""}${scheme.nav?.dayChangePercent!.toFixed(2)}% today`}
            trend={scheme.nav?.dayChangePercent! >= 0 ? "up" : "down"}
          />
          <StatCard
            label="AUM"
            value={formatAUM(scheme.aum!)}
            subtext="Total assets"
          />
          <StatCard
            label="3Y CAGR"
            value={formatPercent(scheme.returns?.["3Y"]!)}
            trend={scheme.returns?.["3Y"]! >= 0 ? "up" : "down"}
          />
          <StatCard
            label="Expense Ratio"
            value={`${scheme.ter!.toFixed(2)}%`}
            subtext="Direct plan"
          />
        </div>

        {/* ═══ Tab Navigation ═══ */}
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="underline"
          className="mb-8"
        />

        {/* ═══ OVERVIEW TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="overview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* NAV Chart — 2/3 width */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader title="NAV History" label="Performance" />
                <div className="mt-4">
                  <NAVChart
                    data={navData}
                    schemeName={scheme.shortName}
                    benchmarkName={scheme.benchmark}
                  />
                </div>
              </Card>
            </div>

            {/* Key Facts — 1/3 width */}
            <div className="space-y-4">
              <Card padding="md">
                <CardHeader title="Key Facts" />
                <div className="mt-3">
                  <MetricRow label="AMC" value={scheme.amcName} />
                  <MetricRow label="Category" value={scheme.category} />
                  <MetricRow label="Benchmark" value={scheme.benchmark} />
                  <MetricRow label="Launch Date" value={formatDate(scheme.launchDate!)} />
                  <MetricRow label="AMFI Code" value={<span className="font-mono text-xs">{scheme.amfiCode}</span>} />
                  <MetricRow label="ISIN" value={<span className="font-mono text-xs">{scheme.isin}</span>} />
                  <MetricRow label="Risk Level" value={<RiskOMeter level={scheme.riskLevel!} variant="compact" />} />
                </div>
              </Card>

              {/* Fund Managers (compact) */}
              <Card padding="md">
                <CardHeader title="Fund Managers" />
                <div className="mt-3 space-y-3">
                  {scheme.fundManagers!.map((mgr, i) => (
                    <FundManagerCard
                      key={i}
                      name={mgr.name!}
                      amcName={scheme.amcName!}
                      tenureOnFund={mgr.tenure}
                      fundsManaged={mgr.fundsManaged!}
                      variant="inline"
                    />
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Quick Returns Table */}
          <Card padding="lg" className="mt-6">
            <CardHeader title="Returns" label="Performance" action={
              <Button variant="ghost" size="sm" onClick={() => setActiveTab("returns")}>
                Detailed →
              </Button>
            } />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-cream-300">
                    <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Period</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Fund</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Benchmark</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Category</th>
                    <th className="text-right text-xs font-semibold uppercase tracking-wider text-ink-400 pb-2">Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {scheme.returnsTable!.map((row) => (
                    <tr key={row.period} className="border-b border-cream-200 last:border-0">
                      <td className="py-2.5 text-sm font-medium text-ink-700">{row.period}</td>
                      <td className="py-2.5 text-right"><ReturnValue value={row.fund} size="sm" /></td>
                      <td className="py-2.5 text-right"><ReturnValue value={row.benchmark} size="sm" showSign={false} /></td>
                      <td className="py-2.5 text-right"><ReturnValue value={row.categoryAvg} size="sm" showSign={false} /></td>
                      <td className="py-2.5 text-right">
                        {row.rank ? <PercentileRank rank={100 - row.rank} /> : <span className="text-xs text-ink-300">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabContent>

        {/* ═══ RETURNS TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="returns">
          <div className="space-y-8">
            {/* Year-by-Year */}
            <Card padding="lg">
              <CardHeader title="Calendar Year Returns" label="Annual" />
              <div className="mt-4">
                <YearReturnsChart data={yearReturns} />
              </div>
            </Card>

            {/* Rolling Returns */}
            <Card padding="lg">
              <CardHeader title="Rolling Returns" label="Consistency" />
              <div className="mt-4">
                <RollingReturnChart
                  data={rollingData}
                  window="3Y"
                  stats={{
                    best: 42.8,
                    worst: -4.2,
                    median: 18.5,
                    current: 18.2,
                    percentNegative: 4.2,
                    percentBeatBenchmark: 72.5,
                  }}
                  benchmarkName={scheme.benchmark}
                />
              </div>
            </Card>

            {/* SIP Calculator */}
            <SIPCalculatorWidget
              defaultReturn={scheme.returns?.["3Y"]!}
              fundName={scheme.shortName}
            />
          </div>
        </TabContent>

        {/* ═══ HOLDINGS TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="holdings">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Holdings Table */}
            <div className="lg:col-span-2">
              <Card padding="lg">
                <CardHeader title="Top 10 Holdings" label="Portfolio" subtitle="As of May 2025 factsheet" />
                <div className="mt-4">
                  <DataTable
                    columns={[
                      { key: "name", label: "Stock", sortable: true, sticky: true, minWidth: "180px",
                        render: (v, row) => (
                          <div>
                            <p className="text-sm font-medium text-ink-900">{v}</p>
                            <p className="text-2xs text-ink-400">{row.sector}</p>
                          </div>
                        )
                      },
                      { key: "weight", label: "Weight", sortable: true, align: "right",
                        render: (v) => <span className="font-mono text-sm tabular-nums">{v.toFixed(1)}%</span>
                      },
                      { key: "change", label: "Change", align: "right",
                        render: (_, row) => <ChangeIndicator type={row.type} amount={Math.abs(row.change)} />
                      },
                    ]}
                    data={scheme.topHoldings!}
                    keyField="name"
                    compact
                  />
                </div>
              </Card>
            </div>

            {/* Allocation charts */}
            <div className="space-y-4">
              <Card padding="md">
                <AllocationPieChart
                  data={scheme.sectorAllocation!}
                  title="Sector Allocation"
                  donut
                />
              </Card>

              <Card padding="md">
                <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                  Market Cap Split
                </h4>
                <MarketCapBar
                  large={scheme.marketCap!.large}
                  mid={scheme.marketCap!.mid}
                  small={scheme.marketCap!.small}
                />
                <p className="mt-3 text-xs text-ink-400 italic">
                  {scheme.marketCap!.foreign > 0 && `${scheme.marketCap!.foreign}% in international equities`}
                </p>
              </Card>
            </div>
          </div>
        </TabContent>

        {/* ═══ RISK TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="risk">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card padding="lg">
                <CardHeader title="Risk-O-Meter" />
                <div className="mt-4">
                  <RiskOMeter level={scheme.riskLevel!} variant="full" showTake />
                </div>
              </Card>

              <Card padding="lg">
                <CardHeader title="Risk Metrics" />
                <div className="mt-3">
                  <MetricRow label={<><JargonTooltip term="Sharpe Ratio" explanation="Risk-adjusted returns. Did the rollercoaster actually go anywhere?">Sharpe (3Y)</JargonTooltip></>} value={<span className="font-mono">{scheme.riskMetrics!.sharpe["3Y"]}</span>} />
                  <MetricRow label={<><JargonTooltip term="Alpha" explanation="Excess return vs benchmark. Positive = the manager earns their paycheck.">Alpha (3Y)</JargonTooltip></>} value={<ReturnValue value={scheme.riskMetrics!.alpha["3Y"]} size="sm" />} />
                  <MetricRow label={<><JargonTooltip term="Beta" explanation="How much this fund panics when the market panics. <1 = calmer.">Beta</JargonTooltip></>} value={<span className="font-mono">{scheme.riskMetrics!.beta}</span>} />
                  <MetricRow label="Std Deviation (3Y)" value={<span className="font-mono">{scheme.riskMetrics!.standardDeviation["3Y"]}%</span>} />
                  <MetricRow label={<><JargonTooltip term="Upside Capture" explanation="Does it keep up when the market goes up? 100% = fully.">Upside Capture</JargonTooltip></>} value={<span className="font-mono">{scheme.riskMetrics!.upsideCapture}%</span>} />
                  <MetricRow label={<><JargonTooltip term="Downside Capture" explanation="Does it bleed as much as the market? Lower = tougher.">Downside Capture</JargonTooltip></>} value={<span className="font-mono">{scheme.riskMetrics!.downsideCapture}%</span>} />
                </div>
              </Card>
            </div>

            {/* Drawdown Chart */}
            <Card padding="lg">
              <CardHeader title="Drawdown Analysis" label="Worst Case" />
              <div className="mt-4">
                <DrawdownChart
                  data={drawdownData}
                  maxDrawdown={scheme.riskMetrics!.maxDrawdown.amount}
                  maxDrawdownDate={scheme.riskMetrics!.maxDrawdown.troughDate}
                  recoveryDays={scheme.riskMetrics!.maxDrawdown.daysToRecover}
                />
              </div>
            </Card>

            {/* Peer Comparison */}
            <Card padding="lg">
              <CardHeader title="Peer Comparison" label="How it stacks up" />
              <div className="mt-4">
                <DataTable
                  columns={[
                    { key: "name", label: "Fund", sortable: true, sticky: true, minWidth: "160px",
                      render: (v, row) => (
                        <span className={cn("text-sm", row.id === "ppfas-flexi" ? "font-semibold text-sage-700" : "text-ink-900")}>
                          {v}
                        </span>
                      )
                    },
                    { key: "aum", label: "AUM", sortable: true, align: "right",
                      render: (v) => <span className="font-mono text-xs">{formatAUM(v)}</span>
                    },
                    { key: "return1Y", label: "1Y", sortable: true, align: "right",
                      render: (v) => <ReturnValue value={v} size="sm" />
                    },
                    { key: "return3Y", label: "3Y", sortable: true, align: "right",
                      render: (v) => <ReturnValue value={v} size="sm" />
                    },
                    { key: "ter", label: "TER", sortable: true, align: "right",
                      render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}%</span>
                    },
                    { key: "sharpe", label: "Sharpe", sortable: true, align: "right",
                      render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}</span>
                    },
                  ]}
                  data={peers}
                  keyField="id"
                  highlightRow={(row) => row.id === scheme.id}
                  compact
                />
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ MANAGER TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="manager">
          <div className="space-y-6">
            {scheme.fundManagers!.map((mgr, i) => (
              <FundManagerCard
                key={i}
                name={mgr.name!}
                qualifications={mgr.qualifications}
                amcName={scheme.amcName!}
                tenureOnFund={mgr.tenure}
                totalAUM={mgr.totalAUM}
                fundsManaged={mgr.fundsManaged!}
                averageAlpha={scheme.riskMetrics!.alpha["3Y"]}
                boredfolioTake={i === 0 ? "Rajeev Thakkar is the Warren Buffett of Indian mutual funds — minus the Coca-Cola obsession, plus a genuine understanding of global markets." : undefined}
                variant="default"
              />
            ))}
          </div>
        </TabContent>

        {/* ═══ COSTS TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="costs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card padding="lg">
              <CardHeader title="Expense Ratio" label="What You Pay" />
              <div className="mt-3">
                <MetricRow label="TER (Direct)" value={<span className="font-mono text-lg font-semibold text-sage-600">{scheme.ter}%</span>} />
                <MetricRow label="TER (Regular)" value={<span className="font-mono">1.42%</span>} />
                <MetricRow label="Distributor Commission" value={<span className="font-mono text-ugly-500">0.79%</span>} />
                <MetricRow label="Category Avg TER" value={<span className="font-mono">0.82%</span>} />
              </div>
              <CardSection title="Hidden Cost Calculator">
                <p className="text-sm text-ink-700 leading-relaxed">
                  On a ₹10L investment over <span className="font-semibold">20 years</span> at 15% CAGR:
                </p>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div className="bg-good-50 rounded-md p-3">
                    <span className="text-2xs text-good-600 font-semibold uppercase tracking-wider">Direct Plan</span>
                    <p className="font-mono text-lg font-semibold text-good-700 mt-1">₹1.54 Cr</p>
                  </div>
                  <div className="bg-ugly-50 rounded-md p-3">
                    <span className="text-2xs text-ugly-600 font-semibold uppercase tracking-wider">Regular Plan</span>
                    <p className="font-mono text-lg font-semibold text-ugly-700 mt-1">₹1.28 Cr</p>
                    <p className="text-2xs text-ugly-500 mt-0.5">You lose ₹26L to commissions</p>
                  </div>
                </div>
              </CardSection>
            </Card>

            <Card padding="lg">
              <CardHeader title="Tax Treatment" label="Know Before You Exit" />
              <div className="mt-3">
                <MetricRow label="Fund Type (Tax)" value="Equity" />
                <MetricRow label={`STCG (< 1 year)`} value={<span className="font-mono">20%</span>} />
                <MetricRow label={`LTCG (> 1 year)`} value={<span className="font-mono">{"12.5% above ₹1.25L"}</span>} />
                <MetricRow label="Exit Load" value={<span className="font-mono">{"1% if < 365 days"}</span>} />
                <MetricRow label="Lock-in" value="None" />
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ VERDICT TAB ═══ */}
        <TabContent activeTab={activeTab} tabId="verdict">
          <Card padding="lg">
            <div className="flex items-center gap-3 mb-6">
              <VerdictBadge verdict={scheme.verdict?.rating!} />
              <h2 className="font-serif text-2xl text-ink-900">The Boredfolio Verdict</h2>
            </div>

            <p className="text-base text-ink-700 leading-relaxed mb-6">
              {scheme.verdict?.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-good-50 border border-good-100 rounded-lg p-5">
                <h3 className="font-serif text-base text-good-700 mb-3">The Good</h3>
                <ul className="space-y-2">
                  {scheme.verdict?.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-good-800">
                      <span className="text-good-500 mt-0.5 shrink-0">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-ugly-50 border border-ugly-100 rounded-lg p-5">
                <h3 className="font-serif text-base text-ugly-700 mb-3">The Ugly</h3>
                <ul className="space-y-2">
                  {scheme.verdict?.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ugly-800">
                      <span className="text-ugly-500 mt-0.5 shrink-0">✗</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-cream-300">
              <div>
                <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-2">
                  Who Should Invest
                </h4>
                <p className="text-sm text-ink-700 leading-relaxed">{scheme.verdict?.whoShouldInvest}</p>
              </div>
              <div>
                <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-2">
                  Who Should Avoid
                </h4>
                <p className="text-sm text-ink-700 leading-relaxed">{scheme.verdict?.whoShouldAvoid}</p>
              </div>
            </div>

            {scheme.verdict?.alternatives && (
              <div className="mt-6 pt-6 border-t border-cream-300">
                <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                  Alternatives Worth Considering
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {scheme.verdict.alternatives.map((alt, i) => (
                    <Badge key={i} variant="outline">
                      {alt}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </TabContent>
      </PageLayout>

      <GlobalFooter />
      <MobileBottomNav currentPath="/fund" />
    </div>
  );
}

/* ── Icons ── */
function BookmarkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}
