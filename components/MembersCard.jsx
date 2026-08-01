"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { computeMemberStats } from "@/lib/summary";
import { formatMoney } from "@/lib/money";

/** Member list with who still owes money to the room. The room creator sees a
 *  "Remove" action on every other member; everyone can see the creator badge. */
export function MembersCard({ members, currentUserId, ownerId, expenses }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState(null);
  const stats = computeMemberStats(members, expenses);
  const isAdmin = ownerId === currentUserId;

  async function remove(member) {
    if (!window.confirm(`Remove ${member.name} from the room? They'll go back to solo mode.`)) return;
    setBusyId(member.id);
    try {
      const res = await fetch(`/api/rooms/${member.id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not remove member.");
      router.refresh();
    } catch (err) {
      alert(err.message);
      setBusyId(null);
    }
  }

  if (!members.length) {
    return (
      <section className="card">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
          Flatmates
        </h2>
        <p className="text-sm text-slate-500">
          No one else has joined yet. Share your room code to invite them.
        </p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-400">
        Flatmates
      </h2>
      <ul className="space-y-3">
        {members.map((m) => {
          const s = stats[m.id] || { owes: 0, owedTo: 0, pendingCount: 0 };
          const isMe = m.id === currentUserId;
          const isCreator = m.id === ownerId;
          const owes = s.owes > 0;

          return (
            <li key={m.id} className="flex items-center gap-3">
              <Avatar name={m.name} image={m.image} size={34} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-800">
                  {m.name}
                  {isMe && <span className="ml-1.5 text-xs text-slate-400">(you)</span>}
                  {isCreator && (
                    <span className="ml-1.5 rounded bg-acorn-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-acorn-700">
                      creator
                    </span>
                  )}
                </p>
                <p
                  className={`text-xs ${
                    owes
                      ? "font-medium text-amber-600"
                      : s.owedTo > 0
                        ? "font-medium text-emerald-600"
                        : "text-slate-400"
                  }`}
                >
                  {owes
                    ? `owes ${formatMoney(s.owes)}`
                    : s.owedTo > 0
                      ? `is owed ${formatMoney(s.owedTo)}`
                      : "all settled"}
                </p>
              </div>
              {s.pendingCount > 0 && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                  {s.pendingCount}
                </span>
              )}
              {isAdmin && !isMe && (
                <button
                  onClick={() => remove(m)}
                  disabled={busyId === m.id}
                  title={`Remove ${m.name}`}
                  className="btn-ghost px-2 py-1 text-xs text-slate-400 transition hover:text-red-600"
                >
                  {busyId === m.id ? "…" : "Remove"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
