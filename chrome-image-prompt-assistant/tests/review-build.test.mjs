import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import test from 'node:test';

async function readJson(path) {
  return JSON.parse(await readFile(new URL(path, import.meta.url), 'utf8'));
}

async function readText(path) {
  return readFile(new URL(path, import.meta.url), 'utf8');
}

test('review build keeps versions synchronized at 0.1.1', async () => {
  const manifest = await readJson('../manifest.json');
  const pkg = await readJson('../package.json');
  const runtime = await readText('../src/content-runtime.js');

  assert.equal(manifest.version, '0.1.1');
  assert.equal(pkg.version, '0.1.1');
  assert.match(runtime, /appVersion:\s*'0\.1\.1'/);
});

test('review build does not require the optional Prompt API host permission', async () => {
  const manifest = await readJson('../manifest.json');
  const requiredHosts = manifest.host_permissions || [];

  assert.deepEqual(requiredHosts, [
    'https://chatgpt.com/*',
    'https://chat.openai.com/*',
    'https://gemini.google.com/*',
  ]);
  assert.ok(!requiredHosts.includes('https://image-prompt.alluser.site/*'));
  assert.ok(!requiredHosts.includes('<all_urls>'));
  assert.deepEqual(manifest.optional_host_permissions, [
    'https://image-prompt.alluser.site/*',
  ]);
});

test('Prompt API remains disabled by default behind an explicit advanced setting', async () => {
  const runtime = await readText('../src/content-runtime.js');
  const options = await readText('../src/options.js');
  const welcome = await readText('../welcome.html');

  assert.match(runtime, /useExternalApi:\s*false/);
  assert.match(runtime, /if\s*\(\s*!settings\.useExternalApi\s*\)\s*return fallbackResponse\(input\);/);
  assert.match(runtime, /data-field="useExternalApi"/);

  assert.match(options, /useExternalApi:\s*false/);
  assert.match(options, /useExternalApi:\s*document\.getElementById\('useExternalApi'\)\.checked/);
  assert.match(welcome, /id="useExternalApi"/);
});

test('style thumbnails are packaged and rendered from extension URLs', async () => {
  const manifest = await readJson('../manifest.json');
  const runtime = await readText('../src/content-runtime.js');
  const styleSamples = await readdir(new URL('../assets/style-samples/', import.meta.url));
  const webpSamples = styleSamples.filter((name) => /^style-\d{2}\.webp$/.test(name)).sort();

  assert.equal(webpSamples.length, 49);
  assert.equal(webpSamples[0], 'style-01.webp');
  assert.equal(webpSamples.at(-1), 'style-49.webp');
  assert.match(runtime, /chrome\.runtime\.getURL\(styleSamplePath\(index\)\)/);
  assert.match(runtime, /<img class="style-sample" src="\$\{esc\(sampleUrl\)\}"/);
  assert.deepEqual(manifest.web_accessible_resources?.[0]?.resources, [
    'styles/panel.css',
    'assets/style-samples/*.webp',
  ]);
});
