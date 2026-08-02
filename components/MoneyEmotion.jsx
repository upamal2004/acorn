"use client";

import { AcornHappy } from "@/components/AcornHappy";
import { AcornSad } from "@/components/AcornSad";
import { ConfettiBurst } from "@/components/ConfettiBurst";

/**
 * Context-aware money emotion display.
 * Shows the right animation based on whether money is being spent or received.
 *
 * @param {"spent" | "received" | "settled"} type - The type of transaction
 * @param {number} [amount] - Optional amount for display
 * @param {boolean} [fire] - Whether to trigger the animation
 * @param {() => void} [onDone] - Callback when animation completes
 */
export function MoneyEmotion({ type, amount, fire = true, onDone }) {
  if (type === "received" || type === "settled") {
    return (
      <div className="relative flex flex-col items-center gap-2">
        {/* Confetti for receiving */}
        <ConfettiBurst fire={fire} />

        {/* Happy acorn */}
        <div className="animate-[check-pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
          <AcornHappy size={80} />
        </div>

        {/* Green glow ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="h-24 w-24 rounded-full bg-emerald-400/20 animate-[glow-pulse_1.5s_ease-in-out_infinite]" />
        </div>

        {/* Amount text */}
        {amount !== undefined && (
          <p className="text-lg font-bold text-emerald-600 animate-[float-up_0.8s_ease-out]">
            +{typeof amount === "number" ? `Rs. ${amount.toLocaleString()}` : amount}
          </p>
        )}

        {/* Status text */}
        <p className="text-sm font-medium text-emerald-700">
          {type === "settled" ? "Debt settled!" : "Money received!"}
        </p>
      </div>
    );
  }

  // Spent
  return (
    <div className="relative flex flex-col items-center gap-2">
      {/* Sad acorn */}
      <div className="animate-[check-pop_0.5s_cubic-bezier(0.34,1.56,0.64,1)]">
        <AcornSad size={80} />
      </div>

      {/* Subtle red/orange glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-20 w-20 rounded-full bg-orange-400/15 animate-[glow-pulse_2s_ease-in-out_infinite]" />
      </div>

      {/* Amount text */}
      {amount !== undefined && (
        <p className="text-lg font-bold text-orange-600 animate-[float-up_0.8s_ease-out]">
          -{typeof amount === "number" ? `Rs. ${amount.toLocaleString()}` : amount}
        </p>
      )}

      {/* Status text */}
      <p className="text-sm font-medium text-orange-700">Expense added</p>
    </div>
  );
}
