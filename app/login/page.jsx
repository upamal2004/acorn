import { Logo } from "@/components/Logo";
import { LoginForm } from "@/components/LoginForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-600">
            Sign in to reach your space.
          </p>
        </div>

        <div className="card">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <a href="/signup" className="font-semibold text-acorn-600 hover:text-acorn-700">
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
