import React, { useState } from "react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  Sector,
  Tooltip as RechartsTooltip,
} from "recharts";
import { cn, formatPercent, getChartColor, BRAND_COLORS } from "@/lib/utils";

/*
 * PIE / DONUT CHART
 * ─────────────────
 * Used for: Sector allocation, Market cap breakdown,
 * Asset allocation (hybrid), Credit quality, Portfolio composition.
 * 
 * Warm brand-aligned palette. Active sector highlight on hover.
 * Always paired with a legend/table showing exact percentages.
 */

export interface PieDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface AllocationPieChartProps {
  data: PieDataPoint[];
  height?: number;
  donut?: boolean;
  showLabels?: boolean;
  showLegend?: boolean;
  showTable?: boolean;
  title?: string;
  className?: string;
}

export function AllocationPieChart({
  data,
  height = 280,
  donut = true,
  showLabels = false,
  showLegend = true,
  showTable = true,
  title,
  className,
}: AllocationPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Sort by value descending
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Assign colors
  const coloredData = sortedData.map((d, i) => ({
    ...d,
    color: d.color || getChartColor(i),
  }));

  return (
    <div className={cn("space-y-4", className)}>
      {title && (
        <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
          {title}
        </h4>
      )}

      <div className={cn("flex gap-6", showTable ? "flex-col sm:flex-row items-start" : "justify-center")}>
        {/* Chart */}
        <div className={cn("shrink-0", showTable ? "w-full sm:w-[200px]" : "w-[240px]")}>
          <ResponsiveContainer width="100%" height={showTable ? 200 : height}>
            <RechartsPie>
              <Pie
                data={coloredData}
                cx="50%"
                cy="50%"
                innerRadius={donut ? "55%" : 0}
                outerRadius="85%"
                paddingAngle={1}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                activeIndex={activeIndex !== null ? activeIndex : undefined}
                activeShape={renderActiveShape}
              >
                {coloredData.map((entry, i) => (
                  <Cell
                    key={i}
                    fill={entry.color}
                    stroke={BRAND_COLORS.surface}
                    strokeWidth={1}
                    style={{
                      opacity: activeIndex !== null && activeIndex !== i ? 0.4 : 1,
                      transition: "opacity 0.2s ease",
                    }}
                  />
                ))}
              </Pie>
              <RechartsTooltip content={<PieTooltip />} />
            </RechartsPie>
          </ResponsiveContainer>
        </div>

        {/* Legend / Table */}
        {showTable && (
          <div className="flex-1 min-w-0 w-full">
            <div className="space-y-0">
              {coloredData.map((entry, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center justify-between py-2 px-2 rounded-md",
                    "transition-colors duration-150 cursor-default",
                    "border-b border-cream-200 last:border-0",
                    activeIndex === i && "bg-cream-200/60"
                  )}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-ink-700 truncate">{entry.name}</span>
                  </span>
                  <span className="font-mono text-sm text-ink-900 tabular-nums font-medium shrink-0 ml-3">
                    {entry.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inline legend (no table) */}
        {showLegend && !showTable && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
            {coloredData.map((entry, i) => (
              <span key={i} className="flex items-center gap-1.5 text-xs text-ink-500">
                <span
                  className="h-2 w-2 rounded-sm shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name} ({entry.value.toFixed(1)}%)
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Active shape for hover effect ── */
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 4}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
    />
  );
};

/* ── Pie Tooltip ── */
function PieTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-cream-50 border border-cream-300 rounded-lg shadow-dropdown px-3 py-2">
      <span className="flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: entry.payload.color }}
        />
        <span className="text-sm text-ink-700">{entry.name}</span>
        <span className="font-mono text-sm text-ink-900 font-medium tabular-nums">
          {entry.value.toFixed(2)}%
        </span>
      </span>
    </div>
  );
}

/* ── Market Cap Allocation Bar (horizontal stacked) ── */
export function MarketCapBar({
  large,
  mid,
  small,
  micro = 0,
  className,
}: {
  large: number;
  mid: number;
  small: number;
  micro?: number;
  className?: string;
}) {
  const segments = [
    { label: "Large", value: large, color: BRAND_COLORS.sage },
    { label: "Mid", value: mid, color: "#5A8FA8" },
    { label: "Small", value: small, color: BRAND_COLORS.mustard },
    ...(micro > 0 ? [{ label: "Micro", value: micro, color: "#C47A5C" }] : []),
  ];

  return (
    <div className={cn("space-y-2", className)}>
      {/* Bar */}
      <div className="h-6 rounded-md overflow-hidden flex bg-cream-200">
        {segments.map((seg, i) =>
          seg.value > 0 ? (
            <div
              key={i}
              className="h-full flex items-center justify-center transition-all duration-300"
              style={{
                width: `${seg.value}%`,
                backgroundColor: seg.color,
                minWidth: seg.value > 3 ? "auto" : "4px",
              }}
            >
              {seg.value >= 10 && (
                <span className="text-2xs font-mono font-medium text-white/90 tabular-nums">
                  {seg.value.toFixed(0)}%
                </span>
              )}
            </div>
          ) : null
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4">
        {segments.map((seg, i) => (
          <span key={i} className="flex items-center gap-1.5 text-xs text-ink-500">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: seg.color }}
            />
            {seg.label}: <span className="font-mono tabular-nums font-medium text-ink-700">{seg.value.toFixed(1)}%</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default AllocationPieChart;
