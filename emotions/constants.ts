/**
 * Constantes pour les déclencheurs d'émotions : variants, libellés stats, catégories, effets.
 * Source de vérité unique pour EATING_VARIANTS (effet progressif) et TRIGGER_EFFECTS (effet instantané).
 */

import type { EatingVariant, TriggerVariant, TriggerConditionStat, TriggerStatEffect } from './types';

/** Libellé pour le variant 0 = n'importe lequel (ex. manger sans aliment précis). */
export const VARIANT_ANY_LABEL = 'Any';

/** Effets instantanés sur les stats quand un trigger est activé (ex. caresse → +1 bonheur). Généré dans constants.h pour l'ESP32. Pas d'entrée pour "eating" : les effets sont déjà par variant dans EATING_VARIANTS. */
export const TRIGGER_EFFECTS: Record<string, TriggerStatEffect> = {
  head_caress: { happiness: 1 },
};

/** Variants partagés pour les triggers manger/faim : libellé + effet progressif (ticks, intervalle, faim/bonheur/santé). Source de vérité unique. */
export const EATING_VARIANTS: EatingVariant[] = [
  { value: 0, label: VARIANT_ANY_LABEL },
  { value: 1, label: 'Bottle', itemId: 'bottle', tickHunger: 5, tickHappiness: 1, tickHealth: 0, tickIntervalMs: 5000, totalTicks: 0 },
  { value: 2, label: 'Cake', itemId: 'cake', tickHunger: 1, tickHappiness: 1, tickHealth: 1, tickIntervalMs: 8000, totalTicks: 5 },
  { value: 3, label: 'Apple', itemId: 'apple', tickHunger: 2, tickHappiness: 0, tickHealth: 1, tickIntervalMs: 5000, totalTicks: 4 },
  { value: 4, label: 'Candy', itemId: 'candy', tickHunger: 1, tickHappiness: 2, tickHealth: 2, tickIntervalMs: 6000, totalTicks: 3 },
];

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
