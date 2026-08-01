// ---------------------------------------------------------------------------
// lib/password.js — bcrypt password hashing (bcryptjs: pure JS, works on
// every Node runtime, no native build step).
// ---------------------------------------------------------------------------
import bcrypt from "bcryptjs";

const ROUNDS = 10;

/** Hash a plaintext password for storage. */
export function hashPassword(password) {
  return bcrypt.hash(password, ROUNDS);
}

/** Compare a plaintext password against a stored bcrypt hash. */
export function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}
