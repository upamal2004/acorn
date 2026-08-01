"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { formatMoney } from "@/lib/money";
import { PENDING, PAID } from "@/lib/summary";

/** Chronological list of the room's expenses with settle-one-tap buttons.
 *  After a settle/delete the parent's `onChanged` is fired so the AJAX
 *  refresh (no page reload) picks up the new balances. */
export function ExpenseList({ expenses, members, currentUserId, onChanged }) {
  if (!expenses.length) {
    return (
      <section className="card border-dashed text-center">
        <p className="text-3xl">🧾</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-800">No expenses yet</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add your first expense — rent, groceries, that takeaway — and it shows
          up here for the whole room.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Expenses
      </h2>
      <ul className="divide-y divide-slate-100">
        {expenses.map((exp) => (
          <ExpenseRow
            key={exp.id}
            expense={exp}
            members={members}
            currentUserId={currentUserId}
            onChanged={onChanged}
          />
        ))}
      </ul>
    </section>
  );
}

function ExpenseRow({ expense, members, currentUserId, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const mySplit = expense.splits[currentUserId];
  const isMine = expense.paidBy === currentUserId;
  const canDelete = expense.createdBy === currentUserId;
  const alreadyPaid = mySplit?.status === PAID;
  const splitCount = Object.keys(expense.splits || {}).length;

  async function settle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/expenses/${expense.id}/settle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not settle — try again.");
      onChanged();
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${expense.title}"? This can't be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${expense.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete.");
      onChanged();
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  return (
    <li className="flex items-center gap-4 py-3.5">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-acorn-100 text-acorn-600">
        <ExpenseGlyph title={expense.title} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-800">
          {expense.title}
        </p>
        <p className="mt-0.5 text-xs text-slate-500">
          Paid by <span className="font-medium text-slate-600">{nameById[expense.paidBy] || "someone"}</span>
          {" · "}
          {splitCount} {splitCount === 1 ? "person" : "people"} ·{" "}
          {formatMoney(expense.amount)} total
        </p>
      </div>

      <div className="flex items-center gap-2 text-right">
        <div>
          <p className="text-sm font-bold text-slate-800">
            {mySplit ? formatMoney(mySplit.amount) : "—"}
          </p>

          {mySplit ? (
            alreadyPaid ? (
              <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                Paid ✓
              </span>
            ) : (
              <button
                onClick={settle}
                disabled={busy}
                className="btn-primary mt-0.5 px-2.5 py-1 text-xs"
              >
                {busy ? "…" : isMine ? "Settled (you paid)" : "Settle my share"}
              </button>
            )
          ) : (
            <span className="mt-0.5 inline-block text-xs text-slate-400">
              Not in split
            </span>
          )}
        </div>

        {canDelete && (
          <button
            onClick={remove}
            disabled={deleting}
            title="Delete expense"
            className="btn-ghost px-2 py-1.5 text-slate-400 transition hover:text-red-500"
          >
            {deleting ? (
              <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-red-500" />
            ) : (
              <TrashIcon />
            )}
          </button>
        )}
      </div>
    </li>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ExpenseGlyph({ title }) {
  const t = (title || "").toLowerCase();
  const map = {
    rent: "🏠",
    utility: "💡",
    electricity: "💡",
    gas: "🔥",
    water: "💧",
    internet: "🌐",
    wifi: "🌐",
    grocery: "🛒",
    groceries: "🛒",
    food: "🍔",
    takeaway: "🥡",
    meal: "🍜",
    dinner: "🍝",
    cleaning: "🧼",
    netflix: "📺",
  };
  const hit = Object.keys(map).find((k) => t.includes(k));
  return <span className="text-lg">{hit ? map[hit] : "🧾"}</span>;
}
