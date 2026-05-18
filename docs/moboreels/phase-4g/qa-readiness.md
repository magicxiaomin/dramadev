# Phase 4G QA Readiness Checklist

Status: docs-only, fake-only. This checklist was drafted for PR #19 and stale PR #20; current automated harness cross-checks should use merged clean replacement PR #23. It does not replace human review and does not authorize automated merge.

## P0 invariant

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

Use a known mock show id from the current branch under review. Preserve `source=facebook` through the path whenever the implementation supports attribution preservation.

## Browser and viewport matrix

Primary viewport from the PRD: iPhone-like mobile viewport, approximately 390 x 844.

Minimum manual pass matrix:

| Browser | Viewport | Required? | Notes |
| --- | --- | --- | --- |
| Mobile Safari or WebKit equivalent | 390 x 844 | Yes | Primary mobile PWA target; verify safe area and bottom drawer CTA visibility. |
| Chrome mobile emulation | 390 x 844 | Yes | Fast reviewer baseline; compare with PR #23 Playwright expectations where available. |
| Desktop Chrome responsive mode | 390 x 844 | Yes | Useful for console/network evidence capture. |
| Desktop wide viewport | 1280 x 720 | Optional | Only to verify no catastrophic layout break; P0 acceptance remains mobile-first. |

## Manual P0 checklist

Map each item to PRD section 15 and to the automated Playwright P0 harness coverage from merged PR #23.

### 1. Facebook source landing

- [ ] Open `/variant-b/watch/[showId]?episode=1&source=facebook`.
- [ ] Watch page opens directly; user is not sent to Home, Search, Genre, or Show Detail first.
- [ ] EP1 is the active episode.
- [ ] URL keeps `episode=1` and `source=facebook` unless a documented route transition intentionally rewrites while preserving equivalent context.
- [ ] No login, recharge, Story Pass, or PWA install prompt appears before free playback.

### 2. Free episode chain

- [ ] EP1 can be watched or advanced through the fake playback state without login.
- [ ] Completing a free episode exposes a clear continue action.
- [ ] Continuing to another free episode preserves the same show context.
- [ ] Free episodes do not trigger recharge, Story Pass, PWA install, or login prompts.
- [ ] Episode Sheet can open from Watch and highlights the current episode.
- [ ] Episode Sheet shows free episodes as playable and locked episodes with an unlock condition, not lock icon only.

### 3. First locked episode

- [ ] Navigate from the free chain to the first episode where `episode > story.freeEpisodes` and `unlocked` is not true.
- [ ] Locked state appears and is visually distinct from weak network/video error states.
- [ ] Fake playback progress does not imply the locked episode is already playing.
- [ ] Unlock Drawer opens automatically on first entry to the locked episode.
- [ ] Closing the drawer leaves the user on the locked episode.
- [ ] Tapping the locked playback area reopens the Unlock Drawer.

### 4. Unlock Drawer content

- [ ] Drawer shows drama title.
- [ ] Drawer shows current locked episode number.
- [ ] Drawer shows mock balance.
- [ ] Drawer shows mock cost.
- [ ] Primary CTA is single-episode unlock, e.g. `Unlock EP X`.
- [ ] Secondary CTA is Story Pass, e.g. `Get Story Pass`.
- [ ] Drawer explains that fake unlock returns to the same episode.
- [ ] No real payment, subscription, login, Facebook, analytics, entitlement, backend, or database service is invoked.

### 5. Fake single-episode unlock

- [ ] Activate the primary fake unlock CTA.
- [ ] User returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
- [ ] The same show id and locked episode number are preserved.
- [ ] User is not returned to Home.
- [ ] User is not left on the pass/options page.
- [ ] Locked state clears for the returned episode.

### 6. Fake Story Pass path

- [ ] Activate the secondary Story Pass path, if present in the branch under review.
- [ ] Pass/options route preserves `story=[showId]` and `episode=[lockedEpisode]`.
- [ ] Any fake purchase/pass success returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
- [ ] Copy is clearly mock/fake and does not represent real subscription terms.
- [ ] No real payment, subscription, login, entitlement, backend, or database call is made.

### 7. PR #23 automated harness alignment

Using merged PR #23 as the clean replacement for stale PR #20:

- [ ] Identify the Playwright P0 spec(s) added by PR #23.
- [ ] Confirm the automated route starts at `/variant-b/watch/[showId]?episode=1&source=facebook` or an equivalent source-preserving helper.
- [ ] Confirm the harness verifies free-preview-before-prompts behavior.
- [ ] Confirm the harness reaches the first locked episode.
- [ ] Confirm the harness observes Unlock Drawer content and fake unlock/pass behavior.
- [ ] Confirm the harness verifies same-episode return with `unlocked=1`.
- [ ] Treat manual evidence as complementary to Playwright results, not a substitute for human review.

## Readiness decision

Ready for human merge consideration only when:

- PR #19 has been reviewed first for callback/query contract correctness.
- PR #23 has been reviewed against PR #19's contract and the PRD invariant.
- Manual evidence covers the P0 path above on the primary 390 x 844 viewport.
- Any out-of-P0 items are tracked in `known-gaps.md` or later planning, not silently accepted as Phase 4G work.
