// ---------------------------------------------------------------------------
// summary.js — pure functions that turn a list of expenses into the numbers
// shown on the dashboard ("You owe", "You are owed", per-member status).
// ---------------------------------------------------------------------------
import { roundMoney } from "./money.js";

export const PENDING = "PENDING";
export const PAID = "PAID";

function perShare(expense) {
  const members = expense.splitBetween || [];
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
    const members = exp.splitBetween || [];
    if (!members.length) return;
    const share = perShare(exp);

    if (exp.paidBy === currentUid) {
      members.forEach((uid) => {
        if (uid !== currentUid && exp.splits?.[uid]?.status !== PAID) {
          owedToMe += share;
        }
      });
    } else if (
      members.includes(currentUid) &&
      exp.splits?.[currentUid]?.status !== PAID
    ) {
      iOwe += share;
    }
  });

  iOwe = roundMoney(iOwe);
  owedToMe = roundMoney(owedToMe);

  return { iOwe, owedToMe, net: roundMoney(owedToMe - iOwe) };
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
    const membersInSplit = exp.splitBetween || [];
    const share = perShare(exp);

    // Money this member still owes because they didn't pay their share.
    membersInSplit.forEach((uid) => {
      if (exp.splits?.[uid]?.status !== PAID && stats[uid]) {
        stats[uid].owes += share;
        stats[uid].pendingCount += 1;
      }
    });

    // Money others owe this member because *they* paid up front.
    const payerStats = stats[exp.paidBy];
    if (payerStats) {
      membersInSplit.forEach((uid) => {
        if (uid !== exp.paidBy && exp.splits?.[uid]?.status !== PAID) {
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
