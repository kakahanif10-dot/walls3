import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { handleAIModeratorQuery, generateMinutePrediction } from "@/lib/ai-moderator";

export async function POST(req: NextRequest) {
  try {
    const { message, symbol, action } = await req.json();

    if (action === "minute-prediction") {
      const prediction = generateMinutePrediction(symbol);
      return NextResponse.json({ prediction });
    }

    const fallbackResult = handleAIModeratorQuery(message || "");

    // If GEMINI_API_KEY is available, we can enhance the explanation
    if (process.env.GEMINI_API_KEY && message) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const prompt = `You are "Nexus Sentinel AI", an institutional quantitative market moderator in a Discord-like trading room.
You analyze stocks (S&P 500, Nasdaq), crypto (Binance), and pump.fun meme coins.
Current user inquiry: "${message}"
Base algorithmic stance data:
${JSON.stringify(fallbackResult.prediction || {})}

Provide a sharp, 2-to-3-bullet professional trader analysis with:
1. Direct Stance (Buy/Accumulate/Trim/Avoid) & Conviction.
2. Invalidation Level & Profit Target.
3. Concise technical mechanism (RSI, moving averages, order book float).
Keep formatting clean with bold text and emojis (like in Discord). Avoid generic disclaimers. Indonesian or English matching the user language.`;

        const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500));
        const geminiPromise = ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
        }).catch(() => null);

        const response: any = await Promise.race([geminiPromise, timeoutPromise]);

        if (response && response.text) {
          return NextResponse.json({
            reply: response.text,
            prediction: fallbackResult.prediction,
          });
        }
      } catch {
        // Fallback gracefully to algorithmic response
      }
    }

    return NextResponse.json({
      reply: fallbackResult.reply,
      prediction: fallbackResult.prediction,
    });
  } catch (err: any) {
    const fallback = generateMinutePrediction();
    return NextResponse.json({
      reply: `Nexus Sentinel AI active: ${fallback.stance} signal on $${fallback.symbol} at ${fallback.wibTime} WIB.`,
      prediction: fallback,
    });
  }
}
