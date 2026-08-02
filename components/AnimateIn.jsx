"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Wraps children with a staggered fade-in + slide-up animation on mount.
 * Uses IntersectionObserver so items animate only when they scroll into view.
 *
 * Props:
 *   delay   - animation delay in ms (auto-staggered if index provided)
 *   index   - position in a list (auto-computes delay)
 *   className - additional classes
 *   as      - element type (default "div")
 */
export function AnimateIn({ children, delay = 0, index, className = "", as: Tag = "div", ...props }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  const computedDelay = index != null ? index * 80 : delay;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${computedDelay}ms, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${computedDelay}ms`,
      }}
      {...props}
    >
      {children}
    </Tag>
  );
}

/**
 * Money pulse animation wrapper. Shows a brief green/red pulse around children.
 * Props: type = "in" (green, money received) | "out" (red, money spent) | "success"
 */
export function MoneyPulse({ type = "success", children, className = "" }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, []);

  const colors = {
    in: "shadow-[0_0_0_0_rgba(34,197,94,0.4)]",
    out: "shadow-[0_0_0_0_rgba(239,68,68,0.4)]",
    success: "shadow-[0_0_0_0_rgba(34,197,94,0.4)]",
  };

  const pulseColors = {
    in: "animate-money-in",
    out: "animate-money-out",
    success: "animate-money-success",
  };

  return (
    <div className={`${className} ${pulse ? pulseColors[type] : ""}`}>
      {children}
    </div>
  );
}

/**
 * Shows a floating +Rs. X or -Rs. X animation that floats up and fades out.
 */
export function FloatingAmount({ amount, type = "out", show = false }) {
  if (!show) return null;
  const isPositive = type === "in";
  return (
    <span
      className={`pointer-events-none absolute right-0 top-0 text-sm font-bold ${
        isPositive ? "text-emerald-600" : "text-red-500"
      } animate-float-up`}
    >
      {isPositive ? "+" : "-"}{amount}
    </span>
  );
}
