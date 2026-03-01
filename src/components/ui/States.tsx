import React from "react";
import { cn } from "@/lib/utils";

/*
 * STATE COMPONENTS
 * ────────────────
 * Empty, Loading, Error states with Boredfolio personality.
 * Even our error messages have a voice.
 */

/* ── Empty State ── */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-ink-300 [&>svg]:h-12 [&>svg]:w-12">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg text-ink-700">{title}</h3>
      {description && (
        <p className="mt-1.5 text-sm text-ink-400 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ── Loading State ── */
interface LoadingStateProps {
  message?: string;
  variant?: "spinner" | "skeleton" | "dots";
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  variant = "spinner",
  className,
}: LoadingStateProps) {
  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center py-12 gap-1.5", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-sage-500 animate-pulse-soft"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    );
  }

  if (variant === "skeleton") {
    return (
      <div className={cn("space-y-3 py-4", className)}>
        <div className="skeleton h-6 w-3/4 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-5/6 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="skeleton h-20 rounded" />
          <div className="skeleton h-20 rounded" />
          <div className="skeleton h-20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <svg
        className="animate-spin h-8 w-8 text-sage-500 mb-3"
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          className="opacity-20"
          cx="12" cy="12" r="10"
          stroke="currentColor" strokeWidth="3"
        />
        <path
          className="opacity-80"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="text-sm text-ink-400">{message}</span>
    </div>
  );
}

/* ── Error State ── */
interface ErrorStateProps {
  title?: string;
  message?: string;
  retry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Something broke",
  message = "Even mutual funds crash sometimes. Unlike this page, they usually recover.",
  retry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-4",
        className
      )}
    >
      <div className="mb-4 text-ugly-500">
        <svg className="h-12 w-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 15s1.5-2 4-2 4 2 4 2" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2" strokeLinecap="round" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <h3 className="font-serif text-lg text-ink-900">{title}</h3>
      <p className="mt-1.5 text-sm text-ink-400 max-w-sm italic">{message}</p>
      {retry && (
        <button
          onClick={retry}
          className="mt-4 px-4 py-2 text-sm font-medium text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-md transition-colors focus-ring"
        >
          Try again
        </button>
      )}
    </div>
  );
}

/* ── Skeleton variants for specific contexts ── */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("bg-cream-50 rounded-lg border border-cream-300 p-4 space-y-3", className)}>
      <div className="flex items-start gap-3">
        <div className="skeleton h-8 w-8 rounded" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-cream-200">
        <div className="skeleton h-10 rounded" />
        <div className="skeleton h-10 rounded" />
        <div className="skeleton h-10 rounded" />
      </div>
    </div>
  );
}

export function SkeletonTable({
  rows = 5,
  columns = 4,
  className,
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div className={cn("border border-cream-300 rounded-lg overflow-hidden", className)}>
      <div className="bg-cream-100 px-4 py-3 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="skeleton h-3 rounded flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="px-4 py-3 flex gap-4 border-t border-cream-200">
          {Array.from({ length: columns }).map((_, j) => (
            <div key={j} className="skeleton h-4 rounded flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export default EmptyState;
