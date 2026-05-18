const { chromium, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:4175';
const outDir = path.resolve(__dirname);
const screenshotsDir = path.join(outDir, 'screenshots');
fs.mkdirSync(screenshotsDir, { recursive: true });

const showId = 'midnight-lantern-oath';
const source = 'facebook';
const freeEpisodes = 5;
const firstLocked = 6;
const bannedRouteFragments = ['/api/', '/login', '/auth', '/payment', '/payments', '/subscription', '/entitlement', '/facebook', '/meta', '/video', '/backend', '/database'];
const bannedExternalHosts = ['facebook', 'fbcdn', 'connect.facebook.net', 'graph.facebook.com', 'google-analytics', 'googletagmanager', 'segment', 'amplitude', 'mixpanel', 'posthog', 'stripe', 'paypal', 'supabase', 'firebase', 'auth0', 'mux', 'vimeo', 'youtube'];
const preLockForbiddenCopy = /\b(balance|wallet|coins?|recharge|story\s*pass|subscription|login|log\s*in|sign\s*in|payment|checkout|card|top\s*up|get\s*coins)\b/i;

async function screenshot(page, name) {
  const filePath = path.join(screenshotsDir, name);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

async function visibleText(locator) {
  if ((await locator.count()) === 0) return '';
  return (await locator.first().textContent()) || '';
}

async function expectNoPreLockMonetization(page, label) {
  const headerText = await visibleText(page.locator('header'));
  const playbackText = await visibleText(page.locator('[data-testid="vertical-playback-placeholder"]'));
  const navText = await visibleText(page.locator('nav[aria-label="Watch page quick entries"]'));
  const completeCtaText = await visibleText(page.locator('[data-testid="continue-next-episode"]'));
  for (const [scope, text] of [
    ['header', headerText],
    ['playback', playbackText],
    ['watch nav/body quick entries', navText],
    ['episode-complete CTA', completeCtaText],
  ]) {
    if (preLockForbiddenCopy.test(text)) {
      throw new Error(`${label}: pre-lock monetization copy found in ${scope}: ${text}`);
    }
  }
}

async function expectWatchContext(page, episode, unlocked) {
  await expect(page).toHaveURL(new RegExp(`/variant-b/watch/${showId}\\?`));
  await expect(page).toHaveURL(new RegExp(`episode=${episode}`));
  await expect(page).toHaveURL(/source=facebook/);
  await expect(page.locator('[data-testid="variant-b-home"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="current-episode"]')).toContainText(`EP ${episode}`);
  await expect(page.locator('[data-testid="watch-attribution-source"]')).toContainText(source);
  await expect(page.locator('[data-testid="watch-unlocked-flag"]')).toContainText(unlocked ? 'yes' : 'no');
}

async function assertNoHardStopRequests(page, blockedRequests) {
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => link.href));
  for (const href of hrefs) {
    const parsed = new URL(href);
    const pathAndSearch = `${parsed.pathname}${parsed.search}`.toLowerCase();
    for (const fragment of bannedRouteFragments) {
      if (pathAndSearch.includes(fragment)) throw new Error(`Unexpected hard-stop route href: ${href}`);
    }
  }
  if (blockedRequests.length) throw new Error(`Unexpected hard-stop requests: ${JSON.stringify(blockedRequests, null, 2)}`);
}

async function completeEpisode(page, episode) {
  await expectWatchContext(page, episode, false);
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('free');
  await expectNoPreLockMonetization(page, `EP${episode}`);
  await page.locator('[data-testid="complete-episode-button"]').click();
  await expect(page.locator('[data-testid="continue-next-episode"]')).toContainText(`Continue to EP ${episode + 1}`);
  await expectNoPreLockMonetization(page, `EP${episode} complete`);
  await page.locator('[data-testid="continue-next-episode"]').click();
}

(async () => {
  const blockedRequests = [];
  const consoleMessages = [];
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, baseURL });
  const page = await context.newPage();
  page.on('console', (msg) => {
    if (['error', 'warning'].includes(msg.type())) consoleMessages.push({ type: msg.type(), text: msg.text() });
  });
  page.on('pageerror', (error) => consoleMessages.push({ type: 'pageerror', text: error.message }));
  await page.route('**/*', async (route) => {
    const url = new URL(route.request().url());
    const pathAndSearch = `${url.pathname}${url.search}`.toLowerCase();
    const host = url.hostname.toLowerCase();
    const isLocal = ['127.0.0.1', 'localhost'].includes(host);
    const shouldBlock = bannedRouteFragments.some((fragment) => pathAndSearch.includes(fragment)) || (!isLocal && bannedExternalHosts.some((fragment) => host.includes(fragment)));
    if (shouldBlock) {
      blockedRequests.push(route.request().url());
      return route.abort();
    }
    return route.continue();
  });

  const evidence = [];
  await page.goto(`/variant-b/watch/${showId}?episode=1&source=${source}`);
  await expect(page.locator('[data-testid="variant-b-watch"]')).toBeVisible();
  await expectWatchContext(page, 1, false);
  await expectNoPreLockMonetization(page, 'EP1 landing');
  evidence.push({ name: 'EP1 free landing no pre-lock monetization', path: await screenshot(page, '01-ep1-free-no-prelock-balance.png') });

  await page.locator('[data-testid="episode-list-entry"]').click();
  await expect(page.locator('[data-testid="episode-sheet"]')).toBeVisible();
  const sheetHeader = page.locator('[data-testid="episode-sheet"] > div').nth(1);
  if (preLockForbiddenCopy.test(await visibleText(sheetHeader))) throw new Error(`Episode Sheet header has pre-lock monetization copy: ${await visibleText(sheetHeader)}`);
  await expect(page.locator('[data-testid="episode-sheet-ep-1"]')).toContainText('Free preview');
  await expect(page.locator('[data-testid="episode-sheet-ep-5"]')).toContainText('Free preview');
  await expect(page.locator('[data-testid="episode-sheet-ep-6"]')).toContainText('36 coins');
  evidence.push({ name: 'EP1 Episode Sheet header clean and locked-row cost helper preserved', path: await screenshot(page, '02-ep1-episode-sheet-cost-helper.png') });
  await page.locator('[data-testid="episode-sheet"] button', { hasText: 'Close' }).click();

  for (let episode = 1; episode <= freeEpisodes; episode += 1) {
    if (episode === freeEpisodes) evidence.push({ name: 'EP5 last free episode no pre-lock monetization', path: await screenshot(page, '03-ep5-last-free-no-prelock-balance.png') });
    await completeEpisode(page, episode);
  }

  await expectWatchContext(page, firstLocked, false);
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('locked');
  await expect(page.locator('[data-testid="locked-boundary-placeholder"]')).toContainText('Locked boundary');
  await expect(page.locator('[data-testid="locked-boundary-placeholder"]')).not.toContainText(/error|network|failed/i);
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  await expect(page.locator('[data-testid="unlock-drawer-balance"]')).toContainText('Drawer mock balance');
  await expect(page.locator('[data-testid="unlock-drawer-balance"]')).toContainText('80 coins');
  await expect(page.locator('[data-testid="unlock-drawer-cost"]')).toContainText('Drawer mock cost');
  await expect(page.locator('[data-testid="unlock-drawer-cost"]')).toContainText('36 coins');
  await expect(page.locator('[data-testid="mock-unlock-episode-link"]')).toContainText('Unlock EP 6');
  await expect(page.locator('[data-testid="story-pass-secondary-link"]')).toContainText('Get Story Pass');
  await expect(page.locator('[data-testid="unlock-drawer-maybe-later"]')).toContainText('Maybe later');
  evidence.push({ name: 'EP6 first locked drawer with fake drawer-only balance/cost and CTA hierarchy', path: await screenshot(page, '04-ep6-first-lock-drawer-fake-balance-cost.png') });

  await page.locator('[data-testid="unlock-drawer-maybe-later"]').click();
  await expect(page.locator('[data-testid="unlock-drawer"]')).toHaveCount(0);
  await expectWatchContext(page, firstLocked, false);
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('locked');
  evidence.push({ name: 'EP6 drawer close stays same locked episode', path: await screenshot(page, '05-ep6-drawer-closed-same-locked-episode.png') });
  await page.locator('[data-testid="locked-playback-reopen-drawer"]').click();
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  evidence.push({ name: 'EP6 locked playback tap reopens drawer', path: await screenshot(page, '06-ep6-reopened-from-locked-playback.png') });

  const unlockHref = await page.locator('[data-testid="mock-unlock-episode-link"]').getAttribute('href');
  if (unlockHref !== `/variant-b/watch/${showId}?episode=6&source=facebook&unlocked=1`) throw new Error(`Unexpected unlock href: ${unlockHref}`);
  await page.locator('[data-testid="mock-unlock-episode-link"]').click();
  await expectWatchContext(page, firstLocked, true);
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('unlocked');
  evidence.push({ name: 'EP6 fake unlock returns same episode with source and unlocked=1', path: await screenshot(page, '07-ep6-post-fake-unlock-same-episode-source.png') });

  await page.goto(`/variant-b/watch/${showId}?episode=6&source=${source}`);
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  await page.locator('[data-testid="story-pass-secondary-link"]').click();
  await expect(page.locator('[data-testid="variant-b-pass"]')).toBeVisible();
  await expect(page.locator('[data-testid="pass-mock-return-link"]')).toHaveAttribute('href', `/variant-b/watch/${showId}?episode=6&source=facebook&unlocked=1`);
  evidence.push({ name: 'Story Pass page preserves story episode source and mock return href', path: await screenshot(page, '08-story-pass-context-and-return.png') });
  await page.locator('[data-testid="pass-mock-return-link"]').click();
  await expectWatchContext(page, firstLocked, true);
  evidence.push({ name: 'Story Pass mock return lands same episode with unlocked=1', path: await screenshot(page, '09-story-pass-return-same-unlocked-episode.png') });

  await page.goto(`/variant-b/watch/${showId}?episode=7&source=${source}`);
  await expectWatchContext(page, 7, false);
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  await expect(page.locator('[data-testid="unlock-drawer-balance"]')).toContainText('Drawer mock balance');
  await expect(page.locator('[data-testid="unlock-drawer-cost"]')).toContainText('Drawer mock cost');
  evidence.push({ name: 'Direct later locked EP7 still drawer-only mock balance/cost', path: await screenshot(page, '10-ep7-direct-later-locked-drawer-only.png') });

  await assertNoHardStopRequests(page, blockedRequests);
  const seriousConsole = consoleMessages.filter((msg) => !/Download the React DevTools/i.test(msg.text));
  const result = {
    verdict: 'PASS',
    viewport: '390x844, chromium mobile context, deviceScaleFactor=3',
    baseURL,
    evidence,
    blockedRequests,
    consoleMessages: seriousConsole,
    note: 'Default fixture has sufficient mock balance, so runtime primary CTA is Unlock EP 6. Insufficient Get coins to unlock branch exists in watch-stub conditional but is not route-selectable without code changes.'
  };
  fs.writeFileSync(path.join(outDir, 'mock-balance-drawer-evidence.json'), JSON.stringify(result, null, 2));
  if (seriousConsole.length) throw new Error(`Console warnings/errors observed: ${JSON.stringify(seriousConsole, null, 2)}`);
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
