/*
  Warnings:

  - You are about to drop the column `organisationSlug` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `DepartmentEmployee` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `DepartmentEmployee` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Organisation` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `ScheduleMember` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ScheduleMember` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `ScheduleTask` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `organisationSlug` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[organisationId,slug]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[departmentId,employeeId]` on the table `DepartmentEmployee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[scheduleId,memberId]` on the table `ScheduleMember` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organisationId` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedById` to the `DepartmentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employeeId` to the `DepartmentEmployee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emailDomain` to the `Organisation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedById` to the `ScheduleMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `ScheduleMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignedById` to the `ScheduleTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `ScheduleTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `ScheduleTask` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Department" DROP CONSTRAINT "Department_organisationSlug_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_userId_fkey";

-- DropForeignKey
ALTER TABLE "ScheduleMember" DROP CONSTRAINT "ScheduleMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_createdById_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_organisationSlug_fkey";

-- DropIndex
DROP INDEX "Department_createdById_key";

-- DropIndex
DROP INDEX "Department_organisationSlug_slug_key";

-- DropIndex
DROP INDEX "DepartmentEmployee_departmentId_userId_key";

-- DropIndex
DROP INDEX "Organisation_createdById_key";

-- DropIndex
DROP INDEX "ScheduleMember_scheduleId_userId_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "organisationSlug",
ADD COLUMN     "organisationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "DepartmentEmployee" DROP COLUMN "assignedBy",
DROP COLUMN "userId",
ADD COLUMN     "assignedById" TEXT NOT NULL,
ADD COLUMN     "employeeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Organisation" DROP COLUMN "updatedAt",
ADD COLUMN     "emailDomain" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleMember" DROP COLUMN "assignedBy",
DROP COLUMN "userId",
ADD COLUMN     "assignedById" TEXT NOT NULL,
ADD COLUMN     "memberId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ScheduleTask" DROP COLUMN "assignedBy",
ADD COLUMN     "assignedById" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "SpecialDate" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "createdById",
DROP COLUMN "organisationSlug",
ADD COLUMN     "organisationId" TEXT,
ALTER COLUMN "initials" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserPreferences" (
    "userId" TEXT NOT NULL,
    "darkMode" BOOLEAN NOT NULL DEFAULT false
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreferences_userId_key" ON "UserPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_slug_key" ON "Department"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Department_organisationId_slug_key" ON "Department"("organisationId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentEmployee_departmentId_employeeId_key" ON "DepartmentEmployee"("departmentId", "employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleMember_scheduleId_memberId_key" ON "ScheduleMember"("scheduleId", "memberId");

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentEmployee" ADD CONSTRAINT "DepartmentEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentEmployee" ADD CONSTRAINT "DepartmentEmployee_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Schedule" ADD CONSTRAINT "Schedule_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleMember" ADD CONSTRAINT "ScheduleMember_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleTask" ADD CONSTRAINT "ScheduleTask_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organisationId_fkey" FOREIGN KEY ("organisationId") REFERENCES "Organisation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreferences" ADD CONSTRAINT "UserPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
