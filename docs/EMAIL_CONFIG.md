# Configuration des Emails pour les Comptes Utilisateurs

Ce document explique comment configurer le système d'envoi d'emails pour la création de comptes utilisateurs associés aux départements.

## Aperçu

Lors de la création d'un département, il est possible de créer automatiquement un compte utilisateur associé à ce département. Un email contenant les identifiants de connexion est alors envoyé à l'adresse email spécifiée dans le formulaire.

## Configuration requise

Pour que l'envoi d'emails fonctionne correctement, vous devez configurer les variables d'environnement suivantes dans le fichier `.env` du backend:

```
EMAIL_HOST=smtp.example.com       # Serveur SMTP
EMAIL_PORT=587                    # Port du serveur SMTP (généralement 587 pour TLS ou 465 pour SSL)
EMAIL_USER=your_email@example.com # Adresse email pour l'authentification SMTP
EMAIL_PASSWORD=your_password      # Mot de passe pour l'authentification SMTP
EMAIL_FROM=noreply@site-info.com  # Adresse "From" affichée dans les emails envoyés
```

## Fonctionnement

### Création du compte utilisateur

1. Lors de la création d'un département, si l'option "Créer un compte utilisateur pour ce département" est activée:
   - Un nom d'utilisateur est généré automatiquement basé sur le nom du département
   - Si aucun mot de passe n'est spécifié, un mot de passe aléatoire sécurisé est généré

2. Le compte utilisateur créé:
   - Est associé au département
   - Possède les mêmes droits et rôles que le département
   - Est configuré avec le nom et prénom du responsable du département

### Envoi d'email

Un email contenant les informations de connexion est envoyé à l'adresse email spécifiée dans le formulaire (champ "Email de contact"). L'email contient:

- Le nom d'utilisateur généré
- Le mot de passe (fourni ou généré)
- Des instructions pour la connexion

## En mode développement

Si les variables d'environnement pour l'email ne sont pas configurées, le système utilise [Ethereal](https://ethereal.email/) pour créer un compte de test. Les emails ne sont pas réellement envoyés, mais peuvent être visualisés via une URL affichée dans les logs du serveur.

## Dépannage

En cas de problème d'envoi d'emails:

1. Vérifiez les logs du serveur pour les erreurs liées à l'envoi d'emails
2. Assurez-vous que les variables d'environnement sont correctement configurées
3. Si vous utilisez Gmail, vous devrez peut-être:
   - Activer l'accès aux applications moins sécurisées
   - Ou créer un mot de passe d'application spécifique

## Personnalisation des emails

Les templates d'emails sont définis dans `backend/src/services/email.service.ts`. Pour personnaliser l'apparence ou le contenu des emails, modifiez les fonctions correspondantes dans ce fichier. 