# Phase 5 P1 Q17 Feasibility Note — Locked vs error visual distinction default

Status: FEASIBILITY VERDICT — REVISE (non-blocking) for docs-only / fake-only planning. Do not treat this as product/design approval or implementation authorization.

This note does not authorize runtime code changes, route changes, fixture changes, tests/CI, browser evidence, PRD edits, production deployment, DNS/cutover, secrets, real payment/subscription/login, Facebook API/Pixel/CAPI, production analytics, backend/database/entitlement, real video/provider playback, network/offline detection, R2/media infrastructure, NovelHub production infrastructure, licensed/competitor assets, or legal/compliance/brand-significant decisions.

## Verdict

REVISE (non-blocking).

The locked-vs-error visual distinction default is feasible as a docs-only / fake-only P1 planning decision, and it stays inside the P0 boundary if it remains a taxonomy/review-evidence requirement: locked state = intentional access gating with unlock vocabulary and drawer behavior; error/offline/network state = technical recovery with retry/offline/error vocabulary and no unlock/payment/pass CTAs.

Before any implementation, screenshot evidence, PRD status change, or QA gate treats it as approved, revise the packet/gate to close three ambiguity gaps:

1. Define precedence when an episode is both locked and a future player/network error could also exist.
2. State whether the locked state may render any playback-progress component at all, even at 0%, or whether progress must be hidden/replaced by non-playback locked affordance.
3. Add acceptance evidence that tests behavior, copy, icon/affordance, CTA labels, and route preservation — not screenshots/color alone.

## Summary

Safe implementation surface is limited to future fake-only UI/copy/review states after product/design confirmation. The default should not require new infrastructure: no real player, network detector, backend, entitlement, payment, analytics, Facebook integration, deployment, or production storage.

User input is required before approval, not before preserving the recommendation as proposal material. Product/design must confirm the taxonomy; architecture/video-provider must separately define real playback/error semantics before production player work; QA must confirm evidence expectations before relying on screenshots or tests.

## Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
  - §2 lines 20-37: Facebook Ad -> Watch EP1 -> free chain -> first locked episode -> Unlock Drawer -> mock unlock/pass -> same episode; canonical route `/variant-b/watch/[showId]?episode=1&source=facebook`.
  - §3 lines 43-58: no Home/Search/Show Detail first, no login before free preview, no pre-free prompts, no real payment/subscription/Facebook APIs/video, no competitor assets.
  - §5.1-§5.6 lines 80-140: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, return to same episode.
  - §6 lines 142-158: P0 first-lock drawer flow and fake unlock/pass return with `unlocked=1`.
  - §7.2-§7.4 lines 183-209: locked route, unlocked return route, pass route context preservation.
  - §8.2 lines 262-291: Episode Sheet locked episodes must be visibly locked, show price/unlock condition, not lock icon alone.
  - §8.3 lines 293-308: trigger is `episode > story.freeEpisodes && unlocked !== true`; locked state must be clear, not show fake playback progress, not look like network error, auto-open/reopen drawer.
  - §8.4 lines 310-402: Unlock Drawer content, balance/cost, CTA hierarchy, mock boundaries.
  - §8.6 lines 465-487: fake unlock returns same drama/episode, resumes playable state, does not return Home/stay on Pass/lose context/remain locked.
  - §9 lines 538-562: weak-network and offline states distinct from locked state.
  - §11-§13 lines 612-665: P0 fake unlock and locked drawer included; real video/backend/login/payment/subscription/wallet/entitlement/production analytics/Facebook CAPI deferred.
  - §14 lines 667-743: expected state/query params and explicit initial out-of-scope list.
  - §15 lines 744-777: QA item requires locked state visually distinct from weak network / video error state.
- `docs/moboreels/prototype-b-spec.md` lines 1-3: defers implementation detail to the SceneFlow PRD.
- `docs/moboreels/phase-5/p1-decision-brief.md` lines 199-213: Q17 proposal matches PRD anchors and says real playback implementation remains P2/hard-stop-gated.
- `docs/moboreels/phase-5/p1-q17-locked-vs-error-visual-distinction-decision-packet.md`: proposal defines locked/error vocabulary, non-scope, validation plan, risks, open questions.
- `docs/moboreels/phase-5/p1-q17-locked-vs-error-visual-distinction-architecture-gate.md`: architecture approves proposal material only and lists fake-only surfaces/guardrails.
- Current repo grounding only:
  - `package.json`: Next.js/React/TypeScript/Tailwind/Vitest/Playwright scripts only; no backend/payment/video/Facebook production dependency.
  - `src/lib/lock.ts`: local fake lock rule maps to `episode > freeEpisodes && !unlocked`.
  - `src/lib/query-params.ts`: fake `unlocked=1`, `episode`, `source`/attribution preservation and pass return helpers.
  - `src/app/variant-b/watch/[showId]/watch-stub.tsx`: fake Watch page has locked copy, Unlock Drawer, same-episode fake return, episode sheet, local state.
  - `src/app/variant-b/pass/pass-stub.tsx`: fake pass return preserves story/episode and states no real payment/subscription/login/entitlement.
  - `src/lib/episode-sheet.ts`: local free/locked/unlocked helper labels.
- `git status --short`: existing Q17 decision packet and architecture gate are untracked; this note is an additional untracked docs artifact.

## Key findings

1. The proposal is feasible because the PRD already requires the distinction. Q17 is not inventing a new flow; it clarifies the meaning of PRD §8.3, §9, and §15.
2. The safe default is requirements taxonomy, not runtime state machinery. It can be documented without choosing a real video provider or implementing network/offline detection.
3. The current fake code already has a local lock boundary and same-episode fake unlock path, so future fake-only review work can be scoped narrowly if separately authorized.
4. The biggest implementation risk is semantic leakage: future error states could accidentally reuse drawer/coin/unlock UI, or future locked states could reuse retry/offline/buffering UI.
5. The current fake Watch surface still renders the progress bar container during locked state with width 0%. That may satisfy “no fake playback progress” mechanically, but it is visually ambiguous enough that future acceptance criteria should decide whether locked state must hide/replace playback progress entirely.
6. The packet correctly leaves product/design confirmation pending. Feasibility should not be read as approval of final copy, iconography, or visual treatment.

## Hidden dependencies

- Product/design taxonomy owner: must approve final state names, headlines, helper copy, and icon/affordance choices.
- QA evidence owner: must define what counts as proving “visually distinct” beyond color-only screenshots.
- Future Q16/video provider owner: must define real media error codes, retry/offline/buffering states, provider outage copy, and precedence rules before real playback work.
- Accessibility review: non-color signals are required; color-only distinction is insufficient.
- State precedence decision: future code must know whether lock state suppresses player errors, player errors suppress the drawer, or both can be represented without confusing the user.
- Route/context preservation: every fake unlock/pass/error/retry path must preserve `showId` and `episode`, and safe attribution params must remain inert.
- Mock data consistency: `freeEpisodes`, episode counts, mock cost/balance, and Episode Sheet labels must stay coherent so the first locked episode is predictable.

## Risks and mitigations

- User-trust risk: locked state that looks broken may reduce confidence. Mitigation: use explicit access-gating copy such as `EP X is locked`, lock/unlock affordance, and drawer action.
- Dark-pattern risk: error states with unlock/payment/pass CTAs imply payment fixes technical failure. Mitigation: hard-forbid unlock, pass, coin, balance, payment, entitlement CTAs in technical errors.
- P0 regression risk: visual work could route users to Home/Pass/login or lose episode context. Mitigation: keep route invariant and same-episode return in every acceptance test.
- Scope creep risk: Q17 could become Q16 real video/provider/network work. Mitigation: keep real playback and production error semantics hard-stop-gated and separate.
- Accessibility risk: color-only distinction fails. Mitigation: require copy, icon/affordance, CTA label, and behavior differences.
- QA false-positive risk: static screenshots can miss drawer reopen behavior and same-episode routing. Mitigation: future evidence must include interaction checks.
- Progress ambiguity risk: a 0% progress bar in locked state could still look like a stalled/buffering video. Mitigation: acceptance criteria should require the progress component to be hidden/replaced or explicitly labeled non-playback when locked.

## Missing acceptance criteria / tests

Add before any implementation or QA run:

1. Locked state copy check: active locked episode displays access-gating vocabulary (`locked`, `unlock`, EP number) and not retry/offline/error/buffering/provider language.
2. Error state copy check: fake technical error examples, if authorized, display retry/offline/error vocabulary and no unlock/pass/coin/payment/balance/entitlement CTA.
3. Progress check: locked state does not show a playback-progress component that could be mistaken for stalled media; if a component remains, it must be explicitly non-playback and approved by design/QA.
4. Behavior check: first locked entry opens Unlock Drawer; closing leaves the same locked episode; tapping locked playback reopens drawer.
5. Route check: fake unlock and fake Story Pass return to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` and do not return Home, lose episode, or stay on Pass.
6. Episode Sheet check: locked episodes show price/unlock condition and not only an icon; tapping locked episode opens the same episode’s drawer.
7. Error recovery check: retry/offline recovery never opens Unlock Drawer unless the active episode is independently locked by `episode > story.freeEpisodes && unlocked !== true` and the product-approved precedence rule says lock may be shown.
8. Accessibility check: distinction is visible through text/affordance/CTA/behavior, not color alone.
9. Boundary check: no new packages, real API calls, backend/database, real video, payment, auth, analytics, Facebook, R2/media hosting, deployment, or secrets are introduced.
10. Evidence packaging check: include mobile viewport evidence around 390 x 844 and drawer safe-area review only if a later QA task explicitly authorizes browser/Playwright evidence.

## Infrastructure boundary check

PASS with constraints.

The reviewed docs keep Q17 inside fake-only planning. The current repo surfaces inspected are static/local prototype code and do not require real backend, database, login, payment, subscription, entitlement, Facebook API, production analytics, real video provider, R2/media hosting, deployment, DNS, secrets, or NovelHub production infrastructure.

Hard boundary: Q17 must not be used to implement real video/network/offline handling. Real playback/provider error taxonomy belongs to Q16/P2 or another separately approved hard-stop task.

## Recommended plan edits

1. In the decision packet acceptance criteria, add an explicit “state precedence” item: when an episode is locked, the access-gating state must not be presented as a video/network failure; when a technical failure occurs on an unlocked/free episode, it must not open Unlock Drawer or show unlock/payment CTAs. If both conditions could later exist, precedence must be approved by product/design + architecture/video-provider before implementation.
2. Add a progress-specific criterion: locked state must not display a normal playback progress bar, spinner, buffering indicator, or failed-load indicator unless design/QA explicitly labels it as non-playback. Prefer replacing the playback progress region with locked-state affordance while locked.
3. Split “visually distinct” into evidence dimensions: copy, icon/affordance, CTA label, behavior, and route result. State that color-only screenshots are insufficient.
4. Add a future fake-only QA matrix row for four states: locked, video error, weak network, offline. Each row should list allowed copy, forbidden CTAs, expected primary action, and drawer behavior.
5. Keep product/design confirmation as required before approval; keep architecture/video-provider confirmation required before real playback; keep QA confirmation required before relying on evidence.
6. Do not edit the PRD or roadmap to mark Q17 approved until human product/design/architecture/QA confirmation is captured.
7. If implementation is later authorized, constrain it to fake/local surfaces only and preserve the P0 route invariant exactly.

## Safe next step

Ask product/design to choose one of these options for Q17:

A. Approve the default taxonomy with the revisions above: locked/access-gating vocabulary and drawer behavior; error/recovery vocabulary with no unlock/pass/payment CTAs.
B. Narrow the default to copy-only guidance now, deferring icon/layout/behavior evidence until QA planning.
C. Defer detailed taxonomy until Q16 real video/provider boundary is approved, retaining only the PRD’s high-level “must be distinct” requirement.

Recommended safe default: A, but only as docs-only proposal material until human confirmation is recorded.

## Stop conditions

Stop and escalate before proceeding if any follow-up asks to:

- Implement real video/player/provider, network/offline detection, provider fallback, production media error handling, or media hosting.
- Add backend/database/API/auth/session/login/payment/subscription/wallet/ledger/entitlement.
- Add Facebook API, Pixel/CAPI, production analytics, cookies/storage/identity/consent processing.
- Deploy, cut over DNS, use production secrets, add R2/production storage, or connect paid services.
- Return fake unlock/pass users to Home, lose episode context, require login before free preview, show prompts before free preview, skip the first locked drawer, or make Story Pass primary at first lock.
- Use licensed/competitor assets or make legal/compliance/brand-significant decisions without human approval.
- Treat this feasibility note, the decision packet, or the architecture gate as final product/design approval without explicit human confirmation.
