// ---------------------------------------------------------------------------
// auth.js — Auth.js (NextAuth v5) configuration for email/password + Google
// OAuth authentication.
//
// Users are created via /api/register (bcrypt-hashed passwords) or
// automatically on first Google sign-in. JWT sessions avoid database
// round-trips when reading sessions.
// ---------------------------------------------------------------------------
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { findUserByEmail, findOrCreateGoogleUser } from "@/lib/queries";
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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

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
        if (!user || !user.passwordHash) return null;

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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.balance = user.balance ?? 0;
        token.roomId = user.roomId ?? null;
      }

      // First-time Google sign-in: find or create the user in our database
      if (account?.provider === "google" && token.email) {
        try {
          const dbUser = await findOrCreateGoogleUser({
            email: token.email,
            name: token.name ?? "Google User",
            image: token.picture ?? null,
          });
          token.id = dbUser.id;
          token.balance = fromCents(dbUser.balance);
          token.roomId = dbUser.roomId ?? null;
        } catch {
          // If user creation fails, the token still has the basic info
        }
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
