import React from "react";
import { cn } from "@/lib/utils";

/*
 * GLOBAL FOOTER
 * ─────────────
 * Editorial footer. Charcoal background (the dark bookend).
 * Mandatory SEBI disclaimer. Newsletter signup.
 * "boredfolio. — Boring you into wealth."
 */

const FOOTER_LINKS = {
  "Product": [
    { label: "Explore Funds", href: "/explore" },
    { label: "Compare", href: "/compare" },
    { label: "Screener", href: "/explore" },
    { label: "Market Dashboard", href: "/market" },
    { label: "NFO Tracker", href: "/nfo" },
  ],
  "Tools": [
    { label: "SIP Calculator", href: "/tools/sip-calculator" },
    { label: "SWP Calculator", href: "/tools/swp-calculator" },
    { label: "Goal Planner", href: "/tools/goal-planner" },
    { label: "Tax Calculator", href: "/tools/tax-calculator" },
    { label: "Portfolio Overlap", href: "/tools/overlap" },
    { label: "Risk Profiler", href: "/tools/risk-profiler" },
  ],
  "Learn": [
    { label: "Blog", href: "/blog" },
    { label: "Glossary", href: "/glossary" },
    { label: "Learning Center", href: "/learn" },
    { label: "Myth Busters", href: "/learn/myths" },
  ],
  "Company": [
    { label: "About & Methodology", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Disclaimer", href: "/legal" },
    { label: "Privacy Policy", href: "/legal" },
    { label: "Terms of Use", href: "/legal" },
    { label: "Sitemap", href: "/sitemap" },
  ],
};

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
      <div className="section py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="inline-flex items-baseline mb-4">
              <span className="font-serif text-2xl text-white tracking-tight">
                boredfolio
              </span>
              <span className="font-serif text-2xl text-mustard-400">.</span>
            </a>
            <p className="text-sm text-white/50 leading-relaxed mb-4 max-w-xs">
              India&rsquo;s most honest mutual fund platform. We strip funds naked so you can invest with your eyes open.
            </p>
            <p className="text-xs italic text-white/30">
              Boring you into wealth.
            </p>

            {/* Social */}
            <div className="flex items-center gap-3 mt-5">
              <SocialLink href="#" label="Twitter" icon="X" />
              <SocialLink href="#" label="LinkedIn" icon="in" />
              <SocialLink href="#" label="YouTube" icon="▶" />
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-sans text-2xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-4">
                {section}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
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
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-lg text-white">
                Get the unfiltered truth. Weekly.
              </h3>
              <p className="text-sm text-white/40 mt-0.5">
                No spam. No affiliate links. Just uncomfortable honesty about your money.
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-64 h-10 px-4 rounded-md bg-white/10 border border-white/20 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-sage-500 focus:ring-1 focus:ring-sage-500 transition-colors"
              />
              <button className="h-10 px-5 rounded-md bg-sage-500 text-white text-sm font-medium hover:bg-sage-600 transition-colors shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/10">
        <div className="section py-4 flex items-center justify-between text-2xs text-white/30">
          <span>&copy; {new Date().getFullYear()} Boredfolio. All rights reserved.</span>
          <span className="hidden sm:block">
            Data sources: AMFI, NSE, BSE, SEBI, AMC Factsheets
          </span>
        </div>
      </div>
    </footer>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="h-8 w-8 rounded-md bg-white/10 flex items-center justify-center text-xs font-bold text-white/60 hover:bg-white/20 hover:text-white transition-colors"
    >
      {icon}
    </a>
  );
}

export default GlobalFooter;
