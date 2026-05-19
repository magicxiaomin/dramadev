# Phase 5 P1 Q7 Feasibility Note — ad-creative deep-link starting episode default

Status: FEASIBILITY APPROVE for docs-only / fake-only planning. Product confirmation remains required before this becomes an approved product decision.

This note does not authorize runtime/source changes, route changes, fixture changes, tests/CI changes, PRD edits, roadmap edits, Facebook API/Pixel/CAPI/production analytics, backend/database/entitlement, real payment/subscription/login, real video infrastructure, production deployment/DNS/cutover/secrets, NovelHub production infrastructure, licensed/competitor/uncleared assets, or legal/compliance/brand-significant decisions.

## Verdict

APPROVE the Q7 recommendation as the lowest-risk P0/default P1 planning direction: keep Facebook ad traffic starting at EP1 via `/variant-b/watch/[showId]?episode=1&source=facebook`.

Ad creative -> starting episode mapping is feasible only as a later, explicitly approved, fake-only, opt-in experiment. It must remain disabled by default, constrained to same-story free episodes, and backed by a hard fallback to EP1.

## Summary

Keeping EP1 as the default is feasible and safest because it preserves the PRD-defined route, user narrative context, free-preview-first behavior, first-lock conversion path, metrics funnel, and QA evidence shape. Non-EP1 creative deep links create real continuity, lock-point, routing, evidence, attribution, editorial, privacy, and asset risks that are not justified for P0/default P1.

This feasibility note approves only the docs-only/fake-only planning recommendation. It does not approve implementation, mapping tables, route/query changes, fixtures, tests, browser evidence, PRD edits, real attribution, or production infrastructure.

## Evidence reviewed

- `docs/moboreels/phase-5/p1-q7-ad-creative-starting-episode-decision-packet.md`
- `docs/moboreels/phase-5/p1-q7-ad-creative-starting-episode-architecture-gate.md`
- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- Runtime alignment spot-check, read-only:
  - `src/app/variant-b/watch/[showId]/watch-stub.tsx`
  - `src/lib/query-params.ts`
  - `src/lib/callback-keys.ts`
  - `src/lib/lock.ts`

## Key findings

1. The PRD repeatedly anchors P0 to EP1:
   - Product journey: Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> mock unlock/pass -> same episode.
   - Default route: `/variant-b/watch/[showId]?episode=1&source=facebook`.
   - P0 user flow starts at EP1 and advances through free episodes before first lock.
   - Metrics funnel begins with Watch Page Loaded -> EP1 Start.
   - QA checklist starts with the EP1 Facebook route.

2. The decision packet and architecture gate correctly preserve the P0 invariant:

   ```txt
   /variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
   ```

3. Current code surfaces align with EP1 default and fake-only state:
   - `parseWatchQueryParams` defaults missing/invalid episode to EP1 via `clampEpisode`.
   - Attribution params, including `source`, `creative_id`, and `utm_content`, are parsed/preserved but do not select episodes.
   - `getEpisodeLockState` uses `episode > freeEpisodes && !unlocked`, matching the PRD lock rule.
   - Watch stub builds fake unlock and pass return paths around the current episode and preserves attribution context.

4. No creative-to-episode mapping surface is needed for Q7. Adding one now would increase implementation, QA, and product/legal/editorial dependency without improving the P0 path.

5. Prototype B adds no competing requirement; it delegates implementation detail to the SceneFlow PRD.

## Hidden dependencies

- Product owner confirmation: required before treating EP1 default as an approved product decision.
- Product/editorial strategy: required before any non-EP1 mapping, because episode starts affect narrative continuity, spoiler risk, and creative promise matching.
- QA strategy: required before any fake-only mapping implementation, because default EP1 evidence must remain intact and mapping evidence must be additive.
- Legal/privacy/analytics: required before any real creative IDs, Facebook data, Pixel/CAPI, analytics schemas, storage/cookies, consent, dedupe, retention, or backend handoff.
- Asset/copy clearance: required before any real ad creative, licensed source, competitor-inspired asset, stock/public-domain claim, or brand-significant messaging enters prototype or production.
- Architecture/dev: required only after product explicitly authorizes fake-only mapping; until then, the safest implementation is no implementation.

## Risk table

| Risk | Why it matters | Mitigation |
|---|---|---|
| P0 regression | Non-EP1 starts can weaken the EP1 route, free chain, first-lock drawer, and same-episode return evidence. | Keep EP1 as default; require additive evidence only after separate approval. |
| Narrative discontinuity | A mapped episode may skip setup scenes or contradict the ad promise. | Require product/editorial review and same-story free-episode constraint. |
| Lock-point bypass | Mapping may land on or near locked episodes, violating free-preview-first. | Allow only `1 <= episode <= story.freeEpisodes`; invalid/unsafe mappings fall back to EP1. |
| Context loss | Mapping logic can drop `showId`, `episode`, `source`, attribution params, pass context, or unlock return context. | Preserve current route builders and same-episode fake unlock/pass return semantics. |
| Evidence dilution | QA could replace EP1 evidence with mapping evidence and miss default regressions. | Default EP1 acceptance remains mandatory; mapping tests, if authorized, are additive. |
| Attribution/data creep | Creative IDs can pull in Facebook API, Pixel/CAPI, analytics, cookies, storage, backend, consent, and retention work. | Keep params inert; require legal/privacy/analytics gates before real data processing. |
| Editorial/brand creep | Creative-to-episode mapping can become brand-significant ad strategy. | Gate through product/editorial and forbid uncleared assets/copy. |
| Infrastructure overreach | Mapping may invite backend/database, entitlement, video, deployment, secrets, or NovelHub production infra. | Keep P0 fake-only/local/docs-only; hard-stop real infrastructure until separate authorization. |

## User-input requirements

No user input is needed to keep the Q7 packet as a proposal or to publish this feasibility note.

Human input is required before any next step that changes status or scope:

1. Product must choose one of:
   - approve EP1 as the P0/default P1 starting episode for all Facebook ad traffic;
   - approve EP1 default and separately request a fake-only non-EP1 mapping experiment brief;
   - reject EP1 default and request a new requirements packet for a named alternate default;
   - defer Q7.
2. If a non-EP1 fake-only experiment is requested, product/editorial must define allowed same-story free-episode mapping rules and continuity/spoiler guardrails.
3. If any real attribution is considered, legal/privacy/analytics must approve data minimization, consent, retention, dedupe, event naming, platform-data handling, and whether backend/CAPI processing is allowed.
4. If any creative assets or copy are used, product/legal must confirm they are synthetic or cleared and not competitor/licensed/uncleared material.

## Missing acceptance criteria / tests

The docs packet is acceptable for the current gate, but any future implementation authorization should add explicit acceptance criteria before dev starts:

- Default Facebook ad traffic still routes to `/variant-b/watch/[showId]?episode=1&source=facebook`.
- Missing, malformed, unknown, cross-story, out-of-range, locked, deleted, ambiguous, or unsafe mapping falls back to EP1.
- Valid fake-only mappings, if authorized, target only the same story and only `1 <= episode <= story.freeEpisodes`.
- `source=facebook` and safe attribution params remain inert unless separately approved.
- The path still advances to the first locked episode, opens the Unlock Drawer, keeps single-episode unlock primary, keeps Story Pass secondary, and returns fake unlock/pass to the same reached locked episode with `unlocked=1`.
- No login, recharge, PWA install, subscription, Story Pass promotion, payment-like prompt, backend lookup, entitlement check, or real analytics appears before free playback.
- Tests must be additive and must not weaken existing EP1 P0 coverage.

No tests/CI/browser evidence were run or required for this docs-only feasibility gate.

## Infrastructure boundary check

Within boundary:

- Docs-only recommendation that EP1 remains default.
- Fake-only future constraints for a separately approved mapping experiment.
- Read-only inspection of PRD, architecture gate, decision packet, Prototype B spec, and existing fake-only route/query/lock surfaces.

Outside boundary / not authorized:

- Runtime/source changes, route changes, mapping config, query-param behavior changes, fixture changes, tests/CI, Playwright/browser work, package/lockfile changes, PRD edits, or roadmap edits.
- Real Facebook API, Pixel/CAPI, production analytics, creative-ID processing, cookies/storage, backend/database, entitlement, login, payment, subscription, wallet ledger, real video provider, production deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Legal/compliance/privacy/platform-policy decisions, brand-significant creative strategy, or licensed/competitor/uncleared assets.

## Recommended plan edits

1. Keep the Q7 recommendation phrased as proposal material until product confirms it.
2. State explicitly in any next requirements note: "No implementation is needed to preserve Q7 default behavior."
3. If product confirms EP1 default, package the Q7 decision packet, architecture gate, and this feasibility note as a docs-only review set.
4. Do not add a creative-to-episode mapping task unless product separately asks for a fake-only experiment.
5. If that experiment is requested, create a new requirements packet before architecture/dev/QA work. It should define:
   - approved fake mapping key shape;
   - same-story free-episode constraint;
   - EP1 fallback behavior;
   - invalid mapping cases;
   - additive QA evidence;
   - no real attribution/backend/Facebook/storage/payment/login/video/deploy scope.
6. Keep real attribution, legal/privacy, analytics, production infrastructure, and asset clearance as separate hard gates.

## Safe next step

Ask product to confirm whether EP1 should be the P0/default P1 starting episode for all Facebook-ad traffic. If product approves, proceed only with docs-only packaging or a narrowed acceptance note; do not start runtime, tests, route/query, fixture, attribution, backend, or infrastructure work.

## Stop conditions

Stop and escalate if any next task requests:

- default non-EP1 Facebook ad starts without a named product decision;
- runtime/source, route/query, fixture, tests/CI, Playwright, browser evidence, PRD, or roadmap changes from this gate alone;
- creative-to-episode mapping based on real Facebook/ad platform data;
- real Facebook API, Pixel/CAPI, production analytics, cookies/storage, backend/database, entitlement, payment, subscription, login, real video, deployment, DNS/cutover, secrets, or NovelHub production infrastructure;
- legal/compliance/privacy/platform-policy decisions by the implementation team;
- licensed, competitor, stock/public-domain, or otherwise uncleared assets/copy;
- any flow that sends post-unlock users Home, loses episode context, requires login before free preview, shows prompts before free playback, skips the free episode chain, makes Story Pass primary at first lock, or treats `unlocked=1` as production entitlement.
