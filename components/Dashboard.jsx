"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { WalletCard } from "@/components/WalletCard";
import { RoomSummary } from "@/components/RoomSummary";
import { MembersCard } from "@/components/MembersCard";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseModal } from "@/components/ExpenseModal";
import { ExpenseHistory } from "@/components/ExpenseHistory";

/** Main signed-in screen. Server-rendered data is passed in and kept in sync
 *  with `router.refresh()` after mutations. */
export function Dashboard({ user, room, members, expenses }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  async function signOut() {
    await fetch("/api/auth/signout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3.5">
          <Logo size={26} />
          <div className="flex items-center gap-3">
            {room && (
              <span className="hidden rounded-full bg-acorn-100 px-3 py-1 font-mono text-xs font-semibold text-acorn-700 sm:inline">
                {room.code}
              </span>
            )}
            <Avatar name={user.name} image={user.image} size={32} />
            <button
              onClick={signOut}
              className="btn-ghost px-3 py-1.5 text-xs"
              title="Sign out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {room?.name ?? "Your personal space"}
            </h1>
            {room ? (
              <p className="mt-1 text-sm text-slate-500">
                Invite flatmates with code{" "}
                <span className="font-mono font-semibold text-acorn-600">
                  {room.code}
                </span>
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">
                Tracking your own spending. Create or join a room to split
                expenses with flatmates.
              </p>
            )}
          </div>
          <div className="flex gap-2">
            {expenses.length > 0 && (
              <button
                onClick={() => setHistoryOpen(true)}
                className="btn-secondary"
              >
                <CalendarIcon /> History
              </button>
            )}
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              <PlusIcon /> Add expense
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <WalletCard user={user} />
            <ExpenseList
              expenses={expenses}
              members={members}
              currentUserId={user.id}
            />
          </div>

          <div className="space-y-6">
            {room ? (
              <>
                <RoomSummary
                  expenses={expenses}
                  members={members}
                  currentUserId={user.id}
                />
                <MembersCard
                  members={members}
                  currentUserId={user.id}
                  expenses={expenses}
                />
              </>
            ) : (
              <div className="card">
                <h2 className="text-lg font-semibold text-slate-900">
                  Ready to split?
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  You're in personal mode — every expense is just yours. Create
                  a room or join a friend's with its code to split costs as a
                  group.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link href="/onboarding" className="btn-primary">
                    Create a room
                  </Link>
                  <Link href="/onboarding" className="btn-secondary">
                    Join a room
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {modalOpen && (
        <ExpenseModal
          roomId={room?.id ?? null}
          members={members}
          currentUserId={user.id}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false);
            router.refresh();
          }}
        />
      )}

      {historyOpen && (
        <ExpenseHistory
          expenses={expenses}
          members={members}
          onClose={() => setHistoryOpen(false)}
        />
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
