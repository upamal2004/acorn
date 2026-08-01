"use client";

import { Avatar } from "@/components/Avatar";
import { formatMoney } from "@/lib/money";
import { categoryMeta } from "@/lib/categories";
import { PENDING, PENDING_VERIFICATION, PAID } from "@/lib/summary";

/** Clean read-only modal with the full details of one expense: the whole
 *  (untruncated) title, its category, any notes/description, who paid, when it
 *  was added, and the per-member split with each person's share + status.
 *  Opened from a "View details" affordance on long expense rows. */
export function ExpenseDetailModal({ expense, members, currentUserId, onClose }) {
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));
  const cat = categoryMeta(expense.category);
  const date = new Date(expense.createdAt).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const splits = members
    .filter((m) => expense.splits[m.id])
    .sort((a, b) => {
      if (a.id === expense.paidBy) return -1;
      if (b.id === expense.paidBy) return 1;
      return (expense.splits[a.id].amount || 0) < (expense.splits[b.id].amount || 0) ? 1 : -1;
    });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div
              className="flex h-11 w-11 flex-none items-center justify-center rounded-xl text-xl"
              style={{ backgroundColor: `${cat.color}1a` }}
              aria-hidden="true"
            >
              {cat.emoji}
            </div>
            <div className="min-w-0">
              <h2 className="break-words text-lg font-bold leading-snug text-slate-900">
                {expense.title}
              </h2>
              <span
                className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
              >
                {cat.emoji} {cat.label}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        <dl className="space-y-3 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-slate-500">Total</dt>
            <dd className="text-right text-xl font-bold text-slate-900">
              {formatMoney(expense.amount)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-slate-500">Paid by</dt>
            <dd className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Avatar name={nameById[expense.paidBy] || "someone"} size={22} />
              {nameById[expense.paidBy] || "someone"}
              {expense.paidBy === currentUserId && (
                <span className="text-xs text-slate-400">(you)</span>
              )}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-sm text-slate-500">Added</dt>
            <dd className="text-right text-sm text-slate-600">{date}</dd>
          </div>
        </dl>

        {expense.description && (
          <div className="mt-4">
            <p className="mb-1 text-sm font-medium text-slate-700">Notes</p>
            <p className="break-words rounded-xl bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
              {expense.description}
            </p>
          </div>
        )}

        <div className="mt-4">
          <p className="mb-2 text-sm font-medium text-slate-700">
            Split ({splits.length}{" "}
            {splits.length === 1 ? "person" : "people"})
          </p>
          <ul className="space-y-2">
            {splits.map((m) => {
              const share = expense.splits[m.id];
              const isPayer = m.id === expense.paidBy;
              return (
                <li
                  key={m.id}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2"
                >
                  <Avatar name={m.name} image={m.image} size={28} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-700">
                    {m.name}
                    {m.id === currentUserId && (
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        (you)
                      </span>
                    )}
                    {isPayer && (
                      <span className="ml-1.5 rounded bg-acorn-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-acorn-700">
                        paid
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-slate-800">
                    {formatMoney(share.amount)}
                  </span>
                  <StatusPill status={share.status} />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  if (status === PAID) {
    return (
      <span className="flex-none rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
        Paid ✓
      </span>
    );
  }
  if (status === PENDING_VERIFICATION) {
    return (
      <span className="flex-none rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
        Pending approval
      </span>
    );
  }
  if (status === PENDING) {
    return (
      <span className="flex-none rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">
        Pending
      </span>
    );
  }
  return null;
}
