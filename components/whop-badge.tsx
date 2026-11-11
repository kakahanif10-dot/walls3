"use client";

import { useWhop } from "@/lib/whop-context";

export type BadgeVariant = "wsj" | "pill" | "member" | "plus" | "pro";

export default function WhopBadge({
  exclusive = true,
  variant = "wsj",
  label,
  className = "ml-1.5",
}: {
  exclusive?: boolean;
  variant?: BadgeVariant;
  label?: string;
  className?: string;
}) {
  const { isUnlocked, openWhopModal } = useWhop();
  if (!exclusive) return null;

  const defaultLabel = isUnlocked
    ? variant === "plus"
      ? "WSJ+ 🔑"
      : "MEMBER 🔑"
    : variant === "plus"
    ? "WSJ+ 🔒"
    : variant === "pro"
    ? "PRO 🔒"
    : "MEMBER ONLY 🔒";

  const displayLabel = label || defaultLabel;

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openWhopModal();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          e.stopPropagation();
          openWhopModal();
        }
      }}
      title={
        isUnlocked
          ? "NextWall Street: Whop Member Access Unlocked 🔑 (Fitur Terbuka)"
          : "NextWall Street: Member Only 🔒 (Klik untuk Membuka Kunci via Whop)"
      }
      className={`inline-flex items-center gap-1 select-none cursor-pointer font-mono text-[9px] uppercase tracking-wider font-semibold transition-all hover:scale-105 active:scale-95 ${
        isUnlocked
          ? "rounded border border-emerald-500/50 bg-emerald-500/10 px-1.5 py-0.5 text-emerald-400 hover:bg-emerald-500/20 shadow-sm"
          : "rounded border border-gold/45 bg-gold/[0.12] px-1.5 py-0.5 text-gold-bright hover:bg-gold/25 hover:border-gold shadow-sm"
      } ${className}`}
    >
      <span className="text-[8px] opacity-80">{isUnlocked ? "✦" : "✦"}</span>
      <span>{displayLabel}</span>
    </span>
  );
}
