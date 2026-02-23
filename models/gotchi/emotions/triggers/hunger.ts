import type { TriggerDef } from '../types';
import { EATING_VARIANTS } from '../../food';

/** Triggers catégorie Faim. */
export const TRIGGERS_HUNGER: TriggerDef[] = [
  { id: 'hunger_critical', label: 'Faim critique', condition: { type: 'less_than', stat: 'hunger', value: 10 }, category: 'Hunger', variants: EATING_VARIANTS, priority: 1 },
  { id: 'hunger_low', label: "J'ai faim", condition: { type: 'less_than', stat: 'hunger', value: 20 }, category: 'Hunger', variants: EATING_VARIANTS, priority: 3 },
  { id: 'hunger_medium', label: 'Faim moyenne', condition: { type: 'between', stat: 'hunger', min: 40, max: 60 }, category: 'Hunger', variants: EATING_VARIANTS, priority: 13 },
];
