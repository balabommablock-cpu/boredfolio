import { NextRequest, NextResponse } from "next/server";
import { getSchemePageData, resolveSlugToCode } from "@/lib/data";

/**
 * GET /api/fund?code=125497
 * GET /api/fund?slug=hdfc-flexi-cap
 * Returns pre-processed scheme data for dynamic client components.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const slug = request.nextUrl.searchParams.get("slug");

  let schemeCode: number | null = null;

  if (code) {
    schemeCode = parseInt(code, 10);
  } else if (slug) {
    schemeCode = await resolveSlugToCode(slug);
  }

  if (!schemeCode) {
    return NextResponse.json({ error: "Scheme not found" }, { status: 404 });
  }

  try {
    const data = await getSchemePageData(schemeCode);
    // Strip navHistory for lighter payload (client can fetch separately if needed)
    const { navHistory, ...rest } = data;
    return NextResponse.json({
      ...rest,
      navHistoryLength: navHistory.length,
      navHistoryFirstDate: navHistory[0]?.date,
      navHistoryLastDate: navHistory[navHistory.length - 1]?.date,
    }, {
      headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to fetch scheme data" }, { status: 500 });
  }
}
