/*
  Warnings:

  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateExperience` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateOverview` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateSkill` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CandidateSocial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProcessState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Candidate" DROP CONSTRAINT "Candidate_processStateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateExperience" DROP CONSTRAINT "CandidateExperience_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateOverview" DROP CONSTRAINT "CandidateOverview_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateOverview" DROP CONSTRAINT "CandidateOverview_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateSkill" DROP CONSTRAINT "CandidateSkill_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "CandidateSocial" DROP CONSTRAINT "CandidateSocial_candidateId_fkey";

-- DropTable
DROP TABLE "Candidate";

-- DropTable
DROP TABLE "CandidateExperience";

-- DropTable
DROP TABLE "CandidateOverview";

-- DropTable
DROP TABLE "CandidateSkill";

-- DropTable
DROP TABLE "CandidateSocial";

-- DropTable
DROP TABLE "Employee";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "ProcessState";

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nik" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "addedAt" TEXT NOT NULL,
    "removedAt" TEXT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "slot" INTEGER NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "process_states" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "state" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "detail" TEXT NOT NULL,

    CONSTRAINT "process_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidates" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT,
    "username" TEXT,
    "password" TEXT NOT NULL DEFAULT 'password',
    "passwordResetCode" TEXT,
    "email" TEXT NOT NULL,
    "emailVerificationCode" TEXT,
    "emailIsVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_socials" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "whatsapp" TEXT,
    "instagram" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "candidateId" INTEGER,

    CONSTRAINT "candidate_socials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_skills" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "skill" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "candidateId" INTEGER NOT NULL,

    CONSTRAINT "candidate_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_experiences" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "company" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "joinedAt" DATE NOT NULL,
    "endedAt" DATE NOT NULL,
    "description" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,

    CONSTRAINT "candidate_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_overviews" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "overview" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "candidate_overviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "submittedAt" TEXT NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "processStateId" INTEGER NOT NULL,
    "jobId" INTEGER NOT NULL,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employees_nik_key" ON "employees"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "employees_email_key" ON "employees"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_username_key" ON "candidates"("username");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "candidates_emailVerificationCode_key" ON "candidates"("emailVerificationCode");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_socials_candidateId_key" ON "candidate_socials"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_skills_candidateId_key" ON "candidate_skills"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "candidate_experiences_candidateId_key" ON "candidate_experiences"("candidateId");

-- AddForeignKey
ALTER TABLE "candidate_socials" ADD CONSTRAINT "candidate_socials_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_skills" ADD CONSTRAINT "candidate_skills_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_experiences" ADD CONSTRAINT "candidate_experiences_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_overviews" ADD CONSTRAINT "candidate_overviews_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_overviews" ADD CONSTRAINT "candidate_overviews_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_processStateId_fkey" FOREIGN KEY ("processStateId") REFERENCES "process_states"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
