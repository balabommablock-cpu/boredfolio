import React from "react";
import { cn, formatAUM } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ReturnValue } from "@/components/data/ReturnDisplay";

/*
 * FUND MANAGER CARD
 * ─────────────────
 * Shows manager profile: photo, name, tenure, funds managed,
 * AUM, and Boredfolio hot take.
 * Used on: Scheme Detail (Manager tab), Manager Directory,
 * Manager Profile, AMC Page.
 */

interface FundManagerCardProps {
  name: string;
  qualifications?: string;
  photo?: string;
  amcName: string;
  tenureOnFund?: string;
  totalAUM?: number;
  fundsManaged: number;
  averageAlpha?: number;
  boredfolioTake?: string;
  slug?: string;
  onClick?: () => void;
  variant?: "default" | "compact" | "inline";
  className?: string;
}

export function FundManagerCard({
  name,
  qualifications,
  photo,
  amcName,
  tenureOnFund,
  totalAUM,
  fundsManaged,
  averageAlpha,
  boredfolioTake,
  onClick,
  variant = "default",
  className,
}: FundManagerCardProps) {
  if (variant === "inline") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "flex items-center gap-3",
          onClick && "cursor-pointer",
          className
        )}
      >
        <Avatar name={name} photo={photo} size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900 truncate">{name}</p>
          <p className="text-xs text-ink-400">
            {tenureOnFund && `${tenureOnFund} tenure`}
            {tenureOnFund && fundsManaged > 1 && " · "}
            {fundsManaged > 1 && `${fundsManaged} funds`}
          </p>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div
        onClick={onClick}
        className={cn(
          "bg-cream-50 rounded-lg border border-cream-300 shadow-card p-3",
          "flex items-center gap-3",
          onClick && "cursor-pointer hover:shadow-card-hover transition-shadow",
          className
        )}
      >
        <Avatar name={name} photo={photo} size="md" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-900 truncate">{name}</p>
          <p className="text-xs text-ink-400">{amcName}</p>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xs text-ink-400">
              {fundsManaged} fund{fundsManaged !== 1 ? "s" : ""}
            </span>
            {totalAUM && (
              <span className="text-2xs text-ink-400">
                {formatAUM(totalAUM)} AUM
              </span>
            )}
          </div>
        </div>
        {averageAlpha !== undefined && (
          <div className="text-right shrink-0">
            <span className="text-2xs text-ink-400 block">Avg Alpha</span>
            <ReturnValue value={averageAlpha} size="sm" />
          </div>
        )}
      </div>
    );
  }

  // Default: full card
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-cream-50 rounded-lg border border-cream-300 shadow-card p-5",
        onClick && "cursor-pointer hover:shadow-card-hover transition-shadow",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <Avatar name={name} photo={photo} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-lg text-ink-900 leading-tight">
            {name}
          </h3>
          {qualifications && (
            <p className="text-xs text-ink-400 mt-0.5">{qualifications}</p>
          )}
          <p className="text-sm text-ink-500 mt-1">{amcName}</p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-cream-200">
        {tenureOnFund && (
          <div>
            <span className="text-2xs text-ink-400 block">Tenure</span>
            <span className="text-sm font-medium text-ink-900">{tenureOnFund}</span>
          </div>
        )}
        <div>
          <span className="text-2xs text-ink-400 block">Funds</span>
          <span className="text-sm font-medium text-ink-900">{fundsManaged}</span>
        </div>
        {totalAUM && (
          <div>
            <span className="text-2xs text-ink-400 block">Total AUM</span>
            <span className="text-sm font-medium text-ink-900 font-mono tabular-nums">
              {formatAUM(totalAUM)}
            </span>
          </div>
        )}
      </div>

      {/* Average alpha */}
      {averageAlpha !== undefined && (
        <div className="mt-3 pt-3 border-t border-cream-200 flex items-center justify-between">
          <span className="text-xs text-ink-400">Average Alpha (3Y)</span>
          <ReturnValue value={averageAlpha} size="md" showArrow />
        </div>
      )}

      {/* Boredfolio take */}
      {boredfolioTake && (
        <div className="mt-3 pt-3 border-t border-cream-200">
          <p className="text-xs text-ink-500 italic leading-relaxed">
            &ldquo;{boredfolioTake}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

/* ── Avatar ── */
function Avatar({
  name,
  photo,
  size = "md",
}: {
  name: string;
  photo?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={cn("rounded-full object-cover shrink-0", sizeStyles[size])}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-sage-100 text-sage-700 font-semibold",
        "flex items-center justify-center shrink-0",
        sizeStyles[size]
      )}
    >
      {initials}
    </div>
  );
}

export default FundManagerCard;
