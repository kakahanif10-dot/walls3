import type { Metadata } from "next";
import Link from "next/link";
import FinceptTerminal from "@/components/fincept-terminal";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Terminal, Bot, BarChart2, Globe, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "Fincept Terminal Platform — NextWall Street",
  description:
    "Integrated from https://github.com/Fincept-Corporation/FinceptTerminal. Native C++20, Qt6, and Python 3.11 terminal featuring 37 investor AI agents, DCF valuation, Black-Scholes options Greeks, 100+ macroeconomic data connectors, paper trading execution, and visual node workflow automation.",
};

export default function FinceptPage() {
  return (
    <div className="bg-[#050402] min-h-screen text-stone-100">
      <section className="border-b border-amber-900/40 bg-gradient-to-b from-[#120d04] to-[#050402]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-amber-300">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-amber-400">Fincept Terminal</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300">
              <Terminal className="h-3 w-3 text-amber-400" />
              NATIVE FINANCIAL INTELLIGENCE PLATFORM
            </span>
            <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
              v4.5.2 AGPL-3.0
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Fincept Terminal Platform</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-300 font-mono">
            Directly ported from the official open-source GitHub repository{" "}
            <a
              href="https://github.com/Fincept-Corporation/FinceptTerminal"
              target="_blank"
              rel="noreferrer"
              className="text-amber-400 underline inline-flex items-center gap-1 font-bold"
            >
              Fincept-Corporation/FinceptTerminal <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Features 37 investor and macroeconomic AI agents (Buffett, Graham, Munger, Soros, Dalio, Simons, Lynch), Gordon Growth DCF valuation model, Black-Scholes options pricing and Greeks, 100+ live macroeconomic connectors (FRED, IMF, DBnomics, SEC EDGAR), real-time paper trading execution, and visual node workflow automation.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Bot className="h-3.5 w-3.5 text-amber-400" />
              37 Allocator AI Agents
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <BarChart2 className="h-3.5 w-3.5 text-amber-400" />
              Interactive DCF &amp; Black-Scholes
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              100+ Live Connectors &amp; Chokepoints
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-amber-300">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              C++20 / Qt6 / Embedded Python 3.11
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <FinceptTerminal />
      </section>
    </div>
  );
}
