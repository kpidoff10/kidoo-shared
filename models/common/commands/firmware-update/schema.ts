/**
 * Schéma pour la commande firmware-update
 * Version cible du firmware (ex: "1.0.1")
 */

import { z } from 'zod';

// Version semver simple : au moins un caractère, format libre (ex: 1.0.0, 1.0.1)
export const firmwareUpdateCommandSchema = z.object({
  version: z.string().min(1, 'La version est requise'),
});

export type FirmwareUpdateCommandInput = z.infer<typeof firmwareUpdateCommandSchema>;
