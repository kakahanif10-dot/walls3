import type { Metadata } from "next";
import Link from "next/link";
import OpenStockHub from "@/components/openstock-hub";
import WhopBadge from "@/components/whop-badge";
import { ExternalLink, Globe, TrendingUp, Sparkles, Bell } from "lucide-react";

export const metadata: Metadata = {
  title: "OpenStock Platform & 9 Global Markets Hub — NextWall Street",
  description:
    "Integrated from https://github.com/Open-Dev-Society/OpenStock. Track 9 global market exchanges (US, India, Germany, Canada, Australia, Saudi Arabia, Poland, Crypto 24/7, Forex), multi-tab browser-style stock exploration, social sentiment radar (Reddit, X, Polymarket), and personalized price alerts.",
};

export default function OpenStockPage() {
  return (
    <div className="bg-[#020a06] min-h-screen text-stone-100">
      <section className="border-b border-emerald-900/40 bg-gradient-to-b from-[#041a10] to-[#020a06]">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <nav className="flex items-center gap-2 text-xs font-mono text-stone-400">
            <Link href="/" className="hover:text-emerald-300">Home</Link>
            <span className="text-stone-600">/</span>
            <span className="text-emerald-400">OpenStock Platform</span>
          </nav>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-emerald-500/15 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-300">
              <Globe className="h-3 w-3 text-emerald-400" />
              OPEN-SOURCE GLOBAL MARKET INTELLIGENCE
            </span>
            <span className="rounded bg-stone-800/80 px-2 py-0.5 text-[10px] font-mono text-stone-300">
              AGPL-3.0 FOREVER FREE
            </span>
            <WhopBadge size="xs" />
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight flex items-center gap-3">
            <span>OpenStock Global Workspace</span>
          </h1>
          <p className="mt-4 max-w-3xl text-xs sm:text-sm leading-relaxed text-stone-300 font-sans">
            Ported directly from the popular open-source repository{" "}
            <a
              href="https://github.com/Open-Dev-Society/OpenStock"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 underline inline-flex items-center gap-1 font-bold"
            >
              Open-Dev-Society/OpenStock <ExternalLink className="h-3 w-3 inline" />
            </a>
            . Markets, minus the paywall: comprehensive coverage across 9 international hubs (US, India, Germany, Canada, Australia, Saudi Arabia, Poland, Crypto 24/7, and Forex), browser-style multi-tab ticker analysis, social sentiment radar (Reddit WSB, FinTwit, Polymarket odds), sector rotation heatmaps, and custom price alerts.
          </p>

          <div className="mt-6 flex flex-wrap gap-4 text-xs font-mono text-stone-400">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Globe className="h-3.5 w-3.5 text-emerald-400" />
              9 Global Exchanges
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Reddit + X + Polymarket Radar
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Bell className="h-3.5 w-3.5 text-emerald-400" />
              Real-time Invalidation &amp; Price Alerts
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10">
        <OpenStockHub />
      </section>
    </div>
  );
}
