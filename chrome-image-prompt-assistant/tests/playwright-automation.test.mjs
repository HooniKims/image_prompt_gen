import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(path, import.meta.url), 'utf8');
}

test('Playwright input automation is wired for the extension review flow', async () => {
  const pkg = await readJson('../package.json');
  const config = await readText('../playwright.config.mjs');
  const spec = await readText('./extension-input.spec.mjs');

  assert.equal(pkg.scripts['test:e2e'], 'playwright test');
  assert.equal(pkg.scripts['install:playwright'], 'playwright install chromium');
  assert.equal(pkg.devDependencies?.['@playwright/test'], '^1.61.1');
  assert.match(config, /testDir:\s*'\.\/tests'/);
  assert.match(spec, /launchPersistentContext/);
  assert.match(spec, /--load-extension=/);
  assert.match(spec, /https:\/\/chatgpt\.com\/cipa-playwright-input/);
  assert.match(spec, /data-field="idea"/);
  assert.match(spec, /data-action="insert"/);
});
