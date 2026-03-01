import React from "react";
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
 * Fixed bottom tab bar for mobile. 5 core destinations.
 * Shows only on screens < 768px (md breakpoint).
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
    label: "Tools",
    href: "/tools/sip-calculator",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <line x1="8" y1="10" x2="16" y2="10" />
        <line x1="8" y1="14" x2="16" y2="14" />
        <line x1="8" y1="18" x2="12" y2="18" />
        <line x1="8" y1="6" x2="16" y2="6" />
      </svg>
    ),
  },
  {
    label: "Portfolio",
    href: "/portfolio",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
        <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
        <path d="M18 12a2 2 0 1 0 0 4h4v-4h-4z" />
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
 * Scrolling one-liners on the home page.
 * Boredfolio truths, market quips, uncomfortable facts.
 * Charcoal background — same as Market Pulse.
 */

interface TickerStripProps {
  messages: string[];
  speed?: "slow" | "normal" | "fast";
  className?: string;
}

export function TickerStrip({
  messages,
  speed = "normal",
  className,
}: TickerStripProps) {
  const speedDuration = {
    slow: "60s",
    normal: "40s",
    fast: "25s",
  };

  // Duplicate for seamless loop
  const allMessages = [...messages, ...messages];

  return (
    <div
      className={cn(
        "bg-ink-900 overflow-hidden border-b border-ink-800 h-8 flex items-center",
        className
      )}
    >
      <div
        className="flex items-center gap-12 whitespace-nowrap"
        style={{
          animation: `ticker ${speedDuration[speed]} linear infinite`,
        }}
      >
        {allMessages.map((msg, i) => (
          <span key={i} className="flex items-center gap-3 text-xs">
            <span className="text-mustard-400">●</span>
            <span className="text-white/60">{msg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default PageLayout;
