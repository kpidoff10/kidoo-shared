/**
 * Génère le fichier constants.h pour l'ESP32 (modèle Gotchi) à partir des données
 * emotions de kidoo-shared. Source de vérité : EATING_VARIANTS + TRIGGER_EFFECTS (constants.ts).
 *
 * Usage: npx tsx scripts/generate-esp32-constants.ts [--output path/to/constants.h]
 */

import * as fs from 'fs';
import * as path from 'path';
import { EATING_VARIANTS } from '../models/gotchi/food';
import { TRIGGER_EFFECTS } from '../models/gotchi/emotions/constants';

/** Racine du package (script lancé depuis kidoo-shared). */
const packageRoot = process.cwd();

/** Entrées pour la table TRIGGER_STAT_EFFECTS (source : constants.ts). */
const triggerEffectEntries = Object.entries(TRIGGER_EFFECTS);

/** Variants 1-4 avec effet progressif (exclut variant 0 "Any"). */
const foodEffects = EATING_VARIANTS.filter(
  (v): v is typeof v & { itemId: string; tickHunger: number; tickHappiness: number; tickHealth: number; tickIntervalMs: number; totalTicks: number } =>
    v.value >= 1 && 'itemId' in v && v.itemId != null && v.tickHunger != null
);

/** Nom de la clé NFC pour l'item (compat avec ancien .h : cake -> SNACK). */
function nfcKeyName(itemId: string): string {
  const upper = itemId.toUpperCase();
  if (itemId === 'cake') return 'NFC_KEY_SNACK';
  return `NFC_KEY_${upper}`;
}

function generateHeader(): string {
  const lines: string[] = [
    '#ifndef MODEL_GOTCHI_CONSTANTS_H',
    '#define MODEL_GOTCHI_CONSTANTS_H',
    '',
    '/**',
    ' * Constantes pour le modèle Kidoo Gotchi',
    ' *',
    ' * Fichier généré par kidoo-shared/scripts/generate-esp32-constants.ts',
    ' * Ne pas éditer à la main. Source : models/gotchi/food (EATING_VARIANTS), models/gotchi/emotions/constants (TRIGGER_EFFECTS).',
    ' */',
    '',
    '// ============================================',
    '// NFC Keys - Simulation keys for testing',
    '// ============================================',
    '',
    '// --- Food items ---',
  ];

  for (const v of foodEffects) {
    const key = nfcKeyName(v.itemId);
    const val = v.itemId === 'cake' ? 'SNACK' : v.itemId.toUpperCase();
    lines.push(`#define ${key} "${val}"`);
  }

  lines.push(
    '',
    '// --- Hygiene items (future) ---',
    '#define NFC_KEY_TOOTHBRUSH "BRUSH"',
    '#define NFC_KEY_SOAP "SOAP"',
    '',
    '// --- Sleep items (future) ---',
    '#define NFC_KEY_BED "BED"',
    '',
    '// ============================================',
    '// NFC Key Mapping Structure',
    '// ============================================',
    '',
    'struct NFCKeyMapping {',
    '  const char* key;      // Clé NFC (affichage / fallback texte)',
    '  const char* itemId;   // ID de l\'objet (correspond aux NFC_ITEM_* dans config.h)',
    '  const char* name;     // Nom lisible de l\'objet',
    '  uint8_t variant;      // Code écrit sur le tag (1-4) pour reconnaissance fiable sans corruption',
    '};',
    '',
    '// Table de mapping des clés NFC vers les objets',
    'static const NFCKeyMapping NFC_KEY_TABLE[] = {'
  );

  for (const v of foodEffects) {
    const key = nfcKeyName(v.itemId);
    const name = (v.label || v.itemId).replace(/"/g, '\\"');
    lines.push(`  {${key}, "${v.itemId}", "${name}", ${v.value}},`);
  }

  lines.push(
    '  // Future items (commented out until implemented)',
    '  // {NFC_KEY_TOOTHBRUSH, "toothbrush", "Toothbrush", 0},',
    '  // {NFC_KEY_SOAP, "soap", "Soap", 0},',
    '  // {NFC_KEY_BED, "bed", "Bed", 0},',
    '};',
    '',
    '#define NFC_KEY_TABLE_SIZE (sizeof(NFC_KEY_TABLE) / sizeof(NFCKeyMapping))',
    '',
    '// ============================================',
    '// Progressive Effect Structure',
    '// ============================================',
    '',
    'struct ProgressiveFoodEffect {',
    '  const char* itemId;           // ID de l\'item (bottle, cake, apple, candy)',
    '  uint8_t tickHunger;           // Hunger donné par tick',
    '  uint8_t tickHappiness;        // Happiness donné par tick',
    '  uint8_t tickHealth;           // Health donné par tick',
    '  unsigned long tickInterval;   // Intervalle entre chaque tick (ms)',
    '  uint8_t totalTicks;           // Nombre total de ticks',
    '};',
    '',
    '// Ordre des entrées = ordre des variants (1, 2, 3, 4) dans EATING_VARIANTS',
    'static const ProgressiveFoodEffect PROGRESSIVE_FOOD_EFFECTS[] = {'
  );

  for (const v of foodEffects) {
    const th = v.tickHunger;
    const thap = v.tickHappiness ?? 0;
    const thea = v.tickHealth ?? 0;
    const interval = v.tickIntervalMs;
    const total = v.totalTicks ?? 0;
    lines.push(
      `  { "${v.itemId}", ${th}, ${thap}, ${thea}, ${interval}UL, ${total} },`
    );
  }

  lines.push(
    '};',
    '',
    '#define PROGRESSIVE_FOOD_EFFECTS_SIZE (sizeof(PROGRESSIVE_FOOD_EFFECTS) / sizeof(ProgressiveFoodEffect))',
    ''
  );

  // ----- Trigger action effects (source : TRIGGER_EFFECTS dans constants.ts) -----
  if (triggerEffectEntries.length > 0) {
    lines.push(
      '// ============================================',
      '// Trigger stat effects (instant: hunger, happiness, health, fatigue, hygiene)',
      '// ============================================',
      '',
      'struct TriggerStatEffect {',
      '  int8_t hunger;',
      '  int8_t happiness;',
      '  int8_t health;',
      '  int8_t fatigue;',
      '  int8_t hygiene;',
      '};',
      '',
      'static const struct { const char* triggerId; struct TriggerStatEffect effect; } TRIGGER_STAT_EFFECTS[] = {'
    );
    for (const [triggerId, e] of triggerEffectEntries) {
      const hunger = e.hunger ?? 0;
      const happiness = e.happiness ?? 0;
      const health = e.health ?? 0;
      const fatigue = e.fatigue ?? 0;
      const hygiene = e.hygiene ?? 0;
      lines.push(`  { "${triggerId}", { ${hunger}, ${happiness}, ${health}, ${fatigue}, ${hygiene} } },`);
    }
    lines.push(
      '};',
      '',
      `#define TRIGGER_STAT_EFFECTS_SIZE ${triggerEffectEntries.length}`,
      ''
    );
  }

  lines.push('#endif // MODEL_GOTCHI_CONSTANTS_H', '');

  return lines.join('\n');
}

function main() {
  const args = process.argv.slice(2);
  let outPath: string;
  const outIdx = args.indexOf('--output');
  if (outIdx >= 0 && args[outIdx + 1]) {
    outPath = path.resolve(process.cwd(), args[outIdx + 1]);
  } else {
    // Par défaut : kidoo-esp32 (sibling du workspace) ou cwd
    outPath = path.resolve(packageRoot, '..', 'kidoo-esp32', 'src', 'models', 'gotchi', 'config', 'constants.h');
  }

  const content = generateHeader();
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    console.error(`Répertoire cible absent: ${dir}. Utilisez --output <fichier>.`);
    process.exit(1);
  }
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Écrit: ${outPath}`);
}

main();
