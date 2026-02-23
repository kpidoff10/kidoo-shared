# Registre des modèles — source unique TypeScript (sans `any`)

Ce document détaille comment faire de **kidoo-shared** la source de vérité pour la liste des modèles (basic, dream, gotchi, …), avec typage strict partout et génération C++ pour l’ESP32.

---

## 1. Situation actuelle

- **Prisma** (kidoo-server) : enum `KidooModel { basic, dream }` = source actuelle.
- **kidoo-shared/firmware/modelIds.generated.ts** : généré par un script dans le server (`scripts/generate-kidoo-model-ids.js`) qui lit le schéma Prisma.
- **kidoo-shared/firmware/models.ts** : importe `KIDOO_MODEL_IDS` du fichier généré, ajoute `KIDOO_MODEL_META` (label, description), exporte `KidooModelId`, `KIDOO_MODELS`, `getKidooModel`, `isKidooModelId`.
- **App + server** : importent depuis `@kidoo/shared` → types OK. Le server utilise aussi `KidooModel` de `@kidoo/shared/prisma` pour les appels Prisma (enum généré par Prisma).
- **ESP32** : pas encore de liste de modèles générée depuis shared (uniquement constantes emotions/config via `generate-esp32-constants.ts`).

Problème : la liste des modèles dépend du server (Prisma). Pour ajouter « gotchi », il faut toucher Prisma, lancer un script côté server, puis mettre à jour la meta dans shared.

---

## 2. Objectif

- **Une seule source** : un fichier TypeScript dans **kidoo-shared** qui définit les IDs + métadonnées (label, description).
- **Tout typé** : types dérivés avec `as const` / `typeof`, aucun `any`.
- **App + server** : importent depuis `@kidoo/shared` ; les types sont les mêmes partout.
- **Prisma** : rester aligné avec cette liste (procédure claire : ajouter le modèle dans shared puis dans Prisma + migration).
- **ESP32** : un script dans shared génère un header C++ (enum ou `#define`) à partir de la même source.

---

## 3. Structure proposée

### 3.1 Fichier source unique : `firmware/modelRegistry.ts`

Un seul fichier qui contient la liste et les métadonnées, avec des types inférés :

```ts
/**
 * Registre des modèles Kidoo — source de vérité pour app, server et ESP32.
 * Pour ajouter un modèle : (1) ajouter ici, (2) ajouter l'enum dans prisma/schema.prisma (kidoo-server), (3) migration, (4) lancer generate:esp32-model-ids si besoin.
 */

export const KIDOO_MODEL_IDS = ['basic', 'dream', 'gotchi'] as const;
export type KidooModelId = (typeof KIDOO_MODEL_IDS)[number];

const KIDOO_MODEL_META: Record<KidooModelId, { label: string; description: string }> = {
  basic: { label: 'Basic', description: 'Kidoo Basic' },
  dream: { label: 'Dream', description: 'Kidoo Dream (veilleuse)' },
  gotchi: { label: 'Gotchi', description: 'Kidoo Gotchi (Tamagotchi)' },
};

export const KIDOO_MODELS = KIDOO_MODEL_IDS.map((id) => ({
  id,
  ...KIDOO_MODEL_META[id],
})) as readonly { id: KidooModelId; label: string; description: string }[];

export type KidooModel = (typeof KIDOO_MODELS)[number];

export function getKidooModel(id: string): KidooModel | undefined {
  return KIDOO_MODELS.find((m) => m.id === id);
}

export function isKidooModelId(id: string): id is KidooModelId {
  return KIDOO_MODEL_IDS.includes(id as KidooModelId);
}
```

- Aucun `any` : `KidooModelId` est `'basic' | 'dream' | 'gotchi'`, `KidooModel` est l’objet complet typé.

### 3.2 Rôle de `firmware/models.ts`

- **Option A (recommandée)** : `models.ts` devient un simple ré-export de `modelRegistry.ts` (pour ne pas casser les imports existants qui pointent vers `firmware/models`).
- **Option B** : fusionner le contenu de `modelRegistry.ts` dans `models.ts` et supprimer `modelRegistry.ts`. Même résultat, un fichier en moins.

Les deux options gardent les mêmes exports : `KIDOO_MODEL_IDS`, `KidooModelId`, `KIDOO_MODELS`, `KidooModel`, `getKidooModel`, `isKidooModelId`.

### 3.3 Suppression de `modelIds.generated.ts`

- La source n’est plus Prisma mais le registre TypeScript ci-dessus.
- On supprime `firmware/modelIds.generated.ts` et tout import vers ce fichier.
- `firmware/schema.ts` (Zod) : utiliser `z.enum(KIDOO_MODEL_IDS)` en important depuis `./models` (ou `./modelRegistry`), ce qui reste valide car `KIDOO_MODEL_IDS` est un tuple `readonly`.

### 3.4 Prisma (kidoo-server)

- L’enum `KidooModel` dans `schema.prisma` doit contenir les mêmes valeurs que `KIDOO_MODEL_IDS`.
- **Procédure** : quand tu ajoutes un modèle dans shared (dans `modelRegistry.ts` ou `models.ts`), tu ajoutes la même valeur dans `enum KidooModel { ... }` dans `prisma/schema.prisma`, puis tu crées une migration (`npx prisma migrate dev`).
- Le script `scripts/generate-kidoo-model-ids.js` dans le server peut être **supprimé** (on n’utilise plus de fichier généré pour les IDs).
- Côté code server : continuer à utiliser `KidooModelId` / `isKidooModelId` depuis `@kidoo/shared` ; pour les appels Prisma qui attendent l’enum, garder le cast `model as KidooModel` (type Prisma) car TypeScript ne sait pas que l’enum Prisma et `KidooModelId` sont alignés. Pas d’`any` : le type Prisma reste fortement typé.

### 3.5 Génération ESP32 : nouveau script `generate-esp32-model-ids.ts`

- **Emplacement** : `kidoo-shared/scripts/generate-esp32-model-ids.ts`.
- **Comportement** : importer `KIDOO_MODEL_IDS` depuis `../firmware/modelRegistry` (ou `../firmware/models`), générer un fichier C++ (ex. `model_ids.h`) avec par exemple :
  - un `enum` C++ ou des `#define MODEL_BASIC`, `MODEL_DREAM`, `MODEL_GOTCHI`, etc.
- **Sortie** : par défaut dans `kidoo-esp32/src/models/...` (même logique que `generate-esp32-constants.ts` avec `--output` optionnel).
- **Script npm** dans `kidoo-shared/package.json` : `"generate:esp32-model-ids": "tsx scripts/generate-esp32-model-ids.ts"`.
- Optionnel : un seul script `generate:esp32` qui enchaîne constantes + model IDs si tu préfères.

Résultat : app, server et ESP32 s’appuient sur la même liste, sans `any`, avec un seul endroit à éditer (le registre dans shared).

---

## 4. Mise en œuvre (effectuée)

1. ✅ `firmware/modelRegistry.ts` créé (basic, dream, gotchi).
2. ✅ `firmware/models.ts` réexporte depuis `modelRegistry`.
3. ✅ `firmware/schema.ts` utilise déjà `z.enum(KIDOO_MODEL_IDS)` via `./models`.
4. ✅ `firmware/modelIds.generated.ts` supprimé.
5. ✅ kidoo-server : enum Prisma `KidooModel` + `gotchi`, migration `20260220120000_add_gotchi_to_kidoo_model_enum`, script `generate-kidoo-model-ids.js` supprimé, `db:generate` / `postinstall` = `prisma generate` uniquement.
6. ✅ `scripts/generate-esp32-model-ids.ts` + npm `generate:esp32-model-ids` ; sortie par défaut : `kidoo-esp32/src/models/model_ids.h`.
7. Pour ajouter un modèle plus tard : (1) éditer `firmware/modelRegistry.ts`, (2) ajouter la valeur dans `enum KidooModel` (prisma/schema.prisma) + `prisma migrate dev`, (3) `npm run generate:esp32-model-ids` dans kidoo-shared.

---

## 5. Résumé

- **Source unique** : un fichier TypeScript dans shared (registre des modèles), tout en typage strict (aucun `any`).
- **App + server** : import depuis `@kidoo/shared` ; mêmes types partout.
- **Prisma** : tenu à jour manuellement (enum + migration) quand la liste change dans shared.
- **ESP32** : header C++ généré par un script dans shared qui lit le même registre.

Tu peux détailler ensuite l’implémentation du script `generate-esp32-model-ids.ts` (format exact du `.h` et emplacement dans kidoo-esp32) en fonction de comment tu veux utiliser les IDs côté firmware (enum, defines, etc.).
