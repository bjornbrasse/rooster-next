/*
  Warnings:

  - The primary key for the `DepartmentEmployee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `scheduleId` on the `Task` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[departmentId,userId]` on the table `DepartmentEmployee` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `DepartmentEmployee` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `departmentId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_scheduleId_fkey";

-- AlterTable
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "DepartmentEmployee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "scheduleId",
ADD COLUMN     "daysOfTheWeek" TEXT NOT NULL DEFAULT E'0111110',
ADD COLUMN     "departmentId" TEXT NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "DepartmentPresence" (
    "id" TEXT NOT NULL,
    "departmentEmployeeId" TEXT NOT NULL,
    "from" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepartmentPresence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentPresenceDays" (
    "id" TEXT NOT NULL,
    "departmentPresenceId" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "hours" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "DepartmentPresenceDays_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepartmentEmployee_departmentId_userId_key" ON "DepartmentEmployee"("departmentId", "userId");

-- AddForeignKey
ALTER TABLE "DepartmentPresence" ADD CONSTRAINT "DepartmentPresence_departmentEmployeeId_fkey" FOREIGN KEY ("departmentEmployeeId") REFERENCES "DepartmentEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentPresenceDays" ADD CONSTRAINT "DepartmentPresenceDays_departmentPresenceId_fkey" FOREIGN KEY ("departmentPresenceId") REFERENCES "DepartmentPresence"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
