"use client";

import React, { useState, useMemo } from "react";
import { cn, formatINR, BRAND_COLORS } from "@/lib/utils";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, SectionHeader } from "@/components/ui/Navigation";
import { Card, CardHeader, StatCard, MetricRow } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Tabs, TabContent } from "@/components/ui/Tabs";

/*
 * SIP TOOLS PAGE
 * ──────────────
 * 4 calculators: SIP, Step-Up SIP, Lumpsum vs SIP, SWP
 * "How much will my boring SIP actually make?"
 */

function calcSIP(monthly: number, years: number, rate: number): { invested: number; future: number; returns: number } {
  const r = rate / 100 / 12;
  const n = years * 12;
  const invested = monthly * n;
  const future = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  return { invested, future: Math.round(future), returns: Math.round(future - invested) };
}

function calcStepUp(monthly: number, years: number, rate: number, stepUp: number): { invested: number; future: number; returns: number } {
  let total = 0, invested = 0, current = monthly;
  const r = rate / 100 / 12;
  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      const months = (years - y) * 12 - m;
      total += current * Math.pow(1 + r, months);
      invested += current;
    }
    current = Math.round(current * (1 + stepUp / 100));
  }
  return { invested: Math.round(invested), future: Math.round(total), returns: Math.round(total - invested) };
}

function calcLumpsum(amount: number, years: number, rate: number): number {
  return Math.round(amount * Math.pow(1 + rate / 100, years));
}

function calcSWP(corpus: number, monthly: number, rate: number): { months: number; totalWithdrawn: number } {
  const r = rate / 100 / 12;
  let balance = corpus, months = 0, totalWithdrawn = 0;
  while (balance > monthly && months < 600) {
    balance = balance * (1 + r) - monthly;
    totalWithdrawn += monthly;
    months++;
  }
  return { months, totalWithdrawn: Math.round(totalWithdrawn) };
}

export default function SIPToolsPage() {
  const [tab, setTab] = useState("sip");
  const tabs = [
    { id: "sip", label: "SIP Calculator" },
    { id: "stepup", label: "Step-Up SIP" },
    { id: "compare", label: "Lumpsum vs SIP" },
    { id: "swp", label: "SWP Planner" },
  ];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/tools" />
      <PageLayout variant="narrow">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Tools" }, { label: "SIP Tools" }]}
          title="SIP Tools"
          subtitle="How much will your boring SIP actually make? Let's run the numbers."
        />
        <Tabs tabs={tabs} activeTab={tab} onChange={setTab} variant="underline" className="mb-8" />
        <TabContent activeTab={tab} tabId="sip"><SIPCalc /></TabContent>
        <TabContent activeTab={tab} tabId="stepup"><StepUpCalc /></TabContent>
        <TabContent activeTab={tab} tabId="compare"><LumpsumVsSIP /></TabContent>
        <TabContent activeTab={tab} tabId="swp"><SWPCalc /></TabContent>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/tools" />
    </div>
  );
}

function SliderInput({ label, value, onChange, min, max, step, unit, helpText }: {
  label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; unit: string; helpText?: string;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-medium text-ink-700">{label}</label>
        <div className="flex items-center gap-1">
          <input type="number" value={value} onChange={(e) => onChange(+e.target.value)}
            className="w-20 text-right font-mono text-sm bg-cream-50 border border-cream-300 rounded px-2 py-1 focus:outline-none focus:border-sage-400" />
          <span className="text-xs text-ink-400">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)}
        className="w-full h-1.5 bg-cream-300 rounded-full appearance-none cursor-pointer accent-sage-500" />
      {helpText && <p className="text-2xs text-ink-400 mt-1">{helpText}</p>}
    </div>
  );
}

function ResultBar({ invested, returns, label }: { invested: number; returns: number; label?: string }) {
  const total = invested + returns;
  const investedPct = (invested / total) * 100;
  return (
    <div className="mb-4">
      {label && <p className="text-xs font-medium text-ink-600 mb-1.5">{label}</p>}
      <div className="flex h-8 rounded-md overflow-hidden">
        <div className="bg-sage-300 flex items-center justify-center text-2xs text-white font-semibold" style={{ width: `${investedPct}%` }}>
          {investedPct > 20 && formatINR(invested)}
        </div>
        <div className="bg-sage-500 flex items-center justify-center text-2xs text-white font-semibold flex-1">
          {formatINR(returns)}
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-2xs text-ink-400">Invested: {formatINR(invested)}</span>
        <span className="text-2xs text-ink-400">Returns: {formatINR(returns)}</span>
      </div>
    </div>
  );
}

/* ═══ SIP Calculator ═══ */
function SIPCalc() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const result = useMemo(() => calcSIP(monthly, years, rate), [monthly, years, rate]);
  const fdResult = useMemo(() => calcSIP(monthly, years, 7), [monthly, years]);

  return (
    <Card padding="lg">
      <CardHeader title="SIP Calculator" subtitle="Monthly investment → future value" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SliderInput label="Monthly SIP" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} unit="₹/mo" />
          <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} unit="years" />
          <SliderInput label="Expected Return" value={rate} onChange={setRate} min={4} max={25} step={0.5} unit="% p.a." helpText="Equity: 12-15% · Debt: 6-8% · Index: 10-13%" />
        </div>
        <div>
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard label="Invested" value={formatINR(result.invested)} />
            <StatCard label="Returns" value={formatINR(result.returns)} trend="up" />
            <StatCard label="Future Value" value={formatINR(result.future)} />
          </div>
          <ResultBar invested={result.invested} returns={result.returns} label={`Your Fund @ ${rate}%`} />
          <ResultBar invested={fdResult.invested} returns={fdResult.returns} label="FD @ 7%" />
          <p className="text-sm text-ink-600 mt-4 p-3 bg-sage-50 rounded-md">
            <span className="font-semibold text-sage-700">Difference:</span> {formatINR(result.future - fdResult.future)} more
            than a fixed deposit over {years} years. That's the compounding premium for staying in equity.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ═══ Step-Up SIP ═══ */
function StepUpCalc() {
  const [monthly, setMonthly] = useState(10000);
  const [years, setYears] = useState(15);
  const [rate, setRate] = useState(12);
  const [stepUp, setStepUp] = useState(10);
  const withStepUp = useMemo(() => calcStepUp(monthly, years, rate, stepUp), [monthly, years, rate, stepUp]);
  const withoutStepUp = useMemo(() => calcSIP(monthly, years, rate), [monthly, years, rate]);
  const diff = withStepUp.future - withoutStepUp.future;

  return (
    <Card padding="lg">
      <CardHeader title="Step-Up SIP Calculator" subtitle="Increase your SIP every year as your income grows" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SliderInput label="Starting SIP" value={monthly} onChange={setMonthly} min={500} max={100000} step={500} unit="₹/mo" />
          <SliderInput label="Annual Step-Up" value={stepUp} onChange={setStepUp} min={0} max={25} step={1} unit="%" helpText="Increase SIP by this % each year" />
          <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} unit="years" />
          <SliderInput label="Expected Return" value={rate} onChange={setRate} min={4} max={25} step={0.5} unit="% p.a." />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard label="With Step-Up" value={formatINR(withStepUp.future)} trend="up" subtext={`Invested: ${formatINR(withStepUp.invested)}`} />
            <StatCard label="Without Step-Up" value={formatINR(withoutStepUp.future)} subtext={`Invested: ${formatINR(withoutStepUp.invested)}`} />
          </div>
          <ResultBar invested={withStepUp.invested} returns={withStepUp.returns} label={`With ${stepUp}% annual step-up`} />
          <ResultBar invested={withoutStepUp.invested} returns={withoutStepUp.returns} label="Flat SIP (no step-up)" />
          <p className="text-sm text-ink-600 mt-4 p-3 bg-mustard-50 rounded-md">
            <span className="font-semibold text-mustard-700">Power of step-up:</span> A {stepUp}% annual increase
            adds <span className="font-semibold">{formatINR(diff)}</span> extra over {years} years.
            Your last year SIP will be {formatINR(Math.round(monthly * Math.pow(1 + stepUp / 100, years - 1)))}/mo.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ═══ Lumpsum vs SIP ═══ */
function LumpsumVsSIP() {
  const [amount, setAmount] = useState(500000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);
  const lumpsum = useMemo(() => calcLumpsum(amount, years, rate), [amount, years, rate]);
  const sipMonthly = Math.round(amount / (years * 12));
  const sip = useMemo(() => calcSIP(sipMonthly, years, rate), [sipMonthly, years, rate]);

  return (
    <Card padding="lg">
      <CardHeader title="Lumpsum vs SIP" subtitle="Got a lump sum? Should you invest it all at once or spread it?" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SliderInput label="Total Amount" value={amount} onChange={setAmount} min={10000} max={5000000} step={10000} unit="₹" />
          <SliderInput label="Time Period" value={years} onChange={setYears} min={1} max={30} step={1} unit="years" />
          <SliderInput label="Expected Return" value={rate} onChange={setRate} min={4} max={25} step={0.5} unit="% p.a." />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-sage-50 border border-sage-200 rounded-lg text-center">
              <p className="text-2xs uppercase tracking-wider text-sage-600 font-semibold">Lumpsum</p>
              <p className="font-mono text-xl font-semibold text-ink-900 mt-1">{formatINR(lumpsum)}</p>
              <p className="text-xs text-ink-500">Invest all {formatINR(amount)} on day 1</p>
            </div>
            <div className="p-4 bg-mustard-50 border border-mustard-200 rounded-lg text-center">
              <p className="text-2xs uppercase tracking-wider text-mustard-600 font-semibold">SIP</p>
              <p className="font-mono text-xl font-semibold text-ink-900 mt-1">{formatINR(sip.future)}</p>
              <p className="text-xs text-ink-500">{formatINR(sipMonthly)}/mo for {years} years</p>
            </div>
          </div>
          <MetricRow label="Lumpsum beats SIP by" value={<span className={cn("font-mono font-semibold", lumpsum > sip.future ? "text-sage-600" : "text-ugly-500")}>{formatINR(Math.abs(lumpsum - sip.future))}</span>} />
          <p className="text-sm text-ink-600 mt-4 p-3 bg-cream-50 border border-cream-200 rounded-md">
            <span className="font-serif font-semibold">The math says:</span> Lumpsum wins ~65% of the time historically because markets trend up.
            <span className="font-semibold"> The psychology says:</span> SIP prevents you from investing everything at a market peak, which is when most people feel most bullish.
            If you can stomach a 30% drop the week after investing, go lumpsum. If that'd keep you up at night, spread it over 6-12 months.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ═══ SWP Calculator ═══ */
function SWPCalc() {
  const [corpus, setCorpus] = useState(5000000);
  const [monthly, setMonthly] = useState(25000);
  const [rate, setRate] = useState(8);
  const result = useMemo(() => calcSWP(corpus, monthly, rate), [corpus, monthly, rate]);
  const years = Math.floor(result.months / 12);
  const months = result.months % 12;

  return (
    <Card padding="lg">
      <CardHeader title="SWP Calculator" subtitle="How long will your retirement corpus last?" />
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <SliderInput label="Corpus" value={corpus} onChange={setCorpus} min={100000} max={50000000} step={100000} unit="₹" />
          <SliderInput label="Monthly Withdrawal" value={monthly} onChange={setMonthly} min={5000} max={500000} step={5000} unit="₹/mo" />
          <SliderInput label="Expected Return" value={rate} onChange={setRate} min={4} max={15} step={0.5} unit="% p.a." helpText="Return on remaining corpus (hybrid fund: 8-10%)" />
        </div>
        <div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <StatCard label="Money Lasts" value={`${years}y ${months}m`} subtext={result.months >= 360 ? "You're golden ✓" : result.months >= 240 ? "Comfortable" : "Consider lower withdrawal"} />
            <StatCard label="Total Withdrawn" value={formatINR(result.totalWithdrawn)} subtext={`${formatINR(monthly)}/mo × ${result.months} months`} />
          </div>
          <div className="relative h-4 bg-cream-200 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-sage-400 rounded-full transition-all" style={{ width: `${Math.min(100, (result.months / 360) * 100)}%` }} />
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 text-2xs font-semibold text-ink-600">
              {years}y {months}m of {30}y target
            </div>
          </div>
          <div className="space-y-1.5">
            <MetricRow label="Withdrawal Rate" value={`${((monthly * 12 / corpus) * 100).toFixed(1)}% p.a.`} />
            <MetricRow label="Safe Zone" value={((monthly * 12 / corpus) * 100) <= 4 ? "✓ Under 4% rule" : "⚠️ Above 4% safe rate"} />
          </div>
          <p className="text-sm text-ink-600 mt-4 p-3 bg-cream-50 border border-cream-200 rounded-md">
            <span className="font-serif font-semibold">The 4% rule:</span> Withdrawing ~4% of your corpus per year
            (adjusted for inflation) has historically been sustainable for 30+ years.
            Your current rate is <span className="font-semibold">{((monthly * 12 / corpus) * 100).toFixed(1)}%</span>.
          </p>
        </div>
      </div>
    </Card>
  );
}
