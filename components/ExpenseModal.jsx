"use client";

import { useState, useMemo, useCallback } from "react";
import { Avatar } from "@/components/Avatar";
import { MoneyEmotion } from "@/components/MoneyEmotion";
import { EXPENSE_CATEGORIES } from "@/lib/categories";
import { formatMoney } from "@/lib/money";
import { personalAmount } from "@/lib/history";

export function ExpenseModal({ roomId, members, currentUserId, onClose, onSaved, user, expenses }) {
  const isPersonal = !roomId;
  const me = members.find((m) => m.id === currentUserId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("OTHERS");
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(() =>
    isPersonal
      ? new Set([currentUserId])
      : new Set(members.map((m) => m.id))
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [fading, setFading] = useState(false);

  // Compute today's spending per category for limit warnings
  const todaySpending = useMemo(() => {
    if (!expenses || !user?.categoryLimits) return {};
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const spending = {};
    for (const exp of expenses) {
      const d = new Date(exp.createdAt);
      const expKey = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (expKey !== todayKey) continue;
      const amt = personalAmount(exp, currentUserId);
      spending[exp.category] = (spending[exp.category] || 0) + amt;
    }
    return spending;
  }, [expenses, user, currentUserId]);

  // Check if selected category + amount exceeds limit
  const limitWarning = useMemo(() => {
    if (!user?.categoryLimits || !category || !amount) return null;
    const limit = user.categoryLimits[category];
    if (limit == null) return null;
    const spent = todaySpending[category] || 0;
    const newAmt = parseFloat(amount) || 0;
    const total = spent + newAmt;
    if (total > limit) {
      return { category, spent, limit, total, exceeded: spent >= limit };
    }
    return null;
  }, [user, category, amount, todaySpending]);

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

    const body = isPersonal
      ? { title, description, category, amount, paidBy: currentUserId, splitBetween: [currentUserId] }
      : { roomId, title, description, category, amount, paidBy: currentUserId, splitBetween: [...selected] };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add expense.");
      setSuccess(true);
      // Show animation for 2.5s, then fade out
      setTimeout(() => setFading(true), 2000);
      setTimeout(() => onSaved(), 2500);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-6 sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Success overlay with spending emotion */}
        {success && (
          <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md transition-opacity duration-500 sm:rounded-2xl ${
            fading ? "bg-white/60 opacity-0" : "bg-white/90 opacity-100"
          }`}>
            <div className={fading ? "scale-95 opacity-0 transition-all duration-500" : "scale-100 opacity-100 transition-all duration-300"}>
              <MoneyEmotion type="spent" amount={parseFloat(amount) || 0} fire={true} />
            </div>
          </div>
        )}

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Add expense</h2>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">✕</button>
        </div>

        {/* Category limit warning */}
        {limitWarning && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${limitWarning.exceeded ? "bg-amber-50 text-amber-800" : "bg-amber-50/60 text-amber-700"}`}>
            <p className="font-semibold">
              {limitWarning.exceeded ? "Warning: Category limit exceeded!" : "Warning: Approaching category limit"}
            </p>
            <p className="mt-0.5 text-xs">
              {EXPENSE_CATEGORIES.find(c => c.value === limitWarning.category)?.label} limit: {formatMoney(limitWarning.limit)} &middot; Already spent today: {formatMoney(limitWarning.spent)} &middot; After this expense: {formatMoney(limitWarning.total)}
            </p>
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">What was it?</label>
            <input className="input" placeholder="e.g. Rent for August" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.emoji} {c.label}</option>
                ))}
              </select>
              {user?.categoryLimits?.[category] != null && (
                <p className="mt-1 text-xs text-slate-400">Limit: {formatMoney(user.categoryLimits[category])}/day</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Notes <span className="font-normal text-slate-400">(optional)</span></label>
              <input className="input" placeholder="e.g. Split with Sam" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div className={`grid gap-3 ${isPersonal ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"}`}>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Total amount</label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">Rs.</span>
                <input className="input pl-7" type="number" inputMode="decimal" step="0.01" min="0" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required />
              </div>
            </div>
            {!isPersonal && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Paid by</label>
                <div className="input flex items-center gap-2">
                  <Avatar name={me?.name || "You"} image={me?.image} size={22} />
                  <span className="min-w-0 truncate text-sm text-slate-700">{me?.name || "You"}</span>
                  <span className="ml-auto rounded-full bg-acorn-100 px-2 py-0.5 text-xs font-semibold text-acorn-700">You</span>
                </div>
              </div>
            )}
          </div>

          {!isPersonal && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Split between ({selected.size})</label>
              <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl border border-slate-200 p-2">
                {members.map((m) => (
                  <label key={m.id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition ${selected.has(m.id) ? "bg-acorn-50" : "hover:bg-slate-50"}`}>
                    <input type="checkbox" className="h-4 w-4 accent-acorn-500" checked={selected.has(m.id)} onChange={() => toggle(m.id)} />
                    <Avatar name={m.name} image={m.image} size={26} />
                    <span className="min-w-0 flex-1 truncate text-sm text-slate-700">{m.name}</span>
                    {m.id === currentUserId && <span className="ml-auto flex-none text-xs font-medium text-slate-400">you</span>}
                  </label>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-slate-400">If you&apos;re not included, the full amount is split between the selected members and you&apos;re owed the total.</p>
            </div>
          )}

          {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

          <button type="submit" disabled={busy || (!isPersonal && selected.size === 0)} className="btn-primary w-full py-3">
            {busy ? "Adding\u2026" : isPersonal ? "Add expense" : selected.size > 1 ? `Add expense - splits ${selected.size} ways` : "Add expense"}
          </button>
        </form>
      </div>
    </div>
  );
}
