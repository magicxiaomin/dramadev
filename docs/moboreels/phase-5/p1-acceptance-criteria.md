# Phase 5 P1 Q1 Acceptance Criteria — docs-only / fake-only

STATUS: requirements artifact only. Docs-only / fake-only / non-implementation. Pending product confirmation of the Phase 5A defaults remains as recorded in `docs/moboreels/phase-5/p1-decision-brief.md`.

This document captures acceptance criteria for the first safe Phase 5 P1 slice: locking in Q1 "manual `Continue to EP X` remains the P1 default" as a regression-protected behavior. It does not authorize PRD edits, roadmap edits, runtime code changes, fixture changes, CI/workflow changes, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## 1. Sources

- PRD source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
  - §8.1 Watch Page, "Episode Complete Behavior", lines 252–260: free episode completion must show a clear `Continue to EP X` CTA; P0 may implement manual continuation; P1 may implement 3-second countdown autoplay; next-episode behavior routes to free playback or locked flow.
  - §12 P1 Scope, lines 633–648, including line 639 "3-second auto-next countdown" as a permitted (not required) P1 candidate.
- Phase 5 decision brief: `docs/moboreels/phase-5/p1-decision-brief.md`
  - Q1 — Manual Continue vs 3-second auto-next countdown, lines 55–69: default proposal keeps manual `Continue to EP X` as the P1 default; a 3-second countdown remains an optional fake-only variant only, behind explicit review/demo configuration.

## 2. P0 invariant (reproduced verbatim)

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

This invariant must remain unchanged. Nothing in this slice may alter the ad-landing route, the free episode chain, the first locked-episode behavior, the Unlock Drawer flow, the fake unlock/pass return, or the `unlocked=1` same-episode return.

## 3. Confirmed scoped default (Q1)

- Manual `Continue to EP X` remains the Phase 5 P1 default at the end of every free episode.
- A 3-second auto-next countdown remains a later optional fake-only variant only. It is not enabled by default and must not become the default in this slice.
- This confirmation is scoped to Q1 only. It does not extend confirmation to any other Phase 5 question (Q2–Q17 remain `STATUS: proposal — pending human product confirmation` in the decision brief).

## 4. Acceptance criteria for the additive browser regression

The acceptance criteria below describe what the eventual additive Playwright regression must demonstrate. This document does not create or run that test; it specifies requirements for the next dev task to satisfy.

1. The regression runs at a 390×844 mobile viewport, matching the PRD §1 target mobile profile.
2. The regression navigates the P0 entry route `/variant-b/watch/[showId]?episode=1&source=facebook` and advances through the free episode chain until a free episode has completed and the episode-complete state is reached.
3. After the free episode completes, the regression waits at least 5 seconds without any user input and verifies that no automatic navigation occurs — the URL, episode context, and episode-complete state must be unchanged after the wait.
4. The regression asserts that a visible `Continue to EP X` affordance is present in the episode-complete state during and after the wait.
5. The regression then activates the `Continue to EP X` affordance and asserts that the next episode loads correctly: a next free episode when within `freeEpisodes`, or the first locked episode flow when the next episode is beyond `freeEpisodes`.
6. The regression remains fully fake-only. It must not reference, exercise, or stub real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, video provider, deployment, DNS, secrets, or licensed/competitor assets.
7. The regression must be additive only. The existing Phase 4G fake-only P0 Playwright harness (PR #23) must continue to pass unchanged in the same run.

## 5. Non-scope / hard stops

- No runtime behavior change in this requirements task. This document defines acceptance criteria only.
- No source code, test, configuration, or CI changes in this task. The only file written by this task is `docs/moboreels/phase-5/p1-acceptance-criteria.md`.
- No real integrations or production infrastructure: no real Facebook redirect/API, Pixel/CAPI, production analytics, real payment, subscription, refunds, wallet ledger, login/identity, session/cookie auth, backend services, databases, schema migrations, content APIs, server-side or production entitlement, real video player/hosting/transcoding/DRM, network/error handling implementation, production deployment/DNS/cutover, secrets, paid services, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.
- No PRD edits, no roadmap edits, no decision-brief edits, no Phase 4G/4D/4E artifact edits, no `package.json` / lockfile / Playwright configuration edits, no `.github/workflows/` edits.
- Phase 5 questions Q9, Q10, Q11, Q12, Q13, Q14, Q16, Q19, Q20, Q21, Q22 (production-related), and Q23 remain hard-stop-gated and are not addressed here.

## 6. Handoff notes for the next dev task

- The next dev task is expected to add a single additive Playwright spec, likely at `tests/e2e/variant-b-manual-continue.spec.ts`, that satisfies the criteria in §4 above.
- The dev task must not modify `package.json`, lockfiles, Playwright configuration, browser installs, CI workflows, or any non-test source files. It must reuse the existing PR #23 fake-only Playwright harness as-is.
- The existing P0 browser harness must still pass after the new spec is added. Both the new manual-Continue regression and the prior P0 invariant regression must be green in the same run.
- The dev task is scoped to Q1 only. Q2–Q17 remain proposals in the decision brief; do not implement, prototype, or reference them as in-progress in this slice.
- Any need to change runtime code in `src/app/variant-b/watch/[showId]/watch-stub.tsx`, fixtures in `src/data/fixtures/shows.ts`, callback/query-param libraries, CI/workflow files, package/lockfile, or Playwright config invalidates the slice and must return to the requirements/architecture gate before proceeding.
