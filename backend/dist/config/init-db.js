"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '3306', 10),
    username: process.env.DATABASE_USERNAME || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'site_info_db',
    synchronize: false,
    logging: true,
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
});
async function initializeDatabase() {
    try {
        await AppDataSource.initialize();
        console.log('Connexion à la base de données établie');
        await AppDataSource.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME || 'site_info_db'}`);
        console.log('Base de données créée ou déjà existante');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS department (
        id varchar(36) PRIMARY KEY,
        name varchar(255) NOT NULL,
        description text,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('Table department créée');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS site (
        id varchar(36) PRIMARY KEY,
        name varchar(255) NOT NULL,
        location varchar(255) NOT NULL,
        status ENUM('ACTIF', 'INACTIF', 'MAINTENANCE') DEFAULT 'ACTIF',
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('Table site créée');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS equipment (
        id varchar(36) PRIMARY KEY,
        type ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') NOT NULL,
        model varchar(255) NOT NULL,
        installDate date NOT NULL,
        status ENUM('ACTIF', 'INACTIF', 'MAINTENANCE', 'HORS_SERVICE') DEFAULT 'ACTIF',
        siteId varchar(36),
        departmentId varchar(36),
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (siteId) REFERENCES site(id) ON DELETE SET NULL,
        FOREIGN KEY (departmentId) REFERENCES department(id) ON DELETE SET NULL
      )
    `);
        console.log('Table equipment créée');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS team (
        id varchar(36) PRIMARY KEY,
        name varchar(255) NOT NULL,
        equipmentType ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') DEFAULT NULL,
        description text,
        teamLead varchar(255),
        contact varchar(255),
        status ENUM('ACTIF', 'INACTIF') DEFAULT 'ACTIF',
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('Table team créée');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS team_sites (
        teamId varchar(36) NOT NULL,
        siteId varchar(36) NOT NULL,
        PRIMARY KEY (teamId, siteId),
        FOREIGN KEY (teamId) REFERENCES team(id) ON DELETE CASCADE,
        FOREIGN KEY (siteId) REFERENCES site(id) ON DELETE CASCADE
      )
    `);
        console.log('Table team_sites créée');
        await AppDataSource.query(`
      CREATE TABLE IF NOT EXISTS specifications (
        id varchar(36) PRIMARY KEY,
        equipmentType ENUM('ANTENNE', 'ROUTEUR', 'BATTERIE', 'GÉNÉRATEUR', 'REFROIDISSEMENT', 'SHELTER', 'PYLÔNE', 'SÉCURITÉ') NOT NULL,
        tableDefinition json NOT NULL,
        columns json NOT NULL,
        createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
        updatedAt timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        console.log('Table specifications créée');
        console.log('Initialisation de la base de données terminée avec succès');
    }
    catch (error) {
        console.error('Erreur lors de l\'initialisation de la base de données:', error);
        throw error;
    }
    finally {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log('Connexion à la base de données fermée');
        }
    }
}
initializeDatabase().catch(error => {
    console.error('Erreur lors de l\'exécution du script:', error);
    process.exit(1);
});
//# sourceMappingURL=init-db.js.map