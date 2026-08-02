"use client";

import { useState, useRef, useEffect } from "react";
import { formatMoney } from "@/lib/money";

/**
 * Personal wallet balance card with inline editing.
 * Shows current balance with a clean edit/save flow.
 */
export function WalletCard({ user, onToast }) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const balance = user.balance ?? 0;

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  function startEditing() {
    // Pre-fill with current balance (without "Rs." prefix, just the number)
    setInputValue(balance.toString());
    setEditing(true);
    setError("");
  }

  function cancelEditing() {
    setEditing(false);
    setInputValue("");
    setError("");
  }

  async function save(e) {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Enter an amount.");
      return;
    }

    const num = parseFloat(trimmed);
    if (!Number.isFinite(num) || num < 0) {
      setError("Enter a valid positive number.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: num }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setEditing(false);
      setInputValue("");
      onToast?.("success", "Wallet balance updated!");
      // Refresh to pick up new server-side data
      window.location.reload();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card card-hover">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <p className="text-sm font-medium text-slate-500">My Wallet</p>
          </div>

          {editing ? (
            <form onSubmit={save} className="mt-2 flex items-center gap-2">
              <span className="text-lg font-semibold text-slate-600">Rs.</span>
              <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                className="input w-40 text-2xl font-bold"
                placeholder="0.00"
                value={inputValue}
                onChange={(e) => {
                  // Allow only numbers and one decimal point
                  const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                  setInputValue(v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancelEditing();
                }}
                disabled={busy}
              />
              <div className="flex gap-1.5">
                <button type="submit" disabled={busy} className="btn-primary px-3 py-2 text-sm">
                  {busy ? (
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    "Save"
                  )}
                </button>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={busy}
                  className="btn-ghost px-3 py-2 text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-1 flex items-baseline gap-3">
              <p className="text-3xl font-bold text-slate-900">
                {formatMoney(balance)}
              </p>
              <button
                onClick={startEditing}
                className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 active:scale-95"
              >
                Edit balance
              </button>
            </div>
          )}

          <p className="mt-1 text-xs text-slate-400">
            Your current cash/bank balance. Expenses deduct from this automatically.
          </p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
      )}
    </section>
  );
}
