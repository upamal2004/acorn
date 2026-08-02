"use client";

/**
 * Happy acorn character — bounces and sparkles when money is received or settled.
 * Pure inline SVG animation.
 */
export function AcornHappy({ size = 64, className = "" }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sparkles around acorn */}
        <g className="animate-[sparkle_1.2s_ease-in-out_infinite]">
          <path d="M12 20 L14 16 L16 20 L14 24Z" fill="#F59E0B" opacity="0.8" />
          <path d="M48 14 L49.5 11 L51 14 L49.5 17Z" fill="#F59E0B" opacity="0.6" />
          <path d="M52 36 L53.5 33 L55 36 L53.5 39Z" fill="#F59E0B" opacity="0.7" />
        </g>
        <g className="animate-[sparkle_1.2s_ease-in-out_infinite_0.4s]">
          <path d="M8 38 L9.5 35.5 L11 38 L9.5 40.5Z" fill="#10B981" opacity="0.7" />
          <path d="M54 24 L55.5 21.5 L57 24 L55.5 26.5Z" fill="#10B981" opacity="0.6" />
        </g>

        {/* Glow ring */}
        <circle cx="32" cy="36" r="20" fill="none" stroke="#10B981" strokeWidth="1.5" opacity="0.3" className="animate-[glow-pulse_2s_ease-in-out_infinite]" />

        {/* Acorn cap */}
        <ellipse cx="32" cy="22" rx="14" ry="9" fill="#8B6914" />
        <rect x="30" y="12" width="4" height="8" rx="2" fill="#6B4F12" />

        {/* Acorn body */}
        <ellipse cx="32" cy="38" rx="13" ry="15" fill="#D4A03C" />
        <ellipse cx="29" cy="33" rx="4" ry="7" fill="#E8C060" opacity="0.5" />

        {/* Happy face */}
        {/* Eyes - big and sparkly */}
        <circle cx="27" cy="35" r="2.5" fill="white" />
        <circle cx="27.5" cy="35" r="1.5" fill="#3D2B1F" />
        <circle cx="28" cy="34.2" r="0.6" fill="white" />
        <circle cx="37" cy="35" r="2.5" fill="white" />
        <circle cx="37.5" cy="35" r="1.5" fill="#3D2B1F" />
        <circle cx="38" cy="34.2" r="0.6" fill="white" />

        {/* Rosy cheeks */}
        <circle cx="23" cy="40" r="3" fill="#F59E0B" opacity="0.3" />
        <circle cx="41" cy="40" r="3" fill="#F59E0B" opacity="0.3" />

        {/* Big smile */}
        <path d="M26 42 Q32 48 38 42" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />

        {/* Bounce animation */}
        <style>{`
          @keyframes acorn-happy-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
        `}</style>
        <g className="origin-center" style={{ animation: "acorn-happy-bounce 0.8s ease-in-out infinite" }}>
          {/* Re-apply body to make bounce work */}
        </g>
      </svg>

      {/* Floating coins */}
      <div className="absolute -right-1 -top-1 animate-[float-up_1s_ease-out_infinite] text-sm">🪙</div>
      <div className="absolute -left-1 top-2 animate-[float-up_1s_ease-out_infinite_0.3s] text-xs">✨</div>
    </div>
  );
}
