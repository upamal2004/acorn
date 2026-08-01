import { useState } from "react";
import { Check, Copy, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Avatar from "./Avatar.jsx";
import Logo from "./Logo.jsx";

/** Sticky app header: brand, room code (copyable) and the profile menu. */
export default function Header({ room }) {
  const { profile, signOut } = useAuth();
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(room?.code || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — no-op */
    }
  }

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4">
        <div className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Peach
          </span>
          {room?.name && (
            <span className="hidden text-sm text-slate-400 sm:inline">· {room.name}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {room?.code && (
            <button
              onClick={copyCode}
              title="Copy room code"
              className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-peach-300 hover:bg-peach-50"
            >
              <span className="font-mono tracking-widest">{room.code}</span>
              {copied ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <Copy size={14} className="text-slate-400" />
              )}
            </button>
          )}

          <div className="flex items-center gap-2">
            <Avatar member={profile} size={34} />
            <button
              onClick={signOut}
              title="Sign out"
              className="btn-ghost !rounded-full !p-2"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
