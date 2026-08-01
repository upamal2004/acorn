import { Logo } from "@/components/Logo";
import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-600">We'll email you a secure link.</p>
        </div>

        <div className="card">
          <ForgotPasswordForm />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Remembered it?{" "}
          <a href="/login" className="font-semibold text-acorn-600 hover:text-acorn-700">
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
