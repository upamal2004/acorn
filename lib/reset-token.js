// ---------------------------------------------------------------------------
// lib/reset-token.js — secure, single-use password-reset tokens.
//
// The token sent in the email is random bytes; only its SHA-256 hash is
// stored on the User row, so a database leak can't be replayed as a link.
// ---------------------------------------------------------------------------
import crypto from "node:crypto";

export const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/** Generate a fresh, unpredictable token for a reset link. */
export function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

/** Hash a token for storage/lookup (SHA-256, not reversible). */
export function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}
