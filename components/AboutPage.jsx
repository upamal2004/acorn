"use client";

import Link from "next/link";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Logo } from "@/components/Logo";

/**
 * About page with app description and PWA install guide.
 */
export function AboutPage({ user }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardHeader user={user} active="about" />

      <main className="mx-auto max-w-2xl px-6 py-10">
        {/* Hero */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center rounded-2xl bg-acorn-100 p-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/android-chrome-192x192.png"
              alt="Acorn logo"
              width={80}
              height={80}
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900">Acorn</h1>
          <p className="mt-2 text-lg text-slate-500">Split expenses, minus the awkwardness.</p>
        </div>

        {/* About Section */}
        <section className="mt-10 card">
          <h2 className="text-lg font-bold text-slate-900">About Acorn</h2>
          <div className="mt-3 space-y-3 text-sm text-slate-600 leading-relaxed">
            <p>
              Acorn is a smart expense-splitting app designed for roommates, friends, and families.
              Track shared expenses, settle debts, and monitor your spending habits, all in one place.
            </p>
            <p>
              Whether it&apos;s rent, groceries, utilities, or that midnight food run, Acorn makes it
              effortless to split costs fairly and keep everyone on the same page.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon="💸"
              title="Expense Splitting"
              description="Split bills equally or manually with room members. Track who owes what at a glance."
            />
            <FeatureCard
              icon="📊"
              title="Spending Insights"
              description="Visualize your daily spending trends and category breakdowns with interactive charts."
            />
            <FeatureCard
              icon="🎯"
              title="Daily Limits"
              description="Set daily spending limits and category budgets to stay on top of your finances."
            />
            <FeatureCard
              icon="💰"
              title="Wallet Balance"
              description="Track your personal cash/bank balance. Expenses auto-deduct from your wallet."
            />
            <FeatureCard
              icon="🔔"
              title="Push Notifications"
              description="Get notified when someone adds an expense or settles a debt with you."
            />
            <FeatureCard
              icon="🌙"
              title="Works Offline"
              description="Install as an app on your phone. Access your data even without internet."
            />
          </div>
        </section>

        {/* PWA Install Guide */}
        <section className="mt-8 card">
          <h2 className="text-lg font-bold text-slate-900">📱 Install as an App</h2>
          <p className="mt-2 text-sm text-slate-500">
            Acorn works as a Progressive Web App (PWA). Install it on your phone for a native app experience!
          </p>

          <div className="mt-6 space-y-6">
            {/* Android */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Android (Chrome)</h3>
                  <p className="text-xs text-slate-500">Version 7.0 and above</p>
                </div>
              </div>
              <ol className="mt-3 ml-13 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-green-600">1.</span>
                  Open Acorn in Chrome browser
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-green-600">2.</span>
                  Tap the <strong>three dots menu</strong> (⋮) in the top-right corner
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-green-600">3.</span>
                  Tap <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home screen&quot;</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-green-600">4.</span>
                  Confirm by tapping <strong>&quot;Install&quot;</strong>
                </li>
              </ol>
            </div>

            {/* iOS */}
            <div className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <span className="text-xl">🍎</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">iOS (Safari)</h3>
                  <p className="text-xs text-slate-500">iOS 14.0 and above</p>
                </div>
              </div>
              <ol className="mt-3 ml-13 space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-blue-600">1.</span>
                  Open Acorn in <strong>Safari</strong> browser
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-blue-600">2.</span>
                  Tap the <strong>Share button</strong> (box with arrow) at the bottom
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-blue-600">3.</span>
                  Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex-none font-bold text-blue-600">4.</span>
                  Tap <strong>&quot;Add&quot;</strong> in the top-right corner
                </li>
              </ol>
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
            <strong>Tip:</strong> Once installed, Acorn appears on your home screen like a native app
            with its own icon and full-screen experience!
          </div>
        </section>

        {/* Back to Dashboard */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-acorn-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-acorn-700 active:scale-[0.98]"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Footer */}
        
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-4 transition hover:border-acorn-200 hover:shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
