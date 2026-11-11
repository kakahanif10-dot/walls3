import type { Metadata } from "next";
import Link from "next/link";
import OpenBBTerminal from "@/components/openbb-terminal";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "OpenBB Quantitative Workspace & Terminal — NextWall Street",
  description:
    "Open Data Platform (ODP) quantitative terminal ported from OpenBB. Integrated command line, Parametric and Monte Carlo Value at Risk (VaR), US Treasury yield curve, Markowitz Efficient Frontier portfolio optimizer, and FINRA dark pool volume tracking.",
};

export default function OpenBBPage() {
  return (
    <div className="bg-[#02080d] min-h-screen text-stone-100">
      <section className="border-b border-cyan-900/40 bg-gradient-to-b from-[#06141f] to-[#02080d]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-cyan-300">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-cyan-400">OpenBB Platform</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-cyan-500/15 border border-cyan-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-300">
              <Terminal className="h-3 w-3 text-cyan-400" />
              OPEN-SOURCE QUANT INFRASTRUCTURE
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight flex items-center gap-3">
            <span>OpenBB Quantitative Platform</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-300 font-mono">
            Seamlessly integrated from the open-source GitHub repository{" "}
            <a
              href="https://github.com/openbq-org/OpenBB"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 underline inline-flex items-center gap-1 font-bold"
            >
              openbq-org/OpenBB <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Provides analysts, quants, and institutional desks with a high-speed CLI workstation, parametric and fat-tailed Value at Risk (VaR), 30-day Monte Carlo price paths, constant-maturity US Treasury yield curves, Markowitz Efficient Frontier optimization, and off-exchange dark pool volume monitoring.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <OpenBBTerminal />
      </section>
    </div>
  );
}
