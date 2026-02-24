/**
 * Exports principaux du module shared
 * Utilisé pour les imports directs depuis '@/shared'
 */

// Types communs (doit être exporté en premier pour éviter les conflits)
export * from './types/common';

// Auth
export * from './auth/schema';
export * from './auth/type';

// Common - CRUD schemas
export * from './models/common/schemas';

// Common - Config (persistant)
export * from './models/common/config/brightness';
export * from './models/common/config/sleep-timeout';
export * from './models/common/config/sleep-mode';
export * from './models/common/config/name';
// dream-bedtime / dream-wakeup
export * from './models/dream';

// Common - Commands (temps réel)
export * from './models/common/commands/actions';
export * from './models/common/commands/get-info';
export * from './models/common/commands/get-env';
export * from './models/common/commands/reboot';
export * from './models/common/commands/firmware-update';// Firmware - Modèles supportés
export * from './firmware/models';
export * from './firmware/schema';
// Characters Gotchi : import explicite via @kidoo/shared/models/gotchi// Emotions – déclencheurs automatiques (alignés avec l’ESP32)
// Gotchi (characters + emotions) — utilisé côté serveur uniquement (dépend de Prisma)
export * from './models/gotchi';

// Notifications - Types partagés
export * from './models/notifications';