"use client";

import { useState } from "react";
import { PasswordInput } from "./PasswordInput";

/** Account settings modal — lets a signed-in (credentials) user change their
 *  password safely. Current password is verified server-side; new password is
 *  validated client-side (min 8 chars, must match confirm) and server-side.
 *  Results are reported through the `onToast` callback. */
export function SettingsModal({ user, onClose, onToast }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
          <h2 className="text-lg font-bold text-slate-900">Account settings</h2>
          <button onClick={onClose} className="btn-ghost px-2 py-1 text-lg leading-none">
            ✕
          </button>
        </div>

        <p className="mb-5 break-words rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Signed in as <span className="font-semibold break-all text-slate-800">{user.email}</span>
        </p>

        <form onSubmit={submit} className="space-y-4">
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
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
