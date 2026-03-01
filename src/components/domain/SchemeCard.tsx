import React from "react";
import { cn, formatAUM, formatPercent } from "@/lib/utils";
import { Badge, PlanBadge, CategoryBadge, VerdictBadge } from "@/components/ui/Badge";
import { ReturnValue, ReturnWithLabel } from "@/components/data/ReturnDisplay";
import { RiskOMeter } from "@/components/domain/RiskOMeter";
import type { RiskLevel, Verdict } from "@/types";

/*
 * SCHEME CARD
 * ───────────
 * The fund's business card. Used on: Home, Category, Screener, NFO, Watchlist.
 * Shows: name, category, key returns, TER, AUM, and Boredfolio verdict.
 * Clickable → /fund/{slug}
 */

interface SchemeCardProps {
  name: string;
  shortName?: string;
  amcName: string;
  amcLogo?: string;
  category: string;
  plan: "Direct" | "Regular";
  riskLevel?: RiskLevel;
  nav?: number;
  dailyChange?: number;
  return1Y?: number | null;
  return3Y?: number | null;
  return5Y?: number | null;
  ter?: number;
  aum?: number;
  verdict?: Verdict;
  boredfolioTake?: string;
  slug?: string;
  onClick?: () => void;
  variant?: "default" | "compact" | "horizontal";
  selected?: boolean;
  className?: string;
}

export function SchemeCard({
  name,
  shortName,
  amcName,
  amcLogo,
  category,
  plan,
  riskLevel,
  nav,
  dailyChange,
  return1Y,
  return3Y,
  return5Y,
  ter,
  aum,
  verdict,
  boredfolioTake,
  onClick,
  variant = "default",
  selected,
  className,
}: SchemeCardProps) {
  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "bg-cream-50 rounded-lg border p-3",
          "transition-all duration-150",
          selected ? "border-sage-500 shadow-card-hover" : "border-cream-300 shadow-card",
          onClick && "cursor-pointer hover:shadow-card-hover hover:border-cream-400",
          className
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-900 truncate">
              {shortName || name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-ink-400">{amcName}</span>
              <CategoryBadge category={category} />
            </div>
          </div>
          <div className="text-right shrink-0">
            <ReturnValue value={return3Y} size="sm" showArrow />
            <span className="text-2xs text-ink-400 block">3Y CAGR</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "horizontal") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "bg-cream-50 rounded-lg border border-cream-300 shadow-card p-4",
          "transition-all duration-150",
          onClick && "cursor-pointer hover:shadow-card-hover",
          className
        )}
      >
        <div className="flex items-start gap-4">
          {/* AMC Logo */}
          {amcLogo ? (
            <img src={amcLogo} alt={amcName} className="h-8 w-8 rounded object-contain shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded bg-cream-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-ink-400">{amcName.slice(0, 2)}</span>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-ink-900 leading-tight">{name}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <CategoryBadge category={category} />
              <PlanBadge plan={plan} />
              {riskLevel && <RiskOMeter level={riskLevel} variant="inline" />}
            </div>
          </div>

          {/* Returns */}
          <div className="flex gap-6 shrink-0 items-end">
            <ReturnWithLabel label="1Y" value={return1Y} />
            <ReturnWithLabel label="3Y" value={return3Y} />
            <ReturnWithLabel label="5Y" value={return5Y} />
          </div>
        </div>
      </div>
    );
  }

  // Default vertical card
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-cream-50 rounded-lg border border-cream-300 shadow-card",
        "transition-all duration-150 flex flex-col",
        selected && "border-sage-500 ring-1 ring-sage-500",
        onClick && "cursor-pointer hover:shadow-card-hover",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start gap-3">
          {amcLogo ? (
            <img src={amcLogo} alt={amcName} className="h-8 w-8 rounded object-contain shrink-0 mt-0.5" />
          ) : (
            <div className="h-8 w-8 rounded bg-cream-200 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-2xs font-bold text-ink-400">{amcName.slice(0, 2)}</span>
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-ink-900 leading-snug line-clamp-2">
              {name}
            </p>
            <span className="text-xs text-ink-400 mt-0.5 block">{amcName}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
          <CategoryBadge category={category} />
          <PlanBadge plan={plan} />
          {verdict && <VerdictBadge verdict={verdict} showEmoji={false} />}
        </div>
      </div>

      {/* Returns grid */}
      <div className="grid grid-cols-3 gap-0 border-t border-cream-200">
        <ReturnCell label="1Y" value={return1Y} />
        <ReturnCell label="3Y" value={return3Y} border />
        <ReturnCell label="5Y" value={return5Y} border />
      </div>

      {/* Footer: TER + AUM */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-cream-200 mt-auto">
        {ter !== undefined && (
          <div>
            <span className="text-2xs text-ink-400 block">TER</span>
            <span className="font-mono text-xs text-ink-700 tabular-nums">{ter.toFixed(2)}%</span>
          </div>
        )}
        {aum !== undefined && (
          <div className="text-right">
            <span className="text-2xs text-ink-400 block">AUM</span>
            <span className="font-mono text-xs text-ink-700 tabular-nums">{formatAUM(aum)}</span>
          </div>
        )}
      </div>

      {/* Boredfolio take */}
      {boredfolioTake && (
        <div className="px-4 py-2.5 border-t border-cream-200 bg-cream-100/50">
          <p className="text-xs text-ink-500 italic leading-relaxed">
            &ldquo;{boredfolioTake}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Return cell for card grid ── */
function ReturnCell({
  label,
  value,
  border,
}: {
  label: string;
  value: number | null | undefined;
  border?: boolean;
}) {
  return (
    <div
      className={cn(
        "text-center py-2.5 px-2",
        border && "border-l border-cream-200"
      )}
    >
      <span className="text-2xs text-ink-400 block mb-0.5">{label}</span>
      <ReturnValue value={value} size="sm" />
    </div>
  );
}

export default SchemeCard;
