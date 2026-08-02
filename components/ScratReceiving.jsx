"use client";

/**
 * Story-driven receiving animation: Triumphant Scrat uses a fishing rod to pull
 * a banknote towards himself, followed by celebration effects.
 *
 * @param {number} amount - Amount being received
 * @param {string} [label] - Optional label (e.g., "Debt settled!")
 */
export function ScratReceiving({ amount, label = "Money received!", size = 200 }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + 40 }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Celebration sparkles in background */}
        <g className="animate-[sparkle_1.5s_ease-in-out_infinite]">
          <circle cx="30" cy="40" r="3" fill="#F59E0B" opacity="0.6" />
          <circle cx="170" cy="35" r="2.5" fill="#10B981" opacity="0.5" />
          <circle cx="160" cy="70" r="2" fill="#F59E0B" opacity="0.4" />
          <circle cx="25" cy="80" r="2" fill="#10B981" opacity="0.5" />
        </g>
        <g className="animate-[sparkle_1.5s_ease-in-out_infinite_0.5s]">
          <circle cx="45" cy="25" r="2" fill="#F59E0B" opacity="0.4" />
          <circle cx="155" cy="25" r="2.5" fill="#10B981" opacity="0.6" />
          <circle cx="20" cy="60" r="1.5" fill="#F59E0B" opacity="0.3" />
        </g>

        {/* Glow ring */}
        <circle cx="100" cy="100" r="70" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.2" className="animate-[glow-pulse_2s_ease-in-out_infinite]" />

        {/* Ground */}
        <ellipse cx="100" cy="185" rx="90" ry="10" fill="#d4a574" opacity="0.3" />

        {/* === FISHING LINE & HOOK (held by Scrat) === */}
        <g className="origin-bottom-left animate_[rod-cast_1s_ease-out]">
          {/* Fishing rod */}
          <path d="M55 150 Q65 130 80 115 Q95 100 110 95" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Fishing line */}
          <path d="M110 95 Q120 85 130 80" stroke="#94a3b8" strokeWidth="1" fill="none" strokeDasharray="4 2" className="animate-[line-taut_0.8s_ease-out]" />

          {/* Hook */}
          <g className="animate-[hook-catch_0.5s_ease-out_0.8s_both]">
            <path d="M128 78 L130 88 Q135 95 130 98 Q125 95 128 88 Z" fill="#64748b" />
            <circle cx="130" cy="76" r="2" fill="#64748b" />
          </g>
        </g>

        {/* === MONEY/BANKNOTE being pulled toward Scrat === */}
        <g className="animate-[money-reel-in_1.5s_ease-out_0.5s_both]">
          <g className="animate-[money-happy-flutter_0.6s_ease-in-out_infinite]">
            {/* Banknote */}
            <rect x="125" y="68" width="28" height="16" rx="2" fill="#22c55e" />
            <rect x="127" y="70" width="24" height="12" rx="1" fill="#4ade80" />
            {/* Currency symbol */}
            <text x="139" y="79" fontSize="8" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            {/* Bill details */}
            <line x1="129" y1="72" x2="151" y2="72" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
            <line x1="129" y1="76" x2="151" y2="76" stroke="#22c55e" strokeWidth="0.5" opacity="0.5" />
          </g>
        </g>

        {/* === SCRAT (triumphant, reeling in money) === */}
        <g className="animate_[scrat-victory_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
          {/* Body */}
          <ellipse cx="45" cy="155" rx="22" ry="16" fill="#C4956A" />
          <ellipse cx="47" cy="157" rx="15" ry="10" fill="#E8D4B8" />

          {/* Tail - raised high, wagging */}
          <g className="origin-bottom animate_[tail-wag_0.4s_ease-in-out_infinite]">
            <path d="M22 150 Q14 135 12 120 Q10 110 16 108 Q22 106 24 118 Q26 132 28 148" fill="#C4956A" />
            <path d="M20 140 Q16 128 15 120 Q14 115 17 114" stroke="#E8D4B8" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>

          {/* Head */}
          <ellipse cx="62" cy="135" rx="16" ry="13" fill="#C4956A" />

          {/* Ears - perked up */}
          <g className="origin-bottom animate_[ears-perk_0.6s_ease-in-out_infinite_0.2s]">
            <ellipse cx="52" cy="118" rx="5" ry="8" fill="#C4956A" transform="rotate(-5 52 118)" />
            <ellipse cx="52" cy="118" rx="3" ry="6" fill="#E8B4B4" transform="rotate(-5 52 118)" />
            <ellipse cx="70" cy="118" rx="5" ry="8" fill="#C4956A" transform="rotate(5 70 118)" />
            <ellipse cx="70" cy="118" rx="3" ry="6" fill="#E8B4B4" transform="rotate(5 70 118)" />
          </g>

          {/* Snout */}
          <ellipse cx="75" cy="137" rx="8" ry="6" fill="#D4A882" />
          <circle cx="80" cy="136" r="2.5" fill="#3D2B1F" />

          {/* Eyes - squinting with joy */}
          <g>
            <path d="M56 132 Q60 128 64 132" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M66 132 Q70 128 74 132" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="54" cy="138" r="3.5" fill="#F59E0B" opacity="0.35" />
          <circle cx="76" cy="138" r="3.5" fill="#F59E0B" opacity="0.35" />

          {/* Big triumphant grin */}
          <path d="M64 142 Q70 148 78 142" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Teeth */}
          <line x1="68" y1="143" x2="68" y2="146" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="74" y1="143" x2="74" y2="146" stroke="white" strokeWidth="1.2" strokeLinecap="round" />

          {/* Front paws - holding rod triumphantly */}
          <g className="origin-center animate_[pump-fist_0.8s_ease-in-out_infinite]">
            <circle cx="55" cy="155" r="4.5" fill="#D4A882" />
            <circle cx="65" cy="152" r="4.5" fill="#D4A882" />
          </g>

          {/* Back legs - standing strong */}
          <path d="M32 168 Q28 178 25 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="25" cy="184" rx="5" ry="3" fill="#D4A882" />
          <path d="M40 168 Q36 178 33 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="33" cy="184" rx="5" ry="3" fill="#D4A882" />
        </g>

        {/* === GLOWING MONEY NOTES (celebration) === */}
        <g className="animate_[money-celebrate_1.5s_ease-out_1s_both]">
          {/* Floating money */}
          <g className="animate_[float-money_2s_ease-in-out_infinite]">
            <rect x="15" y="60" width="16" height="10" rx="1.5" fill="#22c55e" opacity="0.6" />
            <text x="23" y="67" fontSize="5" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
          </g>
          <g className="animate_[float-money_2s_ease-in-out_infinite_0.5s]">
            <rect x="165" y="50" width="16" height="10" rx="1.5" fill="#22c55e" opacity="0.5" />
            <text x="173" y="57" fontSize="5" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
          </g>
          <g className="animate_[float-money_2s_ease-in-out_infinite_1s]">
            <rect x="90" y="30" width="18" height="11" rx="1.5" fill="#22c55e" opacity="0.7" />
            <text x="99" y="38" fontSize="5" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
          </g>
        </g>

        {/* === "YES!" TEXT === */}
        <g className="animate_[excitement-pop_2s_ease-in-out_infinite]">
          <text x="85" y="105" fontSize="14" fontWeight="bold" fill="#10B981" textAnchor="middle" fontFamily="sans-serif">YES!</text>
        </g>
      </svg>

      {/* Status badge */}
      <div className="absolute -left-1 top-4 flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1.5 shadow-md">
        <span className="text-lg">🎉</span>
        <span className="text-xs font-semibold text-emerald-700">{label}</span>
      </div>
    </div>
  );
}
