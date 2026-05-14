# SceneFlow MVP PRD: Facebook Ad Conversion Flow

## 1. Status

- Status: Confirmed MVP direction
- Prototype base: Prototype B / SceneFlow
- Primary goal: Facebook ad traffic conversion
- Document owner: Product
- Implementation target: Mobile PWA / Web prototype
- Primary viewport: iPhone-like mobile viewport, approximately 390 x 844

This PRD is the source of truth for the next implementation phase.

## 2. Product Decision Summary

SceneFlow continues to use Prototype B as the MVP foundation.

However, the MVP focus is no longer a generic search-first or genre-first content directory. The product direction has been refined into a Facebook ad conversion experience for trending short dramas.

The core user journey is:

```txt
Facebook Ad
-> Watch EP1
-> Free episode chain
-> First locked episode
-> Unlock Drawer
-> Unlock EP / Story Pass
-> Mock purchase / unlock
-> Return to same episode and continue watching
```

The default ad landing route is:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
```

Home, Search, Genre, and Show Detail still exist, but they are not the primary P0 conversion funnel.

## 3. Non-Goals

This MVP should not:

- Reopen the A/B/C/D/E prototype direction discussion.
- Replace SceneFlow with Prototype A, C, NetShort, or DramaWave.
- Send Facebook ad users to Home first.
- Send Facebook ad users to Search first.
- Send Facebook ad users to Show Detail first.
- Require login before free preview episodes.
- Show a PWA install prompt before first playback.
- Show recharge or Story Pass promotion before the user reaches the first locked episode.
- Make Story Pass the primary CTA on the first locked episode.
- Build real payment.
- Build real subscription.
- Integrate real Facebook APIs.
- Integrate a real video player.
- Copy competitor brands, titles, posters, videos, pricing, or copy.

## 4. Target User

The primary user is a mobile user who clicked a Facebook ad for a trending short drama.

User mindset:

- They just saw a dramatic hook, twist, conflict, or relationship moment in a Facebook ad.
- They clicked because they want to continue watching that specific drama.
- They do not want to register first.
- They do not want to search first.
- They do not want to browse the homepage first.
- They are willing to watch free episodes.
- They will decide whether to unlock or purchase only after reaching a locked episode.

Primary UX goal:

Help the user quickly confirm:

> This is the drama I saw in the ad, and I can continue watching immediately.

## 5. Core Product Principles

### 5.1 Watch-first

The Watch page is the primary landing surface for Facebook ad traffic.

### 5.2 Free preview first

Free episodes must play without login, recharge, PWA install prompts, or subscription prompts.

### 5.3 Per-drama lock point

The first locked episode is controlled by each story's `freeEpisodes` value.

Rule:

```txt
If episode > story.freeEpisodes and the episode is not unlocked:
  trigger locked episode flow
```

### 5.4 Transparent unlock

The locked episode flow must clearly show:

- Drama title
- Episode number
- Balance
- Cost
- Single-episode unlock option
- Story Pass option
- Return-to-episode behavior after purchase

### 5.5 Single-episode unlock first

At the first locked episode, the primary CTA is:

```txt
Unlock EP X
```

The secondary CTA is:

```txt
Get Story Pass
```

Rationale:
The first conversion should reduce purchase friction. A single-episode unlock is lower commitment than a pass.

### 5.6 Return to same episode

After mock unlock or mock purchase, the user must return to:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

- Do not return the user to Home.
- Do not lose the episode parameter.
- Do not require the user to find the drama again.

## 6. P0 User Flow

1. User clicks Facebook ad.
2. User lands on `/variant-b/watch/[showId]?episode=1&source=facebook`.
3. EP1 starts as a free preview.
4. User completes EP1.
5. User continues to EP2.
6. User continues through free episodes.
7. User reaches first locked episode.
8. Watch page enters locked state.
9. Unlock Drawer opens.
10. User chooses:
    - Unlock EP X
    - Get Story Pass
    - Maybe later
11. If user unlocks or mock purchases, user returns to the same episode with `unlocked=1`.
12. User continues watching.

## 7. Route Requirements

### 7.1 Watch landing route

Primary ad route:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
```

Optional future attribution params:

- `campaign_id`
- `adset_id`
- `ad_id`
- `creative_id`
- `placement`
- `utm_source`
- `utm_campaign`
- `utm_content`

P0 does not need analytics processing. These params should not disrupt routing or playback.

### 7.2 Locked episode route

```txt
/variant-b/watch/[showId]?episode=[episodeNumber]
```

If the episode is locked, show locked state and Unlock Drawer.

### 7.3 Unlocked return route

```txt
/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1
```

This simulates successful unlock.

### 7.4 Pass / unlock options route

Existing route may be reused:

```txt
/variant-b/pass?story=[showId]&episode=[episodeNumber]
```

P0 requirement:
The page must preserve story and episode context.

## 8. Page Requirements

### 8.1 Watch Page

The Watch page becomes the primary Facebook ad landing page.

Must show:

- Drama title
- Current episode number
- Vertical playback area
- Play / pause control
- Playback progress
- Genre or trope tags
- Current free / locked state
- Episode list entry
- Detail entry
- Share entry
- Next episode CTA or episode-complete CTA

Must not show before free playback:

- Login prompt
- Recharge prompt
- Story Pass prompt
- PWA install prompt
- Homepage redirect
- Detail page redirect

#### Watch Page States

Required states:

- Playing free episode
- Paused
- Episode complete
- Loading next episode
- First locked episode
- Unlock Drawer open
- Unlocked episode
- Drawer closed / maybe later

#### Episode Complete Behavior

When a free episode completes:

- Show a clear "Continue to EP X" CTA.
- P0 may implement manual continuation.
- P1 may implement 3-second countdown autoplay.
- If next episode is free, continue to next episode.
- If next episode is locked, trigger locked episode flow.

### 8.2 Episode Sheet

The Watch page needs an episode selector because Facebook ad users do not land on Show Detail first.

Episode Sheet must support:

- Opening from Watch page
- Current episode highlight
- Free episodes directly playable
- Locked episodes visibly locked
- Locked episodes showing price or unlock condition
- Clicking a locked episode closes Episode Sheet and opens Unlock Drawer
- Long dramas support range tabs, such as:
  - 1-24
  - 25-48
  - 49-72
  - 73-96

Episode Sheet must show:

- Drama title
- Total episode count
- Free episode range
- Current range
- Episode grid
- Current episode
- Locked state
- Price or unlock condition

Do not show only a lock icon.

### 8.3 First Locked Episode State

Trigger condition:

```txt
episode > story.freeEpisodes && unlocked !== true
```

When this condition is true:

- Playback area should show a clear locked state.
- Progress should not show fake playback progress.
- The locked state must not look like a network error.
- Unlock Drawer should open automatically on first entry.
- If user closes the drawer, the Watch page remains locked.
- Tapping the locked playback area should reopen Unlock Drawer.

### 8.4 Unlock Drawer

Unlock Drawer is the core P0 conversion component.

Must show:

- Current story hook
- Drama title
- Episode number
- Balance
- Cost
- Primary CTA: Unlock EP X
- Secondary CTA: Get Story Pass
- Tertiary action: Maybe later / close
- Explanation that unlock returns the user to this episode
- Auto-unlock hidden or clearly off by default

Recommended hierarchy:

Story hook:

```txt
"The next episode reveals who betrayed her."
```

Locked state:

```txt
"EP 6 is locked"
```

Price:

```txt
"Balance: 80 coins"
"Cost: 36 coins"
```

Primary CTA:

```txt
"Unlock EP 6"
```

Secondary CTA:

```txt
"Get Story Pass"
```

Helper:

```txt
"Unlock once and continue watching this episode."
```

Tertiary:

```txt
"Maybe later"
```

#### Balance states

P0 can mock balance.

If balance is sufficient, primary CTA:

```txt
Unlock EP X
```

If balance is insufficient, primary CTA may become:

```txt
Get coins to unlock
```

Secondary CTA remains:

```txt
Get Story Pass
```

#### Login states

P0 can mock login.

Rules:

- Free preview does not require login.
- Unlock or payment-like actions may trigger login in production.
- P0 may simulate unlock with `unlocked=1`.

### 8.5 Story Pass / Unlock Options Page

The Pass page should be reframed around the current drama, not generic catalog access.

Recommended title:

```txt
Keep watching [Story Title]
```

Do not use generic title:

```txt
Catalog access
```

The page must answer:

- Which drama am I watching?
- Which episode am I stuck on?
- How much does single-episode unlock cost?
- What does Story Pass unlock?
- Is it a subscription?
- Does it auto-renew?
- Can it be cancelled?
- Where do I go after purchase?
- Is this mock or real?

Required sections:

- Header
- Back to Watch
- Current drama context
- Current Drama Card
- Drama title
- Episode number
- Story hook
- Unlock Option
- Unlock this episode
- Cost
- Mock purchase CTA
- Story Pass Option
- Story-focused benefits
- Clearly state mock status
- Cancellation / renewal placeholder
- Coin Pack Option
- Mock coin pack
- Transparent price placeholder
- Legal / trust placeholders
- Local price placeholder
- Tax placeholder
- Renewal placeholder
- Cancellation placeholder
- Refund placeholder

Purchase success behavior:

```txt
/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1
```

### 8.6 Unlock Success Return

After successful mock unlock:

- Return to same drama
- Return to same episode
- Set unlocked state
- Resume playable state
- Show short success feedback

Suggested toast:

```txt
EP 6 unlocked. Continue watching.
```

Do not:

- Return to Home
- Stay on Pass page
- Lose episode context
- Keep showing locked state

### 8.7 Show Detail Auxiliary Page

Show Detail is not the Facebook ad landing page.

It remains useful for:

- More drama context
- Full synopsis
- Tags
- Total episodes
- Free episode count
- Episode grid
- Range tabs
- Recommended dramas

Entry points:

- From Watch page detail entry
- From Search results
- From Genre results
- From recommendations

Show Detail may link back to Watch.

### 8.8 Home / Search / Genre

These remain in the product but are not P0 conversion funnel pages.

Home role:

- Second visit
- Natural traffic
- Trending drama entry
- Continued recommendations

Search role:

- Find another drama seen in an ad
- Search by title, trope, or plot clue
- Trending query support

Genre role:

- Find similar dramas by trope
- Examples:
  - Hidden Identity
  - Revenge
  - Fake Marriage
  - Rebirth

## 9. PWA Requirements

PWA install prompt must not interrupt first playback.

Do not show install prompt:

- Immediately on page load
- Before EP1 starts
- During first free episode

Recommended P1 trigger moments:

- After watching 2 episodes
- After reaching first locked episode
- After unlock success
- On second visit
- After follow or continue-watching action

PWA UI must consider:

- iOS safe area
- Bottom drawer safe area
- Standalone mode return paths
- Weak network state distinct from locked state
- Offline state distinct from locked state

## 10. Metrics

Primary funnel:

```txt
Ad Click
-> Watch Page Loaded
-> EP1 Start
-> EP1 Complete
-> Free Episode Chain Continue
-> First Locked Episode Reached
-> Unlock Drawer Viewed
-> Unlock CTA Clicked
-> Pass / Coin Option Viewed
-> Mock Unlock Success
-> Post-unlock Episode Played
```

North-star MVP metric:

First Lock Conversion Rate

Definition:

```txt
Users who click unlock or Story Pass
/
Users who reach the first locked episode
```

Secondary metrics:

- Ad Click -> Watch Loaded Rate
- EP1 Start Rate
- EP1 Completion Rate
- Free Episode Chain Continuation Rate
- First Lock Reach Rate
- Unlock Drawer CTA Click Rate
- Unlock Success Rate
- Post-unlock Play Rate

Not P0 success metrics:

- Search usage
- Genre click rate
- Home feed click rate
- PWA install rate

## 11. P0 Scope

P0 must include:

- Facebook ad direct Watch landing behavior
- Watch EP1 route
- Free preview episodes without login
- Per-drama lock point via `freeEpisodes`
- First locked episode detection
- Locked playback state
- Unlock Drawer
- Single-episode unlock as primary CTA
- Story Pass as secondary CTA
- Mock unlock using `unlocked=1`
- Return to same episode after mock unlock
- Episode Sheet from Watch page
- Locked episode click opening Unlock Drawer
- Show Detail as auxiliary page
- Home / Search / Genre as secondary paths
- No first-playback PWA install prompt

## 12. P1 Scope

P1 may include:

- Local continue-watching
- Episode completion tracking
- 3-second auto-next countdown
- Facebook attribution event tracking
- Pixel / CAPI planning
- Ad creative -> episode mapping
- Lock point A/B testing
- Story-specific Pass page copy
- Unlock success toast
- Wallet / unlock history mock
- iOS Add to Home Screen instruction
- PWA install prompt after high-intent actions

## 13. P2 Scope

P2 may include:

- Real video player
- Real backend content retrieval
- Real login
- Real payment
- Real subscription
- Wallet ledger
- Refund / cancellation flows
- Multi-language ad landing pages
- Recommendation engine
- Server-side entitlement state
- Production analytics
- Facebook CAPI integration

## 14. Developer Handoff Notes

Implementation should prioritize documentation-driven behavior.

Expected future implementation areas:

### Routes

- `/variant-b/watch/[id]`
- `/variant-b/pass`
- `/variant-b/show/[id]`
- `/variant-b/search`
- `/variant-b/browse`
- `/variant-b`

### Components

Potential new or updated components:

- Variant B Watch Landing Player
- Episode Complete Overlay
- Episode Sheet
- Unlock Drawer
- Story Pass / Unlock Options Card
- Mock Unlock Success Toast
- Watch Detail Entry
- Ad Attribution Param Reader, P1 only

### State

Important state:

- story id
- episode number
- `freeEpisodes`
- locked
- unlocked
- drawer open / closed
- episode sheet open / closed
- playback state
- episode complete state
- source / attribution params, future
- balance mock
- cost mock

### Query Params

Required:

- `episode`
- `unlocked`
- `source`

Future:

- `campaign_id`
- `adset_id`
- `ad_id`
- `creative_id`
- `placement`
- `utm_source`
- `utm_campaign`
- `utm_content`

### Out of Scope for Initial Implementation

Do not implement:

- Real payment
- Real subscription
- Real video
- Real Facebook API
- Production analytics
- Production entitlement system
- Production login
- Real wallet ledger

## 15. QA Acceptance Checklist

P0 acceptance checklist:

- [ ] `/variant-b/watch/[showId]?episode=1&source=facebook` opens Watch EP1.
- [ ] EP1 can be watched without login.
- [ ] Free episodes do not trigger PWA install prompt.
- [ ] Free episodes do not trigger recharge prompt.
- [ ] Free episodes do not trigger Story Pass prompt.
- [ ] Episode completion can continue to next episode.
- [ ] If next episode is free, user can continue watching.
- [ ] If next episode is locked, locked state appears.
- [ ] First locked episode opens Unlock Drawer.
- [ ] Unlock Drawer shows drama title.
- [ ] Unlock Drawer shows episode number.
- [ ] Unlock Drawer shows balance.
- [ ] Unlock Drawer shows cost.
- [ ] Unlock Drawer primary CTA is single-episode unlock.
- [ ] Unlock Drawer secondary CTA is Story Pass.
- [ ] Closing Unlock Drawer keeps user on locked episode.
- [ ] Tapping locked playback area reopens Unlock Drawer.
- [ ] Episode Sheet opens from Watch page.
- [ ] Episode Sheet highlights current episode.
- [ ] Episode Sheet shows free episodes as playable.
- [ ] Episode Sheet shows locked episodes with unlock condition.
- [ ] Clicking a locked episode opens Unlock Drawer.
- [ ] Mock single-episode unlock returns to `/variant-b/watch/[showId]?episode=[episode]&unlocked=1`.
- [ ] Mock Story Pass purchase returns to the same unlocked episode.
- [ ] Unlock success does not send user to Home.
- [ ] Unlock success does not lose episode context.
- [ ] Show Detail can be opened from Watch page.
- [ ] Show Detail can return to Watch page.
- [ ] Mobile safe area does not cover drawer CTA.
- [ ] Locked state is visually distinct from weak network / video error state.

## 16. Open Questions for Future Iteration

These questions do not block P0 documentation or first implementation:

- Should P0 use manual "Next Episode" only, or a 3-second auto-next countdown?
- Should every locked episode have a custom story hook?
- Should balance be shown on Watch page before lock, or only inside Unlock Drawer?
- Should Story Pass page show one recommended plan or multiple options?
- Should the PWA install prompt appear after reaching lock or only after unlock success?
- Should different Facebook ad creatives deep-link to different starting episodes in P1?
- Should the first locked episode vary by campaign or only by story config?
