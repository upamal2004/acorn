"use client";

/**
 * Sad/worried acorn character — shown when spending money.
 * Subtle shrink/shake animation to reflect the "ouch" of spending.
 * Pure inline SVG animation.
 */
export function AcornSad({ size = 64, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[acorn-sad-wobble_0.6s_ease-in-out]"
      >
        {/* Dissolving coins (falling away) */}
        <g className="animate-[coins-fall_1.5s_ease-out_infinite]">
          <circle cx="14" cy="18" r="3" fill="#D4A03C" opacity="0.4" />
          <circle cx="50" cy="22" r="2.5" fill="#D4A03C" opacity="0.3" />
          <circle cx="10" cy="28" r="2" fill="#D4A03C" opacity="0.2" />
        </g>

        {/* Acorn cap */}
        <ellipse cx="32" cy="22" rx="14" ry="9" fill="#8B6914" opacity="0.9" />
        <rect x="30" y="12" width="4" height="8" rx="2" fill="#6B4F12" />

        {/* Acorn body - slightly drooping */}
        <ellipse cx="32" cy="38" rx="13" ry="15" fill="#C49030" />
        <ellipse cx="29" cy="33" rx="4" ry="7" fill="#D4A850" opacity="0.4" />

        {/* Sad face */}
        {/* Eyes - downturned, teary */}
        <circle cx="27" cy="34" r="2.5" fill="white" />
        <circle cx="27" cy="34.5" r="1.5" fill="#3D2B1F" />
        <circle cx="27.3" cy="34" r="0.5" fill="white" />
        <circle cx="37" cy="34" r="2.5" fill="white" />
        <circle cx="37" cy="34.5" r="1.5" fill="#3D2B1F" />
        <circle cx="37.3" cy="34" r="0.5" fill="white" />

        {/* Sad eyebrows */}
        <path d="M24 30 Q27 28 30 30" stroke="#3D2B1F" strokeWidth="1" fill="none" strokeLinecap="round" />
        <path d="M34 30 Q37 28 40 30" stroke="#3D2B1F" strokeWidth="1" fill="none" strokeLinecap="round" />

        {/* Tear drop */}
        <g className="animate-[tear-fall_2s_ease-in-out_infinite]">
          <path d="M25 37 Q24 40 25 42 Q26 44 25 42 Q24 40 25 37Z" fill="#60A5FA" opacity="0.6" />
        </g>

        {/* Sad mouth - wavy frown */}
        <path d="M28 44 Q30 42 32 44 Q34 46 36 44" stroke="#3D2B1F" strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Sweat drop */}
        <g className="animate-[sweat-drop_3s_ease-in-out_infinite]">
          <path d="M42 28 Q43 30 42 32 Q41 30 42 28Z" fill="#60A5FA" opacity="0.5" />
        </g>
      </svg>

      {/* Flying away coin indicators */}
      <div className="absolute -right-2 top-0 animate-[float-away_1.2s_ease-out_infinite] text-xs opacity-50">💸</div>
    </div>
  );
}
