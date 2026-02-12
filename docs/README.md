# Documentation kidoo-shared

Package partagé entre **kidoo-app** (Expo), **kidoo-server** (Next.js) et **kidoo-esp32** (firmware). Contient schémas Zod, types TypeScript, constantes et données métier communes.

## Structure du package

```
kidoo-shared/
├── auth/              # Schémas et types d'authentification
├── characters/        # Schémas personnages (admin / TamaBotchi)
├── emotions/         # Déclencheurs d'émotions Gotchi (source de vérité)
│   ├── triggers/     # Un fichier par catégorie (general, hunger, eating, …)
│   ├── types.ts
│   ├── constants.ts
│   ├── utils.ts
│   └── index.ts
├── firmware/         # Modèles supportés, schémas mise à jour
├── kidoos/           # CRUD, config persistante, commandes temps réel
├── scripts/          # Génération de code (ex. constants.h pour ESP32)
├── types/            # Types communs
├── docs/             # Cette documentation
└── index.ts          # Point d'entrée
```

## Imports

Depuis **kidoo-app** ou **kidoo-server** (avec alias `@/shared` ou `@kidoo/shared`) :

```ts
import {
  // Emotions
  EMOTION_TRIGGERS,
  EATING_VARIANTS,
  getTriggerDisplayLabel,
  getVariantLabel,
  getConditionDescription,
  // Auth, kidoos, firmware, etc.
} from '@/shared';
```

## Documentation par module

| Module | Description |
|--------|-------------|
| [Emotions](./emotions.md) | Triggers d'émotions, variants, conditions, effets progressifs (manger), alignement ESP32 |
| [Scripts](./scripts.md) | Script de génération du fichier `constants.h` pour l'ESP32 |

## Principes

- **Une source de vérité** : les données (ex. `EATING_VARIANTS`, triggers) sont définies une seule fois dans kidoo-shared.
- **Pas de duplication** : schémas et types partagés pour cohérence app / server / firmware.
- **Génération** : le firmware ESP32 consomme un `.h` généré à partir du shared (voir [scripts](./scripts.md)).
