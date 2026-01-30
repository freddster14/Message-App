-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "expiresAt" SET DEFAULT NOW() + '7 days';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;
