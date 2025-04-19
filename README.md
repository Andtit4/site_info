# Site Info

Application de gestion des sites et équipements avec une architecture backend NestJS et frontend Vue.js.

## Déploiement avec PM2

Ce projet utilise PM2 pour gérer les processus en production sur un VPS.

### Prérequis

- Node.js (v18 ou supérieur)
- npm
- PM2 (`npm install -g pm2`)

### Configuration

Le fichier `ecosystem.config.js` à la racine du projet configure:
- Le backend sur le port 2025
- Le frontend sur le port 2026

### Installation

1. Clonez le dépôt sur votre VPS:
```bash
git clone [URL_DU_REPO] site_info
cd site_info
```

2. Installez les dépendances:
```bash
# Installation des dépendances du backend
cd backend
npm install
npm run build

# Installation des dépendances du frontend
cd ../frontend
npm install
```

3. Créez un fichier `.env` dans le dossier backend:
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=votre_mot_de_passe
DATABASE_NAME=site_info_db
JWT_SECRET=votre_secret_jwt
ADMIN_SETUP_KEY=votre_cle_configuration
```

### Démarrage avec PM2

À la racine du projet, exécutez:
```bash
pm2 start ecosystem.config.js
```

### Commandes PM2 utiles

- Afficher les logs: `pm2 logs`
- Voir le statut des processus: `pm2 status`
- Redémarrer les applications: `pm2 restart all`
- Arrêter les applications: `pm2 stop all`
- Configurer le démarrage automatique: `pm2 startup` puis suivre les instructions

### Accès à l'application

- Frontend: http://votre_ip:2026
- Backend API: http://votre_ip:2025/api

## Développement local

Pour le développement local:

- Backend: `cd backend && npm run start:dev`
- Frontend: `cd frontend && npm run serve` 