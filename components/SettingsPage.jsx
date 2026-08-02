"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PasswordInput } from "./PasswordInput";
import { formatMoney } from "@/lib/money";

/** Dedicated /settings page - daily spending limit, password change, and profile. */
export function SettingsPage({ user }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  // Password state
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

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  function validate() {
    if (!current) return "Please enter your current password.";
    if (next.length < 8) return "New password must be at least 8 characters.";
    if (next === current) return "New password must be different from the current one.";
    if (confirm !== next) return "New passwords don't match.";
    return null;
  }

  async function submitPassword(e) {
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
        showToast("error", data.error || "Could not update your password.");
        setBusy(false);
        return;
      }
      showToast("success", "Password updated successfully.");
      setCurrent("");
      setNext("");
      setConfirm("");
    } catch (err) {
      setError(err.message);
      showToast("error", err.message);
    } finally {
      setBusy(false);
    }
  }

  async function saveLimit() {
    const val = limitInput.trim();
    const dailyLimit = val === "" ? null : parseFloat(val);

    if (dailyLimit !== null && (Number.isNaN(dailyLimit) || dailyLimit < 0)) {
      showToast("error", "Please enter a valid amount.");
      return;
    }
    if (dailyLimit !== null && dailyLimit > 100000) {
      showToast("error", "Daily limit cannot exceed Rs. 100,000.00.");
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
      showToast(
        "success",
        dailyLimit != null
          ? `Daily limit set to ${formatMoney(dailyLimit)}.`
          : "Daily limit removed."
      );
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setLimitBusy(false);
    }
  }

  async function handleSignOut() {
    await signOut({ callbackUrl: "/login" });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </Link>
          <button
            onClick={handleSignOut}
            className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Page content */}
      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your account preferences and spending limits.
          </p>
        </div>

        {/* Profile section */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Profile
          </h2>
          <div className="card">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-acorn-100 text-xl font-bold text-acorn-700">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-semibold text-slate-900">{user.name}</p>
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Spending Limit */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Daily Spending Limit
          </h2>
          <div className="card">
            <p className="mb-4 text-sm text-slate-600">
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
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-acorn-500 focus:outline-none focus:ring-1 focus:ring-acorn-500"
              />
              <button
                onClick={saveLimit}
                disabled={limitBusy}
                className="rounded-lg bg-acorn-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-acorn-700 disabled:opacity-50"
              >
                {limitBusy ? "Saving..." : "Save"}
              </button>
            </div>
            {user.dailyLimit != null && (
              <p className="mt-3 text-xs text-slate-400">
                Current limit: {formatMoney(user.dailyLimit)} per day
              </p>
            )}
          </div>
        </section>

        {/* Change Password */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Account Security
          </h2>
          <div className="card">
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Current password
                </label>
                <PasswordInput
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  value={current}
                  onChange={(e) => setCurrent(e.target.value)}
                  required
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
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div
            className={`w-full max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
