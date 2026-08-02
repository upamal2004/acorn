"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const VIDEO_MAP = {
  spent: "/spent.mp4.mp4",
  received: "/received.mp4.mp4",
  settled: "/received.mp4.mp4",
  wallet: "/wallet.mp4.mp4",
};

const FALLBACK_MS = 10000;

export function StoryAnimation({ type, amount, label, show = false, onComplete }) {
  const videoRef = useRef(null);
  const fallbackRef = useRef(null);
  const [phase, setPhase] = useState("hidden");

  const close = useCallback(() => {
    setPhase("fading");
    setTimeout(() => {
      setPhase("hidden");
      onComplete?.();
    }, 400);
  }, [onComplete]);

  useEffect(() => {
    if (!show) {
      setPhase("hidden");
      return;
    }

    setPhase("entering");
    const enterTimer = setTimeout(() => setPhase("visible"), 50);

    fallbackRef.current = setTimeout(close, FALLBACK_MS);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(fallbackRef.current);
    };
  }, [show, close]);

  useEffect(() => {
    if (phase === "visible" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [phase]);

  if (phase === "hidden") return null;

  const src = VIDEO_MAP[type] || VIDEO_MAP.spent;
  const isSpending = type === "spent";

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        onEnded={close}
        className="max-w-[320px] w-[80vw] max-h-[60vh] rounded-2xl object-contain shadow-2xl"
        src={src}
      />

      {/* Amount + label */}
      <div className="mt-5 text-center">
        <p
          className={`text-4xl font-bold tracking-tight ${
            isSpending ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {isSpending ? "-" : "+"}Rs. {amount?.toLocaleString() || "0"}
        </p>
        <p
          className={`mt-2 text-base font-medium ${
            isSpending ? "text-red-300" : "text-emerald-300"
          }`}
        >
          {label ||
            (isSpending && "Expense added") ||
            (type === "received" && "Money received!") ||
            (type === "settled" && "Debt settled!") ||
            (type === "wallet" && "Balance updated!") ||
            ""}
        </p>
      </div>
    </div>
  );
}
