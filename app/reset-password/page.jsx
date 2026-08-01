import { Logo } from "@/components/Logo";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export default async function ResetPasswordPage({ searchParams }) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={40} />
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <a href="/forgot-password" className="btn-primary mt-4 w-full">
              Request a new link
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <Logo size={40} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Choose a new password</h1>
          <p className="mt-1 text-sm text-slate-600">
            Must be at least 8 characters.
          </p>
        </div>

        <div className="card">
          <ResetPasswordForm token={token} />
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <a href="/login" className="font-semibold text-acorn-600 hover:text-acorn-700">
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  );
}
