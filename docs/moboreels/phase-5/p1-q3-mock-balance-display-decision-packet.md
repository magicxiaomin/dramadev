# Phase 5 P1 Q3 Decision Packet — mock balance display default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q3: whether the mock balance appears before the first lock or only inside the Unlock Drawer.

Recommended default, pending product confirmation: show the mock balance only inside the Unlock Drawer for P1. Do not show a wallet, coin balance, recharge affordance, Story Pass prompt, subscription prompt, or payment-like CTA during the free preview chain before the first locked episode.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q3, line 11: "Should mock balance appear before the first lock, or only inside the Unlock Drawer?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q3, lines 87–101, proposes showing mock balance only inside the Unlock Drawer for P1, with a passive non-CTA post-free-episode balance chip as an alternate option. That proposal remains pending human product confirmation.

This packet narrows Q3 into requirements, acceptance criteria, validation methods, assumptions, and gates for a later fake-only additive review. It does not approve implementation.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20–37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43–58: no Home/Search/Show Detail first, no login before free preview, no PWA install before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60–78: the user clicked a Facebook ad to continue watching a specific drama, does not want to register/search/browse first, is willing to watch free episodes, and decides whether to unlock or purchase only after reaching a locked episode.
- PRD §5 Core Product Principles, lines 80–140: watch-first, free-preview-first, per-drama lock point via `freeEpisodes`, transparent unlock showing balance/cost in the locked episode flow, single-episode unlock first, and return to same episode.
- PRD §6 P0 User Flow, lines 142–158: user lands on EP1, continues through free episodes, reaches first locked episode, sees locked state and Unlock Drawer, then fake unlock/pass returns to same episode with `unlocked=1`.
- PRD §7 Route Requirements, lines 160–209: watch landing route, locked episode route, unlocked return route, and pass route preserving story/episode context.
- PRD §8.3 First Locked Episode State, lines 293–308: lock trigger condition, locked state requirements, drawer auto-open on first entry, drawer close leaves page locked, locked playback tap reopens drawer.
- PRD §8.4 Unlock Drawer, lines 310–364: drawer must show current story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, tertiary close, and return-to-episode explanation.
- PRD §8.4 Balance states, lines 372–392: P0 can mock balance; sufficient balance keeps primary CTA as `Unlock EP X`; insufficient balance may use `Get coins to unlock`; secondary CTA remains `Get Story Pass`.
- PRD §8.4 Login states, lines 394–402: free preview does not require login, unlock/payment-like actions may trigger login in production, and P0 may simulate unlock with `unlocked=1`.
- PRD §8.5–§8.6, lines 404–486: Story Pass / unlock options and unlock success return must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §11 P0 Scope, lines 612–631: P0 requires first locked episode detection, Unlock Drawer, single-episode unlock primary, Story Pass secondary, mock unlock using `unlocked=1`, and return to same episode.
- PRD §12 P1 Scope, lines 633–649: P1 may include local state and fake-only UX enhancements, but this is permission for future scope, not approval to implement Q3.
- PRD §13 P2 Scope, lines 650–665 and §14 Out of Scope, lines 731–743: real video/backend/login/payment/subscription/entitlement/analytics/Facebook CAPI remain deferred/out of scope.
- PRD §15 QA Acceptance Checklist, lines 744–777: P0 path must open EP1, preserve free preview, open Unlock Drawer at first lock, keep primary/secondary CTA hierarchy, and return same episode after fake unlock/pass.
- PRD §16 Open Questions, line 785: asks whether balance should be displayed before lock or only inside the Unlock Drawer.
- Prototype B spec, lines 1–3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q3 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, or Show Detail.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompts, balance-driven payment prompts, or payment-like CTAs.
- The per-drama lock point remains controlled by `freeEpisodes`.
- The first locked episode opens the Unlock Drawer.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake unlock/pass returns to the same episode with `unlocked=1`; users are not returned Home and do not lose episode context.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Showing any mock balance, wallet chip, coin counter, recharge entry, Story Pass prompt, subscription prompt, or payment-like CTA before the first locked episode.
- Testing a passive non-CTA balance chip after at least one free episode completes.
- Differentiating sufficient-balance and insufficient-balance pre-lock states outside the Unlock Drawer.
- Automated tests, CI, Playwright changes, browser evidence capture, fixture changes, or runtime UI changes for Q3.

P2 / hard-stop-gated scope:

- Real wallet balance, ledger, coin packs, recharge, payment, subscription billing, login, account state, server-side entitlement, backend/database APIs, production analytics, Pixel/CAPI, Facebook APIs, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Any legal, compliance, pricing, refund, cancellation, tax, local-price, renewal, or brand-significant monetization decision.
- Licensed, competitor, third-party, stock, public-domain, or externally sourced assets/copy without explicit human/legal/product approval.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Real payment, real subscription, real login, real entitlement, real backend/database/API, real analytics, real Facebook integration, real video infrastructure, production deploy/DNS/secrets, or paid services.
- Legal/compliance/brand-significant monetization decisions.
- Licensed, competitor, or uncleared assets.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q3 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q3 becomes an approved default.
- Balance is required for transparent unlock at the locked episode decision point, not as a pre-lock navigation, retention, recharge, or monetization prompt.
- A pre-lock balance display can be perceived as payment/recharge context even if it is fake; therefore it is riskier than drawer-only display for a free-preview-first funnel.
- Drawer-only balance still satisfies transparent unlock because the user sees balance and cost before choosing `Unlock EP X` or `Get Story Pass`.
- `unlocked=1` remains fake-only review state and is not entitlement.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q3.
3. Q3 default is stated as proposal only: mock balance appears only inside the Unlock Drawer for P1.
4. The packet explicitly states that Q3 does not authorize runtime code, fixture, test/CI, PRD, roadmap, real integration, production infrastructure, asset, legal, compliance, pricing, billing, payment, or brand-significant work.
5. PRD anchors include the no recharge/Story Pass promotion before first lock rule, transparent unlock balance/cost requirements, Unlock Drawer balance/cost requirements, balance states, and the future open question about pre-lock balance display.
6. Product confirmation remains an explicit gate before treating the default as approved.

Future fake-only additive review acceptance criteria, if later authorized:

1. The review starts at `/variant-b/watch/[showId]?episode=1&source=facebook` and preserves the full P0 invariant through the first locked episode, Unlock Drawer, fake unlock/pass, and same episode with `unlocked=1`.
2. No mock balance, wallet chip, coin counter, recharge entry, coin-pack CTA, Story Pass prompt, subscription prompt, login prompt, or payment-like CTA appears before the first locked episode.
3. Free episodes remain playable without login, recharge, balance education, subscription, Story Pass promotion, PWA install prompt, or other pre-lock prompts.
4. The first locked episode, defined as `freeEpisodes + 1`, opens the Unlock Drawer before any unlock decision.
5. The Unlock Drawer visibly shows fake balance and fake cost together with drama title, locked episode number, current story hook, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and return-to-this-episode helper copy.
6. The fake balance display is clearly scoped to the locked episode flow and must not imply real account state, real wallet ledger, real purchase history, real entitlement, real payment availability, or production pricing.
7. If sufficient-balance and insufficient-balance states are reviewed later, both states remain inside the drawer and preserve the first-locked-episode CTA hierarchy required by the PRD.
8. Closing the drawer leaves the user on the same locked episode context; tapping locked playback reopens the drawer and does not reveal pre-lock balance UI.
9. Fake unlock or fake Story Pass returns to the same locked episode with `unlocked=1`; the user is not sent Home and does not lose `episode` context.
10. The review remains fake-only and must not call, stub, depend on, or simulate real payment, subscription, login, Facebook API, analytics, backend, database, wallet ledger, entitlement, video provider, production deployment, DNS, secrets, or licensed/competitor assets.
11. Any alternate pre-lock balance chip proposal must remain a separate product decision and must prove it is passive, non-CTA, post-free-episode only, non-recharge, non-Story-Pass-promotional, and non-payment-like before implementation can be considered.
12. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage.

## Validation plan

1. Read this packet and confirm the status line says docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. Confirm the exact P0 invariant appears as a single unchanged line.
3. Confirm the recommended Q3 default is drawer-only mock balance display, not pre-lock balance display.
4. Confirm every Q3 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. Confirm the future acceptance criteria forbid balance, wallet, recharge, subscription, Story Pass, login, and payment-like prompts during the free preview chain before the first locked episode.
6. Confirm the future acceptance criteria require balance and cost inside the Unlock Drawer at the first locked episode.
7. Confirm the packet does not instruct implementation, tests, CI, fixture changes, PRD edits, roadmap edits, production deployment, real integrations, secrets, legal/compliance decisions, monetization/pricing decisions, asset adoption, or NovelHub production infrastructure.
8. Confirm product confirmation is still required before treating this as an approved product decision.

## Risks / gates

- Product decision gate: product must explicitly confirm whether drawer-only mock balance is approved, rejected, or replaced by a passive pre-lock balance-chip experiment.
- Funnel clarity risk: pre-lock balance UI may make the free preview chain feel monetized before the first locked episode, weakening free-preview-first behavior.
- P0 regression risk: Q3 must not redirect users, require login before free preview, show prompts before free preview, change CTA hierarchy, skip the drawer, or return post-unlock users away from the same episode.
- Monetization/legal gate: any real balance, coin pack, wallet ledger, payment, subscription, pricing, tax, refund, cancellation, renewal, or local-price behavior requires explicit human/legal/product approval.
- Entitlement/security gate: fake balance and `unlocked=1` must remain review/demo signals and must never become production entitlement or account state.
- Data/backend gate: real wallet/account state, backend APIs, databases, analytics, Pixel/CAPI, or Facebook integrations remain hard-stop-gated.
- Implementation gate: any code, fixture, test, CI, or infrastructure work requires a separate authorized task after requirements approval.

## Recommended task graph

1. Product owner reviews Q3 and confirms one of:
   - approve drawer-only mock balance as P1 default;
   - approve a separate passive pre-lock balance-chip experiment with strict non-CTA/no-recharge/no-Story-Pass/no-payment-like constraints;
   - defer Q3 and keep only the existing PRD requirement that balance/cost appear in the Unlock Drawer.
2. If drawer-only is approved, requirements creates a narrowed fake-only implementation-ready acceptance note for dev/QA, still preserving the P0 invariant.
3. If authorized, dev keeps or adjusts only fake-only UI state so mock balance is visible in the Unlock Drawer and absent from pre-lock free episodes.
4. If authorized, QA adds an additive fake-only regression or review checklist that verifies pre-lock absence, drawer presence, CTA hierarchy, and same-episode fake unlock/pass return.
5. Any real wallet, payment, subscription, login, entitlement, backend/database, analytics, Facebook API, deploy, DNS, secrets, or NovelHub production work remains separate and hard-stop-gated.

## Open non-blocking questions

- Does product confirm drawer-only mock balance as the P1 default for Q3?
- If product wants a pre-lock balance chip later, exactly when may it first appear: after one free episode, after all free episodes, or only after the drawer has been seen once?
- What copy, if any, is acceptable for fake balance so it cannot be mistaken for real wallet/account state?
- Should insufficient-balance drawer behavior remain out of the default P1 path unless a separate fake-only review is authorized?
- Should future QA evidence verify absence of pre-lock balance on every free episode, or sample EP1 plus the final free episode before first lock?
