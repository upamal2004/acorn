// DELETE /api/rooms/[memberId] — the room creator removes a member from the
// room. Only the owner may do this; the removed member goes back to personal
// (solo) mode. The owner can't remove themselves (use Leave room instead).
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, getRoom, removeRoomMember } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function DELETE(_req, { params }) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { memberId } = await params;

  const profile = await getUser(user.id);
  if (!profile?.roomId) return bad("You are not in a room.", 400);

  const room = await getRoom(profile.roomId);
  if (!room) return bad("Room not found.", 404);
  if (room.ownerId !== user.id) {
    return bad("Only the room creator can remove members.", 403);
  }
  if (memberId === user.id) {
    return bad("You can't remove yourself — use Leave room instead.", 400);
  }

  try {
    await removeRoomMember({ roomId: room.id, memberId });
    return ok();
  } catch (err) {
    if (err.message === "MEMBER_NOT_IN_ROOM") {
      return bad("That person isn't in your room.", 404);
    }
    throw err;
  }
}
