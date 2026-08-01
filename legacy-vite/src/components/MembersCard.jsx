import { Crown, Users } from "lucide-react";
import { computeMemberStats } from "../lib/summary.js";
import { formatMoney } from "../lib/money.js";
import Avatar from "./Avatar.jsx";

/** Room members list with each person's aggregate payment status. */
export default function MembersCard({ members, expenses, currentUid, room }) {
  const stats = computeMemberStats(members, expenses);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-bold text-slate-900">
          <Users size={18} className="text-slate-400" />
          Members
        </h3>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-500">
          {members.length}
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {members.map((member) => {
          const stat = stats[member.id] ?? { owes: 0, owedTo: 0, pendingCount: 0 };
          const isMe = member.id === currentUid;
          const isOwner = member.id === room?.ownerId;
          const settled = stat.pendingCount === 0;

          return (
            <li key={member.id} className="flex items-center gap-3">
              <Avatar member={member} size={38} />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-slate-800">
                  {member.name}
                  {isOwner && <Crown size={13} className="shrink-0 text-peach-500" />}
                  {isMe && <span className="text-xs font-medium text-slate-400">(you)</span>}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {settled ? (
                    <span className="text-green-600 font-medium">All settled</span>
                  ) : stat.owes > 0 ? (
                    <>
                      Owes {formatMoney(stat.owes)} · {stat.pendingCount} pending
                    </>
                  ) : (
                    <>
                      Collecting {formatMoney(stat.owedTo)} · {stat.pendingCount} pending
                    </>
                  )}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                  settled
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {settled ? "PAID" : "PENDING"}
              </span>
            </li>
          );
        })}

        {!members.length && (
          <li className="py-6 text-center text-sm text-slate-400">
            No members yet.
          </li>
        )}
      </ul>
    </div>
  );
}
