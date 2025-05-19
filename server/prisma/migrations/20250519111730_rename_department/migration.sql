/*
  Warnings:

  - You are about to drop the column `enrollYear` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `User` table. All the data in the column will be lost.
  - Added the required column `studentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `enrollYear`,
    DROP COLUMN `major`,
    ADD COLUMN `department` VARCHAR(191) NOT NULL DEFAULT 'unknown',
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL;
