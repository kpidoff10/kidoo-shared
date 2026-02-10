/**
 * Point d'entrée client (React Native / Expo / navigateur).
 * Réexporte tout le shared SAUF les modules qui dépendent de Prisma (Node.js),
 * pour éviter "node:buffer" et autres APIs Node dans le runtime natif.
 *
 * Ne pas exporter: ./characters/schema (dépend de ../prisma).
 */

export * from './types/common';
export * from './auth/schema';
export * from './auth/type';
export * from './kidoos/schemas';
export * from './kidoos/config/brightness';
export * from './kidoos/config/sleep-timeout';
export * from './kidoos/config/sleep-mode';
export * from './kidoos/config/name';
export * from './kidoos/config/dream-bedtime';
export * from './kidoos/config/dream-wakeup';
export * from './kidoos/commands/get-info';
export * from './kidoos/commands/reboot';
export * from './kidoos/commands/firmware-update';
export * from './firmware/models';
export * from './firmware/schema';
// Characters (Prisma) exclu volontairement pour le client
