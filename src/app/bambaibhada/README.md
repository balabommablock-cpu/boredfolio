# Bambai Bhada — Supabase setup

The app works without Supabase (drops live in localStorage).
To make drops public across users, wire up a Supabase project.

## One-time setup

### 1. Create a Supabase project

https://supabase.com → New project → give it a name → wait ~2 min

### 2. Run the schema

Supabase Dashboard → **SQL Editor** → **New query** →
paste the contents of `supabase-schema.sql` → **Run**.

This creates the `bambai_bhada_drops` table with:
- Row Level Security enabled
- Anonymous read + insert policies
- 30-day auto-expiry (via `expires_at` + RLS filter)
- Bounds + amount validators
- Realtime channel for live inserts

### 3. Grab your keys

Supabase Dashboard → **Project Settings** → **API** →
- **Project URL** (e.g. `https://abcxyz.supabase.co`)
- **anon / public key** (starts with `eyJ...`)

### 4. Add to `.env.local` in the boredfolio project root

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 5. Restart dev server / redeploy

```
npm run dev
```

Drops will now persist and appear on every visitor's map in realtime.

---

## Fallback behaviour

If the env vars are missing, `getSupabase()` returns `null` and the app
uses localStorage only — the current dev state. No errors, no broken UI.

## Anti-spam (v0)

For now, anti-spam is enforced at the database level:
- 30-day auto-expiry
- Lat/lng bounded to Mumbai bbox
- Amount clamped to 5–1000 (₹ thousands)
- Notes clamped to 300 chars

For v1, add:
- Rate limiting via Supabase Edge Function + IP hash
- Instagram handle format validation (server-side)
- Community flagging table
- `oembed` check on Instagram handles for realness
