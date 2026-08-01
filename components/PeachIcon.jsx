/**
 * Hand-drawn peach mark (lucide has no peach icon, so it's a custom SVG).
 * A round peachy body with a cleft, a little stem and a leaf.
 */
export function PeachIcon({ size = 40, className = "" }) {
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
      {/* Peach body */}
      <path
        d="M32 14c-10 0-18 8.6-18 19.2C14 43.5 20 54 32 54s18-10.5 18-20.8C50 22.6 42 14 32 14Z"
        fill="url(#peach-body)"
      />
      {/* Cleft / crease */}
      <path
        d="M32 14c-2.6 3.4-3.6 7-3.6 11.2 0 4.6 1.4 9.6 3.6 14.6 2.2-5 3.6-10 3.6-14.6 0-4.2-1-7.8-3.6-11.2Z"
        fill="#FFB07A"
        fillOpacity="0.55"
      />
      {/* Leaf */}
      <path
        d="M32 15c2.4-3.6 7.2-6 10.6-5.4-0.6 3.4-3.4 7-6.6 8.6-3.6 1.8-6.4 0.4-4-3.2Z"
        fill="#7FB069"
      />
      {/* Stem */}
      <path
        d="M32 15v-4"
        stroke="#6B4226"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="peach-body" x1="14" y1="14" x2="50" y2="54">
          <stop stopColor="#FFC9A0" />
          <stop offset="0.55" stopColor="#FFA971" />
          <stop offset="1" stopColor="#FF7E5C" />
        </linearGradient>
      </defs>
    </svg>
  );
}
