-- Vérifier et ajouter la colonne teamId à la table users
ALTER TABLE users ADD COLUMN IF NOT EXISTS teamId VARCHAR(36) NULL;
