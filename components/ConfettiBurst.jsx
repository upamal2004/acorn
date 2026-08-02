"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

/**
 * Fire confetti burst. Renders nothing; call via ref or auto-fire on mount.
 * Props: { fire?: boolean, auto?: boolean }
 */
export function ConfettiBurst({ fire = false, auto = false }) {
  const fired = useRef(false);

  useEffect(() => {
    if (auto && !fired.current) {
      fired.current = true;
      burst();
    }
  }, [auto]);

  useEffect(() => {
    if (fire) burst();
  }, [fire]);

  return null;
}

function burst() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#d97706", "#22c55e", "#3b82f6", "#a855f7", "#f97316"],
    });
  } catch {
    // canvas-confetti not available in SSR
  }
}

/** Quick success checkmark burst — smaller and faster. */
export function successBurst() {
  try {
    confetti({
      particleCount: 40,
      spread: 50,
      startVelocity: 25,
      origin: { y: 0.7 },
      colors: ["#22c55e", "#10b981"],
    });
  } catch { /* noop */ }
}
