import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const extensionDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectDir = path.resolve(extensionDir, '..');
const releaseDir = path.join(projectDir, 'release');
const stageDir = path.join(extensionDir, '.zip-stage');

const extensionFiles = [
  'manifest.json',
  'src',
  'styles',
  'assets',
  'install.html',
  'welcome.html',
  'README.md',
];

const zipNames = [
  'chrome-image-prompt-assistant.zip',
];

const sourceOnlyFiles = [
  'assets/icons/icon-source.png',
];

function psQuote(value) {
  return `'${value.replaceAll("'", "''")}'`;
}

async function stageExtensionFiles() {
  await rm(stageDir, { recursive: true, force: true });
  await mkdir(stageDir, { recursive: true });

  for (const file of extensionFiles) {
    const source = path.join(extensionDir, file);
    if (!existsSync(source)) {
      throw new Error(`Missing build input: ${file}`);
    }

    await cp(source, path.join(stageDir, file), { recursive: true });
  }

  for (const file of sourceOnlyFiles) {
    await rm(path.join(stageDir, file), { force: true });
  }
}

function compressZip(destination) {
  const command = [
    `Compress-Archive`,
    `-Path ${psQuote(path.join(stageDir, '*'))}`,
    `-DestinationPath ${psQuote(destination)}`,
    `-Force`,
  ].join(' ');

  const result = spawnSync(
    'powershell.exe',
    ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', command],
    { encoding: 'utf8' }
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `Failed to create ${destination}`);
  }
}

await stageExtensionFiles();
await mkdir(releaseDir, { recursive: true });

try {
  for (const zipName of zipNames) {
    const destination = path.join(releaseDir, zipName);
    await rm(destination, { force: true });
    compressZip(destination);
    console.log(`Created ${path.relative(projectDir, destination)}`);
  }
} finally {
  await rm(stageDir, { recursive: true, force: true });
}
