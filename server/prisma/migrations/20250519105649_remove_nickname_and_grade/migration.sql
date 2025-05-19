/*
  Warnings:

  - You are about to drop the column `grade` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `grade`,
    DROP COLUMN `nickname`,
    ADD COLUMN `rank` INTEGER NULL,
    ADD COLUMN `solvedNum` INTEGER NULL,
    ADD COLUMN `tier` VARCHAR(191) NULL;
