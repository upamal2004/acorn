"use client";

import { useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { formatMoney } from "@/lib/money";
import { groupExpensesByWeek, groupExpensesByDay } from "@/lib/history";

/**
 * "Expense history" modal: pick a week, see that week's expenses grouped by
 * day (e.g. "Tuesday → Breakfast: Rs. 150, Lunch: Rs. 250"). The list is
 * pre-filtered by the dashboard to the logged-in user's own activity, so only
 * the expenses they added, paid for, or were split into are shown.
 */
export function ExpenseHistory({ expenses, members, currentUserId, onClose }) {
  const nameById = useMemo(
    () => Object.fromEntries(members.map((m) => [m.id, m.name])),
    [members]
  );

  const weeks = useMemo(
    () => groupExpensesByWeek(expenses, { weeks: 12 }),
    [expenses]
  );
  const [weekIndex, setWeekIndex] = useState(weeks.length - 1); // newest week

  const activeWeek = weeks[weekIndex] || null;
  const days = useMemo(
    () => (activeWeek ? groupExpensesByDay(activeWeek.expenses) : []),
    [activeWeek]
  );
  const weekTotal = useMemo(
    () => (activeWeek ? activeWeek.expenses.reduce((s, e) => s + e.amount, 0) : 0),
    [activeWeek]
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Expense history</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Your activity only — expenses you added or were split into.
            </p>
          </div>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        {weeks.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-slate-500">
            No expenses yet to review.
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-6 py-3">
              <label className="text-sm font-medium text-slate-600">Week</label>
              <select
                className="input w-auto flex-1 sm:max-w-xs"
                value={weekIndex}
                onChange={(e) => setWeekIndex(Number(e.target.value))}
              >
                {weeks.map((w, i) => (
                  <option key={w.weekStart.toISOString()} value={i}>
                    {w.label}
                  </option>
                ))}
              </select>
              <span className="text-sm font-semibold text-acorn-700">
                {formatMoney(weekTotal)}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {days.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Nothing was spent this week.
                </p>
              ) : (
                <div className="space-y-5">
                  {days.map((day) => (
                    <div key={day.dateKey}>
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">
                          {day.dayName}
                          <span className="ml-2 text-xs font-normal text-slate-400">
                            {day.dateLabel}
                          </span>
                        </p>
                        <span className="text-xs font-semibold text-slate-500">
                          {formatMoney(day.total)}
                        </span>
                      </div>
                      <ul className="space-y-1.5">
                        {day.expenses.map((exp) => (
                          <li
                            key={exp.id}
                            className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
                          >
                            <Avatar
                              name={nameById[exp.paidBy] || "?"}
                              size={26}
                            />
                            <span className="min-w-0 flex-1 truncate text-sm text-slate-700">
                              {exp.title}
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                              {formatMoney(exp.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
