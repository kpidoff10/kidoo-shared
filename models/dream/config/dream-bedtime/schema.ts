/**
 * Schéma pour la configuration de l'heure de coucher du modèle Dream
 */

import { z } from 'zod';
import { hexToRgb, saturateRgbToMax } from '../color-utils';

export { hexToRgb, saturateRgbToMax };

export const BEDTIME_LIMITS = {
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

export const BEDTIME_EFFECTS = ['none', 'pulse', 'rainbow-soft', 'breathe', 'nightlight'] as const;
export type BedtimeEffect = (typeof BEDTIME_EFFECTS)[number];

export const updateDreamBedtimeConfigSchema = z.preprocess((data: unknown) => {
  if (data && typeof data === 'object' && 'weekdaySchedule' in data && typeof (data as any).weekdaySchedule === 'object') {
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
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'La couleur doit être au format hexadécimal (#RRGGBB)').optional(),
  effect: z.enum(BEDTIME_EFFECTS as unknown as [string, ...string[]]).optional(),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
}).refine(
  (data) => !!(data.color || data.effect),
  { message: 'Vous devez spécifier soit une couleur (color) soit un effet (effect)' }
));

export type UpdateDreamBedtimeConfigInput = z.infer<typeof updateDreamBedtimeConfigSchema>;

export const dreamBedtimeConfigResponseSchema = z.object({
  weekdaySchedule: z.record(z.string(), timeSchema).optional(),
  colorR: z.number().int().min(0).max(255),
  colorG: z.number().int().min(0).max(255),
  colorB: z.number().int().min(0).max(255),
  brightness: z.number().int().min(0).max(100),
  nightlightAllNight: z.boolean(),
  effect: z.enum(BEDTIME_EFFECTS as unknown as [string, ...string[]]).nullable().optional(),
});

export type DreamBedtimeConfigResponse = z.infer<typeof dreamBedtimeConfigResponseSchema>;
