import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

/*
 * COMPARE TRAY
 * ────────────
 * Floating bottom bar that appears on Screener and Category pages
 * when the user selects funds for comparison.
 * Shows selected funds (up to 5), "Compare Now" CTA, clear option.
 */

export interface CompareItem {
  id: string;
  name: string;
  shortName?: string;
}

interface CompareTrayProps {
  items: CompareItem[];
  maxItems?: number;
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
  className?: string;
}

export function CompareTray({
  items,
  maxItems = 5,
  onRemove,
  onClear,
  onCompare,
  className,
}: CompareTrayProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "md:bottom-4 md:left-1/2 md:-translate-x-1/2 md:max-w-3xl md:rounded-xl",
        "bg-ink-900 text-white shadow-modal border-t md:border border-white/10",
        "animate-slide-up",
        className
      )}
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Fund pills */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none">
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 flex items-center gap-1.5 bg-white/10 rounded-md pl-2.5 pr-1.5 py-1.5"
            >
              <span className="text-xs text-white/80 whitespace-nowrap max-w-[120px] truncate">
                {item.shortName || item.name}
              </span>
              <button
                onClick={() => onRemove(item.id)}
                className="h-4 w-4 rounded flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`Remove ${item.name}`}
              >
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 3L3 9M3 3l6 6" />
                </svg>
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {items.length < 2 && (
            <span className="text-xs text-white/30 shrink-0">
              Add {2 - items.length} more to compare
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xs text-white/40 hidden sm:block">
            {items.length}/{maxItems}
          </span>
          <button
            onClick={onClear}
            className="text-xs text-white/50 hover:text-white transition-colors px-2"
          >
            Clear
          </button>
          <Button
            variant="accent"
            size="sm"
            disabled={items.length < 2}
            onClick={onCompare}
          >
            Compare{items.length >= 2 ? ` (${items.length})` : ""}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CompareTray;
