"use client";

import { useEffect, useState } from "react";
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
import { SettingsModal } from "@/components/SettingsModal";

const POLL_INTERVAL_MS = 5000;

/** Main signed-in screen. Server-rendered data is passed in and kept in sync
 *  with `router.refresh()` after mutations and on a live polling loop, so any
 *  change by another member (expense added/deleted/settled, wallet updates)
 *  shows up automatically without a manual refresh. */
export function Dashboard({ user, room, members, expenses }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Live updates: poll the server-rendered data while the tab is visible.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      router.refresh();
    };
    const id = setInterval(tick, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [router]);

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
      router.refresh();
    } catch (err) {
      showToast("error", err.message);
    }
  }

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
          <Link href="/dashboard" aria-label="Acorn dashboard">
            <Logo size={26} />
          </Link>
          <div className="flex items-center gap-3">
            {room && (
              <span className="hidden rounded-full bg-acorn-100 px-3 py-1 font-mono text-xs font-semibold text-acorn-700 sm:inline">
                {room.code}
              </span>
            )}
            <Avatar name={user.name} image={user.image} size={32} />
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-ghost px-2.5 py-2"
              title="Account settings"
            >
              <GearIcon />
            </button>
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
            {room && (
              <button
                onClick={leaveRoom}
                className="btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600"
                title="Leave this room"
              >
                <DoorIcon /> Leave room
              </button>
            )}
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
                  ownerId={room.ownerId}
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

      {settingsOpen && (
        <SettingsModal
          user={user}
          onClose={() => setSettingsOpen(false)}
          onToast={showToast}
        />
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div
            className={`max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
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
