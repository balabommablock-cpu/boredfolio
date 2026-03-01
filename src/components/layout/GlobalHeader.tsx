import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/ui/Input";
import { IconButton } from "@/components/ui/Button";

/*
 * GLOBAL HEADER
 * ─────────────
 * Sticky. Cream surface with subtle bottom border.
 * Logo (Instrument Serif) + Nav + Search + Actions.
 * 
 * Brand rule: Logo is "boredfolio." with mustard period.
 * Mobile: hamburger + bottom nav bar (separate component).
 */

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

interface GlobalHeaderProps {
  navItems?: NavItem[];
  currentPath?: string;
  onSearch?: (query: string) => void;
  onNotificationsClick?: () => void;
  onWatchlistClick?: () => void;
  notificationCount?: number;
  className?: string;
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Explore", href: "/explore" },
  { label: "Compare", href: "/compare" },
  { label: "Tools", href: "/tools/sip-calculator" },
  { label: "Blog", href: "/blog" },
  { label: "Market", href: "/market" },
];

export function GlobalHeader({
  navItems = DEFAULT_NAV,
  currentPath = "",
  onSearch,
  onNotificationsClick,
  onWatchlistClick,
  notificationCount = 0,
  className,
}: GlobalHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 bg-cream-100/95 backdrop-blur-sm",
        "border-b border-cream-300",
        "h-[var(--header-height)]",
        className
      )}
    >
      <div className="section h-full flex items-center gap-4">
        {/* Logo */}
        <a href="/" className="shrink-0 flex items-baseline">
          <span className="font-serif text-xl text-ink-900 tracking-tight">
            boredfolio
          </span>
          <span className="font-serif text-xl text-mustard-500">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          {navItems.map((item) => (
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

        {/* Search */}
        <div className="hidden sm:block w-full max-w-xs">
          <SearchBar
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              onSearch?.(v);
            }}
            placeholder="Search funds, AMCs..."
            size="sm"
          />
        </div>

        {/* Mobile search toggle */}
        <IconButton
          label="Search"
          variant="ghost"
          size="sm"
          className="sm:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </IconButton>

        {/* Watchlist */}
        <IconButton
          label="Watchlist"
          variant="ghost"
          size="sm"
          className="hidden sm:flex"
          onClick={onWatchlistClick}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
        </IconButton>

        {/* Notifications */}
        <div className="relative">
          <IconButton
            label="Notifications"
            variant="ghost"
            size="sm"
            onClick={onNotificationsClick}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </IconButton>
          {notificationCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full bg-ugly-500 text-white text-2xs font-bold tabular-nums">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </div>

        {/* Mobile hamburger */}
        <IconButton
          label="Menu"
          variant="ghost"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </>
            )}
          </svg>
        </IconButton>
      </div>

      {/* Mobile Search Bar (expandable) */}
      {searchOpen && (
        <div className="sm:hidden px-4 pb-3 bg-cream-100 border-b border-cream-300 animate-slide-down">
          <SearchBar
            value={searchQuery}
            onChange={(v) => {
              setSearchQuery(v);
              onSearch?.(v);
            }}
            size="md"
            autoFocus
          />
        </div>
      )}

      {/* Mobile Nav Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-cream-50 border-b border-cream-300 shadow-dropdown animate-slide-down">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  currentPath.startsWith(item.href)
                    ? "text-sage-700 bg-sage-50"
                    : "text-ink-700 hover:bg-cream-200"
                )}
              >
                {item.label}
              </a>
            ))}
            <div className="border-t border-cream-300 pt-2 mt-2">
              <a href="/watchlist" className="block px-3 py-2.5 rounded-md text-sm text-ink-700 hover:bg-cream-200">
                Watchlist
              </a>
              <a href="/portfolio" className="block px-3 py-2.5 rounded-md text-sm text-ink-700 hover:bg-cream-200">
                Portfolio
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default GlobalHeader;
