import { NextRequest, NextResponse } from "next/server";
import { searchAndEnrich } from "@/lib/data";

/**
 * GET /api/search?q=HDFC
 * Proxies to mfapi.in/mf/search with enrichment.
 * Used by GlobalSearch autocomplete.
 */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    const results = await searchAndEnrich(q);
    return NextResponse.json(results, {
      headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200" },
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
