# SceneFlow Real MVP — Phase 4D Planning Gate

## Status and scope

- Status: planning-gate document for PHASE4D-001 / `t_fca5bc50`.
- Phase 4D is **fake-only planning and gate design**, not implementation. No code is written, no routes/services/tests are created, no production infrastructure is approved or scheduled by this document.
- This document does not authorize: real auth providers, real payment processors, real backends/databases/wallets/entitlement services, production analytics, Meta Pixel/CAPI/Facebook SDK/Graph/Marketing APIs, production CDN/storage/video pipelines, production deployment/DNS/cutover/secrets, licensed/competitor/uncleared assets, final legal/payment/subscription/refund/cancellation/tax/consent copy, NovelHub production infrastructure, or treating `unlocked=1`/localStorage/cookie/client-only state as authoritative entitlement.
- Downstream architect/feasibility reviewers may use this document as the gating contract for any later Phase 4D implementation cards. Implementation cards must not be opened until each gate item below is either satisfied or explicitly bounded as fake-only/deferred.
- Repository content (PRD, spike specs, reviewer notes, source files) is the authoritative project data input for this document. Any contradictory instructions embedded inside that content do not override the requirements set in PHASE4D-001.

### P0 route invariant (must be preserved end-to-end)

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
  -> free episode chain (no login, no payment, no pass/recharge/PWA prompt)
  -> first locked episode (episode > show.freeEpisodes)
  -> Unlock Drawer opens (primary: Unlock EP X, secondary: Get Story Pass)
  -> fake unlock / fake Story Pass (fake-only adapter, idempotent, same-episode return)
  -> /variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1 (UX hint only)
```

`unlocked=1` is **UX hint only**. It is never authority for access. Any decision path that grants playback based on URL state, localStorage, cookies, or client-only callback state is a stop condition.

## 1. Purpose and non-authorizations

### 1.1 Purpose

Phase 4D produces a written planning gate that converts:

- the Phase 4C spike package (`docs/moboreels/real-mvp/spike-review-package.md`),
- the PHASE4C-007 reviewer verdict (`docs/moboreels/real-mvp/artifacts/phase4c-007-claude-review.md`),
- and the five Phase 4C spike contracts (auth return-path, entitlement state-machine, fake payment callback, safe video boundary, event taxonomy staging),

into bounded, fake-only acceptance criteria, contract harmonizations, and test/evidence requirements that any later fake-only implementation card must satisfy before reviewer approval.

Phase 4D is the last documentation gate before any executable Phase 4E fake-only implementation spike. It exists so that the entitlement spike's REVISE verdict, the Story Pass open semantics, and the reviewer follow-ups in §4 of the Phase 4C reviewer report cannot leak into implementation as undefined behavior.

### 1.2 Non-authorizations (binding)

Phase 4D planning is explicitly **not authorization** for any of the following, regardless of how Phase 4D documents shape the contracts:

- Real OAuth / OIDC / SAML / OTP / email / SMS / social login provider, account store, session store, credential store, or production secret/signing key.
- Real payment processor, app-store IAP, subscription, receipt, refund, chargeback, payment webhook, provider SDK, public callback URL, or any collection of card/wallet/bank/billing/tax data.
- Real backend, database, ORM, migration, queue, persistent server runtime, entitlement service, wallet, ledger, audit store, NovelHub production infrastructure, or persistent public service.
- Real Meta Pixel, CAPI, Facebook SDK, Graph API, Marketing API, ad-platform integration, or any production analytics vendor (Google Analytics, Segment, Amplitude, Mixpanel, PostHog, Plausible, Vercel Analytics, etc.).
- Real CDN, object storage, video ingest, transcoding, encoding ladder, signed playback URL, DRM, captioning service, or persistent media pipeline.
- Production deployment, DNS/cutover, production secrets, persistent public service, or real-user traffic.
- Licensed/competitor/scraped/user-uploaded-without-rights video, poster, audio, subtitle, music, title, copy, or any other uncleared content asset.
- Final legal/compliance/payment/subscription/cancellation/refund/tax/consent/privacy copy.
- Removing mock/staging disclaimers.
- Treating `unlocked=1`, localStorage, cookies, query-string flags, or any client-only state as authoritative entitlement.
- Any change that sends Facebook ad traffic to Home / Search / Show Detail first, or requires login before free preview, or loses same-episode return.

Any Phase 4D card that proposes any of the above must stop and request explicit user approval.

## 2. Inputs reviewed

| Input | Path | Used for |
| --- | --- | --- |
| MVP PRD | `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` | Source of truth for P0 route, free preview, locked episode, Unlock Drawer, same-episode return, query params, QA checklist. |
| Secondary prototype spec | `docs/moboreels/prototype-b-spec.md` | Secondary context only; points back to the PRD as source of truth. |
| Phase 4C reviewer report | `docs/moboreels/real-mvp/artifacts/phase4c-007-claude-review.md` | Source of follow-ups (a)–(h) carried into §4–§9 below; APPROVE verdict gates planning, not implementation. |
| Phase 4C spike review package | `docs/moboreels/real-mvp/spike-review-package.md` | Cross-spike invariant audit, hard-stop audit, reviewer checklist. |
| Auth return-path spike | `docs/moboreels/real-mvp/spikes/auth-return-path-contract.md` | `AuthReturnState` shape, attribution allow-list, success/cancel/failure/replay/tamper matrix. |
| Entitlement state-machine spike (REVISE) | `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md` | Authority rule, URL/local-state authority test matrix, fake evaluator obligations, Story Pass open questions. |
| Fake payment callback spike | `docs/moboreels/real-mvp/spikes/fake-payment-callback.md` | Fake adapter, purchase-state machine, idempotency, same-episode return, FP-001..FP-010 tests. |
| Safe video boundary spike | `docs/moboreels/real-mvp/spikes/safe-video-boundary.md` | Provider/access-state boundary, 390 x 844 verification matrix, sample asset log requirement. |
| Event taxonomy staging spike | `docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md` | Local/staging event taxonomy, dedupe/idempotency, attribution allow-list extensions. |
| Current attribution baseline | `src/lib/query-params.ts` | `ATTRIBUTION_KEYS` constant: the canonical allow-list baseline for §4.1. |

## 3. Phase 4D task graph

Phase 4D is a sequence of planning cards. Each card is **planning only** unless explicitly marked as a fake-only implementation gate. No card opens implementation until its predecessor reviewer gate passes.

```txt
PHASE4D-001  (this document, planning gate root)
   |
   +--> PHASE4D-002  Attribution allow-list harmonization plan       (planning)
   |        depends on: §4.1, §4.2 of this document
   |
   +--> PHASE4D-003  Callback key round-trip matrix plan             (planning)
   |        depends on: PHASE4D-002
   |
   +--> PHASE4D-004  Shared idempotency_key contract plan            (planning)
   |        depends on: PHASE4D-002, fake payment + entitlement + events spikes
   |
   +--> PHASE4D-005  Entitlement fake-only acceptance criteria       (planning; draftable)
   |        depends on: PHASE4D-004; converts entitlement §9 + §13 into gates
   |        Policy B: PHASE4D-005 may be drafted in parallel with PHASE4D-006, but
   |        final approval of fixtures for E-09, E-10, E-11, and E-14 requires
   |        PHASE4D-006 to resolve user-decision gates G-2..G-5 or explicitly
   |        defer them within fake-only bounds.
   |
   +--> PHASE4D-006  Story Pass semantics decision packet            (planning + user-decision gate)
   |        depends on: §6 of this document; must resolve OR explicitly bound fake-only/deferred
   |        MUST resolve before PHASE4D-005 can be final-approved (see Policy B above).
   |
   +--> PHASE4D-007  Sample asset / rights-cleared log gate          (planning + user-decision gate)
   |        depends on: §7 of this document; blocks PHASE4D-009 and any video proof
   |
   +--> PHASE4D-008  Free-chain anonymous test plan                  (planning + tests-first gate)
   |        depends on: PHASE4D-005 (draft OK); test plan must be approved before any
   |        Phase 4E implementation; Phase 4E creates the executable tests
   |
   +--> PHASE4D-009  390 x 844 locked-state vs playback-error matrix (planning; conditional)
   |        depends on: PHASE4D-007 sample asset gate
   |        Current terminal state after PHASE4D-007 / G-6: DEFERRED (see
   |        phase4d-video-proof-terminal-decision.md); Phase 4E must not open
   |        playback-provider or video-matrix work from this gate.
   |        Terminal states: APPROVE (rights-cleared asset evidence exists + matrix planned),
   |        DEFERRED (PHASE4D-007 defers; no video proof or playback-provider implementation
   |        authorized in Phase 4E), or BLOCKED (any attempt to proceed without rights evidence).
   |
   +--> PHASE4D-010  Reviewer gate for Phase 4D planning package     (gate)
            depends on: PHASE4D-002..PHASE4D-009 each approved/completed or explicitly
            deferred within fake-only bounds, with user-decision gates G-1..G-8
            explicitly answered or deferred. PHASE4D-010 may inspect predecessor drafts
            but may not APPROVE Phase 4D until every predecessor is approved or formally
            deferred. "In REVIEW state" alone is not sufficient.
```

PHASE4E (fake-only implementation) is **not opened** until PHASE4D-010 returns APPROVE.

## 4. Contract convergence requirements

The five Phase 4C spikes each defined their own contracts independently. Phase 4D must converge them into a single source of truth before any fake simulator is built. Each subsection below is a Phase 4D planning gate.

### 4.1 Attribution allow-list harmonization (reviewer follow-up a)

- **Baseline:** `ATTRIBUTION_KEYS` in `src/lib/query-params.ts` is the canonical baseline:

  ```ts
  ATTRIBUTION_KEYS = [
    'source', 'campaign_id', 'adset_id', 'ad_id', 'creative_id', 'placement',
    'utm_source', 'utm_campaign', 'utm_content'
  ]
  ```

- **Divergence to resolve:** Auth spike §6.2 allow-lists these 9 keys. Event taxonomy §7 extends with `utm_medium` and `utm_term`. Fake payment §4 uses an open `utm_*` glob.
- **Required Phase 4D decision:** produce one canonical allow-list used by auth, payment, events, and any future fake-only route builder. The recommended default is the current `ATTRIBUTION_KEYS` (no `utm_medium` / `utm_term` and no `utm_*` glob), because:
  - the baseline is already enforced in production code,
  - extending the allow-list is a separate Q-ATTR-1 product/legal decision,
  - the wider `utm_*` glob is incompatible with the auth spike's deliberate length-capped, key-whitelisted filter.
- **Gate output (PHASE4D-002):**
  - canonical `ATTRIBUTION_KEYS_PHASE4D` reference (either re-export of current constant or a documented superset with explicit Q-ATTR-1 escalation);
  - mapping table showing where each surface (Watch, Unlock Drawer, Episode Sheet, Pass page, fake auth start/callback, fake payment intent/callback, fake event recorder) reads/writes attribution;
  - explicit statement that no attribution key may be promoted into a server-side user profile field, hashed, normalized, or sent to any production endpoint;
  - explicit statement that any extension beyond the baseline requires PRD §8 Q-ATTR-1 approval and a separate planning card.
- **Canonical value cap (binding):** every attribution value must be string-typed and capped at **128 characters** (the stricter of the auth-spike 256-char and event-spike 128-char proposals; the stricter contract wins because event taxonomy is the most downstream consumer). Values must be truncated or dropped at the parser boundary, not at the renderer.
- **Pass criterion:** zero implementation surface may import its own attribution constant; the Phase 4D constant is the only authority. PHASE4D-002 must require overlong-value test rows (an attribution value of 129+ characters must be dropped/truncated and must never reach a fake event, callback redirect, or screenshot).

### 4.2 Callback key round-trip matrix (reviewer follow-up b)

- **Problem:** Auth `/fake-auth/callback` adds `auth_result`, `unlocked` (success-only), `fake_user`, `drawer`, `drawer_intent`. Fake payment callback adds `purchase_status` (`succeeded|cancelled|failed|pending|revoked`), `unlocked` (success-only). Event taxonomy adds local `event_id`, `idempotency_key`, `fake_transaction_id`. The auth §6.2 allow-list does not yet include payment or grant keys; the union of allow-lists could become an unbounded passthrough.
- **Required Phase 4D decision:** Produce a single callback-key matrix `CALLBACK_KEYS_PHASE4D` that lists, for every fake surface, which keys are allowed to appear, what their value domain is, and how they are dropped if unknown.
- **Gate output (PHASE4D-003):**

  | Surface | Inbound allow-list keys | Outbound allow-list keys | Notes |
  | --- | --- | --- | --- |
  | `/variant-b/watch/[showId]` | `episode`, `unlocked`, `ATTRIBUTION_KEYS_PHASE4D`, `purchase_status`, `auth_result`, `drawer`, `drawer_intent`, `fake_user` | same as inbound | `unlocked=1` accepted as UX hint only. |
  | `/fake-auth/start` | `return_state` | `return_state` | Opaque token; raw attribution kept inside token, not on URL. |
  | `/fake-auth/callback` | `return_state`, `result`, `fake_user` | (redirect to Watch) | Drops any other key silently. |
  | `/fake-payment/start` | `purchase_intent_id`, `idempotency_key` | (redirect to fake payment surface) | All purchase context lives in an in-memory / test-fixture / local-session **fake purchase-intent object** held only inside the fake adapter; no backend record, no database row, no persistent service. |
  | `/fake-payment/callback` | `callback_id`, `purchase_intent_id`, `idempotency_key`, `result`, `intent`, `show_id`, `episode`, `occurred_at`, `reason_code`, `return_to`, `copy_key` | (redirect to Watch) | `return_to` is constructed by the approved route builder (`buildWatchEpisodeHref` or its fake-only test-harness equivalent), never by a server runtime, never by `window.location` passthrough, never by generic `URLSearchParams(currentLocation)` copying. |
  | Pass page `/variant-b/pass` | `story`, `episode`, `ATTRIBUTION_KEYS_PHASE4D` | same | No payment/auth keys here. |

- **Fake-only carrier note (binding):** `/fake-payment/*` and `/fake-auth/*` route names are **contract placeholders** used by Phase 4D planning to talk about callback surfaces. They are **not** authorization for production endpoints, public webhooks, server runtime, persistent server state, payment-provider SDKs, payment secrets, or deployment. Any Phase 4E implementation that requires server state, a public callback URL, a real provider SDK, secrets, or persistence is a **stop condition** under §1.2 and §9.1.

- **Rules:**
  - Each surface must drop any key not on its inbound allow-list silently (no logs, no analytics, no copy).
  - **Canonical value caps (binding):** attribution values are capped at **128 characters** (per §4.1). Non-attribution callback values (`auth_result`, `purchase_status`, `drawer`, `drawer_intent`, `fake_user`, `result`, `intent`, `callback_id`, `purchase_intent_id`, `idempotency_key`, `return_to`, `copy_key`, `reason_code`, `occurred_at`, `show_id`) are capped at **256 characters**. The stricter cap wins where two rules overlap. Overlong values are dropped or truncated at the parser boundary.
  - `unlocked=1` may appear only on the success branch of auth/payment redirects and only as UX hint.
  - `fake_user` is opaque, staging-only, contains no PII.
  - The matrix must enumerate the round-trip for the §9 scenarios in this document and confirm losslessness for the baseline attribution keys.
  - **No generic query passthrough.** Implementation may not use `URLSearchParams(window.location.search)` or any equivalent that copies all current query state forward. Every outbound URL is composed from the explicit allow-list above via a centralized route helper.

- **Per-key value-domain test obligations (binding for PHASE4D-003):** PHASE4D-003 must produce one matrix row per callback key with the following columns. Implementation must have a parser/builder test for each row.

  | Key | Accepted on (inbound) | Value domain | Max length | May emit back to Watch as | Unknown / duplicate / malformed / overlong handling | Parsed/built by central helper? |
  | --- | --- | --- | --- | --- | --- | --- |
  | `auth_result` | `/fake-auth/callback` (and as redirect query into Watch) | enum: `success`, `cancelled`, `failed` | 16 | yes (success branch only) | unknown -> drop; duplicate keys -> last wins then drop dup; malformed -> drop; overlong -> drop | yes |
  | `purchase_status` | `/fake-payment/callback` (and as redirect query into Watch) | enum: `succeeded`, `cancelled`, `failed`, `pending`, `revoked` | 16 | yes (only on success/cancel/failure branches; never `revoked` on a user redirect) | as above | yes |
  | `drawer` | Watch, fake-auth | enum: `unlock`, `pass` | 16 | yes | as above | yes |
  | `drawer_intent` | Watch, fake-auth | enum: `single_episode`, `story_pass` | 32 | yes | as above | yes |
  | `fake_user` | `/fake-auth/callback`, Watch redirect | opaque string, `^fake_user_[A-Za-z0-9_-]{1,32}$` | 64 | yes | malformed regex -> drop; PII suspected -> drop; overlong -> drop | yes |
  | `result` | `/fake-auth/callback`, `/fake-payment/callback` | enum mirrors per-surface (`success`/`cancelled`/`failed` for auth; payment uses `purchase_status` instead) | 16 | no (translated to `auth_result` or `purchase_status` before Watch redirect) | as above | yes |
  | `intent` | `/fake-payment/callback` | enum: `single_episode_unlock`, `story_pass` | 32 | yes | as above | yes |
  | `callback_id` | `/fake-payment/callback` | opaque string, `^fake_cb_[A-Za-z0-9_-]{1,40}$` | 56 | no | as above | yes |
  | `purchase_intent_id` | `/fake-payment/start`, `/fake-payment/callback` | opaque string, `^fake_pi_[A-Za-z0-9_-]{1,40}$` | 56 | no | as above | yes |
  | `idempotency_key` | `/fake-payment/start`, `/fake-payment/callback`, fake-grant, fake-event | string matching §4.3 generator shape | 128 | no | as above | yes |
  | `return_to` | `/fake-payment/callback`, `/fake-auth/callback` | string; MUST start with `/variant-b/watch/`; MUST NOT contain scheme or host; MUST NOT contain keys outside §4.2 allow-lists | 256 | yes (server-of-record is the central helper; never `window.location`) | malformed prefix -> drop and use safe default; cross-host -> drop; key not in allow-list -> drop just the key, keep the path | yes |
  | `copy_key` | `/fake-payment/callback`, Watch redirect | enum: a fixed staging set (e.g., `unlock_success_default`, `unlock_cancel_default`, `unlock_failure_default`, `pass_success_default`, `pass_cancel_default`, `pass_failure_default`); placeholder copy only | 64 | yes | unknown -> drop, render generic placeholder | yes |
  | `reason_code` | `/fake-payment/callback` | enum staging set (e.g., `user_cancelled`, `simulated_failure`, `duplicate_callback`, `revoked_fixture`) | 64 | no (used to choose `copy_key`) | unknown -> drop, fall back to generic | yes |
  | `occurred_at` | `/fake-payment/callback` | ISO-8601 timestamp string | 32 | no | malformed -> drop, evaluator ignores | yes |
  | `show_id` | `/fake-payment/callback` | opaque slug, `^[a-z0-9-]{1,40}$` | 40 | yes | malformed -> drop entire callback as untrusted | yes |
  | `episode` | Watch, `/fake-payment/callback` | positive integer string `^[1-9][0-9]{0,3}$` | 4 | yes | non-integer/zero/negative -> drop and default to safe handling | yes |
  | `unlocked` | Watch (success branch only) | literal `"1"` | 1 | yes (UX hint only; never authority) | any other value -> drop | yes |

### 4.3 Shared `idempotency_key` contract (reviewer follow-up c)

- **Problem:** Fake payment §5/§7 defines its own idempotency model; entitlement §7 rule 6 has another; event taxonomy §8.2 has a third. Duplicate-callback semantics must be one decision, not three parallel ones.
- **Required Phase 4D decision:** Define a single `idempotency_key` contract shared by fake payment intents, fake grants, and fake audit events. Canonical shape:

  ```txt
  idempotency_key = "fake_idem_" + fake_user_ref + "_" + show_id + "_" + intent_scope
    where intent_scope =
      "ep_" + episode  for single_episode_unlock,
      "pass"           for story_pass.
  ```

- **Fake-auth sequencing decision (binding for P0 fake-only):** the canonical key shape requires `fake_user_ref`. Phase 4D resolves the auth-vs-payment ordering as follows:
  - **Required sequence:** paid CTA (Unlock EP X or Get Story Pass) -> fake auth success creates `fake_user_ref` -> fake payment intent is created with that `fake_user_ref` -> fake payment callback -> fake entitlement grant -> fake audit event.
  - **Pre-auth purchase attempts are not in P0 scope.** No fake purchase intent may be created with a missing or session-only `fake_user_ref`.
  - **Free preview is not affected.** Episodes 1..`freeEpisodes` continue to play with no login surface and no auth call. The auth detour is only triggered by a paid CTA, exactly as authorized by the PRD and the auth return-path spike.
  - Session-scoped pre-auth keys (`fake_session_ref`) are **deferred** as an out-of-P0 option. If a later phase needs them, it requires a separate planning card and re-review of the `idempotency_key` contract.

- **Gate output (PHASE4D-004):**
  - canonical generator function shape (planning-only; no implementation);
  - rule that the same `idempotency_key` flows from purchase intent -> fake payment callback -> fake entitlement grant -> fake audit event;
  - rule that duplicate callbacks with the same key must:
    - emit no second fake grant,
    - emit no second fake debit/state change,
    - cause the fake harness to record a single `duplicate_grant_ignored` (entitlement) and one `fake_payment.duplicate_noop` (payment) audit/event row,
    - return the same final route as the original success;
  - test obligations for FP-006 (payment duplicate) + entitlement §13 item 6 + events §8.3 cases (1)-(4), proven to be one decision;
  - test obligation that no key is generated, accepted, or persisted in any fake form when `fake_user_ref` is missing.

### 4.4 Route-builder authority (reviewer follow-up d)

- **Rule:** URL, localStorage, cookies, sessionStorage, IndexedDB, and any client-only state are **never** entitlement authority. `unlocked=1` is **UX hint only**.
- **Gate output:** Phase 4D acceptance criteria must include:
  - all `return_to` URLs are constructed via `buildWatchEpisodeHref` (or its Phase 4D-equivalent), never assembled from current `window.location`;
  - the fake entitlement evaluator's signature must accept `urlUnlockedFlag` only for telemetry/debug, never as input to the `decision` field;
  - browser tests must include the URL forgery / localStorage forgery rows from entitlement §9;
  - any future real evaluator must replicate the same authority boundary.

## 5. Entitlement fake-only acceptance criteria (reviewer follow-up entitlement REVISE)

Entitlement spike §9 (URL/local-state authority matrix) and §13 (missing tests) become explicit Phase 4D acceptance criteria. The fake-only in-memory evaluator must satisfy all of the following before any route or persistence implementation is proposed.

### 5.1 Authority rule (binding)

```txt
canWatchEpisode = episode.number <= show.freeEpisodes
  OR entitlementEvaluator(userOrSession, showId, episodeNumber).decision == "allow"
```

`urlUnlockedFlag` is **never** in this rule.

### 5.2 Mandatory fake-evaluator test cases

Each row below is a Phase 4D gate item. Implementation card may not claim completion unless every row has an executable, deterministic fake-evaluator test against in-memory fixtures.

| # | Case | Fixtures | Expected decision | Source |
| --- | --- | --- | --- | --- |
| E-01 | Free EP anonymous | anonymous; `episode=1`; `freeEpisodes=5` | allow / `free_episode` | entitlement §9 row 1 |
| E-02 | Free EP with forged `unlocked=1` | anonymous; `episode=1&unlocked=1` | allow / `free_episode` (authority is free boundary, not flag) | entitlement §9 row 2 |
| E-03 | Locked EP anonymous | anonymous; `episode=6` | deny / `anonymous_locked_episode` | entitlement §9 row 3 |
| E-04 | Locked EP forged flag | anonymous; `episode=6&unlocked=1` | deny / `anonymous_locked_episode` | entitlement §9 row 4 |
| E-05 | Locked EP localStorage forged | logged-in fake user; localStorage says unlocked; no real entitlement | deny / `no_matching_entitlement` | entitlement §9 row 5 |
| E-06 | Exact single-EP grant | `fake_user_001` with active EP6 entitlement; `episode=6` | allow / `active_single_episode_entitlement` | entitlement §9 row 6 |
| E-07 | Single-EP grant wrong episode | active EP6 entitlement; `episode=7&unlocked=1` | deny / `no_matching_entitlement` | entitlement §9 row 7 |
| E-08 | Story Pass same show | active show-a story pass; `episode=12` | allow / `active_story_pass_entitlement` | entitlement §9 row 8 |
| E-09 | Story Pass other show | active show-a story pass; `show=show-b episode=6&unlocked=1` | deny / `no_matching_entitlement` | entitlement §9 row 9 |
| E-10 | Revoked grant with flag | revoked EP6 entitlement; `episode=6&unlocked=1` | deny / `revoked_entitlement` | entitlement §9 row 10 |
| E-11 | Expired pass with flag | expired story pass; `episode=10&unlocked=1` | deny / `expired_entitlement` (only if Story Pass is time-scoped per §6) | entitlement §9 row 11 |
| E-12 | Duplicate grant retry | active EP6 entitlement; same `idempotency_key` replay | allow once, no second grant/debit | entitlement §9 row 12 + §13 item 6 |
| E-13 | Cancel/failure callback | cancelled/failed transaction; no entitlement | deny / `no_matching_entitlement` | entitlement §9 row 13 |
| E-14 | Logout / login restore | active entitlement after logout/login | allow via restore check, never via URL | entitlement §13 item 10 |
| E-15 | Free chain anonymous tests | anonymous; episodes 1..`freeEpisodes` | allow | entitlement §13 item 1; promoted to §8.1 gate |

### 5.3 Evaluator output contract (pure decision)

The fake entitlement system is split into two components. The decision function is pure; audit events are derived or recorded separately.

```txt
evaluateAccess(input, fixtures) -> EntitlementDecision
```

- Inputs: `input` (e.g., `{ userRef | null, showId, episodeNumber, freeEpisodes, urlUnlockedFlag? }`) and `fixtures` (in-memory entitlement records, optional clock).
- Output: `EntitlementDecision` MUST include `decision` (`allow` | `deny`), `reason` (enum string), `authority` (one of `free_episode`, `active_single_episode_entitlement`, `active_story_pass_entitlement`, `restore_checked`, `none`), and (when applicable) `entitlementId`.
- **Purity contract (binding):** `evaluateAccess` MUST be pure — no I/O, no side effects, no reads of `window.location` or any global mutable state, no time reads except a clock passed in via fixtures, no mutation of `fixtures`. Calling `evaluateAccess` twice with the same `input` and `fixtures` MUST return deep-equal output.
- `urlUnlockedFlag` is accepted in `input` for telemetry/debug only. It MUST NOT influence the `decision` or `authority` field. PHASE4D-005 acceptance tests must include E-02 and E-04 with `urlUnlockedFlag=true` and assert that the decision is identical to the same case without the flag.

### 5.4 Audit-event obligations (derived / fake-harness-recorded)

Audit events for every PHASE4D-005 test row MUST be produced by a **separate** component, not by the pure evaluator. Phase 4D recognizes two acceptable shapes (Phase 4E may pick either, but not both):

```txt
deriveEntitlementAuditEvents(input, decision, grantContext) -> EntitlementAuditEvent[]    // pure derivation
```

or

```txt
fakeEntitlementHarness.recordDecision(input, decision, grantContext) -> void              // fake in-memory harness
```

- The pure evaluator MUST NOT append, push, write, mutate, or otherwise side-effect any audit list. Hidden mutable audit state inside the evaluator is exactly the drift toward accidental persistence the feasibility challenge flags, and is a stop condition.
- The `EntitlementAuditEvent.eventType` value space remains: `grant_succeeded`, `duplicate_grant_ignored`, `access_allowed`, `access_denied`, plus any event-taxonomy spike extensions.
- Audit events live **fake/in-memory only**. No real audit store, ledger, database, file write, or network call is authorized by Phase 4D.
- PHASE4D-005 acceptance tests MUST assert both the `EntitlementDecision` returned by `evaluateAccess` AND the audit event(s) returned by `deriveEntitlementAuditEvents` (or recorded by the fake harness) for every row in §5.2.

### 5.5 Hard constraints

- No real backend, database, API route, ORM, migration, or persistent store may be introduced.
- The evaluator must be in-memory and may not import from a server runtime.
- The evaluator must not be wired into routes during Phase 4D; route wiring is a later Phase 4E card.

## 6. Story Pass fake-only / deferred semantics (reviewer follow-up e)

The Story Pass open questions (entitlement §11/§12/§15, PRD §16) must be either **resolved** or **explicitly bounded as fake-only / deferred** by Phase 4D. They must not leak into implementation as undefined behavior. PHASE4D-006 is a user-decision gate.

For each axis below, Phase 4D documents both **candidate options** and a **recommended fake-only/deferred default** that downstream implementation may assume. Each axis is clearly marked as a user decision.

### 6.1 Duration

- Candidate options:
  - (D1) **Non-expiring per show** — pass remains active for the user/show pair forever.
  - (D2) **Time-scoped** — pass has `expiresAt` (e.g., 30 days from grant).
  - (D3) **Episode-window scoped** — pass covers episodes `freeEpisodes+1..freeEpisodes+N` only.
- Recommended fake-only / deferred default: **(D1) non-expiring per show**. Reason: simplest evaluator; eliminates expiry edge cases (E-11) until product/legal selects a real model. `Entitlement.expiresAt` remains optional in the data contract; expired-pass test (E-11) is marked **deferred** until D2 or D3 is selected.
- **User decision (PHASE4D-006):** confirm D1 default, or select D2/D3 and provide an `expiresAt` policy.

### 6.2 Scope

- Candidate options:
  - (S1) **Show-scoped** — pass covers all locked episodes of one `showId`.
  - (S2) **Catalog-scoped** — pass covers all locked episodes across all shows for the user.
  - (S3) **Hybrid** — pass covers one show plus a curated bundle.
- Recommended fake-only / deferred default: **(S1) show-scoped**. Reason: PRD §8.5 reframes Pass as "Keep watching [Story Title]", and the entitlement spike §4 already models show scope via `Entitlement.showId`. Catalog scope (S2) is explicitly bounded as **deferred** and may not appear in fake fixtures.
- **User decision (PHASE4D-006):** confirm S1 default, or select S2/S3 (which requires a separate planning card before Phase 4E).

### 6.3 Restore

- Candidate options:
  - (R1) **Account-bound restore** — login on a new device restores any active entitlement for that fake user.
  - (R2) **Receipt-bound restore** — restore requires a fake receipt provided by user (deferred since no real receipts exist).
  - (R3) **No restore in fake** — restore is deferred entirely; logout/login behaves anonymously.
- Recommended fake-only / deferred default: **(R1) account-bound restore**. Reason: entitlement §13 item 10 requires `restore_checked` semantics, and account-bound is the only model that does not require a real provider. Restore is keyed off `fake_user_ref` only; no real receipts.
- **User decision (PHASE4D-006):** confirm R1.

### 6.4 Refund / revoke

- Candidate options:
  - (RR1) **Manual revoke fixture** — fake revoke is triggered only by test setup; no user-facing refund UI.
  - (RR2) **Self-serve refund** — user can request fake refund from a UI surface.
  - (RR3) **Cooling-off auto-revoke** — auto-revoke within N hours of grant.
- Recommended fake-only / deferred default: **(RR1) manual revoke fixture**. Reason: payment §3 hard-stops real refund/chargeback paths; entitlement §10 only handles fake revoke through fixture setup. (RR2) and (RR3) are deferred to Q-PAY-1 / Q-LEGAL-1.
- **User decision (PHASE4D-006):** confirm RR1.

### 6.5 Expiry behavior (only applicable if D2 or D3 is chosen)

- Candidate options:
  - (X1) **Hard cutoff** — denied immediately at `expiresAt`.
  - (X2) **Grace period** — N-day grace where denied but UI shows renew CTA.
- Recommended fake-only / deferred default: **deferred until D2/D3 is chosen.** No `expiresAt` logic is implemented; E-11 is a deferred test row.
- **User decision (PHASE4D-006):** N/A unless D2/D3 selected.

### 6.6 Copy and legal

All Story Pass copy remains placeholder-only (entitlement §17, payment §9). No final subscription/renewal/cancellation/refund/tax copy is approved by Phase 4D. Q-LEGAL-1 remains open.

## 7. Sample asset / video proof gate (reviewer follow-up g, video §11/§12)

- **Rule:** No Phase 4E video boundary proof may begin until original or rights-cleared sample media exists and is logged in the sample asset log (`docs/moboreels/real-mvp/spikes/safe-video-boundary.md` §11). This is a hard gate.
- **PHASE4D-007 obligations:**
  - confirm the assets listed in video §11 (`ep1-placeholder.mp4`, `poster-placeholder.jpg`, captions) are still **Pending**;
  - define what evidence counts as rights-cleared: original creation note with author/date, public-domain confirmation with source URL and license check, or signed staging license with scope and expiry;
  - explicitly forbid sourcing from competitor catalogs, scraped CDNs, AI-generated assets without a confirmed license posture, or user uploads without rights;
  - explicitly forbid uploading any sample asset to a production CDN or storage bucket;
  - mark PHASE4D-009 (390 x 844 matrix) as **blocked** until PHASE4D-007 returns evidence;
  - require a user-decision gate before commissioning original placeholder media (effort, cost, rights ownership).
- **User decision (PHASE4D-007):** authorize creation of original placeholder media, or defer the video boundary proof to a later phase.

## 8. Mandatory test / evidence matrix

**Phase 4D vs Phase 4E ordering (binding):**

- Phase 4D produces **test plans** — test IDs, scenarios, fixtures, assertions, expected evidence formats, and evidence-package requirements. Phase 4D does not produce executable test files, harnesses, routes, or feature code.
- Phase 4E (fake-only implementation) **starts with executable tests as the first implementation step** for every gate row below. Test creation precedes feature wiring or any change to route behavior in the same Phase 4E card.
- A Phase 4E card may not be approved by a reviewer until the executable tests named in this section exist, run, and pass against fake-only fixtures.
- "Tests must exist before any fake-only implementation begins" from earlier drafts is **rephrased**: tests must exist and pass **as part of** the Phase 4E card that introduces them, before that card's feature wiring is approved. Phase 4E is **not** blocked from opening by the absence of pre-existing executable tests; it is blocked from being **approved** without them.
- Free-chain tests (§8.1) are the **first Phase 4E test artifact** and must be the first PR-ready piece of any Phase 4E sequencing. They are not a pre-existing artifact that must land before Phase 4E can open.

Each row below is a planning gate. The Phase 4E implementation card that ships the corresponding feature may not claim completion without the named test artifact.

### 8.1 Free-chain anonymous tests (highest priority, must precede any other implementation)

| ID | Scenario | Expected | Source |
| --- | --- | --- | --- |
| FC-01 | `/variant-b/watch/[showId]?episode=1&source=facebook` loads | no login surface, no PWA prompt, no payment prompt, no Home redirect, no auth call | auth §7, PRD §15 |
| FC-02 | Continue through EP1..EP(`freeEpisodes`) anonymously | every step plays without auth/payment/pass prompt; no `/fake-auth/*` route touched; no `/fake-payment/*` route touched | auth §7, entitlement §13 item 1, payment FP-001, events §10 |
| FC-03 | Reload at any free episode | playback re-enters without auth; query state restored from URL | auth §7 (5) |
| FC-04 | Open Episode Sheet during free chain | drawer/sheet visible but never triggers `/fake-auth/*` | auth §7 (4) |
| FC-05 | Manual URL edit to a free episode after auth detour | still no login required | auth §7 (6) |
| FC-06 | Network DevTools shows zero calls to Meta/Facebook/analytics/backend during free chain | passes banned-dependency boundary check | events §11 |

### 8.2 Locked-episode and Unlock Drawer

| ID | Scenario | Expected |
| --- | --- | --- |
| L-01 | First locked episode entry | locked panel rendered; Unlock Drawer auto-opens; provider not mounted with playable source |
| L-02 | Close drawer with "Maybe later" | user remains on same locked episode; tapping locked area reopens drawer |
| L-03 | Drawer primary CTA labeled "Unlock EP X"; secondary "Get Story Pass" | matches PRD §5.5 |
| L-04 | Drawer shows drama title, episode number, mock balance, mock cost | matches PRD §8.4 |

### 8.3 Auth return-path tests

Rows 1–14 of auth spike §9, captured as deterministic URL/state assertions. Must include forged-state (row 11), missing-state (row 12), and URL-edit-`unlocked=1` (row 13) cases.

### 8.4 Fake payment tests

FP-001..FP-010 from payment spike §11, with FP-006 (duplicate success) and FP-007/FP-008 (delayed callback, return target preservation) wired to PHASE4D-004 shared `idempotency_key` contract.

### 8.5 Entitlement evaluator tests

E-01..E-15 from §5.2 of this document. E-11 marked deferred unless §6.1 selects D2/D3.

### 8.6 Event taxonomy tests

§10 checklist of event spike, including `same_episode_resumed.return_episode_matches`, dedupe-key cases 1–4, and network-egress proof.

### 8.7 Video boundary tests (blocked on §7 gate; conditional)

§10 verification matrix from video spike at 390 x 844, including:

| Row | Setup | Expected |
| --- | --- | --- |
| V-01 | Free EP1 load | provider `loading` → `ready` → `playing`; no drawer |
| V-02 | First locked EP | provider not loaded; locked panel; drawer opens |
| V-03 | Buffering / weak network | distinct from locked; no unlock CTA |
| V-04 | Playback error | distinct from locked; no unlock drawer; retry available |
| V-05 | `unlocked=1` route | sample provider mounts; success feedback non-redirect |
| V-06 | Locked panel vs error panel visual diff | proven different by screenshot pair at 390 x 844 (reviewer follow-up g) |

**PHASE4D-009 terminal states (binding):**

- **APPROVE** — PHASE4D-007 returns rights-cleared sample asset evidence; V-01..V-06 matrix is fully planned; Phase 4E may schedule a video-boundary implementation card that begins with the V-01..V-06 tests as the first step.
- **DEFERRED** — PHASE4D-007 explicitly defers sample-asset creation (the user-decision gate G-6 returns "defer"). In this state, V-01..V-06 are formally deferred, no video-boundary proof is required for Phase 4D approval, and **no playback-provider implementation, video pipeline work, or 390 x 844 video matrix work is authorized in Phase 4E**. Phase 4D-010 may still APPROVE the Phase 4D package with PHASE4D-009 marked DEFERRED, provided every other predecessor is approved or deferred.
- **BLOCKED** — any attempt to proceed with V-01..V-06 work without rights-cleared sample asset evidence (no original media note, no signed staging license, no public-domain confirmation) is a stop condition.

### 8.8 Evidence package format

For each gate, the implementation card must produce:

- the deterministic test file(s) name and what they assert;
- a reviewer-readable artifact: route table, screenshot pair, event log dump, or asserted JSON fixture;
- a network log confirming no calls to disallowed third parties;
- a **dependency / static check artifact**: the list of new package.json dependencies, server runtime additions, and module imports introduced by the card, asserted against an allow-list — no Meta/Facebook SDK, no analytics SDK (GA, Segment, Amplitude, Mixpanel, PostHog, Plausible, Vercel Analytics), no payment-provider SDK, no auth-provider SDK, no real database/ORM/migration/queue client, no video ingest/transcoding/DRM SDK, no Node server runtime that maintains process-lifetime state for entitlement decisions, no production CDN client. The card must include a static-scan evidence file (e.g., diff of `package.json` + grep over `src/` for banned package names) inside the evidence bundle;
- explicit confirmation that no item from §1.2 was crossed.

## 9. Stop conditions and user-decision gates

### 9.1 Stop conditions (block immediately, request explicit approval)

Stop and escalate to the user if any Phase 4D card proposes:

- Adding any production runtime, server, database, queue, secret, deployment, DNS change, or persistent public service.
- Selecting or contacting any real auth, payment, analytics, video, or ad-platform provider.
- Treating `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, or any client-only state as authoritative entitlement.
- Returning users to Home / Pass / generic catalog after success/cancel/failure instead of the same locked episode.
- Adding login wall, account capture, marketing opt-in, or PWA prompt before free preview.
- Finalizing legal/payment/subscription/refund/cancellation/tax/consent copy.
- Using competitor / licensed / scraped / uncleared content assets, or uploading any sample asset to a production CDN.
- Extending the attribution allow-list beyond PHASE4D-002 without a Q-ATTR-1 decision.
- Re-opening Prototype A/C/D/E direction or moving any flow before the Watch page.
- Beginning Phase 4E implementation before PHASE4D-010 returns APPROVE.

### 9.2 User-decision gates (must be explicitly answered or explicitly deferred)

**Policy B (binding):** the defaults below are **not** approved product/legal decisions. They are the recommended fake-only/deferred default each gate would fall back to if the user explicitly defers it. PHASE4D-005 fixture rows that depend on Story Pass semantics (E-09, E-10, E-11, E-14) may be **drafted** before PHASE4D-006 resolves, but may not be **final-approved** until PHASE4D-006 either confirms the recommended default for the relevant axis or selects an alternative. PHASE4D-010 may not APPROVE the Phase 4D package while any G-1..G-7 gate is unanswered and undeferred.

| Gate | Question | Recommended fake-only default (only if user defers) | Blocks |
| --- | --- | --- | --- |
| G-1 | PHASE4D-002 attribution allow-list: stick with current `ATTRIBUTION_KEYS` baseline, or extend? | stay on baseline (9 keys); no `utm_medium` / `utm_term`; no `utm_*` glob | PHASE4D-003, PHASE4D-008 final approval |
| G-2 | PHASE4D-006 Story Pass duration | D1 non-expiring | E-11 final inclusion |
| G-3 | PHASE4D-006 Story Pass scope | S1 show-scoped | E-09 final fixture |
| G-4 | PHASE4D-006 Story Pass restore | R1 account-bound | E-14 final fixture |
| G-5 | PHASE4D-006 Story Pass refund/revoke | RR1 manual revoke fixture | E-10 final fixture |
| G-6 | PHASE4D-007 sample asset creation | authorize original placeholder media OR defer video proof | PHASE4D-009 terminal state; V-01..V-06 |
| G-7 | PHASE4D-008 free-chain anonymous tests | mandatory test plan in Phase 4D; executable tests as first Phase 4E artifact (see §8) | every Phase 4E card |
| G-8 | Q-AUTH-1, Q-ATTR-1, Q-PAY-1, Q-LEGAL-1 (PRD §8 / §16) | remain OPEN; deferred until product/legal | any real-provider planning |

Implementation cards may not be opened for an unanswered gate. Phase 4D-010 may not APPROVE while a gate is both unanswered and undeferred.

## 10. Recommended next Kanban cards

After PHASE4D-001 (this document) lands, the recommended next cards are:

1. **PHASE4D-002 — Attribution allow-list harmonization.** Produce `ATTRIBUTION_KEYS_PHASE4D` mapping table and authority statement; resolve G-1.
2. **PHASE4D-003 — Callback key round-trip matrix.** Produce `CALLBACK_KEYS_PHASE4D` surface-by-surface allow-list; depends on PHASE4D-002.
3. **PHASE4D-004 — Shared idempotency_key contract.** Define generator shape, propagation rules, duplicate-callback obligations; references payment FP-006, entitlement §13 item 6, events §8.3.
4. **PHASE4D-005 — Entitlement fake-only acceptance criteria.** Lift §5 of this document into a standalone card with executable test obligations against in-memory fixtures.
5. **PHASE4D-006 — Story Pass semantics decision packet.** Resolve G-2 through G-5; produce written user-decision artifact.
6. **PHASE4D-007 — Sample asset / rights-cleared log gate.** Resolve G-6; either authorize original placeholder media creation card or formally defer video proof.
7. **PHASE4D-008 — Free-chain anonymous test plan.** Lift §8.1 FC-01..FC-06 into mandatory test-first plan; reviewer-gated before Phase 4E.
8. **PHASE4D-009 — 390 x 844 locked vs playback-error visual matrix.** **DEFERRED** after PHASE4D-007 / G-6 option B; do not open playback-provider or video-matrix Phase 4E work.
9. **PHASE4D-010 — Phase 4D planning reviewer gate.** Independent reviewer verifies PHASE4D-002..PHASE4D-009 outputs; APPROVE required before any Phase 4E implementation.

Each card is **planning only** unless explicitly marked as a user-decision gate. None of them authorize implementation. None of them are allowed to cross §1.2.

---

End of Phase 4D planning gate document.
