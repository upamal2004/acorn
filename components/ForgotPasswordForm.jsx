"use client";

import { useState } from "react";

/** Email-only form for /forgot-password. Always shows the same success message
 *  (whether or not the account exists) so signups can't be enumerated. In dev
 *  mode (RESET_DEV_LINKS=true on the server) the reset link is also surfaced so
 *  the flow can be tested end-to-end without a mail provider. */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState(null);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");

      setSent(true);
      if (data.devResetUrl) setDevResetUrl(data.devResetUrl);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <p className="font-semibold">Check your inbox.</p>
          <p className="mt-1">
            If an account exists for that email, we've sent a link to reset your
            password. It expires in 1 hour.
          </p>
        </div>

        {devResetUrl && (
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
            <p className="font-semibold text-slate-800">Development link</p>
            <p className="mt-1 break-all">
              No mail provider is configured on this server, so here's the link
              that would have been emailed:
            </p>
            <a
              href={devResetUrl}
              className="mt-1 inline-block break-all font-medium text-acorn-600 hover:text-acorn-700"
            >
              {devResetUrl}
            </a>
          </div>
        )}

        <button
          type="button"
          onClick={() => {
            setSent(false);
            setDevResetUrl(null);
            setEmail("");
          }}
          className="btn-secondary w-full"
        >
          Send another link
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-slate-600">
        Enter the email you signed up with and we'll send you a link to reset
        your password.
      </p>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Email
        </label>
        <input
          className="input"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button type="submit" disabled={busy} className="btn-primary w-full py-3">
        {busy ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
