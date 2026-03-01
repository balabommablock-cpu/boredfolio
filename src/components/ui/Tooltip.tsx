import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/*
 * TOOLTIP
 * ───────
 * "In plain English" — Boredfolio translates jargon.
 * Used on: risk metrics, financial terms, chart annotations.
 * Warm cream surface with charcoal text.
 */

interface TooltipProps {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  maxWidth?: number;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({
  content,
  side = "top",
  align = "center",
  maxWidth = 280,
  children,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const show = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };
  const hide = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 100);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div
      className={cn("relative inline-flex", className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {open && (
        <div
          role="tooltip"
          style={{ maxWidth }}
          className={cn(
            "absolute z-50 px-3 py-2",
            "bg-ink-900 text-white text-xs leading-relaxed",
            "rounded-md shadow-dropdown",
            "animate-fade-in pointer-events-none",
            positionStyles[side]
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/* ── Info Icon + Tooltip (common pattern for "?" icons) ── */
export function InfoTooltip({
  content,
  side = "top",
  className,
}: {
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  return (
    <Tooltip content={content} side={side}>
      <span
        className={cn(
          "inline-flex items-center justify-center",
          "h-4 w-4 rounded-full border border-cream-400 text-ink-400",
          "text-2xs font-semibold cursor-help",
          "hover:border-sage-500 hover:text-sage-500 transition-colors",
          className
        )}
        tabIndex={0}
        aria-label="More info"
      >
        ?
      </span>
    </Tooltip>
  );
}

/* ── Jargon Tooltip (for inline term explanations) ── */
export function JargonTooltip({
  term,
  explanation,
  children,
}: {
  term: string;
  explanation: string;
  children?: React.ReactNode;
}) {
  return (
    <Tooltip
      content={
        <div>
          <div className="font-semibold mb-0.5">{term}</div>
          <div className="text-white/80">{explanation}</div>
        </div>
      }
      side="top"
      maxWidth={320}
    >
      <span className="border-b border-dotted border-ink-400 cursor-help hover:border-sage-500 transition-colors">
        {children || term}
      </span>
    </Tooltip>
  );
}

export default Tooltip;
