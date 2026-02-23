/**
 * Utilitaires pour la manipulation des couleurs (modèle Dream).
 * Utilisés par bedtime et wakeup configs.
 */

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

export function saturateRgbToMax(rgb: { r: number; g: number; b: number }): { r: number; g: number; b: number } {
  const max = Math.max(rgb.r, rgb.g, rgb.b);
  if (max === 0) {
    return { r: 0, g: 0, b: 0 };
  }
  const factor = 255 / max;
  return {
    r: Math.round(rgb.r * factor),
    g: Math.round(rgb.g * factor),
    b: Math.round(rgb.b * factor),
  };
}
