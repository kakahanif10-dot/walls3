"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  Layers,
  Database,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Radio,
  Zap,
  BarChart3,
  Sliders,
  DollarSign,
  Info,
  Clock,
  Terminal,
  RefreshCw,
  Cpu,
  FileText,
  AlertCircle,
  Compass,
} from "lucide-react";
import {
  computeOracleXMarketInternals,
  computeLiquidityLadder,
  detectMarketDivergences,
  queryVectorMemory,
  BIST_EQUITIES,
  VECTOR_KNOWLEDGE_STORE,
  type OracleXRealm,
  type VectorRAGDocument,
  type LiquidityLevel,
} from "@/lib/oraclex-platform";
import { ASSETS, ASSET_BY_SYMBOL, fmtPrice, fmtPct, metricsFor } from "@/lib/market";
import WhopBadge from "@/components/whop-badge";

export default function OracleXTerminal() {
  const [realm, setRealm] = useState<OracleXRealm>("global");
  const [activeTab, setActiveTab] = useState<"internals" | "ladder" | "rag" | "divergence" | "bist">("internals");
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string>("BTC");
  const [ragQuery, setRagQuery] = useState<string>("");
  const [selectedDoc, setSelectedDoc] = useState<VectorRAGDocument | null>(VECTOR_KNOWLEDGE_STORE[0]);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Compute live internals & liquidity ladder
  const internals = useMemo(() => computeOracleXMarketInternals(), []);
  const liquidity = useMemo(() => computeLiquidityLadder(selectedAssetSymbol), [selectedAssetSymbol]);
  const divergences = useMemo(() => detectMarketDivergences(), []);
  const filteredDocs = useMemo(() => queryVectorMemory(ragQuery), [ragQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const currentAsset = ASSET_BY_SYMBOL[selectedAssetSymbol] || ASSETS[0];
  const currentMetrics = metricsFor(currentAsset);

  return (
    <div className="rounded-2xl border border-line bg-ink-950 p-4 sm:p-6 text-bone shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="flex flex-col gap-4 border-b border-line/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-md border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-wider text-cyan-300">
              <Compass className="h-3.5 w-3.5 text-cyan-400" />
              ORACLE-X TERMINAL
            </span>
            <span className="rounded-md border border-line bg-ink-900 px-2.5 py-0.5 text-[10px] font-mono text-muted">
              v2.4.0-RAG
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              ChromaDB Vector Store: Syncing
            </span>
            <WhopBadge />
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-display tracking-tight text-bone">
            Oracle-X Cross-Asset Intelligence
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Ported from <code className="text-cyan-300 font-mono">github.com/Yigtwxx/OracleX</code> — FastAPI + ChromaDB Vector RAG, Market Internals, Standing Liquidity Ladder &amp; Borsa İstanbul Realm.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Dual Realm Switcher */}
          <div className="flex rounded-lg border border-line bg-ink-900/90 p-1">
            <button
              onClick={() => {
                setRealm("global");
                if (activeTab === "bist") setActiveTab("internals");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                realm === "global"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm"
                  : "text-muted hover:text-bone"
              }`}
            >
              <Activity className="h-3.5 w-3.5" />
              Global Board (US + Crypto)
            </button>
            <button
              onClick={() => {
                setRealm("bist");
                setActiveTab("bist");
              }}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${
                realm === "bist"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm"
                  : "text-muted hover:text-bone"
              }`}
            >
              <Radio className="h-3.5 w-3.5" />
              Borsa İstanbul (BIST)
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-ink-900 px-3 py-2 text-xs font-mono text-muted hover:text-bone hover:border-gold/40 transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-cyan-400" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line/60 pb-3">
        {[
          { id: "internals", label: "Market Internals & A/D", icon: BarChart3 },
          { id: "ladder", label: "Liquidity Ladder (Leverage)", icon: Layers },
          { id: "rag", label: "ChromaDB Vector RAG", icon: Database },
          { id: "divergence", label: "Divergence Radar", icon: Zap },
          { id: "bist", label: "BIST & KAP Disclosures", icon: Radio },
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-gold/15 text-gold-bright border border-gold/40 shadow-sm"
                  : "bg-ink-900/60 text-muted hover:text-bone hover:bg-ink-900 border border-transparent"
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? "text-gold-bright" : "text-muted"}`} />
              <span>{t.label}</span>
              {t.id === "rag" && (
                <span className="rounded bg-cyan-950 px-1.5 py-0.2 text-[9px] font-mono text-cyan-300 border border-cyan-800">
                  RAG
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: MARKET INTERNALS & ADVANCE/DECLINE */}
      {activeTab === "internals" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-line bg-ink-900/60 p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Advance / Decline Ratio</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-bone">{internals.adRatio}</span>
                <span className="text-xs text-emerald-400 font-mono font-medium">
                  {internals.advanceCount} Up / {internals.declineCount} Down
                </span>
              </div>
              <div className="mt-3 flex h-1.5 w-full overflow-hidden rounded-full bg-red-950">
                <div
                  className="bg-emerald-400 transition-all duration-500"
                  style={{ width: `${(internals.advanceCount / (internals.advanceCount + internals.declineCount || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl border border-line bg-ink-900/60 p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Cap-Weighted vs Equal</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-bone">{fmtPct(internals.capWeightedChangePct / 100)}</span>
                <span className="text-xs text-muted font-mono">eq: {fmtPct(internals.equalWeightedChangePct / 100)}</span>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Mega-cap divergence premium: +{(internals.capWeightedChangePct - internals.equalWeightedChangePct).toFixed(2)}%
              </p>
            </div>

            <div className="rounded-xl border border-line bg-ink-900/60 p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">A/D Volume Ratio</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-cyan-300">{internals.advanceDeclineVolumeRatio}x</span>
                <span className="text-xs text-muted font-mono">Buy side dominant</span>
              </div>
              <p className="mt-2 text-[11px] text-emerald-400/90 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                Aggressive buyer accumulation
              </p>
            </div>

            <div className="rounded-xl border border-line bg-ink-900/60 p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted">Unchanged Breadth</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-bold text-bone">{internals.unchangedCount}</span>
                <span className="text-xs text-muted font-mono">Consolidating</span>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Low churn across cross-rate peg pairs
              </p>
            </div>
          </div>

          {/* 24h Move Distribution Histogram */}
          <div className="rounded-xl border border-line bg-ink-900/60 p-5">
            <div className="flex items-center justify-between pb-4">
              <div>
                <h3 className="font-display text-base text-bone flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-cyan-400" />
                  24h Return Distribution Buckets
                </h3>
                <p className="text-xs text-muted">Breakdown of asset return density across percentage tranches</p>
              </div>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-800">
                TOTAL: {ASSETS.length} TICKERS
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-6 pt-2">
              {internals.moveDistributionBuckets.map((b) => (
                <div key={b.bucket} className="flex flex-col items-center justify-end rounded-lg border border-line/60 bg-ink-950/70 p-3">
                  <span className="font-mono text-sm font-bold text-bone">{b.count}</span>
                  <span className="text-[10px] font-mono text-muted mb-2">{b.percentage}%</span>
                  <div className="w-full bg-ink-900 rounded-md h-24 flex items-end p-1">
                    <div
                      className={`w-full rounded transition-all duration-700 ${b.color}`}
                      style={{ height: `${Math.max(8, b.percentage * 2)}%` }}
                    />
                  </div>
                  <span className="mt-2 text-[10px] font-mono text-muted text-center">{b.bucket}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: LIQUIDITY LADDER (STANDING LEVERAGE) */}
      {activeTab === "ladder" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-ink-900/50 p-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted">Select Monitored Asset:</span>
              <div className="flex flex-wrap gap-1.5">
                {["BTC", "ETH", "SOL", "NVDA", "AAPL", "TSLA"].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => setSelectedAssetSymbol(sym)}
                    className={`rounded px-2.5 py-1 text-xs font-mono font-semibold transition ${
                      selectedAssetSymbol === sym
                        ? "bg-cyan-500 text-ink-950"
                        : "bg-ink-800 text-bone hover:bg-ink-700"
                    }`}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-muted">Spot Price:</span>
              <span className="text-lg font-bold text-bone">{fmtPrice(liquidity.spotPrice)}</span>
              <span className={currentMetrics.change24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                {fmtPct(currentMetrics.change24h)}
              </span>
            </div>
          </div>

          {/* Ladder Display */}
          <div className="rounded-xl border border-line bg-ink-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-line/60 pb-3 text-xs font-mono text-muted uppercase">
              <span>Tranche Type</span>
              <span>Trigger Price</span>
              <span>Distance</span>
              <span>Est. Squeeze / Liquidation Volume</span>
              <span>Density</span>
            </div>

            <div className="space-y-2">
              {liquidity.levels.map((lvl, idx) => {
                const isSpot = lvl.type === "SPOT";
                const isShortLiq = lvl.type === "SHORT_LIQUIDATION";
                const isLongLiq = lvl.type === "LONG_LIQUIDATION";

                let rowBg = "bg-ink-950/80 border-line/50";
                let textCol = "text-bone";
                if (isSpot) {
                  rowBg = "bg-cyan-950/40 border-cyan-500/50";
                  textCol = "text-cyan-300 font-bold";
                } else if (isShortLiq) {
                  rowBg = "bg-red-950/20 border-red-800/40";
                } else if (isLongLiq) {
                  rowBg = "bg-emerald-950/20 border-emerald-800/40";
                }

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 font-mono text-xs transition ${rowBg}`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          isSpot
                            ? "bg-cyan-400 animate-ping"
                            : isShortLiq
                            ? "bg-red-500"
                            : isLongLiq
                            ? "bg-emerald-500"
                            : "bg-muted"
                        }`}
                      />
                      <span className={`text-xs font-semibold ${textCol}`}>{lvl.type}</span>
                    </div>

                    <span className="font-bold text-bone">{fmtPrice(lvl.price)}</span>

                    <span className={lvl.distancePct > 0 ? "text-red-400" : lvl.distancePct < 0 ? "text-emerald-400" : "text-cyan-300"}>
                      {lvl.distancePct > 0 ? `+${lvl.distancePct}%` : `${lvl.distancePct}%`}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-bone">${lvl.estLiquidityMillion}M USD</span>
                      <div className="w-20 bg-ink-900 rounded-full h-1.5 overflow-hidden hidden sm:block">
                        <div
                          className={`h-full ${
                            isShortLiq ? "bg-red-500" : isLongLiq ? "bg-emerald-500" : "bg-cyan-400"
                          }`}
                          style={{ width: `${Math.min(100, (lvl.estLiquidityMillion / 850) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        lvl.density === "HIGH"
                          ? "bg-red-900/60 text-red-200 border border-red-700"
                          : lvl.density === "MEDIUM"
                          ? "bg-amber-900/60 text-amber-200 border border-amber-700"
                          : "bg-ink-800 text-muted"
                      }`}
                    >
                      {lvl.density}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CHROMADB VECTOR RAG KNOWLEDGE STORE */}
      {activeTab === "rag" && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <input
                type="text"
                value={ragQuery}
                onChange={(e) => setRagQuery(e.target.value)}
                placeholder="Query ChromaDB Vector Embeddings (e.g., Blackwell wafer, FOMC reverse repo, BIST reserves)..."
                className="w-full rounded-xl border border-line bg-ink-900/80 py-2.5 pl-10 pr-4 text-xs font-mono text-bone placeholder:text-muted focus:border-cyan-500 focus:outline-none"
              />
            </div>
            {ragQuery && (
              <button
                onClick={() => setRagQuery("")}
                className="rounded-lg border border-line bg-ink-800 px-3 py-2 text-xs font-mono text-muted hover:text-bone"
              >
                Clear Query
              </button>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Document Vector List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted">
                <span>Retrieved Knowledge Chunks ({filteredDocs.length})</span>
                <span className="text-cyan-400">Cosine Distance &le; 0.25</span>
              </div>

              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    selectedDoc?.id === doc.id
                      ? "border-cyan-500/60 bg-cyan-950/20"
                      : "border-line bg-ink-900/50 hover:border-gold/30 hover:bg-ink-900"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-cyan-900/60 px-2 py-0.5 text-[10px] font-mono font-medium text-cyan-300 border border-cyan-700">
                      {doc.category}
                    </span>
                    <span className="text-[10px] font-mono text-muted">
                      Distance: <span className="text-emerald-400 font-bold">{doc.distance}</span>
                    </span>
                  </div>
                  <h4 className="mt-2 text-sm font-semibold text-bone">{doc.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{doc.content}</p>
                  <p className="mt-2 text-[10px] font-mono text-muted/80">{doc.source}</p>
                </div>
              ))}
            </div>

            {/* Document Reader & Semantic Vector Inspector */}
            <div className="rounded-xl border border-line bg-ink-900/80 p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-line/60 pb-3">
                <span className="text-[11px] font-mono text-cyan-300 font-semibold flex items-center gap-1.5">
                  <Database className="h-3.5 w-3.5" />
                  VECTOR CHUNK INSPECTION
                </span>
                <span className="rounded bg-ink-950 px-2 py-0.5 text-[10px] font-mono text-muted border border-line">
                  {selectedDoc?.id || "N/A"}
                </span>
              </div>

              {selectedDoc ? (
                <>
                  <div>
                    <h3 className="font-display text-lg text-bone">{selectedDoc.title}</h3>
                    <p className="mt-1 text-xs text-cyan-400 font-mono">{selectedDoc.source}</p>
                  </div>

                  <div className="rounded-lg border border-line/60 bg-ink-950 p-4 font-mono text-xs leading-relaxed text-bone/90">
                    &ldquo;{selectedDoc.content}&rdquo;
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                    <div className="rounded-lg border border-line/50 bg-ink-950/60 p-2.5">
                      <span className="text-[10px] text-muted">Embedding Distance</span>
                      <p className="mt-0.5 font-bold text-emerald-400">{selectedDoc.distance} (High Match)</p>
                    </div>
                    <div className="rounded-lg border border-line/50 bg-ink-950/60 p-2.5">
                      <span className="text-[10px] text-muted">Verification Status</span>
                      <p className="mt-0.5 font-bold text-bone">FastAPI ChromaDB Verified</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-950/10 p-3 text-[11px] text-muted flex items-start gap-2">
                    <Info className="h-4 w-4 shrink-0 text-cyan-400 mt-0.5" />
                    <p>
                      Oracle-X vector memory continuously embeds financial regulatory filings into ChromaDB to furnish deterministic quantitative rationale.
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted">No document selected.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DIVERGENCE DETECTION RADAR */}
      {activeTab === "divergence" && (
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-ink-900/50 p-4">
            <h3 className="font-display text-base text-bone flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold-bright" />
              Decoupling &amp; Mean-Reversion Radar
            </h3>
            <p className="text-xs text-muted mt-1">
              Scans 2,000+ instruments for daily price velocity that conflicts with higher-timeframe 7-day trend structure.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {divergences.map((div, i) => {
              const isBull = div.divergenceType.includes("Bullish");
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-5 space-y-3 ${
                    isBull ? "border-emerald-500/40 bg-emerald-950/15" : "border-red-500/40 bg-red-950/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold font-mono text-bone">{div.symbol}</span>
                      <span className="ml-2 text-xs text-muted">{div.name}</span>
                    </div>
                    <span
                      className={`rounded px-2.5 py-0.5 text-[10px] font-mono font-bold ${
                        div.signalStrength === "STRONG"
                          ? "bg-gold/20 text-gold-bright border border-gold/50"
                          : "bg-ink-800 text-muted"
                      }`}
                    >
                      {div.signalStrength} SIGNAL
                    </span>
                  </div>

                  <div className="rounded-lg bg-ink-950/80 p-3 font-mono text-xs space-y-1.5 border border-line/40">
                    <div className="flex justify-between">
                      <span className="text-muted">Classification:</span>
                      <span className={isBull ? "text-emerald-400 font-semibold" : "text-red-400 font-semibold"}>
                        {div.divergenceType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">24h Velocity:</span>
                      <span className={div.change24h >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fmtPct(div.change24h)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">7d Structural Trend:</span>
                      <span className={div.change7d >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {fmtPct(div.change7d)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Current Spot:</span>
                      <span className="text-bone">{fmtPrice(div.lastPrice)}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-muted leading-relaxed">
                    {isBull
                      ? "Day rally into oversold multi-day downtrend indicates potential short covering squeeze."
                      : "Intraday breakdown following multi-day extension signals exhaustion & profit-taking."}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: BORSA İSTANBUL (BIST) REALM */}
      {activeTab === "bist" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div>
              <span className="text-xs font-mono font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="h-4 w-4" />
                Borsa İstanbul (BIST 100) Equities
              </span>
              <p className="mt-1 text-xs text-muted">
                Real-time Turkish Lira denominated equities with KAMUOYU AYDINLATMA PLATFORMU (KAP) disclosures.
              </p>
            </div>
            <span className="rounded bg-amber-950 px-2.5 py-1 text-xs font-mono text-amber-300 border border-amber-700">
              TRY REALM
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-line bg-ink-900/60">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-line bg-ink-950/70 text-[10px] text-muted uppercase">
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3">Company</th>
                  <th className="px-4 py-3">Spot (TRY)</th>
                  <th className="px-4 py-3">24h Change</th>
                  <th className="px-4 py-3">P/E</th>
                  <th className="px-4 py-3">Div Yield</th>
                  <th className="px-4 py-3">Latest KAP Regulatory Disclosure</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/40">
                {BIST_EQUITIES.map((eq) => (
                  <tr key={eq.symbol} className="hover:bg-ink-800/40 transition">
                    <td className="px-4 py-3 font-bold text-bone">{eq.symbol}</td>
                    <td className="px-4 py-3 text-muted">{eq.name}</td>
                    <td className="px-4 py-3 font-bold text-bone">₺{eq.priceTRY.toFixed(2)}</td>
                    <td className={`px-4 py-3 font-semibold ${eq.change24hPct >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {eq.change24hPct >= 0 ? `+${eq.change24hPct}%` : `${eq.change24hPct}%`}
                    </td>
                    <td className="px-4 py-3 text-bone">{eq.peRatio}x</td>
                    <td className="px-4 py-3 text-amber-300">{eq.dividendYieldPct}%</td>
                    <td className="px-4 py-3 text-[11px] text-bone/80 max-w-xs truncate" title={eq.kapLastDisclosure}>
                      {eq.kapLastDisclosure}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Footer System Rationale */}
      <div className="border-t border-line/70 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted gap-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-cyan-400" />
          <span>Oracle-X Core // Vector RAG + Microstructure Liquidity Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/Yigtwxx/OracleX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline"
          >
            <span>Original Repo (Yigtwxx/OracleX)</span>
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
