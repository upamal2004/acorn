"use client";

/**
 * Story-driven wallet update animation: Joyful Scrat drops coins into a piggy bank.
 * Clean, continuous motion.
 *
 * @param {number} amount - New balance amount
 */
export function ScratPiggyBank({ amount, size = 280 }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 280 280"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle pink glow background */}
        <defs>
          <radialGradient id="piggyGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(236,72,153,0.08)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="280" height="280" fill="url(#piggyGlow)" rx="16" />

        {/* Celebration sparkles */}
        <g className="animate-[sparkle-float_2s_ease-in-out_infinite]">
          <circle cx="35" cy="45" r="4" fill="#F59E0B" opacity="0.7" />
          <circle cx="245" cy="40" r="3.5" fill="#EC4899" opacity="0.6" />
          <circle cx="235" cy="100" r="3" fill="#F59E0B" opacity="0.5" />
          <circle cx="30" cy="110" r="3" fill="#EC4899" opacity="0.5" />
        </g>
        <g className="animate-[sparkle-float_2s_ease-in-out_infinite_0.5s]">
          <circle cx="65" cy="30" r="3" fill="#EC4899" opacity="0.5" />
          <circle cx="225" cy="30" r="3" fill="#F59E0B" opacity="0.4" />
        </g>

        {/* Ground shadow */}
        <ellipse cx="160" cy="255" rx="65" ry="8" fill="rgba(0,0,0,0.06)" />

        {/* === PIGGY BANK (center-right) === */}
        <g className="animate-[piggy-bounce_2s_ease-in-out_infinite]">
          {/* Piggy body */}
          <ellipse cx="165" cy="200" rx="55" ry="42" fill="#F9A8D4" />
          <ellipse cx="168" cy="204" rx="42" ry="30" fill="#FBCFE8" />

          {/* Piggy head */}
          <circle cx="215" cy="165" r="25" fill="#F9A8D4" />

          {/* Snout */}
          <ellipse cx="235" cy="170" rx="14" ry="11" fill="#F472B6" />
          <circle cx="232" cy="167" r="3" fill="#DB2777" />
          <circle cx="240" cy="167" r="3" fill="#DB2777" />

          {/* Eyes - happy squint */}
          <g>
            <path d="M207 158 Q213 153 219 158" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M221 158 Q227 153 233 158" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="208" cy="168" r="5" fill="#F472B6" opacity="0.4" />
          <circle cx="234" cy="175" r="4" fill="#F472B6" opacity="0.3" />

          {/* Ears */}
          <ellipse cx="200" cy="142" rx="10" ry="14" fill="#F9A8D4" transform="rotate(-15 200 142)" />
          <ellipse cx="200" cy="142" rx="7" ry="10" fill="#FBCFE8" transform="rotate(-15 200 142)" />
          <ellipse cx="222" cy="140" rx="10" ry="14" fill="#F9A8D4" transform="rotate(15 222 140)" />
          <ellipse cx="222" cy="140" rx="7" ry="10" fill="#FBCFE8" transform="rotate(15 222 140)" />

          {/* Coin slot on top */}
          <rect x="155" y="158" width="28" height="5" rx="2.5" fill="#DB2777" />

          {/* Legs */}
          <ellipse cx="125" cy="238" rx="10" ry="8" fill="#F9A8D4" />
          <ellipse cx="145" cy="238" rx="10" ry="8" fill="#F9A8D4" />
          <ellipse cx="175" cy="238" rx="10" ry="8" fill="#F9A8D4" />
          <ellipse cx="195" cy="238" rx="10" ry="8" fill="#F9A8D4" />

          {/* Curly tail */}
          <path d="M108 195 Q95 188 90 195 Q85 202 92 208 Q99 214 108 208" stroke="#F472B6" strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>

        {/* === COIN dropping into piggy bank (smooth continuous) === */}
        <g className="animate-[coin-drop_2.5s_ease-in-out_infinite]">
          <circle cx="169" cy="135" r="14" fill="#F59E0B" />
          <circle cx="169" cy="135" r="10" fill="#FBBF24" />
          <text x="169" y="139" fontSize="11" fill="#92400E" textAnchor="middle" fontWeight="bold">$</text>
          <ellipse cx="165" cy="131" rx="3" ry="4" fill="#FDE68A" opacity="0.6" />
        </g>

        {/* === SCRAT (dropping coin, celebrating) === */}
        <g className="animate-[scrat-celebrate_2s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="75" cy="200" rx="30" ry="22" fill="#C4956A" />
          <ellipse cx="78" cy="203" rx="20" ry="14" fill="#E8D4B8" />

          {/* Tail - raised and wagging */}
          <g className="origin-bottom animate-[tail-wag-fast_0.5s_ease-in-out_infinite]">
            <path d="M43 192 Q30 172 28 152 Q26 140 34 137 Q42 134 44 150 Q48 170 50 190" fill="#C4956A" />
          </g>

          {/* Head */}
          <ellipse cx="102" cy="165" rx="22" ry="18" fill="#C4956A" />

          {/* Ears - perked */}
          <g className="animate-[ears-excite_0.6s_ease-in-out_infinite_0.2s]">
            <ellipse cx="87" cy="143" rx="7" ry="11" fill="#C4956A" transform="rotate(-5 87 143)" />
            <ellipse cx="87" cy="143" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(-5 87 143)" />
            <ellipse cx="112" cy="143" rx="7" ry="11" fill="#C4956A" transform="rotate(5 112 143)" />
            <ellipse cx="112" cy="143" rx="4.5" ry="8" fill="#E8B4B4" transform="rotate(5 112 143)" />
          </g>

          {/* Snout */}
          <ellipse cx="120" cy="168" rx="11" ry="8" fill="#D4A882" />
          <circle cx="127" cy="167" r="3.5" fill="#3D2B1F" />

          {/* Eyes - happy squint */}
          <g>
            <path d="M92 160 Q98 155 104 160" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M106 160 Q112 155 118 160" stroke="#3D2B1F" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="90" cy="168" r="5" fill="#F59E0B" opacity="0.35" />
          <circle cx="122" cy="168" r="5" fill="#F59E0B" opacity="0.35" />

          {/* Big smile */}
          <path d="M98 178 Q108 188 120 178" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Front paw - dropping coin */}
          <g className="animate-[paw-drop_2s_ease-in-out_infinite]">
            <path d="M100 200 Q120 185 145 180" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
            <circle cx="145" cy="180" r="5.5" fill="#D4A882" />
          </g>

          {/* Back legs */}
          <path d="M55 220 Q48 232 44 238" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="44" cy="238" rx="6" ry="3.5" fill="#D4A882" />
          <path d="M65 220 Q58 232 54 238" stroke="#C4956A" strokeWidth="6" strokeLinecap="round" fill="none" />
          <ellipse cx="54" cy="238" rx="6" ry="3.5" fill="#D4A882" />
        </g>

        {/* === Coins popping out celebration === */}
        <g className="animate-[coins-pop_2s_ease-out_1.2s_both]">
          <circle cx="150" cy="148" r="7" fill="#F59E0B" opacity="0.6" className="animate-[money-float_2s_ease-in-out_infinite]" />
          <circle cx="175" cy="142" r="6" fill="#F59E0B" opacity="0.5" className="animate-[money-float_2s_ease-in-out_infinite_0.4s]" />
          <circle cx="162" cy="135" r="6.5" fill="#F59E0B" opacity="0.55" className="animate-[money-float_2s_ease-in-out_infinite_0.8s]" />
        </g>
      </svg>
    </div>
  );
}
