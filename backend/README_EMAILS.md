# Configuration des Emails - Boutique Voilée

## Configuration Gmail

Pour que le système d'envoi d'emails fonctionne, vous devez configurer Gmail avec un mot de passe d'application.

### Étapes de configuration :

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail (mhalli.it@gmail.com)

2. **Créer un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Authentification à 2 facteurs
   - En bas de page, cliquez sur "Mots de passe d'application"
   - Sélectionnez "Autre (nom personnalisé)" et nommez-le "Boutique Voilée"
   - Copiez le mot de passe généré (16 caractères)

3. **Configurer le fichier .env** :
   ```env
   EMAIL_USER=mhalli.it@gmail.com
   EMAIL_PASSWORD=votre_mot_de_passe_application_16_caracteres
   ```

### Types d'emails envoyés :

1. **Confirmation de commande** (client) :
   - Envoyé à l'email du client
   - Contient les détails de la commande
   - Template HTML élégant

2. **Notification de nouvelle commande** (admin) :
   - Envoyé à mhalli.it@gmail.com
   - Contient les détails de la nouvelle commande
   - Permet de gérer rapidement les commandes

### Test des emails :

Pour tester le système d'emails, passez une commande sur le site. Les emails seront envoyés automatiquement.

### Dépannage :

- Si les emails ne s'envoient pas, vérifiez :
  - Le mot de passe d'application Gmail
  - La configuration du fichier .env
  - Les logs du serveur pour les erreurs

### Sécurité :

- Le mot de passe d'application est différent du mot de passe principal
- Il peut être révoqué à tout moment depuis les paramètres Google
- Ne partagez jamais ce mot de passe 