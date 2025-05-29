/*
  Warnings:

  - You are about to drop the `DailyQuest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `QuestSolve` DROP FOREIGN KEY `QuestSolve_date_problemId_fkey`;

-- DropIndex
DROP INDEX `QuestSolve_date_problemId_fkey` ON `QuestSolve`;

-- DropTable
DROP TABLE `DailyQuest`;
