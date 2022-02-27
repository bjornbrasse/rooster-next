-- CreateTable
CREATE TABLE "ScheduleMembers" (
    "scheduleId" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "ScheduleMembers_pkey" PRIMARY KEY ("scheduleId","memberId")
);

-- AddForeignKey
ALTER TABLE "ScheduleMembers" ADD CONSTRAINT "ScheduleMembers_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMembers" ADD CONSTRAINT "ScheduleMembers_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
