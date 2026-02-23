/**
 * Utilitaires pour les conditions et libellés des triggers.
 */

import type { TriggerCondition } from './types';
import { STAT_LABELS } from './constants';

/** Court libellé dérivé de la condition (ex. "≤10%", "40-60%") pour affichage compact. */
export function getConditionShortLabel(c: TriggerCondition): string | null {
  switch (c.type) {
    case 'manual':
      return null;
    case 'less_than':
      return `≤${c.value}%`;
    case 'greater_than':
      return `≥${c.value}%`;
    case 'between':
      return `${c.min}-${c.max}%`;
    case 'action':
      return null;
  }
}

/** Description complète de la condition (ex. "Quand la faim est ≤ 10%") pour le sélecteur. */
export function getConditionDescription(c: TriggerCondition): string {
  switch (c.type) {
    case 'manual':
      return 'Pas de déclenchement automatique';
    case 'less_than':
      return `Quand ${STAT_LABELS[c.stat]} est ≤ ${c.value}%`;
    case 'greater_than':
      return `Quand ${STAT_LABELS[c.stat]} est ≥ ${c.value}%`;
    case 'between':
      return `Quand ${STAT_LABELS[c.stat]} est entre ${c.min}-${c.max}%`;
    case 'action':
      return c.description ?? '';
  }
}
