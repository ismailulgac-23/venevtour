/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `AgentProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AgentProfile" DROP COLUMN "avatarUrl";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatarUrl" TEXT NOT NULL DEFAULT '/uploads/users/default-avatar.jpg',
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
