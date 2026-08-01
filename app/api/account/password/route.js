// PATCH /api/account/password — verify the user's current password and set a
// new one. The caller must be signed in; credentials users are always verified
// against their stored bcrypt hash before any change is made.
import { ok, bad, requireUser } from "@/lib/api";
import { verifyPassword, hashPassword } from "@/lib/password";
import { findUserById, updateUserPassword } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { currentPassword, newPassword } = await req.json().catch(() => ({}));

  if (typeof currentPassword !== "string" || !currentPassword) {
    return bad("Please enter your current password.");
  }
  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return bad("New password must be at least 8 characters.");
  }
  if (newPassword === currentPassword) {
    return bad("New password must be different from the current one.");
  }

  const dbUser = await findUserById(user.id);
  if (!dbUser) return bad("Account not found", 404);
  if (!dbUser.passwordHash) {
    return bad("This account doesn't use a password.", 400);
  }

  const matches = await verifyPassword(currentPassword, dbUser.passwordHash);
  if (!matches) return bad("Current password is incorrect.", 400);

  const passwordHash = await hashPassword(newPassword);
  await updateUserPassword(user.id, passwordHash);

  return ok({ ok: true });
}
