// PATCH /api/account/room-name — update the room name (creator only).
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  if (!user.roomId) return bad("You are not in a room.", 400);

  const room = await prisma.room.findUnique({ where: { id: user.roomId } });
  if (!room) return bad("Room not found.", 404);
  if (room.ownerId !== user.id) {
    return bad("Only the room creator can rename the room.", 403);
  }

  const { name } = await req.json().catch(() => ({}));
  if (typeof name !== "string" || !name.trim()) {
    return bad("Room name cannot be empty.");
  }
  if (name.trim().length > 50) {
    return bad("Room name must be 50 characters or fewer.");
  }

  await prisma.room.update({
    where: { id: user.roomId },
    data: { name: name.trim() },
  });

  return ok({ name: name.trim() });
}
