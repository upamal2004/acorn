"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { formatMoney } from "@/lib/money";
import { PENDING, PAID } from "@/lib/summary";

/** Chronological list of the room's expenses with settle-one-tap buttons. */
export function ExpenseList({ expenses, members, currentUserId }) {
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
          />
        ))}
      </ul>
    </section>
  );
}

function ExpenseRow({ expense, members, currentUserId }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const mySplit = expense.splits[currentUserId];
  const isMine = expense.paidBy === currentUserId;
  const alreadyPaid = mySplit?.status === PAID;
  const splitCount = Object.keys(expense.splits || {}).length;

  async function settle() {
    setBusy(true);
    try {
      const res = await fetch(`/api/expenses/${expense.id}/settle`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Could not settle — try again.");
      router.refresh();
    } catch (err) {
      alert(err.message);
      setBusy(false);
    }
  }

  return (
    <li className="flex items-center gap-4 py-3.5">
      <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-peach-100 text-peach-600">
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

      <div className="text-right">
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
    </li>
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
