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

test('generates a prompt and inserts it into a ChatGPT-like input', async () => {
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
    await context.route(testUrl, async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html; charset=utf-8',
        body: chatgptFixture(),
      });
    });

    const page = await context.newPage();
    await page.goto(testUrl);

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
    await expect(generatedPrompt).toContainText('Create an image prompt');
    await expect(generatedPrompt).toContainText('초등학생용 물의 순환 설명 그림');
    expect(externalApiRequested).toBe(false);

    await page.locator('[data-action="insert"]').click();
    await expect(page.locator('#prompt-textarea')).toHaveValue(/Create an image prompt/);
    await expect(page.locator('#prompt-textarea')).toHaveValue(/초등학생용 물의 순환 설명 그림/);
  } finally {
    if (context) await context.close();
    await rm(userDataDir, { recursive: true, force: true });
  }
});
