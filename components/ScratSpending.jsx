"use client";

/**
 * Money Spent / Debt Paid: Large sad Scrat watches helplessly as money
 * floats up and drifts away into the distance. No fishing rod — just a
 * clean, emotional floating-away motion.
 */
export function ScratSpending({ amount, size = 300 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 300 300"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Vignette background */}
        <defs>
          <radialGradient id="vignette" cx="50%" cy="55%" r="55%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.12)" />
          </radialGradient>
          <linearGradient id="tearGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <rect width="300" height="300" fill="url(#vignette)" rx="20" />

        {/* Ground */}
        <ellipse cx="150" cy="275" rx="90" ry="10" fill="rgba(0,0,0,0.06)" />

        {/* === MONEY BILL floating away === */}
        <g className="animate-[money-float-away_3s_ease-in_out_infinite]">
          <g className="animate-[money-drift_2s_ease-in-out_infinite]">
            <rect x="130" y="60" width="44" height="26" rx="4" fill="#22c55e" />
            <rect x="133" y="63" width="38" height="20" rx="3" fill="#4ade80" />
            <text x="152" y="77" fontSize="12" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            <line x1="136" y1="69" x2="168" y2="69" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
            <line x1="136" y1="74" x2="168" y2="74" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
            <line x1="136" y1="79" x2="168" y2="79" stroke="#22c55e" strokeWidth="0.8" opacity="0.4" />
          </g>
        </g>

        {/* === SCRAT (large, sad, watching money leave) === */}
        <g className="animate-[scrat-sad-lean_3s_ease-in-out_infinite]">
          {/* Body — large and round */}
          <ellipse cx="150" cy="228" rx="42" ry="32" fill="#C4956A" />
          <ellipse cx="153" cy="232" rx="30" ry="22" fill="#E8D4B8" />

          {/* Belly patch */}
          <ellipse cx="155" cy="236" rx="18" ry="13" fill="#F0E0CC" opacity="0.6" />

          {/* Tail — drooping, trembling */}
          <g className="origin-bottom-right animate-[tail-tremble_2s_ease-in-out_infinite]">
            <path d="M105 215 Q85 195 78 172 Q73 155 82 150 Q91 145 93 162 Q98 185 108 212" fill="#C4956A" />
            <path d="M100 200 Q88 180 84 168 Q81 158 87 156" stroke="#E8D4B8" strokeWidth="2.5" fill="none" opacity="0.4" />
          </g>

          {/* Head — large */}
          <ellipse cx="150" cy="170" rx="32" ry="26" fill="#C4956A" />

          {/* Ears — flattened back in distress */}
          <ellipse cx="124" cy="142" rx="10" ry="15" fill="#C4956A" transform="rotate(-25 124 142)" />
          <ellipse cx="124" cy="142" rx="6.5" ry="11" fill="#E8B4B4" transform="rotate(-25 124 142)" />
          <ellipse cx="176" cy="142" rx="10" ry="15" fill="#C4956A" transform="rotate(20 176 142)" />
          <ellipse cx="176" cy="142" rx="6.5" ry="11" fill="#E8B4B4" transform="rotate(20 176 142)" />

          {/* Inner ear pink */}
          <ellipse cx="124" cy="142" rx="4" ry="7" fill="#F0B4B4" transform="rotate(-25 124 142)" opacity="0.5" />
          <ellipse cx="176" cy="142" rx="4" ry="7" fill="#F0B4B4" transform="rotate(20 176 142)" opacity="0.5" />

          {/* Snout */}
          <ellipse cx="178" cy="175" rx="16" ry="12" fill="#D4A882" />
          <circle cx="188" cy="173" r="5" fill="#3D2B1F" />
          <circle cx="189" cy="172" r="1.5" fill="white" opacity="0.6" />

          {/* Eyes — wide with shock */}
          <ellipse cx="138" cy="164" rx="9" ry="10" fill="white" />
          <circle cx="141" cy="163" r="5" fill="#3D2B1F" />
          <circle cx="142.5" cy="161.5" r="2" fill="white" />
          <ellipse cx="162" cy="164" rx="9" ry="10" fill="white" />
          <circle cx="164" cy="163" r="5" fill="#3D2B1F" />
          <circle cx="165.5" cy="161.5" r="2" fill="white" />

          {/* Eyebrows — worried */}
          <path d="M127 152 Q135 146 145 152" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M155 152 Q165 146 173 152" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Mouth — open gasp */}
          <ellipse cx="168" cy="192" rx="9" ry="7" fill="#8B4513" />
          <ellipse cx="168" cy="191" rx="6.5" ry="4.5" fill="#D4A882" opacity="0.25" />

          {/* Teeth */}
          <rect x="162" y="186" width="3" height="5" rx="1" fill="white" />
          <rect x="168" y="186" width="3" height="5" rx="1" fill="white" />

          {/* Front paws — reaching up desperately */}
          <g className="animate-[paws-desperate_3s_ease-in-out_infinite]">
            <path d="M125 225 Q115 205 110 190" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="110" cy="190" r="7" fill="#D4A882" />
            <path d="M175 225 Q185 205 190 190" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="190" cy="190" r="7" fill="#D4A882" />
          </g>

          {/* Back legs — buckling */}
          <path d="M115 255 Q105 268 98 275" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="98" cy="275" rx="8" ry="5" fill="#D4A882" />
          <path d="M140 255 Q130 268 123 275" stroke="#C4956A" strokeWidth="8" strokeLinecap="round" fill="none" />
          <ellipse cx="123" cy="275" rx="8" ry="5" fill="#D4A882" />
        </g>

        {/* === TEARS === */}
        <g className="animate-[tears-continuous_2.5s_ease-in-out_infinite]">
          <ellipse cx="135" cy="178" rx="3" ry="5" fill="url(#tearGrad)" />
        </g>
        <g className="animate-[tears-continuous_2.5s_ease-in-out_infinite_0.7s]">
          <ellipse cx="165" cy="178" rx="2.5" ry="4" fill="url(#tearGrad)" opacity="0.7" />
        </g>

        {/* === Sad symbols floating up === */}
        <g className="animate-[sad-float_3s_ease-out_infinite]">
          <text x="90" y="100" fontSize="20" opacity="0.5">💔</text>
        </g>
        <g className="animate-[sad-float_3s_ease-out_infinite_1s]">
          <text x="200" y="85" fontSize="16" opacity="0.35">💸</text>
        </g>
        <g className="animate-[sad-float_3s_ease-out_infinite_2s]">
          <text x="170" y="70" fontSize="14" opacity="0.25">😢</text>
        </g>
      </svg>
    </div>
  );
}
