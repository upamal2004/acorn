"use client";

import { SessionProvider } from "next-auth/react";

/** Wraps the whole app with Auth.js' React context. */
export function AuthProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
