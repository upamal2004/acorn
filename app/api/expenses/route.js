// POST /api/expenses — add an expense and split it equally between the
// selected members. Server-side membership checks make sure nobody can touch
// a room they don't belong to. The creator is always the payer: whatever
// `paidBy` a client sends is ignored and the current user is used instead.
// Without a roomId the expense is a personal one (solo mode): it's paid by
// and split only with the current user.
import { ok, bad, requireUser } from "@/lib/api";
import { isRoomMember, getMembers, createExpense } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { roomId, title, amount, splitBetween } = await req
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

    // The creator always pays, so they're always part of the split. Keep
    // every other selected member too, de-duplicated and room-validated.
    cleanSplit = [...new Set([user.id, ...(splitBetween || [])])].filter((id) =>
      memberIds.includes(id)
    );
    if (cleanSplit.length < 2) return bad("Pick at least one member to split with.");
  } else {
    // Personal (solo) expense — you pay it yourself.
    cleanSplit = [user.id];
  }

  const expenseId = await createExpense({
    roomId: roomId ?? null,
    title,
    amount: parsedAmount,
    paidBy: user.id, // the creator is strictly the person who paid
    createdBy: user.id,
    splitBetween: cleanSplit,
  });

  return ok({ expenseId });
}
