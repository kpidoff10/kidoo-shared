# Documentation kidoo-shared

Package partagé entre **kidoo-app** (Expo), **kidoo-server** (Next.js) et **kidoo-esp32** (firmware). Contient schémas Zod, types TypeScript, constantes et données métier communes.

**→ Vue d’ensemble du workspace (app, server, esp32, shared, scripts, procédures) : [Workspace Kidoo](./workspace.md)**

## Structure du package

```
kidoo-shared/
├── auth/              # Schémas et types d'authentification
├── models/            # Code par modèle + commun (option B, imports explicites)
│   ├── common/        # CRUD schemas, config persistante, commandes (partagé par tous les modèles)
│   ├── gotchi/        # Gotchi (import : @kidoo/shared/models/gotchi)
│   │   ├── emotions/  # Triggers, conditions
│   │   ├── food/      # Aliments, effets progressifs
│   │   ├── config/    # brightness, sleep-timeout, sleep-mode, name
│   │   ├── commands/  # get-info, reboot, firmware-update
│   │   └── characters/
│   └── dream/         # Dream (import : @kidoo/shared/models/dream)
│       ├── config/    # dream-bedtime, dream-wakeup, color-utils (source de vérité)
│       └── commands/  # get-info, reboot, firmware-update
├── firmware/         # Modèles supportés, schémas mise à jour
├── scripts/          # Génération de code (ex. constants.h pour ESP32)
├── types/            # Types communs
├── docs/             # Cette documentation
└── index.ts          # Point d'entrée
```

## Imports

Depuis **kidoo-app** ou **kidoo-server** (avec alias `@/shared` ou `@kidoo/shared`) :

```ts
// Commun (racine)
import { ... } from '@kidoo/shared';

// Gotchi : emotions + characters (import explicite par modèle)
import {
  EMOTION_TRIGGERS,
  getVariantLabel,
  createCharacterSchema,
  type CreateCharacterInput,
} from '@kidoo/shared/models/gotchi';
```

## Documentation par module

| Module | Description |
|--------|-------------|
| [Workspace](./workspace.md) | Vue d’ensemble du workspace (4 projets, scripts, comment ajouter un modèle) |
| [Emotions](./emotions.md) | Triggers d'émotions, variants, conditions, effets progressifs (manger), alignement ESP32 |
| [Scripts](./scripts.md) | Génération `constants.h` et `model_ids.h` pour l’ESP32 |
| [Registre des modèles](./model-registry-design.md) | Source unique des modèles (TypeScript, Prisma, ESP32) |
| [Shared par modèle](./shared-by-model.md) | Architecture par modèle (models/gotchi/emotions, etc.) |

## Principes

- **Une source de vérité** : les données (ex. `EATING_VARIANTS`, triggers) sont définies une seule fois dans kidoo-shared.
- **Pas de duplication** : schémas et types partagés pour cohérence app / server / firmware.
- **Génération** : le firmware ESP32 consomme un `.h` généré à partir du shared (voir [scripts](./scripts.md)).
