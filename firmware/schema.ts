import { z } from 'zod';
import { KIDOO_MODELS } from './models';

const kidooModelIds = KIDOO_MODELS.map((m) => m.id) as [string, ...string[]];

export const createFirmwareSchema = z.object({
  model: z.enum(kidooModelIds),
  version: z.string().min(1, 'Version requise').regex(/^[\d.]+(-[a-zA-Z0-9.]+)?$/, 'Format version invalide (ex: 1.0.0 ou 1.0.0-beta)'),
  url: z.string().url(),
  path: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
});

export type CreateFirmwareInput = z.infer<typeof createFirmwareSchema>;
