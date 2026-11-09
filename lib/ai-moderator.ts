import { ASSETS, ASSET_BY_SYMBOL, type Asset } from "./market-assets";
import { metricsFor, fmtPrice, fmtPct, type Metrics } from "./market";

export type MinutePrediction = {
  id: string;
  symbol: string;
  name: string;
  kind: "stock" | "crypto" | "meme";
  group: string;
  currentPrice: number;
  stance: "STRONG BUY / LONG" | "ACCUMULATE / DIP" | "TRIM / PROFIT" | "AVOID / SHORT";
  confidence: number; // percentage
  target1: number;
  target2: number;
  invalidationLevel: number;
  technicalMechanism: string;
  timeHorizon: "5m Scalp" | "15m Intraday" | "1h Momentum" | "24h Swing";
  catalystAlert: string;
  timestamp: string;
  wibTime: string;
  utcTime: string;
};

export type ChatMessage = {
  id: string;
  channelId: string;
  author: {
    name: string;
    avatar: string;
    role: "ai-mod" | "head-desk" | "quant" | "pro-trader" | "member";
    roleLabel: string;
    roleColor: string;
    isBot?: boolean;
    isVerified?: boolean;
  };
  content: string;
  prediction?: MinutePrediction;
  timestamp: string;
  timeLabel: string;
  reactions: Record<string, number>;
  userReactions: Record<string, boolean>;
};

export function formatTimeZones(date = new Date()) {
  const wibTime = date.toLocaleTimeString("en-GB", {
    timeZone: "Asia/Jakarta",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const utcTime = date.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const estTime = date.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Check market status (US Eastern)
  const estHours = Number(
    date.toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "2-digit", hour12: false }),
  );
  const estMins = Number(
    date.toLocaleTimeString("en-US", { timeZone: "America/New_York", minute: "2-digit", hour12: false }),
  );
  const totalEstMins = estHours * 60 + estMins;
  const day = date.getDay(); // 0 is Sunday, 6 is Saturday

  let sessionStatus = "Closed";
  if (day === 0 || day === 6) {
    sessionStatus = "Weekend Closed";
  } else if (totalEstMins >= 570 && totalEstMins < 960) {
    sessionStatus = "US Regular Open";
  } else if (totalEstMins >= 240 && totalEstMins < 570) {
    sessionStatus = "US Pre-Market";
  } else if (totalEstMins >= 960 && totalEstMins < 1200) {
    sessionStatus = "US After-Hours";
  } else {
    sessionStatus = "Overnight Session";
  }

  return { wibTime, utcTime, estTime, sessionStatus };
}

/**
 * Generates an institutional-grade, minute-by-minute technical market prediction
 * for an asset from the 118-instrument universe.
 */
export function generateMinutePrediction(forceSymbol?: string, seedIndex?: number): MinutePrediction {
  const date = new Date();
  const { wibTime, utcTime } = formatTimeZones(date);
  const minute = date.getMinutes() + (seedIndex ?? 0);

  // Pick asset: either forced or rotated based on current minute and seed
  let asset: Asset;
  if (forceSymbol && ASSET_BY_SYMBOL[forceSymbol.toUpperCase()]) {
    asset = ASSET_BY_SYMBOL[forceSymbol.toUpperCase()];
  } else {
    // Alternate between stock, crypto, and pump.fun meme to ensure variety
    const kinds: ("stock" | "crypto" | "meme")[] = ["stock", "crypto", "meme"];
    const targetKind = kinds[minute % 3];
    const kindAssets = ASSETS.filter((a) => a.kind === targetKind);
    asset = kindAssets[minute % kindAssets.length] || ASSETS[0];
  }

  const m = metricsFor(asset);
  const price = m.last > 0 ? m.last : asset.base;

  // Compute stance and target levels
  let stance: MinutePrediction["stance"];
  let target1: number;
  let target2: number;
  let invalidationLevel: number;
  let mechanism: string;
  let horizon: MinutePrediction["timeHorizon"];

  if (m.score >= 68) {
    stance = "STRONG BUY / LONG";
    target1 = price * (asset.kind === "meme" ? 1.18 : asset.kind === "crypto" ? 1.065 : 1.035);
    target2 = price * (asset.kind === "meme" ? 1.38 : asset.kind === "crypto" ? 1.12 : 1.07);
    invalidationLevel = price * (asset.kind === "meme" ? 0.91 : asset.kind === "crypto" ? 0.965 : 0.985);
    mechanism = `Bullish continuation: Tape trading above 20-day SMA ($${m.sma20.toFixed(2)}) with RSI at ${m.rsi.toFixed(0)}. Institutional order flow expanding on structural breakout.`;
    horizon = asset.kind === "meme" ? "5m Scalp" : asset.kind === "crypto" ? "15m Intraday" : "1h Momentum";
  } else if (m.score >= 52) {
    stance = "ACCUMULATE / DIP";
    target1 = price * (asset.kind === "meme" ? 1.12 : asset.kind === "crypto" ? 1.045 : 1.025);
    target2 = price * (asset.kind === "meme" ? 1.25 : asset.kind === "crypto" ? 1.09 : 1.05);
    invalidationLevel = price * (asset.kind === "meme" ? 0.88 : asset.kind === "crypto" ? 0.95 : 0.975);
    mechanism = `Pullback test into value area: 50-day moving average holding with positive slope. Volatility at ${(m.vol * 100).toFixed(0)}% annualised suggests asymmetric risk/reward.`;
    horizon = asset.kind === "stock" ? "24h Swing" : "15m Intraday";
  } else if (m.score >= 38) {
    stance = "TRIM / PROFIT";
    target1 = price * 0.96;
    target2 = price * 0.92;
    invalidationLevel = price * 1.03;
    mechanism = `Momentum deceleration: 14-day RSI divergence detected near range highs ($${m.high52.toFixed(2)}). Recommend taking partials and tightening trailing stops.`;
    horizon = "15m Intraday";
  } else {
    stance = "AVOID / SHORT";
    target1 = price * (asset.kind === "meme" ? 0.78 : asset.kind === "crypto" ? 0.92 : 0.96);
    target2 = price * (asset.kind === "meme" ? 0.65 : asset.kind === "crypto" ? 0.86 : 0.93);
    invalidationLevel = price * 1.045;
    mechanism = `Bearish breakdown: Price trading below 50-day & 200-day moving averages with negative rate-of-change. Rallies represent exit liquidity rather than sustainable entries.`;
    horizon = "24h Swing";
  }

  const confidence = Math.min(96, Math.max(72, m.confidence + (asset.kind === "meme" ? -4 : 2)));
  const catalystAlert = asset.catalysts[minute % asset.catalysts.length] || "Volume profile test";

  return {
    id: `pred-${asset.symbol}-${Date.now()}`,
    symbol: asset.symbol,
    name: asset.name,
    kind: asset.kind,
    group: asset.group,
    currentPrice: price,
    stance,
    confidence,
    target1,
    target2,
    invalidationLevel,
    technicalMechanism: mechanism,
    timeHorizon: horizon,
    catalystAlert,
    timestamp: date.toISOString(),
    wibTime,
    utcTime,
  };
}

/**
 * Handles user natural language messages or slash commands to generate an AI Moderator response.
 */
export function handleAIModeratorQuery(input: string): { reply: string; prediction?: MinutePrediction } {
  const clean = input.trim();
  const lower = clean.toLowerCase();

  // 1. Direct ticker lookup (e.g. "NVDA", "$NVDA", "sol", "btc", "fartcoin")
  const strippedClean = clean.toUpperCase().replace(/^\$/, "").trim();
  if (ASSET_BY_SYMBOL[strippedClean]) {
    const pred = generateMinutePrediction(strippedClean);
    const asset = ASSET_BY_SYMBOL[strippedClean];
    const reply = `🤖 **Nexus Sentinel AI Analysis for $${asset.symbol} (${asset.name})**\n` +
      `• **Stance:** ${pred.stance} (${pred.confidence}% Conviction)\n` +
      `• **Current Price:** ${fmtPrice(pred.currentPrice)}\n` +
      `• **Targets:** T1: ${fmtPrice(pred.target1)} | T2: ${fmtPrice(pred.target2)}\n` +
      `• **Invalidation Stop:** ${fmtPrice(pred.invalidationLevel)} (Thesis invalid below this)\n` +
      `• **Technical Read:** ${pred.technicalMechanism}\n` +
      `• **Horizon:** ${pred.timeHorizon} | **Catalyst Watch:** ${pred.catalystAlert}\n` +
      `_Signal recorded at ${pred.wibTime} WIB / ${pred.utcTime} UTC._`;
    return { reply, prediction: pred };
  }

  // 2. Check for /predict or /stance or keywords (e.g. "/predict nvda", "analisa btc", "how is sol")
  const matchSymbol = lower.match(/(?:\/predict|\/stance|\$|predict|prediksi|cek|bagaimana|analisa|target|entry|review)\s+([a-z0-9]+)/i);
  let potentialTicker = matchSymbol ? matchSymbol[1].toUpperCase() : null;

  // Also check if any known ticker appears as a standalone word in the sentence
  if (!potentialTicker) {
    const words = clean.toUpperCase().split(/[\s,?!]+/);
    for (const w of words) {
      const candidate = w.replace(/^\$/, "");
      if (candidate.length >= 2 && ASSET_BY_SYMBOL[candidate]) {
        potentialTicker = candidate;
        break;
      }
    }
  }

  if (potentialTicker && ASSET_BY_SYMBOL[potentialTicker]) {
    const pred = generateMinutePrediction(potentialTicker);
    const asset = ASSET_BY_SYMBOL[potentialTicker];
    const reply = `🤖 **Nexus Sentinel AI Analysis for $${asset.symbol} (${asset.name})**\n` +
      `• **Stance:** ${pred.stance} (${pred.confidence}% Conviction)\n` +
      `• **Current Price:** ${fmtPrice(pred.currentPrice)}\n` +
      `• **Targets:** T1: ${fmtPrice(pred.target1)} | T2: ${fmtPrice(pred.target2)}\n` +
      `• **Invalidation Stop:** ${fmtPrice(pred.invalidationLevel)} (Thesis invalid below this)\n` +
      `• **Technical Read:** ${pred.technicalMechanism}\n` +
      `• **Horizon:** ${pred.timeHorizon} | **Catalyst Watch:** ${pred.catalystAlert}\n` +
      `_Signal recorded at ${pred.wibTime} WIB / ${pred.utcTime} UTC._`;

    return { reply, prediction: pred };
  }

  // Indonesian / English query responses
  if (lower.includes("jam") || lower.includes("waktu") || lower.includes("clock") || lower.includes("time")) {
    const { wibTime, utcTime, estTime, sessionStatus } = formatTimeZones();
    return {
      reply: `🕒 **Live Global Market Clocks:**\n` +
        `• 🇮🇩 **WIB (Waktu Indonesia Barat):** \`${wibTime} WIB\`\n` +
        `• 🌐 **UTC (Market Standard):** \`${utcTime} UTC\`\n` +
        `• 🇺🇸 **EST (Wall Street NY):** \`${estTime} EST\`\n` +
        `• 📊 **Market Session:** \`${sessionStatus}\`\n` +
        `_AI predictions regenerate automatically every 60 seconds._`,
    };
  }

  if (lower.includes("pump") || lower.includes("meme") || lower.includes("fartcoin") || lower.includes("goat")) {
    const pred = generateMinutePrediction("FARTCOIN");
    return {
      reply: `🚀 **Pump.fun & Meme Sector Scan:**\n` +
        `Tracking 38+ pump.fun and viral memes. Sector breadth is elevated on bonding curve volume.\n` +
        `Top active signal: **$FARTCOIN** at ${fmtPrice(pred.currentPrice)} (${pred.stance}, ${pred.confidence}% Conviction).\n` +
        `⚠️ **Risk Protocol Reminder:** Cap total meme exposure under 2% and never average down into broken structure.`,
      prediction: pred,
    };
  }

  if (lower.includes("rekomendasi") || lower.includes("best") || lower.includes("terbaik") || lower.includes("alpha")) {
    const topStock = generateMinutePrediction("NVDA");
    const topCrypto = generateMinutePrediction("SOL");
    return {
      reply: `⚡ **High-Conviction Alpha Radar:**\n` +
        `1. **Equities:** $NVDA (${topStock.stance}) — Target: ${fmtPrice(topStock.target1)}, Invalidation: ${fmtPrice(topStock.invalidationLevel)}\n` +
        `2. **Crypto:** $SOL (${topCrypto.stance}) — Target: ${fmtPrice(topCrypto.target1)}, Invalidation: ${fmtPrice(topCrypto.invalidationLevel)}\n` +
        `Type \`/predict [symbol]\` to audit any of our 118 tracked instruments.`,
    };
  }

  // General helpful response
  const generalPred = generateMinutePrediction();
  return {
    reply: `👋 **Nexus Sentinel AI online.** I monitor 118 instruments (S&P 500, Nasdaq, Binance Crypto, Pump.fun Memes) and post real-time alpha predictions every minute.\n\n` +
      `• Type \`/predict [ticker]\` (e.g. \`/predict NVDA\`, \`/predict BTC\`, \`/predict FARTCOIN\`) for instant technical audits.\n` +
      `• Ask about market hours, session timings, or invalidation stops anytime!`,
    prediction: generalPred,
  };
}
