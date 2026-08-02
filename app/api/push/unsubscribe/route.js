// POST /api/push/unsubscribe -- remove a Web Push subscription (e.g. when the
// user disables notifications or the service worker re-subscribes).
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { endpoint } = await req.json().catch(() => ({}));
  if (!endpoint) return bad("Missing endpoint.");

  await prisma.pushSubscription.deleteMany({
    where: { userId: user.id, endpoint },
  });

  return ok({ ok: true });
}
