import type { Metadata } from "next";
import Link from "next/link";
import BloombergTerminal from "@/components/bloomberg-terminal";
import WhopBadge from "@/components/whop-badge";

export const metadata: Metadata = {
  title: "Professional Financial Terminal — NextWall Street",
  description:
    "Full-featured institutional terminal experience with interactive multi-timeframe candlestick charting, indicators (20/50 SMA, Bollinger Bands, RSI, MACD, Volume), Command Line (<GO>), and Instant Trading Floor (IB) institutional chat.",
};

export default function TerminalPage() {
  return (
    <div className="bg-[#050505] min-h-screen">
      <section className="border-b border-[#ff8800]/40 bg-[#0a0a0a]">
        <div className="mx-auto max-w-[1560px] px-4 py-8">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-stone-200">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-[#ff8800]">Terminal</span>
          </nav>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded bg-[#ff8800]/15 border border-[#ff8800]/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#ffcc00]">
              INSTITUTIONAL WORKSTATION STANDARD
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-mono text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>PROFESSIONAL FINANCIAL TERMINAL</span>
          </h1>
          <p className="mt-2 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-400 font-mono">
            Direct dual-monitor workstation used by quantitative analysts, prop traders, and institutional desks. High-contrast amber and emerald display, full multi-indicator intraday charting (GIP/GP), security factsheets (DES), Level 2 order book depth ladder, and Instant Trading Floor (IB) routing.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1560px] px-3 py-6 sm:px-6">
        <BloombergTerminal />
      </section>
    </div>
  );
}
