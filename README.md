TrouvTout

Présentation :
TrouvTout est une plateforme de petites annonces entre particuliers. Elle permet aux utilisateurs de publier, consulter et gérer des annonces de vente d’objets.

Fonctionnalités principales :
Inscription et connexion des utilisateurs (authentification sécurisée, hash des mots de passe)
Création, consultation, modification et suppression d’annonces
Consultation des annonces par tous, même sans compte
Gestion des favoris (ajout/suppression d’annonces favorites)
Visualisation du profil public (pseudo, localité, téléphone optionnel)
Suppression d’un compte utilisateur et de ses annonces
Sécurisation des accès (un utilisateur ne peut modifier que ses propres données/annonces)
Limitation d’accès à certaines routes aux utilisateurs connectés
Stockage et gestion des images via Supabase Storage

Architecture technique :
Back-end : Node.js, Express, architecture MVC
Base de données : Supabase (PostgreSQL)
Stockage images : Supabase Storage

Structure de la base de données :

| Champ       | Type      | Obligatoire | Description               |
| ----------- | --------- | ----------- | ------------------------- |
| id          | uuid      | Oui (PK)    | Identifiant unique        |
| email       | string    | Oui         | Email unique              |
| password    | string    | Oui         | Mot de passe hashé        |
| pseudo      | string    | Oui         | Nom affiché               |
| prénom      | string    | Non         | Prénom                    |
| nom         | string    | Non         | Nom                       |
| téléphone   | string    | Non         | Téléphone                 |
| localité    | string    | Non         | Ville ou département      |
| avatar_url  | string    | Non         | URL de la photo de profil |
| created_at  | timestamp | Oui         | Date de création          |
| last_active | timestamp | Non         | Dernière activité         |

#### Table `annonces`

| Champ       | Type    | Obligatoire | Description                    |
| ----------- | ------- | ----------- | ------------------------------ |
| id          | uuid    | Oui (PK)    | Identifiant unique             |
| titre       | string  | Oui         | Titre de l’annonce             |
| description | string  | Oui         | Description de l’objet         |
| prix        | numeric | Oui         | Prix en euros                  |
| localité    | string  | Oui         | Ville ou département           |
| user_id     | uuid    | Oui (FK)    | Référence vers `users.id`      |
| category_id | int     | Oui (FK)    | Référence vers `categories.id` |

#### Table `categories`

| Champ | Type   | Obligatoire | Description         |
| ----- | ------ | ----------- | ------------------- |
| id    | int    | Oui (PK)    | Identifiant unique  |
| nom   | string | Oui         | Nom de la catégorie |

#### Table `favoris`

| Champ      | Type | Obligatoire | Description                  |
| ---------- | ---- | ----------- | ---------------------------- |
| id         | uuid | Oui (PK)    | Identifiant unique du favori |
| user_id    | uuid | Oui (FK)    | Référence vers `users.id`    |
| annonce_id | uuid | Oui (FK)    | Référence vers `annonces.id` |

#### Table `images`

| Champ       | Type      | Obligatoire | Description                   |
| ----------- | --------- | ----------- | ----------------------------- |
| id          | uuid      | Oui (PK)    | Identifiant unique de l’image |
| annonce_id  | uuid      | Oui (FK)    | Référence vers `annonces.id`  |
| url         | string    | Oui         | URL publique de l’image       |
| uploaded_at | timestamp | Oui         | Date d’upload de l’image      |

Structure du projet :
controllers/ # Logique métier (annonces, users, auth, etc.)
middlewares/ # Middlewares Express (authentification, sécurité)
models/ # Modèles de données (accès à Supabase)
public/ # Fichiers statiques (HTML, CSS, JS)
routes/ # Définition des routes Express
services/ # Services externes (connexion Supabase)
server.js # Point d’entrée de l’application

Installation et déploiement :
Cloner le dépôt
git clone <url-du-repo>
cd "ECF TrouvTout"

Installer les dépendances:
npm install

Configurer les variables d’environnement
Créer un fichier .env à la racine avec :
SUPABASE_URL=... # URL de votre projet Supabase
SUPABASE_KEY=... # Clé API Supabase
PORT=3000 # Port du serveur (optionnel)

Démarrer le serveur :
npm start

Commandes utiles
npm start : Démarre le serveur Express
npm run dev : Démarrage en mode développement (si script présent)

Sécurité :
Les mots de passe sont hashés avant stockage
Les routes sensibles sont protégées par des middlewares d’authentification
Les accès sont vérifiés pour chaque action utilisateur

Auteurs :
Projet réalisé dans le cadre de l’épreuve ECF – Développement Web - Par Prevost Joshua

ECF---Projet-TrouvTout
