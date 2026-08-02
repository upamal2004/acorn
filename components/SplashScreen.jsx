"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

/**
 * Animated splash screen shown on app launch / reload. Scales and fades in
 * the logo + app name, then fades out to reveal the page underneath.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out after1.4s, then fully unmount after the transition ends.
    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const hideTimer = setTimeout(() => setVisible(false), 1900);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
      aria-label="Loading"
    >
      <div
        className={`flex flex-col items-center gap-4 transition-all duration-700 ease-out ${
          fading ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        <div className="splash-logo">
          <Logo size={64} />
        </div>
        <div className="splash-text flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Acorn
          </h1>
          <p className="text-sm text-slate-400">
            Split expenses, minus the awkwardness.
          </p>
        </div>
      </div>
    </div>
  );
}
