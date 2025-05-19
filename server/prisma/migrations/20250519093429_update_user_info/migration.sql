/*
  Warnings:

  - Added the required column `department` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grade` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `department` VARCHAR(191) NOT NULL,
    ADD COLUMN `grade` INTEGER NOT NULL,
    ADD COLUMN `nickname` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentId` VARCHAR(191) NOT NULL;
