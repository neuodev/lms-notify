/*
  Warnings:

  - You are about to drop the column `email` on the `School` table. All the data in the column will be lost.
  - Made the column `message` on table `MessageLog` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "MessageLog" DROP CONSTRAINT "MessageLog_schoolId_fkey";

-- DropIndex
DROP INDEX "School_email_key";

-- AlterTable
ALTER TABLE "MessageLog" ALTER COLUMN "message" SET NOT NULL;

-- AlterTable
ALTER TABLE "School" DROP COLUMN "email",
ADD COLUMN     "sessions" TEXT[];

-- AddForeignKey
ALTER TABLE "MessageLog" ADD CONSTRAINT "MessageLog_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
