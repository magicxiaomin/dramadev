# Phase 5 P1 Q5 Decision Packet — PWA install education timing default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q5: when PWA install education should appear in the SceneFlow MVP Facebook-ad conversion flow.

Recommended default, pending product confirmation: defer PWA install education until after fake unlock success or second visit. Do not show PWA install education at the first lock in the default P1 path.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q5, line 13: "Should PWA install education appear after reaching the lock, after fake unlock success, on second visit, or not until later?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q5, lines 119–133, proposes deferring PWA install education until after fake unlock success or second visit, and not showing it at first lock in the default P1 path. That proposal remains pending human product confirmation.

This packet narrows Q5 into requirements, acceptance criteria, validation methods, assumptions, and gates for a later fake-only additive review. It does not approve implementation.

No user input is required to proceed with this requirements packet because it preserves the current PRD funnel and does not materially expand scope. User/product input becomes required before implementation, or if someone proposes showing PWA education before first playback, during free preview, at the first lock before the Unlock Drawer decision is complete, or as a real install/browser/platform integration.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20–37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43–58: no Home/Search/Show Detail first, no login before free preview, no PWA install prompt before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60–78: the user clicked a Facebook ad to continue watching a specific drama, does not want to register/search/browse first, is willing to watch free episodes, and decides whether to unlock or purchase only after reaching a locked episode.
- PRD §5 Core Product Principles, lines 80–140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §5.2 Free preview first, lines 86–89: free episodes must play without login, recharge, PWA install prompts, or subscription prompts.
- PRD §5.6 Return to same episode, lines 130–140: after mock unlock or purchase, return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`; do not return Home, lose episode parameter, or require the user to find the drama again.
- PRD §6 P0 User Flow, lines 142–158: user lands on EP1, continues through free episodes, reaches first locked episode, sees locked state and Unlock Drawer, may choose `Unlock EP X` or `Get Story Pass`, then fake unlock/pass returns to the same episode with `unlocked=1`.
- PRD §7 Route Requirements, lines 160–209: watch landing route, locked episode route, unlocked return route, and pass route preserving story/episode context.
- PRD §8.1 Watch Page, lines 212–260: Watch is the primary Facebook ad landing page, must not show PWA install prompt before free playback, and free episode completion routes to free playback or locked flow.
- PRD §8.3 First Locked Episode State, lines 293–308: lock trigger condition, locked state requirements, drawer auto-open on first entry, drawer close leaves page locked, and locked playback tap reopens drawer.
- PRD §8.4 Unlock Drawer, lines 310–364: drawer must show current story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, tertiary close, and return-to-episode explanation.
- PRD §8.5–§8.6, lines 404–486: Story Pass / unlock options and unlock success return must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §8.8 Home / Search / Genre, lines 512–537: Home is useful for second visit and natural traffic but is not the P0 conversion funnel.
- PRD §9 PWA Requirements, lines 538–562: PWA install prompt must not interrupt first playback; do not show immediately on page load, before EP1 starts, or during the first free episode; P1 trigger moments may include after 2 episodes, after first lock, after unlock success, on second visit, or after follow/continue-watching action; PWA UI must consider safe area and standalone return paths.
- PRD §10 Metrics, lines 564–610: primary funnel ends with mock unlock success and post-unlock episode played; PWA install rate is not a P0 success metric.
- PRD §11 P0 Scope, lines 612–631: P0 requires no first-playback PWA install prompt and preserves the first-lock/drawer/mock-unlock/same-episode flow.
- PRD §12 P1 Scope, lines 633–649: P1 may include iOS Add to Home Screen instruction and PWA install prompt after high-intent actions.
- PRD §13 P2 Scope, lines 650–665 and §14 Out of Scope, lines 731–743: real video/backend/login/payment/subscription/entitlement/analytics/Facebook CAPI remain deferred/out of scope.
- PRD §15 QA Acceptance Checklist, lines 744–777: P0 path must open EP1, preserve free preview, avoid PWA prompt during free episodes, open Unlock Drawer at first lock, preserve same-episode fake unlock/pass return, and keep drawer CTA visible in mobile safe area.
- PRD §16 Open Questions, line 787: asks whether the PWA install prompt should appear after reaching lock or only after unlock success.
- Prototype B spec, lines 1–3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q5 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, or Show Detail.
- Free preview comes before login, recharge, subscription, Story Pass promotion, payment-like prompts, or PWA install prompts.
- The per-drama lock point remains controlled by `freeEpisodes`.
- The first locked episode opens the Unlock Drawer and stays focused on the unlock/pass decision.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- PWA install education must not appear before first playback, during the first free episode, during the free episode chain in a way that interrupts watch-first/free-preview-first, or before the first-lock drawer decision is visible.
- Fake single-episode unlock and fake Story Pass purchase both return to the same episode with `unlocked=1`; users are not returned Home and do not lose episode context.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Any implementation of PWA install education UI, browser install prompt handling, iOS Add to Home Screen instruction, standalone mode detection, local persistence, second-visit detection, fixtures, tests, CI, Playwright evidence, or runtime state changes.
- Showing PWA education immediately after reaching the first lock in the default path.
- Showing PWA education after first-lock drawer dismissal via `Maybe later`; this remains an alternate option requiring product confirmation and separate acceptance criteria.
- PWA education after follow/continue-watching action, after two watched episodes, or other high-intent moments not explicitly confirmed for this Q5 default.
- Broader PWA retention strategy, install copy, icons, manifest changes, service worker behavior, offline behavior, and standalone-mode return-path implementation.

P2 / hard-stop-gated scope:

- Real browser/platform install integration beyond fake-only education copy, production PWA deployment, production analytics/attribution for install events, consent/data handling, push notifications, account/login coupling, backend/database persistence, real entitlement, payment/subscription, Facebook APIs, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Any legal, compliance, privacy, consent, brand-significant install claim, platform policy, App Store/Play Store, notification, tracking, or data-retention decision.
- Licensed, competitor, third-party, stock, public-domain, or externally sourced assets/copy without explicit human/legal/product approval.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Showing any PWA install education before first playback, during first free playback, or in a way that distracts from first-lock Unlock Drawer conversion.
- Real install prompt integration, service worker changes, manifest/icon changes, push notification work, production analytics, consent/data handling, deployment, DNS, secrets, or platform-store work.
- Real payment, real subscription, real login, real entitlement, real backend/database/API, real Facebook integration, real video infrastructure, production deploy/DNS/secrets, or paid services.
- Legal/compliance/privacy/platform-policy/brand-significant install decisions.
- Licensed, competitor, or uncleared assets.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q5 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q5 becomes an approved default, even though this packet follows the proposed PRD-preserving default.
- PWA install education is a retention/returning-user aid, not part of the P0 first-lock conversion metric.
- First lock is the core monetization decision point; adding PWA education there risks diluting `Unlock EP X` / `Get Story Pass` decision clarity.
- "After fake unlock success" means after same-episode return with `unlocked=1` has occurred or after clearly visible unlock-success feedback; it must not intercept the unlock/pass action before same-episode return is proven.
- "Second visit" means a later fake-only returning-user context and must not redirect first-session Facebook-ad traffic to Home before the P0 funnel completes.
- `unlocked=1` remains fake-only review state and is not entitlement.
- No user input is required unless timing, material scope, real-system scope, legal/compliance/privacy posture, or platform install behavior is proposed to change.

## Recommendation

Approve as proposal for product review: defer PWA install education until after fake unlock success or second visit; do not show install education at first lock in the default P1 path.

Rationale:

1. The PRD protects watch-first and free-preview-first behavior and explicitly forbids PWA install prompts before first playback.
2. First lock is already the highest-risk conversion decision point: the user must understand the locked episode, price, balance, single-episode unlock, Story Pass, and same-episode return behavior.
3. PWA install rate is not a P0 success metric; the P0 evidence path should prioritize first-lock conversion and post-unlock episode played.
4. Post-unlock success is a high-intent moment after the user has already seen the value exchange and after the same-episode return invariant can be preserved.
5. Second visit is a natural retention moment that aligns with the PRD's auxiliary Home/returning-user role without interrupting the first-session Facebook-ad funnel.

Alternate options:

- After reaching first lock: allowed by PRD as a possible P1 trigger, but not recommended as the default because it competes with the Unlock Drawer decision and first-lock conversion evidence.
- After first-lock drawer dismissal via `Maybe later`: safer than interrupting the drawer, but still risks distracting from locked-episode context and requires separate product confirmation.
- After watching two episodes: PRD-permitted, but if it appears before the first locked episode it may interrupt the free episode chain and should be evaluated separately.
- After follow or continue-watching action: PRD-permitted high-intent moment, but it depends on future fake-only follow/continue-watching scope not confirmed by this packet.
- Not until later/no P1 PWA education: safest for P0 focus, but may postpone useful retention education; can remain a fallback if product is not ready to approve timing.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q5.
3. Q5 default is stated as proposal only: defer PWA install education until after fake unlock success or second visit; do not show it at first lock in the default P1 path.
4. The packet explicitly states that Q5 does not authorize runtime code, fixture, test/CI, PRD, roadmap, real integration, production infrastructure, asset, legal, compliance, privacy, platform-policy, install, analytics, deployment, or brand-significant work.
5. PRD anchors include non-goals, free-preview-first, same-episode return, Watch page pre-playback prohibitions, PWA requirements, metrics, P0/P1 scope, and QA checklist.
6. The packet explicitly states no user input is required unless timing, material scope, real-system scope, legal/compliance/privacy posture, or platform install behavior changes.
7. Product confirmation remains an explicit gate before treating the default as approved.

Future fake-only additive review acceptance criteria, if later authorized:

1. The review starts at `/variant-b/watch/[showId]?episode=1&source=facebook` and preserves the full P0 invariant through the first locked episode, Unlock Drawer, fake unlock/pass, and same episode with `unlocked=1`.
2. No PWA install education, install banner, install drawer, modal, toast, interstitial, browser prompt, Add to Home Screen instruction, notification prompt, or install-like CTA appears immediately on page load, before EP1 starts, during the first free episode, or before free playback begins.
3. Free episodes remain playable without login, recharge, Story Pass promotion, subscription, payment-like prompt, PWA install education, or other pre-lock prompt that blocks watch-first/free-preview-first behavior.
4. If any PWA education is present in the future fake-only review, it does not appear at first lock before the Unlock Drawer is visible and the primary/secondary unlock decision is available.
5. The first locked episode, defined as `freeEpisodes + 1`, opens the Unlock Drawer with no PWA education stealing focus from locked state, `Unlock EP X`, `Get Story Pass`, fake balance/cost, or return-to-this-episode helper copy.
6. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1` and resumes the same episode context before any post-unlock PWA education can be considered complete.
7. Fake Story Pass purchase also returns to the same locked episode with `unlocked=1`; it does not return Home, stay stranded on the Pass page, lose the `episode` parameter, or require the user to find the drama again.
8. If post-unlock PWA education is reviewed, it appears only after unlock-success feedback or same-episode unlocked playback state is visible, and it must be dismissible without losing episode context.
9. If second-visit PWA education is reviewed, it appears only in a returning-user context and does not retroactively change the first-session Facebook-ad route, free preview chain, first-lock drawer behavior, or same-episode return.
10. Any PWA education copy is clearly educational/fake-only and must not imply real installation, account persistence, offline availability, push notification, payment, subscription, entitlement, or production analytics behavior unless separately approved.
11. PWA education must not cover or obscure the Unlock Drawer primary or secondary CTA, especially in the target 390 x 844 mobile viewport and bottom safe-area contexts.
12. Closing/dismissing PWA education keeps the user on the same drama and episode context; it must not send the user to Home, Search, Genre, Show Detail, external app stores, platform settings, or a different route unless separately approved.
13. The review remains fake-only and must not call, stub, depend on, or simulate real payment, subscription, login, Facebook API, analytics, backend, database, wallet ledger, entitlement, video provider, production deployment, DNS, secrets, service worker, push notification, app-store, or licensed/competitor asset behavior.
14. Any proposal to show PWA education at first lock by default, before unlock success, before the drawer decision is visible, or during free preview is a material timing change and must return to product/requirements review before implementation can be considered.
15. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage.

## Validation plan

1. Read this packet and confirm the status line says docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. Confirm the exact P0 invariant appears as a single unchanged line.
3. Confirm the recommended Q5 default is post-fake-unlock-success or second-visit PWA education, with no install education at first lock in the default P1 path.
4. Confirm every Q5 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. Confirm PRD anchors include §3 Non-Goals, §5.2 Free preview first, §5.6 Return to same episode, §8.1 Watch Page prohibitions, §9 PWA Requirements, §10 Metrics, §11 P0 Scope, §12 P1 Scope, and §15 QA Acceptance Checklist.
6. Confirm future acceptance criteria forbid PWA education before first playback and at first lock before the Unlock Drawer decision is visible.
7. Confirm future acceptance criteria require post-unlock PWA education, if reviewed, to happen only after same-episode return/unlock-success feedback and to remain dismissible without losing drama/episode context.
8. Confirm future acceptance criteria require second-visit PWA education, if reviewed, to remain outside the first-session P0 funnel and not redirect first-session Facebook-ad traffic away from Watch.
9. Confirm the packet does not instruct implementation, tests, CI, fixture changes, PRD edits, roadmap edits, production deployment, real integrations, service worker/push/browser install behavior, secrets, legal/compliance/privacy/platform-policy decisions, asset adoption, or NovelHub production infrastructure.
10. Confirm product confirmation is still required before treating this as an approved product decision, and that user/product input is only required for timing/material-scope changes.

## Risks / gates

- Product decision gate: product must explicitly confirm whether post-unlock-success or second-visit PWA education is approved as the P1 default, rejected, or replaced by a separately scoped timing experiment.
- Funnel-distraction risk: first-lock PWA education could compete with the Unlock Drawer decision and reduce clarity around `Unlock EP X` / `Get Story Pass`.
- P0 regression risk: Q5 must not redirect users, require login before free preview, show prompts before free preview, interrupt the free episode chain, skip the drawer, obscure drawer CTAs, or return post-unlock users away from the same episode.
- Safe-area/viewport risk: any future PWA education must not cover drawer CTAs or unlocked playback controls in the target mobile viewport and bottom safe-area contexts.
- Platform/privacy/legal gate: real install prompts, browser/platform integration, push notifications, service worker/offline claims, consent/data handling, tracking/analytics, or platform policy decisions require explicit human/legal/product approval.
- Data/backend gate: real user persistence, second-visit detection beyond fake-only/local review state, backend APIs, databases, analytics, Pixel/CAPI, or Facebook integrations remain hard-stop-gated.
- Entitlement/security gate: post-unlock education must not confuse `unlocked=1` fake review state with account persistence, entitlement, or real installed-app access.
- Implementation gate: any code, fixture, test, CI, browser evidence, service worker, manifest, icon, deployment, or infrastructure work requires a separate authorized task after requirements approval.

## Recommended task graph

1. Product owner reviews Q5 and confirms one of:
   - approve post-fake-unlock-success or second-visit PWA education as the P1 default;
   - approve only post-fake-unlock-success and defer second-visit behavior;
   - approve only second-visit PWA education and defer post-unlock behavior;
   - reject and request a separately scoped first-lock or other timing proposal;
   - defer Q5 and keep only the existing PRD prohibition on first-playback PWA prompts.
2. If Q5 is approved, requirements creates a narrowed fake-only implementation-ready acceptance note for dev/QA, still preserving the P0 invariant and explicitly stating no real install/platform behavior.
3. Architecture/feasibility gate: before implementation, review where fake-only post-unlock or second-visit state may live without backend, analytics, login, entitlement, service worker, or production persistence.
4. If authorized, dev implements only fake-only/local education timing and copy, ensuring it appears after same-episode unlock success or in a second-visit context and never at first lock by default.
5. If authorized, QA adds an additive fake-only regression or review checklist that verifies no pre-playback/free-preview/first-lock PWA prompt, same-episode return before post-unlock education, dismissibility, and safe-area non-obstruction.
6. Any real PWA install prompt integration, service worker/offline behavior, push notifications, production analytics, login/account persistence, backend/database, deployment/DNS/secrets, payment/subscription/entitlement, Facebook API/video work, or NovelHub production work remains separate and hard-stop-gated.

## Open non-blocking questions

- Does product confirm post-fake-unlock-success and second visit as co-equal P1 default trigger moments, or should one be preferred first?
- If only one default is selected, should the other remain a later P1 variant or be deferred beyond P1?
- What lightweight educational copy explains PWA install without implying real offline playback, account persistence, push notifications, or production install support?
- For second-visit fake-only review, what local/fake signal is acceptable without backend, login, analytics, or production persistence?
- Should future fake-only QA evidence sample only the post-unlock path, only the second-visit path, or both paths before any P1 merge-readiness gate?
