"use client";

import { useMemo, useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { DailyTrendChart } from "@/components/DailyTrendChart";
import { SpendingVsLimitChart } from "@/components/SpendingVsLimitChart";
import { AnimateIn } from "@/components/AnimateIn";
import { formatMoney } from "@/lib/money";
import { spendByCategory, monthStats, peakDays } from "@/lib/analytics";
import { computeSummary } from "@/lib/summary";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

const RANGES = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const RANGE_NOUN = { daily: "today", weekly: "this week", monthly: "this month" };

export function InsightsPage({ user, room, members, expenses }) {
  const [range, setRange] = useState("monthly");
  const [catFilter, setCatFilter] = useState("ALL");

  const stats = useMemo(
    () => spendByCategory(expenses, user.id, range),
    [expenses, user.id, range]
  );

  const month = useMemo(() => monthStats(expenses, user.id), [expenses, user.id]);
  const peaks = useMemo(() => peakDays(expenses, user.id), [expenses, user.id]);
  const summary = useMemo(
    () => computeSummary(expenses, user.id),
    [expenses, user.id]
  );

  const donut = useMemo(() => {
    let acc = 0;
    const stops = stats.categories.map((c) => {
      const from = acc;
      acc += c.pct;
      return `${c.color} ${from}% ${acc}%`;
    });
    return stops.length ? `conic-gradient(${stops.join(", ")})` : null;
  }, [stats.categories]);

  const topCategory = stats.categories[0] || null;
  const rangeNoun = RANGE_NOUN[range];

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} room={room} active="insights" onToast={() => {}} />

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Insights &amp; analytics</h1>
          <p className="mt-1 text-sm text-slate-500">
            Your personal share of every expense: how it breaks down, and how
            your spending compares with what you owe and are owed.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
          <StatCard label="Spent this month" value={formatMoney(month.total)} hint={`${month.count} ${month.count === 1 ? "expense" : "expenses"} \u00b7 over ${month.daysElapsed} day${month.daysElapsed === 1 ? "" : "s"}`} />
          <StatCard label="Daily average" value={formatMoney(month.dailyAverage)} hint="month-to-date \u00f7 days elapsed" />
          <StatCard label="You owe" value={formatMoney(summary.iOwe)} hint="unpaid shares in the room" tone={summary.iOwe > 0 ? "danger" : "ok"} />
          <StatCard label="You're owed" value={formatMoney(summary.owedToMe)} hint="awaiting settlement from others" tone={summary.owedToMe > 0 ? "ok" : "neutral"} />
        </div>

        {/* Daily Trend Chart */}
        <AnimateIn index={1}>
          <section className="card card-hover mt-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Daily spending trend</h2>
              <p className="mt-0.5 text-xs text-slate-400">Your personal share, day by day for the last 14 days.</p>
            </div>
            <DailyTrendChart expenses={expenses} userId={user.id} days={14} />
          </section>
        </AnimateIn>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <AnimateIn index={2} className="lg:col-span-2">
            <section className="card card-hover">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Category distribution</h2>
                <p className="mt-0.5 text-xs text-slate-400">Your personal share by category {rangeNoun}.</p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                {RANGES.map((r) => (
                  <button key={r.value} onClick={() => setRange(r.value)} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${range === r.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {stats.count === 0 ? (
              <div className="py-12 text-center">
                <p className="text-3xl">\ud83d\udcca</p>
                <p className="mt-2 text-sm font-medium text-slate-700">No spending {rangeNoun}.</p>
                <p className="mt-1 text-sm text-slate-500">Add an expense and it will show up here.</p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-center justify-center">
                  <div className="relative h-44 w-44 rounded-full" style={{ background: donut }} aria-hidden="true">
                    <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-white">
                      <span className="text-xl font-extrabold text-slate-900">{formatMoney(stats.total)}</span>
                      <span className="text-xs text-slate-400">{stats.count} {stats.count === 1 ? "expense" : "expenses"}</span>
                    </div>
                  </div>
                </div>

                <ul className="space-y-3">
                  {stats.categories.map((c) => (
                    <li key={c.value}>
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="min-w-0 truncate text-sm font-medium text-slate-700"><span aria-hidden="true">{c.emoji}</span> {c.label}</span>
                        <span className="flex-none text-sm font-semibold text-slate-800">{formatMoney(c.amount)}<span className="ml-1.5 text-xs font-normal text-slate-400">{c.pct}%</span></span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full transition-all" style={{ width: `${c.pct}%`, backgroundColor: c.color }} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          </AnimateIn>

          <AnimateIn index={3} className="space-y-6">
            <section className="card">
              <h2 className="text-lg font-semibold text-slate-900">Peak spending</h2>
              <p className="mt-0.5 text-xs text-slate-400">Your biggest days in the last 30 days.</p>
              {topCategory && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-lg" style={{ backgroundColor: `${topCategory.color}1a` }} aria-hidden="true">
                    {topCategory.emoji}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-slate-400">Top category {rangeNoun}</p>
                    <p className="truncate text-sm font-semibold text-slate-800">{topCategory.label} \u00b7 {formatMoney(topCategory.amount)}</p>
                  </div>
                </div>
              )}
              {peaks.length === 0 ? (
                <p className="mt-4 text-sm text-slate-500">No spending to report.</p>
              ) : (
                <ul className="mt-3 divide-y divide-slate-100">
                  {peaks.map((day, i) => (
                    <li key={day.dateKey} className="flex items-center gap-3 py-2.5">
                      <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-acorn-100 text-xs font-bold text-acorn-700">{i + 1}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">{day.label}</span>
                      <span className="flex-none text-sm font-semibold text-slate-800">{formatMoney(day.total)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card">
              <h2 className="text-lg font-semibold text-slate-900">Spent vs. balances</h2>
              <p className="mt-0.5 text-xs text-slate-400">Out of pocket this month, against the room ledger.</p>
              <dl className="mt-4 space-y-3">
                <BalanceRow label="Spent this month" value={formatMoney(month.total)} hint="your personal share" />
                <BalanceRow label="You owe the room" value={formatMoney(summary.iOwe)} tone="danger" />
                <BalanceRow label="The room owes you" value={formatMoney(summary.owedToMe)} tone="ok" />
                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                  <span className="text-sm font-medium text-slate-500">Net position</span>
                  <span className={`text-sm font-bold ${summary.net > 0 ? "text-emerald-600" : summary.net < 0 ? "text-red-600" : "text-slate-700"}`}>
                    {summary.net > 0 ? "+" : ""}{formatMoney(summary.net)}
                  </span>
                </div>
              </dl>
            </section>
          </AnimateIn>
        </div>

        {/* Spending vs. Limit Chart */}
        {user.categoryLimits && Object.keys(user.categoryLimits).length > 0 && (
          <AnimateIn index={4}>
            <section className="card card-hover mt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Spending vs. limit</h2>
                <p className="mt-0.5 text-xs text-slate-400">Your monthly spend against the limits you&apos;ve set.</p>
              </div>
              <div className="flex rounded-lg bg-slate-100 p-0.5">
                <button onClick={() => setCatFilter("ALL")} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${catFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                  All
                </button>
                {EXPENSE_CATEGORIES.filter((c) => user.categoryLimits?.[c.value] != null).map((c) => (
                  <button key={c.value} onClick={() => setCatFilter(c.value)} className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${catFilter === c.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
                    {c.emoji}
                  </button>
                ))}
              </div>
            </div>
            <SpendingVsLimitChart expenses={expenses} userId={user.id} categoryLimits={user.categoryLimits} filterCategory={catFilter === "ALL" ? null : catFilter} />
          </section>
          </AnimateIn>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, hint, tone = "neutral" }) {
  const toneClass = tone === "danger" ? "text-red-600" : tone === "ok" ? "text-emerald-600" : "text-slate-900";
  return (
    <section className="card card-hover">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
      <p className="mt-1 text-xs text-slate-400">{hint}</p>
    </section>
  );
}

function BalanceRow({ label, value, hint, tone }) {
  const toneClass = tone === "danger" ? "text-red-600" : tone === "ok" ? "text-emerald-600" : "text-slate-800";
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-700">{label}</p>
        {hint && <p className="text-xs text-slate-400">{hint}</p>}
      </div>
      <span className={`flex-none text-sm font-bold ${toneClass}`}>{value}</span>
    </div>
  );
}
