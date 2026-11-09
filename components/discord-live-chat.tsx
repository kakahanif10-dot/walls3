"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Hash,
  Send,
  Zap,
  Sparkles,
  Bot,
  Clock,
  ExternalLink,
  Copy,
  Check,
  TrendingUp,
  Radio,
  PlusCircle,
  X,
  UserPen,
  RotateCcw,
} from "lucide-react";
import {
  formatTimeZones,
  generateMinutePrediction,
  handleAIModeratorQuery,
  type MinutePrediction,
} from "@/lib/ai-moderator";
import { ASSETS } from "@/lib/market-assets";

export type ChatMessage = {
  id: string;
  channelId: string;
  author: {
    name: string;
    avatar: string;
    role: "ai-mod" | "pro-trader" | "quant" | "community";
    roleLabel: string;
    roleColor: string;
    isBot?: boolean;
    isVerified?: boolean;
  };
  content: string;
  prediction?: MinutePrediction;
  timestamp: string;
  timeLabel: string;
  reactions: Record<string, number>;
  userReactions: Record<string, boolean>;
};

const CHANNELS = [
  { id: "ai-minute-predictions", name: "ai-minute-predictions", topic: "Automated 60-second quantitative predictions across 625+ assets", category: "ANNOUNCEMENTS" },
  { id: "general-trading", name: "general-trading", topic: "Live market tape discussion across stocks, crypto, and meme coins", category: "TRADING FLOORS" },
  { id: "stock-scalping", name: "stock-scalping", topic: "S&P 500 and Nasdaq order flow, swing levels, and earnings setups", category: "TRADING FLOORS" },
  { id: "crypto-signals", name: "crypto-signals", topic: "Binance spot/perp momentum, funding rates, and liquidity sweeps", category: "TRADING FLOORS" },
  { id: "meme-pump-fun", name: "meme-pump-fun", topic: "Pump.fun bonding curve breakouts, viral meta, and 2% risk sizing", category: "TRADING FLOORS" },
  { id: "breakout-radar", name: "breakout-radar", topic: "Quantitative 20-EMA / VWAP momentum expansion alerts", category: "QUANT ALERTS" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
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
    content:
      "Welcome to the NextWall Street Live Floor. I am your real-time AI Moderator monitoring 625+ instruments across S&P 500, Nasdaq, Binance crypto, and pump.fun meme coins. You can send real messages, request instant signals (/predict [symbol]), or ask market questions in Indonesian or English.",
    timestamp: new Date(Date.now() - 300000).toISOString(),
    timeLabel: "10:35 WIB",
    reactions: { "🚀": 14, "💎": 9, "🧠": 18 },
    userReactions: {},
  },
  {
    id: "msg-2",
    channelId: "general-trading",
    author: {
      name: "Daniel Okafor",
      avatar: "👨🏾‍💼",
      role: "pro-trader",
      roleLabel: "HEAD OF STRATEGY",
      roleColor: "bg-gold/20 text-gold-bright border-gold/40",
    },
    content:
      "Watching the semiconductor complex into today's session. NVDA holding above its 20-day SMA ($187.40) while AMD consolidates. Remember: we don't argue with structure.",
    timestamp: new Date(Date.now() - 240000).toISOString(),
    timeLabel: "10:36 WIB",
    reactions: { "📈": 12, "🔥": 8 },
    userReactions: { "📈": true },
  },
  {
    id: "msg-3",
    channelId: "general-trading",
    author: {
      name: "JakartaTrader_88",
      avatar: "🇮🇩",
      role: "community",
      roleLabel: "PRO TRADER",
      roleColor: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    },
    content:
      "Pagi tim! Volume pump fun meme coin FARTCOIN dan GOAT pagi ini kenceng banget. AI Mod rekomendasinya gimana buat scalping 5 menit?",
    timestamp: new Date(Date.now() - 180000).toISOString(),
    timeLabel: "10:37 WIB",
    reactions: { "👀": 7, "🚀": 11 },
    userReactions: {},
  },
  {
    id: "msg-4",
    channelId: "general-trading",
    author: {
      name: "Mara Lindqvist",
      avatar: "👩🏼‍💻",
      role: "quant",
      roleLabel: "CRYPTO DESK",
      roleColor: "bg-purple-500/20 text-purple-400 border-purple-500/40",
    },
    content:
      "Solana DeFi velocity is absorbing liquidity from Ethereum mainnet. If SOL holds $214 on the 1-hour close, next liquidity target is $228. Invalidation at $206.50.",
    timestamp: new Date(Date.now() - 120000).toISOString(),
    timeLabel: "10:38 WIB",
    reactions: { "💎": 15, "📈": 9 },
    userReactions: { "💎": true },
  },
  {
    id: "pred-init-nvda",
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
      catalystAlert: "Datacenter revenue guidance prints",
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
    id: "pred-init-fartcoin",
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

  // User Profile
  const [userName, setUserName] = useState("Trader (You)");
  const [userAvatar, setUserAvatar] = useState("👤");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileInputName, setProfileInputName] = useState("");

  // Post Signal Modal
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [sigSymbol, setSigSymbol] = useState("NVDA");
  const [sigStance, setSigStance] = useState<MinutePrediction["stance"]>("STRONG BUY / LONG");
  const [sigPrice, setSigPrice] = useState("187.40");
  const [sigTarget, setSigTarget] = useState("198.00");
  const [sigStop, setSigStop] = useState("182.50");
  const [sigNotes, setSigNotes] = useState("Breaking above 20-EMA on 15m volume expansion.");

  // Clocks and countdown
  const [timeData, setTimeData] = useState(() => formatTimeZones());
  const [countdown, setCountdown] = useState(60);
  const [aiPredictionsCount, setAiPredictionsCount] = useState(1);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Restore messages and profile from localStorage on mount
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem("nws_discord_messages_v3");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
      const savedProfile = localStorage.getItem("nws_user_profile");
      if (savedProfile) {
        const p = JSON.parse(savedProfile);
        if (p.name) setUserName(p.name);
        if (p.avatar) setUserAvatar(p.avatar);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("nws_discord_messages_v3", JSON.stringify(messages.slice(-50)));
    } catch {
      // ignore
    }
  }, [messages]);

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

  // Scroll inner message container to bottom on new message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTypingAI]);

  const triggerMinutePrediction = (forceSymbol?: string) => {
    const prediction = generateMinutePrediction(forceSymbol, aiPredictionsCount);
    const date = new Date();
    const { wibTime } = formatTimeZones(date);

    const newAlert: ChatMessage = {
      id: `ai-minute-${Date.now()}`,
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
      content: `⚡ **AUTOMATED MINUTE ALPHA ALERT: $${prediction.symbol} (${prediction.name})**\nReal-time technical prediction generated at ${wibTime} WIB. Confidence: ${prediction.confidence}%.`,
      prediction,
      timestamp: date.toISOString(),
      timeLabel: `${wibTime} WIB`,
      reactions: { "🚀": 1, "💎": 1, "🧠": 1 },
      userReactions: {},
    };

    setMessages((prev) => [...prev, newAlert]);
    setAiPredictionsCount((c) => c + 1);
  };

  const handleSendMessageWithText = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    setInputText("");

    const date = new Date();
    const { wibTime } = formatTimeZones(date);

    // 1. Add User's Message Immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      channelId: activeChannelId,
      author: {
        name: userName,
        avatar: userAvatar,
        role: "pro-trader",
        roleLabel: "SUBSCRIBER",
        roleColor: "bg-gold/20 text-gold-bright border-gold/40",
      },
      content: trimmed,
      timestamp: date.toISOString(),
      timeLabel: `${wibTime} WIB`,
      reactions: { "👍": 1 },
      userReactions: { "👍": true },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTypingAI(true);

    // 2. Fetch AI Moderator Response
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
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
        content: data.reply || `Sinyal terkonfirmasi untuk "${trimmed}". Memantau likuiditas order book di tape.`,
        prediction: data.prediction,
        timestamp: new Date().toISOString(),
        timeLabel: `${formatTimeZones().wibTime} WIB`,
        reactions: { "🧠": 6, "🚀": 4 },
        userReactions: {},
      };

      setMessages((prev) => [...prev, aiReplyMsg]);
    } catch {
      setIsTypingAI(false);
      const fallback = handleAIModeratorQuery(trimmed);
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    await handleSendMessageWithText(inputText);
  };

  const handlePostSignal = (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date();
    const { wibTime } = formatTimeZones(date);

    const customPrediction: MinutePrediction = {
      id: `usr-sig-${Date.now()}`,
      symbol: sigSymbol.toUpperCase(),
      name: ASSETS.find((a) => a.symbol === sigSymbol.toUpperCase())?.name || sigSymbol.toUpperCase(),
      kind: ASSETS.find((a) => a.symbol === sigSymbol.toUpperCase())?.kind || "stock",
      group: ASSETS.find((a) => a.symbol === sigSymbol.toUpperCase())?.group || "Equities / Crypto",
      currentPrice: Number(sigPrice) || 100,
      stance: sigStance,
      confidence: 88,
      target1: Number(sigTarget) || Number(sigPrice) * 1.05,
      target2: Number(sigTarget) * 1.05 || Number(sigPrice) * 1.1,
      invalidationLevel: Number(sigStop) || Number(sigPrice) * 0.95,
      technicalMechanism: sigNotes || "User member setup: technical consolidation breakout with defined risk-reward.",
      timeHorizon: "1h Momentum",
      catalystAlert: "Technical order flow breakout",
      timestamp: date.toISOString(),
      wibTime,
      utcTime: timeData.utcTime,
    };

    const userSignalMsg: ChatMessage = {
      id: `user-sig-${Date.now()}`,
      channelId: activeChannelId,
      author: {
        name: userName,
        avatar: userAvatar,
        role: "pro-trader",
        roleLabel: "COMMUNITY SIGNAL",
        roleColor: "bg-gold/25 text-gold-bright border-gold/50",
      },
      content: `🎯 **COMMUNITY TRADE SIGNAL: $${customPrediction.symbol} (${sigStance})**\nEntry: $${sigPrice} | Target: $${sigTarget} | Stop: $${sigStop}`,
      prediction: customPrediction,
      timestamp: date.toISOString(),
      timeLabel: `${wibTime} WIB`,
      reactions: { "🚀": 5, "💎": 3, "🔥": 4 },
      userReactions: { "🚀": true },
    };

    setMessages((prev) => [...prev, userSignalMsg]);
    setShowSignalModal(false);
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

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveProfile = () => {
    if (profileInputName.trim()) {
      setUserName(profileInputName.trim());
      try {
        localStorage.setItem(
          "nws_user_profile",
          JSON.stringify({ name: profileInputName.trim(), avatar: userAvatar }),
        );
      } catch {}
    }
    setIsEditingProfile(false);
  };

  const handleResetChat = () => {
    if (confirm("Reset chat to default institutional state?")) {
      setMessages(INITIAL_MESSAGES);
      try {
        localStorage.removeItem("nws_discord_messages_v3");
      } catch {}
    }
  };

  const currentChannel = CHANNELS.find((c) => c.id === activeChannelId) || CHANNELS[0];
  const channelMessages = messages.filter(
    (m) =>
      m.channelId === activeChannelId ||
      m.author.role === "ai-mod" ||
      activeChannelId === "general-trading",
  );

  return (
    <div className="flex h-[780px] max-h-[85vh] w-full overflow-hidden rounded-2xl border border-line bg-[#1e1f22] text-[#dbdee1] shadow-2xl">
      {/* 1. Leftmost Server Rail */}
      <div className="flex w-18 flex-col items-center gap-3 border-r border-[#1f2023] bg-[#1e1f22] py-3 shrink-0">
        <Link
          href="/"
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#313338] text-gold transition-all hover:rounded-xl hover:bg-gold hover:text-ink-950"
          title="Back to NextWallStreet"
        >
          <span className="font-display font-bold text-lg">NW</span>
        </Link>
        <div className="h-0.5 w-8 rounded bg-[#35363c]" />

        {/* Server Guild Icons */}
        <button
          onClick={() => setActiveChannelId("general-trading")}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-lg transition-all hover:rounded-xl"
          title="S&P 500 & Nasdaq Desk"
        >
          <span className="text-xs font-bold font-mono">SPX</span>
        </button>

        <button
          onClick={() => setActiveChannelId("crypto-signals")}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg transition-all hover:rounded-xl"
          title="Binance Crypto Desk"
        >
          <span className="text-xs font-bold font-mono">BIN</span>
        </button>

        <button
          onClick={() => setActiveChannelId("meme-pump-fun")}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-800 text-white shadow-lg transition-all hover:rounded-xl"
          title="Pump.fun Meme Meta Desk"
        >
          <span className="text-xs font-bold font-mono">PUMP</span>
        </button>

        <button
          onClick={() => setActiveChannelId("ai-minute-predictions")}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-700 text-white shadow-lg transition-all hover:rounded-xl"
          title="AI Sentinel 60s Predictions"
        >
          <span className="text-xs font-bold font-mono">AI</span>
        </button>

        <div className="mt-auto flex flex-col items-center gap-2">
          <span
            className="flex h-3 w-3 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20"
            title="System Online (625+ Assets Monitored)"
          />
        </div>
      </div>

      {/* 2. Channels Sidebar */}
      <div className="flex w-60 sm:w-64 flex-col border-r border-[#1f2023] bg-[#2b2d31] shrink-0">
        {/* Server Header */}
        <div className="flex h-14 items-center justify-between border-b border-[#1f2023] px-4 font-semibold text-white shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-display tracking-tight text-sm text-gold-bright">NextWall Street Alpha</span>
            <span className="rounded bg-emerald-500/20 px-1 text-[9px] font-mono text-emerald-400">✓</span>
          </div>
          <button
            onClick={handleResetChat}
            className="text-[10px] text-muted hover:text-bone"
            title="Reset Chat"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* AI Moderator Status Pill */}
        <div className="m-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Bot className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span className="font-semibold text-emerald-300 text-[11px]">Nexus Sentinel AI</span>
            </div>
            <span className="rounded bg-emerald-500/30 px-1.5 py-0.2 text-[9px] font-mono text-emerald-300">LIVE MOD</span>
          </div>
          <p className="mt-1 text-[10px] text-emerald-200/80 leading-tight">
            Monitoring 625+ assets. Next minute signal in <span className="font-mono font-bold text-gold-bright">{countdown}s</span>.
          </p>
        </div>

        {/* Channels List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
          {["ANNOUNCEMENTS", "TRADING FLOORS", "QUANT ALERTS"].map((cat) => (
            <div key={cat}>
              <p className="px-2 text-[10px] font-bold tracking-wider text-[#949ba4] uppercase">{cat}</p>
              <div className="mt-1 space-y-0.5">
                {CHANNELS.filter((c) => c.category === cat).map((channel) => {
                  const isActive = activeChannelId === channel.id;
                  return (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannelId(channel.id)}
                      className={`flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#35373c] text-white font-semibold"
                          : "text-[#949ba4] hover:bg-[#35373c]/50 hover:text-[#dbdee1]"
                      }`}
                    >
                      <Hash className={`h-4 w-4 shrink-0 ${isActive ? "text-gold" : "text-[#80848e]"}`} />
                      <span className="truncate">{channel.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User bar at bottom */}
        <div className="flex h-14 items-center justify-between border-t border-[#1f2023] bg-[#232428] px-3">
          <button
            onClick={() => {
              setProfileInputName(userName);
              setIsEditingProfile(true);
            }}
            className="flex items-center gap-2 text-left hover:opacity-80 transition"
            title="Click to change your nickname & avatar"
          >
            <div className="relative">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-gold to-amber-700 text-sm">
                {userAvatar}
              </span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#232428] bg-emerald-500" />
            </div>
            <div className="leading-tight">
              <p className="text-xs font-semibold text-white max-w-[90px] truncate">{userName}</p>
              <p className="text-[10px] text-gold">Edit Handle ✏️</p>
            </div>
          </button>
          <button
            onClick={() => setShowSignalModal(true)}
            className="flex items-center gap-1 rounded bg-gold/20 px-2 py-1 text-[10px] font-bold text-gold-bright hover:bg-gold/30"
            title="Share Your Trade Setup / Signal"
          >
            <PlusCircle className="h-3 w-3" />
            Post Setup
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
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm text-white truncate">{currentChannel.name}</h3>
                <span className="hidden sm:inline-flex rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.2 text-[10px] text-emerald-400 font-mono">
                  🟢 Live Active
                </span>
              </div>
              <p className="text-[11px] text-[#949ba4] truncate hidden sm:block">{currentChannel.topic}</p>
            </div>
          </div>

          {/* Real-time Multi-Timezone Digital Clocks (WIB, UTC, EST) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* WIB Clock */}
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
                        <span
                          className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                            msg.prediction.stance.includes("BUY")
                              ? "bg-emerald-500/20 text-emerald-300"
                              : msg.prediction.stance.includes("ACCUMULATE")
                              ? "bg-amber-500/20 text-amber-300"
                              : msg.prediction.stance.includes("TRIM")
                              ? "bg-orange-500/20 text-orange-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {msg.prediction.stance}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-[#949ba4]">
                        Tape: <span className="text-white font-bold">${msg.prediction.currentPrice}</span>
                      </span>
                    </div>

                    {/* Key Technical Targets Grid */}
                    <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-[#1e1f22] p-2.5 text-center font-mono">
                      <div className="border-r border-[#35373c]">
                        <p className="text-[10px] text-[#949ba4]">Target 1</p>
                        <p className="text-xs font-bold text-emerald-400">${msg.prediction.target1}</p>
                      </div>
                      <div className="border-r border-[#35373c]">
                        <p className="text-[10px] text-[#949ba4]">Target 2</p>
                        <p className="text-xs font-bold text-emerald-300">${msg.prediction.target2}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#949ba4]">Invalidation Stop</p>
                        <p className="text-xs font-bold text-rose-400">${msg.prediction.invalidationLevel}</p>
                      </div>
                    </div>

                    {/* Technical Rationale */}
                    <p className="mt-2.5 text-xs text-[#dbdee1] leading-relaxed">
                      💡 <span className="font-semibold text-bone">Mechanism:</span> {msg.prediction.technicalMechanism}
                    </p>

                    {/* Card Footer */}
                    <div className="mt-3 flex items-center justify-between border-t border-[#35373c] pt-2 text-[11px] text-[#949ba4]">
                      <span>Horizon: <strong className="text-bone">{msg.prediction.timeHorizon}</strong></span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(`Stop Loss: $${msg.prediction?.invalidationLevel}`, msg.id)}
                          className="flex items-center gap-1 rounded bg-[#1e1f22] px-2 py-1 text-[10px] hover:text-white"
                        >
                          {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                          <span>{copiedId === msg.id ? "Copied" : "Copy Stop"}</span>
                        </button>
                        <Link
                          href={`/ticker/${msg.prediction.symbol}`}
                          className="flex items-center gap-1 rounded bg-gold/15 px-2 py-1 text-[10px] font-semibold text-gold hover:bg-gold/25"
                        >
                          <span>View Chart</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive Reactions */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {Object.entries(msg.reactions).map(([emoji, count]) => {
                    if (count <= 0) return null;
                    const active = msg.userReactions[emoji];
                    return (
                      <button
                        key={emoji}
                        onClick={() => toggleReaction(msg.id, emoji)}
                        className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-all ${
                          active
                            ? "border border-gold/50 bg-gold/15 text-gold-bright"
                            : "border border-transparent bg-[#2b2d31] text-[#949ba4] hover:bg-[#35373c]"
                        }`}
                      >
                        <span>{emoji}</span>
                        <span className="font-mono text-[11px]">{count}</span>
                      </button>
                    );
                  })}
                  {/* Quick Add Emoji Reaction */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 ml-2">
                    {["🚀", "🔥", "💎", "👀"].map((e) => (
                      <button
                        key={e}
                        onClick={() => toggleReaction(msg.id, e)}
                        className="rounded hover:bg-[#35373c] p-0.5 text-xs"
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
              <span>Nexus Sentinel AI is scanning order book liquidity and computing targets...</span>
            </div>
          )}
        </div>

        {/* Input Bar with Instant Command Execution */}
        <div className="p-4 bg-[#313338] border-t border-[#1f2023]">
          {/* Quick interactive slash command pills: Clicking immediately executes and sends! */}
          <div className="mb-2 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] font-semibold text-[#949ba4] shrink-0">Click to Send:</span>
            {[
              { label: "/predict NVDA", query: "/predict NVDA" },
              { label: "/predict BTC", query: "/predict BTC" },
              { label: "/predict SOL", query: "/predict SOL" },
              { label: "/predict FARTCOIN", query: "/predict FARTCOIN" },
              { label: "/predict GOAT", query: "/predict GOAT" },
              { label: "🕒 Jam Market", query: "Jam pasar sekarang buka apa tutup?" },
            ].map((chip) => (
              <button
                key={chip.label}
                type="button"
                onClick={() => handleSendMessageWithText(chip.query)}
                className="shrink-0 rounded-full border border-[#3f4147] bg-[#2b2d31] px-2.5 py-1 text-[11px] text-bone transition hover:border-gold hover:bg-gold/15 hover:text-gold-bright"
                title={`Send "${chip.query}" directly to #${currentChannel.name}`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-xl bg-[#383a40] px-3.5 py-2.5 shadow-inner"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message #${currentChannel.name} (type /predict [symbol] or ask in Indonesian/English, press Enter to send)...`}
              className="flex-1 bg-transparent text-sm text-white placeholder-[#80848e] focus:outline-none"
            />
            <button
              type="button"
              onClick={() => triggerMinutePrediction()}
              className="hidden sm:inline-flex items-center gap-1 rounded-lg bg-[#2b2d31] px-2.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition"
              title="Request instant 1-minute prediction"
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Instant Signal</span>
            </button>
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-gold px-4 py-1.5 text-xs font-bold text-ink-950 transition-all hover:bg-gold-bright disabled:opacity-40"
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send</span>
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
              { name: userName, role: "You (Active)", avatar: userAvatar },
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

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-line bg-[#2b2d31] p-5 shadow-2xl text-bone">
            <div className="flex items-center justify-between border-b border-[#35373c] pb-3">
              <h4 className="font-semibold text-sm">Customise Your Trader Handle</h4>
              <button onClick={() => setIsEditingProfile(false)} className="text-muted hover:text-bone">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs text-[#949ba4] block mb-1">Pick Avatar Emoji</label>
                <div className="flex flex-wrap gap-2">
                  {["👤", "⚡", "🚀", "🐋", "🦁", "💎", "👑", "🎯", "🇮🇩", "🇺🇸"].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setUserAvatar(av)}
                      className={`h-9 w-9 rounded-lg border text-lg flex items-center justify-center ${
                        userAvatar === av ? "border-gold bg-gold/20" : "border-[#3f4147] bg-[#1e1f22]"
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#949ba4] block mb-1">Your Nickname / Handle</label>
                <input
                  type="text"
                  value={profileInputName}
                  onChange={(e) => setProfileInputName(e.target.value)}
                  placeholder="e.g. kakaahanif, SolWhale99..."
                  className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-2 text-sm text-bone focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-bone"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="rounded-lg bg-gold px-4 py-1.5 text-xs font-bold text-ink-950 hover:bg-gold-bright"
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Trade Setup / Signal Modal */}
      {showSignalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-line bg-[#2b2d31] p-5 shadow-2xl text-bone">
            <div className="flex items-center justify-between border-b border-[#35373c] pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-gold" />
                <h4 className="font-semibold text-sm">Broadcast Your Trade Setup</h4>
              </div>
              <button onClick={() => setShowSignalModal(false)} className="text-muted hover:text-bone">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handlePostSignal} className="mt-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-[#949ba4] block mb-1">Symbol Ticker</label>
                  <input
                    type="text"
                    required
                    value={sigSymbol}
                    onChange={(e) => setSigSymbol(e.target.value.toUpperCase())}
                    placeholder="e.g. NVDA, BTC, GOAT"
                    className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-1.5 font-mono text-xs text-bone focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-[#949ba4] block mb-1">Stance / Side</label>
                  <select
                    value={sigStance}
                    onChange={(e) => setSigStance(e.target.value as any)}
                    className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-1.5 text-xs text-bone focus:border-gold focus:outline-none"
                  >
                    <option value="STRONG BUY / LONG">STRONG BUY / LONG</option>
                    <option value="ACCUMULATE / DIP">ACCUMULATE / DIP</option>
                    <option value="TRIM / PROFIT">TRIM / PROFIT</option>
                    <option value="AVOID / SHORT">AVOID / SHORT</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 font-mono">
                <div>
                  <label className="text-[10px] text-[#949ba4] block mb-1">Entry ($)</label>
                  <input
                    type="text"
                    required
                    value={sigPrice}
                    onChange={(e) => setSigPrice(e.target.value)}
                    className="w-full rounded border border-[#3f4147] bg-[#1e1f22] px-2 py-1 text-xs text-bone"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#949ba4] block mb-1">Target ($)</label>
                  <input
                    type="text"
                    required
                    value={sigTarget}
                    onChange={(e) => setSigTarget(e.target.value)}
                    className="w-full rounded border border-[#3f4147] bg-[#1e1f22] px-2 py-1 text-xs text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#949ba4] block mb-1">Stop ($)</label>
                  <input
                    type="text"
                    required
                    value={sigStop}
                    onChange={(e) => setSigStop(e.target.value)}
                    className="w-full rounded border border-[#3f4147] bg-[#1e1f22] px-2 py-1 text-xs text-rose-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-[#949ba4] block mb-1">Setup Thesis / Mechanism</label>
                <textarea
                  rows={2}
                  value={sigNotes}
                  onChange={(e) => setSigNotes(e.target.value)}
                  placeholder="e.g. 20-EMA reclaim on 15m candle, RSI divergence..."
                  className="w-full rounded-lg border border-[#3f4147] bg-[#1e1f22] px-3 py-1.5 text-xs text-bone focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#35373c]">
                <button
                  type="button"
                  onClick={() => setShowSignalModal(false)}
                  className="rounded-lg border border-line px-3 py-1.5 text-xs text-muted hover:text-bone"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gold px-4 py-1.5 text-xs font-bold text-ink-950 hover:bg-gold-bright"
                >
                  Broadcast Signal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
