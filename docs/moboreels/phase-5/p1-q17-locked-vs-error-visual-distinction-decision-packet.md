# Phase 5 P1 Q17 Decision Packet — Locked vs error visual distinction

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, route changes, component changes, fixtures, tests/CI, Playwright work, real video/provider playback, production network/offline fallback handling, backend/database/auth/payment/subscription/login, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, entitlement logic, deployment/DNS/cutover/secrets, legal/compliance/brand decisions, licensed/competitor/uncleared assets, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q17: how the locked episode state should remain visually distinct from video, weak-network, and offline/error states when real playback exists later.

Recommended default, pending human product confirmation: define and preserve a distinct locked-state vocabulary in P1 docs and fake UI review evidence. Locked states should name the locked episode and unlock action, use lock/unlock affordances, and route the user back to the Unlock Drawer. Video/network/offline error states should use retry/offline/error vocabulary and must never show unlock CTAs. Real playback/provider behavior and production error handling remain Q16/P2 hard-stop/deferred.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` line 34, Q17: "How should locked state remain visually distinct from video/network errors when real playback exists?"

Existing proposal context: `docs/moboreels/phase-5/p1-decision-brief.md` lines 199-213 anchors Q17 in PRD §8.3, §9, §13, and §15; proposes locked copy, episode/unlock action, price/balance context in the drawer, and lock/unlock affordances; says network/video error states should use retry/offline/error copy and never show unlock CTAs; and marks real playback-specific implementation as P2/hard-stop-gated.

This packet narrows Q17 into assumptions, default recommendation, acceptance criteria, validation methods, risk gates, and a recommended task graph for later review. It does not approve implementation.

No user input is required to draft this packet because the default follows explicit PRD requirements that the locked state must not look like a network error and that weak network/offline states must be distinct from locked state. Human product/design/architecture/QA confirmation is required before treating the recommendation as an approved visual taxonomy or before any implementation work.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: the MVP must not send Facebook ad users to Home/Search/Show Detail first, require login before free preview, show prompts before first playback, build real payment/subscription/Facebook APIs/video, or copy competitor assets.
- PRD §5.1-§5.6 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode are required.
- PRD §6 P0 User Flow, lines 142-158: users proceed from free episodes to the first locked episode, the Unlock Drawer opens, and fake unlock/pass returns to the same episode with `unlocked=1`.
- PRD §7.2-§7.4 Route Requirements, lines 183-209: locked episodes use `/variant-b/watch/[showId]?episode=[episodeNumber]`; if locked, show locked state and Unlock Drawer; unlocked return route simulates success with `unlocked=1`; pass route must preserve story/episode context.
- PRD §8.1 Watch Page, lines 212-250: Watch page must show current free/locked state and includes required states for playing, paused, episode complete, loading next, first locked episode, Unlock Drawer open, unlocked episode, and drawer closed/maybe later.
- PRD §8.2 Episode Sheet, lines 262-291: locked episodes must be visibly locked, show price or unlock condition, and must not show only a lock icon.
- PRD §8.3 First Locked Episode State, lines 293-308: locked trigger is `episode > story.freeEpisodes && unlocked !== true`; playback area should show a clear locked state; progress should not show fake playback progress; locked state must not look like a network error; Unlock Drawer opens automatically on first entry; tapping locked playback reopens the Unlock Drawer.
- PRD §8.4 Unlock Drawer, lines 310-402: drawer must show story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, helper copy that unlock returns to this episode, and mock login/unlock constraints.
- PRD §8.6 Unlock Success Return, lines 465-487: fake unlock returns to same drama/episode, sets unlocked state, resumes playable state, and must not return Home, stay on Pass, lose context, or keep showing locked state.
- PRD §9 PWA Requirements, lines 538-562: install prompts must not interrupt first playback; PWA UI must consider iOS safe area, bottom drawer safe area, standalone return paths, weak network state distinct from locked state, and offline state distinct from locked state.
- PRD §10 Metrics, lines 564-610: funnel review includes first locked episode reached, Unlock Drawer viewed, mock unlock success, and post-unlock episode played; production analytics are not P0.
- PRD §11 P0 Scope, lines 612-631: P0 includes locked playback state, Unlock Drawer, single-episode unlock primary, Story Pass secondary, mock unlock using `unlocked=1`, same-episode return, and locked episode click opening Unlock Drawer.
- PRD §12 P1 Scope, lines 633-649: P1 may include local continue-watching, episode completion tracking, attribution planning, story-specific pass copy, unlock success toast, wallet/unlock history mock, and delayed PWA education.
- PRD §13 P2 Scope, lines 650-665: real video player, backend content retrieval, login, payment, subscription, wallet ledger, server-side entitlement, production analytics, and Facebook CAPI are deferred.
- PRD §14 Developer Handoff Notes, lines 667-743: important state includes locked, unlocked, drawer open/closed, playback state, episode complete state, balance mock, and cost mock; real video, backend, entitlement, login, payment, subscription, analytics, and Facebook APIs are out of scope.
- PRD §15 QA Acceptance Checklist, lines 744-777: locked state appears, first locked episode opens drawer, closing drawer keeps user on locked episode, tapping locked playback reopens drawer, and locked state is visually distinct from weak network / video error state.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q17 must not change P0. P0 remains:

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

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Any actual UI implementation, component refactor, route behavior change, fixture update, tests, Playwright evidence, Storybook/demo work, screenshot generation, or CI validation for locked-vs-error distinction.
- Design-system tokens, iconography, animation, color contrast specs, copy deck changes, or visual QA matrices beyond this requirements recommendation.
- Future P1 fake-only review artifacts showing locked/error distinction, if separately authorized.
- Any PRD/roadmap update that changes Q17 status from proposal to approved.

P2 / hard-stop-gated scope:

- Q16 real video playback provider boundary, player integration, streaming/hosting selection, fallback behavior, buffering rules, retry policies, offline detection, network diagnostics, provider outage handling, media error codes, or production playback monitoring.
- Production error handling, production analytics, Pixel/CAPI, Facebook APIs, backend content retrieval, database state, auth/login, payment/subscription, wallet ledger, server-side entitlement, deployment/DNS/cutover/secrets, or NovelHub production infrastructure.
- Legal/compliance/security/privacy/platform-policy decisions for production video, network diagnostics, attribution, payments, or content rights.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Route behavior changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Real video player/provider, media hosting, buffering, retry/offline/error-state implementation, provider fallback, production playback monitoring, or Q16 provider decisions.
- Backend/database/API/auth/session/payment/subscription/entitlement implementation.
- Real unlock, paid access, wallet ledger, subscription access, receipt validation, or entitlement persistence.
- Real analytics, Facebook API/Pixel/CAPI, attribution, cookies/storage, identity, or consent work.
- Production deployment/DNS/secrets or NovelHub production infrastructure.
- Legal/compliance/brand/security approval for production error, content, payment, or access-control semantics.
- Licensed, competitor, or uncleared assets/copy.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, showing prompts before free preview, skipping the first locked episode's Unlock Drawer, changing `freeEpisodes` from a per-drama lock point, or making Story Pass primary at first lock.

## Assumptions

- "P1" in this Q17 packet means fake-only planning and future review scope unless a later human product/design/architecture/QA decision explicitly expands it.
- The current prototype may not have real playback; Q17 still needs requirements language now so future real playback does not blur locked state with error states.
- A locked episode is a deliberate monetization/content-access state derived from `story.freeEpisodes` and fake `unlocked` state, not a technical failure.
- Video, weak-network, and offline states are technical failure/recovery states; in this packet they are described only as future taxonomy requirements, not implemented behaviors.
- Locked-state copy may mention unlock, episode number, cost, balance, Story Pass, and same-episode return because those are already required inside the locked episode flow.
- Error-state copy may mention retry, offline, weak network, playback unavailable, or try again later, but must not include unlock, coin, pass, balance, payment, or entitlement CTAs.
- Production video/provider details, exact error codes, retry policies, and fallback state diagrams are Q16/P2 hard-stop-deferred.
- No user input is required for this packet. Product/design confirmation is required to approve the default visual/copy taxonomy; architecture/video-provider confirmation is required before real playback implementation; QA confirmation is required before relying on evidence artifacts.

## Recommendation

Approve as proposal for product/design review: preserve a distinct locked-state vocabulary and interaction model that cannot be confused with video, weak-network, offline, or provider error states.

Recommended default requirements:

1. Locked state must be framed as intentional access gating, not technical failure.
2. Locked state must name the current drama or episode context when space allows, with minimum copy such as `EP X is locked`.
3. Locked state must provide an unlock-oriented next action, either by automatically opening the Unlock Drawer or by reopening it when the locked playback area is tapped.
4. Locked state may use lock/unlock affordances, episode number, story hook, balance/cost in the drawer, and primary `Unlock EP X` / secondary `Get Story Pass` hierarchy.
5. Locked state must not show fake playback progress while the episode is locked.
6. Locked state must not use retry, offline, buffering, failed-to-load, server error, or provider-unavailable vocabulary as its primary message.
7. Video/network/offline error states, when later authorized, must be framed as technical failure/recovery, not monetization or access gating.
8. Video/network/offline error states must use recovery-oriented vocabulary such as retry, reconnect, offline, weak network, playback unavailable, or try again later.
9. Video/network/offline error states must not show `Unlock EP X`, `Get Story Pass`, coin balance, cost, purchase, pass, payment, or entitlement CTAs.
10. Error-state recovery actions must not open the Unlock Drawer unless the user has separately navigated to an actually locked episode under the per-drama lock rule.
11. Visual treatment should distinguish the categories through copy, iconography/affordance, CTA labels, and behavior, not color alone.
12. The fake P0 flow remains unchanged: first locked episode opens Unlock Drawer; fake unlock/pass returns to the same episode with `unlocked=1`.
13. Q16 real video/provider behavior and production error handling remain hard-stop/deferred and must be approved before implementation.

Rationale:

1. The PRD already requires the locked state not to look like a network error and requires weak-network/offline states to be distinct from locked state.
2. Locked is a product/access state with a conversion action; video/network/offline error is a recovery state. Mixing them would confuse users and reviewers.
3. Distinct vocabulary protects transparent unlock by making it clear why the user sees the Unlock Drawer.
4. Distinct error vocabulary protects trust by avoiding accidental payment or pass prompts when playback fails for technical reasons.
5. The recommendation can be captured as requirements now without introducing real video, provider, backend, analytics, payment, login, entitlement, or production error infrastructure.
6. Separating Q17 taxonomy from Q16 provider behavior prevents a safe visual requirements decision from becoming a real playback implementation task.

Alternate option:

Defer all detailed locked-vs-error state taxonomy until a real video provider boundary is approved, retaining only the PRD's high-level distinction requirement for now.

Tradeoff: this minimizes near-term requirements work, but leaves future designers/developers with less guidance and increases risk that real playback error states accidentally reuse locked-state visuals or unlock CTAs. It should remain an option only if product/design does not want P1 fake-only taxonomy before Q16 is approved.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. The packet preserves the exact P0 invariant unchanged.
3. The packet preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
4. The packet states that locked state is intentional access gating and must not look like video, weak-network, offline, or provider error state.
5. The packet states that locked state copy/affordances should include episode/unlock vocabulary, and that the Unlock Drawer remains the conversion surface.
6. The packet states that locked state must not show fake playback progress.
7. The packet states that video/network/offline error states should use retry/offline/error vocabulary and must not show unlock, Story Pass, coin, cost, payment, pass, or entitlement CTAs.
8. The packet explicitly marks Q16 real video/provider behavior and production error handling as hard-stop/deferred.
9. The packet explicitly forbids runtime code, route changes, fixture changes, test/CI changes, PRD/roadmap edits, backend/database/auth/payment/subscription/login/entitlement implementation, analytics/Facebook work, real video/provider work, production error handling, deployment/DNS/secrets, and NovelHub production infrastructure.
10. PRD anchors include default route, core principles, P0 user flow, route requirements, Watch page states, First Locked Episode State, Unlock Drawer, PWA weak-network/offline distinction, P0/P1/P2 scope, Developer Handoff Notes, and QA checklist.
11. Product/design confirmation remains an explicit gate before treating this recommendation as approved; architecture/video-provider review remains an explicit gate before any real playback or production error implementation.

Future fake-only additive review acceptance criteria, if later authorized for implementation:

1. The canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Free previews play before login, recharge, subscription, Story Pass prompt, PWA install prompt, payment-like prompt, or production entitlement check.
3. First locked episode remains derived from `story.freeEpisodes + 1` when present.
4. On a locked episode without `unlocked=1`, the playback area clearly communicates `EP X is locked` or equivalent access-gating copy.
5. The first locked episode opens the Unlock Drawer automatically on first entry.
6. Closing the drawer keeps the user on the same locked episode and does not show fake playback progress.
7. Tapping the locked playback area reopens the Unlock Drawer.
8. The locked state and Unlock Drawer use unlock-oriented CTAs: primary single-episode unlock, secondary Story Pass, and tertiary maybe-later/close.
9. Fake single-episode unlock returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode.
10. Fake Story Pass purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode.
11. A fake video/network/offline error review state, if created later, uses retry/offline/error copy and does not display unlock/pass/coin/payment CTAs.
12. A fake video/network/offline error review state, if created later, does not automatically open the Unlock Drawer unless the user is also on an actually locked episode under the per-drama lock rule.
13. Visual distinction is evidenced by copy, icon/affordance, CTA labels, and behavior; color alone is not sufficient.
14. Implementation, if later approved, does not call, stub, depend on, or simulate real video providers, production network diagnostics, real backend/database/content APIs, production entitlement, real login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, deployment, DNS, secrets, or paid services unless a separate gated task explicitly authorizes it.

Accepted/deferred criteria summary:

- Accepted now as recommendation: locked state should use locked/episode/unlock vocabulary and affordances; video/network/offline errors should use retry/offline/error vocabulary and no unlock CTAs.
- Accepted now as P0 invariant: first locked episode opens the Unlock Drawer and fake unlock/pass returns to the same show and same locked episode with `unlocked=1`; users are not returned Home and do not lose episode context.
- Accepted now as guardrail: Q17 may define fake-only requirements language but must not implement or choose real video/provider/error handling.
- Deferred: visual design tokens, screenshots, fake UI evidence, automated tests, Storybook/demo states, PRD edits, route code, fixtures, and approval status changes.
- Hard-stop deferred: Q16 real playback provider boundary, production playback/error handling, backend/database/auth/payment/subscription/login, wallet ledger, real video, analytics/Facebook integrations, deployment/DNS/secrets, legal/compliance/security approvals, and NovelHub production work.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, browser evidence, CI, PRD edits, roadmap edits, fixture changes, tests, Playwright work, or implementation.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes runtime code, route changes, real video/provider work, production error handling, backend/database/auth/payment/subscription/login/entitlement, Facebook/analytics, deployment/DNS/secrets, legal/compliance/brand, assets, and NovelHub production infrastructure.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation says locked state is access gating and must remain distinct from video/network/offline errors.
5. Confirm locked-state requirements mention episode/unlock vocabulary, lock/unlock affordances, no fake playback progress, and Unlock Drawer reopening behavior.
6. Confirm error-state requirements mention retry/offline/error vocabulary and explicitly forbid unlock/pass/coin/payment CTAs.
7. Confirm Q16 real video/provider behavior and production error handling are called out as hard-stop/deferred.
8. Confirm every Q17 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
9. Confirm PRD anchors include §8.3 locked state must not look like network error, §9 weak/offline distinct from locked state, §13 real video deferred, and §15 locked state visually distinct from weak network / video error state.
10. Confirm acceptance criteria explicitly forbid runtime implementation, real video/provider work, production error handling, backend/database/auth/payment/subscription/login/entitlement, analytics/Facebook, deployment/DNS/secrets, legal/compliance/security decisions, and NovelHub production infrastructure.
11. Confirm product/design confirmation remains required before approval, and architecture/video-provider/QA review remains required before any implementation or evidence gate.

## Risks / gates

- User-trust risk: if locked state looks like a technical failure, users may think the product is broken instead of understanding the unlock decision. Gate: product/design review must approve locked copy, affordances, and drawer behavior before implementation.
- Dark-pattern risk: if video/network/offline errors show unlock or payment CTAs, users may think payment fixes a technical failure. Gate: error states must not show unlock/pass/coin/payment CTAs.
- Scope risk: Q17 can expand into Q16 real provider selection, playback fallback states, production monitoring, or network diagnostics. Gate: keep this packet docs-only; any real playback/provider/error implementation requires separate hard-stop approval.
- P0 invariant risk: future visual changes could return users Home, lose episode context, suppress the Unlock Drawer, or make Story Pass primary. Gate: same-show/same-episode return and single-episode-unlock-first remain non-negotiable acceptance criteria.
- QA ambiguity risk: reviewers may rely on color-only distinction or screenshots without checking copy/behavior. Gate: future evidence, if authorized, should verify copy, icon/affordance, CTA labels, and behavior.
- Accessibility risk: color-only distinction may fail users with low vision or color-vision differences. Gate: future design review should include non-color signals such as text, icon/affordance, CTA label, and state behavior.
- Production risk: real video errors may have provider-specific codes and recovery behaviors not covered here. Gate: architecture/video-provider review must define Q16 fallback taxonomy before production playback work.

## Recommended task graph

No implementation tasks are authorized by this packet. If humans approve follow-up work, route it as separate gated tasks:

1. Product/design review task: confirm or revise the Q17 default taxonomy that locked states use episode/unlock vocabulary and video/network/offline errors use retry/offline/error vocabulary with no unlock CTAs.
2. UX copy/design task, fake-only and after product/design approval: draft state copy examples and visual affordance guidance for locked, video error, weak network, and offline states without changing runtime code.
3. QA planning task: define a future fake-only evidence checklist for locked-vs-error distinction, including copy, icon/affordance, CTA labels, drawer behavior, and color-not-alone requirement. No tests or browser work until separately authorized.
4. Architecture/video-provider gate task: if real playback is later considered, define Q16 provider boundary, error taxonomy, retry/offline behavior, and fallback states before implementation.
5. Security/compliance/product gate task: if production video, analytics, payment, entitlement, or user data is involved, require explicit hard-stop approval before implementation.
6. Docs reconciliation task: if product approval is granted, update relevant Phase 5 status/decision documents without changing the PRD unless specifically authorized.
7. Implementation task, only after gates above: add approved fake-only or production behavior while preserving the P0 route invariant and without introducing unauthorized backend/payment/login/Facebook/video infrastructure.

## Open non-blocking questions

- What exact locked-state headline should product/design prefer: `EP X is locked`, `Unlock EP X to continue`, or story-hook-led copy?
- Should future fake error states include separate examples for video load failure, weak network, offline, and provider unavailable, or is a single generic error state enough for P1 review?
- What visual affordance set should distinguish states beyond color: lock icon, retry icon, offline icon, CTA label, helper copy, drawer behavior, or layout treatment?
- Should the Unlock Drawer ever be suppressed on a locked episode if a simultaneous video/network error is detected later, or should lock state take precedence once the episode is known to be locked?
- Who owns final approval for Q17 taxonomy: product, design, QA, architecture/video provider owner, security/compliance, or a combined gate?
