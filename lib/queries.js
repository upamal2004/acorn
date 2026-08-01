// ---------------------------------------------------------------------------
// lib/queries.js — all data access for Acorn, backed by Neon (PostgreSQL)
// through Prisma. Mirrors the functions previously implemented on Neo4j so
// the rest of the app is unchanged.
//
// Money is stored as integer cents; every read converts back to dollars so
// the API/UI contract stays the same as before.
// ---------------------------------------------------------------------------
import { prisma } from "./db.js";
import { toCents, fromCents } from "./money.js";

// --- Users -------------------------------------------------------------------

/** Find a user by their (lowercased) email — includes the password hash. */
export async function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

/** Fetch a full user row by id — includes the password hash (internal only). */
export async function findUserById(uid) {
  return prisma.user.findUnique({ where: { id: uid } });
}

/** Replace a user's password hash (called after the current one is verified). */
export async function updateUserPassword(uid, passwordHash) {
  await prisma.user.update({ where: { id: uid }, data: { passwordHash } });
}

/** Create a new email/password account. Returns the new user row. */
export async function createUser({ name, email, passwordHash }) {
  return prisma.user.create({
    data: { name, email, passwordHash },
  });
}

/** Store a (hashed) password-reset token with its expiry on the user. */
export async function setPasswordResetToken(uid, tokenHash, expiresAt) {
  await prisma.user.update({
    where: { id: uid },
    data: { resetToken: tokenHash, resetTokenExpiry: expiresAt },
  });
}

/**
 * Find the user whose reset token hash matches `tokenHash` and is still
 * unexpired. Returns null when there's no match or the link has expired.
 */
export async function findUserByResetToken(tokenHash) {
  return prisma.user.findFirst({
    where: { resetToken: tokenHash, resetTokenExpiry: { gt: new Date() } },
  });
}

/** Clear a user's reset token once the password has been changed. */
export async function clearPasswordResetToken(uid) {
  await prisma.user.update({
    where: { id: uid },
    data: { resetToken: null, resetTokenExpiry: null },
  });
}

/** Fetch a user profile (balance in dollars). */
export async function getUser(uid) {
  const u = await prisma.user.findUnique({ where: { id: uid } });
  if (!u) return null;
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    balance: fromCents(u.balance),
    roomId: u.roomId,
  };
}

/** Update the user's current physical cash / bank balance (dollars in, cents out). */
export async function updateBalance(uid, amount) {
  await prisma.user.update({
    where: { id: uid },
    data: { balance: toCents(amount) },
  });
}

// --- Rooms -------------------------------------------------------------------

/**
 * Create a new room owned by `uid`. The caller must ensure `code` is unique
 * (Room.code has a unique constraint). Creates the owner as a member too.
 * @returns {{ id: string, code: string }}
 */
export async function createRoom({ name, ownerId, code }) {
  return prisma.$transaction(async (tx) => {
    const room = await tx.room.create({
      data: {
        name: (name || "").trim() || "My Acorn Room",
        code,
        ownerId,
      },
    });
    await tx.user.update({ where: { id: ownerId }, data: { roomId: room.id } });
    return { id: room.id, code: room.code };
  });
}

/**
 * Join a room by code. Returns the resolved room; throws when the code is
 * unknown. Idempotent — joining again just re-links the same room.
 * @returns {{ roomId: string, code: string }}
 */
export async function joinRoom({ code, uid }) {
  const room = await prisma.room.findUnique({ where: { code } });
  if (!room) throw new Error("ROOM_NOT_FOUND");

  await prisma.user.update({ where: { id: uid }, data: { roomId: room.id } });
  return { roomId: room.id, code: room.code };
}

/** Fetch a room's metadata, or null if it doesn't exist. */
export async function getRoom(roomId) {
  const r = await prisma.room.findUnique({ where: { id: roomId } });
  if (!r) return null;
  return {
    id: r.id,
    name: r.name,
    code: r.code,
    ownerId: r.ownerId,
    createdAt: r.createdAt.toISOString(),
  };
}

/** Fetch all member profiles of a room. */
export async function getMembers(roomId) {
  const members = await prisma.user.findMany({
    where: { roomId },
    orderBy: { name: "asc" },
  });
  return members.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    balance: fromCents(u.balance),
    roomId: u.roomId,
  }));
}

/** True when `uid` is a member of `roomId`. */
export async function isRoomMember(uid, roomId) {
  const found = await prisma.user.findFirst({
    where: { id: uid, roomId },
    select: { id: true },
  });
  return Boolean(found);
}

/**
 * Remove a member from a room (owner-only operation). Throws
 * MEMBER_NOT_IN_ROOM when the user isn't actually part of the room. The
 * removed user goes back to personal (solo) mode.
 */
export async function removeRoomMember({ roomId, memberId }) {
  const member = await prisma.user.findUnique({ where: { id: memberId } });
  if (!member || member.roomId !== roomId) throw new Error("MEMBER_NOT_IN_ROOM");

  await prisma.user.update({ where: { id: memberId }, data: { roomId: null } });
}

/** Voluntarily leave the current room and go back to personal mode. */
export async function leaveRoom(uid) {
  await prisma.user.update({ where: { id: uid }, data: { roomId: null } });
}

// --- Expenses ----------------------------------------------------------------

/**
 * Add an expense and split the total equally between the selected members.
 * The payer's own share is created PAID (they paid up front); everyone else
 * starts PENDING. Shares are stored in cents.
 *
 * Wallet effect: the payer's personal balance drops by the full amount they
 * paid up front.
 */
export async function createExpense({ roomId, title, amount, paidBy, createdBy, splitBetween }) {
  const totalCents = toCents(amount);
  const perShareCents = Math.round(totalCents / splitBetween.length);

  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.create({
      data: {
        roomId,
        title,
        amount: totalCents,
        paidBy,
        createdBy,
        shares: {
          create: splitBetween.map((userId) => ({
            userId,
            amount: perShareCents,
            status: userId === paidBy ? "PAID" : "PENDING",
          })),
        },
      },
    });

    await tx.user.update({
      where: { id: paidBy },
      data: { balance: { decrement: totalCents } },
    });

    return expense.id;
  });
}

/** Shape a raw Prisma expense row (with shares + payer) for the API/UI. */
function mapExpense(e) {
  const splits = {};
  for (const s of e.shares) {
    splits[s.userId] = {
      amount: fromCents(s.amount),
      status: s.status,
      paidAt: s.paidAt ? s.paidAt.toISOString() : null,
    };
  }
  return {
    id: e.id,
    title: e.title,
    amount: fromCents(e.amount),
    paidBy: e.paidBy,
    createdBy: e.createdBy,
    payerName: e.payer?.name ?? null,
    createdAt: e.createdAt.toISOString(),
    splits,
  };
}

/**
 * Fetch all expenses of a room (newest first) with their per-member splits
 * shaped as a uid → share map, ready for the summary helpers.
 */
export async function getExpenses(roomId) {
  const rows = await prisma.expense.findMany({
    where: { roomId },
    orderBy: { createdAt: "desc" },
    include: {
      shares: true,
      payer: { select: { name: true } },
    },
  });

  return rows.map(mapExpense);
}

/**
 * Fetch a user's personal (room-less) expenses — their own solo tracking.
 */
export async function getPersonalExpenses(uid) {
  const rows = await prisma.expense.findMany({
    where: { roomId: null, createdBy: uid },
    orderBy: { createdAt: "desc" },
    include: {
      shares: true,
      payer: { select: { name: true } },
    },
  });

  return rows.map(mapExpense);
}

/**
 * Mark the current user's share of an expense as PENDING_VERIFICATION —
 * the member claims they paid, but no wallet movement happens until the
 * expense's payer approves it (see approveShare). Throws SHARE_NOT_FOUND
 * when the user has no unpaid share on that expense.
 */
export async function markSharePendingVerification({ expenseId, uid }) {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      select: { shares: { where: { userId: uid, status: "PENDING" } } },
    });

    const share = expense?.shares?.[0];
    if (!share) throw new Error("SHARE_NOT_FOUND");

    await tx.expenseShare.update({
      where: { id: share.id },
      data: { status: "PENDING_VERIFICATION" },
    });
  });
}

/**
 * Approve a member's pending-verification share of an expense. Only the
 * expense's payer may approve — they're the one receiving the money. This is
 * the ONLY place wallet balances move for a settlement.
 *
 * Wallet effect: the settling user's balance drops by their share (they paid
 * it back to the payer), and the payer's balance rises by that share.
 *
 * Throws EXPENSE_NOT_FOUND, NOT_OWNER, or SHARE_NOT_VERIFICATION.
 */
export async function approveShare({ expenseId, uid, approveBy }) {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      select: {
        paidBy: true,
        shares: { where: { userId: uid, status: "PENDING_VERIFICATION" } },
      },
    });
    if (!expense) throw new Error("EXPENSE_NOT_FOUND");
    if (expense.paidBy !== approveBy) throw new Error("NOT_OWNER");

    const share = expense.shares?.[0];
    if (!share) throw new Error("SHARE_NOT_VERIFICATION");

    await tx.expenseShare.update({
      where: { id: share.id },
      data: { status: "PAID", paidAt: new Date() },
    });

    await tx.user.update({ where: { id: uid }, data: { balance: { decrement: share.amount } } });
    await tx.user.update({ where: { id: expense.paidBy }, data: { balance: { increment: share.amount } } });
  });
}

/**
 * Reject a member's pending-verification share — sends it back to PENDING so
 * they can settle again. Only the expense's payer may reject. No balance
 * changes (none happened yet). Throws EXPENSE_NOT_FOUND, NOT_OWNER, or
 * SHARE_NOT_VERIFICATION.
 */
export async function rejectShare({ expenseId, uid, rejectBy }) {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      select: {
        paidBy: true,
        shares: { where: { userId: uid, status: "PENDING_VERIFICATION" } },
      },
    });
    if (!expense) throw new Error("EXPENSE_NOT_FOUND");
    if (expense.paidBy !== rejectBy) throw new Error("NOT_OWNER");

    const share = expense.shares?.[0];
    if (!share) throw new Error("SHARE_NOT_VERIFICATION");

    await tx.expenseShare.update({
      where: { id: share.id },
      data: { status: "PENDING" },
    });
  });
}

/**
 * Delete an expense. Only the user who created the entry may delete it.
 * Throws EXPENSE_NOT_FOUND when it doesn't exist, and NOT_CREATOR when the
 * caller didn't add it.
 *
 * Wallet effect: reverses every movement the expense caused — the payer gets
 * the full amount back, and any already-settled member is refunded their share
 * (taken back from the payer).
 */
export async function deleteExpense({ expenseId, uid }) {
  return prisma.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { id: expenseId },
      include: { shares: true },
    });
    if (!expense) throw new Error("EXPENSE_NOT_FOUND");
    if (expense.createdBy !== uid) throw new Error("NOT_CREATOR");

    // Refund members who had already settled their share.
    for (const s of expense.shares) {
      if (s.status === "PAID" && s.userId !== expense.paidBy) {
        await tx.user.update({ where: { id: s.userId }, data: { balance: { increment: s.amount } } });
        await tx.user.update({ where: { id: expense.paidBy }, data: { balance: { decrement: s.amount } } });
      }
    }

    // Payer gets the full up-front amount back.
    await tx.user.update({ where: { id: expense.paidBy }, data: { balance: { increment: expense.amount } } });

    await tx.expense.delete({ where: { id: expenseId } });
  });
}
