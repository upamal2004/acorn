"use client";

/**
 * Animated Scrat chasing a bouncing acorn.
 * Pure inline SVG -- no external assets required.
 * Used in the splash screen and loading states.
 */
export function ScratChasingAcorn({ size = 120, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 120 120"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ground line */}
        <line x1="10" y1="95" x2="110" y2="95" stroke="#d4a574" strokeWidth="2" strokeLinecap="round" opacity="0.4" />

        {/* Acorn (bouncing) */}
        <g className="origin-center animate-[acorn-bounce_1.4s_ease-in-out_infinite]">
          {/* Acorn cap */}
          <ellipse cx="78" cy="52" rx="10" ry="7" fill="#8B6914" />
          <rect x="76" y="44" width="4" height="6" rx="2" fill="#6B4F12" />
          {/* Acorn body */}
          <ellipse cx="78" cy="64" rx="9" ry="11" fill="#D4A03C" />
          {/* Acorn highlight */}
          <ellipse cx="76" cy="60" rx="3" ry="5" fill="#E8C060" opacity="0.6" />
          {/* Acorn face - worried */}
          <circle cx="75" cy="62" r="1" fill="#5C3D0E" />
          <circle cx="81" cy="62" r="1" fill="#5C3D0E" />
          <path d="M75 67 Q78 65 81 67" stroke="#5C3D0E" strokeWidth="0.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Scrat body */}
        <g className="origin-bottom-right animate-[scrat-run_0.6s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="40" cy="72" rx="16" ry="12" fill="#C4956A" />
          {/* Belly */}
          <ellipse cx="42" cy="74" rx="10" ry="8" fill="#E8D4B8" />

          {/* Head */}
          <ellipse cx="56" cy="60" rx="12" ry="10" fill="#C4956A" />

          {/* Ears */}
          <ellipse cx="50" cy="50" rx="4" ry="6" fill="#C4956A" />
          <ellipse cx="50" cy="50" rx="2.5" ry="4" fill="#E8B4B4" />
          <ellipse cx="62" cy="50" rx="4" ry="6" fill="#C4956A" />
          <ellipse cx="62" cy="50" rx="2.5" ry="4" fill="#E8B4B4" />

          {/* Snout */}
          <ellipse cx="64" cy="62" rx="6" ry="4" fill="#D4A882" />
          {/* Nose */}
          <circle cx="69" cy="61" r="2" fill="#3D2B1F" />
          {/* Eye - wide with excitement */}
          <circle cx="58" cy="57" r="3" fill="white" />
          <circle cx="59" cy="57" r="1.8" fill="#3D2B1F" />
          <circle cx="59.5" cy="56.5" r="0.6" fill="white" />

          {/* Mouth - determined grin */}
          <path d="M60 65 Q64 68 68 65" stroke="#3D2B1F" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Front legs - reaching for acorn */}
          <g className="origin-right animate-[scrat-reach_0.6s_ease-in-out_infinite]">
            <path d="M52 72 Q60 68 68 70" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Paws */}
            <circle cx="68" cy="70" r="3" fill="#D4A882" />
          </g>

          {/* Back legs - running */}
          <g className="origin-left animate-[scrat-kick_0.6s_ease-in-out_infinite]">
            <path d="M30 78 Q26 88 22 94" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="94" rx="4" ry="2.5" fill="#D4A882" />
          </g>
          <g className="origin-left animate-[scrat-kick_0.6s_ease-in-out_infinite_0.3s]">
            <path d="M36 78 Q32 88 28 94" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="28" cy="94" rx="4" ry="2.5" fill="#D4A882" />
          </g>

          {/* Tail - bushy, wagging */}
          <g className="origin-bottom animate-[scrat-tail_0.8s_ease-in-out_infinite]">
            <path d="M24 68 Q16 58 12 50 Q10 44 14 42 Q18 40 22 48 Q26 56 28 66" fill="#C4956A" />
            <path d="M22 64 Q18 56 16 50 Q15 46 17 45" stroke="#E8D4B8" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>
        </g>

        {/* Speed lines */}
        <g className="animate-[speed-fade_0.6s_ease-in-out_infinite]">
          <line x1="14" y1="70" x2="8" y2="70" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <line x1="12" y1="76" x2="4" y2="76" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <line x1="14" y1="82" x2="6" y2="82" stroke="#C4956A" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
        </g>

        {/* "!" excitement indicator */}
        <g className="animate-[excitement-pop_1.4s_ease-in-out_infinite]">
          <text x="68" y="46" fontSize="10" fontWeight="bold" fill="#D97706" textAnchor="middle">!</text>
        </g>
      </svg>
    </div>
  );
}
