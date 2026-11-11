"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { ASSETS, ASSET_BY_SYMBOL, metricsFor, type Asset } from "@/lib/market";
import { GOLD_NEWS_ITEMS } from "@/lib/gold-news-100";
import WhopBadge from "@/components/whop-badge";
import {
  Maximize2,
  Minimize2,
  Terminal,
  Volume2,
  VolumeX,
  TrendingUp,
  TrendingDown,
  Activity,
  Send,
  MessageSquare,
  BarChart2,
  Layers,
  HelpCircle,
  Command,
  ArrowUpRight,
  ArrowDownRight,
  Monitor,
  Tv,
  Keyboard,
  Clock,
  Play,
  Pause,
  ExternalLink,
} from "lucide-react";

interface CandlePoint {
  time: string;
  price: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  vwap: number;
}

interface OrderBookLevel {
  price: number;
  size: number;
  total: number;
  pct: number;
}

interface TapePrint {
  id: string;
  time: string;
  price: number;
  size: number;
  side: "BUY" | "SELL";
}

export default function BloombergTerminal() {
  const [activeSymbol, setActiveSymbol] = useState("NVDA");
  const [commandInput, setCommandInput] = useState("NVDA US Equity GIP <GO>");
  const [deskViewMode, setDeskViewMode] = useState<"dual" | "screen1" | "screen2">("dual");
  const [chartMode, setChartMode] = useState<"mountain" | "candle" | "bar">("mountain");
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"1-MAIN" | "2-NEWS" | "3-CHART" | "4-L2" | "5-IB">("1-MAIN");

  const activeAsset: Asset = ASSET_BY_SYMBOL[activeSymbol] || ASSETS[0];
  const metrics = metricsFor(activeAsset);

  // High frequency live tick simulation
  const [livePrice, setLivePrice] = useState(metrics.last);
  const [priceFlash, setPriceFlash] = useState<"up" | "down" | null>(null);

  // Time & Sales Tape
  const [tape, setTape] = useState<TapePrint[]>([
    { id: "t1", time: "10:24:18", price: metrics.last, size: 450, side: "BUY" },
    { id: "t2", time: "10:24:19", price: metrics.last - 0.02, size: 1200, side: "SELL" },
    { id: "t3", time: "10:24:21", price: metrics.last + 0.03, size: 850, side: "BUY" },
    { id: "t4", time: "10:24:22", price: metrics.last + 0.04, size: 2300, side: "BUY" },
  ]);

  // Terminal audio synthesizer sound
  const playTerminalBeep = (freq = 880, duration = 0.08) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  useEffect(() => {
    setLivePrice(metrics.last);
  }, [metrics.last]);

  // Real-time market tick generator
  useEffect(() => {
    const timer = setInterval(() => {
      const delta = (Math.random() - 0.49) * (activeAsset.base * 0.0015);
      setLivePrice((prev) => {
        const next = Math.max(activeAsset.base * 0.5, prev + delta);
        const isUp = next >= prev;
        setPriceFlash(isUp ? "up" : "down");
        setTimeout(() => setPriceFlash(null), 600);

        // Add to tape
        const newPrint: TapePrint = {
          id: String(Date.now()),
          time: new Date().toLocaleTimeString("en-US", { hour12: false }),
          price: next,
          size: Math.floor(100 + Math.random() * 2400),
          side: isUp ? "BUY" : "SELL",
        };
        setTape((prevTape) => [newPrint, ...prevTape.slice(0, 14)]);

        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [activeAsset]);

  // High-frequency intraday mountain curve data modeled directly after the photo
  const chartPoints: CandlePoint[] = useMemo(() => {
    const base = metrics.last;
    const pointsCount = 48;
    const points: CandlePoint[] = [];
    let current = base * 0.96;

    for (let i = 0; i < pointsCount; i++) {
      // Simulate that dramatic mid-session plunge and sharp recovery from photo
      let shock = 0;
      if (i > 22 && i < 34) {
        // Sudden drop
        shock = -base * 0.028 * Math.sin(((i - 22) / 12) * Math.PI);
      } else if (i >= 34) {
        // Recovery rebound
        shock = base * 0.012 * Math.sin(((i - 34) / 14) * Math.PI);
      }

      const noise = (Math.sin(i * 0.8) * 0.5 + (Math.random() - 0.5)) * (base * 0.006);
      current = Math.max(base * 0.75, current + noise + shock);

      const hour = Math.floor(9 + (i * 7) / pointsCount);
      const min = Math.floor(((i * 7 * 60) / pointsCount) % 60);
      const timeStr = `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;

      const open = current - (Math.random() - 0.5) * (base * 0.003);
      const close = current;
      const high = Math.max(open, close) + Math.random() * (base * 0.004);
      const low = Math.min(open, close) - Math.random() * (base * 0.004);
      const volume = Math.floor(50000 + Math.random() * 280000);

      points.push({
        time: timeStr,
        price: current,
        open,
        high,
        low,
        close: i === pointsCount - 1 ? livePrice : close,
        volume,
        vwap: base * 0.985,
      });
    }

    return points;
  }, [activeSymbol, metrics.last, livePrice]);

  // Level 2 Order Book Depth Ladder
  const { bids, asks } = useMemo(() => {
    const cur = livePrice;
    const bidList: OrderBookLevel[] = [];
    const askList: OrderBookLevel[] = [];
    let cumBid = 0;
    let cumAsk = 0;

    for (let i = 1; i <= 8; i++) {
      const bidP = cur - i * 0.02;
      const bidSz = Math.floor(1200 + Math.random() * 4500 * (10 - i));
      cumBid += bidSz;
      bidList.push({ price: bidP, size: bidSz, total: cumBid, pct: Math.min(100, (cumBid / 25000) * 100) });

      const askP = cur + i * 0.02;
      const askSz = Math.floor(1100 + Math.random() * 4200 * (10 - i));
      cumAsk += askSz;
      askList.push({ price: askP, size: askSz, total: cumAsk, pct: Math.min(100, (cumAsk / 25000) * 100) });
    }

    return { bids: bidList, asks: askList };
  }, [livePrice]);

  // Terminal Command Execution
  const executeCommand = (cmd: string) => {
    playTerminalBeep(920, 0.07);
    const trimmed = cmd.toUpperCase().trim();
    const parts = trimmed.split(/\s+/);
    const candidate = parts[0]?.replace("$", "");

    if (candidate && ASSET_BY_SYMBOL[candidate]) {
      setActiveSymbol(candidate);
    }

    if (trimmed.includes("GIP") || trimmed.includes("GP")) {
      setActiveTab("3-CHART");
    } else if (trimmed.includes("NEWS") || trimmed.includes("TOP") || trimmed.includes("N")) {
      setActiveTab("2-NEWS");
    } else if (trimmed.includes("L2") || trimmed.includes("DOM")) {
      setActiveTab("4-L2");
    } else if (trimmed.includes("IB") || trimmed.includes("CHAT")) {
      setActiveTab("5-IB");
    }
  };

  // Dimensions for Chart Rendering
  const chartHeight = 270;
  const chartWidth = 540;
  const paddingY = 24;
  const paddingX = 36;

  const minPrice = Math.min(...chartPoints.map((c) => c.low)) * 0.996;
  const maxPrice = Math.max(...chartPoints.map((c) => c.high)) * 1.004;
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minPrice) / priceRange) * (chartHeight - paddingY * 2);
  };

  const getX = (index: number) => {
    return paddingX + (index / (chartPoints.length - 1)) * (chartWidth - paddingX * 2);
  };

  // SVG Area path for mountain fill
  const mountainAreaPath = useMemo(() => {
    const coords = chartPoints.map((c, i) => `${getX(i)},${getY(c.price)}`).join(" L ");
    return `M ${getX(0)},${chartHeight - paddingY} L ${coords} L ${getX(chartPoints.length - 1)},${chartHeight - paddingY} Z`;
  }, [chartPoints]);

  const mountainLinePath = useMemo(() => {
    return `M ${chartPoints.map((c, i) => `${getX(i)},${getY(c.price)}`).join(" L ")}`;
  }, [chartPoints]);

  return (
    <div className="w-full bg-[#030712] text-[#ff8800] font-mono select-none">
      {/* 1. TOP GLOBAL WORKSTATION STATUS STRIP */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-[#ff8800]/50 bg-[#000000] px-4 py-2 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#00ff66] animate-pulse" />
            <span className="font-black text-[#ff8800] tracking-widest text-sm">
              PROFESSIONAL FINANCIAL TERMINAL
            </span>
          </div>
          <span className="text-stone-600 hidden sm:inline">|</span>
          <span className="text-xs text-[#00e5ff] font-bold hidden md:inline">
            SYSTEM CORE: NEW YORK METRO DESK [NY-DC04]
          </span>
          <span className="rounded bg-[#ff8800]/20 border border-[#ff8800]/40 px-2 py-0.5 text-[10px] text-[#ffcc00] font-bold">
            TERMINAL ID: 3824-INSTITUTIONAL ($28,500/YR)
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden lg:flex items-center gap-3 text-stone-400 text-[11px]">
            <span>NYC: <strong className="text-stone-200">10:24 EST</strong></span>
            <span>LON: <strong className="text-stone-200">15:24 GMT</strong></span>
            <span>TKO: <strong className="text-stone-200">00:24 JST</strong></span>
          </div>

          <div className="flex items-center gap-1.5 border-l border-stone-800 pl-3">
            <button
              onClick={() => setDeskViewMode("dual")}
              className={`rounded px-2 py-0.5 text-[11px] font-bold transition ${
                deskViewMode === "dual" ? "bg-[#ff8800] text-black" : "text-stone-400 hover:text-white"
              }`}
              title="Dual Screen Workstation (Exact match with photo)"
            >
              DUAL MONITOR (PHOTO)
            </button>
            <button
              onClick={() => setDeskViewMode("screen1")}
              className={`rounded px-2 py-0.5 text-[11px] font-bold transition ${
                deskViewMode === "screen1" ? "bg-[#00ff66] text-black" : "text-stone-400 hover:text-white"
              }`}
            >
              SCREEN 1
            </button>
            <button
              onClick={() => setDeskViewMode("screen2")}
              className={`rounded px-2 py-0.5 text-[11px] font-bold transition ${
                deskViewMode === "screen2" ? "bg-[#00e5ff] text-black" : "text-stone-400 hover:text-white"
              }`}
            >
              SCREEN 2
            </button>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-stone-400 hover:text-[#ff8800] ml-1"
              title={soundEnabled ? "Mute Terminal Beeps" : "Enable Terminal Audio Beeps"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-[#00ff66]" /> : <VolumeX className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DUAL MONITOR CONTAINER (MATCHING PHOTO HARDWARE BEZELS) */}
      <div className="p-2 sm:p-4 bg-[#0a0a0a]">
        <div className="grid gap-4 xl:grid-cols-2">
          {/* =========================================================================
              MONITOR 1 (LEFT SCREEN IN PHOTO: BLOOMBERG NEWS & TECHNICAL MOUNTAIN CHART)
              ========================================================================= */}
          {(deskViewMode === "dual" || deskViewMode === "screen1") && (
            <div className="rounded-xl border-4 border-[#1f2937] bg-[#000000] p-1.5 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col justify-between">
              {/* Monitor 1 Title Bar */}
              <div className="flex items-center justify-between border-b border-[#374151] bg-[#111827] px-3 py-1.5 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#ff8800]" />
                  <span className="font-bold tracking-wider text-[#ff8800]">
                    Terminal [Display 1 - News &amp; GIP Intraday Chart]
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#00ff66] font-bold">&lt;F8 EQUITY&gt;</span>
                  <span className="text-[#ffcc00] font-bold">{activeSymbol} US Equity</span>
                </div>
              </div>

              {/* Monitor 1 Command Bar */}
              <div className="flex items-center gap-2 bg-[#050505] p-2 border-b border-[#ff8800]/30">
                <span className="text-[#00ff66] font-black text-xs">&lt;CMD&gt;</span>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") executeCommand(commandInput);
                  }}
                  className="flex-1 rounded bg-[#0a0a0a] border border-[#ff8800]/50 px-2.5 py-1 text-xs text-[#00ff66] font-mono uppercase focus:outline-none focus:border-[#00ff66]"
                />
                <button
                  onClick={() => executeCommand(commandInput)}
                  className="rounded bg-[#00ff66] hover:bg-[#00e5ff] px-3 py-1 text-xs font-black text-black uppercase transition"
                >
                  &lt;GO&gt;
                </button>
              </div>

              {/* Screen 1 Inner Split: Left Column News Wire, Right Column GIP Mountain Chart */}
              <div className="grid lg:grid-cols-[1.05fr_1.15fr] gap-2 p-2 bg-[#020617] flex-1">
                {/* LEFT COLUMN: BLOOMBERG REAL-TIME NEWS WIRE (TOP / N) */}
                <div className="rounded border border-[#ff8800]/40 bg-[#000000] p-2 flex flex-col justify-between overflow-hidden">
                  <div className="border-b border-[#ff8800]/40 pb-1.5 mb-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-[#ff8800] uppercase tracking-wider">
                      TOP STORIES: GENERAL NEWS &amp; MARKETS
                    </span>
                    <span className="text-[10px] text-[#ff3333] font-bold animate-pulse">● LIVE WIRE</span>
                  </div>

                  <div className="space-y-2 h-[340px] overflow-y-auto pr-1 text-xs font-mono scrollbar-thin">
                    {GOLD_NEWS_ITEMS.slice(0, 12).map((news, i) => (
                      <div
                        key={news.id}
                        onClick={() => {
                          setSelectedNewsId(news.id);
                          executeCommand(`${news.symbol} US Equity GIP <GO>`);
                        }}
                        className={`cursor-pointer rounded p-2 border transition ${
                          selectedNewsId === news.id
                            ? "bg-[#ff8800]/15 border-[#ff8800] text-white"
                            : "bg-[#09090b] border-stone-800 hover:border-[#ff8800]/50 hover:bg-[#111]"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="text-[#00e5ff] font-bold">${news.symbol}</span>
                          <span className="text-stone-500 font-mono">
                            {news.timestampOffsetMinutes}m ago · {news.source.split(" ")[0]}
                          </span>
                        </div>
                        <p className="mt-1 text-[#ffb000] font-bold text-[11px] leading-tight line-clamp-2">
                          {news.headline}
                        </p>
                        <div className="mt-1.5 flex items-center justify-between text-[10px]">
                          <span className="text-stone-400 text-[10px]">{news.category}</span>
                          <span
                            className={`rounded px-1.5 py-0.2 font-bold ${
                              news.action === "BUY"
                                ? "bg-emerald-500/20 text-[#00ff66]"
                                : news.action === "TRIM" || news.action === "AVOID"
                                ? "bg-rose-500/20 text-[#ff3333]"
                                : "bg-amber-500/20 text-[#ffcc00]"
                            }`}
                          >
                            {news.action}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#ff8800]/30 pt-1.5 mt-2 flex items-center justify-between text-[10px] text-stone-400">
                    <span>100 TOTAL DOSSIERS ACTIVE</span>
                    <span className="text-[#00ff66]">TYPE &lt;NEWS&gt; FOR FULL FEED</span>
                  </div>
                </div>

                {/* RIGHT COLUMN: GIP TECHNICAL MOUNTAIN CHART (EXACT PHOTO REPLICA) */}
                <div className="rounded border border-[#ff8800]/40 bg-[#000511] p-2 flex flex-col justify-between">
                  {/* Chart Header Meta */}
                  <div className="border-b border-stone-800 pb-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-[#ffcc00] text-sm tracking-wide">
                        {activeSymbol} US Equity GIP
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-black font-mono ${
                            priceFlash === "up" ? "text-[#00ff66]" : priceFlash === "down" ? "text-[#ff3333]" : "text-white"
                          }`}
                        >
                          ${livePrice.toFixed(2)}
                        </span>
                        <span className={`text-[11px] font-bold ${metrics.change24h >= 0 ? "text-[#00ff66]" : "text-[#ff3333]"}`}>
                          {metrics.change24h >= 0 ? `+${metrics.change24h.toFixed(2)}%` : `${metrics.change24h.toFixed(2)}%`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-stone-400 mt-0.5">
                      <span>RANGE: 20-NOV-24 TO 21-NOV-24</span>
                      <span>PERIOD: 1D INTRADAY</span>
                      <span>VWAP: ${(metrics.last * 0.985).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* SVG Chart Pane */}
                  <div className="relative my-2 select-none">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto cursor-crosshair">
                      <defs>
                        {/* Deep Navy/Cyan Gradient Fill from the photo */}
                        <linearGradient id="photoMountainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
                          <stop offset="60%" stopColor="#1e40af" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#031024" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>

                      {/* Deep Grid Lines */}
                      {[0.2, 0.4, 0.6, 0.8].map((pct) => {
                        const y = paddingY + pct * (chartHeight - paddingY * 2);
                        const val = maxPrice - pct * priceRange;
                        return (
                          <g key={pct}>
                            <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="#092244" strokeDasharray="3 3" />
                            <text x={chartWidth - paddingX + 4} y={y + 3} fill="#0284c7" fontSize="8" fontFamily="monospace">
                              ${val.toFixed(1)}
                            </text>
                          </g>
                        );
                      })}

                      {/* Vertical Time Lines */}
                      {[0.25, 0.5, 0.75].map((pct) => {
                        const x = paddingX + pct * (chartWidth - paddingX * 2);
                        return <line key={pct} x1={x} y1={paddingY} x2={x} y2={chartHeight - paddingY} stroke="#092244" strokeDasharray="2 2" />;
                      })}

                      {/* Filled Mountain Area (The iconic blue/cyan plunge in the photo) */}
                      <path d={mountainAreaPath} fill="url(#photoMountainGrad)" />

                      {/* Mountain Top Boundary Line */}
                      <path d={mountainLinePath} fill="none" stroke="#38bdf8" strokeWidth="2.2" />

                      {/* Orange Technical Support / Invalidation Line from photo */}
                      <line
                        x1={paddingX}
                        y1={getY(Math.min(metrics.sma20, metrics.sma50) * 0.975)}
                        x2={chartWidth - paddingX}
                        y2={getY(Math.min(metrics.sma20, metrics.sma50) * 0.975)}
                        stroke="#ff8800"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      <text
                        x={paddingX + 6}
                        y={getY(Math.min(metrics.sma20, metrics.sma50) * 0.975) - 4}
                        fill="#ff8800"
                        fontSize="8"
                        fontWeight="bold"
                      >
                        SUPPORT STOP: ${(Math.min(metrics.sma20, metrics.sma50) * 0.975).toFixed(2)}
                      </text>

                      {/* Current Tick Dot */}
                      <circle
                        cx={getX(chartPoints.length - 1)}
                        cy={getY(chartPoints[chartPoints.length - 1].price)}
                        r="4"
                        fill="#00ff66"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    </svg>

                    {/* Chart Bottom Time Labels */}
                    <div className="flex justify-between px-8 text-[9px] text-[#0284c7] font-mono">
                      <span>09:30</span>
                      <span>11:00</span>
                      <span>13:00</span>
                      <span>15:00</span>
                      <span>16:00</span>
                    </div>
                  </div>

                  {/* Quick Indicator Toggles */}
                  <div className="flex items-center justify-between border-t border-stone-800 pt-1 text-[10px]">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setChartMode("mountain")}
                        className={`rounded px-1.5 py-0.5 ${chartMode === "mountain" ? "bg-[#0284c7] text-white" : "text-stone-400"}`}
                      >
                        MOUNTAIN (PHOTO)
                      </button>
                      <button
                        onClick={() => setChartMode("candle")}
                        className={`rounded px-1.5 py-0.5 ${chartMode === "candle" ? "bg-[#00ff66] text-black" : "text-stone-400"}`}
                      >
                        CANDLES
                      </button>
                    </div>
                    <span className="text-[#00ff66] font-bold">RSI: {metrics.rsi.toFixed(1)} · VOL: 42.1M</span>
                  </div>
                </div>
              </div>

              {/* Monitor 1 Bezel Brand Mark (Matching Photo) */}
              <div className="border-t border-[#1f2937] py-1 text-center bg-[#111827] text-[10px] tracking-widest text-stone-500 font-bold uppercase">
                NEXTWALL QUANTITATIVE · TERMINAL DISPLAY 1
              </div>
            </div>
          )}

          {/* =========================================================================
              MONITOR 2 (RIGHT SCREEN IN PHOTO: MARKET MATRIX, WEIF & LEVEL 2 ORDER DEPTH)
              ========================================================================= */}
          {(deskViewMode === "dual" || deskViewMode === "screen2") && (
            <div className="rounded-xl border-4 border-[#1f2937] bg-[#000000] p-1.5 shadow-[0_0_40px_rgba(0,0,0,0.9)] flex flex-col justify-between">
              {/* Monitor 2 Title Bar */}
              <div className="flex items-center justify-between border-b border-[#374151] bg-[#111827] px-3 py-1.5 text-xs text-stone-300">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00ff66]" />
                  <span className="font-bold tracking-wider text-[#00ff66]">
                    Terminal [Display 2 - WEIF Matrix &amp; Level 2 Order Book]
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="text-[#ff8800] font-bold">&lt;DOM DEPTH&gt;</span>
                  <span className="text-[#00e5ff] font-bold">L2 TICKER TAPE</span>
                </div>
              </div>

              {/* Screen 2 Workspace Split */}
              <div className="grid grid-rows-[0.9fr_1.3fr] gap-2 p-2 bg-[#020617] flex-1">
                {/* TOP HALF: WORLD EQUITY INDEX & MARKET MONITOR (WEI / WEIF) */}
                <div className="rounded border border-[#ff8800]/40 bg-[#000000] p-2 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-[#ff8800]/40 pb-1 mb-2">
                    <span className="text-xs font-bold text-[#ffcc00] uppercase tracking-wider">
                      WEIF - WORLD EQUITY &amp; COMMODITY MATRIX
                    </span>
                    <span className="text-[10px] text-[#00ff66] font-mono">TICK-BY-TICK STREAM</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs font-mono">
                    {[
                      { sym: "ES1", name: "S&P 500 FUT", px: "5,985.40", chg: "+0.84%", up: true },
                      { sym: "NQ1", name: "NASDAQ 100", px: "21,420.20", chg: "+1.35%", up: true },
                      { sym: "TNX", name: "10Y YIELD", px: "4.28%", chg: "-0.04%", up: false },
                      { sym: "XBT", name: "BITCOIN", px: "$94,250", chg: "+3.80%", up: true },
                      { sym: "XAU", name: "GOLD BULLION", px: "$2,680.50", chg: "+0.65%", up: true },
                      { sym: "CL1", name: "WTI CRUDE", px: "$68.40", chg: "-1.85%", up: false },
                      { sym: "EUR", name: "EUR/USD", px: "1.0542", chg: "+0.18%", up: true },
                      { sym: "DXY", name: "DOLLAR INDEX", px: "105.80", chg: "+0.22%", up: true },
                    ].map((item) => (
                      <div
                        key={item.sym}
                        onClick={() => {
                          if (item.sym === "XBT") setActiveSymbol("BTC");
                          else if (item.sym === "XAU") setActiveSymbol("XAU");
                          else setActiveSymbol("NVDA");
                        }}
                        className="cursor-pointer rounded bg-[#09090b] p-1.5 border border-stone-800 hover:border-[#ff8800]/60 transition"
                      >
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="font-bold text-white">{item.sym}</span>
                          <span className="text-[9px] text-stone-500">{item.name}</span>
                        </div>
                        <div className="flex items-baseline justify-between mt-0.5">
                          <span className="text-stone-200 font-bold">{item.px}</span>
                          <span className={item.up ? "text-[#00ff66] font-bold" : "text-[#ff3333] font-bold"}>
                            {item.chg}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BOTTOM HALF: LEVEL 2 ORDER BOOK (DOM) & TIME & SALES TAPE (MATCHING PHOTO MATRIX) */}
                <div className="grid sm:grid-cols-[1.2fr_0.8fr] gap-2">
                  {/* LEVEL 2 DEPTH LADDER */}
                  <div className="rounded border border-[#ff8800]/40 bg-[#000000] p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-[#ff8800]/30 pb-1 mb-1 text-[10px]">
                      <span className="font-bold text-[#00ff66]">BID DEPTH (BUY ORDERS)</span>
                      <span className="font-bold text-[#ff3333]">ASK DEPTH (SELL ORDERS)</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] font-mono">
                      {/* Bids Column */}
                      <div className="space-y-1">
                        {bids.map((b, i) => (
                          <div key={i} className="relative rounded bg-emerald-950/20 px-1.5 py-0.5 flex justify-between overflow-hidden">
                            <div className="absolute inset-y-0 right-0 bg-[#00ff66]/25" style={{ width: `${b.pct}%` }} />
                            <span className="relative z-10 text-[#00ff66] font-bold">${b.price.toFixed(2)}</span>
                            <span className="relative z-10 text-stone-300">{b.size.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Asks Column */}
                      <div className="space-y-1">
                        {asks.map((a, i) => (
                          <div key={i} className="relative rounded bg-rose-950/20 px-1.5 py-0.5 flex justify-between overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-[#ff3333]/25" style={{ width: `${a.pct}%` }} />
                            <span className="relative z-10 text-stone-300">{a.size.toLocaleString()}</span>
                            <span className="relative z-10 text-[#ff3333] font-bold">${a.price.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-stone-800 pt-1 mt-1 flex items-center justify-between text-[9px] text-stone-400">
                      <span>SPREAD: $0.04</span>
                      <span className="text-[#ffcc00]">TOTAL DEPTH: 48,200 SHARES</span>
                    </div>
                  </div>

                  {/* TIME & SALES LIVE TAPE */}
                  <div className="rounded border border-[#ff8800]/40 bg-[#000000] p-2 flex flex-col justify-between">
                    <div className="flex items-center justify-between border-b border-[#ff8800]/30 pb-1 mb-1 text-[10px]">
                      <span className="font-bold text-[#00e5ff]">TIME &amp; SALES (TAPE)</span>
                      <span className="text-stone-500">EXCH: NMS</span>
                    </div>

                    <div className="space-y-1 text-[10px] font-mono h-[145px] overflow-y-auto pr-0.5">
                      {tape.map((t) => (
                        <div key={t.id} className="flex items-center justify-between border-b border-stone-900 pb-0.5">
                          <span className="text-stone-500">{t.time}</span>
                          <span className={t.side === "BUY" ? "text-[#00ff66] font-bold" : "text-[#ff3333] font-bold"}>
                            ${t.price.toFixed(2)}
                          </span>
                          <span className="text-stone-300 font-mono">{t.size}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-stone-800 pt-1 text-[9px] text-stone-400 text-center">
                      PRINT RATE: 42 ORDERS/SEC
                    </div>
                  </div>
                </div>
              </div>

              {/* Monitor 2 Bezel Brand Mark (Matching Photo) */}
              <div className="border-t border-[#1f2937] py-1 text-center bg-[#111827] text-[10px] tracking-widest text-stone-500 font-bold uppercase">
                NEXTWALL QUANTITATIVE · TERMINAL DISPLAY 2
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          3. AUTHENTIC PHYSICAL HARDWARE KEYBOARD DECK (PROMINENT IN PHOTO FOREGROUND)
          ========================================================================= */}
      {showKeyboard && (
        <div className="border-t-2 border-[#ff8800]/60 bg-[#0d0d0d] px-4 py-3 shadow-2xl">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-[#ff8800]" />
                <span className="text-xs font-black uppercase tracking-wider text-[#ffcc00]">
                  TERMINAL SPECIALTY HARDWARE KEYBOARD (CLICKABLE)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-500 hidden sm:inline">
                  Interactive hardware key simulation with instant function triggers
                </span>
                <button
                  onClick={() => setShowKeyboard(false)}
                  className="text-stone-400 hover:text-white text-xs"
                >
                  [Hide]
                </button>
              </div>
            </div>

            {/* Keyboard Keys Layout */}
            <div className="grid gap-1.5 p-2 rounded-xl bg-[#000000] border border-[#ff8800]/30 shadow-inner">
              {/* Row 1: Function / Market Asset Keys (Yellow/Orange) */}
              <div className="flex flex-wrap gap-1">
                {[
                  { key: "HELP", color: "bg-[#00e5ff] text-black" },
                  { key: "GOVT", color: "bg-[#ffcc00] text-black" },
                  { key: "CORP", color: "bg-[#ff8800] text-black" },
                  { key: "MTGE", color: "bg-[#00ff66] text-black" },
                  { key: "M-MKT", color: "bg-[#ff3333] text-white" },
                  { key: "MUNI", color: "bg-[#a855f7] text-white" },
                  { key: "PFD", color: "bg-[#ec4899] text-white" },
                  { key: "EQUITY", color: "bg-[#00ff66] text-black" },
                  { key: "CMDTY", color: "bg-[#ff8800] text-black" },
                  { key: "INDEX", color: "bg-[#00e5ff] text-black" },
                  { key: "CURNCY", color: "bg-[#ffcc00] text-black" },
                  { key: "CLIENT", color: "bg-white text-black" },
                ].map((k) => (
                  <button
                    key={k.key}
                    onClick={() => {
                      if (k.key === "EQUITY") executeCommand("NVDA US Equity GIP <GO>");
                      else if (k.key === "CURNCY") executeCommand("BTC <CURNCY> GIP <GO>");
                      else if (k.key === "CMDTY") executeCommand("XAU <CMDTY> GIP <GO>");
                      else executeCommand(`${k.key} <GO>`);
                    }}
                    className={`flex-1 min-w-[50px] sm:min-w-[70px] py-1.5 rounded text-[10px] sm:text-xs font-black uppercase tracking-wider shadow active:scale-95 transition ${k.color}`}
                  >
                    &lt;{k.key}&gt;
                  </button>
                ))}
              </div>

              {/* Row 2: Navigation & Action Keys (Green GO, Red CANCEL, Amber TOOLS) */}
              <div className="flex flex-wrap gap-1">
                {[
                  { label: "CANCEL", action: "CANCEL", color: "bg-[#ff3333] text-white" },
                  { label: "NEWS", action: "NEWS <GO>", color: "bg-[#ff8800] text-black" },
                  { label: "TOP", action: "TOP <GO>", color: "bg-[#ff8800] text-black" },
                  { label: "GIP (CHART)", action: "GIP <GO>", color: "bg-[#0284c7] text-white" },
                  { label: "DES (FACTS)", action: "DES <GO>", color: "bg-[#ffcc00] text-black" },
                  { label: "L2 (DEPTH)", action: "L2 <GO>", color: "bg-[#a855f7] text-white" },
                  { label: "IB (CHAT)", action: "IB <GO>", color: "bg-[#00e5ff] text-black" },
                  { label: "WEIF", action: "WEIF <GO>", color: "bg-[#ff8800] text-black" },
                  { label: "PRINT", action: "PRINT", color: "bg-stone-700 text-stone-200" },
                  { label: "MENU", action: "MENU", color: "bg-[#00ff66] text-black" },
                  { label: "<GO>", action: "GO", color: "bg-[#00ff66] text-black font-black flex-[1.5]" },
                ].map((k) => (
                  <button
                    key={k.label}
                    onClick={() => {
                      if (k.action === "GO") executeCommand(commandInput);
                      else executeCommand(k.action);
                    }}
                    className={`flex-1 min-w-[60px] sm:min-w-[85px] py-2 rounded text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow active:scale-95 transition ${k.color}`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Closed Keyboard Re-open Tab */}
      {!showKeyboard && (
        <div className="bg-[#0a0a0a] border-t border-stone-800 px-4 py-1.5 flex justify-end">
          <button
            onClick={() => setShowKeyboard(true)}
            className="text-[11px] font-bold text-[#ff8800] hover:underline flex items-center gap-1.5"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>Open Terminal Specialty Hardware Keyboard Deck</span>
          </button>
        </div>
      )}
    </div>
  );
}
