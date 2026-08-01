import { computeSummary } from "@/lib/summary";
import { formatMoney } from "@/lib/money";

/** "You owe / you're owed / your net" panel computed from the ledger. */
export function RoomSummary({ expenses, members, currentUserId }) {
  const { iOwe, owedToMe, net } = computeSummary(expenses, currentUserId);
  const memberCount = members.length;

  return (
    <section className="card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        The room
      </h2>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat label="You owe" value={formatMoney(iOwe)} tone={iOwe > 0 ? "danger" : "neutral"} />
        <Stat label="You're owed" value={formatMoney(owedToMe)} tone={owedToMe > 0 ? "good" : "neutral"} />
        <Stat
          label="Net"
          value={formatMoney(net)}
          tone={net > 0 ? "good" : net < 0 ? "danger" : "neutral"}
        />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
        {memberCount} {memberCount === 1 ? "person" : "people"} share this room
        over {expenses.length} {expenses.length === 1 ? "expense" : "expenses"}.
      </div>
    </section>
  );
}

function Stat({ label, value, tone }) {
  const toneClass = {
    neutral: "text-slate-900",
    good: "text-emerald-600",
    danger: "text-red-500",
  }[tone];

  return (
    <div className="rounded-xl bg-white px-2 py-3 ring-1 ring-slate-100">
      <p className={`text-sm font-bold ${toneClass}`}>{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{label}</p>
    </div>
  );
}
