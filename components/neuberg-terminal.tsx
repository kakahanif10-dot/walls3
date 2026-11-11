"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Terminal,
  Activity,
  TrendingUp,
  TrendingDown,
  Globe,
  Sliders,
  DollarSign,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Flame,
  CheckCircle2,
  ExternalLink,
  Layers,
  ChevronRight,
  Database,
  BarChart2,
  Zap,
  Vote,
  Compass,
  Filter,
  Check,
  X,
  Play,
  RotateCcw,
} from "lucide-react";
import {
  NEUBERG_PANEL_CATALOG,
  NEUBERG_PERP_CONTRACTS,
  NEUBERG_POLYMARKETS,
  NEUBERG_COMMODITIES,
  NEUBERG_NEWS_INTEL,
  computeFearAndGreed,
  getMacroRegime,
  type PanelCategory,
  type PerpetualContract,
  type PolymarketContract,
} from "@/lib/neuberg-platform";
import { fmtPrice, fmtPct } from "@/lib/market";
import WhopBadge from "@/components/whop-badge";

export default function NeubergTerminal() {
  const [activeCategory, setActiveCategory] = useState<PanelCategory>("All");
  const [openPanelIds, setOpenPanelIds] = useState<string[]>([
    "fear-greed",
    "macro-regime",
    "yield-curve",
    "perps-trading",
    "polymarket",
    "commodities",
    "ai-news-intel",
  ]);

  // Perps Trade Simulator State
  const [selectedPerp, setSelectedPerp] = useState<PerpetualContract>(NEUBERG_PERP_CONTRACTS[0]);
  const [perpSide, setPerpSide] = useState<"LONG" | "SHORT">("LONG");
  const [leverage, setLeverage] = useState<number>(5);
  const [perpMarginUsd, setPerpMarginUsd] = useState<number>(500);
  const [perpOrderFeedback, setPerpOrderFeedback] = useState<string | null>(null);

  // Polymarket Bet Simulator State
  const [selectedPoly, setSelectedPoly] = useState<PolymarketContract>(NEUBERG_POLYMARKETS[0]);
  const [polyBetOutcome, setPolyBetOutcome] = useState<"YES" | "NO">("YES");
  const [polyStakeAmount, setPolyStakeAmount] = useState<number>(100);
  const [polyOrderFeedback, setPolyOrderFeedback] = useState<string | null>(null);

  // Compute live data
  const fearGreed = computeFearAndGreed();
  const macroRegime = getMacroRegime();

  const togglePanel = (panelId: string) => {
    setOpenPanelIds((prev) =>
      prev.includes(panelId) ? prev.filter((id) => id !== panelId) : [...prev, panelId]
    );
  };

  const isPanelOpen = (panelId: string) => openPanelIds.includes(panelId);

  // Perps calculations
  const perpNotional = perpMarginUsd * leverage;
  const perpQuantity = perpNotional / selectedPerp.markPrice;
  const perpLiquidationPrice =
    perpSide === "LONG"
      ? selectedPerp.markPrice * (1 - 0.9 / leverage)
      : selectedPerp.markPrice * (1 + 0.9 / leverage);

  const handleExecutePerp = (e: React.FormEvent) => {
    e.preventDefault();
    setPerpOrderFeedback(
      `Order Executed: ${perpSide} ${perpQuantity.toFixed(2)} ${selectedPerp.symbol} at ${fmtPrice(
        selectedPerp.markPrice
      )} (${leverage}x Leverage, Margin $${perpMarginUsd}). Liq: ${fmtPrice(perpLiquidationPrice)}`
    );
    setTimeout(() => setPerpOrderFeedback(null), 4000);
  };

  const handleExecutePolyBet = (e: React.FormEvent) => {
    e.preventDefault();
    const odds = polyBetOutcome === "YES" ? selectedPoly.yesAsk : 1 - selectedPoly.yesBid;
    const shares = polyStakeAmount / odds;
    setPolyOrderFeedback(
      `Stake Placed: $${polyStakeAmount} on "${polyBetOutcome}" (${Math.round(
        odds * 100
      )}¢). Potential Payout: $${shares.toFixed(2)}`
    );
    setTimeout(() => setPolyOrderFeedback(null), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Top Neuberg Terminal Branding & Status Banner */}
      <div className="rounded-2xl border border-[#ff9900]/40 bg-gradient-to-r from-[#120a02] via-[#1a0f03] to-[#0c0702] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-[#ff9900]/30 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded bg-[#ff9900]/20 border border-[#ff9900]/40 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-[#ffcc00]">
                <Terminal className="h-3.5 w-3.5 text-[#ff9900]" />
                NEUBERG TERMINAL · THE OPEN-SOURCE BLOOMBERG
              </span>
              <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
                516 Live Panels · $24,000/yr Alternative
              </span>
              <WhopBadge size="xs" />
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-mono text-white font-extrabold tracking-tight flex items-center gap-2">
              <span>Neuberg Quantitative Workstation</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-3xl leading-relaxed font-mono">
              Ported from the open-source repository{" "}
              <a
                href="https://github.com/KoNananachan/Neuberg"
                target="_blank"
                rel="noreferrer"
                className="text-[#ff9900] hover:underline inline-flex items-center gap-1 font-bold"
              >
                KoNananachan/Neuberg <ExternalLink className="h-3 w-3" />
              </a>
              {" "}· Live demo at{" "}
              <a
                href="https://neuberg.ai"
                target="_blank"
                rel="noreferrer"
                className="text-[#00d4aa] hover:underline inline-flex items-center gap-1 font-bold"
              >
                neuberg.ai <ExternalLink className="h-3 w-3" />
              </a>
              . Built with 516 drag-and-drop panels across Equities, Fixed Income, Commodities, Macro Regime Quadrants, Fear &amp; Greed index, 24/7 Hyperliquid stock &amp; crypto perpetuals, and native Polymarket prediction order books.
            </p>
          </div>

          {/* Quick Platform Telemetry */}
          <div className="rounded-xl border border-[#ff9900]/30 bg-[#1e1003]/80 p-4 max-w-md w-full shrink-0 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#ff9900]/20 pb-2">
              <span className="text-stone-400">Terminal Core:</span>
              <span className="text-[#00d4aa] font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-[#00d4aa] animate-pulse" />
                Live Feed (Yahoo Finance + Hyperliquid)
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Active Panels:</span>
              <span className="text-[#ffcc00] font-bold">{openPanelIds.length} / 516 Available</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Macro Market Sentiment:</span>
              <span className="text-emerald-400 font-bold">
                {fearGreed.rating} ({fearGreed.score}/100)
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-stone-400">Economic Regime:</span>
              <span className="text-[#ff3366] font-bold">{macroRegime.currentRegime} Quadrant</span>
            </div>
          </div>
        </div>

        {/* Panel Category & Layout Filter Strip */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {[
              "All",
              "Macro & Risk",
              "Perpetuals & Predictions",
              "Fixed Income",
              "Commodities",
              "Equities",
            ].map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as PanelCategory)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-mono transition-all ${
                    active
                      ? "bg-[#ff9900] text-stone-950 font-bold shadow-lg shadow-[#ff9900]/20"
                      : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-stone-400">Toggle Panel Views:</span>
            {NEUBERG_PANEL_CATALOG.slice(0, 5).map((p) => {
              const open = isPanelOpen(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePanel(p.id)}
                  className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold transition ${
                    open
                      ? "bg-[#ff9900]/20 text-[#ffcc00] border border-[#ff9900]/40"
                      : "bg-stone-800 text-stone-500 border border-stone-800"
                  }`}
                >
                  {p.tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MODULAR 516-PANEL WORKSPACE GRID */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* PANEL 1: FEAR & GREED COMPOSITE INDEX */}
        {isPanelOpen("fear-greed") && (
          <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff9900] uppercase tracking-wider">
                  PANEL 01 · MARKET SENTIMENT ENGINE
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[#ff9900]" />
                  Fear &amp; Greed Composite Index
                </h3>
              </div>
              <span className="rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                {fearGreed.rating}
              </span>
            </div>

            {/* Fear & Greed Dial / Gauge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 rounded-xl border border-stone-800/80 bg-stone-900/40 p-4">
              <div className="text-center sm:text-left">
                <span className="text-[11px] font-mono text-stone-400 uppercase">Current Reading</span>
                <div className="text-5xl font-mono font-extrabold text-[#00d4aa]">
                  {fearGreed.score}
                </div>
                <span className="text-xs font-mono text-stone-400">Scale: 0 (Extreme Fear) &ndash; 100 (Extreme Greed)</span>
              </div>

              {/* Historical Comparison */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs text-center border-t sm:border-t-0 sm:border-l border-stone-800 pt-3 sm:pt-0 sm:pl-6">
                <div>
                  <span className="text-[10px] text-stone-500 block">Prev Close</span>
                  <strong className="text-stone-300 text-sm">{fearGreed.previousClose}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">1 Week Ago</span>
                  <strong className="text-stone-300 text-sm">{fearGreed.oneWeekAgo}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block">1 Month Ago</span>
                  <strong className="text-amber-400 text-sm">{fearGreed.oneMonthAgo}</strong>
                </div>
              </div>
            </div>

            {/* Underlying Factor Breakdown */}
            <div className="space-y-2 font-mono text-xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                Contributing Sub-Factor Signals
              </span>
              <div className="grid gap-2">
                {fearGreed.factors.map((f) => (
                  <div
                    key={f.name}
                    className="flex items-center justify-between rounded-lg bg-stone-900/60 px-3 py-2 border border-stone-800/80"
                  >
                    <span className="text-stone-300 text-xs">{f.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-1.5 rounded-full bg-stone-800 overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-[#00d4aa]"
                          style={{ width: `${f.score}%` }}
                        />
                      </div>
                      <span className="text-emerald-400 font-bold">{f.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PANEL 2: MACRO REGIME QUADRANT */}
        {isPanelOpen("macro-regime") && (
          <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff3366] uppercase tracking-wider">
                  PANEL 02 · MACRO CYCLE ANALYSIS
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#ff3366]" />
                  Macro Regime Quadrant
                </h3>
              </div>
              <span className="rounded bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                {macroRegime.currentRegime}
              </span>
            </div>

            {/* 2D Quadrant Visualizer */}
            <div className="relative rounded-xl border border-stone-800 bg-stone-900/50 p-4 h-56 flex flex-col justify-between font-mono text-[11px]">
              {/* Axes Labels */}
              <div className="flex justify-between text-stone-500">
                <span>STAGFLATION (Low Growth / High Inf)</span>
                <span className="text-emerald-400 font-bold">REFLATION (High Growth / High Inf) ★ CURRENT</span>
              </div>
              {/* Crosshair lines */}
              <div className="absolute inset-x-4 top-1/2 h-px bg-stone-800" />
              <div className="absolute inset-y-4 left-1/2 w-px bg-stone-800" />

              {/* Current Point Indicator */}
              <div
                className="absolute z-10 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${50 + (macroRegime.growthScore / 100) * 40}%`,
                  top: `${50 - (macroRegime.inflationScore / 100) * 40}%`,
                }}
              >
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3366] opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#ff3366] border-2 border-white" />
                </span>
              </div>

              <div className="flex justify-between text-stone-500">
                <span>DEFLATION (Low Growth / Low Inf)</span>
                <span>GOLDILOCKS (High Growth / Low Inf)</span>
              </div>
            </div>

            {/* Regime Thesis & Allocation */}
            <div className="space-y-2 font-mono text-xs">
              <p className="text-stone-300 text-xs leading-relaxed">
                {macroRegime.historicalTransition}
              </p>
              <div className="rounded-lg bg-stone-900/60 p-3 border border-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-[#ff9900] uppercase">
                  Optimal Sector Playbook
                </span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {macroRegime.recommendedAllocation.map((alloc) => (
                    <span
                      key={alloc}
                      className="rounded bg-[#ff9900]/15 text-[#ffcc00] border border-[#ff9900]/30 px-2 py-0.5 text-[11px]"
                    >
                      {alloc}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PANEL 3: 24/7 STOCK & CRYPTO PERPETUALS (HYPERLIQUID INTEGRATION) */}
        {isPanelOpen("perps-trading") && (
          <div className="rounded-2xl border border-[#ff9900]/40 bg-[#0c0803] p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-[#ff9900]/30 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#ff9900] uppercase tracking-wider">
                  PANEL 03 · 24/7 TRADING ENGINE
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-[#ff9900]" />
                  Hyperliquid 24/7 Perpetuals
                </h3>
              </div>
              <span className="rounded bg-[#ff9900]/20 text-[#ffcc00] border border-[#ff9900]/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                1x &ndash; 20x Leverage
              </span>
            </div>

            {/* Contract Selector */}
            <div className="grid grid-cols-3 gap-2">
              {NEUBERG_PERP_CONTRACTS.map((contract) => {
                const isSelected = selectedPerp.symbol === contract.symbol;
                return (
                  <button
                    key={contract.symbol}
                    onClick={() => setSelectedPerp(contract)}
                    className={`rounded-xl p-2.5 font-mono text-left transition border ${
                      isSelected
                        ? "border-[#ff9900] bg-[#ff9900]/20 text-white font-bold"
                        : "border-stone-800 bg-stone-900/60 text-stone-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>{contract.symbol}</span>
                      <span className="text-[9px] text-[#ffcc00]">{contract.maxLeverage}x</span>
                    </div>
                    <div className="mt-1 text-sm text-white font-bold">
                      {fmtPrice(contract.markPrice)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Perps Order Placement Simulation */}
            <form onSubmit={handleExecutePerp} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPerpSide("LONG")}
                  className={`py-2 rounded-lg font-bold transition ${
                    perpSide === "LONG"
                      ? "bg-[#00d4aa] text-stone-950 shadow-md"
                      : "bg-stone-900 text-stone-400 border border-stone-800"
                  }`}
                >
                  LONG / BUY
                </button>
                <button
                  type="button"
                  onClick={() => setPerpSide("SHORT")}
                  className={`py-2 rounded-lg font-bold transition ${
                    perpSide === "SHORT"
                      ? "bg-[#ff3366] text-white shadow-md"
                      : "bg-stone-900 text-stone-400 border border-stone-800"
                  }`}
                >
                  SHORT / SELL
                </button>
              </div>

              {/* Leverage Slider */}
              <div>
                <div className="flex justify-between text-xs">
                  <span className="text-stone-300">Account Leverage:</span>
                  <span className="text-[#ff9900] font-bold">{leverage}x Max</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={selectedPerp.maxLeverage}
                  step="1"
                  value={leverage}
                  onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
                  className="w-full accent-[#ff9900] mt-1"
                />
              </div>

              {/* Margin Input & Execution Details */}
              <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 space-y-1.5 text-stone-400">
                <div className="flex justify-between">
                  <span>Margin Deposit ($):</span>
                  <input
                    type="number"
                    min="50"
                    max="50000"
                    value={perpMarginUsd}
                    onChange={(e) => setPerpMarginUsd(parseFloat(e.target.value) || 100)}
                    className="w-24 bg-stone-950 border border-stone-700 px-2 py-0.5 rounded text-white text-right font-bold"
                  />
                </div>
                <div className="flex justify-between">
                  <span>Effective Position Size:</span>
                  <span className="text-white font-bold">{fmtPrice(perpNotional)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Liquidation Price:</span>
                  <span className="text-[#ff3366] font-bold">{fmtPrice(perpLiquidationPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hourly Funding Rate:</span>
                  <span className="text-[#00d4aa]">+{selectedPerp.fundingRateHourlyPct}% / hr</span>
                </div>
              </div>

              {perpOrderFeedback && (
                <div className="rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/40 p-2.5 text-[#00d4aa] text-[11px]">
                  {perpOrderFeedback}
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl font-bold font-mono transition ${
                  perpSide === "LONG"
                    ? "bg-[#00d4aa] text-stone-950 hover:bg-[#00d4aa]/90"
                    : "bg-[#ff3366] text-white hover:bg-[#ff3366]/90"
                }`}
              >
                Execute {leverage}x {perpSide} {selectedPerp.symbol} &lt;GO&gt;
              </button>
            </form>
          </div>
        )}

        {/* PANEL 4: POLYMARKET PREDICTION ORDER BOOK */}
        {isPanelOpen("polymarket") && (
          <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#00d4aa] uppercase tracking-wider">
                  PANEL 04 · DECENTRALIZED PREDICTION MARKETS
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <Vote className="h-4 w-4 text-[#00d4aa]" />
                  Polymarket Order Book
                </h3>
              </div>
              <span className="rounded bg-[#00d4aa]/20 text-[#00d4aa] border border-[#00d4aa]/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                Polygon Web3 Core
              </span>
            </div>

            {/* Question Selector */}
            <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
              {NEUBERG_POLYMARKETS.map((poly) => {
                const isSelected = selectedPoly.id === poly.id;
                return (
                  <button
                    key={poly.id}
                    onClick={() => setSelectedPoly(poly)}
                    className={`w-full text-left rounded-xl p-3 font-mono text-xs transition border ${
                      isSelected
                        ? "border-[#00d4aa] bg-[#00d4aa]/15 text-white"
                        : "border-stone-800 bg-stone-900/60 text-stone-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#ff9900]">{poly.category}</span>
                      <span className="text-stone-400">${(poly.volumeUsd / 1e6).toFixed(1)}M Vol</span>
                    </div>
                    <p className="mt-1 text-xs text-white font-semibold line-clamp-1">
                      {poly.question}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Polymarket Order Slip */}
            <form onSubmit={handleExecutePolyBet} className="space-y-3 font-mono text-xs">
              <div className="rounded-xl border border-stone-800 bg-stone-900/50 p-3.5 space-y-2">
                <p className="text-white font-bold text-xs">{selectedPoly.question}</p>
                <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-800">
                  <span className="text-stone-400">Current Implied Probability:</span>
                  <span className="text-[#00d4aa] font-extrabold text-sm">
                    {selectedPoly.probabilityYesPct}% YES
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPolyBetOutcome("YES")}
                  className={`py-2 rounded-lg font-bold transition ${
                    polyBetOutcome === "YES"
                      ? "bg-[#00d4aa] text-stone-950"
                      : "bg-stone-900 text-stone-400 border border-stone-800"
                  }`}
                >
                  BUY YES ({Math.round(selectedPoly.yesAsk * 100)}¢)
                </button>
                <button
                  type="button"
                  onClick={() => setPolyBetOutcome("NO")}
                  className={`py-2 rounded-lg font-bold transition ${
                    polyBetOutcome === "NO"
                      ? "bg-[#ff3366] text-white"
                      : "bg-stone-900 text-stone-400 border border-stone-800"
                  }`}
                >
                  BUY NO ({Math.round((1 - selectedPoly.yesBid) * 100)}¢)
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-stone-400">Stake Amount:</span>
                <input
                  type="number"
                  min="10"
                  max="10000"
                  value={polyStakeAmount}
                  onChange={(e) => setPolyStakeAmount(parseFloat(e.target.value) || 50)}
                  className="w-28 bg-stone-950 border border-stone-700 px-3 py-1.5 rounded text-white text-right font-bold"
                />
              </div>

              {polyOrderFeedback && (
                <div className="rounded-lg bg-[#00d4aa]/20 border border-[#00d4aa]/40 p-2 text-[#00d4aa] text-[11px]">
                  {polyOrderFeedback}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#00d4aa] text-stone-950 font-bold hover:bg-[#00d4aa]/90 transition"
              >
                Place Prediction Stake &lt;GO&gt;
              </button>
            </form>
          </div>
        )}

        {/* PANEL 5: COMMODITIES & PRECIOUS METALS MATRIX */}
        {isPanelOpen("commodities") && (
          <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                  PANEL 05 · REAL ASSET PRICING
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  Commodities &amp; Precious Metals Matrix
                </h3>
              </div>
              <span className="text-xs font-mono text-stone-400">NYMEX / COMEX Feeds</span>
            </div>

            <div className="grid gap-2.5 sm:grid-cols-2 font-mono text-xs">
              {NEUBERG_COMMODITIES.map((c) => (
                <div
                  key={c.symbol}
                  className="rounded-xl border border-stone-800 bg-stone-900/50 p-3.5 space-y-1 hover:border-[#ff9900]/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{c.name}</span>
                    <span
                      className={`font-bold ${
                        c.change24hPct >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {c.change24hPct >= 0 ? "+" : ""}
                      {c.change24hPct}%
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-amber-300">
                      ${c.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-stone-500">{c.unit}</span>
                  </div>
                  <div className="text-[10px] text-stone-400 pt-1 border-t border-stone-800">
                    {c.spreadInfo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL 6: AI GEOPOLITICAL & CONFLICT RADAR */}
        {isPanelOpen("ai-news-intel") && (
          <div className="rounded-2xl border border-stone-800 bg-stone-950/90 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  PANEL 06 · INTELLIGENCE RADAR
                </span>
                <h3 className="font-mono text-lg font-bold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  AI Geopolitical &amp; Conflict Radar
                </h3>
              </div>
              <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                NLP Classification
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {NEUBERG_NEWS_INTEL.map((news) => (
                <div
                  key={news.id}
                  className="rounded-xl border border-stone-800 bg-stone-900/50 p-4 space-y-2 hover:border-cyan-500/40 transition"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="rounded bg-stone-800 px-2 py-0.5 text-stone-300 font-bold">
                      {news.category}
                    </span>
                    <span className="text-stone-400">{news.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs leading-snug">{news.headline}</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-950/60 p-2.5 rounded-lg border border-stone-850">
                    <strong>AI Analysis:</strong> {news.aiBrief}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                    <span>
                      Impact Score: <strong className="text-cyan-400">{news.impactScore}/10</strong>
                    </span>
                    <div className="flex gap-1">
                      {news.affectedTickers.map((tick) => (
                        <span key={tick} className="rounded bg-stone-800 px-1.5 py-0.2 text-white">
                          ${tick}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
