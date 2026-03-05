import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Simple in-memory cache to reduce API calls
const roastCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

// Models to try in order (fallback chain)
const MODELS = ["gemini-2.0-flash", "gemini-2.0-flash-lite"];

async function generateWithRetry(prompt: string, maxRetries = 2): Promise<string> {
  for (const modelName of MODELS) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (err: any) {
        const is429 = err?.status === 429 || err?.message?.includes("429");
        if (is429 && attempt < maxRetries) {
          // Wait before retry: 2s, then 5s
          await new Promise((r) => setTimeout(r, (attempt + 1) * 2500));
          continue;
        }
        if (is429) break; // Try next model
        throw err; // Non-rate-limit error, throw immediately
      }
    }
  }
  throw new Error("All models exhausted — rate limited");
}

export async function POST(req: NextRequest) {
  try {
    const { schemeCode, schemeName } = await req.json();

    if (!schemeCode && !schemeName) {
      return NextResponse.json({ error: "Missing schemeCode or schemeName" }, { status: 400 });
    }

    const code = schemeCode || "";

    // Check cache first
    const cacheKey = `roast_${code}`;
    const cached = roastCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Fetch fund data from mfapi.in
    let meta: any = {};
    let navData: any[] = [];

    if (code) {
      const res = await fetch(`https://api.mfapi.in/mf/${code}`);
      const fundData = await res.json();
      meta = fundData?.meta || {};
      navData = fundData?.data || [];
    }

    // Calculate key metrics
    const latestNav = navData[0]?.nav || "N/A";
    const nav1YAgo = navData.find((_: any, i: number) => i >= 250)?.nav;
    const return1Y = nav1YAgo
      ? (((parseFloat(navData[0]?.nav) - parseFloat(nav1YAgo)) / parseFloat(nav1YAgo)) * 100).toFixed(1)
      : "N/A";
    const fundName = meta?.scheme_name || schemeName || "this fund";
    const category = meta?.scheme_category || "Unknown Category";
    const fundHouse = meta?.fund_house || "Unknown AMC";

    // Calculate additional metrics for richer roasts
    const nav3MAgo = navData.find((_: any, i: number) => i >= 63)?.nav;
    const return3M = nav3MAgo
      ? (((parseFloat(navData[0]?.nav) - parseFloat(nav3MAgo)) / parseFloat(nav3MAgo)) * 100).toFixed(1)
      : "N/A";

    const prompt = `You are Boredfolio — India's most brutally honest mutual fund roast platform. Voice: Zomato notifications × Tanmay Bhat × a CA who just filed 200 ITRs. Hinglish where natural.

Generate a savage, funny, data-backed roast of this mutual fund. The roast MUST:
- Be 3-4 paragraphs, each 1-2 sentences
- Include at least 2 real numbers from the data provided
- Be funny enough to screenshot and share on WhatsApp
- Never be mean-spirited — roast the FUND, not the investor
- End with one genuinely useful insight

Fund: ${fundName}
Category: ${category}
Fund House: ${fundHouse}
Current NAV: ₹${latestNav}
1-Year Return: ${return1Y}%
3-Month Return: ${return3M}%
Data points available: ${navData.length} days of NAV history

Format your response as JSON:
{
  "headline": "A 5-8 word savage headline (no quotes)",
  "roast": "The full roast text, 3-4 short paragraphs separated by \\n\\n",
  "verdict": "One line verdict — brutal but fair",
  "shareText": "A WhatsApp-ready one-liner under 100 chars that makes someone want to click the link"
}

Return ONLY the JSON, no markdown fences.`;

    const text = await generateWithRetry(prompt);

    // Parse JSON response
    let parsed;
    try {
      const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        headline: "This Fund Has Secrets",
        roast: text,
        verdict: "Read the fine print.",
        shareText: "You need to see what Boredfolio said about your fund 💀",
      };
    }

    const responseData = {
      ...parsed,
      fundName,
      category,
      fundHouse,
      nav: latestNav,
      return1Y,
      schemeCode: code,
    };

    // Cache the result
    roastCache.set(cacheKey, { data: responseData, ts: Date.now() });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Roast API error:", error);

    // Better error message for rate limits
    const is429 = error?.status === 429 || error?.message?.includes("rate limit") || error?.message?.includes("exhausted");
    if (is429) {
      return NextResponse.json(
        { error: "Our AI roaster is taking a chai break. Too many roasts today! Try again in a minute. ☕" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Couldn't roast this fund. The API might be overwhelmed by our savagery. Try again." },
      { status: 500 }
    );
  }
}
