# Phase 5 P1 Q15 Feasibility Note — `unlocked=1` fake-only review signal

Status: feasibility challenge only. Docs-only / fake-only / non-implementation. This note does not authorize runtime code, tests/CI, route changes, fixture changes, PRD/roadmap edits, production deployment, DNS/cutover, secrets, real backend/database/auth/login/payment/subscription/entitlement/wallet, Facebook APIs, Pixel/CAPI, production analytics, real video infrastructure, legal/compliance/brand decisions, licensed/competitor assets, or NovelHub production infrastructure.

## Verdict

APPROVE for continuing Q15 as docs-only / fake-only planning, with review-gate conditions.

Go: it is safe and useful to keep the Q15 default in the docs package: `unlocked=1` may remain a fake-only review/demo signal for the current mock unlock/pass flow, and must never grant real access once production entitlement exists.

No-go for implementation: do not start dev, QA automation, route changes, fixture changes, PRD edits, production entitlement design, backend/payment/login/Facebook/video/analytics work, or deploy work from Q15 without separate product, architecture/security, QA, and reviewer gates.

## Summary

The Q15 packet and architecture gate are consistent with the PRD's P0 invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

The proposal is feasible because it preserves a simple, visible review signal for fake same-episode return while drawing a bright boundary against URL-based production entitlement. The main challenge is not technical complexity; it is preventing future readers from treating a public query param as authorization when real entitlement arrives.

## Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
  - Core journey and default route: lines 20-37.
  - Non-goals: lines 43-58.
  - Return to same episode: lines 130-140.
  - P0 flow: lines 142-158.
  - Unlocked return route: lines 191-198.
  - First locked trigger: lines 293-299.
  - P0/P1/P2 scope and out-of-scope infrastructure: lines 612-743.
  - QA checklist: lines 744-777.
- `docs/moboreels/prototype-b-spec.md`, lines 1-3: delegates SceneFlow implementation detail to the PRD.
- `docs/moboreels/phase-5/p1-decision-brief.md`, Q15 lines 183-197: current Q15 proposal is fake-only and pending product confirmation.
- `docs/moboreels/phase-5/p1-q15-unlocked-param-fake-only-review-signal-decision-packet.md`: requirements packet reviewed end to end.
- `docs/moboreels/phase-5/p1-q15-unlocked-param-fake-only-review-signal-architecture-gate.md`: architecture gate reviewed end to end.
- Current repo grounding only:
  - `src/lib/query-params.ts`: `parseWatchQueryParams` parses `unlocked`; `buildWatchEpisodeHref` emits `unlocked=1` only when requested; `buildPassReturnHref` returns same watch episode with `unlocked=1`.
  - `src/lib/callback-keys.ts`: `parseUnlockedFlag` recognizes exact `unlocked=1` only.
  - `src/lib/lock.ts`: fake display lock state uses `episode > freeEpisodes && !unlocked`.
  - `src/app/variant-b/watch/[showId]/watch-stub.tsx`: fake watch surface keeps same episode context, opens drawer on locked state, and labels mock unlock behavior.
  - `src/app/variant-b/pass/pass-stub.tsx`: mock Story Pass return preserves story/episode and returns with `unlocked=1`.
  - `src/lib/query-params.test.ts` and `src/lib/lock.test.ts`: existing tests cover exact parsing, same-episode URL construction, and local lock display behavior.
- `git status --short`: Q15 packet/gate and `artifacts/` were untracked before this feasibility note; this note adds another untracked docs artifact.

## Key findings

1. The Q15 default is PRD-aligned for fake P0 review.
   - The PRD explicitly defines `unlocked=1` as the mock successful unlock return route and requires same-show/same-episode return.

2. The Q15 default is unsafe only if promoted beyond fake/review scope.
   - Public URL params are user-editable. Treating `unlocked=1` as real entitlement would be a direct access-control failure.

3. The current docs already state the critical boundary.
   - Both the decision packet and architecture gate say `unlocked=1` is fake-only, must never grant real access, and must be ignored/stripped/disabled/no-op outside approved fake/sandbox/review contexts once production entitlement exists.

4. The current repo shape is compatible with the fake-only story.
   - The code names the value as `unlocked` display/query state, not entitlement, and tests cover exact `unlocked=1` behavior. This is useful evidence, but it does not by itself authorize more implementation.

5. The next useful work is packaging/review, not new infrastructure.
   - The docs exist as untracked artifacts. The safe next step is a docs-only review package/PR plus product confirmation, not dev expansion.

## Hidden dependencies

- Product owner must confirm whether the default is approved, narrowed, deferred, or replaced by the stricter sandbox-only fixture alternative.
- Architecture/security must define the future production boundary before any entitlement implementation exists.
- QA must define positive fake-flow evidence and future negative URL-tamper evidence before tests are treated as acceptance gates.
- Reviewers need clear mock/fake labeling so they do not mistake `unlocked=1` for real access semantics.
- Future production entitlement design needs a non-URL authority source; Q15 deliberately does not choose it.
- If a future production build strips or ignores `unlocked=1`, it still needs a replacement way to prove same-episode return in review/sandbox contexts.

## Risks / mitigations

- Risk: URL tampering becomes production unlock.
  - Mitigation: keep `unlocked=1` fake-only; require negative production gate proving manual URL edits cannot unlock real content, bypass login/payment/subscription, or create entitlement.

- Risk: scope creep into backend, auth, payment, wallet, analytics, Facebook, video, or deployment.
  - Mitigation: split any such work into separate gated tasks; Q15 remains docs-only/fake-only.

- Risk: reviewers confuse fake unlock with real purchase/access.
  - Mitigation: keep visible mock/review labels in docs and any later fake UI evidence.

- Risk: future entitlement flow preserves security but breaks the product invariant by sending users Home or losing episode context.
  - Mitigation: same-show/same-episode return remains non-negotiable, regardless of the entitlement source.

- Risk: current fake local display behavior is overread as a production pattern.
  - Mitigation: avoid names like `hasAccess`, `isAuthorized`, `entitled`, or `paid` for query-param-derived state; keep the term as fake/review display state.

## Missing acceptance criteria / tests

Required before docs package is considered review-ready:

- Explicit product status language: proposal / approved / deferred / rejected.
- Explicit statement that `unlocked=1` must never be production entitlement or grant real access.
- Explicit statement that production entitlement must come from controlled state outside the public URL.
- Explicit statement that the P0 route invariant remains unchanged.
- Explicit statement that Q15 does not authorize implementation, tests, fixtures, PRD edits, production entitlement, backend/payment/login/Facebook/video/analytics, deployment, secrets, legal/compliance/brand decisions, assets, or NovelHub production infra.

Future tests, only if separately authorized:

- Positive fake-flow test: mock single-episode unlock returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same show and episode.
- Positive fake-flow test: mock Story Pass return preserves story/episode and returns with `unlocked=1`.
- Positive fake-flow test: free preview does not require login/payment-like prompts/Story Pass/PWA prompt/backend/entitlement.
- Negative future production test: manually adding `unlocked=1` cannot unlock real content, bypass login/payment/subscription, or create entitlement.
- Negative naming/scope review: query-param parsing is not named or wired as `hasAccess`, `entitled`, `paid`, `isAuthorized`, server middleware, video URL access, ledger, receipt, or production analytics evidence.

## Infrastructure boundary check

Inside boundary:

- Docs-only decision packet.
- Docs-only architecture gate.
- Docs-only feasibility note.
- Fake-only review/demo semantics for the current P0 mock flow.
- Static/local prototype evidence as grounding only.

Outside boundary / hard stop:

- Real backend, database, login, auth, payment, subscription, wallet ledger, receipt validation, production entitlement, real video, Facebook APIs, Pixel/CAPI, production analytics, cookies/storage/identity/consent work, deployment, DNS/cutover, secrets, legal/compliance/brand-significant decisions, licensed/competitor/uncleared assets, and NovelHub production infrastructure.

## Recommended plan edits

1. Keep the Q15 recommendation, but label it exactly as proposal pending human product confirmation until product approves it.
2. Add a reviewer-facing one-line boundary near the top of any Q15 package: "`unlocked=1` is fake review state only; it is not access control."
3. Preserve the stricter alternative in the packet: deprecate `unlocked=1` after production entitlement exists and replace it with sandbox-only fixture evidence outside the public URL.
4. Add an explicit future negative gate: production builds must prove `?unlocked=1` URL tampering does not unlock real content or create entitlement.
5. Do not ask dev/QA to implement tests yet. First package the docs and obtain product + architecture/security + QA planning confirmation.
6. If implementation is later authorized, require visible mock/review labeling and avoid entitlement-like naming for any URL-derived state.

## Safe next step

Create an ops/docs packaging task or docs-only PR task that packages these untracked Q15 docs for human review:

- `docs/moboreels/phase-5/p1-q15-unlocked-param-fake-only-review-signal-decision-packet.md`
- `docs/moboreels/phase-5/p1-q15-unlocked-param-fake-only-review-signal-architecture-gate.md`
- `docs/moboreels/phase-5/p1-q15-unlocked-param-fake-only-review-signal-feasibility-note.md`

Recommended next Kanban step: ops packaging docs PR, then product/reviewer gate. Do not route directly to dev implementation or QA execution yet.

## Stop conditions

Stop and escalate if any follow-up proposes or starts:

- Treating `unlocked=1` as production entitlement, authorization, payment proof, subscription state, receipt state, wallet state, login state, or real access.
- Returning fake unlock/pass users to Home, losing `showId`/`episode`, requiring login before free preview, showing prompts before free preview, skipping the first locked episode drawer, or making Story Pass primary at first lock.
- Adding backend/database/auth/login/payment/subscription/wallet/analytics/Facebook/video/deployment/secrets/NovelHub production infrastructure.
- Editing PRD/roadmap status to approved without product confirmation.
- Using licensed, competitor, or uncleared assets/copy.
- Making legal/compliance/security/brand-significant decisions without the appropriate human gate.
