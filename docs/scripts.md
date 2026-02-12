# Scripts

Scripts de génération de code à partir des données de kidoo-shared.

## generate-esp32-constants

Génère le fichier **constants.h** pour l’ESP32 (modèle Gotchi) à partir de `EATING_VARIANTS` dans `emotions/constants.ts`.

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
- Après modification des aliments ou de leurs effets dans `emotions/constants.ts`, relancer le script puis recompiler le firmware.

### Dépendance

Le script utilise **tsx** (devDependency). Installer les deps avec `npm install` si besoin.
