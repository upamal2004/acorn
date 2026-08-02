"use client";

/**
 * Mini Scrat loading indicator — shown while saving a transaction.
 * A tiny Scrat holding an acorn with a pulsing animation.
 */
export function ScratLoading({ size = 40, text = "Saving...", className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 40 40"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="animate-[scrat-waddle_0.8s_ease-in-out_infinite]"
        >
          {/* Mini Scrat body */}
          <ellipse cx="20" cy="24" rx="8" ry="6" fill="#C4956A" />
          <ellipse cx="21" cy="25" rx="5" ry="4" fill="#E8D4B8" />

          {/* Head */}
          <ellipse cx="26" cy="18" rx="6" ry="5" fill="#C4956A" />

          {/* Ears */}
          <ellipse cx="23" cy="13" rx="2" ry="3" fill="#C4956A" />
          <ellipse cx="23" cy="13" rx="1.2" ry="2" fill="#E8B4B4" />
          <ellipse cx="29" cy="13" rx="2" ry="3" fill="#C4956A" />
          <ellipse cx="29" cy="13" rx="1.2" ry="2" fill="#E8B4B4" />

          {/* Snout */}
          <ellipse cx="30" cy="19" rx="3" ry="2" fill="#D4A882" />
          <circle cx="32" cy="18.5" r="1" fill="#3D2B1F" />

          {/* Eye - focused */}
          <circle cx="27" cy="17" r="1.5" fill="white" />
          <circle cx="27.5" cy="17" r="0.9" fill="#3D2B1F" />

          {/* Holding acorn */}
          <g className="origin-center animate-[acorn-squeeze_0.8s_ease-in-out_infinite]">
            <ellipse cx="32" cy="24" rx="3" ry="3.5" fill="#D4A03C" />
            <ellipse cx="32" cy="21" rx="3" ry="2" fill="#8B6914" />
          </g>

          {/* Tail */}
          <path d="M12 22 Q8 18 6 14 Q5 12 7 11 Q9 10 10 14 Q12 18 14 22" fill="#C4956A" />

          {/* Legs */}
          <ellipse cx="16" cy="30" rx="2.5" ry="1.5" fill="#D4A882" />
          <ellipse cx="24" cy="30" rx="2.5" ry="1.5" fill="#D4A882" />
        </svg>
      </div>
      {text && (
        <p className="text-xs font-medium text-slate-500 animate-pulse">{text}</p>
      )}
    </div>
  );
}
