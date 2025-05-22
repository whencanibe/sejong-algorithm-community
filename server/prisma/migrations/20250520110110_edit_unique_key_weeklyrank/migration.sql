/*
  Warnings:

  - A unique constraint covering the columns `[weekStart,userId,department]` on the table `WeeklyRank` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `WeeklyRank_weekStart_userId_key` ON `WeeklyRank`;

-- CreateIndex
CREATE UNIQUE INDEX `WeeklyRank_weekStart_userId_department_key` ON `WeeklyRank`(`weekStart`, `userId`, `department`);
