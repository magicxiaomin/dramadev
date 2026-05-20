# Phase 5 P1 Q8 Feasibility Note — optional attribution params preservation default

STATUS: feasibility review only. Docs-only / fake-only / non-implementation. This note does not authorize PRD edits, runtime code, fixture changes, tests/CI, browser work, analytics, Facebook API/Pixel/CAPI, backend/database/storage/cookies, legal/privacy/data-handling decisions, payment/login/entitlement/video/production deployment/DNS/cutover/secrets, NovelHub production infrastructure, or licensed/competitor assets.

## Verdict

REVISE (non-blocking) before product approval or any implementation/test authorization.

Preserving the PRD-listed optional attribution params as inert URL context is feasible as a docs-only/fake-only P1 default, but the Q8 packet should tighten two boundaries before it becomes an approved decision: (1) distinguish inert URL preservation from user-facing display/debug rendering, and (2) explicitly require additive negative tests for unknown/malformed/duplicate/non-PRD params if a later implementation task is authorized.

No hard blocker was found for the requirements packet itself. Human product confirmation is still required before treating the recommended param set as approved, and legal/privacy/analytics/architecture approval is required before any real attribution, retention, processing, identity, cookies/storage, Pixel/CAPI, Facebook API, backend, or reporting work.

## Summary

The default parameter set in the packet matches the PRD-listed future params: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`. Keeping this set closed and inert preserves the P0 route invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

The main feasibility risk is semantic drift: teams may read "preserve" as permission to display, parse for attribution meaning, retain, normalize, or use the IDs for analytics. The packet mostly prevents that, but should be sharper about no user-facing exposure and about future tests proving params cannot change routing, episode choice, lock behavior, drawer behavior, or same-episode return.

## Evidence reviewed

- `docs/moboreels/phase-5/p1-q8-attribution-params-decision-packet.md` lines 1-237.
- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`:
  - §2 lines 20-37: confirmed Facebook Ad -> Watch EP1 -> free episode chain -> first lock -> drawer -> fake unlock/pass -> same episode route.
  - §3 lines 43-58: no Home/Search/Show Detail first, no login before free preview, no PWA/recharge/Story Pass before first playback/lock, no real payment/subscription/Facebook API/video, no competitor assets.
  - §5 lines 80-140: watch-first, free-preview-first, per-drama lock point, single-episode unlock first, return to same episode.
  - §6 lines 142-158: P0 user flow from `/variant-b/watch/[showId]?episode=1&source=facebook` through fake unlock/pass to same episode with `unlocked=1`.
  - §7.1 lines 162-181: primary ad route plus optional future attribution params; P0 does not need analytics processing; params should not disrupt routing/playback.
  - §7.2-§7.4 lines 183-208: locked route, unlocked return route, pass route preserve story/episode context.
  - §8.1-§8.6 lines 212-486: watch page, free preview, first locked state, Unlock Drawer, pass page, unlock success return.
  - §10 lines 564-610: metrics are defined conceptually but not P0 processing.
  - §11-§14 lines 612-743: P0 includes fake flow; P1/P2 defer attribution/event tracking, Pixel/CAPI, backend, payment, entitlement, video, production analytics.
  - §15 lines 744-777: P0 QA acceptance checklist.
- `docs/moboreels/prototype-b-spec.md` lines 1-3: Prototype B defers implementation detail to the SceneFlow PRD.
- `docs/moboreels/phase-4g/phase-5-questions.md` lines 16-21: Q8 attribution question and hard-stop framing for real Facebook/Pixel/CAPI/analytics.
- `docs/moboreels/phase-5/p1-decision-brief.md` lines 167-181: existing Q8 proposal matches PRD-listed inert param set.
- Repo state spot check:
  - `src/lib/callback-keys.ts` lines 1-11 already defines `source` plus the PRD-listed attribution keys.
  - `src/lib/query-params.ts` lines 55-66 and 103-120 parses/propagates only allowed attribution keys into watch/pass links.
  - `src/app/variant-b/watch/[showId]/watch-stub.tsx` lines 217-230 and 340-342 currently display attribution metadata/copy in the watch UI/drawer.
  - `tests/e2e/variant-b-p0-facebook.spec.ts` lines 61-70, 151-199 validates the current P0 route/source preservation and same-episode fake unlock/pass return, but not optional param preservation/negative cases.

## Key findings

1. Feasible default set: APPROVE the closed PRD-listed optional set as the only candidate set for product review. It is traceable to PRD §7.1 and §14 and avoids arbitrary param capture.
2. P0 invariant preserved: The Q8 packet repeatedly states that `source=facebook` remains sufficient, EP1 remains default, optional params are inert, and no optional param may alter route/playback/episode/lock/drawer/pass/unlock behavior.
3. Scope boundary mostly strong: The packet forbids real analytics, Facebook APIs, Pixel/CAPI, backend/database, cookies/storage, payment/login/entitlement, deployment/secrets, legal/privacy/data-handling, and NovelHub production infrastructure.
4. Current repo has a future implementation foothold: `callback-keys.ts` and `query-params.ts` already contain safe-key parsing and URL propagation for the PRD-listed set. This is not authorization for new implementation, but it is important feasibility evidence and a risk surface.
5. User-facing display risk exists: The current watch stub displays attribution details in route metadata and drawer helper copy. If optional ad IDs are preserved later, the Q8 plan must prevent campaign/ad IDs from appearing as user-facing drawer/watch/pass copy. Debug-only evidence should be behind test-specific affordances or omitted from user-facing conversion UI.
6. Negative test gap: Existing P0 E2E tests assert `source=facebook` through free chain, pass, and fake unlock. They do not yet prove optional params are preserved inertly, nor that unknown/non-PRD/malformed/duplicate params are ignored without redirecting, skipping episodes, or changing CTA hierarchy.

## Hidden dependencies

- Product decision: product must confirm whether the approved default is exactly the PRD-listed set, a narrower UTM-only/creative-only set, or no optional params until later.
- Architecture boundary: future URL preservation needs a narrow fake-only link-building rule without storage, cookies, backend handoff, analytics, or identity.
- Legal/privacy/analytics gate: anything beyond URL pass-through, including collection/retention/reporting/dedupe/attribution windows/event schemas, needs explicit approval.
- Test strategy: later implementation requires additive coverage for representative optional params and negative cases without weakening the existing EP1 P0 route tests.
- UX copy/design: the conversion UI should not expose raw ad/campaign identifiers to users; any debug metadata must not become production-facing trust/monetization copy.
- Existing code state: because attribution parsing/propagation already exists, future tasks must avoid accidental broadening from "preserve inert query params" to "ship attribution infrastructure."

## Risks / mitigations

- Risk: Optional params change starting episode or lock point.
  - Mitigation: Keep `episode` as the only episode selector; optional params cannot influence `episode`, `freeEpisodes`, lock detection, or `unlocked` semantics.
- Risk: Params are treated as consent to collect/process ad IDs.
  - Mitigation: State that URL presence is not collection approval, retention approval, analytics approval, or consent/legal approval.
- Risk: Unknown params such as `fbclid`, `utm_medium`, experiment IDs, or arbitrary platform fields sneak into scope.
  - Mitigation: Closed allowlist only; non-PRD params require separate product/legal/privacy/analytics decision.
- Risk: Raw ad IDs appear in user-facing drawer/watch/pass UI.
  - Mitigation: Add acceptance criterion forbidding raw optional attribution params in user-facing copy, pricing/trust claims, drawer helper copy, and pass page copy.
- Risk: Duplicate/malformed params produce unstable URLs or broken navigation.
  - Mitigation: Future implementation tests must prove safe ignore/first-value behavior and no redirect away from Watch flow.
- Risk: Future tests overfit optional-param cases and weaken default P0 evidence.
  - Mitigation: Keep canonical `/variant-b/watch/[showId]?episode=1&source=facebook` P0 test as the primary invariant; optional-param tests are additive only.

## Missing acceptance criteria / tests

Add these edits to the Q8 packet before product approval or implementation authorization:

1. User-facing display ban: preserved optional params must not be rendered in user-facing watch, drawer, pass, pricing, legal/trust, unlock, toast, or monetization copy. If debug evidence is needed, it must be explicitly non-production/debug-only and separately authorized.
2. Closed allowlist behavior: only `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content` may be preserved beyond `source=facebook`; `fbclid`, `utm_medium`, experiment IDs, and arbitrary params are excluded until a separate decision.
3. Negative cases: missing, unknown, duplicate, blank, overlong, malformed, and extra params must not redirect, break playback, skip free preview, change episode, alter lock detection, open Home/Search/Show Detail first, make Story Pass primary, or affect same-episode `unlocked=1` return.
4. Link coverage: if future fake-only implementation is authorized, test watch continuation, episode sheet locked/free links, drawer fake unlock, Story Pass pass link, pass back link, and pass mock return link with representative optional params.
5. P0 default preservation: the existing default route evidence must remain first-class and must pass without optional params.
6. No external systems: tests must assert no calls to Facebook/Meta hosts, Pixel/CAPI, analytics providers, payment/login/backend/database/video/deploy/secrets endpoints.

## Infrastructure boundary check

Within boundary:

- Docs-only requirements review.
- Product decision packet refinement.
- Future fake-only URL query preservation planning.
- Additive local tests later, only if separately authorized.

Outside boundary / hard stops:

- Runtime implementation from this packet alone.
- Real attribution processing, event schemas, reporting, dedupe, attribution windows, or production analytics.
- Facebook API, Pixel, CAPI, redirects, SDKs, platform validation, or paid services.
- Backend/database/storage/cookies/local/session storage for attribution, user identity, retention, or consent logic.
- Payment, subscription, login, entitlement, wallet ledger, real video provider, deployment/DNS/cutover/secrets.
- Legal/compliance/privacy/data-handling/platform-policy decisions.
- NovelHub production infrastructure.
- Licensed, competitor, or uncleared assets/copy.

## Recommended plan edits

1. Change "Accepted now as recommendation" wording to "Recommended for product confirmation" to avoid implying product approval before the human gate.
2. Add a clear definition: "inert URL context" means query-string pass-through only, no analytics/processing/storage/identity/cookies/consent/legal effect, no behavior changes, and no user-facing display of raw attribution IDs.
3. Add a no-display acceptance criterion for watch/drawer/pass UI.
4. Add a future fake-only test matrix covering representative allowed params plus unknown/malformed/duplicate/overlong cases.
5. Specify that future implementation, if authorized, must preserve optional params only on same-flow links needed for context and must never require them for P0 success.
6. Keep non-PRD params explicitly deferred; do not approve `fbclid`, `utm_medium`, or experiment IDs by implication.
7. Require any move from URL preservation to analytics/event processing to go through product + architecture + legal/privacy + analytics approval.

## Safe next step

Product owner should review the Q8 packet and choose one of three options:

1. Confirm the PRD-listed set as the fake-only inert URL preservation default, with the no-display and negative-test edits above.
2. Narrow the default to a smaller set, such as UTM-only plus `creative_id`, pending legal/privacy review.
3. Defer all optional params and keep only `source=facebook` until attribution/legal/analytics planning is approved.

Do not create implementation, fixture, test, browser, PRD, roadmap, analytics, backend, Facebook, Pixel/CAPI, payment/login/entitlement, video, deployment, or infrastructure tasks until product confirmation and the appropriate gates are complete.

## Stop conditions

Stop and require human approval if any follow-up proposes:

- Real Facebook/API/Pixel/CAPI/analytics/event tracking/reporting/dedupe/attribution windows.
- Cookies, local/session storage, backend/database, user identity, consent, retention, legal/privacy/data-handling work.
- Real payment/subscription/login/entitlement/wallet/video/deploy/DNS/secrets.
- Changing P0 route, starting episode, free-preview-first behavior, lock-point logic, CTA hierarchy, pass routing, or same-episode fake unlock/pass return.
- Displaying raw campaign/ad/user attribution IDs as user-facing conversion copy.
- Adding non-PRD params such as `fbclid`, `utm_medium`, arbitrary experiment IDs, or ad-platform fields without a separate decision.
- NovelHub production infrastructure or licensed/competitor/uncleared assets.
