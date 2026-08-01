/** Acorn brand lockup: the small favicon mark beside the name.png wordmark. */
export function Logo({ size = 30, className = "" }) {
  const wordmarkHeight = Math.max(12, Math.round(size * 0.8));
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon-32x32.png"
        alt=""
        width={size}
        height={size}
        className="h-auto w-auto object-contain"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/name.png"
        alt="Acorn"
        className="h-auto w-auto select-none object-contain"
        style={{ height: wordmarkHeight }}
      />
    </span>
  );
}
