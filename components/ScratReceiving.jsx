"use client";

/**
 * Story-driven receiving animation: Triumphant Scrat uses a fishing rod to pull
 * a banknote towards himself. Clean, continuous motion.
 *
 * @param {number} amount - Amount being received
 * @param {string} [label] - Optional label (e.g., "Debt settled!")
 */
export function ScratReceiving({ amount, label = "Money received!", size = 280 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 280 280"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="glowBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(16,185,129,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="280" height="280" fill="url(#glowBg)" rx="16" />

        {/* Celebration sparkles */}
        <g className="animate-[sparkle-float_2s_ease-in-out_infinite]">
          <circle cx="30" cy="40" r="4" fill="#F59E0B" opacity="0.6" />
          <circle cx="250" cy="35" r="3.5" fill="#10B981" opacity="0.5" />
          <circle cx="240" cy="90" r="3" fill="#F59E0B" opacity="0.4" />
          <circle cx="25" cy="100" r="3" fill="#10B981" opacity="0.5" />
        </g>
        <g className="animate-[sparkle-float_2s_ease-in-out_infinite_0.5s]">
          <circle cx="55" cy="25" r="3" fill="#F59E0B" opacity="0.4" />
          <circle cx="235" cy="25" r="3.5" fill="#10B981" opacity="0.6" />
          <circle cx="20" cy="70" r="2.5" fill="#F59E0B" opacity="0.3" />
        </g>

        {/* Ground shadow */}
        <ellipse cx="95" cy="255" rx="60" ry="8" fill="rgba(0,0,0,0.06)" />

        {/* === FISHING ROD & LINE (held by Scrat) === */}
        <g>
          {/* Rod - held at angle */}
          <path
            d="M80 215 Q100 180 130 150 Q160 120 190 100"
            stroke="#8B4513"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            className="animate-[rod-sway_3s_ease-in-out_infinite]"
          />

          {/* Line - taut, pulling in */}
          <path
            d="M190 100 Q200 85 210 75"
            stroke="#94a3b8"
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="5 2"
            className="animate-[line-reel_3s_linear_infinite]"
          />

          {/* Hook */}
          <g className="animate-[hook-catch_3s_ease-in-out_infinite]">
            <path d="M208 73 L210 85 Q215 92 210 95 Q205 92 208 85 Z" fill="#64748b" />
            <circle cx="210" cy="71" r="2.5" fill="#64748b" />
          </g>
        </g>

        {/* === MONEY BILL being reeled in (continuous smooth motion) === */}
        <g className="animate-[money-reel_3s_cubic-bezier(0.4,0,0.2,1)_infinite]">
          <g className="animate-[money-bill-wave_2s_ease-in-out_infinite]">
            {/* Bill body */}
            <rect x="195" y="55" width="44" height="24" rx="3" fill="#22c55e" />
            <rect x="198" y="58" width="38" height="18" rx="2" fill="#4ade80" />
            {/* Currency marking */}
            <text x="217" y="71" fontSize="11" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            {/* Bill details */}
            <line x1="200" y1="62" x2="234" y2="62" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
            <line x1="200" y1="67" x2="234" y2="67" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
            <line x1="200" y1="72" x2="234" y2="72" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
          </g>
        </g>

        {/* === SCRAT (triumphant, reeling in money) === */}
        <g className="animate-[scrat-reel_3s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="75" cy="220" rx="30" ry="22" fill="#C4956A" />
          <ellipse cx="78" cy="223" rx="20" ry="14" fill="#E8D4B8" />

          {/* Tail - raised high, wagging */}
          <g className="origin-bottom animate-[tail-wag-fast_0.4s_ease-in-out_infinite]">
            <path d="M43 212 Q30 190 28 168 Q26 155 34 152 Q42 149 44 164 Q48 185 50 210" fill="#C4956A" />
            <path d="M40 198 Q34 178 33 168 Q32 160 36 158" stroke="#E8D4B8" strokeWidth="2" fill="none" opacity="0.4" />
          </g>

          {/* Head */}
          <ellipse cx="100" cy="185" rx="22" ry="18" fill="#C4956A" />

          {/* Ears - perked up with excitement */}
          <g className="animate-[ears-excite_0.6s_ease-in-out_infinite_0.2s]">
            <ellipse cx="85" cy="163" rx="7" ry="11" fill="#C4956A" transform="rotate(-5 85 163)" />
            <ellipse cx="85" cy="163" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(-5 85 163)" />
            <ellipse cx="110" cy="163" rx="7" ry="11" fill="#C4956A" transform="rotate(5 110 163)" />
            <ellipse cx="110" cy="163" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(5 110 163)" />
          </g>

          {/* Snout */}
          <ellipse cx="118" cy="188" rx="11" ry="8" fill="#D4A882" />
          <circle cx="125" cy="187" r="3.5" fill="#3D2B1F" />

          {/* Eyes - squinting with joy */}
          <g>
            <path d="M92 180 Q98 175 104 180" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M106 180 Q112 175 118 180" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="88" cy="188" r="5" fill="#F59E0B" opacity="0.35" />
          <circle cx="120" cy="188" r="5" fill="#F59E0B" opacity="0.35" />

          {/* Big triumphant grin */}
          <path d="M100 198 Q110 208 122 198" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Teeth */}
          <line x1="106" y1="200" x2="106" y2="204" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="116" y1="200" x2="116" y2="204" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

          {/* Front paws - gripping rod triumphantly */}
          <g className="animate-[paws-grip_3s_ease-in-out_infinite]">
            <circle cx="88" cy="218" r="6" fill="#D4A882" />
            <circle cx="100" cy="215" r="6" fill="#D4A882" />
          </g>

          {/* Back legs - standing strong */}
          <path d="M55 240 Q48 252 44 258" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="44" cy="258" rx="6" ry="3.5" fill="#D4A882" />
          <path d="M65 240 Q58 252 54 258" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="54" cy="258" rx="6" ry="3.5" fill="#D4A882" />
        </g>

        {/* === Floating money celebration === */}
        <g className="animate-[money-float_2.5s_ease-in-out_infinite]">
          <rect x="15" y="80" width="20" height="12" rx="2" fill="#22c55e" opacity="0.5" />
          <text x="25" y="89" fontSize="6" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
        </g>
        <g className="animate-[money-float_2.5s_ease-in-out_infinite_0.7s]">
          <rect x="245" y="70" width="20" height="12" rx="2" fill="#22c55e" opacity="0.4" />
          <text x="255" y="79" fontSize="6" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
        </g>
        <g className="animate-[money-float_2.5s_ease-in-out_infinite_1.4s]">
          <rect x="130" y="40" width="22" height="13" rx="2" fill="#22c55e" opacity="0.6" />
          <text x="141" y="50" fontSize="6" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
        </g>
      </svg>
    </div>
  );
}
