/**
 * Hand-drawn acorn mark, inspired by the classic Ice Age acorn: a rounded
 * nut, a scalloped cap, a stem and an oak leaf.
 */
export function AcornIcon({ size = 40, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Oak leaf on the stem */}
      <path
        d="M32 15c-1 4-4 8-9 9 3 1 5 3 5.5 6 1-2 2.5-3 4.5-3.5-1 2 .5 3.5 2.5 4 0-1.5.5-2.5 1.5-3 0 1.5 1.5 2.5 3 2.5-.5-2 0-3.5 1.5-4.5-2.5-2.5-5.5-7-9.5-10.5Z"
        fill="#6FA04F"
      />
      {/* Stem */}
      <path
        d="M32 20v-6"
        stroke="#5E3A1E"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* Cap */}
      <path
        d="M22 30c0-6 4.5-11 10-11s10 5 10 11c0 2-1 3.5-2 4.5-2.4-2-5.2-3-8-3s-5.6 1-8 3c-1-1-2-2.5-2-4.5Z"
        fill="url(#acorn-cap)"
      />
      {/* Cap texture */}
      <path
        d="M24 25.5c2-1.2 4.8-1.2 8 0M24 29c2.2-1.4 5-1.4 8 0"
        stroke="#7C4A26"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {/* Nut */}
      <path
        d="M22 32c0 12 4.5 20 10 20s10-8 10-20c0-4-1-6.5-2-7.5-2.4 1.8-5.2 2.6-8 2.6s-5.6-.8-8-2.6c-1 1-2 3.5-2 7.5Z"
        fill="url(#acorn-nut)"
      />
      <defs>
        <linearGradient id="acorn-nut" x1="22" y1="22" x2="42" y2="56">
          <stop stopColor="#C9854F" />
          <stop offset="0.55" stopColor="#A9632F" />
          <stop offset="1" stopColor="#7C451F" />
        </linearGradient>
        <linearGradient id="acorn-cap" x1="18" y1="14" x2="46" y2="30">
          <stop stopColor="#8A5A33" />
          <stop offset="1" stopColor="#5E3A1E" />
        </linearGradient>
      </defs>
    </svg>
  );
}
