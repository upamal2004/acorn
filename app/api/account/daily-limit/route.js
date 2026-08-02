// PATCH /api/account/daily-limit — set the user's daily spending limit in cents.
// Pass null to remove the limit.
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const body = await req.json().catch(() => ({}));
  const { dailyLimit } = body; // dollars or null

  if (dailyLimit !== null && dailyLimit !== undefined) {
    const num = Number(dailyLimit);
    if (Number.isNaN(num) || num < 0) {
      return bad("Daily limit must be a positive number.");
    }
    if (num > 100000) {
      return bad("Daily limit cannot exceed Rs. 100,000.00.");
    }
    const cents = Math.round(num * 100);
    await prisma.user.update({
      where: { id: user.id },
      data: { dailyLimitCents: cents },
    });
    return ok({ dailyLimit: num });
  }

  // null = remove limit
  await prisma.user.update({
    where: { id: user.id },
    data: { dailyLimitCents: null },
  });
  return ok({ dailyLimit: null });
}
