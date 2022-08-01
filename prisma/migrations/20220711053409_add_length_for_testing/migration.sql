/*
  Warnings:

  - You are about to alter the column `firstName` on the `Candidate` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "firstName" SET DATA TYPE VARCHAR(6),
ALTER COLUMN "emailVerificationCode" SET DATA TYPE TEXT;
