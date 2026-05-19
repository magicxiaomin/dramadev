# Phase 5 P1 Q4 Decision Packet — Story Pass secondary CTA default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q4: whether Story Pass remains secondary on the first locked episode in all campaigns.

Recommended default, pending product confirmation: yes. Story Pass remains the secondary CTA on the first locked episode in all P0/P1 Facebook-ad campaign paths. The primary CTA remains `Unlock EP X`. Do not make Story Pass primary for any campaign in this scope.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q4, line 12: "Should Story Pass stay secondary on the first locked episode in all campaigns?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q4, lines 103–117, proposes keeping Story Pass secondary on the first locked episode in all P1 campaigns because the CTA hierarchy is a core PRD decision, not an optimization knob. That proposal remains pending human product confirmation.

This packet narrows Q4 into requirements, acceptance criteria, validation methods, assumptions, and gates for a later fake-only additive review. It does not approve implementation.

No user input is required to proceed with this requirements packet because it preserves the current PRD CTA hierarchy and material scope. User/product input becomes required only if someone proposes changing CTA hierarchy, making Story Pass primary, creating campaign-specific first-lock CTA variants, or expanding into real payment/subscription/login/entitlement/analytics/Facebook/backend/video scope.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20–37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43–58: no Home/Search/Show Detail first, no login before free preview, no PWA install before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60–78: the user clicked a Facebook ad to continue watching a specific drama, does not want to register/search/browse first, is willing to watch free episodes, and decides whether to unlock or purchase only after reaching a locked episode.
- PRD §5 Core Product Principles, lines 80–140: watch-first, free-preview-first, per-drama lock point via `freeEpisodes`, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §5.5 Single-episode unlock first, lines 113–128: at the first locked episode, primary CTA is `Unlock EP X`, secondary CTA is `Get Story Pass`, and the rationale is to reduce first-conversion friction with a lower-commitment single-episode unlock.
- PRD §6 P0 User Flow, lines 142–158: user lands on EP1, continues through free episodes, reaches first locked episode, sees locked state and Unlock Drawer, may choose `Unlock EP X` or `Get Story Pass`, then fake unlock/pass returns to the same episode with `unlocked=1`.
- PRD §7 Route Requirements, lines 160–209: watch landing route, locked episode route, unlocked return route, and pass route preserving story/episode context.
- PRD §8.1 Watch Page, lines 230–237: before free playback, do not show login, recharge, Story Pass prompt, PWA install prompt, homepage redirect, or detail page redirect.
- PRD §8.3 First Locked Episode State, lines 293–308: lock trigger condition, locked state requirements, drawer auto-open on first entry, drawer close leaves page locked, and locked playback tap reopens drawer.
- PRD §8.4 Unlock Drawer, lines 310–364: drawer must show current story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, tertiary close, and return-to-episode explanation.
- PRD §8.4 Balance states, lines 372–392: P0 can mock balance; if sufficient, primary remains `Unlock EP X`; if insufficient, primary may become `Get coins to unlock`; secondary remains `Get Story Pass`.
- PRD §8.5–§8.6, lines 404–486: Story Pass / unlock options and unlock success return must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §10 Metrics, lines 564–610: first-lock conversion rate includes users who click unlock or Story Pass divided by users who reach the first locked episode, but Search/Genre/Home and PWA install rates are not P0 success metrics.
- PRD §11 P0 Scope, lines 612–631: P0 requires first locked episode detection, Unlock Drawer, single-episode unlock as primary CTA, Story Pass as secondary CTA, mock unlock using `unlocked=1`, and return to same episode.
- PRD §12 P1 Scope, lines 633–649: P1 may include local state, attribution planning, story-specific Pass page copy, unlock success toast, wallet/unlock history mock, and later PWA prompts, but this is permission for future scoped work, not approval to change first-lock CTA hierarchy.
- PRD §13 P2 Scope, lines 650–665 and §14 Out of Scope, lines 731–743: real video/backend/login/payment/subscription/entitlement/analytics/Facebook CAPI remain deferred/out of scope.
- PRD §15 QA Acceptance Checklist, lines 744–777: P0 path must open EP1, preserve free preview, open Unlock Drawer at first lock, show single-episode unlock as primary and Story Pass as secondary, and return same episode after mock unlock/pass.
- Prototype B spec, lines 1–3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q4 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, or Show Detail.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompts, or payment-like prompts.
- The per-drama lock point remains controlled by `freeEpisodes`.
- The first locked episode opens the Unlock Drawer.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Primary first-lock CTA remains `Unlock EP X` for sufficient fake-balance state. If an insufficient fake-balance state is later reviewed, any `Get coins to unlock` primary behavior must still keep `Get Story Pass` secondary and must remain fake-only.
- Story Pass must not become the primary CTA on the first locked episode in any P0/P1 Facebook-ad campaign path.
- Fake single-episode unlock and fake Story Pass purchase both return to the same episode with `unlocked=1`; users are not returned Home and do not lose episode context.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Campaign-specific first-lock CTA hierarchy variants.
- Making Story Pass visually dominant, primary, default-selected, preselected, sticky, or otherwise more prominent than `Unlock EP X` at the first locked episode.
- Story Pass-first experiments after the user has already passed the first locked episode, or in explicitly non-Facebook/non-P0 paths.
- Story-specific Pass page copy beyond preserving current drama/episode context and mock status.
- Automated tests, CI, Playwright changes, browser evidence capture, fixture changes, or runtime UI changes for Q4.

P2 / hard-stop-gated scope:

- Real Story Pass billing, real subscription, real payment, renewal, cancellation, refund, tax, local pricing, wallet ledger, production entitlement, login, account state, backend/database APIs, production analytics, Pixel/CAPI, Facebook APIs, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Any legal, compliance, pricing, refund, cancellation, tax, local-price, renewal, brand-significant monetization, or subscription disclosure decision.
- Licensed, competitor, third-party, stock, public-domain, or externally sourced assets/copy without explicit human/legal/product approval.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Changing CTA hierarchy, visual prominence, default selection, campaign targeting, or ranking logic in the running product.
- Real payment, real subscription, real login, real entitlement, real backend/database/API, real analytics, real Facebook integration, real video infrastructure, production deploy/DNS/secrets, or paid services.
- Legal/compliance/brand-significant monetization or subscription decisions.
- Licensed, competitor, or uncleared assets.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q4 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q4 becomes an approved default, even though this packet follows the expected PRD-preserving default.
- The first locked episode is the core first-conversion decision point; preserving `Unlock EP X` as primary reduces commitment and purchase friction.
- Story Pass remains a valid secondary path, but it must not interrupt the free preview chain or outrank the single-episode unlock at first lock.
- "All campaigns" means all P0/P1 Facebook-ad campaign paths in this fake-only scope, not future hard-stop-gated real Facebook campaign management or analytics integrations.
- `unlocked=1` remains fake-only review state and is not entitlement.
- No user input is required unless the CTA hierarchy, material scope, real systems, legal/compliance posture, or campaign-specific behavior is proposed to change.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q4.
3. Q4 default is stated as proposal only: Story Pass remains secondary on the first locked episode in all P0/P1 Facebook-ad campaign paths.
4. The packet explicitly states that Q4 does not authorize runtime code, fixture, test/CI, PRD, roadmap, real integration, production infrastructure, asset, legal, compliance, pricing, billing, payment, subscription, or brand-significant work.
5. PRD anchors include non-goals, single-episode unlock first, Unlock Drawer CTA hierarchy, P0 scope, and same-episode return behavior.
6. The packet explicitly states no user input is required unless changing CTA hierarchy, material scope, real-system scope, legal/compliance posture, or campaign-specific behavior.
7. Product confirmation remains an explicit gate before treating the default as approved.

Future fake-only additive review acceptance criteria, if later authorized:

1. The review starts at `/variant-b/watch/[showId]?episode=1&source=facebook` and preserves the full P0 invariant through the first locked episode, Unlock Drawer, fake unlock/pass, and same episode with `unlocked=1`.
2. No Story Pass prompt, subscription prompt, pass-first education, pass banner, pass interstitial, pass default selection, or payment-like CTA appears before the first locked episode.
3. Free episodes remain playable without login, recharge, Story Pass promotion, subscription, PWA install prompt, or other pre-lock prompts.
4. The first locked episode, defined as `freeEpisodes + 1`, opens the Unlock Drawer before any unlock decision.
5. The Unlock Drawer visibly shows drama title, locked episode number, current story hook, fake balance, fake cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and return-to-this-episode helper copy.
6. `Unlock EP X` is visually and semantically primary at first lock: primary button styling, first action position, primary accessibility/name semantics if applicable, and no default focus/selection that makes Story Pass appear primary.
7. `Get Story Pass` is visibly available as a secondary option but is not hidden, misleading, disabled without explanation, visually dominant over `Unlock EP X`, preselected, or presented as required before single-episode unlock.
8. If multiple fake campaigns, source params, or optional inert attribution params are reviewed, none changes the first-lock CTA hierarchy; Story Pass stays secondary for each reviewed P0/P1 Facebook-ad campaign path.
9. If an insufficient fake-balance state is reviewed later and primary changes to `Get coins to unlock` per PRD allowance, `Get Story Pass` remains secondary and the state remains fake-only; this does not authorize real coin packs, payment, wallet, ledger, login, or entitlement.
10. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[episodeNumber]&unlocked=1` and resumes the same episode context.
11. Fake Story Pass purchase also returns to the same locked episode with `unlocked=1`; it does not return Home, stay stranded on the Pass page, lose the `episode` parameter, or require the user to find the drama again.
12. Closing the drawer leaves the user on the same locked episode context; tapping locked playback reopens the drawer with the same `Unlock EP X` primary / `Get Story Pass` secondary hierarchy.
13. The review remains fake-only and must not call, stub, depend on, or simulate real payment, subscription, login, Facebook API, analytics, backend, database, wallet ledger, entitlement, video provider, production deployment, DNS, secrets, or licensed/competitor assets.
14. Any proposal to make Story Pass primary, campaign-specific, default-selected, or visually dominant at first lock is a material CTA hierarchy change and must return to product/requirements review before implementation can be considered.
15. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage.

## Validation plan

1. Read this packet and confirm the status line says docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. Confirm the exact P0 invariant appears as a single unchanged line.
3. Confirm the recommended Q4 default is Story Pass secondary on the first locked episode in all P0/P1 Facebook-ad campaign paths, not campaign-specific Story Pass primary behavior.
4. Confirm every Q4 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. Confirm PRD anchors include §3 Non-Goals, §5.5 Single-episode unlock first, §8.4 Unlock Drawer CTA hierarchy, §11 P0 Scope, and same-episode return requirements.
6. Confirm the future acceptance criteria forbid Story Pass prompts before the first locked episode and require first-lock drawer hierarchy: primary `Unlock EP X`, secondary `Get Story Pass`.
7. Confirm the future acceptance criteria require fake Story Pass purchase to return to the same episode with `unlocked=1` and not Home or a lost episode context.
8. Confirm the packet does not instruct implementation, tests, CI, fixture changes, PRD edits, roadmap edits, production deployment, real integrations, secrets, legal/compliance decisions, monetization/pricing/subscription decisions, asset adoption, or NovelHub production infrastructure.
9. Confirm product confirmation is still required before treating this as an approved product decision, and that user/product input is only required for CTA hierarchy/material-scope changes.

## Risks / gates

- Product decision gate: product must explicitly confirm whether Story Pass secondary is approved as the P1 default, rejected, or replaced by a separately scoped experiment.
- CTA hierarchy regression risk: campaign-specific Story Pass emphasis could violate the PRD non-goal and single-episode-unlock-first principle.
- Funnel clarity risk: Story Pass-first or pre-lock pass promotion may make the free preview chain feel monetized before the first locked episode.
- P0 regression risk: Q4 must not redirect users, require login before free preview, show prompts before free preview, change CTA hierarchy, skip the drawer, or return post-unlock users away from the same episode.
- Monetization/legal gate: any real Story Pass billing, subscription disclosure, renewal, cancellation, refund, tax, local-price, payment, pricing, or legal copy requires explicit human/legal/product approval.
- Entitlement/security gate: fake Story Pass purchase and `unlocked=1` must remain review/demo signals and must never become production entitlement or account state.
- Data/backend gate: real wallet/account state, backend APIs, databases, analytics, Pixel/CAPI, or Facebook integrations remain hard-stop-gated.
- Implementation gate: any code, fixture, test, CI, or infrastructure work requires a separate authorized task after requirements approval.

## Recommended task graph

1. Product owner reviews Q4 and confirms one of:
   - approve Story Pass secondary on first locked episode for all P0/P1 Facebook-ad campaign paths;
   - reject and request a separately scoped CTA hierarchy change proposal;
   - defer Q4 and keep only the existing PRD requirement that Story Pass is secondary in P0.
2. If Story Pass-secondary is approved, requirements creates a narrowed fake-only implementation-ready acceptance note for dev/QA, still preserving the P0 invariant.
3. Architecture/reviewer gate: before any implementation task, review that no campaign/source/attribution parameter can flip first-lock CTA hierarchy in the fake-only flow.
4. If authorized, dev keeps or adjusts only fake-only UI state so the first-lock drawer presents `Unlock EP X` as primary and `Get Story Pass` as secondary for all reviewed P0/P1 Facebook-ad paths.
5. If authorized, QA adds an additive fake-only regression or review checklist that verifies no pre-lock Story Pass prompt, first-lock CTA hierarchy, same-episode fake unlock/pass return, and no real-service dependency.
6. Any Story Pass-primary experiment, real subscription/payment/login/entitlement/backend/database/analytics/Facebook API/video/deploy/DNS/secrets work, or NovelHub production work remains separate and hard-stop-gated.

## Open non-blocking questions

- Does product confirm Story Pass secondary as the P1 default for Q4 across all P0/P1 Facebook-ad campaign paths?
- Should future fake-only QA evidence sample one default campaign path only, or multiple inert campaign/source parameter combinations to prove hierarchy is not campaign-switched?
- If product later wants Story Pass emphasis after the first locked episode has already been passed, what non-P0 path and review gate should own that experiment?
- What copy or visual treatment keeps Story Pass attractive as a secondary option without making it appear primary or required?
- If insufficient fake-balance drawer behavior is reviewed later, should `Get coins to unlock` be treated as a separate Q4-adjacent decision to ensure Story Pass remains secondary and fake-only?
