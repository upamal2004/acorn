// POST /api/auth/reset-password — set a new password from a reset link.
//
// Validates the token hash against the stored value and its expiry, then
// replaces the password and clears the token so it can't be replayed.
import { ok, bad } from "@/lib/api";
import { hashPassword } from "@/lib/password";
import {
  findUserByResetToken,
  updateUserPassword,
  clearPasswordResetToken,
} from "@/lib/queries";
import { hashResetToken } from "@/lib/reset-token";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const { token, password } = await req.json().catch(() => ({}));

  if (typeof token !== "string" || !token) {
    return bad("This reset link is invalid or has expired.");
  }
  if (typeof password !== "string" || password.length < 8) {
    return bad("New password must be at least 8 characters.");
  }

  const user = await findUserByResetToken(hashResetToken(token));
  if (!user) return bad("This reset link is invalid or has expired.", 400);

  const passwordHash = await hashPassword(password);
  await updateUserPassword(user.id, passwordHash);
  await clearPasswordResetToken(user.id);

  return ok({ ok: true });
}
