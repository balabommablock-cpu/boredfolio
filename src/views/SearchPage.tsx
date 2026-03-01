"use client";

import React, { useState } from "react";
import { cn, formatAUM, formatPercent } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { Badge, VerdictBadge, CategoryBadge } from "@/components/ui/Badge";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Input";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/States";
import { ReturnValue } from "@/components/data/ReturnDisplay";

/*
 * SEARCH RESULTS PAGE
 * ───────────────────
 * Fast, smart search across the entire platform.
 * Grouped results: Schemes, AMCs, Categories, Blog
 */

interface SearchResult {
  type: "scheme" | "amc" | "category" | "blog";
  id: string;
  title: string;
  subtitle: string;
  meta?: Record<string, any>;
}

const MOCK_RESULTS: SearchResult[] = [
  // Schemes
  { type: "scheme", id: "ppfas-flexi", title: "Parag Parikh Flexi Cap Fund - Direct Growth", subtitle: "PPFAS MF · Flexi Cap",
    meta: { return3Y: 18.2, aum: 48000, ter: 0.63, verdict: "buy" } },
  { type: "scheme", id: "ppfas-conservative", title: "Parag Parikh Conservative Hybrid Fund - Direct Growth", subtitle: "PPFAS MF · Conservative Hybrid",
    meta: { return3Y: 9.8, aum: 2400, ter: 0.52, verdict: "hold" } },
  { type: "scheme", id: "ppfas-liquid", title: "Parag Parikh Liquid Fund - Direct Growth", subtitle: "PPFAS MF · Liquid",
    meta: { return3Y: 6.2, aum: 4800, ter: 0.18, verdict: "hold" } },
  // AMC
  { type: "amc", id: "ppfas-mf", title: "PPFAS Mutual Fund", subtitle: "3 schemes · ₹58,000 Cr AUM · Est. 2013",
    meta: { schemeCount: 3, aum: 58000 } },
  // Categories
  { type: "category", id: "flexi-cap", title: "Flexi Cap", subtitle: "38 funds · ₹3.12L Cr AUM",
    meta: { fundCount: 38 } },
  // Blog
  { type: "blog", id: "blog-ppfas-review", title: "Why PPFAS Flexi Cap Remains Our Top Pick", subtitle: "Analysis · 8 min read · May 24, 2025",
    meta: { category: "Analysis", readTime: 8 } },
];

const TYPE_LABELS: Record<string, string> = {
  scheme: "Funds",
  amc: "Fund Houses",
  category: "Categories",
  blog: "Articles",
};

const TYPE_ORDER = ["scheme", "amc", "category", "blog"];

export default function SearchPage() {
  const [query, setQuery] = useState("Parag Parikh");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activeFilter === "all"
    ? MOCK_RESULTS
    : MOCK_RESULTS.filter((r) => r.type === activeFilter);

  const grouped = TYPE_ORDER.reduce<Record<string, SearchResult[]>>((acc, type) => {
    const items = filtered.filter((r) => r.type === type);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {});

  const typeCounts = TYPE_ORDER.reduce<Record<string, number>>((acc, type) => {
    acc[type] = MOCK_RESULTS.filter((r) => r.type === type).length;
    return acc;
  }, {});

  const filterTabs = [
    { id: "all", label: `All (${MOCK_RESULTS.length})` },
    ...TYPE_ORDER.filter((t) => typeCounts[t] > 0).map((t) => ({
      id: t,
      label: `${TYPE_LABELS[t]} (${typeCounts[t]})`,
    })),
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/" />
      <PageLayout variant="narrow">
        {/* Search bar */}
        <div className="py-6">
          <SearchBar value={query} onChange={setQuery} placeholder="Search funds, AMCs, categories..." size="lg" />
        </div>

        {/* Type filters */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {filterTabs.map((t) => (
            <button key={t.id} onClick={() => setActiveFilter(t.id)}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeFilter === t.id ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-600 hover:bg-cream-300")}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Results */}
        {Object.keys(grouped).length === 0 ? (
          <EmptyState
            title="No results found"
            message={`We couldn't find anything matching "${query}". Try a different search term.`}
          />
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([type, results]) => (
              <section key={type}>
                <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
                  {TYPE_LABELS[type]} ({results.length})
                </h2>
                <div className="space-y-2">
                  {results.map((result) => (
                    <SearchResultCard key={result.id} result={result} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Recent Searches */}
        <div className="mt-12 pt-8 border-t border-cream-300">
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">Recent Searches</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {["HDFC Mid-Cap", "Small Cap funds", "PPFAS", "ELSS comparison", "Nifty 50 index"].map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="px-3 py-1.5 rounded-md bg-cream-50 border border-cream-300 text-xs text-ink-600 hover:bg-cream-200 transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/" />
    </div>
  );
}

function SearchResultCard({ result }: { result: SearchResult }) {
  const { type, title, subtitle, meta } = result;

  return (
    <Card hover padding="md" onClick={() => {}}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <TypeIcon type={type} />
            <h3 className="text-sm font-medium text-ink-900 line-clamp-1">{title}</h3>
          </div>
          <p className="text-xs text-ink-500">{subtitle}</p>
        </div>

        {/* Type-specific meta */}
        {type === "scheme" && meta && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right">
              <ReturnValue value={meta.return3Y} size="sm" />
              <p className="text-2xs text-ink-400">3Y CAGR</p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="font-mono text-xs text-ink-600">{formatAUM(meta.aum)}</span>
              <p className="text-2xs text-ink-400">AUM</p>
            </div>
            <VerdictBadge verdict={meta.verdict} />
          </div>
        )}
        {type === "amc" && meta && (
          <div className="text-right shrink-0">
            <span className="font-mono text-xs text-ink-600">{formatAUM(meta.aum)}</span>
            <p className="text-2xs text-ink-400">{meta.schemeCount} schemes</p>
          </div>
        )}
        {type === "category" && meta && (
          <Badge variant="sage" size="sm">{meta.fundCount} funds</Badge>
        )}
        {type === "blog" && meta && (
          <Badge variant={(meta.category === "Analysis" ? "sage" : "outline") as any} size="sm">
            {meta.category}
          </Badge>
        )}
      </div>
    </Card>
  );
}

function TypeIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    scheme: "📊",
    amc: "🏢",
    category: "📁",
    blog: "📝",
  };
  return <span className="text-xs">{icons[type] || "📄"}</span>;
}
