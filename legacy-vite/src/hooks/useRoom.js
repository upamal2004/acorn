// ---------------------------------------------------------------------------
// useRoom.js — loads a room (live) together with its member profiles and
// expenses. Everything the dashboard needs is derived from these three values.
// ---------------------------------------------------------------------------
import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase.js";
import { roomRef, expensesCol } from "../lib/rooms.js";

export function useRoom(roomId) {
  const [room, setRoom] = useState(null);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live room doc + expenses. Sorting happens client-side so no composite
  // Firestore index is required.
  useEffect(() => {
    if (!roomId) {
      setRoom(null);
      setExpenses([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const unsubscribeRoom = onSnapshot(
      roomRef(roomId),
      (snap) => {
        if (!snap.exists()) {
          setRoom(null);
          setLoading(false);
          return;
        }
        setRoom({ id: snap.id, ...snap.data() });
        setLoading(false);
      },
      (err) => setError(err)
    );

    const unsubscribeExpenses = onSnapshot(
      query(expensesCol(), where("roomId", "==", roomId)),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Newest first by creation time.
        list.sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
        );
        setExpenses(list);
      }
    );

    return () => {
      unsubscribeRoom();
      unsubscribeExpenses();
    };
  }, [roomId]);

  // Fetch member profiles whenever the member list changes.
  const memberKey = room?.memberIds?.join(",") ?? "";
  useEffect(() => {
    if (!memberKey) {
      setMembers([]);
      return;
    }

    let cancelled = false;
    Promise.all(
      room.memberIds.map((uid) => getDoc(doc(db, "users", uid)))
    )
      .then((snaps) => {
        if (cancelled) return;
        setMembers(
          snaps.filter((s) => s.exists()).map((s) => ({ id: s.id, ...s.data() }))
        );
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [memberKey, roomId]); // eslint-disable-line react-hooks/exhaustive-deps

  return { room, members, expenses, loading, error };
}
