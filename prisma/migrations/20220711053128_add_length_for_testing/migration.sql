/*
  Warnings:

  - You are about to alter the column `emailVerificationCode` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.
  - Added the required column `slug` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "emailVerificationCode" SET DATA TYPE VARCHAR(6);

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "slug" TEXT NOT NULL;
