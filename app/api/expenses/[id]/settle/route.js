// POST /api/expenses/[id]/settle — mark the caller's share as PAID.
// The query only matches a share that belongs to the caller, so users can
// only ever settle their own part.
import { ok, bad, requireUser } from "@/lib/api";
import { markSharePaid } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function POST(_req, { params }) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { id } = await params;
  try {
    await markSharePaid({ expenseId: id, uid: user.id });
    return ok();
  } catch (err) {
    if (err.message === "SHARE_NOT_FOUND") {
      return bad("No unpaid share found for you on this expense.", 404);
    }
    throw err;
  }
}
