// GET /api/dashboard -- one aggregate payload for the dashboard:
// the current user, their room, the member list and all expenses.
// Without a room the payload describes personal (solo) mode: the member list
// is just the user and expenses are their own room-less tracking.
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, getRoom, getMembers, getExpenses, getPersonalExpenses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (!profile) return bad("Account not found", 404);

  if (!profile.roomId) {
    const personalExpenses = await getPersonalExpenses(profile.id);
    return ok({
      user: profile,
      room: null,
      members: [profile],
      expenses: personalExpenses,
    });
  }

  const [room, members, expenses] = await Promise.all([
    getRoom(profile.roomId),
    getMembers(profile.roomId),
    getExpenses(profile.roomId, profile.id), // only expenses involving this user
  ]);

  return ok({ user: profile, room, members, expenses });
}
