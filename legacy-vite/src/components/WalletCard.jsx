import { useEffect, useState } from "react";
import { Pencil, PiggyBank, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { updatePersonalBalance } from "../lib/rooms.js";
import { formatMoney } from "../lib/money.js";

/** Personal wallet balance card with an inline edit modal. */
export default function WalletCard() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="card relative overflow-hidden">
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-peach-100" />
        <div className="absolute -right-1 top-3 h-12 w-12 rounded-full bg-peach-200/70" />

        <div className="relative flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Personal Wallet</p>
            <p className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
              {formatMoney(profile?.personalBalance ?? 0)}
            </p>
          </div>
          <div className="rounded-xl bg-peach-100 p-2.5 text-peach-600">
            <PiggyBank size={20} />
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="btn-secondary relative mt-5 w-full !py-2 text-sm"
        >
          <Pencil size={14} /> Update balance
        </button>
      </div>

      {open && <WalletModal onClose={() => setOpen(false)} />}
    </>
  );
}

/** Modal to edit the current physical cash / bank balance. */
function WalletModal({ onClose }) {
  const { user } = useAuth();
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSave(e) {
    e.preventDefault();
    const amount = Number(value);
    if (!Number.isFinite(amount) || amount < 0) {
      setError("Enter a valid amount (0 or more).");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updatePersonalBalance(user.uid, Math.round(amount * 100) / 100);
      onClose();
    } catch (err) {
      setError(err.message || "Could not save your balance.");
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Update Wallet</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost !rounded-full !p-1.5"
          >
            <X size={18} />
          </button>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Set your current physical cash or bank balance.
        </p>

        <div className="mt-5 flex items-center rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 focus-within:border-peach-400 focus-within:ring-4 focus-within:ring-peach-100">
          <span className="text-lg font-semibold text-slate-400">$</span>
          <input
            autoFocus
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="ml-1 w-full bg-transparent text-lg font-semibold text-slate-900 outline-none placeholder:text-slate-300"
          />
        </div>

        {error && <p className="mt-2 text-xs font-medium text-red-500">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary mt-5 w-full">
          {saving ? "Saving…" : "Save balance"}
        </button>
      </form>
    </div>
  );
}
