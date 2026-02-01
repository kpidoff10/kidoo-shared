/**
 * Modèles Kidoo supportés pour le firmware.
 * Partagé entre server (admin), app et esp32 pour cohérence.
 */

export const KIDOO_MODELS = [
  { id: 'basic', label: 'Basic', description: 'Kidoo Basic' },
  { id: 'dream', label: 'Dream', description: 'Kidoo Dream' },
] as const;

export type KidooModelId = (typeof KIDOO_MODELS)[number]['id'];

export type KidooModel = (typeof KIDOO_MODELS)[number];

export function getKidooModel(id: string): KidooModel | undefined {
  return KIDOO_MODELS.find((m) => m.id === id);
}

export function isKidooModelId(id: string): id is KidooModelId {
  return KIDOO_MODELS.some((m) => m.id === id);
}
