/**
 * Module Aliments Gotchi — variants manger et effets progressifs.
 * Utilisé par emotions (triggers hunger/eating) et par generate-esp32-constants.
 */

import type { EatingVariant, ProgressiveFoodEffect } from './types';
import { EATING_VARIANTS } from './constants';

export * from './types';
export { EATING_VARIANTS, VARIANT_ANY_LABEL } from './constants';

/** Dérivé de EATING_VARIANTS (variants 1–4 avec les données d'effet). */
export const PROGRESSIVE_FOOD_EFFECTS: readonly ProgressiveFoodEffect[] = EATING_VARIANTS.filter((v) => v.value >= 1).map(
  (v) => ({
    itemId: v.itemId!,
    variant: v.value,
    tickHunger: v.tickHunger!,
    tickHappiness: v.tickHappiness ?? 0,
    tickHealth: v.tickHealth ?? 0,
    tickIntervalMs: v.tickIntervalMs!,
    totalTicks: v.totalTicks ?? 0,
  })
);

export function getProgressiveFoodEffectByVariant(variant: number): ProgressiveFoodEffect | undefined {
  return PROGRESSIVE_FOOD_EFFECTS.find((e) => e.variant === variant);
}
