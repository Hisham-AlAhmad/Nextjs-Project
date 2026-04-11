-- AlterTable
ALTER TABLE `BlogPost` ADD COLUMN `coverImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `NewsPost` ADD COLUMN `coverImage` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `dashboardRoleId` INTEGER NULL;

-- CreateTable
CREATE TABLE `DashboardRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `permissions` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `DashboardRole_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_dashboardRoleId_fkey` FOREIGN KEY (`dashboardRoleId`) REFERENCES `DashboardRole`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
