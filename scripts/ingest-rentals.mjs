#!/usr/bin/env node
// ============================================================
// BAMBAI BHADA — Rental data ingest
//
// Scrapes real rental posts from public Reddit JSON endpoints,
// including classifieds megathread COMMENTS, extracts
// locality / BHK / rent / contact from the free text, geocodes
// against our locality dictionary, dedupes, and writes
// public/data/rentals.json for the client.
//
// Sources (v2):
//   - 5 dedicated rental subs (bangaloreflats, bangalorehousing,
//     mumbairental, delhirentals, Gurgaonflats)
//   - 3 main city subs (bangalore, mumbai, gurgaon) — new + year search
//   - 3 adjacent-area subs (navimumbai, delhi, noida)
//   - Classifieds megathread comments auto-discovered per city
//   - /top year window on rental subs for high-signal backlog
//
// Run: node scripts/ingest-rentals.mjs
// ============================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { LOCALITIES, CITY_KEYWORDS } from "./rental-localities.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public", "data", "rentals.json");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ============================================================
// SOURCES — public Reddit JSON endpoints that return real data
// Every source is either a post-listing (t3) or a thread whose
// top-level comments (t1) are mined for rental content.
// ============================================================
const SOURCES = [
  // --- dedicated rental / flatmate subs ---
  { sub: "bangaloreflats",   cityHint: "bangalore", mode: "new",  limit: 100 },
  { sub: "bangaloreflats",   cityHint: "bangalore", mode: "top",  limit: 100, t: "month" },
  { sub: "bangaloreflats",   cityHint: "bangalore", mode: "hot",  limit: 100 },
  { sub: "bangalorehousing", cityHint: "bangalore", mode: "new",  limit: 100 },
  { sub: "bangalorehousing", cityHint: "bangalore", mode: "search", search: "bhk OR flatmate OR rent", limit: 100, t: "year" },
  { sub: "mumbairental",     cityHint: "mumbai",    mode: "new",  limit: 100 },
  { sub: "mumbairental",     cityHint: "mumbai",    mode: "top",  limit: 100, t: "year" },
  // r/delhirentals scans for Gurgaon-keyword posts (most are Delhi proper)
  { sub: "delhirentals",     cityHint: null,        mode: "search", search: "gurgaon OR gurugram OR dlf OR cyber city OR sohna", limit: 100, t: "year" },
  { sub: "Gurgaonflats",     cityHint: "gurgaon",   mode: "new",  limit: 100 },
  { sub: "Gurgaonflats",     cityHint: "gurgaon",   mode: "top",  limit: 100, t: "year" },

  // --- city subs — new + search ---
  { sub: "bangalore", cityHint: "bangalore", mode: "search", search: "flatmate OR rent OR pg OR bhk", limit: 100, t: "month" },
  { sub: "bangalore", cityHint: "bangalore", mode: "search", search: "flatmate OR bhk", limit: 100, t: "year" },
  { sub: "mumbai",    cityHint: "mumbai",    mode: "search", search: "flatmate OR looking for flat OR bhk", limit: 100, t: "month" },
  { sub: "mumbai",    cityHint: "mumbai",    mode: "search", search: "flatmate OR bhk", limit: 100, t: "year" },
  { sub: "gurgaon",   cityHint: "gurgaon",   mode: "search", search: "flatmate OR rent OR bhk OR pg", limit: 100, t: "month" },
  { sub: "gurgaon",   cityHint: "gurgaon",   mode: "search", search: "flatmate OR bhk", limit: 100, t: "year" },

  // --- adjacent-area subs (auto-route by city keywords) ---
  { sub: "navimumbai", cityHint: "mumbai",  mode: "search", search: "flatmate OR rent OR bhk", limit: 100, t: "year" },
  { sub: "navimumbai", cityHint: "mumbai",  mode: "new",    limit: 100 },
  { sub: "delhi",      cityHint: null,      mode: "search", search: "gurgaon OR gurugram OR dlf", limit: 100, t: "year" },
  { sub: "noida",      cityHint: null,      mode: "search", search: "gurgaon OR gurugram OR dlf", limit: 100, t: "year" },
  { sub: "india",      cityHint: null,      mode: "search", search: "flatmate bangalore OR mumbai OR gurgaon", limit: 100, t: "year" },
  { sub: "indianrealestate", cityHint: null, mode: "search", search: "bangalore OR mumbai OR gurgaon rent", limit: 100, t: "year" },
];

// Classifieds megathreads — Bangalore runs a monthly one we can mine.
// Auto-discovered via search below; these are the known seed IDs.
const MEGATHREAD_SEEDS = {
  bangalore: [
    { sub: "bangalore", search: "Classifieds Thread" }, // discovered dynamically below
  ],
};

// ============================================================
// HTTP helper — old.reddit.com is friendlier to unauthenticated
// clients than www.reddit.com
// ============================================================
async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.json();
}

function subUrl({ sub, mode, search, limit = 100, t }) {
  const base = "https://old.reddit.com";
  if (mode === "search") {
    const q = encodeURIComponent(search);
    const tt = t ? `&t=${t}` : "";
    return `${base}/r/${sub}/search.json?q=${q}&restrict_sr=1&sort=new&limit=${limit}${tt}`;
  }
  if (mode === "top") {
    return `${base}/r/${sub}/top.json?limit=${limit}&t=${t || "month"}`;
  }
  if (mode === "hot") {
    return `${base}/r/${sub}/hot.json?limit=${limit}`;
  }
  return `${base}/r/${sub}/new.json?limit=${limit}`;
}

async function fetchMegathreadComments(sub, threadId) {
  const url = `https://old.reddit.com/r/${sub}/comments/${threadId}.json?limit=500`;
  const data = await fetchJson(url);
  // Reddit returns [post, commentTree]
  if (!Array.isArray(data) || data.length < 2) return [];
  const comments = data[1]?.data?.children || [];
  return comments
    .filter((c) => c.kind === "t1")
    .map((c) => c.data)
    .filter((c) => c && c.body && !c.author_flair_text?.match(/^bot/i));
}

async function discoverMegathreads(sub) {
  // Finds the last 3 classifieds-style megathreads and returns their IDs
  try {
    const url = `https://old.reddit.com/r/${sub}/search.json?q=${encodeURIComponent("Classifieds Thread")}&restrict_sr=1&sort=new&limit=5&t=year`;
    const data = await fetchJson(url);
    const posts = data?.data?.children || [];
    return posts
      .filter((p) => p.kind === "t3" && /classifieds/i.test(p.data.title))
      .slice(0, 3)
      .map((p) => p.data.id);
  } catch {
    return [];
  }
}

// ============================================================
// PARSERS — extract structured data from free text
// ============================================================

function parseBhk(text) {
  const t = text.toLowerCase();
  if (/\bstudio\b|\b1\s*rk\b|\b1rk\b/.test(t)) return 1;
  const m = t.match(/\b([1-4])\s*[- ]?\s*(?:bhk|bedroom|bed room|b\/h\/k)\b/);
  if (m) return Number(m[1]);
  const words = { one: 1, two: 2, three: 3, four: 4 };
  const wm = t.match(/\b(one|two|three|four)\s*(?:bhk|bedroom)/);
  if (wm) return words[wm[1]];
  return null;
}

// Parse rent — must appear in a rent-ish CONTEXT, not any bare number.
// Looks for explicit currency markers or adjacency to words like
// "rent", "budget", "pm", etc. to avoid picking up random numbers
// ("99%", "2005", "4BHK").
function parseRent(text) {
  const t = text.replace(/,/g, "").toLowerCase();

  // PREFER: "your share ~X" / "each share X" — per-person cost
  const shareMatch = t.match(/(?:your\s*share|each\s*share|per\s*person)[^\d]{0,12}(\d+(?:\.\d+)?)\s*(k|lakh|lac|l|cr)?/i);
  if (shareMatch) {
    const v = normAmount(shareMatch[1], shareMatch[2]);
    if (v) return v;
  }

  // Range with unit: "15-20k" / "15 to 20k" / "15 - 20 k"
  const rangeRx = /\b(\d+)\s*(?:-|to|–|—)\s*(\d+)\s*(k|lakh|lac|l|cr)\b/i;
  const rm = t.match(rangeRx);
  if (rm) {
    const a = normAmount(rm[1], rm[3]);
    const b = normAmount(rm[2], rm[3]);
    if (a && b) return Math.round((a + b) / 2);
    if (a) return a;
    if (b) return b;
  }

  // Currency prefix MUST be present for bare numbers to count:
  //   ₹25000 / rs 25000 / inr 25000
  let m = t.match(/(?:₹|\brs\.?\s*|\binr\s+)(\d+(?:\.\d+)?)\s*(k|lakh|lac|l|cr)?/i);
  if (m) {
    const v = normAmount(m[1], m[2]);
    if (v) return v;
  }

  // "rent X" / "rent is X" / "rent: X" / "total rent X"
  m = t.match(/\brent\b[^a-z0-9]{1,10}(\d+(?:\.\d+)?)\s*(k|lakh|lac|l|cr)?/i);
  if (m) {
    const v = normAmount(m[1], m[2]);
    if (v) return v;
  }

  // "budget X" / "budget of X" / "budget is X"
  m = t.match(/\bbudget\b(?:\s+of|\s+is)?\s*(?:around\s*)?(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac|l|cr)?/i);
  if (m) {
    const v = normAmount(m[1], m[2]);
    if (v) return v;
  }

  // "X per month" / "X pm" / "X/month" / "X monthly"
  m = t.match(/\b(\d{3,6})\s*(?:\/-|per month|pm\b|p\.m\.|\/month|\/mo\b|monthly)/i);
  if (m) {
    const v = normAmount(m[1], null);
    if (v) return v;
  }

  // "around X k" / "approx X k" / "max X k" — requires unit
  m = t.match(/\b(?:around|approximately|approx|max|upto|up to|below|near|under)\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(k|lakh|lac|cr)\b/i);
  if (m) {
    const v = normAmount(m[1], m[2]);
    if (v) return v;
  }

  // Bare "Nk" where N is 5-99 and not preceded by BHK digit
  // e.g. "25k" OK, but "3BHK" -> 3 isn't k, and "25K total" is allowed
  m = t.match(/(?:^|[^0-9bhk])(\d{2,3})\s*k\b/i);
  if (m && !/[0-9]bhk$/i.test(m[0])) {
    const v = normAmount(m[1], "k");
    if (v) return v;
  }

  return null;
}

function normAmount(num, unit) {
  let n = Number(num);
  if (!isFinite(n)) return null;
  const u = (unit || "").toLowerCase();
  if (u === "k") n *= 1000;
  else if (u === "lakh" || u === "lac" || u === "l") n *= 100000;
  else if (u === "cr") n *= 10000000;
  // Sanity clamp — monthly rent in ₹
  if (n < 3000 || n > 500000) return null;
  return Math.round(n);
}

function parseHandle(text) {
  const m = text.match(/@([a-z0-9._]{3,30})/i);
  if (m) return m[1];
  const dm = text.match(/(?:instagram|insta|ig)[^a-z0-9]{1,6}([a-z0-9._]{3,30})/i);
  if (dm) return dm[1];
  return null;
}

function parseRole(title, body) {
  const t = (title + " " + body).toLowerCase();
  // "flatmate needed/wanted/required" or "room available" → has-place
  if (/flatmate\s*(needed|wanted|required|replacement)/.test(t)) return "has-place";
  if (/(room|bed|bedroom)\s*(available|free|vacant)/.test(t)) return "has-place";
  if (/available\s*for\s*(rent|lease)|for\s*rent\b/.test(t)) return "has-place";
  if (/\b1\s*(room|bed)\s*(?:in|of)\s*(?:a\s*)?\d\s*bhk/.test(t)) return "has-place";
  // "looking for a flat/pg/room" → seeking
  if (/looking\s*for\s*(?:a\s*)?(flat|pg|room|1bhk|2bhk|3bhk|bhk|place|rental|accommodation|apartment)/.test(t)) return "seeking";
  if (/\bneed(?:ed)?\b[^.]{0,30}(flat|room|pg|bhk|place|accommodation)/.test(t)) return "seeking";
  if (/\b(?:want(?:ed)?|searching)\s*(?:a\s*)?(flat|room|pg|bhk|place|apartment)/.test(t)) return "seeking";
  return "renter";
}

// ============================================================
// GEOCODER — match free text against our locality dictionary
// Returns the longest-matching locality for the best-guessed city.
// ============================================================
function guessCity(text, hint) {
  if (hint) return hint;
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const [city, kws] of Object.entries(CITY_KEYWORDS)) {
    let score = 0;
    for (const kw of kws) {
      if (t.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = city;
    }
  }
  return best;
}

function matchLocality(text, city) {
  if (!city || !LOCALITIES[city]) return null;
  const t = text.toLowerCase();
  let best = null;
  let bestLen = 0;
  for (const loc of LOCALITIES[city]) {
    const candidates = [loc.name.toLowerCase(), ...loc.aliases];
    for (const c of candidates) {
      const idx = t.indexOf(c);
      if (idx === -1) continue;
      const before = idx === 0 ? " " : t[idx - 1];
      const after = idx + c.length >= t.length ? " " : t[idx + c.length];
      if (!/[a-z0-9]/.test(before) && !/[a-z0-9]/.test(after)) {
        if (c.length > bestLen) {
          best = loc;
          bestLen = c.length;
        }
      }
    }
  }
  return best;
}

// Small deterministic jitter so pins in the same locality don't overlap
function jitter(seed, amt = 0.006) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const a = ((h ^ 0x9e3779b9) >>> 0) / 0xffffffff;
  const b = ((h * 2654435761) >>> 0) / 0xffffffff;
  return [(a - 0.5) * amt, (b - 0.5) * amt];
}

// ============================================================
// NORMALIZERS — shared rental-signal + filter logic
// ============================================================

const STRONG_SIGNALS = [
  /\b[1-4]\s*bhk\b/i,
  /\bflatmate|roommate|flat mate|room mate\b/i,
  /\bpaying guest\b/i,
  /\bpg\b.*(near|in|sector|road|layout|phase|nagar|west|east|for rent|for male|for female|for boys|for girls|hostel)/i,
  /\b1\s*rk\b/i,
  /\bsublet|sublease|sub-let|sub let\b/i,
  /\b(looking for|need|want|searching for)\s+(?:a\s+)?(?:flat|pg|bhk|1rk|room to|rental|place to stay|place to rent|accommodation|accomm|roomie|apartment)/i,
  /\b(available|vacant)\s+(?:for rent|room|flat|bhk|from)/i,
  /\b(room|flat|bhk)\s+(available|for rent|vacant)/i,
  /\brent\s+(out|a|my)\b/i,
  /\bfor rent\b/i,
  /\bhouse hunting|apartment hunting|flat hunting\b/i,
];

const NEGATIVE_SIGNALS = [
  /\btennis|racket|laptop|mattress|furniture for sale|selling my\b/i,
  /\b(cook|maid|cleaner|driver)\b[^.]{0,40}\b(charge|cost|rate|salary|needed|price)/i,
  /\bbike rental|scooty rental|car rental|yulu|bounce\b/i,
  /\b(job|hiring|internship|vacancy for|we are hiring)\b/i,
  /\bkitten|puppy|adoption\b/i,
  /\bevent|concert|tickets?\b.*(sell|sale|buy)/i,
  /\bplayground|playstation|ps5|xbox\b.*(sell|for sale)/i,
  /\bvisiting\b[^.]{0,30}\b(meet|friend|girlfriend|boyfriend)/i,
  /\bfor sale\b/i, // property sales, not rentals
  /\bsale price|asking price|resale\b/i,
  /\bbroker(?:age)?\s+(is|will be|charged|applicable)/i, // broker listings — usually not user posts
];

function looksLikeRental(text) {
  if (!text || text.length < 20) return false;
  if (NEGATIVE_SIGNALS.some((rx) => rx.test(text))) return false;
  return STRONG_SIGNALS.some((rx) => rx.test(text));
}

// Turn a Reddit post into a drop
function normalizePost(post, cityHint) {
  const pd = post.data;
  const title = pd.title || "";
  const body = pd.selftext || "";
  const combined = `${title}\n${body}`;
  if (!looksLikeRental(combined)) return null;

  const city = guessCity(combined, cityHint);
  if (!city) return null;

  const locality = matchLocality(combined, city);
  if (!locality) return null;

  const [jLat, jLng] = jitter(pd.id);

  return {
    id: `reddit-p-${pd.id}`,
    source: "reddit",
    sourceType: "post",
    sourceUrl: `https://reddit.com${pd.permalink}`,
    subreddit: pd.subreddit,
    author: pd.author,
    createdAt: pd.created_utc * 1000,
    city,
    locality: locality.id,
    localityName: locality.name,
    lat: locality.lat + jLat,
    lng: locality.lng + jLng,
    title: title.slice(0, 200),
    message: body.slice(0, 1000),
    bhk: parseBhk(combined),
    rent: parseRent(combined),
    handle: parseHandle(combined),
    role: parseRole(title, body),
  };
}

// Turn a Reddit comment (from a classifieds megathread) into a drop.
// Comments have no title — we synthesize one from the first sentence.
function normalizeComment(c, cityHint, subreddit) {
  const body = c.body || "";
  if (!looksLikeRental(body)) return null;

  const city = guessCity(body, cityHint);
  if (!city) return null;

  const locality = matchLocality(body, city);
  if (!locality) return null;

  // Synth title: first meaningful line, or first 90 chars
  const firstLine = body.split(/\n/).find((l) => l.trim().length > 15) || body;
  const title = firstLine.replace(/[#*_>]/g, "").trim().slice(0, 120);

  const [jLat, jLng] = jitter(c.id);

  return {
    id: `reddit-c-${c.id}`,
    source: "reddit",
    sourceType: "comment",
    sourceUrl: `https://reddit.com${c.permalink || `/r/${subreddit}/comments/${c.link_id?.replace("t3_", "") || ""}/_/${c.id}`}`,
    subreddit,
    author: c.author,
    createdAt: (c.created_utc || 0) * 1000,
    city,
    locality: locality.id,
    localityName: locality.name,
    lat: locality.lat + jLat,
    lng: locality.lng + jLng,
    title,
    message: body.slice(0, 1000),
    bhk: parseBhk(body),
    rent: parseRent(body),
    handle: parseHandle(body),
    role: parseRole(title, body),
  };
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log("Bambai Bhada — rental ingest v2 starting…");
  const all = [];
  const seen = new Set();

  // --- 1. Fetch post-based sources ---
  for (const src of SOURCES) {
    const label = src.search
      ? `${src.sub} ${src.mode}:${src.search}${src.t ? " " + src.t : ""}`
      : `${src.sub} ${src.mode}${src.t ? " " + src.t : ""}`;
    try {
      process.stdout.write(`  r/${label} … `);
      const data = await fetchJson(subUrl(src));
      const children = data?.data?.children || [];
      let added = 0;
      let skipped = 0;
      for (const p of children) {
        if (p.kind !== "t3") continue;
        const drop = normalizePost(p, src.cityHint);
        if (!drop) {
          skipped++;
          continue;
        }
        if (seen.has(drop.id)) continue;
        seen.add(drop.id);
        all.push(drop);
        added++;
      }
      console.log(`${children.length} → +${added} (−${skipped})`);
    } catch (e) {
      console.log(`FAILED (${e.message})`);
    }
    await new Promise((r) => setTimeout(r, 600));
  }

  // --- 2. Megathread comments (Bangalore Classifieds Threads) ---
  console.log("\nMegathread comments:");
  for (const sub of ["bangalore", "mumbai", "gurgaon"]) {
    try {
      process.stdout.write(`  discover r/${sub} megathreads … `);
      const ids = await discoverMegathreads(sub);
      console.log(`${ids.length} thread(s): ${ids.join(", ") || "(none)"}`);

      for (const tid of ids) {
        try {
          process.stdout.write(`    scrape ${tid} … `);
          const comments = await fetchMegathreadComments(sub, tid);
          let added = 0;
          let skipped = 0;
          for (const c of comments) {
            const drop = normalizeComment(c, null, sub);
            if (!drop) {
              skipped++;
              continue;
            }
            if (seen.has(drop.id)) continue;
            seen.add(drop.id);
            all.push(drop);
            added++;
          }
          console.log(`${comments.length} comments → +${added} (−${skipped})`);
        } catch (e) {
          console.log(`FAILED (${e.message})`);
        }
        await new Promise((r) => setTimeout(r, 600));
      }
    } catch (e) {
      console.log(`FAILED (${e.message})`);
    }
  }

  // --- 3. Bucket + sort ---
  const bucketed = { mumbai: [], bangalore: [], gurgaon: [] };
  for (const d of all) {
    if (bucketed[d.city]) bucketed[d.city].push(d);
  }

  // Content-based dedup — same title + same locality is a repost.
  // Keep the newest.
  for (const c of Object.keys(bucketed)) {
    const byKey = new Map();
    for (const d of bucketed[c]) {
      const key = `${d.locality}::${(d.title || "").toLowerCase().trim().slice(0, 80)}`;
      const existing = byKey.get(key);
      if (!existing || (d.createdAt || 0) > (existing.createdAt || 0)) {
        byKey.set(key, d);
      }
    }
    bucketed[c] = Array.from(byKey.values());
    bucketed[c].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    version: 2,
    sourceCount: SOURCES.length + 3, // +3 megathread city scans
    counts: {
      mumbai: bucketed.mumbai.length,
      bangalore: bucketed.bangalore.length,
      gurgaon: bucketed.gurgaon.length,
      total: all.length,
      withRent: all.filter((d) => d.rent).length,
      withBhk: all.filter((d) => d.bhk).length,
      withHandle: all.filter((d) => d.handle).length,
      fromComments: all.filter((d) => d.sourceType === "comment").length,
    },
    cities: bucketed,
  };

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(
    `\nDone.\n  mumbai=${payload.counts.mumbai}\n  bangalore=${payload.counts.bangalore}\n  gurgaon=${payload.counts.gurgaon}\n  total=${payload.counts.total}\n  withRent=${payload.counts.withRent}\n  withBhk=${payload.counts.withBhk}\n  fromComments=${payload.counts.fromComments}\n`
  );
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
