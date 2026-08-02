"use client";

import { useMemo } from "react";
import { formatMoney } from "@/lib/money";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { personalAmount } from "@/lib/history";

/** Horizontal bar chart comparing spent vs limit per category (or for a single category). */
export function SpendingVsLimitChart({ expenses, userId, categoryLimits, filterCategory }) {
  const data = useMemo(() => {
    if (!categoryLimits) return [];

    // Compute spending per category for the current month
    const now = new Date();
    const spending = {};
    for (const exp of expenses) {
      const d = new Date(exp.createdAt);
      if (d.getFullYear() !== now.getFullYear() || d.getMonth() !== now.getMonth()) continue;
      if (filterCategory && exp.category !== filterCategory) continue;
      const amt = personalAmount(exp, userId);
      spending[exp.category] = (spending[exp.category] || 0) + amt;
    }

    const cats = filterCategory
      ? EXPENSE_CATEGORIES.filter((c) => c.value === filterCategory)
      : EXPENSE_CATEGORIES.filter((c) => categoryLimits[c.value] != null);

    return cats
      .filter((c) => categoryLimits[c.value] != null)
      .map((c) => {
        const limit = categoryLimits[c.value];
        const spent = Math.round((spending[c.value] || 0) * 100) / 100;
        const pct = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const over = spent > limit;
        return { ...c, spent, limit, pct, over };
      })
      .sort((a, b) => b.pct - a.pct);
  }, [expenses, userId, categoryLimits, filterCategory]);

  if (data.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-2xl">📊</p>
        <p className="mt-2 text-sm font-medium text-slate-700">No category limits set</p>
        <p className="mt-1 text-xs text-slate-400">Set limits in Settings to see this chart.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((c) => (
        <div key={c.value}>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">{c.emoji} {c.label}</span>
            <span className={`text-xs font-semibold ${c.over ? "text-red-600" : "text-slate-600"}`}>
              {formatMoney(c.spent)} / {formatMoney(c.limit)}
            </span>
          </div>
          <div className="relative h-6 w-full overflow-hidden rounded-full bg-slate-100">
            {/* Limit marker */}
            <div className="absolute inset-y-0 right-0 w-px bg-slate-400" style={{ left: "100%" }} />
            {/* Spent bar */}
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
              style={{
                width: `${c.pct}%`,
                backgroundColor: c.over ? "#ef4444" : c.pct > 75 ? "#f59e0b" : "#22c55e",
              }}
            />
            {/* Percentage label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white drop-shadow-sm">
                {Math.round(c.spent / c.limit * 100)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
