"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Activity,
  Globe,
  Clock,
  Bell,
  Search,
  ExternalLink,
  Plus,
  X,
  Check,
  ChevronRight,
  ShieldCheck,
  BarChart3,
  Layers,
  Sparkles,
  MessageSquare,
  Share2,
  Vote,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  OPENSTOCK_GLOBAL_MARKETS,
  OPENSTOCK_SECTORS,
  INITIAL_OPENSTOCK_ALERTS,
  getSocialSentimentFor,
  type GlobalMarketRegion,
  type OpenStockAlert,
  type SocialSentimentRadar,
} from "@/lib/openstock-platform";
import { ASSETS, ASSET_BY_SYMBOL, fmtPrice, fmtPct, metricsFor, series, stanceColor } from "@/lib/market";
import WhopBadge from "@/components/whop-badge";
import TrendChart from "@/components/trend-chart";

function getAssetPrice(symbol: string, fallback = 187.4): number {
  const asset = ASSET_BY_SYMBOL[symbol];
  if (!asset) return fallback;
  return metricsFor(asset).last;
}

export default function OpenStockHub() {
  // Selected Region for Market Pulse
  const [selectedRegionId, setSelectedRegionId] = useState<string>("us");
  const currentRegion =
    OPENSTOCK_GLOBAL_MARKETS.find((r) => r.id === selectedRegionId) || OPENSTOCK_GLOBAL_MARKETS[0];

  // Multi-Tab Stock Browser
  const [openTabs, setOpenTabs] = useState<string[]>(["NVDA", "AAPL", "BTC", "SOL"]);
  const [activeTabSymbol, setActiveTabSymbol] = useState<string>("NVDA");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Technical Indicators on Chart
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);

  // Price Alerts Manager
  const [alerts, setAlerts] = useState<OpenStockAlert[]>(INITIAL_OPENSTOCK_ALERTS);
  const [newAlertSymbol, setNewAlertSymbol] = useState("NVDA");
  const [newAlertTarget, setNewAlertTarget] = useState("200");
  const [newAlertDirection, setNewAlertDirection] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [alertSuccess, setAlertSuccess] = useState<string | null>(null);

  // Active Stock Details
  const activeAsset = ASSET_BY_SYMBOL[activeTabSymbol] || ASSETS[0];
  const activeMetrics = metricsFor(activeAsset);
  const activeSentiment: SocialSentimentRadar = getSocialSentimentFor(activeTabSymbol);
  const activeSeries = series(activeAsset);

  // Add stock to tabs
  const handleAddTab = (symbol: string) => {
    const sym = symbol.toUpperCase().trim();
    if (!openTabs.includes(sym)) {
      setOpenTabs((prev) => [...prev, sym]);
    }
    setActiveTabSymbol(sym);
    setSearchQuery("");
  };

  const handleCloseTab = (e: React.MouseEvent, symbol: string) => {
    e.stopPropagation();
    if (openTabs.length <= 1) return; // Keep at least one tab
    const filtered = openTabs.filter((t) => t !== symbol);
    setOpenTabs(filtered);
    if (activeTabSymbol === symbol) {
      setActiveTabSymbol(filtered[0]);
    }
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newAlertTarget);
    if (!target || isNaN(target)) return;

    const cur = getAssetPrice(newAlertSymbol);
    const newAlert: OpenStockAlert = {
      id: `alt-${Date.now()}`,
      symbol: newAlertSymbol,
      targetPrice: target,
      direction: newAlertDirection,
      currentPrice: cur,
      triggered: newAlertDirection === "ABOVE" ? cur >= target : cur <= target,
      createdAt: "Just now",
    };

    setAlerts((prev) => [newAlert, ...prev]);
    setAlertSuccess(`Alert armed for $${newAlertSymbol} ${newAlertDirection} $${target}`);
    setTimeout(() => setAlertSuccess(null), 3000);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Top OpenStock Branding & Hero Card */}
      <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-[#03140c] via-[#051c11] to-[#020d08] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-emerald-900/40 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-emerald-300">
                <Globe className="h-3.5 w-3.5 text-emerald-400" />
                OPENSTOCK · 9 GLOBAL MARKETS
              </span>
              <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                Forever Open Source · AGPL-3.0
              </span>
              <WhopBadge size="xs" />
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-display text-white font-bold tracking-tight flex items-center gap-2">
              <span>OpenStock Market Platform</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed">
              Integrated from the official open-source repository{" "}
              <a
                href="https://github.com/Open-Dev-Society/OpenStock"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1 font-bold"
              >
                Open-Dev-Society/OpenStock <ExternalLink className="h-3 w-3" />
              </a>
              {" "}&middot; Live demo at{" "}
              <a
                href="https://openstock-ods.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                openstock-ods.vercel.app <ExternalLink className="h-3 w-3" />
              </a>
              . Markets minus the paywall: 9 global exchange hubs (US, India, Germany, Canada, Australia, Saudi Arabia, Poland, Crypto, Forex), browser-style multi-tab ticker exploration, social sentiment radar (Reddit, X, Polymarket), and personalized price alerts.
            </p>
          </div>

          {/* Quick World Market Hours Dial */}
          <div className="rounded-xl border border-emerald-500/30 bg-[#062416]/80 p-4 max-w-md w-full shrink-0 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
              <span className="text-stone-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                Active Region:
              </span>
              <span className="text-emerald-300 font-bold flex items-center gap-1">
                <span>{currentRegion.flag}</span>
                <span>{currentRegion.name}</span>
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Market Status:</span>
              <span
                className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                  currentRegion.status === "OPEN"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-stone-800 text-stone-400"
                }`}
              >
                {currentRegion.status}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Primary Index:</span>
              <span className="text-white font-bold">
                {currentRegion.primaryIndex} ({currentRegion.indexValue.toLocaleString()})
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Session Hours:</span>
              <span className="text-emerald-300">
                {currentRegion.openTimeUTC} &ndash; {currentRegion.closeTimeUTC} UTC
              </span>
            </div>
          </div>
        </div>

        {/* 9 Global Markets Selector Bar */}
        <div className="mt-6 flex flex-wrap gap-2">
          {OPENSTOCK_GLOBAL_MARKETS.map((region) => {
            const isSelected = region.id === selectedRegionId;
            return (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-mono transition-all ${
                  isSelected
                    ? "bg-emerald-500 text-stone-950 font-bold shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800"
                }`}
              >
                <span className="text-base">{region.flag}</span>
                <span>{region.name}</span>
                <span
                  className={`text-[9px] px-1 rounded ${
                    region.indexChangePct >= 0
                      ? isSelected
                        ? "bg-stone-950 text-emerald-400"
                        : "text-emerald-400"
                      : isSelected
                      ? "bg-stone-950 text-red-400"
                      : "text-red-400"
                  }`}
                >
                  {region.indexChangePct >= 0 ? "+" : ""}
                  {region.indexChangePct}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MULTI-TAB STOCK WORKSPACE (Signature OpenStock Feature) */}
      <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 shadow-2xl space-y-6">
        {/* Browser-style Tab Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
            {openTabs.map((sym) => {
              const isActive = sym === activeTabSymbol;
              const a = ASSET_BY_SYMBOL[sym];
              const p = a ? metricsFor(a).last : 187.4;
              return (
                <div
                  key={sym}
                  onClick={() => setActiveTabSymbol(sym)}
                  className={`group flex items-center gap-2 rounded-lg px-3 py-1.5 font-mono text-xs cursor-pointer transition ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-sm"
                      : "bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800"
                  }`}
                >
                  <span className="font-bold">${sym}</span>
                  <span className="text-[11px] text-stone-400">{fmtPrice(p)}</span>
                  {openTabs.length > 1 && (
                    <button
                      onClick={(e) => handleCloseTab(e, sym)}
                      className="opacity-60 hover:opacity-100 hover:text-red-400 transition"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* Search bar to open new stock tab */}
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim()) {
                  handleAddTab(searchQuery);
                }
              }}
              placeholder="Search ticker (e.g. TSLA, MSFT, GOOGL)..."
              className="w-full rounded-xl border border-stone-800 bg-stone-900 py-1.5 pl-9 pr-8 text-xs text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => handleAddTab(searchQuery)}
                className="absolute right-2 top-1.5 text-emerald-400 hover:text-emerald-300 text-xs font-mono font-bold"
              >
                +
              </button>
            )}
          </div>
        </div>

        {/* Active Stock Overview Panel */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-3xl font-bold text-white">${activeAsset.symbol}</h3>
              <span className="text-lg text-stone-300 font-medium">{activeAsset.name}</span>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${stanceColor(
                  activeMetrics.stance
                )}`}
              >
                {activeMetrics.stance}
              </span>
              <span className="rounded-full border border-stone-800 bg-stone-900 px-2.5 py-0.5 text-[11px] text-stone-400 font-mono">
                {activeAsset.group}
              </span>
            </div>
            <p className="mt-2 text-xs text-stone-400 max-w-2xl leading-relaxed">
              {activeAsset.blurb}
            </p>
          </div>

          {/* Live Price Block */}
          <div className="text-left lg:text-right font-mono">
            <div className="text-3xl font-bold text-white">{fmtPrice(activeMetrics.last)}</div>
            <div
              className={`mt-1 text-sm font-bold flex items-center gap-1 lg:justify-end ${
                activeMetrics.change24h >= 0 ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {activeMetrics.change24h >= 0 ? (
                <ArrowUpRight className="h-4 w-4" />
              ) : (
                <ArrowDownRight className="h-4 w-4" />
              )}
              <span>{fmtPct(activeMetrics.change24h)} today</span>
            </div>
            <div className="mt-1 text-[11px] text-stone-500">
              52W Range: {fmtPrice(activeMetrics.low52)} &ndash; {fmtPrice(activeMetrics.high52)}
            </div>
          </div>
        </div>

        {/* Technical Indicators Toggle Strip & Chart */}
        <div className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-800/80 pb-3">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-400">
              <span>Technical Overlays:</span>
              <button
                onClick={() => setShowSMA20(!showSMA20)}
                className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition ${
                  showSMA20
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "bg-stone-800 text-stone-500"
                }`}
              >
                20-SMA (${activeMetrics.sma20.toFixed(2)})
              </button>
              <button
                onClick={() => setShowSMA50(!showSMA50)}
                className={`rounded px-2.5 py-0.5 text-[11px] font-bold transition ${
                  showSMA50
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-stone-800 text-stone-500"
                }`}
              >
                50-SMA (${activeMetrics.sma50.toFixed(2)})
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-stone-400">
              <span>
                RSI (14D):{" "}
                <strong
                  className={
                    activeMetrics.rsi > 70
                      ? "text-red-400"
                      : activeMetrics.rsi < 30
                      ? "text-emerald-400"
                      : "text-amber-400"
                  }
                >
                  {activeMetrics.rsi.toFixed(1)}
                </strong>
              </span>
              <span>&middot;</span>
              <span>
                Realized Vol:{" "}
                <strong className="text-white">{(activeMetrics.vol * 100).toFixed(1)}%</strong>
              </span>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="h-64 w-full">
            <TrendChart
              values={activeSeries.map((s) => s.close)}
              label={`${activeAsset.symbol} · Daily Close History`}
            />
          </div>
        </div>

        {/* 4-Column Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5">
            <span className="text-stone-400 text-[10px] uppercase">Trend Score</span>
            <p className="mt-1 text-xl font-bold text-emerald-400">{activeMetrics.score} / 100</p>
            <span className="text-[10px] text-stone-500">Quantitative composite</span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5">
            <span className="text-stone-400 text-[10px] uppercase">Technical Invalidation</span>
            <p className="mt-1 text-xl font-bold text-amber-400">
              ${(Math.min(activeMetrics.sma20, activeMetrics.sma50) * 0.975).toFixed(2)}
            </p>
            <span className="text-[10px] text-stone-500">Thesis stop-loss</span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5">
            <span className="text-stone-400 text-[10px] uppercase">Risk Grade</span>
            <p className="mt-1 text-xl font-bold text-stone-200">{activeMetrics.riskGrade}</p>
            <span className="text-[10px] text-stone-500">Vol-scaled sizing</span>
          </div>
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5">
            <span className="text-stone-400 text-[10px] uppercase">200-Day Structural SMA</span>
            <p className="mt-1 text-xl font-bold text-white">${activeMetrics.sma200.toFixed(2)}</p>
            <span className="text-[10px] text-stone-500">
              {activeMetrics.last > activeMetrics.sma200 ? "Above 200-SMA" : "Below 200-SMA"}
            </span>
          </div>
        </div>
      </div>

      {/* SOCIAL SENTIMENT RADAR & SECTOR HEATMAP */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1.6fr]">
        {/* Social Sentiment Radar (Reddit, X, Polymarket) */}
        <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-5">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                Social Sentiment Radar: ${activeAsset.symbol}
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Real-time scraping across Reddit, X (FinTwit), News &amp; Polymarket
              </p>
            </div>
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                activeSentiment.sentimentBand === "Very Bullish" ||
                activeSentiment.sentimentBand === "Bullish"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              {activeSentiment.sentimentBand}
            </span>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* Reddit Stream */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-orange-400" />
                  Reddit (r/WallStreetBets &amp; r/Stocks)
                </span>
                <span className="text-emerald-400 font-bold">
                  {activeSentiment.redditBullishPct}% Bullish
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-orange-400"
                  style={{ width: `${activeSentiment.redditBullishPct}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400">
                {activeSentiment.redditMentions24h.toLocaleString()} mentions indexed in the past 24 hours
              </span>
            </div>

            {/* X (Twitter) Stream */}
            <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-cyan-400" />
                  X (FinTwit Order Flow)
                </span>
                <span className="text-emerald-400 font-bold">
                  {activeSentiment.xBullishPct}% Bullish
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-cyan-400"
                  style={{ width: `${activeSentiment.xBullishPct}%` }}
                />
              </div>
              <span className="text-[11px] text-stone-400">
                {activeSentiment.xPosts24h.toLocaleString()} posts parsed across retail &amp; prop desks
              </span>
            </div>

            {/* Polymarket Prediction Contract */}
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                  <Vote className="h-3.5 w-3.5 text-emerald-400" />
                  Polymarket Crowd Probability
                </span>
                <span className="text-emerald-400 font-extrabold text-sm">
                  {activeSentiment.polymarketProbabilityPct}% YES
                </span>
              </div>
              <p className="text-stone-300 text-xs italic">
                &ldquo;{activeSentiment.polymarketQuestion}&rdquo;
              </p>
              <span className="text-[10px] text-stone-400 block pt-1">
                Prediction market probability derived from decentralized staked volume
              </span>
            </div>
          </div>
        </div>

        {/* Global / S&P Sector Performance Heatmap */}
        <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-4">
          <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                Sector Rotation Heatmap
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Performance across 11 key industry verticals
              </p>
            </div>
            <span className="text-[10px] font-mono text-stone-400">Real-Time Breadth</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            {OPENSTOCK_SECTORS.map((sec) => (
              <div
                key={sec.sector}
                className="flex items-center justify-between rounded-lg bg-stone-900/60 px-3 py-2 border border-stone-800/80 hover:border-emerald-500/40 transition"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-200">{sec.sector}</span>
                  <span className="text-[10px] text-stone-500">
                    Leader: <strong className="text-emerald-400">${sec.leadingSymbol}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-stone-500">{sec.weightPct}% Weight</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      sec.changePct >= 0
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {sec.changePct >= 0 ? "+" : ""}
                    {sec.changePct}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICE ALERTS MANAGER (Signature OpenStock Feature) */}
      <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-6">
        <div className="border-b border-stone-800 pb-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
              <Bell className="h-4 w-4 text-emerald-400" />
              Personalized Price Alerts Engine
            </h3>
            <p className="text-xs text-stone-400 font-mono">
              Set target triggers above or below key technical levels with instant alerts
            </p>
          </div>
          <span className="rounded bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
            {alerts.length} Active Triggers
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1.7fr]">
          {/* Create Alert Form */}
          <form
            onSubmit={handleCreateAlert}
            className="rounded-xl border border-stone-800 bg-stone-900/60 p-5 space-y-4 font-mono text-xs"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Configure New Trigger
            </span>

            <div>
              <label className="text-stone-300 block mb-1">Target Symbol</label>
              <select
                value={newAlertSymbol}
                onChange={(e) => {
                  setNewAlertSymbol(e.target.value);
                  setNewAlertTarget(getAssetPrice(e.target.value).toString());
                }}
                className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-white"
              >
                {ASSETS.slice(0, 16).map((a) => (
                  <option key={a.symbol} value={a.symbol}>
                    ${a.symbol} ({a.name}) &mdash; {fmtPrice(metricsFor(a).last)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-stone-300 block mb-1">Condition</label>
                <select
                  value={newAlertDirection}
                  onChange={(e) => setNewAlertDirection(e.target.value as "ABOVE" | "BELOW")}
                  className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-white"
                >
                  <option value="ABOVE">&ge; Price Rises Above</option>
                  <option value="BELOW">&le; Price Drops Below</option>
                </select>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Target Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={newAlertTarget}
                  onChange={(e) => setNewAlertTarget(e.target.value)}
                  className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-white"
                />
              </div>
            </div>

            {alertSuccess && (
              <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 p-2 text-emerald-300 text-[11px]">
                {alertSuccess}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 py-2.5 font-bold text-stone-950 hover:bg-emerald-400 transition"
            >
              Arm Price Alert &lt;GO&gt;
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="space-y-3 font-mono text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
              Live Monitored Triggers
            </span>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {alerts.map((alt) => {
                const cur = getAssetPrice(alt.symbol, alt.currentPrice);
                return (
                  <div
                    key={alt.id}
                    className="flex items-center justify-between rounded-xl border border-stone-800 bg-stone-900/40 p-3.5"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">${alt.symbol}</span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            alt.direction === "ABOVE"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {alt.direction === "ABOVE" ? "Rises Above" : "Drops Below"}
                        </span>
                        <span className="text-white font-bold">${alt.targetPrice.toFixed(2)}</span>
                      </div>
                      <span className="text-[11px] text-stone-400 mt-0.5 block">
                        Current: {fmtPrice(cur)} &middot; Created: {alt.createdAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {alt.triggered ? (
                        <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold">
                          TRIGGERED
                        </span>
                      ) : (
                        <span className="rounded bg-stone-800 text-stone-400 px-2 py-0.5 text-[10px]">
                          WATCHING
                        </span>
                      )}
                      <button
                        onClick={() => handleDeleteAlert(alt.id)}
                        className="text-stone-500 hover:text-red-400 transition"
                        title="Delete alert"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
