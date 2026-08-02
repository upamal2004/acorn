// PATCH /api/account/category-limits — set per-category spending limits.
// Pass a JSON object { "FOOD": 5000, "TRANSPORT": 3000 } (values in dollars).
// Pass null or {} to remove all category limits.
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";
import { isValidCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { categoryLimits } = await req.json().catch(() => ({}));

  if (categoryLimits === null || categoryLimits === undefined) {
    await prisma.user.update({
      where: { id: user.id },
      data: { categoryLimits: null },
    });
    return ok({ categoryLimits: null });
  }

  if (typeof categoryLimits !== "object" || Array.isArray(categoryLimits)) {
    return bad("Category limits must be an object.");
  }

  const cleaned = {};
  for (const [cat, val] of Object.entries(categoryLimits)) {
    if (!isValidCategory(cat)) continue;
    const num = Number(val);
    if (Number.isNaN(num) || num < 0) continue;
    if (num > 100000) continue;
    cleaned[cat] = Math.round(num * 100); // store as cents
  }

  const jsonStr = Object.keys(cleaned).length > 0 ? JSON.stringify(cleaned) : null;

  await prisma.user.update({
    where: { id: user.id },
    data: { categoryLimits: jsonStr },
  });

  // Return as dollars for the client
  const result = {};
  if (jsonStr) {
    for (const [cat, cents] of Object.entries(cleaned)) {
      result[cat] = cents / 100;
    }
  }

  return ok({ categoryLimits: Object.keys(result).length > 0 ? result : null });
}
