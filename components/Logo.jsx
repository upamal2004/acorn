/** Acorn logo lockup: cover mark + wordmark image. */
export function Logo({ size = 30, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cover.png"
        alt=""
        width={size}
        height={size}
        className="h-auto w-auto rounded-lg object-cover"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/name.png"
        alt="Acorn"
        className="h-auto w-auto object-contain"
        style={{ height: Math.max(12, Math.round(size * 0.55)) }}
      />
    </span>
  );
}
