/*
  Warnings:

  - You are about to drop the `_CandidateToJob` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jobId` to the `Candidate` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CandidateToJob" DROP CONSTRAINT "_CandidateToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_CandidateToJob" DROP CONSTRAINT "_CandidateToJob_B_fkey";

-- AlterTable
ALTER TABLE "Candidate" ADD COLUMN     "jobId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CandidateToJob";

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
