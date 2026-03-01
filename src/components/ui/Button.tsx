import React from "react";
import { cn } from "@/lib/utils";

/*
 * BUTTON
 * ──────
 * Boredfolio buttons: confident, not loud.
 * Sage primary. Mustard for accent actions. Ghost for secondary.
 * No rounded-full. No gradients. Max border-radius: 8px.
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-sage-500 text-white hover:bg-sage-700 active:bg-sage-800 border border-sage-500 hover:border-sage-700",
  secondary:
    "bg-cream-50 text-ink-900 hover:bg-cream-200 active:bg-cream-300 border border-cream-300",
  ghost:
    "bg-transparent text-ink-700 hover:bg-cream-100 active:bg-cream-200 border border-transparent",
  outline:
    "bg-transparent text-sage-500 hover:bg-sage-50 active:bg-sage-100 border border-sage-500",
  danger:
    "bg-ugly-500 text-white hover:bg-ugly-700 active:bg-ugly-700 border border-ugly-500 hover:border-ugly-700",
  accent:
    "bg-mustard-500 text-white hover:bg-mustard-700 active:bg-mustard-800 border border-mustard-500 hover:border-mustard-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading,
  fullWidth,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        // Base
        "inline-flex items-center justify-center font-sans font-medium",
        "rounded-md transition-all duration-150 ease-out",
        "focus-ring select-none whitespace-nowrap",
        // Variant + size
        variantStyles[variant],
        sizeStyles[size],
        // States
        (disabled || loading) && "opacity-50 cursor-not-allowed pointer-events-none",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>
      ) : null}
      {children && <span>{children}</span>}
      {iconRight && (
        <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{iconRight}</span>
      )}
    </button>
  );
}

/* ── Icon-only Button ── */
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  label: string; // accessibility
  children: React.ReactNode;
}

export function IconButton({
  variant = "ghost",
  size = "md",
  label,
  className,
  children,
  ...props
}: IconButtonProps) {
  const iconSizes: Record<ButtonSize, string> = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-11 w-11",
  };

  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex items-center justify-center rounded-md",
        "transition-all duration-150 ease-out focus-ring",
        "[&>svg]:h-4 [&>svg]:w-4",
        variantStyles[variant],
        iconSizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
