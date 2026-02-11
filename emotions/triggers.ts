/**
 * Déclencheurs automatiques pour les émotions (Gotchi).
 * Source de vérité partagée : site admin (sélecteur) et ESP32 (trigger_manager)
 * doivent utiliser exactement ces valeurs.
 */

export type EmotionTriggerType =
  | 'manual'
  // Faim
  | 'hunger_critical'
  | 'hunger_low'
  | 'hunger_medium'
  // Manger (un seul trigger, variants = Biberon / Gâteau / Pomme / Bonbon comme la faim)
  | 'eating'
  // Bonheur
  | 'happiness_low'
  | 'happiness_medium'
  | 'happiness_high'
  // Santé
  | 'health_critical'
  | 'health_low'
  | 'health_good'
  // Fatigue
  | 'fatigue_high'
  | 'fatigue_low'
  // Hygiène
  | 'hygiene_low'
  | 'hygiene_good';

/** Tous les triggers automatiques (hors "manual"), dans l’ordre de priorité côté ESP. */
export const EMOTION_TRIGGER_VALUES: readonly EmotionTriggerType[] = [
  'hunger_critical',
  'health_critical',
  'hunger_low',
  'health_low',
  'happiness_low',
  'fatigue_high',
  'hygiene_low',
  'eating',
  'happiness_high',
  'health_good',
  'fatigue_low',
  'hygiene_good',
  'hunger_medium',
  'happiness_medium',
] as const;

/** Valeur par défaut pour un clip sans trigger. */
export const DEFAULT_EMOTION_TRIGGER: EmotionTriggerType = 'manual';
