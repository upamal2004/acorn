"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";
import { categoryMeta } from "@/lib/categories";
import { personalAmount } from "@/lib/history";
import { ExpenseDetailModal } from "./ExpenseDetailModal";

/**
 * Shows the last 5 relevant transactions for the logged-in user.
 * "Relevant" means expenses the user is involved in (paid or split).
 * Includes a "View All / Filter" button that opens the filter modal.
 */
export function RecentTransactions({ expenses, members, currentUserId, onToast }) {
  const [detailExpense, setDetailExpense] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // Get last 5 transactions sorted by date (newest first)
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [expenses]);

  if (recentExpenses.length === 0) return null;

  return (
    <>
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Recent Transactions
          </h2>
          <button
            onClick={() => setFilterOpen(true)}
            className="text-xs font-medium text-acorn-600 hover:text-acorn-700"
          >
            View All / Filter
          </button>
        </div>

        <div className="space-y-3">
          {recentExpenses.map((exp) => {
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
                {/* Category emoji */}
                <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-lg"
                  style={{ backgroundColor: meta.color + "15" }}>
                  {meta.emoji}
                </span>

                {/* Title + date */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">
                    {exp.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </p>
                </div>

                {/* Amount + status */}
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

      {filterOpen && (
        <TransactionFilterModal
          expenses={expenses}
          members={members}
          currentUserId={currentUserId}
          onClose={() => setFilterOpen(false)}
          onToast={onToast}
        />
      )}
    </>
  );
}

// Lazy import to avoid circular dependency issues
import { TransactionFilterModal } from "./TransactionFilterModal";
