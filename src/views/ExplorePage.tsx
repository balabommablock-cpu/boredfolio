"use client";

import React, { useState, useMemo, useCallback } from "react";
import { cn, formatAUM, formatPercent, BRAND_COLORS } from "@/lib/utils";

// Layout
import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";

// UI
import { PageHeader } from "@/components/ui/Navigation";
import { Badge, VerdictBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, SearchBar } from "@/components/ui/Input";

// Data
import { DataTable } from "@/components/data/DataTable";
import { ReturnValue } from "@/components/data/ReturnDisplay";

// Domain
import { CompareTray } from "@/components/domain/CompareTray";

/*
 * EXPLORE / SCREENER PAGE
 * ───────────────────────
 * Filter and discover funds based on any criteria.
 * Pre-built screens + advanced filters + sortable results.
 */

const MOCK_FUNDS = [
  { id: "ppfas-flexi", shortName: "PPFAS Flexi Cap", amc: "PPFAS MF", category: "Flexi Cap", broadCategory: "Equity", aum: 48000, return1Y: 24.5, return3Y: 18.2, return5Y: 21.1, ter: 0.63, sharpe: 1.14, riskLevel: 4, verdict: "buy" as const },
  { id: "hdfc-flexi", shortName: "HDFC Flexi Cap", amc: "HDFC AMC", category: "Flexi Cap", broadCategory: "Equity", aum: 38600, return1Y: 19.8, return3Y: 17.5, return5Y: 18.9, ter: 0.77, sharpe: 1.02, riskLevel: 4, verdict: "hold" as const },
  { id: "mirae-large", shortName: "Mirae Large Cap", amc: "Mirae Asset MF", category: "Large Cap", broadCategory: "Equity", aum: 35200, return1Y: 18.2, return3Y: 14.8, return5Y: 16.5, ter: 0.53, sharpe: 0.98, riskLevel: 4, verdict: "buy" as const },
  { id: "quant-small", shortName: "Quant Small Cap", amc: "Quant MF", category: "Small Cap", broadCategory: "Equity", aum: 22800, return1Y: 32.4, return3Y: 35.8, return5Y: 42.1, ter: 0.64, sharpe: 1.42, riskLevel: 5, verdict: "hold" as const },
  { id: "axis-small", shortName: "Axis Small Cap", amc: "Axis AMC", category: "Small Cap", broadCategory: "Equity", aum: 18400, return1Y: 26.8, return3Y: 24.2, return5Y: 28.5, ter: 0.68, sharpe: 1.18, riskLevel: 5, verdict: "buy" as const },
  { id: "kotak-flexi", shortName: "Kotak Flexicap", amc: "Kotak AMC", category: "Flexi Cap", broadCategory: "Equity", aum: 42100, return1Y: 20.4, return3Y: 15.2, return5Y: 17.8, ter: 0.59, sharpe: 0.92, riskLevel: 4, verdict: "hold" as const },
  { id: "hdfc-mid", shortName: "HDFC Mid-Cap", amc: "HDFC AMC", category: "Mid Cap", broadCategory: "Equity", aum: 52400, return1Y: 28.6, return3Y: 26.4, return5Y: 24.8, ter: 0.82, sharpe: 1.22, riskLevel: 5, verdict: "buy" as const },
  { id: "sbi-contra", shortName: "SBI Contra", amc: "SBI MF", category: "Contra", broadCategory: "Equity", aum: 28500, return1Y: 22.1, return3Y: 28.5, return5Y: 26.2, ter: 0.72, sharpe: 1.35, riskLevel: 4, verdict: "buy" as const },
  { id: "hdfc-baf", shortName: "HDFC BAF", amc: "HDFC AMC", category: "Balanced Advantage", broadCategory: "Hybrid", aum: 62500, return1Y: 15.8, return3Y: 16.4, return5Y: 18.2, ter: 0.74, sharpe: 1.08, riskLevel: 3, verdict: "buy" as const },
  { id: "icici-short", shortName: "ICICI Short Term", amc: "ICICI Pru AMC", category: "Short Duration", broadCategory: "Debt", aum: 18200, return1Y: 7.8, return3Y: 6.9, return5Y: 7.1, ter: 0.36, sharpe: 2.45, riskLevel: 2, verdict: "buy" as const },
  { id: "mo-nifty50", shortName: "MO Nifty 50", amc: "Motilal Oswal AMC", category: "Index – Large Cap", broadCategory: "Index", aum: 5200, return1Y: 17.8, return3Y: 13.5, return5Y: 16.0, ter: 0.10, sharpe: 0.95, riskLevel: 4, verdict: "buy" as const },
  { id: "uti-nifty", shortName: "UTI Nifty 50", amc: "UTI AMC", category: "Index – Large Cap", broadCategory: "Index", aum: 14800, return1Y: 17.6, return3Y: 13.4, return5Y: 15.9, ter: 0.18, sharpe: 0.94, riskLevel: 4, verdict: "buy" as const },
  { id: "mirae-elss", shortName: "Mirae ELSS", amc: "Mirae Asset MF", category: "ELSS", broadCategory: "Equity", aum: 22600, return1Y: 21.4, return3Y: 17.2, return5Y: 19.8, ter: 0.58, sharpe: 1.05, riskLevel: 4, verdict: "buy" as const },
  { id: "hdfc-liquid", shortName: "HDFC Liquid", amc: "HDFC AMC", category: "Liquid", broadCategory: "Debt", aum: 45200, return1Y: 7.2, return3Y: 6.4, return5Y: 5.8, ter: 0.20, sharpe: 8.50, riskLevel: 1, verdict: "hold" as const },
  { id: "nippon-small", shortName: "Nippon Small Cap", amc: "Nippon India MF", category: "Small Cap", broadCategory: "Equity", aum: 46200, return1Y: 25.4, return3Y: 30.2, return5Y: 34.5, ter: 0.78, sharpe: 1.28, riskLevel: 5, verdict: "hold" as const },
  { id: "canara-elss", shortName: "Canara ELSS", amc: "Canara Robeco AMC", category: "ELSS", broadCategory: "Equity", aum: 8200, return1Y: 20.8, return3Y: 18.5, return5Y: 20.2, ter: 0.62, sharpe: 1.12, riskLevel: 4, verdict: "buy" as const },
];

const PREBUILT_SCREENS = [
  { id: "consistent", label: "Consistent Compounders", emoji: "📈", desc: "Beat benchmark in 80%+ rolling periods" },
  { id: "lowcost", label: "Cheapest That Don't Suck", emoji: "💰", desc: "Lowest TER in each category" },
  { id: "hidden", label: "Hidden Gems", emoji: "💎", desc: "Small AUM, high alpha" },
  { id: "avoid", label: "Avoid These", emoji: "🚩", desc: "High TER, underperform" },
  { id: "manager", label: "New Manager Alert", emoji: "🔄", desc: "Recent manager changes" },
];

const BROAD_CATS = ["All", "Equity", "Debt", "Hybrid", "Index"];
const SUB_CATS: Record<string, string[]> = {
  Equity: ["Large Cap", "Mid Cap", "Small Cap", "Flexi Cap", "ELSS", "Contra"],
  Debt: ["Liquid", "Short Duration", "Corporate Bond", "Gilt"],
  Hybrid: ["Balanced Advantage", "Aggressive Hybrid"],
  Index: ["Index – Large Cap", "Index – Mid Cap"],
};

type Fund = typeof MOCK_FUNDS[0];

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [broadCat, setBroadCat] = useState("All");
  const [subCat, setSubCat] = useState("");
  const [screen, setScreen] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [compareList, setCompareList] = useState<{ id: string; name: string }[]>([]);
  const [filters, setFilters] = useState({ minReturn1Y: "", maxTER: "", minAUM: "", minSharpe: "" });
  const [sortKey, setSortKey] = useState<keyof Fund>("aum");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let r = [...MOCK_FUNDS];
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((f) => f.shortName.toLowerCase().includes(q) || f.amc.toLowerCase().includes(q) || f.category.toLowerCase().includes(q));
    }
    if (broadCat !== "All") r = r.filter((f) => f.broadCategory === broadCat);
    if (subCat) r = r.filter((f) => f.category === subCat);
    if (screen === "lowcost") r = r.filter((f) => f.ter <= 0.65);
    if (screen === "consistent") r = r.filter((f) => f.sharpe >= 1.1);
    if (screen === "hidden") r = r.filter((f) => f.aum < 25000 && f.sharpe >= 1.0);
    if (screen === "avoid") r = r.filter((f) => f.ter > 0.75);
    if (filters.minReturn1Y) r = r.filter((f) => f.return1Y >= +filters.minReturn1Y);
    if (filters.maxTER) r = r.filter((f) => f.ter <= +filters.maxTER);
    if (filters.minAUM) r = r.filter((f) => f.aum >= +filters.minAUM);
    if (filters.minSharpe) r = r.filter((f) => f.sharpe >= +filters.minSharpe);

    r.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "desc" ? bv - av : av - bv;
      return 0;
    });
    return r;
  }, [query, broadCat, subCat, screen, filters, sortKey, sortDir]);

  const toggleCompare = (f: Fund) => {
    setCompareList((prev) => {
      if (prev.find((x) => x.id === f.id)) return prev.filter((x) => x.id !== f.id);
      if (prev.length >= 5) return prev;
      return [...prev, { id: f.id, name: f.shortName }];
    });
  };

  const subs = SUB_CATS[broadCat] || [];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/explore" />
      <PageLayout>
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Explore" }]}
          title="The Screener"
          subtitle="Find something. Roast it. Compare it to something less terrible."
        />

        {/* Pre-Built Screens */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {PREBUILT_SCREENS.map((s) => (
            <button
              key={s.id}
              onClick={() => setScreen(screen === s.id ? null : s.id)}
              className={cn(
                "text-left p-3 rounded-lg border transition-all",
                screen === s.id ? "border-sage-400 bg-sage-50 ring-1 ring-sage-400" : "border-cream-300 bg-cream-50 hover:border-cream-400"
              )}
            >
              <span className="text-lg">{s.emoji}</span>
              <p className="text-xs font-semibold text-ink-800 mt-1">{s.label}</p>
              <p className="text-2xs text-ink-400 mt-0.5 line-clamp-1">{s.desc}</p>
            </button>
          ))}
        </div>

        {/* Broad Category Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          {BROAD_CATS.map((cat) => (
            <button key={cat} onClick={() => { setBroadCat(cat); setSubCat(""); }}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                broadCat === cat ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-600 hover:bg-cream-300")}
            >{cat}</button>
          ))}
        </div>

        {subs.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            <button onClick={() => setSubCat("")}
              className={cn("px-2.5 py-1 rounded text-2xs font-medium transition-colors",
                !subCat ? "bg-sage-100 text-sage-700" : "bg-cream-100 text-ink-500 hover:bg-cream-200")}>
              All {broadCat}
            </button>
            {subs.map((s) => (
              <button key={s} onClick={() => setSubCat(subCat === s ? "" : s)}
                className={cn("px-2.5 py-1 rounded text-2xs font-medium transition-colors",
                  subCat === s ? "bg-sage-100 text-sage-700" : "bg-cream-100 text-ink-500 hover:bg-cream-200")}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1"><SearchBar value={query} onChange={setQuery} placeholder="Search fund, AMC, category..." /></div>
          <Button variant={showFilters ? "primary" : "outline"} size="md" onClick={() => setShowFilters(!showFilters)}>
            Filters
          </Button>
        </div>

        {showFilters && (
          <Card padding="md" className="mb-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-2xs font-semibold uppercase tracking-wider text-ink-400 mb-1 block">Min 1Y Return (%)</label>
                <Input type="number" placeholder="e.g. 15" value={filters.minReturn1Y} onChange={(e) => setFilters({ ...filters, minReturn1Y: e.target.value })} size="sm" />
              </div>
              <div>
                <label className="text-2xs font-semibold uppercase tracking-wider text-ink-400 mb-1 block">Max TER (%)</label>
                <Input type="number" placeholder="e.g. 0.75" value={filters.maxTER} onChange={(e) => setFilters({ ...filters, maxTER: e.target.value })} size="sm" />
              </div>
              <div>
                <label className="text-2xs font-semibold uppercase tracking-wider text-ink-400 mb-1 block">Min AUM (₹ Cr)</label>
                <Input type="number" placeholder="e.g. 5000" value={filters.minAUM} onChange={(e) => setFilters({ ...filters, minAUM: e.target.value })} size="sm" />
              </div>
              <div>
                <label className="text-2xs font-semibold uppercase tracking-wider text-ink-400 mb-1 block">Min Sharpe</label>
                <Input type="number" placeholder="e.g. 1.0" value={filters.minSharpe} onChange={(e) => setFilters({ ...filters, minSharpe: e.target.value })} size="sm" />
              </div>
            </div>
            <div className="mt-3 text-right">
              <Button variant="ghost" size="sm" onClick={() => setFilters({ minReturn1Y: "", maxTER: "", minAUM: "", minSharpe: "" })}>Clear All</Button>
            </div>
          </Card>
        )}

        {/* Results Count */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-700">{filtered.length}</span> funds
            {screen && (
              <Badge variant="sage" size="sm" className="ml-2">
                {PREBUILT_SCREENS.find((s) => s.id === screen)?.label}
                <button onClick={() => setScreen(null)} className="ml-1 opacity-50 hover:opacity-100">✕</button>
              </Badge>
            )}
          </p>
          <select value={sortKey} onChange={(e) => { setSortKey(e.target.value as keyof Fund); setSortDir("desc"); }}
            className="text-xs bg-cream-50 border border-cream-300 rounded px-2 py-1 text-ink-700 focus:outline-none focus:border-sage-400">
            <option value="aum">AUM</option>
            <option value="return1Y">1Y Return</option>
            <option value="return3Y">3Y Return</option>
            <option value="return5Y">5Y Return</option>
            <option value="ter">TER</option>
            <option value="sharpe">Sharpe</option>
          </select>
        </div>

        {/* Results Table */}
        <Card padding="none">
          <DataTable
            columns={[
              { key: "shortName", label: "Fund", sortable: true, sticky: true, minWidth: "200px",
                render: (_, row) => (
                  <div className="py-1">
                    <p className="text-sm font-medium text-ink-900">{row.shortName}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-2xs text-ink-400">{row.amc}</span>
                      <CategoryBadge category={row.category} />
                    </div>
                  </div>
                ),
              },
              { key: "aum", label: "AUM", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{formatAUM(v)}</span> },
              { key: "return1Y", label: "1Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
              { key: "return3Y", label: "3Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
              { key: "return5Y", label: "5Y", sortable: true, align: "right", render: (v) => <ReturnValue value={v} size="sm" /> },
              { key: "ter", label: "TER", sortable: true, align: "right",
                render: (v) => <span className={cn("font-mono text-xs", v > 1 ? "text-ugly-500" : v < 0.5 ? "text-good-600" : "text-ink-700")}>{v.toFixed(2)}%</span> },
              { key: "sharpe", label: "Sharpe", sortable: true, align: "right", render: (v) => <span className="font-mono text-xs">{v.toFixed(2)}</span> },
              { key: "verdict", label: "", align: "center",
                render: (v, row) => (
                  <div className="flex items-center gap-1">
                    <VerdictBadge verdict={v} />
                    <button onClick={(e) => { e.stopPropagation(); toggleCompare(row); }}
                      className={cn("w-6 h-6 rounded flex items-center justify-center text-xs transition-colors",
                        compareList.find((f) => f.id === row.id) ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-400 hover:bg-cream-300")}
                      title="Compare">⊕</button>
                  </div>
                ),
              },
            ]}
            data={filtered}
            keyField="id"
            compact
          />
        </Card>
      </PageLayout>

      <GlobalFooter />
      <MobileBottomNav currentPath="/explore" />
      {compareList.length > 0 && (
        <CompareTray funds={compareList} onRemove={(id) => setCompareList((p) => p.filter((f) => f.id !== id))} onClear={() => setCompareList([])} onCompare={() => {}} />
      )}
    </div>
  );
}
