/*
  Warnings:

  - You are about to drop the `DepartmentUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DepartmentUser" DROP CONSTRAINT "DepartmentUser_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "DepartmentUser" DROP CONSTRAINT "DepartmentUser_userId_fkey";

-- DropTable
DROP TABLE "DepartmentUser";

-- CreateTable
CREATE TABLE "DepartmentEmployee" (
    "departmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "assignedBy" TEXT,
    "isDefaultDepartment" BOOLEAN NOT NULL DEFAULT false,
    "canViewEmployees" BOOLEAN NOT NULL DEFAULT false,
    "canCreateEmployee" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "DepartmentEmployee_pkey" PRIMARY KEY ("departmentId","userId")
);

-- AddForeignKey
ALTER TABLE "DepartmentEmployee" ADD CONSTRAINT "DepartmentEmployee_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartmentEmployee" ADD CONSTRAINT "DepartmentEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
