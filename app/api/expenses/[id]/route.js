// DELETE /api/expenses/[id] -- remove an expense entry. Only the user who
// added the entry may delete it; all wallet movements it caused are reversed.
import { ok, bad, requireUser } from "@/lib/api";
import { deleteExpense } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function DELETE(_req, { params }) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { id } = await params;
  try {
    await deleteExpense({ expenseId: id, uid: user.id });
    return ok();
  } catch (err) {
    if (err.message === "EXPENSE_NOT_FOUND") {
      return bad("Expense not found.", 404);
    }
    if (err.message === "NOT_CREATOR") {
      return bad("Only the person who added this expense can delete it.", 403);
    }
    throw err;
  }
}
