# Phase 5 P1 Q7 Decision Packet — ad-creative deep-link starting episode default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, Facebook API/Pixel/CAPI/production analytics, backend/database/entitlement, real attribution processing, real payment/subscription/login, real video infrastructure, production deployment/DNS/cutover/secrets, licensed/competitor/uncleared assets, legal/compliance/brand-significant decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q7: whether different Facebook ad creatives should deep-link to different starting episodes, or whether P0/P1 Facebook ad traffic should continue to start at EP1 by default.

Recommended default, pending product confirmation: P0 and default P1 Facebook-ad traffic should always start at EP1 via `/variant-b/watch/[showId]?episode=1&source=facebook`. Treat ad-creative-to-episode mapping as a later, explicitly approved fake-only P1 experiment, not as the default path.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q7, line 18: "Should future ad creatives deep-link to different starting episodes, or must P0/P1 always start at EP1?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q7, lines 151-165, proposes EP1 as P0/default P1, with ad creative -> episode mapping deferred as a later P1 experiment requiring an explicit EP1 fallback.

This packet narrows Q7 into requirements, acceptance criteria, validation methods, assumptions, risk gates, and a recommended task graph for later fake-only review. It does not approve implementation.

No user input is required to produce this requirements packet because the recommendation preserves the existing PRD route and P0 invariant. Human product input is required before treating the recommendation as an approved product decision, and again before enabling any non-EP1 ad-creative mapping, even fake-only.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: no Home/Search/Show Detail first, no login before free preview, no PWA install prompt before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60-78: the user clicked because they want to continue watching a specific drama, do not want to register/search/browse first, are willing to watch free episodes, and decide whether to unlock only after reaching a locked episode.
- PRD §5 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §6 P0 User Flow, lines 142-158: user clicks Facebook ad, lands on `/variant-b/watch/[showId]?episode=1&source=facebook`, starts EP1, continues through free episodes, reaches first locked episode, opens Unlock Drawer, and fake unlock/pass returns to same episode with `unlocked=1`.
- PRD §7.1 Watch landing route, lines 162-181: primary ad route is `/variant-b/watch/[showId]?episode=1&source=facebook`; optional future attribution params should not disrupt routing or playback; P0 does not need analytics processing.
- PRD §7.2-§7.4 Route Requirements, lines 183-209: locked episode route, unlocked return route, and pass route all preserve episode/story context.
- PRD §8.1 Watch Page and Episode Complete Behavior, lines 212-260: Watch is the primary Facebook ad landing page, must not show prompts before free playback, and free episode completion advances to free playback or locked flow.
- PRD §8.3 First Locked Episode State, lines 293-308: lock trigger is `episode > story.freeEpisodes && unlocked !== true`; the locked episode opens the Unlock Drawer and remains on the locked episode if the drawer closes.
- PRD §8.4 Unlock Drawer, lines 310-364: drawer must show story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and same-episode return helper copy.
- PRD §8.5-§8.6, lines 404-486: unlock/pass options and unlock success return must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §10 Metrics, lines 564-610: primary funnel begins with Ad Click -> Watch Page Loaded -> EP1 Start and continues through first lock, Unlock Drawer, mock unlock success, and post-unlock episode played; search/genre/home usage are not P0 success metrics.
- PRD §11 P0 Scope, lines 612-631: P0 includes Facebook ad direct Watch landing behavior, Watch EP1 route, free previews, per-drama lock point, first locked episode detection, Unlock Drawer, fake unlock using `unlocked=1`, and same-episode return.
- PRD §12 P1 Scope, lines 633-649: P1 may include Facebook attribution event tracking, Pixel/CAPI planning, and ad creative -> episode mapping, but this is future candidate scope and not default P0 behavior.
- PRD §13 P2 Scope and §14 Developer Handoff Notes, lines 650-743: real video/backend/login/payment/subscription/entitlement/production analytics/Facebook CAPI remain deferred or out of scope; future attribution params are listed as state/query params only.
- PRD §15 QA Acceptance Checklist, lines 744-777: P0 acceptance starts with `/variant-b/watch/[showId]?episode=1&source=facebook` opening Watch EP1 and preserving free preview, first lock, drawer, same-episode fake unlock/pass return, safe-area CTA visibility, and locked-vs-error distinction.
- PRD §16 Open Questions, line 788: asks whether different Facebook ad creatives should deep-link to different starting episodes in P1.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q7 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, or Show Detail.
- EP1 is the default starting episode for Facebook ad traffic.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompt, payment-like prompt, or real attribution processing.
- The free episode chain proceeds in episode order until the per-drama lock point controlled by `story.freeEpisodes`.
- The first locked episode opens the Unlock Drawer and keeps the user on the locked episode if dismissed.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to the same episode with `unlocked=1`; users are not returned Home and do not lose show or episode context.
- Optional attribution params, if present in future URLs, must not disrupt routing, playback, lock detection, drawer behavior, or same-episode return.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Any ad creative -> starting episode mapping, including fake-only mapping tables, local config, URL rewriting, query-param interpretation beyond inert preservation, creative-level QA fixtures, or route normalization changes.
- Any non-EP1 starting episode default for Facebook ad traffic.
- Any mapping that starts a user at a locked episode, after the first locked episode, outside the free episode range, or in a way that skips the free episode chain.
- Any mapping that changes `story.freeEpisodes`, campaign lock points, CTA hierarchy, drawer timing, or same-episode return behavior.
- Any attribution event tracking, Pixel/CAPI planning artifacts beyond docs, analytics schemas, consent/data handling, dedupe, storage, cookies, local persistence, or backend handoff.
- Any automated tests, CI, Playwright/browser evidence, fixture changes, runtime code, PRD edits, roadmap edits, or implementation-ready routing spec.

P2 / hard-stop-gated scope:

- Real Facebook redirect/API, Pixel/CAPI, production analytics, ad platform data ingestion, consent, privacy/data retention, dedupe, user identity, or server-side attribution.
- Real backend/database/content retrieval, entitlement, wallet ledger, login, payment, subscription, refunds/cancellation, tax, local pricing, production access control, real video provider, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Legal, compliance, privacy, platform-policy, data-processing, brand-significant creative strategy, or licensed/competitor/third-party asset decisions.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Creating or enabling any creative-to-episode mapping table.
- Starting default Facebook ad traffic on any episode other than EP1.
- Bypassing the free episode chain, changing `freeEpisodes`, changing lock-point behavior, or skipping the first-lock Unlock Drawer.
- Real Facebook/API/Pixel/CAPI/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work.
- Legal/compliance/privacy/data-handling/brand-significant ad creative decisions.
- Licensed, competitor, or uncleared assets/copy.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q7 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q7 becomes an approved default, even though the recommendation follows the safest PRD-preserving path.
- The current default route and evidence package depend on EP1 as the start point; changing the start point would materially change continuity, funnel metrics, and QA evidence expectations.
- `episode=1` is the only default start parameter for P0/default P1 Facebook traffic.
- `source=facebook` remains sufficient to indicate the ad-source path in P0/default P1; optional params remain inert until separately approved.
- A future non-EP1 mapping, if ever approved, should target only free episodes within the same story and must preserve a fallback to EP1 if the mapping is missing, invalid, locked, unsafe, or ambiguous.
- A future non-EP1 mapping must never require login before free preview, show prompts before free preview, make Story Pass primary at first lock, or return post-unlock users away from the same episode.
- `unlocked=1` remains a fake-only review signal and is not entitlement.
- No user input is required for this packet. Product/requirements input is required before approval; architecture/feasibility, legal/privacy, and analytics approvals are required before any implementation or real attribution work.

## Recommendation

Approve as proposal for product review: keep EP1 as the P0 and default P1 starting episode for all Facebook ad traffic.

Ad creative -> episode mapping should be deferred as an optional later P1 experiment, not enabled by default. If that experiment is later approved, it should be fake-only, explicitly configured, reversible, and constrained to free episodes with a hard fallback to EP1.

Rationale:

1. EP1 is explicitly named in the PRD default route, P0 user flow, P0 scope, metrics funnel, and QA acceptance checklist.
2. Starting at EP1 gives the user coherent story context before the free chain reaches the first locked episode.
3. Non-EP1 starts create continuity risk: users may land after setup scenes, miss context, or think the ad click sent them to the wrong point in the story.
4. Non-EP1 starts create lock-risk: a mapped episode could accidentally be locked or near the lock point, weakening free-preview-first and watch-first behavior.
5. Non-EP1 starts create evidence risk: P0 QA evidence assumes EP1 start, ordered free-chain continuation, first lock, drawer, fake unlock/pass, and same-episode `unlocked=1` return.
6. Non-EP1 starts create attribution/data risk if mapping depends on real creative IDs, analytics, Pixel/CAPI, backend state, cookies, or server-side routing.
7. Keeping EP1 as default preserves P0 while allowing product to evaluate a later fake-only experiment under explicit gates.

Alternate options:

- Allow selected fake-only creative mappings to non-EP1 free episodes, but only after product approval, with a documented mapping table, fallback to EP1, and validation that the target episode is within `1..story.freeEpisodes`.
- Allow creative mappings only to EP1 variants, such as different inert attribution params or copy context, without changing the starting episode.
- Defer all creative-to-episode mapping beyond P1 until real attribution, content continuity, privacy/data handling, and analytics gates are approved.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q7.
3. The Q7 default is stated as proposal only: P0 and default P1 Facebook ad traffic starts at EP1 via `/variant-b/watch/[showId]?episode=1&source=facebook`.
4. The packet explicitly defers ad creative -> episode mapping as a later, separately approved fake-only P1 experiment and not a default behavior.
5. The packet states that no user input is required for the packet itself, but product confirmation is required before approval and any non-EP1 mapping requires additional gates.
6. The packet explicitly states that Q7 does not authorize runtime code, fixture, test/CI, PRD, roadmap, real Facebook/API/analytics, production infrastructure, backend/database, entitlement, payment/subscription/login, real video, asset, legal, compliance, privacy, data-handling, or brand-significant work.
7. PRD anchors include default route, P0 user flow, optional future attribution params, P0 scope, P1 ad creative -> episode mapping candidate scope, metrics, QA acceptance checklist, and the open Q7 question.
8. Product confirmation remains an explicit gate before treating this recommendation as an approved product decision.

Future fake-only additive review acceptance criteria, if later authorized for non-EP1 mapping:

1. The default and fallback route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Any non-EP1 mapping is opt-in, fake-only, explicitly configured, and disabled by default.
3. The target episode must belong to the same `showId`/story represented by the ad creative.
4. The target episode must be within the free range: `episode >= 1 && episode <= story.freeEpisodes`.
5. Missing, malformed, unknown, deleted, cross-story, out-of-range, locked, or unsafe mappings must fall back to EP1 without redirecting to Home/Search/Genre/Show Detail.
6. `source=facebook` is preserved, and any optional attribution params remain inert URL context only unless separately approved.
7. The route must still continue through the free episode chain to the first locked episode and open the Unlock Drawer at `story.freeEpisodes + 1` when `unlocked !== true`.
8. The Unlock Drawer must preserve drama title, locked episode number, fake balance, fake cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and same-episode return helper copy.
9. Fake unlock and fake Story Pass must return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the locked episode actually reached from that start path.
10. Non-EP1 mapping must not show login, recharge, PWA install, subscription, Story Pass promotion, payment-like prompt, or any prompt before free playback begins.
11. Non-EP1 mapping must not skip directly to a locked episode, start after the first locked episode, change `story.freeEpisodes`, make Story Pass primary, or use `unlocked=1` as real entitlement.
12. Non-EP1 mapping must not call, stub, depend on, or simulate real Facebook APIs, Pixel/CAPI, production analytics, backend/database, cookies/storage for attribution, login, payment, subscription, entitlement, video provider, production deployment, DNS, secrets, or paid services.
13. Any creative/episode copy or asset used for review must be synthetic, approved for fake-only review, and not copied from competitors or licensed sources.
14. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage from EP1.

Accepted/deferred criteria summary:

- Accepted now as recommendation: EP1 remains the default for P0/default P1 Facebook ad traffic.
- Accepted now as guardrail: creative-to-episode mapping is not enabled by default and cannot weaken the P0 invariant.
- Deferred: fake-only non-EP1 mapping experiment, mapping config, route validation, fixture/test work, and QA evidence.
- Hard-stop deferred: real Facebook/API/Pixel/CAPI/analytics, backend/database, entitlement, login, payment/subscription, production deployment, secrets, legal/privacy/data handling, and licensed/competitor asset decisions.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, test execution, browser evidence, CI, PRD edits, or implementation work.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes real Facebook/API/Pixel/CAPI/analytics, backend/database/entitlement, payment/subscription/login, production deployment/DNS/secrets, legal/compliance, assets, and NovelHub production infrastructure.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation keeps `/variant-b/watch/[showId]?episode=1&source=facebook` as P0/default P1 and does not authorize non-EP1 mapping.
5. Confirm every Q7 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
6. Confirm PRD anchors include §2 default route, §6 P0 user flow, §7.1 optional attribution params, §10 metrics, §11 P0 scope, §12 P1 ad creative -> episode mapping, §15 QA checklist, and §16 Q7.
7. Confirm future fake-only acceptance criteria constrain any non-EP1 experiment to same-story free episodes with EP1 fallback and inert attribution params.
8. Confirm future fake-only acceptance criteria forbid login/recharge/PWA/payment-like prompts before free playback and forbid skipping the first-lock Unlock Drawer.
9. Confirm the packet states no user input is needed for this packet, but product confirmation and later architecture/feasibility/legal/privacy/analytics gates are required before implementation or real-system work.
10. Confirm this task only adds this docs-only packet and does not modify runtime/source/test/fixture/config/package/lockfile files.

## Risks / gates

- Product decision gate: product must explicitly confirm whether EP1 is approved as the P0/default P1 starting episode, rejected, or replaced by a separately scoped creative-mapping experiment.
- P0 regression risk: non-EP1 starts could weaken EP1 evidence, skip story context, shorten the free episode chain, land too close to lock, or create ambiguity around the first locked episode.
- Free-preview-first risk: a mapped episode could accidentally be locked or after the free range; any such mapping must fail closed to EP1.
- Routing/context risk: mapping must not lose `showId`, `episode`, `source=facebook`, locked episode context, pass-page context, or same-episode `unlocked=1` return.
- Attribution/data gate: real creative IDs, ad platform data, Pixel/CAPI, production analytics, consent, dedupe, cookies/storage, backend handoff, or data retention require separate legal/privacy/product/engineering approval.
- Content/brand gate: creative-to-episode mapping may imply ad creative strategy, spoiler policy, narrative continuity, or brand-significant content decisions; product/editorial review is required before final mapping rules.
- Legal/asset gate: no licensed, competitor, third-party, stock, public-domain, or uncleared assets/copy may enter prototype or production branches without explicit approval.
- Entitlement/security gate: `unlocked=1` must remain fake-only and must never become production entitlement.
- Implementation gate: any code, fixture, test, CI, analytics, route handling, mapping config, browser evidence, or infrastructure work requires a separate authorized task after requirements approval.
- Hard-stop gate: real Facebook/API/Pixel/CAPI, production analytics, real payment/subscription/login/entitlement/backend/database/video, deployment/DNS/secrets, and NovelHub production work remain blocked.

## Recommended task graph

1. Product owner reviews Q7 and confirms one of:
   - approve EP1 as P0/default P1 starting episode for all Facebook ad traffic;
   - approve EP1 default while authorizing a separate fake-only non-EP1 mapping experiment brief;
   - reject EP1 default and request a new requirements packet for a specific non-EP1 default strategy.
2. If EP1 default is confirmed, requirements creates a narrowed implementation-ready acceptance note for dev/QA that states creative mapping remains disabled by default and fallback route is EP1.
3. Architecture/feasibility gate, only if a fake-only mapping experiment is separately approved: define where a local/inert mapping could live without backend, analytics, cookies, Facebook APIs, production persistence, or real attribution processing.
4. Product/editorial gate, only if a fake-only mapping experiment is separately approved: define allowed mapping rules for same-story free episodes and content-continuity guardrails; no licensed/competitor/uncleared assets.
5. Privacy/legal/analytics gate, before any real attribution or platform creative ID use: approve data minimization, consent, retention, dedupe, event names, and whether Pixel/CAPI/backend processing is allowed.
6. If authorized, dev implements only fake-only/local mapping constraints with EP1 fallback and no real analytics/backend/Facebook dependency.
7. If authorized, QA adds additive fake-only regression evidence that default EP1 remains intact, invalid mappings fall back to EP1, valid mappings stay within free episodes, and the path still reaches first lock, Unlock Drawer, fake unlock/pass, and same episode with `unlocked=1`.
8. Any real-system work remains separate and hard-stop-gated.

## Open non-blocking questions

- Does product confirm EP1 as the P0/default P1 starting episode for all Facebook ad traffic?
- If a later fake-only mapping experiment is desired, should it be limited to same-story free episodes only, or also require episode 1 unless product supplies a specific creative rationale?
- What should count as a safe creative-to-episode mapping key in fake-only scope: `creative_id`, `utm_content`, a local demo flag, or a non-platform placeholder?
- Should invalid mappings silently fall back to EP1, or should fake-only review show a non-user-facing debug note while still routing the user to EP1?
- Should a future QA checklist sample one valid non-EP1 free episode per story, or only verify fallback behavior until product approves real creative strategy?
- What editorial/content-continuity rules prevent a non-EP1 start from confusing users or exposing spoilers without context?

---

End of packet. This document is requirements material only and does not authorize implementation, tests/CI, PRD edits, roadmap edits, Facebook API/Pixel/CAPI/production analytics, backend/database/entitlement, real payment/subscription/login, real video, deployment/DNS/secrets, legal/compliance/privacy decisions, licensed/competitor assets, or NovelHub production infrastructure.
