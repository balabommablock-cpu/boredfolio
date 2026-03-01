import React, { useState } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { cn, formatPercent, formatDate, BRAND_COLORS } from "@/lib/utils";
import { ChipFilters } from "@/components/ui/Tabs";

/*
 * DRAWDOWN CHART (Underwater Chart)
 * ──────────────────────────────────
 * Shows periods of loss from peak. Always negative.
 * Red fill area below zero line.
 * "In plain English: worst case you would have lost X% in Y months"
 */

export interface DrawdownDataPoint {
  date: string;
  drawdown: number; // always <= 0
}

interface DrawdownChartProps {
  data: DrawdownDataPoint[];
  maxDrawdown: number;
  maxDrawdownDate?: string;
  recoveryDays?: number | null;
  height?: number;
  className?: string;
}

export function DrawdownChart({
  data,
  maxDrawdown,
  maxDrawdownDate,
  recoveryDays,
  height = 200,
  className,
}: DrawdownChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Max drawdown callout */}
      <div className="flex items-center gap-4 p-3 bg-ugly-50 border border-ugly-100 rounded-lg">
        <div>
          <span className="text-2xs font-semibold uppercase tracking-wider text-ugly-600">
            Max Drawdown
          </span>
          <p className="font-mono text-xl font-semibold text-ugly-500 tabular-nums mt-0.5">
            {maxDrawdown.toFixed(2)}%
          </p>
        </div>
        {maxDrawdownDate && (
          <div className="border-l border-ugly-100 pl-4">
            <span className="text-2xs text-ugly-500">Trough</span>
            <p className="text-sm text-ugly-600 font-medium">{formatDate(maxDrawdownDate)}</p>
          </div>
        )}
        {recoveryDays !== null && recoveryDays !== undefined && (
          <div className="border-l border-ugly-100 pl-4">
            <span className="text-2xs text-ugly-500">Recovery</span>
            <p className="text-sm text-ugly-600 font-medium">
              {recoveryDays > 0 ? `${recoveryDays} days` : "Not recovered"}
            </p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="bg-cream-50 border border-cream-300 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.border} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => {
                const date = new Date(d);
                return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
              }}
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "DM Sans" }}
              axisLine={{ stroke: BRAND_COLORS.border }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              domain={["dataMin - 2", 0]}
              width={50}
            />
            <RechartsTooltip content={<DrawdownTooltip />} />
            <ReferenceLine y={0} stroke={BRAND_COLORS.border} strokeWidth={1.5} />
            <Area
              type="monotone"
              dataKey="drawdown"
              stroke={BRAND_COLORS.ugly}
              fill={BRAND_COLORS.ugly}
              fillOpacity={0.15}
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Plain English take */}
      <p className="text-xs text-ink-500 italic">
        In plain English: the worst period saw a{" "}
        <span className="text-ugly-500 font-medium font-mono">{Math.abs(maxDrawdown).toFixed(1)}%</span>{" "}
        loss from peak
        {recoveryDays && recoveryDays > 0
          ? `, taking ${recoveryDays} days to recover.`
          : recoveryDays === 0
            ? "."
            : " — and it hasn't recovered yet."}
      </p>
    </div>
  );
}

function DrawdownTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg shadow-dropdown px-3 py-2">
      <p className="text-xs text-ink-400 mb-1">{formatDate(label)}</p>
      <p className="font-mono text-sm text-ugly-500 font-medium tabular-nums">
        {payload[0].value.toFixed(2)}%
      </p>
    </div>
  );
}

/*
 * ROLLING RETURN CHART
 * ────────────────────
 * Shows rolling return windows (1Y/3Y/5Y) over time.
 * Highlights: best, worst, median, current.
 * Shows probability of loss and consistency score.
 */

export interface RollingReturnDataPoint {
  date: string;
  fund: number;
  benchmark?: number;
}

interface RollingReturnChartProps {
  data: RollingReturnDataPoint[];
  window: string; // "1Y" | "3Y" | "5Y"
  stats: {
    best: number;
    worst: number;
    median: number;
    current: number;
    percentNegative: number;
    percentBeatBenchmark?: number;
  };
  showBenchmark?: boolean;
  benchmarkName?: string;
  height?: number;
  onWindowChange?: (window: string) => void;
  className?: string;
}

const WINDOWS = [
  { id: "1Y", label: "1 Year" },
  { id: "3Y", label: "3 Year" },
  { id: "5Y", label: "5 Year" },
];

export function RollingReturnChart({
  data,
  window,
  stats,
  showBenchmark = true,
  benchmarkName = "Benchmark",
  height = 280,
  onWindowChange,
  className,
}: RollingReturnChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {/* Window selector + stats strip */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <ChipFilters
          options={WINDOWS}
          selected={window}
          onChange={(w) => onWindowChange?.(w)}
        />
        <div className="flex items-center gap-4">
          <MiniStat label="Best" value={stats.best} sentiment="good" />
          <MiniStat label="Worst" value={stats.worst} sentiment={stats.worst < 0 ? "ugly" : "neutral"} />
          <MiniStat label="Median" value={stats.median} sentiment="neutral" />
          <MiniStat label="Current" value={stats.current} sentiment={stats.current >= 0 ? "good" : "ugly"} />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-cream-50 border border-cream-300 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BRAND_COLORS.border} vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={(d) => new Date(d).toLocaleDateString("en-IN", { month: "short", year: "2-digit" })}
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "DM Sans" }}
              axisLine={{ stroke: BRAND_COLORS.border }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => `${v}%`}
              width={50}
            />
            <RechartsTooltip content={<RollingTooltip benchmarkName={benchmarkName} />} />
            <ReferenceLine y={0} stroke={BRAND_COLORS.border} strokeWidth={1} />
            <ReferenceLine
              y={stats.median}
              stroke={BRAND_COLORS.mustard}
              strokeDasharray="6 4"
              strokeWidth={1}
              label={{ value: "Median", position: "right", fill: "#B8963E", fontSize: 10 }}
            />

            <Line
              type="monotone"
              dataKey="fund"
              stroke={BRAND_COLORS.sage}
              strokeWidth={2}
              dot={false}
              name="Fund"
            />
            {showBenchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke="#5A8FA8"
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                name={benchmarkName}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Probability stats */}
      <div className="flex items-center gap-6 text-xs">
        <span className="text-ink-400">
          Negative return probability:{" "}
          <span className={cn(
            "font-mono font-medium tabular-nums",
            stats.percentNegative > 20 ? "text-ugly-500" : stats.percentNegative > 5 ? "text-mustard-600" : "text-good-500"
          )}>
            {stats.percentNegative.toFixed(1)}%
          </span>
        </span>
        {stats.percentBeatBenchmark !== undefined && (
          <span className="text-ink-400">
            Beat benchmark:{" "}
            <span className={cn(
              "font-mono font-medium tabular-nums",
              stats.percentBeatBenchmark >= 60 ? "text-good-500" : stats.percentBeatBenchmark >= 40 ? "text-mustard-600" : "text-ugly-500"
            )}>
              {stats.percentBeatBenchmark.toFixed(1)}% of periods
            </span>
          </span>
        )}
      </div>
    </div>
  );
}

function MiniStat({ label, value, sentiment }: { label: string; value: number; sentiment: "good" | "ugly" | "neutral" }) {
  return (
    <div className="text-right">
      <span className="text-2xs text-ink-400 block">{label}</span>
      <span className={cn(
        "font-mono text-xs font-medium tabular-nums",
        sentiment === "good" ? "text-good-500" : sentiment === "ugly" ? "text-ugly-500" : "text-ink-700"
      )}>
        {value >= 0 ? "+" : ""}{value.toFixed(1)}%
      </span>
    </div>
  );
}

function RollingTooltip({ active, payload, label, benchmarkName }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg shadow-dropdown px-3 py-2">
      <p className="text-xs text-ink-400 mb-1.5">{formatDate(label)}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-xs text-ink-700">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className={cn(
            "font-mono text-xs font-medium tabular-nums",
            (entry.value as number) >= 0 ? "text-good-500" : "text-ugly-500"
          )}>
            {entry.value >= 0 ? "+" : ""}{entry.value.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default DrawdownChart;
