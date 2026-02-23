/**
 * Génère un header C++ (model_ids.h) pour l'ESP32 à partir du registre des modèles
 * dans kidoo-shared. Source de vérité : firmware/modelRegistry.ts.
 *
 * Usage: npx tsx scripts/generate-esp32-model-ids.ts [--output path/to/model_ids.h]
 */

import * as fs from 'fs';
import * as path from 'path';
import { KIDOO_MODEL_IDS } from '../firmware/modelRegistry';

/** Racine du package (script lancé depuis kidoo-shared). */
const packageRoot = process.cwd();

function generateHeader(): string {
  const lines: string[] = [
    '#ifndef KIDOO_MODEL_IDS_H',
    '#define KIDOO_MODEL_IDS_H',
    '',
    '/**',
    ' * IDs des modèles Kidoo (enum + constantes).',
    ' *',
    ' * Généré par kidoo-shared/scripts/generate-esp32-model-ids.ts',
    ' * Ne pas éditer à la main. Source : firmware/modelRegistry.ts',
    ' */',
    '',
    'enum KidooModelId {',
  ];

  for (let i = 0; i < KIDOO_MODEL_IDS.length; i++) {
    const id = KIDOO_MODEL_IDS[i];
    const name = id.toUpperCase();
    const comma = i < KIDOO_MODEL_IDS.length - 1 ? ',' : '';
    lines.push(`  KIDOO_MODEL_${name}${comma}`);
  }

  lines.push(
    '};',
    '',
    '// Nombre de modèles',
    `#define KIDOO_MODEL_COUNT ${KIDOO_MODEL_IDS.length}`,
    '',
    '#endif // KIDOO_MODEL_IDS_H',
    ''
  );

  return lines.join('\n');
}

function main(): void {
  const args = process.argv.slice(2);
  let outPath: string;
  const outIdx = args.indexOf('--output');
  if (outIdx >= 0 && args[outIdx + 1]) {
    outPath = path.resolve(process.cwd(), args[outIdx + 1]);
  } else {
    outPath = path.resolve(
      packageRoot,
      '..',
      'kidoo-esp32',
      'src',
      'models',
      'model_ids.h'
    );
  }

  const content = generateHeader();
  const dir = path.dirname(outPath);
  if (!fs.existsSync(dir)) {
    console.error(`Répertoire cible absent: ${dir}. Utilisez --output <fichier>.`);
    process.exit(1);
  }
  fs.writeFileSync(outPath, content, 'utf8');
  console.log(`Écrit: ${outPath} (${KIDOO_MODEL_IDS.length} modèle(s): ${KIDOO_MODEL_IDS.join(', ')})`);
}

main();
