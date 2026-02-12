/**
 * Types pour les déclencheurs d'émotions (Gotchi).
 * Source de vérité partagée : site admin et ESP32.
 */

export interface TriggerVariant {
  value: number;
  label: string;
}

/** Variant manger avec effet progressif optionnel (ticks, intervalle, faim/bonheur/santé par tick). */
export interface EatingVariant extends TriggerVariant {
  itemId?: string;
  tickHunger?: number;
  tickHappiness?: number;
  tickHealth?: number;
  tickIntervalMs?: number;
  totalTicks?: number; // 0 = illimité
}

/** Stat/jauge concernée par la condition (pour affichage et logique). */
export type TriggerConditionStat = 'hunger' | 'happiness' | 'health' | 'fatigue' | 'hygiene';

/** Deltas de stats appliqués instantanément quand le trigger est activé (ex. caresse = +1 bonheur). */
export interface TriggerStatEffect {
  hunger?: number;
  happiness?: number;
  health?: number;
  fatigue?: number;
  hygiene?: number;
}

/** Condition structurée : valeurs exploitables (type + value), pas du texte libre. */
export type TriggerCondition =
  | { type: 'manual' }
  | { type: 'less_than'; stat: TriggerConditionStat; value: number }
  | { type: 'greater_than'; stat: TriggerConditionStat; value: number }
  | { type: 'between'; stat: TriggerConditionStat; min: number; max: number }
  | { type: 'action'; description?: string };

/** Définition d'un trigger (interne, avec priority). */
export interface TriggerDef {
  id: string;
  label: string;
  condition: TriggerCondition;
  category: string;
  variants: TriggerVariant[];
  priority: number;
  /** Effet instantané sur les stats quand le trigger est activé (ex. caresse = +1 bonheur). Généré dans constants.h pour l'ESP32. */
  effect?: TriggerStatEffect;
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
