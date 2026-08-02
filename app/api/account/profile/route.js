// PATCH /api/account/profile -- update the user's display name.
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { name } = await req.json().catch(() => ({}));
  if (typeof name !== "string" || !name.trim()) {
    return bad("Name cannot be empty.");
  }
  if (name.trim().length > 50) {
    return bad("Name must be 50 characters or fewer.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { name: name.trim() },
  });

  return ok({ name: name.trim() });
}
