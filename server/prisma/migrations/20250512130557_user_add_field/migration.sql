/*
  Warnings:

  - Added the required column `baekjoonName` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passward` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `baekjoonName` VARCHAR(191) NOT NULL,
    ADD COLUMN `passward` VARCHAR(191) NOT NULL;
