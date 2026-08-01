"use client";

import { useState } from "react";
import { Avatar } from "@/components/Avatar";

/** Modal form for adding an expense: title, amount, payer, split members. */
export function ExpenseModal({ roomId, members, currentUserId, onClose, onSaved }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(currentUserId);
  const [selected, setSelected] = useState(() => new Set(members.map((m) => m.id)));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const body = {
      roomId,
      title,
      amount,
      paidBy,
      splitBetween: [...selected],
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add expense.");
      onSaved();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add expense</h2>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              What was it?
            </label>
            <input
              className="input"
              placeholder="e.g. Rent for August"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Total amount
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  $
                </span>
                <input
                  className="input pl-7"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
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
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Split between ({selected.size})
            </label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {members.map((m) => (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition ${
                    selected.has(m.id) ? "bg-peach-50" : "hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-peach-500"
                    checked={selected.has(m.id)}
                    onChange={() => toggle(m.id)}
                  />
                  <Avatar name={m.name} image={m.image} size={26} />
                  <span className="text-sm text-slate-700">{m.name}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy || !selected.size}
            className="btn-primary w-full py-3"
          >
            {busy
              ? "Adding…"
              : selected.size
                ? `Add expense${selected.size > 1 ? ` — splits ${selected.size} ways` : ""}`
                : "Pick someone to split with"}
          </button>
        </form>
      </div>
    </div>
  );
}
