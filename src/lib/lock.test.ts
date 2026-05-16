import { describe, expect, it } from 'vitest';
import { getEpisodeLockState, isEpisodeLocked } from './lock';

describe('episode lock helpers', () => {
  it('treats episodes up to freeEpisodes as free', () => {
    expect(isEpisodeLocked({ episode: 5, freeEpisodes: 5, unlocked: false })).toBe(false);
    expect(getEpisodeLockState({ episode: 5, freeEpisodes: 5, unlocked: false })).toBe('free');
  });

  it('locks episodes after freeEpisodes until unlocked=1 is present', () => {
    expect(isEpisodeLocked({ episode: 6, freeEpisodes: 5, unlocked: false })).toBe(true);
    expect(getEpisodeLockState({ episode: 6, freeEpisodes: 5, unlocked: false })).toBe('locked');
  });

  it('treats unlocked locked episodes as unlocked preview state', () => {
    expect(isEpisodeLocked({ episode: 6, freeEpisodes: 5, unlocked: true })).toBe(false);
    expect(getEpisodeLockState({ episode: 6, freeEpisodes: 5, unlocked: true })).toBe('unlocked');
  });
});
