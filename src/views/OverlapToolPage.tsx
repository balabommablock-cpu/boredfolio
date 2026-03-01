"use client";

import React, { useState, useMemo } from "react";
import { cn, formatPercent, BRAND_COLORS } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, SectionHeader, Divider } from "@/components/ui/Navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard, MetricRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar, Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/States";
import { OverlapMatrix } from "@/components/charts/HeatmapGrid";
import { AllocationPieChart, MarketCapBar } from "@/components/charts/PieChart";

/*
 * PORTFOLIO OVERLAP TOOL
 * ──────────────────────
 * "Are your 7 mutual funds actually just 3 portfolios?"
 * Exposes hidden redundancy in investor portfolios.
 */

interface FundForOverlap {
  id: string;
  name: string;
  weight: number; // % allocation
  topStocks: { name: string; weight: number }[];
  sectors: { name: string; value: number }[];
  marketCap: { large: number; mid: number; small: number };
}

const PRESET_FUNDS: FundForOverlap[] = [
  {
    id: "ppfas", name: "PPFAS Flexi Cap", weight: 25,
    topStocks: [
      { name: "HDFC Bank", weight: 7.2 }, { name: "ICICI Bank", weight: 4.9 }, { name: "ITC", weight: 3.8 },
      { name: "Bajaj Holdings", weight: 5.1 }, { name: "Power Grid", weight: 4.2 }, { name: "Coal India", weight: 3.5 },
      { name: "Alphabet", weight: 5.8 }, { name: "Amazon", weight: 4.5 }, { name: "Microsoft", weight: 3.2 },
      { name: "Maruti Suzuki", weight: 2.9 },
    ],
    sectors: [{ name: "Banking", value: 24.5 }, { name: "Tech", value: 18.2 }, { name: "Consumer", value: 12.8 }, { name: "Others", value: 44.5 }],
    marketCap: { large: 62, mid: 18, small: 8 },
  },
  {
    id: "hdfc-flexi", name: "HDFC Flexi Cap", weight: 25,
    topStocks: [
      { name: "HDFC Bank", weight: 8.5 }, { name: "ICICI Bank", weight: 6.2 }, { name: "ITC", weight: 5.1 },
      { name: "Infosys", weight: 4.8 }, { name: "Bharti Airtel", weight: 4.2 }, { name: "Axis Bank", weight: 3.8 },
      { name: "SBI", weight: 3.5 }, { name: "TCS", weight: 3.2 }, { name: "Reliance", weight: 2.9 },
      { name: "L&T", weight: 2.6 },
    ],
    sectors: [{ name: "Banking", value: 28.2 }, { name: "Tech", value: 10.4 }, { name: "FMCG", value: 11.5 }, { name: "Others", value: 49.9 }],
    marketCap: { large: 72, mid: 20, small: 8 },
  },
  {
    id: "kotak-flexi", name: "Kotak Flexicap", weight: 20,
    topStocks: [
      { name: "ICICI Bank", weight: 7.8 }, { name: "HDFC Bank", weight: 6.4 }, { name: "Infosys", weight: 5.2 },
      { name: "TCS", weight: 4.5 }, { name: "Reliance", weight: 4.1 }, { name: "Bharti Airtel", weight: 3.8 },
      { name: "SBI", weight: 3.2 }, { name: "Axis Bank", weight: 2.8 }, { name: "Maruti Suzuki", weight: 2.5 },
      { name: "HUL", weight: 2.2 },
    ],
    sectors: [{ name: "Banking", value: 26.8 }, { name: "Tech", value: 14.2 }, { name: "FMCG", value: 9.8 }, { name: "Others", value: 49.2 }],
    marketCap: { large: 68, mid: 22, small: 10 },
  },
  {
    id: "hdfc-mid", name: "HDFC Mid-Cap Opp.", weight: 15,
    topStocks: [
      { name: "Max Healthcare", weight: 4.8 }, { name: "Indian Hotels", weight: 4.2 }, { name: "AU Small Finance", weight: 3.8 },
      { name: "Persistent Systems", weight: 3.5 }, { name: "Sundaram Finance", weight: 3.2 }, { name: "Balkrishna Ind", weight: 2.9 },
      { name: "Coforge", weight: 2.8 }, { name: "Voltas", weight: 2.5 }, { name: "APL Apollo", weight: 2.2 },
      { name: "CG Power", weight: 2.0 },
    ],
    sectors: [{ name: "Industrials", value: 22.4 }, { name: "Healthcare", value: 14.8 }, { name: "Tech", value: 12.1 }, { name: "Others", value: 50.7 }],
    marketCap: { large: 8, mid: 72, small: 20 },
  },
  {
    id: "axis-small", name: "Axis Small Cap", weight: 15,
    topStocks: [
      { name: "CCL Products", weight: 3.2 }, { name: "Brigade Enterprises", weight: 2.8 }, { name: "Cholamandalam Fin", weight: 2.5 },
      { name: "Supreme Industries", weight: 2.4 }, { name: "Cyient", weight: 2.2 }, { name: "Galaxy Surfactants", weight: 2.0 },
      { name: "Ratnamani Metals", weight: 1.8 }, { name: "KPIT Tech", weight: 1.7 }, { name: "Carborundum", weight: 1.5 },
      { name: "CG Power", weight: 1.4 },
    ],
    sectors: [{ name: "Industrials", value: 28.2 }, { name: "Consumer", value: 16.5 }, { name: "Tech", value: 11.8 }, { name: "Others", value: 43.5 }],
    marketCap: { large: 0, mid: 22, small: 78 },
  },
];

/* Compute overlap between two funds */
function computeOverlap(a: FundForOverlap, b: FundForOverlap): number {
  const aStocks = new Set(a.topStocks.map((s) => s.name));
  const bStocks = new Set(b.topStocks.map((s) => s.name));
  const common = [...aStocks].filter((s) => bStocks.has(s));
  const aWeight = a.topStocks.filter((s) => common.includes(s.name)).reduce((sum, s) => sum + s.weight, 0);
  const bWeight = b.topStocks.filter((s) => common.includes(s.name)).reduce((sum, s) => sum + s.weight, 0);
  return Math.round((aWeight + bWeight) / 2);
}

export default function OverlapToolPage() {
  const [selectedFunds, setSelectedFunds] = useState<FundForOverlap[]>(PRESET_FUNDS);

  const overlapPairs = useMemo(() => {
    const pairs: { fund1: string; fund2: string; value: number }[] = [];
    for (let i = 0; i < selectedFunds.length; i++) {
      for (let j = i + 1; j < selectedFunds.length; j++) {
        pairs.push({
          fund1: selectedFunds[i].name,
          fund2: selectedFunds[j].name,
          value: computeOverlap(selectedFunds[i], selectedFunds[j]),
        });
      }
    }
    return pairs;
  }, [selectedFunds]);

  // Consolidated portfolio
  const consolidated = useMemo(() => {
    const stockMap = new Map<string, number>();
    const sectorMap = new Map<string, number>();
    let totalLarge = 0, totalMid = 0, totalSmall = 0, totalWeight = 0;

    selectedFunds.forEach((fund) => {
      const w = fund.weight / 100;
      fund.topStocks.forEach((s) => {
        stockMap.set(s.name, (stockMap.get(s.name) || 0) + s.weight * w);
      });
      fund.sectors.forEach((s) => {
        sectorMap.set(s.name, (sectorMap.get(s.name) || 0) + s.value * w);
      });
      totalLarge += fund.marketCap.large * w;
      totalMid += fund.marketCap.mid * w;
      totalSmall += fund.marketCap.small * w;
      totalWeight += w;
    });

    const topStocks = [...stockMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([name, weight]) => ({ name, weight: Math.round(weight * 10) / 10 }));

    const sectors = [...sectorMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value: Math.round(value * 10) / 10 }));

    const uniqueStocks = new Set<string>();
    selectedFunds.forEach((f) => f.topStocks.forEach((s) => uniqueStocks.add(s.name)));

    // Effective portfolios (simple heuristic from avg overlap)
    const avgOverlap = overlapPairs.length > 0
      ? overlapPairs.reduce((s, p) => s + p.value, 0) / overlapPairs.length
      : 0;
    const effectivePortfolios = Math.max(1, selectedFunds.length * (1 - avgOverlap / 100));

    return {
      topStocks,
      sectors,
      large: Math.round(totalLarge),
      mid: Math.round(totalMid),
      small: Math.round(totalSmall),
      uniqueStockCount: uniqueStocks.size,
      effectivePortfolios: Math.round(effectivePortfolios * 10) / 10,
    };
  }, [selectedFunds, overlapPairs]);

  const highOverlapPairs = overlapPairs.filter((p) => p.value >= 25);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/tools" />
      <PageLayout>
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Portfolio Overlap" }]}
          title="Portfolio Overlap Tool"
          subtitle="Are your 7 mutual funds actually just 3 portfolios? Let's find out."
        />

        {/* Fund Selector */}
        <Card padding="md" className="mb-6">
          <CardHeader title="Your Funds" subtitle="Add 2-10 funds to analyze overlap" action={
            <Button variant="outline" size="sm">+ Add Fund</Button>
          } />
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {selectedFunds.map((f) => (
              <div key={f.id} className="flex items-center gap-2 bg-cream-50 border border-cream-300 rounded-md px-3 py-2">
                <span className="text-sm text-ink-800">{f.name}</span>
                <Input type="number" value={f.weight} onChange={() => {}} size="sm" className="w-16 text-center" />
                <span className="text-2xs text-ink-400">%</span>
                <button onClick={() => setSelectedFunds((p) => p.filter((x) => x.id !== f.id))}
                  className="text-ink-300 hover:text-ugly-500 text-sm ml-1">✕</button>
              </div>
            ))}
          </div>
        </Card>

        {/* ═══ Redundancy Score ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Funds Held" value={selectedFunds.length.toString()} />
          <StatCard label="Effective Portfolios" value={consolidated.effectivePortfolios.toFixed(1)}
            subtext={consolidated.effectivePortfolios < selectedFunds.length - 1 ? "Significant redundancy" : "Reasonably diversified"}
            trend={consolidated.effectivePortfolios < selectedFunds.length - 1 ? "down" : "up"} />
          <StatCard label="Unique Stocks" value={consolidated.uniqueStockCount.toString()} subtext="Across all funds" />
          <StatCard label="Avg Overlap" value={`${overlapPairs.length > 0 ? Math.round(overlapPairs.reduce((s, p) => s + p.value, 0) / overlapPairs.length) : 0}%`} />
        </div>

        {/* Redundancy verdict */}
        {consolidated.effectivePortfolios < selectedFunds.length - 1 && (
          <Card padding="md" className="mb-6 border-l-4 border-l-mustard-400">
            <p className="text-sm text-ink-700 leading-relaxed">
              <span className="font-semibold text-mustard-600">💡 Reality check:</span>{" "}
              Your <span className="font-semibold">{selectedFunds.length} funds</span> are effectively{" "}
              <span className="font-semibold">{consolidated.effectivePortfolios.toFixed(1)} unique portfolios</span>.
              {highOverlapPairs.length > 0 && (
                <> The biggest overlap is between {highOverlapPairs.sort((a, b) => b.value - a.value)[0].fund1} and{" "}
                  {highOverlapPairs.sort((a, b) => b.value - a.value)[0].fund2} at{" "}
                  <span className="font-semibold">{highOverlapPairs.sort((a, b) => b.value - a.value)[0].value}%</span>.
                  You're paying two expense ratios for largely the same stocks.</>
              )}
            </p>
          </Card>
        )}

        {/* ═══ Overlap Matrix ═══ */}
        <Card padding="lg" className="mb-6">
          <CardHeader title="Overlap Matrix" subtitle="Percentage of common holdings between each fund pair" />
          <div className="mt-4">
            <OverlapMatrix funds={selectedFunds.map((f) => ({ id: f.id, name: f.name }))} overlaps={overlapPairs.map(p => ({ fund1: p.fund1, fund2: p.fund2, overlap: p.value }))} />
          </div>
        </Card>

        {/* ═══ Consolidated Portfolio ═══ */}
        <SectionHeader title="Your Actual Portfolio" label="Consolidated" subtitle="If you own all these funds, this is what you really hold" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Top combined stocks */}
          <div className="lg:col-span-2">
            <Card padding="md">
              <CardHeader title="Top Holdings (Combined)" />
              <div className="mt-3 space-y-1.5">
                {consolidated.topStocks.map((stock, i) => {
                  const maxWeight = consolidated.topStocks[0].weight;
                  return (
                    <div key={stock.name} className="flex items-center gap-2">
                      <span className="text-2xs text-ink-400 w-5 text-right font-mono">{i + 1}</span>
                      <span className="text-sm text-ink-800 w-40 truncate">{stock.name}</span>
                      <div className="flex-1 h-4 bg-cream-200 rounded overflow-hidden">
                        <div className="h-full bg-sage-300 rounded" style={{ width: `${(stock.weight / maxWeight) * 100}%` }} />
                      </div>
                      <span className="font-mono text-xs text-ink-600 w-12 text-right">{stock.weight}%</span>
                    </div>
                  );
                })}
              </div>
              {consolidated.topStocks[0].weight > 6 && (
                <p className="text-xs text-ugly-500 mt-3 p-2 bg-ugly-50 rounded">
                  ⚠️ {consolidated.topStocks[0].name} is {consolidated.topStocks[0].weight}% of your combined portfolio.
                  That's concentration risk, not diversification.
                </p>
              )}
            </Card>
          </div>

          {/* Sector + Market Cap */}
          <div className="space-y-4">
            <Card padding="md">
              <AllocationPieChart data={consolidated.sectors.slice(0, 6)} title="Combined Sectors" donut />
            </Card>
            <Card padding="md">
              <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">Combined Market Cap</h4>
              <MarketCapBar large={consolidated.large} mid={consolidated.mid} small={consolidated.small} />
            </Card>
          </div>
        </div>

        {/* ═══ Suggestions ═══ */}
        {highOverlapPairs.length > 0 && (
          <Card padding="lg" className="mb-8">
            <CardHeader title="What You Could Do" label="Suggestions" />
            <div className="mt-4 space-y-3">
              {highOverlapPairs.sort((a, b) => b.value - a.value).slice(0, 3).map((pair, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-cream-50 rounded-md">
                  <span className="text-sage-500 font-semibold mt-0.5">→</span>
                  <p className="text-sm text-ink-700">
                    <span className="font-medium">{pair.fund1}</span> and <span className="font-medium">{pair.fund2}</span> overlap by{" "}
                    <span className="font-semibold">{pair.value}%</span>.
                    Consider keeping one and redirecting the SIP to a fund in a different category.
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/tools" />
    </div>
  );
}
