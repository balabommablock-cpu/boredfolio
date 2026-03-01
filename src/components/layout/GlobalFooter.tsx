import React from "react";
import { cn } from "@/lib/utils";

/*
 * GLOBAL FOOTER
 * ─────────────
 * Charcoal. Minimal. Only live links.
 * No duplicate newsletter (it's in the mustard strip above).
 * Social links removed until real profiles exist.
 *
 * Brand voice:
 * - "Not SEBI registered. Not your advisor. Just better at math than your advisor."
 * - "Made with ☕ and resentment toward the mutual fund industry."
 * - "© 2026 Boredfolio. All rights reserved. Unlike your returns."
 */

const FOOTER_LINKS = [
  { label: "Explore Funds", href: "/explore" },
  { label: "Compare", href: "/compare" },
  { label: "Blog", href: "/blog" },
];

interface GlobalFooterProps {
  className?: string;
}

export function GlobalFooter({ className }: GlobalFooterProps) {
  return (
    <footer className={cn("bg-ink-900 text-white/70", className)}>
      {/* SEBI Disclaimer Banner */}
      <div className="border-b border-white/10">
        <div className="section py-4">
          <p className="text-2xs leading-relaxed text-white/40">
            <span className="text-mustard-300 font-semibold uppercase tracking-wider text-2xs">
              Disclaimer:
            </span>{" "}
            Mutual fund investments are subject to market risks. Read all scheme-related documents carefully before investing.
            Boredfolio does not provide investment advice, recommendations, or portfolio management services.
            Past performance is not indicative of future results. The information provided is for educational and
            informational purposes only. Boredfolio is not a SEBI-registered investment advisor.
          </p>
        </div>
      </div>

      {/* Main footer */}
      <div className="section py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-16">
          {/* Brand column */}
          <div className="max-w-xs">
            <a href="/" className="inline-flex items-baseline mb-4">
              <span className="font-serif text-2xl text-white tracking-tight">
                boredfolio
              </span>
              <span className="font-serif text-2xl text-mustard-400">.</span>
            </a>
            <p className="text-sm text-white/50 leading-relaxed mb-3">
              We show you the numbers your fund house buries in page 47 of the factsheet.
            </p>
            <p className="text-xs italic text-white/30">
              Made with ☕ and resentment toward the mutual fund industry.
            </p>
          </div>

          {/* Links — single column, only live pages */}
          <div>
            <h3 className="font-sans text-2xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
              Navigate
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar — with brand microcopy */}
      <div className="border-t border-white/10">
        <div className="section py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-2xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Boredfolio. All rights reserved. Unlike your returns.</span>
          <span className="hidden sm:block italic">
            Not SEBI registered. Not your advisor. Just better at math than your advisor.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default GlobalFooter;
