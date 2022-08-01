/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "candidates" ALTER COLUMN "refreshToken" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "employees_refreshToken_key" ON "employees"("refreshToken");
