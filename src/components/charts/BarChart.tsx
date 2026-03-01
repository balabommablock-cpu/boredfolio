import React from "react";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { cn, formatPercent, BRAND_COLORS } from "@/lib/utils";

/*
 * BAR CHART
 * ─────────
 * Used for: Calendar year returns, AUM flows (in/out),
 * comparison bars, distribution histograms.
 *
 * Supports: single series, multi-series, positive/negative coloring.
 */

export interface BarDataPoint {
  label: string;
  [key: string]: number | string;
}

interface BarChartProps {
  data: BarDataPoint[];
  bars: {
    key: string;
    name: string;
    color?: string;
    stackId?: string;
  }[];
  height?: number;
  layout?: "vertical" | "horizontal";
  showGrid?: boolean;
  showZeroLine?: boolean;
  colorByValue?: boolean; // good/ugly based on positive/negative
  formatValue?: (value: number) => string;
  className?: string;
}

export function BarChartComponent({
  data,
  bars,
  height = 280,
  layout = "vertical",
  showGrid = true,
  showZeroLine = true,
  colorByValue = false,
  formatValue = (v) => formatPercent(v),
  className,
}: BarChartProps) {
  return (
    <div className={cn("bg-cream-50 border border-cream-300 rounded-lg p-4", className)}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBar
          data={data}
          layout={layout === "horizontal" ? "vertical" : "horizontal"}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          barCategoryGap="20%"
        >
          {showGrid && (
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={BRAND_COLORS.border}
              vertical={false}
            />
          )}
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "DM Sans" }}
            axisLine={{ stroke: BRAND_COLORS.border }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "JetBrains Mono" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}%`}
            width={50}
          />
          <RechartsTooltip content={<BarTooltip formatValue={formatValue} />} />

          {showZeroLine && (
            <ReferenceLine y={0} stroke={BRAND_COLORS.border} strokeWidth={1} />
          )}

          {bars.map((bar, i) => (
            <Bar
              key={bar.key}
              dataKey={bar.key}
              name={bar.name}
              fill={bar.color || getBarColor(i)}
              radius={[3, 3, 0, 0]}
              stackId={bar.stackId}
              maxBarSize={40}
            >
              {colorByValue &&
                data.map((entry, j) => {
                  const val = entry[bar.key] as number;
                  return (
                    <Cell
                      key={j}
                      fill={val >= 0 ? BRAND_COLORS.good : BRAND_COLORS.ugly}
                    />
                  );
                })}
            </Bar>
          ))}
        </RechartsBar>
      </ResponsiveContainer>
    </div>
  );
}

function getBarColor(index: number): string {
  const colors = [BRAND_COLORS.sage, BRAND_COLORS.mustard, "#5A8FA8", "#7B68A8"];
  return colors[index % colors.length];
}

/* ── Bar Tooltip ── */
function BarTooltip({ active, payload, label, formatValue }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg shadow-dropdown p-3 min-w-[150px]">
      <p className="text-xs text-ink-400 mb-1.5 font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-xs text-ink-700">
            <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: entry.color }} />
            {entry.name}
          </span>
          <span className={cn(
            "font-mono text-xs tabular-nums font-medium",
            (entry.value as number) >= 0 ? "text-good-500" : "text-ugly-500"
          )}>
            {formatValue(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Simplified: Year Returns Bar ── */
export function YearReturnsChart({
  data,
  className,
}: {
  data: { year: string; fund: number; benchmark?: number; categoryAvg?: number }[];
  className?: string;
}) {
  const chartData = data.map((d) => ({
    label: d.year,
    fund: d.fund,
    ...(d.benchmark !== undefined && { benchmark: d.benchmark }),
    ...(d.categoryAvg !== undefined && { categoryAvg: d.categoryAvg }),
  }));

  const bars: BarChartProps["bars"] = [
    { key: "fund", name: "Fund", color: BRAND_COLORS.sage },
  ];
  if (data.some((d) => d.benchmark !== undefined)) {
    bars.push({ key: "benchmark", name: "Benchmark", color: "#5A8FA8" });
  }
  if (data.some((d) => d.categoryAvg !== undefined)) {
    bars.push({ key: "categoryAvg", name: "Category Avg", color: BRAND_COLORS.mustard });
  }

  return (
    <BarChartComponent
      data={chartData}
      bars={bars}
      colorByValue={bars.length === 1}
      className={className}
    />
  );
}

export default BarChartComponent;
