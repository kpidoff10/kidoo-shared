/**
 * Crée l'architecture models/<id>/ (config, commands) pour tout modèle
 * présent dans le registre mais sans dossier models/ existant.
 *
 * Usage: npm run generate:scaffold-models
 * ou: npx tsx scripts/scaffold-model.ts
 *
 * À lancer après avoir ajouté un nouveau modèle dans firmware/modelRegistry.ts.
 */

import * as fs from 'fs';
import * as path from 'path';
import { KIDOO_MODEL_IDS } from '../firmware/modelRegistry';

const packageRoot = process.cwd();
const modelsDir = path.join(packageRoot, 'models');

function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  Créé: ${path.relative(packageRoot, dir)}/`);
  }
}

function writeIfMissing(filePath: string, content: string, label: string): boolean {
  if (fs.existsSync(filePath)) return false;
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Créé: ${path.relative(packageRoot, filePath)}`);
  return true;
}

function scaffoldModel(id: string): boolean {
  const modelDir = path.join(modelsDir, id);
  const indexPath = path.join(modelDir, 'index.ts');
  if (fs.existsSync(indexPath)) {
    return false; // déjà scaffoldé
  }

  const modelName = id.charAt(0).toUpperCase() + id.slice(1);
  // Depuis models/<id>/config ou commands : ../../common pour atteindre models/common
  const relCommon = '../../common';

  const indexContent = `/**
 * Module ${modelName} — config et commandes pour le modèle ${modelName}.
 * Import explicite : @kidoo/shared/models/${id}
 */

export * from './config';
export * from './commands';
`;

  const configContent = `/**
 * Config persistante pour le modèle ${modelName} (réexport depuis models/common/config).
 * Adapter selon les besoins du modèle (ex. config spécifique comme dream-bedtime pour Dream).
 */

export * from '${relCommon}/config/brightness';
export * from '${relCommon}/config/sleep-timeout';
export * from '${relCommon}/config/sleep-mode';
export * from '${relCommon}/config/name';
`;

  const commandsContent = `/**
 * Commandes ESP pour le modèle ${modelName} (réexport depuis models/common/commands).
 */

export * from '${relCommon}/commands/get-info';
export * from '${relCommon}/commands/reboot';
export * from '${relCommon}/commands/firmware-update';
`;

  console.log(`Scaffold modèle: ${id}`);
  writeIfMissing(indexPath, indexContent, 'index');
  writeIfMissing(path.join(modelDir, 'config', 'index.ts'), configContent, 'config');
  writeIfMissing(path.join(modelDir, 'commands', 'index.ts'), commandsContent, 'commands');
  return true;
}

function addPackageExport(id: string): boolean {
  const pkgPath = path.join(packageRoot, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const key = `./models/${id}`;
  if (pkg.exports[key]) return false;
  pkg.exports[key] = {
    types: `./models/${id}/index.ts`,
    default: `./models/${id}/index.ts`,
  };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
  console.log(`  Ajouté export: "${key}" dans package.json`);
  return true;
}

function main(): void {
  console.log('Registre des modèles:', KIDOO_MODEL_IDS.join(', '));
  let scaffolded = 0;
  for (const id of KIDOO_MODEL_IDS) {
    const created = scaffoldModel(id);
    if (created) {
      scaffolded++;
      addPackageExport(id);
    }
  }
  if (scaffolded === 0) {
    console.log('Aucun nouveau modèle à scaffold (tous ont déjà models/<id>/).');
  } else {
    console.log(`\n${scaffolded} modèle(s) scaffoldé(s). Pensez à adapter config/ ou ajouter des dossiers spécifiques (emotions, food, etc.).`);
  }
}

main();
