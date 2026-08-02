// PATCH /api/wallet -- update the caller's personal wallet balance.
// Supports two modes:
//   - "set": Set balance to the given amount (default)
//   - "add": Add amount to current balance
import { ok, bad, requireUser } from "@/lib/api";
import { updateBalance, addFunds } from "@/lib/queries";
import { roundMoney } from "@/lib/money";

export const dynamic = "force-dynamic";

export async function PATCH(req) {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const { amount, mode = "set" } = await req.json().catch(() => ({}));
  const value = roundMoney(Number(amount));

  if (!Number.isFinite(value) || value <= 0) {
    return bad("Enter a valid positive amount.");
  }

  if (mode === "add") {
    const newBalance = await addFunds(user.id, value);
    return ok({ balance: newBalance });
  }

  // Default: set mode (but require non-negative)
  if (value < 0) {
    return bad("Enter a valid amount (0 or more).");
  }

  await updateBalance(user.id, value);
  return ok({ balance: value });
}
