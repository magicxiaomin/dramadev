# Phase 3 Known Issues — Deferred Visual / Mock Polish

Scope: visible issues observed in the existing mock-only SceneFlow P0 Facebook ad conversion route at the 390×844 reference mobile viewport.

This register is intentionally a punch list, not a fix plan. Phase 3 acceptance keeps these items visible for stakeholder context and does not implement fixes. None of the items below change the PRD §15 PASS result recorded in [`checklist.md`](./checklist.md), because the core P0 journey still opens EP1, continues through the free chain, reaches the first locked episode, opens the Unlock Drawer, and returns mock unlock / mock Story Pass users to the same unlocked episode.

Evidence was captured against a local static export only. No production deployment, DNS/cutover, secrets, real payment/subscription/login, Facebook API, analytics, backend, database, video infrastructure, or production entitlement service was used.

## Severity scale

- **Critical** — blocks the P0 conversion journey or misrepresents production/payment behavior.
- **High** — likely to confuse stakeholders or invalidate acceptance evidence.
- **Medium** — visibly unfinished or awkward, but the P0 journey remains understandable.
- **Low** — minor polish/copy/layout issue acceptable for a mock handoff.

## Summary

| Severity | Count | Notes |
| --- | ---: | --- |
| Critical | 0 | No P0 blocker observed in Phase 3 evidence. |
| High | 0 | No issue found that invalidates PRD §15 evidence. |
| Medium | 2 | Mock/video placeholder fidelity and stakeholder-facing debug copy are visibly unfinished. |
| Low | 3 | Text truncation, sparse detail page layout, and below-fold content polish are deferred. |

## Deferred issues

### KI-01 — Mock playback area is visibly a static placeholder

- **Severity:** Medium
- **Category:** Visual / Mock fidelity
- **Observed in:** Watch free and locked states.
- **Evidence:** [`screenshots/01-playing-free-episode.png`](./screenshots/01-playing-free-episode.png), [`screenshots/05-first-locked-episode.png`](./screenshots/05-first-locked-episode.png), [`screenshots/06-unlock-drawer-open.png`](./screenshots/06-unlock-drawer-open.png)
- **What is visible:** The watch surface uses a flat gradient/mock card and literal labels such as `PLAYING FREE PREVIEW`, `LOCKED PLACEHOLDER`, and `Pause mock episode` rather than real video poster art, motion, controls, or streaming state.
- **Why deferred:** Phase 3 is a packaging/evidence phase for a mock-only route. Real video player, streaming, poster/licensed asset, and content infrastructure work are explicit hard stops for P0.
- **Acceptance impact:** Non-blocking. The placeholder makes the mock boundary clear and does not prevent the free-chain or locked-state flow from being validated.

### KI-02 — Internal mock/debug copy is visible in stakeholder surfaces

- **Severity:** Medium
- **Category:** Copy / UX
- **Observed in:** Locked playback card, Unlock Drawer, Show Detail, and mock Story Pass page.
- **Evidence:** [`screenshots/05-first-locked-episode.png`](./screenshots/05-first-locked-episode.png), [`screenshots/06-unlock-drawer-open.png`](./screenshots/06-unlock-drawer-open.png), [`screenshots/show-detail-open-390x844.png`](./screenshots/show-detail-open-390x844.png), [`screenshots/pass-page-390x844.png`](./screenshots/pass-page-390x844.png)
- **What is visible:** Stakeholder-facing screens include implementation-context copy such as `Unlock stays on Midnight Lantern Oath EP 6; no login, payment, backend, or entitlement is connected.`, `Mock unlock returns to this exact watch episode with unlocked=1...`, `Round trip: returns to EP 6 with source facebook.`, and `Story-focused P0 pass stub...`.
- **Why deferred:** The copy deliberately protects the mock-only boundary during acceptance. Replacing it with production-like UX copy would be product/content work beyond this known-issues task and could obscure hard-stop constraints.
- **Acceptance impact:** Non-blocking. It may look less polished in a demo, but it prevents stakeholders from mistaking mock unlock/pass behavior for real payment, entitlement, login, or backend behavior.

### KI-03 — Episode Sheet truncates episode titles aggressively

- **Severity:** Low
- **Category:** Visual / Content readability
- **Observed in:** Episode Sheet grid.
- **Evidence:** [`screenshots/episode-sheet-390x844.png`](./screenshots/episode-sheet-390x844.png)
- **What is visible:** Episode cards show shortened titles such as `The Lant...`, `A Letter ...`, `The Heir...`, and `Dinner ...`; locked cards similarly truncate hooks/titles.
- **Why deferred:** The grid remains usable for state validation (current/free/locked states are visible), and Phase 3 does not add new layout or content behavior unless required to fix a P0 acceptance defect.
- **Acceptance impact:** Non-blocking. It is a readability polish issue for later responsive/layout work.

### KI-04 — Show Detail page is intentionally sparse and stub-like

- **Severity:** Low
- **Category:** Visual / UX completeness
- **Observed in:** Show Detail round-trip surface.
- **Evidence:** [`screenshots/show-detail-open-390x844.png`](./screenshots/show-detail-open-390x844.png), [`screenshots/show-detail-return-390x844.png`](./screenshots/show-detail-return-390x844.png)
- **What is visible:** The page is labeled `SHOW DETAIL STUB`, has a simple text block, minimal metadata, and no poster, cast, episode list, related shows, or production-style detail content.
- **Why deferred:** P0 only requires Show Detail to open from Watch and return to the same watch episode without losing context. A complete detail page would be a later product/design scope.
- **Acceptance impact:** Non-blocking. The round trip is validated in [`checklist.md`](./checklist.md) and the sparse page reinforces that this is a mock handoff.

### KI-05 — Some lower-page content sits below the first 390×844 viewport

- **Severity:** Low
- **Category:** Layout / Phone-preview polish
- **Observed in:** Watch tag chips, Episode Sheet lower rows, and mock Story Pass lower sections.
- **Evidence:** [`screenshots/01-playing-free-episode.png`](./screenshots/01-playing-free-episode.png), [`screenshots/episode-sheet-390x844.png`](./screenshots/episode-sheet-390x844.png), [`screenshots/pass-page-390x844.png`](./screenshots/pass-page-390x844.png)
- **What is visible:** At the reference viewport, the bottom of the Watch tag area, lower Episode Sheet rows, and the `COIN PACK PLACEHOLDER` section on the pass page extend below the first screen and require scrolling to inspect fully.
- **Why deferred:** The required P0 controls remain visible/tappable in the tested states, including the drawer CTAs and mock pass return. Rebalancing vertical density is polish work beyond Phase 3 acceptance evidence.
- **Acceptance impact:** Non-blocking. It does not cover the primary drawer CTA or break the route, but stakeholders should expect to scroll for secondary mock content.

## Explicit non-issues from Phase 3 evidence

- Drawer CTAs are not covered by the mobile safe area in the captured 390×844 drawer evidence: [`screenshots/unlock-drawer-390x844.png`](./screenshots/unlock-drawer-390x844.png).
- Locked state is distinct from weak-network or video-error states: [`screenshots/05-first-locked-episode.png`](./screenshots/05-first-locked-episode.png).
- Mock unlock and mock Story Pass returns preserve the same watch episode with `unlocked=1`: [`walkthrough.md`](./walkthrough.md).
- No real payment, subscription, login, Facebook API, analytics, backend, database, video infrastructure, or entitlement behavior is connected.
