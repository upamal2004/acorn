// POST /api/expenses — add an expense and split it equally between the
// selected members. Server-side membership checks make sure nobody can touch
// a room they don't belong to. The creator is always the payer: whatever
// `paidBy` a client sends is ignored and the current user is used instead.
// The split is exactly what the client selected — the creator may include
// themselves or not. If they're left out, the full amount is shared among the
// selected members only and the creator is owed the total. Without a roomId
// the expense is a personal one (solo mode): it's paid by and split only with
// the current user.
import { ok, bad, requireUser } from "@/lib/api";
import { isRoomMember, getMembers, createExpense } from "@/lib/queries";
import { isValidCategory } from "@/lib/categories";

export const dynamic = "force-dynamic";

export async function POST(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { roomId, title, description, category, amount, splitBetween } = await req
    .json()
    .catch(() => ({}));

  const parsedAmount = Number(amount);
  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    return bad("Amount must be a number greater than zero.");
  }

  // Category is optional — anything invalid (or missing) falls back to Others.
  const cleanCategory = isValidCategory(category) ? category : "OTHERS";

  let cleanSplit;
  if (roomId) {
    if (!(await isRoomMember(user.id, roomId))) {
      return bad("You are not a member of that room.", 403);
    }

    const memberIds = (await getMembers(roomId)).map((m) => m.id);

    // Keep only the members the creator picked, de-duplicated and
    // room-validated. No one (not even the creator) is forced in.
    cleanSplit = [...new Set(splitBetween || [])].filter((id) =>
      memberIds.includes(id)
    );
    if (!cleanSplit.length) return bad("Pick at least one member to split with.");
  } else {
    // Personal (solo) expense — you pay it yourself.
    cleanSplit = [user.id];
  }

  const expenseId = await createExpense({
    roomId: roomId ?? null,
    title,
    description,
    category: cleanCategory,
    amount: parsedAmount,
    paidBy: user.id, // the creator is strictly the person who paid
    createdBy: user.id,
    splitBetween: cleanSplit,
  });

  return ok({ expenseId });
}
