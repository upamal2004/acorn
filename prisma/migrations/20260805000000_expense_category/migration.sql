-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'MEDICAL', 'RENT', 'OTHERS');

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN "category" "ExpenseCategory" NOT NULL DEFAULT 'OTHERS';
ALTER TABLE "Expense" ADD COLUMN "description" TEXT;
