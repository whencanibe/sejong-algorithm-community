-- AlterTable
ALTER TABLE `Comment` MODIFY `text` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Post` MODIFY `title` TEXT NOT NULL,
    MODIFY `content` TEXT NOT NULL,
    MODIFY `code` TEXT NULL;
