# Boredfolio Growth Log

## Session History

### 2026-03-03 — Session 0 (Pre-system)
**Shipped:**
- Dynamic fund house list on Explore page (96 active AMCs from API)
- DynamicHousePage + DynamicSchemePage for all non-profiled funds
- OG image generation for social sharing
- Meta tags upgrade (Twitter cards, keywords, canonical)
- Explore page UX cleanup (active/historical toggle)
- Homepage copy polish (10 copy improvements)

**Impact:** Site went from 2 fund houses to every mutual fund in India being accessible.

---

### 2026-03-05 — Session 1 (First "fudge you" cycle)
**Backlog item:** SEO Foundation (P0 #1)

**Shipped:**
- Self-evolving system: CLAUDE.md, growth-backlog.md, growth-log.md, brand-voice.md
- Vercel Analytics + Speed Insights (first-ever tracking — can now see real visitor numbers)
- Dynamic sitemap.xml with 23 URLs (Next.js MetadataRoute)
- robots.txt with crawler directives
- `useTitle()` hook — every page now has a unique, descriptive browser tab title
- Per-page titles: "SBI — All Schemes, Live NAV & Returns | Boredfolio" etc.

**Impact:** Google can now crawl, index, and display the site properly. Analytics will start collecting data immediately. Every page is individually indexable with unique titles.

**Next session:** Direct vs Regular Calculator (P0 #2) — the #1 searched MF topic in India.

---

### 2026-03-05 — Session 2
**Backlog item:** Direct vs Regular Calculator (P0 #2)

**Shipped:**
- Full interactive calculator at `/direct-vs-regular`
- 4 sliders: monthly SIP (₹500–₹2L), years (1–30), expected return (8–18%), TER gap (0.3–1.5%)
- Side-by-side Direct vs Regular corpus comparison (green/red cards)
- Dark "What your distributor takes" block — shows exact ₹ amount lost
- Year-by-year damage table (compounds from ₹15K at 5y to ₹9L at 20y on defaults)
- Plain-English explainer: what Direct/Regular are, how to switch for free
- CTAs linking to /learn/direct-vs-regular article and /calculator
- Added to footer nav and sitemap (24 URLs now)

**Impact:** Targets the #1 searched mutual fund topic in India ("direct vs regular plan"). Highly shareable — the ₹8,98,918 damage number on defaults is the kind of thing that gets screenshotted. Directly drives switch-to-direct behavior.

**Next session:** Per-Fund SEO Pages (P0 #3) or 5 More Learn Articles (P0 #4).

---

### 2026-03-05 — Session 3 (Strategist execution: Day 1)
**Trigger:** User shared boredfolio_STRATEGIST.md — mission to reach 1M visitors in 30 days.

**Shipped:**
- **AI Fund Roast Generator** (`/roast` + `/api/roast`)
  - Gemini 2.0 Flash-powered roast API with retry logic, model fallback chain, 1hr caching
  - Full standalone page: search autocomplete from mfapi.in, dark roast card (headline, stats bar, roast paragraphs, verdict)
  - WhatsApp share (primary) + X share buttons
  - "Roast another fund" loop + CTA to full fund analysis
  - Graceful error handling for rate limits ("Our AI roaster is taking a chai break ☕")
  - *Note: Gemini free tier daily quota was exhausted during testing — will work on reset*

- **Top Mutual Funds SEO Page** (`/top-funds`)
  - Server-rendered page with 7 fund categories: ELSS, Large Cap, Flexi Cap, Mid Cap, Small Cap, Index, Debt
  - Each category shows up to 15 Direct-Growth schemes from mfapi.in (real data, ISR-cached hourly)
  - Category descriptions in Boredfolio voice. Links to individual fund analysis pages
  - CTA to Roast at bottom

- **ELSS Tax Saver Landing Page** (`/elss-tax-saver`)
  - Time-sensitive: March 31 deadline banner with countdown
  - Key stats cards: ₹46,800/yr tax saved, 3-year lock-in, ₹1.5L max deduction
  - ELSS vs PPF vs NPS vs FD vs SSY comparison table
  - All ELSS Direct-Growth schemes listed with links
  - "How to Pick an ELSS Fund" guide (4 steps)
  - CTA to roast your ELSS fund

- **Navigation updates** (BoredfolioApp.jsx — 4 lines added)
  - "Roast 🔥" link in desktop navbar (red, stands out)
  - "Roast 🔥" in mobile hamburger menu
  - "Roast Your Fund" in footer "More" section
  - "🔥 Roast your fund" CTA button in homepage Closing section

- **Sitemap expanded** to 25 URLs (added /elss-tax-saver, bumped /top-funds priority)

- **Strategy & Plan docs** written (`docs/strategy.md`, `docs/plan.md`)

**Impact:**
- Roast tool is THE viral feature — generates personalized, shareable content for every one of 37K+ schemes
- ELSS page targets "best ELSS funds 2025" — peak search season (March tax deadline)
- Top Funds page creates 7 category landings for programmatic SEO
- All pages are server-rendered for instant Google indexing
- Every page funnels to Roast (the share mechanic)

**Next session:** Test Gemini API once quota resets. Build programmatic per-fund SEO pages. Hindi audio roasts via Sarvam TTS.

---
