/**
 * Constantes pour les déclencheurs d'émotions : libellés stats, catégories, effets instantanés.
 * Aliments (EATING_VARIANTS) : voir models/gotchi/food.
 */

import type { TriggerVariant, TriggerConditionStat, TriggerStatEffect } from './types';

/** Effets instantanés sur les stats quand un trigger est activé (ex. caresse → +1 bonheur). Généré dans constants.h pour l'ESP32. */
export const TRIGGER_EFFECTS: Record<string, TriggerStatEffect> = {
  head_caress: { happiness: 1 },
};

/** Variants par défaut 1–4 pour les autres triggers. */
export const DEFAULT_VARIANTS: TriggerVariant[] = [
  { value: 1, label: 'Variant 1' },
  { value: 2, label: 'Variant 2' },
  { value: 3, label: 'Variant 3' },
  { value: 4, label: 'Variant 4' },
];

/** Ordre des catégories pour le sélecteur (optgroups). Valeurs en anglais. */
export const EMOTION_TRIGGER_CATEGORIES = [
  'General',
  'Head',
  'Hunger',
  'Eating',
  'Happiness',
  'Health',
  'Fatigue',
  'Hygiene',
] as const;

/** Libellés des stats pour l'affichage (ex. "la faim", "le bonheur"). */
export const STAT_LABELS: Record<TriggerConditionStat, string> = {
  hunger: 'la faim',
  happiness: 'le bonheur',
  health: 'la santé',
  fatigue: 'la fatigue',
  hygiene: 'la propreté',
};
