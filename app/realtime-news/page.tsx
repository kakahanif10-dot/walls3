import type { Metadata } from "next";
import Link from "next/link";
import RealtimeNewsTerminal from "@/components/realtime-news-terminal";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Radio, Globe, Terminal, Zap, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Real-Time Financial News Stream & Query API — NextWall Street",
  description:
    "Integrated from https://github.com/janlukasschroeder/realtime-newsapi. Aggregating 10,000+ financial news sources (Bloomberg, Reuters, WSJ, Seeking Alpha, SEC Form 8-K, FDA Approvals) mapped to company ticker symbols with sub-second WebSocket streaming and Lucene query API.",
};

export default function RealtimeNewsPage() {
  return (
    <div className="bg-[#030906] min-h-screen text-stone-100">
      <section className="border-b border-emerald-900/40 bg-gradient-to-b from-[#06180e] to-[#030906]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-emerald-300">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-emerald-400">Real-Time News API</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              <Radio className="h-3 w-3 text-emerald-400" />
              10,000+ FINANCIAL NEWS SOURCES
            </span>
            <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
              WEBSOCKET STREAM + QUERY API
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Real-Time Financial News API Platform</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-300 font-sans">
            Ported directly from the open-source repository{" "}
            <a
              href="https://github.com/janlukasschroeder/realtime-newsapi"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline inline-flex items-center gap-1 font-bold"
            >
              janlukasschroeder/realtime-newsapi <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Streaming financial news aggregator connecting over 10,000 news wires (Bloomberg Terminal, Reuters, The Wall Street Journal, Seeking Alpha, SEC Form 8-K/10-K, FDA Approvals, and BusinessWire) directly mapped to ticker symbols with Lucene filter queries and live WebSocket feeds.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Radio className="h-3.5 w-3.5 text-emerald-400" />
              Sub-second WebSocket Stream
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Terminal className="h-3.5 w-3.5 text-emerald-400" />
              Lucene Query Engine (symbols, source, category)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              Direct Ticker Symbol Resolution
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              Invalidation Stop Alerts
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <RealtimeNewsTerminal />
      </section>
    </div>
  );
}
