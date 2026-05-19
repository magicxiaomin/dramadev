# Phase 5 P1 Q18 Decision Packet — fake-only content metadata default

STATUS: requirements decision packet only. Docs-only / fake-only / non-implementation. Proposal pending human product confirmation.

This packet does not authorize PRD edits, roadmap edits, runtime code, fixture changes, tests/CI, Playwright work, real video infrastructure, backend/database/content APIs, entitlement, login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, production deployment/DNS/cutover/secrets, licensed/competitor/uncleared assets, legal/compliance/brand decisions, or NovelHub production infrastructure.

## Goal

Record the safe P1 requirements decision packet for Phase 5 Q18: what content metadata is needed to support per-drama `freeEpisodes`, first-lock hooks, tags, episode ranges, and safe fake/test assets without changing the confirmed P0 conversion route or creating real content infrastructure.

Recommended default, pending product confirmation: define a closed fake-only content metadata contract for each demo drama with only the minimum fields required for the PRD flow: stable fake `showId`, fake title, safe synopsis/hook copy, approved-safe tags, `totalEpisodes`, `freeEpisodes`, episode range display configuration, per-episode fake metadata, first-lock hook metadata, fake price/cost copy, and explicit asset-safety provenance flags. The contract is a requirements proposal only and must not be implemented as runtime fixtures or real content APIs in this task.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.

Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation detail to the SceneFlow PRD.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md` Q18, line 35: "What content metadata is needed to support per-drama `freeEpisodes`, lock hooks, tags, episode ranges, and safe fake/test assets?"

Existing proposal context: `docs/moboreels/phase-5/p1-decision-brief.md` does not answer Q18; lines 240 and 291 explicitly identify Q18 as outside that brief and suitable for a separate safe fixture metadata task.

This packet narrows Q18 into requirements, acceptance criteria, validation methods, assumptions, risk gates, and a recommended task graph for later fake-only review. It does not approve implementation.

No user input is required to produce this requirements packet because the metadata recommendation is directly anchored in PRD-required Watch, Episode Sheet, first locked episode, Unlock Drawer, and Show Detail fields. Human product/editorial input is required before treating the recommendation as an approved content default, and legal/brand/content approval is required before any non-fake or third-party asset is used.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core journey is Facebook Ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> Unlock EP / Story Pass -> mock purchase / unlock -> return to same episode; default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
- PRD §3 Non-Goals, lines 43-58: no Home/Search/Show Detail first, no login before free preview, no PWA install prompt before first playback, no recharge or Story Pass promotion before first lock, no Story Pass primary CTA at first lock, no real payment/subscription/Facebook APIs/video, and no competitor assets.
- PRD §4 Target User, lines 60-78: the user clicked because they want to continue watching a specific drama and should quickly confirm this is the drama from the ad without registering, searching, or browsing first.
- PRD §5 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point using `story.freeEpisodes`, transparent unlock, single-episode unlock first, and return to same episode.
- PRD §6 P0 User Flow, lines 142-158: user clicks a Facebook ad, lands on Watch EP1, continues through free episodes, reaches first locked episode, sees Unlock Drawer, and fake unlock/pass returns to same episode with `unlocked=1`.
- PRD §7 Route Requirements, lines 160-209: Watch route, locked episode route, unlocked return route, and Pass route all depend on preserving story/show and episode context.
- PRD §8.1 Watch Page, lines 212-229: Watch must show drama title, current episode number, playback area, genre/trope tags, current free/locked state, episode list entry, detail entry, share entry, and next/complete CTA.
- PRD §8.2 Episode Sheet, lines 262-291: Episode Sheet must support current episode highlight, free and locked episode states, locked price/unlock condition, range tabs such as 1-24 / 25-48 / 49-72 / 73-96, drama title, total episode count, free episode range, current range, episode grid, and price/unlock condition; it must not show only a lock icon.
- PRD §8.3 First Locked Episode State, lines 293-308: first-lock trigger is `episode > story.freeEpisodes && unlocked !== true`; locked state opens the Unlock Drawer and remains locked if the drawer closes.
- PRD §8.4 Unlock Drawer, lines 310-392: Unlock Drawer must show current story hook, drama title, episode number, balance, cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, same-episode return explanation, and fake balance/cost behavior.
- PRD §8.5 Story Pass / Unlock Options Page, lines 404-463: Pass page should be story-focused and answer which drama, which episode, single-episode cost, Story Pass scope, mock status, and return destination.
- PRD §8.7 Show Detail Auxiliary Page, lines 488-510: Show Detail remains auxiliary and may show full synopsis, tags, total episodes, free episode count, episode grid, range tabs, and recommendations.
- PRD §8.8 Home / Search / Genre, lines 512-537: secondary paths may use title, trope, plot clue, trending drama entries, and genre/trope examples such as Hidden Identity, Revenge, Fake Marriage, and Rebirth.
- PRD §10 Metrics, lines 564-610: primary funnel reaches first lock, Unlock Drawer, mock unlock success, and post-unlock episode played; metadata must support review of the fake flow without requiring production analytics.
- PRD §11 P0 Scope, lines 612-631: P0 includes Facebook ad direct Watch landing, Watch EP1 route, free previews, per-drama lock point via `freeEpisodes`, first locked episode detection, Unlock Drawer, fake unlock, same-episode return, Episode Sheet, and Show Detail as auxiliary.
- PRD §12 P1 Scope, lines 633-649: local continue-watching, episode completion tracking, ad creative mapping, lock point A/B testing, story-specific Pass page copy, and wallet/unlock history remain P1 candidates only.
- PRD §13 P2 Scope and §14 Developer Handoff Notes, lines 650-743: real video, backend content retrieval, login, payment, subscription, wallet ledger, server-side entitlement, production analytics, Facebook CAPI, and production content systems are deferred or out of scope.
- PRD §15 QA Acceptance Checklist, lines 744-777: QA checks require EP1 route, free episodes, first lock, drawer title/episode/balance/cost/CTA hierarchy, Episode Sheet free/locked states, same-episode fake unlock/pass return, safe-area CTA visibility, and locked-vs-error distinction.
- Prototype B spec, lines 1-3: SceneFlow MVP implementation detail is governed by the SceneFlow PRD.

## P0 scope

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Q18 must not change P0. P0 remains:

- Facebook ad users land directly on `/variant-b/watch/[showId]?episode=1&source=facebook`, not Home, Search, Genre, Show Detail, Pass, login, recharge, or Story Pass education first.
- EP1 remains the default starting episode for Facebook ad traffic.
- Free preview comes before login, recharge, subscription, Story Pass promotion, PWA install prompt, payment-like prompt, or real attribution/content processing.
- `story.freeEpisodes` remains the per-drama lock point source for fake/demo behavior.
- The free episode chain proceeds in episode order until first locked episode `story.freeEpisodes + 1`.
- The first locked episode opens the Unlock Drawer and keeps the user on the locked episode if dismissed.
- The Unlock Drawer remains transparent: current story hook, drama title, episode number, fake balance, fake cost, primary single-episode unlock, secondary Story Pass, close action, and return-to-same-episode explanation.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake single-episode unlock and fake Story Pass both return to the same episode with `unlocked=1`; users are not returned Home and do not lose show or episode context.
- Metadata must support, not override, the P0 route, episode parameter, fake unlock signal, drawer timing, CTA hierarchy, or same-episode return.

## P1/P2 deferred scope

P1 deferred or later-only scope:

- Implementing the metadata contract as runtime fixtures, route loaders, tests, Playwright scenarios, or Storybook/demo data.
- Adding content editing tools, editorial workflows, schema validators, asset pipelines, image/video transforms, content importers, or fixture generators.
- Ad creative -> episode mapping, lock point A/B testing, story-specific Pass page copy beyond first-lock fake copy, local continue-watching, episode completion tracking, or wallet/unlock history mocks.
- Multi-drama recommendation ranking, search indexing, genre browsing logic, localization, variant configuration, or content operations dashboards.
- Any update to PRD/roadmap or confirmed product decision documents.

P2 / hard-stop-gated scope:

- Real backend/database/content retrieval APIs, production content management systems, NovelHub production infrastructure, server-side entitlement, login, payment/subscription, wallet ledger, refund/cancellation, tax/local pricing, real video providers, production analytics, Facebook APIs/Pixel/CAPI, deployment/DNS/cutover, secrets, or production access control.
- Real licensed, competitor, third-party, scraped, AI-generated-from-uncleared-source, user-uploaded, or brand-sensitive assets/copy without explicit human/legal/content approval.
- Legal, compliance, privacy, data retention, platform-policy, content rights, age-rating, takedown, or brand-significant decisions.

## Non-scope

This packet does not authorize:

- Runtime code changes.
- Fixture/data changes.
- Test, Playwright, package, lockfile, browser-install, or CI changes.
- PRD or roadmap edits.
- Creating, renaming, importing, or publishing drama content.
- Real video, poster, thumbnail, audio, subtitle, transcript, actor, studio, or third-party asset use.
- Backend/database/API/CMS/entity schema implementation.
- Production content moderation, rights management, storage, CDN, transcoding, watermarking, or delivery.
- Real analytics, Facebook API/Pixel/CAPI, ad-platform data processing, attribution, cookies/storage, identity, or consent work.
- Real payment/subscription/login/entitlement/deployment/DNS/secrets work.
- Legal/compliance/brand-significant asset, copy, claim, title, pricing, or content-policy decisions.
- Licensed, competitor, or uncleared assets/copy.
- NovelHub production infrastructure.
- Returning fake unlock/pass users to Home, losing episode context, requiring login before free preview, showing prompts before free preview, changing `freeEpisodes` from a per-drama lock point, or making Story Pass primary at first lock.

## Assumptions

- "P1" in this Q18 packet means fake-only planning and future review scope unless a later human product decision explicitly expands it.
- The metadata contract is a requirements artifact, not a code schema, database schema, fixture file, API contract, or CMS model.
- Each fake demo drama can define its own `freeEpisodes` value, and first locked episode is derived as `freeEpisodes + 1` when `totalEpisodes > freeEpisodes`.
- Fake/test dramas use original placeholder titles, story hooks, summaries, tags, and assets created specifically for the prototype; they do not imitate competitor IP, titles, posters, actors, videos, pricing, or copy.
- The first locked episode needs a safe hook by default because the PRD requires a current story hook in the Unlock Drawer. Hooks for every later locked episode are optional/deferred unless a separate content decision approves them.
- Episode ranges are display metadata for the Episode Sheet and Show Detail; they do not change episode ordering, lock rules, or route semantics.
- Tags are user-facing genre/trope labels only; they are not analytics taxonomy, ad targeting, or recommendation engine inputs in this scope.
- Fake price/cost/balance copy may be referenced by metadata requirements, but real monetization rules are out of scope.
- `unlocked=1` remains a fake-only review signal and is not entitlement.
- No user input is required for this packet. Product/editorial confirmation is required before approval; architecture/feasibility and QA review are required before fake-only implementation; legal/content-rights approval is required before any real or third-party asset use.

## Recommendation

Approve as proposal for product review: use a closed fake-only content metadata contract for each demo drama. The contract should include only fields needed to satisfy the PRD's Watch, Episode Sheet, first locked episode, Unlock Drawer, Pass context, and auxiliary Show Detail requirements.

Recommended minimum drama-level fields:

1. `showId`: stable fake identifier used by `/variant-b/watch/[showId]` and pass/detail links. Must be original and non-competitor-branded.
2. `title`: fake drama title shown on Watch, Unlock Drawer, Episode Sheet, Pass page, and Show Detail.
3. `shortHook`: safe one-line story hook for Watch/Unlock Drawer context.
4. `synopsis`: safe fake synopsis for auxiliary Show Detail or Pass context.
5. `tags`: small approved-safe list of genre/trope labels, for example original labels in the PRD family such as Hidden Identity, Revenge, Fake Marriage, Rebirth, or other non-infringing generic tropes.
6. `totalEpisodes`: positive integer used for Episode Sheet count and range generation.
7. `freeEpisodes`: positive integer lower than or equal to `totalEpisodes`; first locked episode is `freeEpisodes + 1` when it exists.
8. `episodeRangeSize`: display range size, defaulting to 24 unless product/design confirms another value, to support tabs such as 1-24, 25-48, 49-72, and 73-96.
9. `firstLockHook`: required fake hook for the first locked episode's Unlock Drawer.
10. `unlockCostCoins`: fake per-episode cost copy for the drawer/pass context; it is not real pricing.
11. `mockBalanceCoins`: fake balance copy for the drawer; it is not a wallet ledger.
12. `assetSafety`: explicit fake-only provenance flag stating all poster/thumbnail/video placeholders are original, generated from cleared/internal material, or abstract placeholders, with no licensed/competitor/uncleared source.
13. `assetPlaceholders`: optional references to safe placeholder poster/thumbnail/video labels only; this packet does not authorize adding files.
14. `contentStatus`: proposal/review status such as `fake-only-placeholder`, not production-ready.

Recommended minimum episode-level fields:

1. `episodeNumber`: positive integer from 1 through `totalEpisodes`.
2. `episodeTitle`: optional fake title or generated label such as `EP 6`; must be safe and non-infringing.
3. `isFree`: derived from `episodeNumber <= freeEpisodes`, not manually overridden for the P0 path.
4. `isFirstLocked`: derived from `episodeNumber === freeEpisodes + 1` when `totalEpisodes > freeEpisodes`.
5. `lockStateCopy`: safe locked-state copy such as `EP X is locked`; must not look like network/error copy.
6. `lockHook`: required for first locked episode; optional/deferred for later locked episodes.
7. `unlockConditionCopy`: safe copy for Episode Sheet, such as `Unlock with 36 coins`, not only a lock icon.
8. `placeholderPlaybackLabel`: fake-only label for non-real playback/demo content; no real video provider implied.

Rationale:

1. The PRD requires drama title, episode number, tags, total episode count, free episode range, lock state, price/unlock condition, story hook, fake balance, fake cost, and same-episode context across Watch, Episode Sheet, Unlock Drawer, Pass, and Show Detail.
2. A closed contract prevents fake content needs from expanding into real backend/database/CMS/content API scope.
3. Deriving lock state from `freeEpisodes` preserves the per-drama lock point and avoids hard-coded episode-specific overrides that could break P0.
4. Requiring first-lock hook metadata supports the core conversion moment while avoiding the larger editorial burden of custom hooks for every locked episode.
5. Explicit asset-safety provenance reduces the risk that licensed, competitor, or uncleared assets enter prototype or production branches.
6. Keeping tags generic and safe supports the Watch/Show Detail/Search/Genre surfaces without creating ad targeting, analytics taxonomy, or recommendation infrastructure.
7. Keeping episode ranges as display metadata supports long-drama Episode Sheet requirements without changing route/playback behavior.

Alternate options:

- Minimal P0-only metadata: define only `showId`, `title`, `totalEpisodes`, `freeEpisodes`, first-lock hook, fake balance, and fake cost. This is safer and smaller but leaves tags, episode ranges, auxiliary Show Detail, and asset safety under-specified.
- Rich editorial metadata: require hooks, summaries, thumbnails, and safety notes for every episode. This improves future content QA but risks over-scoping P1 into content operations and asset review.
- Backend-ready content schema: define entities for shows, episodes, assets, entitlements, prices, tags, and recommendations. This is not approved here because backend/database/content APIs are hard-stop-gated P2/future scope.
- NovelHub-aligned model: reference NovelHub as future infrastructure only. Do not implement or bind Q18 P0/P1 metadata to NovelHub production infrastructure in this scope.

## Acceptance criteria

Decision packet acceptance criteria:

1. This document is clearly marked docs-only / fake-only / non-implementation and proposal pending human product confirmation.
2. The exact P0 invariant appears unchanged and is not weakened by Q18.
3. The Q18 default is stated as proposal only: define a closed fake-only content metadata contract for demo dramas.
4. The packet explicitly preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
5. The packet states that `freeEpisodes` is the per-drama lock point source and first locked episode is derived as `freeEpisodes + 1` when present.
6. The packet identifies minimum fields needed for drama title, fake hooks, tags, total episode count, free episode count/range, episode ranges, locked state, fake cost/balance, and safe fake/test asset provenance.
7. The packet requires the first locked episode to have a fake-safe hook for the Unlock Drawer and defers hooks for every later locked episode unless separately approved.
8. The packet requires Episode Sheet metadata to support range tabs, current episode highlight, free/locked state, and price/unlock condition, not just a lock icon.
9. The packet treats tags as generic display labels only, not analytics, ad targeting, or recommendation infrastructure.
10. The packet requires asset-safety metadata or review flags for fake/test assets and forbids licensed, competitor, or uncleared assets/copy.
11. The packet explicitly forbids runtime code, fixture, test/CI, PRD, roadmap, production infrastructure, backend/database/content API, entitlement, payment/subscription/login, real video, analytics/Facebook, legal/compliance, and asset decisions.
12. PRD anchors include default route, core principles, Watch fields, Episode Sheet fields, first-lock trigger, Unlock Drawer fields, Show Detail fields, P0/P1/P2 scope, developer handoff, QA checklist, and the Q18 question source.
13. Product/editorial confirmation remains an explicit gate before treating this recommendation as an approved content metadata decision.

Future fake-only additive review acceptance criteria, if later authorized for implementation:

1. The canonical default route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Every fake demo drama has a stable fake `showId`, title, total episode count, `freeEpisodes`, safe tags, and first-lock hook.
3. For each fake demo drama, EP1 through `freeEpisodes` are playable/free in the fake flow without login, recharge, subscription, Story Pass prompt, PWA install prompt, or payment-like prompt.
4. The first locked episode is exactly `freeEpisodes + 1` when `totalEpisodes > freeEpisodes` and opens the Unlock Drawer when `unlocked !== true`.
5. Fake unlock/pass returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` for the same locked episode.
6. Episode Sheet can display total episodes, free episode range, range tabs, current episode, free/locked states, and price/unlock condition from the fake metadata.
7. Unlock Drawer can display drama title, episode number, first-lock hook, fake balance, fake cost, primary `Unlock EP X`, secondary `Get Story Pass`, close action, and same-episode return helper from or alongside the fake metadata.
8. Metadata does not allow optional tags, hooks, asset labels, or ranges to change route behavior, starting episode, lock point, CTA hierarchy, fake unlock/pass return, or `unlocked=1` semantics.
9. Fake/test asset references are original placeholders or otherwise explicitly approved-safe; no competitor/licensed/uncleared titles, posters, videos, actor likenesses, logos, pricing, or copy are introduced.
10. Metadata does not call, stub, depend on, or simulate real backend/database/content APIs, CMS, NovelHub production infrastructure, real video provider, entitlement, login, payment/subscription, wallet ledger, Facebook APIs, Pixel/CAPI, production analytics, deployment, DNS, secrets, or paid services.
11. If later tests are authorized, they must be additive and must not weaken existing P0 invariant coverage from EP1 through same-episode fake unlock/pass return.

Accepted/deferred criteria summary:

- Accepted now as recommendation: a closed fake-only content metadata default for demo dramas, with first-lock support and explicit asset-safety guardrails.
- Accepted now as guardrail: metadata cannot weaken the P0 invariant, route/playback behavior, per-drama lock point, drawer behavior, CTA hierarchy, or same-episode fake unlock/pass return.
- Deferred: runtime fixtures, code schema, validators, tests, browser evidence, editorial workflow, asset creation/import, content tooling, and all implementation details.
- Hard-stop deferred: real backend/database/content APIs, real video, payment/subscription/login/entitlement, production analytics/Facebook integrations, deployment/DNS/secrets, legal/compliance/content-rights, and NovelHub production work.

## Validation plan

This validation plan covers this packet only. It does not require or authorize code execution, test execution, browser evidence, CI, PRD edits, roadmap edits, fixture changes, or implementation work.

1. Confirm the status line says requirements decision packet only, docs-only / fake-only / non-implementation, and proposal pending human product confirmation.
2. Confirm the non-authorization disclaimer appears near the top and includes runtime code, fixture changes, real video, backend/database/content APIs, entitlement, login, payment/subscription, Facebook/analytics, deployment/DNS/secrets, assets, legal/compliance/brand, and NovelHub production infrastructure.
3. Confirm the exact P0 invariant appears as a single unchanged line.
4. Confirm the recommendation defines fake-only drama-level and episode-level metadata fields for `showId`, title, hooks, tags, `totalEpisodes`, `freeEpisodes`, episode ranges, fake balance/cost, locked-state copy, and asset-safety provenance.
5. Confirm `freeEpisodes` remains the per-drama lock point source and first locked episode remains derived, not campaign/asset/tag driven.
6. Confirm every Q18 requirement preserves watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode behavior.
7. Confirm PRD anchors include §2 default route, §5 core principles, §8 Watch/Episode Sheet/Unlock Drawer/Show Detail fields, §11 P0 scope, §12 P1 scope, §13-§14 deferred/out-of-scope systems, §15 QA checklist, and the Q18 question source.
8. Confirm future fake-only acceptance criteria forbid metadata from altering route/playback/episode/lock/drawer/unlock/pass behavior.
9. Confirm future fake-only acceptance criteria forbid login/recharge/PWA/payment-like prompts before free playback and forbid skipping the first-lock Unlock Drawer.
10. Confirm fake/test asset requirements forbid licensed, competitor, or uncleared assets/copy and require explicit safe provenance/review flags.
11. Confirm the packet states no user input is needed for this packet, but product/editorial, architecture/feasibility, QA, and legal/content-rights gates are required before approval or implementation.
12. Confirm this task only adds this docs-only packet and does not modify runtime/source/test/fixture/config/package/lockfile files.

## Risks / gates

- Product decision gate: product must explicitly confirm whether the closed fake-only metadata contract is approved, narrowed, expanded, or replaced.
- Editorial/content gate: fake titles, hooks, synopses, tags, and episode labels require product/editorial review before being treated as approved user-facing copy.
- Asset-rights gate: any poster, thumbnail, video, audio, logo, actor likeness, or generated asset requires explicit provenance and legal/content approval before use outside abstract placeholders.
- P0 regression risk: metadata could accidentally change starting episode, lock point, drawer timing, CTA hierarchy, pass return, or same-episode fake unlock return.
- Content-scope risk: richer episode metadata could expand into real content operations, CMS, backend/database, asset pipeline, or NovelHub production work without authorization.
- Monetization risk: fake cost/balance fields could be mistaken for real pricing, wallet, or payment rules; this packet permits fake drawer/pass copy only.
- Tag/taxonomy risk: tags could be mistaken for ad targeting, analytics, recommendation, or SEO taxonomy; this packet permits generic display labels only.
- Locked-vs-error risk: locked-state copy must remain distinct from video/network error copy, especially if real playback is considered later.
- QA gate: future fake-only implementation should verify metadata-driven Episode Sheet and Unlock Drawer evidence without requiring production analytics, real video, or CI changes unless separately authorized.
- Architecture/feasibility gate: any code schema, fixture format, validation, routing integration, or pass/detail/watch consumption requires a separate authorized implementation plan.
- Hard-stop gate: real backend/database/content APIs, real video, production analytics/Facebook integrations, payment/subscription/login/entitlement, deployment/DNS/secrets, legal/compliance/content rights, and NovelHub production infrastructure remain blocked.

## Recommended task graph

No implementation task is recommended from this packet alone.

If product later confirms Q18 as an approved P1 default, create separate tasks in this order:

1. Requirements/product gate: confirm the exact approved fake-only metadata fields, default range size, first-lock hook requirement, and safe tag vocabulary.
2. Editorial/content gate: draft original fake drama titles, hooks, synopses, episode labels, and tags; review for non-infringement and brand safety.
3. Asset-safety gate: confirm placeholder asset policy and provenance labels before any file or fixture references are added.
4. Architecture/feasibility gate: define a fake-only fixture/schema boundary for Watch, Episode Sheet, Unlock Drawer, Pass, and Show Detail consumption without backend/database/content APIs or NovelHub production dependencies.
5. Fake-only implementation task: only after gates, add or update fake metadata fixtures and UI consumption while preserving P0 route, free chain, first lock, drawer, CTA hierarchy, and same-episode fake unlock/pass return.
6. Additive QA task: validate one or more fake dramas across EP1, free chain, first locked episode, Episode Sheet ranges, Unlock Drawer copy, fake unlock/pass, and same-episode `unlocked=1` return.
7. Reviewer gate: requirements/product/QA review confirms no runtime implementation crossed into real content, asset, backend, entitlement, payment, video, Facebook/analytics, production, or legal hard-stop scope.
8. Documentation traceability task: record the confirmed decision and evidence in a future docs artifact without editing the PRD unless explicitly authorized.

## Open non-blocking questions

- Should the default episode range size be exactly 24, or should product/design approve a different range size for shorter/longer fake dramas?
- Which generic tags are approved for the first fake content set, and should the vocabulary be closed for P1 review?
- Should first-lock hook be stored at drama level, episode level, or both in any future fake-only fixture implementation?
- Should later locked episodes use generic fallback hook copy, no hook, or require editorial hooks after the first lock?
- What minimum asset provenance label is enough for fake/test placeholders before legal/content review is needed?
- Should fake price/cost fields live in content metadata, unlock configuration, or a separate fake monetization configuration if implementation is later authorized?
- How many fake dramas are needed for P1 evidence: one canonical PRD path only, or multiple dramas with different `freeEpisodes` values?
- Who must approve moving from fake metadata fixtures to real backend/database/content API contracts: product, architecture, legal/content rights, engineering, or all of them?

## Traceability

- Phase 5 question: `docs/moboreels/phase-4g/phase-5-questions.md` Q18, line 35.
- Existing Phase 5 brief context: `docs/moboreels/phase-5/p1-decision-brief.md` lines 240 and 291 identify Q18 as not answered there and suitable for separate safe fixture metadata definition.
- Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` §5 lines 90-99 define per-drama `freeEpisodes`; §8.2 lines 262-291 define Episode Sheet metadata needs; §8.4 lines 314-325 define Unlock Drawer content; §11 lines 612-631 define P0 scope.
- P0 invariant: PRD §2, §6, §7, §8, §11, and §15 all preserve watch-first, free-preview-first, first-lock drawer, fake unlock/pass, and same-episode `unlocked=1` return.
- Prototype B: `docs/moboreels/prototype-b-spec.md` delegates implementation detail to the SceneFlow PRD.
