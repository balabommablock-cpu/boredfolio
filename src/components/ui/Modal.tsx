import React, { useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

/*
 * MODAL & DRAWER
 * ──────────────
 * Cream surface, warm overlay. Clean close button.
 * Drawer slides from right (mobile-friendly for filters).
 */

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  children: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: "max-w-[calc(100vw-2rem)] sm:max-w-sm",
  md: "max-w-[calc(100vw-2rem)] sm:max-w-lg",
  lg: "max-w-[calc(100vw-2rem)] sm:max-w-2xl",
  xl: "max-w-[calc(100vw-2rem)] sm:max-w-4xl",
  full: "max-w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)]",
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  className,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, handleEscape]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Content */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cn(
          "relative z-10 w-full bg-cream-50 rounded-lg shadow-modal",
          "border border-cream-300",
          "animate-slide-up",
          "max-h-[90vh] sm:max-h-[85vh] flex flex-col",
          sizeStyles[size],
          className
        )}
      >
        {/* Header */}
        {(title || true) && (
          <div className="flex items-start justify-between p-4 sm:p-5 pb-0">
            <div>
              {title && (
                <h2
                  id="modal-title"
                  className="font-serif text-xl text-ink-900"
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-ink-500">{description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 ml-4 p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-cream-200 transition-colors focus-ring"
              aria-label="Close"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── Drawer (slides from right) ── */
interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  side?: "right" | "left";
  width?: string;
  children: React.ReactNode;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  side = "right",
  width = "24rem",
  children,
  className,
}: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        style={{ width }}
        className={cn(
          "absolute top-0 bottom-0 bg-cream-50 w-full sm:w-auto max-w-full",
          "border-cream-300 shadow-modal",
          "flex flex-col overflow-hidden",
          side === "right" ? "right-0 border-l" : "left-0 border-r",
          "animate-slide-up", // TODO: slide-in from side
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cream-300">
          {title && (
            <h2 className="font-serif text-lg text-ink-900">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-ink-400 hover:text-ink-700 hover:bg-cream-200 transition-colors focus-ring"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
