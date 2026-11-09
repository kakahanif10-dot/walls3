"use client";

import { useEffect, useRef, useState, useMemo } from "react";
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
  ChevronLeft,
  TrendingUp,
  Search,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import {
  VIDEO_LESSONS_20,
  ACADEMY_MODULES,
  type VideoLesson,
  type VideoChapter,
} from "@/lib/academy-videos";

export type { VideoLesson, VideoChapter };
export const SAMPLE_VIDEO_LESSONS = VIDEO_LESSONS_20;

export default function WatchableVideoPlayer({
  initialLessonId,
  courseTitle = "NextWall Street 20-Lesson Trading Academy",
}: {
  initialLessonId?: string;
  courseTitle?: string;
}) {
  const [selectedModule, setSelectedModule] = useState<string>("All Modules");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);

  const filteredLessons = useMemo(() => {
    return VIDEO_LESSONS_20.filter((lesson) => {
      const matchesModule = selectedModule === "All Modules" || lesson.module === selectedModule;
      const matchesSearch =
        !searchQuery.trim() ||
        lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lesson.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModule && matchesSearch;
    });
  }, [selectedModule, searchQuery]);

  const lesson = VIDEO_LESSONS_20[activeLessonIndex] || VIDEO_LESSONS_20[0];

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

  // Sync initial lesson ID
  useEffect(() => {
    if (initialLessonId) {
      const idx = VIDEO_LESSONS_20.findIndex((l) => l.id === initialLessonId);
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

  const activeChapter =
    lesson.chapters
      .slice()
      .reverse()
      .find((c) => currentTime >= c.time) || lesson.chapters[0];

  const handleNextLesson = () => {
    if (activeLessonIndex < VIDEO_LESSONS_20.length - 1) {
      setActiveLessonIndex(activeLessonIndex + 1);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonIndex(activeLessonIndex - 1);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-ink-950 p-4 sm:p-6 shadow-2xl">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line/60 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-bright">
              <Sparkles className="h-3 w-3 text-gold" />
              Watchable Video Academy (20 Lessons)
            </span>
            <span className="rounded bg-line/60 px-2 py-0.5 text-[10px] font-mono text-muted">
              {lesson.module}
            </span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              {lesson.level}
            </span>
          </div>
          <h2 className="mt-1 font-display text-xl text-bone sm:text-2xl">{lesson.title}</h2>
          <p className="mt-0.5 text-xs text-muted">
            Instructor: <span className="text-bone/90 font-medium">{lesson.instructor}</span> ({lesson.instructorRole}) · Curriculum:{" "}
            <span className="text-gold-bright">{courseTitle}</span>
          </p>
        </div>

        {/* Navigation buttons: Prev / Next */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={activeLessonIndex <= 0}
            onClick={handlePrevLesson}
            className="flex items-center gap-1 rounded-full border border-line bg-ink-900 px-3 py-1.5 text-xs text-bone transition hover:border-gold/50 disabled:opacity-30"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Prev
          </button>
          <span className="font-mono text-xs text-muted">
            <span className="text-gold-bright font-bold">{activeLessonIndex + 1}</span> / 20
          </span>
          <button
            type="button"
            disabled={activeLessonIndex >= VIDEO_LESSONS_20.length - 1}
            onClick={handleNextLesson}
            className="flex items-center gap-1 rounded-full border border-line bg-ink-900 px-3 py-1.5 text-xs text-bone transition hover:border-gold/50 disabled:opacity-30"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Module filter pills & search */}
      <div className="mb-4 flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          {ACADEMY_MODULES.map((mod) => (
            <button
              key={mod}
              onClick={() => setSelectedModule(mod)}
              className={`whitespace-nowrap rounded-full px-3 py-1 transition-all ${
                selectedModule === mod
                  ? "border border-gold bg-gold/20 text-gold-bright font-semibold"
                  : "border border-line bg-ink-900 text-muted hover:text-bone"
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter 20 video lessons..."
            className="w-full rounded-full border border-line bg-ink-900 py-1.5 pl-8 pr-3 text-xs text-bone placeholder:text-muted/60 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Lesson Horizontal Playlist Strip */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {filteredLessons.map((l) => {
          const globalIdx = VIDEO_LESSONS_20.findIndex((item) => item.id === l.id);
          const isActive = globalIdx === activeLessonIndex;
          return (
            <button
              key={l.id}
              onClick={() => setActiveLessonIndex(globalIdx)}
              className={`flex shrink-0 items-center gap-2 rounded-xl border p-2.5 text-left transition-all max-w-[240px] ${
                isActive
                  ? "border-gold bg-gold/15 text-bone shadow-md ring-1 ring-gold/40"
                  : "border-line bg-ink-900/60 text-muted hover:border-line/80 hover:text-bone"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                  isActive ? "bg-gold text-ink-950" : "bg-ink-800 text-muted"
                }`}
              >
                {globalIdx + 1}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">{l.title}</p>
                <div className="flex items-center gap-2 text-[10px] text-muted">
                  <span>{l.durationLabel}</span>
                  <span>·</span>
                  <span className="truncate">{l.instructor.split(" ")[0]}</span>
                </div>
              </div>
            </button>
          );
        })}
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
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const pct = (e.clientX - rect.left) / rect.width;
              handleSeek(pct * duration);
            }}
            className="relative h-2 w-full cursor-pointer rounded-full bg-white/20 transition-all hover:h-2.5"
          >
            <div
              className="h-full rounded-full bg-gold"
              style={{ width: `${(currentTime / Math.max(duration, 1)) * 100}%` }}
            />
            {/* Chapter markers on timeline */}
            {lesson.chapters.map((ch) => (
              <div
                key={ch.time}
                title={ch.title}
                className="absolute top-0 h-full w-0.5 bg-white/50"
                style={{ left: `${(ch.time / Math.max(duration, 1)) * 100}%` }}
              />
            ))}
          </div>

          {/* Bottom control row */}
          <div className="mt-3 flex items-center justify-between text-bone">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-ink-950 transition hover:scale-105"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
              </button>

              <button
                type="button"
                onClick={() => handleSeek(currentTime - 10)}
                className="text-xs text-muted hover:text-bone"
                title="Rewind 10 seconds"
              >
                <RotateCcw className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-1.5 font-mono text-xs text-muted">
                <span className="text-bone">{formatTime(currentTime)}</span>
                <span>/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume Slider */}
              <div className="hidden sm:flex items-center gap-2">
                <button type="button" onClick={toggleMute} className="text-muted hover:text-bone">
                  {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-white/20 accent-gold"
                />
              </div>

              {/* Speed Switcher */}
              <div className="flex items-center gap-1 rounded-lg border border-line/60 bg-ink-900/80 px-2 py-1 text-xs">
                {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => changeSpeed(s)}
                    className={`rounded px-1.5 py-0.5 font-mono text-[11px] ${
                      speed === s ? "bg-gold text-ink-950 font-bold" : "text-muted hover:text-bone"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={toggleFullscreen}
                className="text-muted hover:text-bone"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Details Tabs */}
      <div className="mt-6">
        <div className="flex border-b border-line">
          {[
            { id: "chapters", label: "Chapters & Markers", icon: Layers },
            { id: "takeaways", label: "Executive Takeaways", icon: CheckCircle },
            { id: "quiz", label: "Interactive Quiz", icon: HelpCircle },
            { id: "bookmarks", label: `My Timestamps (${bookmarks.length})`, icon: Bookmark },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition-colors ${
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

        {/* Tab 1: Chapters */}
        {activeTab === "chapters" && (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {lesson.chapters.map((ch, idx) => {
              const isCurrent = activeChapter.time === ch.time;
              return (
                <button
                  key={ch.time}
                  onClick={() => handleSeek(ch.time)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    isCurrent
                      ? "border-gold/60 bg-gold/10 text-bone shadow-md"
                      : "border-line bg-ink-900/60 text-muted hover:border-line hover:text-bone"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-[10px] font-bold ${
                      isCurrent ? "bg-gold text-ink-950" : "bg-ink-800 text-muted"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-gold">{formatTime(ch.time)}</span>
                      <span className="font-medium text-xs text-bone">{ch.title.split(" - ")[1] || ch.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-muted leading-relaxed">{ch.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 2: Executive Takeaways */}
        {activeTab === "takeaways" && (
          <div className="mt-4 rounded-xl border border-line bg-ink-900/50 p-5">
            <h4 className="font-display text-sm text-bone">Core Trading Takeaways for {lesson.title}</h4>
            <ul className="mt-3 space-y-2.5">
              {lesson.takeaways.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-bone/90 leading-relaxed">
                  <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
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
