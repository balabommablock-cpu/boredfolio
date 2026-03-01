import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";

/*
 * GLOBAL SEARCH AUTOCOMPLETE
 * ──────────────────────────
 * Dropdown search with grouped results, keyboard navigation,
 * and recent searches. Used in GlobalHeader + SearchPage.
 *
 * In production: hooks into useSchemeSearch() from hooks.ts
 * For now: static mock results with fuzzy matching.
 */

export interface SearchResult {
  type: "scheme" | "amc" | "category" | "tool" | "blog";
  id: string;
  title: string;
  subtitle: string;
  url: string;
}

const STATIC_RESULTS: SearchResult[] = [
  // Schemes
  { type: "scheme", id: "ppfas-flexi", title: "Parag Parikh Flexi Cap Fund", subtitle: "PPFAS MF · Flexi Cap", url: "/fund/ppfas-flexi-cap" },
  { type: "scheme", id: "hdfc-flexi", title: "HDFC Flexi Cap Fund", subtitle: "HDFC AMC · Flexi Cap", url: "/fund/hdfc-flexi-cap" },
  { type: "scheme", id: "mirae-large", title: "Mirae Asset Large Cap Fund", subtitle: "Mirae Asset MF · Large Cap", url: "/fund/mirae-large-cap" },
  { type: "scheme", id: "quant-small", title: "Quant Small Cap Fund", subtitle: "Quant MF · Small Cap", url: "/fund/quant-small-cap" },
  { type: "scheme", id: "hdfc-mid", title: "HDFC Mid-Cap Opportunities Fund", subtitle: "HDFC AMC · Mid Cap", url: "/fund/hdfc-mid-cap" },
  { type: "scheme", id: "axis-small", title: "Axis Small Cap Fund", subtitle: "Axis AMC · Small Cap", url: "/fund/axis-small-cap" },
  { type: "scheme", id: "sbi-contra", title: "SBI Contra Fund", subtitle: "SBI MF · Contra", url: "/fund/sbi-contra" },
  { type: "scheme", id: "hdfc-baf", title: "HDFC Balanced Advantage Fund", subtitle: "HDFC AMC · BAF", url: "/fund/hdfc-baf" },
  { type: "scheme", id: "mo-nifty50", title: "Motilal Oswal Nifty 50 Index Fund", subtitle: "Motilal Oswal AMC · Index", url: "/fund/mo-nifty-50" },
  { type: "scheme", id: "nippon-small", title: "Nippon India Small Cap Fund", subtitle: "Nippon India MF · Small Cap", url: "/fund/nippon-small-cap" },
  // AMCs
  { type: "amc", id: "hdfc-amc", title: "HDFC AMC", subtitle: "156 schemes · ₹6.12L Cr AUM", url: "/amc/hdfc-amc" },
  { type: "amc", id: "sbi-mf", title: "SBI Mutual Fund", subtitle: "142 schemes · ₹8.5L Cr AUM", url: "/amc/sbi-mf" },
  { type: "amc", id: "icici-amc", title: "ICICI Prudential AMC", subtitle: "138 schemes · ₹5.8L Cr AUM", url: "/amc/icici-pru" },
  { type: "amc", id: "ppfas-mf", title: "PPFAS Mutual Fund", subtitle: "3 schemes · ₹58K Cr AUM", url: "/amc/ppfas-mf" },
  { type: "amc", id: "motilal-amc", title: "Motilal Oswal AMC", subtitle: "42 schemes · ₹82K Cr AUM", url: "/amc/motilal-oswal" },
  // Categories
  { type: "category", id: "flexi-cap", title: "Flexi Cap", subtitle: "38 funds", url: "/category/flexi-cap" },
  { type: "category", id: "small-cap", title: "Small Cap", subtitle: "28 funds", url: "/category/small-cap" },
  { type: "category", id: "mid-cap", title: "Mid Cap", subtitle: "29 funds", url: "/category/mid-cap" },
  { type: "category", id: "large-cap", title: "Large Cap", subtitle: "31 funds", url: "/category/large-cap" },
  { type: "category", id: "elss", title: "ELSS (Tax Saver)", subtitle: "38 funds", url: "/category/elss" },
  { type: "category", id: "index-funds", title: "Index Funds", subtitle: "120+ funds", url: "/category/index" },
  // Tools
  { type: "tool", id: "sip-calc", title: "SIP Calculator", subtitle: "Plan your SIP investment", url: "/tools/sip" },
  { type: "tool", id: "overlap", title: "Portfolio Overlap Tool", subtitle: "Expose redundancy in your portfolio", url: "/tools/overlap" },
  { type: "tool", id: "tax", title: "Tax Center", subtitle: "LTCG/STCG rules and calculator", url: "/tools/tax" },
  // Blog
  { type: "blog", id: "blog-quant", title: "Fund Roast: Quant Small Cap", subtitle: "Blog · 8 min read", url: "/blog/fund-roast-quant-small-cap" },
  { type: "blog", id: "blog-elss", title: "ELSS in 2025: Worth It?", subtitle: "Blog · 10 min read", url: "/blog/elss-old-vs-new-regime" },
];

const TYPE_ICONS: Record<string, string> = {
  scheme: "📊", amc: "🏢", category: "📁", tool: "🛠", blog: "📝",
};
const TYPE_LABELS: Record<string, string> = {
  scheme: "Funds", amc: "Fund Houses", category: "Categories", tool: "Tools", blog: "Blog",
};
const TYPE_ORDER = ["scheme", "amc", "category", "tool", "blog"];

interface GlobalSearchProps {
  onNavigate?: (url: string) => void;
  variant?: "default" | "hero";
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
}

export function GlobalSearch({
  onNavigate,
  variant = "default",
  autoFocus = false,
  placeholder = "Search funds, AMCs, categories...",
  className,
}: GlobalSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // In production: read from localStorage
    return ["PPFAS Flexi Cap", "Small Cap funds", "ELSS"];
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fuzzy search
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    return STATIC_RESULTS.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [query]);

  // Group results by type
  const grouped = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((r) => {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    });
    return groups;
  }, [results]);

  // Flat list for keyboard nav
  const flatResults = useMemo(() => {
    const flat: SearchResult[] = [];
    TYPE_ORDER.forEach((type) => {
      if (grouped[type]) flat.push(...grouped[type]);
    });
    return flat;
  }, [grouped]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback((result: SearchResult) => {
    setRecentSearches((prev) => [result.title, ...prev.filter((s) => s !== result.title)].slice(0, 5));
    setQuery("");
    setIsOpen(false);
    onNavigate?.(result.url);
  }, [onNavigate]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(flatResults[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }, [activeIndex, flatResults, handleSelect]);

  const showDropdown = isOpen && (query.length >= 2 || (query.length === 0 && recentSearches.length > 0));

  return (
    <div className={cn("relative", className)}>
      <div className={cn(
        "flex items-center gap-2 rounded-lg border transition-colors",
        variant === "hero"
          ? "bg-white border-cream-300 shadow-warm-sm px-4 py-3"
          : "bg-cream-50 border-cream-300 px-3 py-2",
        isOpen && "border-sage-400 ring-1 ring-sage-200"
      )}>
        <SearchIcon className={variant === "hero" ? "w-5 h-5 text-ink-400" : "w-4 h-4 text-ink-400"} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-ink-900 placeholder:text-ink-400",
            variant === "hero" ? "text-base" : "text-sm"
          )}
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="text-ink-300 hover:text-ink-500 text-sm">✕</button>
        )}
        <kbd className="hidden sm:inline-flex text-2xs text-ink-300 bg-cream-200 rounded px-1.5 py-0.5">⌘K</kbd>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-cream-300 rounded-lg shadow-warm-lg z-50 max-h-[400px] overflow-y-auto">

          {/* No results */}
          {query.length >= 2 && results.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-sm text-ink-500">No results for "{query}"</p>
              <p className="text-2xs text-ink-400 mt-1">Try a different search term</p>
            </div>
          )}

          {/* Results grouped */}
          {results.length > 0 && TYPE_ORDER.map((type) => {
            const items = grouped[type];
            if (!items) return null;
            return (
              <div key={type}>
                <div className="px-3 py-1.5 bg-cream-50 border-b border-cream-200">
                  <span className="text-2xs font-semibold uppercase tracking-[0.15em] text-ink-400">
                    {TYPE_ICONS[type]} {TYPE_LABELS[type]}
                  </span>
                </div>
                {items.map((result) => {
                  const flatIdx = flatResults.indexOf(result);
                  return (
                    <button key={result.id}
                      onClick={() => handleSelect(result)}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      className={cn(
                        "w-full text-left px-3 py-2.5 flex items-center gap-3 transition-colors",
                        flatIdx === activeIndex ? "bg-sage-50" : "hover:bg-cream-50"
                      )}>
                      <span className="text-xs">{TYPE_ICONS[result.type]}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ink-900 truncate">{result.title}</p>
                        <p className="text-2xs text-ink-400 truncate">{result.subtitle}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Recent searches (when empty query) */}
          {query.length < 2 && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-1.5 bg-cream-50 border-b border-cream-200">
                <span className="text-2xs font-semibold uppercase tracking-[0.15em] text-ink-400">Recent Searches</span>
              </div>
              {recentSearches.map((term) => (
                <button key={term}
                  onClick={() => { setQuery(term); setIsOpen(true); }}
                  className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-cream-50 transition-colors">
                  <span className="text-xs text-ink-300">🕐</span>
                  <span className="text-sm text-ink-700">{term}</span>
                </button>
              ))}
            </div>
          )}

          {/* Search page link */}
          {query.length >= 2 && (
            <button
              onClick={() => { onNavigate?.(`/search?q=${encodeURIComponent(query)}`); setIsOpen(false); }}
              className="w-full text-left px-3 py-2.5 border-t border-cream-200 text-sm text-sage-600 font-medium hover:bg-sage-50 transition-colors">
              See all results for "{query}" →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

export default GlobalSearch;
