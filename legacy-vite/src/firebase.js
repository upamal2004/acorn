// ---------------------------------------------------------------------------
// firebase.js — single source of truth for Firebase config & services.
//
// The config values are read from the environment so no secrets ever land in
// the repo. Copy `.env.example` to `.env.local` and fill in your own project
// credentials (see README.md).
// ---------------------------------------------------------------------------
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Authentication (Google Sign-In) + Cloud Firestore.
export const auth = getAuth(app);
export const db = getFirestore(app);

// Pre-configured provider used by the "Sign in with Google" button.
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
