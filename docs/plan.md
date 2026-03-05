# Boredfolio 30-Day Build Plan

Goal: 1M visitors by Day 30. Every day of delay is ~33K visits lost.

---

## Day 1 — AI Fund Roast Generator

**What to build:**
- Gemini API integration (`/api/roast` route)
- Prompt engineering: force one real data point (expense ratio, 3yr return, benchmark delta) per roast
- Frontend roast generator: fund search input → loading state → roast card output
- "Share on WhatsApp" button with pre-filled message + URL
- Basic rate limiting on the API route

**Expected output:** Working roast tool live at `/roast`

**Traffic impact:** 0 today. Setup day. Seed tomorrow.

---

## Day 2 — Programmatic SEO: Top 200 Fund Pages

**What to build:**
- Fund page template: NAV, 1/3/5yr returns, expense ratio, benchmark comparison, AI roast, direct vs regular savings
- Data pipeline from mfapi.in → static props per fund
- Generate pages for top 200 funds by AUM (covers ~80% of Indian investor portfolios)
- Sitemap.xml + robots.txt, submit to Google Search Console
- Internal linking: homepage → explore → fund pages, roast tool → fund page

**Expected output:** 200 SEO pages live, sitemap submitted

**Traffic impact:** Near-zero today. Google indexes in 3–10 days. Traffic starts Day 10–12.

---

## Day 3 — ELSS Tax Saver Tool

**What to build:**
- `/elss` page: top 10 ELSS funds ranked by 3yr returns
- Columns: fund name, 3yr return, expense ratio (direct), direct vs regular annual savings on ₹1.5L investment, lock-in end date
- Urgency counter: "X days left to invest before March 31"
- SEO: target "best ELSS fund 2025", "last minute tax saving mutual fund", "80C investment deadline"
- Link to individual fund pages from ELSS table

**Expected output:** `/elss` live, targeting high-intent March traffic

**Traffic impact:** 200–500/day within 3–5 days if Google indexes fast. Peaks at March 31.

---

## Day 4 — WhatsApp Share Cards + Social Seeding

**What to build:**
- OG image generation for roast cards (1200x630, fund name + roast + one stat + boredfolio.com URL embedded)
- Dynamic OG meta tags on roast result pages so WhatsApp/Twitter previews show the card
- "Copy link" + "Share on WhatsApp" on every fund page and roast output
- Manual social seeding: post roast tool on Reddit r/IndiaInvestments, Twitter FinTwit, 2–3 WhatsApp groups

**Expected output:** Shareable roast cards working. First external traffic from social seeds.

**Traffic impact:** 300–1,000/day from seeding. Viral coefficient kicks in if share rate > 10%.

---

## Day 5 — Hindi Audio Roasts

**What to build:**
- Sarvam TTS API integration (`/api/audio-roast` route)
- Hindi roast prompt variant for Gemini (same data points, Hinglish tone)
- Audio player on roast result page + "Download for WhatsApp" button
- Audio clips capped at 45 seconds (optimal for WhatsApp forwards)

**Expected output:** Hindi audio roasts live on `/roast`

**Traffic impact:** Unique differentiator. WhatsApp audio forwards have high reach. Expect 500–2,000/day from this channel within a week of seeding.

---

## Day 6–7 — Fund Report Card Image Generator + Per-Fund OG Images

**What to build:**
- Canvas-rendered fund report card: letter grade (A–F based on expense ratio + benchmark delta), key stats, roast tagline
- Downloadable PNG + auto-set as OG image for each fund page
- Grade algorithm: transparent, documented on-page (no black box)
- "My fund got a D" is more shareable than "My fund has 2.1% expense ratio"

**Expected output:** Report cards on all 200 fund pages. Every fund page has a unique social preview image.

**Traffic impact:** Increases share rate on existing traffic. Estimated +20–30% lift on social shares.

---

## Day 8–10 — 500 More Programmatic Fund Pages + Internal Linking

**What to build:**
- Expand from 200 → 700 fund pages using the existing template
- AMC landing pages: one page per AMC (e.g., `/amc/sbi`, `/amc/hdfc`) linking to all their funds
- Category pages: `/large-cap`, `/mid-cap`, `/flexi-cap`, `/elss` with fund listings
- Cross-linking: every fund page links to 5 related funds + its AMC page + its category page
- Update sitemap, resubmit

**Expected output:** 700 fund pages, AMC pages, category pages. Dense internal link graph.

**Traffic impact:** SEO from Day 2 pages starting to show. Category + AMC pages target broader queries. Estimated 2,000–8,000/day organic by Day 12–14.

---

## Day 11–14 — Content Blitz: 10 Learn Articles

**What to build:**
Target these specific queries (each has >10K monthly searches in India):

1. "Direct vs Regular mutual funds — how much are you actually losing?"
2. "Expense ratio explained: the fee that eats your returns while you sleep"
3. "Why most mutual funds underperform Nifty (with data)"
4. "ELSS vs PPF vs NPS: honest comparison for tax saving"
5. "How to switch from Regular to Direct plan without exiting"
6. "SIP vs lumpsum: the honest answer (not the one your distributor gives)"
7. "What is NAV and why it doesn't matter as much as you think"
8. "Mutual fund categories explained: large, mid, small, flexi — what to actually buy"
9. "How to read a mutual fund factsheet (and what to ignore)"
10. "Index funds vs active funds in India: the 10-year data"

Format: answer in the first paragraph, data in the second, practical action in the third. Optimized for AI search citations.

**Expected output:** 10 articles live, internally linked to relevant fund pages and tools

**Traffic impact:** 1,000–5,000/day from organic once indexed. AI citation traffic compounds over weeks.

---

## Day 15–20 — Portfolio X-Ray + Fund vs Index Comparison

**What to build:**

**Portfolio X-Ray (`/portfolio-xray`):**
- Input: paste CAMS/Kfintech portfolio (or manually enter fund + amount)
- Output: total expense ratio drag per year in rupees, estimated underperformance vs equivalent index, projected 10-year cost of staying in regular plans
- The rupee number is the shareable moment: "Your portfolio is costing you ₹18,400/year in fees"

**Fund vs Index (`/compare`):**
- Pick any fund, compare against Nifty 50, Nifty Next 50, or category average
- 1/3/5/10 year rolling returns, expense ratio adjusted
- Clean chart, clear verdict

**Expected output:** Two new high-value tools live

**Traffic impact:** Portfolio X-Ray is the highest-intent tool on the site. Users who get a rupee number share it. Estimated 2,000–6,000/day from tool traffic + shares.

---

## Day 21–25 — Optimization Round

**What to do:**
- Audit share rate on roast tool: if < 10%, rewrite roast copy, test new Gemini prompts
- Check which fund pages are getting indexed (Google Search Console): if < 50% indexed, fix canonical tags, page speed issues
- A/B test homepage headline: current vs 2 new variants, pick winner after 48 hours
- Optimize WhatsApp share message copy: 3 variants, test which gets most clicks back
- Check Sarvam audio quality: if feedback is negative, adjust voice/speed settings
- Fix any broken fund pages (mfapi.in sometimes returns incomplete data)

**Expected output:** Higher conversion on existing traffic, fewer broken experiences

**Traffic impact:** 15–25% lift on existing traffic from CRO improvements.

---

## Day 26–30 — Scale What's Working

**Decision framework:**
- Check analytics: which channel is sending the most traffic?
- Check share rate: which tool has the best viral loop?
- Double down on the top 2 channels. Ignore the rest.

**Likely scenarios:**

If SEO is winning: generate remaining 700+ fund pages (all 1,400 schemes), add more category pages, write 5 more articles targeting adjacent queries.

If viral tools are winning: ship 2 more shareable tools (e.g., "How much would you have made in Nifty instead?" calculator, "Fund manager salary vs your returns" visualization).

If tax season is winning: add urgency to every page, push ELSS content harder, create "last 5 days to invest" landing page.

**Expected output:** Highest-traffic channels running at full capacity

**Traffic impact:** Should be at 50,000–100,000/day by Day 26 if prior weeks executed well. Final push to hit 1M cumulative.

---

## Daily Checklist (Every Day)

- Check share rate on roast tool (target: > 10%)
- Check Google Search Console: new pages indexed?
- Check mfapi.in: any data outages affecting fund pages?
- One new thing seeded on Reddit or Twitter
- Build log updated

---

## Hard Deadlines

| Date | Deadline | Why |
|------|----------|-----|
| Day 2 | Sitemap submitted | Every day of delay = fewer pages indexed |
| Day 3 | ELSS tool live | March 31 deadline is fixed. Miss this window, wait a year. |
| Day 4 | Social seeding done | Need early traffic to warm up viral loop |
| Day 14 | 700 fund pages live | SEO at scale requires volume |
| March 31 | Tax season ends | ELSS traffic window closes permanently |
