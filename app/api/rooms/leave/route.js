// POST /api/rooms/leave — leave the current room and go back to personal mode.
// Works for any member, including the room creator, but only once all their
// outstanding debts are settled ("You owe" must be Rs. 0.00).
import { ok, bad, requireUser } from "@/lib/api";
import { getUser, leaveRoom, getExpenses } from "@/lib/queries";
import { computeSummary } from "@/lib/summary";

export const dynamic = "force-dynamic";

export async function POST() {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const profile = await getUser(user.id);
  if (!profile?.roomId) return bad("You are not in a room.", 400);

  // Block leaving while the member still has unpaid debt in the room.
  const expenses = await getExpenses(profile.roomId);
  const { iOwe, net } = computeSummary(expenses, profile.id);
  if (iOwe > 0 || net < 0) {
    return bad(
      "You cannot leave the room with outstanding debts. Please settle all your pending balances first.",
      400
    );
  }

  await leaveRoom(user.id);
  return ok();
}
