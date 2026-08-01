// ---------------------------------------------------------------------------
// auth.js — Auth.js (NextAuth v5) configuration.
//
// Google Sign-In with users stored in Neon (PostgreSQL) via the official
// Prisma adapter. The adapter manages the User/Account/VerificationToken
// tables; the rest of the app extends User with balance + roomId.
//
// Only this file imports the adapter — proxy.js uses auth.config.js, which is
// free of the database so it can run on the edge runtime.
// ---------------------------------------------------------------------------
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
});
