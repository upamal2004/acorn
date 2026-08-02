"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";
import { categoryMeta, EXPENSE_CATEGORIES } from "@/lib/categories";
import { personalAmount } from "@/lib/history";
import { ExpenseDetailModal } from "./ExpenseDetailModal";

/**
 * Full-screen modal for viewing all transactions with advanced filtering.
 * Filter by date range (month picker) and spending category.
 */
export function TransactionFilterModal({ expenses, members, currentUserId, onClose, onToast }) {
  const [detailExpense, setDetailExpense] = useState(null);

  // Filter state
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [category, setCategory] = useState("ALL");

  // Apply filters
  const filtered = useMemo(() => {
    let result = [...expenses];

    // Month filter
    if (month) {
      const [year, m] = month.split("-").map(Number);
      result = result.filter((exp) => {
        const d = new Date(exp.createdAt);
        return d.getFullYear() === year && d.getMonth() === m - 1;
      });
    }

    // Category filter
    if (category !== "ALL") {
      result = result.filter((exp) => exp.category === category);
    }

    // Sort newest first
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return result;
  }, [expenses, month, category]);

  const totalSpent = useMemo(() => {
    return filtered.reduce((sum, exp) => sum + personalAmount(exp, currentUserId), 0);
  }, [filtered, currentUserId]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-white sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">All Transactions</h2>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 border-b border-slate-100 px-6 py-3">
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-acorn-500 focus:outline-none focus:ring-1 focus:ring-acorn-500"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-xs font-medium text-slate-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-sm focus:border-acorn-500 focus:outline-none focus:ring-1 focus:ring-acorn-500"
            >
              <option value="ALL">All categories</option>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.emoji} {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-3">
          <span className="text-sm text-slate-500">
            {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
          </span>
          <span className="text-sm font-semibold text-slate-800">
            Total: {formatMoney(totalSpent)}
          </span>
        </div>

        {/* Transaction list */}
        <div className="flex-1 overflow-y-auto px-6 py-3">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No transactions match your filters.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((exp) => {
                const meta = categoryMeta(exp.category);
                const myShare = personalAmount(exp, currentUserId);
                const date = new Date(exp.createdAt);
                const isPaid = exp.splits[currentUserId]?.status === "PAID";
                const isPendingVerification = exp.splits[currentUserId]?.status === "PENDING_VERIFICATION";

                return (
                  <button
                    key={exp.id}
                    onClick={() => setDetailExpense(exp)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-50"
                  >
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg"
                      style={{ backgroundColor: meta.color + "15" }}
                    >
                      {meta.emoji}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {exp.title}
                      </p>
                      <p className="text-xs text-slate-400">
                        {date.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        {formatMoney(myShare)}
                      </p>
                      {isPaid ? (
                        <span className="text-xs text-emerald-600">Paid</span>
                      ) : isPendingVerification ? (
                        <span className="text-xs text-sky-600">Pending</span>
                      ) : (
                        <span className="text-xs text-amber-600">Owes</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {detailExpense && (
        <ExpenseDetailModal
          expense={detailExpense}
          members={members}
          currentUserId={currentUserId}
          onClose={() => setDetailExpense(null)}
          onToast={onToast}
        />
      )}
    </div>
  );
}
