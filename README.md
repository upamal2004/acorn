# 🌰 Acorn

Shared room expense & personal wallet tracker. Acorn keeps a single ledger for
your household — rent, bills, groceries — split equally, with one-tap settling.

**Stack:** Next.js 16 (App Router) · Neon Serverless PostgreSQL + Prisma ORM ·
Auth.js v5 with email/password sign-in · Tailwind CSS.

## Features

- **Rooms & codes** — create a room, share its `ACORN-XXX` code, flatmates join instantly.
- **Equal splits** — add any expense, pick who's in; Acorn computes each share.
- **One-tap settling** — pay your share, the ledger updates live for everyone.
- **Room summary** — "you owe / you're owed / net", per-member balances and pending counts.
- **Personal wallet** — each person's cash balance, tracked independently of the room.
- **Email/password accounts** — bcrypt-hashed passwords, no third-party sign-in.

## How it works (data model)

```
User { id, name, email, passwordHash, image, balance(¢), roomId }
Room { id, name, code, ownerId, createdAt }
Expense { id, roomId, title, amount(¢), paidBy, createdAt }
ExpenseShare { expenseId, userId, amount(¢), status: PENDING|PAID, paidAt }
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

| Variable       | Meaning                                  |
| -------------- | ---------------------------------------- |
| `DATABASE_URL` | Neon (PostgreSQL) connection string      |
| `AUTH_SECRET`  | Auth.js signing secret (auto-generated)  |
| `AUTH_URL`     | Your deployed URL (add before going live)|

## Deployment

1. **Database** — the schema is applied with `npm run db:push` (or `npm run
   db:migrate`). The provided Neon connection string already works.
2. **Vercel** — `npx vercel login`, then `npx vercel --prod`, pasting
   `DATABASE_URL`, `AUTH_SECRET` and `AUTH_URL` as environment variables.

No OAuth providers or redirect URIs are needed — sign-in is purely email and
password.

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
app/          pages (landing, login, signup, onboarding, dashboard) + API routes
components/   UI components (Logo, WalletCard, RoomSummary, Expenses, forms, …)
lib/          pure logic (money, room-code, summary, password) + data layer
prisma/       schema.prisma + migrations
auth.js       Auth.js v5 config (Credentials provider, JWT sessions)
scripts/      setup.js — credential collection + connection verification
```
