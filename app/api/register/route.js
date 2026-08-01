// POST /api/register — create an email/password account.
import { ok, bad } from "@/lib/api";
import { createUser, findUserByEmail } from "@/lib/queries";
import { hashPassword } from "@/lib/password";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const { name, email, password } = await req.json().catch(() => ({}));

  const cleanName = String(name ?? "").trim();
  const cleanEmail = String(email ?? "").trim().toLowerCase();
  const cleanPassword = String(password ?? "");

  if (!cleanName) return bad("Please enter your name.");
  if (!EMAIL_RE.test(cleanEmail)) return bad("Enter a valid email address.");
  if (cleanPassword.length < 8) {
    return bad("Password must be at least 8 characters.");
  }

  const existing = await findUserByEmail(cleanEmail);
  if (existing) return bad("An account with that email already exists.", 409);

  const passwordHash = await hashPassword(cleanPassword);
  const user = await createUser({ name: cleanName, email: cleanEmail, passwordHash });

  return ok({ id: user.id });
}
