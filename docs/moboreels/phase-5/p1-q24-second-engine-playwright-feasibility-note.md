# Phase 5 P1 Q24 Feasibility Note — Second-engine Playwright project at the same iPhone-like 390x844 mobile viewport

Status: FEASIBILITY VERDICT — FEASIBLE WITH REVISIONS (non-blocking) for docs-only / fake-only planning only. Do not treat this note as approval, authorization, scheduling, or any implication that production-readiness, matrix expansion, or any new browser/runner/CI surface has been approved.

This note is a docs-only / fake-only / non-implementation architecture feasibility artifact written for Kanban task `t_12ab2e1b`, following the reviewer approval recorded against the Q24 decision packet on Kanban task `t_1c5ff2ab` (referenced from the Kanban handoff; this note does not invent any other approval, sign-off, scheduling, or external commitment). The note describes only what a second-engine Playwright project at the same iPhone-like 390x844 mobile viewport would have to look like in requirements/architecture terms if a separate future authorization ever approved it. No matrix expansion is approved by this note. No `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, browser-install, test, fixture, evidence-directory, runtime code, route, PRD, roadmap, or CI change is authorized or made by this note.

This note does not authorize runtime code, route behavior, fixture/data, tests, Playwright work, test runner config, GitHub Actions / CI workflow changes, package or lockfile changes, browser-install changes, real video/provider playback, network/offline/error fallback, real backend/database/content APIs, real auth/login/session, real payment/subscription/wallet/refund/entitlement, real Facebook APIs/Pixel/CAPI, production analytics/attribution, deployment/DNS/cutover/secrets, legal/compliance/brand/security/privacy/platform-policy decisions, licensed/competitor/uncleared assets, NovelHub production infrastructure (CI runners, secrets, data, or deployment pipelines), accessibility certification, internationalization coverage, in-app browser surfaces, tablet/desktop/low-end-device matrix entries, or any change to the current `p0-mobile-390x844` Playwright project.

## Verdict

FEASIBLE WITH REVISIONS (non-blocking).

A future fake-only second-engine Playwright project at the same iPhone-like 390x844 mobile viewport is feasible as docs-only / fake-only planning material. It stays inside the P0 boundary if and only if every one of the following holds:

1. It runs entirely against the same fake fixtures, the same fake `unlocked=1` signal, the same mock balance/cost, and the same local Next.js dev server already used by the current `p0-mobile-390x844` Playwright project.
2. It does not change the existing `p0-mobile-390x844` project, does not change `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, test files, fixtures, or evidence directories at the time this note is written.
3. It preserves the P0 invariant verbatim across both engines, including watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode-unlock-first, and same-episode return.
4. It is treated as an additive review surface, not a production-readiness signal, not a legal/compliance/accessibility/security/platform-policy certification, and not a substitute for any Q9–Q23 hard-stop decision.
5. It is reversible: removing the second engine must not lose any P0 acceptance evidence carried by the `p0-mobile-390x844` project.

Before any implementation, before any browser-install change, before any PRD/roadmap status flip, and before any QA gate or CI gate treats it as approved, the proposal must close the following revision items:

1. Decide which second engine (for example webkit) is the conservative P1 candidate, and record the choice as a docs-only architecture gate. Do not pre-commit to multi-engine expansion beyond a single named candidate.
2. Decide the trigger surface (PR-on-demand label, `main`-only, nightly schedule, or manual dispatch). Do not default to every-PR coverage until flake/runtime/cost are budgeted and a separate authorization exists.
3. Decide flake-rate, runtime, and runner-cost thresholds that automatically demote or remove the second-engine project, and name the human owner who runs that removal.
4. Decide the evidence-pack layout convention (where screenshots/traces/videos for the second engine would live under `qa-evidence/` or `artifacts/`) without authorizing implementation.
5. Decide reversibility criteria: what set of conditions, if observed, requires reverting to the single-engine `p0-mobile-390x844` floor without further review.

## Final recommendation

Recommend, pending product/QA/architecture confirmation, that the conservative additive P1 candidate be described in requirements terms as follows, and that no implementation be authorized by this note:

- One additional Playwright project, named (proposed) `p1-mobile-390x844-webkit-fake-only`, running at the same `viewport: { width: 390, height: 844 }`, `deviceScaleFactor: 3`, `isMobile: true`, `hasTouch: true` configuration used today by `p0-mobile-390x844`, but with `browserName: 'webkit'` substituted for `chromium`.
- Same `testDir: './tests/e2e'`, same `webServer` block, same `baseURL`, same fixtures, same fake `unlocked=1` signal, same mock balance and cost, and same local Next.js dev server.
- No new GitHub Actions job, no new runner OS, no new runner architecture, no new environment, no new secrets, no new shared infrastructure, and no reuse of NovelHub production CI, NovelHub production runners, NovelHub production secrets, NovelHub production data, or NovelHub production deployment pipelines. NovelHub is referenced in this note only as a future/reference-only pattern source for review automation tooling.
- The second-engine project, if ever authorized, is an additive evidence surface only. It does not change `p0-mobile-390x844`, does not change PRD §15 QA acceptance criteria, does not change the route invariant, does not introduce real video/network/backend/auth/payment/analytics/Facebook work, and does not constitute production readiness.

Recommended status of this recommendation: docs-only proposal material. Product/QA confirmation is required to approve the proposal in principle. Architecture/security/compliance review is required before any matrix expansion or configuration change. Legal/platform-policy review is required before any production browser, device, or environment matrix is treated as authoritative. None of those approvals exists today; this note does not record them and does not pre-authorize them.

## Architecture summary

Today's review surface (descriptive only, unchanged by this note):

- `playwright.config.ts` declares a single project, `p0-mobile-390x844`, with `browserName: 'chromium'`, `viewport: { width: 390, height: 844 }`, `deviceScaleFactor: 3`, `isMobile: true`, `hasTouch: true`, against a local Next.js dev server bound to `127.0.0.1` on `PLAYWRIGHT_PORT` (default 4173).
- `testDir` is `./tests/e2e`. Trace/screenshot/video are retained on failure only. `fullyParallel` is `false`. `forbidOnly` is `true` under CI. `retries` is `1` under CI.
- The local Next.js dev server is started via `pnpm exec next dev` against the same host/port and is reused when not running under CI.
- GitHub Actions workflows handle code review automation and PR checks. They are not modified by this note.

Proposed future shape of a second-engine review surface (requirements language only, never implemented by this note):

- One additional Playwright project entry in the same `projects: [...]` array, named (proposed) `p1-mobile-390x844-webkit-fake-only`, structurally mirroring the existing `p0-mobile-390x844` entry except for `browserName: 'webkit'`.
- The same `webServer` block, the same `baseURL`, the same `testDir`, and the same shared `use` defaults (trace/screenshot/video on failure only).
- The same fixtures, same fake `unlocked=1` signal, same mock balance/cost, and same local dev server. No fixture fork, no parallel fake data, no separate test suite, no environment-specific code path.
- Selector parity policy: tests must remain selector-stable across both engines. If a selector requires engine-specific handling, that is a flake signal and triggers reversibility review (see Reversibility criteria below), not a per-engine code branch.
- Optional `grep`/`grepInvert` or test annotation policy may later be defined, docs-only, to scope which tests run on the second engine (for example, only PRD §15 QA acceptance items). That policy is not authorized by this note.

Architecture intent:

- The second engine is a rendering-engine consistency check at the same mobile viewport. It is not a device coverage check, not a viewport coverage check, not a network coverage check, not an environment coverage check, and not a production-readiness check.
- The second engine confirms that locked-state visuals, drawer behavior, mobile safe-area drawer CTA, and same-episode return after fake unlock/pass render consistently across rendering engines at the iPhone-like mobile viewport.
- The second engine is reversible by removing one entry from the `projects: [...]` array and any associated docs/evidence convention. Removal must not affect the P0 project, its tests, its fixtures, or its evidence.

## Decisions / rejected alternatives

Decisions recorded as proposals only (none authorized for implementation by this note):

1. Same-viewport second engine (proposed default). Add exactly one second engine at the same iPhone-like 390x844 viewport with the same mobile/touch emulation, kept fake-only. Rationale: smallest coherent additive surface that produces useful rendering-engine consistency evidence without expanding device/viewport/environment scope.
2. Single named candidate. Name webkit as the proposed candidate engine because it is the most direct fake-only proxy for iPhone Safari rendering at the PRD-anchored 390x844 mobile viewport. If product/QA prefer a different engine, that choice is recorded as a separate docs-only architecture gate revision.
3. Same fixtures, same dev server, same fake signals. The second engine must consume the same fixtures, the same fake `unlocked=1` signal, the same mock balance/cost, and the same local dev server as the current `p0-mobile-390x844` project. No fixture fork is permitted.
4. Additive, not substitutive. The second engine never replaces, supersedes, or downgrades the `p0-mobile-390x844` project. Removal of the second engine must leave the P0 floor intact.

Rejected alternatives (recorded only to prevent silent re-entry):

1. Reject: multi-engine fan-out. Adding webkit and firefox simultaneously, or any engine list beyond a single named candidate, is rejected because it multiplies maintenance, flake, and runtime cost without proportional review benefit at the same viewport.
2. Reject: additional viewports on the same engine. Adding a second viewport (smaller mobile, larger mobile, tablet, desktop) on chromium, even at fake-only scope, is rejected at this stage because it expands review scope beyond the PRD-anchored 390x844 floor and conflicts with the Q24 packet's P2 / hard-stop-deferred classification for additional viewports.
3. Reject: device-emulation expansion. Adding multiple device profiles (Pixel, Galaxy, iPad, Desktop Chrome) is rejected because it conflates rendering-engine consistency review with device-coverage review and would require a separate cross-device matrix decision.
4. Reject: in-app browser coverage. Adding Facebook in-app, Instagram in-app, WeChat, Line, or other webview surfaces is rejected as P2 / hard-stop-deferred. Those surfaces have webview/policy/behavior constraints that require separate product/legal/platform-policy review.
5. Reject: real video/network/backend on the second engine. Wiring the second engine to a real video provider, real network conditions, real backend/auth/payment/analytics, or any non-fake fixture is rejected. Real-video and real-network coverage belong to Q16 and remain hard-stop-deferred.
6. Reject: new GitHub Actions job, new runner OS, new runner architecture, new environment, new secrets, or any reuse of NovelHub production CI/runners/secrets/data/pipelines. Rejected as production-coupling and outside Q24's authorized scope.
7. Reject: every-PR default trigger. Defaulting the second engine to every PR is rejected at this stage. Trigger surface must be decided by product/QA/architecture once flake/runtime/cost are budgeted. Conservative defaults to consider in that later decision: `main`-only, nightly schedule, or PR label opt-in.
8. Reject: making the second engine load-bearing for P0 acceptance. Rejected because P0 acceptance must remain defensible with the single `p0-mobile-390x844` project; otherwise reversibility is broken.
9. Reject: declaring the resulting matrix sufficient for production readiness. Rejected because Q9–Q23 hard-stop decisions remain independent gates.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q24 work, including this feasibility note and any later authorized second-engine project, must not change P0. The following P0 behaviors remain non-negotiable across any current or future Playwright project entry:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, Show Detail, Pass, login, recharge, or Story Pass education first.
- Free preview plays before login, recharge, subscription, PWA install prompt, payment-like prompt, production entitlement, or real attribution processing.
- `story.freeEpisodes` remains the per-drama lock point source.
- The first locked episode shows a clear locked playback state and opens the Unlock Drawer.
- The locked playback area does not show fake playback progress and is visually distinct from a weak network / video error state.
- Closing the Unlock Drawer keeps the user on the same locked episode.
- Tapping the locked playback area reopens the Unlock Drawer.
- The Unlock Drawer transparently shows drama title, episode number, balance, cost, primary single-episode unlock, secondary Story Pass, and same-episode return helper copy.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
- The user is not returned Home, does not lose show/episode context, does not stay on Pass after fake success, and is not required to find the drama again.
- Mobile safe area does not cover drawer CTA.

P0 evidence floor referenced by this note remains the current `p0-mobile-390x844` Playwright project at `browserName: 'chromium'`, `viewport: { width: 390, height: 844 }`, `deviceScaleFactor: 3`, `isMobile: true`, `hasTouch: true`, plus existing GitHub Actions workflows. This note does not change that floor and does not modify any configuration file.

## Deferred infrastructure roadmap

The following items are deferred. None is authorized by this note.

P1 deferred (fake-only planning only; no implementation yet):

- A single additive second-engine Playwright project at the same iPhone-like 390x844 viewport, fake-only, gated on separate authorization.
- A docs-only architecture gate that records owner, flake budget, runtime budget, evidence-pack location, removal path, and reversibility criteria for the proposed second engine.
- A docs-only QA evidence plan defining the fake-only acceptance checklist that the proposed second engine would have to satisfy, anchored to PRD §15.
- A docs-only trigger-surface decision (PR-on-demand label, `main`-only, nightly schedule, or manual dispatch) including flake/runtime/cost budget.

P2 / hard-stop-deferred (cannot be authorized by Q24 alone):

- Cross-browser-beyond-the-named-P1-candidate matrix, additional viewports, additional device profiles, tablet, desktop, low-end Android, high-end Android, iOS Safari beyond webkit-engine emulation, Samsung Internet, in-app browser (Facebook in-app, Instagram in-app, WeChat, Line, etc.), accessibility-tool, or screen-reader coverage.
- Real-network, throttled-network, weak-network, offline, lossy-network, or geographic matrix coverage.
- Real-video, real-provider, real-streaming, real-DRM, real-CDN, real-HLS/DASH, or real-codec matrix coverage. Real-video matrix coverage remains gated on Q16.
- Real-backend, real-database, real-content-API, real-entitlement, real-auth, real-login, real-payment, real-subscription, real-wallet, real-refund, real-Facebook-API, real-Pixel/CAPI, or production analytics matrix coverage. Remains gated on Q9, Q10, Q11, Q12, Q13, Q14, Q20, Q21.
- Production environment, staging environment, preview environment, DNS, secrets, deployment, cutover, or production runner configuration. Remains gated on Q22, Q23.
- Legal/compliance/security/privacy/accessibility/platform-policy certification, including content-rights certification.
- Any reuse of NovelHub production infrastructure (CI, runners, secrets, data, deployment pipelines). NovelHub remains future/reference-only as a review automation pattern source.

## Task graph and dependencies

No implementation tasks are authorized by this note. If humans approve follow-up work, route it as separate gated tasks in this order; dependencies are explicit so no task may be silently skipped:

1. Product/QA review task (docs-only): confirm or revise the recommendation. Depends on: Q24 decision packet (already drafted as `docs/moboreels/phase-5/p1-q24-ci-browser-matrix-production-readiness-decision-packet.md`). Output: product/QA-approved proposal text. Blocks: every later task in this graph.
2. Architecture gate task (docs-only/fake-only): record the second-engine architecture gate naming owner, flake budget, runtime budget, evidence-pack location, removal path, and reversibility criteria. Depends on: task 1. Output: a separate docs-only architecture gate file under `docs/moboreels/phase-5/`. Blocks: tasks 4 and 6.
3. QA evidence plan task (docs-only/fake-only): define the fake-only acceptance checklist that the second engine would have to satisfy, anchored to PRD §15 and the P0 invariant. Depends on: task 1. Output: a separate docs-only QA evidence plan file. Blocks: tasks 4 and 6.
4. Trigger-surface decision task (docs-only): decide PR-on-demand vs `main`-only vs nightly vs manual dispatch, with flake/runtime/cost budgets. Depends on: tasks 2 and 3. Output: a docs-only trigger-surface decision. Blocks: task 6.
5. Hard-stop gate review task (docs-only): confirm no Q9–Q23 hard-stop scope is silently entrained (no real video, no real backend, no real auth, no real payment, no real subscription, no real analytics, no real Facebook APIs, no production environment/secrets, no NovelHub production infrastructure). Depends on: task 1. Output: a written confirmation referenced from the architecture gate. Blocks: task 6.
6. Implementation task (only if all above are approved): add one additive Playwright project entry mirroring `p0-mobile-390x844` with `browserName: 'webkit'` (or the engine chosen in task 2), without changing the existing `p0-mobile-390x844` entry, without changing `webServer`/fixtures/tests/evidence directories beyond what task 3 authorized, and without introducing new packages, new runner OS, new environment, new secrets, or reuse of NovelHub production infrastructure. Depends on: tasks 1–5. Output: a single small PR with the new project entry plus docs links to tasks 2 and 3.
7. Post-implementation review task: run the new project for one trigger cycle (PR/main/nightly per task 4), confirm flake/runtime/cost are within budget, confirm reversibility (the project can be removed without losing P0 evidence), and record evidence under the location chosen in task 3. Depends on: task 6.
8. Removal/demotion task (always available): remove the second-engine project entry if flake-rate, runtime, runner-cost, or P0-coupling thresholds defined in task 2 are breached. Depends on: task 2 thresholds being defined.

## Implementation notes

For when, and only when, a future authorized implementation task is approved. None of the following is authorized by this note. Listed only to make later review concrete:

- The implementation surface is one additional entry in the `projects: [...]` array of `playwright.config.ts`. The entry mirrors the existing `p0-mobile-390x844` entry (same `viewport`, `deviceScaleFactor`, `isMobile`, `hasTouch`, same `use` defaults inherited from `Desktop Chrome`) and substitutes `browserName: 'webkit'`. Spread of `devices['Desktop Chrome']` should be reviewed at implementation time to confirm that overriding `browserName: 'webkit'` is the correct way to express engine substitution in Playwright; if the canonical pattern is to spread a different `devices` entry (for example `devices['iPhone 13']` or `devices['iPhone 14']`) instead, that choice must be made in the architecture gate (task 2) before implementation, and it must not change the underlying 390x844 viewport, `deviceScaleFactor: 3`, `isMobile: true`, `hasTouch: true` parameters that anchor the P0 floor.
- The new project must keep `fullyParallel: false`, the same `timeout: 30_000`, the same `expect.timeout: 5_000`, the same `trace: 'retain-on-failure'`, the same `screenshot: 'only-on-failure'`, the same `video: 'retain-on-failure'`, and the same `retries` policy used today, unless a separate gate task explicitly authorizes a different value for the second engine.
- The new project must share the same `webServer` block. Do not start a second dev server, do not introduce a parallel build, and do not introduce a separate port.
- The new project must share `testDir: './tests/e2e'` and must not introduce a parallel test directory. Test scoping for the second engine, if needed, uses Playwright's project-level `testMatch` / `testIgnore` / `grep` / `grepInvert` annotations decided in the architecture gate (task 2), not directory forks.
- Browser installation: the second engine requires installing the corresponding Playwright browser binary. The architecture gate (task 2) must explicitly record how that install is performed in the developer environment and (separately) in CI, with no production secret, no production runner, and no NovelHub production CI reuse.
- No change to `package.json`, `pnpm-lock.yaml`, or runtime dependencies is authorized to add the second engine. Playwright itself is already a dev dependency in today's prototype; only the browser binary install is new, and only if a separate gate authorizes it.
- No change to GitHub Actions workflows is authorized by this note. If a trigger-surface decision (task 4) later asks for CI coverage, that change is a separate gated task; it must not couple to production secrets, production runners, or NovelHub production infrastructure.
- Tests must remain shared between projects. If a test must be skipped on the second engine, it is annotated via Playwright's `test.skip` with a one-line `// docs: <reason>` comment that points to the architecture gate file; engine-specific branching beyond skip annotations is rejected.
- The second-engine project must not introduce real network, real video, real backend, real auth, real payment, real analytics, real Facebook APIs, real attribution, real PWA install prompts, real production assets, or licensed/competitor copy. It runs only against the same local dev server and the same fake fixtures.
- The second engine must never be cited as production readiness, must never be cited as legal/compliance/accessibility/security/platform-policy coverage, and must never be cited as a substitute for any Q9–Q23 decision.

## Validation

Validation for this note (docs-only; no code execution, no browser run, no CI run, no PRD/roadmap/fixture/test/CI/config edit is required or authorized):

1. Confirm the status line states FEASIBILITY VERDICT — FEASIBLE WITH REVISIONS (non-blocking), docs-only / fake-only / non-implementation, and proposal pending human product/QA/architecture confirmation.
2. Confirm the non-authorization disclaimer near the top covers runtime code, route changes, fixtures, tests, Playwright work, test runner config, CI workflows, package/lockfile, browser-install, real video/provider, network/offline/error fallback, real backend/database/content APIs, real auth/login/session, real payment/subscription/wallet/refund/entitlement, real Facebook APIs/Pixel/CAPI, production analytics/attribution, deployment/DNS/cutover/secrets, legal/compliance/brand/security/privacy/platform-policy, licensed/competitor assets, NovelHub production infrastructure, accessibility certification, internationalization coverage, in-app browser surfaces, tablet/desktop/low-end-device matrix entries, and the current `p0-mobile-390x844` project.
3. Confirm the P0 invariant appears verbatim as a single unchanged line.
4. Confirm the recommendation describes the current `p0-mobile-390x844` Playwright project (chromium, 390x844, deviceScaleFactor 3, mobile/touch) plus existing GitHub Actions workflows as the P0 evidence floor and explicitly does not change it.
5. Confirm the recommendation names exactly one conservative additive candidate (a second engine at the same iPhone-like 390x844 viewport, proposed webkit, fake-only) and states it remains gated on separate authorization.
6. Confirm every other axis (additional viewports, devices, tablet, desktop, low-end Android, high-end Android, in-app browsers, accessibility tools, real-network, real-video, real-backend, real-auth, real-payment, real-subscription, real-analytics, real-attribution, production environments, NovelHub production infrastructure) is explicitly P2 / hard-stop-deferred.
7. Confirm the note explicitly states that no matrix expansion is approved and no `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, browser-install, test, fixture, or evidence change is made by this note.
8. Confirm PRD anchors include §1 (mobile PWA, 390x844 viewport), §3 (Non-Goals), §6 (P0 user flow), §8.3 (first locked episode state), §8.4 (Unlock Drawer), §8.6 (Unlock success return), §9 (PWA / safe area / weak network and offline distinct from locked), §11 (P0 scope), §12 (P1 scope), §13 (P2 scope), §14 (Out of scope), and §15 (QA acceptance checklist).
9. Confirm NovelHub is referenced only as a future/reference-only pattern source for review automation tooling, never as production CI, production runners, production secrets, production data, or a production deployment pipeline.
10. Confirm acceptance criteria explicitly forbid runtime implementation, real video/provider work, production error handling, backend/database/auth/payment/subscription/login/entitlement, analytics/Facebook, deployment/DNS/secrets, legal/compliance/security/privacy/accessibility decisions, and NovelHub production infrastructure.
11. Confirm the reviewer approval reference is recorded as `t_1c5ff2ab` only (Kanban handoff) and the active Kanban task is recorded as `t_12ab2e1b` only; no external commitments, no scheduling, no people, and no other Kanban IDs are invented.
12. Confirm product/QA confirmation remains required before treating the recommendation as approved, and architecture/security/compliance/legal/platform-policy review remains required before any matrix expansion or production-readiness conversation.

Future fake-only second-engine validation, if later authorized for implementation (criteria only; not executed by this note):

1. Canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`, observed identically on both engines.
2. Free preview plays before login, recharge, subscription, Story Pass prompt, PWA install prompt, payment-like prompt, or production entitlement check, on both engines.
3. First locked episode is derived from `story.freeEpisodes + 1`, on both engines.
4. First locked episode opens the Unlock Drawer automatically, on both engines.
5. Closing the drawer keeps the user on the same locked episode and does not show fake playback progress, on both engines.
6. Tapping the locked playback area reopens the Unlock Drawer, on both engines.
7. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`, on both engines.
8. Fake Story Pass purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`, on both engines.
9. Mobile safe-area drawer CTA visibility, locked-vs-error visual distinction, and same-episode return are visually consistent across both engines.
10. The second engine uses the same fake fixtures, the same fake `unlocked=1` signal, the same mock balance/cost, and the same local Next.js dev server as the `p0-mobile-390x844` project.
11. The second engine does not call, stub, depend on, or simulate real video providers, production network diagnostics, real backend/database/content APIs, production entitlement, real login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, deployment, DNS, secrets, or paid services.
12. The second engine project has a documented owner, a documented flake budget, a documented runtime budget, a documented evidence-pack location, a documented removal path, and documented reversibility criteria.

## Rollback / recovery

Because no change is authorized by this note, no rollback is required for this artifact. The artifact can be removed by deleting the file at `docs/moboreels/phase-5/p1-q24-second-engine-playwright-feasibility-note.md` without affecting any other file.

Rollback plan for a future authorized second-engine implementation, if one is ever approved:

1. Code-level rollback: remove the single additional entry from the `projects: [...]` array in `playwright.config.ts`. No other configuration change is permitted, so removal touches exactly one block. The `p0-mobile-390x844` project remains untouched.
2. Test-level rollback: remove any `test.skip` annotations that referenced the second engine, leaving the underlying assertions in place for the `p0-mobile-390x844` project.
3. Evidence-level rollback: remove the second-engine subdirectory from `qa-evidence/` or `artifacts/` per whatever convention the architecture gate (task 2) records. The `p0-mobile-390x844` evidence subdirectory is not touched.
4. CI-level rollback: if a separate gated task ever added a GitHub Actions job for the second engine, remove that job. The existing PR-check and code-review-automation workflows remain untouched.
5. Documentation rollback: append a one-line note to the architecture gate (task 2) recording the removal rationale (which threshold tripped, who decided), and update the QA evidence plan (task 3) to reflect that only the `p0-mobile-390x844` evidence stream remains.

Recovery plan if a regression is observed during the second-engine review cycle:

- If the regression is a P0 invariant deviation (route/drawer/same-episode-return), treat it as a product/QA-blocking event and pause the second engine via project-level `testIgnore` while product/QA triages the underlying behavior; the regression is the priority, not the second engine.
- If the regression is engine-only flake (selector-stable test fails only on the second engine and not on `p0-mobile-390x844`), invoke the flake/runtime/cost thresholds defined in the architecture gate (task 2) and demote or remove the second engine project per the removal path. Do not paper over engine-only flake with engine-specific branching.

## Risk gates

- Over-authorization risk: a reader could treat this note as approving a production-readiness matrix or a multi-browser/multi-device/multi-environment expansion. Gate: this note is requirements/architecture language only, names a single conservative additive candidate, and explicitly forbids treating any matrix entry as production readiness or as authorization for implementation.
- Silent-implementation risk: a reader could interpret the recommendation as authorization to edit `playwright.config.ts` immediately. Gate: this note explicitly forbids any config/test/CI/package/lockfile/browser-install change. Implementation requires tasks 1–5 in the task graph to complete first.
- False-confidence risk: a green second-engine run could be mistaken for product, legal, accessibility, security, or compliance certification. Gate: the second engine is an additive fake-only evidence surface; Q9–Q23 hard-stop decisions remain independent gates.
- Scope-creep risk: the second engine could quietly accumulate additional viewports, devices, in-app browser surfaces, real-network probes, or real-video stubs. Gate: every other axis is P2 / hard-stop-deferred; expansion beyond the single named engine requires a separate Q24 follow-up packet.
- Maintenance-cost risk: a second engine increases flake surface, runtime, and runner cost. Gate: flake/runtime/cost thresholds and the owner authorized to trigger removal are recorded in the architecture gate (task 2) before implementation.
- Reversibility risk: the second engine could become entangled with fixtures, fake data, or shared infrastructure such that removal breaks the P0 project. Gate: shared fixtures and shared dev server are required; engine-specific code branches beyond `test.skip` are rejected; removal must be a single project-array deletion.
- NovelHub-coupling risk: a future reader could conclude that the second engine should run on NovelHub production CI, NovelHub runners, or NovelHub secrets. Gate: NovelHub is referenced only as a future/reference-only pattern source for review automation tooling; no production reuse is authorized.
- Platform/in-app-browser risk: webkit at 390x844 is not a substitute for Facebook in-app, Instagram in-app, WeChat, Line, or other webview surfaces. Gate: in-app browser coverage remains P2 / hard-stop-deferred and requires separate product/legal/platform-policy review.
- Accessibility/internationalization risk: a second rendering engine does not certify screen-reader, low-vision, color-vision, keyboard-only, reduced-motion, RTL, or locale coverage. Gate: accessibility and internationalization remain P2 / hard-stop-deferred and require separate product/design/legal review.
- P0 invariant risk: introducing a second engine could subtly alter route behavior, drawer behavior, or same-episode return on either engine through shared test/fixture changes. Gate: same-show/same-episode return and single-episode-unlock-first remain non-negotiable acceptance criteria; the architecture gate (task 2) must list them as the first deletion-trigger conditions.
- Production-readiness risk: a future reader could interpret "second engine adds coverage" as a step toward production readiness. Gate: this note states that a second engine is neither necessary nor sufficient for production readiness; production readiness depends on independent Q9–Q23 approvals plus legal/compliance/security/privacy/accessibility/platform-policy review and is not addressed here.

## Flake, runtime, and cost implications

Stated as planning-level expectations only; actual numbers must be measured during the post-implementation review task (task 7) if implementation is ever approved.

- Flake implications: a second rendering engine increases the surface for engine-specific selector/timing flake. Selector parity (engine-stable selectors only) and shared fixtures are required to keep flake bounded. Architecture gate (task 2) must record a numeric flake-rate threshold (per project, over a rolling window of the most recent N runs) above which the second engine is demoted to manual dispatch or removed.
- Runtime implications: at the same viewport with the same test suite, a second engine roughly doubles end-to-end test runtime if both engines run the same tests serially under the existing `fullyParallel: false` policy. Mitigation: project-level scoping (the second engine runs only PRD §15 critical-path tests, decided in tasks 2 and 3), or trigger-surface scoping (the second engine runs only on `main` / nightly / opt-in PR label, decided in task 4). Runtime budget must be recorded in the architecture gate.
- Runner-cost implications: where the existing PR-check workflow runs on a GitHub-hosted runner, adding the second engine to that workflow approximately doubles the per-PR runner-minutes spent on Playwright. Mitigation: scope the second engine off the per-PR critical path (task 4). Runner-cost budget must be recorded in the architecture gate. No new runner OS, runner architecture, hosted-runner pool, self-hosted runner, NovelHub production runner, or production secret is authorized.
- Browser-install cost: installing the webkit browser binary adds developer-environment install time and CI cache surface. Architecture gate (task 2) must record the install approach (Playwright's standard install command, optionally cached) and confirm no production secret, production runner, or NovelHub production CI dependency is introduced.
- False-confidence cost: a green second-engine run can mislead readers into treating the matrix as more authoritative than it is. Mitigation: every evidence pack must be labeled "fake-only, additive, not production readiness" at its top.

## Evidence-pack layout (proposal only)

Recorded as a proposal for the QA evidence plan (task 3) to accept or revise. No directory is created by this note. Existing `qa-evidence/`, `artifacts/`, `tests/`, and `test-results/` directories are not modified.

Proposed convention (subject to task 3 revision):

- `qa-evidence/p1-q24/p0-mobile-390x844/<acceptance-item>/...` — the existing chromium mobile evidence stream, unchanged by this note. Used as the authoritative P0 floor.
- `qa-evidence/p1-q24/p1-mobile-390x844-webkit-fake-only/<acceptance-item>/...` — proposed additive evidence stream for the second-engine project, only if implementation is ever approved. Mirrors the P0 evidence-item structure one-for-one so reviewers can diff item-by-item.
- Per acceptance item, the second-engine subdirectory contains: a screenshot of the relevant state, an annotated trace export when failure occurred (`retain-on-failure` only), a one-line README naming which PRD §15 item is exercised, and a one-line attestation that no real video, network, backend, auth, payment, analytics, Facebook API, production environment, or NovelHub production infrastructure was involved.
- Top-level `qa-evidence/p1-q24/README.md` (proposed; not created by this note) names the architecture gate file, the QA evidence plan file, the owner, the flake/runtime/cost budget, and the removal path so reviewers can locate the governing decisions in one step.

The evidence-pack layout must remain reversible: deleting the second-engine subdirectory must not orphan, break, or rename anything under the `p0-mobile-390x844` subdirectory or any sibling phase-5 evidence.

## Owner proposal

Stated as a proposal only. No human is named in this note; assignment must be confirmed by product/QA/architecture in the gate tasks before implementation.

Proposed owner roles (single human or group per role; can be the same person across roles only with explicit product/QA acknowledgement):

- Architecture owner for Q24 follow-up: owns the architecture gate file (task 2), the engine choice (proposed webkit), the flake/runtime/cost thresholds, the removal path, and the reversibility criteria.
- QA evidence owner: owns the QA evidence plan file (task 3), the acceptance checklist anchored to PRD §15, and the evidence-pack layout convention.
- Trigger-surface owner: owns the trigger-surface decision (task 4) including PR-on-demand vs `main`-only vs nightly vs manual dispatch, and the runner-minute budget.
- Removal/demotion owner: owns invoking the removal path when flake/runtime/cost thresholds are breached. This may be the architecture owner or a separately named on-call rotation; the architecture gate must record the assignment explicitly so removal is not blocked on a missing owner.
- Hard-stop reviewers (separate gates, not owned by Q24): product owner (PRD §3, §11–§13), QA owner (PRD §15), security/compliance owner (Q22, Q23), legal/platform-policy owner (Q9, Q10, Q19), video/provider owner (Q16), backend/database owner (Q20, Q21), auth/payment owner (Q11, Q12, Q13, Q14).

Owner-naming guardrail: no production-side owner from NovelHub may be named as the runner-pool owner, secrets owner, or deployment owner for this second-engine project. NovelHub remains future/reference-only.

## Removal path

Removal of the second-engine project, if implementation is ever approved, must be a single mechanical action plus a docs touch. This is the canonical removal path that the architecture gate (task 2) must adopt and that any post-implementation review (task 7) must validate:

1. Open `playwright.config.ts`. Remove the single project entry named (proposed) `p1-mobile-390x844-webkit-fake-only` from the `projects: [...]` array. Do not touch the `p0-mobile-390x844` entry, the `webServer` block, the `use` defaults, or any other field.
2. Open the existing test files. Remove any `test.skip` annotations that referenced the second engine. Do not modify the underlying assertions.
3. Delete the `qa-evidence/p1-q24/p1-mobile-390x844-webkit-fake-only/` subdirectory (per the proposed evidence layout) and any sibling artifacts directory dedicated to the second engine. Do not touch the `p0-mobile-390x844` subdirectory.
4. If a separate gated task ever added a GitHub Actions job dedicated to the second engine, remove that job in the same PR. Do not modify other workflows.
5. Append a one-line removal record to the architecture gate file (task 2) and the QA evidence plan file (task 3): which threshold tripped, who decided, when, and which rolling window of evidence motivated the decision.

Removal must not require a PRD edit, a roadmap edit, a package.json or pnpm-lock.yaml edit, a new secret, or any coordination with NovelHub production infrastructure.

## Reversibility criteria

The second-engine project is reversible if and only if all of the following hold continuously after implementation. Any single failure triggers the removal path described above.

1. Removing the second-engine project entry from `playwright.config.ts` does not break the `p0-mobile-390x844` project, its tests, its fixtures, or its `webServer` configuration.
2. The `p0-mobile-390x844` project remains the sufficient evidence floor for PRD §15 QA acceptance items on its own.
3. No test file has been forked, renamed, or duplicated to accommodate the second engine. Test-level scoping for the second engine is expressed only via project-level Playwright annotations and `test.skip`, not via directory or file forks.
4. Fixtures, mock balance/cost, fake `unlocked=1` signal, and the local Next.js dev server remain shared. No second-engine-specific fixture exists.
5. No GitHub Actions workflow, runner OS, runner architecture, environment, secret, or third-party CI dependency was introduced solely to support the second engine that cannot be removed in the same PR that removes the project entry.
6. No PRD edit, roadmap edit, or status-flip in Phase 5 documents was made dependent on the second engine. The PRD and roadmap remain accurate after removal.
7. No NovelHub production infrastructure (CI, runner, secret, data, deployment pipeline) is used by the second engine at any point.
8. The flake-rate, runtime, and runner-cost thresholds recorded in the architecture gate (task 2) have not been breached during the rolling window defined there. If breached, reversibility holds but removal is mandatory.

## Non-scope and hard-stop guardrails

This note does not authorize, schedule, imply, or pre-approve:

- Runtime code changes, route behavior changes, or component changes.
- Fixture/data changes, test changes, or evidence-directory changes.
- `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, browser-install changes, or any other CI/configuration edit.
- PRD edits, roadmap edits, or Phase 5 status changes (including any change to the Q24 decision packet's status).
- Real video player/provider work, media hosting, buffering/retry/offline/error-state implementation, provider fallback, production playback monitoring, or Q16 provider decisions.
- Backend/database/API/auth/session/payment/subscription/entitlement implementation, or any Q11/Q12/Q13/Q14/Q20/Q21 work.
- Real unlock, paid access, wallet ledger, subscription access, receipt validation, or entitlement persistence.
- Real analytics, Facebook API/Pixel/CAPI, attribution, cookies/storage, identity, or consent work, or any Q9/Q10 decisions.
- Production deployment, DNS, secrets, non-production QA environments beyond docs-only planning, or any Q22/Q23 work.
- Legal/compliance/brand/security/privacy/platform-policy approval for matrix coverage, accessibility certification, real video, real attribution, or real payments, or any Q19 decisions.
- Licensed, competitor, or uncleared assets/copy.
- Declaring the current matrix or any future matrix sufficient for, equivalent to, or a substitute for any production-readiness decision.
- Reuse of NovelHub production CI, NovelHub production runners, NovelHub production secrets, NovelHub production data, NovelHub production deployment pipelines, or any other NovelHub production resource. NovelHub remains future/reference-only as a review automation pattern source.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, showing prompts before free preview, skipping the first locked episode's Unlock Drawer, changing `freeEpisodes` from a per-drama lock point, or making Story Pass primary at first lock.
- Cross-device matrix, additional viewports, tablet, desktop, low-end Android, high-end Android, iOS Safari beyond webkit-engine emulation, Samsung Internet, in-app browser surfaces, accessibility-tool, or screen-reader coverage.
- Real-network, throttled-network, weak-network, offline, lossy-network, or geographic matrix coverage.
- Any matrix expansion beyond the single conservative additive candidate named in this note.

Hard-stop guardrails:

- No matrix expansion is approved by this note.
- No `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, browser-install, test, fixture, or evidence-directory change is made by this note.
- No engine beyond the single named candidate is in scope.
- No production CI surface is in scope.
- No NovelHub production infrastructure is in scope.
- No PRD or roadmap edit is in scope.

## Validation / review gates

Gates required before this note's recommendation may be treated as approved (none of which is recorded by this note):

1. Product/QA confirmation of the recommendation in principle (engine choice, scope of acceptance items, anchoring to PRD §15).
2. Architecture review confirming flake/runtime/cost thresholds, evidence-pack layout, removal path, reversibility criteria, and owner assignments are sufficient.
3. Security/compliance confirmation that no production-side coupling (production secrets, production runner, NovelHub production infrastructure) is entrained by the proposed implementation surface.
4. Legal/platform-policy confirmation that no production browser, device, in-app-browser, accessibility-tool, or production-environment matrix is treated as authoritative by this note or by any task it spawns.
5. Video/provider (Q16) confirmation that no real-video, real-provider, real-streaming, real-network coverage is entrained by the proposed second engine.
6. Backend/database (Q20, Q21), auth/payment (Q11–Q14), analytics/Facebook (Q9, Q10), environments (Q22), and secrets (Q23) confirmation that no hard-stop scope is entrained.

Gates required before any implementation may begin (task 6 in the task graph):

1. The recommendation has been approved in principle by product/QA (task 1).
2. The architecture gate (task 2) names owner, flake budget, runtime budget, evidence-pack location, removal path, reversibility criteria, and the engine choice.
3. The QA evidence plan (task 3) names the acceptance items, anchored to PRD §15, and the evidence-pack layout convention.
4. The trigger-surface decision (task 4) names PR-on-demand vs `main`-only vs nightly vs manual dispatch, with explicit runner-minute budget.
5. The hard-stop gate review (task 5) records written confirmation that no Q9–Q23 scope is entrained.

Until all five gates above are recorded, no edit to `playwright.config.ts`, no test/fixture/evidence change, no CI workflow change, and no browser-install change is authorized.

## Next action

Next action is docs-only and human-routed, in this exact order. None of these actions is taken by this note.

1. Route this feasibility note to product/QA for confirmation of the recommendation in principle (task 1 in the task graph). The note remains proposal material until that confirmation is recorded against `t_12ab2e1b` or a successor Kanban task; the reviewer approval on `t_1c5ff2ab` covers the Q24 decision packet only and is not extended by this note.
2. If product/QA confirm in principle, route to architecture to draft the separate docs-only architecture gate file (task 2) under `docs/moboreels/phase-5/` naming owner, flake budget, runtime budget, evidence-pack location, removal path, reversibility criteria, and engine choice.
3. If product/QA confirm in principle, route to QA to draft the separate docs-only QA evidence plan file (task 3) anchored to PRD §15 and the P0 invariant.
4. If product/QA do not confirm in principle, leave this note as docs-only feasibility material and do not draft tasks 2–6. No status change is required.

No implementation, no browser install, no `playwright.config.ts` edit, no test edit, no fixture edit, no GitHub Actions edit, no PRD edit, and no roadmap edit is the next action.

## Stop conditions

Stop and escalate to human product/QA/architecture/security/compliance/legal before proceeding if any follow-up asks to:

- Edit `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `.github/workflows/`, browser-install scripts, tests, fixtures, evidence directories, or runtime code on the basis of this note alone.
- Add more than one second-engine entry, add a second viewport, add a device profile, add a tablet/desktop/low-end-device entry, add an in-app browser surface, or add an accessibility-tool surface on the basis of this note alone.
- Implement real video/player/provider, network/offline detection, provider fallback, production media error handling, or media hosting.
- Add backend/database/API/auth/session/login/payment/subscription/wallet/ledger/entitlement.
- Add Facebook API, Pixel/CAPI, production analytics, cookies/storage/identity/consent processing.
- Deploy, cut over DNS, use production secrets, add R2/production storage, or connect paid services.
- Return fake unlock/pass users to Home, lose episode context, require login before free preview, show prompts before free preview, skip the first locked drawer, or make Story Pass primary at first lock.
- Use licensed/competitor assets or make legal/compliance/brand-significant decisions without human approval.
- Reuse NovelHub production CI, NovelHub production runners, NovelHub production secrets, NovelHub production data, or NovelHub production deployment pipelines, or treat NovelHub as anything other than a future/reference-only review automation pattern source.
- Treat this feasibility note, the Q24 decision packet, the reviewer approval on `t_1c5ff2ab`, or any future architecture gate or QA evidence plan as final product/QA/architecture/security/compliance/legal/platform-policy approval, or as a production-readiness signal, without explicit human confirmation recorded against the relevant Kanban task.
