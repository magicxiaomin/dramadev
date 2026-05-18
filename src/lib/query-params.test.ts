import { describe, expect, it } from 'vitest';
import { ATTRIBUTION_KEYS_PHASE4D } from './callback-keys';
import {
  buildPassHref,
  buildPassReturnHref,
  buildShowDetailHref,
  buildWatchEpisodeHref,
  parseWatchQueryParams,
  parsePassQueryParams,
  type AttributionParams,
  type ParsedWatchQueryParams,
} from './query-params';

const baselineAttribution = {
  source: 'facebook',
  campaign_id: 'cmp-1',
  adset_id: 'set-1',
  ad_id: 'ad-1',
  creative_id: 'cr-1',
  placement: 'feed',
  utm_source: 'fb',
  utm_campaign: 'launch',
  utm_content: 'hook-a',
} satisfies AttributionParams;

const forbiddenEmissionKeys = [
  'idempotency_key',
  'purchase_intent_id',
  'callback_id',
  'return_to',
  'copy_key',
  'reason_code',
  'occurred_at',
  'purchase_status',
  'auth_result',
  'drawer',
  'drawer_intent',
  'fake_user',
] as const;

function queryParamsFromHref(href: string): Record<string, string> {
  return Object.fromEntries(new URL(`https://example.test${href}`).searchParams.entries());
}

function expectNoForbiddenKeys(href: string): void {
  for (const key of forbiddenEmissionKeys) {
    expect(href).not.toContain(`${key}=`);
  }
}

describe('parseWatchQueryParams', () => {
  it('defaults missing episode to 1 and unlocked to false', () => {
    expect(parseWatchQueryParams({}, 36)).toEqual({ episode: 1, unlocked: false, attribution: {} });
  });

  it('defaults invalid episode values to 1', () => {
    expect(parseWatchQueryParams({ episode: 'abc' }, 36).episode).toBe(1);
    expect(parseWatchQueryParams({ episode: '0' }, 36).episode).toBe(1);
  });

  it('defaults malformed watch episode strings rejected by the central episode validator to 1', () => {
    expect(parseWatchQueryParams({ episode: '6abc' }, 36).episode).toBe(1);
    expect(parseWatchQueryParams({ episode: '1.5' }, 36).episode).toBe(1);
    expect(parseWatchQueryParams({ episode: '0001' }, 36).episode).toBe(1);
    expect(parseWatchQueryParams({ episode: '10000' }, 36).episode).toBe(1);
  });

  it('clamps out-of-range episodes to total episode bounds', () => {
    expect(parseWatchQueryParams({ episode: '99' }, 36).episode).toBe(36);
    expect(parseWatchQueryParams({ episode: '-3' }, 36).episode).toBe(1);
  });

  it('recognizes unlocked=1 only', () => {
    expect(parseWatchQueryParams({ unlocked: '1' }, 36).unlocked).toBe(true);
    expect(parseWatchQueryParams({ unlocked: 'true' }, 36).unlocked).toBe(false);
  });

  it('passes through supported attribution params without disrupting playback params', () => {
    expect(
      parseWatchQueryParams(
        {
          episode: '2',
          ...baselineAttribution,
          ignored: 'nope',
        },
        36,
      ),
    ).toEqual({
      episode: 2,
      unlocked: false,
      attribution: baselineAttribution,
    });
  });

  it('parses staging callback keys inbound without surfacing idempotency_key', () => {
    const parsed = parseWatchQueryParams(
      {
        episode: '6',
        unlocked: '1',
        purchase_status: 'succeeded',
        auth_result: 'success',
        drawer: 'unlock',
        drawer_intent: 'single_episode',
        fake_user: 'fake_user_demo-1',
        idempotency_key: 'idem_should_not_surface',
      },
      36,
    );

    expect(parsed).toEqual({
      episode: 6,
      unlocked: true,
      attribution: {},
      purchaseStatus: 'succeeded',
      authResult: 'success',
      drawer: 'unlock',
      drawerIntent: 'single_episode',
      fakeUser: 'fake_user_demo-1',
    });
    expect(Object.prototype.hasOwnProperty.call(parsed, 'idempotency_key')).toBe(false);
  });

  it('drops malformed staging callback key values silently', () => {
    expect(
      parseWatchQueryParams(
        {
          episode: '6',
          purchase_status: 'unknown',
          auth_result: '   ',
          drawer: 'modal',
          drawer_intent: 'x'.repeat(33),
          fake_user: 'person@example.com',
        },
        36,
      ),
    ).toEqual({ episode: 6, unlocked: false, attribution: {} });
  });

  it('parseWatchQueryParams -> buildWatchEpisodeHref -> parseWatchQueryParams yields equal attribution map for the 9-key baseline', () => {
    const parsed = parseWatchQueryParams({ episode: '6', unlocked: '1', ...baselineAttribution }, 36);
    const href = buildWatchEpisodeHref({ showId: 'midnight-lantern-oath', episode: parsed.episode, attribution: parsed.attribution, unlocked: parsed.unlocked });
    const reparsed = parseWatchQueryParams(queryParamsFromHref(href), 36);

    expect(ATTRIBUTION_KEYS_PHASE4D).toHaveLength(9);
    expect(reparsed.attribution).toEqual(baselineAttribution);
    expect(reparsed.episode).toBe(6);
    expect(reparsed.unlocked).toBe(true);
  });

  it('unknown inbound keys do not round-trip', () => {
    const parsed = parseWatchQueryParams({ episode: '6', source: 'facebook', ignored: 'nope', utm_medium: 'cpc' }, 36);
    const href = buildWatchEpisodeHref({ showId: 'midnight-lantern-oath', episode: parsed.episode, attribution: parsed.attribution });

    expect(parsed.attribution).toEqual({ source: 'facebook' });
    expect(href).toBe('/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook');
    expect(href).not.toContain('ignored=');
    expect(href).not.toContain('utm_medium=');
  });

  it('ParsedWatchQueryParams exposes unlocked: boolean only; no granted/canPlay/isAuthorized-style field exists', () => {
    const parsed: ParsedWatchQueryParams = parseWatchQueryParams({ episode: '6', unlocked: '1' }, 36);

    expect(Object.keys(parsed).sort()).toEqual(['attribution', 'episode', 'unlocked'].sort());
    expect(parsed.unlocked).toBe(true);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'granted')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'canPlay')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'isAuthorized')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'hasAccess')).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(parsed, 'unlockedAccess')).toBe(false);
  });

  it('parser surface for episode N with unlocked=1 vs without is identical except for the unlocked flag', () => {
    const locked = parseWatchQueryParams({ episode: '6', source: 'facebook' }, 36);
    const unlocked = parseWatchQueryParams({ episode: '6', source: 'facebook', unlocked: '1' }, 36);
    const { unlocked: lockedFlag, ...lockedRest } = locked;
    const { unlocked: unlockedFlag, ...unlockedRest } = unlocked;

    expect(lockedFlag).toBe(false);
    expect(unlockedFlag).toBe(true);
    expect(unlockedRest).toEqual(lockedRest);
  });
});

describe('buildWatchEpisodeHref', () => {
  it('keeps users on the same watch page while preserving safe attribution params', () => {
    expect(
      buildWatchEpisodeHref({
        showId: 'midnight-lantern-oath',
        episode: 2,
        attribution: {
          source: 'facebook',
          campaign_id: 'cmp-1',
          ad_id: 'ad-1',
        },
      }),
    ).toBe('/variant-b/watch/midnight-lantern-oath?episode=2&source=facebook&campaign_id=cmp-1&ad_id=ad-1');
  });

  it('builds the exact P0 mock unlock return URL for EP6 Facebook traffic', () => {
    expect(
      buildWatchEpisodeHref({
        showId: 'midnight-lantern-oath',
        episode: 6,
        unlocked: true,
        attribution: { source: 'facebook' },
      }),
    ).toBe('/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1');
  });

  it('buildWatchEpisodeHref drops overlong attribution values instead of truncating or emitting them', () => {
    const href = buildWatchEpisodeHref({
      showId: 'midnight-lantern-oath',
      episode: 6,
      attribution: { source: 'x'.repeat(129), campaign_id: 'cmp-1' },
    });

    expect(href).toBe('/variant-b/watch/midnight-lantern-oath?episode=6&campaign_id=cmp-1');
  });

  it('buildWatchEpisodeHref never emits forbidden keys even when passed a polluted attribution map', () => {
    const pollutedAttribution = { ...baselineAttribution } as AttributionParams & Record<string, string>;
    for (const key of forbiddenEmissionKeys) {
      pollutedAttribution[key] = `polluted-${key}`;
    }
    pollutedAttribution.utm_medium = 'cpc';

    const href = buildWatchEpisodeHref({ showId: 'midnight-lantern-oath', episode: 6, unlocked: true, attribution: pollutedAttribution });

    expectNoForbiddenKeys(href);
    expect(href).not.toContain('utm_medium=');
  });
});

describe('buildPassHref', () => {
  it('builds a secondary mock Story Pass route with story, episode, and safe attribution context', () => {
    expect(
      buildPassHref({
        showId: 'midnight-lantern-oath',
        episode: 6,
        attribution: { source: 'facebook', campaign_id: 'cmp-1' },
      }),
    ).toBe('/variant-b/pass?story=midnight-lantern-oath&episode=6&source=facebook&campaign_id=cmp-1');
  });

  it('buildPassHref never emits forbidden keys even when passed a polluted attribution map', () => {
    const pollutedAttribution = { ...baselineAttribution } as AttributionParams & Record<string, string>;
    for (const key of forbiddenEmissionKeys) {
      pollutedAttribution[key] = `polluted-${key}`;
    }
    const href = buildPassHref({ showId: 'midnight-lantern-oath', episode: 6, attribution: pollutedAttribution });

    expectNoForbiddenKeys(href);
  });
});

describe('buildPassReturnHref', () => {
  it('returns mock Story Pass buyers to the same unlocked episode with safe attribution preserved', () => {
    expect(
      buildPassReturnHref({
        showId: 'midnight-lantern-oath',
        episode: 6,
        attribution: { source: 'facebook', campaign_id: 'cmp-1' },
      }),
    ).toBe('/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&campaign_id=cmp-1&unlocked=1');
  });

  it('buildPassReturnHref never emits forbidden keys even when passed a polluted attribution map', () => {
    const pollutedAttribution = { ...baselineAttribution } as AttributionParams & Record<string, string>;
    for (const key of forbiddenEmissionKeys) {
      pollutedAttribution[key] = `polluted-${key}`;
    }
    const href = buildPassReturnHref({ showId: 'midnight-lantern-oath', episode: 6, attribution: pollutedAttribution });

    expectNoForbiddenKeys(href);
  });
});

describe('buildShowDetailHref', () => {
  it('preserves current watch episode and attribution for detail round trips from the P0 funnel', () => {
    expect(
      buildShowDetailHref({
        showId: 'midnight-lantern-oath',
        episode: 6,
        attribution: { source: 'facebook', campaign_id: 'cmp-1' },
      }),
    ).toBe('/variant-b/show/midnight-lantern-oath?episode=6&source=facebook&campaign_id=cmp-1');
  });

  it('buildShowDetailHref never emits forbidden keys even when passed a polluted attribution map', () => {
    const pollutedAttribution = { ...baselineAttribution } as AttributionParams & Record<string, string>;
    for (const key of forbiddenEmissionKeys) {
      pollutedAttribution[key] = `polluted-${key}`;
    }
    const href = buildShowDetailHref({ showId: 'midnight-lantern-oath', episode: 6, attribution: pollutedAttribution });

    expectNoForbiddenKeys(href);
  });
});

describe('parsePassQueryParams', () => {
  it('preserves story and valid episode context for pass route', () => {
    expect(parsePassQueryParams({ story: 'midnight-lantern-oath', episode: '6', source: 'facebook' }, 36)).toEqual({
      story: 'midnight-lantern-oath',
      episode: 6,
      attribution: { source: 'facebook' },
    });
  });

  it('defaults invalid pass episode to 1', () => {
    expect(parsePassQueryParams({ story: 'x', episode: 'nan' }, 36)).toEqual({ story: 'x', episode: 1, attribution: {} });
  });
});
