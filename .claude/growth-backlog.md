# Boredfolio Growth Backlog

> Priority = (traffic impact × user value) ÷ session effort
> Each item is ONE session. Tagged with model recommendation.

## 🔴 P0 — Do Next (highest leverage)

- [x] **SEO Foundation** — sitemap.xml, robots.txt, Vercel Analytics, per-page meta for dynamic routes [opus for architecture, haiku for file creation]
- [x] **Direct vs Regular Calculator** — #1 searched MF topic in India. Input amount + years → show exact ₹ difference. New page at /direct-vs-regular [opus]
- [x] **AI Fund Roast Generator** — THE viral feature. Gemini-powered roast of any mutual fund. Shareable on WhatsApp. `/roast` + `/api/roast` [opus]
- [x] **Top Funds SEO Pages** — 7 category pages (ELSS, Large Cap, Flexi Cap, Mid Cap, Small Cap, Index, Debt) with real fund data from mfapi.in [opus]
- [x] **ELSS Tax Saver Landing** — time-sensitive March 31 page. Comparison table, all ELSS funds, how-to guide. `/elss-tax-saver` [opus]
- [ ] **Verify Gemini API** — test roast end-to-end once free tier quota resets. Verify roast card renders, sharing works [haiku]
- [ ] **Per-Fund SEO Pages** — dynamic meta title/description for /fund/:code and /house/:slug so Google indexes each fund individually [sonnet]
- [ ] **5 More Learn Articles** — target: "what is expense ratio", "best SIP for beginners", "how to switch to direct plan", "index fund vs active fund", "what is NAV" [opus for writing, haiku for file ops]

## 🟡 P1 — High Impact

- [ ] **Hindi Audio Roasts (Sarvam TTS)** — Generate WhatsApp voice notes of fund roasts in Hindi. Viral in uncle-ji chai groups. Needs SARVAM_API_KEY [opus]
- [ ] **Portfolio X-Ray** — paste fund names → see total holdings, sector exposure, overlap, total fees. THE viral feature. [opus]
- [ ] **Fee Erosion Calculator** — "How much is your TER costing you over 25 years?" Personal, shareable. [sonnet]
- [ ] **Fund vs Nifty 50** — pick any fund, see if it beat the index. Most can't. [sonnet]
- [ ] **Shareable Fund Cards** — dynamic OG images per fund (/fund/:code/opengraph-image) for WhatsApp sharing [sonnet]
- [ ] **Email Capture** — witty hook: "One uncomfortable mutual fund truth. Every week." Buttondown or similar. [sonnet]
- [ ] **3 More Fund House Profiles** — HDFC, SBI, ICICI (highest search volume AMCs) [opus]

## 🟢 P2 — Medium Impact

- [ ] **Fund Debate Tool** — pick 2 funds, AI judge (Gemini) declares a winner live. Shareable result. [opus]
- [ ] **Mutual Fund Horoscope** — zodiac → fund recommendation. Pure viral play. [sonnet]
- [ ] **Dynamic Rankings** — pull live 1Y/3Y/5Y returns from API, auto-rank top 10 funds per category [sonnet]
- [ ] **Fund Overlap Detector** — select 2-3 funds, see shared stocks. "You think you're diversified. You're not." [opus]
- [ ] **Internal Linking System** — every page links to 3 related pages (SEO juice) [haiku]
- [ ] **Mobile PWA** — add to home screen, offline support [sonnet]

## 🔵 P3 — Future

- [ ] **Fund Manager Tracker** — who's managing your fund, how long, what changed
- [ ] **SIP Date Optimizer** — does it matter which day you SIP? (spoiler: barely)
- [ ] **Tax Harvesting Guide** — interactive LTCG/STCG calculator
- [ ] **Benchmark Comparison Tool** — any fund vs its declared benchmark
- [ ] **Newsletter System** — weekly email with one fund roast + one insight
- [ ] **User Accounts** — save portfolio, track changes over time

## Session Rules
1. Pick the top unchecked item from P0, then P1, then P2
2. If blocked on something, skip to next item
3. Always deploy at end of session
4. Log what shipped in growth-log.md
5. Re-prioritize after each session based on what you learned
