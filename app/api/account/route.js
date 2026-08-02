// DELETE /api/account -- permanently delete the user's account.
// Removes all owned data: expenses, shares, push subscriptions, room membership,
// and the user row. If the user owns a room, the room is deleted too (cascade).
import { ok, bad, requireUser } from "@/lib/api";
import { prisma } from "@/lib/db";
import { signOut } from "@/auth";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const user = await requireUser();
  if (!user) return bad("Unauthorized", 401);

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { ownedRooms: true },
  });
  if (!dbUser) return bad("Account not found.", 404);

  await prisma.$transaction(async (tx) => {
    // Delete push subscriptions
    await tx.pushSubscription.deleteMany({ where: { userId: user.id } });

    // Delete expense shares
    await tx.expenseShare.deleteMany({ where: { userId: user.id } });

    // Delete expenses created by user
    await tx.expense.deleteMany({ where: { createdBy: user.id } });

    // Delete rooms owned by user (cascade deletes member assignments & expenses)
    for (const room of dbUser.ownedRooms) {
      await tx.room.delete({ where: { id: room.id } });
    }

    // Remove from any room membership
    await tx.user.update({
      where: { id: user.id },
      data: { roomId: null },
    });

    // Delete the user
    await tx.user.delete({ where: { id: user.id } });
  });

  return ok({ deleted: true });
}
