"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveClock from "@/components/live-clock";
import FeedBadge from "@/components/feed-badge";
import AuthButton from "@/components/auth-button";
import WhopBadge from "@/components/whop-badge";
import { useWhop } from "@/lib/whop-context";
import { TrendingUp, BarChart3, Coins, Flame, Bell, Cpu, Terminal, FileText, Zap, Database } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  live?: boolean;
  pro?: boolean;
}

const DESK_TABS = [
  { href: "/terminal", label: "Terminal", icon: Terminal, desc: "Professional Multi-Screen Financial Workstation", pro: true },
  { href: "/openbb", label: "OpenBB", icon: Database, desc: "OpenBB Quant Platform & CLI", pro: true },
  { href: "/gold-news", label: "News", icon: Zap, desc: "100 Live Breaking Action Catalysts", pro: true },
  { href: "/wsj", label: "Market Center", icon: FileText, desc: "Most Active, Form 4 Insiders & Deep Analysis", pro: true },
  { href: "/markets", label: "Wall Street Desk", icon: BarChart3, desc: "S&P 500, Nasdaq, Institutional Flow", pro: false },
  { href: "/calculator", label: "Day Trader Desk", icon: TrendingUp, desc: "Intraday Levels & Invalidation Sizing", pro: true },
  { href: "/crypto", label: "Crypto Desk", icon: Coins, desc: "Binance, Layer-1/2, Liquidity Float", pro: false },
  { href: "/meme-coins", label: "Meme Desk", icon: Flame, desc: "pump.fun, Bonding Curves, 2% Risk Cap", pro: false },
  { href: "/desks", label: "All 44 Desks", icon: Cpu, desc: "44 Quantitative Desks", pro: true },
];

const MAIN_LINKS: NavLink[] = [
  { href: "/terminal", label: "Terminal", pro: true },
  { href: "/openbb", label: "OpenBB", pro: true },
  { href: "/gold-news", label: "News", live: true, pro: true },
  { href: "/wsj", label: "Market Center", pro: true },
  { href: "/chat", label: "Trading Floor", live: true, pro: true },
  { href: "/desks", label: "44 Desks", pro: true },
  { href: "/markets", label: "Equities" },
  { href: "/crypto", label: "Crypto" },
  { href: "/meme-coins", label: "Memes" },
  { href: "/calculator", label: "Calculator", pro: true },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { openWhopModal } = useWhop();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink-950/90 backdrop-blur-md">
      {/* Top Analyst Desk Bar - Clear institutional separation of Wall Street, Day Trading, Crypto, and Meme Desks */}
      <div className="border-b border-line/50 bg-ink-900/60 px-4 py-1.5 text-xs hidden md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-gold mr-2 hidden lg:inline">
              Analyst Desks:
            </span>
            {DESK_TABS.map((desk) => {
              const Icon = desk.icon;
              const active = isActive(desk.href);
              return (
                <Link
                  key={desk.label}
                  href={desk.href}
                  className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                    active
                      ? "bg-gold/15 text-gold-bright border border-gold/30 shadow-sm"
                      : "text-muted hover:text-bone hover:bg-ink-800"
                  }`}
                >
                  <Icon className="h-3 w-3 text-gold" />
                  <span>{desk.label}</span>
                  {desk.pro && <WhopBadge size="xs" asSpan />}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            {/* VIP Fast Alerts Shortcut */}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition"
              title="Terminal Push Alerts · Telegram & Discord"
            >
              <Bell className="h-3 w-3 text-emerald-400 animate-pulse" />
              <span>VIP Alerts Terminal</span>
              <WhopBadge size="xs" asSpan />
            </Link>
            <span className="h-3 w-px bg-line" />
            <LiveClock compact />
            <FeedBadge className="text-[10px] uppercase tracking-wider text-muted" />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-[1.4rem] tracking-tight text-bone">
            Next<span className="text-gold-bright">Wall</span>Street
          </span>
          <span className="rounded bg-gold/10 border border-gold/30 px-1.5 py-0.2 text-[9px] font-mono font-bold text-gold-bright uppercase tracking-wider hidden sm:inline">
            PRO DESK
          </span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-1 xl:gap-1.5 lg:flex">
          {MAIN_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-1 rounded-full px-2.5 py-1 text-xs xl:text-[13px] font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-ink-800 text-bone"
                  : "text-muted hover:bg-ink-850 hover:text-bone"
              }`}
            >
              <span>{link.label}</span>
              {link.pro && <WhopBadge size="xs" asSpan />}
              {link.live && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right Action Cluster */}
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/watchlist"
            className="text-xs text-muted transition-colors hover:text-bone flex items-center gap-1"
          >
            <span>Watchlist</span>
          </Link>
          <WhopBadge size="sm" />
          <AuthButton />
          <Link
            href="/pricing"
            className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink-950 transition-all hover:bg-gold-bright shadow hover:scale-105"
          >
            Start PRO
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-bone lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-bone transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-bone transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-bone transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <nav className="border-t border-line/70 bg-ink-900 px-5 pb-5 pt-3 lg:hidden space-y-3">
          <div className="flex items-center justify-between border-b border-line/60 pb-3">
            <LiveClock />
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span>Terminal Feeds Active</span>
            </span>
          </div>

          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold px-2">
              Analyst Desks
            </p>
            {DESK_TABS.map((desk) => {
              const Icon = desk.icon;
              return (
                <Link
                  key={desk.href}
                  href={desk.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                    isActive(desk.href) ? "bg-ink-800 text-bone" : "text-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-3.5 w-3.5 text-gold" />
                    <span>{desk.label}</span>
                  </span>
                  {desk.pro && <WhopBadge size="xs" asSpan />}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-line/60 pt-2 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted px-2">
              Platforms &amp; Research
            </p>
            {[...MAIN_LINKS, { href: "/watchlist", label: "Watchlist", pro: true }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                  isActive(link.href) ? "bg-ink-800 text-bone" : "text-muted"
                }`}
              >
                <span>{link.label}</span>
                {link.pro && <WhopBadge size="xs" asSpan />}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-line/60 flex items-center justify-between">
            <AuthButton />
            <Link
              href="/pricing"
              onClick={() => setOpen(false)}
              className="rounded-full bg-gold px-4 py-2 text-xs font-bold text-ink-950"
            >
              Subscribe PRO ($29)
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
