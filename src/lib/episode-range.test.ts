import { describe, expect, it } from 'vitest';
import { buildEpisodeRanges, findEpisodeRange } from './episode-range';

describe('episode range helpers', () => {
  it('builds inclusive ranges using the requested range size', () => {
    expect(buildEpisodeRanges(36, 24)).toEqual([
      { label: '1-24', start: 1, end: 24 },
      { label: '25-36', start: 25, end: 36 },
    ]);
  });

  it('returns an empty list for invalid totals', () => {
    expect(buildEpisodeRanges(0, 24)).toEqual([]);
  });

  it('falls back to one range when range size is invalid', () => {
    expect(buildEpisodeRanges(3, 0)).toEqual([{ label: '1-3', start: 1, end: 3 }]);
  });

  it('finds the range containing an episode', () => {
    const ranges = buildEpisodeRanges(36, 24);
    expect(findEpisodeRange(ranges, 26)).toEqual({ label: '25-36', start: 25, end: 36 });
  });
});
