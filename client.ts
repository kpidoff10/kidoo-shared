/**
 * Point d'entrée client (React Native / Expo / navigateur).
 * Réexporte tout le shared SAUF les modules qui dépendent de Prisma (Node.js),
 * pour éviter "node:buffer" et autres APIs Node dans le runtime natif.
 *
 * Ne pas exporter: ./models/gotchi (emotions + characters ; characters dépend de prisma).
 */

export * from './types/common';
export * from './auth/schema';
export * from './auth/type';
export * from './models/common/schemas';
export * from './models/common/config/brightness';
export * from './models/common/config/sleep-timeout';
export * from './models/common/config/sleep-mode';
export * from './models/common/config/name';
// dream-bedtime / dream-wakeup (color-utils n'a pas de dépendance Prisma)
export * from './models/dream';
export * from './models/common/commands/actions';
export * from './models/common/commands/get-info';
export * from './models/common/commands/reboot';
export * from './models/common/commands/firmware-update';
export * from './firmware/models';
export * from './firmware/schema';
// Characters (Prisma) exclu volontairement pour le client
