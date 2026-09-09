import { existsSync } from 'node:fs';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium, expect, test } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const extensionPath = path.resolve(__dirname, '..');
const testUrl = 'https://chatgpt.com/cipa-playwright-input';

function browserExecutablePath() {
  const override = process.env.CIPA_BROWSER_EXECUTABLE;
  return override && existsSync(override) ? override : undefined;
}

function chatgptFixture() {
  return `<!doctype html>
    <html lang="ko">
      <head>
        <meta charset="utf-8">
        <title>CIPA Playwright Input Fixture</title>
        <style>
          body { margin: 0; min-height: 100vh; font-family: sans-serif; background: #ffffff; }
          main { min-height: 100vh; display: grid; place-items: end center; padding: 24px; }
          form { width: min(760px, 90vw); }
          #prompt-textarea {
            display: block;
            width: 100%;
            min-height: 120px;
            padding: 16px;
            border: 1px solid #cbd5e1;
            border-radius: 10px;
            font-size: 16px;
            line-height: 1.5;
          }
        </style>
      </head>
      <body>
        <main>
          <form>
            <textarea id="prompt-textarea" aria-label="ChatGPT prompt input"></textarea>
          </form>
        </main>
      </body>
    </html>`;
}

for (const site of ['chatgpt', 'gemini']) {
test(`generates, revises, and inserts a prompt for ${site}`, async () => {
  const targetUrl = site === 'gemini' ? 'https://gemini.google.com/cipa-playwright-input' : testUrl;
  const userDataDir = await mkdtemp(path.join(os.tmpdir(), 'cipa-playwright-'));
  let context;

  try {
    const executablePath = browserExecutablePath();
    context = await chromium.launchPersistentContext(userDataDir, {
      executablePath,
      headless: false,
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-first-run',
        '--no-default-browser-check',
      ],
    });

    let externalApiRequested = false;
    await context.route('https://image-prompt.alluser.site/**', async (route) => {
      externalApiRequested = true;
      await route.abort();
    });
    await context.route(targetUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: site === 'gemini' ? chatgptFixture().replace('<textarea id="prompt-textarea" aria-label="ChatGPT prompt input"></textarea>', '<div contenteditable="true" role="textbox" aria-label="Gemini prompt input"></div>') : chatgptFixture(),
      });
    });

    const page = await context.newPage();
    await page.goto(targetUrl);

    await expect(page.locator('#cipa-root')).toBeAttached();

    const onboarding = page.locator('[data-action="onboarding"]');
    if (await onboarding.isVisible()) await onboarding.click();

    await page.locator('[data-action="style-toggle"]').click();
    const firstStyleSample = page.locator('.style-sample').first();
    await expect(firstStyleSample).toBeVisible();
    await expect(firstStyleSample).toHaveAttribute('src', /^chrome-extension:\/\//);
    await expect.poll(() => firstStyleSample.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);

    await page.locator('[data-field="idea"]').fill('초등학생용 물의 순환 설명 그림');
    await page.locator('[data-action="generate"]').click();

    const generatedPrompt = page.locator('[data-prompt]');
    await expect(generatedPrompt).toContainText(`Create an image prompt for ${site === 'gemini' ? 'Gemini' : 'ChatGPT'}.`);
    await expect(generatedPrompt).toContainText('do not generate an image');
    await expect(generatedPrompt).not.toContainText('Create the image described below');
    await expect(generatedPrompt).toContainText('초등학생용 물의 순환 설명 그림');
    expect(externalApiRequested).toBe(false);

    await expect(generatedPrompt).toContainText(site === 'gemini' ? 'coherent scene' : 'visual specification');
    await page.locator('[data-field="feedback"]').fill('배경을 연두색으로 바꿔줘');
    await page.locator('[data-action="improve-custom"]').click();
    await expect(generatedPrompt).toContainText('Requested revision: 배경을 연두색으로 바꿔줘');
    await page.locator('[data-action="insert"]').click();
    const input = page.locator(site === 'gemini' ? '[contenteditable="true"]' : '#prompt-textarea');
    if (site === 'gemini') await expect(input).toContainText('Requested revision: 배경을 연두색으로 바꿔줘');
    else await expect(input).toHaveValue(/Requested revision: 배경을 연두색으로 바꿔줘/);
    await page.screenshot({ path: test.info().outputPath(site + '.png'), fullPage: true });
  } finally {
    if (context) await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});

}
