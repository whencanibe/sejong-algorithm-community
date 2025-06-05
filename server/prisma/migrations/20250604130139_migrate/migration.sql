-- DropForeignKey
ALTER TABLE `UserCard` DROP FOREIGN KEY `UserCard_userId_fkey`;

-- DropIndex
DROP INDEX `UserCard_userId_createdAt_idx` ON `UserCard`;

-- AddForeignKey
ALTER TABLE `UserCard` ADD CONSTRAINT `UserCard_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
