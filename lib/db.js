// ---------------------------------------------------------------------------
// lib/db.js -- singleton Prisma client.
//
// The global cache avoids exhausting database connections during dev
// hot-reloads; in production one client is reused for the server lifetime.
// ---------------------------------------------------------------------------
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
