# PHASE4E-001 — Phase 4E first-slice requirements (fake-only)

**Verdict:** APPROVE for Phase 4E first-slice scoping. This artifact is requirements/planning only; it does not authorize code, tests, routes, harnesses, deployments, or any production infrastructure. Phase 4E implementation cards may not be opened until each downstream gate task is itself approved by its own reviewer; this requirements card unblocks scoping of PHASE4E-002 and PHASE4E-003 only.

## 1. Source evidence

| Doc | Path | Used for |
| --- | --- | --- |
| MVP PRD | `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` | P0 route, free preview, locked episode, Unlock Drawer, same-episode return, QA checklist. |
| Prototype B spec | `docs/moboreels/prototype-b-spec.md` | Secondary context only. |
| Phase 4D planning gate | `docs/moboreels/real-mvp/phase4d-planning.md` | §1.2 non-authorizations, §4 contracts, §5 entitlement, §8 test plans, §9 stop conditions. |
| Phase 4D architecture resolution | `docs/moboreels/real-mvp/phase4d-architecture-resolution.md` | Per-key value-domain matrix authority, pure-evaluator split, test sequencing rule. |
| Shared `idempotency_key` contract | `docs/moboreels/real-mvp/phase4d-shared-idempotency-key-contract.md` | §3 generator, §4 sequencing, §6 duplicate no-op, §7 missing-`fake_user_ref`, §8 IDEM-* tests. |
| Entitlement fake-only acceptance | `docs/moboreels/real-mvp/phase4d-005-entitlement-fake-only-acceptance-criteria.md` | §A authority rule, §B evaluator contract, E-01..E-15 (E-11 deferred), §D audit boundary. |
| Free-chain test plan | `docs/moboreels/real-mvp/phase4d-008-free-chain-anonymous-test-plan.md` | FC-01..FC-06, LFC-01..LFC-10, CTA-01..CTA-06, ENT-FC-01..ENT-FC-05. |
| Video proof terminal decision | `docs/moboreels/real-mvp/phase4d-video-proof-terminal-decision.md` | PHASE4D-009 DEFERRED — no playback-provider or video-matrix work authorized in Phase 4E. |
| PHASE4D-010 reviewer verdict | `docs/moboreels/real-mvp/artifacts/phase4d-010-claude-reviewer-verdict.md` | APPROVE; Phase 4E unblocked subject to fake-only scope. |
| Attribution baseline | `src/lib/query-params.ts` | Existing `ATTRIBUTION_KEYS` 9-key baseline; existing `buildWatchEpisodeHref` / `buildPassHref` / `buildPassReturnHref` / `buildShowDetailHref` / `parseWatchQueryParams` / `parsePassQueryParams`. |

## 2. First-slice objective and non-goals

### 2.1 Objective

Land two Phase 4E cards that together unblock every later fake-only conversion-flow card:

1. **Centralized callback/query contract + route helper/parser** — extend `src/lib/query-params.ts` (and adjacent helpers) so every fake surface in Phase 4E reads/writes URLs through one authority that enforces PHASE4D-002 attribution allow-list, PHASE4D-003 callback-key per-key value-domain rules, and PHASE4D-004 `idempotency_key` non-leakage.
2. **Free-chain anonymous executable tests** — create the executable FC-01..FC-06 + LFC-01..LFC-10 + ENT-FC-01..ENT-FC-05 test set plus the static-dependency / network-egress checks as the first Phase 4E test artifact (PHASE4D-008 §4 sequencing rule, planning §8.1).

Both cards stay inside the P0 route invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
  -> free chain (no login, no payment, no PWA/pass/recharge prompt)
  -> first locked episode (episode > show.freeEpisodes)
  -> Unlock Drawer
  -> mock unlock / mock Story Pass
  -> /variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1   (UX hint only)
```

### 2.2 Non-goals (first slice)

- No paid-CTA / fake-auth / fake-payment implementation. CTA-01..CTA-06 are explicitly **out of scope** for this slice; they belong to a later card.
- No fake entitlement evaluator implementation. E-05..E-14 are out of scope; only E-01..E-04 and E-15 are exercised, via the FC/ENT-FC bundle, and only as authority assertions for free vs locked anonymous boundary.
- No playback-provider / video pipeline / 390 × 844 video matrix work (PHASE4D-009 DEFERRED).
- No Story Pass / coin-pack / refund/revoke UI; no expiry / E-11 logic (G-2 = D1 non-expiring).
- No real auth, payment, backend, database, queue, ORM, migration, Meta/Facebook/CAPI, production analytics, CDN, secrets, deployment, DNS, NovelHub production infra, or licensed/competitor assets.
- No code in `src/app/variant-b/watch/**` whose only purpose is to "warm up" idempotency-key plumbing during the free chain (IDEM-M-06 stop condition).

## 3. First-slice task graph

All cards are **fake-only / staging-only**. None opens any successor until its own reviewer gate returns APPROVE. PHASE4E-002 and PHASE4E-003 may be drafted in parallel, but PHASE4E-003 may not claim completion before PHASE4E-002's per-key parser/builder helpers exist and pass their own unit tests.

```txt
PHASE4E-001  Requirements (THIS DOC)
   |
   +--> PHASE4E-002  Centralized callback/query contract + route helper/parser
   |        Depends on: PHASE4E-001
   |        Assignee: architect (contract) -> dev (implementation) -> qa (parser/builder unit tests) -> reviewer (gate)
   |        Type: implementation + QA + external review
   |
   +--> PHASE4E-003  Free-chain anonymous executable tests
            Depends on: PHASE4E-001; consumes PHASE4E-002 helpers when available
            Assignee: qa (test plan -> tests) -> dev (fixtures/harness wiring) -> reviewer (gate)
            Type: QA-first implementation + external review
```

| Card | Name | Depends on | Assignee chain | Type |
| --- | --- | --- | --- | --- |
| PHASE4E-001 | Phase 4E first-slice requirements (this doc) | PHASE4D-010 APPROVE | requirements | requirements only |
| PHASE4E-002 | Centralized callback/query contract + route helper/parser | PHASE4E-001 | architect → dev → qa → reviewer | implementation + QA + external review |
| PHASE4E-003 | Free-chain anonymous executable tests | PHASE4E-001 (consumes -002 helpers) | qa → dev → reviewer | QA-first implementation + external review |

Each card must include its own feasibility note before code is touched; either may be sent back to architect/requirements if the feasibility check uncovers a contract gap.

## 4. Phase 4D test ID mapping into the first slice

### 4.1 Free-chain anonymous (PHASE4D-008 §5)

| ID | First-slice card | Notes |
| --- | --- | --- |
| FC-01 | PHASE4E-003 | Ad route loads EP1 anonymously; no auth/payment/PWA/Home redirect. |
| FC-02 | PHASE4E-003 | Free episode chain anonymous; no `/fake-auth/*` or `/fake-payment/*` traffic. |
| FC-03 | PHASE4E-003 | Reload at each free episode; URL-restored playback; no login wall. |
| FC-04 | PHASE4E-003 | Episode Sheet open during free chain; no auth/payment triggered. |
| FC-05 | PHASE4E-003 | Manual URL edit to free episode after stale callback state; no login required; `unlocked=1` ignored. |
| FC-06 | PHASE4E-003 | Network boundary: zero calls to Meta/Facebook/analytics/backend/payment/auth/CDN. |

### 4.2 Locked transition / drawer (PHASE4D-008 §6)

| ID | First-slice card | Notes |
| --- | --- | --- |
| LFC-01 | PHASE4E-003 | First locked episode entry; Unlock Drawer auto-opens; no Home/Pass redirect. |
| LFC-02 | PHASE4E-003 | Locked state distinct from playback error; provider not mounted with playable source. |
| LFC-03 | PHASE4E-003 | Drawer copy/CTA per PRD §5.5/§8.4. |
| LFC-04 | PHASE4E-003 | Maybe later → same locked URL retained. |
| LFC-05 | PHASE4E-003 | Tap locked playback area reopens drawer. |
| LFC-06 | PHASE4E-003 | Episode Sheet states at locked boundary. |
| LFC-07 | PHASE4E-003 | Locked-episode click from Episode Sheet opens drawer for clicked episode. |
| LFC-08 | PHASE4E-003 | Free-episode click from sheet plays anonymously. |
| LFC-09 | PHASE4E-003 | Show Detail round trip preserves show + episode context. |
| LFC-10 | PHASE4E-003 | 390 × 844 safe-area screenshots for EP1, last free, locked, drawer, sheet. |

### 4.3 Entitlement authority subset (PHASE4D-005 §C; PHASE4D-008 §8)

| ID | First-slice card | Notes |
| --- | --- | --- |
| E-01 / ENT-FC-01 | PHASE4E-003 | Free EP anonymous → `allow / free_episode / free_episode`. |
| E-02 / ENT-FC-02 | PHASE4E-003 | Free EP with forged `unlocked=1` → identical decision to E-01 (pairwise assertion). |
| E-03 / ENT-FC-03 | PHASE4E-003 | Locked EP anonymous → `deny / anonymous_locked_episode / none`. |
| E-04 / ENT-FC-04 | PHASE4E-003 | Locked EP with forged `unlocked=1` → identical decision to E-03 (pairwise assertion). |
| E-15 / ENT-FC-05 | PHASE4E-003 | Free chain EP1..EP(`freeEpisodes`) → zero auth, zero payment, zero idempotency, zero backend/analytics/Facebook traffic. |
| E-05..E-14 | **not in slice** | Defer to later entitlement-evaluator implementation card. E-11 remains DEFERRED globally (G-2 = D1). |

### 4.4 PHASE4D-004 IDEM rows in slice

| ID | First-slice card | Notes |
| --- | --- | --- |
| IDEM-M-06 | PHASE4E-003 | Free-chain EP1..EP(`freeEpisodes`): zero §3-generator calls, zero `/fake-auth/*` traffic, zero `/fake-payment/*` traffic, zero payment events. |
| IDEM-M-01 | PHASE4E-003 (negative) | If any code path tries to call the §3 generator from the free chain, the test must fail; this is an "absence of behavior" assertion plus a static-import check that the generator is not imported by free-chain code. |
| IDEM-G-* / IDEM-P-* / IDEM-D-* / IDEM-M-02..09 | **not in slice** | Belong to the later paid-CTA / fake-auth / fake-payment / fake-entitlement-grant card. |

### 4.5 PHASE4D-003 callback / query matrix rows in slice (PHASE4D-002 §4.2)

Surface scope for the first slice is **inbound to Watch only**. `/fake-auth/*` and `/fake-payment/*` callbacks themselves stay out of slice; their per-key parsing helpers are landed by PHASE4E-002 so the later card consumes them. The PHASE4E-002 parser/builder unit tests must cover at minimum these rows from the planning §4.2 per-key table:

| Key | Slice scope | Required parser/builder rule |
| --- | --- | --- |
| `episode` | inbound to Watch | positive int `^[1-9][0-9]{0,3}$`; max len 4; non-int/zero/negative → defaulted via `clampEpisode`-style safe handling. |
| `unlocked` | inbound to Watch | literal `"1"` only; any other value dropped; emitted on success branch only; **never** authority. |
| `source` | inbound to Watch + outbound | accepted; capped at 128 chars; truncated/dropped at parser boundary. |
| `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, `utm_content` | inbound + outbound | same 128-char cap; round-tripped losslessly via central helper. |
| `purchase_status` | inbound to Watch (success/cancel/failure) | enum `succeeded\|cancelled\|failed\|pending\|revoked`; max 16; never `revoked` on user redirect; unknown → drop. |
| `auth_result` | inbound to Watch | enum `success\|cancelled\|failed`; max 16; unknown → drop. |
| `drawer` | inbound to Watch | enum `unlock\|pass`; max 16; unknown → drop. |
| `drawer_intent` | inbound to Watch | enum `single_episode\|story_pass`; max 32; unknown → drop. |
| `fake_user` | inbound to Watch | regex `^fake_user_[A-Za-z0-9_-]{1,32}$`; max 64; PII-suspect → drop; staging-only opaque value. |
| `idempotency_key` | **must NOT** appear on Watch / Pass / Episode Sheet URLs | parser/builder asserts non-emission (IDEM-P-03/-04); included as a *negative* test. |

The matrix forbids `URLSearchParams(window.location.search)` or any equivalent generic passthrough. Outbound URL composition must go through the central helper (`buildWatchEpisodeHref` and its allow-listed siblings); cross-host / scheme-bearing / unknown-key inputs are dropped silently.

## 5. Acceptance criteria for the first two implementation cards

### 5.1 PHASE4E-002 — Centralized callback/query contract + route helper/parser

**Likely files to touch (informational):**

- `src/lib/query-params.ts` — extend `ATTRIBUTION_KEYS` enforcement with 128-char cap + truncation at parser boundary; widen `parseWatchQueryParams` to surface the PHASE4D-003 inbound keys (`purchase_status`, `auth_result`, `drawer`, `drawer_intent`, `fake_user`, `unlocked` as UX hint); ensure `buildWatchEpisodeHref` / `buildPassHref` / `buildPassReturnHref` / `buildShowDetailHref` continue to enforce the allow-list and never emit `idempotency_key`.
- `src/lib/query-params.test.ts` — extend with per-key value-domain tests (enum / regex / length / unknown / duplicate / malformed / overlong; one row per planning §4.2 matrix key in slice scope).
- *(new, likely)* `src/lib/callback-keys.ts` — a single, named-export source of truth (`CALLBACK_KEYS_PHASE4D`, per-key domain validators, enum/regex constants); imported by both parsers and builders.
- *(new, likely)* `src/lib/callback-keys.test.ts` — unit tests for the per-key validators.
- *(new, likely)* `src/lib/route-builder.ts` if the existing `query-params.ts` API needs to be split between "attribution + helpers" and "callback-key contract", to avoid one mega-module.

**Required tests / evidence:**

- Per-key value-domain unit tests for every PHASE4D-003 row in §4.5 above, including overlong-value (≥129 chars for attribution; ≥257 for non-attribution callback values) drop/truncate at parser boundary.
- Pairwise tests proving `unlocked=1` on Watch parser surfaces as a flag but never as authority (the parser must not expose any `isAuthorized` / `canPlay` / `granted` flag derived from `unlocked`).
- Round-trip tests: parser → builder → parser yields the same attribution map (lossless) for the 9-key baseline; unknown keys are dropped silently and do not round-trip.
- Negative tests: `idempotency_key`, `purchase_intent_id`, `callback_id`, `return_to`, `copy_key`, `reason_code`, `occurred_at` are **never** emitted by any Watch / Pass / Episode Sheet / Show Detail builder (assert via constructed URL string match).
- Static-scan evidence: no new `package.json` dependency; grep over `src/` confirms no banned SDK is imported by the new module (no Meta/Facebook, no analytics vendor, no payment/auth provider SDK, no DB/ORM/queue, no video pipeline).
- Reviewer-readable artifact: a per-key matrix table mirrored from the planning §4.2 rows, with a "tested by" column linking each row to a test name.

**Forbidden shortcuts:**

- No `URLSearchParams(window.location.search)` passthrough, no `Object.assign(currentQuery, ...)` style copy, no `{ ...router.query }` fall-through.
- No promotion of `unlocked` to an authority field anywhere in the public type surface (the parsed `unlocked: boolean` already exists; do not rename it to anything that reads like access permission).
- No `idempotency_key` parsing/building support on this card; the field is owned by a later card and must not be plumbed through the Watch route helper.
- No "convenience" exporter that re-exports `ATTRIBUTION_KEYS` from another module under a parallel name; one constant, one source.
- No edits under `src/app/variant-b/**` that change rendered behavior; this card may update callsites only mechanically (compile-clean rename / type-adoption); behavioral changes belong to PHASE4E-003 or later cards.

### 5.2 PHASE4E-003 — Free-chain anonymous executable tests

**Likely files to touch (informational):**

- *(new, likely)* `tests/e2e/free-chain.spec.ts` or `tests/playwright/free-chain.spec.ts` — FC-01..FC-06.
- *(new, likely)* `tests/e2e/locked-and-drawer.spec.ts` — LFC-01..LFC-10.
- *(new, likely)* `tests/fixtures/shows/canonical-show.ts` — canonical show fixture: stable `showId`, `freeEpisodes >= 2`, deterministic episode metadata, mock balance/cost on the locked episode only.
- *(new, likely)* `tests/harness/network-allowlist.ts` — Playwright route interception that fails the suite on any request to disallowed hosts (Meta, Facebook, GA, Segment, Amplitude, Mixpanel, PostHog, Plausible, Vercel Analytics, payment/auth providers, any non-localhost origin).
- *(new, likely)* `scripts/check-static-deps.ts` or equivalent — static dependency / import allow-list check.
- *(possibly)* unit tests near the parser/`evaluateAccess`-equivalent to assert ENT-FC-01..ENT-FC-05 authority decisions; if the entitlement evaluator is not yet implemented in this slice, ENT-FC assertions land as a thin authority predicate keyed only on `episode <= freeEpisodes` (the §A authority rule's first disjunct). The card must explicitly *not* introduce the full `evaluateAccess(input, fixtures)` API yet.

**Required tests / evidence:**

- Executable FC-01..FC-06 (all six required to pass on the canonical show fixture).
- Executable LFC-01..LFC-10 (LFC-10 requires a 390 × 844 viewport, screenshots saved as evidence; no real video assets used — locked-state vs error-state assertions use markup/copy, not media).
- Executable ENT-FC-01..ENT-FC-05 (E-01/E-02/E-03/E-04/E-15 authority assertions including the pairwise `unlocked=1` vs no-flag deep-equal decision for free EP and locked EP).
- IDEM-M-06 free-chain zero-traffic proof (network log + static-import check that no free-chain code path imports the (future) idempotency generator or `/fake-auth/*` / `/fake-payment/*` adapter modules).
- Evidence bundle per PHASE4D-008 §9: test-file-to-ID map; fixture dump; URL trace from ad route through every free episode + first locked episode + drawer close/reopen; 390 × 844 screenshots for EP1 / last free / locked / drawer / sheet / Show Detail round trip; HAR or Playwright network log; static dependency/import scan; assertion output proving `unlocked=1` is non-authority; explicit "PHASE4D-010 APPROVE existed before implementation" line.

**Forbidden shortcuts:**

- No real Facebook ad source, no real `source=facebook` analytics emission; the value is a literal URL param only.
- No real auth/payment/Story Pass / coin-pack / PWA prompt anywhere in the free-chain or locked-state suite. CTA-01..CTA-06 belong to a later card.
- No real video player / CDN / storage / DRM / sample video asset. Locked-vs-error distinction is asserted on DOM / copy / structural state, not on media playback.
- No skipping LFC-02 (locked-state distinct from playback error) by ducking the question — if the current Watch stub does not yet distinguish them clearly, the card must surface the gap to architect, not paper over it.
- No widening of the free-chain network allow-list to "just localhost + a couple of CDNs" without an explicit allow-list entry per host and a written justification.
- No use of `localStorage` / cookies / `sessionStorage` / `IndexedDB` / history state as access authority anywhere in the test fixtures or helpers.

## 6. Hard stops and reviewer reject conditions

Reviewers must reject (and re-route to user approval) any PHASE4E-002 / PHASE4E-003 deliverable that proposes or contains any of the following:

- Any production runtime, server, database, queue, secret, deployment, DNS change, or persistent public service.
- Any real auth, payment, analytics, video, CDN, ad-platform, or backend provider — SDK, public callback URL, webhook, secret, account, or contract.
- NovelHub production infrastructure references that imply Phase 4E rollout (NovelHub is future infra reference only).
- Treating `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, history state, query params, or any client-only state as authoritative entitlement.
- Returning success / cancel / failure / restore / revoke to Home, Search, Show Detail, generic Pass, or catalog instead of the same locked episode.
- Adding any login / fake-auth / payment / Story Pass / recharge / coin-pack / marketing opt-in / PWA prompt before the first locked episode.
- Final legal / payment / subscription / cancellation / refund / tax / consent / privacy copy.
- Licensed / competitor / scraped / uncleared content assets, or uploading any sample asset to a production CDN.
- Importing or registering `/fake-auth/*` or `/fake-payment/*` as real Next.js routes, public webhooks, or server-runtime endpoints (they remain contract placeholders).
- Extending `ATTRIBUTION_KEYS` beyond the 9-key baseline without a Q-ATTR-1 escalation card.
- Implementing the full `evaluateAccess(input, fixtures)` evaluator, `deriveEntitlementAuditEvents`, `fakeEntitlementHarness.recordDecision`, or any `idempotency_key` generator / propagation in this slice.
- Implementing playback-provider, video pipeline, or 390 × 844 video-matrix work (PHASE4D-009 DEFERRED).
- Implementing E-11 / `expiresAt` / grace period / renewal / expired-pass UI (G-2 = D1 non-expiring).
- Implementing catalog-scoped Story Pass fixtures (G-3 = S1 show-scoped).
- Implementing self-serve refund/revoke UI (G-5 = RR1 manual revoke fixture).
- Any card that silently weakens an IDEM-* / FC-* / LFC-* / ENT-FC-* / E-* obligation, or drops a per-key value-domain row from the §4.5 matrix, without an explicit written justification approved by an architect-gate.
- Beginning implementation on later Phase 4E cards (paid CTA, fake auth, fake payment, entitlement evaluator, audit, events) before PHASE4E-002 and PHASE4E-003 have both returned APPROVE from their own reviewer gates.

## 7. Recommended next Kanban cards (after this requirements gate)

Keep every successor card small, fake-only, and with its own reviewer gate. The following sequence is the recommended fan-out after PHASE4E-002 + PHASE4E-003 land:

| Card | Scope | Depends on | Notes |
| --- | --- | --- | --- |
| PHASE4E-002 | Centralized callback/query contract + route helper/parser (per §5.1) | PHASE4E-001 | Land first; PHASE4E-003 consumes its helpers. |
| PHASE4E-003 | Free-chain anonymous executable tests (per §5.2) | PHASE4E-001 | First Phase 4E test artifact per PHASE4D-008 §4. |
| PHASE4E-004 | Locked-state + Unlock Drawer rendering polish (DOM/copy only, no video) | PHASE4E-003 | Tightens LFC-02/LFC-03/LFC-04/LFC-05 if the current stub regresses against them; no provider work. |
| PHASE4E-005 | Pure entitlement evaluator `evaluateAccess` + in-memory fixtures (PHASE4D-005 §B + E-01..E-10, E-12..E-15; E-11 deferred) | PHASE4E-002, PHASE4E-003 | Pure-function only; no audit mutation; no route wiring. |
| PHASE4E-006 | Fake audit derivation / harness (`deriveEntitlementAuditEvents` OR `fakeEntitlementHarness.recordDecision`, pick one) | PHASE4E-005 | Separate from evaluator per PHASE4D-005 §D. |
| PHASE4E-007 | Fake auth adapter (`/fake-auth/*` contract placeholder) + auth return-state matrix (FC-05, auth spike §9) | PHASE4E-002 | No real provider; opaque `fake_user` only. |
| PHASE4E-008 | Shared `idempotency_key` generator + fake purchase-intent (PHASE4D-004 §3, IDEM-G-*) | PHASE4E-002, PHASE4E-007 | Pure generator; no propagation yet. |
| PHASE4E-009 | Fake payment callback adapter + propagation (PHASE4D-004 §5, IDEM-P-*, IDEM-D-*) | PHASE4E-008, PHASE4E-005, PHASE4E-006 | Wires callback → grant → audit; same-episode return. |
| PHASE4E-010 | Paid CTA wiring on first locked episode (CTA-01..CTA-06) + same-episode return | PHASE4E-007, PHASE4E-008, PHASE4E-009 | Final integration of slice 2. |
| PHASE4E-011 | Reviewer gate for Phase 4E first conversion-flow slice | PHASE4E-002..PHASE4E-010 each APPROVE | Independent reviewer; package-level verdict. |

No card in this list authorizes production infrastructure, real provider integration, video work, expiry / catalog-scope / refund-revoke UI, or Phase 4E beyond fake-only bounds. Each card must restate the §6 hard stops in its own charter.

---

End of PHASE4E-001 requirements artifact.
