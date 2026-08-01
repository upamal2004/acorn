-- Allow multiple users to join the same room: drop the unique index on
-- User.roomId and replace it with a plain (non-unique) index.
DROP INDEX "User_roomId_key";
CREATE INDEX "User_roomId_idx" ON "User"("roomId");
