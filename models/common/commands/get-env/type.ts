/**
 * Types de réponse get-env — capteur environnement (température, humidité, pression).
 * Commun à tous les modèles qui exposent un capteur env (ex. Dream avec AHT20+BMP280).
 */

export interface KidooEnvResponse {
  available: boolean;
  temperatureC?: number | null;
  humidityPercent?: number | null;
  pressurePa?: number | null;
  error?: string;
}
