import type { Metadata } from "next";
import Link from "next/link";
import OracleXTerminal from "@/components/oraclex-terminal";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Compass, Layers, Database, Zap, Radio } from "lucide-react";

export const metadata: Metadata = {
  title: "Oracle-X Financial Intelligence Terminal — NextWall Street",
  description:
    "Integrated from https://github.com/Yigtwxx/OracleX. Unified cross-asset terminal for US Equities, Crypto, and Borsa İstanbul. Features ChromaDB Vector Memory RAG, Market Internals & Advance/Decline Histogram, Standing Liquidity Ladder, and Divergence Detection Radar.",
};

export default function OracleXPage() {
  return (
    <div className="bg-[#05080e] min-h-screen text-slate-100">
      <section className="border-b border-cyan-900/40 bg-gradient-to-b from-[#0a1120] to-[#05080e]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link href="/" className="hover:text-cyan-300">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400">Oracle-X Terminal</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-cyan-500/15 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
              <Compass className="h-3 w-3 text-cyan-400" />
              ORACLE-X FINANCIAL INTELLIGENCE PLATFORM
            </span>
            <span className="rounded bg-slate-800/80 px-2 py-0.5 text-[10px] font-mono text-slate-300">
              FASTAPI + CHROMADB RAG
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>Oracle-X Cross-Asset Terminal</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-slate-300 font-sans">
            Ported directly from the open-source repository{" "}
            <a
              href="https://github.com/Yigtwxx/OracleX"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-1 font-bold"
            >
              Yigtwxx/OracleX <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Institutional intelligence combining ChromaDB Vector Memory RAG across SEC filings, FOMC transcripts, and BIST sovereign disclosures, 24h Advance/Decline market internals, standing leverage liquidity ladder (short squeeze liquidation pools), and daily/weekly divergence detection.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Database className="h-3.5 w-3.5 text-cyan-400" />
              ChromaDB Vector RAG Store
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Layers className="h-3.5 w-3.5 text-cyan-400" />
              Standing Liquidity Ladder
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-cyan-300">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              Divergence Radar
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Radio className="h-3.5 w-3.5 text-amber-400" />
              Borsa İstanbul (BIST 100) &amp; KAP
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <OracleXTerminal />
      </section>
    </div>
  );
}
