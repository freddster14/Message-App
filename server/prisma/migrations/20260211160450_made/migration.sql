-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + '7 days';
