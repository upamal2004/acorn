"use client";

/**
 * Story-driven wallet update animation: Joyful Scrat drops coins into a piggy bank,
 * celebrating the savings milestone with happy emojis.
 *
 * @param {number} amount - New balance amount
 */
export function ScratPiggyBank({ amount, size = 200 }) {
  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size + 40 }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Celebration sparkles */}
        <g className="animate-[sparkle_1.5s_ease-in-out_infinite]">
          <circle cx="25" cy="35" r="3" fill="#F59E0B" opacity="0.7" />
          <circle cx="175" cy="30" r="2.5" fill="#EC4899" opacity="0.6" />
          <circle cx="165" cy="75" r="2" fill="#F59E0B" opacity="0.5" />
          <circle cx="20" cy="85" r="2" fill="#EC4899" opacity="0.5" />
          <circle cx="100" cy="15" r="2" fill="#F59E0B" opacity="0.6" />
        </g>
        <g className="animate-[sparkle_1.5s_ease-in-out_infinite_0.4s]">
          <circle cx="40" cy="20" r="2" fill="#EC4899" opacity="0.5" />
          <circle cx="160" cy="20" r="2" fill="#F59E0B" opacity="0.4" />
          <circle cx="15" cy="55" r="1.5" fill="#F59E0B" opacity="0.4" />
        </g>

        {/* Ground */}
        <ellipse cx="100" cy="185" rx="90" ry="10" fill="#d4a574" opacity="0.3" />

        {/* === PIGGY BANK (center) === */}
        <g className="animate_[piggy-bounce_0.8s_ease-in-out_infinite]">
          {/* Piggy body */}
          <ellipse cx="115" cy="145" rx="40" ry="32" fill="#F9A8D4" />
          <ellipse cx="118" cy="148" rx="30" ry="22" fill="#FBCFE8" />

          {/* Piggy head */}
          <circle cx="155" cy="125" r="18" fill="#F9A8D4" />

          {/* Snout */}
          <ellipse cx="170" cy="128" rx="10" ry="8" fill="#F472B6" />
          <circle cx="168" cy="126" r="2" fill="#DB2777" />
          <circle cx="174" cy="126" r="2" fill="#DB2777" />

          {/* Eyes - happy */}
          <g>
            <path d="M148 120 Q152 116 156 120" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M158 120 Q162 116 166 120" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="150" cy="128" r="4" fill="#F472B6" opacity="0.4" />
          <circle cx="168" cy="132" r="3" fill="#F472B6" opacity="0.3" />

          {/* Ears */}
          <ellipse cx="145" cy="108" rx="8" ry="10" fill="#F9A8D4" transform="rotate(-15 145 108)" />
          <ellipse cx="145" cy="108" rx="5" ry="7" fill="#FBCFE8" transform="rotate(-15 145 108)" />
          <ellipse cx="162" cy="106" rx="8" ry="10" fill="#F9A8D4" transform="rotate(15 162 106)" />
          <ellipse cx="162" cy="106" rx="5" ry="7" fill="#FBCFE8" transform="rotate(15 162 106)" />

          {/* Coin slot on top */}
          <rect x="110" y="112" width="20" height="4" rx="2" fill="#DB2777" />

          {/* Legs */}
          <ellipse cx="90" cy="172" rx="8" ry="6" fill="#F9A8D4" />
          <ellipse cx="105" cy="172" rx="8" ry="6" fill="#F9A8D4" />
          <ellipse cx="125" cy="172" rx="8" ry="6" fill="#F9A8D4" />
          <ellipse cx="140" cy="172" rx="8" ry="6" fill="#F9A8D4" />

          {/* Curly tail */}
          <path d="M75 140 Q65 135 62 140 Q59 145 65 148 Q71 151 75 146" stroke="#F472B6" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>

        {/* === COIN dropping into piggy bank === */}
        <g className="animate_[coin-drop_2s_ease-in-out]">
          <circle cx="120" cy="100" r="10" fill="#F59E0B" />
          <circle cx="120" cy="100" r="7" fill="#FBBF24" />
          <text x="120" y="103" fontSize="8" fill="#92400E" textAnchor="middle" fontWeight="bold">$</text>
          {/* Coin shine */}
          <ellipse cx="117" cy="97" rx="2" ry="3" fill="#FDE68A" opacity="0.6" />
        </g>

        {/* === SCRAT (dropping coin, celebrating) === */}
        <g className="animate_[scrat-celebrate_0.6s_cubic-bezier(0.34,1.56,0.64,1)]">
          {/* Body */}
          <ellipse cx="55" cy="155" rx="22" ry="16" fill="#C4956A" />
          <ellipse cx="57" cy="157" rx="15" ry="10" fill="#E8D4B8" />

          {/* Tail - raised and wagging */}
          <g className="origin-bottom animate_[tail-wag_0.5s_ease-in-out_infinite]">
            <path d="M32 150 Q24 135 22 120 Q20 110 26 108 Q32 106 34 118 Q36 132 38 148" fill="#C4956A" />
          </g>

          {/* Head */}
          <ellipse cx="72" cy="135" rx="16" ry="13" fill="#C4956A" />

          {/* Ears - perked */}
          <ellipse cx="62" cy="118" rx="5" ry="8" fill="#C4956A" transform="rotate(-5 62 118)" />
          <ellipse cx="62" cy="118" rx="3" ry="6" fill="#E8B4B4" transform="rotate(-5 62 118)" />
          <ellipse cx="80" cy="118" rx="5" ry="8" fill="#C4956A" transform="rotate(5 80 118)" />
          <ellipse cx="80" cy="118" rx="3" ry="6" fill="#E8B4B4" transform="rotate(5 80 118)" />

          {/* Snout */}
          <ellipse cx="85" cy="137" rx="8" ry="6" fill="#D4A882" />
          <circle cx="90" cy="136" r="2.5" fill="#3D2B1F" />

          {/* Eyes - happy squint */}
          <path d="M66 132 Q70 128 74 132" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M76 132 Q80 128 84 132" stroke="#3D2B1F" strokeWidth="2.5" fill="none" strokeLinecap="round" />

          {/* Rosy cheeks */}
          <circle cx="64" cy="138" r="3.5" fill="#F59E0B" opacity="0.35" />
          <circle cx="86" cy="138" r="3.5" fill="#F59E0B" opacity="0.35" />

          {/* Big smile */}
          <path d="M72 142 Q78 148 86 142" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Front paw - dropping coin */}
          <g className="origin-center animate_[paw-drop_1s_ease-in-out]">
            <path d="M70 155 Q85 145 100 140" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
            <circle cx="100" cy="140" r="4" fill="#D4A882" />
          </g>

          {/* Back legs */}
          <path d="M42 168 Q38 178 35 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="35" cy="184" rx="5" ry="3" fill="#D4A882" />
          <path d="M50 168 Q46 178 43 184" stroke="#C4956A" strokeWidth="5" strokeLinecap="round" fill="none" />
          <ellipse cx="43" cy="184" rx="5" ry="3" fill="#D4A882" />
        </g>

        {/* === COINS coming out of piggy bank (celebration) === */}
        <g className="animate_[coins-pop_1.5s_ease-out_1s_both]">
          <circle cx="105" cy="108" r="5" fill="#F59E0B" opacity="0.6" className="animate_[float-money_2s_ease-in-out_infinite]" />
          <circle cx="125" cy="105" r="4" fill="#F59E0B" opacity="0.5" className="animate_[float-money_2s_ease-in-out_infinite_0.3s]" />
          <circle cx="115" cy="100" r="4.5" fill="#F59E0B" opacity="0.55" className="animate_[float-money_2s_ease-in-out_infinite_0.6s]" />
        </g>

        {/* === "SAVED!" TEXT === */}
        <g className="animate_[excitement-pop_2s_ease-in-out_infinite]">
          <text x="100" y="65" fontSize="12" fontWeight="bold" fill="#EC4899" textAnchor="middle" fontFamily="sans-serif">SAVED!</text>
        </g>
      </svg>

      {/* Status badge */}
      <div className="absolute -left-2 top-4 flex items-center gap-1.5 rounded-full bg-pink-100 px-3 py-1.5 shadow-md">
        <span className="text-lg">🐷</span>
        <span className="text-xs font-semibold text-pink-700">Balance updated!</span>
      </div>
    </div>
  );
}
