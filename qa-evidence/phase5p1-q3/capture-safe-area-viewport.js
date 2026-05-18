const { chromium, expect } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    baseURL: 'http://127.0.0.1:4175',
  });
  const page = await context.newPage();
  await page.goto('/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook');
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  await page.screenshot({ path: 'qa-evidence/phase5p1-q3/screenshots/04b-ep6-drawer-viewport-safe-area.png', fullPage: false });
  await browser.close();
  console.log('/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/04b-ep6-drawer-viewport-safe-area.png');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
