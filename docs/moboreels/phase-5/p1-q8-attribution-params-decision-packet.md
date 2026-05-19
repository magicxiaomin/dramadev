# Phase 5 P1 Q8 Decision Packet — optional attribution params preservation default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, Facebook API/Pixel/CAPI/production analytics, backend/database/entitlement, cookies/storage, real attribution processing, real payment/subscription/login, real video infrastructure, production deployment/DNS/cutover/secrets, licensed/competitor/uncleared assets, legal/compliance/privacy/data-handling decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q8: which optional attribution params may be preserved in URLs beyond `source=facebook` without changing the confirmed P0 conversion route or creating real attribution infrastructure.

Recommended default, pending product confirmation: preserve only the PRD-listed optional params as inert URL context: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`. Do not process, store, normalize, validate against Facebook, send, persist, or interpret these params in this scope.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q8, line 19: "Which optional attribution params should be preserved in URLs beyond `source=facebook`?"

Existing proposal source: `docs/moboreels/phase-5/p1-decision-brief.md` Q8, lines 167-181, proposes preserving the PRD-listed optional params as inert URL context only and forbids analytics, backend state, cookies/storage, and Facebook APIs in this scope.

This packet narrows Q8 into requirements, acceptance criteria, validation methods, assumptions, risk gates, and a recommended task graph for later fake-only review. It does not approve implementation.

No user input is required to produce this requirements packet because the recommendation is directly anchored in the PRD-listed future query params and preserves the P0 invariant. Human product input is required before treating the recommendation as an approved product decision, and legal/privacy/analytics/architecture approval is required before any real attribution, retention, or processing work.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: no Home/Search/Show Detail first, no login before free preview, no PWA install prompt before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60-78: the user clicked because they want to continue watching a specific drama, do not want to register/search/browse first, are willing to watch free episodes, and decide whether to unlock only after reaching a locked episode.
- PRD §5 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §6 P0 User Flow, lines 142-158: user clicks Facebook ad, lands on `/variant-b/watch/[showId]?episode=1&source=facebook`, starts EP1, continues through free episodes, reaches first locked episode, opens Unlock Drawer, and fake unlock/pass returns to same episode with `unlocked=1`.
- PRD §7.1 Watch landing route, lines 162-181: primary ad route is `/variant-b/watch/[showId]?episode=1&source=facebook`; optional future attribution params are `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`; P0 does not need analytics processing; these params should not disrupt routing or playback.
- PRD §7.2-§7.4 Route Requirements, lines 183-209: locked episode route, unlocked return route, and pass route all preserve episode/story context.
- PRD §8.1 Watch Page and Episode Complete Behavior, lines 212-260: Watch is the primary Facebook ad landing page, must not show prompts before free playback, and free episode completion advances to free playback or locked flow.
- PRD §8.3 First Locked Episode State, lines 293-308: lock trigger is `episode > story.freeEpisodes && unlocked !== true`; the locked episode opens the Unlock Drawer and remains on the locked episode if the drawer closes.
- PRD §8.4-§8.6, lines 310-486: Unlock Drawer, fake unlock, fake Story Pass, and return links must preserve current drama and episode context and must not return Home or lose episode context.
- PRD §10 Metrics, lines 564-610: primary funnel begins with Ad Click -> Watch Page Loaded -> EP1 Start and continues through first lock, Unlock Drawer, mock unlock success, and post-unlock episode played; analytics definitions are planning scope, not P0 processing.
- PRD §11 P0 Scope, lines 612-631: P0 includes Facebook ad direct Watch landing behavior, Watch EP1 route, free previews, per-drama lock point, first locked episode detection, Unlock Drawer, fake unlock using `unlocked=1`, and same-episode return.
- PRD §12 P1 Scope, lines 633-649: P1 may include Facebook attribution event tracking, Pixel/CAPI planning, and ad creative -> episode mapping, but these are future candidates and not default P0 behavior.
- PRD §13 P2 Scope and §14 Developer Handoff Notes, lines 650-743: real video/backend/login/payment/subscription/entitlement/production analytics/Facebook CAPI remain deferred or out of scope; future attribution params are listed only as state/query params.
- PRD §15 QA Acceptance Checklist, lines 744-777: P0 acceptance starts with `/variant-b/watch/[showId]?episode=1&source=facebook` opening Watch EP1 and preserving free preview, first lock, drawer, same-episode fake unlock/pass return, safe-area CTA visibility, and locked-vs-error distinction.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q8 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, Show Detail, Pass, login, recharge, or Story Pass education first.
- EP1 remains the default starting episode for Facebook ad traffic.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompt, payment-like prompt, or real attribution processing.
- `source=facebook` remains sufficient for P0 routing context.
- Optional attribution params, if present, are inert URL context only and must not disrupt routing, playback, episode selection, lock detection, drawer behavior, pass routing, or same-episode return.
- The free episode chain proceeds in episode order until the per-drama lock point controlled by `story.freeEpisodes`.
- The first locked episode opens the Unlock Drawer and keeps the user on the locked episode if dismissed.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to the same episode with `unlocked=1`; users are not returned Home and do not lose show or episode context.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Any implementation that preserves, forwards, filters, sanitizes, or displays optional params in runtime URLs.
- Any analytics event schema, event tracking, Pixel/CAPI planning beyond docs, data dictionary, consent/data-handling, dedupe, retention, cookies, local/session storage, backend handoff, or reporting.
- Any route normalization, redirect handling, mapping table, fixture/test change, CI/Playwright/browser evidence, PRD edit, roadmap edit, or implementation-ready URL parser spec.
- Any interpretation of attribution params that changes starting episode, lock point, CTA hierarchy, drawer timing, fake unlock/pass return, or content shown.

P2 / hard-stop-gated scope:

- Real Facebook redirect/API, Pixel/CAPI, production analytics, ad platform data ingestion, consent, privacy/data retention, dedupe, user identity, server-side attribution, or integration with paid services.
- Real backend/database/content retrieval, entitlement, wallet ledger, login, payment, subscription, refunds/cancellation, tax, local pricing, production access control, real video provider, deployment, DNS/cutover, secrets, or NovelHub production infrastructure.
- Legal, compliance, privacy, platform-policy, data-processing, brand-significant creative strategy, or licensed/competitor/third-party asset decisions.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Rewriting the existing Phase 5 P1 decision brief as confirmed product decision.
- Adding, removing, renaming, canonicalizing, validating, or storing attribution params in code.
- Real attribution processing, analytics, Pixel/CAPI, Facebook APIs, cookies/storage, backend/database, consent/legal policy, user identity, or data retention work.
- Changing `episode`, `unlocked`, `source`, routing, pass return links, lock-point logic, drawer behavior, CTA hierarchy, or free-preview-first behavior based on optional params.
- Starting default Facebook ad traffic on any episode other than EP1.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, or showing prompts before free preview.
- Real payment/subscription/login/entitlement/video/deployment/DNS/secrets work.
- Legal/compliance/privacy/data-handling/brand-significant ad creative decisions.
- Licensed, competitor, or uncleared assets/copy.
- NovelHub production infrastructure.

## Assumptions

- "P1" in this Q8 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- Human product confirmation is still required before Q8 becomes an approved default, even though the recommendation follows the PRD-listed future query-param set.
- The PRD-listed future optional params are the complete safe candidate set for this packet: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`.
- `source=facebook` remains the only P0-required source marker.
- Optional params are not required for playback, route matching, episode completion, first-lock detection, Unlock Drawer rendering, fake single-episode unlock, fake Story Pass, or same-episode return.
- Preserving a param in a URL, if later implemented, means inert pass-through context only; it does not imply collection, analytics, storage, consent approval, Facebook-platform integration, or production attribution.
- Unknown or malformed optional params, if encountered in future implementation, should fail safely by being ignored for behavior and must not redirect users away from the watch flow.
- `unlocked=1` remains a fake-only review signal and is not entitlement.
- No user input is required for this packet. Product/requirements input is required before approval; architecture/feasibility, legal/privacy, and analytics approvals are required before any implementation or real attribution work.

## Recommendation

Approve as proposal for product review: preserve the PRD-listed optional attribution params as inert URL context only beyond `source=facebook`:

- `campaign_id`
- `adset_id`
- `ad_id`
- `creative_id`
- `placement`
- `utm_source`
- `utm_campaign`
- `utm_content`

Do not add any non-PRD attribution params by default in this packet. Do not process these params into analytics, backend state, cookies/storage, Facebook APIs, Pixel/CAPI, consent logic, event schemas, or production attribution.

Rationale:

1. The PRD already names this parameter set as optional future attribution context.
2. Preserving the named set as inert URL context can support later review without changing the confirmed P0 journey.
3. Keeping the set closed prevents accidental scope creep into arbitrary ad-platform data capture.
4. Treating params as inert prevents them from changing route behavior, starting episode, free chain, lock point, drawer CTA hierarchy, or same-episode return.
5. Deferring processing avoids legal/privacy/consent/data-retention/analytics/Facebook API decisions that are explicitly outside this scope.
6. `source=facebook` remains sufficient for P0 evidence, so optional params are not required for P0 success.

Alternate options:

- Preserve only standard UTM params (`utm_source`, `utm_campaign`, `utm_content`) plus `creative_id`, and drop platform-specific IDs until a legal/data review approves retention. This is stricter but leaves PRD-listed params unresolved.
- Preserve only `source=facebook` for P0/default P1 and defer all optional params until analytics and legal/privacy gates are approved. This is safest for data minimization but less aligned with the PRD's listed future handoff params.
- Permit additional params such as `utm_medium`, `fbclid`, or custom experiment IDs only after a separate product/legal/privacy/analytics decision. These are not approved by this packet.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q8.
3. The Q8 default is stated as proposal only: preserve `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content` as inert URL context beyond `source=facebook`.
4. The packet states that `source=facebook` remains sufficient for P0 and optional params are not required for P0 routing or playback.
5. The packet explicitly forbids analytics processing, cookies/storage, backend/database state, Facebook APIs, Pixel/CAPI, consent/legal policy work, production attribution, and real data retention in this scope.
6. The packet states optional params must not disrupt routing, playback, episode selection, lock detection, drawer behavior, pass routing, or same-episode return.
7. The packet explicitly preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
8. The packet explicitly states that Q8 does not authorize runtime code, fixture, test/CI, PRD, roadmap, production infrastructure, backend/database, entitlement, payment/subscription/login, real video, asset, legal, compliance, privacy, data-handling, or brand-significant work.
9. PRD anchors include default route, optional future attribution params, P0 user flow, P0 scope, P1 attribution candidates, developer handoff query params, QA acceptance checklist, and the Q8 question source.
10. Product confirmation remains an explicit gate before treating this recommendation as an approved product decision.

Future fake-only additive review acceptance criteria, if later authorized for URL preservation behavior:

1. The canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. A route containing any approved optional param still starts at the requested free episode only when otherwise valid under P0/default rules; it must not use optional params to change the episode.
3. Optional params are carried, if at all, only as inert URL context on fake-only watch/pass/unlock links needed to preserve user context.
4. Optional params must never be displayed as user-facing monetization copy, drawer copy, legal copy, pricing copy, or trust claims.
5. Missing, unknown, duplicate, malformed, or extra params must not break playback or redirect to Home/Search/Genre/Show Detail.
6. `source=facebook`, `episode`, and `unlocked` semantics remain unchanged.
7. The route must still continue through the free episode chain to the first locked episode and open the Unlock Drawer at `story.freeEpisodes + 1` when `unlocked !== true`.
8. The Unlock Drawer must preserve drama title, locked episode number, fake balance, fake cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and same-episode return helper copy.
9. Fake unlock and fake Story Pass must return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the locked episode actually reached from that route, with only safe inert context preserved if separately authorized.
10. Optional params must not show login, recharge, PWA install, subscription, Story Pass promotion, payment-like prompt, or any prompt before free playback begins.
11. Optional params must not skip directly to a locked episode, start after the first locked episode, change `story.freeEpisodes`, make Story Pass primary, or use `unlocked=1` as real entitlement.
12. Optional params must not call, stub, depend on, or simulate real Facebook APIs, Pixel/CAPI, production analytics, backend/database, cookies/storage for attribution, login, payment, subscription, entitlement, video provider, production deployment, DNS, secrets, or paid services.
13. If later test work is authorized, it must be additive and must not weaken existing P0 invariant coverage from EP1.

Accepted/deferred criteria summary:

- Accepted now as recommendation: preserve only the PRD-listed optional params as inert URL context beyond `source=facebook`.
- Accepted now as guardrail: optional params cannot weaken the P0 invariant, route/playback behavior, drawer behavior, or same-episode fake unlock/pass return.
- Deferred: URL preservation implementation, parser/canonicalization details, fixtures, tests, browser evidence, analytics planning, and any treatment of non-PRD params.
- Hard-stop deferred: real Facebook/API/Pixel/CAPI/analytics, cookies/storage, backend/database, entitlement, login, payment/subscription, production deployment, secrets, legal/privacy/data handling, and licensed/competitor asset decisions.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, test execution, browser evidence, CI, PRD edits, or implementation work.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes real Facebook/API/Pixel/CAPI/analytics, backend/database/entitlement, cookies/storage, payment/subscription/login, production deployment/DNS/secrets, legal/compliance/privacy/data-handling, assets, and NovelHub production infrastructure.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation includes exactly the PRD-listed optional params: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`.
5. Confirm `source=facebook` remains sufficient for P0 and optional params are described as inert URL context only.
6. Confirm every Q8 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
7. Confirm PRD anchors include §2 default route, §6 P0 user flow, §7.1 optional attribution params, §11 P0 scope, §12 P1 attribution candidates, §14 handoff query params, §15 QA checklist, and the Q8 question source.
8. Confirm future fake-only acceptance criteria forbid optional params from altering route/playback/episode/lock/drawer/unlock/pass behavior.
9. Confirm future fake-only acceptance criteria forbid login/recharge/PWA/payment-like prompts before free playback and forbid skipping the first-lock Unlock Drawer.
10. Confirm the packet states no user input is needed for this packet, but product confirmation and later architecture/feasibility/legal/privacy/analytics gates are required before implementation or real-system work.
11. Confirm this task only adds this docs-only packet and does not modify runtime/source/test/fixture/config/package/lockfile files.

## Risks / gates

- Product decision gate: product must explicitly confirm whether the PRD-listed optional params are approved as the P1 default preservation set, rejected, narrowed, or replaced by a separate attribution plan.
- P0 regression risk: optional params could accidentally affect episode selection, routing, first-lock timing, CTA hierarchy, pass return, or same-episode fake unlock return.
- Data minimization risk: preserving ad IDs can be mistaken for permission to collect, retain, correlate, or analyze ad-platform data. This packet permits documentation of inert URL context only.
- Privacy/legal gate: consent, data minimization, retention, user identity, platform-policy, and data-processing review are required before any real attribution processing, cookies/storage, backend handoff, analytics, Pixel/CAPI, or Facebook API work.
- Analytics gate: event names, schema, dedupe, attribution windows, reporting, and production metrics require separate analytics/product/legal approval.
- Routing/context risk: future URL handling must not lose `showId`, `episode`, `source=facebook`, locked episode context, pass-page context, or same-episode `unlocked=1` return.
- Unknown-param risk: pressure to include `fbclid`, `utm_medium`, experiment IDs, or arbitrary ad-platform fields could expand scope without review. Non-PRD params require a separate decision.
- Entitlement/security gate: `unlocked=1` must remain fake-only and must never become production entitlement.
- Implementation gate: any code, fixture, test, CI, analytics, route handling, browser evidence, or infrastructure work requires a separate authorized task after requirements approval.
- Hard-stop gate: real Facebook/API/Pixel/CAPI, production analytics, real payment/subscription/login/entitlement/backend/database/video, deployment/DNS/secrets, legal/privacy/data-handling, and NovelHub production work remain blocked.

## Recommended task graph

No implementation task is recommended from this packet alone.

If product later confirms Q8 as an approved P1 default, create separate tasks in this order:

1. Requirements/product gate: confirm the exact approved param set and whether non-PRD params are excluded, deferred, or separately reviewed.
2. Architecture gate: define fake-only URL preservation boundaries without analytics, cookies/storage, backend/database, Facebook APIs, Pixel/CAPI, or production data handling.
3. Privacy/legal/analytics gate: only if real processing is proposed, define consent, minimization, retention, event schema, dedupe, and platform-policy requirements before implementation.
4. Fake-only implementation task: only after gates, preserve approved inert params across existing watch/pass/fake unlock links without changing route/playback behavior.
5. Additive QA task: validate default route plus representative inert params against the P0 invariant, same-episode return, and prompt-free free preview.
6. Documentation traceability task: record approved decision, implementation evidence, and remaining hard-stop boundaries without editing the PRD unless explicitly authorized.

## Open non-blocking questions

- Should the approved P1 set remain exactly the PRD-listed params, or should product/legal narrow it to UTM-only plus `creative_id` before any future implementation?
- Should non-PRD params such as `fbclid`, `utm_medium`, or experiment IDs be explicitly dropped/ignored in future fake-only handling, or merely left unspecified until a later decision?
- If future fake-only URL preservation is approved, which links must carry inert params: watch continuation only, fake unlock only, fake Story Pass pass/return, or all same-flow links?
- What naming convention should future documentation use to distinguish inert URL preservation from real attribution processing?
- Who must approve any move from inert URL context to analytics/event processing: product, legal/privacy, analytics, engineering architecture, or all of them?

## Traceability

- Phase 5 question: `docs/moboreels/phase-4g/phase-5-questions.md` Q8, line 19.
- Existing proposal: `docs/moboreels/phase-5/p1-decision-brief.md` Q8, lines 167-181.
- Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` §7.1 lines 170-181 and §14 lines 712-729 list the same future optional params.
- P0 invariant: PRD §2, §6, §7, §8, §11, and §15 all preserve watch-first, free-preview-first, first-lock drawer, fake unlock/pass, and same-episode `unlocked=1` return.
- Prototype B: `docs/moboreels/prototype-b-spec.md` delegates implementation detail to the SceneFlow PRD.
