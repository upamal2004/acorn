-- Personal mode: an expense may exist without a room (roomId becomes optional).
ALTER TABLE "Expense" ALTER COLUMN "roomId" DROP NOT NULL;
