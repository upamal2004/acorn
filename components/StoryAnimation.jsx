"use client";

import { useEffect, useState } from "react";
import { ConfettiBurst, celebrationBurst } from "@/components/ConfettiBurst";
import { ScratSpending } from "@/components/ScratSpending";
import { ScratReceiving } from "@/components/ScratReceiving";
import { ScratPiggyBank } from "@/components/ScratPiggyBank";

/**
 * Story-driven animation modal that shows for 2.5 seconds with smooth fade-out.
 * Displays the appropriate Scrat animation based on transaction type.
 *
 * @param {"spent" | "received" | "settled" | "wallet"} type - Animation type
 * @param {number} amount - Transaction amount
 * @param {string} [category] - Expense category (for spending)
 * @param {string} [label] - Custom label
 * @param {boolean} [show] - Whether to show the animation
 * @param {() => void} [onComplete] - Callback when animation finishes
 */
export function StoryAnimation({ type, amount, category, label, show = false, onComplete }) {
  const [phase, setPhase] = useState("hidden"); // hidden, entering, visible, fading

  useEffect(() => {
    if (!show) {
      setPhase("hidden");
      return;
    }

    // Phase 1: Enter
    setPhase("entering");

    // Phase 2: Visible (after entrance animation)
    const visibleTimer = setTimeout(() => {
      setPhase("visible");
    }, 100);

    // Phase 3: Start fade out at 2s
    const fadeTimer = setTimeout(() => {
      setPhase("fading");
    }, 2000);

    // Phase 4: Complete and hide at 2.5s
    const completeTimer = setTimeout(() => {
      setPhase("hidden");
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [show, onComplete]);

  if (phase === "hidden") return null;

  const isReceiving = type === "received" || type === "settled";
  const isWallet = type === "wallet";

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center transition-all duration-500 ${
        phase === "fading"
          ? "bg-black/0 backdrop-blur-0 opacity-0"
          : "bg-black/30 backdrop-blur-sm opacity-100"
      }`}
    >
      {/* Confetti for receiving/wallet */}
      {(isReceiving || isWallet) && phase === "visible" && (
        <div className="absolute inset-0 pointer-events-none">
          <ConfettiBurst fire={true} />
        </div>
      )}

      {/* Animation card */}
      <div
        className={`relative mx-4 max-w-sm rounded-3xl bg-white p-8 shadow-2xl transition-all duration-500 ${
          phase === "fading"
            ? "scale-90 opacity-0"
            : phase === "entering"
            ? "scale-95 opacity-0"
            : "scale-100 opacity-100"
        }`}
      >
        {/* Amount display */}
        <div className="mb-4 text-center">
          <p
            className={`text-3xl font-bold ${
              isReceiving || isWallet ? "text-emerald-600" : "text-orange-600"
            }`}
          >
            {isReceiving || isWallet ? "+" : "-"}Rs. {amount?.toLocaleString() || "0"}
          </p>
        </div>

        {/* Animation */}
        <div className="flex justify-center">
          {type === "spent" && (
            <ScratSpending category={category} amount={amount} size={180} />
          )}
          {(type === "received" || type === "settled") && (
            <ScratReceiving amount={amount} label={label} size={180} />
          )}
          {type === "wallet" && (
            <ScratPiggyBank amount={amount} size={180} />
          )}
        </div>

        {/* Status text */}
        <div className="mt-4 text-center">
          <p
            className={`text-sm font-semibold ${
              isReceiving || isWallet ? "text-emerald-700" : "text-orange-700"
            }`}
          >
            {label ||
              (type === "spent" && "Expense added") ||
              (type === "received" && "Money received!") ||
              (type === "settled" && "Debt settled!") ||
              (type === "wallet" && "Balance updated!") ||
              ""}
          </p>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-[2000ms] ease-linear ${
              isReceiving || isWallet ? "bg-emerald-400" : "bg-orange-400"
            }`}
            style={{
              width: phase === "fading" || phase === "visible" ? "100%" : "0%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
