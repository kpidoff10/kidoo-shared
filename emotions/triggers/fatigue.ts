import type { TriggerDef } from '../types';
import { DEFAULT_VARIANTS } from '../constants';

/** Triggers catégorie Fatigue. */
export const TRIGGERS_FATIGUE: TriggerDef[] = [
  { id: 'fatigue_high', label: 'Très fatigué', condition: { type: 'greater_than', stat: 'fatigue', value: 80 }, category: 'Fatigue', variants: DEFAULT_VARIANTS, priority: 6 },
  { id: 'fatigue_low', label: 'Bien reposé', condition: { type: 'less_than', stat: 'fatigue', value: 20 }, category: 'Fatigue', variants: DEFAULT_VARIANTS, priority: 11 },
];
