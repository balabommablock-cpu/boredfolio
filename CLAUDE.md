# Boredfolio

## What This Is
India's most honest mutual fund platform. We roast the industry, expose hidden fees, and help people switch to Direct plans — while being the funniest finance site on the internet.

## Tech Stack
- Next.js 14, Vercel hosting
- Single-file SPA: `src/app/BoredfolioApp.jsx` (THE source of truth)
- Catch-all route: `src/app/[[...slug]]/page.tsx` → dynamic import of BoredfolioApp
- API: mfapi.in (free, no key needed)

## Code Standards (CRITICAL — read before writing ANY code)
```
var e = React.createElement    // NEVER use JSX
var only                       // NEVER use const or let
function keyword only          // NEVER use arrow functions () =>
Inline styles only             // NEVER use className or CSS files
```

### Patterns
- Colors: `C.cream`, `C.sage`, `C.char`, `C.muted`, `C.light`, `C.mustard`, `C.red`, `C.green`
- Fonts: `Sf` (Playfair Display), `Bf` (DM Sans), `Mf` (JetBrains Mono), `Hf` (Caveat)
- Routing: `useGo()` hook + `NavCtx` context, `pushState`/`popstate`
- Animation: `useVis()` for IntersectionObserver (but NOT for async-loaded content — use useState/useEffect instead)
- Data: `useFund(code)` for single fund, `useAllFunds()` for all AMCs
- Format: `fI(number)` for Indian commas, `fN(nav)` for NAV decimals

## Commands
- `npm run dev` — local dev server
- `npm run build` — production build
- `vercel --prod --yes` — deploy to production

## Brand Voice
See `.claude/rules/brand-voice.md` for the full guide. Key rules:
- Every joke must contain a real financial truth or number
- If copy wouldn't get screenshotted and shared in a group chat, rewrite it
- Never sound like a LinkedIn post or a "mutual funds sahi hai" ad

## The "fudge you" Protocol
When the user says "fudge you", execute a full autonomous growth cycle:

1. **READ** `.claude/growth-backlog.md` — find the top priority task
2. **EXECUTE** — build it, using the right model for each subtask
3. **TEST** — `npm run build` must pass, visual check on preview
4. **DEPLOY** — `vercel --prod --yes`
5. **LOG** — append to `.claude/growth-log.md` with date and what shipped
6. **UPDATE** — re-prioritize the backlog, add any new tasks discovered

### Model Selection (save tokens, move fast)
- **haiku**: File reads, searches, git ops, running builds, simple edits, grep/glob
- **sonnet**: Writing copy, medium code changes, testing flows, code review
- **opus**: New feature architecture, complex debugging, full page implementations, brand-voice copy

### Rules
- ONE meaningful ship per session
- Always build + test before deploy
- If something could break the live site, don't ship it — move to next task
- The site is live and shared. Stability > speed.
