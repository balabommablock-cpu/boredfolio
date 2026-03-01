import React from "react";
import { cn } from "@/lib/utils";

/*
 * BADGE
 * ─────
 * Uppercase tracking, small, confident.
 * Used for: category tags, plan type, verdict labels, status.
 */

type BadgeVariant =
  | "sage" | "mustard" | "good" | "ugly"
  | "neutral" | "info" | "warn"
  | "outline";

type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  sage: "text-sage-700 bg-sage-100 border-sage-100",
  mustard: "text-mustard-700 bg-mustard-100 border-mustard-100",
  good: "text-good-700 bg-good-100 border-good-100",
  ugly: "text-ugly-700 bg-ugly-100 border-ugly-100",
  neutral: "text-ink-500 bg-cream-200 border-cream-200",
  info: "text-info-600 bg-info-100 border-info-100",
  warn: "text-warn-600 bg-warn-100 border-warn-100",
  outline: "text-ink-700 bg-transparent border-cream-300",
};

const dotColors: Record<BadgeVariant, string> = {
  sage: "bg-sage-500",
  mustard: "bg-mustard-500",
  good: "bg-good-500",
  ugly: "bg-ugly-500",
  neutral: "bg-ink-400",
  info: "bg-info-500",
  warn: "bg-warn-500",
  outline: "bg-ink-400",
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-2xs px-1.5 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  variant = "neutral",
  size = "md",
  dot,
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-sans font-semibold",
        "uppercase tracking-[0.12em] rounded border",
        "leading-none whitespace-nowrap select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}

/* ── Verdict Badge (special: Buy/Hold/Avoid/Watch) ── */
type VerdictType = "buy" | "hold" | "avoid" | "watch";

const verdictConfig: Record<VerdictType, { label: string; variant: BadgeVariant; emoji: string }> = {
  buy: { label: "Buy", variant: "good", emoji: "🟢" },
  hold: { label: "Hold", variant: "mustard", emoji: "🟡" },
  avoid: { label: "Avoid", variant: "ugly", emoji: "🔴" },
  watch: { label: "Watch", variant: "info", emoji: "🔵" },
};

export function VerdictBadge({
  verdict,
  showEmoji = true,
  className,
}: {
  verdict: VerdictType;
  showEmoji?: boolean;
  className?: string;
}) {
  const config = verdictConfig[verdict];
  return (
    <Badge variant={config.variant} size="md" className={className}>
      {showEmoji && <span className="not-italic">{config.emoji}</span>}
      {config.label}
    </Badge>
  );
}

/* ── NFO Verdict Badge ── */
type NFOVerdictType = "legit" | "fomo" | "skip" | "wait";

const nfoVerdictConfig: Record<NFOVerdictType, { label: string; variant: BadgeVariant }> = {
  legit: { label: "Legit", variant: "good" },
  fomo: { label: "FOMO", variant: "ugly" },
  skip: { label: "Skip", variant: "neutral" },
  wait: { label: "Wait & See", variant: "mustard" },
};

export function NFOVerdictBadge({
  verdict,
  className,
}: {
  verdict: NFOVerdictType;
  className?: string;
}) {
  const config = nfoVerdictConfig[verdict];
  return (
    <Badge variant={config.variant} size="md" className={className}>
      {config.label}
    </Badge>
  );
}

/* ── Plan Badge (Direct/Regular) ── */
export function PlanBadge({
  plan,
  className,
}: {
  plan: "Direct" | "Regular";
  className?: string;
}) {
  return (
    <Badge
      variant={plan === "Direct" ? "sage" : "neutral"}
      size="sm"
      className={className}
    >
      {plan}
    </Badge>
  );
}

/* ── Category Badge ── */
export function CategoryBadge({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  return (
    <Badge variant="outline" size="sm" className={className}>
      {category}
    </Badge>
  );
}

export default Badge;
