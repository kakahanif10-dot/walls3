import type { Metadata } from "next";
import Link from "next/link";
import NeubergTerminal from "@/components/neuberg-terminal";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Terminal, Activity, Compass, DollarSign, Vote } from "lucide-react";

export const metadata: Metadata = {
  title: "Neuberg Terminal — Open-Source Bloomberg Terminal ($24,000/yr Alternative)",
  description:
    "Integrated from https://github.com/KoNananachan/Neuberg. The open-source Bloomberg Terminal with 516 panels, Fear & Greed Index, Macro Regime Quadrant, 24/7 Hyperliquid stock & crypto perpetuals, and native Polymarket prediction order books.",
};

export default function NeubergPage() {
  return (
    <div className="bg-[#070b0e] min-h-screen text-stone-100">
      <section className="border-b border-[#ff9900]/30 bg-gradient-to-b from-[#160c03] to-[#070b0e]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-[#ff9900]">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-[#ff9900]">Neuberg Terminal</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#ff9900]/15 border border-[#ff9900]/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ffcc00]">
              <Terminal className="h-3 w-3 text-[#ff9900]" />
              THE OPEN-SOURCE BLOOMBERG TERMINAL
            </span>
            <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
              516 PANELS · $24,000/YR ALTERNATIVE
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Neuberg Quantitative Workstation</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-300 font-mono">
            Ported directly from the open-source repository{" "}
            <a
              href="https://github.com/KoNananachan/Neuberg"
              target="_blank"
              rel="noreferrer"
              className="text-[#ff9900] underline inline-flex items-center gap-1 font-bold"
            >
              KoNananachan/Neuberg <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Democratizing institutional-grade financial intelligence: 516 drag-and-drop panels, multi-factor Fear &amp; Greed index gauge, Macro Regime Quadrants (Goldilocks vs Reflation vs Stagflation), 24/7 Hyperliquid stock and crypto perpetuals with up to 20x leverage, and native decentralized Polymarket prediction order books.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-[#ffcc00]">
              <Activity className="h-3.5 w-3.5 text-[#ff9900]" />
              Fear &amp; Greed Index (0-100)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#ffcc00]">
              <Compass className="h-3.5 w-3.5 text-[#ff9900]" />
              Macro Regime Quadrant
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#00d4aa]">
              <DollarSign className="h-3.5 w-3.5 text-[#00d4aa]" />
              24/7 Hyperliquid Perps (Stock &amp; Crypto)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-[#00d4aa]">
              <Vote className="h-3.5 w-3.5 text-[#00d4aa]" />
              Native Polymarket Books
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <NeubergTerminal />
      </section>
    </div>
  );
}
