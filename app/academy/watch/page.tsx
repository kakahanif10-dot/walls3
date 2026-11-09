import type { Metadata } from "next";
import Link from "next/link";
import WatchableVideoPlayer from "@/components/watchable-video-player";

export const metadata: Metadata = {
  title: "Watchable Video Tutorial Studio — NextWall Street Academy",
  description: "Watch real playable masterclasses on trend structure, crypto liquidity, and pump.fun meme risk.",
};

export default function WatchStudioPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-xs text-muted">
        <Link href="/academy" className="hover:text-bone">Academy</Link>
        <span className="text-line">/</span>
        <span className="text-gold-bright">Video Tutorial Studio</span>
      </nav>

      {/* Main Video Player Section */}
      <WatchableVideoPlayer courseTitle="Institutional Trend Architecture & Risk Masterclass" />

      {/* Video Curriculum Grid */}
      <div className="mt-12">
        <div className="flex items-end justify-between border-b border-line/60 pb-4">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Available Masterclasses</span>
            <h3 className="mt-1 font-display text-2xl text-bone">All Watchable Video Modules</h3>
          </div>
          <Link href="/academy" className="text-xs text-muted hover:text-gold-bright">
            View full reading syllabus →
          </Link>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Market Structure Before Indicators",
              duration: "11 min HD",
              instructor: "Daniel Okafor",
              role: "Head of Strategy",
              description: "Learn how to mark clean 3-candle swing pivots, map the 200-day boundary, and identify exact invalidation stops.",
              tags: ["Structure", "Equities", "Risk"],
            },
            {
              title: "Crypto Liquidity & Order Book Float",
              duration: "12 min HD",
              instructor: "Mara Lindqvist",
              role: "Digital Assets Desk",
              description: "Demystifying token float, exchange order book slippage, and volatility-scaled position sizing for crypto assets.",
              tags: ["Crypto", "Binance", "Order Books"],
            },
            {
              title: "Pump.fun & Meme Coins Risk Protocol",
              duration: "9 min HD",
              instructor: "Daniel Okafor",
              role: "Head of Strategy",
              description: "Bonding curves, wallet cluster concentration, spotting the distribution phase, and enforcing the hard 2% capital rule.",
              tags: ["Pump.fun", "Meme Meta", "Capital Protection"],
            },
          ].map((v, i) => (
            <div
              key={v.title}
              className="rounded-xl border border-line bg-ink-900/60 p-5 transition-all hover:border-gold/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="font-mono text-gold font-semibold">Video 0{i + 1}</span>
                  <span className="rounded bg-ink-800 px-2 py-0.5 text-[10px] font-mono text-bone/90">{v.duration}</span>
                </div>
                <h4 className="mt-3 font-display text-lg text-bone">{v.title}</h4>
                <p className="mt-2 text-xs leading-relaxed text-muted">{v.description}</p>
              </div>

              <div className="mt-5 border-t border-line/60 pt-3">
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {v.tags.map((t) => (
                    <span key={t} className="rounded-full border border-line bg-ink-850 px-2 py-0.5 text-[10px] text-muted">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-muted">
                  Instructor: <span className="text-bone">{v.instructor}</span> ({v.role})
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
