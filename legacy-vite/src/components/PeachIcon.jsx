// ---------------------------------------------------------------------------
// PeachIcon.jsx — brand icon. Lucide doesn't ship a peach, so this is a
// hand-drawn peach glyph that matches Lucide's stroke style (24x24, 2px
// strokes, round caps) so it looks native next to the other icons.
// ---------------------------------------------------------------------------

export default function PeachIcon({ size = 24, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Fruit body — two rounded lobes with the classic peach cleft */}
      <path d="M12 4.2C9.9 4.2 8 5.4 7 7.4 5.6 10.1 5.7 13.4 7.2 15.8c1.5 2.4 3.3 3.6 4.8 3.6s3.3-1.2 4.8-3.6c1.5-2.4 1.6-5.7.2-8.4C16 5.4 14.1 4.2 12 4.2Z" />
      {/* Cleft at the top */}
      <path d="M12 4.2c-.7 1.4-.7 2.7 0 4" />
      {/* Stem */}
      <path d="M12 4.2c.1-1 1-1.6 2-1.6" />
      {/* Leaf */}
      <path d="M14 2.6c1.5-.2 2.8.7 3 2" />
    </svg>
  );
}
