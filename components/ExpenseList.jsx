"use client";

import { useState, useCallback } from "react";
import { StoryAnimation } from "@/components/StoryAnimation";
import { ConfirmModal } from "@/components/ConfirmModal";
import { formatMoney } from "@/lib/money";
import { PENDING_VERIFICATION, PAID } from "@/lib/summary";
import { categoryMeta } from "@/lib/categories";
import { ExpenseDetailModal } from "@/components/ExpenseDetailModal";

/**
 * Chronological list of the expenses involving the signed-in user.
 * The delete confirmation modal is rendered at the root level to prevent overflow.
 */
export function ExpenseList({ expenses, members, currentUserId, onChanged, emptyNote }) {
  const [detailExpense, setDetailExpense] = useState(null);
  const [animation, setAnimation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { id, title, isShared } or null
  const [deleting, setDeleting] = useState(false);

  const handleAnimationComplete = useCallback(() => {
    setAnimation(null);
  }, []);

  async function handleDeleteConfirm() {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/expenses/${deleteConfirm.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete.");
      setDeleteConfirm(null);
      onChanged();
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  }

  if (!expenses.length) {
    return (
      <section className="card border-dashed text-center">
        <p className="text-3xl">🧾</p>
        <h2 className="mt-2 text-lg font-semibold text-slate-800">
          {emptyNote ? "All settled" : "No expenses yet"}
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {emptyNote ??
            "Add an expense - rent, groceries, that takeaway - and it shows up here for you and whoever you split it with."}
        </p>
      </section>
    );
  }

  return (
    <>
      {/* Story-driven receiving/settled animation */}
      <StoryAnimation
        type={animation?.type || "received"}
        amount={animation?.amount}
        label={animation?.label}
        show={!!animation}
        onComplete={handleAnimationComplete}
      />

      {/* Delete confirmation modal - rendered at root level */}
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
              onView={() => setDetailExpense(exp)}
              onCelebrate={(type, amount, label) => setAnimation({ type, amount, label })}
              onDeleteRequest={(id, title, isShared) => setDeleteConfirm({ id, title, isShared })}
            />
          ))}
        </ul>

        {detailExpense && (
          <ExpenseDetailModal
            expense={detailExpense}
            members={members}
            currentUserId={currentUserId}
            onClose={() => setDetailExpense(null)}
          />
        )}
      </section>
    </>
  );
}

/**
 * Individual expense row. No modals rendered here — confirmation is handled by parent.
 */
function ExpenseRow({ expense, members, currentUserId, onChanged, onView, onCelebrate, onDeleteRequest }) {
  const [busy, setBusy] = useState(false);
  const [busyVerifyId, setBusyVerifyId] = useState(null);
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const mySplit = expense.splits[currentUserId];
  const isOwner = expense.paidBy === currentUserId;
  const splitCount = Object.keys(expense.splits || {}).length;

  // Can delete if the current user is the creator (personal OR shared)
  const isCreator = expense.createdBy === currentUserId;
  const isShared = splitCount > 1;
  const canDelete = isCreator;
  // Personal expense: no room and only 1 split
  const isPersonal = !expense.roomId && splitCount === 1 && expense.splits[currentUserId];

  // Long titles and expenses with notes get a "View details" affordance
  const isLong = (expense.title || "").length > 48;
  const hasNotes = Boolean(expense.description);
  const canViewDetails = isLong || hasNotes;

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
      if (!res.ok) throw new Error("Could not mark as paid - try again.");
      onCelebrate?.("settled", mySplit?.amount, "Debt settled!");
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
      if (action === "approve") {
        onCelebrate?.("received", expense.splits?.[memberId]?.amount, "Payment approved!");
      }
      onChanged();
    } catch (err) {
      alert(err.message);
      setBusyVerifyId(null);
    }
  }

  return (
    <li className="expense-row py-3.5">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-slate-50 text-lg">
          <ExpenseGlyph expense={expense} />
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
            {isPersonal && (
              <span className="ml-1.5 inline-block rounded-full bg-violet-100 px-1.5 py-0.5 text-[10px] font-semibold text-violet-600">
                Personal
              </span>
            )}
          </p>
          {canViewDetails && (
            <button
              onClick={onView}
              className="mt-1 inline-flex items-center gap-0.5 text-xs font-semibold text-acorn-600 transition hover:text-acorn-700"
            >
              View details <span aria-hidden="true">→</span>
            </button>
          )}
        </div>

        <div className="flex flex-none flex-wrap items-center justify-end gap-2 text-right">
          <div>
            <p className="text-sm font-bold text-slate-800">
              {mySplit ? formatMoney(mySplit.amount) : "-"}
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
              onClick={() => onDeleteRequest?.(expense.id, expense.title, isShared)}
              title="Delete expense"
              className="btn-ghost px-2 py-1.5 text-slate-400 transition hover:text-red-500"
            >
              <TrashIcon />
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
                <div className="flex gap-2">
                  <button
                    disabled={busyVerify}
                    onClick={() => verify(m.id, "approve")}
                    className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-emerald-600 active:scale-95"
                  >
                    {busyVerify ? "…" : "Approve"}
                  </button>
                  <button
                    disabled={busyVerify}
                    onClick={() => verify(m.id, "reject")}
                    className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-300 active:scale-95"
                  >
                    Reject
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </li>
  );
}

function ExpenseGlyph({ expense }) {
  const meta = categoryMeta(expense.category);
  return <span>{meta.emoji}</span>;
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
