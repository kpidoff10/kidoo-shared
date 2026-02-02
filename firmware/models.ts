/**
 * Modèles Kidoo supportés pour le firmware.
 * KIDOO_MODEL_IDS est généré depuis l'enum Prisma KidooModel (source de vérité).
 * Pas d'import du client Prisma ici pour rester utilisable en React Native / Expo.
 */

import { KIDOO_MODEL_IDS } from './modelIds.generated';

export { KIDOO_MODEL_IDS };
export type KidooModelId = (typeof KIDOO_MODEL_IDS)[number];

const KIDOO_MODEL_META: Record<KidooModelId, { label: string; description: string }> = {
  basic: { label: 'Basic', description: 'Kidoo Basic' },
  dream: { label: 'Dream', description: 'Kidoo Dream' },
};

export const KIDOO_MODELS = KIDOO_MODEL_IDS.map((id) => ({
  id: id as KidooModelId,
  ...KIDOO_MODEL_META[id as KidooModelId],
})) as readonly { id: KidooModelId; label: string; description: string }[];

export type KidooModel = (typeof KIDOO_MODELS)[number];

export function getKidooModel(id: string): KidooModel | undefined {
  return KIDOO_MODELS.find((m) => m.id === id);
}

export function isKidooModelId(id: string): id is KidooModelId {
  return KIDOO_MODEL_IDS.includes(id as KidooModelId);
}
