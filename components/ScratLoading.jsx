"use client";

/**
 * Minimal loading indicator — clean pulsing dot spinner.
 */
export function ScratLoading({ size = 40, text = "Saving...", className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5" style={{ width: size }}>
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-[dot-pulse_1.2s_ease-in-out_infinite]" />
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-[dot-pulse_1.2s_ease-in-out_infinite_0.2s]" />
        <span className="h-2 w-2 rounded-full bg-slate-400 animate-[dot-pulse_1.2s_ease-in-out_infinite_0.4s]" />
      </div>
      {text && (
        <p className="text-xs font-medium text-slate-500 animate-pulse">{text}</p>
      )}
    </div>
  );
}
