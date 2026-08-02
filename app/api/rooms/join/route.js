// POST /api/rooms/join -- join an existing room using its ACORN-XXX code.
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, joinRoom } from "@/lib/queries";
import { normalizeRoomCode, isValidRoomCode } from "@/lib/room-code";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (profile?.roomId) return bad("You are already part of a room.", 409);

  const { code } = await req.json().catch(() => ({}));
  const clean = normalizeRoomCode(code);

  if (!isValidRoomCode(clean)) {
    return bad("Invalid code format. Expected something like ACORN-9X2.");
  }

  try {
    const { roomId } = await joinRoom({ code: clean, uid: user.id });
    return ok({ roomId });
  } catch (err) {
    if (err.message === "ROOM_NOT_FOUND") {
      return bad("No room found with that code.", 404);
    }
    throw err;
  }
}
