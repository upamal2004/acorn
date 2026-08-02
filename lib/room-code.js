// ---------------------------------------------------------------------------
// room-code.js -- generate & validate Acorn room codes.
//
// Codes follow the format "ACORN-XXX" (e.g. "ACORN-9X2"). The random segment
// uses a reduced alphabet so ambiguous characters (0/O, 1/I) never appear and
// codes stay easy to read out loud.
// ---------------------------------------------------------------------------

export const ROOM_CODE_PREFIX = "ACORN";
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SEGMENT_LENGTH = 3;

/** Generate a fresh code segment, e.g. "ACORN-9X2". */
export function generateRoomCode() {
  let segment = "";
  for (let i = 0; i < SEGMENT_LENGTH; i++) {
    segment += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${ROOM_CODE_PREFIX}-${segment}`;
}

/** Validate + normalize user input ("acorn-9x2 " → "ACORN-9X2"). */
export function normalizeRoomCode(raw) {
  return String(raw || "").trim().toUpperCase();
}

/** Returns true when the code matches the expected shape. */
export function isValidRoomCode(code) {
  return new RegExp(`^${ROOM_CODE_PREFIX}-[A-Z0-9]{${SEGMENT_LENGTH}}$`).test(code);
}
