// ---------------------------------------------------------------------------
// rooms.js — all Firestore reads & writes for rooms, expenses and wallets.
//
// Keeping data-access in one place means the UI components stay pure presenters
// and the Firestore shape is defined exactly once, here.
// ---------------------------------------------------------------------------
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { generateRoomCode, normalizeRoomCode, isValidRoomCode } from "./roomCode.js";
import { roundMoney } from "./money.js";

// --- Collections -----------------------------------------------------------

export const usersCol = () => collection(db, "users");
export const roomsCol = () => collection(db, "rooms");
export const roomCodesCol = () => collection(db, "roomCodes");
export const expensesCol = () => collection(db, "expenses");

export const userRef = (uid) => doc(db, "users", uid);
export const roomRef = (roomId) => doc(db, "rooms", roomId);
export const expenseRef = (expenseId) => doc(db, "expenses", expenseId);

// --- Users / Personal wallet ----------------------------------------------

/** Create the user's Firestore profile on first sign-in (no-op if it exists). */
export async function ensureUserDoc(user) {
  const snap = await getDoc(userRef(user.uid));
  if (!snap.exists()) {
    await setDoc(userRef(user.uid), {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      roomId: null,
      personalBalance: 0,
      createdAt: serverTimestamp(),
    });
  }
}

/** Update the user's current physical cash / bank balance. */
export async function updatePersonalBalance(uid, amount) {
  await updateDoc(userRef(uid), { personalBalance: amount });
}

// --- Rooms -----------------------------------------------------------------

/**
 * Create a brand-new room owned by `uid`. Generates a unique code and wires
 * the owner's profile to the room in a single flow.
 *
 * @returns {{ roomId: string, code: string }}
 */
export async function createRoom({ name, ownerId }) {
  const roomName = (name || "").trim() || "My Peach Room";

  // 1) Find a code that isn't already taken.
  let code = generateRoomCode();
  while ((await getDoc(doc(roomCodesCol(), code))).exists()) {
    code = generateRoomCode();
  }

  // 2) Create the room with a random doc id. The room id stays private; only
  //    the shareable code is exposed through the `roomCodes` mapping.
  const room = doc(roomsCol());
  await setDoc(room, {
    name: roomName,
    code,
    ownerId,
    memberIds: [ownerId],
    createdAt: serverTimestamp(),
  });

  // 3) Publish the public code → room id mapping.
  await setDoc(doc(roomCodesCol(), code), { roomId: room.id });

  // 4) Attach the owner's profile to the room.
  await updateDoc(userRef(ownerId), { roomId: room.id });

  return { roomId: room.id, code };
}

/**
 * Join an existing room using its code.
 * @returns {{ roomId: string, code: string }}
 */
export async function joinRoom({ code, uid }) {
  const clean = normalizeRoomCode(code);
  if (!isValidRoomCode(clean)) {
    throw new Error(
      `Invalid code format. Expected something like "${generateRoomCode()}".`
    );
  }

  const codeSnap = await getDoc(doc(roomCodesCol(), clean));
  if (!codeSnap.exists()) {
    throw new Error("No room found with that code. Double-check and try again.");
  }

  const roomId = codeSnap.data().roomId;

  // Safe because Firestore rules only allow a user to *add themselves* here.
  await updateDoc(roomRef(roomId), { memberIds: arrayUnion(uid) });

  // Attach the joiner's profile to the room.
  await updateDoc(userRef(uid), { roomId });

  return { roomId, code: clean };
}

// --- Expenses --------------------------------------------------------------

/**
 * Add an expense and split the total equally between the selected members.
 *
 * The payer's own share is automatically marked PAID (they already spent the
 * money up front); everyone else's share starts as PENDING.
 */
export async function addExpense({ roomId, title, amount, paidBy, splitBetween }) {
  const safeAmount = roundMoney(Number(amount));
  if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
    throw new Error("Amount must be a number greater than zero.");
  }
  if (!splitBetween.length) {
    throw new Error("Pick at least one member to split with.");
  }

  const perShare = roundMoney(safeAmount / splitBetween.length);

  // Build the per-member split map (keyed by uid for easy status updates).
  const splits = {};
  splitBetween.forEach((uid) => {
    splits[uid] = {
      amount: perShare,
      status: uid === paidBy ? "PAID" : "PENDING",
      paidAt: uid === paidBy ? serverTimestamp() : null,
    };
  });

  await addDoc(expensesCol(), {
    roomId,
    title: (title || "").trim() || "Untitled expense",
    amount: safeAmount,
    paidBy,
    splitBetween,
    splits,
    createdAt: serverTimestamp(),
  });
}

/** Mark one member's share of an expense as PAID. */
export async function markSharePaid(expenseId, uid) {
  await updateDoc(expenseRef(expenseId), {
    [`splits.${uid}.status`]: "PAID",
    [`splits.${uid}.paidAt`]: serverTimestamp(),
  });
}
