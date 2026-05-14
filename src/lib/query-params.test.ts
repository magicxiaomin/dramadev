import { describe, expect, it } from 'vitest';
import {
  buildPassHref,
  buildPassReturnHref,
  buildShowDetailHref,
  buildWatchEpisodeHref,
  parseWatchQueryParams,
  parsePassQueryParams,
} from './query-params';

describe('parseWatchQueryParams', () => {
  it('defaults missing episode to 1 and unlocked to false', () => {
    expect(parseWatchQueryParams({}, 36)).toEqual({ episode: 1, unlocked: false, attribution: {} });
  });

  it('defaults invalid episode values to 1', () => {
    expect(parseWatchQueryParams({ episode: 'abc' }, 36).episode).toBe(1);
    expect(parseWatchQueryParams({ episode: '0' }, 36).episode).toBe(1);
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
          source: 'facebook',
          campaign_id: 'cmp-1',
          adset_id: 'set-1',
          ad_id: 'ad-1',
          creative_id: 'cr-1',
          placement: 'feed',
          utm_source: 'fb',
          utm_campaign: 'launch',
          utm_content: 'hook-a',
          ignored: 'nope',
        },
        36,
      ),
    ).toEqual({
      episode: 2,
      unlocked: false,
      attribution: {
        source: 'facebook',
        campaign_id: 'cmp-1',
        adset_id: 'set-1',
        ad_id: 'ad-1',
        creative_id: 'cr-1',
        placement: 'feed',
        utm_source: 'fb',
        utm_campaign: 'launch',
        utm_content: 'hook-a',
      },
    });
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
