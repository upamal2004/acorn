"use client";

/**
 * Story-driven spending animation: Sad Scrat watches helplessly as a fishing hook
 * pulls his precious money away into the distance. Clean, continuous motion.
 *
 * @param {number} amount - Amount being spent
 */
export function ScratSpending({ amount, size = 280 }) {
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
          <radialGradient id="vignette" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.15)" />
          </radialGradient>
        </defs>
        <rect width="280" height="280" fill="url(#vignette)" rx="16" />

        {/* Ground shadow */}
        <ellipse cx="100" cy="255" rx="60" ry="8" fill="rgba(0,0,0,0.08)" />

        {/* === FISHING LINE & ROD (continuous pull motion) === */}
        <g>
          {/* Rod tip (off-screen top-right) */}
          <path d="M240 -20 Q220 30 200 70" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Main fishing line - smooth curve */}
          <path
            d="M200 70 Q180 110 160 140"
            stroke="#94a3b8"
            strokeWidth="1.2"
            fill="none"
            strokeDasharray="6 3"
            className="origin-top-right animate-[line-pull_3s_ease-in-out_infinite]"
          />

          {/* Hook assembly */}
          <g className="origin-top-right animate-[hook-pull_3s_cubic-bezier(0.4,0,0.2,1)_infinite]">
            {/* Hook shank */}
            <line x1="158" y1="138" x2="155" y2="155" stroke="#64748b" strokeWidth="2" strokeLinecap="round" />
            {/* Hook bend */}
            <path d="M150 155 Q145 165 150 170 Q158 172 160 165" stroke="#64748b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Hook point */}
            <circle cx="160" cy="163" r="1.5" fill="#64748b" />
          </g>
        </g>

        {/* === MONEY BILL being pulled away (continuous smooth motion) === */}
        <g className="animate-[money-pull-away_3s_cubic-bezier(0.4,0,0.2,1)_infinite]">
          <g className="animate-[money-bill-wave_2s_ease-in-out_infinite]">
            {/* Bill body */}
            <rect x="140" y="120" width="40" height="22" rx="3" fill="#22c55e" />
            <rect x="143" y="123" width="34" height="16" rx="2" fill="#4ade80" />
            {/* Currency marking */}
            <text x="160" y="135" fontSize="10" fill="#166534" textAnchor="middle" fontWeight="bold">Rs</text>
            {/* Bill lines */}
            <line x1="145" y1="127" x2="175" y2="127" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
            <line x1="145" y1="131" x2="175" y2="131" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
            <line x1="145" y1="135" x2="175" y2="135" stroke="#22c55e" strokeWidth="0.7" opacity="0.5" />
          </g>
          {/* Motion blur lines */}
          <g className="animate-[motion-blur_1s_ease-in-out_infinite]">
            <line x1="135" y1="128" x2="120" y2="132" stroke="#4ade80" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
            <line x1="133" y1="134" x2="115" y2="137" stroke="#4ade80" strokeWidth="0.8" opacity="0.2" strokeLinecap="round" />
          </g>
        </g>

        {/* === SCRAT (sad, watching money leave) === */}
        <g className="animate-[scrat-sad-lean_3s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="90" cy="220" rx="30" ry="22" fill="#C4956A" />
          <ellipse cx="93" cy="223" rx="20" ry="14" fill="#E8D4B8" />

          {/* Tail - drooping, trembling */}
          <g className="origin-bottom-left animate-[tail-tremble_2s_ease-in-out_infinite]">
            <path d="M58 212 Q45 195 40 178 Q36 165 42 162 Q48 159 50 172 Q54 190 60 210" fill="#C4956A" />
            <path d="M55 200 Q48 185 46 175 Q44 168 48 167" stroke="#E8D4B8" strokeWidth="2" fill="none" opacity="0.4" />
          </g>

          {/* Head */}
          <ellipse cx="115" cy="185" rx="22" ry="18" fill="#C4956A" />

          {/* Ears - flattened back in distress */}
          <g>
            <ellipse cx="100" cy="165" rx="7" ry="11" fill="#C4956A" transform="rotate(-20 100 165)" />
            <ellipse cx="100" cy="165" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(-20 100 165)" />
            <ellipse cx="125" cy="165" rx="7" ry="11" fill="#C4956A" transform="rotate(15 125 165)" />
            <ellipse cx="125" cy="165" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(15 125 165)" />
          </g>

          {/* Snout */}
          <ellipse cx="132" cy="188" rx="11" ry="8" fill="#D4A882" />
          <circle cx="140" cy="187" r="3.5" fill="#3D2B1F" />

          {/* Eyes - wide with shock, looking up at money */}
          <g>
            <ellipse cx="112" cy="180" rx="6" ry="7" fill="white" />
            <circle cx="114" cy="179" r="3" fill="#3D2B1F" />
            <circle cx="115" cy="178" r="1.2" fill="white" />
            {/* Sad eyebrow */}
            <path d="M104 172 Q109 168 116 173" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Mouth - agape in shock */}
          <ellipse cx="135" cy="198" rx="6" ry="4.5" fill="#8B4513" />
          <ellipse cx="135" cy="197" rx="4.5" ry="3" fill="#D4A882" opacity="0.3" />

          {/* Fangs */}
          <path d="M131 195 L130 200" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M139 195 L140 200" stroke="white" strokeWidth="1.5" strokeLinecap="round" />

          {/* Front paws - reaching desperately toward money */}
          <g className="animate-[paws-desperate_3s_ease-in-out_infinite]">
            <path d="M110 220 Q130 208 150 212" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="150" cy="212" r="5" fill="#D4A882" />
          </g>

          {/* Back legs - buckling */}
          <path d="M72 240 Q65 252 60 258" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="60" cy="258" rx="6" ry="3.5" fill="#D4A882" />
          <path d="M80 240 Q73 252 68 258" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="68" cy="258" rx="6" ry="3.5" fill="#D4A882" />
        </g>

        {/* === TEARS streaming down === */}
        <g className="animate-[tears-continuous_3s_ease-in-out_infinite]">
          <path d="M108 186 Q106 195 108 204 Q110 195 108 186Z" fill="#60A5FA" opacity="0.7" />
        </g>
        <g className="animate-[tears-continuous_3s_ease-in-out_infinite_0.8s]">
          <path d="M118 188 Q116 197 118 206 Q120 197 118 188Z" fill="#60A5FA" opacity="0.5" />
        </g>

        {/* === Shock/sadness symbols === */}
        <g className="animate-[sad-float_3s_ease-out_infinite]">
          <text x="170" y="100" fontSize="16" fill="#94a3b8" opacity="0.5">💔</text>
          <text x="190" y="80" fontSize="12" fill="#94a3b8" opacity="0.3">💸</text>
          <text x="210" y="60" fontSize="10" fill="#94a3b8" opacity="0.2">😢</text>
        </g>
      </svg>
    </div>
  );
}
