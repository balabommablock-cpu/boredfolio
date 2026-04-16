// Supabase client for Bambai Bhada drops.
// Gracefully degrades to localStorage-only mode when env vars are missing.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!URL || !ANON) return null;
  if (!client) {
    client = createClient(URL, ANON, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { params: { eventsPerSecond: 5 } },
    });
  }
  return client;
}

export const BB_TABLE = "bambai_bhada_drops";

export interface DbDrop {
  id: string;
  kind: "listing" | "request";
  lat: number;
  lng: number;
  message: string;
  bhk: number | null;
  amount: number | null;
  radius_km: number | null;
  instagram: string | null;
  telegram: string | null;
  twitter: string | null;
  created_at: string;
}

// Convert between DB shape and UI shape
export function dbToDrop(row: DbDrop) {
  return {
    id: row.id,
    kind: row.kind,
    lat: row.lat,
    lng: row.lng,
    message: row.message,
    bhk: (row.bhk ?? undefined) as 0 | 1 | 2 | 3 | undefined,
    amount: row.amount ?? undefined,
    radiusKm: row.radius_km ?? undefined,
    instagram: row.instagram ?? undefined,
    telegram: row.telegram ?? undefined,
    twitter: row.twitter ?? undefined,
    ts: new Date(row.created_at).getTime(),
  };
}

export function dropToDb(d: {
  id: string;
  kind: "listing" | "request";
  lat: number;
  lng: number;
  message: string;
  bhk?: number;
  amount?: number;
  radiusKm?: number;
  instagram?: string;
  telegram?: string;
  twitter?: string;
}) {
  return {
    id: d.id,
    kind: d.kind,
    lat: d.lat,
    lng: d.lng,
    message: d.message,
    bhk: d.bhk ?? null,
    amount: d.amount ?? null,
    radius_km: d.radiusKm ?? null,
    instagram: d.instagram ?? null,
    telegram: d.telegram ?? null,
    twitter: d.twitter ?? null,
  };
}
