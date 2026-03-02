# boredfolio.

**India's most honest mutual fund platform.**

We strip funds naked so you can invest with your eyes open. No commissions. No affiliate links. No BS. Just data and uncomfortable honesty.

---

## Why I Built This

Every mutual fund platform in India makes money from commissions or affiliate links. Their "recommendations" are ads. I wanted a platform that shows you the uncomfortable truth about your funds: the real expense ratios eating your returns, the overlap between your "diversified" portfolio, and how your fund actually performs against its benchmark after fees.

Boredfolio uses data from AMFI (India's mutual fund regulatory body) via mfapi.in. No paid data feeds, no proprietary scores, no black boxes. Every number is verifiable.

### Key decisions
- **Why mfapi.in over paid APIs?** Free, open, no auth required. AMFI mandates this data be public. Paid APIs add cost without adding data.
- **Why Next.js App Router with ISR?** Mutual fund NAVs update once daily. ISR lets us cache aggressively (24h for scheme lists, 1h for NAV history) while still feeling real-time.
- **Why no AI features in v1?** Ship the data layer first, earn trust with accuracy, then add Claude-powered natural language search in v2. The AI is the moat, but the data is the foundation.
- **Why this design system?** Cream backgrounds, warm colors, serif headings. Mutual fund platforms look like Bloomberg terminals or mobile banking apps. Neither works for retail investors who find finance intimidating. Boredfolio should feel like a magazine, not a dashboard.

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-org/boredfolio.git
cd boredfolio
npm install

# Set up environment
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 + custom design tokens |
| Charts | Recharts 2 |
| Data | [mfapi.in](https://api.mfapi.in) (free, open, no auth) |
| Fonts | Instrument Serif + DM Sans + JetBrains Mono |

## Architecture

```
src/
├── app/          → Next.js routes (13 pages + sitemap + robots + API)
├── pages/        → Page components (12 assembled pages)
├── components/   → Reusable library (55+ exports)
│   ├── ui/       → Primitives (Button, Badge, Card, Input, Tabs, Modal...)
│   ├── data/     → DataTable, ReturnDisplay
│   ├── domain/   → RiskOMeter, SchemeCard, SIPCalculator, GlobalSearch...
│   ├── charts/   → NAVChart, PieChart, BarChart, Heatmap, Drawdown...
│   └── layout/   → Header, Footer, PageLayout, MobileNav, TickerStrip
├── lib/
│   ├── mfapi.ts  → API client (search, history, latest NAV, calculations)
│   ├── data.ts   → Server-side data layer (ISR-cached, pre-processed)
│   ├── hooks.ts  → Client hooks (useFetch, useSchemeSearch, useWatchlist)
│   ├── seo.tsx   → JSON-LD structured data generators
│   ├── utils.ts  → Formatters, brand colors, helpers
│   └── mockData.ts → Development sample data
├── types/        → TypeScript interfaces
└── styles/       → Global CSS, Tailwind layers
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Home — market pulse, editorial, heatmap, staff picks |
| `/fund/[slug]` | Scheme detail — 7-tab analysis with real NAV data |
| `/explore` | Screener — pre-built screens + advanced filters |
| `/compare` | Side-by-side comparison — overlap matrix, verdict |
| `/category/[slug]` | Category deep dive — leaderboards, education |
| `/amc/[slug]` | Fund house profile — report card, cost analysis |
| `/blog` | Editorial hub — fund roasts, market commentary |
| `/blog/[slug]` | Article detail |
| `/search` | Full-text search across schemes, AMCs, categories |
| `/tools/sip` | SIP / step-up / lumpsum / SWP calculators |
| `/tools/overlap` | Portfolio redundancy analyzer |
| `/tools/tax` | Tax rules, calculator, old vs new regime |
| `/managers` | Fund manager directory |
| `/api/search` | Autocomplete API |
| `/api/fund` | Scheme data API |

## API Integration

Data flows from [mfapi.in](https://api.mfapi.in):

```
mfapi.in → lib/mfapi.ts (raw fetcher)
         → lib/data.ts (server processor: returns, drawdown, Sharpe, SIP)
         → app/api/ (route handlers for client-side)
         → pages/ (pre-rendered with ISR)
```

All fetches use Next.js ISR caching:
- Scheme list: 24h
- NAV history: 1h
- Latest NAV: 5 min

## Brand

| Token | Value | Usage |
|-------|-------|-------|
| Cream | `#F5F0E8` | All backgrounds |
| Sage | `#6B8F71` | Primary, CTAs, active states |
| Mustard | `#B8963E` | Accents, insights, warnings |
| Good | `#4A7C59` | Positive returns, pros |
| Ugly | `#C4453C` | Negative returns, cons |
| Ink | `#1A1A1A` | Body text (shades 100-900) |

Fonts: Instrument Serif (headings), DM Sans (body), JetBrains Mono (numbers).
Max border-radius: 8px. Warm shadows only. Never pure white.

## Development

```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint
```

## License

Private. Not open source.
