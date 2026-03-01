import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

/*
 * FORM INPUTS
 * ───────────
 * Clean, warm, cream-based. Sage focus ring.
 * Search bar is the hero input — prominent, with icon.
 */

/* ── Text Input ── */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 [&>svg]:h-4 [&>svg]:w-4">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-9 rounded-md border bg-cream-50 text-sm text-ink-900",
              "placeholder:text-ink-300",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-1 focus:ring-offset-cream-100",
              "focus:border-sage-500",
              error
                ? "border-ugly-500 focus:ring-ugly-500"
                : "border-cream-300 hover:border-cream-400",
              icon ? "pl-9 pr-3" : "px-3",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-xs text-ugly-500">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-ink-400">{hint}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

/* ── Select ── */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-ink-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            "w-full h-9 rounded-md border bg-cream-50 text-sm text-ink-900",
            "px-3 pr-8 appearance-none",
            "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%238E8E8E%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')]",
            "bg-no-repeat bg-[right_0.75rem_center]",
            "transition-colors duration-150",
            "focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-1 focus:ring-offset-cream-100",
            error ? "border-ugly-500" : "border-cream-300 hover:border-cream-400",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-ugly-500">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

/* ── Search Bar (Hero variant) ── */
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search funds, AMCs, categories, stocks...",
  size = "md",
  className,
  autoFocus,
}: SearchBarProps) {
  const sizeStyles = {
    sm: "h-9 text-sm pl-9 pr-3",
    md: "h-11 text-base pl-11 pr-4",
    lg: "h-14 text-lg pl-14 pr-5",
  };

  const iconSizes = {
    sm: "left-2.5 [&>svg]:h-4 [&>svg]:w-4",
    md: "left-3.5 [&>svg]:h-5 [&>svg]:w-5",
    lg: "left-4.5 [&>svg]:h-5 [&>svg]:w-5",
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none",
          iconSizes[size]
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={cn(
          "w-full rounded-lg border border-cream-300 bg-cream-50",
          "text-ink-900 placeholder:text-ink-300",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-sage-500 focus:border-sage-500",
          "focus:shadow-card-hover",
          sizeStyles[size]
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

/* ── Checkbox ── */
export function Checkbox({
  label,
  checked,
  onChange,
  className,
}: {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label className={cn("inline-flex items-center gap-2 cursor-pointer select-none", className)}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div
          className={cn(
            "h-4 w-4 rounded border transition-colors duration-150",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-sage-500 peer-focus-visible:ring-offset-1",
            checked
              ? "bg-sage-500 border-sage-500"
              : "bg-cream-50 border-cream-300 hover:border-cream-400"
          )}
        >
          {checked && (
            <svg className="h-4 w-4 text-white" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 8l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
}

/* ── Toggle Switch ── */
export function Toggle({
  label,
  checked,
  onChange,
  className,
}: {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label className={cn("inline-flex items-center gap-2.5 cursor-pointer select-none", className)}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 rounded-full transition-colors duration-200 focus-ring",
          checked ? "bg-sage-500" : "bg-cream-400"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            "absolute top-0.5",
            checked ? "translate-x-[18px]" : "translate-x-0.5"
          )}
        />
      </button>
      {label && <span className="text-sm text-ink-700">{label}</span>}
    </label>
  );
}

export default Input;
