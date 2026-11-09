import test from "node:test";
import assert from "node:assert/strict";
import { ASSETS, ASSET_BY_SYMBOL, byKind } from "./market";
import { series, metricsFor, fmtPrice, fmtPct } from "./market";
import { formatTimeZones, generateMinutePrediction, handleAIModeratorQuery } from "./ai-moderator";

test("Asset Universe has at least 600 instruments with 500+ S&P 500 / Nasdaq stocks", () => {
  assert.ok(ASSETS.length >= 600, `Expected at least 600 assets, found ${ASSETS.length}`);

  const stocks = byKind("stock");
  const cryptos = byKind("crypto");
  const memes = byKind("meme");

  assert.ok(stocks.length >= 500, `Expected >= 500 stocks, got ${stocks.length}`);
  assert.ok(cryptos.length >= 35, `Expected >= 35 cryptos, got ${cryptos.length}`);
  assert.ok(memes.length >= 35, `Expected >= 35 meme coins, got ${memes.length}`);

  // Test S&P 500 & Nasdaq leaders
  assert.ok(ASSET_BY_SYMBOL["NVDA"], "NVDA must exist");
  assert.ok(ASSET_BY_SYMBOL["AAPL"], "AAPL must exist");
  assert.ok(ASSET_BY_SYMBOL["TSLA"], "TSLA must exist");
  assert.ok(ASSET_BY_SYMBOL["PLTR"], "PLTR must exist");
  assert.ok(ASSET_BY_SYMBOL["INTU"], "INTU must exist");
  assert.ok(ASSET_BY_SYMBOL["TXN"], "TXN must exist");
  assert.ok(ASSET_BY_SYMBOL["CAT"], "CAT must exist");
  assert.ok(ASSET_BY_SYMBOL["BKNG"], "BKNG must exist");

  // Test Binance and major cryptos
  assert.ok(ASSET_BY_SYMBOL["BTC"], "BTC must exist");
  assert.ok(ASSET_BY_SYMBOL["SOL"], "SOL must exist");
  assert.ok(ASSET_BY_SYMBOL["BNB"], "BNB must exist");
  assert.ok(ASSET_BY_SYMBOL["SUI"], "SUI must exist");

  // Test pump.fun and viral memes
  assert.ok(ASSET_BY_SYMBOL["FARTCOIN"], "FARTCOIN must exist");
  assert.ok(ASSET_BY_SYMBOL["GOAT"], "GOAT must exist");
  assert.ok(ASSET_BY_SYMBOL["PNUT"], "PNUT must exist");
  assert.ok(ASSET_BY_SYMBOL["MOODENG"], "MOODENG must exist");
});

test("Metrics and series calculation generate non-zero realistic metrics for all asset types", () => {
  for (const sym of ["NVDA", "BTC", "FARTCOIN"]) {
    const asset = ASSET_BY_SYMBOL[sym];
    assert.ok(asset, `Asset ${sym} must exist`);

    const pts = series(asset, 260);
    assert.ok(pts.length >= 30, `Expected series history length >= 30, got ${pts.length}`);

    const m = metricsFor(asset);
    assert.ok(m.last > 0, `Expected positive last price for ${sym}, got ${m.last}`);
    assert.ok(m.rsi >= 0 && m.rsi <= 100, `RSI must be between 0 and 100, got ${m.rsi}`);
    assert.ok(m.score >= 0 && m.score <= 100, `Score must be between 0 and 100, got ${m.score}`);
    assert.ok(m.high52 >= m.low52, `52w high must be >= low for ${sym}`);
  }
});

test("Live timezones format WIB, UTC, and EST properly", () => {
  const times = formatTimeZones();
  assert.ok(times.wibTime && times.wibTime.includes(":"), "WIB time must contain colon");
  assert.ok(times.utcTime && times.utcTime.includes(":"), "UTC time must contain colon");
  assert.ok(times.estTime && times.estTime.includes(":"), "EST time must contain colon");
  assert.ok(times.sessionStatus && times.sessionStatus.length > 0, "Market session must be defined");
});

test("AI Moderator generates valid structured predictions", () => {
  const pred = generateMinutePrediction("SOL");
  assert.equal(pred.symbol, "SOL");
  assert.ok(pred.currentPrice > 0, "Price must be positive");
  assert.ok(pred.target1 > 0, "Target 1 must be positive");
  assert.ok(pred.invalidationLevel > 0, "Invalidation level must be positive");
  assert.ok(pred.confidence >= 50 && pred.confidence <= 100, "Confidence in range");
  assert.ok(pred.technicalMechanism.length > 10, "Technical mechanism explanation provided");
  assert.ok(pred.wibTime.length > 0, "WIB time timestamp provided");
});

test("AI Moderator Query handler answers /predict and Indonesian 'jam' commands", () => {
  const queryPred = handleAIModeratorQuery("/predict FARTCOIN");
  assert.ok(queryPred.prediction, "Prediction must be generated for FARTCOIN");
  assert.equal(queryPred.prediction?.symbol, "FARTCOIN");
  assert.ok(queryPred.reply.includes("Nexus Sentinel AI Analysis"), "Includes analysis header");

  const queryClock = handleAIModeratorQuery("Berapa jam pasar sekarang?");
  assert.ok(queryClock.reply.includes("WIB"), "Clock query must include WIB time");
  assert.ok(queryClock.reply.includes("EST"), "Clock query must include EST time");
});
