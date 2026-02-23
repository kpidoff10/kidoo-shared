/**
 * Types pour les aliments Gotchi (variants manger, effets progressifs).
 * EatingVariant est compatible avec { value, label } pour usage dans les triggers emotions.
 */

/** Variant manger avec effet progressif (ticks, intervalle, faim/bonheur/santé par tick). */
export interface EatingVariant {
  value: number;
  label: string;
  itemId?: string;
  tickHunger?: number;
  tickHappiness?: number;
  tickHealth?: number;
  tickIntervalMs?: number;
  totalTicks?: number; // 0 = illimité
}

/** Effet par tick (type aplati pour API/ESP32). totalTicks 0 = illimité. */
export interface ProgressiveFoodEffect {
  itemId: string;
  variant: number;
  tickHunger: number;
  tickHappiness: number;
  tickHealth: number;
  tickIntervalMs: number;
  totalTicks: number;
}
