"use client";

import React, { useState, useMemo } from "react";
import { cn, formatAUM, formatPercent, BRAND_COLORS } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, SectionHeader } from "@/components/ui/Navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard, MetricRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Input";
import { FundManagerCard } from "@/components/domain/FundManagerCard";

/*
 * FUND MANAGER DIRECTORY
 * ──────────────────────
 * "You're not buying a fund. You're hiring a person."
 * Searchable database of fund managers with track records.
 */

interface Manager {
  id: string;
  name: string;
  photo: null;
  amc: string;
  tenure: string;
  tenureYears: number;
  totalAUM: number;
  fundsManaged: number;
  avgAlpha: number;
  bestFund: string;
  bestFundReturn3Y: number;
  specialization: string;
  take: string;
}

const MANAGERS: Manager[] = [
  {
    id: "rajeev-thakkar", name: "Rajeev Thakkar", photo: null, amc: "PPFAS MF",
    tenure: "11 years", tenureYears: 11, totalAUM: 48000, fundsManaged: 3, avgAlpha: 4.2,
    bestFund: "PPFAS Flexi Cap", bestFundReturn3Y: 18.2, specialization: "Global Value",
    take: "The Warren Buffett of Indian mutual funds. Genuinely contrarian, not just marketing-contrarian.",
  },
  {
    id: "chirag-setalvad", name: "Chirag Setalvad", photo: null, amc: "HDFC AMC",
    tenure: "18 years", tenureYears: 18, totalAUM: 142000, fundsManaged: 4, avgAlpha: 3.8,
    bestFund: "HDFC Mid-Cap Opportunities", bestFundReturn3Y: 26.4, specialization: "Mid Cap",
    take: "One of the most consistent mid-cap managers in India. His fund's track record speaks louder than any marketing material.",
  },
  {
    id: "sanjeev-sharma", name: "Sanjeev Sharma", photo: null, amc: "Quant MF",
    tenure: "6 years", tenureYears: 6, totalAUM: 85000, fundsManaged: 8, avgAlpha: 8.5,
    bestFund: "Quant Small Cap", bestFundReturn3Y: 35.8, specialization: "Quant / Momentum",
    take: "Spectacular returns but manages too many funds and portfolio turnover is extreme. High risk, high reward — literally.",
  },
  {
    id: "swarup-mohanty", name: "Swarup Mohanty", photo: null, amc: "Mirae Asset MF",
    tenure: "12 years", tenureYears: 12, totalAUM: 95000, fundsManaged: 5, avgAlpha: 2.8,
    bestFund: "Mirae Asset Large Cap", bestFundReturn3Y: 14.8, specialization: "Large Cap / Index+",
    take: "Boring in the best way. Consistently delivers slight outperformance over benchmarks without taking excessive risk.",
  },
  {
    id: "raunak-onkar", name: "Raunak Onkar", photo: null, amc: "PPFAS MF",
    tenure: "11 years", tenureYears: 11, totalAUM: 48000, fundsManaged: 3, avgAlpha: 4.2,
    bestFund: "PPFAS Flexi Cap", bestFundReturn3Y: 18.2, specialization: "Tech / US Markets",
    take: "Co-pilot to Rajeev Thakkar. Brings the international lens — particularly strong on US tech valuations.",
  },
  {
    id: "gopal-agrawal", name: "Gopal Agrawal", photo: null, amc: "HDFC AMC",
    tenure: "8 years", tenureYears: 8, totalAUM: 98000, fundsManaged: 3, avgAlpha: 2.4,
    bestFund: "HDFC Flexi Cap", bestFundReturn3Y: 17.5, specialization: "Flexi Cap / Multi Cap",
    take: "Solid but not spectacular. Benefits from HDFC's research team more than individual stock-picking brilliance.",
  },
  {
    id: "ankit-agarwal", name: "Ankit Agarwal", photo: null, amc: "Motilal Oswal AMC",
    tenure: "5 years", tenureYears: 5, totalAUM: 28000, fundsManaged: 4, avgAlpha: 5.2,
    bestFund: "Motilal Oswal Midcap", bestFundReturn3Y: 22.4, specialization: "QGLP / Growth",
    take: "Follows the QGLP (Quality, Growth, Longevity, Price) framework rigorously. Young but already proving himself.",
  },
  {
    id: "r-srinivasan", name: "R Srinivasan", photo: null, amc: "SBI MF",
    tenure: "15 years", tenureYears: 15, totalAUM: 68000, fundsManaged: 3, avgAlpha: 1.8,
    bestFund: "SBI Contra", bestFundReturn3Y: 28.5, specialization: "Contra / Value",
    take: "SBI Contra's strong run is impressive, but the AMC's overall equity track record is mixed. This is a manager bet, not an AMC bet.",
  },
];

const SORT_OPTIONS = [
  { value: "avgAlpha", label: "Alpha (Highest)" },
  { value: "totalAUM", label: "AUM (Largest)" },
  { value: "tenureYears", label: "Tenure (Longest)" },
  { value: "fundsManaged", label: "Funds Managed" },
];

export default function ManagerDirectoryPage() {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("avgAlpha");
  const [amcFilter, setAmcFilter] = useState("All");

  const amcs = useMemo(() => ["All", ...new Set(MANAGERS.map((m) => m.amc))], []);

  const filtered = useMemo(() => {
    let result = [...MANAGERS];
    if (query) {
      const q = query.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.amc.toLowerCase().includes(q) || m.specialization.toLowerCase().includes(q));
    }
    if (amcFilter !== "All") result = result.filter((m) => m.amc === amcFilter);
    result.sort((a, b) => {
      const av = a[sortBy as keyof Manager] as number;
      const bv = b[sortBy as keyof Manager] as number;
      return bv - av;
    });
    return result;
  }, [query, sortBy, amcFilter]);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/tools" />
      <PageLayout>
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Fund Managers" }]}
          title="Fund Manager Directory"
          subtitle="You're not buying a fund. You're hiring a person. Know who's managing your money."
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatCard label="Managers Tracked" value={MANAGERS.length.toString()} />
          <StatCard label="Avg Tenure" value={`${(MANAGERS.reduce((s, m) => s + m.tenureYears, 0) / MANAGERS.length).toFixed(0)} yrs`} />
          <StatCard label="Avg Alpha" value={formatPercent(MANAGERS.reduce((s, m) => s + m.avgAlpha, 0) / MANAGERS.length)} trend="up" />
          <StatCard label="Combined AUM" value={formatAUM(MANAGERS.reduce((s, m) => s + m.totalAUM, 0))} />
        </div>

        {/* Search + Filters */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchBar value={query} onChange={setQuery} placeholder="Search by name, AMC, specialization..." />
          </div>
          <select value={amcFilter} onChange={(e) => setAmcFilter(e.target.value)}
            className="text-xs bg-cream-50 border border-cream-300 rounded-md px-3 py-2 text-ink-700 focus:outline-none focus:border-sage-400">
            {amcs.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-cream-50 border border-cream-300 rounded-md px-3 py-2 text-ink-700 focus:outline-none focus:border-sage-400">
            {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Results */}
        <p className="text-sm text-ink-500 mb-4"><span className="font-semibold text-ink-700">{filtered.length}</span> managers</p>

        <div className="space-y-4">
          {filtered.map((mgr) => (
            <Card key={mgr.id} padding="lg" hover onClick={() => {}}>
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-sage-100 flex items-center justify-center shrink-0">
                  <span className="font-serif text-lg font-semibold text-sage-700">
                    {mgr.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-lg text-ink-900">{mgr.name}</h3>
                      <p className="text-sm text-ink-500">{mgr.amc} · {mgr.tenure}</p>
                    </div>
                    <Badge variant="outline" size="sm">{mgr.specialization}</Badge>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                    <div>
                      <p className="text-2xs text-ink-400 uppercase tracking-wider">AUM</p>
                      <p className="font-mono text-sm font-semibold text-ink-800">{formatAUM(mgr.totalAUM)}</p>
                    </div>
                    <div>
                      <p className="text-2xs text-ink-400 uppercase tracking-wider">Funds</p>
                      <p className="font-mono text-sm font-semibold text-ink-800">{mgr.fundsManaged}</p>
                    </div>
                    <div>
                      <p className="text-2xs text-ink-400 uppercase tracking-wider">Avg Alpha</p>
                      <p className={cn("font-mono text-sm font-semibold", mgr.avgAlpha >= 3 ? "text-good-600" : mgr.avgAlpha >= 1 ? "text-ink-800" : "text-ugly-500")}>
                        {mgr.avgAlpha >= 0 ? "+" : ""}{mgr.avgAlpha.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-2xs text-ink-400 uppercase tracking-wider">Best Fund</p>
                      <p className="text-sm text-ink-800 truncate">{mgr.bestFund}</p>
                    </div>
                  </div>

                  {/* Boredfolio take */}
                  <p className="text-sm text-ink-600 mt-3 italic leading-relaxed">"{mgr.take}"</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Educational note */}
        <Card padding="lg" className="mt-8">
          <CardHeader title="Why Fund Managers Matter" />
          <div className="mt-3 space-y-3 text-sm text-ink-700 leading-relaxed">
            <p>
              A fund's past returns were generated by whoever was managing it at the time. If the manager changes, the track record doesn't transfer. This is why "past performance" disclaimers exist — you might be looking at returns generated by someone who left 2 years ago.
            </p>
            <p>
              Key things to watch: manager tenure (longer = more of the track record is theirs), number of funds managed (more than 5 is a red flag — attention is finite), and alpha consistency (not just magnitude — does the manager beat the benchmark more often than not?).
            </p>
          </div>
        </Card>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/tools" />
    </div>
  );
}
