const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

async function main() {
    console.log('Création d\'un compte administrateur...');

    // Paramètres de l'administrateur
    const adminUsername = 'admin';
    const adminPassword = 'Admin123!'; // Ce mot de passe sera hashé
    const adminFirstName = 'Admin';
    const adminLastName = 'System';
    const adminEmail = 'admin@example.com';

    const connection = await mysql.createConnection({
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '3306', 10),
        user: process.env.DATABASE_USERNAME || 'root',
        password: process.env.DATABASE_PASSWORD || '',
        database: process.env.DATABASE_NAME || 'site_info_db',
        multipleStatements: true
    });

    try {
        console.log('Connexion à la base de données établie');

        // Vérifier si l'administrateur existe déjà
        const [existingAdmins] = await connection.query(
            'SELECT * FROM users WHERE username = ? OR isAdmin = 1', [adminUsername]
        );

        if (existingAdmins.length > 0) {
            console.log('Un administrateur existe déjà dans la base de données');
            for (const admin of existingAdmins) {
                console.log(`- ${admin.username} (isAdmin: ${admin.isAdmin === 1 ? 'Oui' : 'Non'})`);
            }
            return;
        }

        // Hash du mot de passe
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);

        // Créer l'utilisateur administrateur
        const userId = uuidv4();
        await connection.query(
            `INSERT INTO users (id, username, password, firstName, lastName, email, isAdmin, isActive, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, 1, 1, NOW(), NOW())`, [userId, adminUsername, hashedPassword, adminFirstName, adminLastName, adminEmail]
        );

        console.log(`Administrateur créé avec succès: ${adminUsername} (ID: ${userId})`);
        console.log('Vous pouvez maintenant vous connecter avec:');
        console.log(`Nom d'utilisateur: ${adminUsername}`);
        console.log(`Mot de passe: ${adminPassword}`);

    } catch (error) {
        console.error('Erreur lors de la création de l\'administrateur:', error);
    } finally {
        await connection.end();
        console.log('Connexion à la base de données fermée');
    }
}

main();