import { z } from 'zod';
import { CharacterSex, CharacterPersonality } from '../prisma';

/**
 * Schemas for Character CRUD.
 * Enums come from Prisma so they stay in sync with the database.
 */

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(200).optional().nullable(),
  defaultImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  sex: z.nativeEnum(CharacterSex),
  personality: z.nativeEnum(CharacterPersonality),
});

export const updateCharacterSchema = z.object({
  name: z.string().min(1).max(200).optional().nullable(),
  defaultImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  sex: z.nativeEnum(CharacterSex).optional(),
  personality: z.nativeEnum(CharacterPersonality).optional(),
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
