# Phase 4G P0 Evidence Template

Use this template during human review of PR #19 and the merged clean replacement harness PR #23. Keep evidence fake-only. Do not paste secrets, tokens, private user data, real payment identifiers, real Facebook IDs, or production service data.

Reviewer:
Branch / PR:
Commit SHA:
Date:
Browser:
Viewport:
Show id used:
First locked episode:

## 1. Facebook source landing

URL opened:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
```

Observed URL after load:

```txt

```

Expected state:

- Watch page opens directly.
- EP1 is active.
- `source=facebook` context is present or intentionally preserved by documented route helper behavior.
- No Home/Search/Genre/Show Detail redirect before playback.
- No login/recharge/Story Pass/PWA install prompt before playback.

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Notes:

## 2. Free episode chain

Steps performed:

1. Start from EP1.
2. Complete or advance fake playback.
3. Continue through free episodes until just before the lock point.

Observed URL states:

```txt
EP1:
EP2 or next free episode:
Last free episode:
```

Expected state:

- Same show context is preserved.
- Free episodes remain playable without login.
- No recharge, Story Pass, PWA install, or login prompt appears before first locked episode.

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Episode Sheet observations:
- Notes:

## 3. First locked episode

URL/state at first locked episode:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]
```

Expected state:

- Locked state appears.
- Unlock Drawer opens automatically on first entry.
- Locked state is not presented as a video/network error.
- Fake playback progress does not imply the locked episode is already playing.

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Drawer open/close observations:
- Notes:

## 4. Unlock Drawer

Expected drawer fields:

- Drama title:
- Episode number:
- Mock balance:
- Mock cost:
- Primary CTA, single-episode unlock:
- Secondary CTA, Story Pass:
- Return-to-same-episode explanation:

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Notes:

## 5. Fake single-episode unlock

Action taken:

```txt
Clicked/tapped: Unlock EP [lockedEpisode]
```

Observed return URL:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

Expected state:

- Same show id preserved.
- Same locked episode number preserved.
- `unlocked=1` present.
- User is not sent to Home.
- User is not stranded on the pass/options page.
- Episode is playable/unlocked in the fake state.

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Notes:

## 6. Fake Story Pass path, if present

Pass/options URL observed:

```txt
/variant-b/pass?story=[showId]&episode=[lockedEpisode]
```

Observed return URL after fake pass action:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

Expected state:

- Story and episode context preserved.
- Copy is clearly mock/fake.
- No real subscription or payment terms are activated.
- No real payment, login, entitlement, backend, database, analytics, or Facebook service call is made.

Evidence:

- Screenshot anchor/path:
- Console observations:
- Network observations, fake-only:
- Notes:

## 7. PR #23 Playwright cross-check

Playwright command or CI link:

```txt

```

Observed automated coverage:

- Route starts from source=facebook path:
- Free preview before prompts:
- First locked episode reached:
- Unlock Drawer observed:
- Fake unlock/pass same-episode return with `unlocked=1`:

Notes:

## 8. Final reviewer assessment

- [ ] P0 invariant passes manually.
- [ ] PR #23 harness aligns with manual P0 path.
- [ ] No real-service behavior observed.
- [ ] No hard-stop scope crossed.
- [ ] Gaps or follow-ups are listed separately and not treated as Phase 4G scope.

Reviewer decision / notes:
