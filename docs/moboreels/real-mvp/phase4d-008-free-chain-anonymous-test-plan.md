# Phase 4D — Free-Chain Anonymous Test Plan (PHASE4D-008)

Verdict: APPROVE for Phase 4D planning package inclusion.

This artifact is planning/docs only. It does not authorize executable tests, code, route changes, feature wiring, real login/auth, real payment/subscription, real backend/database/API/service/persistence, Meta/Facebook APIs, production analytics, video/CDN infrastructure, deployment, DNS/cutover, secrets, or Phase 4E implementation. Phase 4E remains blocked until PHASE4D-010 returns APPROVE.

## 1. Purpose

PHASE4D-008 lifts the free-chain anonymous requirements from `phase4d-planning.md` §8.1 into a test-first plan for the acquisition-critical P0 route:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
  -> free episode chain (no login, no payment, no pass/recharge/PWA prompt)
  -> first locked episode (episode > show.freeEpisodes)
  -> Unlock Drawer opens
  -> fake unlock / fake Story Pass only after free preview
  -> /variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

The plan proves that anonymous Facebook ad users can watch every free episode before any monetization/auth surface appears, and that the first locked episode is the first allowed conversion surface. It also binds Phase 4E sequencing: the executable free-chain tests are the first Phase 4E test artifact and must land before route behavior or entitlement wiring is approved.

## 2. Evidence reviewed

| Input | Path | Evidence used |
| --- | --- | --- |
| MVP PRD | `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` | P0 route, free preview, first locked episode, Unlock Drawer, same-episode return, Watch/Episode Sheet/Show Detail requirements. |
| Prototype B secondary spec | `docs/moboreels/prototype-b-spec.md` | Secondary context only; PRD remains source of truth. |
| Phase 4D planning gate | `docs/moboreels/real-mvp/phase4d-planning.md` | §8.1 FC-01..FC-06, §8.2 locked drawer rows, §8.8 evidence-package format, §9 stop conditions and G-7. |
| PHASE4D-005 entitlement acceptance criteria | `docs/moboreels/real-mvp/phase4d-005-entitlement-fake-only-acceptance-criteria.md` | E-01/E-02/E-03/E-04/E-15, IDEM-M inheritance, `unlocked=1` UX-hint-only rule, Phase 4E hard stops. |

## 3. Binding route and authority invariants

1. The default ad landing route is `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Home, Search, Genre, and Show Detail may exist, but must not become the P0 Facebook ad landing surface.
3. EP1 and every episode with `episode <= show.freeEpisodes` must play anonymously.
4. Free episodes must not require or trigger login, fake auth, payment, Story Pass, recharge/coin purchase, PWA install, homepage redirect, detail-page redirect, production analytics, Meta/Facebook traffic, backend traffic, or entitlement grant generation.
5. The first locked episode is `episode = show.freeEpisodes + 1` unless the show fixture explicitly defines a different free boundary. The locked condition is `episode > show.freeEpisodes` and no authoritative entitlement allows the episode.
6. `unlocked=1` is UX hint only. It may show success feedback after a fake success branch, but it never grants access, never substitutes for an entitlement decision, and never repairs lost episode context.
7. Paid CTA / fake-auth behavior may appear only after the user reaches a locked episode. It must never block free preview.
8. Success, duplicate success, pass success, cancel, failure, restore, and revoke paths must preserve same-show and same-episode return. The allowed success shape is `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.

## 4. Phase 4E test-first sequencing

Phase 4E must implement this plan in the following order before any feature wiring can be approved:

1. Add executable FC test fixtures for at least one canonical show with:
   - stable `showId`;
   - `freeEpisodes >= 2`;
   - `lockedEpisode = freeEpisodes + 1`;
   - deterministic episode titles/states;
   - mock balance/cost values for the locked episode only.
2. Add failing executable tests for FC-01..FC-06 and LFC-01..LFC-10 below.
3. Add static dependency and network-capture harness checks that can prove no banned provider/backend calls happen during the free chain.
4. Only after the tests exist may fake-only implementation change route/watch behavior.
5. The same Phase 4E card may be reviewed only after all non-deferred executable tests pass, artifacts are attached, and no hard stop is crossed.

Phase 4E must not begin before PHASE4D-010 APPROVE. This document does not create code, tests, routes, or harnesses.

## 5. Free-chain anonymous test matrix

| ID | Scenario | Fixture / setup | Required assertions | Evidence artifact |
| --- | --- | --- | --- | --- |
| FC-01 | Facebook ad route loads EP1 | Anonymous browser context, empty auth/payment/storage state, route `/variant-b/watch/[showId]?episode=1&source=facebook` | Watch page opens directly on EP1; no Home/Search/Show Detail redirect; no login, PWA, payment, recharge, Story Pass, or pass prompt; no `/fake-auth/*` or `/fake-payment/*`; current URL preserves `episode=1` and `source=facebook`. | Test trace plus route snapshot. |
| FC-02 | Continue through every free episode anonymously | Same context; manually advance EP1..EP(`freeEpisodes`) | Each free episode plays or reaches the expected playable free state; each continuation preserves show context and correct episode number; no auth/payment/pass/recharge/PWA prompt appears; no idempotency key generated. | Step log with URL after every episode. |
| FC-03 | Reload at any free episode | For every free episode URL `/variant-b/watch/[showId]?episode=N&source=facebook` | Reload returns to the same free episode; no login/auth wall; playback/free state is restored from URL; no Home/Detail redirect; no fake entitlement needed. | Reload trace per free episode. |
| FC-04 | Episode Sheet during free chain | Open Episode Sheet from each free episode | Sheet opens without auth; current episode highlighted; all free episodes are directly playable; locked episodes visibly locked with price/unlock condition; opening the sheet does not trigger `/fake-auth/*` or `/fake-payment/*`. | Episode Sheet screenshot/DOM snapshot. |
| FC-05 | Manual URL edit to another free episode after prior fake-auth detour | Browser may contain fake-auth return params/history, but target URL is a free episode | Free episode still plays anonymously; stale callback state and `unlocked=1` do not affect authority; no login required; no fake auth/payment route touched. | URL-edit trace and authority/debug snapshot. |
| FC-06 | Network boundary during free chain | Capture network from initial route through last free episode | Zero calls to backend/API, auth provider, payment provider, Meta/Facebook, production analytics, video/CDN pipeline, public webhooks, or entitlement service; only local/static/mock assets allowed. | HAR or Playwright network log plus allow/deny summary. |

## 6. Locked transition and Unlock Drawer test matrix

These rows start at the first locked episode after FC-02 succeeds. They prove that monetization/auth surfaces are deferred until after free preview.

| ID | Scenario | Fixture / setup | Required assertions | Evidence artifact |
| --- | --- | --- | --- | --- |
| LFC-01 | Transition from last free episode to first locked episode | Anonymous user completes EP(`freeEpisodes`) and taps Continue to EP(`freeEpisodes + 1`) | URL remains `/variant-b/watch/[showId]?episode=[lockedEpisode]`; Watch page enters locked state; Unlock Drawer auto-opens; no Home/Pass/Detail redirect. | Step trace and locked screenshot. |
| LFC-02 | Locked state is distinct from playback error | First locked episode, no entitlement | Locked copy and CTA are visible; no retry/network-error framing; playback progress does not fake advance; provider is not mounted with a playable source if a provider exists. | DOM/screenshot comparison artifact. |
| LFC-03 | Unlock Drawer content | First locked episode | Drawer shows current story hook/title, drama title, episode number, mock balance, mock cost, primary `Unlock EP X`, secondary `Get Story Pass`, tertiary `Maybe later`, and copy that unlock returns to this episode. | Drawer DOM snapshot. |
| LFC-04 | Maybe later closes drawer and keeps locked episode | Tap `Maybe later` or close | Drawer closes; user remains on the same locked episode URL; locked state remains visible; no free playback begins; no auth/payment route starts. | Before/after URL and state snapshot. |
| LFC-05 | Tapping locked playback area reopens drawer | After LFC-04 | Tapping locked area reopens the same drawer for the same episode; no episode loss; no Home/Pass redirect. | Interaction trace. |
| LFC-06 | Episode Sheet states at locked boundary | Open Episode Sheet from locked episode | Current locked episode highlighted; free episodes shown playable/free; locked episodes shown locked with price/unlock condition; current/free/locked states are visually and semantically distinct. | Episode Sheet DOM/screenshot. |
| LFC-07 | Locked episode click from Episode Sheet | From sheet, click another locked episode | Sheet closes; Watch URL changes to that locked episode; Unlock Drawer opens for the clicked episode; drawer copy/CTA episode number matches clicked episode. | Interaction trace with URL/drawer snapshot. |
| LFC-08 | Free episode click from Episode Sheet after locked state | From sheet, click a free episode | Free episode opens and plays anonymously; no auth/payment/pass prompt; no stale drawer remains open unless explicitly user-opened later. | Interaction trace. |
| LFC-09 | Show Detail round trip does not hijack P0 funnel | From Watch detail entry, visit Show Detail and tap back/watch for current show/episode | Show Detail is auxiliary only; return preserves show and episode context; it must not become the ad landing page or replace same-episode locked return. | Round-trip URL trace. |
| LFC-10 | Safe-area/mobile viewport check | 390 x 844 viewport on EP1, last free episode, locked state, drawer, and sheet | Primary controls and drawer actions are visible/tappable inside safe area; no CTA hidden below viewport; no overlap prevents `Unlock EP X`, `Get Story Pass`, or `Maybe later`. | 390 x 844 screenshot set. |

## 7. Paid CTA and fake-auth sequencing tests

Paid CTA tests are allowed only after the free-chain rows prove the anonymous preview. Phase 4E must keep these separate from free-chain authority.

| ID | Scenario | Required assertions |
| --- | --- | --- |
| CTA-01 | Tap `Unlock EP X` from first locked drawer | Fake auth/payment may start only now; return target includes the same `showId` and locked `episode`; no production auth/payment provider is contacted. |
| CTA-02 | Tap `Get Story Pass` from first locked drawer | Route/context preserves current story and locked episode; pass remains show-scoped for P0; no generic catalog pass redirect. |
| CTA-03 | Mock single-episode unlock success | Returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`; success feedback may display; playback/playable state is based on fake entitlement authority, not URL flag alone. |
| CTA-04 | Mock Story Pass success | Returns to the same locked episode with `unlocked=1`; pass authority is show-scoped; no Home/Pass page stay; no episode loss. |
| CTA-05 | Cancel/failure from fake auth/payment | Returns to the same locked episode without `unlocked=1`; drawer/locked state can be shown again; no grant, no debit, no success event. |
| CTA-06 | Duplicate success / retry | Uses PHASE4D-004 idempotency obligations; same episode return remains byte-equivalent where required; no second grant/debit/unmarked success event. |

## 8. Entitlement alignment and `unlocked=1` negative tests

Phase 4E must cite PHASE4D-005 and include these assertions in or near the FC/LFC test bundle:

| ID | PHASE4D-005 alignment | Required assertion |
| --- | --- | --- |
| ENT-FC-01 | E-01 Free EP anonymous | Free episode allows via `free_episode` authority with anonymous user. |
| ENT-FC-02 | E-02 Free EP with forged `unlocked=1` | Adding `unlocked=1` to a free episode does not change the authority decision except optional debug/UX fields. |
| ENT-FC-03 | E-03 Locked EP anonymous | First locked episode denies via `anonymous_locked_episode / none` before CTA; Unlock Drawer is UX response only. |
| ENT-FC-04 | E-04 Locked EP forged flag | `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1` without a matching fake entitlement still denies access; URL flag is not authority. |
| ENT-FC-05 | E-15 Free chain anonymous | EP1..EP(`freeEpisodes`) generate zero fake auth, zero fake payment, zero idempotency generation, and zero backend/analytics/Facebook traffic. |

## 9. Required evidence package for Phase 4E

A Phase 4E implementation card that claims this plan must attach all of the following:

1. Executable test file names and the test IDs they cover.
2. A fixture dump for canonical show, free episode count, locked episode, mock balance/cost, fake user state, and initial storage/cookie state.
3. URL trace from ad route through every free episode, first locked episode, drawer close/reopen, CTA success/cancel/failure, and same-episode return.
4. 390 x 844 screenshots or DOM snapshots for EP1, last free episode, first locked state, Unlock Drawer, Episode Sheet current/free/locked states, Show Detail round trip, and `unlocked=1` return.
5. Network log proving zero backend/API/auth-provider/payment-provider/Meta/Facebook/production analytics/video-CDN calls during free chain, and no real provider calls after paid CTA.
6. Static dependency/import scan showing no banned SDK/runtime was introduced.
7. Assertion output proving `unlocked=1` is not used as access authority.
8. IDEM-M and relevant IDEM-D/IDEM-P references from PHASE4D-004 for missing fake user, free-chain no-auth/no-payment, duplicate success, and return-target preservation.
9. Explicit statement that PHASE4D-010 APPROVE existed before Phase 4E implementation began.

## 10. Phase 4E executable test obligations

Phase 4E must create executable tests for:

- FC-01..FC-06 before any other Phase 4E test artifact.
- LFC-01..LFC-10 for first locked episode, drawer, Episode Sheet, Show Detail round trip, and 390 x 844 safe-area behavior.
- CTA-01..CTA-06 for paid CTA/fake-auth sequencing after free preview only.
- ENT-FC-01..ENT-FC-05 proving free/locked entitlement authority and `unlocked=1` non-authority.
- A static dependency/import check for banned production dependencies.
- A network egress check for banned provider/backend calls.

Reviewer approval is not allowed until these tests pass against deterministic fake-only fixtures and the evidence package is complete.

## 11. Hard stops

Block immediately and request explicit approval if any Phase 4E or follow-up card proposes or discovers:

- login, account capture, fake auth, payment, Story Pass, recharge, coin-pack, marketing opt-in, or PWA prompt before the user reaches the first locked episode;
- returning success, duplicate success, cancel, failure, restore, or revoke to Home, Search, Show Detail, generic Pass, or catalog instead of the same locked episode;
- treating `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, history state, query params, or callback-only client state as authoritative access;
- real backend, database, API route, service, persistence, queue, ORM, migration, wallet, ledger, entitlement service, audit store, or public webhook;
- real auth/OAuth/OIDC/SAML/OTP/email/SMS/social provider, real account system, session store, credential store, or secret;
- real payment/subscription/Stripe/app-store/IAP/receipt/refund/chargeback/tax/billing provider, webhook, SDK, or secret;
- real Meta Pixel/CAPI/Facebook SDK/Graph/Marketing API or production analytics vendor;
- real video player/provider, CDN/storage/video ingest/transcoding/DRM/captioning/signed playback URL pipeline;
- production deployment, DNS/cutover, production secrets, or real-user traffic;
- licensed, competitor, scraped, user-uploaded-without-rights, or otherwise uncleared content assets;
- final legal/payment/subscription/refund/cancellation/tax/privacy copy;
- catalog-scoped Story Pass behavior in P0;
- expiry/E-11 behavior under D1 non-expiring Story Pass;
- self-serve refund/revoke UI in P0;
- Phase 4E implementation before PHASE4D-010 APPROVE.

## 12. Reviewer checklist

A reviewer can APPROVE PHASE4D-008 when all statements below are true:

- The plan is documentation-only and adds no executable tests, code, routes, or provider dependencies.
- FC-01..FC-06 are preserved and expanded into test-first Phase 4E obligations.
- Free episodes are explicitly anonymous and free of login/payment/pass/recharge/PWA prompts.
- Paid CTA/fake-auth behavior is explicitly deferred until the first locked episode after free preview.
- First locked episode, locked state, Unlock Drawer, drawer close/reopen, and Episode Sheet current/free/locked behavior are covered.
- Same-episode return is preserved for mock unlock and Story Pass success, with cancel/failure/duplicate also returning to the locked episode as applicable.
- `unlocked=1` is repeatedly bounded as UX hint only and never access authority.
- Phase 4E executable test obligations, evidence package, static scan, network proof, and hard stops are explicit.

## 13. Safe next step

Proceed to PHASE4D-010 reviewer preparation after PHASE4D-002..PHASE4D-009 are approved or explicitly deferred according to `phase4d-planning.md` §9. Do not open Phase 4E implementation until PHASE4D-010 returns APPROVE.
