# P0 Fixture Originality and Scope Review

Task: PHASE1-005 original mock content fixture and IP self-check.

Files reviewed:
- `src/types/scene-flow.ts`
- `src/data/fixtures/shows.ts`

## Fixture summary

- Primary show: `midnight-lantern-oath`
- Primary title: `Midnight Lantern Oath`
- Total episodes: 36
- Free episodes: 5
- First locked episode: 6
- Mock balance: 80 coins
- Mock episode cost: 36 coins
- Low-balance variant: 12 coins via `low-balance-drawer-check`
- Episode ranges supplied for `1-24` and `25-36`

Secondary preview stubs:
- `harbor-of-second-chances`
- `paper-crown-protocol`

These stubs are static demo entries for secondary preview surfaces only. They are not intended to expand P0 beyond the direct watch-to-lock-to-drawer flow.

## Originality check

- Show titles, episode titles, loglines, synopses, and story hooks are original fixture copy written for this prototype.
- No real performers, real show titles, real media titles, copied plots, external posters, external videos, or commercial pricing are referenced.
- Poster data is represented only as local color tokens.
- The primary story uses fictional names and generic drama tropes suitable for a mock prototype.

## Scope check

- Static TypeScript data and type definitions only.
- No package files, install commands, runtime services, routes, backend calls, wallet ledger, user account flow, media playback system, event tracking, external storage, or deployment settings were added.
- The fixture supports later UI tasks for free episodes, first locked episode EP6, unlock drawer balance and cost display, range tabs, and insufficient balance copy.

## Acceptance self-check

- Primary original show has 36 episodes and `freeEpisodes: 5`: yes.
- Episodes 6-36 include `storyHook`: yes.
- Range tabs can show `1-24` and `25-36`: yes.
- First locked episode is EP6: yes.
- Mock unlock balance and cost display are represented: yes.
- Low-balance state is represented without production logic: yes.
- Stub shows are original demo content and scoped to secondary previews: yes.
- No production infrastructure or external asset references were added: yes.
