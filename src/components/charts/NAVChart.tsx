import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { cn, formatINR, formatNAV, formatDate, BRAND_COLORS } from "@/lib/utils";
import { ChipFilters } from "@/components/ui/Tabs";
import { Toggle } from "@/components/ui/Input";

/*
 * NAV CHART
 * ─────────
 * The centrepiece of the Scheme Detail page.
 * Interactive line chart with:
 *   - Primary NAV line (sage)
 *   - Overlay toggles: benchmark, category avg, SIP value, lumpsum value
 *   - Time period selector: 1M/3M/6M/YTD/1Y/3Y/5Y/Max
 *   - Log scale toggle
 *   - Event markers (manager change, benchmark change)
 *   - Custom tooltip with Boredfolio styling
 */

export interface NAVChartDataPoint {
  date: string;        // ISO date
  nav: number;
  benchmark?: number;  // rebased
  categoryAvg?: number; // rebased
  sipValue?: number;   // ₹ value of SIP
  lumpsumValue?: number; // ₹ value of lumpsum
}

export interface ChartEvent {
  date: string;
  label: string;
  type: "manager_change" | "benchmark_change" | "category_change" | "merger";
}

interface NAVChartProps {
  data: NAVChartDataPoint[];
  events?: ChartEvent[];
  schemeName?: string;
  benchmarkName?: string;
  height?: number;
  showOverlayToggles?: boolean;
  showPeriodSelector?: boolean;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;
  className?: string;
}

const PERIODS = [
  { id: "1M", label: "1M" },
  { id: "3M", label: "3M" },
  { id: "6M", label: "6M" },
  { id: "YTD", label: "YTD" },
  { id: "1Y", label: "1Y" },
  { id: "3Y", label: "3Y" },
  { id: "5Y", label: "5Y" },
  { id: "MAX", label: "Max" },
];

const OVERLAY_COLORS = {
  nav: BRAND_COLORS.sage,
  benchmark: "#5A8FA8",
  categoryAvg: BRAND_COLORS.mustard,
  sipValue: "#7B68A8",
  lumpsumValue: "#C47A5C",
};

export function NAVChart({
  data,
  events,
  schemeName = "Fund NAV",
  benchmarkName = "Benchmark",
  height = 360,
  showOverlayToggles = true,
  showPeriodSelector = true,
  defaultPeriod = "3Y",
  onPeriodChange,
  className,
}: NAVChartProps) {
  const [period, setPeriod] = useState(defaultPeriod);
  const [logScale, setLogScale] = useState(false);
  const [overlays, setOverlays] = useState({
    benchmark: false,
    categoryAvg: false,
    sipValue: false,
    lumpsumValue: false,
  });

  const toggleOverlay = (key: keyof typeof overlays) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePeriodChange = (p: string) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

  // Check which overlays have data
  const hasData = useMemo(() => ({
    benchmark: data.some((d) => d.benchmark !== undefined),
    categoryAvg: data.some((d) => d.categoryAvg !== undefined),
    sipValue: data.some((d) => d.sipValue !== undefined),
    lumpsumValue: data.some((d) => d.lumpsumValue !== undefined),
  }), [data]);

  // Format X axis ticks based on data density
  const formatXTick = (dateStr: string) => {
    const d = new Date(dateStr);
    if (data.length < 90) return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    if (data.length < 365) return d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Controls bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {showPeriodSelector && (
          <ChipFilters
            options={PERIODS}
            selected={period}
            onChange={handlePeriodChange}
          />
        )}
        <div className="flex items-center gap-4">
          <Toggle
            label="Log scale"
            checked={logScale}
            onChange={setLogScale}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="bg-cream-50 border border-cream-300 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={height}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={BRAND_COLORS.border}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tickFormatter={formatXTick}
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "DM Sans" }}
              axisLine={{ stroke: BRAND_COLORS.border }}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={60}
            />
            <YAxis
              scale={logScale ? "log" : "auto"}
              domain={logScale ? ["auto", "auto"] : ["dataMin - 5", "dataMax + 5"]}
              tick={{ fontSize: 11, fill: "#8E8E8E", fontFamily: "JetBrains Mono" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v.toFixed(0)}
              width={55}
            />
            <RechartsTooltip content={<CustomTooltip benchmarkName={benchmarkName} />} />

            {/* Primary NAV line */}
            <Line
              type="monotone"
              dataKey="nav"
              stroke={OVERLAY_COLORS.nav}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: OVERLAY_COLORS.nav, strokeWidth: 0 }}
              name={schemeName}
            />

            {/* Overlay lines */}
            {overlays.benchmark && hasData.benchmark && (
              <Line
                type="monotone"
                dataKey="benchmark"
                stroke={OVERLAY_COLORS.benchmark}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                name={benchmarkName}
              />
            )}
            {overlays.categoryAvg && hasData.categoryAvg && (
              <Line
                type="monotone"
                dataKey="categoryAvg"
                stroke={OVERLAY_COLORS.categoryAvg}
                strokeWidth={1.5}
                strokeDasharray="4 3"
                dot={false}
                name="Category Avg"
              />
            )}
            {overlays.sipValue && hasData.sipValue && (
              <Line
                type="monotone"
                dataKey="sipValue"
                stroke={OVERLAY_COLORS.sipValue}
                strokeWidth={1.5}
                dot={false}
                name="SIP Value"
              />
            )}
            {overlays.lumpsumValue && hasData.lumpsumValue && (
              <Line
                type="monotone"
                dataKey="lumpsumValue"
                stroke={OVERLAY_COLORS.lumpsumValue}
                strokeWidth={1.5}
                dot={false}
                name="Lumpsum Value"
              />
            )}

            {/* Event markers */}
            {events?.map((evt, i) => (
              <ReferenceLine
                key={i}
                x={evt.date}
                stroke={BRAND_COLORS.mustard}
                strokeDasharray="2 4"
                strokeWidth={1}
                label={{
                  value: "●",
                  position: "top",
                  fill: BRAND_COLORS.mustard,
                  fontSize: 8,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Overlay toggles */}
      {showOverlayToggles && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs text-ink-400 font-medium uppercase tracking-wider">Overlay:</span>
          {hasData.benchmark && (
            <OverlayToggle
              label={benchmarkName}
              color={OVERLAY_COLORS.benchmark}
              active={overlays.benchmark}
              onClick={() => toggleOverlay("benchmark")}
            />
          )}
          {hasData.categoryAvg && (
            <OverlayToggle
              label="Category Avg"
              color={OVERLAY_COLORS.categoryAvg}
              active={overlays.categoryAvg}
              onClick={() => toggleOverlay("categoryAvg")}
            />
          )}
          {hasData.sipValue && (
            <OverlayToggle
              label="SIP Value (₹10K/mo)"
              color={OVERLAY_COLORS.sipValue}
              active={overlays.sipValue}
              onClick={() => toggleOverlay("sipValue")}
            />
          )}
          {hasData.lumpsumValue && (
            <OverlayToggle
              label="Lumpsum Value (₹1L)"
              color={OVERLAY_COLORS.lumpsumValue}
              active={overlays.lumpsumValue}
              onClick={() => toggleOverlay("lumpsumValue")}
            />
          )}
        </div>
      )}
    </div>
  );
}

/* ── Overlay Toggle Button ── */
function OverlayToggle({
  label,
  color,
  active,
  onClick,
}: {
  label: string;
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
        "border transition-all duration-150 focus-ring",
        active
          ? "border-current bg-cream-200 text-ink-900"
          : "border-cream-300 text-ink-400 hover:text-ink-700 hover:border-cream-400"
      )}
    >
      <span
        className="h-2.5 w-2.5 rounded-sm shrink-0"
        style={{ backgroundColor: active ? color : "#ABABAB" }}
      />
      {label}
    </button>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({
  active,
  payload,
  label,
  benchmarkName,
}: any) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg shadow-dropdown p-3 min-w-[180px]">
      <p className="text-xs text-ink-400 mb-2 font-medium">
        {formatDate(label)}
      </p>
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center justify-between gap-4 py-0.5">
          <span className="flex items-center gap-1.5 text-xs text-ink-700">
            <span
              className="h-2 w-2 rounded-sm shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            {entry.name}
          </span>
          <span className="font-mono text-xs text-ink-900 tabular-nums font-medium">
            {entry.dataKey.includes("Value")
              ? formatINR(entry.value, 0)
              : formatNAV(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default NAVChart;
