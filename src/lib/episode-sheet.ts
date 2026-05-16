import type { SceneFlowShow } from '@/types/scene-flow';

export type EpisodeSheetItemState = 'free' | 'locked' | 'unlocked';

export type EpisodeSheetItem = {
  episode: number;
  title?: string;
  isCurrent: boolean;
  state: EpisodeSheetItemState;
  helper: string;
};

export type BuildEpisodeSheetItemsInput = {
  show: Pick<SceneFlowShow, 'episodes' | 'freeEpisodes' | 'mockCostPerEpisode' | 'totalEpisodes'>;
  currentEpisode: number;
  unlockedEpisode?: number;
};

export function buildEpisodeSheetItems({ show, currentEpisode, unlockedEpisode }: BuildEpisodeSheetItemsInput): EpisodeSheetItem[] {
  return Array.from({ length: show.totalEpisodes }, (_, index) => {
    const episode = index + 1;
    const fixtureEpisode = show.episodes.find((candidate) => candidate.episodeNumber === episode);
    const isUnlocked = unlockedEpisode === episode;
    const isFree = episode <= show.freeEpisodes;
    const state: EpisodeSheetItemState = isFree ? 'free' : isUnlocked ? 'unlocked' : 'locked';

    return {
      episode,
      title: fixtureEpisode?.title,
      isCurrent: episode === currentEpisode,
      state,
      helper: state === 'locked' ? `${show.mockCostPerEpisode} coins` : state === 'unlocked' ? 'Unlocked' : 'Free preview',
    };
  });
}
