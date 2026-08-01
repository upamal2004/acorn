// ---------------------------------------------------------------------------
// AuthContext.jsx — wraps Firebase Auth and the current user's Firestore
// profile so any component can call `useAuth()`.
//
// Exposes: user (Firebase user), profile (users/{uid} doc), loading, and the
// signInWithGoogle / signOut / refreshProfile actions.
// ---------------------------------------------------------------------------
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { onAuthStateChanged, signInWithPopup, signOut as fbSignOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase.js";
import { userRef, ensureUserDoc } from "../lib/rooms.js";
import { onSnapshot } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // `user` is the raw Firebase Auth user; `profile` is the users/{uid} doc.
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Subscribe to auth changes, then to the user's profile doc.
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Make sure a Firestore profile exists (first-time sign-in).
        try {
          await ensureUserDoc(fbUser);
        } catch (err) {
          console.error("Failed to ensure user doc:", err);
        }
        setUser(fbUser);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return unsubscribeAuth;
  }, []);

  // Keep `profile` in sync with Firestore (roomId, personalBalance, ...).
  useEffect(() => {
    if (!user) return;

    const unsubscribeProfile = onSnapshot(userRef(user.uid), (snap) => {
      setProfile(snap.exists() ? { id: snap.id, ...snap.data() } : null);
    });

    return unsubscribeProfile;
  }, [user]);

  const signInWithGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOut = useCallback(() => fbSignOut(auth), []);

  const value = useMemo(
    () => ({ user, profile, loading, signInWithGoogle, signOut }),
    [user, profile, loading, signInWithGoogle, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
