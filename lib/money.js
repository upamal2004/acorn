// ---------------------------------------------------------------------------
// money.js — currency formatting & rounding helpers.
// ---------------------------------------------------------------------------

// Sri Lankan Rupees — shown as "Rs. X,XXX.XX".
const CURRENCY = "LKR";

const numberFmt = new Intl.NumberFormat("en-LK", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** `formatMoney(1234.5)` → "Rs. 1,234.50" */
export function formatMoney(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return `Rs. ${numberFmt.format(safe)}`;
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
