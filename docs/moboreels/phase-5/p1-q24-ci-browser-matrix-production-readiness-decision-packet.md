# Phase 5 P1 Q24 Decision Packet — CI/browser matrix required before a future production-readiness decision

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product/QA/architecture confirmation. This packet does not approve, authorize, schedule, or imply production readiness.

This packet does not authorize PRD edits, roadmap edits, runtime code, route changes, component changes, fixtures, tests, Playwright work, test runner changes, CI workflow changes, GitHub Actions changes, package or lockfile changes, browser-install changes, real video/provider playback, production network/offline fallback handling, backend/database/auth/payment/subscription/login, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, entitlement logic, deployment/DNS/cutover/secrets, legal/compliance/brand/security/privacy/platform-policy decisions, licensed/competitor/uncleared assets, or NovelHub production infrastructure. NovelHub is referenced only as a pattern source for review automation, not as production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q24: what CI/browser matrix should be required before a future production-readiness decision can even be considered for the SceneFlow Facebook ad conversion MVP.

Recommended default, pending human product/QA/architecture confirmation: keep today's fake-only mobile-only Playwright matrix (chromium at the iPhone-like 390x844 viewport) as the P0 evidence floor, treat any expansion into additive fake-only secondary review surfaces (for example a webkit-engine pass at the same mobile viewport) as a P1 candidate that still requires a separate authorization, and treat any cross-browser, cross-device, tablet, desktop, low-end Android, real-network, real-video, production-analytics, real-payment, real-login, or production-environment matrix as P2 / hard-stop-deferred until product, QA, architecture, security, and legal have separately approved Q9, Q10, Q11, Q12, Q13, Q14, Q16, Q19, Q20, Q21, Q22, and Q23.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: Phase 5 Questions line 44, `docs/moboreels/phase-4g/phase-5-questions.md`, Q24: "What CI/browser matrix is required before a future production-readiness decision?"

Q24 sits inside the "Backend, database, and operations" question group. Most adjacent questions (Q20 backend content retrieval, Q21 database schema, Q22 non-production QA environments, Q23 secrets management) are explicitly hard-stop. Q24 does not carry an explicit hard-stop label but is anchored to a future production-readiness decision that must not be authorized inside this packet.

Existing PRD constraints relevant to Q24:

- The MVP is a mobile PWA / web prototype with a primary viewport of approximately 390 x 844 (PRD §1).
- P0 must not require login before free preview, must not show PWA install prompts before first playback, must not show recharge or Story Pass prompts before the first locked episode, and must not build real payment, real subscription, real Facebook APIs, or a real video player (PRD §3).
- P0 acceptance is documented as a QA acceptance checklist of fake-only behavioral states, not as a production browser matrix (PRD §15).
- P2 explicitly defers real video, real backend, real login, real payment, real subscription, wallet ledger, production analytics, server-side entitlement, and Facebook CAPI (PRD §13).

This packet narrows Q24 into assumptions, default recommendation, acceptance criteria, validation methods, risk gates, and a recommended task graph for later review. It does not approve implementation, does not change today's Playwright matrix, and does not pre-authorize any production-readiness decision.

No user input is required to draft this packet because the default follows explicit PRD requirements that the MVP remains a mobile-first fake-only prototype and that real video, real backend, real auth, real payment, real analytics, and Facebook APIs remain hard-stop deferred. Human product/QA/architecture/security/compliance confirmation is required before any matrix expansion, before any new CI surface, before any change to today's Playwright config, and before any production-readiness conversation.

## PRD sections reviewed

- PRD §1 Status, lines 1-12: implementation target is Mobile PWA / Web prototype; primary viewport is iPhone-like approximately 390 x 844.
- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: MVP must not require login before free preview, must not show PWA install prompts before first playback, must not show recharge or Story Pass prompts before the first locked episode, and must not build real payment, real subscription, real Facebook APIs, real video, or copy competitor assets.
- PRD §5.1-§5.6 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode are required.
- PRD §6 P0 User Flow, lines 142-158: users proceed from free episodes to the first locked episode, the Unlock Drawer opens, and fake unlock/pass returns to the same episode with `unlocked=1`.
- PRD §7.1-§7.4 Route Requirements, lines 162-209: locked episodes use `/variant-b/watch/[showId]?episode=[episodeNumber]`; unlocked return route simulates success with `unlocked=1`; optional future attribution params should not disrupt routing or playback in P0.
- PRD §8.1 Watch Page, lines 212-250: Watch page must show current free/locked state and includes required states for playing, paused, episode complete, loading next, first locked episode, Unlock Drawer open, unlocked episode, and drawer closed/maybe later.
- PRD §8.3 First Locked Episode State, lines 293-308: locked playback should be clearly distinct, must not show fake playback progress, must not look like a network error, and reopens the Unlock Drawer on tap.
- PRD §8.4 Unlock Drawer, lines 310-402: drawer must show story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, helper copy that unlock returns to this episode, and mock login/unlock constraints.
- PRD §8.6 Unlock Success Return, lines 465-487: fake unlock returns to same drama/episode, sets unlocked state, resumes playable state, and must not return Home, stay on Pass, lose context, or keep showing locked state.
- PRD §9 PWA Requirements, lines 538-562: install prompts must not interrupt first playback; PWA UI must consider iOS safe area, bottom drawer safe area, standalone return paths, weak network state distinct from locked state, and offline state distinct from locked state.
- PRD §10 Metrics, lines 564-610: funnel review covers fake-only states; production analytics are not P0.
- PRD §11 P0 Scope, lines 612-631: P0 includes Facebook ad direct Watch landing behavior, free preview without login, per-drama lock point via `freeEpisodes`, first locked episode detection, locked playback state, Unlock Drawer, single-episode unlock as primary, Story Pass as secondary, mock unlock using `unlocked=1`, return to same episode, Episode Sheet, and locked episode click opening Unlock Drawer; PWA install prompt is not allowed before first playback.
- PRD §12 P1 Scope, lines 633-649: P1 may include local continue-watching, episode completion tracking, attribution planning, story-specific pass copy, unlock success toast, wallet/unlock history mock, and delayed PWA education; production analytics, real video, real backend, real login, real payment, real subscription, and Facebook CAPI are not P1.
- PRD §13 P2 Scope, lines 650-665: real video player, real backend content retrieval, real login, real payment, real subscription, wallet ledger, refund/cancellation flows, multi-language ad landing, recommendation engine, server-side entitlement, production analytics, and Facebook CAPI integration are deferred.
- PRD §14 Developer Handoff Notes, lines 667-743: real payment, real subscription, real video, real Facebook API, production analytics, production entitlement, production login, and real wallet ledger are out of scope for initial implementation.
- PRD §15 QA Acceptance Checklist, lines 744-777: P0 acceptance is a fake-only behavioral checklist covering the route invariant, free preview, first locked episode, Unlock Drawer, Episode Sheet, same-episode return, mobile safe area for drawer CTA, and locked state visually distinct from weak network / video error state.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q24 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, Show Detail, Pass, login, recharge, or Story Pass education first.
- Free preview remains before login, recharge, subscription, PWA install prompt, payment-like prompt, production entitlement, or real attribution processing.
- `story.freeEpisodes` remains the per-drama lock point source.
- The first locked episode shows a clear locked playback state and opens the Unlock Drawer.
- The locked playback area does not show fake playback progress.
- Closing the Unlock Drawer keeps the user on the same locked episode.
- Tapping the locked playback area reopens the Unlock Drawer.
- The Unlock Drawer transparently shows drama title, episode number, balance, cost, primary single-episode unlock, secondary Story Pass, and same-episode return helper copy.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to the same episode with `unlocked=1`.
- The user must not be returned Home, lose show/episode context, stay on the Pass page after fake success, or be required to find the drama again.

The P0 CI/browser matrix floor referenced by this packet describes the current docs-only/fake-only review surface that already exists in the prototype repository: a single Playwright project running chromium at an iPhone-like mobile viewport of approximately 390 x 844 with mobile/touch emulation, plus the existing GitHub Actions workflows for code review automation and PR checks. This packet does not authorize any change to that current configuration; it only names it so future review work can be discussed in relative terms.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Any actual change to `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, browser-install steps, or GitHub Actions workflow files.
- Any new Playwright project, additional viewport, additional browser engine, additional device profile, or additional test runner.
- Any new GitHub Actions job, matrix entry, environment, runner OS, runner architecture, or scheduled run.
- Any new fixture, test, screenshot, video capture, trace export, or evidence pack tied to a new browser surface.
- Any reorganization of `qa-evidence/`, `artifacts/`, `tests/`, or `test-results/` directories to accommodate additional surfaces.
- A future P1 fake-only additive review pass on a second engine at the same mobile viewport, if separately authorized.
- Any PRD/roadmap update that changes Q24 status from proposal to approved, or that introduces a production-readiness matrix into the PRD.

P2 / hard-stop-gated scope:

- Any cross-browser, cross-device, tablet, desktop, low-end Android, high-end Android, iOS Safari, Samsung Internet, in-app browser (Facebook in-app, Instagram in-app, WeChat, Line, etc.), accessibility-tool, or screen-reader matrix targeted at production readiness.
- Any real-network, throttled-network, weak-network, offline, lossy-network, or geographic matrix.
- Any real-video, real-provider, real-streaming, real-DRM, real-CDN, real-HLS/DASH, or real-codec matrix.
- Any real-backend, real-database, real-content-API, real-entitlement, real-auth, real-login, real-payment, real-subscription, real-wallet, real-refund, real-Facebook-API, real-Pixel/CAPI, or real-analytics matrix.
- Any production environment, staging environment, preview environment, DNS, secrets, deployment, cutover, or production runner configuration.
- Any matrix tied to legal, compliance, security, privacy, accessibility, platform policy, or content rights certification.
- Any reuse of NovelHub production infrastructure, NovelHub production CI runners, NovelHub production secrets, NovelHub production data, or NovelHub production deployment pipelines. NovelHub may be cited only as a pattern source for review automation, not as production infrastructure.
- Any decision that an existing matrix is sufficient for production readiness.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Route behavior changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- Changes to `.github/workflows/`, `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, `tests/`, `qa-evidence/`, `artifacts/`, `test-results/`, or related infrastructure.
- PRD or roadmap edits.
- Real video player/provider, media hosting, buffering, retry/offline/error-state implementation, provider fallback, production playback monitoring, or Q16 provider decisions.
- Backend/database/API/auth/session/payment/subscription/entitlement implementation.
- Real unlock, paid access, wallet ledger, subscription access, receipt validation, or entitlement persistence.
- Real analytics, Facebook API/Pixel/CAPI, attribution, cookies/storage, identity, or consent work.
- Production deployment/DNS/secrets or NovelHub production infrastructure.
- Legal/compliance/brand/security/privacy/platform-policy approval for production matrix coverage, accessibility certification, real video, real attribution, or real payments.
- Licensed, competitor, or uncleared assets/copy.
- Declaring the current matrix sufficient, equivalent to, or a substitute for any future production-readiness matrix.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, showing prompts before free preview, skipping the first locked episode's Unlock Drawer, changing `freeEpisodes` from a per-drama lock point, or making Story Pass primary at first lock.

## Assumptions

- "Production-readiness decision" means a separate future human decision that authorizes real video, real backend, real auth, real payment, real subscription, real entitlement, real analytics, real attribution, real PWA install behavior in production, real network/offline handling, or deployment to a production environment. This packet does not make that decision and does not name a date for it.
- The current prototype is a docs-only/fake-only mobile-first PWA prototype; today's CI surface (chromium mobile 390x844 via Playwright, plus GitHub Actions workflows for review automation and PR checks) is the P0 evidence floor referenced by this packet, not a production matrix.
- "P1" in this Q24 packet means fake-only planning and future review scope unless a later human product/QA/architecture decision explicitly expands it.
- A CI/browser matrix is an evidence surface, not an entitlement, not a deployment target, and not a substitute for legal, compliance, security, privacy, accessibility, platform-policy, or content-rights approvals.
- Q24 must not authorize matrix expansion that depends on Q9 (Facebook redirect/API), Q10 (Pixel/CAPI/analytics), Q11 (real payment), Q12 (real subscription/Story Pass billing), Q13 (real login), Q14 (server-side entitlement), Q16 (real video provider boundary), Q19 (licensed/competitor asset policy), Q20 (backend content retrieval), Q21 (database schema), Q22 (non-production QA environment policy), or Q23 (secrets management). Those remain hard-stop deferred.
- NovelHub may be referenced only as a pattern source for review automation tooling, not as production CI infrastructure, not as a shared runner pool, not as a shared secrets store, and not as a deployment pipeline.
- Adding browser engines, viewports, or device profiles introduces real maintenance cost, real flake risk, real runner cost, and real false-confidence risk; this packet treats each addition as a separate gated decision rather than as a free expansion.
- Accessibility, internationalization, localization, in-app browser behavior, and platform-policy coverage are not part of the P0 floor and require separate product/legal/compliance/accessibility approval before becoming part of any future matrix.
- No user input is required for this packet. Product/QA confirmation is required to approve the default tiered matrix; architecture/security/compliance confirmation is required before any matrix expansion or production-readiness conversation; legal/platform-policy confirmation is required before any production browser, device, or environment matrix is treated as authoritative.

## Recommendation

Approve as proposal for product/QA/architecture review: keep today's mobile-only fake-only Playwright surface as the P0 evidence floor, name a conservative additive P1 candidate that remains gated on a separate authorization, and explicitly defer any production-readiness matrix to a future cross-functional decision.

Recommended default tiered matrix description (requirements language only; no implementation, no config edits, no new runners):

1. P0 evidence floor, already present and unchanged by this packet:
   - One Playwright project, chromium engine, iPhone-like mobile viewport of approximately 390 x 844, mobile/touch emulation enabled, against the local Next.js dev server.
   - Existing GitHub Actions workflows for code review automation and PR checks, with no new jobs added.
   - Acceptance evidence stays behavioral, fake-only, and tied to the PRD §15 QA acceptance checklist.
2. P1 fake-only additive candidate, only if separately authorized later:
   - One additional Playwright project on a second browser engine (for example webkit) at the same iPhone-like mobile viewport, kept fake-only, kept on the same fixtures, and used only to confirm that locked-state visuals, drawer behavior, safe-area handling, and same-episode return remain consistent across rendering engines.
   - No new GitHub Actions job, no new runner OS, no new environment, and no new secrets unless a separate Q22/Q23 decision authorizes them.
   - No additional viewport, device profile, tablet, desktop, or in-app browser surface.
   - No real video, real network, real backend, real auth, real payment, real analytics, or real attribution.
3. P2 / hard-stop-deferred, explicitly out of scope for this packet:
   - Any cross-device matrix covering multiple iOS versions, Android versions, tablet, desktop, low-end hardware, in-app browsers, screen readers, or accessibility tools.
   - Any production matrix covering real network conditions, real video providers, real backend services, real auth, real payments, real subscriptions, real analytics, real Facebook APIs, or real production environments.
   - Any matrix tied to legal, compliance, security, privacy, accessibility, or platform-policy certification.
   - Any reuse of NovelHub production CI, NovelHub production runners, NovelHub production secrets, NovelHub production data, or NovelHub production deployment pipelines.
4. Cross-cutting requirements that apply to every tier:
   - A CI/browser matrix entry is allowed only if it can be implemented docs-only/fake-only without real video, real backend, real auth, real payment, real analytics, real Facebook APIs, real attribution, real production environment, or licensed/competitor assets.
   - A matrix entry must preserve the P0 invariant verbatim, including watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
   - A matrix entry must not be treated as production readiness, must not be cited as legal/compliance/accessibility coverage, and must not be cited as a substitute for any hard-stop decision (Q9, Q10, Q11, Q12, Q13, Q14, Q16, Q19, Q20, Q21, Q22, Q23).
   - A matrix entry must be reversible: it can be removed without losing P0 acceptance evidence.
   - Flake budget, runtime budget, and runner cost must be reviewed before any matrix entry is added.

Rationale:

1. The PRD pins the MVP to a mobile-first fake-only PWA prototype with an iPhone-like 390x844 viewport, so a single mobile chromium surface is the minimum coherent P0 evidence floor.
2. Today's Playwright matrix already matches that floor and is referenced here only descriptively; this packet does not change it.
3. Naming a single conservative additive P1 candidate (a second engine at the same mobile viewport, fake-only) gives future reviewers a clear next step without prematurely committing to cross-device or production coverage.
4. Treating every other axis (additional viewports, devices, tablet, desktop, in-app browsers, accessibility tools, real network, real video, real backend, real auth, real payments, real analytics, real environments) as P2 / hard-stop-deferred prevents Q24 from quietly authorizing production-readiness scope.
5. Calling out reversibility, flake budget, runtime budget, and runner cost prevents a future matrix expansion from becoming load-bearing before it is justified.
6. Keeping NovelHub strictly as a review automation pattern source prevents accidental dependency on production infrastructure, production secrets, or production data.

Alternate option:

Defer all Q24 matrix language until Q16 (real video provider boundary) and Q22 (non-production QA environments) are independently approved, retaining only the implicit current floor (chromium mobile 390x844 via Playwright) without naming any P1 additive candidate.

Tradeoff: this minimizes near-term requirements work and avoids even naming an additive P1 surface, but leaves future reviewers without a documented next step and increases risk that an ad-hoc matrix expansion (a new browser, a new viewport, a new runner OS, a real-network probe) happens without going through a gated decision. It should remain an option only if product/QA does not want a documented P1 candidate before Q16 and Q22 are resolved.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product/QA/architecture confirmation.
2. The packet preserves the exact P0 invariant unchanged.
3. The packet preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
4. The packet states that the current mobile-only chromium-at-390x844 Playwright surface, plus existing GitHub Actions workflows, is the P0 evidence floor and is not modified by this packet.
5. The packet names a single conservative P1 additive candidate (a second browser engine at the same mobile viewport, fake-only) and states that it remains gated on a separate authorization.
6. The packet explicitly defers every other matrix axis (additional viewports, devices, tablet, desktop, in-app browsers, accessibility tools, real-network, real-video, real-backend, real-auth, real-payment, real-analytics, real-attribution, production environments) to P2 / hard-stop status.
7. The packet states that no CI/browser matrix entry constitutes production readiness, legal/compliance/security/privacy/accessibility certification, or a substitute for Q9-Q23 hard-stop decisions.
8. The packet explicitly forbids runtime code, route changes, fixture changes, test/CI changes, PRD/roadmap edits, package/lockfile changes, browser-install changes, backend/database/auth/payment/subscription/login/entitlement implementation, analytics/Facebook work, real video/provider work, production error handling, deployment/DNS/secrets, and NovelHub production infrastructure.
9. PRD anchors include §1 mobile PWA / 390x844 viewport, §3 Non-Goals, §11 P0 Scope, §12 P1 Scope, §13 P2 Scope, §14 Developer Handoff Notes Out of Scope, and §15 QA Acceptance Checklist.
10. The packet states that NovelHub is referenced only as a pattern source for review automation tooling and not as production CI infrastructure, shared runners, shared secrets, shared data, or a deployment pipeline.
11. Product/QA confirmation remains an explicit gate before treating this recommendation as approved; architecture/security/compliance/legal/platform-policy review remains an explicit gate before any matrix expansion, any new CI surface, or any production-readiness conversation.

Future fake-only additive review acceptance criteria, if later authorized for implementation:

1. The canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Free previews play before login, recharge, subscription, Story Pass prompt, PWA install prompt, payment-like prompt, or production entitlement check, across every authorized matrix entry.
3. First locked episode remains derived from `story.freeEpisodes + 1` when present, across every authorized matrix entry.
4. The first locked episode opens the Unlock Drawer automatically on first entry, across every authorized matrix entry.
5. Closing the drawer keeps the user on the same locked episode and does not show fake playback progress, across every authorized matrix entry.
6. Tapping the locked playback area reopens the Unlock Drawer, across every authorized matrix entry.
7. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode, across every authorized matrix entry.
8. Fake Story Pass purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode, across every authorized matrix entry.
9. Mobile safe-area drawer CTA visibility, locked-vs-error visual distinction, and same-episode return remain visually consistent across every authorized matrix entry.
10. Any authorized additive matrix entry uses the same fake fixtures, the same fake `unlocked=1` signal, the same mock balance and cost, and no real provider, no real backend, no real auth, no real payment, no real subscription, no real analytics, and no real attribution.
11. Implementation, if later approved, does not call, stub, depend on, or simulate real video providers, production network diagnostics, real backend/database/content APIs, production entitlement, real login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, deployment, DNS, secrets, or paid services unless a separate gated task explicitly authorizes it.
12. Each authorized matrix entry has a documented owner, a documented flake budget, a documented runtime budget, a documented removal path, and a documented evidence-pack location.

Accepted/deferred criteria summary:

- Accepted now as recommendation: the current chromium-mobile-390x844 Playwright surface plus existing GitHub Actions workflows is the P0 evidence floor; a second engine at the same mobile viewport is the conservative P1 additive candidate, gated on separate authorization; every other axis is P2 / hard-stop-deferred.
- Accepted now as P0 invariant: first locked episode opens the Unlock Drawer and fake unlock/pass returns to the same show and same locked episode with `unlocked=1`; users are not returned Home and do not lose episode context.
- Accepted now as guardrail: Q24 may define a fake-only review matrix in requirements language but must not change runtime config, must not authorize production readiness, and must not authorize any Q9-Q23 hard-stop scope.
- Deferred: any actual change to `playwright.config.ts`, `vitest.config.ts`, `package.json`, `pnpm-lock.yaml`, GitHub Actions workflows, tests, fixtures, or evidence directories; any new viewport, device, or engine; any new runner OS or environment; PRD edits; roadmap edits; approval status changes.
- Hard-stop deferred: cross-device, cross-browser-beyond-the-named-P1-candidate, tablet, desktop, in-app browser, accessibility-tool, real-network, real-video, real-backend, real-auth, real-payment, real-subscription, real-analytics, real-attribution, production-environment, legal/compliance/security/privacy/accessibility/platform-policy matrix coverage, and any reuse of NovelHub production infrastructure.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, browser evidence, CI runs, PRD edits, roadmap edits, fixture changes, tests, Playwright work, package/lockfile changes, or implementation.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product/QA/architecture confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes runtime code, route changes, real video/provider work, production error handling, backend/database/auth/payment/subscription/login/entitlement, Facebook/analytics, deployment/DNS/secrets, legal/compliance/brand/security/privacy/platform-policy, assets, NovelHub production infrastructure, and `.github/workflows/`, `playwright.config.ts`, `vitest.config.ts`, `package.json`, and `pnpm-lock.yaml`.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation describes the current chromium-mobile-390x844 Playwright surface plus existing GitHub Actions workflows as the P0 evidence floor and explicitly does not change it.
5. Confirm the recommendation names exactly one conservative P1 additive candidate (a second browser engine at the same mobile viewport, fake-only) and states it remains gated on separate authorization.
6. Confirm every other matrix axis is explicitly assigned to P2 / hard-stop-deferred, including additional viewports, devices, tablet, desktop, in-app browsers, accessibility tools, real-network, real-video, real-backend, real-auth, real-payment, real-subscription, real-analytics, real-attribution, and production environments.
7. Confirm the packet explicitly states that no matrix entry constitutes production readiness, legal/compliance/security/privacy/accessibility certification, or a substitute for Q9-Q23 hard-stop decisions.
8. Confirm Q16 real video/provider behavior, Q22 non-production QA environments, and Q23 secrets management are called out as hard-stop / deferred dependencies.
9. Confirm every Q24 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
10. Confirm PRD anchors include §1 mobile PWA / 390x844 viewport, §3 Non-Goals, §11 P0 Scope, §12 P1 Scope, §13 P2 Scope, §14 Out of Scope, and §15 QA Acceptance Checklist.
11. Confirm acceptance criteria explicitly forbid runtime implementation, real video/provider work, production error handling, backend/database/auth/payment/subscription/login/entitlement, analytics/Facebook, deployment/DNS/secrets, legal/compliance/security/privacy/accessibility decisions, and NovelHub production infrastructure.
12. Confirm NovelHub is referenced only as a review automation pattern source and not as production CI, production runners, production secrets, production data, or a production deployment pipeline.
13. Confirm product/QA confirmation remains required before approval, and architecture/security/compliance/legal/platform-policy review remains required before any matrix expansion or production-readiness conversation.

## Risks / gates

- Over-authorization risk: a future reader could treat this packet as approving a production-readiness matrix or a multi-browser, multi-device, multi-environment expansion. Gate: this packet is requirements language only, names a single conservative P1 additive candidate, and explicitly forbids treating any matrix entry as production readiness.
- False-confidence risk: a green CI matrix can be mistaken for product, legal, accessibility, security, or compliance certification. Gate: matrix entries are evidence surfaces only; Q9-Q23 hard-stop decisions remain required before any production-readiness conversation.
- Scope-creep risk: Q24 can quietly expand into Q16 (real video), Q20 (real backend), Q22 (real environments), Q23 (secrets), Q11/Q12/Q13/Q14 (payment/subscription/login/entitlement), or Q9/Q10 (Facebook/analytics). Gate: every other matrix axis is P2 / hard-stop-deferred until each owning question is independently approved.
- Maintenance-cost risk: adding browsers, viewports, devices, or runner OS introduces flake, runtime, and runner cost, and risks distracting reviewers from the P0 invariant. Gate: each additive entry requires a documented owner, flake budget, runtime budget, removal path, and evidence-pack location before authorization.
- Reversibility risk: matrix additions that are entangled with fixtures, tests, or shared infrastructure may become hard to remove. Gate: each authorized matrix entry must be reversible without losing P0 acceptance evidence.
- NovelHub-coupling risk: reusing NovelHub production CI, production runners, production secrets, or production data would silently couple this prototype to production infrastructure. Gate: NovelHub is referenced only as a review automation pattern source; no production reuse is authorized.
- Platform/in-app-browser risk: Facebook/Instagram in-app browsers, WeChat, Line, and similar surfaces have policy, behavior, and webview constraints that are not covered by this packet. Gate: in-app browser coverage is P2 / hard-stop-deferred and requires separate product/legal/platform-policy review.
- Accessibility/internationalization risk: screen-reader, low-vision, color-vision, RTL, locale, and platform-accessibility coverage are not covered by this packet. Gate: accessibility and internationalization matrix coverage is P2 / hard-stop-deferred and requires separate product/design/legal review.
- P0 invariant risk: future matrix expansion could subtly change route behavior, drawer behavior, or same-episode return. Gate: same-show/same-episode return and single-episode-unlock-first remain non-negotiable acceptance criteria across every authorized matrix entry.
- Production-readiness risk: a future reader could interpret "matrix required before a production-readiness decision" as "matrix is the only blocker for production". Gate: this packet states that a CI/browser matrix is necessary but not sufficient, and that real video, real backend, real auth, real payment, real subscription, real entitlement, real analytics, real attribution, deployment, DNS, secrets, legal, compliance, security, privacy, accessibility, and platform-policy approvals remain independent gates.

## Recommended task graph

No implementation tasks are authorized by this packet. If humans approve follow-up work, route it as separate gated tasks:

1. Product/QA review task: confirm or revise the Q24 default tiered matrix language, including the P0 evidence floor description, the single P1 additive candidate, and the explicit P2 / hard-stop-deferred axes.
2. Architecture feasibility-note task (docs-only/fake-only): describe what a second-engine Playwright project at the same iPhone-like mobile viewport would look like in requirements terms, including flake/runtime/cost implications, evidence-pack layout, and removal path. No config edits, no new runners, no new browsers installed.
3. Architecture gate task (docs-only/fake-only): record an architecture gate for the P1 additive candidate that names the owner, flake budget, runtime budget, evidence-pack location, removal path, and reversibility criteria. No config edits.
4. QA planning task (docs-only/fake-only): define a future fake-only evidence checklist that an additive matrix entry would have to satisfy, anchored to the PRD §15 QA acceptance checklist and the P0 invariant. No tests or browser work until separately authorized.
5. Architecture/video-provider gate task: if a Q16 provider boundary is later authorized, define how real-video matrix coverage would be added without violating watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, or return-to-same-episode behavior. Production-readiness approval not granted.
6. Environment/secrets gate task: if Q22 (non-production QA environments) and Q23 (secrets management) are later authorized, define how a non-production CI environment would be wired without touching production deploy, DNS, or secrets, and without coupling to NovelHub production infrastructure. Production-readiness approval not granted.
7. Security/compliance/legal/platform-policy gate task: before any production browser, device, in-app-browser, accessibility-tool, or production-environment matrix is treated as authoritative, require explicit hard-stop approval covering legal, compliance, security, privacy, accessibility, and platform-policy implications.
8. Docs reconciliation task: if product/QA approval is granted, update relevant Phase 5 status/decision documents without changing the PRD unless specifically authorized.
9. Implementation task, only after gates above: add approved fake-only or production matrix entries while preserving the P0 route invariant and without introducing unauthorized backend/payment/login/Facebook/video/analytics/production infrastructure.

## Open non-blocking questions

- Should the conservative P1 additive candidate be a second browser engine (for example webkit) at the same iPhone-like mobile viewport, or should it instead be a second iPhone-like viewport size (for example a smaller or larger mobile viewport) on the same chromium engine?
- Should the P1 additive candidate run on every PR, only on `main`, only on a nightly schedule, or only on demand, given flake and runtime budget?
- What flake-rate, runtime, and runner-cost thresholds should automatically trigger removal of an additive matrix entry, and who owns that removal decision?
- Should the matrix description name an evidence-pack layout convention (for example, where screenshots, traces, and videos for an additive entry would live under `qa-evidence/` or `artifacts/`) without authorizing implementation?
- Should Q24 explicitly call out in-app browser surfaces (Facebook in-app, Instagram in-app, WeChat, Line) as a separate future gated decision, or fold them into a generic "platform-policy matrix" P2 bucket?
- Should accessibility coverage (screen reader, low-vision, color-vision, keyboard-only, reduced-motion) be a separate future gated decision, or fold into a generic "accessibility certification" P2 bucket?
- Should Q24 list explicit no-go axes (for example, real-payment matrix, real-Facebook-API matrix, real-login matrix) as permanently out of scope for any CI/browser matrix decision, even after production readiness, or only as currently hard-stop-deferred?
- Who owns final approval for Q24 matrix expansion: product, QA, architecture, security/compliance, legal, platform-policy, accessibility, or a combined gate, and in what order?
- Should NovelHub review automation patterns be referenced by name in any future architecture gate, or should every reference remain abstract ("review automation patterns") to avoid implying shared infrastructure?
- Should the packet explicitly state that a CI/browser matrix decision can never alone authorize production readiness, even if all hard-stop gates (Q9-Q23) are independently resolved, or is that already implicit in the P2 / hard-stop-deferred classification?
