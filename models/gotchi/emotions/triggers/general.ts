import type { TriggerDef } from '../types';

/** Triggers catégorie Général (manuel uniquement). */
export const TRIGGERS_GENERAL: TriggerDef[] = [
  { id: 'manual', label: 'Manuel', condition: { type: 'manual' }, category: 'General', variants: [{ value: 1, label: '—' }], priority: 0 },
];
