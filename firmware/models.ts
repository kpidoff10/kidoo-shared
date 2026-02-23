/**
 * Modèles Kidoo supportés pour le firmware.
 * Source de vérité : modelRegistry.ts (app, server, ESP32).
 * Ré-export pour compatibilité des imports existants.
 */

export {
  KIDOO_MODEL_IDS,
  KIDOO_MODELS,
  getKidooModel,
  isKidooModelId,
} from './modelRegistry';
export type { KidooModelId, KidooModel } from './modelRegistry';
