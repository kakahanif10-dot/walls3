"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle, Shield, Key, Lock, Sparkles, ExternalLink, ArrowRight, Zap } from "lucide-react";

interface WhopContextValue {
  isUnlocked: boolean;
  badge: "🔒" | "🔑";
  deskBadge: (isExclusive?: boolean) => "🔒" | "🔑" | "";
  unlockWithWhop: (options?: { licenseKey?: string; email?: string }) => Promise<boolean>;
  lockWhop: () => void;
  openWhopModal: (deskName?: string) => void;
  closeWhopModal: () => void;
  isModalOpen: boolean;
}

const WhopContext = createContext<WhopContextValue>({
  isUnlocked: false,
  badge: "🔒",
  deskBadge: () => "🔒",
  unlockWithWhop: async () => false,
  lockWhop: () => {},
  openWhopModal: () => {},
  closeWhopModal: () => {},
  isModalOpen: false,
});

export function WhopProvider({ children }: { children: ReactNode }) {
  const { user, profile, updateUserPlan } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deskName, setDeskName] = useState<string>("Exclusive Institutional Desk");
  const [licenseInput, setLicenseInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Synchronize state from user profile or localStorage on mount
  useEffect(() => {
    try {
      const localStatus = localStorage.getItem("nws_whop_unlocked");
      if (localStatus === "true") {
        setIsUnlocked(true);
        return;
      }
      if (profile?.plan === "premium" || profile?.plan === "institutional") {
        setIsUnlocked(true);
        localStorage.setItem("nws_whop_unlocked", "true");
        return;
      }
    } catch {
      // ignore
    }
  }, [profile]);

  const unlockWithWhop = useCallback(
    async (options?: { licenseKey?: string; email?: string }) => {
      setLoading(true);
      setFeedback(null);
      try {
        const res = await fetch("/api/whop/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            licenseKey: options?.licenseKey || licenseInput.trim(),
            email: options?.email || emailInput.trim(),
            action: "activate",
          }),
        });

        const data = await res.json();
        if (data.success && data.unlocked) {
          setIsUnlocked(true);
          try {
            localStorage.setItem("nws_whop_unlocked", "true");
            if (options?.licenseKey || licenseInput) {
              localStorage.setItem("nws_whop_license", options?.licenseKey || licenseInput);
            }
          } catch {}

          // Update user profile in Firestore if logged in
          if (user) {
            try {
              const userRef = doc(db, "users", user.uid);
              await setDoc(userRef, { whopUnlocked: true, plan: "premium" }, { merge: true });
            } catch (err) {
              console.warn("Firestore whop sync:", err);
            }
          }
          await updateUserPlan("premium");

          setFeedback({
            type: "success",
            message: "🎉 Pembayaran / Lisensi Whop berhasil divalidasi! Semua fitur eksklusif kini terbuka dengan kunci 🔑.",
          });
          setTimeout(() => {
            setIsModalOpen(false);
            setFeedback(null);
          }, 2500);
          return true;
        } else {
          setFeedback({
            type: "error",
            message: data.error || "Gagal memvalidasi lisensi Whop. Silakan coba lagi.",
          });
          return false;
        }
      } catch (err: any) {
        setFeedback({
          type: "error",
          message: err.message || "Koneksi ke server Whop bermasalah.",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [licenseInput, emailInput, user, updateUserPlan]
  );

  const lockWhop = useCallback(() => {
    setIsUnlocked(false);
    try {
      localStorage.removeItem("nws_whop_unlocked");
      localStorage.removeItem("nws_whop_license");
    } catch {}
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        setDoc(userRef, { whopUnlocked: false, plan: "reader" }, { merge: true });
      } catch {}
    }
    updateUserPlan("reader");
    setFeedback({
      type: "success",
      message: "Fitur berhasil dikunci kembali 🔒 (Mode Demo/Testing).",
    });
    setTimeout(() => setFeedback(null), 3000);
  }, [user, updateUserPlan]);

  const openWhopModal = useCallback((desk?: string) => {
    if (desk) setDeskName(desk);
    setIsModalOpen(true);
  }, []);

  const closeWhopModal = useCallback(() => {
    setIsModalOpen(false);
    setFeedback(null);
  }, []);

  const badge: "🔒" | "🔑" = isUnlocked ? "🔑" : "🔒";

  const deskBadge = useCallback(
    (isExclusive = true) => {
      if (!isExclusive) return "";
      return isUnlocked ? "🔑" : "🔒";
    },
    [isUnlocked]
  );

  return (
    <WhopContext.Provider
      value={{
        isUnlocked,
        badge,
        deskBadge,
        unlockWithWhop,
        lockWhop,
        openWhopModal,
        closeWhopModal,
        isModalOpen,
      }}
    >
      {children}

      {/* WHOP ACCESS & PAYMENT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-2xl border border-line bg-ink-900 p-6 shadow-2xl space-y-5">
            <button
              type="button"
              onClick={closeWhopModal}
              className="absolute right-4 top-4 text-muted hover:text-bone text-lg"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-gold/30 via-gold to-bone p-[1.5px] shadow">
                <div className="flex h-full w-full items-center justify-center rounded-2xl bg-ink-950 font-display text-base font-bold text-gold-bright">
                  {isUnlocked ? "🔑" : "🔒"}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Whop Exclusive Verification
                </span>
                <h3 className="font-display text-xl text-bone">
                  {isUnlocked ? "Fitur Telah Terbuka 🔑" : `Buka Akses ${deskName} 🔒`}
                </h3>
              </div>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              {isUnlocked
                ? "Akun Anda saat ini memiliki akses penuh ke seluruh analitik eksklusif, sinyal live chat realtime, video masterclass, dan formula kalkulator kuantitatif."
                : `Fitur ${deskName} dilindungi oleh paywall Whop. Lakukan pembayaran atau masukkan lisensi membership Whop untuk membuka simbol gembok 🔒 menjadi kunci 🔑.`}
            </p>

            {/* Feedback alert */}
            {feedback && (
              <div
                className={`rounded-xl border p-3 text-xs leading-relaxed ${
                  feedback.type === "success"
                    ? "border-emerald-500/50 bg-emerald-950/60 text-emerald-300"
                    : "border-rose-500/50 bg-rose-950/60 text-rose-300"
                }`}
              >
                {feedback.message}
              </div>
            )}

            {/* Status Card */}
            <div className="rounded-xl border border-line bg-ink-950 p-4 space-y-2 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-muted">Status Akses:</span>
                <span
                  className={`font-bold px-2 py-0.5 rounded-full ${
                    isUnlocked
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {isUnlocked ? "🔑 UNLOCKED (Whop Active)" : "🔒 LOCKED (Perlu Bayar Whop)"}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted">
                <span>Whop Experience ID:</span>
                <span className="text-bone">exp_hP5JV9s0L8iMXA</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-muted">
                <span>API Integration:</span>
                <span className="text-emerald-400">Connected ✓</span>
              </div>
            </div>

            {!isUnlocked ? (
              <div className="space-y-4 pt-1">
                {/* Method 1: Instant Whop Pay & Unlock */}
                <button
                  type="button"
                  onClick={() => unlockWithWhop()}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 text-xs font-bold text-ink-950 hover:bg-gold-bright transition shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <span>Memproses Verifikasi Whop...</span>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      <span>Bayar &amp; Buka Kunci dengan Whop (Instant 🔑)</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-line/60" />
                  </div>
                  <span className="relative bg-ink-900 px-3 text-[10px] uppercase font-bold text-muted">
                    Atau Masukkan Lisensi Whop
                  </span>
                </div>

                {/* Method 2: Enter Whop Key / Email */}
                <div className="space-y-2">
                  <input
                    type="text"
                    value={licenseInput}
                    onChange={(e) => setLicenseInput(e.target.value)}
                    placeholder="Masukkan Whop License Key (misal: WHOP-XXXX-YYYY)..."
                    className="w-full rounded-xl border border-line bg-ink-950 px-3.5 py-2 text-xs text-bone placeholder:text-muted/60 focus:border-gold focus:outline-none font-mono"
                  />
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Email Akun Whop (opsional)..."
                      className="flex-1 rounded-xl border border-line bg-ink-950 px-3.5 py-2 text-xs text-bone placeholder:text-muted/60 focus:border-gold focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => unlockWithWhop()}
                      disabled={loading || (!licenseInput.trim() && !emailInput.trim())}
                      className="rounded-xl border border-gold/50 bg-gold/15 px-4 py-2 text-xs font-semibold text-gold-bright hover:bg-gold/25 transition disabled:opacity-40"
                    >
                      Validasi
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center gap-2.5">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>
                    Semua logo gembok telah berubah menjadi kunci 🔑. Anda bebas mengakses Meme Coins, Crypto, Live Chat, Video Masterclass, dan Calculator.
                  </span>
                </div>

                <div className="flex justify-between items-center gap-2 pt-2 border-t border-line/60">
                  <button
                    type="button"
                    onClick={lockWhop}
                    className="text-xs text-muted hover:text-rose-400 transition underline underline-offset-2"
                  >
                    Kunci Kembali (Test Mode 🔒)
                  </button>
                  <button
                    type="button"
                    onClick={closeWhopModal}
                    className="rounded-full bg-gold px-5 py-2 text-xs font-bold text-ink-950 hover:bg-gold-bright transition shadow"
                  >
                    Tutup &amp; Mulai Analisis 🔑
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </WhopContext.Provider>
  );
}

export function useWhop() {
  return useContext(WhopContext);
}
