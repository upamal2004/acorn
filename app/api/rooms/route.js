// POST /api/rooms — create a new room owned by the signed-in user.
// Generates a unique PEACH-XXX code (retrying on the rare collision).
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, createRoom } from "@/lib/queries";
import { generateRoomCode } from "@/lib/room-code";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (profile?.roomId) return bad("You are already part of a room.", 409);

  const { name } = await req.json().catch(() => ({}));

  let room;
  let created = false;
  for (let attempt = 0; attempt < 10 && !created; attempt++) {
    const code = generateRoomCode();
    try {
      room = await createRoom({ name, ownerId: user.id, code });
      created = true;
    } catch (err) {
      // Unique-constraint violation → the code was taken; try another one.
      if (!String(err.message || "").toLowerCase().includes("constraint")) {
        throw err;
      }
    }
  }

  if (!created) return bad("Could not generate a unique room code. Try again.", 500);

  return ok({ roomId: room.id, code: room.code });
}
