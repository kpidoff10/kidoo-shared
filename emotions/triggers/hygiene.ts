import type { TriggerDef } from '../types';
import { DEFAULT_VARIANTS } from '../constants';

/** Triggers catégorie Hygiène. */
export const TRIGGERS_HYGIENE: TriggerDef[] = [
  { id: 'hygiene_low', label: 'Sale', condition: { type: 'less_than', stat: 'hygiene', value: 20 }, category: 'Hygiene', variants: DEFAULT_VARIANTS, priority: 7 },
  { id: 'hygiene_good', label: 'Propre', condition: { type: 'greater_than', stat: 'hygiene', value: 80 }, category: 'Hygiene', variants: DEFAULT_VARIANTS, priority: 12 },
];
