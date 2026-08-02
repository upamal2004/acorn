"use client";

/**
 * Story-driven spending animation: Sad Scrat watches helplessly as a fishing hook
 * pulls his precious money away into the distance. Shows the expense category icon.
 *
 * @param {string} category - Expense category (FOOD, TRANSPORT, etc.)
 * @param {number} amount - Amount being spent
 */
export function ScratSpending({ category, amount, size = 200 }) {
  const categoryIcons = {
    FOOD: "🍔",
    TRANSPORT: "🚗",
    UTILITIES: "💡",
    ENTERTAINMENT: "🎬",
    SHOPPING: "🛍️",
    HEALTH: "💊",
    EDUCATION: "📚",
    OTHERS: "📦",
  };

  const categoryLabels = {
    FOOD: "Food & Dining",
    TRANSPORT: "Transport",
    UTILITIES: "Utilities",
    ENTERTAINMENT: "Entertainment",
    SHOPPING: "Shopping",
    HEALTH: "Health",
    EDUCATION: "Education",
    OTHERS: "Other",
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + 40 }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky gradient background */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>

        {/* Ground */}
        <ellipse cx="100" cy="185" rx="90" ry="10" fill="#d4a574" opacity="0.3" />

        {/* === FISHING LINE & HOOK (coming from top-right) === */}
        <g className="origin-top-right animate-[hook-pull_2.5s_ease-in-out]">
          {/* Fishing rod tip (off-screen) */}
          <path d="M180 -10 Q160 20 140 50" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Fishing line */}
          <path d="M140 50 Q130 80 120 100" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="4 2" className="animate-[line-taut_1s_ease-out]" />

          {/* Hook */}
          <g className="animate-[hook-swing_1.5s_ease-in-out_infinite]">
            <path d="M118 98 L120 108 Q125 115 120 118 Q115 115 118 108 Z" fill="#64748b" />
            <circle cx="120" cy="96" r="2" fill="#64748b" />
          </g>
        </g>

        {/* === MONEY/BANKNOTE being hooked and pulled away === */}
        <g className="origin-center animate-[money-fished_2.5s_ease-in-out]">
          {/* Banknote */}
          <g className="animate-[money-flutter_0.8s_ease-in-out_infinite]">
            <rect x="108" y="85" width="24" height="14" rx="2" fill="#22c55e" />
            <rect x="110" y="87" width="20" height="10" rx="1" fill="#4ade80" />
            {/* Currency symbol */}
            <text x="120" y="95" fontSize="7" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            {/* Bill details */}
            <line x1="112" y1="89" x2="128" y2="89" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
            <line x1="112" y1="93" x2="128" y2="93" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
          </g>
        </g>

        {/* === SCRAT (sad, watching money fly away) === */}
        <g className="animate-[scrat-sad-react_0.8s_cubic-bezier(0.34,1.56,0.64,1)]">
          {/* Body */}
          <ellipse cx="70" cy="155" rx="22" ry="16" fill="#C4956A" />
          <ellipse cx="72" cy="157" rx="15" ry="10" fill="#E8D4B8" />

          {/* Tail - drooping */}
          <path d="M46 150 Q36 140 30 130 Q26 122 30 120 Q34 118 38 128 Q42 138 48 150" fill="#C4956A" className="animate_[tail-droop_2s_ease-out]" />

          {/* Head */}
          <ellipse cx="85" cy="135" rx="16" ry="13" fill="#C4956A" />

          {/* Ears - flattened */}
          <ellipse cx="76" cy="120" rx="5" ry="8" fill="#C4956A" transform="rotate(-20 76 120)" />
          <ellipse cx="76" cy="120" rx="3" ry="6" fill="#E8B4B4" transform="rotate(-20 76 120)" />
          <ellipse cx="92" cy="120" rx="5" ry="8" fill="#C4956A" transform="rotate(15 92 120)" />
          <ellipse cx="92" cy="120" rx="3" ry="6" fill="#E8B4B4" transform="rotate(15 92 120)" />

          {/* Snout */}
          <ellipse cx="98" cy="137" rx="8" ry="6" fill="#D4A882" />
          <circle cx="104" cy="136" r="2.5" fill="#3D2B1F" />

          {/* Eyes - looking up at money with sadness */}
          <g>
            <ellipse cx="84" cy="132" rx="4" ry="5" fill="white" />
            <circle cx="85" cy="131" r="2" fill="#3D2B1F" />
            <circle cx="85.5" cy="130.5" r="0.8" fill="white" />
            {/* Sad eyebrow */}
            <path d="M79 126 Q83 124 87 127" stroke="#3D2B1F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Mouth - wavy sad */}
          <path d="M92 142 Q96 140 100 142 Q104 144 108 142" stroke="#3D2B1F" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Fangs */}
          <path d="M95 140 L94.5 143" stroke="white" strokeWidth="1" strokeLinecap="round" />
          <path d="M101 140 L101.5 143" stroke="white" strokeWidth="1" strokeLinecap="round" />

          {/* Front paws - reaching desperately toward money */}
          <g className="origin-right animate_[paws-reach_2s_ease-in-out_infinite]">
            <path d="M82 155 Q95 148 108 150" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="108" cy="150" r="4" fill="#D4A882" />
          </g>

          {/* Back legs */}
          <path d="M58 168 Q52 178 48 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="48" cy="184" rx="5" ry="3" fill="#D4A882" />
          <path d="M65 168 Q59 178 55 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="55" cy="184" rx="5" ry="3" fill="#D4A882" />
        </g>

        {/* === TEARS falling === */}
        <g className="animate-[tear-stream_2s_ease-in-out_infinite]">
          <path d="M82 137 Q81 142 82 147 Q83 142 82 137Z" fill="#60A5FA" opacity="0.7" />
        </g>
        <g className="animate-[tear-stream_2s_ease-in-out_infinite_0.5s]">
          <path d="M88 138 Q87 143 88 148 Q89 143 88 138Z" fill="#60A5FA" opacity="0.5" />
        </g>

        {/* === SAD SYMBOLS floating away === */}
        <g className="animate-[sad-symbols_2s_ease-out]">
          <text x="130" y="75" fontSize="12" fill="#94a3b8" opacity="0.6">💔</text>
          <text x="145" y="60" fontSize="10" fill="#94a3b8" opacity="0.4">💸</text>
          <text x="155" y="45" fontSize="8" fill="#94a3b8" opacity="0.3">😢</text>
        </g>

        {/* === MOTION LINES (money being pulled) === */}
        <g className="animate-[motion-lines_1s_ease-out_infinite]">
          <line x1="112" y1="92" x2="105" y2="95" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <line x1="110" y1="98" x2="102" y2="100" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <line x1="114" y1="102" x2="108" y2="105" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
        </g>
      </svg>

      {/* Category badge */}
      <div className="absolute -right-2 top-4 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 shadow-md">
        <span className="text-lg">{categoryIcons[category] || "📦"}</span>
        <span className="text-xs font-semibold text-slate-600">{categoryLabels[category] || "Expense"}</span>
      </div>
    </div>
  );
}
