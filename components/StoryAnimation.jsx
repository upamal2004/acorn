"use client";

import { useEffect, useState } from "react";
import { ConfettiBurst } from "@/components/ConfettiBurst";
import { ScratSpending } from "@/components/ScratSpending";
import { ScratReceiving } from "@/components/ScratReceiving";
import { ScratPiggyBank } from "@/components/ScratPiggyBank";

/**
 * Full-screen story-driven animation overlay.
 * Shows for 2.5 seconds with smooth fade-out.
 *
 * @param {"spent" | "received" | "settled" | "wallet"} type - Animation type
 * @param {number} amount - Transaction amount
 * @param {string} [label] - Custom label
 * @param {boolean} [show] - Whether to show the animation
 * @param {() => void} [onComplete] - Callback when animation finishes
 */
export function StoryAnimation({ type, amount, label, show = false, onComplete }) {
  const [phase, setPhase] = useState("hidden");

  useEffect(() => {
    if (!show) {
      setPhase("hidden");
      return;
    }

    setPhase("entering");

    const visibleTimer = setTimeout(() => setPhase("visible"), 100);
    const fadeTimer = setTimeout(() => setPhase("fading"), 2200);
    const completeTimer = setTimeout(() => {
      setPhase("hidden");
      onComplete?.();
    }, 2700);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onComplete]);

  if (phase === "hidden") return null;

  const isReceiving = type === "received" || type === "settled";
  const isWallet = type === "wallet";
  const isSpending = type === "spent";

  return (
    <div
      className={`fixed inset-0 z-[80] flex flex-col items-center justify-center transition-all duration-700 ease-out ${
        phase === "fading"
          ? "bg-black/0 opacity-0"
          : "bg-black/50 opacity-100"
      }`}
      style={{ backdropFilter: phase === "fading" ? "blur(0px)" : "blur(12px)" }}
    >
      {/* Confetti for receiving/wallet */}
      {(isReceiving || isWallet) && phase === "visible" && (
        <div className="absolute inset-0 pointer-events-none">
          <ConfettiBurst fire={true} />
        </div>
      )}

      {/* Main animation container */}
      <div
        className={`flex flex-col items-center gap-6 transition-all duration-500 ease-out ${
          phase === "fading"
            ? "scale-90 opacity-0"
            : phase === "entering"
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        {/* The SVG animation */}
        <div className="relative">
          {isSpending && <ScratSpending amount={amount} size={300} />}
          {(isReceiving) && <ScratReceiving amount={amount} label={label} size={300} />}
          {isWallet && <ScratPiggyBank amount={amount} size={300} />}
        </div>

        {/* Amount display */}
        <div className="text-center">
          <p
            className={`text-4xl font-bold tracking-tight ${
              isReceiving || isWallet ? "text-emerald-400" : "text-orange-400"
            }`}
          >
            {isReceiving || isWallet ? "+" : "-"}Rs. {amount?.toLocaleString() || "0"}
          </p>
          <p
            className={`mt-2 text-base font-medium ${
              isReceiving || isWallet ? "text-emerald-300" : "text-orange-300"
            }`}
          >
            {label ||
              (isSpending && "Expense added") ||
              (isReceiving && "Money received!") ||
              (type === "settled" && "Debt settled!") ||
              (isWallet && "Balance updated!") ||
              ""}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 overflow-hidden rounded-full bg-white/20">
          <div
            className={`h-full rounded-full transition-all duration-[2200ms] ease-linear ${
              isReceiving || isWallet ? "bg-emerald-400" : "bg-orange-400"
            }`}
            style={{ width: phase === "fading" || phase === "visible" ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
