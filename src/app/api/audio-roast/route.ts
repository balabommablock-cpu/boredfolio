import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// In-memory cache for audio roasts
const audioCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

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
          await new Promise((r) => setTimeout(r, (attempt + 1) * 2500));
          continue;
        }
        if (is429) break;
        throw err;
      }
    }
  }
  throw new Error("All models exhausted — rate limited");
}

async function textToSpeech(text: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY not configured");
  }

  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "API-Subscription-Key": apiKey,
    },
    body: JSON.stringify({
      inputs: [text],
      target_language_code: "hi-IN",
      speaker: "meera",
      model: "bulbul:v1",
      enable_preprocessing: true,
      pitch: 0,
      pace: 1.1,
      loudness: 1.5,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "Unknown error");
    throw new Error(`Sarvam API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  if (!data.audios || !data.audios[0]) {
    throw new Error("No audio returned from Sarvam API");
  }

  return data.audios[0]; // base64 encoded WAV
}

export async function POST(req: NextRequest) {
  try {
    const { schemeCode, schemeName } = await req.json();

    if (!schemeCode && !schemeName) {
      return NextResponse.json({ error: "Missing schemeCode or schemeName" }, { status: 400 });
    }

    const code = schemeCode || "";

    // Check cache
    const cacheKey = `audio_${code}`;
    const cached = audioCache.get(cacheKey);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Fetch fund data
    let meta: any = {};
    let navData: any[] = [];

    if (code) {
      const res = await fetch(`https://api.mfapi.in/mf/${code}`);
      const fundData = await res.json();
      meta = fundData?.meta || {};
      navData = fundData?.data || [];
    }

    const latestNav = navData[0]?.nav || "N/A";
    const nav1YAgo = navData.find((_: any, i: number) => i >= 250)?.nav;
    const return1Y = nav1YAgo
      ? (((parseFloat(navData[0]?.nav) - parseFloat(nav1YAgo)) / parseFloat(nav1YAgo)) * 100).toFixed(1)
      : "N/A";
    const nav3MAgo = navData.find((_: any, i: number) => i >= 63)?.nav;
    const return3M = nav3MAgo
      ? (((parseFloat(navData[0]?.nav) - parseFloat(nav3MAgo)) / parseFloat(nav3MAgo)) * 100).toFixed(1)
      : "N/A";
    const fundName = meta?.scheme_name || schemeName || "this fund";
    const category = meta?.scheme_category || "Unknown Category";
    const fundHouse = meta?.fund_house || "Unknown AMC";

    // Generate Hindi roast text via Gemini
    const prompt = `You are Boredfolio — India's most brutally honest mutual fund roast platform. You speak in natural Hindi (Devanagari script) mixed with common English finance terms. Think: a savage stand-up comedian who knows finance, talking to his WhatsApp group.

Generate a savage, funny, data-backed roast of this mutual fund IN HINDI (Devanagari script). The roast MUST:
- Be 2-3 short paragraphs (this will be converted to audio, so keep it under 200 words total)
- Use natural spoken Hindi — the kind you'd hear in a chai stall roast, NOT formal Hindi
- Keep English terms like NAV, returns, expense ratio, fund house as-is (don't translate these)
- Include at least 2 real numbers from the data
- Be funny enough to forward as a WhatsApp voice note
- End with one genuinely useful takeaway in Hindi

Fund: ${fundName}
Category: ${category}
Fund House: ${fundHouse}
Current NAV: ₹${latestNav}
1-Year Return: ${return1Y}%
3-Month Return: ${return3M}%
NAV data points: ${navData.length} days

Format your response as JSON:
{
  "headline": "A 5-8 word savage headline IN HINDI (Devanagari)",
  "roastHindi": "The full Hindi roast text (2-3 paragraphs separated by \\n\\n). Under 200 words.",
  "verdict": "One line Hindi verdict — brutal but fair",
  "shareText": "A WhatsApp-ready Hindi one-liner under 100 chars"
}

Return ONLY the JSON, no markdown fences.`;

    const text = await generateWithRetry(prompt);

    let parsed;
    try {
      const clean = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      parsed = {
        headline: "इस फंड की हालत देखो",
        roastHindi: text,
        verdict: "Fine print पढ़ो भाई।",
        shareText: "तुम्हारे fund की ऐसी roast कभी नहीं सुनी होगी 🔥",
      };
    }

    // Convert Hindi roast to audio via Sarvam TTS
    let audioBase64 = null;
    let audioError = null;
    try {
      audioBase64 = await textToSpeech(parsed.roastHindi.replace(/\n\n/g, ". "));
    } catch (err: any) {
      console.error("Sarvam TTS error:", err.message);
      audioError = err.message;
    }

    const responseData = {
      ...parsed,
      fundName,
      category,
      fundHouse,
      nav: latestNav,
      return1Y,
      schemeCode: code,
      audioBase64,
      audioError,
    };

    // Cache the result
    audioCache.set(cacheKey, { data: responseData, ts: Date.now() });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Audio roast API error:", error);

    const is429 = error?.status === 429 || error?.message?.includes("rate limit") || error?.message?.includes("exhausted");
    if (is429) {
      return NextResponse.json(
        { error: "AI roaster chai break pe hai. Bohot zyada roasts ho gaye aaj! Ek minute mein try karo. ☕" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Roast generate nahi ho payi. API overwhelm ho gaya hamari savagery se. Phir try karo." },
      { status: 500 }
    );
  }
}
