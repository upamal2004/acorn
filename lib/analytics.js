// ---------------------------------------------------------------------------
// lib/analytics.js -- pure functions that power the "Spend insights" modal:
// the logged-in user's personal spend broken down by category over a chosen
// timeframe (daily / weekly / monthly). Reuses `personalAmount` from
// history.js so every figure is the user's own money, never the room total.
// ---------------------------------------------------------------------------
import { roundMoney } from "./money.js";
import { startOfWeek, endOfWeek, personalAmount } from "./history.js";
import { categoryMeta } from "./categories.js";

/** "daily" | "weekly" | "monthly" -- which window an expense falls in. */
export function inRange(exp, range) {
  const d = new Date(exp.createdAt);
  if (Number.isNaN(d.getTime())) return false;
  const now = new Date();

  if (range === "daily") {
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    );
  }
  if (range === "weekly") {
    const start = startOfWeek(now);
    const end = endOfWeek(now);
    return d >= start && d <= end;
  }
  if (range === "monthly") {
    return (
      d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    );
  }
  return false;
}

/**
 * Personal spend by category for `uid` inside `range`. Returns
 *   { total, count, categories: [{ value, label, emoji, color, amount, pct }] }
 * sorted by amount, biggest first. `count` is the number of expenses in range.
 */
export function spendByCategory(expenses, uid, range) {
  const totals = new Map();
  let total = 0;
  let count = 0;

  for (const exp of expenses) {
    if (!inRange(exp, range)) continue;
    const amount = personalAmount(exp, uid);
    total += amount;
    count += 1;
    const cat = categoryMeta(exp.category);
    const prev = totals.get(exp.category) || { value: cat.value, label: cat.label, emoji: cat.emoji, color: cat.color, amount: 0 };
    prev.amount += amount;
    totals.set(exp.category, prev);
  }

  const categories = [...totals.values()]
    .map((c) => ({
      ...c,
      amount: roundMoney(c.amount),
      pct: total > 0 ? Math.round((c.amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  return { total: roundMoney(total), count, categories };
}

/**
 * This calendar month's personal spend for `uid`, plus the daily average
 * derived from it. Returns
 *   { total, count, daysElapsed, dailyAverage }
 * where `dailyAverage` = total ÷ number of days elapsed in the month so far.
 */
export function monthStats(expenses, uid, now = new Date()) {
  const y = now.getFullYear();
  const m = now.getMonth();
  let monthTotal = 0;
  let count = 0;

  for (const exp of expenses) {
    const d = new Date(exp.createdAt);
    if (Number.isNaN(d.getTime())) continue;
    if (d.getFullYear() !== y || d.getMonth() !== m) continue;
    monthTotal += personalAmount(exp, uid);
    count += 1;
  }

  const daysElapsed = now.getDate();
  return {
    total: roundMoney(monthTotal),
    count,
    daysElapsed,
    dailyAverage: roundMoney(daysElapsed > 0 ? monthTotal / daysElapsed : 0),
  };
}

/**
 * The `limit` days (in the last `days` days) where `uid` spent the most,
 * biggest first. Each entry is
 *   { dateKey, label, total, count }
 * with `total` the personal share summed across that day and `count` the
 * number of expenses that day.
 */
export function peakDays(expenses, uid, { limit = 3, days = 30, now = new Date() } = {}) {
  const cutoff = new Date(now.getTime() - days * 86400000);
  const buckets = new Map();

  for (const exp of expenses) {
    const d = new Date(exp.createdAt);
    if (Number.isNaN(d.getTime()) || d < cutoff) continue;
    const amount = personalAmount(exp, uid);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (!buckets.has(key)) {
      buckets.set(key, { key, date: d, total: 0, count: 0 });
    }
    const bucket = buckets.get(key);
    bucket.total += amount;
    bucket.count += 1;
  }

  return [...buckets.values()]
    .map((b) => ({ ...b, total: roundMoney(b.total) }))
    .sort((a, b) => b.total - a.total)
    .slice(0, limit)
    .map((b) => ({
      dateKey: b.key,
      label: b.date.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      }),
      total: b.total,
      count: b.count,
    }));
}
