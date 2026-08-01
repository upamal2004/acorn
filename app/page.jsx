import Link from "next/link";
import { AcornIcon } from "@/components/AcornIcon";
import { Logo } from "@/components/Logo";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5">
        <Logo />
        {session?.user ? (
          <Link href="/dashboard" className="btn-primary">
            Open your dashboard
          </Link>
        ) : (
          <Link href="/signup" className="btn-primary">
            Sign up free
          </Link>
        )}
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center px-6 py-16 text-center">
        <div className="mb-6 animate-float">
          <AcornIcon size={96} />
        </div>

        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-6xl">
          Split rent, bills & groceries{" "}
          <span className="text-acorn-500">without the maths.</span>
        </h1>

        <p className="mt-5 max-w-xl text-lg text-slate-600">
          Acorn keeps a single shared ledger for your household. Add an expense,
          everyone sees who owes what, and one tap settles a share. No spreadsheets,
          no "you owe me" texts.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {session?.user ? (
            <Link href="/dashboard" className="btn-primary px-6 py-3 text-base">
              Go to my room
            </Link>
          ) : (
            <Link href="/signup" className="btn-primary px-6 py-3 text-base">
              Get started free
            </Link>
          )}
        </div>

        <div className="mt-20 grid w-full gap-6 sm:grid-cols-3">
          {[
            {
              emoji: "🔗",
              title: "One room, one code",
              body: "Create a room, share its ACORN code, and your flatmates join in seconds.",
            },
            {
              emoji: "🧾",
              title: "Expenses split equally",
              body: "Add any expense and pick who's in. Acorn works out the shares for you.",
            },
            {
              emoji: "✅",
              title: "Settle with one tap",
              body: "Paid your share? Tap settle. The ledger updates instantly for everyone.",
            },
          ].map((f) => (
            <div key={f.title} className="card text-left">
              <div className="mb-3 text-3xl">{f.emoji}</div>
              <h2 className="text-lg font-semibold text-slate-900">{f.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{f.body}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-sm text-slate-500">
        Made with 🌰 — shared expenses, minus the awkwardness.
      </footer>
    </div>
  );
}
