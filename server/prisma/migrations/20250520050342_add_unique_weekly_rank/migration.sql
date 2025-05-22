/*
  Warnings:

  - A unique constraint covering the columns `[weekStart,userId]` on the table `WeeklyRank` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `WeeklyRank_weekStart_userId_key` ON `WeeklyRank`(`weekStart`, `userId`);
