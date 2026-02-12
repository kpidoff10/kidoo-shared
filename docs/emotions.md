# Module Emotions

Déclencheurs automatiques d'émotions pour le modèle **Gotchi**. Source de vérité partagée entre le site admin (sélecteur de triggers/variants) et l'ESP32 (logique de déclenchement).

## Concepts

- **Trigger** : une règle qui déclenche une émotion (ex. "Faim critique", "Mange", "Manual").
- **Condition** : critère structuré (ex. faim ≤ 10%, bonheur entre 40–60%).
- **Variant** : sous-type optionnel (1–4) ; pour "manger", les variants = aliments (bottle, cake, apple, candy) avec effets progressifs.

## Structure des fichiers

```
emotions/
├── types.ts       # TriggerCondition, TriggerDef, EatingVariant, ProgressiveFoodEffect
├── constants.ts   # EATING_VARIANTS, DEFAULT_VARIANTS, EMOTION_TRIGGER_CATEGORIES, STAT_LABELS
├── utils.ts       # getConditionShortLabel, getConditionDescription
├── triggers/      # Un fichier par catégorie
│   ├── general.ts
│   ├── hunger.ts
│   ├── eating.ts
│   ├── happiness.ts
│   ├── health.ts
│   ├── fatigue.ts
│   └── hygiene.ts
└── index.ts       # Concaténation des triggers + exports publics
```

## Types principaux

### TriggerCondition

Condition structurée (pas de texte libre) :

- `{ type: 'manual' }` — pas de déclenchement auto
- `{ type: 'less_than'; stat; value }` — stat ≤ value %
- `{ type: 'greater_than'; stat; value }` — stat ≥ value %
- `{ type: 'between'; stat; min; max }` — stat entre min et max %
- `{ type: 'action'; description? }` — déclenchement par action (ex. manger)

`stat` est un `TriggerConditionStat` : `hunger` | `happiness` | `health` | `fatigue` | `hygiene`.

### TriggerDef / EmotionTriggerDefinition

- `id` : identifiant unique (ex. `hunger_critical`, `eating_started`, `manual`)
- `label` : libellé affichable
- `condition` : `TriggerCondition`
- `category` : une des `EMOTION_TRIGGER_CATEGORIES`
- `variants` : liste de `TriggerVariant` (value, label)
- `priority` : ordre côté ESP32 (interne, non exposé dans `EmotionTriggerDefinition`)

### EatingVariant

Variant avec effet progressif (aliment) :

- `value`, `label`, `itemId` (bottle, cake, apple, candy)
- `tickHunger`, `tickHappiness`, `tickHealth` : gains par tick
- `tickIntervalMs`, `totalTicks` (0 = illimité)

## Constantes exportées

| Nom | Description |
|-----|--------------|
| `EATING_VARIANTS` | Variants 0–4 pour manger (0 = Any, 1–4 = aliments avec effets) |
| `DEFAULT_VARIANTS` | Variants 1–4 génériques pour les autres triggers |
| `EMOTION_TRIGGER_CATEGORIES` | Ordre des catégories (General, Hunger, Eating, …) |
| `STAT_LABELS` | Libellés des stats en français (la faim, le bonheur, …) |
| `VARIANT_ANY_LABEL` | `"Any"` pour le variant 0 |
| `EMOTION_TRIGGERS` | Tableau complet des triggers (définitions publiques) |
| `EMOTION_TRIGGER_VALUES` | Ids des triggers automatiques, ordonnés par priorité |
| `DEFAULT_EMOTION_TRIGGER` | `'manual'` |
| `PROGRESSIVE_FOOD_EFFECTS` | Liste dérivée de `EATING_VARIANTS` (variants 1–4, format aplati) |

## Fonctions utilitaires

| Fonction | Description |
|----------|-------------|
| `getConditionShortLabel(condition)` | Libellé court (ex. "≤10%", "40-60%") |
| `getConditionDescription(condition)` | Description complète (ex. "Quand la faim est ≤ 10%") |
| `getTriggerDisplayLabel(triggerId)` | Libellé compact pour un trigger (ex. "Faim critique (≤10%)") |
| `getTriggerDefinition(triggerId)` | Définition du trigger par id |
| `getVariantLabel(triggerId, variant)` | Libellé du variant (ex. "Bottle", "Any") |
| `getVariantOptions(triggerId)` | Options `{ value, label }` pour un sélecteur |
| `getProgressiveFoodEffectByVariant(variant)` | Effet progressif pour un variant 1–4 |

## Alignement ESP32

- Les ids de triggers et l’ordre de priorité sont utilisés côté firmware.
- Les effets progressifs (manger) sont générés dans `constants.h` à partir de `EATING_VARIANTS` (voir [Scripts](./scripts.md)). Ne pas éditer le `.h` à la main.
