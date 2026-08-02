// POST /api/expenses/[id]/reject — the expense's payer sends a member's
// marked-as-paid share back to unpaid so they can settle again. No balance
// changes (none were made while it was awaiting approval).
import { ok, bad, requireUser } from "@/lib/api";
import { rejectShare } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

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
    await rejectShare({ expenseId: id, uid: userId, rejectBy: user.id });

    // Notify the settling member that their payment was rejected.
    const expense = await prisma.expense.findUnique({
      where: { id },
      select: { title: true },
    });
    if (expense) {
      sendPushToUser(userId, {
        title: "Payment rejected",
        body: `Your payment for "${expense.title}" was rejected by ${user.name}. Please settle again.`,
        tag: `reject-${id}`,
        url: "/dashboard",
      }).catch(() => {});
    }

    return ok();
  } catch (err) {
    if (err.message === "EXPENSE_NOT_FOUND") return bad("Expense not found.", 404);
    if (err.message === "NOT_OWNER") {
      return bad("Only the person who paid for this expense can reject settlements.", 403);
    }
    if (err.message === "SHARE_NOT_VERIFICATION") {
      return bad("That share isn't awaiting your approval.", 400);
    }
    throw err;
  }
}
