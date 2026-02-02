/**
 * Modèles Kidoo supportés pour le firmware.
 * Les ids sont dérivés de l'enum Prisma KidooModel (base de données) pour une seule source de vérité.
 */

import { KidooModel as PrismaKidooModel } from '../prisma';

// Ids dérivés de l'enum Prisma (alignés avec la base de données)
export const KIDOO_MODEL_IDS = Object.values(PrismaKidooModel) as [string, ...string[]];
export type KidooModelId = (typeof PrismaKidooModel)[keyof typeof PrismaKidooModel];

// Métadonnées d'affichage (label, description) par id — clés basées sur l'enum Prisma
const KIDOO_MODEL_META: Record<KidooModelId, { label: string; description: string }> = {
  [PrismaKidooModel.basic]: { label: 'Basic', description: 'Kidoo Basic' },
  [PrismaKidooModel.dream]: { label: 'Dream', description: 'Kidoo Dream' },
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
