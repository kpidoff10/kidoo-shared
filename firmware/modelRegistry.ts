/**
 * Registre des modèles Kidoo — source de vérité pour app, server et ESP32.
 * Pour ajouter un modèle : (1) ajouter ici, (2) ajouter l'enum dans prisma/schema.prisma (kidoo-server), (3) migration, (4) npm run generate:esp32-model-ids si besoin.
 */

export const KIDOO_MODEL_IDS = ['basic', 'dream', 'gotchi', 'sound'] as const;
export type KidooModelId = (typeof KIDOO_MODEL_IDS)[number];

const KIDOO_MODEL_META: Record<KidooModelId, { label: string; description: string }> = {
  basic: { label: 'Basic', description: 'Kidoo Basic' },
  dream: { label: 'Dream', description: 'Kidoo Dream (veilleuse)' },
  gotchi: { label: 'Gotchi', description: 'Kidoo Gotchi (Tamagotchi)' },
  sound: { label: 'Sound', description: 'Kidoo Sound (boîte à musique)' },
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
