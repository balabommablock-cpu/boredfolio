import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SARVAM_API_URL = "https://api.sarvam.ai/text-to-speech";
const SARVAM_API_KEY = process.env.SARVAM_API_KEY || "";

// Cache audio roasts for 1 hour
const audioCache = new Map<string, { data: any; ts: number }>();
const CACHE_TTL = 1000 * 60 * 60;

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

async function generateHindiRoast(fundName: string, category: string, fundHouse: string, nav: string, return1Y: string, return3M: string): Promise<string> {
  const prompt = `You are Boredfolio — India's most brutally honest mutual fund platform. Generate a SHORT Hindi/Hinglish audio roast script for this fund.

CRITICAL RULES:
- Write in natural spoken Hinglish (Hindi + English mix, as Indians actually speak)
- Use Devanagari script for Hindi words, Roman for English words
- Keep it UNDER 200 words (this will be converted to audio, must be under 45 seconds)
- Include 2 real numbers from the data
- Be funny, savage, but not mean to the investor
- Write it as spoken word — no formatting, no bullet points, no special characters
- End with one genuinely useful insight
- Do NOT use any emojis, asterisks, or markdown

Fund: ${fundName}
Category: ${category}
Fund House: ${fundHouse}
Current NAV: ₹${nav}
1-Year Return: ${return1Y}%
3-Month Return: ${return3M}%

Return ONLY the spoken script text, nothing else. No quotes around it.`;

  return generateWithRetry(prompt);
}

async function convertToAudio(text: string): Promise<string> {
  const response = await fetch(SARVAM_API_URL, {
    method: "POST",
    headers: {
      "api-subscription-key": SARVAM_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: text.slice(0, 2500),
      target_language_code: "hi-IN",
      model: "bulbul:v3",
      speaker: "amol",
      pace: 1.1,
      temperature: 0.7,
      speech_sample_rate: "22050",
      output_audio_codec: "mp3",
    }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error("Sarvam TTS error:", response.status, errBody);
    throw new Error(`Sarvam TTS failed: ${response.status}`);
  }

  const data = await response.json();
  // Sarvam returns { audios: ["base64_string"] }
  if (!data.audios || !data.audios[0]) {
    throw new Error("No audio data in Sarvam response");
  }

  return data.audios[0];
}

export async function POST(req: NextRequest) {
  try {
    const { schemeCode, schemeName } = await req.json();

    if (!schemeCode && !schemeName) {
      return NextResponse.json({ error: "Missing schemeCode or schemeName" }, { status: 400 });
    }

    if (!SARVAM_API_KEY) {
      return NextResponse.json(
        { error: "Sarvam TTS is not configured. SARVAM_API_KEY is missing." },
        { status: 503 }
      );
    }

    const code = schemeCode || "";

    // Check cache
    const cacheKey = `audio_${code}`;
    const cached = audioCache.get(cacheKey);
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

    // Generate Hindi roast script
    const roastScript = await generateHindiRoast(fundName, category, fundHouse, latestNav, return1Y, return3M);

    // Convert to audio via Sarvam TTS
    const audioBase64 = await convertToAudio(roastScript);

    const responseData = {
      audioBase64,
      roastScript,
      fundName,
      category,
      fundHouse,
      nav: latestNav,
      return1Y,
      return3M,
      schemeCode: code,
    };

    // Cache it
    audioCache.set(cacheKey, { data: responseData, ts: Date.now() });

    return NextResponse.json(responseData);
  } catch (error: any) {
    console.error("Audio roast API error:", error);

    const is429 = error?.status === 429 || error?.message?.includes("rate limit") || error?.message?.includes("exhausted");
    if (is429) {
      return NextResponse.json(
        { error: "Too many roasts! Our AI is catching its breath. Try again in a minute." },
        { status: 429 }
      );
    }

    const isSarvam = error?.message?.includes("Sarvam");
    if (isSarvam) {
      return NextResponse.json(
        { error: "The voice generator is having a moment. Try again in a few seconds." },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: "Something broke. Our engineers are probably also broken. Try again." },
      { status: 500 }
    );
  }
}
