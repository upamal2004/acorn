"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Clean splash screen — logo + brand lockup with a minimal pulse.
 * No character graphics.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => setVisible(false), 2100);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-amber-50/80 to-white transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Loading"
    >
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-700 ease-out ${
          fading ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Logo mark */}
        <div className="animate-[check-pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
          <Logo size={48} />
        </div>

        {/* App name */}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Acorn
        </h1>

        {/* Tagline */}
        <p className="text-sm text-slate-400">
          Split expenses, minus the awkwardness.
        </p>

        {/* Minimal pulsing dots */}
        <div className="mt-4 flex gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-[dot-pulse_1.2s_ease-in-out_infinite]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-[dot-pulse_1.2s_ease-in-out_infinite_0.2s]" />
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-[dot-pulse_1.2s_ease-in-out_infinite_0.4s]" />
        </div>
      </div>
    </div>
  );
}
