"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { PasswordInput } from "./PasswordInput";
import { formatMoney } from "@/lib/money";
import { EXPENSE_CATEGORIES } from "@/lib/categories";

export function SettingsPage({ user }) {
  const router = useRouter();
  const [toast, setToast] = useState(null);

  // Display name
  const [name, setName] = useState(user.name || "");
  const [nameBusy, setNameBusy] = useState(false);

  // Room name (creator only)
  const isOwner = user.room && user.room.ownerId === user.id;
  const [roomName, setRoomName] = useState(user.room?.name || "");
  const [roomBusy, setRoomBusy] = useState(false);

  // Password
  const [current, setCurrent] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwBusy, setPwBusy] = useState(false);

  // Daily limit
  const [limitInput, setLimitInput] = useState(
    user.dailyLimit != null ? String(user.dailyLimit) : ""
  );
  const [limitBusy, setLimitBusy] = useState(false);

  // Category limits
  const [catLimits, setCatLimits] = useState(() => {
    const init = {};
    EXPENSE_CATEGORIES.forEach((c) => {
      init[c.value] = user.categoryLimits?.[c.value] != null
        ? String(user.categoryLimits[c.value])
        : "";
    });
    return init;
  });
  const [catBusy, setCatBusy] = useState(false);

  // Delete account
  const [showDelete, setShowDelete] = useState(false);
  const [deleteBusy, setDeleteBusy] = useState(false);

  function showToast(type, message) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  }

  // --- Display name ---
  async function saveName() {
    const trimmed = name.trim();
    if (!trimmed) { showToast("error", "Name cannot be empty."); return; }
    setNameBusy(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update name.");
      showToast("success", "Display name updated.");
    } catch (e) { showToast("error", e.message); }
    finally { setNameBusy(false); }
  }

  // --- Room name ---
  async function saveRoomName() {
    const trimmed = roomName.trim();
    if (!trimmed) { showToast("error", "Room name cannot be empty."); return; }
    setRoomBusy(true);
    try {
      const res = await fetch("/api/account/room-name", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update room name.");
      showToast("success", "Room name updated.");
    } catch (e) { showToast("error", e.message); }
    finally { setRoomBusy(false); }
  }

  // --- Password ---
  async function submitPassword(e) {
    e.preventDefault();
    if (!current) { setPwError("Please enter your current password."); return; }
    if (nextPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (nextPw === current) { setPwError("New password must be different."); return; }
    if (confirm !== nextPw) { setPwError("New passwords don't match."); return; }
    setPwBusy(true); setPwError("");
    try {
      const res = await fetch("/api/account/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: nextPw }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update password.");
      showToast("success", "Password updated.");
      setCurrent(""); setNextPw(""); setConfirm("");
    } catch (e) { setPwError(e.message); showToast("error", e.message); }
    finally { setPwBusy(false); }
  }

  // --- Daily limit ---
  async function saveLimit() {
    const val = limitInput.trim();
    const dailyLimit = val === "" ? null : parseFloat(val);
    if (dailyLimit !== null && (Number.isNaN(dailyLimit) || dailyLimit < 0)) {
      showToast("error", "Please enter a valid amount."); return;
    }
    setLimitBusy(true);
    try {
      const res = await fetch("/api/account/daily-limit", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dailyLimit }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update limit.");
      showToast("success", dailyLimit != null ? `Daily limit set to ${formatMoney(dailyLimit)}.` : "Daily limit removed.");
    } catch (e) { showToast("error", e.message); }
    finally { setLimitBusy(false); }
  }

  // --- Category limits ---
  function updateCatLimit(category, value) {
    setCatLimits((prev) => ({ ...prev, [category]: value }));
  }

  async function saveCatLimits() {
    setCatBusy(true);
    const payload = {};
    for (const [cat, val] of Object.entries(catLimits)) {
      if (val.trim() !== "") {
        const num = parseFloat(val);
        if (!Number.isNaN(num) && num >= 0) payload[cat] = num;
      }
    }
    try {
      const res = await fetch("/api/account/category-limits", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryLimits: Object.keys(payload).length > 0 ? payload : null }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update limits.");
      showToast("success", "Category limits saved.");
    } catch (e) { showToast("error", e.message); }
    finally { setCatBusy(false); }
  }

  // --- Delete account ---
  async function deleteAccount() {
    setDeleteBusy(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not delete account.");
      showToast("success", "Account deleted. Redirecting...");
      setTimeout(() => { window.location.href = "/login"; }, 2000);
    } catch (e) { showToast("error", e.message); setDeleteBusy(false); }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition hover:text-slate-900">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm font-medium text-slate-500 transition hover:text-slate-700">Sign out</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account, room, and spending limits.</p>
        </div>

        {/* Profile / Display Name */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Profile</h2>
          <div className="card space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-acorn-100 text-xl font-bold text-acorn-700">
                {user.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Display name</label>
              <div className="flex gap-2">
                <input
                  className="input flex-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={50}
                />
                <button onClick={saveName} disabled={nameBusy || name.trim() === user.name} className="rounded-lg bg-acorn-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-acorn-700 disabled:opacity-50">
                  {nameBusy ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Room Name (Creator only) */}
        {user.room && (
          <section className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Room</h2>
            <div className="card">
              {isOwner ? (
                <>
                  <p className="mb-3 text-sm text-slate-600">You created this room. Edit its name below.</p>
                  <div className="flex gap-2">
                    <input
                      className="input flex-1"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      maxLength={50}
                    />
                    <button onClick={saveRoomName} disabled={roomBusy || roomName.trim() === user.room.name} className="rounded-lg bg-acorn-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-acorn-700 disabled:opacity-50">
                      {roomBusy ? "Saving..." : "Save"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{user.room.name}</p>
                    <p className="mt-0.5 text-xs text-slate-400">Code: <span className="font-mono font-semibold text-acorn-600">{user.room.code}</span></p>
                  </div>
                  <span className="text-xs text-slate-400">Only the creator can rename</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Daily Spending Limit */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Daily Spending Limit</h2>
          <div className="card">
            <p className="mb-4 text-sm text-slate-600">Set a daily spending limit to track your personal expenses. You&apos;ll see a progress bar on your dashboard when you approach or exceed the limit.</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Rs.</span>
              <input type="number" min="0" step="0.01" value={limitInput} onChange={(e) => setLimitInput(e.target.value)} placeholder="e.g. 1000.00" className="input flex-1" />
              <button onClick={saveLimit} disabled={limitBusy} className="rounded-lg bg-acorn-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-acorn-700 disabled:opacity-50">
                {limitBusy ? "Saving..." : "Save"}
              </button>
            </div>
            {user.dailyLimit != null && <p className="mt-3 text-xs text-slate-400">Current limit: {formatMoney(user.dailyLimit)} per day</p>}
          </div>
        </section>

        {/* Category Limits */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Category Limits</h2>
          <div className="card">
            <p className="mb-4 text-sm text-slate-600">Set individual spending limits per category. When adding an expense, you&apos;ll see a soft warning if the limit is exceeded (expenses are never blocked).</p>
            <div className="space-y-3">
              {EXPENSE_CATEGORIES.map((cat) => (
                <div key={cat.value} className="flex items-center gap-3">
                  <span className="w-28 text-sm text-slate-700">{cat.emoji} {cat.label}</span>
                  <span className="text-xs text-slate-400">Rs.</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={catLimits[cat.value] || ""}
                    onChange={(e) => updateCatLimit(cat.value, e.target.value)}
                    placeholder="No limit"
                    className="input flex-1"
                  />
                </div>
              ))}
            </div>
            <button onClick={saveCatLimits} disabled={catBusy} className="mt-4 rounded-lg bg-acorn-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-acorn-700 disabled:opacity-50">
              {catBusy ? "Saving..." : "Save category limits"}
            </button>
          </div>
        </section>

        {/* Change Password */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">Account Security</h2>
          <div className="card">
            <form onSubmit={submitPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Current password</label>
                <PasswordInput autoComplete="current-password" placeholder="Enter current password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">New password</label>
                <PasswordInput autoComplete="new-password" placeholder="At least 8 characters" value={nextPw} onChange={(e) => setNextPw(e.target.value)} required minLength={8} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Confirm new password</label>
                <PasswordInput autoComplete="new-password" placeholder="Repeat the new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
              </div>
              {pwError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{pwError}</p>}
              <button type="submit" disabled={pwBusy} className="btn-primary w-full py-3">{pwBusy ? "Updating..." : "Update password"}</button>
            </form>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-400">Danger Zone</h2>
          <div className="card border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">Delete account</p>
                <p className="mt-0.5 text-xs text-slate-500">Permanently delete your account and all associated data. This cannot be undone.</p>
              </div>
              <button onClick={() => setShowDelete(true)} className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50">
                Delete account
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Delete Account Confirmation Modal */}
      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-red-600">Delete your account?</h3>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently delete your profile, expenses, room data, and all associated history. This action cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setShowDelete(false)} className="flex-1 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                Cancel
              </button>
              <button onClick={deleteAccount} disabled={deleteBusy} className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50">
                {deleteBusy ? "Deleting..." : "Yes, delete everything"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex justify-center px-4">
          <div className={`w-full max-w-md rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
}
