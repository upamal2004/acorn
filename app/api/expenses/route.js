// POST /api/expenses — add an expense and split it equally between the
// selected members. Server-side membership checks make sure nobody can touch
// a room they don't belong to. Without a roomId the expense is a personal one
// (solo mode): it's paid by and split only with the current user.
import { ok, bad, requireUser } from "@/lib/api";
import { isRoomMember, getMembers, createExpense } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { roomId, title, amount, paidBy, splitBetween } = await req
    .json()
    .catch(() => ({}));

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return bad("Amount must be a number greater than zero.");
  }

  let cleanSplit;
  if (roomId) {
    if (!(await isRoomMember(user.id, roomId))) {
      return bad("You are not a member of that room.", 403);
    }

    const memberIds = (await getMembers(roomId)).map((m) => m.id);
    if (!memberIds.includes(paidBy)) return bad("Payer is not a room member.");

    // Keep only members in the split, de-duplicated.
    cleanSplit = [...new Set(splitBetween || [])].filter((id) =>
      memberIds.includes(id)
    );
    if (!cleanSplit.length) return bad("Pick at least one member to split with.");
  } else {
    // Personal (solo) expense — you pay it yourself.
    if (paidBy && paidBy !== user.id) {
      return bad("Personal expenses must be paid by you.", 400);
    }
    cleanSplit = [user.id];
  }

  const expenseId = await createExpense({
    roomId: roomId ?? null,
    title,
    amount: parsedAmount,
    paidBy: roomId ? paidBy : user.id,
    createdBy: user.id,
    splitBetween: cleanSplit,
  });

  return ok({ expenseId });
}
