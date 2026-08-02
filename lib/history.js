// ---------------------------------------------------------------------------
// lib/history.js -- helpers for the weekly expense history view.
// A "week" is Monday → Sunday (ISO 8601). Expenses are grouped by the week
// they fall in, then by day within that week.
// ---------------------------------------------------------------------------

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** Monday 00:00 of the week containing `date`. */
export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  const diff = (day + 6) % 7; // days since Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

/** Sunday 23:59:59.999 of the week containing `date`. */
export function endOfWeek(date) {
  const d = startOfWeek(date);
  d.setDate(d.getDate() + 7);
  d.setMilliseconds(-1);
  return d;
}

/**
 * Split expenses into week buckets (oldest → newest). Each expense carries an
 * ISO `createdAt` string. Returns an array of
 *   { weekStart: Date, label: string, expenses: [...] }
 * where `expenses` are sorted oldest → newest.
 */
export function groupExpensesByWeek(expenses, { weeks = 12 } = {}) {
  const buckets = new Map();

  for (const exp of expenses) {
    const date = new Date(exp.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const start = startOfWeek(date);
    const key = start.toISOString().slice(0, 10);
    if (!buckets.has(key)) {
      buckets.set(key, { weekStart: start, expenses: [] });
    }
    buckets.get(key).expenses.push(exp);
  }

  // Collect up to the last `weeks` buckets plus the current week, oldest first.
  const list = [...buckets.values()].sort((a, b) => a.weekStart - b.weekStart);
  const now = startOfWeek(new Date());
  if (!list.some((b) => b.weekStart.getTime() === now.getTime())) {
    list.push({ weekStart: now, expenses: [] });
  }
  return list.slice(-weeks).map((b) => ({
    ...b,
    label: weekLabel(b.weekStart, now),
  }));
}

/** "This week" when it's the current week, otherwise "Week of 28 Jul". */
export function weekLabel(weekStart, currentWeekStart = startOfWeek(new Date())) {
  if (weekStart.getTime() === currentWeekStart.getTime()) return "This week";
  return `Week of ${weekStart.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })}`;
}

/**
 * True when an expense is part of `uid`'s personal activity -- they added it,
 * they paid for it, or they're one of the members it was split with. Used to
 * scope the history view to the logged-in user so other members' unrelated
 * expenses stay hidden.
 */
export function isMyExpense(exp, uid) {
  if (exp.createdBy === uid) return true;
  if (exp.paidBy === uid) return true;
  return Boolean(exp.splits && exp.splits[uid]);
}

/** Filter a list of expenses down to the current user's own activity. */
export function filterMyExpenses(expenses, uid) {
  return expenses.filter((exp) => isMyExpense(exp, uid));
}

/**
 * The current user's personal share of an expense (dollars): their split
 * amount when they're part of the split, otherwise the full amount -- the case
 * where they paid for an expense that was split entirely among other members,
 * so they're out of pocket for the whole bill. Used by the history view so
 * daily/weekly totals reflect only the user's own money, never the combined
 * room total.
 */
export function personalAmount(exp, uid) {
  const share = exp.splits && exp.splits[uid];
  return share ? share.amount : exp.amount;
}

/**
 * Group a list of expenses (for one week) by day, newest week-day first.
 * Returns an array of { dateKey, dayName, dateLabel, total, expenses }.
 */
export function groupExpensesByDay(expenses) {
  const days = new Map();

  for (const exp of expenses) {
    const date = new Date(exp.createdAt);
    if (Number.isNaN(date.getTime())) continue;
    const key = date.toISOString().slice(0, 10);
    if (!days.has(key)) {
      days.set(key, {
        dateKey: key,
        dayName: DAY_NAMES[date.getDay()],
        dateLabel: date.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "short",
        }),
        total: 0,
        expenses: [],
      });
    }
    const day = days.get(key);
    day.total += exp.amount;
    day.expenses.push(exp);
  }

  return [...days.values()]
    .sort((a, b) => (a.dateKey < b.dateKey ? -1 : 1))
    .reverse(); // most recent day first
}
