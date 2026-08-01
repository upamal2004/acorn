/** Acorn brand wordmark — the name.png image. Renders at the given height,
 *  keeping its intrinsic aspect ratio for a crisp, smooth look. */
export function Logo({ size = 30, className = "" }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/name.png"
        alt="Acorn"
        className="h-auto w-auto select-none object-contain"
        style={{ height: size }}
      />
    </span>
  );
}
