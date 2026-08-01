/** Round avatar: profile image when available, otherwise initials on peach. */
export function Avatar({ name = "", image, size = 36 }) {
  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  const initials = (name || "?")
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-peach-200 font-semibold text-peach-700"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
