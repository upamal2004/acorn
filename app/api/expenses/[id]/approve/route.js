// POST /api/expenses/[id]/approve — the expense's payer confirms that a
// member's marked-as-paid share was actually received. This is the only point
// where settlement balances move: the settling member's wallet drops by their
// share and the payer's wallet rises by that share.
import { ok, bad, requireUser } from "@/lib/api";
import { approveShare } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(req, { params }) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { id } = await params;
  const { userId } = await req.json().catch(() => ({}));
  if (typeof userId !== "string" || !userId) {
    return bad("Missing member id.");
  }

  try {
    await approveShare({ expenseId: id, uid: userId, approveBy: user.id });
    return ok();
  } catch (err) {
    if (err.message === "EXPENSE_NOT_FOUND") return bad("Expense not found.", 404);
    if (err.message === "NOT_OWNER") {
      return bad("Only the person who paid for this expense can approve settlements.", 403);
    }
    if (err.message === "SHARE_NOT_VERIFICATION") {
      return bad("That share isn't awaiting your approval.", 400);
    }
    throw err;
  }
}
