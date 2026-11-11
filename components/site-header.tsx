"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveClock from "@/components/live-clock";
import FeedBadge from "@/components/feed-badge";
import AuthButton from "@/components/auth-button";
import WhopBadge from "@/components/whop-badge";
import { useWhop } from "@/lib/whop-context";

interface NavLink {
  href: string;
  label: string;
  live?: boolean;
  exclusive?: boolean;
  variant?: "wsj" | "member" | "pro" | "plus";
}

const LINKS: NavLink[] = [
  { href: "/markets", label: "Markets", exclusive: true, variant: "wsj" },
  { href: "/crypto", label: "Crypto", exclusive: true, variant: "wsj" },
  { href: "/meme-coins", label: "Meme coins", exclusive: true, variant: "member" },
  { href: "/pipeline", label: "Pipeline", exclusive: true, variant: "pro" },
  { href: "/chat", label: "Live Chat", live: true, exclusive: true, variant: "pro" },
  { href: "/calculator", label: "Calculator", exclusive: true, variant: "pro" },
  { href: "/academy", label: "Academy" },
  { href: "/academy/watch", label: "Watch Video", exclusive: true, variant: "pro" },
  { href: "/research", label: "Research" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { badge, isUnlocked, openWhopModal } = useWhop();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-[1.35rem] tracking-tight text-bone">
            Next<span className="text-gold-bright">Wall</span>Street
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
            Research
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs xl:text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-ink-800 text-bone"
                  : "text-muted hover:bg-ink-850 hover:text-bone"
              }`}
            >
              <span>{link.label}</span>
              {link.exclusive && (
                <WhopBadge variant={link.variant || "pro"} className="ml-0.5" />
              )}
              {link.live && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="h-4 w-px bg-line" />
          <LiveClock />
          <FeedBadge className="text-[10px] uppercase tracking-[0.14em] text-muted" />
          <span className="h-4 w-px bg-line" />
          <Link
            href="/watchlist"
            className="text-sm text-muted transition-colors hover:text-bone flex items-center gap-1.5"
          >
            <span>Watchlist</span>
            <WhopBadge variant="pro" className="ml-0" />
          </Link>
          <button
            type="button"
            onClick={() => openWhopModal()}
            className="flex items-center transition"
            title="NextWall Street Member Pass (Whop)"
          >
            <WhopBadge variant="plus" className="ml-0 text-[10px] px-2 py-1 shadow" />
          </button>
          <AuthButton />
          <Link
            href="/pricing"
            className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/20"
          >
            Subscribe
          </Link>
        </div>

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

      {open && (
        <nav className="border-t border-line/70 bg-ink-900 px-5 pb-5 pt-3 lg:hidden">
          <div className="mb-3 flex items-center justify-between border-b border-line/60 pb-3">
            <LiveClock />
            <FeedBadge className="text-[10px] uppercase tracking-[0.14em] text-muted" />
          </div>
          <div className="grid gap-1">
            {[...LINKS, { href: "/watchlist", label: "Watchlist", exclusive: true, variant: "pro" as const }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm ${
                  isActive(link.href) ? "bg-ink-800 text-bone" : "text-muted"
                }`}
              >
                <span>{link.label}</span>
                {link.exclusive && <WhopBadge variant={link.variant || "pro"} className="ml-0" />}
              </Link>
            ))}
            <div className="pt-2 border-t border-line/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openWhopModal();
                }}
                className="flex items-center gap-1.5 text-xs text-gold font-semibold"
              >
                <WhopBadge variant="plus" className="ml-0" />
                <span>{isUnlocked ? "Status: Member Pass Active 🔑" : "Buka Member Pass 🔒"}</span>
              </button>
              <AuthButton />
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
