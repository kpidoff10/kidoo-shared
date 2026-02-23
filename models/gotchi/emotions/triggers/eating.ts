import type { TriggerDef } from '../types';
import { EATING_VARIANTS } from '../../food';

/** Triggers catégorie Manger. Effet = EATING_VARIANTS (progressif par variant), pas d'effet instantané. */
export const TRIGGERS_EATING: TriggerDef[] = [
  {
    id: 'eating',
    label: 'Mange',
    condition: { type: 'action', description: 'Manger (mêmes variants que la faim)' },
    category: 'Eating',
    variants: EATING_VARIANTS,
    priority: 8,
  },
];
