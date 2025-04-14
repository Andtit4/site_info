import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1744625869776 implements MigrationInterface {
    name = 'InitialMigration1744625869776'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Vérifier et supprimer les clés étrangères existantes
        const foreignKeys = await queryRunner.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'team_sites' 
            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        `);

        for (const fk of foreignKeys) {
            await queryRunner.query(`ALTER TABLE \`team_sites\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
        }

        // Vérifier l'existence de l'index username
        const indexes = await queryRunner.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'users' 
            AND INDEX_NAME = 'username'
        `);

        if (indexes.length > 0) {
            await queryRunner.query(`DROP INDEX \`username\` ON \`users\``);
        }

        // Vérifier l'existence des colonnes dans la table equipment
        const equipmentColumns = await queryRunner.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'equipment'
        `);

        const equipmentColumnNames = equipmentColumns.map(col => col.COLUMN_NAME);

        if (equipmentColumnNames.includes('createdAt')) {
            await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`createdAt\``);
        }

        if (equipmentColumnNames.includes('updatedAt')) {
            await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`updatedAt\``);
        }

        // Vérifier l'existence des colonnes dans la table users
        const usersColumns = await queryRunner.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'users'
        `);

        const usersColumnNames = usersColumns.map(col => col.COLUMN_NAME);

        if (usersColumnNames.includes('firstName')) {
            await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstName\``);
        }

        if (usersColumnNames.includes('lastName')) {
            await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        }

        if (usersColumnNames.includes('email')) {
            await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        }

        if (usersColumnNames.includes('isAdmin')) {
            await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isAdmin\``);
        }

        if (usersColumnNames.includes('lastLogin')) {
            await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastLogin\``);
        }

        // Vérifier l'existence des colonnes dans la table team_sites
        const teamSitesColumns = await queryRunner.query(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'team_sites'
        `);

        const teamSitesColumnNames = teamSitesColumns.map(col => col.COLUMN_NAME);

        if (teamSitesColumnNames.includes('createdAt')) {
            await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`createdAt\``);
        }

        if (teamSitesColumnNames.includes('updatedAt')) {
            await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`updatedAt\``);
        }

        // Ajouter les nouvelles colonnes
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastLogin\` datetime NULL`);

        // Vérifier l'existence de l'index unique sur username
        const uniqueIndexes = await queryRunner.query(`
            SELECT INDEX_NAME 
            FROM INFORMATION_SCHEMA.STATISTICS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'users' 
            AND INDEX_NAME = 'IDX_fe0bb3f6520ee0469504521e71'
        `);

        if (uniqueIndexes.length === 0) {
            await queryRunner.query(`ALTER TABLE \`users\` ADD UNIQUE INDEX \`IDX_fe0bb3f6520ee0469504521e71\` (\`username\`)`);
        }

        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'STANDBY', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`memberCount\` \`memberCount\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`lastActiveDate\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`lastActiveDate\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`departmentId\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`departmentId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`description\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`department\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`installDate\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`installDate\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`lastMaintenanceDate\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`lastMaintenanceDate\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` CHANGE \`status\` \`status\` enum ('ACTIF', 'MAINTENANCE', 'INACTIF', 'PLANIFIÉ', 'EN_INSTALLATION') NOT NULL DEFAULT 'ACTIF'`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`siteId\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`siteId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`departmentId\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`departmentId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`id\` varchar(255) NOT NULL PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`status\` varchar(255) NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`specifications\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`specifications\` ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`specifications\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`specifications\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 1`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`siteId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`teamId\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`teamId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`siteId\`, \`teamId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`teamId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`siteId\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`siteId\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`teamId\`, \`siteId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_972a4c610bd5d70636bb6bcebc\` ON \`team_sites\` (\`teamId\`)`);
        await queryRunner.query(`CREATE INDEX \`IDX_17ba2bac60175ce05c19a64395\` ON \`team_sites\` (\`siteId\`)`);
        await queryRunner.query(`ALTER TABLE \`team\` ADD CONSTRAINT \`FK_bd5ee5dab94afcc03153c9c6cc2\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD CONSTRAINT \`FK_c44fb857367306679c0722ee0e5\` FOREIGN KEY (\`siteId\`) REFERENCES \`site\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD CONSTRAINT \`FK_48739cb24cb61249c8dfa7a0489\` FOREIGN KEY (\`departmentId\`) REFERENCES \`department\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD CONSTRAINT \`FK_972a4c610bd5d70636bb6bcebc3\` FOREIGN KEY (\`teamId\`) REFERENCES \`team\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD CONSTRAINT \`FK_17ba2bac60175ce05c19a643952\` FOREIGN KEY (\`siteId\`) REFERENCES \`site\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Vérifier et supprimer les clés étrangères existantes
        const foreignKeys = await queryRunner.query(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = 'site_info_db' 
            AND TABLE_NAME = 'team_sites' 
            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        `);

        for (const fk of foreignKeys) {
            await queryRunner.query(`ALTER TABLE \`team_sites\` DROP FOREIGN KEY \`${fk.CONSTRAINT_NAME}\``);
        }

        await queryRunner.query(`ALTER TABLE \`equipment\` DROP FOREIGN KEY \`FK_48739cb24cb61249c8dfa7a0489\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP FOREIGN KEY \`FK_c44fb857367306679c0722ee0e5\``);
        await queryRunner.query(`ALTER TABLE \`team\` DROP FOREIGN KEY \`FK_bd5ee5dab94afcc03153c9c6cc2\``);
        await queryRunner.query(`DROP INDEX \`IDX_17ba2bac60175ce05c19a64395\` ON \`team_sites\``);
        await queryRunner.query(`DROP INDEX \`IDX_972a4c610bd5d70636bb6bcebc\` ON \`team_sites\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`teamId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`siteId\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`siteId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`siteId\`, \`teamId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`siteId\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP COLUMN \`teamId\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`teamId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` DROP PRIMARY KEY`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD PRIMARY KEY (\`teamId\`, \`siteId\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`ALTER TABLE \`specifications\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`specifications\` ADD \`updatedAt\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`specifications\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`specifications\` ADD \`createdAt\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`updatedAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`createdAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`status\` enum ('ACTIVE', 'INACTIVE', 'MAINTENANCE') NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`site\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`site\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`site\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`departmentId\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`departmentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`siteId\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`siteId\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` CHANGE \`status\` \`status\` enum ('ACTIF', 'MAINTENANCE', 'INACTIF', 'PLANIFIÉ', 'EN_INSTALLATION') NULL DEFAULT 'ACTIF'`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`lastMaintenanceDate\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`lastMaintenanceDate\` date NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`installDate\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`installDate\` date NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`updatedAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`createdAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`department\` CHANGE \`isActive\` \`isActive\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`department\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`department\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`departmentId\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`departmentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`lastActiveDate\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`lastActiveDate\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`createdAt\` varchar(255) NOT NULL DEFAULT '2025-04-10T12:15:54.814Z'`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`memberCount\` \`memberCount\` int NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`team\` CHANGE \`status\` \`status\` enum ('ACTIVE', 'STANDBY', 'INACTIVE') NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`description\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` DROP COLUMN \`id\``);
        await queryRunner.query(`ALTER TABLE \`team\` ADD \`id\` varchar(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`team\` ADD PRIMARY KEY (\`id\`)`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`updatedAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`updatedAt\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`createdAt\` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` CHANGE \`isActive\` \`isActive\` tinyint(1) NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP INDEX \`IDX_fe0bb3f6520ee0469504521e71\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastLogin\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`isAdmin\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`email\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`lastName\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`firstName\``);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastLogin\` timestamp NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`isAdmin\` tinyint(1) NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`email\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`lastName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`firstName\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`updatedAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`equipment\` ADD \`createdAt\` timestamp NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`username\` ON \`users\` (\`username\`)`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD CONSTRAINT \`FK_972a4c610bd5d70636bb6bcebc3\` FOREIGN KEY (\`teamId\`) REFERENCES \`team\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`team_sites\` ADD CONSTRAINT \`FK_17ba2bac60175ce05c19a643952\` FOREIGN KEY (\`siteId\`) REFERENCES \`site\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
