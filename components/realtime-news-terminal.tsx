"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Radio,
  Search,
  Filter,
  ExternalLink,
  Zap,
  Globe,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  TrendingUp,
  RefreshCw,
  Terminal,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Bookmark,
  Share2,
  Copy,
} from "lucide-react";
import {
  INITIAL_REALTIME_ARTICLES,
  NEWS_SOURCES,
  QUERY_PRESETS,
  filterRealtimeArticles,
  type NewsArticle,
} from "@/lib/realtime-news-api";
import { useWatchlist } from "@/lib/use-watchlist";
import WhopBadge from "@/components/whop-badge";

export default function RealtimeNewsTerminal() {
  const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_REALTIME_ARTICLES);
  const [queryString, setQueryString] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedSource, setSelectedSource] = useState<string>("ALL");
  const [selectedSentiment, setSelectedSentiment] = useState<string>("ALL");
  const [watchlistOnly, setWatchlistOnly] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [latencyMs, setLatencyMs] = useState<number>(14);
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(INITIAL_REALTIME_ARTICLES[0]);
  const [showApiConsole, setShowApiConsole] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const { has } = useWatchlist();

  // Simulated live incoming stream updates every 12 seconds when streaming is active
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setLatencyMs(Math.floor(10 + Math.random() * 8));

      // Occasionally prepend a simulated breaking dispatch
      const simulatedHeadlines: Partial<NewsArticle>[] = [
        {
          title: "Semiconductor Foundry Wafer Utilization Hits 98.4% on 2nm Prototype Demands",
          description: "Leading fab reports full pipeline commitments for next-generation generative AI accelerators through Q4 2027.",
          symbols: ["TSM", "NVDA", "ASML"],
          source: { id: "reuters", name: "Reuters Financial" },
          category: "Breaking",
          sentiment: "BULLISH",
          impactScore: 9,
          invalidationAlert: "Semi equipment pullbacks trigger invalidation below $1,100.",
        },
        {
          title: "Treasury Quarterly Refunding Auction Meets Strong Buy-Side Indirect Bid at 4.28%",
          description: "Primary dealers absorbed only 11% of the 10-year note issue as foreign sovereign accounts and pension allocations expanded.",
          symbols: ["TLT", "SPY"],
          source: { id: "bloomberg", name: "Bloomberg Terminal" },
          category: "Macro",
          sentiment: "BULLISH",
          impactScore: 8,
        },
        {
          title: "Biotech Early-Stage Phase 2 Oncology Trial Achieves 68% Objective Response Rate",
          description: "Independent data monitoring committee recommends early termination for positive efficacy in metastatic solid tumors.",
          symbols: ["MRNA", "BIIB"],
          source: { id: "fda_bulletin", name: "U.S. FDA Drug Evaluation" },
          category: "FDA Approvals",
          sentiment: "BULLISH",
          impactScore: 9,
        },
      ];

      const pick = simulatedHeadlines[Math.floor(Math.random() * simulatedHeadlines.length)];
      const newArticle: NewsArticle = {
        id: `rt-live-${Date.now()}`,
        title: pick.title!,
        description: pick.description!,
        symbols: pick.symbols || ["NVDA"],
        url: "https://newsfilter.io",
        publishedAt: new Date().toISOString(),
        source: pick.source || { id: "bloomberg", name: "Bloomberg Terminal" },
        author: "Real-Time WebSocket Stream",
        category: pick.category || "Breaking",
        sentiment: pick.sentiment || "BULLISH",
        impactScore: pick.impactScore || 8,
        invalidationAlert: pick.invalidationAlert,
      };

      setArticles((prev) => [newArticle, ...prev.slice(0, 35)]);
    }, 14000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    let result = filterRealtimeArticles(queryString, articles);

    if (selectedCategory !== "ALL") {
      result = result.filter((a) => a.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSource !== "ALL") {
      result = result.filter((a) => a.source.id === selectedSource);
    }

    if (selectedSentiment !== "ALL") {
      result = result.filter((a) => a.sentiment === selectedSentiment);
    }

    if (watchlistOnly) {
      result = result.filter((a) => a.symbols.some((sym) => has(sym)));
    }

    return result;
  }, [articles, queryString, selectedCategory, selectedSource, selectedSentiment, watchlistOnly, has]);

  const handleCopyApiCurl = () => {
    const curl = `curl -X POST https://nextwallstreet.com/api/newsfilter \\
  -H "Content-Type: application/json" \\
  -d '{"type": "filterArticles", "queryString": "${queryString || 'symbols:NVDA'}"}'`;
    navigator.clipboard.writeText(curl);
    setCopiedId("curl");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl border border-line bg-ink-950 p-4 sm:p-6 text-bone shadow-2xl backdrop-blur-xl space-y-6">
      {/* Top Bar with Real-Time WebSocket Telemetry */}
      <div className="flex flex-col gap-4 border-b border-line/70 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold tracking-wider text-emerald-300">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              REAL-TIME NEWS API
            </span>
            <span className="rounded-md border border-line bg-ink-900 px-2.5 py-0.5 text-[10px] font-mono text-muted">
              v1.2.0-SOCKET
            </span>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <span className={`h-2 w-2 rounded-full ${isStreaming ? "bg-emerald-400 animate-ping" : "bg-red-400"}`} />
              {isStreaming ? `WebSocket: CONNECTED (${latencyMs}ms)` : "WebSocket: PAUSED"}
            </span>
            <WhopBadge />
          </div>

          <h2 className="mt-2 text-2xl sm:text-3xl font-display tracking-tight text-bone flex items-center gap-2">
            <span>Live Financial News Stream &amp; Query Terminal</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            Ported from <code className="text-emerald-300 font-mono">github.com/janlukasschroeder/realtime-newsapi</code> — Streaming dispatches from 10,000+ sources mapped directly to ticker symbols.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsStreaming((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono font-semibold transition ${
              isStreaming
                ? "border-emerald-500/50 bg-emerald-950/40 text-emerald-300"
                : "border-line bg-ink-900 text-muted hover:text-bone"
            }`}
          >
            <Radio className="h-3.5 w-3.5" />
            <span>{isStreaming ? "Stream Active" : "Stream Paused"}</span>
          </button>

          <button
            onClick={() => setShowApiConsole((prev) => !prev)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-mono transition ${
              showApiConsole
                ? "border-gold/50 bg-gold/15 text-gold-bright"
                : "border-line bg-ink-900 text-muted hover:text-bone"
            }`}
          >
            <Terminal className="h-3.5 w-3.5" />
            <span>Query API Console</span>
          </button>
        </div>
      </div>

      {/* Query API Console Box (Expandable) */}
      {showApiConsole && (
        <div className="rounded-xl border border-gold/40 bg-ink-900/90 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-gold-bright" />
              <h3 className="font-mono text-xs font-bold text-bone">NEWSFILTER.IO QUERY API ENDPOINT SPEC</h3>
            </div>
            <button
              onClick={handleCopyApiCurl}
              className="flex items-center gap-1 text-[11px] font-mono text-gold-bright hover:underline"
            >
              <Copy className="h-3 w-3" />
              <span>{copiedId === "curl" ? "Copied curl!" : "Copy curl command"}</span>
            </button>
          </div>

          <div className="rounded-lg bg-ink-950 p-3 font-mono text-xs text-muted overflow-x-auto space-y-1">
            <p className="text-cyan-400"># POST /api/newsfilter (Mirrors api.newsfilter.io/public/actions)</p>
            <p>Content-Type: application/json</p>
            <p className="text-emerald-300">&#123; &quot;type&quot;: &quot;filterArticles&quot;, &quot;queryString&quot;: &quot;{queryString || 'symbols:NVDA'}&quot; &#125;</p>
          </div>

          <p className="text-[11px] text-muted">
            You can query articles by ticker (`symbols:AAPL`), source (`source:sec_edgar`), category (`category:Crypto`), or Lucene operators (`title:&quot;FDA Approval&quot; OR symbols:NVDA`).
          </p>
        </div>
      )}

      {/* Search & Query Bar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={queryString}
            onChange={(e) => setQueryString(e.target.value)}
            placeholder='Lucene Filter Query (e.g. symbols:NVDA OR title:"FDA Approval" OR source:bloomberg)...'
            className="w-full rounded-xl border border-line bg-ink-900/80 py-3 pl-10 pr-20 text-xs sm:text-sm font-mono text-bone placeholder:text-muted focus:border-emerald-500 focus:outline-none"
          />
          {queryString && (
            <button
              onClick={() => setQueryString("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-ink-800 px-2 py-1 text-[11px] font-mono text-muted hover:text-bone"
            >
              Clear
            </button>
          )}
        </div>

        {/* Query Presets Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-mono text-muted flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-gold-bright" />
            Presets:
          </span>
          {QUERY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setQueryString(preset.query)}
              className={`rounded-lg border px-2.5 py-1 text-[11px] font-mono transition ${
                queryString === preset.query
                  ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold"
                  : "border-line bg-ink-900/60 text-muted hover:text-bone hover:border-gold/30"
              }`}
              title={preset.desc}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-y border-line/60 py-3 text-xs font-mono">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {["ALL", "Earnings", "FDA Approvals", "M&A", "Macro", "Crypto", "SEC Filing", "Breaking"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-md px-2.5 py-1 transition ${
                selectedCategory === cat
                  ? "bg-emerald-500 text-ink-950 font-bold"
                  : "bg-ink-900 text-muted hover:text-bone"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Watchlist Filter Toggle & Sentiment */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWatchlistOnly((prev) => !prev)}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1 transition border ${
              watchlistOnly
                ? "border-gold bg-gold/20 text-gold-bright font-bold"
                : "border-line bg-ink-900 text-muted hover:text-bone"
            }`}
          >
            <Bookmark className="h-3 w-3" />
            <span>My Watchlist Only</span>
          </button>

          <select
            value={selectedSentiment}
            onChange={(e) => setSelectedSentiment(e.target.value)}
            className="rounded-md border border-line bg-ink-900 px-2 py-1 text-xs text-bone focus:outline-none"
          >
            <option value="ALL">All Sentiments</option>
            <option value="BULLISH">Bullish Only</option>
            <option value="BEARISH">Bearish Only</option>
            <option value="NEUTRAL">Neutral Only</option>
          </select>
        </div>
      </div>

      {/* Main Stream Area: Feed + Detail Drawer */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Stream List */}
        <div className="space-y-3 max-h-[700px] overflow-y-auto pr-1">
          <div className="flex items-center justify-between text-xs font-mono text-muted pb-1">
            <span>Matching Dispatches: {filteredArticles.length}</span>
            <span>Real-time Order: Newest First</span>
          </div>

          {filteredArticles.length === 0 ? (
            <div className="rounded-xl border border-line bg-ink-900/40 p-8 text-center text-muted">
              <AlertTriangle className="mx-auto h-8 w-8 text-amber-400 mb-2" />
              <p className="text-sm font-semibold text-bone">No dispatches match current query criteria.</p>
              <p className="text-xs mt-1">Try resetting the query or selecting another filter preset.</p>
              <button
                onClick={() => {
                  setQueryString("");
                  setSelectedCategory("ALL");
                  setSelectedSource("ALL");
                  setSelectedSentiment("ALL");
                  setWatchlistOnly(false);
                }}
                className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-mono text-white"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            filteredArticles.map((art) => {
              const isSelected = activeArticle?.id === art.id;
              const isBull = art.sentiment === "BULLISH";
              const isBear = art.sentiment === "BEARISH";

              return (
                <div
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? "border-emerald-500/70 bg-emerald-950/20 shadow-md"
                      : "border-line/70 bg-ink-900/60 hover:border-gold/40 hover:bg-ink-900"
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-ink-950 border border-line/60 px-2 py-0.5 text-[10px] font-mono text-muted">
                        {art.source.name}
                      </span>
                      <span className="rounded bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 text-[10px] font-mono text-cyan-300 font-semibold">
                        {art.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold ${
                          isBull
                            ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700"
                            : isBear
                            ? "bg-red-900/50 text-red-300 border border-red-700"
                            : "bg-blue-900/50 text-blue-300 border border-blue-700"
                        }`}
                      >
                        {art.sentiment}
                      </span>
                      <span className="text-[10px] font-mono text-muted">
                        Impact: <strong className="text-bone">{art.impactScore}/10</strong>
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-2 text-sm sm:text-[15px] font-semibold text-bone leading-snug">
                    {art.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs text-muted leading-relaxed">
                    {art.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/40 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-muted uppercase">Tickers:</span>
                      {art.symbols.map((sym) => (
                        <Link
                          key={sym}
                          href={`/ticker/${sym}`}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded bg-ink-950 border border-line px-1.5 py-0.5 text-[10px] font-bold text-gold-bright hover:border-gold transition"
                        >
                          ${sym}
                        </Link>
                      ))}
                    </div>

                    <span className="text-[10px] text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(art.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selected Article Detail & Rationale Terminal */}
        <div className="rounded-xl border border-line bg-ink-900/70 p-5 space-y-4 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
              <Zap className="h-4 w-4" />
              DISPATCH DOSSIER &amp; EXECUTION
            </span>
            <span className="text-[10px] font-mono text-muted">
              ID: {activeArticle?.id || "N/A"}
            </span>
          </div>

          {activeArticle ? (
            <>
              <div>
                <span className="rounded bg-emerald-950/80 border border-emerald-700 px-2 py-0.5 text-[10px] font-mono text-emerald-300">
                  {activeArticle.source.name}
                </span>
                <h3 className="mt-2 font-display text-lg text-bone leading-snug">
                  {activeArticle.title}
                </h3>
                <p className="mt-1 text-xs text-muted font-mono">
                  Reported by {activeArticle.author} · {new Date(activeArticle.publishedAt).toUTCString()}
                </p>
              </div>

              <div className="rounded-lg border border-line/50 bg-ink-950 p-4 font-sans text-xs sm:text-sm leading-relaxed text-bone/90">
                {activeArticle.description}
              </div>

              {activeArticle.invalidationAlert && (
                <div className="rounded-lg border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-200 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-mono uppercase text-[10px] tracking-wider text-amber-400">
                      Invalidation Stop Threshold:
                    </strong>
                    <p className="mt-0.5">{activeArticle.invalidationAlert}</p>
                  </div>
                </div>
              )}

              {/* Tickers Action Row */}
              <div className="border-t border-line/60 pt-3 space-y-2">
                <span className="text-xs font-mono text-muted">Mapped Ticker Analysis:</span>
                <div className="flex flex-wrap gap-2">
                  {activeArticle.symbols.map((sym) => (
                    <Link
                      key={sym}
                      href={`/ticker/${sym}`}
                      className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-mono font-bold text-gold-bright hover:bg-gold/20 transition"
                    >
                      <span>Analyze ${sym}</span>
                      <ArrowUpRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>

              <div className="border-t border-line/60 pt-3 flex items-center justify-between text-xs font-mono text-muted">
                <a
                  href={activeArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-emerald-400 hover:underline"
                >
                  <span>Original News Wire</span>
                  <ExternalLink className="h-3 w-3" />
                </a>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(activeArticle.title + " " + activeArticle.url);
                    setCopiedId(activeArticle.id);
                    setTimeout(() => setCopiedId(null), 2000);
                  }}
                  className="flex items-center gap-1 text-muted hover:text-bone"
                >
                  <Share2 className="h-3 w-3" />
                  <span>{copiedId === activeArticle.id ? "Copied!" : "Share"}</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-xs text-muted">Select an article from the live stream to inspect dossier.</p>
          )}
        </div>
      </div>

      {/* Footer System Attribution */}
      <div className="border-t border-line/70 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-muted gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-3.5 w-3.5 text-emerald-400" />
          <span>Real-Time Newsfilter Architecture // 10,000+ News Feeds</span>
        </div>
        <div>
          <a
            href="https://github.com/janlukasschroeder/realtime-newsapi"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>Original Repo (janlukasschroeder/realtime-newsapi)</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
