/*
  Warnings:

  - You are about to drop the column `organisationId` on the `Department` table. All the data in the column will be lost.
  - The primary key for the `ScheduleMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `updatedAt` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `organisationId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DepartmentPresenceDays` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdById]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organisationSlug,slug]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[createdById]` on the table `Organisation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentId,slug]` on the table `Schedule` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,userId]` on the table `ScheduleMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `createdById` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationSlug` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `ScheduleMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `createdById` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organisationSlug` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_organisationId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentPresenceDays" DROP CONSTRAINT "DepartmentPresenceDays_departmentPresenceId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organisationId_fkey";

-- DropIndex
DROP INDEX "Department_organisationId_slug_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "organisationId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "organisationSlug" TEXT NOT NULL,
ALTER COLUMN "nameShort" DROP NOT NULL;

-- AlterTable
ALTER TABLE "DepartmentEmployee" ADD COLUMN     "canDeleteEmployee" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organisation" ADD COLUMN     "createdById" TEXT NOT NULL,
ALTER COLUMN "nameShort" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleMember" DROP CONSTRAINT "ScheduleMember_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ScheduleMember_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "updatedAt",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "nameShort" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "organisationId",
ADD COLUMN     "createdById" TEXT,
ADD COLUMN     "organisationSlug" TEXT NOT NULL;

-- DropTable
DROP TABLE "DepartmentPresenceDays";

-- CreateTable
CREATE TABLE "DepartmentPresenceDay" (
    "id" TEXT NOT NULL,
    "departmentPresenceId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "hours" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DepartmentPresenceDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleTask" (
    "id" TEXT NOT NULL,
    "scheduleId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,

    CONSTRAINT "ScheduleTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialDate" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SpecialDate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleTask_scheduleId_taskId_key" ON "ScheduleTask"("scheduleId", "taskId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_createdById_key" ON "Department"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Department_organisationSlug_slug_key" ON "Department"("organisationSlug", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "Organisation_createdById_key" ON "Organisation"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "Schedule_departmentId_slug_key" ON "Schedule"("departmentId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleMember_scheduleId_userId_key" ON "ScheduleMember"("scheduleId", "userId");

-- AddForeignKey
ALTER TABLE "Organisation" ADD CONSTRAINT "Organisation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organisationSlug_fkey" FOREIGN KEY ("organisationSlug") REFERENCES "Organisation"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationSlug_fkey" FOREIGN KEY ("organisationSlug") REFERENCES "Organisation"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentPresenceDay" ADD CONSTRAINT "DepartmentPresenceDay_departmentPresenceId_fkey" FOREIGN KEY ("departmentPresenceId") REFERENCES "DepartmentPresence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTask" ADD CONSTRAINT "ScheduleTask_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "Schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTask" ADD CONSTRAINT "ScheduleTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
