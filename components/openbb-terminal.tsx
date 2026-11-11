"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Terminal,
  Activity,
  TrendingUp,
  ShieldAlert,
  PieChart,
  BarChart2,
  DollarSign,
  Cpu,
  Layers,
  Play,
  RotateCcw,
  Sliders,
  CheckCircle2,
  ExternalLink,
  Code2,
  Copy,
  Check,
  ChevronRight,
  Database,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  OPENBB_YIELD_CURVE,
  OPENBB_MACRO_INDICATORS,
  OPENBB_DARKPOOL_ITEMS,
  calculateOpenBBVaR,
  generateMonteCarloPaths,
  computeOpenBBEfficientFrontier,
  executeOpenBBCommand,
  type OpenBBCommandResult,
} from "@/lib/openbb-platform";
import { ASSETS } from "@/lib/market";
import WhopBadge from "@/components/whop-badge";

type WorkspaceTab = "cli" | "quant-var" | "macro-yield" | "portfolio" | "darkpool";

export default function OpenBBTerminal() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>("cli");

  // CLI State
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLogs, setTerminalLogs] = useState<OpenBBCommandResult[]>([
    {
      command: "welcome",
      type: "text",
      title: "OpenBB Open Data Platform (ODP) v4.3.0",
      content:
        "Connected to NextWall Street high-frequency quantitative engine.\nConsolidates 2,000+ asset real-time feeds, US Treasury constant-maturity yields, and portfolio risk models.\nType 'help' or click any command preset below to inspect.",
      pythonCodeSnippet:
        'from openbb import obb\n# Query multi-asset universe\noutput = obb.equity.price.historical("NVDA")\nprint(output.to_dataframe())',
    },
  ]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Quant VaR State
  const [selectedSymbol, setSelectedSymbol] = useState("NVDA");
  const [confidence, setConfidence] = useState<0.95 | 0.99>(0.95);
  const [horizonDays, setHorizonDays] = useState(1);
  const [varResult, setVarResult] = useState(() => calculateOpenBBVaR("NVDA", 0.95, 1));
  const [monteCarloPaths, setMonteCarloPaths] = useState(() =>
    generateMonteCarloPaths("NVDA", 187.4, 30)
  );

  // Portfolio Optimizer State
  const [basketSymbols, setBasketSymbols] = useState<string[]>(["NVDA", "AAPL", "MSFT", "BTC", "SOL"]);
  const [frontierData, setFrontierData] = useState(() => computeOpenBBEfficientFrontier(basketSymbols));

  useEffect(() => {
    const res = calculateOpenBBVaR(selectedSymbol, confidence, horizonDays);
    setVarResult(res);
    setMonteCarloPaths(generateMonteCarloPaths(selectedSymbol, res.price, 30));
  }, [selectedSymbol, confidence, horizonDays]);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const handleRunCommand = (cmdToRun?: string) => {
    const target = cmdToRun !== undefined ? cmdToRun : commandInput;
    if (!target.trim()) return;

    if (target.trim().toLowerCase() === "clear" || target.trim().toLowerCase() === "/clear") {
      setTerminalLogs([]);
      setCommandInput("");
      return;
    }

    const result = executeOpenBBCommand(target);
    setTerminalLogs((prev) => [...prev, result]);
    setCommandHistory((prev) => [...prev, target]);
    setHistoryIndex(-1);
    setCommandInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleRunCommand();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const nextIdx = historyIndex + 1 < commandHistory.length ? historyIndex + 1 : historyIndex;
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setCommandInput(commandHistory[commandHistory.length - 1 - nextIdx] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommandInput("");
      }
    }
  };

  const copyCode = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top OpenBB Header Bar */}
      <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-[#07131b] via-[#091824] to-[#040d14] p-6 shadow-2xl backdrop-blur">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-cyan-900/40 pb-6">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded bg-cyan-500/10 border border-cyan-500/40 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                <Database className="h-3.5 w-3.5 text-cyan-400" />
                OPEN DATA PLATFORM · OPENBB
              </span>
              <span className="text-xs text-stone-400 font-mono">
                Connect Once, Consume Everywhere · Python &amp; CLI SDK
              </span>
              <WhopBadge size="xs" />
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-mono text-stone-100 font-bold tracking-tight flex items-center gap-2">
              <span>OpenBB Quantitative Workspace</span>
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-stone-400 max-w-3xl leading-relaxed font-mono">
              Direct open-source quant infrastructure ported from{" "}
              <a
                href="https://github.com/openbq-org/OpenBB"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                github.com/openbq-org/OpenBB <ExternalLink className="h-3 w-3" />
              </a>
              . Full command-line terminal, parametric Value at Risk (VaR), Markowitz Efficient Frontier optimizer, US Treasury yield curve analytics, and institutional dark pool flow.
            </p>
          </div>

          {/* Quick Platform Status */}
          <div className="rounded-xl border border-cyan-500/30 bg-[#061622]/90 p-4 max-w-md w-full shrink-0">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-stone-400">OpenBB Engine:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Live ODP v4.3.0
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono border-t border-cyan-900/40 pt-2">
              <span className="text-stone-400">Universe Stream:</span>
              <span className="text-cyan-300">2,038 Tickers (Equities, Crypto, Memes)</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs font-mono border-t border-cyan-900/40 pt-2">
              <span className="text-stone-400">Risk Model:</span>
              <span className="text-amber-300">Fat-Tailed Student-t + Monte Carlo</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: "cli", label: "CLI Console (obb)", icon: Terminal },
            { id: "quant-var", label: "Quantitative Risk & VaR", icon: ShieldAlert },
            { id: "macro-yield", label: "Macro & Yield Curve", icon: Activity },
            { id: "portfolio", label: "Markowitz Portfolio Optimizer", icon: PieChart },
            { id: "darkpool", label: "Dark Pool & Flow Radar", icon: Layers },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as WorkspaceTab)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-mono font-medium transition ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                    : "text-stone-400 hover:text-stone-200 hover:bg-[#061520] border border-transparent"
                }`}
              >
                <Icon className="h-3.5 w-3.5 text-cyan-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: CLI WORKSTATION */}
      {activeTab === "cli" && (
        <div className="space-y-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-stone-400">Quick Commands:</span>
            {[
              "/equity/price NVDA",
              "/equity/darkpool AAPL",
              "/economy/yieldcurve",
              "/economy/macro",
              "/quant/var TSLA",
              "/portfolio/optimize",
              "obb.equity.price('NVDA')",
              "/help",
            ].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleRunCommand(cmd)}
                className="rounded-md border border-cyan-900/50 bg-[#061826] px-2.5 py-1 text-[11px] text-cyan-300 hover:border-cyan-500 hover:bg-cyan-500/10 transition"
              >
                {cmd}
              </button>
            ))}
            <button
              onClick={() => handleRunCommand("clear")}
              className="rounded-md border border-stone-800 bg-stone-900 px-2 py-1 text-[11px] text-stone-400 hover:text-stone-200"
            >
              Clear
            </button>
          </div>

          {/* Interactive Terminal Window */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#02090e] p-5 shadow-2xl font-mono text-xs">
            {/* Window header */}
            <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-stone-400 text-[11px]">
                  openbb@nextwall-workstation:~ (python 3.11 · obb 4.3)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-stone-500">
                <span>UTF-8</span>
                <span>bash / openbb-cli</span>
              </div>
            </div>

            {/* Scrollable Output Stream */}
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="space-y-2 border-b border-cyan-950/40 pb-4">
                  {log.command !== "welcome" && (
                    <div className="flex items-center gap-2 text-cyan-400">
                      <span className="text-stone-500">OpenBB&gt;</span>
                      <span className="font-bold">{log.command}</span>
                    </div>
                  )}

                  {log.title && (
                    <div className="text-cyan-300 font-bold tracking-wide">{log.title}</div>
                  )}

                  <div className="text-stone-300 whitespace-pre-wrap leading-relaxed">
                    {log.content}
                  </div>

                  {log.tableData && log.tableData.length > 0 && (
                    <div className="overflow-x-auto rounded-lg border border-cyan-900/40 bg-[#05131d] mt-2">
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-cyan-900/40 bg-cyan-950/40 text-cyan-300">
                            {Object.keys(log.tableData[0]).map((col) => (
                              <th key={col} className="p-2 font-semibold">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-cyan-950/40">
                          {log.tableData.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-cyan-950/20">
                              {Object.values(row).map((val, cIdx) => (
                                <td key={cIdx} className="p-2 text-stone-200">
                                  {String(val)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {log.pythonCodeSnippet && (
                    <div className="relative mt-2 rounded-lg border border-stone-800 bg-black/60 p-3">
                      <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                        <span className="flex items-center gap-1 text-cyan-400">
                          <Code2 className="h-3 w-3" /> Python SDK Snippet
                        </span>
                        <button
                          onClick={() => copyCode(log.pythonCodeSnippet!, idx)}
                          className="hover:text-stone-200 flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <Check className="h-3 w-3 text-emerald-400" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="text-emerald-400/90 text-[11px] overflow-x-auto">
                        {log.pythonCodeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
              <div ref={logEndRef} />
            </div>

            {/* Input Line */}
            <div className="mt-4 flex items-center gap-2 border-t border-cyan-950 pt-3">
              <span className="text-cyan-400 font-bold shrink-0">OpenBB&gt;</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type command (e.g. /equity/price NVDA, /quant/var BTC, /economy/yieldcurve, help)..."
                className="flex-1 bg-transparent text-stone-100 placeholder-stone-600 focus:outline-none text-xs font-mono"
              />
              <button
                onClick={() => handleRunCommand()}
                className="rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold px-3 py-1 text-xs shrink-0 flex items-center gap-1"
              >
                <span>RUN</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUANTITATIVE RISK & VAR */}
      {activeTab === "quant-var" && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="rounded-xl border border-stone-800 bg-[#06141f] p-4 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="text-stone-400">Select Asset:</span>
              <select
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="rounded-lg border border-cyan-900 bg-[#0a1f2e] px-3 py-1.5 text-stone-100 font-bold focus:outline-none focus:border-cyan-500"
              >
                <optgroup label="S&P 500 / Large Tech">
                  <option value="NVDA">NVDA - NVIDIA Corp ($187.40)</option>
                  <option value="AAPL">AAPL - Apple Inc ($242.10)</option>
                  <option value="MSFT">MSFT - Microsoft Corp ($415.80)</option>
                  <option value="TSLA">TSLA - Tesla Inc ($348.60)</option>
                  <option value="PLTR">PLTR - Palantir Tech ($76.50)</option>
                  <option value="AMD">AMD - Advanced Micro Devices ($124.80)</option>
                </optgroup>
                <optgroup label="Crypto Assets">
                  <option value="BTC">BTC - Bitcoin ($88,400.00)</option>
                  <option value="ETH">ETH - Ethereum ($2,640.00)</option>
                  <option value="SOL">SOL - Solana ($184.50)</option>
                </optgroup>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-stone-400">Confidence:</span>
                <div className="inline-flex rounded-lg border border-stone-800 bg-stone-900 p-0.5">
                  <button
                    onClick={() => setConfidence(0.95)}
                    className={`rounded px-2.5 py-1 ${
                      confidence === 0.95 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-stone-400"
                    }`}
                  >
                    95%
                  </button>
                  <button
                    onClick={() => setConfidence(0.99)}
                    className={`rounded px-2.5 py-1 ${
                      confidence === 0.99 ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-stone-400"
                    }`}
                  >
                    99% (Extreme)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-stone-400">Horizon:</span>
                <div className="inline-flex rounded-lg border border-stone-800 bg-stone-900 p-0.5">
                  {[1, 5, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => setHorizonDays(d)}
                      className={`rounded px-2 py-1 ${
                        horizonDays === d ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-stone-400"
                      }`}
                    >
                      {d}D
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4 VaR Metrics Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-mono">
            <div className="rounded-xl border border-cyan-500/30 bg-[#051522] p-4">
              <span className="text-[11px] text-cyan-400 uppercase tracking-wider">
                Parametric Gaussian VaR
              </span>
              <p className="mt-2 text-2xl font-bold text-rose-400">
                -{varResult.parametricVaRPercent}%
              </p>
              <p className="mt-1 text-xs text-stone-400">
                -${varResult.parametricVaRDollar} per 1 share
              </p>
              <p className="mt-2 text-[10px] text-stone-500">Normal distribution assumption</p>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-[#051522] p-4">
              <span className="text-[11px] text-amber-400 uppercase tracking-wider">
                Historical (Fat-Tailed) VaR
              </span>
              <p className="mt-2 text-2xl font-bold text-amber-400">
                -{varResult.historicalVaRPercent}%
              </p>
              <p className="mt-1 text-xs text-stone-400">
                -${varResult.historicalVaRDollar} per 1 share
              </p>
              <p className="mt-2 text-[10px] text-stone-500">Student-t kurtosis adjusted</p>
            </div>

            <div className="rounded-xl border border-rose-500/30 bg-[#051522] p-4">
              <span className="text-[11px] text-rose-400 uppercase tracking-wider">
                Expected Shortfall (CVaR)
              </span>
              <p className="mt-2 text-2xl font-bold text-rose-300">
                -{varResult.expectedShortfallPercent}%
              </p>
              <p className="mt-1 text-xs text-stone-400">
                -${varResult.expectedShortfallDollar} tail loss
              </p>
              <p className="mt-2 text-[10px] text-stone-500">Average loss beyond VaR threshold</p>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-[#051522] p-4">
              <span className="text-[11px] text-emerald-400 uppercase tracking-wider">
                Risk-Adjusted Ratios
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xs text-stone-400">Sharpe:</span>
                <span className="text-xl font-bold text-emerald-400">{varResult.sharpeRatio}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-xs">
                <span className="text-stone-400">Sortino:</span>
                <span className="text-stone-200">{varResult.sortinoRatio}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between text-xs">
                <span className="text-stone-400">Beta to SPY:</span>
                <span className="text-cyan-300">{varResult.betaToSPY}</span>
              </div>
            </div>
          </div>

          {/* 30-Day Monte Carlo Simulation Chart */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#030d14] p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-4">
              <div>
                <h3 className="text-lg font-mono font-bold text-stone-100 flex items-center gap-2">
                  <span>OpenBB Monte Carlo 30-Day Geometric Brownian Motion Simulation</span>
                </h3>
                <p className="text-xs text-stone-400 font-mono mt-1">
                  1,000 simulated price paths across 5th (tail stop), 25th, 50th (median), 75th, and 95th percentiles.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> 95th Percentile
                </span>
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" /> 50th Median
                </span>
                <span className="flex items-center gap-1.5 text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" /> 5th Tail Risk
                </span>
              </div>
            </div>

            {/* SVG Envelope Chart */}
            <div className="mt-6 h-64 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 800 240">
                {/* Grid Lines */}
                <line x1="50" y1="20" x2="780" y2="20" stroke="#0a253a" strokeDasharray="3 3" />
                <line x1="50" y1="70" x2="780" y2="70" stroke="#0a253a" strokeDasharray="3 3" />
                <line x1="50" y1="120" x2="780" y2="120" stroke="#0a253a" strokeDasharray="3 3" />
                <line x1="50" y1="170" x2="780" y2="170" stroke="#0a253a" strokeDasharray="3 3" />
                <line x1="50" y1="220" x2="780" y2="220" stroke="#0a253a" />

                {/* Shaded 5th to 95th Confidence Fan */}
                <polygon
                  fill="rgba(6, 182, 212, 0.08)"
                  points={`
                    ${monteCarloPaths.map((p, i) => `${50 + (i * 730) / 30},${220 - ((p.p95 - monteCarloPaths[30].p05 * 0.9) / (monteCarloPaths[30].p95 * 1.1 - monteCarloPaths[30].p05 * 0.9)) * 200}`).join(" ")}
                    ${[...monteCarloPaths].reverse().map((p, i) => `${50 + ((30 - i) * 730) / 30},${220 - ((p.p05 - monteCarloPaths[30].p05 * 0.9) / (monteCarloPaths[30].p95 * 1.1 - monteCarloPaths[30].p05 * 0.9)) * 200}`).join(" ")}
                  `}
                />

                {/* 95th Percentile Path (Green) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  points={monteCarloPaths
                    .map(
                      (p, i) =>
                        `${50 + (i * 730) / 30},${
                          220 -
                          ((p.p95 - monteCarloPaths[30].p05 * 0.9) /
                            (monteCarloPaths[30].p95 * 1.1 - monteCarloPaths[30].p05 * 0.9)) *
                            200
                        }`
                    )
                    .join(" ")}
                />

                {/* 50th Median Path (Cyan) */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  points={monteCarloPaths
                    .map(
                      (p, i) =>
                        `${50 + (i * 730) / 30},${
                          220 -
                          ((p.p50 - monteCarloPaths[30].p05 * 0.9) /
                            (monteCarloPaths[30].p95 * 1.1 - monteCarloPaths[30].p05 * 0.9)) *
                            200
                        }`
                    )
                    .join(" ")}
                />

                {/* 5th Percentile Path (Red) */}
                <polyline
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                  points={monteCarloPaths
                    .map(
                      (p, i) =>
                        `${50 + (i * 730) / 30},${
                          220 -
                          ((p.p05 - monteCarloPaths[30].p05 * 0.9) /
                            (monteCarloPaths[30].p95 * 1.1 - monteCarloPaths[30].p05 * 0.9)) *
                            200
                        }`
                    )
                    .join(" ")}
                />
              </svg>
            </div>

            {/* Path Key Values */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 border-t border-cyan-950 pt-4 text-xs font-mono">
              <div>
                <span className="text-stone-500">Day 0 (Initial):</span>
                <p className="text-stone-200 font-bold">${varResult.price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-rose-400">Day 30 (p05):</span>
                <p className="text-rose-400 font-bold">${monteCarloPaths[30].p05.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-cyan-400">Day 30 (Median):</span>
                <p className="text-cyan-300 font-bold">${monteCarloPaths[30].p50.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-emerald-400">Day 30 (p95):</span>
                <p className="text-emerald-400 font-bold">${monteCarloPaths[30].p95.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-amber-400">Annual Vol:</span>
                <p className="text-amber-300 font-bold">{varResult.annualizedVol}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MACRO & YIELD CURVE */}
      {activeTab === "macro-yield" && (
        <div className="space-y-6">
          {/* Yield Curve Visualizer */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#030e17] p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-4">
              <div>
                <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                  FIXED INCOME &amp; TREASURY BENCHMARK
                </span>
                <h3 className="text-xl font-mono font-bold text-stone-100">
                  US Treasury Constant Maturity Yield Curve (1M - 30Y)
                </h3>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5 text-emerald-400">
                  10Y - 2Y Spread: <span className="font-bold">+16 bps</span> (Dis-inverted)
                </div>
              </div>
            </div>

            {/* Yield Curve SVG Plot */}
            <div className="mt-6 h-64 w-full">
              <svg className="h-full w-full overflow-visible" viewBox="0 0 800 240">
                {/* Horizontal reference lines */}
                {[5.5, 5.0, 4.5, 4.0, 3.5].map((level, i) => (
                  <g key={level}>
                    <line x1="40" y1={30 + i * 45} x2="780" y2={30 + i * 45} stroke="#092234" strokeDasharray="3 3" />
                    <text x="5" y={34 + i * 45} fill="#64748b" fontSize="10" fontFamily="monospace">
                      {level.toFixed(1)}%
                    </text>
                  </g>
                ))}

                {/* Previous curve (faint dash) */}
                <polyline
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  points={OPENBB_YIELD_CURVE.map(
                    (pt, idx) =>
                      `${60 + (idx * 700) / (OPENBB_YIELD_CURVE.length - 1)},${
                        210 - ((pt.previousRate - 3.5) / 2.0) * 180
                      }`
                  ).join(" ")}
                />

                {/* Current curve (cyan line) */}
                <polyline
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3"
                  points={OPENBB_YIELD_CURVE.map(
                    (pt, idx) =>
                      `${60 + (idx * 700) / (OPENBB_YIELD_CURVE.length - 1)},${
                        210 - ((pt.rate - 3.5) / 2.0) * 180
                      }`
                  ).join(" ")}
                />

                {/* Interactive Points */}
                {OPENBB_YIELD_CURVE.map((pt, idx) => {
                  const x = 60 + (idx * 700) / (OPENBB_YIELD_CURVE.length - 1);
                  const y = 210 - ((pt.rate - 3.5) / 2.0) * 180;
                  return (
                    <g key={pt.tenor}>
                      <circle cx={x} cy={y} r="5" fill="#06b6d4" stroke="#02090e" strokeWidth="2" />
                      <text x={x} y="235" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="monospace">
                        {pt.tenor}
                      </text>
                      <text x={x} y={y - 10} textAnchor="middle" fill="#22d3ee" fontSize="11" fontFamily="monospace" fontWeight="bold">
                        {pt.rate.toFixed(2)}%
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Macro Indicators Table */}
          <div className="rounded-2xl border border-cyan-500/30 bg-[#030e17] p-6 shadow-2xl">
            <h3 className="text-lg font-mono font-bold text-stone-100 mb-4">
              Core Macroeconomic &amp; Liquidity Dashboard (OpenBB Economy)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="border-b border-cyan-900/60 bg-cyan-950/30 text-cyan-300">
                    <th className="p-3 font-semibold">Macro Indicator</th>
                    <th className="p-3 font-semibold">Current Reading</th>
                    <th className="p-3 font-semibold">Previous</th>
                    <th className="p-3 font-semibold">Change</th>
                    <th className="p-3 font-semibold">Desk Bias</th>
                    <th className="p-3 font-semibold">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-950/40">
                  {OPENBB_MACRO_INDICATORS.map((m, idx) => (
                    <tr key={idx} className="hover:bg-cyan-950/20">
                      <td className="p-3 text-stone-100 font-bold">{m.metric}</td>
                      <td className="p-3 text-cyan-300 font-bold">{m.current}</td>
                      <td className="p-3 text-stone-400">{m.previous}</td>
                      <td className="p-3 text-stone-300">{m.change}</td>
                      <td className="p-3">
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            m.impact === "Bullish"
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                              : m.impact === "Bearish"
                              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                              : "bg-stone-800 text-stone-300"
                          }`}
                        >
                          {m.impact}
                        </span>
                      </td>
                      <td className="p-3 text-stone-500">{m.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MARKOWITZ PORTFOLIO OPTIMIZER */}
      {activeTab === "portfolio" && (
        <div className="space-y-6">
          {/* Frontier Chart and Allocations */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left: Frontier Curve */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#030e17] p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-cyan-950 pb-3 mb-4">
                <h3 className="font-mono font-bold text-stone-100 text-base">
                  Markowitz Mean-Variance Efficient Frontier
                </h3>
                <span className="text-[11px] font-mono text-cyan-400">
                  Max Sharpe: {frontierData.maxSharpePoint.sharpe}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono mb-4">
                Quadratic optimization across selected universe ({basketSymbols.join(", ")}).
              </p>

              <div className="h-60 w-full">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 400 200">
                  {/* Grid */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="#092234" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="#092234" strokeDasharray="3 3" />
                  <line x1="40" y1="180" x2="380" y2="180" stroke="#092234" />
                  <text x="5" y="105" fill="#64748b" fontSize="9" fontFamily="monospace">
                    Return
                  </text>
                  <text x="200" y="195" fill="#64748b" fontSize="9" fontFamily="monospace">
                    Risk (Volatility)
                  </text>

                  {/* Efficient Frontier Curve */}
                  <polyline
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    points={frontierData.frontier
                      .map((p) => {
                        const x = 50 + ((p.volatility - 10) / 32) * 320;
                        const y = 180 - ((p.expectedReturn - 8) / 26) * 160;
                        return `${x},${y}`;
                      })
                      .join(" ")}
                  />

                  {/* Min Variance Point */}
                  <circle
                    cx={50 + ((frontierData.minVariancePoint.volatility - 10) / 32) * 320}
                    cy={180 - ((frontierData.minVariancePoint.expectedReturn - 8) / 26) * 160}
                    r="5"
                    fill="#10b981"
                  />

                  {/* Max Sharpe Tangency Point */}
                  <circle
                    cx={50 + ((frontierData.maxSharpePoint.volatility - 10) / 32) * 320}
                    cy={180 - ((frontierData.maxSharpePoint.expectedReturn - 8) / 26) * 160}
                    r="6"
                    fill="#f59e0b"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono border-t border-cyan-950 pt-3">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" /> Min Volatility:{" "}
                  {frontierData.minVariancePoint.volatility}%
                </span>
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" /> Max Sharpe Return:{" "}
                  {frontierData.maxSharpePoint.expectedReturn}%
                </span>
              </div>
            </div>

            {/* Right: Allocation Weights Table */}
            <div className="rounded-2xl border border-cyan-500/30 bg-[#030e17] p-6 shadow-2xl">
              <h3 className="font-mono font-bold text-stone-100 text-base mb-4">
                Optimal Weights by Optimization Strategy
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-cyan-900/60 bg-cyan-950/30 text-cyan-300">
                      <th className="p-2.5">Asset</th>
                      <th className="p-2.5 text-amber-400">Max Sharpe</th>
                      <th className="p-2.5 text-emerald-400">Min Variance</th>
                      <th className="p-2.5 text-stone-400">Equal Weight</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-950/40">
                    {frontierData.allocations.map((a) => (
                      <tr key={a.symbol} className="hover:bg-cyan-950/20">
                        <td className="p-2.5 font-bold text-stone-100">
                          {a.symbol} <span className="text-[10px] text-stone-500 font-normal">(${a.currentPrice.toFixed(2)})</span>
                        </td>
                        <td className="p-2.5 font-bold text-amber-300">{a.maxSharpeWeight}%</td>
                        <td className="p-2.5 font-bold text-emerald-400">{a.minVarianceWeight}%</td>
                        <td className="p-2.5 text-stone-400">{a.equalWeight}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Python Code Export */}
              <div className="mt-6 rounded-lg border border-stone-800 bg-black/60 p-3 text-[11px] font-mono">
                <span className="text-cyan-400 font-semibold block mb-1">
                  Export to OpenBB Python Platform:
                </span>
                <pre className="text-stone-300 overflow-x-auto">
                  {`from openbb import obb
opt = obb.portfolio.optimize(
    symbols=${JSON.stringify(basketSymbols)},
    method="max_sharpe"
)
print(opt.weights)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: DARKPOOL & INSTITUTIONAL FLOW */}
      {activeTab === "darkpool" && (
        <div className="rounded-2xl border border-cyan-500/30 bg-[#030e17] p-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-950 pb-4 mb-6">
            <div>
              <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest">
                FINRA OTC &amp; OFF-EXCHANGE ORDER FLOW
              </span>
              <h3 className="text-xl font-mono font-bold text-stone-100">
                Institutional Dark Pool Volume &amp; Block Trade Delta
              </h3>
            </div>
            <span className="text-xs font-mono text-stone-400">Updated from SEC/FINRA ATS Reports</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-cyan-900/60 bg-cyan-950/30 text-cyan-300">
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Company Name</th>
                  <th className="p-3">Last Price</th>
                  <th className="p-3">Off-Exchange %</th>
                  <th className="p-3">FINRA Short Ratio</th>
                  <th className="p-3">Net Block Order Delta</th>
                  <th className="p-3">Institutional Flow Bias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-950/40">
                {OPENBB_DARKPOOL_ITEMS.map((item) => (
                  <tr key={item.symbol} className="hover:bg-cyan-950/20">
                    <td className="p-3 font-bold text-stone-100">{item.symbol}</td>
                    <td className="p-3 text-stone-400">{item.name}</td>
                    <td className="p-3 font-bold text-stone-200">${item.price.toFixed(2)}</td>
                    <td className="p-3 font-bold text-cyan-300">{item.darkpoolVolumePct}%</td>
                    <td className="p-3 text-stone-300">{item.shortVolumePct}%</td>
                    <td className="p-3">
                      <span
                        className={`font-bold ${
                          item.netBlockDeltaDollar >= 0 ? "text-emerald-400" : "text-rose-400"
                        }`}
                      >
                        {item.netBlockDeltaDollar >= 0 ? "+" : ""}$
                        {(item.netBlockDeltaDollar / 1e6).toFixed(1)}M
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded px-2.5 py-1 text-[10px] font-bold ${
                          item.sentiment === "Bullish Dark Flow"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                            : item.sentiment === "Institutional Distribution"
                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
                            : "bg-stone-800 text-stone-300"
                        }`}
                      >
                        {item.sentiment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
