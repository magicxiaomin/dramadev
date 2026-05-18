# Phase 5 P1 Q2 Decision Packet — first-lock story hook default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q2: whether custom story hooks are required for every locked episode or only for the first locked episode.

Recommended default, pending product confirmation: require a custom story hook only for the first locked episode in P1; later locked episodes may use generic safe fallback copy until content metadata, editorial review, and asset/copy policy are explicitly expanded.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q2, line 10: "Should every locked episode have a custom story hook, or only the first locked episode?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q2, lines 71–85, proposes first-locked-episode-only custom hook coverage, with generic safe fallback copy for later locked episodes. That proposal remains pending human product confirmation.

This packet narrows Q2 into requirements, acceptance criteria, validation methods, assumptions, and gates for a later fake-only additive regression or fixture review. It does not approve implementation.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20–37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43–58: no Home/Search/Show Detail first, no login before free preview, no PWA install before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §5 Core Product Principles, lines 80–140: watch-first, free-preview-first, per-drama lock point via `freeEpisodes`, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §6 P0 User Flow, lines 142–158: user lands on EP1, continues through free episodes, reaches first locked episode, sees locked state and Unlock Drawer, then fake unlock/pass returns to same episode with `unlocked=1`.
- PRD §7 Route Requirements, lines 160–209: watch landing route, locked episode route, unlocked return route, and pass route preserving story/episode context.
- PRD §8.3 First Locked Episode State, lines 293–308: lock trigger condition, locked state requirements, drawer auto-open on first entry, drawer close leaves page locked, locked playback tap reopens drawer.
- PRD §8.4 Unlock Drawer, lines 310–364: drawer must show current story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, tertiary close, and return-to-episode explanation.
- PRD §8.5–§8.6, lines 404–486: Story Pass / unlock options and unlock success return must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §11 P0 Scope, lines 612–631: P0 requires first locked episode detection, Unlock Drawer, single-episode unlock primary, Story Pass secondary, mock unlock using `unlocked=1`, and return to same episode.
- PRD §12 P1 Scope, lines 633–648: P1 may include story-specific Pass page copy and other fake-only enhancements, but this is permission for future scope, not approval to implement Q2.
- PRD §13 P2 Scope, lines 650–665 and §14 Out of Scope, lines 731–743: real video/backend/login/payment/subscription/entitlement/analytics/Facebook CAPI remain deferred/out of scope.
- PRD §15 QA Acceptance Checklist, lines 744–777: P0 path must open EP1, preserve free preview, open Unlock Drawer at first lock, keep primary/secondary CTA hierarchy, and return same episode after fake unlock/pass.
- PRD §16 Open Questions, line 784: asks whether every locked episode should have a custom story hook.
- Prototype B spec, lines 1–3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q2 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, or Show Detail.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompts, or payment-like prompts.
- The per-drama lock point remains controlled by `freeEpisodes`.
- The first locked episode opens the Unlock Drawer.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake unlock/pass returns to the same episode with `unlocked=1`; users are not returned Home and do not lose episode context.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Requiring custom hooks for every locked episode.
- Broad episode-level editorial workflow for hooks after the first lock.
- Fixture schema or runtime data changes for multi-episode hook coverage.
- Story-specific Pass page copy beyond fake-only requirements already documented elsewhere.
- Automated tests, CI, Playwright changes, or browser evidence capture for Q2.

P2 / hard-stop-gated scope:

- Real video player, video hosting, streaming, error handling implementation, or provider integration.
- Real backend content retrieval, databases, schemas, APIs, production entitlement, wallet ledger, login, payment, subscription, refunds, cancellation, tax, local pricing, production analytics, Pixel/CAPI, Facebook APIs, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Licensed, competitor, third-party, stock, public-domain, or externally sourced assets/copy without explicit human/legal/product approval.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Real payment, real subscription, real login, real entitlement, real backend/database/API, real analytics, real Facebook integration, real video infrastructure, production deploy/DNS/secrets, or paid services.
- Legal/compliance/brand-significant content decisions.
- Licensed, competitor, or uncleared assets.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q2 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q2 becomes an approved default.
- A custom first-lock hook is the highest-value hook because the first locked episode is the core conversion moment and north-star metric denominator.
- Later locked episodes can safely use generic fallback copy in fake-only P1 as long as fallback copy is not misleading, not copied from competitors, and does not imply real payment/subscription/entitlement behavior.
- Missing custom hooks after the first lock should not block the P0 path or the first-lock Unlock Drawer proof point.
- `unlocked=1` remains fake-only review state and is not entitlement.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q2.
3. Q2 default is stated as proposal only: custom story hook required for the first locked episode in P1; generic safe fallback copy permitted for later locked episodes.
4. The packet explicitly states that Q2 does not authorize runtime code, fixture, test/CI, PRD, roadmap, real integration, production infrastructure, asset, legal, compliance, or brand-significant work.
5. PRD anchors include the Unlock Drawer current story hook requirement and the future open question about every locked episode hook coverage.
6. Product confirmation remains an explicit gate before treating the default as approved.

Future fake-only additive regression / fixture-review acceptance criteria, if later authorized:

1. The review starts at `/variant-b/watch/[showId]?episode=1&source=facebook` and preserves the full P0 invariant through the first locked episode, Unlock Drawer, fake unlock/pass, and same episode with `unlocked=1`.
2. The first locked episode, defined as `freeEpisodes + 1`, has a visible custom story hook in the Unlock Drawer.
3. The first-lock hook appears with drama title, locked episode number, fake balance, fake cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and return-to-same-episode helper copy.
4. The first-lock hook does not appear before the user reaches the first locked episode and does not introduce login, recharge, PWA install, subscription, Story Pass promotion, or payment-like prompts during the free preview chain.
5. If the reviewer navigates to a later locked episode without a custom hook, the drawer uses generic safe fallback copy rather than blank, broken, copied, competitor-like, legally risky, or production/payment-implying copy.
6. Generic fallback copy for later locked episodes must still identify the locked episode context and keep the single-episode unlock primary / Story Pass secondary hierarchy.
7. Missing custom hooks after the first locked episode must not break routing, drawer open/close behavior, locked playback tap-to-reopen behavior, or same-episode fake unlock/pass return.
8. The review remains fake-only and must not call, stub, depend on, or simulate real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, video provider, production deployment, DNS, secrets, or licensed/competitor assets.
9. Any proposed fixture field for episode hooks remains synthetic and placeholder-only until product/editorial/legal approval clears copy and asset provenance.
10. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage.

## Validation plan

1. Read this packet and confirm the status line says docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. Confirm the exact P0 invariant appears as a single unchanged line.
3. Confirm the recommended Q2 default is first-lock-only custom hook coverage, not every locked episode.
4. Confirm every Q2 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. Confirm the future acceptance criteria require the first locked episode hook but allow generic safe fallback copy for later locked episodes.
6. Confirm the packet does not instruct implementation, tests, CI, fixture changes, PRD edits, roadmap edits, production deployment, real integrations, secrets, legal/compliance decisions, asset adoption, or NovelHub production infrastructure.
7. Confirm product confirmation is still required before treating this as an approved product decision.

## Risks / gates

- Product decision gate: product must explicitly confirm whether first-lock-only hook coverage is approved, rejected, or replaced by every-locked-episode hook coverage.
- Editorial/copy gate: custom hooks can become brand-significant copy; product/editorial approval is required before adopting any final hook language.
- Legal/asset gate: no licensed, competitor, third-party, public-domain, stock, or uncleared assets/copy may enter prototype or production branches without explicit approval.
- Scope creep risk: requiring every locked episode to have a custom hook would expand content operations and fixture review beyond the first-lock conversion proof point.
- P0 regression risk: Q2 must not redirect users, require login before free preview, show prompts before free preview, change CTA hierarchy, or return post-unlock users away from the same episode.
- Entitlement/security gate: `unlocked=1` must remain fake-only and must never become production entitlement.
- Implementation gate: any code, fixture, test, CI, or infrastructure work requires a separate authorized task after requirements approval.

## Recommended task graph

1. Product owner reviews Q2 and confirms one of:
   - approve first-lock-only custom hook as P1 default;
   - require custom hooks for every locked episode;
   - defer Q2 with generic current hook behavior only.
2. If first-lock-only is approved, requirements creates a narrowed fake-only implementation-ready acceptance note for dev/QA, still preserving the P0 invariant.
3. Content/editorial reviewer defines approved synthetic first-lock hook copy rules and fallback-copy guardrails; no licensed/competitor/uncleared assets.
4. If authorized, dev adds only the minimal fake-only fixture/runtime support needed for first-lock hook display and generic fallback safety.
5. If authorized, QA adds an additive fake-only regression or fixture review that verifies first-lock hook presence, later-lock fallback safety, P0 invariant preservation, and no real-service dependency.
6. Any every-locked-episode hook coverage, production content workflow, real assets, backend content API, entitlement, analytics, payment, login, video, deploy, DNS, secrets, or NovelHub production work remains separate and hard-stop-gated.

## Open non-blocking questions

- Does product confirm first-lock-only custom hook coverage as the P1 default for Q2?
- What exact first-lock hook copy tone is acceptable for fake-only review without becoming brand-significant production copy?
- Should generic later-lock fallback copy be centralized as a single safe phrase, or may it vary by drama while still requiring product/editorial review?
- If every-locked-episode hooks are required later, what content-review workflow prevents blank hooks, copied competitor copy, and uncleared assets?
- Should the later fake-only review inspect only the first later locked episode after the first lock, or sample multiple later locked episodes?
