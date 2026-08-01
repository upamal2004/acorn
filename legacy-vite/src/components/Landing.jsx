import { HandCoins, PiggyBank, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import Logo from "./Logo.jsx";

/** The pre-auth landing page with the Google Sign-In button. */
export default function Landing() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-3xl bg-peach-100 p-5 shadow-soft">
            <Logo size={56} />
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          Peach
        </h1>
        <p className="mt-3 text-slate-500">
          Split shared room expenses with roommates and keep your personal
          wallet in check. All in one place.
        </p>

        <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3 text-xs text-slate-500">
          <div className="card flex flex-col items-center gap-2 !py-4">
            <Users className="text-peach-500" size={20} />
            Create or join a room
          </div>
          <div className="card flex flex-col items-center gap-2 !py-4">
            <HandCoins className="text-peach-500" size={20} />
            Split bills equally
          </div>
          <div className="card flex flex-col items-center gap-2 !py-4">
            <PiggyBank className="text-peach-500" size={20} />
            Track your wallet
          </div>
        </div>

        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="btn-secondary mt-10 w-full !py-3 text-base shadow-sm"
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p className="mt-6 text-xs text-slate-400">
          Signing in is safe — only people in your room can see its expenses.
        </p>
      </div>
    </div>
  );
}

/** Official multi-color Google "G" mark. */
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
