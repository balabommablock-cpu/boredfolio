import React from "react";
import { cn } from "@/lib/utils";
import type { RiskLevel, RiskLabel } from "@/types";

/*
 * RISK-O-METER
 * ────────────
 * SEBI's 1-5 risk scale, but make it editorial.
 * Visual gauge with Boredfolio plain-English translation.
 */

const riskConfig: Record<RiskLevel, {
  label: RiskLabel;
  color: string;
  bgColor: string;
  boredfolioTake: string;
  width: string;
}> = {
  1: {
    label: "Low",
    color: "text-good-500",
    bgColor: "bg-good-500",
    boredfolioTake: "Your money naps here. Peacefully.",
    width: "20%",
  },
  2: {
    label: "Low to Moderate",
    color: "text-good-600",
    bgColor: "bg-good-600",
    boredfolioTake: "Mild turbulence. Keep your tray table up.",
    width: "40%",
  },
  3: {
    label: "Moderate",
    color: "text-mustard-500",
    bgColor: "bg-mustard-500",
    boredfolioTake: "The roller coaster has dips but you'll keep your lunch.",
    width: "60%",
  },
  4: {
    label: "Moderately High",
    color: "text-mustard-700",
    bgColor: "bg-mustard-700",
    boredfolioTake: "You'll check your portfolio at 2am. Occasionally.",
    width: "80%",
  },
  5: {
    label: "High",
    color: "text-ugly-500",
    bgColor: "bg-ugly-500",
    boredfolioTake: "Buckle up. Your portfolio is going bungee jumping.",
    width: "100%",
  },
};

interface RiskOMeterProps {
  level: RiskLevel;
  variant?: "full" | "compact" | "inline";
  showTake?: boolean;
  className?: string;
}

export function RiskOMeter({
  level,
  variant = "full",
  showTake = true,
  className,
}: RiskOMeterProps) {
  const config = riskConfig[level];

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)}>
        <span className={cn("inline-block h-2 w-2 rounded-full", config.bgColor)} />
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-5 rounded-sm transition-colors",
                i <= level
                  ? riskConfig[i as RiskLevel].bgColor
                  : "bg-cream-300"
              )}
            />
          ))}
        </div>
        <span className={cn("text-xs font-medium", config.color)}>
          {config.label}
        </span>
      </div>
    );
  }

  // Full variant
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.1em] text-ink-400">
          Risk Level
        </span>
        <span className={cn("text-sm font-semibold", config.color)}>
          {config.label}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-3 bg-cream-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", config.bgColor)}
          style={{ width: config.width }}
        />
        {/* Segment markers */}
        <div className="absolute inset-0 flex">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex-1 border-r border-cream-50/50"
            />
          ))}
          <div className="flex-1" />
        </div>
      </div>

      {/* Scale labels */}
      <div className="flex justify-between text-2xs text-ink-400">
        <span>Low</span>
        <span>Moderate</span>
        <span>High</span>
      </div>

      {/* Boredfolio take */}
      {showTake && (
        <p className="text-xs text-ink-500 italic mt-1">
          {config.boredfolioTake}
        </p>
      )}
    </div>
  );
}

export default RiskOMeter;
