"use client";

/**
 * Wallet top-up: Same happy Scrat catching money, with coin-drops.
 * Mirrors ScratReceiving but with coin details for wallet context.
 */
export function ScratPiggyBank({ amount, size = 300 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="walletGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(245,158,11,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="300" height="300" fill="url(#walletGlow)" rx="20" />

        {/* Ground */}
        <ellipse cx="150" cy="275" rx="80" ry="10" fill="rgba(0,0,0,0.05)" />

        {/* === MONEY BILLS floating toward Scrat === */}
        <g className="animate-[money-fly-to-scrat_2s_ease-in-out_infinite]">
          <g className="animate-[money-sway_1.5s_ease-in-out_infinite]">
            <rect x="130" y="30" width="42" height="24" rx="4" fill="#22c55e" />
            <rect x="133" y="33" width="36" height="18" rx="3" fill="#4ade80" />
            <text x="151" y="46" fontSize="11" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
          </g>
        </g>
        <g className="animate-[money-fly-to-scrat_2s_ease-in-out_infinite_0.5s]">
          <g className="animate-[money-sway_1.5s_ease-in-out_infinite_0.3s]">
            <rect x="85" y="50" width="34" height="20" rx="3" fill="#22c55e" opacity="0.7" />
            <rect x="87" y="52" width="30" height="16" rx="2" fill="#4ade80" opacity="0.7" />
            <text x="102" y="64" fontSize="9" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
          </g>
        </g>

        {/* === COINS dropping === */}
        <g className="animate-[coin-drop_2s_ease-in-out_infinite_0.8s]">
          <circle cx="200" cy="55" r="12" fill="#F59E0B" />
          <circle cx="200" cy="55" r="8" fill="#FCD34D" />
          <text x="200" y="59" fontSize="11" fill="#92400E" textAnchor="middle" fontWeight="bold">₹</text>
        </g>
        <g className="animate-[coin-drop_2s_ease-in-out_infinite_1.3s]">
          <circle cx="90" cy="70" r="10" fill="#F59E0B" opacity="0.7" />
          <circle cx="90" cy="70" r="6.5" fill="#FCD34D" opacity="0.7" />
        </g>

        {/* === SCRAT (large, happy, catching money) === */}
        <g className="animate-[scrat-hop_2s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="150" cy="228" rx="42" ry="32" fill="#C4956A" />
          <ellipse cx="153" cy="232" rx="30" ry="22" fill="#E8D4B8" />
          <ellipse cx="155" cy="236" rx="18" ry="13" fill="#F0E0CC" opacity="0.6" />

          {/* Tail — raised, wagging */}
          <g className="origin-bottom-left animate-[tail-wag-fast_0.4s_ease-in-out_infinite]">
            <path d="M105 215 Q80 185 72 155 Q68 140 80 135 Q92 130 94 150 Q100 180 110 212" fill="#C4956A" />
            <path d="M100 200 Q85 172 80 155 Q77 143 85 140" stroke="#E8D4B8" strokeWidth="2.5" fill="none" opacity="0.4" />
          </g>

          {/* Head */}
          <ellipse cx="150" cy="170" rx="32" ry="26" fill="#C4956A" />

          {/* Ears — excited */}
          <g className="animate-[ears-excite_0.5s_ease-in-out_infinite]">
            <ellipse cx="124" cy="140" rx="10" ry="15" fill="#C4956A" transform="rotate(-8 124 140)" />
            <ellipse cx="124" cy="140" rx="6.5" ry="11" fill="#E8B4B4" transform="rotate(-8 124 140)" />
            <ellipse cx="176" cy="140" rx="10" ry="15" fill="#C4956A" transform="rotate(8 176 140)" />
            <ellipse cx="176" cy="140" rx="6.5" ry="11" fill="#E8B4B4" transform="rotate(8 176 140)" />
          </g>

          {/* Snout */}
          <ellipse cx="178" cy="175" rx="16" ry="12" fill="#D4A882" />
          <circle cx="188" cy="173" r="5" fill="#3D2B1F" />
          <circle cx="189" cy="172" r="1.5" fill="white" opacity="0.6" />

          {/* Happy squint eyes */}
          <path d="M133 162 Q141 154 149 162" stroke="#3D2B1F" strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M153 162 Q161 154 169 162" stroke="#3D2B1F" strokeWidth="4" fill="none" strokeLinecap="round" />

          {/* Rosy cheeks */}
          <circle cx="128" cy="175" r="7" fill="#F59E0B" opacity="0.3" />
          <circle cx="175" cy="175" r="7" fill="#F59E0B" opacity="0.3" />

          {/* Grin */}
          <path d="M140 190 Q155 205 172 190" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
          <rect x="150" y="192" width="3.5" height="6" rx="1.5" fill="white" />
          <rect x="157" y="192" width="3.5" height="6" rx="1.5" fill="white" />

          {/* Paws up catching */}
          <g className="animate-[paws-catch_2s_ease-in-out_infinite]">
            <path d="M118 225 Q108 200 100 185" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="100" cy="185" r="7" fill="#D4A882" />
            <path d="M182 225 Q192 200 200 185" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="200" cy="185" r="7" fill="#D4A882" />
          </g>

          {/* Back legs */}
          <path d="M115 255 Q105 268 98 275" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="98" cy="275" rx="8" ry="5" fill="#D4A882" />
          <path d="M140 255 Q130 268 123 275" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="123" cy="275" rx="8" ry="5" fill="#D4A882" />
        </g>

        {/* Pocket */}
        <rect x="135" y="218" width="24" height="16" rx="4" fill="#B8854A" stroke="#A07040" strokeWidth="1.5" />
        <rect x="139" y="222" width="16" height="3" rx="1.5" fill="#A07040" opacity="0.4" />

        {/* Sparkles */}
        <g className="animate-[sparkle-pop_1.5s_ease-out_1.5s_both]">
          <circle cx="70" cy="120" r="5" fill="#F59E0B" opacity="0.8" />
          <circle cx="230" cy="115" r="4.5" fill="#10B981" opacity="0.7" />
          <circle cx="90" cy="90" r="3.5" fill="#F59E0B" opacity="0.6" />
          <circle cx="210" cy="85" r="4" fill="#10B981" opacity="0.6" />
        </g>
        <g className="animate-[sparkle-pop_1.5s_ease-out_1.8s_both]">
          <circle cx="60" cy="150" r="3" fill="#F59E0B" opacity="0.5" />
          <circle cx="240" cy="145" r="3.5" fill="#10B981" opacity="0.5" />
        </g>
        <g className="animate-[sparkle-pop_1.5s_ease-out_2s_both]">
          <text x="55" y="130" fontSize="18" opacity="0.7">✨</text>
          <text x="230" y="100" fontSize="16" opacity="0.6">✨</text>
          <text x="140" y="60" fontSize="14" opacity="0.5">⭐</text>
        </g>
      </svg>
    </div>
  );
}
