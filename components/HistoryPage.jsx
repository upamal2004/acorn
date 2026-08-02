"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ExpenseDetailModal } from "@/components/ExpenseDetailModal";
import { AnimateIn } from "@/components/AnimateIn";
import { formatMoney } from "@/lib/money";
import { groupExpensesByDay, personalAmount } from "@/lib/history";
import { categoryMeta } from "@/lib/categories";
import { PENDING_VERIFICATION } from "@/lib/summary";
import { ConfirmModal } from "@/components/ConfirmModal";

const HISTORY_DAYS = 30;

/** Dedicated /history page — the logged-in user's own transactions from the
 *  last 30 days, grouped by day and shown as personal shares. Fully settled
 *  expenses end up here after they drop off the dashboard's active list. */
export function HistoryPage({ user, room, members, expenses: initialExpenses }) {
  const [detailExpense, setDetailExpense] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [expenses, setExpenses] = useState(initialExpenses);

  const cutoff = useMemo(() => new Date(Date.now() - HISTORY_DAYS * 86400000), []);

  // Only transactions from the last 30 days, each shown at the user's own
  // personal share (never the room total).
  const recent = useMemo(
    () =>
      expenses
        .filter((exp) => new Date(exp.createdAt) >= cutoff)
        .map((exp) => ({ ...exp, amount: personalAmount(exp, user.id) })),
    [expenses, cutoff, user.id]
  );

  const days = useMemo(() => groupExpensesByDay(recent), [recent]);
  const total = useMemo(() => recent.reduce((s, e) => s + e.amount, 0), [recent]);

  async function handleDeleteConfirm() {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${deleteConfirm.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete.");
      setExpenses((prev) => prev.filter((e) => e.id !== deleteConfirm.id));
      setDeleteConfirm(null);
      setToast({ type: "success", message: "Expense deleted." });
    } catch (err) {
      setToast({ type: "error", message: err.message });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} room={room} active="history" onToast={setToast} />

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">History</h1>
            <p className="mt-1 text-sm text-slate-500">
              Your transactions from the last {HISTORY_DAYS} days, as your own
              share of each expense.
            </p>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Past {HISTORY_DAYS} days:{" "}
            <span className="font-bold text-acorn-700">{formatMoney(total)}</span>
          </p>
        </div>

        {days.length === 0 ? (
          <section className="card border-dashed text-center">
            <p className="text-3xl">🗓️</p>
            <h2 className="mt-2 text-lg font-semibold text-slate-800">
              Nothing in the last {HISTORY_DAYS} days
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Expenses you add or settle show up here once they&apos;re in the
              past month.
            </p>
            <Link href="/dashboard" className="btn-primary mt-4 inline-block">
              Back to dashboard
            </Link>
          </section>
        ) : (
          <div className="space-y-6 stagger-children">
            {days.map((day) => (
              <section key={day.dateKey} className="card card-hover">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="min-w-0 break-words text-sm font-semibold text-slate-800">
                    {day.dayName}
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      {day.dateLabel}
                    </span>
                  </p>
                  <span className="flex-none text-sm font-semibold text-slate-500">
                    {formatMoney(day.total)}
                  </span>
                </div>

                <ul className="divide-y divide-slate-100">
                  {day.expenses.map((exp) => {
                    const cat = categoryMeta(exp.category);
                    return (
                      <li
                        key={exp.id}
                        className="expense-row flex items-center gap-3 py-2.5"
                      >
                        <div
                          className="flex h-9 w-9 flex-none items-center justify-center rounded-lg text-base"
                          style={{ backgroundColor: `${cat.color}1a` }}
                          aria-hidden="true"
                        >
                          {cat.emoji}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-slate-800">
                            {exp.title}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {cat.label}
                            {exp.description && " · has notes"}
                            {exp.paidBy !== user.id && (
                              <>
                                {" · "}
                                paid by{" "}
                                {members.find((m) => m.id === exp.paidBy)?.name ||
                                  "someone"}
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex flex-none flex-col items-end gap-1">
                          <span className="text-sm font-semibold text-slate-800">
                            {formatMoney(exp.amount)}
                          </span>
                          <HistoryStatus expense={exp} currentUserId={user.id} />
                        </div>
                        <button
                          onClick={() => setDetailExpense(exp)}
                          className="btn-ghost flex-none px-2 py-1.5 text-xs text-slate-400 transition hover:text-acorn-600"
                          title="View details"
                        >
                          View
                        </button>
                        {exp.createdBy === user.id && (
                          <button
                            onClick={() => {
                              const splitCount = Object.keys(exp.splits || {}).length;
                              setDeleteConfirm({ id: exp.id, title: exp.title, isShared: splitCount > 1 });
                            }}
                            className="btn-ghost flex-none px-2 py-1.5 text-slate-400 transition hover:text-red-500"
                            title="Delete expense"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                              <line x1="10" y1="11" x2="10" y2="17" />
                              <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </main>

      {detailExpense && (
        <ExpenseDetailModal
          expense={detailExpense}
          members={members}
          currentUserId={user.id}
          onClose={() => setDetailExpense(null)}
        />
      )}

      <ConfirmModal
        show={!!deleteConfirm}
        title="Delete expense?"
        message={
          deleteConfirm?.isShared
            ? `Are you sure you want to delete "${deleteConfirm?.title}"? This is a shared expense. Deleting it will adjust room balances and remove it from all members' records. This action cannot be undone.`
            : `Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone and the expense will be permanently removed.`
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        busy={deleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm(null)}
      />

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div
            className={`w-full max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}

function HistoryStatus({ expense, currentUserId }) {
  // Check only the CURRENT user's share — not all members'. If I've paid my
  // part, this transaction is settled for me regardless of others.
  const myShare = expense.splits?.[currentUserId];
  const myPaid = myShare?.status === "PAID";

  if (myPaid) {
    return (
      <span className="inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
        Settled ✓
      </span>
    );
  }
  if (myShare?.status === PENDING_VERIFICATION) {
    return (
      <span className="inline-block rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
        Pending approval
      </span>
    );
  }
  // I'm the payer and someone else's share is awaiting my verification.
  if (expense.paidBy === currentUserId && Object.values(expense.splits || {}).some((s) => s.status === PENDING_VERIFICATION)) {
    return (
      <span className="inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
        Awaiting verification
      </span>
    );
  }
  return (
    <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
      Pending
    </span>
  );
}
