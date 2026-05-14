import type { SceneFlowEpisode, SceneFlowShow } from '../../types/scene-flow';

export const PRIMARY_SHOW_ID = 'midnight-lantern-oath';
export const LOW_BALANCE_WALLET_ID = 'low-balance-drawer-check';
export const DEFAULT_EPISODE_RANGE_SIZE = 24;

const primaryEpisodes: SceneFlowEpisode[] = [
  { episodeNumber: 1, title: 'The Lantern at Gate Nine', lockState: 'free' },
  { episodeNumber: 2, title: 'A Letter Under the Floorboard', lockState: 'free' },
  { episodeNumber: 3, title: 'The Heir No One Named', lockState: 'free' },
  { episodeNumber: 4, title: 'Dinner With a Hidden Witness', lockState: 'free' },
  { episodeNumber: 5, title: 'The Promise Before Dawn', lockState: 'free' },
  {
    episodeNumber: 6,
    title: 'The First Door Closes',
    lockState: 'locked',
    storyHook: 'The next episode reveals why Mara kept the sealed ring from her own family.',
  },
  {
    episodeNumber: 7,
    title: 'Ashes in the Courtyard',
    lockState: 'locked',
    storyHook: 'Mara finds a burned page that names the one person she still trusts.',
  },
  {
    episodeNumber: 8,
    title: 'The Guest Who Knew Her Name',
    lockState: 'locked',
    storyHook: 'A quiet stranger arrives with proof that the household history was rewritten.',
  },
  {
    episodeNumber: 9,
    title: 'Two Cups of Bitter Tea',
    lockState: 'locked',
    storyHook: 'One cup carries a warning, and the other carries a test of loyalty.',
  },
  {
    episodeNumber: 10,
    title: 'A Debt Paid in Silence',
    lockState: 'locked',
    storyHook: 'Mara learns who paid her debt and why the favor cannot be returned safely.',
  },
  {
    episodeNumber: 11,
    title: 'The Portrait Turns',
    lockState: 'locked',
    storyHook: 'A portrait moved overnight exposes a passage built for secret meetings.',
  },
  {
    episodeNumber: 12,
    title: 'Rain on the Ledger',
    lockState: 'locked',
    storyHook: 'The missing ledger points to a betrayal hidden inside a rescue plan.',
  },
  {
    episodeNumber: 13,
    title: 'The Vow in the West Hall',
    lockState: 'locked',
    storyHook: 'A private vow forces Mara to choose between public safety and personal truth.',
  },
  {
    episodeNumber: 14,
    title: 'Three Knocks After Midnight',
    lockState: 'locked',
    storyHook: 'Three knocks summon the ally who vanished on the night everything changed.',
  },
  {
    episodeNumber: 15,
    title: 'The Key Sewn Into Blue Silk',
    lockState: 'locked',
    storyHook: 'The blue silk key opens a room that someone has been guarding for years.',
  },
  {
    episodeNumber: 16,
    title: 'A Toast No One Drinks',
    lockState: 'locked',
    storyHook: 'A frozen toast reveals who expected Mara to fall before the celebration ended.',
  },
  {
    episodeNumber: 17,
    title: 'The Name Behind the Seal',
    lockState: 'locked',
    storyHook: 'The seal carries a second name that changes the meaning of Mara’s inheritance.',
  },
  {
    episodeNumber: 18,
    title: 'Footsteps in the North Wing',
    lockState: 'locked',
    storyHook: 'Footsteps lead Mara to a room that should have been empty for a decade.',
  },
  {
    episodeNumber: 19,
    title: 'The Quiet Confession',
    lockState: 'locked',
    storyHook: 'A confession spoken too softly gives Mara the leverage she needs.',
  },
  {
    episodeNumber: 20,
    title: 'The Broken House Bell',
    lockState: 'locked',
    storyHook: 'The broken bell rings once, proving someone inside the house is sending signals.',
  },
  {
    episodeNumber: 21,
    title: 'A Map Without Roads',
    lockState: 'locked',
    storyHook: 'The roadless map marks safe rooms, old debts, and one impossible escape.',
  },
  {
    episodeNumber: 22,
    title: 'The Witness in Plain Sight',
    lockState: 'locked',
    storyHook: 'The witness was present all along, but their silence has a dangerous price.',
  },
  {
    episodeNumber: 23,
    title: 'Pearls on the Staircase',
    lockState: 'locked',
    storyHook: 'A trail of pearls pulls Mara toward the person staging every accusation.',
  },
  {
    episodeNumber: 24,
    title: 'The Last Free Breath',
    lockState: 'locked',
    storyHook: 'Mara reaches the edge of safety just as a familiar voice orders the gates shut.',
  },
  {
    episodeNumber: 25,
    title: 'The Second Range Begins',
    lockState: 'locked',
    storyHook: 'A new chapter begins with a bargain that can save Mara or bind her forever.',
  },
  {
    episodeNumber: 26,
    title: 'Lanterns Over the River',
    lockState: 'locked',
    storyHook: 'River lanterns carry coded names, including one Mara thought had been erased.',
  },
  {
    episodeNumber: 27,
    title: 'The Favor Returned',
    lockState: 'locked',
    storyHook: 'An old favor returns at the worst moment and exposes Mara’s hidden plan.',
  },
  {
    episodeNumber: 28,
    title: 'A Door Left Open',
    lockState: 'locked',
    storyHook: 'An open door is either an invitation or a trap set by someone close.',
  },
  {
    episodeNumber: 29,
    title: 'The False Farewell',
    lockState: 'locked',
    storyHook: 'A farewell meant to protect Mara becomes the clue that keeps her moving.',
  },
  {
    episodeNumber: 30,
    title: 'Glass Under the Candle',
    lockState: 'locked',
    storyHook: 'A shard beneath the candle shows where the first lie was staged.',
  },
  {
    episodeNumber: 31,
    title: 'The Storm Room',
    lockState: 'locked',
    storyHook: 'The storm room contains the one record everyone agreed to destroy.',
  },
  {
    episodeNumber: 32,
    title: 'The Hand at the Curtain',
    lockState: 'locked',
    storyHook: 'A hand at the curtain turns an overheard threat into a direct challenge.',
  },
  {
    episodeNumber: 33,
    title: 'Noon Without Shadows',
    lockState: 'locked',
    storyHook: 'At noon, the missing shadows reveal where the final meeting will happen.',
  },
  {
    episodeNumber: 34,
    title: 'The Oath Repeated',
    lockState: 'locked',
    storyHook: 'Repeating the oath proves which promise was sincere and which was bait.',
  },
  {
    episodeNumber: 35,
    title: 'The Lantern Goes Dark',
    lockState: 'locked',
    storyHook: 'When the lantern goes dark, Mara must decide who deserves the truth.',
  },
  {
    episodeNumber: 36,
    title: 'Dawn at Gate Nine',
    lockState: 'locked',
    storyHook: 'The final dawn brings Mara back to Gate Nine with a choice that changes every name.',
  },
];

export const mockShows: SceneFlowShow[] = [
  {
    id: PRIMARY_SHOW_ID,
    title: 'Midnight Lantern Oath',
    logline: 'A guarded heiress follows a hidden oath through one house of secrets, debts, and shifting loyalties.',
    synopsis:
      'Mara Vale returns to the family estate for a quiet ceremony and finds a lantern oath that was never meant for her. Each episode uncovers another clue about the sealed ring, the rewritten ledger, and the ally who knows why Gate Nine matters.',
    genreTags: ['Mystery Drama', 'Family Secrets', 'High Stakes'],
    tropeTags: ['Hidden Heir', 'Secret Oath', 'Household Betrayal'],
    posterColor: '#1f2a44',
    totalEpisodes: 36,
    freeEpisodes: 5,
    mockBalance: 80,
    mockCostPerEpisode: 36,
    firstLockedEpisode: 6,
    episodeRanges: [
      { label: '1-24', start: 1, end: 24 },
      { label: '25-36', start: 25, end: 36 },
    ],
    episodes: primaryEpisodes,
    mockWalletVariants: [
      {
        id: 'default-balance',
        label: 'Default drawer balance',
        balance: 80,
        note: 'Enough coins to test a single-episode unlock display.',
      },
      {
        id: LOW_BALANCE_WALLET_ID,
        label: 'Low balance drawer check',
        balance: 12,
        note: 'Below the episode cost so later drawer work can test insufficient balance copy.',
      },
    ],
    isPrimary: true,
  },
  {
    id: 'harbor-of-second-chances',
    title: 'Harbor of Second Chances',
    logline: 'A ferry dispatcher and a quiet cartographer rebuild trust while a coastal town prepares for a closing storm.',
    synopsis:
      'This demo stub exists only to populate secondary preview surfaces with original content while the P0 watch flow stays focused on the primary story.',
    genreTags: ['Romance Drama', 'Small Town'],
    tropeTags: ['Second Chance', 'Found Family'],
    posterColor: '#315c63',
    totalEpisodes: 18,
    freeEpisodes: 3,
    mockBalance: 40,
    mockCostPerEpisode: 24,
    firstLockedEpisode: 4,
    episodeRanges: [{ label: '1-18', start: 1, end: 18 }],
    episodes: [
      { episodeNumber: 1, title: 'The Ferry Runs Late', lockState: 'free' },
      { episodeNumber: 2, title: 'Map Lines in Pencil', lockState: 'free' },
      { episodeNumber: 3, title: 'A Storm Named Kindly', lockState: 'free' },
      {
        episodeNumber: 4,
        title: 'The Dock Lights Flicker',
        lockState: 'locked',
        storyHook: 'The next episode reveals why the old dock lights turn on before every hard goodbye.',
      },
    ],
    isStub: true,
    stubNote: 'Original static stub for Home, Search, and Browse previews; not part of the P0 conversion path.',
  },
  {
    id: 'paper-crown-protocol',
    title: 'Paper Crown Protocol',
    logline: 'A junior archivist discovers a mock royal protocol that can reorder an entire city council vote.',
    synopsis:
      'This demo stub provides another original preview card without adding real media, external assets, or new product scope.',
    genreTags: ['Workplace Intrigue', 'Light Suspense'],
    tropeTags: ['Hidden Rulebook', 'Underdog Lead'],
    posterColor: '#6b4e2e',
    totalEpisodes: 12,
    freeEpisodes: 2,
    mockBalance: 30,
    mockCostPerEpisode: 20,
    firstLockedEpisode: 3,
    episodeRanges: [{ label: '1-12', start: 1, end: 12 }],
    episodes: [
      { episodeNumber: 1, title: 'The Misfiled Crown', lockState: 'free' },
      { episodeNumber: 2, title: 'Minutes Before the Vote', lockState: 'free' },
      {
        episodeNumber: 3,
        title: 'Protocol Seven',
        lockState: 'locked',
        storyHook: 'The next episode shows why Protocol Seven can overturn the vote before sunset.',
      },
    ],
    isStub: true,
    stubNote: 'Original static stub for secondary discovery previews only.',
  },
];

export const primaryShow = mockShows.find((show) => show.id === PRIMARY_SHOW_ID) as SceneFlowShow;

export function getShowById(showId: string): SceneFlowShow | undefined {
  return mockShows.find((show) => show.id === showId);
}

export function getEpisodeByNumber(show: SceneFlowShow, episodeNumber: number): SceneFlowEpisode | undefined {
  return show.episodes.find((episode) => episode.episodeNumber === episodeNumber);
}

export function isEpisodeLocked(show: SceneFlowShow, episodeNumber: number, unlocked = false): boolean {
  return episodeNumber > show.freeEpisodes && !unlocked;
}

export function getEpisodeRanges(totalEpisodes: number, rangeSize = DEFAULT_EPISODE_RANGE_SIZE) {
  const rangeCount = Math.ceil(totalEpisodes / rangeSize);

  return Array.from({ length: rangeCount }, (_, index) => {
    const start = index * rangeSize + 1;
    const end = Math.min((index + 1) * rangeSize, totalEpisodes);

    return {
      label: `${start}-${end}`,
      start,
      end,
    };
  });
}
