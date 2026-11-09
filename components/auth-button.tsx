"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, LogOut, User as UserIcon, Shield, Bookmark, Award, Calculator } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function AuthButton() {
  const { user, profile, loading, signInWithGoogle, signOutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error("Sign-in failed:", err);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="h-8 w-20 animate-pulse rounded-full bg-ink-800" />
    );
  }

  if (!user) {
    return (
      <button
        type="button"
        onClick={handleSignIn}
        disabled={signingIn}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-3.5 py-1.5 text-xs font-medium text-bone transition hover:border-gold/50 hover:bg-ink-850 hover:text-gold-bright disabled:opacity-50"
      >
        <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.66-5.17 3.66-9.12z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.44 7.33 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.15 0 9.97 0 12s.45 3.85 1.24 5.43l4.04-3.14z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.56 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z"
          />
        </svg>
        <span>{signingIn ? "Connecting..." : "Sign in"}</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-line bg-ink-900 p-1 pr-3 text-xs text-bone transition hover:border-gold/50"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={user.displayName || "User avatar"}
            width={24}
            height={24}
            className="rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 text-gold-bright">
            <UserIcon className="h-3.5 w-3.5" />
          </div>
        )}
        <span className="max-w-[100px] truncate text-xs font-medium text-bone">
          {user.displayName || user.email?.split("@")[0] || "Trader"}
        </span>
        <span className="rounded bg-gold/15 px-1.5 py-0.2 font-mono text-[9px] uppercase tracking-wider text-gold">
          {profile?.plan || "Reader"}
        </span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-line bg-ink-900/95 p-3 shadow-2xl backdrop-blur-md z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center gap-3 border-b border-line/60 pb-3">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt={user.displayName || "User"}
                width={36}
                height={36}
                className="rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/20 text-gold-bright font-mono font-bold">
                {user.email?.[0].toUpperCase() || "T"}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-bone">
                {user.displayName || "Trader"}
              </p>
              <p className="truncate text-[10px] text-muted">{user.email}</p>
            </div>
          </div>

          <div className="my-2 space-y-1">
            <Link
              href="/watchlist"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-bone hover:bg-ink-800 transition-colors"
            >
              <Bookmark className="h-3.5 w-3.5 text-gold" />
              <span>Synced Watchlist (Firestore)</span>
            </Link>
            <Link
              href="/chat"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-bone hover:bg-ink-800 transition-colors"
            >
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span>Live Trading Floor & Setups</span>
            </Link>
            <Link
              href="/calculator"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-bone hover:bg-ink-800 transition-colors"
            >
              <Calculator className="h-3.5 w-3.5 text-gold-bright" />
              <span>Position Sizing Calculator</span>
            </Link>
            <Link
              href="/pricing"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-bone hover:bg-ink-800 transition-colors"
            >
              <Award className="h-3.5 w-3.5 text-gold-bright" />
              <span>Plan: {profile?.plan ? profile.plan.toUpperCase() : "FREE READER"}</span>
            </Link>
          </div>

          <div className="border-t border-line/60 pt-2">
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                signOutUser();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-down hover:bg-down/10 transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
