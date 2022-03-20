-- CreateEnum
CREATE TYPE "CRUD" AS ENUM ('CREATE', 'READ', 'UPDATE', 'DELETE');

-- AlterTable
ALTER TABLE "DepartmentEmployee" ADD COLUMN     "canCreateTasks" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "canViewTasks" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "taskAuthorisations" "CRUD"[];

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "durationPerDay" DECIMAL(65,30) NOT NULL DEFAULT 1;
