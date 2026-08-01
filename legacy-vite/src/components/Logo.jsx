import PeachIcon from "./PeachIcon.jsx";

/**
 * Brand logo — the Peach glyph. Used in the header and the landing page.
 */
export default function Logo({ size = 28, className = "" }) {
  return <PeachIcon size={size} className={`text-peach-500 ${className}`} />;
}
