"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { formatMoney } from "@/lib/money";
import { StoryAnimation } from "@/components/StoryAnimation";

/**
 * Personal wallet balance card with Add Money and Edit Balance options.
 */
export function WalletCard({ user, onToast }) {
  const [mode, setMode] = useState(null); // null | "add" | "edit"
  const [inputValue, setInputValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [savedAmount, setSavedAmount] = useState(0);
  const inputRef = useRef(null);

  const balance = user.balance ?? 0;

  const handleAnimationComplete = useCallback(() => {
    setShowAnimation(false);
    onToast?.("success", "Money added!");
    window.location.reload();
  }, [onToast]);

  useEffect(() => {
    if (mode && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [mode]);

  function startAdd() {
    setMode("add");
    setInputValue("");
    setError("");
  }

  function startEdit() {
    setMode("edit");
    setInputValue(balance.toString());
    setError("");
  }

  function cancel() {
    setMode(null);
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
    if (!Number.isFinite(num) || num <= 0) {
      setError("Enter a valid positive number.");
      return;
    }

    setBusy(true);
    setError("");
    try {
      const body = mode === "add"
        ? { amount: num, mode: "add" }
        : { amount: num, mode: "set" };

      const res = await fetch("/api/wallet", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      setMode(null);
      setInputValue("");
      setSavedAmount(num);
      if (mode === "add") setShowAnimation(true);
      else { onToast?.("success", "Balance updated!"); window.location.reload(); }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const isAdd = mode === "add";

  return (
    <>
      <StoryAnimation
        type="wallet"
        amount={savedAmount}
        show={showAnimation}
        onComplete={handleAnimationComplete}
      />

      <section className="card card-hover">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <p className="text-sm font-medium text-slate-500">My Wallet</p>
            </div>

            {mode ? (
              <form onSubmit={save} className="mt-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-slate-600">Rs.</span>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="decimal"
                    className="input w-40 text-2xl font-bold"
                    placeholder={isAdd ? "0.00" : balance.toString()}
                    value={inputValue}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                      setInputValue(v);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") cancel();
                    }}
                    disabled={busy}
                  />
                  <div className="flex gap-1.5">
                    <button type="submit" disabled={busy} className="btn-primary px-3 py-2 text-sm">
                      {busy ? (
                        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        isAdd ? "Add" : "Save"
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={cancel}
                      disabled={busy}
                      className="btn-ghost px-3 py-2 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  {isAdd
                    ? `Adding to current balance of ${formatMoney(balance)}`
                    : "Set your total wallet balance"}
                </p>
              </form>
            ) : (
              <div className="mt-1">
                <p className="text-3xl font-bold text-slate-900">
                  {formatMoney(balance)}
                </p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={startAdd}
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 active:scale-95"
                  >
                    <span>+</span> Add Money
                  </button>
                  <button
                    onClick={startEdit}
                    className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-200 active:scale-95"
                  >
                    Edit balance
                  </button>
                </div>
              </div>
            )}

            <p className="mt-2 text-xs text-slate-400">
              Your current cash/bank balance. Expenses deduct from this automatically.
            </p>
          </div>
        </div>

        {error && (
          <p className="mt-2 text-sm font-medium text-red-600">{error}</p>
        )}
      </section>
    </>
  );
}
