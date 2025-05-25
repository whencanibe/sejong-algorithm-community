/*
  Warnings:

  - You are about to drop the column `major` on the `WeeklyRank` table. All the data in the column will be lost.
  - Added the required column `department` to the `WeeklyRank` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `WeeklyRank_weekStart_major_idx` ON `WeeklyRank`;

-- AlterTable
ALTER TABLE `WeeklyRank` DROP COLUMN `major`,
    ADD COLUMN `department` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `WeeklyRank_weekStart_department_idx` ON `WeeklyRank`(`weekStart`, `department`);
