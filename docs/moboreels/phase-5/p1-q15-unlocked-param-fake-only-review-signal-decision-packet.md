# Phase 5 P1 Q15 Decision Packet — `unlocked=1` fake-only review signal

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, route changes, tests/CI, Playwright work, entitlement logic, backend/database/auth/payment/subscription/login, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, real video infrastructure, deployment/DNS/cutover/secrets, legal/compliance/brand decisions, licensed/competitor/uncleared assets, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q15: whether `unlocked=1` should remain available after production entitlement exists, and if so, under what guardrails.

Recommended default, pending human product confirmation: yes, keep `unlocked=1` only as a fake-only review/demo signal. It must never grant real access, must be ignored or disabled outside explicitly approved fake/sandbox/review contexts once production entitlement exists, and must preserve the P0 same-episode return invariant for the current fake-only flow.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-5/p1-decision-brief.md` lines 183-197, Q15: "Should `unlocked=1` remain a fake-only review signal once production entitlement exists?"

Existing proposal context: `docs/moboreels/phase-5/p1-decision-brief.md` lines 187-197 anchors Q15 in PRD §5.6, §7.3, §8.4, §13, and §14; proposes keeping `unlocked=1` only as a fake-only review/demo signal; states it must not grant real access once production entitlement exists; and marks the answer as proposal pending human product confirmation.

This packet narrows Q15 into requirements, acceptance criteria, validation methods, assumptions, risk gates, and a recommended task graph for later review. It does not approve implementation.

No user input is required to produce this requirements packet because the default is directly anchored in the PRD's mock unlock, unlocked return route, same-episode return, and P2/out-of-scope entitlement exclusions. Human product/security/architecture confirmation is required before treating the recommendation as an approved long-term entitlement boundary.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: the MVP must not send Facebook ad users to Home/Search/Show Detail first, require login before free preview, show prompts before first playback, build real payment/subscription/Facebook APIs/video, or copy competitor assets.
- PRD §5.1-§5.6 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode are required; §5.6 requires mock unlock or mock purchase to return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` and forbids returning Home or losing episode context.
- PRD §6 P0 User Flow, lines 142-158: after choosing Unlock EP X or Get Story Pass, fake unlock/pass returns the user to the same episode with `unlocked=1`.
- PRD §7.2-§7.4 Route Requirements, lines 183-209: locked episodes use `/variant-b/watch/[showId]?episode=[episodeNumber]`; unlocked return route uses `/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1`; `unlocked=1` simulates successful unlock; the Pass route must preserve story and episode context.
- PRD §8.3 First Locked Episode State, lines 293-308: locked trigger is `episode > story.freeEpisodes && unlocked !== true`; the locked state opens the Unlock Drawer and remains locked if dismissed.
- PRD §8.4 Unlock Drawer, lines 310-402: Unlock Drawer must show transparent unlock information; free preview does not require login; production may trigger login on unlock/payment-like actions; P0 may simulate unlock with `unlocked=1`.
- PRD §8.5 Story Pass / Unlock Options Page, lines 404-463: Pass page must be story-focused, clearly state mock status, preserve current drama/episode context, and return after purchase success to `/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1`.
- PRD §8.6 Unlock Success Return, lines 465-487: after successful mock unlock, return to the same drama and same episode, set unlocked state, resume playable state, show short success feedback, and do not return Home, stay on Pass page, lose episode context, or keep showing locked state.
- PRD §10 Metrics, lines 564-610: mock unlock success and post-unlock episode played are funnel review points, but production analytics are not a P0 requirement.
- PRD §11 P0 Scope, lines 612-631: P0 includes fake unlock using `unlocked=1` and return to same episode after mock unlock.
- PRD §12 P1 Scope, lines 633-649: local continue-watching, episode tracking, Facebook attribution planning, story-specific Pass copy, unlock success toast, and wallet/unlock history mock are P1 candidates only.
- PRD §13 P2 Scope, lines 650-665: real video player, backend content retrieval, real login, real payment/subscription, wallet ledger, server-side entitlement state, production analytics, and Facebook CAPI are deferred.
- PRD §14 Developer Handoff Notes, lines 667-743: important state includes `unlocked`; required query params include `episode`, `unlocked`, and `source`; production entitlement, login, payment/subscription, real wallet ledger, real video, production analytics, Facebook APIs, and real backend systems are out of scope.
- PRD §15 QA Acceptance Checklist, lines 744-777: mock single-episode unlock and mock Story Pass purchase must return to the same unlocked episode; unlock success must not send the user Home or lose episode context.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q15 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, Show Detail, Pass, login, recharge, or Story Pass education first.
- Free preview remains before login, recharge, subscription, PWA install prompt, payment-like prompt, production entitlement, or real attribution processing.
- `story.freeEpisodes` remains the per-drama lock point source.
- The first locked episode opens the Unlock Drawer and keeps the user on the locked episode if dismissed.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to the same episode with `unlocked=1`.
- `unlocked=1` is a fake-only review/demo signal in P0. It simulates successful unlock for review evidence only; it is not entitlement, authentication, payment, subscription, wallet, or production access control.
- The user must not be returned Home, lose show/episode context, stay on the Pass page after fake success, or be required to find the drama again.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Defining a concrete sandbox/review-mode switch, environment guard, test harness, Storybook/demo convention, or QA automation around `unlocked=1`.
- Adding tests, Playwright evidence, route loaders, fixtures, telemetry labels, copy changes, or implementation for `unlocked=1` gating.
- P1 local continue-watching, episode completion tracking, unlock success toast, wallet/unlock history mock, and Facebook attribution planning.
- Any PRD/roadmap update that changes Q15 status from proposal to approved.

P2 / hard-stop-gated scope:

- Production entitlement design or implementation, including server-side entitlement state, access-control middleware, backend/database entitlement tables, login/session binding, wallet ledger, purchase receipt validation, subscription state, payment provider integration, refunds/cancellation, tax/local pricing, or production analytics/Facebook CAPI integration.
- Any use of `unlocked=1` as a production authorization mechanism or entitlement bypass.
- Deployment/DNS/cutover/secrets, production access control, real video infrastructure, real backend content retrieval, or NovelHub production infrastructure.
- Legal/compliance/privacy/platform-policy/security decisions for production entitlement semantics.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Route behavior changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Backend/database/API/auth/session/payment/subscription/entitlement implementation.
- Real unlock, paid access, wallet ledger, subscription access, receipt validation, or entitlement persistence.
- Real analytics, Facebook API/Pixel/CAPI, attribution, cookies/storage, identity, or consent work.
- Real video, production deployment/DNS/secrets, or NovelHub production infrastructure.
- Legal/compliance/brand/security approval for production access-control semantics.
- Licensed, competitor, or uncleared assets/copy.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, showing prompts before free preview, skipping the first locked episode's Unlock Drawer, changing `freeEpisodes` from a per-drama lock point, or making Story Pass primary at first lock.

## Assumptions

- "P1" in this Q15 packet means fake-only planning and future review scope unless a later human product/security/architecture decision explicitly expands it.
- `unlocked=1` currently exists only to simulate successful unlock in the fake P0 route and to make review evidence observable in the URL.
- The presence of `unlocked=1` in a public URL is acceptable only for fake/demo/review behavior because it is transparent, reproducible, and easy for reviewers to inspect.
- Production entitlement, when it exists, will rely on a non-URL authorization source such as server-side entitlement/session/payment state. This packet does not choose or design that source.
- Production systems may ignore, strip, disable, or treat `unlocked=1` as no-op outside fake/sandbox/review contexts; the exact mechanism is deferred.
- If a future fake/sandbox mode keeps `unlocked=1`, the mode must be explicitly bounded and must not be active for real users, real payments, real subscriptions, or production content access.
- No user input is required for this packet. Product confirmation is required to approve the default; architecture/security confirmation is required before implementation; QA confirmation is required before relying on review evidence; legal/compliance review is required before production entitlement semantics are changed.

## Recommendation

Approve as proposal for product review: keep `unlocked=1` as a fake-only review/demo signal, with a bright-line rule that it must never grant real access after production entitlement exists.

Recommended default requirements:

1. `unlocked=1` remains valid only in fake/demo/review contexts used to review the current P0 flow.
2. `unlocked=1` must never be treated as production entitlement, authentication, payment proof, subscription state, wallet state, receipt state, or authorization.
3. Production entitlement, when later designed, must come from a production-controlled entitlement source outside the public URL.
4. Outside approved fake/sandbox/review contexts, `unlocked=1` should be ignored, stripped, disabled, or treated as a no-op; exact mechanism is deferred to future architecture/security work.
5. The current fake flow must continue to use `unlocked=1` to verify same-episode return after fake single-episode unlock and fake Story Pass purchase.
6. `unlocked=1` must not change the default landing route, free preview behavior, per-drama lock point, first locked episode detection, Unlock Drawer display, CTA hierarchy, or same-episode return destination.
7. Any future implementation must make review/sandbox boundaries explicit and testable before production entitlement is introduced.
8. Any future production entitlement work must include a negative gate proving that editing the URL to include `unlocked=1` does not unlock real content.

Rationale:

1. The PRD explicitly uses `unlocked=1` to simulate successful unlock and to prove same-episode return for mock unlock/pass in P0.
2. Keeping the query param in fake-only review mode preserves a simple observable signal for reviewers without requiring backend, login, payment, wallet, analytics, or entitlement infrastructure.
3. Treating URL state as production entitlement would be unsafe because users can edit public query params.
4. A fake-only boundary keeps P0 documentation and review intact while preventing accidental overreach into P2 entitlement systems.
5. Ignoring or disabling `unlocked=1` outside approved fake/sandbox contexts gives future production entitlement work freedom to choose a secure implementation without breaking the current fake review flow.
6. The same-episode route invariant is more important than the query param itself; future production systems may replace the fake signal, but must preserve returning users to the same show and episode after a legitimate unlock.

Alternate option:

Deprecate `unlocked=1` entirely when production entitlement exists and replace it with a sandbox-only entitlement fixture controlled outside the public URL.

Tradeoff: this is stricter and may better match production security posture, but it removes the current easy-to-inspect review signal unless a replacement sandbox/review fixture is designed. It should remain a future option if architecture/security rejects any URL-visible fake unlock signal after entitlement work begins.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. The packet explicitly says `unlocked=1` is fake-only and must never grant real access.
3. The packet preserves the exact P0 invariant unchanged.
4. The packet preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. The packet states that fake single-episode unlock and fake Story Pass return to the same episode with `unlocked=1`.
6. The packet states that production entitlement, if later built, must not rely on a public URL query param.
7. The packet states that outside approved fake/sandbox/review contexts, `unlocked=1` must be ignored, stripped, disabled, or no-op; exact mechanism is deferred.
8. The packet explicitly forbids runtime code, route changes, fixture changes, test/CI changes, PRD/roadmap edits, backend/database/auth/payment/subscription/login/entitlement implementation, analytics/Facebook work, real video, deployment/DNS/secrets, and NovelHub production infrastructure.
9. PRD anchors include default route, core principles, same-episode return, unlocked return route, first-lock trigger, Unlock Drawer/login mock states, Pass return behavior, Unlock Success Return, P0/P1/P2 scope, Developer Handoff Notes, and QA checklist.
10. Product confirmation remains an explicit gate before treating this recommendation as approved; architecture/security review remains an explicit gate before any implementation.

Future fake-only additive review acceptance criteria, if later authorized for implementation:

1. The canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Free previews play before login, recharge, subscription, Story Pass prompt, PWA install prompt, payment-like prompt, or production entitlement check.
3. First locked episode remains derived from `story.freeEpisodes + 1` when present.
4. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode.
5. Fake Story Pass purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode.
6. Editing a fake review URL to add `unlocked=1` is accepted only inside the explicit fake/demo/review context and never represents production access.
7. In any future production-entitlement context, manually adding `unlocked=1` to the URL does not unlock real content, does not bypass login/payment/subscription/entitlement, and does not create entitlement state.
8. `unlocked=1` does not change showId, episode number, source/attribution params, free/locked calculation, drawer behavior, CTA hierarchy, or post-unlock destination.
9. If future tests are authorized, they must include positive fake-flow coverage for same-episode return and negative production-gate coverage that URL param editing cannot grant real access.
10. Implementation, if later approved, does not call, stub, depend on, or simulate real backend/database/content APIs, production entitlement, real login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, deployment, DNS, secrets, or paid services unless a separate gated task explicitly authorizes it.

Accepted/deferred criteria summary:

- Accepted now as recommendation: `unlocked=1` remains a fake-only review/demo signal for the current mock unlock/pass flow.
- Accepted now as guardrail: `unlocked=1` must never be production entitlement or grant real access.
- Accepted now as P0 invariant: fake unlock/pass returns to the same show and same locked episode with `unlocked=1`; users are not returned Home and do not lose episode context.
- Deferred: implementation details for sandbox/review gating, stripping/ignoring/no-op behavior, automated tests, route code, fixtures, QA evidence, PRD edits, and approval status changes.
- Hard-stop deferred: production entitlement, backend/database/auth/payment/subscription/login, wallet ledger, real video, analytics/Facebook integrations, deployment/DNS/secrets, legal/compliance/security approvals, and NovelHub production work.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, test execution, browser evidence, CI, PRD edits, roadmap edits, fixture changes, or implementation work.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes runtime code, route changes, tests/CI, entitlement, backend/database/auth/payment/subscription/login, wallet, Facebook/analytics, deployment/DNS/secrets, legal/compliance/brand, assets, and NovelHub production infrastructure.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation says `unlocked=1` remains fake-only and must never grant real access.
5. Confirm the rationale explains why `unlocked=1` is useful for fake review evidence and unsafe as production entitlement.
6. Confirm the alternate option is documented: deprecate `unlocked=1` entirely after production entitlement exists and replace it with a sandbox-only entitlement fixture outside the public URL.
7. Confirm every Q15 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
8. Confirm PRD anchors include §5.6 same-episode return, §7.3 unlocked return route, §8.3 first-lock trigger, §8.4 mock login/unlock behavior, §8.5 Pass return, §8.6 Unlock Success Return, §11 P0 scope, §13 P2 scope, §14 out-of-scope systems, §15 QA checklist, and Q15 question source.
9. Confirm acceptance criteria explicitly forbid runtime implementation, real entitlement, backend/database/auth/payment/subscription/login, analytics/Facebook, real video, deployment/DNS/secrets, legal/compliance/security decisions, and NovelHub production infrastructure.
10. Confirm future fake-only review criteria include positive same-episode fake unlock/pass return checks and negative production-entitlement checks proving URL editing cannot grant real access.
11. Confirm product confirmation remains required before approval, and architecture/security review remains required before any implementation.

## Risks / gates

- Security risk: if `unlocked=1` is ever interpreted as production entitlement, a user could edit the URL and bypass access control. Gate: production entitlement must ignore/strip/disable/no-op this param outside explicit fake/sandbox/review contexts, and negative tests must prove URL editing cannot grant real access before any production entitlement release.
- Product risk: removing `unlocked=1` too early could make the fake P0 same-episode return harder to review. Gate: do not remove it from fake review flow unless a replacement sandbox/review evidence mechanism is approved.
- QA risk: reviewers may confuse fake URL-visible unlock with real entitlement behavior. Gate: fake/review docs, demo labels, or future implementation notes must clearly state mock/fake-only status.
- Scope risk: Q15 can expand into production entitlement, auth, payment, wallet, analytics, or backend design. Gate: keep this packet docs-only; create separate gated tasks for architecture/security/product decisions if implementation is requested.
- Route invariant risk: future entitlement work could return users to Home, lose the episode param, or strand users on Pass. Gate: same-show/same-episode return remains a non-negotiable acceptance criterion for both fake and future legitimate unlock flows.
- Compliance risk: production access-control semantics may have legal/privacy/payment implications. Gate: legal/compliance/security review is required before production entitlement behavior is approved.

## Recommended task graph

No implementation tasks are authorized by this packet. If humans approve follow-up work, route it as separate gated tasks:

1. Product review task: confirm or revise the Q15 default that `unlocked=1` remains fake-only and never grants real access. Output should be approved/deferred/rejected status language for this packet or the decision brief.
2. Architecture/security gate task: define the future boundary between fake/sandbox/review URL signals and production entitlement state, including whether production should ignore, strip, disable, or no-op `unlocked=1`.
3. QA planning task: define future fake-flow positive checks and production-entitlement negative checks, including same-episode return and URL-param tampering coverage. No tests until separately authorized.
4. Docs reconciliation task: if product approval is granted, update the relevant Phase 5 decision brief/status documents without changing the PRD unless specifically authorized.
5. Implementation task, only after gates above: add any approved fake/sandbox/review gating or tests while preserving the P0 route invariant and without introducing production entitlement/backend/payment/login/Facebook/video infrastructure.

## Open non-blocking questions

- Should future production builds ignore `unlocked=1`, strip it from the URL, preserve it as no-op for attribution/debugging, or reject routes that contain it outside sandbox/review mode?
- What explicit signal should identify approved fake/sandbox/review contexts if implementation is later authorized: environment, route namespace, build flag, fixture mode, QA-only story IDs, or another mechanism?
- Should fake review URLs display visible mock/review labeling to reduce reviewer confusion once production entitlement exists?
- If production entitlement replaces `unlocked=1`, what review evidence should prove same-episode return without exposing entitlement-like URL state?
- Who owns final approval for the boundary: product, architecture, security, QA, legal/compliance, or a combined gate?
