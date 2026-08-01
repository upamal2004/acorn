import { computeSummary, computeWhoOwes } from "@/lib/summary";
import { formatMoney } from "@/lib/money";

/** "You owe / you're owed / your net" panel plus a person-by-person debt
 *  breakdown, e.g. "Amal: Rs. 60", "Kamal: Rs. 80". */
export function RoomSummary({ expenses, members, currentUserId }) {
  const { iOwe, owedToMe, net } = computeSummary(expenses, currentUserId);
  const { youOwe, owedToYou } = computeWhoOwes(expenses, currentUserId);
  const memberCount = members.length;
  const nameById = Object.fromEntries(members.map((m) => [m.id, m.name]));

  const youOweList = Object.entries(youOwe)
    .filter(([, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);
  const owedToList = Object.entries(owedToYou)
    .filter(([, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1]);

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

      {(youOweList.length > 0 || owedToList.length > 0) && (
        <div className="mt-4 space-y-3">
          {youOweList.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                You owe
              </p>
              <ul className="space-y-1">
                {youOweList.map(([uid, amt]) => (
                  <li
                    key={uid}
                    className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {nameById[uid] || "Someone"}
                    </span>
                    <span className="font-semibold text-red-600">{formatMoney(amt)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {owedToList.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                You're owed by
              </p>
              <ul className="space-y-1">
                {owedToList.map(([uid, amt]) => (
                  <li
                    key={uid}
                    className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium text-slate-700">
                      {nameById[uid] || "Someone"}
                    </span>
                    <span className="font-semibold text-emerald-600">{formatMoney(amt)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

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
