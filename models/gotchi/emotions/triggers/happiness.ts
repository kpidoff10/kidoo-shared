import type { TriggerDef } from '../types';
import { DEFAULT_VARIANTS } from '../constants';

/** Triggers catégorie Bonheur. */
export const TRIGGERS_HAPPINESS: TriggerDef[] = [
  { id: 'happiness_low', label: 'Triste', condition: { type: 'less_than', stat: 'happiness', value: 20 }, category: 'Happiness', variants: DEFAULT_VARIANTS, priority: 5 },
  { id: 'happiness_medium', label: 'Content', condition: { type: 'between', stat: 'happiness', min: 40, max: 60 }, category: 'Happiness', variants: DEFAULT_VARIANTS, priority: 14 },
  { id: 'happiness_high', label: 'Très heureux', condition: { type: 'greater_than', stat: 'happiness', value: 80 }, category: 'Happiness', variants: DEFAULT_VARIANTS, priority: 9 },
];
