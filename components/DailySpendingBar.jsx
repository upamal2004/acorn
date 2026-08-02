"use client";

import { useMemo, useState } from "react";
import { formatMoney } from "@/lib/money";
import { inRange } from "@/lib/analytics";
import { personalAmount } from "@/lib/history";

/**
 * Daily spending progress bar with warning/alert banners.
 * Shows "Today's Spent: Rs. X / Daily Limit: Rs. Y" with color changes
 * based on percentage (green → yellow → red).
 */
export function DailySpendingBar({ user, expenses, onToast }) {
  const [editing, setEditing] = useState(false);
  const [limitInput, setLimitInput] = useState("");
  const [saving, setSaving] = useState(false);

  const dailyLimit = user.dailyLimit; // dollars or null

  const todaySpent = useMemo(() => {
    let total = 0;
    for (const exp of expenses) {
      if (inRange(exp, "daily")) {
        total += personalAmount(exp, user.id);
      }
    }
    return Math.round(total * 100) / 100;
  }, [expenses, user.id]);

  const pct = dailyLimit ? Math.min((todaySpent / dailyLimit) * 100, 100) : 0;
  const overLimit = dailyLimit && todaySpent > dailyLimit;
  const nearLimit = dailyLimit && pct >= 80 && !overLimit;

  // Color: green < 80%, yellow 80-99%, red ≥ 100%
  const barColor = overLimit
    ? "bg-red-500"
    : nearLimit
    ? "bg-amber-400"
    : "bg-emerald-500";

  const textColor = overLimit
    ? "text-red-700"
    : nearLimit
    ? "text-amber-700"
    : "text-emerald-700";

  const bgColor = overLimit
    ? "bg-red-50 border-red-200"
    : nearLimit
    ? "bg-amber-50 border-amber-200"
    : "bg-slate-50 border-slate-200";

  if (!dailyLimit) return null;

  async function saveLimit() {
    const val = limitInput.trim();
    if (!val) {
      // Remove limit
      setSaving(true);
      try {
        const res = await fetch("/api/account/daily-limit", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dailyLimit: null }),
        });
        if (!res.ok) throw new Error("Failed to remove limit");
        onToast?.("success", "Daily limit removed.");
        setEditing(false);
        // Force page reload to pick up new user data
        window.location.reload();
      } catch (err) {
        onToast?.("error", err.message);
      } finally {
        setSaving(false);
      }
      return;
    }

    const num = parseFloat(val);
    if (Number.isNaN(num) || num <= 0) {
      onToast?.("error", "Please enter a valid amount.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/daily-limit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyLimit: num }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Failed to save limit");
      onToast?.("success", `Daily limit set to ${formatMoney(num)}.`);
      setEditing(false);
      window.location.reload();
    } catch (err) {
      onToast?.("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Daily Spending</h3>
        <button
          onClick={() => {
            setEditing(!editing);
            setLimitInput(dailyLimit ? String(dailyLimit) : "");
          }}
          className="text-xs text-slate-500 underline decoration-dotted hover:text-slate-700"
        >
          {editing ? "Cancel" : "Edit limit"}
        </button>
      </div>

      {/* Alert banners */}
      {overLimit && (
        <div className="mb-3 rounded-lg bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
          Alert: You have exceeded your daily limit for today!
        </div>
      )}
      {nearLimit && (
        <div className="mb-3 rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700">
          Warning: You have reached {Math.round(pct)}% of your daily spending
          limit!
        </div>
      )}

      {/* Progress bar */}
      <div className="mb-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-semibold ${textColor}`}>
          Today: {formatMoney(todaySpent)}
        </span>
        <span className="text-slate-500">
          Limit: {formatMoney(dailyLimit)}
        </span>
      </div>

      {/* Inline editor */}
      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-slate-600">Rs.</span>
          <input
            type="number"
            min="0"
            step="0.01"
            value={limitInput}
            onChange={(e) => setLimitInput(e.target.value)}
            placeholder="Enter daily limit"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm focus:border-acorn-500 focus:outline-none focus:ring-1 focus:ring-acorn-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") saveLimit();
              if (e.key === "Escape") setEditing(false);
            }}
          />
          <button
            onClick={saveLimit}
            disabled={saving}
            className="rounded-lg bg-acorn-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-acorn-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      )}
    </div>
  );
}
