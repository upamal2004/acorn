/** Acorn logo mark — the favicon image. */
export function Logo({ size = 30, className = "" }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/favicon-32x32.png"
        alt="Acorn"
        width={size}
        height={size}
        className="h-auto w-auto object-contain"
      />
    </span>
  );
}
