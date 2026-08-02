"use client";

/**
 * Money Spent / Debt Paid: Cute front-facing squirrel crying
 * with exaggerated tear droplets as money floats away.
 */
export function ScratSpending({ amount, size = 300 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 300 320"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tearGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#D98E6B" />
            <stop offset="100%" stopColor="#C47A57" />
          </linearGradient>
          <linearGradient id="bellyGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#FFF5EE" />
            <stop offset="100%" stopColor="#F5E0D0" />
          </linearGradient>
          <linearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#D98E6B" />
            <stop offset="100%" stopColor="#B86B4A" />
          </linearGradient>
        </defs>

        {/* === FLUFFY TAIL (behind body) === */}
        <g className="origin-bottom-right animate-[tail-tremble_1.8s_ease-in-out_infinite]">
          <path
            d="M55 230 Q30 200 25 170 Q20 140 40 125 Q60 110 70 135 Q80 160 72 190 Q68 210 70 230"
            fill="url(#tailGrad)"
            stroke="#B86B4A"
            strokeWidth="1.5"
          />
          <path
            d="M60 220 Q40 195 38 170 Q35 148 50 138 Q62 130 68 150 Q74 170 70 195 Q68 210 70 225"
            fill="#E8A882"
            opacity="0.4"
          />
        </g>

        {/* === FRONT PAWS (behind body) === */}
        <g className="animate-[paws-desperate_1.5s_ease-in-out_infinite]">
          <path d="M118 240 Q110 225 108 215" stroke="#D98E6B" strokeWidth="10" strokeLinecap="round" fill="none" />
          <ellipse cx="108" cy="215" rx="8" ry="7" fill="#E8A882" />
          <path d="M182 240 Q190 225 192 215" stroke="#D98E6B" strokeWidth="10" strokeLinecap="round" fill="none" />
          <ellipse cx="192" cy="215" rx="8" ry="7" fill="#E8A882" />
        </g>

        {/* === BODY (round, cute, front-facing) === */}
        <ellipse cx="150" cy="248" rx="44" ry="36" fill="url(#bodyGrad)" />
        <ellipse cx="150" cy="252" rx="32" ry="26" fill="url(#bellyGrad)" />

        {/* === HEAD (large, round, cute) === */}
        <circle cx="150" cy="175" r="42" fill="url(#bodyGrad)" />

        {/* Cheek fluff */}
        <ellipse cx="122" cy="185" rx="14" ry="10" fill="#E8A882" opacity="0.5" />
        <ellipse cx="178" cy="185" rx="14" ry="10" fill="#E8A882" opacity="0.5" />

        {/* === EARS (tufted, cute) === */}
        <path d="M118 140 Q115 115 125 108 Q135 101 130 135" fill="#D98E6B" />
        <path d="M120 138 Q118 118 126 113 Q133 108 130 133" fill="#E8A882" opacity="0.6" />
        <path d="M182 140 Q185 115 175 108 Q165 101 170 135" fill="#D98E6B" />
        <path d="M180 138 Q182 118 174 113 Q167 108 170 133" fill="#E8A882" opacity="0.6" />
        {/* Ear tufts */}
        <path d="M122 115 L125 105 L128 115" fill="#C47A57" opacity="0.6" />
        <path d="M172 115 L175 105 L178 115" fill="#C47A57" opacity="0.6" />

        {/* === FACE === */}

        {/* Eyes — large, round, adorable */}
        <circle cx="134" cy="170" r="12" fill="white" />
        <circle cx="166" cy="170" r="12" fill="white" />

        {/* Pupils — big, dark, with shimmer */}
        <circle cx="136" cy="172" r="8" fill="#3D2B1F" />
        <circle cx="168" cy="172" r="8" fill="#3D2B1F" />

        {/* Eye highlights — big sparkle */}
        <circle cx="132" cy="167" r="3.5" fill="white" />
        <circle cx="164" cy="167" r="3.5" fill="white" />
        <circle cx="140" cy="175" r="1.8" fill="white" opacity="0.7" />
        <circle cx="172" cy="175" r="1.8" fill="white" opacity="0.7" />

        {/* Eyebrows — worried, angled down */}
        <path d="M122 155 Q130 149 142 155" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M158 155 Q170 149 178 155" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Nose — small, cute */}
        <ellipse cx="150" cy="188" rx="5" ry="4" fill="#6B3A2A" />
        <ellipse cx="150" cy="187" rx="2" ry="1.2" fill="#8B5E3C" opacity="0.5" />

        {/* Mouth — sad frown */}
        <path d="M140 198 Q145 194 150 198 Q155 194 160 198" stroke="#8B5E3C" strokeWidth="2.5" fill="none" strokeLinecap="round" />

        {/* Blush */}
        <circle cx="120" cy="188" r="8" fill="#F0A0A0" opacity="0.3" />
        <circle cx="180" cy="188" r="8" fill="#F0A0A0" opacity="0.3" />

        {/* === BACK LEGS === */}
        <path d="M120 275 Q115 290 108 298" stroke="#D98E6B" strokeWidth="9" strokeLinecap="round" fill="none" />
        <ellipse cx="108" cy="298" rx="9" ry="6" fill="#E8A882" />
        <path d="M180 275 Q185 290 192 298" stroke="#D98E6B" strokeWidth="9" strokeLinecap="round" fill="none" />
        <ellipse cx="192" cy="298" rx="9" ry="6" fill="#E8A882" />

        {/* === TEAR DROPS (exaggerated, cute) === */}
        <g className="animate-[tear-drop-left_1.2s_ease-in_out_infinite]">
          <ellipse cx="128" cy="190" rx="4" ry="7" fill="url(#tearGrad)" />
          <ellipse cx="128" cy="190" rx="2" ry="4" fill="white" opacity="0.4" />
        </g>
        <g className="animate-[tear-drop-right_1.2s_ease-in-out_infinite_0.3s]">
          <ellipse cx="172" cy="190" rx="3.5" ry="6" fill="url(#tearGrad)" opacity="0.8" />
          <ellipse cx="172" cy="190" rx="1.8" ry="3" fill="white" opacity="0.35" />
        </g>
        {/* Secondary tears */}
        <g className="animate-[tear-drop-left_1.2s_ease-in-out_infinite_0.6s]">
          <ellipse cx="124" cy="195" rx="3" ry="5" fill="url(#tearGrad)" opacity="0.5" />
        </g>
        <g className="animate-[tear-drop-right_1.2s_ease-in-out_infinite_0.9s]">
          <ellipse cx="176" cy="195" rx="2.5" ry="4.5" fill="url(#tearGrad)" opacity="0.45" />
        </g>

        {/* === MONEY FLOATING AWAY === */}
        <g className="animate-[money-float-away_1.4s_ease-in-out_infinite]">
          <g className="animate-[money-drift_1.2s_ease-in-out_infinite]">
            <rect x="130" y="55" width="44" height="26" rx="4" fill="#22c55e" />
            <rect x="133" y="58" width="38" height="20" rx="3" fill="#4ade80" />
            <text x="152" y="72" fontSize="12" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            <line x1="136" y1="64" x2="168" y2="64" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
            <line x1="136" y1="69" x2="168" y2="69" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
          </g>
        </g>

        {/* === Sad symbols floating up === */}
        <g className="animate-[sad-float_1.4s_ease-out_infinite]">
          <text x="88" y="100" fontSize="18" opacity="0.5">💔</text>
        </g>
        <g className="animate-[sad-float_1.4s_ease-out_infinite_0.4s]">
          <text x="200" y="90" fontSize="14" opacity="0.35">💸</text>
        </g>
        <g className="animate-[sad-float_1.4s_ease-out_infinite_0.8s]">
          <text x="168" y="75" fontSize="12" opacity="0.25">😢</text>
        </g>
      </svg>
    </div>
  );
}
