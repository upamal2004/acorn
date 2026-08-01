// ---------------------------------------------------------------------------
// money.js — tiny helpers for currency display & math.
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
