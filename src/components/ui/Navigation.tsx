import React from "react";
import { cn } from "@/lib/utils";

/*
 * BREADCRUMB
 * ──────────
 * Clean, subtle navigation context.
 * Used on: every detail page (scheme, AMC, category, manager, etc.)
 */

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1.5 overflow-x-auto scrollbar-none", className)}>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <svg className="h-3.5 w-3.5 text-ink-300 shrink-0" viewBox="0 0 16 16" fill="none">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
          {item.href && i < items.length - 1 ? (
            <a
              href={item.href}
              className="text-xs text-ink-400 hover:text-sage-600 transition-colors truncate max-w-[8rem] sm:max-w-[12rem] shrink-0"
            >
              {item.label}
            </a>
          ) : (
            <span
              className={cn(
                "text-xs truncate max-w-[10rem] sm:max-w-[16rem] shrink-0",
                i === items.length - 1 ? "text-ink-700 font-medium" : "text-ink-400"
              )}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

/* ── Section Title with optional "View All" link ── */
export function SectionHeader({
  label,
  title,
  subtitle,
  action,
  className,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-end justify-between gap-4 mb-6", className)}>
      <div>
        {label && <span className="label-mustard block mb-1">{label}</span>}
        <h2 className="font-serif text-xl sm:text-2xl text-ink-900 leading-tight">{title}</h2>
        {subtitle && (
          <p className="mt-1 text-sm text-ink-500">{subtitle}</p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ── Page Header (top of detail pages) ── */
export function PageHeader({
  breadcrumbs,
  title,
  subtitle,
  badges,
  actions,
  className,
}: {
  breadcrumbs?: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("pb-6", className)}>
      {breadcrumbs && <Breadcrumb items={breadcrumbs} className="mb-3" />}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h1 className="font-serif text-2xl sm:text-3xl text-ink-900 leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 text-sm sm:text-md text-ink-500">{subtitle}</p>
          )}
          {badges && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {badges}
            </div>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

/* ── Divider with optional label ── */
export function Divider({
  label,
  className,
}: {
  label?: string;
  className?: string;
}) {
  if (label) {
    return (
      <div className={cn("flex items-center gap-3 my-6", className)}>
        <div className="flex-1 border-t border-cream-300" />
        <span className="text-2xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          {label}
        </span>
        <div className="flex-1 border-t border-cream-300" />
      </div>
    );
  }
  return <hr className={cn("border-t border-cream-300 my-6", className)} />;
}

export default Breadcrumb;
