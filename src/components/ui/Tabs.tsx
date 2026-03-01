import React, { useState } from "react";
import { cn } from "@/lib/utils";

/*
 * TABS
 * ────
 * Understated, editorial. Active tab has sage bottom border.
 * Used on: Scheme Detail (Overview/Holdings/Risk/Returns/...),
 * Blog filters, Search result groups, Legal pages.
 */

interface Tab {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: "underline" | "pills" | "segment";
  size?: "sm" | "md";
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = "underline",
  size = "md",
  className,
}: TabsProps) {
  if (variant === "pills") {
    return (
      <div className={cn("flex flex-wrap gap-2", className)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "font-sans font-medium rounded-md transition-all duration-150",
              "focus-ring whitespace-nowrap",
              size === "sm" ? "text-xs px-2.5 py-1.5" : "text-sm px-3.5 py-2",
              activeTab === tab.id
                ? "bg-sage-500 text-white"
                : "bg-cream-100 text-ink-500 hover:bg-cream-200 hover:text-ink-700"
            )}
          >
            {tab.icon && <span className="mr-1.5 inline-block [&>svg]:h-3.5 [&>svg]:w-3.5">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "ml-1.5 text-2xs font-semibold",
                  activeTab === tab.id ? "text-white/70" : "text-ink-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === "segment") {
    return (
      <div
        className={cn(
          "inline-flex rounded-lg bg-cream-200 p-0.5 border border-cream-300",
          className
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "font-sans font-medium rounded-md transition-all duration-150",
              "focus-ring whitespace-nowrap",
              size === "sm" ? "text-xs px-3 py-1.5" : "text-sm px-4 py-2",
              activeTab === tab.id
                ? "bg-cream-50 text-ink-900 shadow-card"
                : "text-ink-500 hover:text-ink-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // Default: underline
  return (
    <div
      className={cn(
        "flex gap-0 border-b border-cream-300 overflow-x-auto scrollbar-none",
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative font-sans font-medium whitespace-nowrap",
            "transition-colors duration-150 focus-ring",
            "border-b-2 -mb-px",
            size === "sm" ? "text-xs px-3 py-2.5" : "text-sm px-4 py-3",
            activeTab === tab.id
              ? "text-sage-700 border-sage-500"
              : "text-ink-400 border-transparent hover:text-ink-700 hover:border-cream-400"
          )}
        >
          <span className="flex items-center gap-1.5">
            {tab.icon && <span className="[&>svg]:h-4 [&>svg]:w-4">{tab.icon}</span>}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "text-2xs font-semibold px-1.5 py-0.5 rounded-full",
                  activeTab === tab.id
                    ? "bg-sage-100 text-sage-700"
                    : "bg-cream-200 text-ink-400"
                )}
              >
                {tab.count}
              </span>
            )}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── Tab Content wrapper (handles show/hide) ── */
export function TabContent({
  activeTab,
  tabId,
  children,
  className,
}: {
  activeTab: string;
  tabId: string;
  children: React.ReactNode;
  className?: string;
}) {
  if (activeTab !== tabId) return null;
  return (
    <div className={cn("animate-fade-in", className)}>
      {children}
    </div>
  );
}

/* ── Chip filters (horizontal scrollable filter row) ── */
export function ChipFilters({
  options,
  selected,
  onChange,
  className,
}: {
  options: { id: string; label: string }[];
  selected: string;
  onChange: (id: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-2 overflow-x-auto scrollbar-none pb-1", className)}>
      {options.map((opt) => (
        <button
          key={opt.id}
          onClick={() => onChange(opt.id)}
          className={cn(
            "shrink-0 px-3 py-1.5 rounded-md text-xs font-medium",
            "transition-all duration-150 focus-ring whitespace-nowrap",
            "border",
            selected === opt.id
              ? "bg-ink-900 text-white border-ink-900"
              : "bg-cream-50 text-ink-500 border-cream-300 hover:border-cream-400 hover:text-ink-700"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default Tabs;
