export type EpisodeLockState = 'free' | 'locked';

export type SceneFlowEpisode = {
  episodeNumber: number;
  title: string;
  lockState: EpisodeLockState;
  storyHook?: string;
};

export type EpisodeRange = {
  label: string;
  start: number;
  end: number;
};

export type MockWalletVariant = {
  id: string;
  label: string;
  balance: number;
  note: string;
};

export type SceneFlowShow = {
  id: string;
  title: string;
  logline: string;
  synopsis: string;
  genreTags: string[];
  tropeTags: string[];
  posterColor: string;
  totalEpisodes: number;
  freeEpisodes: number;
  mockBalance: number;
  mockCostPerEpisode: number;
  firstLockedEpisode: number;
  episodeRanges: EpisodeRange[];
  episodes: SceneFlowEpisode[];
  mockWalletVariants?: MockWalletVariant[];
  isPrimary?: boolean;
  isStub?: boolean;
  stubNote?: string;
};
