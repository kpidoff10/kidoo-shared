# Workspace Kidoo

Vue d’ensemble du workspace : les quatre projets, leur rôle, les scripts utiles et les procédures communes.

---

## Structure du workspace

Le workspace contient **quatre racines** :

| Projet        | Rôle |
|---------------|------|
| **kidoo-app** | Application mobile (Expo / React Native). Configure le module ESP32, gère les Kidoos par modèle (Dream, Gotchi, …). |
| **kidoo-server** | Back-office (Next.js) : admin, landing, (à venir) connexion utilisateur. Gestion firmware, Kidoos, assets. |
| **kidoo-esp32** | Firmware des modules (C++). Plusieurs modèles : basic, dream, gotchi (veilleuse, Tamagotchi, etc.). |
| **kidoo-shared** | Code partagé : types TypeScript, schémas Zod, constantes, registre des modèles. Consommé par app, server et (via génération) ESP32. |

**Principe** : une seule source de vérité dans **kidoo-shared** pour les données communes (modèles, émotions, config). App et server importent `@kidoo/shared` ; l’ESP32 reçoit des headers C++ générés à partir du shared.

---

## Dépendances entre projets

- **kidoo-app** et **kidoo-server** dépendent de **kidoo-shared** (package `@kidoo/shared`, souvent en `file:../kidoo-shared`).
- **kidoo-esp32** n’a pas de dépendance npm vers shared : il utilise des fichiers `.h` générés par les scripts dans kidoo-shared (écriture dans `kidoo-esp32/src/...`).

---

## Scripts utiles

### Dans kidoo-shared

| Script | Commande | Description |
|--------|----------|-------------|
| Génération constantes Gotchi | `npm run generate:esp32-constants` | Génère `constants.h` (NFC, effets alimentaires) pour l’ESP32 à partir de `emotions/constants.ts`. Sortie par défaut : `kidoo-esp32/src/models/gotchi/config/constants.h`. |
| Génération IDs modèles | `npm run generate:esp32-model-ids` | Génère `model_ids.h` (enum des modèles) pour l’ESP32. Sortie par défaut : `kidoo-esp32/src/models/model_ids.h`. |
| Scaffold modèle | `npm run generate:scaffold-models` | Crée `models/<id>/` (config, commands) pour tout modèle du registre qui n'a pas encore de dossier. Ajoute l'export dans package.json si besoin. |

Voir aussi [Scripts](./scripts.md) pour le détail de `generate:esp32-constants`.

### Dans kidoo-server

| Script | Commande | Description |
|--------|----------|-------------|
| Génération client Prisma | `npm run db:generate` | `prisma generate` (plus de génération des model IDs dans shared). |
| Migrations | `npm run db:migrate` | `prisma migrate dev`. |
| Déploiement migrations | `npm run db:migrate:deploy` | `prisma migrate deploy`. |

---

## Comment ajouter un nouveau modèle (ex. un nouveau produit)

1. **kidoo-shared** — Éditer `firmware/modelRegistry.ts` : ajouter l’id dans `KIDOO_MODEL_IDS` et la métadonnée dans `KIDOO_MODEL_META`.
2. **kidoo-shared** — Créer l'architecture du modèle : `npm run generate:scaffold-models` (crée `models/<id>/` avec config + commands + export package.json si le modèle n'existait pas).
3. **kidoo-server** — Dans `prisma/schema.prisma`, ajouter la valeur à l’enum `KidooModel`, puis créer et appliquer une migration : `npx prisma migrate dev --name add_<modele>_to_kidoo_model_enum`.
4. **kidoo-shared** — Régénérer le header ESP32 : `npm run generate:esp32-model-ids`.
5. **kidoo-esp32** — Ajouter le code firmware du modèle (dossier, managers, config) comme pour dream/gotchi.

Détail et historique : [Registre des modèles — design](./model-registry-design.md).

---

## Documentation par module

| Document | Contenu |
|----------|--------|
| [README](./README.md) | Présentation de kidoo-shared, structure du package, imports. |
| [Emotions](./emotions.md) | Triggers d’émotions, variants, alignement avec l’ESP32. |
| [Scripts](./scripts.md) | Génération de `constants.h` pour l’ESP32 (Gotchi). |
| [Registre des modèles](./model-registry-design.md) | Source unique des modèles (TypeScript + Prisma + ESP32). |
| [Shared par modèle](./shared-by-model.md) | Organisation par modèle (emotions → models/gotchi/emotions). |

---

## Démarrage rapide (dev)

1. **Shared** : `cd kidoo-shared && npm install`
2. **Server** : `cd kidoo-server && npm install && npm run db:generate` (et `db:migrate` si base locale)
3. **App** : `cd kidoo-app && npm install`
4. Lancer server et app selon leurs README respectifs ; pour l’ESP32, ouvrir le projet dans PlatformIO / IDE habituel et flasher après avoir éventuellement relancé les scripts de génération depuis kidoo-shared.
