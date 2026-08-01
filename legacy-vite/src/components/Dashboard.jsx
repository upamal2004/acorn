import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRoom } from "../hooks/useRoom.js";
import Header from "./Header.jsx";
import WalletCard from "./WalletCard.jsx";
import RoomSummary from "./RoomSummary.jsx";
import MembersCard from "./MembersCard.jsx";
import ExpenseList from "./ExpenseList.jsx";
import ExpenseModal from "./ExpenseModal.jsx";

/** The main authenticated view once the user belongs to a room. */
export default function Dashboard() {
  const { profile } = useAuth();
  const { room, members, expenses, loading } = useRoom(profile?.roomId);
  const [showExpenseModal, setShowExpenseModal] = useState(false);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="animate-spin text-peach-500" />
        <p className="text-sm text-slate-400">Loading your room…</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="font-semibold text-slate-700">This room no longer exists.</p>
        <p className="text-sm text-slate-500">
          Ask the owner to re-invite you or create a new one.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header room={room} />

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-6 lg:grid-cols-3">
        {/* Left column — wallet, summary, members */}
        <div className="space-y-6">
          <WalletCard />
          <RoomSummary expenses={expenses} currentUid={profile.id} />
          <MembersCard
            members={members}
            expenses={expenses}
            currentUid={profile.id}
            room={room}
          />
        </div>

        {/* Right column — transactions */}
        <section className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Transactions</h2>
            <button
              onClick={() => setShowExpenseModal(true)}
              className="btn-primary"
            >
              <Plus size={16} /> Add Expense
            </button>
          </div>

          <ExpenseList
            expenses={expenses}
            members={members}
            currentUid={profile.id}
          />
        </section>
      </main>

      {showExpenseModal && (
        <ExpenseModal
          roomId={room.id}
          members={members}
          onClose={() => setShowExpenseModal(false)}
        />
      )}
    </div>
  );
}
