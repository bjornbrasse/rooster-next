/*
  Warnings:

  - You are about to drop the `DepartmentEmployee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_userId_fkey";

-- DropTable
DROP TABLE "DepartmentEmployee";

-- CreateTable
CREATE TABLE "DepartmentUser" (
    "departmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "isDefaultDepartment" BOOLEAN NOT NULL DEFAULT false,
    "canViewEmployees" BOOLEAN NOT NULL DEFAULT false,
    "canCreateEmployee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepartmentUser_pkey" PRIMARY KEY ("departmentId","userId")
);

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentUser" ADD CONSTRAINT "DepartmentUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
