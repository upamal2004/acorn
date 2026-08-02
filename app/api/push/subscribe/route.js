// POST /api/push/subscribe -- store a Web Push subscription for the
// authenticated user. The client calls this after the service worker
// registers and the user grants notification permission.
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { endpoint, p256dh, auth } = await req.json().catch(() => ({}));
  if (!endpoint || !p256dh || !auth) {
    return bad("Missing subscription fields (endpoint, p256dh, auth).");
  }

  // Upsert by endpoint -- a single device re-subscribing just refreshes the row.
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { userId: user.id, p256dh, auth },
    create: { userId: user.id, endpoint, p256dh, auth },
  });

  return ok({ ok: true });
}
