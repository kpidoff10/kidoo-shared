/**
 * Types MQTT stricts pour Kidoo
 * Garantit le typage complet des commandes et réponses MQTT
 */

// ─── Commandes envoyées par l'app vers l'ESP32 ───────────────────────────────

export type MqttCmdGetInfo = { action: 'get-info' };
export type MqttCmdGetEnv = { action: 'get-env' };
export type MqttCmdReboot = { action: 'reboot'; delay?: number };
export type MqttCmdBrightness = { action: 'brightness'; value: number };
export type MqttCmdSleepTimeout = { action: 'sleep-timeout'; value: number };
export type MqttCmdSleepMode = { action: 'sleep-mode-config'; enabled: boolean; timeout?: number };
export type MqttCmdTapSensor = { action: 'tap-sensor' };
export type MqttCmdSetTimezone = { action: 'set-timezone'; timezoneId: string };
export type MqttCmdFirmwareUpdate = { action: 'firmware-update'; version: string; url: string };

export type MqttCmdSetBedtimeConfig = {
  action: 'set-bedtime-config';
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
  allNight: boolean;
  effect?: string;
  weekdaySchedule?: number[];
};

export type MqttCmdSetWakeupConfig = {
  action: 'set-wakeup-config';
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
  weekdaySchedule?: number[];
  autoShutdown?: boolean;
  autoShutdownMinutes?: number;
};

export type MqttCmdSetDefaultConfig = {
  action: 'set-default-config';
  colorR: number;
  colorG: number;
  colorB: number;
  brightness: number;
  effect?: string;
};

export type MqttCmdSetNighttimeAlert = { action: 'set-nighttime-alert'; enabled: boolean };
export type MqttCmdNighttimeAlertAck = { action: 'nighttime-alert-ack' };

/**
 * Union type - garantit que seules les commandes valides sont publiées
 * TypeScript empêche à la compilation d'envoyer une commande invalide
 */
export type MqttCommand =
  | MqttCmdGetInfo
  | MqttCmdGetEnv
  | MqttCmdReboot
  | MqttCmdBrightness
  | MqttCmdSleepTimeout
  | MqttCmdSleepMode
  | MqttCmdTapSensor
  | MqttCmdSetTimezone
  | MqttCmdFirmwareUpdate
  | MqttCmdSetBedtimeConfig
  | MqttCmdSetWakeupConfig
  | MqttCmdSetDefaultConfig
  | MqttCmdSetNighttimeAlert
  | MqttCmdNighttimeAlertAck;

// ─── Messages reçus de l'ESP32 (telemetry) ───────────────────────────────────

export type MqttTelemetryStorage = {
  total: number;
  free: number;
  used: number;
};

/**
 * Message type:info - infos générales du device
 * Contient aussi des données Dream optionnelles (ip, uptime, env, etc.)
 */
export type MqttTelemetryInfo = {
  type: 'info';
  device: string;
  mac: string;
  model: string;
  firmwareVersion: string;
  brightness: number;
  storage?: MqttTelemetryStorage;
  // Dream uniquement
  ip?: string;
  uptime?: number;
  freeHeap?: number;
  deviceState?: 'idle' | 'bedtime' | 'wakeup' | 'manual';
  wifi?: { ssid: string; rssi: number };
  env?: {
    available: boolean;
    temperatureC?: number;
    humidityPercent?: number;
    pressurePa?: number;
  };
  nfc?: { available: boolean };
};

/**
 * Message type:env - données d'environnement (température, humidité, pression)
 */
export type MqttTelemetryEnv = {
  type: 'env';
  available: boolean;
  temperatureC?: number;
  humidityPercent?: number;
  pressurePa?: number;
  error?: string;
};

/**
 * Message type:status - status online/offline (heartbeat)
 */
export type MqttTelemetryStatus = {
  status: 'online' | 'offline';
  device: string;
  timestamp: number;
};

/**
 * Union type - tous les messages possibles reçus de l'ESP32
 */
export type MqttTelemetryMessage = MqttTelemetryInfo | MqttTelemetryEnv | MqttTelemetryStatus;
