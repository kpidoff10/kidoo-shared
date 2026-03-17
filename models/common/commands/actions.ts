/**
 * Actions des commandes MQTT envoyées aux Kidoos (ESP32).
 * Utilisé côté serveur pour sendCommand / waitForMessage (logs) afin d'éviter les strings en dur.
 */

export enum KidooCommandAction {
  GetInfo = 'get-info',
  GetEnv = 'get-env',
  FirmwareUpdate = 'firmware-update',
}
