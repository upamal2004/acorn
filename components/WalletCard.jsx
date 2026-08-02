"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/money";

/** The user's personal cash balance — editable in place. */
export function WalletCard({ user }) {
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: value }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setEditing(false);
      setValue("");
      window.location.reload(); // simplest way to refresh server-side user data
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card card-hover flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">My wallet</p>
        <p className="mt-0.5 text-3xl font-bold text-slate-900">
          {formatMoney(user.balance ?? 0)}
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Your current cash balance, tracked separately from the room.
        </p>
      </div>

      {editing ? (
        <form onSubmit={save} className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-slate-700">Rs.</span>
          <input
            className="input w-36"
            autoFocus
            inputMode="decimal"
            placeholder="0.00"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={busy}
          />
          <button type="submit" disabled={busy} className="btn-primary px-3 py-2">
            {busy ? "…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="btn-ghost px-3 py-2"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setEditing(true)} className="btn-secondary">
          Update
        </button>
      )}

      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </section>
  );
}
