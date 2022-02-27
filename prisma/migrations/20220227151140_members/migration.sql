/*
  Warnings:

  - You are about to drop the `ScheduleMembers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ScheduleMembers" DROP CONSTRAINT "ScheduleMembers_scheduleId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleMembers" DROP CONSTRAINT "ScheduleMembers_userId_fkey";

-- DropTable
DROP TABLE "ScheduleMembers";

-- CreateTable
CREATE TABLE "ScheduleMember" (
    "scheduleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "ScheduleMember_pkey" PRIMARY KEY ("scheduleId","userId")
);

-- AddForeignKey
ALTER TABLE "ScheduleMember" ADD CONSTRAINT "ScheduleMember_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMember" ADD CONSTRAINT "ScheduleMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
