"use client";

/**
 * Scrat-inspired happy/victorious reaction -- shown when receiving money.
 * Saber-toothed squirrel triumphantly holding his precious acorn!
 * Pure inline SVG with celebratory animations.
 */
export function AcornHappy({ size = 80, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[scrat-victory_0.6s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* Sparkles around Scrat */}
        <g className="animate-[sparkle_1.2s_ease-in-out_infinite]">
          <path d="M15 25 L17 20 L19 25 L17 30Z" fill="#F59E0B" opacity="0.8" />
          <path d="M80 18 L81.5 14 L83 18 L81.5 22Z" fill="#10B981" opacity="0.7" />
          <path d="M85 40 L87 37 L89 40 L87 43Z" fill="#F59E0B" opacity="0.6" />
        </g>
        <g className="animate-[sparkle_1.2s_ease-in-out_infinite_0.4s]">
          <path d="M10 45 L12 42 L14 45 L12 48Z" fill="#10B981" opacity="0.7" />
          <path d="M78 28 L80 25 L82 28 L80 31Z" fill="#F59E0B" opacity="0.5" />
        </g>

        {/* Glow ring */}
        <circle cx="50" cy="50" r="35" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.2" className="animate-[glow-pulse_2s_ease-in-out_infinite]" />

        {/* Scrat body - celebrating */}
        <g className="origin-bottom animate-[scrat-bounce_0.8s_ease-in-out_infinite]">
          {/* Body */}
          <ellipse cx="45" cy="62" rx="18" ry="14" fill="#C4956A" />
          {/* Belly */}
          <ellipse cx="47" cy="64" rx="12" ry="9" fill="#E8D4B8" />

          {/* Bushy tail - raised high, wagging */}
          <g className="origin-bottom animate-[tail-wag_0.5s_ease-in-out_infinite]">
            <path d="M24 58 Q18 46 16 36 Q14 28 18 26 Q22 24 24 32 Q26 42 28 56" fill="#C4956A" />
            <path d="M22 50 Q18 42 17 36 Q16 32 18 31" stroke="#E8D4B8" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>

          {/* Head - triumphant */}
          <ellipse cx="58" cy="46" rx="14" ry="12" fill="#C4956A" />

          {/* Pointy ears - perked up with excitement */}
          <g className="origin-bottom animate-[ears-perk_0.5s_ease-out_infinite_0.2s]">
            <ellipse cx="50" cy="34" rx="4" ry="7" fill="#C4956A" transform="rotate(-10 50 34)" />
            <ellipse cx="50" cy="34" rx="2.5" ry="5" fill="#E8B4B4" transform="rotate(-10 50 34)" />
            <ellipse cx="64" cy="34" rx="4" ry="7" fill="#C4956A" transform="rotate(10 64 34)" />
            <ellipse cx="64" cy="34" rx="2.5" ry="5" fill="#E8B4B4" transform="rotate(10 64 34)" />
          </g>

          {/* Snout */}
          <ellipse cx="68" cy="48" rx="7" ry="5" fill="#D4A882" />
          {/* Nose */}
          <circle cx="74" cy="47" r="2.5" fill="#3D2B1F" />

          {/* Eyes - squinting with joy */}
          <g>
            {/* Happy squint eyes */}
            <path d="M52 43 Q56 40 60 43" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M62 43 Q66 40 70 43" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>

          {/* Rosy cheeks */}
          <circle cx="52" cy="48" r="3" fill="#F59E0B" opacity="0.35" />
          <circle cx="72" cy="48" r="3" fill="#F59E0B" opacity="0.35" />

          {/* Big triumphant grin */}
          <path d="M62 52 Q68 58 74 52" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Teeth showing in grin */}
          <line x1="66" y1="53" x2="66" y2="55" stroke="white" strokeWidth="1" strokeLinecap="round" />
          <line x1="70" y1="53" x2="70" y2="55" stroke="white" strokeWidth="1" strokeLinecap="round" />

          {/* Front paws - hugging the acorn triumphantly! */}
          <g className="origin-center animate-[acorn-hug_1s_ease-in-out_infinite]">
            {/* The precious acorn */}
            <ellipse cx="80" cy="42" rx="7" ry="4" fill="#8B6914" />
            <rect x="78" y="35" width="4" height="5" rx="2" fill="#6B4F12" />
            <ellipse cx="80" cy="48" rx="6.5" ry="8" fill="#D4A03C" />
            <ellipse cx="78" cy="45" rx="2" ry="4" fill="#E8C060" opacity="0.5" />
            {/* Acorn face - happy too! */}
            <circle cx="78" cy="46" r="0.8" fill="#5C3D0E" />
            <circle cx="82" cy="46" r="0.8" fill="#5C3D0E" />
            <path d="M78 49 Q80 51 82 49" stroke="#5C3D0E" strokeWidth="0.6" fill="none" />

            {/* Paws holding acorn */}
            <circle cx="75" cy="44" r="3" fill="#D4A882" />
            <circle cx="85" cy="44" r="3" fill="#D4A882" />
          </g>

          {/* Back legs - jumping */}
          <g className="origin-bottom animate-[leg-kick_0.6s_ease-in-out_infinite]">
            <path d="M34 72 Q30 80 28 86" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="28" cy="86" rx="4" ry="2.5" fill="#D4A882" />
          </g>
          <g className="origin-bottom animate-[leg-kick_0.6s_ease-in-out_infinite_0.3s]">
            <path d="M40 72 Q36 80 34 86" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <ellipse cx="34" cy="86" rx="4" ry="2.5" fill="#D4A882" />
          </g>
        </g>

        {/* "YES!" text */}
        <g className="animate-[excitement-pop_2s_ease-in-out_infinite]">
          <text x="88" y="24" fontSize="8" fontWeight="bold" fill="#10B981" textAnchor="middle" fontFamily="sans-serif">YES!</text>
        </g>
      </svg>

      {/* Floating coins */}
      <div className="absolute -right-1 -top-1 animate-[float-up_1.5s_ease-out_infinite] text-sm">🪙</div>
      <div className="absolute -left-2 top-4 animate-[float-up_1.5s_ease-out_infinite_0.4s] text-xs">✨</div>
      <div className="absolute right-0 bottom-2 animate-[float-up_1.5s_ease-out_infinite_0.8s] text-xs">🌟</div>
    </div>
  );
}
