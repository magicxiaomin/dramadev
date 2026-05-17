# Phase 3 Mock Data Freeze

Linked task: PHASE3-006 (`t_43bdc557`)

Parent/audit task: PHASE3-005 (`t_89fae098`)

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`

Requirement covered: PRD §8.4 Unlock Drawer examples and the Phase 3 requirements brief item 5, "Mock-data review & freeze."

## Scope

This file freezes the mock-only story, episode, balance, and cost values currently used by the P0 Facebook ad conversion route:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
```

The audited implementation source is `src/data/fixtures/shows.ts`, with display use in:

- `src/app/variant-b/watch/[showId]/watch-stub.tsx`
- `src/app/variant-b/pass/pass-stub.tsx`

No real payment, subscription, login, Facebook API, analytics, backend, database, video, or entitlement behavior is represented by these values.

## Frozen primary P0 story

| Field | Frozen value |
| --- | --- |
| Story id | `midnight-lantern-oath` |
| Story title | `Midnight Lantern Oath` |
| Logline | `A guarded heiress follows a hidden oath through one house of secrets, debts, and shifting loyalties.` |
| Total episodes | `36` |
| Free episodes | `5` |
| First locked episode | `6` |
| Episode ranges | `1-24`, `25-36` |
| Default mock balance | `80 coins` |
| Mock cost per episode | `36 coins` |
| Mock Story Pass display price | `120 coins` |
| Default drawer balance variant | `default-balance` / `80 coins` |
| Low-balance drawer check variant | `low-balance-drawer-check` / `12 coins` |

PRD §8.4 example alignment:

- Balance example: `Balance: 80 coins` — aligned by `mockBalance: 80`.
- Cost example: `Cost: 36 coins` — aligned by `mockCostPerEpisode: 36`.
- First locked example: `EP 6 is locked` — aligned by `freeEpisodes: 5` and `firstLockedEpisode: 6`.
- Primary CTA example: `Unlock EP 6` — generated from the current locked episode.
- Secondary CTA example: `Get Story Pass` — displayed as mock-only Story Pass copy.
- Helper/return behavior: mock unlock returns to the same watch episode with `unlocked=1` and preserves safe attribution.

## Frozen primary episode list

| EP | Title | Lock state | Story hook |
| --- | --- | --- | --- |
| 1 | The Lantern at Gate Nine | free | — |
| 2 | A Letter Under the Floorboard | free | — |
| 3 | The Heir No One Named | free | — |
| 4 | Dinner With a Hidden Witness | free | — |
| 5 | The Promise Before Dawn | free | — |
| 6 | The First Door Closes | locked | The next episode reveals why Mara kept the sealed ring from her own family. |
| 7 | Ashes in the Courtyard | locked | Mara finds a burned page that names the one person she still trusts. |
| 8 | The Guest Who Knew Her Name | locked | A quiet stranger arrives with proof that the household history was rewritten. |
| 9 | Two Cups of Bitter Tea | locked | One cup carries a warning, and the other carries a test of loyalty. |
| 10 | A Debt Paid in Silence | locked | Mara learns who paid her debt and why the favor cannot be returned safely. |
| 11 | The Portrait Turns | locked | A portrait moved overnight exposes a passage built for secret meetings. |
| 12 | Rain on the Ledger | locked | The missing ledger points to a betrayal hidden inside a rescue plan. |
| 13 | The Vow in the West Hall | locked | A private vow forces Mara to choose between public safety and personal truth. |
| 14 | Three Knocks After Midnight | locked | Three knocks summon the ally who vanished on the night everything changed. |
| 15 | The Key Sewn Into Blue Silk | locked | The blue silk key opens a room that someone has been guarding for years. |
| 16 | A Toast No One Drinks | locked | A frozen toast reveals who expected Mara to fall before the celebration ended. |
| 17 | The Name Behind the Seal | locked | The seal carries a second name that changes the meaning of Mara’s inheritance. |
| 18 | Footsteps in the North Wing | locked | Footsteps lead Mara to a room that should have been empty for a decade. |
| 19 | The Quiet Confession | locked | A confession spoken too softly gives Mara the leverage she needs. |
| 20 | The Broken House Bell | locked | The broken bell rings once, proving someone inside the house is sending signals. |
| 21 | A Map Without Roads | locked | The roadless map marks safe rooms, old debts, and one impossible escape. |
| 22 | The Witness in Plain Sight | locked | The witness was present all along, but their silence has a dangerous price. |
| 23 | Pearls on the Staircase | locked | A trail of pearls pulls Mara toward the person staging every accusation. |
| 24 | The Last Free Breath | locked | Mara reaches the edge of safety just as a familiar voice orders the gates shut. |
| 25 | The Second Range Begins | locked | A new chapter begins with a bargain that can save Mara or bind her forever. |
| 26 | Lanterns Over the River | locked | River lanterns carry coded names, including one Mara thought had been erased. |
| 27 | The Favor Returned | locked | An old favor returns at the worst moment and exposes Mara’s hidden plan. |
| 28 | A Door Left Open | locked | An open door is either an invitation or a trap set by someone close. |
| 29 | The False Farewell | locked | A farewell meant to protect Mara becomes the clue that keeps her moving. |
| 30 | Glass Under the Candle | locked | A shard beneath the candle shows where the first lie was staged. |
| 31 | The Storm Room | locked | The storm room contains the one record everyone agreed to destroy. |
| 32 | The Hand at the Curtain | locked | A hand at the curtain turns an overheard threat into a direct challenge. |
| 33 | Noon Without Shadows | locked | At noon, the missing shadows reveal where the final meeting will happen. |
| 34 | The Oath Repeated | locked | Repeating the oath proves which promise was sincere and which was bait. |
| 35 | The Lantern Goes Dark | locked | When the lantern goes dark, Mara must decide who deserves the truth. |
| 36 | Dawn at Gate Nine | locked | The final dawn brings Mara back to Gate Nine with a choice that changes every name. |

## Secondary stub stories

The fixture also contains secondary original static stubs for non-P0 discovery surfaces. They are not part of the P0 Facebook ad conversion route and are frozen here only so future acceptance work can detect accidental drift.

| Story id | Title | Episodes | Free episodes | First locked | Balance | Cost / EP | Purpose |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `harbor-of-second-chances` | Harbor of Second Chances | 18 | 3 | 4 | 40 coins | 24 coins | Secondary Home/Search/Browse preview stub only |
| `paper-crown-protocol` | Paper Crown Protocol | 12 | 2 | 3 | 30 coins | 20 coins | Secondary discovery preview stub only |

## Frozen cost surfaces

| Surface | Frozen value | Notes |
| --- | --- | --- |
| Unlock Drawer balance | `80 coins` | Primary P0 default state; enough for one mock single-episode unlock. |
| Unlock Drawer cost | `36 coins` | Used for `Unlock EP X` and Episode Sheet locked labels. |
| Low-balance wallet variant | `12 coins` | Fixture-only alternate balance for insufficient-balance drawer checks. |
| Pass page single-episode option | `36 coins` | Mirrors `mockCostPerEpisode` and returns to `unlocked=1`. |
| Pass page Story Pass option | `120 coins` | Static mock display price only; not a subscription, not auto-renewing, no processor connected. |
| Pass page coin pack | `Mock coin pack` | Placeholder copy only; no numeric pack value or local price is frozen. |

## Drift risks to flag before stakeholder acceptance

- Changing `freeEpisodes`, `firstLockedEpisode`, or the episode list can move the first lock away from EP 6 and invalidate PRD §8.4 screenshots/checklist evidence.
- Changing `mockBalance`, `mockCostPerEpisode`, or the `Mock Story Pass · 120 coins` copy can desync the Watch, Unlock Drawer, Episode Sheet, Pass page, and this freeze reference.
- Adding or renaming stories can look like new creative direction or brand-significant content; Phase 3 only permits original static mock data and typo/off-spec-copy fixes.
- Replacing the original fixture titles/hooks with licensed, competitor-derived, or real show assets is out of scope and must be escalated.
- Wiring any value to real payment, subscription, login, Facebook API, analytics, backend, database, video, or entitlement infrastructure would violate Phase 3 hard stops.
- Acceptance screenshots and checklist rows should be regenerated or marked stale if any frozen value above changes.

## Audit result

- The primary P0 balance (`80 coins`) and cost (`36 coins`) match PRD §8.4 example values.
- The first locked episode remains EP 6, derived from `freeEpisodes: 5` and `firstLockedEpisode: 6`.
- The route starts at EP 1 and can progress through the free chain to the first locked episode without requiring login, payment, subscription, Facebook API, analytics, backend, database, video, or entitlement behavior.
- No typo or off-spec copy change was required in the mock dataset during this audit.
- Future Phase 3 acceptance work should treat the values in this file as frozen and flag any drift before stakeholder review.
