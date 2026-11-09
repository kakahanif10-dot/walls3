"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Sparkline from "@/components/sparkline";
import WatchlistButton from "@/components/watchlist-button";
import { LivePrice, LiveChange } from "@/components/live-price";
import { fmtPct, stanceColor, type Row } from "@/lib/market";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type SortKey = "score" | "change24h" | "change30d" | "name";

const STANCES = ["All", "Buy", "Accumulate", "Hold", "Trim", "Avoid"] as const;

export default function MarketExplorer({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [stance, setStance] = useState<(typeof STANCES)[number]>("All");
  const [sector, setSector] = useState<string>("All Sectors");
  const [sort, setSort] = useState<SortKey>("score");
  const [page, setPage] = useState(1);
  // Default to 0 = Show All assets (no 30-item cut-off)
  const [pageSize, setPageSize] = useState<number>(0);

  // Extract unique sectors/groups from rows
  const availableSectors = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.group) {
        // e.g. "Semiconductors / AI" -> "Semiconductors"
        const main = r.group.split("/")[0].trim();
        set.add(main);
      }
    });
    return ["All Sectors", ...Array.from(set).slice(0, 8)];
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.symbol.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.group.toLowerCase().includes(q);
      const matchesStance = stance === "All" || row.stance === stance;
      const matchesSector =
        sector === "All Sectors" ||
        row.group.toLowerCase().includes(sector.toLowerCase());
      return matchesQuery && matchesStance && matchesSector;
    });

    return [...list].sort((a, b) => {
      if (sort === "name") return a.symbol.localeCompare(b.symbol);
      return (b[sort] as number) - (a[sort] as number);
    });
  }, [rows, query, stance, sector, sort]);

  // Reset to page 1 when filters change
  const handleQueryChange = (val: string) => {
    setQuery(val);
    setPage(1);
  };

  const handleStanceChange = (s: (typeof STANCES)[number]) => {
    setStance(s);
    setPage(1);
  };

  const handleSectorChange = (sec: string) => {
    setSector(sec);
    setPage(1);
  };

  const isShowAll = pageSize === 0;
  const effectivePageSize = isShowAll ? filtered.length || 1 : pageSize;
  const totalPages = isShowAll ? 1 : Math.max(1, Math.ceil(filtered.length / effectivePageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRows = useMemo(() => {
    if (isShowAll) return filtered;
    const start = (currentPage - 1) * effectivePageSize;
    return filtered.slice(start, start + effectivePageSize);
  }, [filtered, currentPage, effectivePageSize, isShowAll]);

  return (
    <div>
      {/* View Mode & Live Asset Counter Banner */}
      <div className="mb-4 rounded-xl border border-gold/30 bg-gold/[0.04] p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="live-dot h-2 w-2 rounded-full bg-up shrink-0" aria-hidden="true" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-semibold text-bone">
                Complete Coverage: {filtered.length} of {rows.length} Assets Loaded
              </span>
              <span className="rounded bg-gold/15 border border-gold/40 px-2 py-0.5 text-[10px] font-mono font-bold text-gold-bright">
                {isShowAll ? "ALL ASSETS SHOWN" : `Page ${currentPage}/${totalPages}`}
              </span>
            </div>
            <p className="text-[11px] text-muted leading-tight mt-0.5">
              Full S&P 500, Nasdaq, and growth universe. Displaying all {filtered.length} names in a single unified view.
            </p>
          </div>
        </div>

        {/* View Mode Switcher: Show All vs Paged */}
        <div className="flex items-center gap-1.5 self-stretch sm:self-auto justify-end">
          <button
            type="button"
            onClick={() => {
              setPageSize(0);
              setPage(1);
            }}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              isShowAll
                ? "bg-gold text-ink-950 shadow-md ring-1 ring-gold"
                : "border border-line bg-ink-900 text-muted hover:text-bone hover:border-gold/40"
            }`}
          >
            ⚡ Show All ({rows.length})
          </button>
          <button
            type="button"
            onClick={() => {
              setPageSize(100);
              setPage(1);
            }}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              pageSize === 100
                ? "bg-gold text-ink-950 font-semibold"
                : "border border-line bg-ink-900 text-muted hover:text-bone"
            }`}
          >
            100 / page
          </button>
          <button
            type="button"
            onClick={() => {
              setPageSize(50);
              setPage(1);
            }}
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              pageSize === 50
                ? "bg-gold text-ink-950 font-semibold"
                : "border border-line bg-ink-900 text-muted hover:text-bone"
            }`}
          >
            50 / page
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Stance Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted mr-1">Stance:</span>
          {STANCES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleStanceChange(s)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                stance === s
                  ? "border-gold/60 bg-gold/15 text-gold-bright font-semibold"
                  : "border-line text-muted hover:border-line hover:text-bone bg-ink-900/60"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <input
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={`Search ${rows.length}+ symbols, companies or themes...`}
              className="w-full rounded-full border border-line bg-ink-900 px-4 py-1.5 text-xs sm:text-sm text-bone placeholder:text-muted/70 focus:border-gold/50 focus:outline-none lg:w-72"
            />
            {query && (
              <button
                type="button"
                onClick={() => handleQueryChange("")}
                className="absolute right-3 top-2 text-xs text-muted hover:text-bone"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line bg-ink-900 px-3 py-1.5 text-xs text-bone focus:border-gold/50 focus:outline-none"
            aria-label="Sort assets"
          >
            <option value="score">Sort: Highest Score</option>
            <option value="change24h">Sort: 24h Change</option>
            <option value="change30d">Sort: 30d Momentum</option>
            <option value="name">Sort: Ticker A-Z</option>
          </select>
        </div>
      </div>

      {/* Sector Quick Filter Pills */}
      {availableSectors.length > 2 && (
        <div className="mb-4 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted shrink-0 mr-1">Sector:</span>
          {availableSectors.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => handleSectorChange(sec)}
              className={`shrink-0 rounded-md px-2.5 py-1 text-[11px] transition-all ${
                sector === sec
                  ? "border border-gold/60 bg-gold/20 text-gold-bright font-semibold"
                  : "border border-line/70 bg-ink-900/80 text-muted hover:text-bone"
              }`}
            >
              {sec}
            </button>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left">
          <thead className="bg-ink-900 text-[10px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Asset</th>
              <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Theme</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">24h</th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">30d</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Trend</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
              <th className="px-4 py-3 text-right font-medium">Stance</th>
              <th className="hidden px-4 py-3 md:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {paginatedRows.map((row) => (
              <tr key={row.symbol} className="group transition-colors hover:bg-ink-850/60">
                <td className="px-4 py-3.5">
                  <Link href={`/ticker/${row.symbol}`} className="flex items-center gap-3">
                    <span className="flex flex-col">
                      <span className="font-mono text-sm font-semibold text-bone group-hover:text-gold-bright">
                        {row.symbol}
                      </span>
                      <span className="text-xs text-muted max-w-[180px] sm:max-w-none truncate">{row.name}</span>
                    </span>
                  </Link>
                </td>
                <td className="hidden px-4 py-3.5 text-xs text-muted sm:table-cell max-w-[220px] truncate">{row.group}</td>
                <td className="px-4 py-3.5 text-right font-mono text-sm text-bone">
                  <LivePrice symbol={row.symbol} base={row.price} />
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm">
                  <LiveChange symbol={row.symbol} change={row.change24h} />
                </td>
                <td className={`hidden px-4 py-3.5 text-right font-mono text-sm md:table-cell ${row.change30d >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(row.change30d)}
                </td>
                <td className="hidden px-4 py-3.5 lg:table-cell">
                  <Sparkline values={row.spark} width={90} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-line sm:block">
                      <div
                        className={`h-full rounded-full ${row.score >= 66 ? "bg-up" : row.score >= 47 ? "bg-gold" : "bg-down"}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-bone">{row.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] ${stanceColor(row.stance)}`}>
                    {row.stance}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 text-right md:table-cell">
                  <WatchlistButton symbol={row.symbol} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No assets match that filter. Try a different stance or clear the search.
          </p>
        )}
      </div>

      {/* Pagination Bar (Only when paged) */}
      {!isShowAll && filtered.length > pageSize ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 py-2 text-xs text-muted">
          <div>
            Showing{" "}
            <span className="font-mono font-medium text-bone">
              {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}
            </span>{" "}
            of <span className="font-mono font-medium text-bone">{filtered.length}</span> assets
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage(1)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-ink-900 transition hover:border-gold/40 hover:text-bone disabled:opacity-30"
              title="First Page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-ink-900 transition hover:border-gold/40 hover:text-bone disabled:opacity-30"
              title="Previous Page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="px-3 font-mono text-bone">
              Page <span className="text-gold-bright font-bold">{currentPage}</span> of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-ink-900 transition hover:border-gold/40 hover:text-bone disabled:opacity-30"
              title="Next Page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(totalPages)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-ink-900 transition hover:border-gold/40 hover:text-bone disabled:opacity-30"
              title="Last Page"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 px-2 py-3 text-xs text-muted border-t border-line/60">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-up" />
            <span>
              Displaying <strong className="font-mono text-bone">all {filtered.length}</strong> of{" "}
              <strong className="font-mono text-bone">{rows.length}</strong> assets without limits.
            </span>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-xs text-gold hover:text-gold-bright transition underline underline-offset-2"
          >
            ↑ Back to top
          </button>
        </div>
      )}

      <p className="mt-4 text-xs leading-relaxed text-muted/70">
        Quotes come from public market endpoints and refresh about once a minute; equity prices are
        delayed. Scores are outputs of the fixed, published methodology (see{" "}
        <Link href="/disclaimer" className="text-bone/80 underline decoration-line underline-offset-2 hover:text-gold-bright">
          methodology
        </Link>
        ), not predictions.
      </p>
    </div>
  );
}
