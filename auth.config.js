// ---------------------------------------------------------------------------
// auth.config.js — Auth.js configuration WITHOUT the Neo4j adapter.
//
// This module is imported by BOTH the server (auth.js) and the edge proxy
// (proxy.js). The adapter is deliberately excluded so the edge bundle never
// pulls in neo4j-driver or node:crypto.
// ---------------------------------------------------------------------------
import Google from "next-auth/providers/google";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],

  // JWT sessions: the cookie is self-contained, so the edge proxy can check
  // sign-in state without touching the database on every request.
  session: { strategy: "jwt" },

  pages: { signIn: "/login" },

  trustHost: true, // required behind Vercel / proxies

  callbacks: {
    // On sign-in only, the adapter hands us the fresh User node — grab the
    // wallet + room so the session mirrors the graph.
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
};
