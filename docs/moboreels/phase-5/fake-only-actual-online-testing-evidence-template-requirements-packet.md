# PLAN-005 Requirements Packet: Fake-only actual-online-testing evidence template

Status: REQUIREMENTS PACKET / DOCS-ONLY / FAKE-ONLY / NON-PRODUCTION
Date: 2026-05-20
Kanban task: t_2ccc9b6c
Project: DramaDev / SceneFlow MVP

This packet defines requirements for a future evidence template that helps reviewers collect fake-only, non-production proof before any real online testing is considered. It does not authorize production deployment, DNS/cutover, production secrets, real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, video infrastructure, R2/CDN, NovelHub production infrastructure, licensed/competitor/uncleared assets, or legal/compliance/brand-significant decisions.

## Goal

Create a reviewer-ready requirements basis for a fake-only evidence template that can be used during local or explicitly non-production preview/demo validation of the SceneFlow P0 Facebook-ad conversion flow.

The template should help a reviewer prove or falsify this invariant before any actual online-testing decision:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

The output of the future template is evidence, not approval. Passing the template would mean only that the current fake-only P0 flow is demo/preview-reviewable under documented boundaries. It must not be treated as launch-ready or integration-ready evidence.

## Context

A PR #41 review follow-up identified the need for a clearer evidence-template artifact before any “actual online testing” conversation. Existing planning already separates fake-only demo/staging evidence from actual integration or production readiness. This packet narrows the follow-up to the safe part: define what the evidence template should capture, which gates it must enforce, and which follow-up docs can proceed without crossing hard stops.

Relevant existing artifacts:

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` — source of truth for the P0 Facebook ad conversion route and hard non-goals.
- `docs/moboreels/prototype-b-spec.md` — Prototype B / SceneFlow defers to the PRD.
- `docs/moboreels/phase-4g/evidence-template.md` — existing fake-only P0 evidence template baseline.
- `docs/moboreels/phase-5/p1-evidence-readiness.md` — docs-only P1 evidence-readiness annex for safe-area drawer CTA and future browser-matrix proposals.
- `docs/moboreels/phase-5/actual-online-testing-readiness-checklist.md` — readiness checklist that approves only fake-only staging/demo readiness and requires revision before actual online testing.

## PRD sections reviewed

- PRD §2 Product Decision Summary: Facebook ad -> Watch EP1 -> free episode chain -> first locked episode -> Unlock Drawer -> mock unlock -> return to same episode.
- PRD §3 Non-Goals: no Home/Search/Show Detail first, no login before free preview, no pre-lock Story Pass/recharge/PWA prompt, no real payment/subscription/Facebook/video, no competitor or uncleared assets.
- PRD §5 Core Product Principles: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, return to same episode.
- PRD §6 P0 User Flow: landing, free continuation, locked state, drawer, unlock/pass choices, same-episode `unlocked=1` return.
- PRD §7 Route Requirements: landing route, locked episode route, unlocked return route, pass/unlock options route preserving story and episode.
- PRD §8 Page Requirements: Watch Page, Episode Sheet, First Locked Episode State, Unlock Drawer, Story Pass/Unlock Options Page, Unlock Success Return.
- PRD §9 PWA Requirements: install prompt must not interrupt first playback.
- PRD §10 Metrics: funnel metrics are planning concepts; P0 does not require analytics processing.
- PRD §11 P0 Scope: mock unlock, Episode Sheet, first locked episode, no first-playback PWA prompt.
- PRD §12 P1 Scope: attribution, tracking, countdown, pass copy, toast, wallet mock are deferred and not required for this template.
- PRD §13 P2 Scope: real backend, login, payment, subscription, analytics, Facebook CAPI, entitlement, video are not in P0.
- PRD §14 Developer Handoff Notes: important state/query params, and explicit out-of-scope items.
- PRD §15 QA Acceptance Checklist: baseline acceptance items that the template should map to evidence fields.
- PRD §16 Open Questions: future iteration questions remain non-blocking and should not be smuggled into P0 evidence requirements.

## P0 scope for the evidence template

The future evidence template should include fields and checklist rows for:

1. Review metadata
   - Reviewer name or role.
   - Date and time of review.
   - Branch or PR under review.
   - Commit SHA.
   - Local or non-production base URL.
   - Explicit environment label: local, preview, staging, or demo; never production.
   - Test window, if externally reachable.
   - Owner responsible for closing/retiring the preview, if externally reachable.

2. Hard boundary attestation
   - Checkbox confirming docs-only/fake-only/non-production scope.
   - Checkbox confirming no production deploy, DNS/cutover, production secrets, paid production resource, real user traffic, or public launch was performed.
   - Checkbox confirming no real payment/subscription/login/Facebook API/analytics/backend/database/entitlement/video request was observed or required.
   - Checkbox confirming no R2/CDN/NovelHub production infrastructure was used.
   - Checkbox confirming no licensed/competitor/uncleared asset was used in evidence.

3. Canonical P0 route evidence
   - Opened URL: `/variant-b/watch/[showId]?episode=1&source=facebook`.
   - Observed URL after load.
   - Show id used.
   - Episode 1 state.
   - Proof that the user lands on Watch, not Home/Search/Genre/Show Detail.
   - Screenshot anchor/path.
   - Console observations.
   - Network observations, fake-only.

4. Free-preview-first evidence
   - Free episode chain steps performed.
   - Last free episode observed before lock.
   - Confirmation that free episodes play without login, recharge, Story Pass prompt, PWA install prompt, or subscription/payment prompt.
   - Screenshot anchor/path for free episode playback and/or episode-complete CTA.
   - Console and network observations.

5. Per-drama lock point evidence
   - Story `freeEpisodes` value, if visible from fixture/test notes.
   - First locked episode number.
   - Trigger condition observed: episode greater than `freeEpisodes` and not `unlocked=1`.
   - URL at locked episode: `/variant-b/watch/[showId]?episode=[lockedEpisode]`.
   - Confirmation that locked state is distinct from weak network, video failure, or generic error.
   - Confirmation that fake playback progress does not imply the locked episode is already playing.

6. Unlock Drawer evidence
   - Drawer opens automatically on first locked episode.
   - Drawer can be closed without leaving the locked episode.
   - Tapping locked playback area reopens the drawer.
   - Drawer shows drama title, episode number, fake balance, fake cost, single-episode primary CTA, Story Pass secondary CTA, Maybe later/close, and return-to-same-episode explanation.
   - Single-episode unlock remains primary at first lock.
   - Story Pass remains secondary at first lock.
   - Safe-area visibility observation for the primary CTA at 390 x 844.

7. Fake unlock/pass return evidence
   - Action taken: fake single-episode unlock and, if present, fake Story Pass path.
   - Observed return URL: `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
   - Confirmation that show id and episode are preserved.
   - Confirmation that the user is not returned to Home and is not stranded on Pass/options.
   - Confirmation that `unlocked=1` is treated only as fake review state, not production entitlement.

8. Browser/device/viewport evidence
   - Primary viewport: 390 x 844.
   - Browser/device row used.
   - Minimum recommended rows for fake-only evidence: Chromium mobile emulation at 390 x 844, plus WebKit/Mobile Safari-equivalent manual evidence if available without CI/package/browser-install changes.
   - Desktop responsive 390 x 844 may be recorded as supporting evidence, not a replacement for mobile evidence.
   - Desktop wide viewport, if used, is catastrophic-layout smoke only and cannot pass P0 alone.

9. Request/network guard notes
   - Record whether any request to hard-stop service categories was observed.
   - Suggested categories: payment, subscription, auth/login, Facebook/Meta API or Pixel/CAPI, analytics/tracking, backend/API, database, entitlement, video/CDN/R2, secrets surfaces, production domains.
   - Any hard-stop category observed marks the evidence FAIL and requires escalation.

10. Final reviewer decision
   - PASS: fake-only evidence supports local/non-production demo-readiness for the P0 invariant only.
   - FAIL: P0 invariant not proven, hard-stop request observed, route context lost, prompt appears before free preview, unlock return loses episode, or evidence depends on real services.
   - BLOCKED: environment, assets, route, browser, or approval boundary is unclear.
   - Notes and follow-up task suggestions.

## P1/P2 deferred scope

The evidence template may reference the following as future planning topics only; it must not require or implement them:

- P1 attribution param compatibility, provided params remain inert and do not alter first-lock CTA hierarchy.
- P1 browser/viewport matrix expansion beyond the Phase 4G baseline.
- P1 safe-area drawer CTA evidence thresholds.
- P1 local continue-watching, episode completion tracking, auto-next countdown, unlock success toast, wallet/unlock-history mock, or iOS Add to Home Screen instructions.
- P1 Pixel/CAPI planning as docs only, with no real analytics, tracking, cookies, identifiers, or Facebook/Meta API calls.
- P2 real backend content retrieval, production analytics, real login, real payment, real subscription, wallet ledger, server-side entitlement, real video player, CDN/R2/video infrastructure, or Facebook CAPI integration.

## Non-scope

This task and the future evidence-template requirements do not authorize:

- Production deployment, public launch, DNS/cutover, formal domain routing, real ad traffic, or real user traffic.
- Production secrets, paid production resources, production databases, production storage, or production CDN/R2/NovelHub infrastructure.
- Real payment, subscription, login/auth, wallet, refund, cancellation, entitlement, backend, database, analytics/tracking, Facebook/Meta API, Pixel, CAPI, or video infrastructure.
- Runtime code changes, Playwright/CI/browser-matrix changes, package/lockfile changes, source test changes, or environment provisioning.
- Legal, compliance, privacy, content-rights, payment-terms, refund/cancellation, tax, renewal, or brand-significant decisions.
- Licensed, competitor, copied, or uncleared titles, posters, videos, pricing, or copy.
- Treating `unlocked=1` as anything other than fake review state.
- Returning post-unlock users to Home, losing episode context, showing prompts before free preview, or changing the canonical P0 route invariant.

## Assumptions

- The template is a document artifact under `docs/moboreels/phase-5/` or an equivalent docs-only path.
- The reviewer has a local or explicitly non-production preview of the existing fake-only prototype.
- The reviewer can identify a show id, free episode count, and first locked episode from fixture/test notes or UI observations.
- Evidence may include screenshot paths, console notes, network notes, and manual checklist results; it need not include automated test output.
- If a non-production preview URL is externally reachable, access control, noindex/robots handling, test window, owner, and close/rollback plan must be recorded before evidence is accepted.
- Any ambiguity around whether an environment is production-like should default to BLOCKED, not PASS.

## Acceptance criteria

A future evidence-template artifact is acceptable when all of the following are true:

1. It begins with a clear docs-only/fake-only/non-production warning and lists hard stops.
2. It restates the canonical P0 invariant exactly enough for reviewers to compare route and state transitions.
3. It includes reviewer metadata fields for branch/PR, commit, base URL, browser/device, viewport, show id, and first locked episode.
4. It has a hard boundary attestation that blocks production, real services, real user data, production secrets, production infrastructure, and uncleared assets.
5. It includes evidence sections for Facebook source landing, free episode chain, first locked episode, Unlock Drawer, fake single-episode unlock, fake Story Pass path if present, and same-episode `unlocked=1` return.
6. It requires explicit observations that free preview appears before login, recharge, Story Pass, PWA install, payment, or subscription prompts.
7. It requires explicit observations that Unlock Drawer keeps single-episode unlock primary and Story Pass secondary at the first locked episode.
8. It requires explicit observations that post-unlock/post-pass users return to the same show and same episode, not Home or Pass/options.
9. It includes network/request guard notes for hard-stop service categories and marks any observed hard-stop request as FAIL.
10. It distinguishes PASS, FAIL, and BLOCKED outcomes and prevents PASS from being interpreted as actual-online-testing, integration, launch, or production approval.
11. It keeps WebKit/Safari, browser-matrix, CI, automation, and production-readiness language as optional/future planning unless a separate task authorizes it.
12. It preserves PRD decisions: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return to same episode.

## Validation plan

Because this is a requirements packet, validation is documentation review only:

1. Trace every evidence section back to PRD §2, §3, §5-§11, §14, or §15.
2. Compare against `docs/moboreels/phase-4g/evidence-template.md` and ensure the new template requirements are additive, not weakening the existing baseline.
3. Compare against `docs/moboreels/phase-5/actual-online-testing-readiness-checklist.md` and ensure the artifact remains fake-only and does not imply actual online-testing approval.
4. Confirm no runtime, CI, package, test, deployment, infrastructure, secret, payment, auth, analytics, backend, database, entitlement, Facebook, video, R2/CDN, NovelHub, or asset changes are requested.
5. Confirm the final recommendation is framed as proceed/stop at gate level, not implementation authorization.
6. A reviewer can dry-run the template mentally using the canonical route and identify exactly where to record URL, screenshot, console, network, and pass/fail notes.

Suggested verification statement for a future reviewer:

```txt
PASS FOR TEMPLATE READINESS ONLY: The evidence template is sufficient to collect fake-only, non-production P0 demo evidence and contains hard-stop guards. It does not authorize actual online testing, production launch, real integrations, production services, or legal/compliance decisions.
```

## Risks and gates

| Risk | Impact | Gate / mitigation |
| --- | --- | --- |
| Demo-ready evidence is misread as launch-ready evidence. | Unauthorized exposure to real users or production systems. | Every template page must label PASS as fake-only/non-production demo evidence only. |
| “Actual online testing” language triggers production scope creep. | DNS, deploy, secrets, real ads, real analytics, or real payment could be introduced prematurely. | Use “fake-only non-production evidence template” in artifact title and require a separate user decision before actual online-testing planning. |
| Network evidence misses hard-stop service calls. | Real service integration could slip into a fake-only demo. | Require explicit network observations and fail on hard-stop categories. |
| Browser evidence is too narrow. | Mobile Safari/safe-area defects could be missed. | Recommend WebKit/Mobile Safari-equivalent manual evidence where available, but do not authorize CI/browser changes. |
| Route/context evidence is incomplete. | Post-unlock users could be returned Home or lose episode context. | Require before/after URLs for landing, lock, fake unlock, and fake pass paths. |
| CTA hierarchy drifts. | Story Pass could become primary before first lock, violating P0. | Require drawer evidence that `Unlock EP X` is primary and Story Pass is secondary at first lock. |
| Assets are uncleared. | Legal/content-rights risk. | Require explicit mock/authorized asset attestation; block on licensed/competitor/uncleared assets. |
| `unlocked=1` is reused as entitlement. | Future security/product confusion. | Template must label `unlocked=1` as fake review state only. |

Gate recommendations:

1. Requirements gate: APPROVE this packet as a docs-only requirements basis for a future fake-only evidence template.
2. Feasibility gate: PROCEED only to docs-only feasibility/architecture notes if they preserve fake-only scope and do not request runtime, CI, infrastructure, or real-service changes.
3. QA docs gate: PROCEED to a manual fake-only evidence-template draft under docs, using the acceptance criteria above.
4. Actual online-testing gate: STOP for explicit user/product/security/legal/ops decision before any real online testing, external traffic, production URL, real integration, production resource, or launch-readiness claim.

## Recommended task graph

1. DONE / current task — Requirements packet for fake-only actual-online-testing evidence template.
   - Assignee: requirements.
   - Artifact: this document.
   - Output: requirements, acceptance criteria, validation plan, gates, and recommendation.

2. Next docs-only task — Draft fake-only evidence template artifact.
   - Suggested assignee: requirements or QA docs profile.
   - Input: this packet, Phase 4G evidence template, actual-online-testing readiness checklist.
   - Output: a fillable markdown template under `docs/moboreels/phase-5/`.
   - Constraints: no runtime/CI/test/package/infrastructure changes.

3. Parallel/after docs-only task — Architecture scope gate for evidence template.
   - Suggested assignee: architect.
   - Output: confirmation that the template does not require production infra, real integrations, backend, entitlement, analytics, video, R2/CDN, NovelHub production infra, or CI changes.

4. Parallel/after docs-only task — QA review gate for evidence template.
   - Suggested assignee: QA/reviewer.
   - Output: dry-run review against the canonical P0 route and existing Phase 4G template, with PASS/FAIL/BLOCKED semantics checked.

5. Stop/decision task — Actual online-testing authorization decision.
   - Suggested assignee: human/product owner plus security/legal/ops as needed.
   - Trigger only if someone asks to move beyond fake-only non-production evidence.
   - Output: explicit approve/reject/defer for any real online testing, with named approvals and boundaries.

## Open non-blocking questions

These do not block drafting the fake-only evidence template:

1. Should the future template be a standalone Phase 5 markdown file, or an appendix to the existing Phase 4G evidence template?
2. Should the template require WebKit/Mobile Safari-equivalent manual evidence for every fake-only preview, or list it as recommended when available without CI/package changes?
3. What exact screenshot naming convention should reviewers use for landing, free-chain, first-lock, drawer-open, drawer-closed, fake-unlock-return, and fake-pass-return evidence?
4. If a preview URL is externally reachable, who is the required owner for access control, noindex, test window, and shutdown confirmation?
5. Should inert attribution params such as `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, and `utm_*` be included in this template now, or deferred to a separate P1 attribution-planning evidence template?
6. Should the evidence template include a bilingual English/Chinese boundary statement for stakeholder demos, matching the existing readiness-checklist style?

## Final recommendation

Proceed to feasibility/architecture/QA documentation gates only for a fake-only, non-production evidence-template draft. Do not proceed to actual online testing, production launch, public routing, real integrations, production resources, or legal/compliance/brand-significant decisions without explicit human approval and separate tasks.
