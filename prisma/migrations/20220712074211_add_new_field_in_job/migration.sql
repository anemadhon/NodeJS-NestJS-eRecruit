/*
  Warnings:

  - Added the required column `slot` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidate" ALTER COLUMN "firstName" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "slot" INTEGER NOT NULL;
