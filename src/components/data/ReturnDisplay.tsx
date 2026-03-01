import React from "react";
import { cn, formatPercent, returnSentiment } from "@/lib/utils";

/*
 * RETURN DISPLAY
 * ──────────────
 * The most frequently used data display in all of Boredfolio.
 * Shows return values with color (good/ugly), arrows, and context.
 * Mono font, tabular nums, always right-aligned in tables.
 */

interface ReturnValueProps {
  value: number | null | undefined;
  decimals?: number;
  showSign?: boolean;
  showArrow?: boolean;
  size?: "sm" | "md" | "lg";
  suffix?: string;
  className?: string;
}

export function ReturnValue({
  value,
  decimals = 2,
  showSign = true,
  showArrow = false,
  size = "md",
  suffix,
  className,
}: ReturnValueProps) {
  if (value === null || value === undefined || isNaN(value)) {
    return <span className={cn("font-mono text-ink-300", className)}>—</span>;
  }

  const sentiment = returnSentiment(value);

  const sizeStyles = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const colorStyles = {
    positive: "text-good-500",
    negative: "text-ugly-500",
    neutral: "text-ink-700",
  };

  return (
    <span
      className={cn(
        "font-mono tabular-nums tracking-tight font-medium inline-flex items-center gap-0.5",
        sizeStyles[size],
        colorStyles[sentiment],
        className
      )}
      data-return={sentiment}
    >
      {showArrow && sentiment !== "neutral" && (
        <Arrow direction={sentiment === "positive" ? "up" : "down"} />
      )}
      {showSign && value > 0 ? "+" : ""}
      {value.toFixed(decimals)}
      {suffix || "%"}
    </span>
  );
}

/* ── Arrow indicator ── */
function Arrow({ direction }: { direction: "up" | "down" }) {
  return (
    <svg
      className={cn(
        "h-3 w-3 shrink-0",
        direction === "up" ? "text-good-500" : "text-ugly-500"
      )}
      viewBox="0 0 12 12"
      fill="currentColor"
    >
      {direction === "up" ? (
        <path d="M6 2L10 7H2L6 2Z" />
      ) : (
        <path d="M6 10L2 5H10L6 10Z" />
      )}
    </svg>
  );
}

/* ── Return with label (e.g., "3Y CAGR: +18.45%") ── */
export function ReturnWithLabel({
  label,
  value,
  decimals = 2,
  className,
}: {
  label: string;
  value: number | null | undefined;
  decimals?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline gap-1.5", className)}>
      <span className="text-xs text-ink-400 whitespace-nowrap">{label}</span>
      <ReturnValue value={value} decimals={decimals} size="sm" showArrow />
    </div>
  );
}

/* ── Return Row (for the Returns Table: period + fund + benchmark + category + rank) ── */
export interface ReturnRowData {
  period: string;
  fundReturn: number | null;
  benchmarkReturn: number | null;
  categoryAvg: number | null;
  percentileRank: number | null;
}

export function ReturnRow({
  data,
  compact = false,
}: {
  data: ReturnRowData;
  compact?: boolean;
}) {
  const padding = compact ? "py-2 px-3" : "py-2.5 px-4";

  return (
    <tr className="border-b border-cream-200 last:border-0 hover:bg-cream-200/40 transition-colors">
      <td className={cn("text-sm font-medium text-ink-700", padding)}>
        {data.period}
      </td>
      <td className={cn("text-right", padding)}>
        <ReturnValue value={data.fundReturn} size="sm" />
      </td>
      <td className={cn("text-right", padding)}>
        <ReturnValue value={data.benchmarkReturn} size="sm" showSign={false} />
      </td>
      <td className={cn("text-right", padding)}>
        <ReturnValue value={data.categoryAvg} size="sm" showSign={false} />
      </td>
      <td className={cn("text-right", padding)}>
        {data.percentileRank !== null ? (
          <PercentileRank rank={data.percentileRank} />
        ) : (
          <span className="font-mono text-xs text-ink-300">—</span>
        )}
      </td>
    </tr>
  );
}

/* ── Percentile Rank display ── */
export function PercentileRank({
  rank,
  className,
}: {
  rank: number;
  className?: string;
}) {
  const getColor = (r: number) => {
    if (r >= 75) return "text-good-500 bg-good-50";
    if (r >= 50) return "text-mustard-600 bg-mustard-50";
    if (r >= 25) return "text-ink-500 bg-cream-200";
    return "text-ugly-500 bg-ugly-50";
  };

  return (
    <span
      className={cn(
        "inline-block font-mono text-xs font-medium tabular-nums",
        "px-1.5 py-0.5 rounded",
        getColor(rank),
        className
      )}
    >
      P{rank}
    </span>
  );
}

/* ── Change indicator (for holdings: ▲ +2.3% / NEW / EXIT) ── */
export function ChangeIndicator({
  type,
  amount,
  className,
}: {
  type: "increased" | "decreased" | "new" | "exited" | "unchanged";
  amount?: number;
  className?: string;
}) {
  const configs = {
    increased: { label: amount ? `+${amount.toFixed(1)}%` : "▲", color: "text-good-500" },
    decreased: { label: amount ? `${amount.toFixed(1)}%` : "▼", color: "text-ugly-500" },
    new: { label: "NEW", color: "text-sage-600 bg-sage-100 px-1.5 py-0.5 rounded text-2xs font-semibold" },
    exited: { label: "EXIT", color: "text-ugly-600 bg-ugly-100 px-1.5 py-0.5 rounded text-2xs font-semibold" },
    unchanged: { label: "—", color: "text-ink-300" },
  };

  const config = configs[type];

  return (
    <span className={cn("font-mono text-xs", config.color, className)}>
      {config.label}
    </span>
  );
}

export default ReturnValue;
