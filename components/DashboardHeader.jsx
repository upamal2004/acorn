"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";
import { QuickCalculator } from "@/components/QuickCalculator";

const NAV_LINKS = [
  { key: "dashboard", href: "/dashboard", label: "Dashboard", icon: <HomeIcon /> },
  { key: "history", href: "/history", label: "History", icon: <CalendarIcon /> },
  { key: "insights", href: "/insights", label: "Insights", icon: <ChartIcon /> },
  { key: "about", href: "/about", label: "About", icon: <InfoIcon /> },
];

/** Shared signed-in top bar: logo, primary navigation (Dashboard / History /
 *  Insights), room code, avatar, account settings and sign out. Rendered on
 *  every authenticated page so the main nav is always one tap away. */
export function DashboardHeader({ user, room, active, onToast }) {
  const [showCalculator, setShowCalculator] = useState(false);

  async function handleSignOut() {
    try {
      await signOut({ callbackUrl: "/login" });
    } catch {
      onToast?.("error", "Could not sign out. Please try again.");
    }
  }

  function handleUseResult(value) {
    // Copy to clipboard for easy pasting
    navigator.clipboard.writeText(value).then(() => {
      onToast?.("success", `Copied Rs. ${value} to clipboard`);
    }).catch(() => {
      onToast?.("info", `Result: Rs. ${value}`);
    });
  }

  return (
    <>
      <QuickCalculator
        show={showCalculator}
        onClose={() => setShowCalculator(false)}
        onUseResult={handleUseResult}
      />

      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-5xl px-6">
          <div className="flex items-center justify-between py-3.5">
            <Link href="/dashboard" aria-label="Acorn dashboard">
              <Logo size={26} />
            </Link>
            <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
              {room && (
                <span className="hidden rounded-full bg-acorn-100 px-3 py-1 font-mono text-xs font-semibold text-acorn-700 sm:inline">
                  {room.code}
                </span>
              )}
              {/* Calculator button */}
              <button
                onClick={() => setShowCalculator(true)}
                className="btn-ghost px-2.5 py-2"
                title="Quick Calculator"
              >
                <CalcIcon />
              </button>
              <Avatar name={user.name} image={user.image} size={32} />
              <Link
                href="/settings"
                className="btn-ghost px-2.5 py-2"
                title="Account settings"
              >
                <GearIcon />
              </Link>
              <button
                onClick={handleSignOut}
                className="btn-ghost px-3 py-1.5 text-xs"
                title="Sign out"
              >
                Sign out
              </button>
            </div>
          </div>

          <nav className="-mx-2 mb-3 flex gap-1 overflow-x-auto pb-0.5" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const isActive = link.key === active;
              return (
              <Link
                key={link.key}
                href={link.href}
                className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition-all hover:scale-[1.04] active:scale-[0.97] ${
                  isActive
                    ? "bg-acorn-100 text-acorn-700 shadow-sm"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
    </>
  );
}

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M10 21v-6h4v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 2v4M16 2v4M3 8h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 4v16h16M8 16l3-4 3 3 4-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GearIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.35a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.01A1.7 1.7 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56h.01a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.01a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1.03Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CalcIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="2" width="16" height="20" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 6h8M8 10h8M8 14h3M15 14l2 2M15 16l2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="8" y="17" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.3" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
