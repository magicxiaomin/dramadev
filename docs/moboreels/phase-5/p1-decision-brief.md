# Phase 5 P1 Decision Brief — docs-only / fake-only / non-implementation proposal

STATUS: proposal — pending human product confirmation.

This document is a planning artifact only. It does not authorize PRD edits, roadmap edits, runtime code, fixtures, tests/CI, Playwright work, real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets/assets/legal decisions, or NovelHub production infrastructure.

P0 invariant preserved verbatim:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

## Goal

Propose safe P1 defaults for selected Phase 5 questions without changing the confirmed P0 conversion invariant or crossing hard-stop boundaries.

## Context

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.
Secondary source: `docs/moboreels/prototype-b-spec.md`, which defers implementation PRD detail to the SceneFlow PRD.
Question source: `docs/moboreels/phase-4g/phase-5-questions.md`.
Roadmap context: `docs/moboreels/real-mvp/roadmap.md` remains planning-only and states no real implementation should start until relevant decision gates are explicitly approved.

## PRD sections reviewed

- PRD §2 Product Decision Summary, lines 20-37: core Facebook ad journey and default ad landing route.
- PRD §3 Non-Goals, lines 41-59: no login before free preview, no PWA prompt before first playback, no recharge/Story Pass promotion before first lock, no real payment/subscription/Facebook APIs/video/competitor assets.
- PRD §5 Core Product Principles, lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, return to same episode.
- PRD §6 P0 User Flow, lines 142-158: ad click through free chain, first lock, drawer, mock unlock/pass, same-episode return.
- PRD §7 Route Requirements, lines 160-209: watch landing route, future attribution params, locked route, unlocked return route, pass route preserving story/episode context.
- PRD §8 Page Requirements, lines 210-537: Watch page states, episode complete behavior, locked state, Unlock Drawer, balance/login states, Pass page, unlock success return, auxiliary Home/Search/Genre roles.
- PRD §9 PWA Requirements, lines 538-562: no first-playback interruption; recommended P1 trigger moments; safe-area and offline/network distinctions.
- PRD §10 Metrics, lines 564-610: primary funnel and non-P0 success metrics.
- PRD §11 P0 Scope, lines 612-631: required P0 behaviors.
- PRD §12 P1 Scope, lines 633-649: permitted P1 candidates.
- PRD §13 P2 Scope, lines 650-665: real video/backend/login/payment/subscription/entitlement/production analytics/Facebook CAPI deferred.
- PRD §14 Developer Handoff Notes, lines 667-743: future attribution state/query params and explicit out-of-scope real systems.
- PRD §15 QA Acceptance Checklist, lines 744-777: safe-area CTA visibility and locked/network distinction evidence.
- PRD §16 Open Questions for Future Iteration, lines 779-789: non-blocking future iteration questions.

## P0 scope protected by this brief

This brief does not change P0. P0 remains:

- Watch-first Facebook ad landing route.
- Free preview before login, recharge, subscription, Story Pass promotion, or PWA install prompt.
- Per-drama `freeEpisodes` lock point.
- First locked episode opens the Unlock Drawer.
- Unlock Drawer transparently shows drama, episode, balance, cost, single-episode unlock, Story Pass, and same-episode return behavior.
- Single-episode unlock remains primary on the first locked episode; Story Pass remains secondary.
- Fake unlock/pass returns to the same episode with `unlocked=1`.

## Selected P1 proposals

### Q1 — Manual Continue vs 3-second auto-next countdown

Question source: Phase 5 Questions line 9: "Should P1 keep manual `Continue to EP X`, or introduce a 3-second auto-next countdown after free episode completion?"

PRD anchor: §8.1 Episode Complete Behavior, lines 252-260: free episode completion must show a clear "Continue to EP X" CTA; P0 may implement manual continuation; P1 may implement 3-second countdown autoplay; next episode routes to free playback or locked flow. Also §12 P1 Scope, lines 637-640, includes local continue-watching, episode completion tracking, and 3-second auto-next countdown.

Default proposal: Keep manual `Continue to EP X` as the default P1 behavior, with a fake-only optional 3-second countdown variant behind review/demo configuration if product wants to compare evidence later.

Rationale: Manual continue is already P0-compatible, keeps the user in control, avoids accidental transition into the first locked episode, and preserves the explicit moment where the user understands the free episode chain. A countdown can be explored as a P1 optimization but should not replace the safe default without evidence.

Alternate option: Make 3-second auto-next the P1 default, with a visible cancel/continue-now affordance and clear transition state.

Affects P0: No. The P0 invariant remains `/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1`.

STATUS: proposal — pending human product confirmation.

### Q2 — Custom story hook for every locked episode vs first locked episode only

Question source: Phase 5 Questions line 10: "Should every locked episode have a custom story hook, or only the first locked episode?"

PRD anchor: §8.4 Unlock Drawer, lines 314-325, requires a current story hook in the drawer and same-episode return explanation; lines 327-364 recommend hook, locked state, price, CTA, and helper hierarchy. §16 Open Questions, line 784, asks whether every locked episode should have a custom story hook.

Default proposal: Require a custom story hook only for the first locked episode in P1. Permit generic safe fallback copy for later locked episodes until content metadata and editorial review are explicitly expanded.

Rationale: The first locked episode is the core conversion moment and is already central to the PRD funnel. Requiring hooks for every locked episode increases content operations scope and asset/copy QA without improving the P0 proof point. A first-lock-only requirement keeps the P1 decision fake-only and scoped.

Alternate option: Require every locked episode to define a custom hook before it can appear as locked; missing hooks block fixture/content review.

Affects P0: No. The first locked episode remains the lock point and still opens the Unlock Drawer.

STATUS: proposal — pending human product confirmation.

### Q3 — Mock balance before first lock vs only inside Unlock Drawer

Question source: Phase 5 Questions line 11: "Should mock balance appear before the first lock, or only inside the Unlock Drawer?"

PRD anchor: §3 Non-Goals, lines 50-53, prohibits recharge or Story Pass promotion before the user reaches the first locked episode. §5.4 Transparent unlock, lines 101-112, requires balance and cost in the locked episode flow. §8.4 Unlock Drawer, lines 314-325, requires balance and cost in the drawer. §8.4 Balance states, lines 372-392, says P0 can mock balance and describes CTA behavior. §16 Open Questions, line 785, asks whether balance should be shown before lock or only inside Unlock Drawer.

Default proposal: Show mock balance only inside the Unlock Drawer for P1.

Rationale: Showing balance before the first lock risks looking like a recharge/payment prompt before free preview completes. Keeping balance inside the drawer preserves transparent unlock at the paid-action moment while honoring free-preview-first.

Alternate option: Show a passive non-CTA balance chip after at least one free episode completes, provided it has no recharge prompt, no Story Pass prompt, and no payment-like call to action.

Affects P0: No. Free episodes stay free of recharge/payment-like prompts, and balance remains visible at the locked episode flow.

STATUS: proposal — pending human product confirmation.

### Q4 — Story Pass secondary on first locked episode in all campaigns

Question source: Phase 5 Questions line 12: "Should Story Pass stay secondary on the first locked episode in all campaigns?"

PRD anchor: §3 Non-Goals, line 53, says not to make Story Pass the primary CTA on the first locked episode. §5.5 Single-episode unlock first, lines 113-128, defines primary CTA `Unlock EP X`, secondary CTA `Get Story Pass`, and rationale that first conversion should reduce friction. §8.4 Unlock Drawer, lines 321-323 and 348-358, defines primary and secondary CTA hierarchy. §11 P0 Scope, lines 623-625, includes single-episode unlock as primary CTA and Story Pass as secondary CTA.

Default proposal: Yes. Story Pass should remain secondary on the first locked episode in all P1 campaigns.

Rationale: This is a core PRD decision, not an optimization knob. Campaign-specific reversal would risk violating the single-episode-unlock-first principle and muddy acceptance evidence.

Alternate option: Allow later non-P0 experiments where Story Pass emphasis changes only after the user has already passed the first locked episode or in explicitly non-Facebook/non-P0 paths.

Affects P0: No. This proposal preserves the P0 CTA hierarchy exactly.

STATUS: proposal — pending human product confirmation.

### Q5 — PWA install education timing

Question source: Phase 5 Questions line 13: "Should PWA install education appear after reaching the lock, after fake unlock success, on second visit, or not until later?"

PRD anchor: §3 Non-Goals, line 51, says no PWA install prompt before first playback. §8.1 Watch Page, lines 230-235, says PWA install prompt must not show before free playback. §9 PWA Requirements, lines 538-554, says install prompt must not interrupt first playback and lists P1 trigger moments: after watching 2 episodes, after reaching first locked episode, after unlock success, on second visit, or after follow/continue-watching action. §10 Metrics, lines 605-610, says PWA install rate is not a P0 success metric. §12 P1 Scope, lines 647-648, includes iOS Add to Home Screen instruction and PWA install prompt after high-intent actions.

Default proposal: Defer PWA install education until after fake unlock success or second visit. Do not show it at first lock in the default P1 path.

Rationale: First lock is the monetization decision point and should stay focused on Unlock EP X / Get Story Pass. After fake unlock success, the user has demonstrated high intent and same-episode return has already been proven. Second visit is also a natural retention moment that does not interfere with the P0 funnel.

Alternate option: Show lightweight PWA education after reaching first lock only after the Unlock Drawer has been dismissed via Maybe later, never before the drawer's primary/secondary decision is visible.

Affects P0: No. The prompt remains absent before first playback and does not interrupt free-preview-first or lock conversion.

STATUS: proposal — pending human product confirmation.

### Q6 — Evidence threshold for mobile safe-area drawer CTA visibility

Question source: Phase 5 Questions line 14: "What evidence threshold should define merge-readiness for mobile safe-area drawer CTA visibility?"

PRD anchor: §1 Status, lines 9-10, targets Mobile PWA/Web prototype with approximately 390 x 844 iPhone-like viewport. §9 PWA Requirements, lines 556-560, says PWA UI must consider iOS safe area, bottom drawer safe area, and standalone mode return paths. §15 QA Acceptance Checklist, line 776, requires mobile safe area not to cover drawer CTA.

Default proposal: Merge-readiness for this P1 evidence item should require documented fake-only visual evidence that the Unlock Drawer primary and secondary CTAs are visible and tappable at the target 390 x 844 mobile viewport, including a bottom-safe-area case. Evidence should include at least one screenshot or recorded walkthrough at first lock with drawer open, plus an explicit note that no production device, analytics, payment, or deployment evidence is implied.

Rationale: The PRD names CTA visibility as a P0 acceptance concern, but the Phase 5 question is about evidence threshold. The threshold should be high enough to catch drawer obstruction regressions while staying docs/fake-only.

Alternate option: Require a broader visual matrix for multiple mobile heights and standalone PWA mode before merge-readiness. This is safer but may be too heavy for the current fake-only planning scope.

Affects P0: No. It validates visibility of the existing P0 drawer behavior without changing the flow.

STATUS: proposal — pending human product confirmation.

### Q7 — Deep-link different starting episodes vs always EP1

Question source: Phase 5 Questions line 18: "Should future ad creatives deep-link to different starting episodes, or must P0/P1 always start at EP1?"

PRD anchor: §2 Product Decision Summary, lines 33-37, defines default ad landing route `/variant-b/watch/[showId]?episode=1&source=facebook`. §6 P0 User Flow, lines 144-145, lands the user on episode 1 from the Facebook ad. §7.1 Watch landing route, lines 162-181, defines the primary ad route and says optional future attribution params should not disrupt routing or playback. §12 P1 Scope, line 642, includes ad creative -> episode mapping. §16 Open Questions, line 788, asks whether different Facebook ad creatives should deep-link to different starting episodes in P1.

Default proposal: P0 and default P1 should always start Facebook ad traffic at EP1. Treat ad creative -> episode mapping as a later P1 experiment that must preserve an explicit fallback to EP1 and must not be enabled by default.

Rationale: EP1 start is central to the confirmed route and evidence package. Different starting episodes create continuity, entitlement, attribution, and content expectation risks. Keeping EP1 as default preserves watch-first and free-preview-first while allowing a future fake-only experiment after product confirmation.

Alternate option: Permit selected fake-only ad creative mappings to non-EP1 free episodes, but only if the target episode is within `freeEpisodes`, the URL preserves `source=facebook`, and the flow still reaches the first locked episode normally.

Affects P0: No. The P0 route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.

STATUS: proposal — pending human product confirmation.

### Q8 — Optional attribution params preserved beyond `source=facebook`

Question source: Phase 5 Questions line 19: "Which optional attribution params should be preserved in URLs beyond `source=facebook`?"

PRD anchor: §7.1 Watch landing route, lines 170-181, lists optional future attribution params and says P0 does not need analytics processing and params should not disrupt routing or playback. §14 Developer Handoff Notes, lines 707-729, lists source/attribution params as future state and query params. §12 P1 Scope, lines 640-642, includes Facebook attribution event tracking, Pixel/CAPI planning, and ad creative -> episode mapping.

Default proposal: Preserve the PRD-listed optional params as inert URL context only: `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, and `utm_content`. Do not process them into analytics, backend state, cookies, storage, or Facebook APIs in this scope.

Rationale: The PRD already names the safe future parameter set. Preserving them in URLs can support later review while avoiding production analytics and data-handling scope.

Alternate option: Preserve only standard UTM params (`utm_source`, `utm_campaign`, `utm_content`) plus `creative_id`, and drop platform-specific IDs until a legal/data review approves retention.

Affects P0: No. Optional params must not disrupt routing or playback; `source=facebook` remains sufficient for P0.

STATUS: proposal — pending human product confirmation.

### Q15 — `unlocked=1` as fake-only review signal after production entitlement exists

Question source: Phase 5 Questions line 29: "Should `unlocked=1` remain a fake-only review signal once production entitlement exists?"

PRD anchor: §5.6 Return to same episode, lines 130-140, requires mock unlock or purchase return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` and forbids returning Home or losing episode context. §7.3 Unlocked return route, lines 191-198, says `unlocked=1` simulates successful unlock. §8.4 Login states, lines 394-402, says P0 may simulate unlock with `unlocked=1`. §13 P2 Scope, lines 654-665, defers real backend, login, payment, subscription, entitlement, analytics, and Facebook CAPI. §14 Out of Scope, lines 731-743, excludes production entitlement system.

Default proposal: Yes, but only as a fake-only review/demo signal. Once production entitlement exists, `unlocked=1` must not grant real access and must be ignored or disabled outside explicitly approved fake/sandbox/review contexts.

Rationale: `unlocked=1` is valuable for preserving same-episode review evidence in fake-only flows, but it would be unsafe as production entitlement. This default keeps the current fake flow intact while drawing a bright line before real entitlement.

Alternate option: Deprecate `unlocked=1` entirely when production entitlement exists and replace it with a sandbox-only entitlement fixture controlled outside the public URL.

Affects P0: No. P0 remains fake-only and continues to use `unlocked=1` for mock unlock/pass return.

STATUS: proposal — pending human product confirmation.

### Q17 — Locked state visually distinct from video/network errors when real playback exists

Question source: Phase 5 Questions line 34: "How should locked state remain visually distinct from video/network errors when real playback exists?"

PRD anchor: §8.3 First Locked Episode State, lines 301-308, says locked state must not look like a network error and tapping locked playback reopens Unlock Drawer. §9 PWA Requirements, lines 561-562, requires weak network and offline states distinct from locked state. §13 P2 Scope, line 654, defers real video player. §15 QA Acceptance Checklist, line 777, requires locked state visually distinct from weak network / video error state.

Default proposal: Preserve a distinct locked-state vocabulary in P1 docs and fake UI evidence: locked copy should name the episode and unlock action, show price/balance context in the drawer, and use lock/unlock affordances; network/video error states should use retry/offline/error copy and never show unlock CTAs. Real playback-specific implementation remains P2/hard-stop-gated.

Rationale: The PRD already requires distinction, and the safe P1 decision can define acceptance language without implementing real video infrastructure. This reduces future ambiguity while staying fake-only.

Alternate option: Defer all detailed locked-vs-error state taxonomy until a real video provider boundary is approved, retaining only the PRD's high-level distinction requirement for now.

Affects P0: No. The P0 fake locked state remains distinct and still opens the Unlock Drawer.

STATUS: proposal — pending human product confirmation.

## P1/P2 deferred scope

- Real Facebook redirect/API, Pixel/CAPI, production analytics, consent, dedupe, and data handling remain deferred and require hard-stop approval.
- Real payment, subscription, login, entitlement, wallet ledger, refund/cancellation, backend/database, and production access control remain deferred and require hard-stop approval.
- Real video provider, hosting, playback implementation, and network/error handling implementation remain deferred and require hard-stop approval.
- Licensed or competitor assets remain disallowed unless human/legal approval explicitly clears content source and rights.
- Multi-episode hook coverage, broader mobile device matrices, and non-EP1 ad creative mapping are optional later proposals, not P0 requirements.

## Hard-stop / not-authorized questions not answered here

The following Phase 5 questions are not answered by this brief except to mark them hard-stop/not authorized for implementation:

- Q9, line 20: real Facebook redirect/API work — hard-stop approval required.
- Q10, line 21: Pixel/CAPI or production analytics — hard-stop approval required.
- Q11, line 25: real payment provider/legal/refund/test environment — hard-stop approval required.
- Q12, line 26: real subscription or Story Pass billing — hard-stop approval required.
- Q13, line 27: real login placement — hard-stop approval required.
- Q14, line 28: server-side entitlement source of truth — hard-stop approval required.
- Q16, line 33: real video playback provider/fallback states — hard-stop approval required.
- Q19, line 36: licensed or competitor asset policy — human/legal approval required.
- Q20, line 40: backend content retrieval API contract — hard-stop approval required.
- Q21, line 41: database schema entities — hard-stop approval required.
- Q22, line 42: environments for non-production QA / production-related changes — hard-stop approval required for production-related changes.
- Q23, line 43: secrets management and real service integration review process — hard-stop approval required.

Not addressed in this brief because they are outside the assigned question set: Q18 line 35 and Q24 line 44.

## Non-scope

- No implementation work.
- No edits to PRD or roadmap.
- No runtime code, fixtures, tests/CI, or Playwright changes.
- No real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets work.
- No production infrastructure or NovelHub production implementation.
- No legal, compliance, brand, licensed-content, or competitor-asset decisions.

## Assumptions

- "P1" in this brief means fake-only, docs-only, and review/planning scope unless a later human product decision expands it.
- The current P0 invariant and route are non-negotiable for this task.
- Optional attribution params may be preserved only as inert URL context; preservation is not analytics processing.
- `unlocked=1` is a mock review signal, not entitlement.
- Evidence thresholds in this brief describe documentation/readiness expectations, not CI or production gate implementation.

## Acceptance criteria for this decision brief

- The document is clearly marked docs-only/fake-only/non-implementation and pending product confirmation.
- The P0 invariant string is reproduced verbatim.
- Only Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q15, and Q17 receive default proposals.
- Each answered question cites a Phase 5 Questions line number and PRD section/line anchors.
- Each answered question includes a default proposal, rationale, alternate option, P0 impact statement, and `STATUS: proposal — pending human product confirmation`.
- Q9-Q14, Q16, and Q19-Q23 are listed as hard-stop/not authorized and are not substantively answered.
- Q18 and Q24 are identified as outside this brief's assigned question set and are not answered.

## Validation plan

1. Read `docs/moboreels/phase-5/p1-decision-brief.md` and confirm the header states docs-only/fake-only/non-implementation and pending product confirmation.
2. Confirm the exact P0 invariant appears near the top and no proposal changes it.
3. Confirm the only proposal sections are Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8, Q15, and Q17.
4. Confirm every proposal section includes Phase 5 Questions line reference, PRD anchor, default proposal, rationale, alternate option, P0 impact, and proposal status.
5. Confirm hard-stop questions Q9-Q14, Q16, and Q19-Q23 are listed only as not-authorized/hard-stop items.
6. Confirm there are no instructions to implement runtime code, tests, CI, backend, database, real payment, real analytics, real Facebook integration, real entitlement, real video, production deploy, DNS, secrets, or NovelHub production infrastructure.

## Risks / gates

- Product confirmation gate: all defaults remain proposals until human product confirmation.
- Legal/data gate: any real attribution processing, Pixel/CAPI, Facebook API, licensed content, or competitor asset use requires explicit approval.
- Monetization gate: real payment, subscription, Story Pass billing, refunds, local pricing, tax, and login/payment sequencing require explicit approval.
- Entitlement/security gate: production access control must never rely on `unlocked=1`.
- Video/provider gate: real playback and error-state implementation require approved provider boundary and fallback behavior.
- QA gate: safe-area visibility evidence can be requested for review, but this document does not create or run tests.

## Recommended task graph

1. Product owner reviews and confirms/rejects each selected P1 default in this brief.
2. If confirmed, requirements can create docs-only acceptance criteria for P1 fake-only behavior without changing P0.
3. Content/architecture task can separately define safe fixture metadata for Q18 without using licensed or competitor assets.
4. QA task can separately define an evidence-readiness checklist for fake-only mobile drawer visibility and locked-vs-error review artifacts.
5. Any real system work remains blocked behind explicit hard-stop approval tasks.

## Open non-blocking questions

- Which selected P1 defaults should be promoted from proposal to confirmed product decision?
- Should 3-second auto-next be tested as a fake-only variant after manual continue remains the default?
- Should PWA education be limited to post-unlock success first, or should second visit be equally preferred?
- Should optional attribution preservation use the full PRD-listed set or the narrower UTM-plus-creative subset?
- Should broader mobile viewport evidence be requested before any future P1 merge-readiness gate?
