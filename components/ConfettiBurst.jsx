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

/** Quick success checkmark burst -- smaller and faster. */
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

/** Gold & green celebration burst for receiving money / settling debts. */
export function celebrationBurst() {
  try {
    // Gold coins falling
    confetti({
      particleCount: 60,
      spread: 90,
      startVelocity: 30,
      origin: { y: 0.5 },
      colors: ["#F59E0B", "#D97706", "#B45309", "#10B981", "#059669"],
      shapes: ["circle"],
      scalar: 1.2,
    });
    // Green sparkles from sides
    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
        colors: ["#10B981", "#34D399", "#6EE7B7"],
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
        colors: ["#10B981", "#34D399", "#6EE7B7"],
      });
    }, 200);
  } catch { /* noop */ }
}

/** Sad trombone effect -- subtle orange/red particles fading down for spending. */
export function spendBurst() {
  try {
    confetti({
      particleCount: 20,
      spread: 40,
      startVelocity: 15,
      gravity: 1.5,
      origin: { y: 0.6 },
      colors: ["#F97316", "#EA580C", "#FB923C"],
      shapes: ["circle"],
      scalar: 0.8,
      drift: 0,
      ticks: 80,
    });
  } catch { /* noop */ }
}
