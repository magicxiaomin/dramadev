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
const bannedExternalHosts = [
  'facebook',
  'fbcdn',
  'connect.facebook.net',
  'graph.facebook.com',
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
  'auth0',
  'mux',
  'vimeo',
  'youtube',
];
const forbiddenFreePreviewCopy = /log\s*in|sign\s*in|subscribe|payment|recharge|connect\s+facebook|facebook\s+api|story\s+pass|backend|database|real\s+video/i;
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
  await expect(page.locator('[data-testid="variant-b-home"]')).toHaveCount(0);
  await expect(page.locator('[data-testid="current-episode"]')).toContainText(`EP ${episode}`);
  await expect(page.locator('[data-testid="watch-attribution-source"]')).toContainText(source);
  await expect(page.locator('[data-testid="watch-unlocked-flag"]')).toContainText(unlocked);
  await expectNoHardStopPrompts(page);
  await expectNoForbiddenRoutes(page);
}

async function completeCurrentEpisode(page: Page, currentEpisode: number) {
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('free');
  await expect(page.locator('[data-testid="free-playback-state"]')).toContainText(`EP ${currentEpisode}`);
  await expect(page.locator('[data-testid="free-playback-state"]')).not.toContainText(forbiddenFreePreviewCopy);
  await expectWatchContext(page, currentEpisode, 'no');

  await page.locator('[data-testid="complete-episode-button"]').click();
  const continueLink = page.locator('[data-testid="continue-next-episode"]');
  await expect(continueLink).toBeVisible();
  const continueHref = await continueLink.getAttribute('href');
  expect(continueHref, 'free-chain continuation must not prematurely unlock').not.toContain('unlocked=1');
  expect(continueHref, 'free-chain continuation preserves attribution').toContain('source=facebook');
  await continueLink.click();
}

async function walkToLockedBoundary(page: Page) {
  await page.goto(startPath);
  await expect(page.locator('[data-testid="variant-b-watch"]')).toBeVisible();

  for (let episode = 1; episode <= freeEpisodes; episode += 1) {
    await completeCurrentEpisode(page, episode);
  }

  await expectWatchContext(page, firstLockedEpisode, 'no');
  await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('locked');
  await expect(page.locator('[data-testid="locked-boundary-placeholder"]')).toContainText(`EP ${firstLockedEpisode} is locked`);
  await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
  await expect(page.locator('[data-testid="unlock-drawer-context"]')).toContainText(primaryShow.title);
  await expect(page.locator('[data-testid="unlock-drawer-context"]')).toContainText(`EP ${firstLockedEpisode}`);
  await expect(page.locator('[data-testid="unlock-drawer-return-copy"]')).toContainText('source=facebook');
  await expectNoHardStopPrompts(page);
  await expectNoForbiddenRoutes(page);
}

test.describe('P0 Facebook ad conversion route (fake-only)', () => {
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

  test('walks ad landing free chain to first locked episode and mock unlocks the same episode', async ({ page }) => {
    await walkToLockedBoundary(page);

    const mockUnlockLink = page.locator('[data-testid="mock-unlock-episode-link"]');
    await expect(mockUnlockLink).toContainText(`Unlock EP ${firstLockedEpisode}`);
    const unlockHref = await mockUnlockLink.getAttribute('href');
    expect(unlockHref).toBe(`/variant-b/watch/${PRIMARY_SHOW_ID}?episode=${firstLockedEpisode}&source=facebook&unlocked=1`);

    await mockUnlockLink.click();
    await expectWatchContext(page, firstLockedEpisode, 'yes');
    await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('unlocked');
    await expect(page.locator('[data-testid="free-playback-state"]')).toContainText('Mock unlocked episode');
    await expect(page).not.toHaveURL(/\/variant-b(?:\?|$)/);
  });

  test('preserves Facebook attribution through the mock Story Pass round-trip', async ({ page }) => {
    await walkToLockedBoundary(page);

    const storyPassLink = page.locator('[data-testid="story-pass-secondary-link"]');
    await expect(storyPassLink).toContainText('Story Pass');
    const passHref = await storyPassLink.getAttribute('href');
    expect(passHref).toBe(`/variant-b/pass?story=${PRIMARY_SHOW_ID}&episode=${firstLockedEpisode}&source=facebook`);

    await storyPassLink.click();
    await expect(page.locator('[data-testid="variant-b-pass"]')).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/variant-b/pass\\?story=${PRIMARY_SHOW_ID}`));
    await expect(page).toHaveURL(new RegExp(`episode=${firstLockedEpisode}`));
    await expect(page).toHaveURL(/source=facebook/);
    await expect(page.locator('[data-testid="pass-back-watch-link"]')).toHaveAttribute(
      'href',
      `/variant-b/watch/${PRIMARY_SHOW_ID}?episode=${firstLockedEpisode}&source=facebook`,
    );
    await expect(page.locator('[data-testid="pass-mock-return-link"]')).toHaveAttribute(
      'href',
      `/variant-b/watch/${PRIMARY_SHOW_ID}?episode=${firstLockedEpisode}&source=facebook&unlocked=1`,
    );
    await expectNoHardStopPrompts(page);
    await expectNoForbiddenRoutes(page);

    await page.locator('[data-testid="pass-back-watch-link"]').click();
    await expectWatchContext(page, firstLockedEpisode, 'no');
    await expect(page.locator('[data-testid="unlock-drawer"]')).toBeVisible();
    await page.locator('[data-testid="story-pass-secondary-link"]').click();
    await page.locator('[data-testid="pass-mock-return-link"]').click();

    await expectWatchContext(page, firstLockedEpisode, 'yes');
    await expect(page.locator('[data-testid="watch-lock-state"]')).toContainText('unlocked');
    await expect(page.locator('[data-testid="free-playback-state"]')).toContainText('Mock unlocked episode');
    await expect(page).not.toHaveURL(/\/variant-b(?:\?|$)/);
  });
});
