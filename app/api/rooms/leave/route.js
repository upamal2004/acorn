// POST /api/rooms/leave — leave the current room and go back to personal mode.
// Works for any member, including the room creator.
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, leaveRoom } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (!profile?.roomId) return bad("You are not in a room.", 400);

  await leaveRoom(user.id);
  return ok();
}
