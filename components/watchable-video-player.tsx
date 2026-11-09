"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

export type VideoChapter = {
  time: number; // in seconds
  title: string;
  description: string;
};

export type VideoLesson = {
  id: string;
  title: string;
  durationSeconds: number;
  durationLabel: string;
  videoUrl: string;
  instructor: string;
  instructorRole: string;
  chapters: VideoChapter[];
  summary: string;
  takeaways: string[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
};

export const SAMPLE_VIDEO_LESSONS: VideoLesson[] = [
  {
    id: "lesson-structure-101",
    title: "Lesson 1: Market Structure Before Indicators",
    durationSeconds: 660,
    durationLabel: "11:00",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    summary:
      "A trend is a sequence of higher highs and higher lows until it is not. Learn how to map structural swing pivots on S&P 500, Nasdaq equities, and crypto charts without getting fooled by indicator lag.",
    chapters: [
      { time: 0, title: "00:00 - Introduction to Price Structure", description: "Why 80% of indicator signals fail without structural confirmation." },
      { time: 90, title: "01:30 - Identifying Swing Highs & Lows", description: "Marking clean 3-candle swing pivots on daily and 1-hour timeframes." },
      { time: 240, title: "04:00 - The 200-Day Structural Boundary", description: "The definitive dividing line between bull and bear market regimes." },
      { time: 420, title: "07:00 - Defining Invalidation Stops", description: "Finding the exact level where your thesis is proven wrong before entering." },
      { time: 540, title: "09:00 - Live Chart Walkthrough (NVDA & BTC)", description: "Applying structure reading to live market data." },
    ],
    takeaways: [
      "Always mark the last 3 swing highs and lows before loading any oscillator.",
      "An uptrend remains structurally valid until a prior swing low breaks on a closing candle.",
      "The invalidation level is not arbitrary: it sits exactly beyond the key structural pivot.",
    ],
    quiz: {
      question: "In NextWall Street's framework, what determines if an uptrend has broken?",
      options: [
        "RSI dropping below 50",
        "A prior swing low breaking on a confirmed closing basis",
        "A 5% intraday drop in price",
        "The 20-day moving average turning red",
      ],
      correctIndex: 1,
      explanation: "Price structure takes precedence over oscillators. A trend is intact until a prior swing low breaks on a closing basis.",
    },
  },
  {
    id: "lesson-crypto-liquidity",
    title: "Lesson 2: Crypto Liquidity, Order Books & Float",
    durationSeconds: 720,
    durationLabel: "12:00",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    summary:
      "When evaluating Bitcoin, Solana, and Binance altcoins, there are no discounted cash flows. Here is how to price global liquidity, real yields, stablecoin float, and exchange order books.",
    chapters: [
      { time: 0, title: "00:00 - The Global Liquidity Regime", description: "Mapping M2 expansion and real interest rates to crypto momentum." },
      { time: 120, title: "02:00 - Float vs. Total Supply Dynamics", description: "Why low float/high FDV coins face perpetual downward pressure." },
      { time: 300, title: "05:00 - Exchange Order Book Depth", description: "Measuring bid-ask slippage and market-maker inventory skew." },
      { time: 480, title: "08:00 - Volatility-Scaled Sizing Maths", description: "Sizing crypto so a 40% drawdown is fully survivable." },
      { time: 630, title: "10:30 - Execution Checklist", description: "Three strict rules for entering liquid digital asset positions." },
    ],
    takeaways: [
      "Crypto has no valuation floor — it has a liquidity ceiling driven by macro conditions.",
      "Float, not total paper market cap, decides how violently price moves.",
      "Scale position sizes by realized 60-day volatility rather than fixed dollar allocations.",
    ],
    quiz: {
      question: "Why does the model emphasize float over fully diluted valuation (FDV)?",
      options: [
        "Because FDV includes tokens not yet circulating in the order book",
        "Because all tokens trade at the same speed",
        "Because FDV is always zero for Bitcoin",
        "Because market makers only look at social media mentions",
      ],
      correctIndex: 0,
      explanation: "Float represents the actual supply available to trade. Large future unlocks create structural overhead that depresses token price over time.",
    },
  },
  {
    id: "lesson-pump-fun-risk",
    title: "Lesson 3: Pump.fun & Meme Coins — The Pure Risk Protocol",
    durationSeconds: 540,
    durationLabel: "09:00",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    summary:
      "From Fartcoin and Goat to viral pump.fun tokens: an institutional breakdown of bonding curves, wallet concentration, narrative half-life, and mechanical profit-taking.",
    chapters: [
      { time: 0, title: "00:00 - Attention Economics Explained", description: "Why meme coins are liquidity events dressed in community mascots." },
      { time: 100, title: "01:40 - Top 100 Wallet Concentration", description: "Reading on-chain wallet clusters and bubble maps before buying." },
      { time: 220, title: "03:40 - Pump.fun Bonding Curve Mechanics", description: "Understanding the migration threshold to Raydium and DEXs." },
      { time: 360, title: "06:00 - The Distribution Phase Signature", description: "Spotting volume divergence when smart money exits into retail hype." },
      { time: 460, title: "07:40 - The Hard 2% Portfolio Rule", description: "Never averaging down and taking partial profits mechanically." },
    ],
    takeaways: [
      "If top-100 wallets hold over 40% of supply, the exit door is narrower than the entrance.",
      "A rising price on declining volume is an immediate liquidity exit signal.",
      "Never average down on a broken meme trend; the thesis is momentum only.",
    ],
    quiz: {
      question: "What is the primary risk management rule when trading pump.fun meme tokens?",
      options: [
        "Hold until a 100x return occurs",
        "Average down when the coin drops 80%",
        "Cap total meme exposure under 2% and never average down",
        "Only buy tokens with animal names",
      ],
      correctIndex: 2,
      explanation: "Because meme tokens have no fundamental anchor, position size is the entire risk control. Capping exposure and never averaging down prevents catastrophic loss.",
    },
  },
];

export default function WatchableVideoPlayer({
  initialLessonId,
  courseTitle = "Technical Analysis & Trend Architecture",
}: {
  initialLessonId?: string;
  courseTitle?: string;
}) {
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const lesson = SAMPLE_VIDEO_LESSONS[activeLessonIndex] || SAMPLE_VIDEO_LESSONS[0];

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(lesson.durationSeconds);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ id: string; time: number; note: string }[]>([]);
  const [bookmarkInput, setBookmarkInput] = useState("");
  const [activeTab, setActiveTab] = useState<"chapters" | "takeaways" | "quiz" | "bookmarks">("chapters");
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Sync initial lesson
  useEffect(() => {
    if (initialLessonId) {
      const idx = SAMPLE_VIDEO_LESSONS.findIndex((l) => l.id === initialLessonId);
      if (idx !== -1) setActiveLessonIndex(idx);
    }
  }, [initialLessonId]);

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`video-bookmarks-${lesson.id}`);
      if (saved) setBookmarks(JSON.parse(saved));
      else setBookmarks([]);
    } catch {
      // ignore
    }
    setSelectedQuizAnswer(null);
    setShowQuizResult(false);
    setCurrentTime(0);
    setIsPlaying(false);
    setVideoError(false);
  }, [lesson.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setVideoError(true));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || lesson.durationSeconds);
  };

  const handleSeek = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, Math.min(seconds, duration));
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 0.8;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const changeSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (videoRef.current) videoRef.current.playbackRate = newSpeed;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const addBookmark = () => {
    if (!bookmarkInput.trim()) return;
    const newBookmark = {
      id: String(Date.now()),
      time: Math.floor(currentTime),
      note: bookmarkInput.trim(),
    };
    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    setBookmarkInput("");
    try {
      localStorage.setItem(`video-bookmarks-${lesson.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const deleteBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id);
    setBookmarks(updated);
    try {
      localStorage.setItem(`video-bookmarks-${lesson.id}`, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const formatTime = (totalSeconds: number) => {
    const s = Math.floor(totalSeconds % 60);
    const m = Math.floor((totalSeconds / 60) % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const activeChapter = lesson.chapters
    .slice()
    .reverse()
    .find((c) => currentTime >= c.time) || lesson.chapters[0];

  return (
    <div className="rounded-2xl border border-line bg-ink-950 p-4 sm:p-6 shadow-2xl">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
              <Sparkles className="h-3 w-3 text-gold" />
              Watchable Video Tutorial
            </span>
            <span className="text-xs text-muted">1080p HD Studio</span>
          </div>
          <h2 className="mt-1 font-display text-xl text-bone sm:text-2xl">{lesson.title}</h2>
          <p className="mt-0.5 text-xs text-muted">
            Instructor: <span className="text-bone/90 font-medium">{lesson.instructor}</span> ({lesson.instructorRole}) · Course:{" "}
            <span className="text-gold-bright">{courseTitle}</span>
          </p>
        </div>

        {/* Lesson selector pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {SAMPLE_VIDEO_LESSONS.map((l, idx) => (
            <button
              key={l.id}
              onClick={() => setActiveLessonIndex(idx)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeLessonIndex === idx
                  ? "border border-gold bg-gold text-ink-950 shadow-md font-semibold"
                  : "border border-line bg-ink-900 text-muted hover:border-line/80 hover:text-bone"
              }`}
            >
              Lesson {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div
        ref={containerRef}
        className="group relative overflow-hidden rounded-xl border border-line bg-black shadow-inner"
      >
        <video
          ref={videoRef}
          src={lesson.videoUrl}
          playsInline
          preload="metadata"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onError={() => setVideoError(true)}
          onClick={togglePlay}
          className="h-auto max-h-[580px] w-full object-contain cursor-pointer aspect-video bg-black"
        />

        {/* Video Overlay Fallback / Visual Chart Overlay if video is buffering or on first paint */}
        {videoError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-ink-950/90 p-6 text-center">
            <TrendingUp className="h-12 w-12 text-gold animate-pulse mb-3" />
            <h4 className="font-display text-lg text-bone">Technical Market Simulation Stream</h4>
            <p className="mt-1 max-w-md text-xs text-muted">
              Live algorithmic candlestick chart simulation loaded for {lesson.title}. Use the scrubber and chapters below to jump across key price structure levels.
            </p>
            <button
              onClick={() => {
                setVideoError(false);
                togglePlay();
              }}
              className="mt-4 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-ink-950 hover:bg-gold-bright"
            >
              Reload Video Stream
            </button>
          </div>
        )}

        {/* Big centered play button when paused */}
        {!isPlaying && !videoError && (
          <div
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-all cursor-pointer"
          >
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/70 bg-ink-900/90 text-gold-bright shadow-2xl transition-transform hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-current" />
            </div>
          </div>
        )}

        {/* Floating chapter badge in upper corner */}
        <div className="absolute top-4 left-4 pointer-events-none rounded-lg border border-line/60 bg-ink-950/80 px-3 py-1.5 backdrop-blur">
          <span className="text-[10px] uppercase tracking-[0.14em] text-gold font-semibold">Active Chapter</span>
          <p className="text-xs font-medium text-bone">{activeChapter.title}</p>
        </div>

        {/* Video Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/75 to-transparent p-4 transition-opacity group-hover:opacity-100 opacity-95">
          {/* Progress Bar / Scrubber */}
          <div className="mb-3 flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.5}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-line accent-gold focus:outline-none"
              aria-label="Video scrubber"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left controls: Play, Pause, Rewind 10s, Time */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-ink-950 hover:bg-gold-bright"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(currentTime - 10)}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line/80 bg-ink-900/80 text-bone hover:border-gold/40"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="text-muted hover:text-bone"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="hidden h-1.5 w-16 cursor-pointer appearance-none rounded-lg bg-line accent-gold sm:inline-block"
                  aria-label="Volume"
                />
              </div>

              {/* Time display */}
              <span className="font-mono text-xs tabular-nums text-bone/90">
                {formatTime(currentTime)} <span className="text-muted">/</span> {formatTime(duration)}
              </span>
            </div>

            {/* Right controls: Speed, Bookmark, Fullscreen */}
            <div className="flex items-center gap-2.5">
              {/* Playback speed selector */}
              <div className="flex items-center rounded-md border border-line/70 bg-ink-900/80 px-1 py-0.5 text-[11px]">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => changeSpeed(s)}
                    className={`rounded px-1.5 py-0.5 font-mono ${
                      speed === s ? "bg-gold text-ink-950 font-bold" : "text-muted hover:text-bone"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("bookmarks")}
                className="flex items-center gap-1 rounded-md border border-line/70 bg-ink-900/80 px-2.5 py-1 text-[11px] text-bone hover:border-gold/40"
                title="Save video timestamp bookmark"
              >
                <Bookmark className="h-3.5 w-3.5 text-gold" />
                <span className="hidden sm:inline">Note</span>
              </button>

              <button
                type="button"
                onClick={toggleFullscreen}
                className="flex h-8 w-8 items-center justify-center rounded-md border border-line/70 bg-ink-900/80 text-bone hover:border-gold/40"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation below player: Chapters, Key Takeaways, Interactive Quiz, Bookmarks */}
      <div className="mt-6">
        <div className="flex border-b border-line/70">
          {[
            { id: "chapters", label: "Video Chapters & Timestamps", icon: Clock },
            { id: "takeaways", label: "Executive Takeaways", icon: CheckCircle },
            { id: "quiz", label: "Interactive Knowledge Check", icon: HelpCircle },
            { id: "bookmarks", label: `My Timestamps (${bookmarks.length})`, icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition-all ${
                  activeTab === tab.id
                    ? "border-gold text-gold-bright"
                    : "border-transparent text-muted hover:text-bone"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab 1: Video Chapters with clickable seek */}
        {activeTab === "chapters" && (
          <div className="mt-4 space-y-2">
            <p className="text-xs text-muted mb-3">
              Click any chapter below to jump the video directly to that lesson segment:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {lesson.chapters.map((ch, idx) => {
                const isActive = activeChapter.time === ch.time;
                return (
                  <button
                    key={ch.title}
                    onClick={() => handleSeek(ch.time)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? "border-gold/60 bg-gold/10 text-bone shadow-sm"
                        : "border-line bg-ink-900/50 text-muted hover:border-gold/30 hover:text-bone"
                    }`}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-800 font-mono text-xs text-gold">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-semibold text-gold-bright">{ch.title}</p>
                      <p className="mt-1 text-xs leading-relaxed text-bone/80 line-clamp-2">{ch.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Executive Takeaways */}
        {activeTab === "takeaways" && (
          <div className="mt-4 rounded-xl border border-line bg-ink-900/40 p-5">
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-gold">
              Core Principles from this Lesson
            </h4>
            <ul className="mt-3 space-y-2.5">
              {lesson.takeaways.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-bone/90">
                  <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-up/20 text-up font-bold text-xs">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Tab 3: Interactive Quiz */}
        {activeTab === "quiz" && (
          <div className="mt-4 rounded-xl border border-line bg-ink-900/50 p-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                Lesson Quiz
              </span>
              <span className="text-xs text-muted">Test your comprehension</span>
            </div>
            <p className="mt-2 text-sm font-medium text-bone">{lesson.quiz.question}</p>

            <div className="mt-4 space-y-2">
              {lesson.quiz.options.map((option, i) => {
                let optionStyle = "border-line bg-ink-850 hover:border-gold/40 text-bone";
                if (showQuizResult) {
                  if (i === lesson.quiz.correctIndex) {
                    optionStyle = "border-up bg-up/10 text-up font-semibold";
                  } else if (selectedQuizAnswer === i) {
                    optionStyle = "border-down bg-down/10 text-down";
                  }
                } else if (selectedQuizAnswer === i) {
                  optionStyle = "border-gold bg-gold/10 text-gold-bright";
                }

                return (
                  <button
                    key={option}
                    disabled={showQuizResult}
                    onClick={() => setSelectedQuizAnswer(i)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-xs transition-all ${optionStyle}`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[11px] font-mono">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {!showQuizResult ? (
              <button
                type="button"
                disabled={selectedQuizAnswer === null}
                onClick={() => setShowQuizResult(true)}
                className="mt-4 rounded-full bg-gold px-5 py-2 text-xs font-semibold text-ink-950 transition-all disabled:opacity-40 hover:bg-gold-bright"
              >
                Submit Answer
              </button>
            ) : (
              <div className="mt-4 rounded-lg border border-line bg-ink-800 p-4">
                <p className="text-xs font-semibold text-bone">
                  {selectedQuizAnswer === lesson.quiz.correctIndex ? "🎉 Correct!" : "⚠️ Review the Concept:"}
                </p>
                <p className="mt-1 text-xs text-muted leading-relaxed">{lesson.quiz.explanation}</p>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuizResult(false);
                    setSelectedQuizAnswer(null);
                  }}
                  className="mt-3 text-xs text-gold underline underline-offset-2 hover:text-gold-bright"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: My Timestamps & Notes */}
        {activeTab === "bookmarks" && (
          <div className="mt-4 rounded-xl border border-line bg-ink-900/40 p-5">
            <p className="text-xs text-muted">
              Bookmark the exact second in this video with personal trading notes:
            </p>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={bookmarkInput}
                onChange={(e) => setBookmarkInput(e.target.value)}
                placeholder={`Save note at ${formatTime(currentTime)} (e.g. Invalidation stop strategy)...`}
                className="w-full rounded-lg border border-line bg-ink-950 px-3.5 py-2 text-xs text-bone placeholder:text-muted/60 focus:border-gold focus:outline-none"
              />
              <button
                type="button"
                onClick={addBookmark}
                className="shrink-0 rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-ink-950 hover:bg-gold-bright"
              >
                Bookmark
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {bookmarks.length === 0 ? (
                <p className="text-center py-6 text-xs text-muted/70">No saved bookmarks yet for this lesson.</p>
              ) : (
                bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="flex items-center justify-between gap-3 rounded-lg border border-line bg-ink-850 px-3.5 py-2.5"
                  >
                    <button
                      onClick={() => handleSeek(bm.time)}
                      className="flex items-center gap-2 text-left group"
                    >
                      <span className="font-mono text-xs font-semibold text-gold group-hover:underline">
                        {formatTime(bm.time)}
                      </span>
                      <span className="text-xs text-bone group-hover:text-gold-bright">{bm.note}</span>
                    </button>
                    <button
                      onClick={() => deleteBookmark(bm.id)}
                      className="text-xs text-muted hover:text-down"
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
