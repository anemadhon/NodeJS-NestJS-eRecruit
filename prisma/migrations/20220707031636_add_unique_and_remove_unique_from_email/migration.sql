/*
  Warnings:

  - A unique constraint covering the columns `[emailVerificationCode]` on the table `Candidate` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Candidate_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_emailVerificationCode_key" ON "Candidate"("emailVerificationCode");
