// ---------------------------------------------------------------------------
// scripts/setup.js -- one-shot local setup for Acorn.
//
// What it does:
//   1. Reads any existing .env.local (so re-runs never clobber real values).
//   2. Prompts for anything missing: Neon (PostgreSQL) connection string and
//      the Google OAuth client id/secret.
//   3. Generates AUTH_SECRET if absent.
//   4. Verifies the database connection (schema is applied with
//      `npm run db:push` or `npm run db:migrate`).
//   5. Writes .env.local and prints the deployment runbook.
// ---------------------------------------------------------------------------
import { createInterface } from "node:readline/promises";
import { stdin, stdout, exit } from "node:process";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Client } = pg;

const ROOT = join(fileURLToPath(import.meta.url), "../..");
const ENV_FILE = join(ROOT, ".env.local");

// --- .env.local helpers -------------------------------------------------------

function parseEnv(content = "") {
  const out = {};
  for (const line of content.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
    if (m && !line.trim().startsWith("#")) out[m[1]] = m[2].trim();
  }
  return out;
}

function readExistingEnv() {
  if (existsSync(ENV_FILE)) return parseEnv(readFileSync(ENV_FILE, "utf8"));
  return {};
}

// --- prompts ------------------------------------------------------------------

async function ask(rl, label, { current = "", secret = false } = {}) {
  const suffix = current ? ` (current: ${secret ? "•••set•••" : current})` : "";
  const answer = (await rl.question(`  ${label}${suffix}: `)).trim();
  return answer || current;
}

// --- Postgres connectivity check ----------------------------------------------

async function verifyDatabase(url) {
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 8_000 });
  try {
    await client.connect();
    const res = await client.query("SELECT 1 AS ok");
    return { ok: true, db: res.rows[0]?.ok === 1 };
  } catch (err) {
    return { ok: false, error: err.message };
  } finally {
    await client.end();
  }
}

// --- deploy runbook ------------------------------------------------------------

function deployRunbook(hasVercelCli) {
  const vercelPart = hasVercelCli
    ? `The Vercel CLI is already installed. Deploy with:

    vercel login
    vercel --prod`
    : `1. Install the Vercel CLI and log in (one-time):

    npx vercel login

2. From this folder, deploy:

    npx vercel --prod`;

  return `
┌──────────────────────────────────────────────────────────────────┐
  Acorn is ready to deploy. One thing still needs your login:
┌──────────────────────────────────────────────────────────────────┘

1. Database (Neon)  -- configured in .env.local (verified ✓). The
   schema is applied by running `npm run db:push`.

2. Google OAuth  -- your client is configured in .env.local, but the
   redirect URI must be whitelisted in the Google Cloud Console:
   https://console.cloud.google.com/apis/credentials
   • Authorized JavaScript origin: https://<your-app>.vercel.app
   • Authorized redirect URI:      https://<your-app>.vercel.app/api/auth/callback/google

3. Deploy on Vercel:

    ${vercelPart}

   During `vercel --prod` it will detect Next.js automatically. On the
   "Environment Variables" screen paste the values from .env.local:
   DATABASE_URL, AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET, AUTH_SECRET.

   When prompted, add:  AUTH_URL=https://<your-app>.vercel.app
`;
}

// --- main ----------------------------------------------------------------------

async function main() {
  const env = readExistingEnv();

  console.log(`
🌰 Acorn setup
────────────────────────────────────────────────────────
Existing .env.local values are kept -- you'll only be
prompted for what's missing.
`);

  const rl = createInterface({ input: stdin, output: stdout });

  try {
    // 1. Neon database
    console.log("Step 1 · Neon (PostgreSQL)");
    console.log('  Get a free database at https://console.neon.tech, or keep an existing');
    console.log("  connection string (postgresql://...).\n");

    const databaseUrl = await ask(rl, "DATABASE_URL", {
      current: env.DATABASE_URL || "",
    });

    console.log("\n  Verifying connection…");
    const check = await verifyDatabase(databaseUrl);
    if (!check.ok) {
      console.error(`\n  ✗ Could not connect: ${check.error}`);
      console.error("    Double-check the connection string, then run `npm run setup` again.");
      exit(1);
    }
    console.log("  ✓ Connection works.");

    // 2. Google OAuth
    console.log("\nStep 2 · Google Sign-In");
    console.log("  Create a client at https://console.cloud.google.com/apis/credentials");
    console.log('  (Application type: Web application). Copy the Client ID and secret.\n');

    const googleId = await ask(rl, "AUTH_GOOGLE_ID", {
      current: env.AUTH_GOOGLE_ID || "",
      secret: true,
    });
    const googleSecret = await ask(rl, "AUTH_GOOGLE_SECRET", {
      current: env.AUTH_GOOGLE_SECRET || "",
      secret: true,
    });

    // 3. AUTH_SECRET
    const authSecret =
      env.AUTH_SECRET ||
      (await ask(rl, "AUTH_SECRET (press Enter to generate)", {
        current: "",
        secret: true,
      })) ||
      randomBytes(32).toString("base64url");

    // 4. Write .env.local
    const lines = [
      "# Acorn environment -- generated by `npm run setup`",
      "",
      "# Neon (PostgreSQL)",
      `DATABASE_URL=${databaseUrl}`,
      "",
      "# Google OAuth",
      `AUTH_GOOGLE_ID=${googleId}`,
      `AUTH_GOOGLE_SECRET=${googleSecret}`,
      "",
      "# Auth.js -- any long random string",
      `AUTH_SECRET=${authSecret}`,
      "",
      "# Set to your deployed URL before going live",
      `AUTH_URL=`,
      "",
    ].join("\n");

    writeFileSync(ENV_FILE, lines);
    console.log(`\n  ✓ Wrote .env.local (${ENV_FILE})`);

    // 5. Apply schema + deploy runbook
    console.log("\n  Applying database schema…");
    try {
      // spawnSync so output streams to the terminal
      const { spawnSync } = await import("node:child_process");
      const res = spawnSync("npx.cmd", ["prisma", "db", "push"], {
        cwd: ROOT,
        stdio: "inherit",
        shell: true,
      });
      if (res.status !== 0) {
        console.warn("  ⚠ Schema push failed -- run `npm run db:push` manually.");
      } else {
        console.log("  ✓ Schema applied.");
      }
    } catch (err) {
      console.warn(`  ⚠ Could not run prisma: ${err.message}`);
    }

    let hasVercelCli = false;
    try {
      const { spawnSync } = await import("node:child_process");
      const res = spawnSync("vercel", ["--version"], { stdio: "ignore", shell: true });
      hasVercelCli = res.status === 0;
    } catch {
      // not installed -- the runbook uses npx instead
    }

    console.log(deployRunbook(hasVercelCli));
  } finally {
    rl.close();
  }
}

main().catch((err) => {
  console.error(err);
  exit(1);
});
