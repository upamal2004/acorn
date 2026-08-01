import { User } from "lucide-react";

/** Circular avatar — photo when available, otherwise colored initials. */
export default function Avatar({ member, size = 36, className = "" }) {
  const initials = (member?.name || "?")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (member?.photoURL) {
    return (
      <img
        src={member.photoURL}
        alt={member.name}
        style={{ width: size, height: size }}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.38 }}
      className={`flex shrink-0 items-center justify-center rounded-full bg-peach-100 font-semibold text-peach-700 ${className}`}
    >
      {initials || <User size={size * 0.5} />}
    </div>
  );
}
