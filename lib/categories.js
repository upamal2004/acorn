// ---------------------------------------------------------------------------
// lib/categories.js — the canonical expense category list, shared by the
// "Add expense" form, the dashboard feed and the analytics view. Values match
// the `ExpenseCategory` Prisma enum; labels are what users see.
// ---------------------------------------------------------------------------

export const EXPENSE_CATEGORIES = [
  { value: "FOOD", label: "Food", emoji: "🍔", color: "#f97316" },
  { value: "TRANSPORT", label: "Transport", emoji: "🚌", color: "#3b82f6" },
  { value: "UTILITIES", label: "Utilities", emoji: "💡", color: "#eab308" },
  { value: "ENTERTAINMENT", label: "Entertainment", emoji: "🎬", color: "#a855f7" },
  { value: "MEDICAL", label: "Medical", emoji: "💊", color: "#ef4444" },
  { value: "RENT", label: "Rent", emoji: "🏠", color: "#14b8a6" },
  { value: "OTHERS", label: "Others", emoji: "🧾", color: "#64748b" },
];

/** Resolve an enum value to its category meta (fallback to Others). */
export function categoryMeta(value) {
  return EXPENSE_CATEGORIES.find((c) => c.value === value) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
}

/** True when `value` is a valid enum value (used by the API to validate input). */
export function isValidCategory(value) {
  return EXPENSE_CATEGORIES.some((c) => c.value === value);
}
