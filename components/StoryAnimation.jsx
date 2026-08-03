"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

const VIDEO_MAP = {
  spent: "/spent.mp4.mp4?v=3",
  received: "/received.mp4.mp4?v=3",
  settled: "/received.mp4.mp4?v=3",
  wallet: "/wallet.mp4.mp4?v=3",
};

const FALLBACK_MS = 10000;

export function StoryAnimation({ type, amount, label, show = false, onComplete }) {
  const videoRef = useRef(null);
  const fallbackRef = useRef(null);
  const [phase, setPhase] = useState("hidden");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

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
      const v = videoRef.current;
      v.muted = true;
      v.volume = 0;
      v.currentTime = 0;
      v.play().catch(() => {});
    }
  }, [phase]);

  if (!mounted || phase === "hidden") return null;

  const src = VIDEO_MAP[type] || VIDEO_MAP.spent;
  const isSpending = type === "spent";

  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-opacity duration-300 ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      {/* White floating card */}
      <div
        className={`flex flex-col items-center rounded-3xl bg-white p-4 shadow-2xl transition-all duration-300 ease-out max-w-xs ${
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
          className="pointer-events-none w-full max-h-[55vh] rounded-2xl object-contain"
          style={{ filter: "contrast(110%) brightness(130%)" }}
          src={src}
        />

        {/* Amount */}
        <p
          className={`mt-4 text-center text-3xl font-bold tracking-tight ${
            isSpending ? "text-red-500" : "text-emerald-500"
          }`}
        >
          {isSpending ? "-" : "+"}Rs. {amount?.toLocaleString() || "0"}
        </p>

        {/* Label */}
        <p
          className={`mt-1 text-center text-sm font-medium ${
            isSpending ? "text-red-400/80" : "text-emerald-400/80"
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
    </div>,
    document.body
  );
}
