"use client";

import React, { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";

/*
 * PAGE LAYOUT
 * ───────────
 * Wraps every page with consistent max-width, padding, and spacing.
 */

interface PageLayoutProps {
  children: React.ReactNode;
  variant?: "default" | "narrow" | "wide" | "full";
  className?: string;
}

export function PageLayout({
  children,
  variant = "default",
  className,
}: PageLayoutProps) {
  const widthStyles = {
    default: "max-w-content",
    narrow: "max-w-narrow",
    wide: "max-w-wide",
    full: "max-w-none",
  };

  return (
    <main
      className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8",
        "py-6 sm:py-8",
        widthStyles[variant],
        className
      )}
    >
      {children}
    </main>
  );
}

/*
 * MOBILE BOTTOM NAV
 * ─────────────────
 * Fixed bottom tab bar for mobile. 4 live destinations.
 * Shows only on screens < 768px (md breakpoint).
 * Tools and Portfolio removed — those pages are not live.
 */

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface MobileBottomNavProps {
  currentPath?: string;
  className?: string;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Explore",
    href: "/explore",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
  },
  {
    label: "Compare",
    href: "/compare",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 20V10M12 20V4M6 20v-6" />
      </svg>
    ),
  },
  {
    label: "Blog",
    href: "/blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
];

export function MobileBottomNav({ currentPath = "", className }: MobileBottomNavProps) {
  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-40",
        "bg-cream-50/95 backdrop-blur-sm border-t border-cream-300",
        "md:hidden safe-area-bottom",
        className
      )}
    >
      <div className="flex items-center justify-around h-14">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const active = item.href === "/"
            ? currentPath === "/"
            : currentPath.startsWith(item.href);

          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 h-full",
                "transition-colors",
                active ? "text-sage-600" : "text-ink-400"
              )}
            >
              <span className="[&>svg]:h-5 [&>svg]:w-5">{item.icon}</span>
              <span className="text-2xs font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}

/*
 * TICKER STRIP
 * ────────────
 * Scrolling one-liners. Boredfolio truths. Uncomfortable facts.
 * Shuffled on every page load so it feels fresh.
 * Hover to pause — lets users actually read the lines.
 * 120-second loop duration so it doesn't feel rushed.
 */

interface TickerStripProps {
  messages: string[];
  className?: string;
}

/** Fisher-Yates shuffle — returns a new array, never mutates input */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function TickerStrip({ messages, className }: TickerStripProps) {
  // Shuffle once on mount — never on re-render
  const [shuffled, setShuffled] = useState<string[]>([]);

  useEffect(() => {
    setShuffled(shuffle(messages));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Use un-shuffled list on first render (SSR) to avoid hydration mismatch
  // Then swap to shuffled once mounted
  const display = shuffled.length > 0 ? shuffled : messages;

  // Duplicate for seamless loop
  const all = useMemo(() => [...display, ...display], [display]);

  return (
    <div
      className={cn(
        "bg-ink-900 overflow-hidden border-b border-ink-800 h-9 flex items-center",
        className
      )}
    >
      <div className="ticker-track items-center">
        {all.map((msg, i) => (
          <span key={i} className="ticker-item flex items-center gap-3 text-[14px]">
            <span className="text-mustard-400 text-xs">●</span>
            <span className="text-white/65">{msg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default PageLayout;
