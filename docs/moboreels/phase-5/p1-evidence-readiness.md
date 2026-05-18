# Phase 5 P1 Evidence-Readiness Annex: Safe-Area Drawer CTA and Future Matrix Proposals

Status: docs-only / fake-only / non-implementation proposal. This annex does not authorize CI changes, browser-matrix enablement, Playwright edits, dependency changes, runtime code, real integrations, production deploy, DNS, secrets, paid services, or any work outside documentation planning.

## Scope and sources

Source of truth:

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`

Related planning references:

- `docs/moboreels/phase-4g/qa-readiness.md`
- `docs/moboreels/phase-4g/evidence-template.md`
- `docs/moboreels/phase-4g/known-gaps.md`
- `docs/moboreels/phase-4g/phase-5-questions.md`
- `docs/moboreels/real-mvp/roadmap.md`

This annex answers only the proposal portions of Phase 5 questions Q6 and Q24. It is additive to the Phase 4G QA baseline and must not weaken, replace, or reinterpret the P0 invariant.

## Non-negotiable P0 invariant

Any future P1 evidence threshold or browser matrix must keep this path as a must-pass gate:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

Future P1 work must still prove:

- Facebook ad users are not redirected to Home, Search, Genre, or Show Detail before playback.
- Free preview episodes remain available without login, recharge, PWA install prompts, Story Pass prompts, real payment, or real subscription.
- The first locked episode shows a locked state that is distinct from video/network error states.
- The Unlock Drawer presents drama title, locked episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, and Maybe later/close behavior.
- Fake unlock and fake Story Pass paths return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` without losing show or episode context.
- No real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, video infrastructure, production deployment, DNS, secrets, or paid services are introduced by evidence collection.

## Phase 4G baseline referenced by this annex

Phase 4G already defines the minimum fake-only P0 QA baseline:

- Primary viewport: iPhone-like mobile viewport, approximately 390 x 844.
- Minimum manual pass matrix:
  - Mobile Safari or WebKit equivalent at 390 x 844.
  - Chrome mobile emulation at 390 x 844.
  - Desktop Chrome responsive mode at 390 x 844.
  - Desktop wide viewport at 1280 x 720 as optional catastrophic-layout smoke only.
- Manual P0 checklist covering Facebook source landing, free episode chain, first locked episode, Unlock Drawer content, fake single-episode unlock, fake Story Pass path if present, and PR #23 Playwright harness alignment.
- Evidence template fields for URL, browser, viewport, show id, first locked episode, screenshots, console observations, and fake-only network observations.

This Phase 5 annex proposes only additive expectations for a later authorized P1. It does not require changing the Phase 4G package, PR #23 harness, CI, browser config, package dependencies, or runtime implementation.

## Q6 proposal: merge-readiness evidence threshold for mobile safe-area drawer CTA visibility

Question: What evidence threshold should define merge-readiness for mobile safe-area drawer CTA visibility?

Proposed answer for a future P1 authorization: a P1 change that touches the locked episode, bottom drawer, CTA stack, viewport handling, or safe-area styling should not be considered merge-ready until the reviewer can falsify and pass the checklist below on the Phase 4G primary mobile viewport.

### Required evidence context

Record the following before assessing the drawer:

- Branch or PR under review.
- Commit SHA.
- Browser or emulator name and version.
- Viewport: 390 x 844.
- Device mode: iOS Safari emulation or WebKit equivalent when available.
- Show id and first locked episode used.
- URL at first locked episode before unlocking: `/variant-b/watch/[showId]?episode=[lockedEpisode]`.
- URL after fake unlock/pass success: `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
- Screenshot evidence with the drawer open at the first locked episode.
- Screenshot evidence after closing the drawer, showing the user remains on the locked episode.
- Screenshot evidence after tapping the locked playback area to reopen the drawer.
- Console observations and fake-only network observations.

### Falsifiable safe-area checklist

All items below should pass for merge-readiness when the future P1 scope is explicitly authorized:

- [ ] At 390 x 844 iOS Safari emulation or WebKit equivalent, the Unlock Drawer opens on the first locked episode without page zoom, horizontal scroll, or clipped drawer content.
- [ ] The primary CTA, e.g. `Unlock EP X`, is fully visible without requiring the user to scroll the drawer.
- [ ] The full tappable bounds of the primary CTA are above the bottom safe-area inset or home-indicator region.
- [ ] The primary CTA text is not overlapped by the home indicator, browser toolbar, cookie/banner overlays, debug bars, sticky nav, or the drawer edge.
- [ ] The primary CTA has visually clear separation from the bottom edge; any padding is sufficient to avoid accidental system-gesture conflict.
- [ ] The secondary Story Pass CTA is visible enough to identify as secondary and does not displace or obscure the primary CTA.
- [ ] The Maybe later/close affordance remains reachable and does not require leaving the locked episode.
- [ ] Closing the drawer leaves the URL and page state on `/variant-b/watch/[showId]?episode=[lockedEpisode]`; it does not redirect Home or lose the episode parameter.
- [ ] Tapping the locked playback area reopens the drawer, and the reopened drawer still keeps the primary CTA fully visible above the safe-area inset.
- [ ] Rotating or reloading is not required to make the CTA visible.
- [ ] The locked state remains visually distinct from weak network, video failure, or generic error states.
- [ ] No login, recharge, PWA install prompt, real payment, real subscription, real backend, real entitlement, real analytics, or real Facebook integration appears before or inside this fake-only drawer evidence.

### Suggested pass/fail wording

A future reviewer may mark Q6 as pass only if the evidence shows:

```txt
PASS: On 390 x 844 iOS Safari/WebKit-equivalent evidence, the Unlock Drawer primary single-episode CTA is fully visible and fully tappable above the bottom safe-area/home-indicator region at the first locked episode, with no overlap, clipping, forced scroll-to-discover, Home redirect, episode loss, or real-service dependency.
```

Mark Q6 as fail if any of the following are observed:

- Primary CTA is partly below the visible viewport.
- Primary CTA overlaps the home indicator or browser/system chrome.
- Primary CTA can only be reached by scrolling when the drawer first opens.
- Closing or reopening the drawer changes show id, episode number, or route unexpectedly.
- The drawer evidence depends on real payment, login, backend entitlement, analytics, Facebook APIs, production secrets, or production services.
- The locked episode state is indistinguishable from an error state.

## Q24 proposal: future CI/browser/viewport matrix deltas beyond Phase 4G baseline

Question: What CI/browser matrix is required before a future production-readiness decision?

Proposed answer: no production-readiness matrix is authorized by this document. If P1 is later authorized, the matrix below should be treated as a proposal for additional evidence only. The Phase 4G P0 invariant remains the must-pass gate for every row that claims funnel readiness.

### Proposed additive future matrix

| Evidence row | Proposed browser/device target | Proposed viewport | Purpose | Relationship to Phase 4G |
| --- | --- | --- | --- | --- |
| P0 gate row | WebKit or Mobile Safari equivalent | 390 x 844 | Must pass the complete P0 ad-to-unlock path and Q6 safe-area CTA checklist. | Strengthens the existing primary Phase 4G mobile row. |
| P0 comparison row | Chromium mobile emulation | 390 x 844 | Detect Chromium/WebKit layout differences while preserving the same P0 path. | Additive to existing Chrome mobile-emulation baseline. |
| P0 evidence-capture row | Desktop Chrome responsive mode | 390 x 844 | Capture console/network evidence and screenshots for human review. | Keeps existing Phase 4G reviewer workflow. |
| Small-mobile stress row | WebKit or Chromium mobile emulation | 360 x 780 or nearest supported small device | Check drawer CTA does not become unreachable on narrower/tighter mobile screens. | Additive; cannot replace 390 x 844. |
| Tall-mobile sanity row | WebKit or Chromium mobile emulation | 393 x 852 or nearest modern iPhone-like viewport | Check safe-area behavior on nearby modern dimensions. | Additive; cannot replace 390 x 844. |
| Optional desktop smoke row | Desktop Chromium | 1280 x 720 | Confirm no catastrophic layout break outside mobile-first scope. | Same optional role as Phase 4G; never sufficient for P0 acceptance. |

### Proposed CI/browser deltas, if later authorized

These are proposals only, not instructions to edit CI:

- Keep the Phase 4G fake-only P0 harness as the gate that every future automated row must preserve.
- Add a WebKit/mobile-safe-area row only after the project explicitly approves CI/browser changes.
- Add screenshot retention for the first locked episode with drawer open at 390 x 844, so reviewers can verify Q6 visually.
- Add a focused assertion that the same locked episode returns with `unlocked=1` after fake unlock/pass; do not broaden this into real entitlement checks without separate approval.
- Add a non-production network/dependency guard that fails if evidence collection calls real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, production video, or secrets surfaces.
- Keep desktop-wide checks as smoke evidence only; they must never replace mobile P0 funnel evidence.

### Explicit non-authorizations

This annex does not authorize:

- Edits under `tests/`.
- Edits under `.github/workflows/`.
- Changes to `package.json`, lockfiles, Playwright config, browser install scripts, or dependency versions.
- Runtime code changes to Watch, Unlock Drawer, pass/options pages, routing, entitlement, payments, auth, analytics, video, backend, database, or Facebook integration.
- Production deployment, DNS/cutover, production secrets, paid services, or real user data.

### Future production-readiness framing

Before any later production-readiness decision, the matrix should be evaluated as evidence, not as approval. A production-readiness decision would still require separate human approval for hard-stop areas such as legal/compliance, content rights, payment/refund policy, real auth, real entitlement, real analytics/Facebook measurement, real video, secrets management, monitoring, rollback, support operations, and production deployment.

## Reviewer use

Use this annex as a planning checklist when drafting later P1 QA tasks. For current Phase 5A scope, the only expected output is this documentation proposal. Any implementation, CI enablement, browser matrix change, or test change must be created as a separate future task with explicit authorization.
