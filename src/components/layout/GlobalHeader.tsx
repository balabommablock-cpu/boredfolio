"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

/*
 * GLOBAL HEADER
 * ─────────────
 * Sticky. Cream surface with subtle bottom border.
 * Logo (16px) + Nav (Explore, Compare, Blog only).
 * No search (doesn't work), no watchlist/notifications (no auth).
 *
 * Mobile: hamburger → full-screen slide-out drawer from right.
 * Body scroll locked when drawer is open.
 *
 * Brand rule: "boredfolio." — period in accent color.
 */

const NAV_ITEMS = [
  { label: "Explore", href: "/explore" },
  { label: "Compare", href: "/compare" },
  { label: "Blog", href: "/blog" },
];

interface GlobalHeaderProps {
  currentPath?: string;
  className?: string;
}

export function GlobalHeader({
  currentPath = "",
  className,
}: GlobalHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 bg-cream-100/95 backdrop-blur-sm",
          "border-b border-cream-300",
          "h-14",
          className
        )}
      >
        <div className="section h-full flex items-center justify-between">
          {/* Logo — 16px, never changes */}
          <a href="/" className="shrink-0 flex items-baseline">
            <span className="font-serif text-[16px] text-ink-900 tracking-tight font-bold">
              boredfolio
            </span>
            <span className="font-serif text-[16px] text-mustard-500 font-bold">.</span>
          </a>

          {/* Desktop Nav — only live links */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  currentPath.startsWith(item.href)
                    ? "text-sage-700 bg-sage-50"
                    : "text-ink-500 hover:text-ink-900 hover:bg-cream-200"
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Mobile hamburger */}
          <button
            aria-label="Menu"
            className="md:hidden h-12 w-12 flex items-center justify-center text-ink-600 hover:text-ink-900 transition-colors"
            onClick={() => setDrawerOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          </button>
        </div>
      </header>

      {/* ═══ Mobile Drawer (slide from right, full screen) ═══ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 animate-fade-in"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-[320px] bg-cream-50 shadow-modal flex flex-col animate-slide-in-right">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 h-14 border-b border-cream-300">
              <a href="/" className="flex items-baseline">
                <span className="font-serif text-[16px] text-ink-900 tracking-tight font-bold">
                  boredfolio
                </span>
                <span className="font-serif text-[16px] text-mustard-500 font-bold">.</span>
              </a>
              <button
                aria-label="Close menu"
                className="h-12 w-12 flex items-center justify-center text-ink-500 hover:text-ink-900 transition-colors"
                onClick={() => setDrawerOpen(false)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Drawer nav links — 48px min height each */}
            <nav className="flex-1 px-4 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 min-h-[48px] rounded-lg text-base font-medium transition-colors",
                    currentPath.startsWith(item.href)
                      ? "text-sage-700 bg-sage-50"
                      : "text-ink-700 hover:bg-cream-200"
                  )}
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Drawer footer */}
            <div className="px-5 py-4 border-t border-cream-300">
              <p className="text-xs text-ink-400 italic">
                Not SEBI registered. Not your advisor. Just better at math than your advisor.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GlobalHeader;
