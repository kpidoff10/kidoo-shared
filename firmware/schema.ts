import { z } from 'zod';
import { KIDOO_MODEL_IDS } from './models';

export const createFirmwareSchema = z.object({
  model: z.enum(KIDOO_MODEL_IDS),
  version: z.string().min(1, 'Version requise').regex(/^[\d.]+(-[a-zA-Z0-9.]+)?$/, 'Format version invalide (ex: 1.0.0 ou 1.0.0-beta)'),
  url: z.string().url(),
  path: z.string().min(1),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  changelog: z.string().max(10000).optional(),
});

export type CreateFirmwareInput = z.infer<typeof createFirmwareSchema>;
