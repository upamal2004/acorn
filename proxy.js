// ---------------------------------------------------------------------------
// proxy.js — Next.js 16 edge proxy (replaces the middleware convention).
//
// Only guards the signed-in gate. Room routing is handled server-side by the
// pages themselves (each fetches fresh data), so the edge bundle stays tiny
// and never imports the Neo4j driver.
// ---------------------------------------------------------------------------
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth((req) => {
  const { nextUrl, auth } = req;

  if (!auth?.user) {
    const login = new URL("/login", nextUrl.origin);
    login.searchParams.set("callbackUrl", nextUrl.pathname);
    return Response.redirect(login);
  }
});

export const config = {
  matcher: ["/dashboard", "/onboarding"],
};
