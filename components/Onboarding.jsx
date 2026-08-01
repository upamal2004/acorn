"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";

/**
 * First-run screen for a user with no room yet: either create a new room or
 * join an existing one with its PEACH code.
 */
export function Onboarding({ user }) {
  const router = useRouter();
  const [mode, setMode] = useState("create"); // "create" | "join"
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const endpoint =
      mode === "create" ? "/api/rooms" : "/api/rooms/join";
    const body =
      mode === "create" ? { name } : { code: code.trim() };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={40} />
          </div>
          <div className="mb-4 flex justify-center">
            <Avatar name={user?.name} image={user?.image} size={56} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Hi{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            You're not part of a room yet. Create one or join a friend's.
          </p>
        </div>

        <div className="card">
          {/* Mode toggle */}
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            {[
              { key: "create", label: "Create a room" },
              { key: "join", label: "Join with code" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setMode(tab.key);
                  setError("");
                }}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  mode === tab.key
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "create" ? (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Room name
                </label>
                <input
                  className="input"
                  placeholder="Maple Street Apartment"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="mt-2 text-xs text-slate-500">
                  We'll generate a shareable code like{" "}
                  <span className="font-mono font-semibold text-peach-600">
                    PEACH-3K9
                  </span>{" "}
                  for your flatmates to join.
                </p>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Room code
                </label>
                <input
                  className="input font-mono uppercase"
                  placeholder="PEACH-3K9"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            )}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="btn-primary w-full py-3"
            >
              {busy
                ? "Working…"
                : mode === "create"
                  ? "Create my room"
                  : "Join room"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
