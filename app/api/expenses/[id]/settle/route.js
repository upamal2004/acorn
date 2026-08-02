// POST /api/expenses/[id]/settle -- mark the caller's share as
// PENDING_VERIFICATION ("I paid -- awaiting the payer's approval"). Balances
// only move once the expense's payer approves (see /approve). The query only
// matches a share that belongs to the caller, so users can only ever settle
// their own part.
import { ok, bad, requireUser } from "@/lib/api";
import { markSharePendingVerification } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { sendPushToUser } from "@/lib/push";

export const dynamic = "force-dynamic";

export async function POST(_req, { params }) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { id } = await params;
  try {
    await markSharePendingVerification({ expenseId: id, uid: user.id });

    // Notify the expense payer that a member has marked their share as paid.
    const expense = await prisma.expense.findUnique({
      where: { id },
      select: { title: true, paidBy: true },
    });
    if (expense && expense.paidBy !== user.id) {
      sendPushToUser(expense.paidBy, {
        title: "Settlement awaiting approval",
        body: `${user.name} marked their share of "${expense.title}" as paid. Tap to approve or reject.`,
        tag: `settle-${id}`,
        url: "/dashboard",
      }).catch(() => {});
    }

    return ok();
  } catch (err) {
    if (err.message === "SHARE_NOT_FOUND") {
      return bad("No unpaid share found for you on this expense.", 404);
    }
    throw err;
  }
}
