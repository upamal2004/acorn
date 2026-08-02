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
      {/* Floating card container */}
      <div
        className={`flex flex-col items-center rounded-2xl border border-slate-700/50 bg-slate-900/90 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out ${
          phase === "entering" ? "scale-90 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={close}
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          preload="auto"
          className="pointer-events-none w-[300px] max-w-[80vw] max-h-[55vh] rounded-xl object-contain"
          src={src}
        />

        {/* Amount */}
        <p
          className={`mt-4 text-center text-3xl font-bold tracking-tight ${
            isSpending ? "text-red-400" : "text-emerald-400"
          }`}
        >
          {isSpending ? "-" : "+"}Rs. {amount?.toLocaleString() || "0"}
        </p>

        {/* Label */}
        <p
          className={`mt-1 text-center text-sm font-medium ${
            isSpending ? "text-red-300/80" : "text-emerald-300/80"
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
