# Scripts

Scripts de génération de code à partir des données de kidoo-shared.

## generate-esp32-model-ids

Génère le fichier **model_ids.h** pour l’ESP32 : enum `KidooModelId` (BASIC, DREAM, GOTCHI, …) et `KIDOO_MODEL_COUNT`. Source de vérité : `firmware/modelRegistry.ts`.

**Usage** (depuis la racine de kidoo-shared) :

```bash
npm run generate:esp32-model-ids
```

Sortie par défaut : `kidoo-esp32/src/models/model_ids.h`

Avec sortie personnalisée :  
`npx tsx scripts/generate-esp32-model-ids.ts --output chemin/vers/model_ids.h`

À lancer après avoir ajouté un modèle dans `firmware/modelRegistry.ts`. Voir [Registre des modèles](./model-registry-design.md) et [Workspace](./workspace.md).

---

## generate:scaffold-models

Crée l’architecture **models/\<id\>/** (config + commands) pour tout modèle présent dans `firmware/modelRegistry.ts` qui n’a pas encore de dossier `models/<id>/`. N’écrase pas les modèles existants (dream, gotchi).

**Usage** (depuis la racine de kidoo-shared) :

```bash
npm run generate:scaffold-models
```

**Créé pour chaque nouveau modèle** :
- `models/<id>/index.ts` (export config + commands)
- `models/<id>/config/index.ts` (réexport brightness, sleep-timeout, sleep-mode, name depuis models/common/config)
- `models/<id>/commands/index.ts` (réexport get-info, reboot, firmware-update depuis models/common/commands)
- Entrée `"./models/<id>"` dans `package.json` (exports) si manquante

Ensuite vous pouvez adapter la config (ex. ajouter une config spécifique comme dream-bedtime pour Dream) ou ajouter d’autres dossiers (emotions, food, characters pour Gotchi). Voir [Workspace](./workspace.md) — « Comment ajouter un nouveau modèle ».

---

## generate-esp32-constants

Génère le fichier **constants.h** pour l’ESP32 (modèle Gotchi) à partir de `EATING_VARIANTS` (module **models/gotchi/food**) et `TRIGGER_EFFECTS` (module emotions).

### Usage

Depuis la racine de **kidoo-shared** :

```bash
npm run generate:esp32-constants
```

Sortie par défaut :  
`kidoo-esp32/src/models/gotchi/config/constants.h`

Pour une autre sortie :

```bash
npx tsx scripts/generate-esp32-constants.ts --output chemin/vers/constants.h
```

### Contenu généré

- **NFC Keys** : `NFC_KEY_BOTTLE`, `NFC_KEY_SNACK` (cake), `NFC_KEY_APPLE`, `NFC_KEY_CANDY` + items futurs (toothbrush, soap, bed).
- **NFC_KEY_TABLE** : tableau de mapping (key, itemId, name, variant).
- **ProgressiveFoodEffect** : structure C et tableau `PROGRESSIVE_FOOD_EFFECTS[]` avec les valeurs directement dans les initialisateurs (itemId, tickHunger, tickHappiness, tickHealth, tickInterval, totalTicks).

### Règles

- Ne pas éditer **constants.h** à la main ; la source de vérité est `EATING_VARIANTS`.
- Après modification des aliments ou de leurs effets dans `models/gotchi/food/constants.ts`, relancer le script puis recompiler le firmware.

### Dépendance

Le script utilise **tsx** (devDependency). Installer les deps avec `npm install` si besoin.
