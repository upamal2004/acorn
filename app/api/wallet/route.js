// PATCH /api/wallet — update the caller's personal wallet balance.
import { ok, bad, requireUser } from "@/lib/api";
import { updateBalance } from "@/lib/queries";
import { roundMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { amount } = await req.json().catch(() => ({}));
  const value = roundMoney(Number(amount));

  if (!Number.isFinite(value) || value < 0) {
    return bad("Enter a valid amount (0 or more).");
  }

  await updateBalance(user.id, value);
  return ok({ balance: value });
}
