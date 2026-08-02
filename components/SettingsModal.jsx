"use client";

import { useState } from "react";
import { PasswordInput } from "./PasswordInput";
import { formatMoney } from "@/lib/money";

/** Account settings modal - lets a signed-in (credentials) user change their
 *  password safely and set their daily spending limit. */
export function SettingsModal({ user, onClose, onToast }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Daily limit state
  const [limitInput, setLimitInput] = useState(
    user.dailyLimit != null ? String(user.dailyLimit) : ""
  );
  const [limitBusy, setLimitBusy] = useState(false);

  function validate() {
    if (!current) return "Please enter your current password.";
    if (next.length < 8) return "New password must be at least 8 characters.";
    if (next === current) return "New password must be different from the current one.";
    if (confirm !== next) return "New passwords don't match.";
    return null;
  }

  async function submit(e) {
    e.preventDefault();
    const clientError = validate();
    if (clientError) {
      setError(clientError);
      return;
    }
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not update your password.");
        onToast("error", data.error || "Could not update your password.");
        setBusy(false);
        return;
      }
      onToast("success", "Password updated successfully.");
      onClose();
    } catch (err) {
      setError(err.message);
      onToast("error", err.message);
      setBusy(false);
    }
  }

  async function saveLimit() {
    const val = limitInput.trim();
    const dailyLimit = val === "" ? null : parseFloat(val);

    if (dailyLimit !== null && (Number.isNaN(dailyLimit) || dailyLimit < 0)) {
      onToast("error", "Please enter a valid amount.");
      return;
    }
    if (dailyLimit !== null && dailyLimit > 100000) {
      onToast("error", "Daily limit cannot exceed Rs. 100,000.00.");
      return;
    }

    setLimitBusy(true);
    try {
      const res = await fetch("/api/account/daily-limit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyLimit }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update limit");
      onToast(
        "success",
        dailyLimit != null
          ? `Daily limit set to ${formatMoney(dailyLimit)}.`
          : "Daily limit removed."
      );
      onClose();
    } catch (err) {
      onToast("error", err.message);
    } finally {
      setLimitBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="flex max-h-[min(90vh,calc(100vh-2rem))] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky header - never clipped */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Account settings</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <p className="mb-5 break-words rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            Signed in as <span className="font-semibold break-all text-slate-800">{user.email}</span>
          </p>

          {/* Daily Spending Limit */}
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Daily Spending Limit</h3>
            <p className="mb-3 text-xs text-slate-500">
              Set a daily spending limit to track your personal expenses. You&apos;ll see a
              progress bar on your dashboard and get warnings when you approach or exceed
              the limit.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rs.</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={limitInput}
                onChange={(e) => setLimitInput(e.target.value)}
                placeholder="e.g. 1000.00"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-acorn-500 focus:outline-none focus:ring-1 focus:ring-acorn-500"
              />
              <button
                onClick={saveLimit}
                disabled={limitBusy}
                className="rounded-lg bg-acorn-600 px-4 py-2 text-sm font-medium text-white hover:bg-acorn-700 disabled:opacity-50"
              >
                {limitBusy ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Password Change */}
          <form onSubmit={submit} className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">Change Password</h3>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Current password
              </label>
              <PasswordInput
                autoComplete="current-password"
                placeholder="••••••••"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                New password
              </label>
              <PasswordInput
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Confirm new password
              </label>
              <PasswordInput
                autoComplete="new-password"
                placeholder="Repeat the new password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button type="submit" disabled={busy} className="btn-primary w-full py-3">
              {busy ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
