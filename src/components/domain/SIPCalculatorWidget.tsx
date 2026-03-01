import React, { useState, useMemo } from "react";
import { cn, formatINR, formatCompact, formatPercent } from "@/lib/utils";
import { Card, CardHeader } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";

/*
 * SIP / LUMPSUM CALCULATOR WIDGET
 * ────────────────────────────────
 * Inline calculator embedded on scheme detail page and /tools/sip-calculator.
 * Shows: invested amount, future value, wealth gained.
 * Comparison bars: what the same money would do in FD, PPF, Gold, Nifty.
 */

interface SIPCalculatorWidgetProps {
  defaultReturn?: number; // pre-filled with fund's return
  fundName?: string;
  className?: string;
}

export function SIPCalculatorWidget({
  defaultReturn = 12,
  fundName,
  className,
}: SIPCalculatorWidgetProps) {
  const [mode, setMode] = useState<"sip" | "lumpsum">("sip");
  const [sipAmount, setSipAmount] = useState(10000);
  const [lumpsumAmount, setLumpsumAmount] = useState(100000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(defaultReturn);
  const [stepUp, setStepUp] = useState(0);

  const result = useMemo(() => {
    if (mode === "sip") {
      return calculateSIP(sipAmount, rate, years, stepUp);
    }
    return calculateLumpsum(lumpsumAmount, rate, years);
  }, [mode, sipAmount, lumpsumAmount, rate, years, stepUp]);

  const comparisons = useMemo(() => [
    { name: "FD (7%)", value: mode === "sip" ? calculateSIP(sipAmount, 7, years, stepUp).futureValue : calculateLumpsum(lumpsumAmount, 7, years).futureValue, color: "#ABABAB" },
    { name: "PPF (7.1%)", value: mode === "sip" ? calculateSIP(sipAmount, 7.1, years, stepUp).futureValue : calculateLumpsum(lumpsumAmount, 7.1, years).futureValue, color: "#C5C5C5" },
    { name: fundName || `This Fund (${rate}%)`, value: result.futureValue, color: "#6B8F71" },
  ], [mode, sipAmount, lumpsumAmount, rate, years, stepUp, result, fundName]);

  const maxComparison = Math.max(...comparisons.map((c) => c.value));

  return (
    <Card padding="lg" className={className}>
      <CardHeader
        title="Investment Calculator"
        subtitle={fundName ? `Estimate returns for ${fundName}` : "See how your money grows"}
      />

      {/* Mode toggle */}
      <div className="mt-4">
        <Tabs
          tabs={[
            { id: "sip", label: "SIP" },
            { id: "lumpsum", label: "Lumpsum" },
          ]}
          activeTab={mode}
          onChange={(t) => setMode(t as "sip" | "lumpsum")}
          variant="segment"
          size="sm"
        />
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 gap-4 mt-5">
        {mode === "sip" ? (
          <SliderInput
            label="Monthly SIP"
            value={sipAmount}
            onChange={setSipAmount}
            min={500}
            max={100000}
            step={500}
            format={(v) => formatINR(v)}
          />
        ) : (
          <SliderInput
            label="Investment Amount"
            value={lumpsumAmount}
            onChange={setLumpsumAmount}
            min={1000}
            max={10000000}
            step={10000}
            format={(v) => formatCompact(v)}
          />
        )}

        <SliderInput
          label="Time Period"
          value={years}
          onChange={setYears}
          min={1}
          max={30}
          step={1}
          format={(v) => `${v} years`}
        />

        <SliderInput
          label="Expected Return"
          value={rate}
          onChange={setRate}
          min={1}
          max={30}
          step={0.5}
          format={(v) => `${v}%`}
        />

        {mode === "sip" && (
          <SliderInput
            label="Annual Step-up"
            value={stepUp}
            onChange={setStepUp}
            min={0}
            max={25}
            step={1}
            format={(v) => `${v}%`}
          />
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-cream-300">
        <ResultBlock
          label="Invested"
          value={formatCompact(result.totalInvested)}
          color="text-ink-700"
        />
        <ResultBlock
          label="Est. Returns"
          value={formatCompact(result.wealthGained)}
          color="text-good-500"
        />
        <ResultBlock
          label="Future Value"
          value={formatCompact(result.futureValue)}
          color="text-ink-900"
          highlight
        />
      </div>

      {/* Visual breakdown */}
      <div className="mt-4 h-3 rounded-full overflow-hidden flex bg-cream-200">
        <div
          className="h-full bg-cream-400 transition-all duration-300"
          style={{ width: `${(result.totalInvested / result.futureValue) * 100}%` }}
        />
        <div
          className="h-full bg-good-500 transition-all duration-300"
          style={{ width: `${(result.wealthGained / result.futureValue) * 100}%` }}
        />
      </div>
      <div className="flex items-center gap-4 mt-1.5 text-2xs text-ink-400">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-cream-400" /> Invested
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-sm bg-good-500" /> Returns
        </span>
      </div>

      {/* Comparison bars */}
      <div className="mt-6 pt-4 border-t border-cream-200">
        <span className="text-2xs font-semibold uppercase tracking-wider text-ink-400">
          Comparison
        </span>
        <div className="space-y-2 mt-2">
          {comparisons.map((comp, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-ink-500 w-32 shrink-0 truncate">
                {comp.name}
              </span>
              <div className="flex-1 h-5 bg-cream-200 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all duration-500"
                  style={{
                    width: `${(comp.value / maxComparison) * 100}%`,
                    backgroundColor: comp.color,
                  }}
                />
              </div>
              <span className="font-mono text-xs text-ink-700 tabular-nums w-16 text-right shrink-0">
                {formatCompact(comp.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

/* ── Slider Input ── */
function SliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-ink-500">{label}</span>
        <span className="font-mono text-sm text-ink-900 font-medium tabular-nums">
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none bg-cream-300 accent-sage-500 cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sage-500 [&::-webkit-slider-thumb]:border-2
          [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-card-hover [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

/* ── Result Block ── */
function ResultBlock({
  label,
  value,
  color,
  highlight,
}: {
  label: string;
  value: string;
  color: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn(highlight && "bg-cream-100 -mx-1 px-1 py-2 rounded-md")}>
      <span className="text-2xs text-ink-400 block">{label}</span>
      <span className={cn("font-mono text-lg font-semibold tabular-nums", color)}>
        {value}
      </span>
    </div>
  );
}

/* ── Calculation Helpers ── */
function calculateSIP(
  monthly: number,
  annualRate: number,
  years: number,
  stepUpPercent: number
): { totalInvested: number; futureValue: number; wealthGained: number } {
  const monthlyRate = annualRate / 100 / 12;
  let totalInvested = 0;
  let futureValue = 0;
  let currentSIP = monthly;

  for (let y = 0; y < years; y++) {
    for (let m = 0; m < 12; m++) {
      totalInvested += currentSIP;
      futureValue = (futureValue + currentSIP) * (1 + monthlyRate);
    }
    if (stepUpPercent > 0) {
      currentSIP = currentSIP * (1 + stepUpPercent / 100);
    }
  }

  return {
    totalInvested: Math.round(totalInvested),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(futureValue - totalInvested),
  };
}

function calculateLumpsum(
  amount: number,
  annualRate: number,
  years: number
): { totalInvested: number; futureValue: number; wealthGained: number } {
  const futureValue = amount * Math.pow(1 + annualRate / 100, years);
  return {
    totalInvested: Math.round(amount),
    futureValue: Math.round(futureValue),
    wealthGained: Math.round(futureValue - amount),
  };
}

export default SIPCalculatorWidget;
