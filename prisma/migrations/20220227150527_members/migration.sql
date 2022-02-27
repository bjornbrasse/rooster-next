/*
  Warnings:

  - The primary key for the `ScheduleMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `memberId` on the `ScheduleMembers` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ScheduleMembers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ScheduleMembers" DROP CONSTRAINT "ScheduleMembers_memberId_fkey";

-- AlterTable
ALTER TABLE "ScheduleMembers" DROP CONSTRAINT "ScheduleMembers_pkey",
DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "ScheduleMembers_pkey" PRIMARY KEY ("scheduleId", "userId");

-- AddForeignKey
ALTER TABLE "ScheduleMembers" ADD CONSTRAINT "ScheduleMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
