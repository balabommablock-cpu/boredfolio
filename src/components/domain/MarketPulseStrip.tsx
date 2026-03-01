import React from "react";
import { cn, formatPercent, formatIndianNumber } from "@/lib/utils";
import type { IndexData } from "@/types";

/*
 * MARKET PULSE STRIP
 * ──────────────────
 * Horizontal scrolling ticker of market indices.
 * Home page and Market Dashboard. Always visible.
 * Charcoal background — the one dark element in the light UI.
 */

interface MarketPulseStripProps {
  indices: IndexData[];
  className?: string;
}

export function MarketPulseStrip({
  indices,
  className,
}: MarketPulseStripProps) {
  return (
    <div
      className={cn(
        "bg-ink-900 text-white overflow-hidden",
        "border-b border-ink-800",
        className
      )}
    >
      <div className="section flex items-center h-9 gap-6 overflow-x-auto scrollbar-none">
        {indices.map((idx, i) => (
          <MarketIndexChip key={idx.name} data={idx} />
        ))}
      </div>
    </div>
  );
}

/* ── Individual index chip ── */
function MarketIndexChip({ data }: { data: IndexData }) {
  const isPositive = data.changePercent >= 0;

  return (
    <div className="flex items-center gap-2 shrink-0">
      <span className="text-xs font-medium text-white/70 whitespace-nowrap">
        {data.name}
      </span>
      <span className="font-mono text-xs text-white tabular-nums">
        {formatIndianNumber(data.value, data.value > 100 ? 0 : 2)}
      </span>
      <span
        className={cn(
          "font-mono text-xs tabular-nums",
          isPositive ? "text-green-400" : "text-red-400"
        )}
      >
        {isPositive ? "+" : ""}
        {data.changePercent.toFixed(2)}%
      </span>
      {/* Separator */}
      <span className="text-white/20 text-xs">|</span>
    </div>
  );
}

/* ── Boredfolio Market Mood (VIX translation) ── */
export function MarketMoodBadge({
  vix,
  className,
}: {
  vix: number;
  className?: string;
}) {
  const getMood = (v: number) => {
    if (v < 12) return { label: "Zen Mode", color: "text-green-400 bg-green-400/10" };
    if (v < 15) return { label: "Calm-ish", color: "text-green-300 bg-green-300/10" };
    if (v < 20) return { label: "Mildly Anxious", color: "text-yellow-400 bg-yellow-400/10" };
    if (v < 25) return { label: "Sweating", color: "text-orange-400 bg-orange-400/10" };
    if (v < 30) return { label: "Panic Buying Alcohol", color: "text-red-400 bg-red-400/10" };
    return { label: "Apocalypse Vibes", color: "text-red-500 bg-red-500/10" };
  };

  const mood = getMood(vix);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-medium",
        mood.color,
        className
      )}
    >
      <span className="font-mono tabular-nums">{vix.toFixed(1)}</span>
      <span className="text-white/50">·</span>
      <span>{mood.label}</span>
    </span>
  );
}

export default MarketPulseStrip;
