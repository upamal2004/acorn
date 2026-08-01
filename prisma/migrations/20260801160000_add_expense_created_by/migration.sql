-- Track who added each expense so only the creator can delete it.
-- Backfill existing rows to the payer (they were the ones who added entries
-- in the previous version), then make it NOT NULL.
ALTER TABLE "Expense" ADD COLUMN "createdBy" TEXT;
UPDATE "Expense" SET "createdBy" = "paidBy" WHERE "createdBy" IS NULL;
ALTER TABLE "Expense" ALTER COLUMN "createdBy" SET NOT NULL;
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
