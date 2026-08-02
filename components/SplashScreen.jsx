"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ScratChasingAcorn } from "@/components/ScratChasingAcorn";

/**
 * Animated splash screen with Scrat chasing an acorn.
 * Shows Scrat running in, the acorn bouncing, then fades out.
 */
export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade-out after1.8s, then fully unmount after the transition ends.
    const fadeTimer = setTimeout(() => setFading(true), 1800);
    const hideTimer = setTimeout(() => setVisible(false), 2300);
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
        className={`flex flex-col items-center gap-2 transition-all duration-700 ease-out ${
          fading ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ animationDelay: "0.1s" }}
      >
        {/* Scrat chasing acorn animation */}
        <div className="splash-logo">
          <ScratChasingAcorn size={140} />
        </div>

        {/* App name and tagline */}
        <div className="splash-text flex flex-col items-center gap-1" style={{ animation: "splash-text 0.8s ease-out 0.4s both" }}>
          <div className="flex items-center gap-2">
            <Logo size={32} />
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Acorn
            </h1>
          </div>
          <p className="text-sm text-slate-400">
            Split expenses, minus the awkwardness.
          </p>
        </div>

        {/* Decorative acorns */}
        <div className="mt-4 flex gap-3 opacity-40" style={{ animation: "splash-text 0.6s ease-out 0.8s both" }}>
          <span className="text-lg" style={{ animation: "acorn-bounce 2s ease-in-out infinite 0s" }}>🌰</span>
          <span className="text-sm" style={{ animation: "acorn-bounce 2s ease-in-out infinite 0.3s" }}>🌰</span>
          <span className="text-lg" style={{ animation: "acorn-bounce 2s ease-in-out infinite 0.6s" }}>🌰</span>
        </div>
      </div>
    </div>
  );
}
