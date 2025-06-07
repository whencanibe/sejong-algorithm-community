/*
  Warnings:

  - You are about to drop the `SolveSnapshot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WeeklyRank` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `SolveSnapshot` DROP FOREIGN KEY `SolveSnapshot_userId_fkey`;

-- DropForeignKey
ALTER TABLE `WeeklyRank` DROP FOREIGN KEY `WeeklyRank_userId_fkey`;

-- DropTable
DROP TABLE `SolveSnapshot`;

-- DropTable
DROP TABLE `WeeklyRank`;
