/**
 * Aliments Gotchi : liste des variants manger (effets progressifs).
 * Source de vérité unique pour la génération constants.h (ESP32).
 */

import type { EatingVariant } from './types';

/** Libellé pour le variant 0 = n'importe quel aliment. */
export const VARIANT_ANY_LABEL = 'Any';

/** Variants pour les triggers manger/faim : libellé + effet progressif (ticks, intervalle, faim/bonheur/santé). */
export const EATING_VARIANTS: EatingVariant[] = [
  { value: 0, label: VARIANT_ANY_LABEL },
  { value: 1, label: 'Bottle', itemId: 'bottle', tickHunger: 5, tickHappiness: 1, tickHealth: 0, tickIntervalMs: 5000, totalTicks: 0 },
  { value: 2, label: 'Cake', itemId: 'cake', tickHunger: 1, tickHappiness: 5, tickHealth: 1, tickIntervalMs: 8000, totalTicks: 2 },
  { value: 3, label: 'Apple', itemId: 'apple', tickHunger: 2, tickHappiness: 0, tickHealth: 1, tickIntervalMs: 5000, totalTicks: 4 },
  { value: 4, label: 'Candy', itemId: 'candy', tickHunger: 1, tickHappiness: 2, tickHealth: 2, tickIntervalMs: 6000, totalTicks: 3 },
];
