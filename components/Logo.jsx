import { PeachIcon } from "@/components/PeachIcon";

/** Peach wordmark: peach glyph + "Peach" in a friendly rounded type. */
export function Logo({ size = 30, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <PeachIcon size={size} />
      <span className="text-xl font-bold tracking-tight text-slate-800">
        Peach
      </span>
    </span>
  );
}
