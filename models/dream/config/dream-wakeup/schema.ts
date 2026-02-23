/**
 * Schéma pour la configuration de l'heure de réveil du modèle Dream
 */

import { z } from 'zod';
import { hexToRgb, saturateRgbToMax } from '../color-utils';

export { hexToRgb, saturateRgbToMax };

export const WAKEUP_LIMITS = {
  hour: { min: 0, max: 23 },
  minute: { min: 0, max: 59 },
  colorRGB: { min: 0, max: 255 },
  brightness: { min: 0, max: 100 },
} as const;

import type { Weekday } from '../../../../types/common';
export type { Weekday };

const timeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
  activated: z.boolean(),
});

export const updateDreamWakeupConfigSchema = z.preprocess((data: unknown) => {
  if (data && typeof data === 'object' && 'weekdaySchedule' in data && typeof (data as Record<string, unknown>).weekdaySchedule === 'object') {
    const d = data as Record<string, unknown>;
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const cleanedSchedule: Record<string, unknown> = {};
    Object.entries((d.weekdaySchedule as Record<string, unknown>) || {}).forEach(([day, time]) => {
      if (validDays.includes(day) && time && typeof time === 'object' && time !== null && 'hour' in time && 'minute' in time) {
        cleanedSchedule[day] = time;
      }
    });
    return { ...d, weekdaySchedule: Object.keys(cleanedSchedule).length > 0 ? cleanedSchedule : undefined };
  }
  return data;
}, z.object({
  weekdaySchedule: z
    .record(z.string(), timeSchema)
    .refine(
      (schedule) => {
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        return Object.keys(schedule).every(day => validDays.includes(day));
      },
      { message: 'Les jours de la semaine doivent être valides' }
    )
    .optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)'),
  brightness: z.number().int().min(0).max(100),
}));

export type UpdateDreamWakeupConfigInput = z.infer<typeof updateDreamWakeupConfigSchema>;

export const dreamWakeupConfigResponseSchema = z.object({
  weekdaySchedule: z.record(z.string(), timeSchema).optional(),
  colorR: z.number().int().min(0).max(255),
  colorG: z.number().int().min(0).max(255),
  colorB: z.number().int().min(0).max(255),
  brightness: z.number().int().min(0).max(100),
});

export type DreamWakeupConfigResponse = z.infer<typeof dreamWakeupConfigResponseSchema>;
