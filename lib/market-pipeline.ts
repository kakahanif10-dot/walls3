import "server-only";

import { ASSETS, type Asset, type Kind, type Point, type Metrics, metricsFor, scoreBreakdown, setMarketData, type FeedQuote } from "@/lib/market";

export type ProviderStatus = {
  name: string;
  endpoint: string;
  status: "connected" | "degraded" | "standby";
  latencyMs: number;
  assetsFetched: number;
  lastSync: string;
};

export type PipelineMetrics = {
  totalAssets: number;
  stocksCount: number;
  cryptoCount: number;
  memeCount: number;
  breadthScore: number; // % names scoring >= 60
  medianScoreStock: number;
  medianScoreCrypto: number;
  medianScoreMeme: number;
  lastSyncTime: string;
  executionDurationMs: number;
  providers: ProviderStatus[];
};

export type ScoredAssetItem = {
  symbol: string;
  name: string;
  kind: Kind;
  group: string;
  price: number;
  change24h: number;
  change30d: number;
  score: number;
  stance: Metrics["stance"];
  riskGrade: Metrics["riskGrade"];
  volatility: number;
  invalidationLevel: number;
  provider: string;
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";
const STOCK_HEADERS = {
  "User-Agent": UA,
  Accept: "application/json",
  Origin: "https://www.nasdaq.com",
  Referer: "https://www.nasdaq.com/",
};

// Global in-memory pipeline state cache
let lastPipelineRun: {
  metrics: PipelineMetrics;
  scoredAssets: ScoredAssetItem[];
  quotes: Record<string, FeedQuote>;
  timestamp: number;
} | null = null;

let isPipelineRunning = false;

/* --------------------------------------------------------------------------
   API INGESTION: BINANCE BULK TICKER (Sub-second bulk for 1000+ crypto pairs)
   -------------------------------------------------------------------------- */
async function ingestBinanceBulk(): Promise<{ quotes: Record<string, FeedQuote>; latency: number }> {
  const start = performance.now();
  const quotes: Record<string, FeedQuote> = {};
  try {
    const res = await fetch("https://api.binance.com/api/v3/ticker/24hr", {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 30 },
    });

    if (!res.ok) throw new Error(`Binance returned ${res.status}`);
    const data = (await res.json()) as Array<{
      symbol: string;
      lastPrice: string;
      prevClosePrice: string;
      priceChangePercent: string;
      openPrice: string;
    }>;

    const binanceMap = new Map<string, { price: number; prevClose: number; change: number }>();
    for (const item of data) {
      if (item.symbol.endsWith("USDT") || item.symbol.endsWith("USD")) {
        const base = item.symbol.replace(/USDT$|USD$/, "");
        const price = Number(item.lastPrice);
        const prev = Number(item.prevClosePrice) || Number(item.openPrice) || price;
        const change = Number(item.priceChangePercent) / 100;
        if (price > 0) {
          binanceMap.set(base, { price, prevClose: prev, change });
        }
      }
    }

    const now = new Date().toISOString();
    for (const asset of ASSETS) {
      if (asset.kind !== "stock" && binanceMap.has(asset.symbol)) {
        const b = binanceMap.get(asset.symbol)!;
        quotes[asset.symbol] = {
          price: b.price,
          previousClose: b.prevClose,
          change: b.change,
          delayed: false,
          asOf: now,
          provider: "Binance",
        };
      }
    }
  } catch (err) {
    console.warn("Binance bulk ingestion fallback:", err);
  }

  return { quotes, latency: Math.round(performance.now() - start) };
}

/* --------------------------------------------------------------------------
   API INGESTION: COINBASE (Institutional spot stats)
   -------------------------------------------------------------------------- */
async function ingestCoinbaseTop(symbols: string[]): Promise<{ quotes: Record<string, FeedQuote>; latency: number }> {
  const start = performance.now();
  const quotes: Record<string, FeedQuote> = {};
  const now = new Date().toISOString();

  // Run in parallel for selected institutional benchmark symbols
  const tasks = symbols.slice(0, 10).map(async (symbol) => {
    try {
      const res = await fetch(`https://api.exchange.coinbase.com/products/${symbol}-USD/stats`, {
        headers: { "User-Agent": UA },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 30 },
      });
      if (!res.ok) return;
      const data = await res.json();
      const price = Number(data.last);
      const open = Number(data.open) || price;
      if (price > 0) {
        quotes[symbol] = {
          price,
          previousClose: open,
          change: open > 0 ? price / open - 1 : 0,
          delayed: false,
          asOf: now,
          provider: "Coinbase",
        };
      }
    } catch {
      // ignore
    }
  });

  await Promise.all(tasks);
  return { quotes, latency: Math.round(performance.now() - start) };
}

/* --------------------------------------------------------------------------
   API INGESTION: OKX SPOT TICKERS (Alternative venue & meme tokens)
   -------------------------------------------------------------------------- */
async function ingestOkxSpot(): Promise<{ quotes: Record<string, FeedQuote>; latency: number }> {
  const start = performance.now();
  const quotes: Record<string, FeedQuote> = {};
  const now = new Date().toISOString();

  try {
    const res = await fetch("https://www.okx.com/api/v5/market/tickers?instType=SPOT", {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 30 },
    });
    if (res.ok) {
      const body = await res.json();
      for (const row of body.data ?? []) {
        const instId: string = row.instId || "";
        if (instId.endsWith("-USDT")) {
          const sym = instId.replace("-USDT", "");
          const price = Number(row.last);
          const open24h = Number(row.open24h) || price;
          if (price > 0) {
            quotes[sym] = {
              price,
              previousClose: open24h,
              change: open24h > 0 ? price / open24h - 1 : 0,
              delayed: false,
              asOf: now,
              provider: "OKX",
            };
          }
        }
      }
    }
  } catch (err) {
    console.warn("OKX spot ingestion fallback:", err);
  }

  return { quotes, latency: Math.round(performance.now() - start) };
}

/* --------------------------------------------------------------------------
   API INGESTION: NASDAQ EQUITIES (US Large-Cap & Index Leaders)
   -------------------------------------------------------------------------- */
async function ingestNasdaqLeaders(symbols: string[]): Promise<{ quotes: Record<string, FeedQuote>; latency: number }> {
  const start = performance.now();
  const quotes: Record<string, FeedQuote> = {};
  const now = new Date().toISOString();

  // Take top benchmark equity leaders
  const targetSymbols = symbols.slice(0, 15);
  const tasks = targetSymbols.map(async (sym) => {
    try {
      const res = await fetch(`https://api.nasdaq.com/api/quote/${sym}/info?assetclass=stocks`, {
        headers: STOCK_HEADERS,
        signal: AbortSignal.timeout(5000),
        next: { revalidate: 60 },
      });
      if (!res.ok) return;
      const json = await res.json();
      const primary = json.data?.primaryData;
      if (!primary?.lastSalePrice) return;
      const rawPrice = Number(primary.lastSalePrice.replace(/[$,\s]/g, ""));
      const rawChange = Number(primary.netChange?.replace(/[$,\s]/g, "")) || 0;
      if (rawPrice > 0) {
        const prev = rawPrice - rawChange;
        quotes[sym] = {
          price: rawPrice,
          previousClose: prev > 0 ? prev : rawPrice,
          change: prev > 0 ? rawPrice / prev - 1 : 0,
          delayed: primary.isRealTime !== true,
          asOf: now,
          provider: "Nasdaq",
        };
      }
    } catch {
      // ignore
    }
  });

  await Promise.all(tasks);
  return { quotes, latency: Math.round(performance.now() - start) };
}

/* --------------------------------------------------------------------------
   CORE PIPELINE EXECUTION & ALGORITHMIC SCORING ENGINE (2,000+ ASSETS)
   -------------------------------------------------------------------------- */
export async function runFullMarketPipeline(force = false): Promise<{
  metrics: PipelineMetrics;
  scoredAssets: ScoredAssetItem[];
}> {
  // Return cached result if fresh (< 45s) and not forced
  if (!force && lastPipelineRun && Date.now() - lastPipelineRun.timestamp < 45_000) {
    return {
      metrics: lastPipelineRun.metrics,
      scoredAssets: lastPipelineRun.scoredAssets,
    };
  }

  if (isPipelineRunning && lastPipelineRun) {
    return {
      metrics: lastPipelineRun.metrics,
      scoredAssets: lastPipelineRun.scoredAssets,
    };
  }

  isPipelineRunning = true;
  const pipelineStartTime = performance.now();

  try {
    const stockLeaders = ["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA", "SPY", "QQQ", "AMD", "AVGO", "NFLX"];
    const cryptoLeaders = ["BTC", "ETH", "SOL", "BNB", "AVAX", "LINK", "DOGE", "SUI", "NEAR", "PEPE"];

    // 1. Fetch real market endpoints concurrently
    const [binanceRes, coinbaseRes, okxRes, nasdaqRes] = await Promise.all([
      ingestBinanceBulk(),
      ingestCoinbaseTop(cryptoLeaders),
      ingestOkxSpot(),
      ingestNasdaqLeaders(stockLeaders),
    ]);

    // Merge quotes in hierarchy: Coinbase (institutional crypto) > OKX > Binance > Nasdaq
    const aggregatedQuotes: Record<string, FeedQuote> = {
      ...binanceRes.quotes,
      ...okxRes.quotes,
      ...coinbaseRes.quotes,
      ...nasdaqRes.quotes,
    };

    // Hydrate market data
    setMarketData({}, aggregatedQuotes);

    // 2. Execute quantitative scoring algorithm across all 2,038 assets
    const scoredList: ScoredAssetItem[] = [];
    const stockScores: number[] = [];
    const cryptoScores: number[] = [];
    const memeScores: number[] = [];
    let highTrendCount = 0;

    for (const asset of ASSETS) {
      const m = metricsFor(asset);
      const invalidationLevel =
        m.score >= 47
          ? Math.min(m.sma20, m.sma50) * 0.975
          : Math.max(m.sma20, m.sma50) * 1.02;

      const provider = aggregatedQuotes[asset.symbol]?.provider || (asset.kind === "stock" ? "Nasdaq (Model)" : "Coinbase (Model)");

      scoredList.push({
        symbol: asset.symbol,
        name: asset.name,
        kind: asset.kind,
        group: asset.group,
        price: m.last,
        change24h: m.change24h,
        change30d: m.change30d,
        score: m.score,
        stance: m.stance,
        riskGrade: m.riskGrade,
        volatility: Math.round(m.vol * 1000) / 10,
        invalidationLevel: Math.round(invalidationLevel * 1000) / 1000,
        provider,
      });

      if (m.score >= 60) highTrendCount++;

      if (asset.kind === "stock") stockScores.push(m.score);
      else if (asset.kind === "crypto") cryptoScores.push(m.score);
      else memeScores.push(m.score);
    }

    // Sort descending by score
    scoredList.sort((a, b) => b.score - a.score);

    // 3. Compute Macro & Breadth Metrics
    const calcMedian = (arr: number[]) => {
      if (!arr.length) return 50;
      const sorted = [...arr].sort((a, b) => a - b);
      return sorted[Math.floor(sorted.length / 2)];
    };

    const executionDurationMs = Math.round(performance.now() - pipelineStartTime);
    const nowIso = new Date().toISOString();

    const providerTelemetry: ProviderStatus[] = [
      {
        name: "Nasdaq Market Data API",
        endpoint: "api.nasdaq.com",
        status: Object.keys(nasdaqRes.quotes).length > 0 ? "connected" : "standby",
        latencyMs: nasdaqRes.latency,
        assetsFetched: Object.keys(nasdaqRes.quotes).length,
        lastSync: nowIso,
      },
      {
        name: "Coinbase Exchange API",
        endpoint: "api.exchange.coinbase.com",
        status: Object.keys(coinbaseRes.quotes).length > 0 ? "connected" : "standby",
        latencyMs: coinbaseRes.latency,
        assetsFetched: Object.keys(coinbaseRes.quotes).length,
        lastSync: nowIso,
      },
      {
        name: "Binance Spot Tickers API",
        endpoint: "api.binance.com",
        status: Object.keys(binanceRes.quotes).length > 0 ? "connected" : "standby",
        latencyMs: binanceRes.latency,
        assetsFetched: Object.keys(binanceRes.quotes).length,
        lastSync: nowIso,
      },
      {
        name: "OKX Spot Market API",
        endpoint: "www.okx.com",
        status: Object.keys(okxRes.quotes).length > 0 ? "connected" : "standby",
        latencyMs: okxRes.latency,
        assetsFetched: Object.keys(okxRes.quotes).length,
        lastSync: nowIso,
      },
    ];

    const pipelineMetrics: PipelineMetrics = {
      totalAssets: scoredList.length,
      stocksCount: stockScores.length,
      cryptoCount: cryptoScores.length,
      memeCount: memeScores.length,
      breadthScore: Math.round((highTrendCount / scoredList.length) * 100),
      medianScoreStock: calcMedian(stockScores),
      medianScoreCrypto: calcMedian(cryptoScores),
      medianScoreMeme: calcMedian(memeScores),
      lastSyncTime: nowIso,
      executionDurationMs,
      providers: providerTelemetry,
    };

    lastPipelineRun = {
      metrics: pipelineMetrics,
      scoredAssets: scoredList,
      quotes: aggregatedQuotes,
      timestamp: Date.now(),
    };

    return {
      metrics: pipelineMetrics,
      scoredAssets: scoredList,
    };
  } finally {
    isPipelineRunning = false;
  }
}

export function getCachedPipeline() {
  return lastPipelineRun;
}

export function getAssetDetailedBreakdown(symbol: string) {
  const asset = ASSETS.find((a) => a.symbol.toUpperCase() === symbol.toUpperCase());
  if (!asset) return null;
  const m = metricsFor(asset);
  const breakdown = scoreBreakdown(m);
  const invalidationLevel =
    m.score >= 47
      ? Math.min(m.sma20, m.sma50) * 0.975
      : Math.max(m.sma20, m.sma50) * 1.02;

  return {
    asset,
    metrics: m,
    breakdown,
    invalidationLevel,
  };
}
