"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialMigration1744898980864 = void 0;
class InitialMigration1744898980864 {
    constructor() {
        this.name = 'InitialMigration1744898980864';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (
            \`id\` varchar(36) NOT NULL,
            \`username\` varchar(255) NOT NULL,
            \`password\` varchar(255) NOT NULL,
            \`firstName\` varchar(255) NULL,
            \`lastName\` varchar(255) NULL,
            \`email\` varchar(255) NULL,
            \`isAdmin\` tinyint NOT NULL DEFAULT 0,
            \`isActive\` tinyint NOT NULL DEFAULT 1,
            \`lastLogin\` timestamp NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            UNIQUE INDEX \`UQ_username\` (\`username\`),
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`department\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`type\` varchar(255) NOT NULL,
            \`description\` varchar(255) NULL,
            \`responsibleName\` varchar(255) NOT NULL,
            \`contactEmail\` varchar(255) NOT NULL,
            \`contactPhone\` varchar(255) NULL,
            \`isActive\` tinyint NOT NULL DEFAULT 1,
            \`managedEquipmentTypes\` json NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`team\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`description\` varchar(255) NULL,
            \`status\` varchar(255) NOT NULL DEFAULT 'ACTIVE',
            \`leadName\` varchar(255) NULL,
            \`leadContact\` varchar(255) NULL,
            \`memberCount\` int NOT NULL,
            \`location\` varchar(255) NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`lastActiveDate\` date NULL,
            \`metadata\` json NULL,
            \`equipmentType\` varchar(255) NULL,
            \`departmentId\` varchar(36) NOT NULL,
            PRIMARY KEY (\`id\`),
            CONSTRAINT \`FK_team_department\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\` (\`id\`) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`site\` (
            \`id\` varchar(36) NOT NULL,
            \`name\` varchar(255) NOT NULL,
            \`region\` varchar(255) NOT NULL,
            \`zone\` varchar(255) NULL,
            \`longitude\` decimal(10,6) NOT NULL,
            \`latitude\` decimal(10,6) NOT NULL,
            \`status\` varchar(255) NOT NULL DEFAULT 'ACTIVE',
            \`oldBase\` varchar(255) NULL,
            \`newBase\` varchar(255) NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`equipment\` (
            \`id\` varchar(36) NOT NULL,
            \`type\` varchar(255) NOT NULL,
            \`model\` varchar(255) NOT NULL,
            \`manufacturer\` varchar(255) NULL,
            \`serialNumber\` varchar(255) NULL,
            \`installDate\` date NOT NULL,
            \`lastMaintenanceDate\` date NULL,
            \`status\` varchar(255) NOT NULL DEFAULT 'ACTIF',
            \`specifications\` json NULL,
            \`siteId\` varchar(36) NOT NULL,
            \`departmentId\` varchar(36) NULL,
            PRIMARY KEY (\`id\`),
            CONSTRAINT \`FK_equipment_site\` FOREIGN KEY (\`siteId\`) REFERENCES \`site\` (\`id\`) ON DELETE CASCADE,
            CONSTRAINT \`FK_equipment_department\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`specifications\` (
            \`id\` varchar(36) NOT NULL,
            \`equipmentType\` ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') NOT NULL,
            \`columns\` json NOT NULL,
            \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`team_sites\` (
            \`teamId\` varchar(36) NOT NULL,
            \`siteId\` varchar(36) NOT NULL,
            PRIMARY KEY (\`teamId\`, \`siteId\`),
            CONSTRAINT \`FK_team_sites_team\` FOREIGN KEY (\`teamId\`) REFERENCES \`team\` (\`id\`) ON DELETE CASCADE,
            CONSTRAINT \`FK_team_sites_site\` FOREIGN KEY (\`siteId\`) REFERENCES \`site\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
        await queryRunner.query(`CREATE TABLE \`team_equipment\` (
            \`equipmentId\` varchar(36) NOT NULL,
            \`teamId\` varchar(36) NOT NULL,
            PRIMARY KEY (\`equipmentId\`, \`teamId\`),
            CONSTRAINT \`FK_team_equipment_equipment\` FOREIGN KEY (\`equipmentId\`) REFERENCES \`equipment\` (\`id\`) ON DELETE CASCADE,
            CONSTRAINT \`FK_team_equipment_team\` FOREIGN KEY (\`teamId\`) REFERENCES \`team\` (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE \`team_equipment\``);
        await queryRunner.query(`DROP TABLE \`team_sites\``);
        await queryRunner.query(`DROP TABLE \`specifications\``);
        await queryRunner.query(`DROP TABLE \`equipment\``);
        await queryRunner.query(`DROP TABLE \`site\``);
        await queryRunner.query(`DROP TABLE \`team\``);
        await queryRunner.query(`DROP TABLE \`department\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.InitialMigration1744898980864 = InitialMigration1744898980864;
//# sourceMappingURL=1744898980864-InitialMigration.js.map