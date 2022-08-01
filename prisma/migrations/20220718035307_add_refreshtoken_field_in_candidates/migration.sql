/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `candidates` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "candidates" ADD COLUMN     "refreshToken" TEXT NOT NULL DEFAULT 'refresh-token';

-- CreateIndex
CREATE UNIQUE INDEX "candidates_refreshToken_key" ON "candidates"("refreshToken");
