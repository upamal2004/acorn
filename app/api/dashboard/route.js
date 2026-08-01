// GET /api/dashboard — one aggregate payload for the dashboard:
// the current user, their room, the member list and all expenses.
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, getRoom, getMembers, getExpenses } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (!profile) return bad("Account not found", 404);

  if (!profile.roomId) {
    return ok({ user: profile, room: null, members: [], expenses: [] });
  }

  const [room, members, expenses] = await Promise.all([
    getRoom(profile.roomId),
    getMembers(profile.roomId),
    getExpenses(profile.roomId),
  ]);

  return ok({ user: profile, room, members, expenses });
}
