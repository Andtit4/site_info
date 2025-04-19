# Guide de dépannage pour l'erreur de connexion PostgreSQL

L'erreur que vous rencontrez est liée à l'authentification SASL pour PostgreSQL:
```
Error: SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string
```

Ce problème se produit généralement quand le mot de passe de la base de données n'est pas correctement défini comme une chaîne de caractères dans les variables d'environnement.

## Solutions à essayer

### 1. Vérifier le fichier .env

Créez ou modifiez votre fichier `.env` dans le dossier backend:

```bash
cd ~/site_info/backend
nano .env
```

Assurez-vous que le contenu est correctement formaté:

```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD="votre_mot_de_passe"
DATABASE_NAME=site_info_db
JWT_SECRET="votre_secret_jwt"
ADMIN_SETUP_KEY="votre_cle_configuration"
```

**Points importants:**
- Mettez le mot de passe entre guillemets doubles, surtout s'il contient des caractères spéciaux
- Aucun espace autour du signe égal
- Vérifiez qu'il n'y a pas de caractères invisibles ou de retours à la ligne incorrects

### 2. Essayer avec un mot de passe simple temporairement

Pour tester, modifiez temporairement le mot de passe PostgreSQL:

```bash
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'simple123';
\q
```

Puis mettez à jour votre .env:
```
DATABASE_PASSWORD="simple123"
```

### 3. Définir le mot de passe directement dans le fichier de configuration

Si le problème persiste, vous pouvez modifier temporairement `src/config/typeorm.config.ts`:

```bash
nano src/config/typeorm.config.ts
```

Remplacez la ligne avec `password: process.env.DATABASE_PASSWORD || '',` par:
```typescript
password: 'votre_mot_de_passe',  // Remplacez par votre vrai mot de passe
```

### 4. Vérifier les permissions du fichier .env

Assurez-vous que le fichier .env a les bonnes permissions:

```bash
chmod 600 .env
```

### 5. Tester la connexion directement

Testez la connexion PostgreSQL en dehors de l'application:

```bash
PGPASSWORD="votre_mot_de_passe" psql -h localhost -U postgres -d site_info_db -c "SELECT 1"
```

Si cette commande fonctionne, le problème est spécifique à la façon dont l'application lit le fichier .env.

### 6. Installer dotenv explicitement

Essayez d'installer dotenv et de l'utiliser explicitement:

```bash
npm install dotenv
```

Puis créez un fichier `load-env.js` à la racine:
```javascript
require('dotenv').config();
console.log('DATABASE_PASSWORD type:', typeof process.env.DATABASE_PASSWORD);
console.log('DATABASE_PASSWORD length:', process.env.DATABASE_PASSWORD ? process.env.DATABASE_PASSWORD.length : 0);
```

Exécutez-le:
```bash
node load-env.js
```

Cela vous aidera à comprendre si les variables d'environnement sont correctement chargées.

Si aucune de ces solutions ne fonctionne, veuillez partager la sortie de ces tests pour un diagnostic plus précis. 