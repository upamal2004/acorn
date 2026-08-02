// ---------------------------------------------------------------------------
// summary.js — pure functions that turn a list of expenses into the numbers
// shown on the dashboard ("You owe", "You are owed", per-member status).
//
// Expense shape (as delivered by the API):
//   { id, title, amount, paidBy, createdAt,
//     splits: { [uid]: { amount, status: "PENDING"|"PENDING_VERIFICATION"|"PAID", paidAt } } }
// ---------------------------------------------------------------------------
import { roundMoney } from "./money.js";

export const PENDING = "PENDING";
export const PENDING_VERIFICATION = "PENDING_VERIFICATION";
export const PAID = "PAID";

function splitMembers(expense) {
  return Object.keys(expense.splits || {});
}

function perShare(expense) {
  const members = splitMembers(expense);
  return members.length ? expense.amount / members.length : 0;
}

/**
 * True when an expense still has an unpaid share — someone still owes money
 * or is waiting on a verification. The dashboard's main "Expenses" list only
 * shows these; fully settled transactions live in the History page.
 */
export function isExpenseActive(expense) {
  const members = splitMembers(expense);
  return members.length === 0 || members.some((uid) => expense.splits[uid].status !== PAID);
}

/**
 * True when an expense is still active FOR A SPECIFIC USER — meaning there is
 * work they still need to do or an action pending on them:
 *
 * - PAYER (paidBy === userId): the expense creator needs to approve or reject
 *   other members' settlements. Show the expense as long as ANY other member's
 *   share is not yet PAID — even after the payer's own share is auto-settled.
 *
 * - NON-PAYER (member of the split): their personal share is not yet fully
 *   settled. Shows expenses where the user:
 *     - Ows money (PENDING) — they haven't paid yet
 *     - Has paid but awaiting approval (PENDING_VERIFICATION) — visible until
 *       the payer approves or rejects
 *   Hidden only when the user's share is PAID (fully completed and approved).
 *
 * RULE SUMMARY (all three must hold for removal):
 *   1. The user's own payment is 100% completed (or they are the payer).
 *   2. The payment status is APPROVED (PAID).
 *   3. The expense is hidden from ALL views once every share is PAID or REJECTED.
 */
export function isExpenseActiveForUser(expense, userId) {
  // --- PAYER VIEW -----------------------------------------------------------
  // The payer's own share is auto-PAID on creation. They still need to see the
  // expense to approve/reject other members' settlements. Show the expense as
  // long as at least one OTHER share is not yet PAID.
  if (expense.paidBy === userId) {
    return Object.entries(expense.splits || {}).some(
      ([uid, s]) => uid !== userId && s.status !== PAID
    );
  }

  // --- NON-PAYER VIEW -------------------------------------------------------
  const share = expense.splits?.[userId];
  // If the user has no share at all, the expense isn't relevant to them.
  if (!share) return false;
  // Show if user still owes (PENDING) or is awaiting verification (PENDING_VERIFICATION).
  // Only hide when share is fully PAID.
  return share.status !== PAID;
}

/** True when every share of an expense is paid — nothing left to settle. */
export function isExpenseSettled(expense) {
  return !isExpenseActive(expense);
}

/**
 * Compute what the current user owes vs. is owed across all expenses.
 *
 * - If I paid for an expense, I'm owed every unpaid share of the others.
 * - If someone else paid and I'm in the split, I owe my (unpaid) share.
 */
export function computeSummary(expenses, currentUid) {
  let iOwe = 0;
  let owedToMe = 0;

  expenses.forEach((exp) => {
    const members = splitMembers(exp);
    if (!members.length) return;
    const share = perShare(exp);

    if (exp.paidBy === currentUid) {
      members.forEach((uid) => {
        if (uid !== currentUid && exp.splits[uid].status !== PAID) {
          owedToMe += share;
        }
      });
    } else if (
      members.includes(currentUid) &&
      exp.splits[currentUid].status !== PAID
    ) {
      iOwe += share;
    }
  });

  iOwe = roundMoney(iOwe);
  owedToMe = roundMoney(owedToMe);

  return { iOwe, owedToMe, net: roundMoney(owedToMe - iOwe) };
}

/**
 * Person-by-person debt breakdown: who I owe and who owes me, keyed by the
 * other member's uid.
 *
 * @returns { { youOwe: Record<string, number>, owedToYou: Record<string, number> } }
 *   `youOwe[uid]`   — how much I currently owe that person.
 *   `owedToYou[uid]` — how much that person currently owes me.
 */
export function computeWhoOwes(expenses, currentUid) {
  const youOwe = {};
  const owedToYou = {};

  expenses.forEach((exp) => {
    const members = splitMembers(exp);
    if (!members.length) return;
    const share = perShare(exp);

    if (exp.paidBy === currentUid) {
      // I paid — every unpaid share of the others is owed to me.
      members.forEach((uid) => {
        if (uid !== currentUid && exp.splits[uid].status !== PAID) {
          owedToYou[uid] = roundMoney((owedToYou[uid] || 0) + share);
        }
      });
    } else if (members.includes(currentUid) && exp.splits[currentUid].status !== PAID) {
      // Someone else paid and I'm in the split — I owe them my unpaid share.
      youOwe[exp.paidBy] = roundMoney((youOwe[exp.paidBy] || 0) + share);
    }
  });

  return { youOwe, owedToYou };
}

/**
 * Per-member aggregate status: how much they still owe the room, how much
 * the room still owes them, and how many unsettled shares they have.
 *
 * @returns { Record<string, { owes: number, owedTo: number, pendingCount: number }> }
 */
export function computeMemberStats(members, expenses) {
  const stats = {};
  members.forEach((m) => {
    stats[m.id] = { owes: 0, owedTo: 0, pendingCount: 0 };
  });

  expenses.forEach((exp) => {
    const membersInSplit = splitMembers(exp);
    const share = perShare(exp);

    membersInSplit.forEach((uid) => {
      if (exp.splits[uid].status !== PAID && stats[uid]) {
        stats[uid].owes += share;
        stats[uid].pendingCount += 1;
      }
    });

    const payerStats = stats[exp.paidBy];
    if (payerStats) {
      membersInSplit.forEach((uid) => {
        if (uid !== exp.paidBy && exp.splits[uid].status !== PAID) {
          payerStats.owedTo += share;
        }
      });
    }
  });

  Object.values(stats).forEach((s) => {
    s.owes = roundMoney(s.owes);
    s.owedTo = roundMoney(s.owedTo);
  });

  return stats;
}
