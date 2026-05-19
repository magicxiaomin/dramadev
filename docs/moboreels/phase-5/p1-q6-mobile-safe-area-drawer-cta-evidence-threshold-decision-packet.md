# Phase 5 P1 Q6 Decision Packet — Mobile Safe-Area Drawer CTA Visibility Evidence Threshold

STATUS: requirements decision packet only; docs-only / fake-only / non-implementation; proposal pending human product confirmation.

This packet does not authorize any implementation, including but not limited to: runtime/source code changes, fixtures, unit/integration/Playwright tests, CI workflow changes, browser-matrix enablement, package or lockfile or manifest edits, service worker / PWA manifest / icon work, dependency installs, production browser/device matrix execution, deployment, DNS, secrets management, legal/compliance review, real analytics (including Pixel/CAPI), or real integrations (Facebook APIs, payment, subscription, login, entitlement, backend, database, video provider).

P0 invariant preserved verbatim as one line:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` line 14 — "What evidence threshold should define merge-readiness for mobile safe-area drawer CTA visibility?"

## Goal

Define a concrete, fake-only, docs-only evidence threshold that any future P1 change touching the locked episode, Unlock Drawer, CTA stack, viewport, or safe-area styling must meet before a human reviewer can mark mobile safe-area drawer CTA visibility as merge-ready. The threshold must remain strictly subordinate to the P0 first-lock Unlock Drawer conversion moment and the same-episode fake unlock/pass return; it must not introduce, weaken, or reinterpret any P0 acceptance behavior.

## Context

- Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.
- Secondary source: `docs/moboreels/prototype-b-spec.md` (defers implementation PRD detail to the SceneFlow PRD).
- Question source: `docs/moboreels/phase-4g/phase-5-questions.md` line 14.
- Existing proposal context: `docs/moboreels/phase-5/p1-decision-brief.md` Q6 section (lines 135-149) and `docs/moboreels/phase-5/p1-evidence-readiness.md` Q6 section (lines 59-115).
- Phase 4G QA baseline reference: `docs/moboreels/phase-4g/qa-readiness.md`, `docs/moboreels/phase-4g/evidence-template.md`, `docs/moboreels/phase-4g/known-gaps.md`.

This packet is additive to the Phase 4G QA baseline and does not replace it. It does not require changing the Phase 4G evidence package, the PR #23 Playwright harness, the existing CI configuration, dependency versions, or any runtime artifact.

## PRD sections reviewed

Direct anchors used to construct the threshold below. Line numbers refer to `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` as of this packet's authorship.

- §1 Status, lines 3-10: implementation target Mobile PWA / Web prototype; primary viewport iPhone-like mobile viewport, approximately 390 x 844.
- §2 Product Decision Summary, lines 14-37: core ad journey and default ad landing route `/variant-b/watch/[showId]?episode=1&source=facebook`.
- §3 Non-Goals, lines 41-58: no login before free preview, no PWA install prompt before first playback, no recharge or Story Pass promotion before first lock, no real payment/subscription/Facebook APIs/video, no competitor assets, Story Pass not primary on first locked episode.
- §6 P0 User Flow (referenced via §2 summary and §11 P0 Scope): Facebook ad → EP1 → free chain → first locked episode → Unlock Drawer → fake unlock/pass → same episode with `unlocked=1`.
- §8.3 First Locked Episode State, lines 301-308: locked playback area shows clear locked state; locked state must not look like a network error; Unlock Drawer opens automatically on first entry; closing the drawer keeps the Watch page locked; tapping the locked playback area reopens the Unlock Drawer.
- §8.4 Unlock Drawer, lines 310-325: drawer must show story hook, drama title, episode number, balance, cost, primary CTA `Unlock EP X`, secondary CTA `Get Story Pass`, tertiary `Maybe later / close`, and the same-episode return explanation.
- §8.4 Recommended hierarchy, lines 327-371: visible CTA wording — primary `Unlock EP X`, secondary `Get Story Pass`, tertiary `Maybe later`.
- §9 PWA Requirements, lines 538-562: PWA install prompt must not interrupt first playback; PWA UI must consider iOS safe area, bottom drawer safe area, standalone mode return paths, weak network state distinct from locked state, offline state distinct from locked state.
- §11 P0 Scope: single-episode unlock primary, Story Pass secondary, same-episode return.
- §15 QA Acceptance Checklist, lines 744-777: includes "Mobile safe area does not cover drawer CTA" (line 776) and "Locked state is visually distinct from weak network / video error state" (line 777); also includes same-episode return with `unlocked=1` (lines 770-773).

Additional trace anchors for the requested topics:

- Mobile safe-area: §1 primary viewport line 10; §9 PWA Requirements safe-area lines 556-560; §15 acceptance line 776.
- Unlock Drawer: §8.3 lines 301-308 and §8.4 lines 310-325 and 327-371.
- No prompt before free preview: §3 Non-Goals lines 50-53; §9 PWA Requirements lines 540-545; §15 acceptance lines 750-752.
- First-lock behavior: §8.3 lines 301-308 and §15 acceptance lines 755-764.
- Same-episode return: §8.4 line 324 (explanation) and §15 acceptance lines 770-773.

## P0 scope

The P0 scope this packet protects is unchanged and is not negotiated here. The threshold defined in this packet is an additive, fake-only evidence gate; it must not override, reinterpret, or relax any P0 behavior.

The relevant P0 behaviors that the threshold sits on top of:

- Facebook ad landing route opens Watch EP1 at `/variant-b/watch/[showId]?episode=1&source=facebook` without redirect to Home, Search, Genre, or Show Detail.
- Free preview episodes remain available without login, recharge, PWA install prompt, Story Pass promotion, real payment, or real subscription.
- The first locked episode opens the Unlock Drawer automatically; closing the drawer leaves the user on the locked episode; tapping the locked playback area reopens the drawer.
- The Unlock Drawer presents drama title, locked episode number, mock balance, mock cost, primary single-episode unlock CTA, secondary Story Pass CTA, and `Maybe later / close`.
- Single-episode unlock is primary; Story Pass is secondary on the first locked episode.
- Fake unlock and fake Story Pass paths return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` without losing show or episode context.
- Locked state remains visually distinct from weak-network or video-error states.

The Q6 threshold is subordinate to these P0 behaviors. Any safe-area evidence collected under this packet must accompany — not substitute for — confirmation of the P0 first-lock conversion moment and the same-episode `unlocked=1` return.

## P1/P2 deferred scope

The following remain explicitly out of scope for this packet and are deferred behind their existing approval gates:

- Real Facebook redirect/API, Pixel/CAPI, production analytics, consent, dedupe, and data handling — hard-stop approval required.
- Real payment, subscription, login, entitlement, wallet ledger, refunds/cancellation, backend/database, production access control — hard-stop approval required.
- Real video provider, hosting, playback implementation, network/error handling implementation — hard-stop approval required.
- Service worker, PWA manifest, app icon set, or installability changes — not authorized by this packet.
- Production browser/device matrix execution, CI workflow changes, Playwright/browser/dependency changes — not authorized by this packet; see the additive proposals in `p1-evidence-readiness.md` Q24 for planning context only.
- Multi-episode story-hook coverage, broader mobile viewport matrix beyond the primary viewport, non-EP1 ad-creative deep-linking — optional later P1 proposals, not P0 requirements.
- Licensed or competitor assets — disallowed unless human/legal approval explicitly clears content rights.

## Non-scope

- No implementation work of any kind.
- No edits to PRD or roadmap.
- No runtime/source code, fixtures, tests/CI, or Playwright changes.
- No package/lockfile/manifest/service-worker/icon changes.
- No real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work.
- No production infrastructure or NovelHub production implementation.
- No legal, compliance, brand, licensed-content, or competitor-asset decisions.
- No execution of any browser/device matrix; this packet only defines the evidence threshold a human reviewer would apply if a future P1 change is later authorized.

## Assumptions

- "Merge-readiness" in this packet refers strictly to documentation/review readiness for a fake-only P1 change that a human reviewer is asked to assess. It does not imply CI gate implementation, automated assertion, or production release readiness.
- The primary target viewport is the PRD-defined iPhone-like mobile viewport, approximately 390 x 844 (PRD §1 line 10). Additional viewports listed below are optional, additive sanity checks and never substitutes for the primary viewport.
- "Drawer CTA visibility" refers to the Unlock Drawer's primary CTA (`Unlock EP X` per PRD §8.4 lines 348-352), with secondary `Get Story Pass` (lines 354-358) and tertiary `Maybe later` (lines 366-370) also assessed for non-obstruction.
- Evidence captured under this threshold is fake-only: balances, costs, unlock outcomes, and the `unlocked=1` return parameter are all mock signals, not real entitlement.
- No real device fleet, paid service, real Facebook traffic, or production telemetry is required, expected, or authorized to satisfy this threshold.
- This packet does not create or modify any reviewer role, approver list, or merge-permission scheme.

## Acceptance criteria

This decision packet itself is acceptable when all of the following hold:

- The packet is clearly marked docs-only / fake-only / non-implementation and pending human product confirmation.
- The P0 invariant string is reproduced verbatim on a single line.
- The packet contains, in order, the sections: Goal, Context, PRD sections reviewed, P0 scope, P1/P2 deferred scope, Non-scope, Assumptions, Acceptance criteria, Validation plan, Risks / gates, Recommended task graph, Open non-blocking questions.
- A concrete merge-readiness threshold is defined, including target viewport(s), drawer CTA visibility/non-obstruction rules, screenshot/browser evidence expectations, and PASS/FAIL criteria.
- The threshold is explicitly subordinate to the P0 first-lock Unlock Drawer conversion moment and the same-episode fake unlock/pass return.
- PRD section/line anchors are cited for mobile safe-area (primary viewport and PWA/safe-area lines), Unlock Drawer, no prompt before free preview, first-lock behavior, and same-episode return.
- The packet explicitly disclaims authorization for implementation, test/CI changes, production browser/device matrix execution, service worker / manifest / icon work, deployment, DNS, secrets, legal/compliance, real analytics, and real integrations.
- The packet does not edit any other file and is not committed or merged by this task.

### Concrete fake-only merge-readiness threshold (proposal)

This subsection states the threshold itself. It is a proposal pending product confirmation and remains entirely within the docs-only / fake-only / non-implementation scope above. It is subordinate to the P0 first-lock Unlock Drawer conversion moment and the same-episode fake unlock/pass return.

#### Target viewport(s)

- Primary, required: PRD-defined iPhone-like mobile viewport, approximately 390 x 844 (PRD §1 line 10). This is the only viewport whose evidence is sufficient on its own for the threshold's primary visibility claim.
- Optional, additive sanity (never substitutes for the primary viewport):
  - Small-mobile sanity: approximately 360 x 780 or nearest supported small mobile emulation.
  - Tall-mobile sanity: approximately 393 x 852 or nearest modern iPhone-like emulation.
- Optional, smoke only: desktop responsive mode at the primary viewport dimensions for screenshot/console capture. Desktop wide viewports remain smoke only and never satisfy the threshold.

Browsers/emulation framing (planning only, no execution authorized here): iOS Safari emulation or a WebKit-equivalent at the primary viewport; Chromium mobile emulation as a comparison view; both used by a human reviewer manually, not by a new automated harness introduced by this packet.

#### Drawer CTA visibility / non-obstruction rules

Evaluated at the first locked episode with the Unlock Drawer open (PRD §8.3 lines 301-308; §8.4 lines 310-325):

1. The Unlock Drawer opens automatically on first entry to the locked episode without page zoom, horizontal scroll, or clipped drawer content.
2. The primary CTA `Unlock EP X` (PRD §8.4 lines 321 and 348-352) is fully visible — both the label text and the full tappable bounds — in the initial drawer state, without requiring the user to scroll within the drawer to discover it.
3. The full tappable bounds of the primary CTA sit above the bottom safe-area inset / iOS home-indicator region (PRD §9 lines 556-560).
4. The primary CTA is not overlapped or visually adjoined to the home indicator, browser toolbar, sticky nav, debug bars, cookie/consent overlays, or the drawer edge in a way that would risk mis-taps or system-gesture conflict.
5. The secondary CTA `Get Story Pass` (PRD §8.4 lines 322 and 354-358) is visible enough for the reviewer to identify it as secondary and does not displace, obscure, or visually outrank the primary CTA (PRD §3 line 53; §11 P0 Scope CTA hierarchy).
6. The tertiary `Maybe later / close` affordance (PRD §8.4 lines 323 and 366-370) remains reachable and does not require leaving the locked episode.
7. Closing the drawer leaves the URL and page state on `/variant-b/watch/[showId]?episode=[lockedEpisode]` without redirect to Home, Search, Genre, or Show Detail and without losing the episode parameter (PRD §8.3 line 307).
8. Tapping the locked playback area reopens the drawer (PRD §8.3 line 308), and on reopen the primary CTA is again fully visible above the safe-area inset.
9. The user does not have to rotate, reload, or resize the viewport to make the primary CTA visible.
10. Locked state remains visually distinct from weak-network, offline, video-error, or generic-error states (PRD §9 lines 561-562; §15 line 777).
11. No login, recharge, PWA install prompt, real payment, real subscription, real backend, real entitlement, real analytics, or real Facebook integration appears at any point in the fake-only evidence (PRD §3 lines 50-53; §9 lines 540-545; §15 lines 750-752).
12. Mock balance and mock cost are visible inside the drawer (PRD §8.4 lines 319-320 and 343-346); no balance or recharge prompt appears before reaching the first locked episode (PRD §3 line 52).

#### Screenshot / browser evidence expectations

The reviewer should be able to assemble the following from a human-driven, fake-only review session at the primary viewport. No new automated capture harness is authorized by this packet.

- Branch or PR identifier and commit SHA under review.
- Browser or emulator name and version; explicit note that no real iOS device is required.
- Viewport: 390 x 844 (primary); plus any optional additive viewport actually exercised.
- Device mode: iOS Safari emulation or WebKit-equivalent when available.
- Show id and first locked episode used (from the existing fake fixtures; no new fixtures authorized by this packet).
- URL at the first locked episode before any unlock action: `/variant-b/watch/[showId]?episode=[lockedEpisode]`.
- URL after fake unlock/pass success: `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` (PRD §15 lines 770-773).
- Screenshot 1: first locked episode with Unlock Drawer open, primary CTA fully visible above safe-area inset.
- Screenshot 2: drawer closed, user remains on the same locked episode and URL.
- Screenshot 3: after tapping the locked playback area, the drawer is reopened with primary CTA still fully visible above the safe-area inset.
- Screenshot 4: after fake unlock or fake Story Pass success, the same episode is shown with `unlocked=1` appended; no Home redirect, no episode loss.
- Console observations: no real-network calls to Facebook APIs, payment providers, analytics endpoints, login/auth providers, or production backend; no errors that suggest a real integration was attempted.
- Fake-only network observations: requests confined to local/static fixtures consistent with the existing fake-only scope.
- Negative-case notes: confirmation that no PWA install prompt, no login prompt, no recharge prompt, no Story Pass promotion appeared before the first locked episode.

#### PASS / FAIL criteria

PASS (proposed wording):

```txt
PASS: At the PRD-defined primary mobile viewport (approximately 390 x 844) using iOS Safari emulation or a WebKit-equivalent, the Unlock Drawer opens automatically at the first locked episode; the primary single-episode unlock CTA is fully visible and fully tappable above the bottom safe-area / home-indicator region with no overlap, clipping, or required scroll-to-discover; the secondary Story Pass CTA is visibly secondary; the tertiary Maybe later / close is reachable; closing the drawer keeps the user on the same locked episode and URL; tapping the locked playback area reopens the drawer with the primary CTA again fully visible above the safe-area inset; fake unlock or fake Story Pass returns to the same episode with `unlocked=1` without loss of show or episode context; the locked state is visually distinct from weak-network, offline, or video-error states; and no login, recharge, PWA install prompt, real payment, real subscription, real backend, real entitlement, real analytics, or real Facebook integration is exercised at any point.
```

FAIL — any one of the following is sufficient to fail the threshold:

- The primary CTA is partly below the visible viewport in the initial drawer state.
- The primary CTA overlaps the home indicator, browser/system chrome, sticky nav, cookie/consent overlay, or debug bar.
- The primary CTA can only be reached by scrolling within the drawer when it first opens.
- The secondary `Get Story Pass` CTA is visually equal to or outranks the primary CTA on the first locked episode, contradicting PRD §3 line 53 and §11 CTA hierarchy.
- The tertiary `Maybe later / close` is not reachable, or activating it leaves the locked episode unexpectedly.
- Closing the drawer redirects the user away from `/variant-b/watch/[showId]?episode=[lockedEpisode]` or loses the episode parameter.
- Tapping the locked playback area does not reopen the drawer, or the reopened drawer does not present the primary CTA fully visible above the safe-area inset.
- The reviewer must rotate, reload, or resize the viewport to make the primary CTA visible.
- Fake unlock or fake Story Pass does not return to the same episode with `unlocked=1`, or it sends the user Home, or it loses show/episode context.
- The locked state is visually indistinguishable from a weak-network, offline, or video-error state.
- Any login prompt, recharge prompt, Story Pass promotion, or PWA install prompt appears before the first locked episode.
- The evidence depends on, or incidentally exercises, real payment, real subscription, real login, real entitlement, real Facebook API, real Pixel/CAPI, real analytics, real video provider, real backend/database, production secrets, or paid services.
- Licensed or competitor assets appear anywhere in the evidence.

If any FAIL condition is present, the threshold is not met regardless of the count of PASS items; the threshold is conjunctive, not weighted.


## Validation plan

This is a documentation validation only. No code execution, test execution, or CI invocation is part of this validation plan.

1. Read this packet end to end and confirm the status line, the verbatim P0 invariant on a single line, and the non-authorization disclaimer all appear near the top.
2. Confirm that each PRD anchor cited in "PRD sections reviewed" corresponds to the relevant content in `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`, including §1 line 10 (primary viewport), §3 non-goals (free-preview-first, no PWA prompt before first playback), §8.3 first locked episode behavior, §8.4 Unlock Drawer content and CTA hierarchy, §9 PWA safe-area requirements, and §15 acceptance items at lines 776-777 and 770-773.
3. Confirm the concrete threshold subsection defines target viewport(s), drawer CTA visibility/non-obstruction rules, screenshot or browser evidence expectations, and PASS/FAIL criteria.
4. Confirm the threshold remains subordinate to P0 first-lock conversion and same-episode `unlocked=1` return — i.e., any safe-area PASS requires evidence that the P0 path is intact.
5. Confirm "Non-scope" and "Risks / gates" sections list the categories the user instructed must remain unauthorized (implementation, tests/CI, production matrix execution, service worker / manifest / icon, deployment, DNS, secrets, legal/compliance, real analytics, real integrations).
6. Confirm no other file is added or modified by this task.

## Risks / gates

- Product confirmation gate: this threshold is a proposal until a human product owner confirms it.
- Scope creep gate: the threshold must not be used to justify CI, browser matrix, Playwright, dependency, or runtime changes. Those require separate, explicit authorization.
- P0 protection gate: any evidence that would imply weakening the P0 invariant (e.g., redirect to Home, loss of episode context, recharge prompt before lock, PWA prompt before first playback) automatically fails this threshold even if all visibility items pass.
- Fake-only gate: any evidence that depends on real payment, real subscription, real login, real entitlement, real Facebook API, real Pixel/CAPI, real analytics, real video provider, real backend/database, production secrets, or paid services is out of scope and fails this threshold.
- Legal/asset gate: evidence must not introduce licensed or competitor assets, posters, titles, or copy.
- Device matrix gate: production device matrices, real iOS hardware, and real iOS Safari are not authorized by this packet; only emulation/WebKit-equivalent at the documented viewport(s) is described, and even that is described only for the human reviewer's checklist, not for execution by this task.
- PWA infrastructure gate: this threshold does not modify or evaluate the service worker, web app manifest, app icon assets, or installability surface; any such change requires a separate authorization.

## Recommended task graph

1. Product owner reviews this packet and confirms or rejects the proposed merge-readiness threshold for mobile safe-area drawer CTA visibility.
2. If confirmed, a separate docs-only task may transcribe the falsifiable checklist into the Phase 4G evidence template appendix without changing the existing template's P0 baseline.
3. A separate QA task — only after explicit authorization — may apply the checklist by hand to a future fake-only P1 change touching the drawer, locked episode, or safe-area styling, and record the resulting evidence in a new artifact file under `docs/moboreels/phase-5/`.
4. Any CI, browser-matrix, Playwright, or dependency change implied by future automation of this checklist must be raised as a separate authorization request and is not implied by this packet.
5. Any real-system work (Facebook API, payment, subscription, login, entitlement, backend, database, real video, production analytics, production deploy, DNS, secrets) remains blocked behind its existing hard-stop approval task and is not affected by this packet.

## Open non-blocking questions

- Should the proposed merge-readiness threshold be promoted from proposal to confirmed product decision and, if so, who is the named approver?
- Should the additive small-mobile (e.g., approximately 360 x 780) and tall-mobile (e.g., approximately 393 x 852) sanity rows be retained as "optional" or upgraded to "required" if a future P1 explicitly touches safe-area styling?
- Should a future fake-only standalone-mode PWA visual sanity check be included only after service worker / manifest work is explicitly authorized separately?
- Should the PASS wording reference a specific copy of the primary CTA (e.g., `Unlock EP X`) or remain generic to avoid coupling to future copy changes?
- Should the same-episode `unlocked=1` post-unlock screenshot be required as part of the Q6 evidence bundle, or remain part of the broader P0 evidence bundle only?

---


End of packet. This document is requirements material only and does not authorize implementation, test/CI work, production matrix execution, service worker / manifest / icon changes, deployment, DNS, secrets, legal/compliance, real analytics, or real integrations.
