import { expect, type Locator, type Page, test } from '@playwright/test';
import { PRIMARY_SHOW_ID, primaryShow } from '../../src/data/fixtures/shows';

const source = 'facebook';
const freeEpisodes = primaryShow.freeEpisodes;
const firstLockedEpisode = primaryShow.firstLockedEpisode;
const startPath = `/variant-b/watch/${PRIMARY_SHOW_ID}?episode=1&source=${source}`;
const bannedRouteFragments = [
  '/api/',
  '/login',
  '/auth',
  '/payment',
  '/payments',
  '/subscription',
  '/entitlement',
  '/facebook',
  '/meta',
  '/video',
  '/backend',
  '/database',
];
const socialHostBrand = ['face', 'book'].join('');
const bannedExternalHosts = [
  socialHostBrand,
  'fbcdn',
  ['connect', socialHostBrand, 'net'].join('.'),
  ['graph', socialHostBrand, 'com'].join('.'),
  'google-analytics',
  'googletagmanager',
  'segment',
  'amplitude',
  'mixpanel',
  'posthog',
  'stripe',
  'paypal',
  'supabase',
  'firebase',
  ['auth', '0'].join(''),
  'mux',
  'vimeo',
  'youtube',
];
const forbiddenActionCopy = /continue with facebook|facebook sdk|pay now|checkout|sign in to continue|log in to continue|connect wallet|enter card|credit card|subscription required/i;

async function expectNoHardStopPrompts(scope: Page | Locator) {
  await expect(scope.getByText(forbiddenActionCopy)).toHaveCount(0);
}

async function expectNoForbiddenRoutes(page: Page) {
  const hrefs = await page.locator('a[href]').evaluateAll((links) => links.map((link) => (link as HTMLAnchorElement).href));
  for (const href of hrefs) {
    const parsed = new URL(href);
    const pathAndSearch = `${parsed.pathname}${parsed.search}`.toLowerCase();
    for (const fragment of bannedRouteFragments) {
      expect(pathAndSearch, `unexpected hard-stop route in href: ${href}`).not.toContain(fragment);
    }
  }
}

async function expectWatchContext(page: Page, episode: number, unlocked: 'yes' | 'no') {
  await expect(page).toHaveURL(new RegExp(`/variant-b/watch/${PRIMARY_SHOW_ID}\\?`));
  await expect(page).toHaveURL(new RegExp(`episode=${episode}`));
  await expect(page).toHaveURL(/source=facebook/);
  await expect(page).not.toHaveURL(/unlocked=1/);
  await expect(page.locator('[data-testid="variant-b-home"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="current-episode"]')).toContainText(`EP ${episode}`);
  await expect(page.locator('[data-testid="watch-attribution-source"]')).toContainText(source);
  await expect(page.locator('[data-testid="watch-unlocked-flag"]')).toContainText(unlocked);
  await expectNoHardStopPrompts(page);
  await expectNoForbiddenRoutes(page);
}

async function expectManualContinue(page: Page, nextEpisode: number) {
  const continueLink = page.locator('[data-testid="continue-next-episode"]');
  await expect(continueLink).toBeVisible();
  await expect(continueLink).toContainText(`Continue to EP ${nextEpisode}`);
  const continueHref = await continueLink.getAttribute('href');
  expect(continueHref, 'manual continuation must target the next episode').toContain(`episode=${nextEpisode}`);
  expect(continueHref, 'manual continuation preserves attribution').toContain('source=facebook');
  expect(continueHref, 'manual continuation must not prematurely unlock').not.toContain('unlocked=1');
}

test.describe('P1 manual Continue default regression (fake-only)', () => {
  let blockedRequests: string[];

  test.beforeEach(async ({ page }) => {
    blockedRequests = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      const pathAndSearch = `${url.pathname}${url.search}`.toLowerCase();
      const host = url.hostname.toLowerCase();
      const isLocal = ['127.0.0.1', 'localhost'].includes(host);
      const hasBannedRoute = bannedRouteFragments.some((fragment) => pathAndSearch.includes(fragment));
      const hasBannedHost = !isLocal && bannedExternalHosts.some((fragment) => host.includes(fragment));

      if (hasBannedRoute || hasBannedHost) {
        blockedRequests.push(request.url());
      }
    });

    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      const pathAndSearch = `${url.pathname}${url.search}`.toLowerCase();
      const host = url.hostname.toLowerCase();
      const isLocal = ['127.0.0.1', 'localhost'].includes(host);
      const shouldBlock =
        bannedRouteFragments.some((fragment) => pathAndSearch.includes(fragment)) ||
        (!isLocal && bannedExternalHosts.some((fragment) => host.includes(fragment)));

      if (shouldBlock) {
        blockedRequests.push(route.request().url());
        return route.abort();
      }

      return route.continue();
    });
  });

  test.afterEach(async ({}, testInfo) => {
    await testInfo.attach('blocked-hard-stop-requests', {
      body: Buffer.from(JSON.stringify(blockedRequests, null, 2)),
      contentType: 'application/json',
    });
    expect(blockedRequests, 'no hard-stop backend/payment/login/Facebook/API/video/analytics/database requests').toEqual([]);
  });

  test('requires manual Continue after free episode completion before entering the first locked episode', async ({ page }) => {
    await page.goto(startPath);
    await expect(page.locator('[data-testid="variant-b-watch"]')).toBeVisible();

    for (let episode = 1; episode <= freeEpisodes; episode += 1) {
      await expectWatchContext(page, episode, 'no');
      await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('free');

      await page.locator('[data-testid="complete-episode-button"]').click();
      await expectManualContinue(page, episode + 1);

      if (episode < freeEpisodes) {
        await page.locator('[data-testid="continue-next-episode"]').click();
      }
    }

    await expectWatchContext(page, freeEpisodes, 'no');
    await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('free');
    await expectManualContinue(page, firstLockedEpisode);

    await page.waitForTimeout(5500);

    await expectWatchContext(page, freeEpisodes, 'no');
    await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('free');
    await expectManualContinue(page, firstLockedEpisode);

    await page.locator('[data-testid="continue-next-episode"]').click();

    await expectWatchContext(page, firstLockedEpisode, 'no');
    await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('locked');
    await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
    await expectNoHardStopPrompts(page);
    await expectNoForbiddenRoutes(page);
  });
});
