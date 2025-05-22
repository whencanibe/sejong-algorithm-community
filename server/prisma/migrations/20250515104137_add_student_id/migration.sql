-- AlterTable
ALTER TABLE `User` ADD COLUMN `enrollYear` INTEGER NOT NULL DEFAULT 2025,
    ADD COLUMN `major` VARCHAR(191) NOT NULL DEFAULT 'unknown',
    ADD COLUMN `solvedNum` INTEGER NULL,
    ADD COLUMN `tier` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SolveSnapshot` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `solvedCount` INTEGER NOT NULL,
    `snapedAt` DATETIME(3) NOT NULL,

    INDEX `SolveSnapshot_snapedAt_idx`(`snapedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeeklyRank` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weekStart` DATETIME(3) NOT NULL,
    `major` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `solvedThisWeek` INTEGER NOT NULL,

    INDEX `WeeklyRank_weekStart_major_idx`(`weekStart`, `major`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SolveSnapshot` ADD CONSTRAINT `SolveSnapshot_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeeklyRank` ADD CONSTRAINT `WeeklyRank_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
