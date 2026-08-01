// The NextAuth route handler — all auth endpoints (signin, callback, session)
// are served from here. See https://authjs.dev for details.
import { handlers } from "@/auth";

export const { GET, POST } = handlers;
