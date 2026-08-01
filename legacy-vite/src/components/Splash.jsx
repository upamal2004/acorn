import Logo from "./Logo.jsx";

/** Full-screen loading state shown while Firebase Auth initializes. */
export default function Splash() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <div className="animate-pulse">
        <Logo size={48} />
      </div>
      <p className="text-sm font-medium text-slate-400">Loading Peach…</p>
    </div>
  );
}
