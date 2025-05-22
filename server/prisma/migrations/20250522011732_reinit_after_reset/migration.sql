/*
  Warnings:

  - You are about to drop the column `enrollYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `grade` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `enrollYear`,
    DROP COLUMN `grade`,
    DROP COLUMN `major`,
    DROP COLUMN `nickname`,
    MODIFY `department` VARCHAR(191) NOT NULL DEFAULT 'unknown';
