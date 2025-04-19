// Script de débogage pour la connexion PostgreSQL
require('dotenv').config();
const { Client } = require('pg');

// Afficher les variables d'environnement (sans exposer le mot de passe complet)
console.log('Variables d\'environnement chargées:');
console.log('- DATABASE_HOST:', process.env.DATABASE_HOST);
console.log('- DATABASE_PORT:', process.env.DATABASE_PORT);
console.log('- DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
console.log('- DATABASE_PASSWORD défini:', !!process.env.DATABASE_PASSWORD);
console.log('- DATABASE_PASSWORD type:', typeof process.env.DATABASE_PASSWORD);
console.log('- DATABASE_PASSWORD longueur:', process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD.length : 0);
console.log('- DATABASE_NAME:', process.env.DATABASE_NAME);

// Créer un client PostgreSQL avec les paramètres chargés
const client = new Client({
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  user: process.env.DATABASE_USERNAME || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'site_info_db',
});

// Tester la connexion
async function testConnection() {
  try {
    console.log('\nTentative de connexion à PostgreSQL...');
    await client.connect();
    console.log('Connexion réussie!');
    
    // Exécuter une requête simple
    const res = await client.query('SELECT current_timestamp');
    console.log('Réponse de la base de données:', res.rows[0]);
    
    await client.end();
    console.log('Connexion fermée.');
  } catch (err) {
    console.error('Erreur lors de la connexion:', err);
    
    // Suggestions spécifiques en fonction de l'erreur
    if (err.message.includes('password authentication failed')) {
      console.log('\nSuggestion: Le mot de passe semble incorrect. Vérifiez vos identifiants PostgreSQL.');
    } else if (err.message.includes('does not exist')) {
      console.log('\nSuggestion: La base de données n\'existe pas. Créez-la avec:');
      console.log('sudo -u postgres psql -c "CREATE DATABASE site_info_db;"');
    } else if (err.message.includes('SASL')) {
      console.log('\nSuggestion: Problème avec le format du mot de passe.');
      console.log('1. Assurez-vous que le fichier .env est correctement formaté sans espaces');
      console.log('2. Essayez de mettre le mot de passe entre guillemets doubles');
      console.log('3. Modifiez temporairement le fichier src/config/typeorm.config.ts en codant en dur le mot de passe');
    }
  }
}

testConnection(); 