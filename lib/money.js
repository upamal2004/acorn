// ---------------------------------------------------------------------------
// money.js — currency formatting & rounding helpers.
// ---------------------------------------------------------------------------

// Change this to your local currency code ("INR", "EUR", "GBP", ...).
const CURRENCY = "USD";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `formatMoney(1234.5)` → "$1,234.50" */
export function formatMoney(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return formatter.format(safe);
}

/** Round to 2 decimals — important for equal-split calculations. */
export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

/** Convert a dollar amount (string/number) to integer cents. */
export function toCents(dollars) {
  const value = roundMoney(Number(dollars));
  return Math.round(value * 100);
}

/** Convert integer cents back to a dollar amount with 2 decimals. */
export function fromCents(cents) {
  return roundMoney(Number(cents) / 100);
}
