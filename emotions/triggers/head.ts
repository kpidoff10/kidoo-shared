import type { TriggerDef } from '../types';
import { TRIGGER_EFFECTS } from '../constants';

/** Triggers catégorie Head (toucher / tête). */
export const TRIGGERS_HEAD: TriggerDef[] = [
  {
    id: 'head_caress',
    label: 'Caresse sur la tête',
    condition: { type: 'action', description: 'Toucher/caresse sur la tête (capteur TTP223)' },
    category: 'Head',
    variants: [{ value: 1, label: 'Caresse sur la tête' }],
    priority: 0,
    effect: TRIGGER_EFFECTS['head_caress'],
  },
];
