import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { addExpense } from "../lib/rooms.js";
import { formatMoney } from "../lib/money.js";
import Avatar from "./Avatar.jsx";

/**
 * Modal for adding an expense: title, total, who paid, and who it's split
 * between. The total is divided equally among the selected members.
 */
export default function ExpenseModal({ roomId, members, onClose }) {
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(user.uid);
  const [splitWith, setSplitWith] = useState(members.map((m) => m.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleMember(uid) {
    setSplitWith((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  }

  const perPerson = splitWith.length && Number(amount) > 0
    ? Number(amount) / splitWith.length
    : 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await addExpense({
        roomId,
        title,
        amount,
        paidBy,
        splitBetween: splitWith,
      });
      onClose();
    } catch (err) {
      setError(err.message || "Could not add the expense.");
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
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-soft"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900">Add Expense</h3>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost !rounded-full !p-1.5"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Title
            </label>
            <input
              className="input"
              placeholder="Groceries, rent, Netflix…"
              value={title}
              maxLength={60}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Total amount
            </label>
            <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 focus-within:border-peach-400 focus-within:ring-4 focus-within:ring-peach-100">
              <span className="text-sm font-semibold text-slate-400">$</span>
              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="ml-1 w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-300"
                required
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-600">
              Paid by
            </label>
            <select
              className="input"
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                  {m.id === user.uid ? " (you)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              Split between
            </span>
            <div className="space-y-2">
              {members.map((m) => {
                const checked = splitWith.includes(m.id);
                return (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                      checked
                        ? "border-peach-300 bg-peach-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleMember(m.id)}
                      className="h-4 w-4 accent-peach-500"
                    />
                    <Avatar member={m} size={26} />
                    <span className="flex-1 text-sm font-medium text-slate-700">
                      {m.name}
                      {m.id === user.uid ? " (you)" : ""}
                    </span>
                    {checked && (
                      <span className="text-xs font-bold text-peach-600">
                        {formatMoney(perPerson)}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          <div className="mb-3 flex items-center justify-between text-sm">
            <span className="text-slate-500">Each person pays</span>
            <span className="font-bold text-slate-900">
              {formatMoney(perPerson)}
            </span>
          </div>
          <button type="submit" disabled={saving} className="btn-primary w-full">
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Plus size={16} />
            )}
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}
