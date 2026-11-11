import type { Metadata } from "next";
import Link from "next/link";
import WatchableVideoPlayer from "@/components/watchable-video-player";
import WhopBadge from "@/components/whop-badge";
import { VIDEO_LESSONS_20 } from "@/lib/academy-videos";

export const metadata: Metadata = {
  title: "Watchable Video Tutorial Studio (20 Masterclasses) — NextWall Street Academy",
  description: "Watch 20 real playable video masterclasses on market structure, microstructure, Binance crypto, pump.fun memes, and macro regimes.",
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
      <WatchableVideoPlayer courseTitle="Institutional 20-Lesson Trading Architecture & Risk Masterclass" />

      {/* Video Curriculum Grid - 20 Comprehensive Lessons */}
      <div className="mt-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">Comprehensive Curriculum</span>
              <span className="rounded-full bg-gold/15 border border-gold/40 px-2 py-0.5 text-[10px] font-mono font-bold text-gold-bright">
                20 Video Lessons
              </span>
            </div>
            <h3 className="mt-1 font-display text-2xl text-bone flex items-center">
              <span>All 20 Watchable Video Masterclasses</span>
              <WhopBadge className="ml-2 text-lg align-middle" />
            </h3>
            <p className="mt-1 text-xs text-muted">
              Structured across 5 key pillars: Price Action, Microstructure & Order Flow, Meme Coins, Risk Management, and Macro Regimes.
            </p>
          </div>
          <Link href="/academy" className="text-xs text-muted hover:text-gold-bright">
            View full reading syllabus →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VIDEO_LESSONS_20.map((lesson, idx) => (
            <Link
              key={lesson.id}
              href={`/academy/watch?lesson=${lesson.id}#video-studio-player`}
              className="group flex flex-col justify-between rounded-xl border border-line bg-ink-900/60 p-4 transition-all hover:border-gold/60 hover:bg-ink-900 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] text-muted">
                  <span className="font-mono text-gold font-semibold">Lesson {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}</span>
                  <span className="rounded bg-ink-800 px-2 py-0.5 text-[10px] font-mono text-bone/90">
                    {lesson.durationLabel}
                  </span>
                </div>
                <h4 className="mt-2.5 font-display text-base text-bone line-clamp-2 leading-snug group-hover:text-gold-bright transition-colors">
                  {lesson.title}
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded bg-line/50 px-1.5 py-0.5 text-[9px] font-mono text-muted">
                    {lesson.module}
                  </span>
                  <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                    {lesson.level}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted line-clamp-3 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              <div className="mt-4 border-t border-line/60 pt-3 flex items-center justify-between">
                <p className="text-[11px] text-muted truncate">
                  {lesson.instructor}
                </p>
                <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-gold group-hover:translate-x-0.5 transition-transform">
                  <span>Watch</span>
                  {idx > 0 && <WhopBadge className="ml-0.5 text-[10px]" />}
                  <span>▶</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
