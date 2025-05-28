/*
  Warnings:

  - The primary key for the `DailyQuest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `DailyQuest` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.
  - The primary key for the `QuestSolve` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `date` on the `QuestSolve` table. The data in that column could be lost. The data in that column will be cast from `DateTime(3)` to `DateTime(0)`.

*/
-- DropForeignKey
ALTER TABLE `QuestSolve` DROP FOREIGN KEY `QuestSolve_date_problemId_fkey`;

-- DropIndex
DROP INDEX `QuestSolve_date_problemId_fkey` ON `QuestSolve`;

-- AlterTable
ALTER TABLE `DailyQuest` DROP PRIMARY KEY,
    MODIFY `date` DATETIME(0) NOT NULL,
    ADD PRIMARY KEY (`date`, `problemId`);

-- AlterTable
ALTER TABLE `QuestSolve` DROP PRIMARY KEY,
    MODIFY `date` DATETIME(0) NOT NULL,
    ADD PRIMARY KEY (`userId`, `date`, `problemId`);

-- AddForeignKey
ALTER TABLE `QuestSolve` ADD CONSTRAINT `QuestSolve_date_problemId_fkey` FOREIGN KEY (`date`, `problemId`) REFERENCES `DailyQuest`(`date`, `problemId`) ON DELETE RESTRICT ON UPDATE CASCADE;
