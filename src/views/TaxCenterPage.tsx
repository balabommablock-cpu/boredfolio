"use client";

import React, { useState, useMemo } from "react";
import { cn, formatINR, BRAND_COLORS } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, SectionHeader, Divider } from "@/components/ui/Navigation";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, StatCard, MetricRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabContent } from "@/components/ui/Tabs";

/*
 * TAX CENTER
 * ──────────
 * Mutual fund taxation made not-boring.
 * Quick reference + LTCG/STCG calculator + old vs new regime.
 */

const TAX_RULES = [
  { type: "Equity Funds", definition: "≥65% in Indian equities", stcg: "20%", stcgPeriod: "< 1 year", ltcg: "12.5% above ₹1.25L", ltcgPeriod: "≥ 1 year", exitLoad: "Typically 1% if < 1 year" },
  { type: "Debt Funds", definition: "< 65% in equities", stcg: "Slab rate", stcgPeriod: "< 2 years", ltcg: "12.5%", ltcgPeriod: "≥ 2 years", exitLoad: "Varies (0-1%)" },
  { type: "Hybrid – Equity", definition: "≥65% in equities", stcg: "20%", stcgPeriod: "< 1 year", ltcg: "12.5% above ₹1.25L", ltcgPeriod: "≥ 1 year", exitLoad: "0-1%" },
  { type: "Hybrid – Debt", definition: "< 65% in equities", stcg: "Slab rate", stcgPeriod: "< 2 years", ltcg: "12.5%", ltcgPeriod: "≥ 2 years", exitLoad: "0-1%" },
  { type: "ELSS", definition: "Equity linked savings", stcg: "N/A (3Y lock-in)", stcgPeriod: "N/A", ltcg: "12.5% above ₹1.25L", ltcgPeriod: "After 3Y lock-in", exitLoad: "None" },
  { type: "International", definition: "Invests in foreign equities", stcg: "Slab rate", stcgPeriod: "< 2 years", ltcg: "12.5%", ltcgPeriod: "≥ 2 years", exitLoad: "0-1%" },
];

function calcEquityTax(buyValue: number, sellValue: number, holdingMonths: number): {
  gain: number; taxableGain: number; tax: number; effectiveRate: number; type: "STCG" | "LTCG";
} {
  const gain = sellValue - buyValue;
  if (gain <= 0) return { gain, taxableGain: 0, tax: 0, effectiveRate: 0, type: holdingMonths < 12 ? "STCG" : "LTCG" };
  if (holdingMonths < 12) {
    const tax = Math.round(gain * 0.20);
    return { gain, taxableGain: gain, tax, effectiveRate: 20, type: "STCG" };
  }
  const exempt = 125000;
  const taxableGain = Math.max(0, gain - exempt);
  const tax = Math.round(taxableGain * 0.125);
  return { gain, taxableGain, tax, effectiveRate: gain > 0 ? (tax / gain) * 100 : 0, type: "LTCG" };
}

export default function TaxCenterPage() {
  const [tab, setTab] = useState("rules");
  const tabs = [
    { id: "rules", label: "Tax Rules" },
    { id: "calculator", label: "Tax Calculator" },
    { id: "regime", label: "Old vs New Regime" },
    { id: "tips", label: "Tax Tips" },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/tools" />
      <PageLayout variant="narrow">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "Tax Center" }]}
          title="Mutual Fund Tax Center"
          subtitle="Everything you need to know about mutual fund taxation. Updated for FY 2025-26."
        />
        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="underline" className="mb-8" />

        {/* ═══ TAX RULES ═══ */}
        <TabContent activeTab={tab} tabId="rules">
          <div className="space-y-6">
            <Card padding="md" className="border-l-4 border-l-mustard-400">
              <p className="text-sm text-ink-700 leading-relaxed">
                <span className="font-semibold text-mustard-600">Updated July 2024:</span> Union Budget 2024 changed LTCG on equity from 10% to 12.5%, STCG from 15% to 20%, and raised the LTCG exemption from ₹1L to ₹1.25L. Debt fund indexation was removed in 2023.
              </p>
            </Card>

            <Card padding="none">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-cream-50 border-b border-cream-300">
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 p-3">Fund Type</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 p-3">STCG</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 p-3">LTCG</th>
                      <th className="text-left text-xs font-semibold uppercase tracking-wider text-ink-400 p-3">LT Period</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TAX_RULES.map((rule) => (
                      <tr key={rule.type} className="border-b border-cream-200 last:border-0">
                        <td className="p-3">
                          <p className="text-sm font-medium text-ink-900">{rule.type}</p>
                          <p className="text-2xs text-ink-400">{rule.definition}</p>
                        </td>
                        <td className="p-3 font-mono text-sm text-ink-700">{rule.stcg}</td>
                        <td className="p-3 font-mono text-sm text-ink-700">{rule.ltcg}</td>
                        <td className="p-3 text-sm text-ink-500">{rule.ltcgPeriod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card padding="lg">
              <CardHeader title="Key Changes Timeline" />
              <div className="mt-4 space-y-4">
                {[
                  { date: "Jul 2024", change: "Equity LTCG → 12.5% (from 10%), STCG → 20% (from 15%), exemption → ₹1.25L" },
                  { date: "Apr 2023", change: "Debt fund indexation removed. Gains taxed at slab rate regardless of holding period for funds bought after Apr 1, 2023" },
                  { date: "Feb 2025", change: "New tax regime: ₹12L income tax-free, reduced ELSS attractiveness" },
                ].map((item) => (
                  <div key={item.date} className="flex items-start gap-3">
                    <Badge variant="outline" size="sm" className="shrink-0 mt-0.5">{item.date}</Badge>
                    <p className="text-sm text-ink-700">{item.change}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabContent>

        {/* ═══ TAX CALCULATOR ═══ */}
        <TabContent activeTab={tab} tabId="calculator">
          <TaxCalculator />
        </TabContent>

        {/* ═══ OLD VS NEW REGIME ═══ */}
        <TabContent activeTab={tab} tabId="regime">
          <RegimeComparison />
        </TabContent>

        {/* ═══ TAX TIPS ═══ */}
        <TabContent activeTab={tab} tabId="tips">
          <div className="space-y-4">
            {[
              { title: "Tax-Loss Harvesting", tip: "Sell equity funds showing losses before March 31 and rebuy after 1 day to book losses that offset your LTCG gains. ₹1.25L LTCG is exempt — harvest anything above that." },
              { title: "ELSS Is Less Useful Now", tip: "Under the new tax regime (₹12L tax-free), you can't claim 80C deductions. ELSS only helps if you're on the old regime AND have room in your 80C limit after EPF/PPF." },
              { title: "Direct Plans Save Tax Too", tip: "Lower TER = higher NAV growth = more of your returns are long-term capital gains (taxed at 12.5%) rather than dividends (taxed at slab rate)." },
              { title: "SIP + Holding Period Trap", tip: "Each SIP installment has its OWN holding period. Your January SIP turns long-term in January next year. Your December SIP turns long-term in December next year. Don't redeem everything assuming it's all LTCG." },
              { title: "Debt Fund Tax Reality", tip: "Post-April 2023, debt fund gains are taxed at your slab rate regardless of holding period. If you're in the 30% bracket, FDs might actually be simpler — same tax treatment, guaranteed returns." },
              { title: "Grandfathering Doesn't Apply Anymore", tip: "The Jan 31, 2018 grandfathering for equity LTCG only applied to gains before that date. Any gain from Feb 1, 2018 onward is fully taxable (after ₹1.25L exemption)." },
            ].map((item) => (
              <Card key={item.title} padding="md">
                <h3 className="font-serif text-base text-ink-900 mb-2">{item.title}</h3>
                <p className="text-sm text-ink-600 leading-relaxed">{item.tip}</p>
              </Card>
            ))}
          </div>
        </TabContent>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/tools" />
    </div>
  );
}

function TaxCalculator() {
  const [fundType, setFundType] = useState<"equity" | "debt">("equity");
  const [buyValue, setBuyValue] = useState(500000);
  const [sellValue, setSellValue] = useState(750000);
  const [holdingMonths, setHoldingMonths] = useState(18);

  const result = useMemo(() => {
    if (fundType === "equity") return calcEquityTax(buyValue, sellValue, holdingMonths);
    const gain = sellValue - buyValue;
    if (gain <= 0) return { gain, taxableGain: 0, tax: 0, effectiveRate: 0, type: "STCG" as const };
    if (holdingMonths < 24) {
      const tax = Math.round(gain * 0.30);
      return { gain, taxableGain: gain, tax, effectiveRate: 30, type: "STCG" as const };
    }
    const tax = Math.round(gain * 0.125);
    return { gain, taxableGain: gain, tax, effectiveRate: 12.5, type: "LTCG" as const };
  }, [fundType, buyValue, sellValue, holdingMonths]);

  return (
    <Card padding="lg">
      <CardHeader title="Capital Gains Tax Calculator" subtitle="How much tax will you pay on redemption?" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-5">
            {(["equity", "debt"] as const).map((t) => (
              <button key={t} onClick={() => setFundType(t)}
                className={cn("px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize",
                  fundType === t ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-600 hover:bg-cream-300")}>
                {t} Fund
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-700 mb-1 block">Purchase Value (₹)</label>
              <Input type="number" value={buyValue} onChange={(e) => setBuyValue(+e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 mb-1 block">Redemption Value (₹)</label>
              <Input type="number" value={sellValue} onChange={(e) => setSellValue(+e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-ink-700 mb-1 block">Holding Period (months)</label>
              <Input type="number" value={holdingMonths} onChange={(e) => setHoldingMonths(+e.target.value)} />
            </div>
          </div>
        </div>
        <div>
          <div className="p-5 rounded-lg border-2 border-cream-300 bg-cream-50">
            <Badge variant={result.type === "LTCG" ? "sage" : "outline"} className="mb-3">{result.type}</Badge>
            <div className="space-y-2">
              <MetricRow label="Total Gain" value={<span className={cn("font-mono font-semibold", result.gain >= 0 ? "text-good-600" : "text-ugly-500")}>{formatINR(result.gain)}</span>} />
              {fundType === "equity" && result.type === "LTCG" && <MetricRow label="Exempt (₹1.25L)" value={<span className="font-mono text-good-600">-{formatINR(Math.min(125000, result.gain))}</span>} />}
              <MetricRow label="Taxable Gain" value={<span className="font-mono">{formatINR(result.taxableGain)}</span>} />
              <Divider />
              <MetricRow label="Tax Payable" value={<span className="font-mono text-xl font-bold text-ugly-500">{formatINR(result.tax)}</span>} />
              <MetricRow label="Effective Rate" value={<span className="font-mono">{result.effectiveRate.toFixed(1)}%</span>} />
              <MetricRow label="You Keep" value={<span className="font-mono font-semibold text-good-600">{formatINR(sellValue - result.tax)}</span>} />
            </div>
          </div>
          {result.type === "STCG" && holdingMonths >= (fundType === "equity" ? 10 : 20) && (
            <p className="text-sm text-mustard-600 mt-3 p-3 bg-mustard-50 rounded-md">
              💡 If you wait {fundType === "equity" ? 12 - holdingMonths : 24 - holdingMonths} more month(s), this becomes LTCG — saving you {formatINR(Math.round(result.tax * 0.4))}.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}

function RegimeComparison() {
  const [income, setIncome] = useState(1500000);
  const [deductions80C, setDeductions80C] = useState(150000);
  const [hra, setHra] = useState(200000);
  const [elssInvestment, setElssInvestment] = useState(50000);

  const oldRegimeTax = useMemo(() => {
    const taxable = Math.max(0, income - deductions80C - hra - 50000);
    return calcIncomeTax(taxable, "old");
  }, [income, deductions80C, hra]);

  const newRegimeTax = useMemo(() => {
    const taxable = Math.max(0, income - 75000);
    return calcIncomeTax(taxable, "new");
  }, [income]);

  const elssValue = useMemo(() => {
    if (oldRegimeTax <= newRegimeTax) return elssInvestment * 0.30;
    return 0;
  }, [oldRegimeTax, newRegimeTax, elssInvestment]);

  return (
    <Card padding="lg">
      <CardHeader title="Old vs New Tax Regime" subtitle="Which regime makes ELSS worth it?" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink-700 mb-1 block">Gross Annual Income (₹)</label>
            <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 mb-1 block">80C Deductions — EPF + PPF + LIC (₹)</label>
            <Input type="number" value={deductions80C} onChange={(e) => setDeductions80C(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-ink-700 mb-1 block">HRA Exemption (₹)</label>
            <Input type="number" value={hra} onChange={(e) => setHra(+e.target.value)} />
          </div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={cn("p-4 rounded-lg border-2 text-center", oldRegimeTax <= newRegimeTax ? "border-sage-400 bg-sage-50" : "border-cream-300 bg-cream-50")}>
              <p className="text-2xs uppercase tracking-wider text-ink-400 font-semibold">Old Regime</p>
              <p className="font-mono text-xl font-semibold text-ink-900 mt-1">{formatINR(oldRegimeTax)}</p>
              {oldRegimeTax <= newRegimeTax && <Badge variant="sage" size="sm" className="mt-1">Better</Badge>}
            </div>
            <div className={cn("p-4 rounded-lg border-2 text-center", newRegimeTax < oldRegimeTax ? "border-sage-400 bg-sage-50" : "border-cream-300 bg-cream-50")}>
              <p className="text-2xs uppercase tracking-wider text-ink-400 font-semibold">New Regime</p>
              <p className="font-mono text-xl font-semibold text-ink-900 mt-1">{formatINR(newRegimeTax)}</p>
              {newRegimeTax < oldRegimeTax && <Badge variant="sage" size="sm" className="mt-1">Better</Badge>}
            </div>
          </div>
          <MetricRow label="You save" value={<span className="font-mono font-semibold text-good-600">{formatINR(Math.abs(oldRegimeTax - newRegimeTax))}/yr</span>} />
          <MetricRow label="ELSS useful?" value={oldRegimeTax <= newRegimeTax ? "Yes — old regime is better for you" : "No — switch to new regime, skip ELSS for tax"} />
          <p className="text-sm text-ink-600 mt-4 p-3 bg-cream-50 border border-cream-200 rounded-md">
            <span className="font-serif font-semibold">Bottom line:</span>{" "}
            {newRegimeTax < oldRegimeTax
              ? "The new regime saves you more. ELSS doesn't help for tax — but it's still a solid equity fund if you want 3-year lock-in discipline."
              : "Old regime wins for you. Max out your 80C with ELSS — you get equity returns AND a tax deduction. Just pick a low-TER ELSS fund."
            }
          </p>
        </div>
      </div>
    </Card>
  );
}

function calcIncomeTax(taxable: number, regime: "old" | "new"): number {
  if (regime === "new") {
    if (taxable <= 400000) return 0;
    const slabs = [
      { limit: 400000, rate: 0 }, { limit: 800000, rate: 0.05 }, { limit: 1200000, rate: 0.10 },
      { limit: 1600000, rate: 0.15 }, { limit: 2000000, rate: 0.20 }, { limit: 2400000, rate: 0.25 },
      { limit: Infinity, rate: 0.30 },
    ];
    let tax = 0, prev = 0;
    for (const slab of slabs) {
      const chunk = Math.min(taxable, slab.limit) - prev;
      if (chunk > 0) tax += chunk * slab.rate;
      prev = slab.limit;
      if (taxable <= slab.limit) break;
    }
    return Math.round(tax * 1.04);
  }
  if (taxable <= 250000) return 0;
  const slabs = [
    { limit: 250000, rate: 0 }, { limit: 500000, rate: 0.05 }, { limit: 1000000, rate: 0.20 }, { limit: Infinity, rate: 0.30 },
  ];
  let tax = 0, prev = 0;
  for (const slab of slabs) {
    const chunk = Math.min(taxable, slab.limit) - prev;
    if (chunk > 0) tax += chunk * slab.rate;
    prev = slab.limit;
    if (taxable <= slab.limit) break;
  }
  return Math.round(tax * 1.04);
}
