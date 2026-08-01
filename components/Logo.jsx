import { AcornIcon } from "@/components/AcornIcon";

/** Acorn wordmark: acorn glyph + "Acorn" in a friendly rounded type. */
export function Logo({ size = 30, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <AcornIcon size={size} />
      <span className="text-xl font-bold tracking-tight text-slate-800">
        Acorn
      </span>
    </span>
  );
}
