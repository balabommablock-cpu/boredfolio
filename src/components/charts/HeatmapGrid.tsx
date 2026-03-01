import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { BRAND_COLORS } from "@/lib/utils";

/*
 * HEATMAP GRID
 * ────────────
 * Used for: Category performance heatmap, Monthly returns,
 * Portfolio overlap matrix, Correlation matrix.
 *
 * Custom SVG-free implementation — pure CSS grid with color interpolation.
 */

export interface HeatmapCell {
  row: string;
  col: string;
  value: number;
  label?: string;
}

interface HeatmapGridProps {
  data: HeatmapCell[];
  rows: string[];
  cols: string[];
  title?: string;
  formatValue?: (value: number) => string;
  colorScale?: "diverging" | "sequential";
  midpoint?: number;
  onCellClick?: (cell: HeatmapCell) => void;
  compact?: boolean;
  className?: string;
}

export function HeatmapGrid({
  data,
  rows,
  cols,
  title,
  formatValue = (v) => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
  colorScale = "diverging",
  midpoint = 0,
  onCellClick,
  compact = false,
  className,
}: HeatmapGridProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  // Build lookup map
  const cellMap = new Map<string, HeatmapCell>();
  data.forEach((cell) => {
    cellMap.set(`${cell.row}::${cell.col}`, cell);
  });

  // Calculate min/max for color scaling
  const values = data.map((d) => d.value).filter((v) => !isNaN(v));
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  const getColor = (value: number): string => {
    if (isNaN(value)) return BRAND_COLORS.border;

    if (colorScale === "diverging") {
      if (value >= midpoint) {
        const intensity = maxVal === midpoint ? 0 : (value - midpoint) / (maxVal - midpoint);
        return interpolateColor("#FAF8F4", "#4A7C59", Math.min(intensity, 1));
      } else {
        const intensity = minVal === midpoint ? 0 : (midpoint - value) / (midpoint - minVal);
        return interpolateColor("#FAF8F4", "#C4453C", Math.min(intensity, 1));
      }
    }

    // Sequential (0 to max)
    const intensity = maxVal === minVal ? 0.5 : (value - minVal) / (maxVal - minVal);
    return interpolateColor("#FAF8F4", BRAND_COLORS.sage, intensity);
  };

  const getTextColor = (value: number): string => {
    if (isNaN(value)) return "#8E8E8E";
    const bgColor = getColor(value);
    return isLightColor(bgColor) ? "#1A1A1A" : "#FFFFFF";
  };

  const cellSize = compact ? "min-h-[28px] min-w-[48px]" : "min-h-[36px] min-w-[60px]";
  const fontSize = compact ? "text-2xs" : "text-xs";

  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400">
          {title}
        </h4>
      )}

      <div className="overflow-x-auto border border-cream-300 rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-cream-100 border-b border-r border-cream-300 px-3 py-2 text-left text-2xs font-semibold uppercase tracking-wider text-ink-400">
                &nbsp;
              </th>
              {cols.map((col) => (
                <th
                  key={col}
                  className="bg-cream-100 border-b border-cream-300 px-2 py-2 text-center text-2xs font-semibold uppercase tracking-wider text-ink-400 whitespace-nowrap"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row}>
                <td className="sticky left-0 z-10 bg-cream-50 border-r border-b border-cream-200 px-3 py-1.5 text-xs text-ink-700 font-medium whitespace-nowrap">
                  {row}
                </td>
                {cols.map((col) => {
                  const cell = cellMap.get(`${row}::${col}`);
                  const value = cell?.value ?? NaN;
                  const bgColor = getColor(value);
                  const textColor = getTextColor(value);

                  return (
                    <td
                      key={col}
                      className={cn(
                        "border-b border-cream-200/50 text-center cursor-default transition-all duration-100",
                        cellSize,
                        onCellClick && "cursor-pointer hover:ring-2 hover:ring-ink-900/20 hover:z-10",
                        hoveredCell?.row === row && hoveredCell?.col === col && "ring-2 ring-ink-900/30 z-10"
                      )}
                      style={{ backgroundColor: bgColor, color: textColor }}
                      onClick={() => cell && onCellClick?.(cell)}
                      onMouseEnter={() => cell && setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className={cn("font-mono tabular-nums font-medium", fontSize)}>
                        {isNaN(value) ? "—" : formatValue(value)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Color scale legend */}
      <div className="flex items-center gap-2 text-2xs text-ink-400">
        <span>{formatValue(minVal)}</span>
        <div className="flex-1 h-2 rounded-full overflow-hidden flex">
          {colorScale === "diverging" ? (
            <>
              <div className="flex-1" style={{ background: `linear-gradient(to right, #C4453C, #FAF8F4)` }} />
              <div className="flex-1" style={{ background: `linear-gradient(to right, #FAF8F4, #4A7C59)` }} />
            </>
          ) : (
            <div className="flex-1" style={{ background: `linear-gradient(to right, #FAF8F4, ${BRAND_COLORS.sage})` }} />
          )}
        </div>
        <span>{formatValue(maxVal)}</span>
      </div>
    </div>
  );
}

/* ── Overlap Matrix (specialized heatmap for portfolio overlap) ── */
export function OverlapMatrix({
  funds,
  overlaps,
  onCellClick,
  className,
}: {
  funds: { id: string; name: string }[];
  overlaps: { fund1: string; fund2: string; overlap: number }[];
  onCellClick?: (fund1: string, fund2: string, overlap: number) => void;
  className?: string;
}) {
  // Build data for heatmap
  const overlapMap = new Map<string, number>();
  overlaps.forEach((o) => {
    overlapMap.set(`${o.fund1}::${o.fund2}`, o.overlap);
    overlapMap.set(`${o.fund2}::${o.fund1}`, o.overlap);
  });

  const fundNames = funds.map((f) => f.name);

  const heatData: HeatmapCell[] = [];
  funds.forEach((f1) => {
    funds.forEach((f2) => {
      const overlap = f1.id === f2.id ? 100 : (overlapMap.get(`${f1.id}::${f2.id}`) ?? 0);
      heatData.push({
        row: f1.name,
        col: f2.name,
        value: overlap,
      });
    });
  });

  return (
    <HeatmapGrid
      data={heatData}
      rows={fundNames}
      cols={fundNames}
      title="Portfolio Overlap (%)"
      formatValue={(v) => `${v.toFixed(0)}%`}
      colorScale="sequential"
      onCellClick={onCellClick ? (cell) => onCellClick(cell.row, cell.col, cell.value) : undefined}
      compact
      className={className}
    />
  );
}

/* ── Color helpers ── */
function interpolateColor(color1: string, color2: string, t: number): string {
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);
  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

export default HeatmapGrid;
