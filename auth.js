// ---------------------------------------------------------------------------
// auth.js — Auth.js (NextAuth v5) configuration for email/password auth.
//
// Users are created via /api/register (bcrypt-hashed passwords stored on the
// User row). Sign-in uses the Credentials provider, which verifies the
// password and returns a JWT session cookie — no external providers, no
// adapter, no database round-trip when reading sessions.
// ---------------------------------------------------------------------------
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { findUserByEmail } from "@/lib/queries";
import { verifyPassword } from "@/lib/password";
import { fromCents } from "@/lib/money";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true, // required behind Vercel / proxies

  pages: {
    signIn: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await findUserByEmail(email);
        if (!user) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          balance: fromCents(user.balance),
          roomId: user.roomId,
        };
      },
    }),
  ],

  callbacks: {
    // On sign-in, copy the account fields into the token so the session
    // callback can surface them without hitting the database.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.balance = user.balance ?? 0;
        token.roomId = user.roomId ?? null;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.balance = token.balance ?? 0;
        session.user.roomId = token.roomId ?? null;
      }
      return session;
    },
  },
});
