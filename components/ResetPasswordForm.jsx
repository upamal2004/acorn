"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PasswordInput } from "./PasswordInput";

/** New-password form for the emailed reset link. Submits the token (from the
 *  URL) with the new password; invalid/expired links are reported by the API. */
export function ResetPasswordForm({ token }) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function validate() {
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirm) return "Passwords don't match.";
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
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not reset your password.");
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-semibold">Password updated.</p>
          <p className="mt-1">
            You can now sign in with your new password.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="btn-primary w-full py-3"
        >
          Sign in
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          New password
        </label>
        <PasswordInput
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          autoFocus
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
        {busy ? "Resetting…" : "Set new password"}
      </button>
    </form>
  );
}
