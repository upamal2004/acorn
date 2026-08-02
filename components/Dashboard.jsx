"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { WalletCard } from "@/components/WalletCard";
import { RoomSummary } from "@/components/RoomSummary";
import { MembersCard } from "@/components/MembersCard";
import { ExpenseList } from "@/components/ExpenseList";
import { ExpenseModal } from "@/components/ExpenseModal";
import { computeSummary, isExpenseActive } from "@/lib/summary";

const POLL_INTERVAL_MS = 5000;

/** Main signed-in screen. Server-rendered data seeds the client state, then
 *  everything is kept in sync with silent AJAX fetches of /api/dashboard — on
 *  a visibility-aware polling loop and after every mutation — so changes by
 *  another member show up without reloading the page. */
export function Dashboard({
  user: initialUser,
  room: initialRoom,
  members: initialMembers,
  expenses: initialExpenses,
}) {
  const router = useRouter();
  const [data, setData] = useState({
    user: initialUser,
    room: initialRoom,
    members: initialMembers,
    expenses: initialExpenses,
  });
  const { user, room, members, expenses } = data;
  const [modalOpen, setModalOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const inflight = useRef(false);

  // Main "Expenses" feed = only active (unsettled) expenses: anything still
  // owed or awaiting verification. Fully settled transactions automatically
  // drop out of this view and live on the History page. In personal (solo)
  // mode there are no debts to hide, so everything stays visible.
  const activeExpenses = useMemo(
    () => (room ? expenses.filter(isExpenseActive) : expenses),
    [expenses, room]
  );
  const allSettled = room && expenses.length > 0 && activeExpenses.length === 0;

  /** Pull the freshest data from the database without touching the DOM. */
  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) {
        router.push("/login");
        return;
      }
      if (!res.ok) return;
      const payload = await res.json();
      setData({
        user: payload.user,
        room: payload.room,
        members: payload.members,
        expenses: payload.expenses,
      });
    } catch {
      // Transient network error — keep showing the last known data.
    } finally {
      inflight.current = false;
    }
  }, [router]);

  // Live updates: silently re-fetch while the tab is visible, and once more
  // when it becomes visible again after being hidden.
  useEffect(() => {
    const id = setInterval(() => {
      if (document.visibilityState === "hidden") return;
      refresh();
    }, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  // Auto-dismiss toasts.
  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(id);
  }, [toast]);

  function showToast(type, message) {
    setToast({ type, message });
  }

  async function leaveRoom() {
    // You can't walk away while you still owe the room money — settle first.
    const { iOwe, net } = computeSummary(expenses, user.id);
    if (iOwe > 0 || net < 0) {
      showToast(
        "error",
        "You cannot leave the room with outstanding debts. Please settle all your pending balances first."
      );
      return;
    }

    if (
      !window.confirm(
        "Leave this room? You'll go back to personal mode and can join or create another room anytime."
      )
    )
      return;
    try {
      const res = await fetch("/api/rooms/leave", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not leave the room.");
      showToast("success", "You left the room.");
      refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader
        user={user}
        room={room}
        active="dashboard"
        onToast={showToast}
      />
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="break-words text-2xl font-bold text-slate-900">
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
          <div className="flex flex-wrap gap-2">
            {room && (
              <button
                onClick={leaveRoom}
                className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600"
                title="Leave this room"
              >
                <DoorIcon /> Leave room
              </button>
            )}
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              <PlusIcon /> Add expense
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <WalletCard user={user} />
            <ExpenseList
              expenses={activeExpenses}
              members={members}
              currentUserId={user.id}
              onChanged={refresh}
              emptyNote={
                allSettled
                  ? "Every expense is settled. Past transactions have moved to the History page."
                  : undefined
              }
            />
          </div>

          <div className="min-w-0 space-y-6">
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
                  ownerId={room.ownerId}
                  expenses={expenses}
                  onChanged={refresh}
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
            refresh();
          }}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div
            className={`w-full max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
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

function DoorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M13 4v3a1 1 0 0 0 1 1h3M13 8h3M4 4h8l6 6v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
