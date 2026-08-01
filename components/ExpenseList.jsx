"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { formatMoney } from "@/lib/money";
import { PENDING_VERIFICATION, PAID } from "@/lib/summary";

/** Chronological list of the room's expenses with a settle → verify workflow:
 *  - members tap "Settle my share" → their share becomes PENDING_VERIFICATION
 *    (no balance change yet);
 *  - the payer of the expense sees Approve/Reject on those shares — only an
 *    approval moves the wallet balances.
 *  After any action the parent's `onChanged` fires the AJAX refresh. */
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
  const [busyVerifyId, setBusyVerifyId] = useState(null);
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const mySplit = expense.splits[currentUserId];
  const isOwner = expense.paidBy === currentUserId; // the payer verifies settlements
  const canDelete = expense.createdBy === currentUserId;
  const splitCount = Object.keys(expense.splits || {}).length;

  // Other members' shares waiting on the owner's approval.
  const pendingVerifications = isOwner
    ? members.filter(
        (m) => m.id !== currentUserId && expense.splits[m.id]?.status === PENDING_VERIFICATION
      )
    : [];

  async function settle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/expenses/${expense.id}/settle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not mark as paid — try again.");
      onChanged();
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  }

  async function verify(memberId, action) {
    setBusyVerifyId(memberId);
    try {
      const res = await fetch(`/api/expenses/${expense.id}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: memberId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update settlement.");
      onChanged();
    } catch (err) {
      alert(err.message);
      setBusyVerifyId(null);
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
    <li className="py-3.5">
      <div className="flex items-center gap-4">
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
              mySplit.status === PAID ? (
                <span className="mt-0.5 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  Paid ✓
                </span>
              ) : mySplit.status === PENDING_VERIFICATION ? (
                <span className="mt-0.5 inline-block rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                  Pending approval
                </span>
              ) : (
                <button
                  onClick={settle}
                  disabled={busy}
                  className="btn-primary mt-0.5 px-2.5 py-1 text-xs"
                >
                  {busy ? "…" : "Settle my share"}
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
      </div>

      {pendingVerifications.length > 0 && (
        <div className="mt-3 space-y-2 rounded-xl bg-amber-50/80 px-3 py-2.5">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
            Awaiting your approval
          </p>
          {pendingVerifications.map((m) => {
            const share = expense.splits[m.id];
            const busyVerify = busyVerifyId === m.id;
            return (
              <div key={m.id} className="flex flex-wrap items-center justify-between gap-2">
                <span className="min-w-0 flex-1 text-sm text-slate-700">
                  <span className="font-medium text-slate-800">{m.name}</span>{" "}
                  marked <span className="font-semibold">{formatMoney(share.amount)}</span>{" "}
                  as paid
                </span>
                <span className="flex items-center gap-1.5">
                  <button
                    onClick={() => verify(m.id, "approve")}
                    disabled={busyVerify}
                    title="Approve payment"
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-60"
                  >
                    {busyVerify ? "…" : (
                      <>
                        <CheckIcon /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => verify(m.id, "reject")}
                    disabled={busyVerify}
                    title="Reject payment"
                    className="inline-flex items-center gap-1 rounded-lg bg-red-500 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-60"
                  >
                    {busyVerify ? "…" : (
                      <>
                        <XIcon /> Reject
                      </>
                    )}
                  </button>
                </span>
              </div>
            );
          })}
        </div>
      )}
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

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 12.5l5.5 5.5L20 6.5"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2.4"
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
