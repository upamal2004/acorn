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
