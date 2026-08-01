// POST /api/expenses — add an expense to the caller's room and split it
// equally between the selected members. Server-side membership checks make
// sure nobody can touch a room they don't belong to.
import { ok, bad, requireUser } from "@/lib/api";
import { isRoomMember, getMembers, createExpense } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { roomId, title, amount, paidBy, splitBetween } = await req
    .json()
    .catch(() => ({}));

  if (!roomId) return bad("roomId is required.");
  if (!(await isRoomMember(user.id, roomId))) {
    return bad("You are not a member of that room.", 403);
  }

  const memberIds = (await getMembers(roomId)).map((m) => m.id);
  if (!memberIds.includes(paidBy)) return bad("Payer is not a room member.");

  // Keep only members in the split, de-duplicated.
  const cleanSplit = [...new Set(splitBetween || [])].filter((id) =>
    memberIds.includes(id)
  );
  if (!cleanSplit.length) return bad("Pick at least one member to split with.");

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return bad("Amount must be a number greater than zero.");
  }

  const expenseId = await createExpense({
    roomId,
    title,
    amount: parsedAmount,
    paidBy,
    createdBy: user.id,
    splitBetween: cleanSplit,
  });

  return ok({ expenseId });
}
