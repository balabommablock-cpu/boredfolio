"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { MOCK_ARTICLES } from "@/lib/mockData";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GlobalFooter } from "@/components/layout/GlobalFooter";
import { PageLayout, MobileBottomNav } from "@/components/layout/PageLayout";
import { PageHeader, Divider } from "@/components/ui/Navigation";
import { Badge, CategoryBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ChipFilters } from "@/components/ui/Tabs";

/*
 * BLOG HOME + ARTICLE PAGE
 * ────────────────────────
 * The soul of Boredfolio. Editorial content hub.
 */

const ALL_ARTICLES = [
  ...MOCK_ARTICLES,
  {
    id: "blog-4", slug: "nfo-or-no-manufacturing-fund", title: "NFO or No? Axis Manufacturing Fund — Skip or SIP?",
    excerpt: "Another thematic NFO drops. We break down whether 'manufacturing' as a theme has any edge over a diversified flexi cap fund.",
    category: "NFO or No?", publishDate: "2025-05-18", readTime: 7,
  },
  {
    id: "blog-5", slug: "elss-old-vs-new-regime", title: "ELSS in 2025: Is the Old Tax Regime Even Worth It Anymore?",
    excerpt: "With the new regime offering ₹12L tax-free income, we crunch the numbers on whether ELSS still deserves a spot in your portfolio.",
    category: "Education", publishDate: "2025-05-15", readTime: 10,
  },
  {
    id: "blog-6", slug: "monthly-recap-may-2025", title: "The Monthly Recap: May 2025 — Small Caps Bleed, Large Caps Shrug",
    excerpt: "Markets diverged hard this month. Small caps lost 8% while large caps gained 2%. Here's what it means for your SIPs.",
    category: "Market Commentary", publishDate: "2025-05-30", readTime: 9,
  },
  {
    id: "blog-7", slug: "jargon-buster-tracking-error", title: "Jargon Buster: Tracking Error — Your Index Fund's Dirty Little Secret",
    excerpt: "Your Nifty 50 index fund isn't giving you Nifty 50 returns. Tracking error is why. And some funds are way worse than others.",
    category: "Jargon Buster", publishDate: "2025-05-12", readTime: 5,
  },
  {
    id: "blog-8", slug: "fund-roast-sbi-small-cap", title: "Fund Roast: SBI Small Cap — The Fund That Closed Its Doors",
    excerpt: "When a fund stops accepting new money, it's either genius capacity management or a sign things are getting too hot. Let's investigate.",
    category: "Fund Roast", publishDate: "2025-05-08", readTime: 11,
  },
];

const BLOG_CATEGORIES = ["All", "Market Commentary", "Fund Roast", "Education", "NFO or No?", "Jargon Buster"];

const CATEGORY_COLORS: Record<string, string> = {
  "Market Commentary": "sage",
  "Fund Roast": "ugly",
  "Education": "mustard",
  "Analysis": "sage",
  "NFO or No?": "outline",
  "Jargon Buster": "ink",
};

/* ═══════════════════════════════ */
/* ═══ BLOG HOME PAGE ═══ */
/* ═══════════════════════════════ */

export function BlogHomePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? ALL_ARTICLES
    : ALL_ARTICLES.filter((a) => a.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => new Date(b.publishDate!).getTime() - new Date(a.publishDate!).getTime());
  const featured = sorted[0];
  const rest = sorted.slice(1);

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/blog" />
      <PageLayout variant="narrow">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
          title="The Boredfolio Blog"
          subtitle="Unfiltered takes on mutual funds, markets, and the industry. No affiliate links. No paid promotions. Just uncomfortable honesty."
        />

        {/* Category Filters */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {BLOG_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeCategory === cat ? "bg-sage-500 text-white" : "bg-cream-200 text-ink-600 hover:bg-cream-300")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Article */}
        {featured && (
          <article className="mb-8">
            <Card hover padding="lg" onClick={() => {}}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="sage" size="sm">Featured</Badge>
                <Badge variant={(CATEGORY_COLORS[featured.category!] || "outline") as any} size="sm">
                  {featured.category}
                </Badge>
                <span className="text-2xs text-ink-400">{featured.readTime} min read</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink-900 leading-tight">
                {featured.title}
              </h2>
              <p className="mt-3 text-base text-ink-500 leading-relaxed">
                {featured.excerpt}
              </p>
              <p className="mt-4 text-xs text-ink-400">
                {new Date(featured.publishDate!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </Card>
          </article>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rest.map((article) => (
            <Card key={article.id} hover padding="md" as="article" onClick={() => {}}>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={(CATEGORY_COLORS[article.category!] || "outline") as any} size="sm">
                  {article.category}
                </Badge>
                <span className="text-2xs text-ink-400">{article.readTime} min</span>
              </div>
              <h3 className="font-serif text-lg text-ink-900 leading-snug line-clamp-2">
                {article.title}
              </h3>
              <p className="mt-2 text-sm text-ink-500 leading-relaxed line-clamp-2">
                {article.excerpt}
              </p>
              <p className="mt-3 text-xs text-ink-400">
                {new Date(article.publishDate!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" size="md">Load More Articles</Button>
        </div>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/blog" />
    </div>
  );
}

/* ═══════════════════════════════ */
/* ═══ ARTICLE DETAIL PAGE ═══ */
/* ═══════════════════════════════ */

export function ArticlePage() {
  const article = ALL_ARTICLES.find((a) => a.slug === "fund-roast-quant-small-cap") || ALL_ARTICLES[1];

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      <GlobalHeader currentPath="/blog" />
      <PageLayout variant="narrow">
        <PageHeader
          breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: article!.category! }]}
        />

        <article className="max-w-2xl mx-auto">
          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={(CATEGORY_COLORS[article!.category!] || "outline") as any}>
                {article!.category}
              </Badge>
              <span className="text-sm text-ink-400">{article!.readTime} min read</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink-900 leading-tight">
              {article!.title}
            </h1>
            <p className="mt-3 text-lg text-ink-500 leading-relaxed">
              {article!.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3 pt-4 border-t border-cream-300">
              <div className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-xs font-semibold text-sage-700">BF</div>
              <div>
                <p className="text-sm font-medium text-ink-800">Boredfolio Editorial</p>
                <p className="text-xs text-ink-400">
                  {new Date(article!.publishDate!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          {/* Article Body (placeholder rich content) */}
          <div className="prose-boredfolio">
            <p className="text-base text-ink-700 leading-relaxed mb-4">
              Let's talk about the elephant in the small-cap room. Quant Small Cap Fund has delivered a jaw-dropping 42.1% CAGR over 5 years. That's not a typo. That's the kind of return that makes your FD-loving uncle question his life choices.
            </p>
            <p className="text-base text-ink-700 leading-relaxed mb-4">
              But here's the thing about spectacular returns — they're always easy to explain in retrospect. The real question is: can this fund sustain this performance as its AUM balloons past ₹22,800 Cr?
            </p>

            <h2 className="font-serif text-xl text-ink-900 mt-8 mb-3">The Numbers That Dazzle</h2>
            <p className="text-base text-ink-700 leading-relaxed mb-4">
              42.1% CAGR over 5 years. 35.8% over 3 years. A Sharpe ratio of 1.42, which is the risk-adjusted equivalent of having your cake and eating it too. The fund has beaten its benchmark in 78% of rolling 3-year periods. By any quantitative measure, this is an exceptional fund.
            </p>

            <h2 className="font-serif text-xl text-ink-900 mt-8 mb-3">The Numbers That Worry</h2>
            <p className="text-base text-ink-700 leading-relaxed mb-4">
              AUM has tripled in 18 months. The fund holds 180+ stocks — that's not a portfolio, that's a census. Portfolio turnover is north of 200%, meaning the entire portfolio is replaced twice a year. And the max drawdown of 38.5% means if you invested at the wrong time, you'd have watched your investment lose more than a third of its value.
            </p>

            <div className="bg-mustard-50 border border-mustard-100 rounded-lg p-4 my-6">
              <p className="text-sm text-mustard-800 font-serif font-semibold mb-1">The Boredfolio Take</p>
              <p className="text-sm text-ink-700 leading-relaxed">
                Quant Small Cap is genuinely good at what it does — quantitative, momentum-driven stock picking in the small cap space. But it's a high-octane strategy that works brilliantly until it doesn't. If you have the stomach for 35%+ drawdowns and the discipline to stay invested for 5+ years, keep a small allocation. If watching your portfolio drop 38% would make you sell, this fund will cost you money, not make it.
              </p>
            </div>

            <h2 className="font-serif text-xl text-ink-900 mt-8 mb-3">Our Verdict</h2>
            <p className="text-base text-ink-700 leading-relaxed mb-4">
              Hold if you own it. But don't chase the returns by buying now. AUM bloat is the silent killer of small-cap funds, and at ₹22,800 Cr, Quant is testing those limits. Consider capping your allocation at 10-15% of your equity portfolio, and pair it with a more stable large-cap or flexi-cap fund.
            </p>
          </div>

          {/* Related Funds */}
          <div className="mt-12 pt-8 border-t border-cream-300">
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-ink-400 mb-3">Funds Mentioned</h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline">Quant Small Cap Fund</Badge>
              <Badge variant="outline">Axis Small Cap Fund</Badge>
              <Badge variant="outline">Nippon Small Cap Fund</Badge>
            </div>
          </div>

          {/* Share */}
          <div className="mt-8 pt-6 border-t border-cream-300 flex items-center gap-3">
            <span className="text-xs text-ink-400">Share this roast:</span>
            <Button variant="ghost" size="sm">Twitter</Button>
            <Button variant="ghost" size="sm">LinkedIn</Button>
            <Button variant="ghost" size="sm">WhatsApp</Button>
            <Button variant="ghost" size="sm">Copy Link</Button>
          </div>

          {/* Related Articles */}
          <div className="mt-12 pt-8 border-t border-cream-300">
            <h3 className="font-serif text-lg text-ink-900 mb-4">More from the Blog</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ALL_ARTICLES.filter((a) => a.id !== article!.id).slice(0, 2).map((a) => (
                <Card key={a.id} hover padding="sm" onClick={() => {}}>
                  <Badge variant={(CATEGORY_COLORS[a.category!] || "outline") as any} size="sm" className="mb-2">
                    {a.category}
                  </Badge>
                  <h4 className="font-serif text-sm text-ink-900 leading-snug line-clamp-2">{a.title}</h4>
                  <p className="text-2xs text-ink-400 mt-1">{a.readTime} min read</p>
                </Card>
              ))}
            </div>
          </div>
        </article>
      </PageLayout>
      <GlobalFooter />
      <MobileBottomNav currentPath="/blog" />
    </div>
  );
}

export default BlogHomePage;
