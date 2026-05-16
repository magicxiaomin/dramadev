import { describe, expect, it } from 'vitest';
import type { SceneFlowShow } from '@/types/scene-flow';
import { buildEpisodeSheetItems } from './episode-sheet';

const show = {
  id: 'midnight-lantern-oath',
  title: 'Midnight Lantern Oath',
  totalEpisodes: 7,
  freeEpisodes: 5,
  mockCostPerEpisode: 36,
  episodes: [
    { episodeNumber: 1, title: 'One', lockState: 'free' },
    { episodeNumber: 2, title: 'Two', lockState: 'free' },
    { episodeNumber: 6, title: 'Six', lockState: 'locked' },
  ],
} as SceneFlowShow;

describe('buildEpisodeSheetItems', () => {
  it('marks current, free, locked, and unlocked episodes for the P0 episode sheet grid', () => {
    expect(buildEpisodeSheetItems({ show, currentEpisode: 6, unlockedEpisode: 6 })).toEqual([
      { episode: 1, title: 'One', isCurrent: false, state: 'free', helper: 'Free preview' },
      { episode: 2, title: 'Two', isCurrent: false, state: 'free', helper: 'Free preview' },
      { episode: 3, title: undefined, isCurrent: false, state: 'free', helper: 'Free preview' },
      { episode: 4, title: undefined, isCurrent: false, state: 'free', helper: 'Free preview' },
      { episode: 5, title: undefined, isCurrent: false, state: 'free', helper: 'Free preview' },
      { episode: 6, title: 'Six', isCurrent: true, state: 'unlocked', helper: 'Unlocked' },
      { episode: 7, title: undefined, isCurrent: false, state: 'locked', helper: '36 coins' },
    ]);
  });

  it('keeps the first locked episode visibly locked before mock unlock', () => {
    expect(buildEpisodeSheetItems({ show, currentEpisode: 1 })[5]).toEqual({
      episode: 6,
      title: 'Six',
      isCurrent: false,
      state: 'locked',
      helper: '36 coins',
    });
  });
});
