"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceDot,
} from "recharts";
import { formatMoney } from "@/lib/money";
import { personalAmount } from "@/lib/history";

/**
 * Interactive line chart showing daily spending trend.
 * Uses Recharts for smooth, responsive visualization.
 */
export function DailyTrendChart({ expenses, userId, days = 14 }) {
  const [activeIndex, setActiveIndex] = useState(null);

  const { data, maxPoint } = useMemo(() => {
    const now = new Date();
    const buckets = [];

    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      buckets.push({
        key,
        date: d,
        day: d.toLocaleDateString("en-US", { weekday: "short" }),
        dateLabel: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        total: 0,
        expenses: [],
      });
    }

    // Map expenses to buckets
    for (const exp of expenses) {
      const d = new Date(exp.createdAt);
      if (Number.isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      const bucket = buckets.find((b) => b.key === key);
      if (bucket) {
        const amt = personalAmount(exp, userId);
        bucket.total += amt;
        bucket.expenses.push({ title: exp.title, amount: amt, category: exp.category });
      }
    }

    // Round totals
    const rounded = buckets.map((b) => ({
      ...b,
      total: Math.round(b.total * 100) / 100,
    }));

    // Find max point for highlight
    const maxPt = rounded.reduce((max, b) => (b.total > max.total ? b : max), rounded[0]);

    return { data: rounded, maxPoint: maxPt };
  }, [expenses, userId, days]);

  const maxValue = Math.max(...data.map((d) => d.total), 100);

  // Custom tooltip
  function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;

    return (
      <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
        <p className="text-sm font-bold text-slate-900">{d.dateLabel}</p>
        <p className="mt-1 text-lg font-bold text-amber-600">{formatMoney(d.total)}</p>
        {d.expenses.length > 0 && (
          <div className="mt-2 space-y-1 border-t border-slate-100 pt-2">
            {d.expenses.slice(0, 5).map((exp, i) => (
              <div key={i} className="flex items-center justify-between gap-4 text-xs">
                <span className="max-w-[120px] truncate text-slate-600">{exp.title}</span>
                <span className="font-semibold text-slate-800">{formatMoney(exp.amount)}</span>
              </div>
            ))}
            {d.expenses.length > 5 && (
              <p className="text-xs text-slate-400">+{d.expenses.length - 5} more</p>
            )}
          </div>
        )}
        {d.expenses.length === 0 && (
          <p className="mt-1 text-xs text-slate-400">No expenses</p>
        )}
      </div>
    );
  }

  // Custom dot for active point
  function ActiveDot({ cx, cy, payload }) {
    if (!payload || payload.total === 0) return null;
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#d97706" opacity={0.2} />
        <circle cx={cx} cy={cy} r={5} fill="#d97706" stroke="white" strokeWidth={2} />
      </g>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          onMouseMove={(e) => {
            if (e?.activeTooltipIndex !== undefined) {
              setActiveIndex(e.activeTooltipIndex);
            }
          }}
          onMouseLeave={() => setActiveIndex(null)}
        >
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d97706" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />

          <XAxis
            dataKey="dateLabel"
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={{ stroke: "#e2e8f0" }}
            interval={Math.max(Math.floor(days / 7), 0)}
          />

          <YAxis
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
            width={40}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#d97706"
            strokeWidth={2.5}
            fill="url(#spendGradient)"
            dot={false}
            activeDot={<ActiveDot />}
            animationDuration={800}
            animationEasing="ease-out"
          />

          {/* Highlight the highest spending day */}
          {maxPoint && maxPoint.total > 0 && (
            <ReferenceDot
              x={maxPoint.dateLabel}
              y={maxPoint.total}
              r={0}
              label={{
                value: "highest",
                position: "top",
                fill: "#dc2626",
                fontSize: 9,
                fontWeight: "bold",
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="mt-2 flex items-center justify-center gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <span>Daily spending</span>
        </div>
        {maxPoint && maxPoint.total > 0 && (
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span>Highest: {maxPoint.dateLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
