-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "AgentProfile" ADD COLUMN     "commissionAmount" DECIMAL(65,30) NOT NULL DEFAULT 10.00,
ADD COLUMN     "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENTAGE';
