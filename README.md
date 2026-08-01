# 🍑 Peach

Shared room expense & personal wallet tracker. Peach keeps a single ledger for
your household — rent, bills, groceries — split equally, with one-tap settling.

**Stack:** Next.js 16 (App Router) · Neon Serverless PostgreSQL + Prisma ORM ·
Auth.js v5 with Google Sign-In · Tailwind CSS.

## Features

- **Rooms & codes** — create a room, share its `PEACH-XXX` code, flatmates join instantly.
- **Equal splits** — add any expense, pick who's in; Peach computes each share.
- **One-tap settling** — pay your share, the ledger updates live for everyone.
- **Room summary** — "you owe / you're owed / net", per-member balances and pending counts.
- **Personal wallet** — each person's cash balance, tracked independently of the room.
- **Google Sign-In** — persisted in PostgreSQL via the official Auth.js Prisma adapter.

## How it works (data model)

```
User { id, name, email, image, balance(¢), roomId }
Room { id, name, code, ownerId, createdAt }
Expense { id, roomId, title, amount(¢), paidBy, createdAt }
ExpenseShare { expenseId, userId, amount(¢), status: PENDING|PAID, paidAt }
Account / Session / VerificationToken   ← Auth.js tables
```

All money is stored as **integer cents** (`lib/queries.js` converts to dollars
at the API boundary) to avoid floating-point drift.

## Local development

```bash
npm install
npm run setup        # interactively collects creds, verifies the DB, writes .env.local
npm run db:push      # apply the schema to the database (or npm run db:migrate)
npm run dev
```

Required environment variables (written to `.env.local` by setup):

| Variable             | Meaning                                          |
| -------------------- | ------------------------------------------------ |
| `DATABASE_URL`       | Neon (PostgreSQL) connection string              |
| `AUTH_GOOGLE_ID`     | Google OAuth client id                           |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret                       |
| `AUTH_SECRET`        | Auth.js signing secret (auto-generated)          |
| `AUTH_URL`           | Your deployed URL (add before going live)        |

## Deployment

`npm run setup` prints the exact runbook. The short version:

1. **Database** — the schema is applied with `npm run db:push` (or `npm run
   db:migrate`). The provided Neon connection string already works.
2. **Google OAuth** — create a Web application client at
   <https://console.cloud.google.com/apis/credentials>, then whitelist:
   - Authorized JavaScript origin: `https://<app>.vercel.app`
   - Authorized redirect URI: `https://<app>.vercel.app/api/auth/callback/google`
3. **Vercel** — `npx vercel login`, then `npx vercel --prod`, pasting all
   `.env.local` values as environment variables (`DATABASE_URL`,
   `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_SECRET`, `AUTH_URL`).

## Scripts

| Command            | Purpose                                   |
| ------------------ | ----------------------------------------- |
| `npm run dev`      | Start the dev server                      |
| `npm run build`    | Generate Prisma client + production build |
| `npm run start`    | Serve the production build                |
| `npm run setup`    | Configure credentials + verify the DB     |
| `npm run db:push`  | Apply the Prisma schema to the database   |
| `npm run db:migrate` | Apply committed migrations              |

## Project layout

```
app/          pages (landing, login, onboarding, dashboard) + API routes
components/   UI components (Logo, WalletCard, RoomSummary, Expenses, …)
lib/          pure logic (money, room-code, summary) + data layer
prisma/       schema.prisma + migrations
auth.config.js  Auth.js config without the adapter (used by the edge proxy)
auth.js         Auth.js config with the Prisma adapter
proxy.js        Edge sign-in gate
scripts/      setup.js — credential collection + connection verification
```
