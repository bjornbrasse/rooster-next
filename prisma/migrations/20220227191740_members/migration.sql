/*
  Warnings:

  - The primary key for the `DepartmentEmployee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `employeeId` on the `DepartmentEmployee` table. All the data in the column will be lost.
  - Added the required column `userId` to the `DepartmentEmployee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_employeeId_fkey";

-- AlterTable
ALTER TABLE "DepartmentEmployee" DROP CONSTRAINT "DepartmentEmployee_pkey",
DROP COLUMN "employeeId",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "DepartmentEmployee_pkey" PRIMARY KEY ("departmentId", "userId");

-- AddForeignKey
ALTER TABLE "DepartmentEmployee" ADD CONSTRAINT "DepartmentEmployee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
