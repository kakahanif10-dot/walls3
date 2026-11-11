"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  TrendingUp,
  Activity,
  Layers,
  Globe,
  Sliders,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Database,
  BarChart2,
  PieChart,
  Ship,
  Sparkles,
  Bot,
  RefreshCw,
  Search,
  Check,
  Send,
  Workflow,
  Share2,
} from "lucide-react";
import {
  FINCEPT_AGENTS,
  FINCEPT_DATA_CONNECTORS,
  MARITIME_CHOKEPOINTS,
  INITIAL_PAPER_POSITIONS,
  computeFinceptDCF,
  computeBlackScholesGreeks,
  executeFinceptCommand,
  type FinceptAgent,
  type DCFModelInputs,
  type DCFModelResult,
  type OptionsPricerInputs,
  type OptionsPricerResult,
  type PaperPosition,
  type FinceptCLIResponse,
} from "@/lib/fincept-platform";
import { ASSETS, ASSET_BY_SYMBOL, fmtPrice, metricsFor } from "@/lib/market";
import WhopBadge from "@/components/whop-badge";

type FinceptDesk = "cli" | "agents" | "dcf" | "options" | "paper" | "connectors" | "node";

function getAssetLastPrice(symbol: string, fallback = 187.4): number {
  const asset = ASSET_BY_SYMBOL[symbol];
  if (!asset) return fallback;
  return metricsFor(asset).last;
}

export default function FinceptTerminal() {
  const [activeDesk, setActiveDesk] = useState<FinceptDesk>("cli");

  // CLI Workstation State
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cliLogs, setCliLogs] = useState<FinceptCLIResponse[]>([
    {
      command: "welcome",
      title: "Fincept Terminal v4.5.2 (Native C++20 / Qt6 / Embedded Python 3.11)",
      output:
        "Welcome to the Fincept Terminal integrated platform.\nConnected to 100+ global financial data connectors, 37 specialized investor/macro AI agents, and institutional quant pricing engines.\nType 'help' or click any command preset below to begin.",
      type: "info",
    },
  ]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Agent Lab State
  const [selectedAgent, setSelectedAgent] = useState<FinceptAgent>(FINCEPT_AGENTS[0]);
  const [agentTicker, setAgentTicker] = useState("NVDA");
  const [agentEvaluation, setAgentEvaluation] = useState(() => {
    const asset = ASSET_BY_SYMBOL["NVDA"] || ASSETS[0];
    const m = metricsFor(asset);
    return FINCEPT_AGENTS[0].evaluate("NVDA", m.last, 32.5, 0.45, 0.042, 1.35);
  });

  // DCF Valuation State
  const [dcfInputs, setDcfInputs] = useState<DCFModelInputs>({
    symbol: "NVDA",
    currentPrice: 187.4,
    revenueBaseBillion: 115,
    growthRatePct: 40,
    terminalGrowthPct: 3.0,
    operatingMarginPct: 62,
    taxRatePct: 15.0,
    waccPct: 9.2,
    sharesOutstandingMillion: 24500,
    netDebtBillion: -18,
  });
  const [dcfResult, setDcfResult] = useState<DCFModelResult>(() => computeFinceptDCF(dcfInputs));

  // Options Greeks State
  const [optionsInputs, setOptionsInputs] = useState<OptionsPricerInputs>({
    stockPrice: 187.4,
    strikePrice: 190.0,
    timeToExpiryDays: 30,
    riskFreeRatePct: 4.38,
    volatilityPct: 45.0,
  });
  const [optionsResult, setOptionsResult] = useState<OptionsPricerResult>(() =>
    computeBlackScholesGreeks(optionsInputs)
  );

  // Paper Trading State
  const [cashBalance, setCashBalance] = useState(100000.0);
  const [positions, setPositions] = useState<PaperPosition[]>(INITIAL_PAPER_POSITIONS);
  const [orderSymbol, setOrderSymbol] = useState("NVDA");
  const [orderSide, setOrderSide] = useState<"BUY" | "SELL">("BUY");
  const [orderShares, setOrderShares] = useState(10);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  // Node Editor Active Steps State
  const [nodeSteps, setNodeSteps] = useState([
    { id: 1, title: "1. Data Ingestion", desc: "Polygon WebSocket + FRED 10Y Yield", status: "Active", active: true },
    { id: 2, title: "2. Quant Filter", desc: "20-SMA Cross + Realized Vol < 50%", status: "Active", active: true },
    { id: 3, title: "3. AI Agent Gate", desc: "Buffett Moat + Simons Momentum Score > 75", status: "Active", active: true },
    { id: 4, title: "4. Risk & Invalidation", desc: "Position Sized to 1.5% Max Portfolio Risk", status: "Active", active: true },
    { id: 5, title: "5. Execution Venue", desc: "Smart Order Routing via Broker Fix API", status: "Standby", active: false },
  ]);

  // Sync calculations
  useEffect(() => {
    setDcfResult(computeFinceptDCF(dcfInputs));
  }, [dcfInputs]);

  useEffect(() => {
    setOptionsResult(computeBlackScholesGreeks(optionsInputs));
  }, [optionsInputs]);

  useEffect(() => {
    const asset = ASSET_BY_SYMBOL[agentTicker] || ASSETS[0];
    const m = metricsFor(asset);
    setAgentEvaluation(selectedAgent.evaluate(asset.symbol, m.last, 32.5, 0.45, 0.042, 1.35));
  }, [selectedAgent, agentTicker]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [cliLogs]);

  const handleRunCommand = (cmdToRun?: string) => {
    const target = cmdToRun !== undefined ? cmdToRun : commandInput;
    if (!target.trim()) return;

    if (target.trim().toLowerCase() === "clear") {
      setCliLogs([]);
      setCommandInput("");
      return;
    }

    const res = executeFinceptCommand(target);
    setCliLogs((prev) => [...prev, res]);
    setCommandHistory((prev) => [...prev, target]);
    setHistoryIndex(-1);
    setCommandInput("");
  };

  const handleExecutePaperOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = ASSET_BY_SYMBOL[orderSymbol] || ASSETS[0];
    const m = metricsFor(asset);
    const cost = orderShares * m.last;

    if (orderSide === "BUY") {
      if (cost > cashBalance) {
        setOrderFeedback("Insufficient cash balance for this order.");
        return;
      }
      setCashBalance((prev) => prev - cost);
      setPositions((prev) => {
        const existing = prev.find((p) => p.symbol === asset.symbol && p.side === "BUY");
        if (existing) {
          const totalShares = existing.shares + orderShares;
          const avgPrice = (existing.shares * existing.entryPrice + cost) / totalShares;
          return prev.map((p) =>
            p.symbol === asset.symbol && p.side === "BUY"
              ? {
                  ...p,
                  shares: totalShares,
                  entryPrice: avgPrice,
                  unrealizedPnL: (m.last - avgPrice) * totalShares,
                  unrealizedPnLPct: ((m.last - avgPrice) / avgPrice) * 100,
                }
              : p
          );
        }
        return [
          ...prev,
          {
            symbol: asset.symbol,
            assetName: asset.name,
            side: "BUY",
            shares: orderShares,
            entryPrice: m.last,
            currentPrice: m.last,
            unrealizedPnL: 0,
            unrealizedPnLPct: 0,
            timestamp: "Just now",
          },
        ];
      });
      setOrderFeedback(`Order Filled: Bought ${orderShares} $${asset.symbol} at ${fmtPrice(m.last)}`);
    } else {
      // SELL / SHORT
      setCashBalance((prev) => prev + cost);
      setPositions((prev) =>
        prev.filter((p) => !(p.symbol === asset.symbol && p.shares <= orderShares))
      );
      setOrderFeedback(`Order Filled: Sold ${orderShares} $${asset.symbol} at ${fmtPrice(m.last)}`);
    }
  };

  const totalPositionsValue = positions.reduce(
    (acc, p) => acc + p.shares * getAssetLastPrice(p.symbol, p.currentPrice),
    0
  );
  const totalPortfolioValue = cashBalance + totalPositionsValue;
  const totalUnrealizedPnL = positions.reduce((acc, p) => acc + p.unrealizedPnL, 0);

  return (
    <div className="space-y-8">
      {/* Top Fincept Terminal Branding Banner */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-[#0d0903] via-[#140e05] to-[#080603] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-amber-900/40 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/15 border border-amber-500/40 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
                <Terminal className="h-3.5 w-3.5 text-amber-400" />
                FINCEPT TERMINAL · C++20 / QT6 / EMBEDDED PYTHON 3.11
              </span>
              <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
                v4.5.2 AGPL-3.0
              </span>
              <WhopBadge size="xs" />
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-mono text-stone-100 font-bold tracking-tight flex items-center gap-2">
              <span>Fincept Terminal Quantitative Engine</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed font-mono">
              Fully integrated from the official open-source repository{" "}
              <a
                href="https://github.com/Fincept-Corporation/FinceptTerminal"
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 hover:underline inline-flex items-center gap-1 font-bold"
              >
                Fincept-Corporation/FinceptTerminal <ExternalLink className="h-3 w-3" />
              </a>
              . Built with 37 investor AI agents (Buffett, Munger, Soros, Dalio, Simons), interactive DCF valuation, Black-Scholes options Greeks, 100+ live macroeconomic connectors (FRED, IMF, DBnomics, SEC EDGAR), real-time paper trading, and visual node workflow automation.
            </p>
          </div>

          {/* Quick Platform Telemetry */}
          <div className="rounded-xl border border-amber-500/30 bg-[#160f05]/90 p-4 max-w-md w-full shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">Core Runtime:</span>
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Single Binary (No Electron)
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono border-t border-amber-900/40 pt-2">
              <span className="text-stone-400">AI Agents Suite:</span>
              <span className="text-amber-300">37 Research &amp; Investor Desks</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono border-t border-amber-900/40 pt-2">
              <span className="text-stone-400">Data Connectivity:</span>
              <span className="text-emerald-400">100+ Feeds (FRED, IMF, EDGAR, Kraken)</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono border-t border-amber-900/40 pt-2">
              <span className="text-stone-400">Virtual Portfolio:</span>
              <span className="text-white font-bold">{fmtPrice(totalPortfolioValue)}</span>
            </div>
          </div>
        </div>

        {/* 6 Core Desk Navigation Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: "cli", label: "CLI Shell (<GO>)", icon: Terminal, desc: "Command Interface" },
            { id: "agents", label: "37 AI Agents Lab", icon: Bot, desc: "Buffett, Soros, Simons" },
            { id: "dcf", label: "DCF Valuation Engine", icon: BarChart2, desc: "Intrinsic Value & Moat" },
            { id: "options", label: "Options & Greeks", icon: Activity, desc: "Black-Scholes & Vol" },
            { id: "paper", label: "Paper Trading & Execution", icon: DollarSign, desc: "Order Routing & PnL" },
            { id: "connectors", label: "100+ Data Feeds & Chokepoints", icon: Globe, desc: "FRED, IMF, Maritime" },
            { id: "node", label: "Visual Strategy Nodes", icon: Workflow, desc: "Factor Discovery Canvas" },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeDesk === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveDesk(tab.id as FinceptDesk)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-mono font-semibold transition-all ${
                  active
                    ? "bg-amber-500 text-stone-950 shadow-lg shadow-amber-500/20 font-bold scale-[1.02]"
                    : "bg-stone-900/80 text-stone-300 hover:bg-stone-800 hover:text-white border border-stone-800"
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? "text-stone-950" : "text-amber-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DESK 1: CLI WORKSTATION */}
      {activeDesk === "cli" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-amber-500/40 bg-[#080603] p-5 shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-900/40 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-xs text-amber-400 font-bold">
                  fincept@terminal-desk:~#
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-stone-400">Quick Commands:</span>
                {[
                  "agent buffett NVDA",
                  "agent simons BTC",
                  "dcf AAPL",
                  "options TSLA 250",
                  "macro",
                  "chokepoint",
                  "connectors",
                ].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleRunCommand(cmd)}
                    className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition"
                  >
                    {cmd}
                  </button>
                ))}
                <button
                  onClick={() => setCliLogs([])}
                  className="rounded border border-stone-700 bg-stone-900 px-2 py-0.5 text-[10px] font-mono text-stone-400 hover:text-white"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Terminal Output Log Area */}
            <div className="mt-4 max-h-[520px] min-h-[380px] overflow-y-auto space-y-4 font-mono text-xs pr-2">
              {cliLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-stone-800/80 bg-stone-950/80 p-4 transition-all"
                >
                  <div className="flex items-center justify-between text-stone-500 text-[11px] border-b border-stone-800/60 pb-2">
                    <span className="text-amber-400 flex items-center gap-1 font-bold">
                      <ChevronRight className="h-3 w-3 text-amber-400" />
                      {log.command}
                    </span>
                    <span className="text-stone-400">{log.title}</span>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-mono text-stone-200 leading-relaxed text-xs">
                    {log.output}
                  </pre>
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Terminal Input Line */}
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/50 bg-[#120c04] px-4 py-2.5">
              <span className="font-mono text-sm font-bold text-amber-400">$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleRunCommand();
                  } else if (e.key === "ArrowUp") {
                    if (commandHistory.length > 0) {
                      const next = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
                      setHistoryIndex(next);
                      setCommandInput(commandHistory[commandHistory.length - 1 - next] || "");
                    }
                  } else if (e.key === "ArrowDown") {
                    if (historyIndex > 0) {
                      const next = historyIndex - 1;
                      setHistoryIndex(next);
                      setCommandInput(commandHistory[commandHistory.length - 1 - next] || "");
                    } else if (historyIndex === 0) {
                      setHistoryIndex(-1);
                      setCommandInput("");
                    }
                  }
                }}
                placeholder="Type command (e.g. 'agent buffett NVDA', 'dcf TSLA', 'options AAPL 250', 'macro', 'help')..."
                className="w-full bg-transparent font-mono text-xs text-white placeholder-stone-500 focus:outline-none"
              />
              <button
                onClick={() => handleRunCommand()}
                className="shrink-0 rounded bg-amber-500 px-3 py-1 font-mono text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
              >
                Execute &lt;GO&gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESK 2: 37 AI AGENTS LAB */}
      {activeDesk === "agents" && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1.7fr]">
          {/* Agent Selection Grid */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950/80 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <Bot className="h-4 w-4 text-amber-400" />
                  Select Research Agent (37 Frameworks)
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Modeled on real capital allocator frameworks
                </p>
              </div>
              <span className="rounded bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono text-amber-300">
                Multi-Agent Active
              </span>
            </div>

            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {FINCEPT_AGENTS.map((agent) => {
                const isSelected = selectedAgent.id === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`w-full text-left rounded-xl p-3.5 transition-all border ${
                      isSelected
                        ? "border-amber-500 bg-amber-500/15 shadow-md"
                        : "border-stone-800/80 bg-stone-900/50 hover:border-stone-700 hover:bg-stone-850"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{agent.avatar}</span>
                        <div>
                          <div className="font-mono text-sm font-bold text-white flex items-center gap-2">
                            <span>{agent.name}</span>
                            <span className="rounded bg-stone-800 px-1.5 py-0.2 text-[9px] font-mono text-amber-400">
                              {agent.archetype}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1">{agent.title}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-amber-400 shrink-0" />}
                    </div>
                    <p className="mt-2 text-[11px] text-stone-300 line-clamp-2 leading-relaxed font-mono">
                      {agent.framework}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agent Deep Audit & Synthesis */}
          <div className="rounded-2xl border border-amber-500/40 bg-[#0a0703] p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{selectedAgent.avatar}</span>
                <div>
                  <h3 className="font-mono text-xl font-bold text-white flex items-center gap-2">
                    <span>{selectedAgent.name}</span>
                    <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] text-amber-300 font-mono">
                      {selectedAgent.archetype} Desk
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400 font-mono">{selectedAgent.title}</p>
                </div>
              </div>

              {/* Ticker Selector for Agent Audit */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-stone-400">Target Asset:</span>
                <select
                  value={agentTicker}
                  onChange={(e) => setAgentTicker(e.target.value)}
                  className="rounded-lg border border-amber-500/40 bg-stone-900 px-3 py-1.5 font-mono text-xs text-amber-300 focus:outline-none"
                >
                  {ASSETS.slice(0, 16).map((a) => (
                    <option key={a.symbol} value={a.symbol}>
                      ${a.symbol} — {a.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stance & Conviction Dial */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-3.5">
                <span className="text-[10px] font-mono uppercase text-stone-400">Agent Stance</span>
                <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
                  {agentEvaluation.stance}
                </p>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-3.5">
                <span className="text-[10px] font-mono uppercase text-stone-400">Conviction</span>
                <p className="mt-1 font-mono text-lg font-bold text-amber-400">
                  {agentEvaluation.conviction} / 100
                </p>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-3.5">
                <span className="text-[10px] font-mono uppercase text-stone-400">Spot Price</span>
                <p className="mt-1 font-mono text-lg font-bold text-white">
                  {fmtPrice(getAssetLastPrice(agentTicker))}
                </p>
              </div>
              <div className="rounded-xl border border-stone-800 bg-stone-950 p-3.5">
                <span className="text-[10px] font-mono uppercase text-stone-400">Framework Focus</span>
                <p className="mt-1 font-mono text-xs font-bold text-amber-300 truncate">
                  {selectedAgent.keyMetrics.slice(0, 2).join(", ")}
                </p>
              </div>
            </div>

            {/* Core Thesis Card */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                Deterministic Allocator Thesis
              </span>
              <p className="mt-2 text-xs sm:text-sm font-mono text-stone-200 leading-relaxed">
                {agentEvaluation.thesis}
              </p>
              <div className="mt-4 border-t border-amber-900/30 pt-3 flex items-center justify-between text-[11px] font-mono text-stone-400 italic">
                <span>&ldquo;{selectedAgent.quote}&rdquo;</span>
                <span className="text-amber-400 font-bold">— {selectedAgent.name}</span>
              </div>
            </div>

            {/* Catalysts vs Hazards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Identified Catalysts
                </span>
                <ul className="mt-3 space-y-2">
                  {agentEvaluation.catalysts.map((cat, i) => (
                    <li key={i} className="text-xs font-mono text-stone-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{cat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Key Hazards &amp; Invalidation
                </span>
                <ul className="mt-3 space-y-2">
                  {agentEvaluation.risks.map((risk, i) => (
                    <li key={i} className="text-xs font-mono text-stone-300 flex items-start gap-2">
                      <span className="text-red-400 font-bold">!</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => handleRunCommand(`agent ${selectedAgent.id} ${agentTicker}`)}
                className="rounded-lg bg-amber-500 px-4 py-2 font-mono text-xs font-bold text-stone-950 hover:bg-amber-400 transition"
              >
                Send to Fincept CLI &lt;GO&gt;
              </button>
              <button
                onClick={() => {
                  setOrderSymbol(agentTicker);
                  setActiveDesk("paper");
                }}
                className="rounded-lg border border-amber-500/40 bg-stone-900 px-4 py-2 font-mono text-xs text-amber-300 hover:bg-stone-850"
              >
                Route to Paper Trading Floor →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DESK 3: DCF VALUATION ENGINE */}
      {activeDesk === "dcf" && (
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1.6fr]">
          {/* DCF Parameter Controls */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-5">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <BarChart2 className="h-4 w-4 text-amber-400" />
                  Discounted Cash Flow (DCF) Inputs
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Gordon Growth Model &amp; 5-Year Explicit Horizon
                </p>
              </div>
              <select
                value={dcfInputs.symbol}
                onChange={(e) => {
                  const s = e.target.value;
                  const asset = ASSET_BY_SYMBOL[s] || ASSETS[0];
                  setDcfInputs((prev) => ({
                    ...prev,
                    symbol: s,
                    currentPrice: metricsFor(asset).last,
                    revenueBaseBillion: s === "NVDA" ? 115 : s === "AAPL" ? 395 : s === "MSFT" ? 245 : 60,
                    growthRatePct: s === "NVDA" ? 38 : s === "AAPL" ? 10 : 18,
                  }));
                }}
                className="rounded-lg border border-amber-500/40 bg-stone-900 px-3 py-1 font-mono text-xs text-amber-300"
              >
                {["NVDA", "AAPL", "MSFT", "AMZN", "GOOGL", "META", "TSLA"].map((sym) => (
                  <option key={sym} value={sym}>
                    ${sym}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">Revenue Base ($B):</span>
                  <span className="text-amber-400 font-bold">${dcfInputs.revenueBaseBillion}B</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="600"
                  step="5"
                  value={dcfInputs.revenueBaseBillion}
                  onChange={(e) =>
                    setDcfInputs((prev) => ({ ...prev, revenueBaseBillion: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">5-Yr Revenue CAGR (%):</span>
                  <span className="text-amber-400 font-bold">{dcfInputs.growthRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="70"
                  step="1"
                  value={dcfInputs.growthRatePct}
                  onChange={(e) =>
                    setDcfInputs((prev) => ({ ...prev, growthRatePct: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">Operating Margin (%):</span>
                  <span className="text-amber-400 font-bold">{dcfInputs.operatingMarginPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="75"
                  step="1"
                  value={dcfInputs.operatingMarginPct}
                  onChange={(e) =>
                    setDcfInputs((prev) => ({ ...prev, operatingMarginPct: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">Discount Rate (WACC %):</span>
                  <span className="text-amber-400 font-bold">{dcfInputs.waccPct}%</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="16"
                  step="0.1"
                  value={dcfInputs.waccPct}
                  onChange={(e) =>
                    setDcfInputs((prev) => ({ ...prev, waccPct: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-stone-300">Terminal Growth Rate (%):</span>
                  <span className="text-amber-400 font-bold">{dcfInputs.terminalGrowthPct}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="5.0"
                  step="0.1"
                  value={dcfInputs.terminalGrowthPct}
                  onChange={(e) =>
                    setDcfInputs((prev) => ({ ...prev, terminalGrowthPct: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* DCF Output Waterfall & Valuation */}
          <div className="rounded-2xl border border-amber-500/40 bg-[#080603] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-amber-900/40 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-stone-400">
                  Target Valuation Output
                </span>
                <h3 className="font-mono text-2xl font-bold text-white flex items-center gap-2">
                  <span>${dcfInputs.symbol} Intrinsic Value:</span>
                  <span className="text-amber-400 font-extrabold">
                    ${dcfResult.fairValuePerShare.toFixed(2)}
                  </span>
                </h3>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] uppercase text-stone-400">Current Market Price</span>
                <p className="text-sm font-bold text-stone-300">${dcfInputs.currentPrice.toFixed(2)}</p>
              </div>
            </div>

            {/* Valuation Spread & Margin of Safety */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`rounded-xl border p-4 font-mono ${
                  dcfResult.upsideDownsidePct >= 0
                    ? "border-emerald-500/40 bg-emerald-950/20"
                    : "border-red-500/40 bg-red-950/20"
                }`}
              >
                <span className="text-[10px] uppercase text-stone-400">Valuation Spread</span>
                <p
                  className={`mt-1 text-2xl font-bold ${
                    dcfResult.upsideDownsidePct >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {dcfResult.upsideDownsidePct >= 0 ? "+" : ""}
                  {dcfResult.upsideDownsidePct}%
                </p>
                <span className="text-[11px] text-stone-400">
                  {dcfResult.upsideDownsidePct >= 0 ? "Trading at a discount" : "Trading at a premium"}
                </span>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 font-mono">
                <span className="text-[10px] uppercase text-stone-400">Margin of Safety</span>
                <p className="mt-1 text-2xl font-bold text-amber-300">
                  {dcfResult.marginOfSafetyPct}%
                </p>
                <span className="text-[11px] text-stone-400">Benjamin Graham threshold</span>
              </div>
            </div>

            {/* 5-Year Cash Flow Waterfall Table */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                5-Year Projected Cash Flow Waterfall ($B)
              </span>
              <div className="mt-2 overflow-x-auto rounded-xl border border-stone-800">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-stone-900 text-stone-400">
                    <tr>
                      <th className="px-3 py-2">Year</th>
                      <th className="px-3 py-2">Revenue</th>
                      <th className="px-3 py-2">Free Cash Flow</th>
                      <th className="px-3 py-2">Discounted PV</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80 bg-stone-950">
                    {dcfResult.projectedFCF.map((fcf) => (
                      <tr key={fcf.year}>
                        <td className="px-3 py-2 text-amber-300">Year {fcf.year}</td>
                        <td className="px-3 py-2 text-white">${fcf.revenue}B</td>
                        <td className="px-3 py-2 text-emerald-400 font-bold">${fcf.fcf}B</td>
                        <td className="px-3 py-2 text-stone-300">${fcf.pv}B</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enterprise to Equity Bridge */}
            <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs space-y-1.5 text-stone-300">
              <div className="flex justify-between">
                <span>PV of Explicit 5-Year FCF:</span>
                <span className="text-white font-bold">${dcfResult.pvExplicitFCF}B</span>
              </div>
              <div className="flex justify-between">
                <span>PV of Terminal Value (Gordon Growth):</span>
                <span className="text-white font-bold">${dcfResult.pvTerminalValue}B</span>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-1.5">
                <span>Implied Enterprise Value (EV):</span>
                <span className="text-amber-400 font-bold">${dcfResult.enterpriseValue}B</span>
              </div>
              <div className="flex justify-between">
                <span>Net Debt (Net Cash):</span>
                <span className="text-emerald-400 font-bold">${dcfInputs.netDebtBillion}B</span>
              </div>
              <div className="flex justify-between border-t border-stone-800 pt-1.5 text-sm">
                <span className="font-bold text-white">Implied Equity Value:</span>
                <span className="text-amber-300 font-bold">${dcfResult.equityValue}B</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESK 4: OPTIONS & GREEKS */}
      {activeDesk === "options" && (
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1.7fr]">
          {/* Options Inputs */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-5">
            <div className="border-b border-stone-800 pb-3">
              <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-amber-400" />
                Black-Scholes Options Pricer
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Continuous log-normal price diffusion &amp; Greek sensitivities
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Stock Price ($):</span>
                  <span className="text-amber-400 font-bold">${optionsInputs.stockPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="1"
                  value={optionsInputs.stockPrice}
                  onChange={(e) =>
                    setOptionsInputs((prev) => ({ ...prev, stockPrice: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Strike Price ($):</span>
                  <span className="text-amber-400 font-bold">${optionsInputs.strikePrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="1"
                  value={optionsInputs.strikePrice}
                  onChange={(e) =>
                    setOptionsInputs((prev) => ({ ...prev, strikePrice: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Days to Expiry (DTE):</span>
                  <span className="text-amber-400 font-bold">{optionsInputs.timeToExpiryDays} days</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="365"
                  step="1"
                  value={optionsInputs.timeToExpiryDays}
                  onChange={(e) =>
                    setOptionsInputs((prev) => ({
                      ...prev,
                      timeToExpiryDays: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Implied Volatility (%):</span>
                  <span className="text-amber-400 font-bold">{optionsInputs.volatilityPct}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  step="1"
                  value={optionsInputs.volatilityPct}
                  onChange={(e) =>
                    setOptionsInputs((prev) => ({ ...prev, volatilityPct: parseFloat(e.target.value) }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>

              <div>
                <div className="flex justify-between">
                  <span className="text-stone-300">Risk-Free Rate (%):</span>
                  <span className="text-amber-400 font-bold">{optionsInputs.riskFreeRatePct}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="7.0"
                  step="0.1"
                  value={optionsInputs.riskFreeRatePct}
                  onChange={(e) =>
                    setOptionsInputs((prev) => ({
                      ...prev,
                      riskFreeRatePct: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-amber-500 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Theoretical Prices & The Greeks */}
          <div className="rounded-2xl border border-amber-500/40 bg-[#080603] p-6 space-y-6">
            <div className="border-b border-amber-900/40 pb-4">
              <span className="text-[10px] font-mono uppercase text-stone-400">
                Options Valuation Output
              </span>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-4 font-mono">
                  <span className="text-xs text-emerald-400 font-bold uppercase">Call Premium</span>
                  <p className="mt-1 text-3xl font-extrabold text-white">
                    ${optionsResult.callPrice.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-stone-400">
                    Delta: +{optionsResult.callDelta}
                  </span>
                </div>

                <div className="rounded-xl border border-red-500/40 bg-red-950/20 p-4 font-mono">
                  <span className="text-xs text-red-400 font-bold uppercase">Put Premium</span>
                  <p className="mt-1 text-3xl font-extrabold text-white">
                    ${optionsResult.putPrice.toFixed(2)}
                  </p>
                  <span className="text-[11px] text-stone-400">
                    Delta: {optionsResult.putDelta}
                  </span>
                </div>
              </div>
            </div>

            {/* The Greeks Sensitivity Matrix */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400">
                The Greeks Analytical Sensitivities
              </span>
              <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Delta (&Delta;)</span>
                  <p className="mt-1 text-sm font-bold text-white">
                    Call: {optionsResult.callDelta}
                  </p>
                  <span className="text-[10px] text-stone-500">Hedge ratio</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Gamma (&Gamma;)</span>
                  <p className="mt-1 text-sm font-bold text-amber-300">
                    {optionsResult.gamma}
                  </p>
                  <span className="text-[10px] text-stone-500">Delta curvature</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Vega (&nu;)</span>
                  <p className="mt-1 text-sm font-bold text-emerald-400">
                    ${optionsResult.vega}
                  </p>
                  <span className="text-[10px] text-stone-500">Per 1% IV shift</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Theta (&Theta;)</span>
                  <p className="mt-1 text-sm font-bold text-red-400">
                    -${Math.abs(optionsResult.thetaCall)}/d
                  </p>
                  <span className="text-[10px] text-stone-500">Daily time decay</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Rho (&rho;)</span>
                  <p className="mt-1 text-sm font-bold text-stone-300">
                    +${optionsResult.rhoCall}
                  </p>
                  <span className="text-[10px] text-stone-500">Per 1% rate shift</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950 p-3">
                  <span className="text-stone-400">Moneyness</span>
                  <p className="mt-1 text-sm font-bold text-amber-400">
                    {optionsInputs.stockPrice > optionsInputs.strikePrice
                      ? "ITM (In-The-Money)"
                      : optionsInputs.stockPrice === optionsInputs.strikePrice
                      ? "ATM (At-The-Money)"
                      : "OTM (Out-of-Money)"}
                  </p>
                  <span className="text-[10px] text-stone-500">Strike relation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESK 5: PAPER TRADING & EXECUTION */}
      {activeDesk === "paper" && (
        <div className="space-y-6">
          {/* Portfolio Metric Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 font-mono">
              <span className="text-[10px] uppercase text-stone-400">Total Portfolio Net Worth</span>
              <p className="mt-1 text-2xl font-bold text-white">{fmtPrice(totalPortfolioValue)}</p>
              <span className="text-[11px] text-stone-500">Initial: $100,000.00</span>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 font-mono">
              <span className="text-[10px] uppercase text-stone-400">Cash Purchasing Power</span>
              <p className="mt-1 text-2xl font-bold text-amber-400">{fmtPrice(cashBalance)}</p>
              <span className="text-[11px] text-stone-500">Unsettled Cash: $0.00</span>
            </div>
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4 font-mono">
              <span className="text-[10px] uppercase text-stone-400">Invested Long Equities</span>
              <p className="mt-1 text-2xl font-bold text-stone-200">{fmtPrice(totalPositionsValue)}</p>
              <span className="text-[11px] text-stone-500">{positions.length} Active Positions</span>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 font-mono">
              <span className="text-[10px] uppercase text-stone-400">Unrealized PnL</span>
              <p className="mt-1 text-2xl font-bold text-emerald-400">
                +{fmtPrice(totalUnrealizedPnL)}
              </p>
              <span className="text-[11px] text-emerald-300">
                +{(totalUnrealizedPnL / (totalPortfolioValue - totalUnrealizedPnL) * 100).toFixed(2)}%
              </span>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_1.8fr]">
            {/* Order Placement Form */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 space-y-4">
              <div className="border-b border-stone-800 pb-3">
                <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  Place Paper Trade Order
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Zero commission virtual execution with live quote fill
                </p>
              </div>

              <form onSubmit={handleExecutePaperOrder} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="text-stone-300 block mb-1">Asset Symbol</label>
                  <select
                    value={orderSymbol}
                    onChange={(e) => setOrderSymbol(e.target.value)}
                    className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-white"
                  >
                    {ASSETS.slice(0, 18).map((a) => (
                      <option key={a.symbol} value={a.symbol}>
                        ${a.symbol} ({a.name}) — {fmtPrice(metricsFor(a).last)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-stone-300 block mb-1">Order Side</label>
                    <div className="grid grid-cols-2 gap-1 rounded-lg border border-stone-800 p-1 bg-stone-900">
                      <button
                        type="button"
                        onClick={() => setOrderSide("BUY")}
                        className={`rounded py-1.5 font-bold transition ${
                          orderSide === "BUY"
                            ? "bg-emerald-500 text-stone-950"
                            : "text-stone-400 hover:text-white"
                        }`}
                      >
                        BUY
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderSide("SELL")}
                        className={`rounded py-1.5 font-bold transition ${
                          orderSide === "SELL"
                            ? "bg-red-500 text-white"
                            : "text-stone-400 hover:text-white"
                        }`}
                      >
                        SELL
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-stone-300 block mb-1">Shares / Units</label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={orderShares}
                      onChange={(e) => setOrderShares(parseInt(e.target.value, 10) || 1)}
                      className="w-full rounded-lg border border-stone-700 bg-stone-900 px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3 space-y-1 text-stone-400">
                  <div className="flex justify-between">
                    <span>Estimated Fill Price:</span>
                    <span className="text-white font-bold">
                      {fmtPrice(getAssetLastPrice(orderSymbol))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Notional Cost:</span>
                    <span className="text-amber-400 font-bold">
                      {fmtPrice(getAssetLastPrice(orderSymbol) * orderShares)}
                    </span>
                  </div>
                </div>

                {orderFeedback && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-2.5 text-amber-300 text-[11px]">
                    {orderFeedback}
                  </div>
                )}

                <button
                  type="submit"
                  className={`w-full rounded-xl py-3 font-mono text-xs font-bold transition ${
                    orderSide === "BUY"
                      ? "bg-emerald-500 text-stone-950 hover:bg-emerald-400"
                      : "bg-red-500 text-white hover:bg-red-400"
                  }`}
                >
                  Confirm &amp; Transmit Paper Order &lt;GO&gt;
                </button>
              </form>
            </div>

            {/* Active Positions Ledger */}
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 space-y-4">
              <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-base font-bold text-white">Active Positions Ledger</h3>
                  <p className="text-xs text-stone-400 font-mono">
                    Real-time marked to market with live quote updates
                  </p>
                </div>
                <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-mono text-amber-400">
                  {positions.length} Open
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-stone-900 text-stone-400">
                    <tr>
                      <th className="px-3 py-2">Symbol</th>
                      <th className="px-3 py-2">Side</th>
                      <th className="px-3 py-2">Units</th>
                      <th className="px-3 py-2">Entry</th>
                      <th className="px-3 py-2">Current</th>
                      <th className="px-3 py-2 text-right">PnL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80">
                    {positions.map((pos) => {
                      const curPrice = getAssetLastPrice(pos.symbol, pos.currentPrice);
                      const pnl = (curPrice - pos.entryPrice) * pos.shares;
                      const pnlPct = ((curPrice - pos.entryPrice) / pos.entryPrice) * 100;
                      return (
                        <tr key={pos.symbol} className="hover:bg-stone-900/40">
                          <td className="px-3 py-2 font-bold text-white">${pos.symbol}</td>
                          <td className="px-3 py-2">
                            <span className="rounded bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 text-[10px]">
                              {pos.side}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-stone-300">{pos.shares}</td>
                          <td className="px-3 py-2 text-stone-400">{fmtPrice(pos.entryPrice)}</td>
                          <td className="px-3 py-2 text-white font-bold">{fmtPrice(curPrice)}</td>
                          <td
                            className={`px-3 py-2 text-right font-bold ${
                              pnl >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {pnl >= 0 ? "+" : ""}
                            {fmtPrice(pnl)} ({pnlPct.toFixed(1)}%)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DESK 6: 100+ DATA FEEDS & MARITIME CHOKEPOINTS */}
      {activeDesk === "connectors" && (
        <div className="space-y-6">
          {/* Maritime Chokepoint Global Supply Chain Radar */}
          <div className="rounded-2xl border border-amber-500/40 bg-[#0a0703] p-6 space-y-4">
            <div className="border-b border-amber-900/40 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <Ship className="h-4 w-4 text-amber-400" />
                  Global Maritime Chokepoint &amp; Supply Chain Radar
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Satellite vessel tracking at critical trade bottlenecks
                </p>
              </div>
              <span className="rounded-full bg-red-500/15 border border-red-500/30 px-2.5 py-0.5 text-[10px] font-mono text-red-300">
                Red Sea &amp; Hormuz Active Watch
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {MARITIME_CHOKEPOINTS.map((choke) => (
                <div
                  key={choke.name}
                  className="rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{choke.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                        choke.status === "Normal"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : choke.status === "Elevated Risk"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-red-500/15 text-red-400"
                      }`}
                    >
                      {choke.status}
                    </span>
                  </div>
                  <p className="text-stone-400 text-[11px]">{choke.location}</p>
                  <div className="border-t border-stone-800 pt-2 space-y-1 text-stone-300">
                    <div className="flex justify-between">
                      <span>Share of Global Trade:</span>
                      <span className="text-amber-400 font-bold">
                        {choke.transitShareWorldTradePct}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vessels in Queue:</span>
                      <span className="text-white font-bold">{choke.vesselsWaiting}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Delay:</span>
                      <span className="text-stone-300 font-bold">{choke.avgWaitHours} hrs</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500 pt-1">
                    Commodities: {choke.keyCommodities.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 100+ Data Connectors Catalog */}
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-6 space-y-4">
            <div className="border-b border-stone-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                  <Database className="h-4 w-4 text-amber-400" />
                  Fincept 100+ Data Connectors Telemetry
                </h3>
                <p className="text-xs text-stone-400 font-mono">
                  Standardized REST, WebSocket &amp; gRPC endpoints across sovereign &amp; market feeds
                </p>
              </div>
              <span className="rounded bg-emerald-500/15 text-emerald-400 px-2 py-0.5 text-[10px] font-mono">
                12 / 12 Feeds Operational
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FINCEPT_DATA_CONNECTORS.map((conn) => (
                <div
                  key={conn.id}
                  className="rounded-xl border border-stone-800 bg-stone-900/40 p-4 font-mono text-xs space-y-2 hover:border-amber-500/40 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-300">{conn.name}</span>
                    <span className="rounded bg-stone-800 px-1.5 py-0.2 text-[9px] text-stone-400">
                      {conn.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-stone-400 text-[11px] leading-relaxed line-clamp-2">
                    {conn.description}
                  </p>
                  <div className="flex items-center justify-between border-t border-stone-800 pt-2 text-[10px] text-stone-500">
                    <span>{conn.category}</span>
                    <span className="text-amber-400">{conn.endpointCount} Endpoints</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DESK 7: VISUAL STRATEGY NODE CANVAS */}
      {activeDesk === "node" && (
        <div className="rounded-2xl border border-amber-500/40 bg-[#080603] p-6 space-y-6">
          <div className="border-b border-amber-900/40 pb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase text-amber-400">
                Fincept Visual Node Engine
              </span>
              <h3 className="font-mono text-xl font-bold text-white flex items-center gap-2">
                <Workflow className="h-4 w-4 text-amber-400" />
                Strategy Pipeline &amp; Factor Discovery Graph
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Composable pipeline: Ingestion &rarr; Signal Filter &rarr; AI Consensus &rarr; Order Routing
              </p>
            </div>
            <button
              onClick={() => {
                setNodeSteps((prev) =>
                  prev.map((s, idx) => (idx === 4 ? { ...s, status: "Active", active: true } : s))
                );
              }}
              className="rounded-xl bg-amber-500 px-4 py-2 font-mono text-xs font-bold text-stone-950 hover:bg-amber-400 transition flex items-center gap-2"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Simulate Pipeline Execution</span>
            </button>
          </div>

          {/* Node Flow Diagram */}
          <div className="grid gap-4 sm:grid-cols-5">
            {nodeSteps.map((node, i) => (
              <div
                key={node.id}
                className={`relative rounded-xl border p-4 font-mono text-xs space-y-2 transition-all ${
                  node.active
                    ? "border-amber-500/60 bg-amber-500/10 shadow-lg shadow-amber-500/10"
                    : "border-stone-800 bg-stone-950 text-stone-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-bold ${
                      node.active ? "text-amber-300" : "text-stone-400"
                    }`}
                  >
                    {node.title}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[9px] font-bold ${
                      node.status === "Active"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-stone-300">{node.desc}</p>
                {i < nodeSteps.length - 1 && (
                  <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-amber-400">
                    &rarr;
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Code Generated by Visual Node Workflow */}
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-4 font-mono text-xs">
            <div className="flex items-center justify-between text-stone-400 pb-2 border-b border-stone-800">
              <span className="text-amber-400 font-bold">Generated Embedded Python 3.11 Script:</span>
              <span className="text-[10px]">Embedded in C++20 Core</span>
            </div>
            <pre className="mt-3 text-stone-300 leading-relaxed text-xs overflow-x-auto">
{`from fincept import Terminal, AgentPool, RiskEngine

# 1. Initialize Pipeline & Data Connectors
terminal = Terminal.connect(["fred", "polygon", "edgar"])
universe = terminal.get_equity_universe(["NVDA", "AAPL", "MSFT", "BTC"])

# 2. Apply Technical & Quant Volatility Filter
candidates = universe.filter(lambda s: s.sma20 > s.sma50 and s.realized_vol < 0.50)

# 3. Solicit Consensus from Buffett & Simons Agents
consensus = AgentPool.evaluate(["buffett", "simons"], candidates)

# 4. Enforce Invalidation Stop & Maximum Notional Cap
orders = RiskEngine.size_positions(consensus, max_risk_pct=1.5, stop_loss="invalidation_level")

# 5. Route to Paper Trading Venue
print(f"Executing {len(orders)} institutional orders with zero slippage.")`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
