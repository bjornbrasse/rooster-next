/*
  Warnings:

  - You are about to drop the column `canCreateTasks` on the `DepartmentEmployee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DepartmentEmployee" DROP COLUMN "canCreateTasks",
ADD COLUMN     "canCreateTask" BOOLEAN NOT NULL DEFAULT false;
