/**
 * Déclencheurs automatiques pour les émotions (Gotchi).
 * Source de vérité partagée : site admin (sélecteur) et ESP32 (trigger_manager).
 *
 * Structure : types + constantes + un fichier de triggers par catégorie, concaténés ici.
 */

export * from './types';
export { DEFAULT_VARIANTS, EMOTION_TRIGGER_CATEGORIES, STAT_LABELS } from './constants';
export { getConditionShortLabel, getConditionDescription } from './utils';
export { VARIANT_ANY_LABEL } from '../food';

import type { TriggerDef, TriggerCondition, TriggerVariant, TriggerStatEffect } from './types';
import { VARIANT_ANY_LABEL } from '../food';
import { getConditionShortLabel } from './utils';

import { TRIGGERS_GENERAL } from './triggers/general';
import { TRIGGERS_HEAD } from './triggers/head';
import { TRIGGERS_HUNGER } from './triggers/hunger';
import { TRIGGERS_EATING } from './triggers/eating';
import { TRIGGERS_HAPPINESS } from './triggers/happiness';
import { TRIGGERS_HEALTH } from './triggers/health';
import { TRIGGERS_FATIGUE } from './triggers/fatigue';
import { TRIGGERS_HYGIENE } from './triggers/hygiene';

/** Tableau complet des triggers (concaténation de toutes les catégories). */
const TRIGGERS: readonly TriggerDef[] = [
  ...TRIGGERS_GENERAL,
  ...TRIGGERS_HEAD,
  ...TRIGGERS_HUNGER,
  ...TRIGGERS_EATING,
  ...TRIGGERS_HAPPINESS,
  ...TRIGGERS_HEALTH,
  ...TRIGGERS_FATIGUE,
  ...TRIGGERS_HYGIENE,
];

/** Type union des ids de trigger (dérivé du tableau). */
export type EmotionTriggerType = (typeof TRIGGERS)[number]['id'];

/** Définition publique d'un trigger (sans priority). */
export interface EmotionTriggerDefinition {
  id: EmotionTriggerType;
  label: string;
  condition: TriggerCondition;
  category: string;
  variants: TriggerVariant[];
  /** Effet instantané sur les stats quand le trigger est activé (généré dans constants.h pour l'ESP32). */
  effect?: TriggerStatEffect;
}

/** Tableau des triggers (priority non exposée dans le type). */
export const EMOTION_TRIGGERS = TRIGGERS as readonly EmotionTriggerDefinition[];

/** Tous les triggers automatiques (hors "manual"), dans l'ordre de priorité côté ESP (dérivé). */
export const EMOTION_TRIGGER_VALUES: readonly EmotionTriggerType[] = TRIGGERS.filter((t) => t.priority > 0)
  .sort((a, b) => a.priority - b.priority)
  .map((t) => t.id) as EmotionTriggerType[];

/** Valeur par défaut pour un clip sans trigger. */
export const DEFAULT_EMOTION_TRIGGER: EmotionTriggerType = 'manual';

/** Trouve la définition d'un trigger par id. */
export function getTriggerDefinition(triggerId: EmotionTriggerType | null | undefined): EmotionTriggerDefinition | undefined {
  const id = triggerId ?? DEFAULT_EMOTION_TRIGGER;
  return EMOTION_TRIGGERS.find((t) => t.id === id);
}

/** Libellé d'affichage compact pour un trigger (ex. "Faim critique (≤10%)"). */
export function getTriggerDisplayLabel(triggerId: EmotionTriggerType | string | null | undefined): string {
  const id = triggerId ?? 'manual';
  if (id === 'eating_started' || id === 'eating_in_progress' || id === 'eating_finished') return 'Mange';
  const def = getTriggerDefinition(id as EmotionTriggerType);
  if (!def) return String(id);
  const short = getConditionShortLabel(def.condition);
  return short ? `${def.label} (${short})` : def.label;
}

/** Retourne le libellé d'affichage d'un variant selon le trigger. */
export function getVariantLabel(triggerId: EmotionTriggerType | null | undefined, variant: number): string {
  const def = getTriggerDefinition(triggerId);
  const v = variant === 0 ? 0 : Math.max(1, Math.min(4, Math.floor(variant) || 1));
  const variantDef = def?.variants.find((x) => x.value === v);
  if (variantDef) return variantDef.label;
  if (v === 0) return VARIANT_ANY_LABEL;
  return `Variant ${v}`;
}

/** Retourne la liste des options { value, label } pour le sélecteur de variant selon le trigger. */
export function getVariantOptions(triggerId: EmotionTriggerType | null | undefined): Array<{ value: number; label: string }> {
  const def = getTriggerDefinition(triggerId);
  if (!def || def.variants.length === 0) return [];
  return [...def.variants];
}
