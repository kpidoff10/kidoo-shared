# Architecture shared par modèle

Certaines parties de **kidoo-shared** ne concernent qu'un seul modèle produit (ex. **Gotchi** pour les émotions, **Dream** pour bedtime/wakeup). Ce document décrit une structure qui reflète ça, sans tout mélanger à la racine.

---

## Principe

- **À la racine** (ou dans `firmware/`, `models/common/`, `auth/`, etc.) : ce qui est **vraiment commun** à tous les modèles ou à tout le workspace (registre des modèles, schémas Kidoo, auth, types communs).
- **Sous `models/<modelId>/`** : ce qui est **spécifique à un modèle** (ex. triggers dâ€™émotions pour Gotchi, constantes alimentaires, etc.). Un projet (app, server) ou un script (génération ESP32) qui travaille pour un modèle donné importe depuis `models/gotchi/` (ou le modèle concerné).

Résultat : en ouvrant shared, on voit tout de suite ce qui est commun et ce qui est par modèle.

---

## Structure proposée

```
kidoo-shared/
├── auth/                    # Commun
├── firmware/                # Commun (registre modèles, schémas firmware)
├── models/                  # Par modèle + commun
│   ├── common/              # Commun (CRUD schemas, config, commandes)
│   │   ├── schemas.ts       # createKidoo, updateKidoo, etc.
│   │   ├── config/          # brightness, sleep-timeout, sleep-mode, name
│   │   └── commands/        # get-info, reboot, firmware-update
│   ├── gotchi/              # @kidoo/shared/models/gotchi
│   │   ├── emotions/        # triggers, constants, utils
│   │   ├── food/            # EATING_VARIANTS, effets
│   │   ├── config/          # réexport common + spécifique
│   │   ├── commands/        # réexport common
│   │   └── characters/
│   └── dream/               # @kidoo/shared/models/dream
│       ├── config/          # dream-bedtime, dream-wakeup, color-utils (source de vérité)
│       └── commands/        # réexport common
├── types/
├── scripts/                 # Génération (importent depuis models/gotchi, etc.)
├── docs/
└── index.ts
```

Règles rapides :

- **Commun** : auth, firmware (registre + schémas), models/common (schemas, config, commands), types.
- **Par modèle** : `models/gotchi/*` (emotions, food, config, commands, characters) ; `models/dream/*` (config : dream-bedtime, dream-wakeup, color-utils — source de vérité ; commands).

---

## Imports et compatibilitÃ©

### Option A â€” Rétrocompatibilité maximale (recommandÃ© pour la migration)

- **Déplacer** `emotions/` â†’ `models/gotchi/emotions/`.
- Dans **`index.ts`** à la racine, garder un re-export :
  ```ts
  export * from './models/gotchi/emotions';
  ```
- Tous les imports existants `from '@kidoo/shared'` (EMOTION_TRIGGERS, getVariantLabel, etc.) continuent de marcher sans rien changer dans app/server.
- Le script **generate-esp32-constants** importe depuis `../models/gotchi/emotions/constants` au lieu de `../emotions/constants`.

Avantage : aucun changement dans kidoo-server / kidoo-app. La structure shared reflète dÃ©jà le "par modèle".

### Option B â€” Imports explicites par modèle (en place)

- Export dédié dans **package.json** : `"./models/gotchi"` â†’ `./models/gotchi/index.ts`.
- Les émotions Gotchi ne sont **pas** re-exportées depuis la racine : il faut importer explicitement :
  ```ts
  import { EMOTION_TRIGGERS, getVariantLabel } from '@kidoo/shared/models/gotchi';
  ```
- Câ€™est plus explicite : on voit dans le code qu'on utilise du spécifique Gotchi.

---

## Ce qui reste à la racine (commun)

- **firmware/** : registre des modèles, schémas de création firmware â†’ utilisés par tous les modèles.
- **models/common/** : schémas CRUD, config (brightness, sleep-timeout, sleep-mode, name), commandes (get-info, reboot, firmware-update). Dream a sa config spécifique (dream-bedtime, dream-wakeup) sous `models/dream/config/`.
- **auth/, types/** : inchangés. (Characters est sous `models/gotchi/characters`.)

---

## Migration réalisée (emotions â†’ models/gotchi/emotions)

- `models/gotchi/emotions/` créé, contenu déplacé ; `models/gotchi/index.ts` réexporte les emotions.
- **index.ts** racine : plus de re-export des emotions (option B â€” imports explicites uniquement).
- **package.json** : export `"./models/gotchi"`.
- **scripts/generate-esp32-constants.ts** : import depuis `../models/gotchi/emotions/constants`.
- **kidoo-server** : imports émotions et characters depuis `@kidoo/shared/models/gotchi` (TriggerSelector, ClipTriggerEdit, ClipDetailInfo, charactersApi, useCharacters, API characters).
- Anciens dossiers **emotions/** et **characters/** supprimés ; tout est sous `models/gotchi/`.
- Docs (emotions.md, README.md, shared-by-model.md) mises à jour.

Règle : *données spécifiques à un modèle â†’ `models/<modelId>/` ; le reste à la racine ou dans firmware/common/auth.*
