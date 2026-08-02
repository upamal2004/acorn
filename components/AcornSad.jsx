"use client";

/**
 * Scrat-inspired sad/devastated reaction -- shown when spending money.
 * Saber-toothed squirrel losing his acorn, dramatic exaggerated sadness.
 * Pure inline SVG with expressive animations.
 */
export function AcornSad({ size = 80, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[scrat-shock_0.8s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* Flying away acorn (dramatic!) */}
        <g className="animate-[acorn-fly-away_2s_ease-out_infinite]">
          <ellipse cx="75" cy="20" rx="5" ry="3.5" fill="#8B6914" opacity="0.7" />
          <ellipse cx="75" cy="24" rx="4.5" ry="5.5" fill="#D4A03C" opacity="0.7" />
          {/* Motion lines */}
          <line x1="68" y1="22" x2="60" y2="26" stroke="#D4A03C" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <line x1="70" y1="28" x2="64" y2="34" stroke="#D4A03C" strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        </g>

        {/* Scrat body - dramatically recoiling */}
        <g className="origin-bottom animate_[scrat-recoil_0.6s_ease-out]">
          {/* Body */}
          <ellipse cx="45" cy="62" rx="18" ry="14" fill="#C4956A" />
          {/* Belly - lighter */}
          <ellipse cx="47" cy="64" rx="12" ry="9" fill="#E8D4B8" />

          {/* Bushy tail - drooping dramatically */}
          <g className="origin-bottom animate-[tail-droop_1s_ease-out]">
            <path d="M24 58 Q16 48 12 38 Q10 30 14 28 Q18 26 22 34 Q26 44 28 56" fill="#C4956A" />
            <path d="M22 52 Q18 44 16 38 Q15 34 17 33" stroke="#E8D4B8" strokeWidth="1.5" fill="none" opacity="0.5" />
          </g>

          {/* Head - exaggerated shocked expression */}
          <ellipse cx="58" cy="46" rx="14" ry="12" fill="#C4956A" />

          {/* Pointy ears - flattened back in shock */}
          <g className="origin-right animate-[ears-flatten_0.5s_ease-out]">
            <ellipse cx="50" cy="34" rx="4" ry="7" fill="#C4956A" transform="rotate(-15 50 34)" />
            <ellipse cx="50" cy="34" rx="2.5" ry="5" fill="#E8B4B4" transform="rotate(-15 50 34)" />
            <ellipse cx="64" cy="34" rx="4" ry="7" fill="#C4956A" transform="rotate(15 64 34)" />
            <ellipse cx="64" cy="34" rx="2.5" ry="5" fill="#E8B4B4" transform="rotate(15 64 34)" />
          </g>

          {/* Snout - mouth agape in shock */}
          <ellipse cx="68" cy="48" rx="7" ry="5" fill="#D4A882" />
          {/* Nose */}
          <circle cx="74" cy="47" r="2.5" fill="#3D2B1F" />

          {/* Eyes - WIDE with shock, pupils tiny */}
          <g>
            <ellipse cx="56" cy="43" rx="4" ry="4.5" fill="white" />
            <circle cx="56" cy="43" r="1.5" fill="#3D2B1F" />
            <circle cx="57" cy="42" r="0.7" fill="white" />
            {/* Eyebrows - raised high in shock */}
            <path d="M51 37 Q54 34 58 36" stroke="#3D2B1F" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          </g>

          {/* Mouth - agape O shape */}
          <ellipse cx="70" cy="52" rx="4" ry="3" fill="#8B4513" />
          <ellipse cx="70" cy="51.5" rx="3" ry="2" fill="#D4A882" opacity="0.3" />

          {/* Fangs - saber teeth showing */}
          <path d="M67 50 L66 54" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M73 50 L74 54" stroke="white" strokeWidth="1.2" strokeLinecap="round" />

          {/* Front paws - reaching out dramatically */}
          <g className="origin-right animate-[paws-reach_0.8s_ease-out_infinite]">
            <path d="M58 60 Q66 56 74 58" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="74" cy="58" r="3.5" fill="#D4A882" />
          </g>

          {/* Back legs - buckling */}
          <path d="M34 72 Q30 82 26 88" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="26" cy="88" rx="4" ry="2.5" fill="#D4A882" />
          <path d="M40 72 Q36 82 32 88" stroke="#C4956A" strokeWidth="4" strokeLinecap="round" fill="none" />
          <ellipse cx="32" cy="88" rx="4" ry="2.5" fill="#D4A882" />
        </g>

        {/* Sweat drops */}
        <g className="animate-[sweat-drop_2s_ease-in-out_infinite]">
          <path d="M42 34 Q41 36 42 38 Q43 36 42 34Z" fill="#60A5FA" opacity="0.6" />
        </g>
        <g className="animate-[sweat-drop_2s_ease-in-out_infinite_0.7s]">
          <path d="M62 30 Q61 32 62 34 Q63 32 62 30Z" fill="#60A5FA" opacity="0.5" />
        </g>

        {/* Dramatic shock lines */}
        <g className="animate-[shock-lines_0.6s_ease-out]">
          <line x1="48" y1="32" x2="44" y2="26" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="56" y1="30" x2="56" y2="24" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          <line x1="64" y1="32" x2="68" y2="26" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Tear */}
        <g className="animate-[tear-fall_2.5s_ease-in-out_infinite]">
          <path d="M52 47 Q51 50 52 53 Q53 50 52 47Z" fill="#60A5FA" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}
