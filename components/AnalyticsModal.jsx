"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";
import { spendByCategory } from "@/lib/analytics";

const RANGES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

/** "Spend insights" modal — the logged-in user's personal spending broken down
 *  by category for a chosen timeframe (today / this week / this month). Every
 *  amount is the user's own share of each expense (see personalAmount), shown
 *  as a donut chart plus progress bars and a total. */
export function AnalyticsModal({ expenses, currentUserId, onClose }) {
  const [range, setRange] = useState("weekly");

  const stats = useMemo(
    () => spendByCategory(expenses, currentUserId, range),
    [expenses, currentUserId, range]
  );

  // CSS conic-gradient built from cumulative percentages → the donut chart.
  const donut = useMemo(() => {
    let acc = 0;
    const stops = stats.categories.map((c) => {
      const from = acc;
      acc += c.pct;
      return `${c.color} ${from}% ${acc}%`;
    });
    return stops.length ? `conic-gradient(${stops.join(", ")})` : null;
  }, [stats.categories]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-900">Spend insights</h2>
            <p className="mt-0.5 break-words text-xs text-slate-400">
              Your personal share of every expense, by category.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-3">
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                  range === r.value
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <span className="text-sm font-semibold text-acorn-700">
            {formatMoney(stats.total)}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {stats.count === 0 ? (
            <div className="py-12 text-center">
              <p className="text-3xl">📊</p>
              <p className="mt-2 text-sm font-medium text-slate-700">
                No spending {range === "daily" ? "today" : range === "weekly" ? "this week" : "this month"}.
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Add an expense and it will show up here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <div
                  className="relative h-40 w-40 rounded-full"
                  style={{ background: donut }}
                  aria-hidden="true"
                >
                  <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-2xl font-extrabold text-slate-900">
                      {formatMoney(stats.total)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {stats.count} {stats.count === 1 ? "expense" : "expenses"}
                    </span>
                  </div>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {stats.categories.map((c) => (
                  <li key={c.value}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                        <span aria-hidden="true">{c.emoji}</span> {c.label}
                      </span>
                      <span className="flex-none text-sm font-semibold text-slate-800">
                        {formatMoney(c.amount)}
                        <span className="ml-1.5 text-xs font-normal text-slate-400">
                          {c.pct}%
                        </span>
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
