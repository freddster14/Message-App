/*
  Warnings:

  - You are about to drop the column `lastMessageId` on the `ChatMember` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "lastMessageId",
ADD COLUMN     "lastReadMessageId" INTEGER;

-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + '7 days';
