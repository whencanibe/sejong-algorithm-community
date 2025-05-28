-- CreateTable
CREATE TABLE `DailyQuest` (
    `date` DATETIME(3) NOT NULL,
    `problemId` INTEGER NOT NULL,

    PRIMARY KEY (`date`, `problemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `QuestSolve` (
    `userId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `problemId` INTEGER NOT NULL,
    `solvedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`userId`, `date`, `problemId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestSolve` ADD CONSTRAINT `QuestSolve_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestSolve` ADD CONSTRAINT `QuestSolve_date_problemId_fkey` FOREIGN KEY (`date`, `problemId`) REFERENCES `DailyQuest`(`date`, `problemId`) ON DELETE RESTRICT ON UPDATE CASCADE;
