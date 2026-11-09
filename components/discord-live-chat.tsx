"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Send,
  Sparkles,
  Clock,
  Radio,
  Hash,
  Users,
  Smile,
  Shield,
  Zap,
  Bot,
  Copy,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Flame,
  Search,
  Check,
  AlertTriangle,
  Compass,
} from "lucide-react";
import {
  generateMinutePrediction,
  handleAIModeratorQuery,
  formatTimeZones,
  type MinutePrediction,
  type ChatMessage,
} from "@/lib/ai-moderator";
import { fmtPrice } from "@/lib/market";

type Channel = {
  id: string;
  name: string;
  topic: string;
  unreadCount?: number;
  category: "ANNOUNCEMENTS" | "TRADING FLOORS" | "QUANT ALERTS";
};

const CHANNELS: Channel[] = [
  {
    id: "ai-minute-predictions",
    name: "ai-minute-predictions",
    topic: "Automated real-time technical signals generated every 60 seconds by Nexus Sentinel AI",
    category: "ANNOUNCEMENTS",
  },
  {
    id: "general-trading",
    name: "general-trading",
    topic: "Live market tape discussion across stocks, crypto, and meme coins",
    category: "TRADING FLOORS",
  },
  {
    id: "stock-scalping",
    name: "stock-scalping",
    topic: "S&P 500, Nasdaq, semiconductors (NVDA, AMD), and mega-cap momentum setups",
    category: "TRADING FLOORS",
  },
  {
    id: "crypto-signals",
    name: "crypto-signals",
    topic: "Bitcoin, Solana, Binance altcoins, and institutional liquidity flows",
    category: "TRADING FLOORS",
  },
  {
    id: "meme-pump-fun",
    name: "meme-pump-fun",
    topic: "Pump.fun bonding curves, viral meme breakouts (FARTCOIN, GOAT, PNUT), & risk sizing",
    category: "TRADING FLOORS",
  },
  {
    id: "breakout-radar",
    name: "breakout-radar",
    topic: "High-volume breakout scanner and 50-day moving average retests",
    category: "QUANT ALERTS",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m-1",
    channelId: "general-trading",
    author: {
      name: "Nexus Sentinel AI",
      avatar: "🤖",
      role: "ai-mod",
      roleLabel: "BOT MOD",
      roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      isBot: true,
      isVerified: true,
    },
    content: "Welcome to the NextWall Street Live Floor. I am your real-time AI Moderator monitoring 118 instruments across S&P 500, Nasdaq, Binance crypto, and pump.fun meme coins. An automated prediction is published every minute with explicit invalidation stops.",
    timestamp: new Date(Date.now() - 360000).toISOString(),
    timeLabel: "10:35 WIB",
    reactions: { "🚀": 14, "💎": 9, "🧠": 18 },
    userReactions: {},
  },
  {
    id: "m-2",
    channelId: "general-trading",
    author: {
      name: "Daniel Okafor",
      avatar: "👨🏾‍💼",
      role: "head-desk",
      roleLabel: "HEAD OF STRATEGY",
      roleColor: "bg-gold/20 text-gold-bright border-gold/40",
      isVerified: true,
    },
    content: "Watching the semiconductor complex into today's session. NVDA holding above its 20-day SMA ($187.40) while AMD consolidates. Remember: we don't argue with structure.",
    timestamp: new Date(Date.now() - 280000).toISOString(),
    timeLabel: "10:36 WIB",
    reactions: { "📈": 12, "🔥": 8 },
    userReactions: {},
  },
  {
    id: "m-3",
    channelId: "general-trading",
    author: {
      name: "JakartaTrader_88",
      avatar: "🇮🇩",
      role: "pro-trader",
      roleLabel: "PRO TRADER",
      roleColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    },
    content: "Pagi tim! Volume pump fun meme coin FARTCOIN dan GOAT pagi ini kenceng banget. AI Mod rekomendasinya gimana buat scalping 5 menit?",
    timestamp: new Date(Date.now() - 190000).toISOString(),
    timeLabel: "10:37 WIB",
    reactions: { "👀": 7, "🚀": 11 },
    userReactions: {},
  },
  {
    id: "m-4",
    channelId: "general-trading",
    author: {
      name: "Mara Lindqvist",
      avatar: "👩🏼‍💻",
      role: "quant",
      roleLabel: "CRYPTO DESK",
      roleColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
      isVerified: true,
    },
    content: "Solana DeFi velocity is absorbing liquidity from Ethereum mainnet. If SOL holds $214 on the 1-hour close, next liquidity target is $228. Invalidation at $206.50.",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    timeLabel: "10:38 WIB",
    reactions: { "💎": 15, "📈": 9 },
    userReactions: {},
  },
  {
    id: "m-5",
    channelId: "general-trading",
    author: {
      name: "Nexus Sentinel AI",
      avatar: "🤖",
      role: "ai-mod",
      roleLabel: "BOT MOD",
      roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      isBot: true,
      isVerified: true,
    },
    content: "⚡ **AUTOMATED MINUTE ALPHA ALERT: $NVDA (NVIDIA Corp.)**\nReal-time technical prediction generated at 10:39 WIB. Confidence: 89%.",
    prediction: {
      id: "pred-init-nvda",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      kind: "stock",
      group: "Semiconductors / AI",
      currentPrice: 187.4,
      stance: "STRONG BUY / LONG",
      confidence: 89,
      target1: 194.5,
      target2: 202.0,
      invalidationLevel: 184.2,
      technicalMechanism: "Bullish continuation: Tape trading firmly above 20-day SMA ($187.40) and 50-day average. Institutional order flow expanding into next hyperscaler capex prints.",
      timeHorizon: "1h Momentum",
      catalystAlert: "Quarterly data-centre revenue print",
      timestamp: new Date(Date.now() - 60000).toISOString(),
      wibTime: "10:39:00",
      utcTime: "03:39:00",
    },
    timestamp: new Date(Date.now() - 60000).toISOString(),
    timeLabel: "10:39 WIB",
    reactions: { "🚀": 22, "🔥": 17, "💎": 14 },
    userReactions: { "🚀": true },
  },
  {
    id: "m-6",
    channelId: "general-trading",
    author: {
      name: "Nexus Sentinel AI",
      avatar: "🤖",
      role: "ai-mod",
      roleLabel: "BOT MOD",
      roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
      isBot: true,
      isVerified: true,
    },
    content: "⚡ **AUTOMATED MINUTE ALPHA ALERT: $FARTCOIN (Fartcoin)**\nReal-time technical prediction generated at 10:40 WIB. Confidence: 84%.",
    prediction: {
      id: "pred-init-fartcoin",
      symbol: "FARTCOIN",
      name: "Fartcoin",
      kind: "meme",
      group: "Pump.fun Meta / AI Viral",
      currentPrice: 0.88,
      stance: "ACCUMULATE / DIP",
      confidence: 84,
      target1: 0.985,
      target2: 1.15,
      invalidationLevel: 0.774,
      technicalMechanism: "Bonding curve velocity surge on pump.fun + Terminal of Truths viral discussion. High retail order flow momentum with 2% hard risk sizing cap.",
      timeHorizon: "5m Scalp",
      catalystAlert: "Tier-1 centralized exchange spot listings",
      timestamp: new Date(Date.now() - 30000).toISOString(),
      wibTime: "10:40:00",
      utcTime: "03:40:00",
    },
    timestamp: new Date(Date.now() - 30000).toISOString(),
    timeLabel: "10:40 WIB",
    reactions: { "🚀": 31, "👀": 19, "💎": 25 },
    userReactions: { "💎": true },
  },
];

export default function DiscordLiveChat() {
  const [activeChannelId, setActiveChannelId] = useState("general-trading");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTypingAI, setIsTypingAI] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Clocks and countdown
  const [timeData, setTimeData] = useState(() => formatTimeZones());
  const [countdown, setCountdown] = useState(60); // 60s countdown to next prediction
  const [aiPredictionsCount, setAiPredictionsCount] = useState(1);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Clock timer: updates every 1000ms
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setTimeData(formatTimeZones());
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerMinutePrediction();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(clockInterval);
  }, [activeChannelId]);

  // Scroll inner message container only
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTypingAI]);

  // Trigger an automated minute prediction
  const triggerMinutePrediction = (forcedSymbol?: string) => {
    const pred = generateMinutePrediction(forcedSymbol);
    const date = new Date();
    const { wibTime } = formatTimeZones(date);

    const newMsg: ChatMessage = {
      id: `ai-pred-${Date.now()}`,
      channelId: activeChannelId === "ai-minute-predictions" ? "ai-minute-predictions" : "general-trading",
      author: {
        name: "Nexus Sentinel AI",
        avatar: "🤖",
        role: "ai-mod",
        roleLabel: "BOT MOD",
        roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
        isBot: true,
        isVerified: true,
      },
      content: `⚡ **AUTOMATED MINUTE ALPHA ALERT: $${pred.symbol} (${pred.name})**\n` +
        `Real-time technical prediction generated at ${wibTime} WIB. Confidence: ${pred.confidence}%.`,
      prediction: pred,
      timestamp: date.toISOString(),
      timeLabel: `${wibTime} WIB`,
      reactions: { "🚀": 8, "💎": 5, "📈": 10 },
      userReactions: {},
    };

    setMessages((prev) => [...prev, newMsg]);
    setAiPredictionsCount((c) => c + 1);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText.trim();
    setInputText("");

    const date = new Date();
    const { wibTime } = formatTimeZones(date);

    // Add user's message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      channelId: activeChannelId,
      author: {
        name: "You (Pro Trader)",
        avatar: "👤",
        role: "pro-trader",
        roleLabel: "SUBSCRIBER",
        roleColor: "bg-gold/20 text-gold-bright border-gold/40",
      },
      content: userText,
      timestamp: date.toISOString(),
      timeLabel: `${wibTime} WIB`,
      reactions: { "👍": 1 },
      userReactions: { "👍": true },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTypingAI(true);

    try {
      // Call AI endpoint or process locally
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();

      setIsTypingAI(false);

      const aiReplyMsg: ChatMessage = {
        id: `ai-reply-${Date.now()}`,
        channelId: activeChannelId,
        author: {
          name: "Nexus Sentinel AI",
          avatar: "🤖",
          role: "ai-mod",
          roleLabel: "BOT MOD",
          roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          isBot: true,
          isVerified: true,
        },
        content: data.reply || "Signal recorded. Monitoring tape for confirmation.",
        prediction: data.prediction,
        timestamp: new Date().toISOString(),
        timeLabel: `${formatTimeZones().wibTime} WIB`,
        reactions: { "🧠": 6, "🚀": 4 },
        userReactions: {},
      };

      setMessages((prev) => [...prev, aiReplyMsg]);
    } catch {
      setIsTypingAI(false);
      const fallback = handleAIModeratorQuery(userText);
      const aiReplyMsg: ChatMessage = {
        id: `ai-reply-${Date.now()}`,
        channelId: activeChannelId,
        author: {
          name: "Nexus Sentinel AI",
          avatar: "🤖",
          role: "ai-mod",
          roleLabel: "BOT MOD",
          roleColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          isBot: true,
          isVerified: true,
        },
        content: fallback.reply,
        prediction: fallback.prediction,
        timestamp: new Date().toISOString(),
        timeLabel: `${formatTimeZones().wibTime} WIB`,
        reactions: { "🧠": 4, "🚀": 3 },
        userReactions: {},
      };
      setMessages((prev) => [...prev, aiReplyMsg]);
    }
  };

  const toggleReaction = (msgId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id !== msgId) return msg;
        const currentCount = msg.reactions[emoji] || 0;
        const hasReacted = msg.userReactions[emoji];
        return {
          ...msg,
          reactions: {
            ...msg.reactions,
            [emoji]: hasReacted ? Math.max(0, currentCount - 1) : currentCount + 1,
          },
          userReactions: {
            ...msg.userReactions,
            [emoji]: !hasReacted,
          },
        };
      }),
    );
  };

  const copyInvalidation = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];
  const channelMessages = messages.filter(
    (m) => m.channelId === activeChannelId || m.author.role === "ai-mod" || activeChannelId === "general-trading",
  );

  return (
    <div className="flex h-[750px] max-h-[82vh] w-full overflow-hidden rounded-2xl border border-line bg-[#1e1f22] text-[#dbdee1] shadow-2xl">
      {/* 1. Leftmost Server Rail (Discord Server List) */}
      <div className="hidden sm:flex w-[72px] flex-col items-center gap-3 bg-[#111214] py-3 z-10 shrink-0">
        {/* NextWall Street Main Server Icon */}
        <div className="group relative flex items-center justify-center">
          <div className="absolute -left-3 h-8 w-1 rounded-r-full bg-white transition-all group-hover:h-10" />
          <button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold via-amber-600 to-amber-700 text-ink-950 font-black text-xl shadow-lg transition-all hover:rounded-xl"
            title="NextWall Street Alpha Hub"
          >
            NW
          </button>
        </div>

        <div className="h-0.5 w-8 rounded-full bg-[#35363c]" />

        {/* Other Simulated Hub Servers */}
        {[
          { label: "SPX", name: "S&P 500 Pit", color: "bg-blue-600" },
          { label: "BIN", name: "Binance VIP Room", color: "bg-amber-500 text-black" },
          { label: "PUMP", name: "Pump.fun Degens", color: "bg-emerald-600" },
          { label: "AI", name: "Quant Lab", color: "bg-purple-600" },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            className={`flex h-11 w-11 items-center justify-center rounded-3xl ${s.color} font-bold text-xs text-white transition-all hover:rounded-xl hover:opacity-90`}
            title={s.name}
          >
            {s.label}
          </button>
        ))}

        <div className="mt-auto flex flex-col items-center gap-2">
          <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
        </div>
      </div>

      {/* 2. Channel Sidebar */}
      <div className="flex w-60 sm:w-64 flex-col border-r border-[#1f2023] bg-[#2b2d31] shrink-0">
        {/* Server Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#1f2023] px-4 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-sm text-bone">NextWall Street Alpha</span>
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500 text-[10px] text-white">
              ✓
            </span>
          </div>
          <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            1.8k
          </span>
        </div>

        {/* AI Moderator Status Pill */}
        <div className="mx-3 mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <Bot className="h-4 w-4" />
              Nexus Sentinel AI
            </div>
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-mono uppercase text-emerald-300">
              LIVE MOD
            </span>
          </div>
          <p className="mt-1 text-[11px] text-muted">
            Analyzing 118 tickers. Next minute prediction: <span className="font-mono text-gold-bright">{countdown}s</span>
          </p>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {(["ANNOUNCEMENTS", "TRADING FLOORS", "QUANT ALERTS"] as const).map((category) => (
            <div key={category}>
              <div className="px-2 pb-1 text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
                {category}
              </div>
              <div className="space-y-0.5">
                {CHANNELS.filter((c) => c.category === category).map((channel) => {
                  const isActive = channel.id === activeChannelId;
                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => setActiveChannelId(channel.id)}
                      className={`group flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                        isActive
                          ? "bg-[#35373c] text-white font-medium"
                          : "text-[#949ba4] hover:bg-[#313338] hover:text-[#dbdee1]"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Hash className="h-4 w-4 shrink-0 text-[#80848e] group-hover:text-white" />
                        <span className="truncate">{channel.name}</span>
                      </div>
                      {channel.id === "ai-minute-predictions" && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User bar at bottom */}
        <div className="flex h-14 items-center justify-between border-t border-[#1f2023] bg-[#232428] px-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-amber-700 text-sm">
                👤
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#232428] bg-emerald-500" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-white">Trader (You)</p>
              <p className="text-[10px] text-[#949ba4]">#pro-member</p>
            </div>
          </div>
          <button
            onClick={() => triggerMinutePrediction()}
            className="flex items-center gap-1 rounded bg-gold/15 px-2 py-1 text-[10px] font-bold text-gold-bright hover:bg-gold/25"
            title="Trigger Instant Prediction"
          >
            <Zap className="h-3 w-3" />
            Ping AI
          </button>
        </div>
      </div>

      {/* 3. Main Chat Viewport */}
      <div className="flex flex-1 min-w-0 min-h-0 flex-col bg-[#313338]">
        {/* Top Header with Multi-Timezone Live Clocks */}
        <div className="flex h-16 items-center justify-between border-b border-[#1f2023] bg-[#313338] px-4 shadow-sm shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Hash className="h-5 w-5 text-[#80848e]" />
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-white truncate">{currentChannel.name}</h3>
              <p className="text-[11px] text-[#949ba4] truncate hidden sm:block">{currentChannel.topic}</p>
            </div>
          </div>

          {/* Real-time Multi-Timezone Digital Clocks (WIB, UTC, EST) */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* WIB Clock (Requested in Indonesian prompt) */}
            <div className="flex flex-col items-end rounded-lg border border-line/60 bg-[#2b2d31] px-2.5 py-1">
              <div className="flex items-center gap-1.5 text-[10px] text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-gold-bright">WIB</span>
              </div>
              <span suppressHydrationWarning className="font-mono text-xs font-bold tabular-nums text-white">
                {timeData.wibTime}
              </span>
            </div>

            {/* UTC Clock */}
            <div className="hidden md:flex flex-col items-end rounded-lg border border-line/60 bg-[#2b2d31] px-2.5 py-1">
              <span className="text-[10px] text-muted font-medium">UTC</span>
              <span suppressHydrationWarning className="font-mono text-xs font-bold tabular-nums text-bone">
                {timeData.utcTime}
              </span>
            </div>

            {/* EST Clock & Session Badge */}
            <div className="hidden lg:flex flex-col items-end rounded-lg border border-line/60 bg-[#2b2d31] px-2.5 py-1">
              <div className="flex items-center gap-1 text-[10px]">
                <span className="text-muted font-medium">EST</span>
                <span suppressHydrationWarning className="rounded bg-emerald-500/20 px-1 text-[9px] text-emerald-400">
                  {timeData.sessionStatus}
                </span>
              </div>
              <span suppressHydrationWarning className="font-mono text-xs font-bold tabular-nums text-bone">
                {timeData.estTime}
              </span>
            </div>

            {/* Countdown Badge to Next AI Signal */}
            <div className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-gold animate-spin" />
              <span className="font-mono font-bold text-gold-bright">{countdown}s</span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
          {channelMessages.map((msg) => (
            <div key={msg.id} className="group relative flex gap-3 hover:bg-[#2b2d31]/40 -mx-4 px-4 py-1.5 rounded transition-colors">
              {/* Avatar */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1e1f22] text-xl shadow">
                {msg.author.avatar}
              </div>

              {/* Message Body */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium text-sm text-white hover:underline cursor-pointer">
                    {msg.author.name}
                  </span>
                  <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border uppercase ${msg.author.roleColor}`}>
                    {msg.author.roleLabel}
                  </span>
                  <span className="text-[11px] text-[#949ba4] font-mono">{msg.timeLabel}</span>
                </div>

                <div className="mt-1 text-sm text-[#dbdee1] leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </div>

                {/* Rich Institutional Embed Card for AI Moderator Predictions */}
                {msg.prediction && (
                  <div
                    className={`mt-3 max-w-2xl rounded-xl border-l-4 bg-[#2b2d31] p-4 shadow-lg ${
                      msg.prediction.stance.includes("BUY")
                        ? "border-l-emerald-500"
                        : msg.prediction.stance.includes("ACCUMULATE")
                        ? "border-l-amber-500"
                        : msg.prediction.stance.includes("TRIM")
                        ? "border-l-orange-500"
                        : "border-l-rose-500"
                    }`}
                  >
                    <div className="flex items-center justify-between border-b border-[#35373c] pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-base font-bold text-white">
                          ${msg.prediction.symbol}
                        </span>
                        <span className="text-xs text-[#949ba4]">({msg.prediction.name})</span>
                        <span className="rounded bg-[#1e1f22] px-1.5 py-0.5 text-[10px] font-mono text-gold-bright uppercase">
                          {msg.prediction.kind}
                        </span>
                      </div>
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-xs font-bold text-emerald-400">
                        {msg.prediction.confidence}% Conviction
                      </span>
                    </div>

                    {/* Stance Banner */}
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#949ba4]">Signal:</span>
                        <span className="font-mono text-sm font-black tracking-wide text-gold-bright">
                          {msg.prediction.stance}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-bone">
                        Tape: <span className="text-white font-bold">{fmtPrice(msg.prediction.currentPrice)}</span>
                      </span>
                    </div>

                    {/* Targets & Invalidation Grid */}
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#1e1f22] p-2.5 text-center font-mono">
                      <div>
                        <p className="text-[10px] uppercase text-[#949ba4]">Target 1</p>
                        <p className="mt-0.5 text-xs font-bold text-emerald-400">
                          {fmtPrice(msg.prediction.target1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-[#949ba4]">Target 2</p>
                        <p className="mt-0.5 text-xs font-bold text-emerald-300">
                          {fmtPrice(msg.prediction.target2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-rose-400 font-semibold">Invalidation Stop</p>
                        <p className="mt-0.5 text-xs font-bold text-rose-400">
                          {fmtPrice(msg.prediction.invalidationLevel)}
                        </p>
                      </div>
                    </div>

                    {/* Technical reason */}
                    <p className="mt-2.5 text-xs text-[#dbdee1] leading-relaxed">
                      💡 <span className="font-medium text-white">Mechanism:</span> {msg.prediction.technicalMechanism}
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-[#35373c] pt-2 text-[11px] text-[#949ba4]">
                      <span>Horizon: <strong className="text-bone">{msg.prediction.timeHorizon}</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copyInvalidation(msg.prediction!.id, String(msg.prediction!.invalidationLevel))}
                          className="flex items-center gap-1 rounded bg-[#35373c] px-2 py-1 text-bone hover:text-white"
                        >
                          {copiedId === msg.prediction.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          {copiedId === msg.prediction.id ? "Copied" : "Copy Stop"}
                        </button>
                        <Link
                          href={`/ticker/${msg.prediction.symbol}`}
                          className="flex items-center gap-1 rounded bg-gold/15 px-2 py-1 text-gold-bright hover:bg-gold/25"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View Chart
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Emoji Reactions Row */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {Object.entries(msg.reactions).map(([emoji, count]) => {
                    const active = msg.userReactions[emoji];
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => toggleReaction(msg.id, emoji)}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs transition-colors ${
                          active
                            ? "border-gold/50 bg-gold/15 text-gold-bright"
                            : "border-[#3f4147] bg-[#2b2d31] text-[#949ba4] hover:bg-[#35373c] hover:text-white"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="font-mono text-[11px]">{count}</span>
                      </button>
                    );
                  })}
                  {/* Quick Add Reaction Button */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    {["🚀", "📈", "💎"].map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => toggleReaction(msg.id, e)}
                        className="rounded p-1 text-xs hover:bg-[#35373c]"
                        title={`Add ${e}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* AI typing indicator */}
          {isTypingAI && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse px-4 py-2">
              <Bot className="h-4 w-4" />
              <span>Nexus Sentinel AI is computing 1-minute order book metrics...</span>
            </div>
          )}
        </div>

        {/* Input Bar with Quick Commands */}
        <div className="p-4 bg-[#313338]">
          {/* Quick slash command chips */}
          <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-[#949ba4]">Quick Signals:</span>
            {[
              { label: "/predict NVDA", query: "/predict NVDA" },
              { label: "/predict BTC", query: "/predict BTC" },
              { label: "/predict SOL", query: "/predict SOL" },
              { label: "/predict FARTCOIN", query: "/predict FARTCOIN" },
              { label: "/predict GOAT", query: "/predict GOAT" },
              { label: "🕒 Market Jam", query: "Jam pasar sekarang berapa?" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => {
                  setInputText(chip.query);
                }}
                className="shrink-0 rounded-full border border-[#3f4147] bg-[#2b2d31] px-2.5 py-1 text-[11px] text-bone hover:border-gold/50 hover:text-gold-bright"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-lg bg-[#383a40] px-3.5 py-2.5 shadow-inner"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentChannel.name} (type /predict [symbol] or ask in Indonesian/English)...`}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#80848e] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => triggerMinutePrediction()}
              className="hidden sm:inline-flex items-center gap-1 rounded bg-[#2b2d31] px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold/20"
              title="Request instant 1-minute prediction"
            >
              <Zap className="h-3.5 w-3.5" />
              Instant Signal
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-gold text-ink-950 transition-all disabled:opacity-30 hover:bg-gold-bright"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 4. Right Sidebar: Active Members List */}
      <div className="hidden xl:flex w-60 flex-col border-l border-[#1f2023] bg-[#2b2d31] p-3 shrink-0 overflow-y-auto">
        {/* Category: Bots */}
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
            AI MODERATORS & BOTS — 2
          </p>
          <div className="mt-2 space-y-2">
            {[
              { name: "Nexus Sentinel AI", role: "BOT MOD", desc: "Predicting tape / 60s", avatar: "🤖", online: true },
              { name: "AlphaStream Radar", role: "BOT", desc: "Breakout scanner", avatar: "📡", online: true },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 rounded p-1 hover:bg-[#35373c]">
                <div className="relative">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1f22] text-sm">
                    {m.avatar}
                  </span>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#2b2d31] bg-emerald-500" />
                </div>
                <div className="min-w-0 leading-tight">
                  <div className="flex items-center gap-1">
                    <span className="truncate text-xs font-semibold text-emerald-400">{m.name}</span>
                    <span className="rounded bg-emerald-500/20 px-1 text-[8px] font-bold text-emerald-300">BOT</span>
                  </div>
                  <p className="truncate text-[10px] text-[#949ba4]">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Research Desk */}
        <div className="mb-4">
          <p className="text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
            RESEARCH DESK — 3
          </p>
          <div className="mt-2 space-y-2">
            {[
              { name: "Daniel Okafor", role: "Head of Strategy", avatar: "👨🏾‍💼" },
              { name: "Mara Lindqvist", role: "Crypto Desk", avatar: "👩🏼‍💻" },
              { name: "Priya Raghunathan", role: "Software Analyst", avatar: "👩🏽‍💼" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 rounded p-1 hover:bg-[#35373c]">
                <div className="relative">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1f22] text-sm">
                    {m.avatar}
                  </span>
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#2b2d31] bg-emerald-500" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-xs font-semibold text-gold-bright">{m.name}</p>
                  <p className="truncate text-[10px] text-[#949ba4]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category: Pro Members */}
        <div>
          <p className="text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">
            ONLINE TRADERS — 1,842
          </p>
          <div className="mt-2 space-y-2">
            {[
              { name: "JakartaTrader_88", role: "Pro Member", avatar: "🇮🇩" },
              { name: "AlphaWhale_Sol", role: "Pump.fun Degen", avatar: "🐋" },
              { name: "ScalpMaster_NY", role: "Nasdaq Scalper", avatar: "⚡" },
              { name: "TapeReader99", role: "Order Flow Quant", avatar: "📊" },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-2.5 rounded p-1 hover:bg-[#35373c]">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e1f22] text-sm">
                  {m.avatar}
                </span>
                <div className="min-w-0 leading-tight">
                  <p className="truncate text-xs font-medium text-bone">{m.name}</p>
                  <p className="truncate text-[10px] text-[#949ba4]">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
