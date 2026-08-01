import { ArrowDownLeft, ArrowUpRight, Scale } from "lucide-react";
import { computeSummary } from "../lib/summary.js";
import { formatMoney } from "../lib/money.js";

/** "You owe" vs "You are owed" summary card. */
export default function RoomSummary({ expenses, currentUid }) {
  const { iOwe, owedToMe, net } = computeSummary(expenses, currentUid);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Room Summary</h3>
        <Scale size={18} className="text-slate-400" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-coral-100 bg-coral-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-coral-500">
            <ArrowUpRight size={14} /> You owe
          </p>
          <p className="mt-1 text-xl font-extrabold text-coral-600">
            {formatMoney(iOwe)}
          </p>
        </div>

        <div className="rounded-xl border border-green-100 bg-green-50 p-3.5">
          <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
            <ArrowDownLeft size={14} /> You are owed
          </p>
          <p className="mt-1 text-xl font-extrabold text-green-600">
            {formatMoney(owedToMe)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-slate-500">Net balance</span>
        <span
          className={`text-lg font-extrabold ${
            net > 0 ? "text-green-600" : net < 0 ? "text-coral-600" : "text-slate-700"
          }`}
        >
          {net > 0 ? "+" : ""}
          {formatMoney(net)}
        </span>
      </div>
    </div>
  );
}
