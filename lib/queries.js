// ---------------------------------------------------------------------------
// lib/queries.js — all data access for Peach, backed by Neon (PostgreSQL)
// through Prisma. Mirrors the functions previously implemented on Neo4j so
// the rest of the app is unchanged.
//
// Money is stored as integer cents; every read converts back to dollars so
// the API/UI contract stays the same as before.
// ---------------------------------------------------------------------------
import { prisma } from "./db.js";
import { toCents, fromCents } from "./money.js";

// --- Users -------------------------------------------------------------------

/** User rows are created by the Auth.js adapter with balance defaulting to 0. */
export async function ensureUserDefaults(uid) {
  await prisma.user.update({
    where: { id: uid },
    data: {},
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
        name: (name || "").trim() || "My Peach Room",
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

// --- Expenses ----------------------------------------------------------------

/**
 * Add an expense and split the total equally between the selected members.
 * The payer's own share is created PAID (they paid up front); everyone else
 * starts PENDING. Shares are stored in cents.
 */
export async function createExpense({ roomId, title, amount, paidBy, splitBetween }) {
  const totalCents = toCents(amount);
  const perShareCents = Math.round(totalCents / splitBetween.length);

  const expense = await prisma.expense.create({
    data: {
      roomId,
      title,
      amount: totalCents,
      paidBy,
      shares: {
        create: splitBetween.map((userId) => ({
          userId,
          amount: perShareCents,
          status: userId === paidBy ? "PAID" : "PENDING",
        })),
      },
    },
  });
  return expense.id;
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

  return rows.map((e) => {
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
      payerName: e.payer.name,
      createdAt: e.createdAt.toISOString(),
      splits,
    };
  });
}

/**
 * Mark the current user's share of an expense as PAID. Throws SHARE_NOT_FOUND
 * when the user has no pending share on that expense.
 */
export async function markSharePaid({ expenseId, uid }) {
  const res = await prisma.expenseShare.updateMany({
    where: { expenseId, userId: uid, status: "PENDING" },
    data: { status: "PAID", paidAt: new Date() },
  });
  if (res.count === 0) throw new Error("SHARE_NOT_FOUND");
}
