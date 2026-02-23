/**
 * Config persistante utilisée par le modèle Gotchi (réexport depuis common/config).
 * Source de vérité : common/config. Ce module permet d'importer tout le Gotchi depuis @kidoo/shared/models/gotchi.
 *
 * Configs : brightness, sleep-timeout, sleep-mode, name.
 * (dream-bedtime / dream-wakeup = modèle Dream, voir models/dream/config.)
 */

export * from '../../common/config/brightness';
export * from '../../common/config/sleep-timeout';
export * from '../../common/config/sleep-mode';
export * from '../../common/config/name';
