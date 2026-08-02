// POST /api/auth/forgot-password -- issue a secure, single-use reset link.
//
// Returns the same generic message whether or not the email exists so the
// endpoint can't be used to enumerate accounts. When email delivery is
// unconfigured (no RESEND_API_KEY) and RESET_DEV_LINKS=true, the reset URL is
// returned in the response so the flow can be tested locally.
import { ok, bad } from "@/lib/api";
import { findUserByEmail, setPasswordResetToken } from "@/lib/queries";
import { generateResetToken, hashResetToken, RESET_TOKEN_TTL_MS } from "@/lib/reset-token";
import { sendPasswordResetEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const GENERIC_OK = "If an account exists, we've sent a reset link.";

export async function POST(req) {
  const { email } = await req.json().catch(() => ({}));

  const cleanEmail = String(email ?? "").trim().toLowerCase();
  if (!cleanEmail) return bad("Please enter your email address.");
  if (!EMAIL_RE.test(cleanEmail)) return bad("Enter a valid email address.");

  const user = await findUserByEmail(cleanEmail);
  if (!user) return ok({ message: GENERIC_OK });

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await setPasswordResetToken(user.id, hashResetToken(token), expiresAt);

  const origin = new URL(req.url).origin;
  const resetUrl = `${origin}/reset-password?token=${token}`;

  const result = await sendPasswordResetEmail({ to: cleanEmail, url: resetUrl });

  if (result.ok) return ok({ message: GENERIC_OK });

  if (result.reason === "not_configured") {
    if (process.env.RESET_DEV_LINKS === "true") {
      // Dev mode -- no sender configured, so hand the link back for testing.
      return ok({ message: GENERIC_OK, devResetUrl: resetUrl });
    }
    return bad("Password reset emails aren't configured yet. Please try again later.", 503);
  }

  return bad("Could not send the reset email. Please try again.", 500);
}
