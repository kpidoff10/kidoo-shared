import type { TriggerDef } from '../types';
import { DEFAULT_VARIANTS } from '../constants';

/** Triggers catégorie Santé. */
export const TRIGGERS_HEALTH: TriggerDef[] = [
  { id: 'health_critical', label: 'Très malade', condition: { type: 'less_than', stat: 'health', value: 20 }, category: 'Health', variants: DEFAULT_VARIANTS, priority: 2 },
  { id: 'health_low', label: 'Malade', condition: { type: 'less_than', stat: 'health', value: 40 }, category: 'Health', variants: DEFAULT_VARIANTS, priority: 4 },
  { id: 'health_good', label: 'En bonne santé', condition: { type: 'greater_than', stat: 'health', value: 80 }, category: 'Health', variants: DEFAULT_VARIANTS, priority: 10 },
];
