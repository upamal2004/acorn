export default function HistoryLoading() {
  return (
    <div className="min-h-screen animate-pulse">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3.5">
          <div className="h-7 w-20 rounded bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-slate-200" />
          </div>
        </div>
        <div className="mx-auto flex w-full max-w-5xl gap-2 px-6 pb-3">
          <div className="h-8 w-20 rounded-lg bg-slate-200" />
          <div className="h-8 w-16 rounded-lg bg-slate-200" />
          <div className="h-8 w-16 rounded-lg bg-slate-200" />
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-end justify-between">
          <div className="h-8 w-32 rounded bg-slate-200" />
          <div className="h-5 w-40 rounded bg-slate-200" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-32" />
          ))}
        </div>
      </main>
    </div>
  );
}
