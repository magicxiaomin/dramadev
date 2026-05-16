export type EpisodeLockInput = {
  episode: number;
  freeEpisodes: number;
  unlocked: boolean;
};

export type EpisodeLockDisplayState = 'free' | 'locked' | 'unlocked';

export function isEpisodeLocked({ episode, freeEpisodes, unlocked }: EpisodeLockInput): boolean {
  return episode > freeEpisodes && !unlocked;
}

export function getEpisodeLockState(input: EpisodeLockInput): EpisodeLockDisplayState {
  if (input.episode <= input.freeEpisodes) {
    return 'free';
  }

  return input.unlocked ? 'unlocked' : 'locked';
}
