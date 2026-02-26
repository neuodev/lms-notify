/*
  Warnings:

  - You are about to drop the column `sessions` on the `School` table. All the data in the column will be lost.
  - Made the column `sessionId` on table `MessageLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "MessageLog_createdAt_idx";

-- AlterTable
ALTER TABLE "MessageLog" ALTER COLUMN "sessionId" SET NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "sessions";
