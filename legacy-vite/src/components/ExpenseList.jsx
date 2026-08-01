import { useState } from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Loader2,
  Receipt,
  ReceiptText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { markSharePaid } from "../lib/rooms.js";
import { formatMoney } from "../lib/money.js";
import { PENDING, PAID } from "../lib/summary.js";
import Avatar from "./Avatar.jsx";

/** Transaction history feed, newest first. */
export default function ExpenseList({ expenses, members, currentUid }) {
  const memberMap = Object.fromEntries(members.map((m) => [m.id, m]));

  if (!expenses.length) {
    return (
      <div className="card flex flex-col items-center gap-3 py-14 text-center">
        <div className="rounded-full bg-peach-100 p-4 text-peach-500">
          <ReceiptText size={28} />
        </div>
        <p className="font-semibold text-slate-700">No expenses yet</p>
        <p className="max-w-xs text-sm text-slate-500">
          Add your first expense and Peach will split it between your room.
        </p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {expenses.map((expense) => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          memberMap={memberMap}
          currentUid={currentUid}
        />
      ))}
    </ul>
  );
}

// --- Single expense row ------------------------------------------------------

function ExpenseItem({ expense, memberMap, currentUid }) {
  const { user } = useAuth();
  const [settling, setSettling] = useState(false);

  const payer = memberMap[expense.paidBy];
  const myShare = expense.splits?.[currentUid];
  const amIInSplit = expense.splitBetween?.includes(currentUid);

  const date = expense.createdAt?.toDate?.();
  const dateLabel = date
    ? date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
      " · " +
      date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : "Just now";

  async function handleSettle() {
    setSettling(true);
    try {
      await markSharePaid(expense.id, user.uid);
    } finally {
      setSettling(false);
    }
  }

  return (
    <li className="card !p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-peach-100 p-2.5 text-peach-600">
          <Receipt size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-800">
                {expense.title}
              </p>
              <p className="mt-0.5 truncate text-xs text-slate-500">
                {dateLabel} · Paid by {payer?.name || "someone"}
              </p>
            </div>
            <p className="shrink-0 text-base font-extrabold text-slate-900">
              {formatMoney(expense.amount)}
            </p>
          </div>

          {/* Your share */}
          {amIInSplit && myShare && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-50 px-3 py-2">
              <span className="text-xs font-medium text-slate-500">
                Your share:{" "}
                <span className="font-bold text-slate-700">
                  {formatMoney(myShare.amount)}
                </span>
              </span>

              {expense.paidBy === currentUid ? (
                <span className="flex items-center gap-1 text-xs font-bold text-peach-600">
                  <CheckCircle2 size={14} /> You paid this
                </span>
              ) : myShare.status === PAID ? (
                <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                  <CheckCircle2 size={14} /> Paid
                </span>
              ) : (
                <button
                  onClick={handleSettle}
                  disabled={settling}
                  className="btn-secondary !rounded-lg !px-3 !py-1.5 text-xs !text-green-700"
                >
                  {settling ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}
                  Mark as paid
                </button>
              )}
            </div>
          )}

          {/* Everyone in the split */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {expense.splitBetween?.map((uid) => {
              const share = expense.splits?.[uid];
              const status = share?.status ?? PENDING;
              const settled = status === PAID;
              const member = memberMap[uid];
              return (
                <span
                  key={uid}
                  title={member?.name}
                  className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-[11px] font-semibold ${
                    settled
                      ? "border-green-200 bg-green-50 text-green-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  <Avatar member={member} size={18} />
                  {member?.name?.split(" ")[0]}
                  {settled ? (
                    <Check size={12} />
                  ) : (
                    <Clock size={12} />
                  )}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </li>
  );
}
