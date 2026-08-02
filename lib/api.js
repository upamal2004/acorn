// ---------------------------------------------------------------------------
// lib/api.js -- tiny shared helpers for API route handlers.
// ---------------------------------------------------------------------------
import { NextResponse } from "next/server";
import { auth } from "@/auth";

/** Returns the authenticated user (session.user) or null when signed out. */
export async function requireUser() {
  const session = await auth();
  return session?.user ?? null;
}

export const ok = (data = {}) => NextResponse.json(data);
export const bad = (message, status = 400) =>
  NextResponse.json({ error: message }, { status });
