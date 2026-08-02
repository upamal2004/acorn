"use client";

import { useMemo } from "react";
import { formatMoney } from "@/lib/money";
import { personalAmount } from "@/lib/history";

/** Pure-CSS/SVG bar chart showing daily spending for the last N days. */
export function DailyTrendChart({ expenses, userId, days = 14 }) {
  const data = useMemo(() => {
    const now = new Date();
    const buckets = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      buckets.push({
        key,
        label: d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }),
        shortLabel: d.toLocaleDateString("en-GB", { day: "numeric" }),
        total: 0,
      });
    }

    for (const exp of expenses) {
      const d = new Date(exp.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) bucket.total += personalAmount(exp, userId);
    }

    return buckets.map((b) => ({ ...b, total: Math.round(b.total * 100) / 100 }));
  }, [expenses, userId, days]);

  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div>
      {/* Y-axis labels + bars */}
      <div className="flex items-end gap-1" style={{ height: 160 }}>
        {data.map((d) => {
          const pct = Math.max((d.total / max) * 100, d.total > 0 ? 2 : 0);
          return (
            <div key={d.key} className="group relative flex flex-1 flex-col items-center">
              {/* Tooltip */}
              {d.total > 0 && (
                <div className="pointer-events-none absolute -top-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white shadow-lg group-hover:block">
                  {formatMoney(d.total)}
                </div>
              )}
              {/* Bar */}
              <div
                className="w-full rounded-t-md transition-all duration-300"
                style={{
                  height: `${pct}%`,
                  backgroundColor: d.total > 0 ? "#d97706" : "#e2e8f0",
                  minHeight: d.total > 0 ? 4 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* X-axis labels */}
      <div className="mt-2 flex gap-1">
        {data.map((d, i) => (
          <div key={d.key} className="flex flex-1 justify-center">
            <span className="text-[9px] text-slate-400" style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "rotate(180deg)", height: 40 }}>
              {i % Math.ceil(days / 7) === 0 ? d.shortLabel : ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
