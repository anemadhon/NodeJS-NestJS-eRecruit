-- DropIndex
DROP INDEX "employees_refreshToken_key";

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "refreshToken" DROP DEFAULT;
