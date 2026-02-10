import { z } from 'zod';
import { CharacterSex, CharacterPersonality } from '../prisma';

/**
 * Schemas for Character CRUD.
 * Enums come from Prisma so they stay in sync with the database.
 */

export const createCharacterSchema = z.object({
  name: z.string().min(1).max(200).optional().nullable(),
  defaultImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  characterContext: z.string().max(2000).optional().nullable(),
  sex: z.nativeEnum(CharacterSex),
  personality: z.nativeEnum(CharacterPersonality),
  imageWidth: z.number().int().min(1).max(4096).optional(),
  imageHeight: z.number().int().min(1).max(4096).optional(),
});

export const updateCharacterSchema = z.object({
  name: z.string().min(1).max(200).optional().nullable(),
  defaultImageUrl: z.string().url().optional().nullable().or(z.literal('')),
  characterContext: z.string().max(2000).optional().nullable(),
  sex: z.nativeEnum(CharacterSex).optional(),
  personality: z.nativeEnum(CharacterPersonality).optional(),
  imageWidth: z.number().int().min(1).max(4096).optional(),
  imageHeight: z.number().int().min(1).max(4096).optional(),
});

export type CreateCharacterInput = z.infer<typeof createCharacterSchema>;
export type UpdateCharacterInput = z.infer<typeof updateCharacterSchema>;
