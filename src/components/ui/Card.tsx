import React from "react";
import { cn } from "@/lib/utils";

/*
 * CARD
 * ────
 * Cream surface (cream-50), warm border (cream-300).
 * No deep shadows. Subtle elevation only on hover.
 * Max border-radius: 8px (brand rule).
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section";
}

const paddingStyles = {
  none: "",
  sm: "p-3 sm:p-4",
  md: "p-4 sm:p-5",
  lg: "p-5 sm:p-6 lg:p-8",
};

export function Card({
  hover = false,
  padding = "md",
  as: Component = "div",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={cn(
        "bg-cream-50 rounded-lg border border-cream-300",
        hover
          ? "shadow-card transition-shadow duration-200 hover:shadow-card-hover cursor-pointer"
          : "shadow-card",
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/* ── Card Header: title + optional action ── */
export function CardHeader({
  title,
  subtitle,
  label,
  action,
  className,
}: {
  title: string;
  subtitle?: string;
  label?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {label && (
          <span className="label-mustard mb-1.5 block">{label}</span>
        )}
        <h3 className="font-serif text-xl text-ink-900 leading-tight">
          {title}
        </h3>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-500 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Card Section: divider + content block within card ── */
export function CardSection({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("border-t border-cream-300 pt-4 mt-4", className)}>
      {title && (
        <h4 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">
          {title}
        </h4>
      )}
      {children}
    </div>
  );
}

/* ── Stat Card: single metric display ── */
export function StatCard({
  label,
  value,
  subtext,
  trend,
  className,
}: {
  label: string;
  value: string;
  subtext?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  return (
    <Card padding="md" className={className}>
      <span className="label-upper text-ink-400 block mb-1">{label}</span>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            "font-mono text-2xl font-medium tabular-nums tracking-tight",
            trend === "up" && "text-good-500",
            trend === "down" && "text-ugly-500",
            (!trend || trend === "neutral") && "text-ink-900"
          )}
        >
          {value}
        </span>
      </div>
      {subtext && (
        <span className="text-xs text-ink-400 mt-1 block">{subtext}</span>
      )}
    </Card>
  );
}

/* ── Metric Row: label + value inline (for Key Facts grids) ── */
export function MetricRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-2.5 border-b border-cream-200 last:border-0",
        className
      )}
    >
      <span className="text-sm text-ink-500">{label}</span>
      <span className="text-sm font-medium text-ink-900 text-right">
        {value}
      </span>
    </div>
  );
}

export default Card;
