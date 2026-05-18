# Phase 4D — Entitlement Fake-Only Acceptance Criteria (PHASE4D-005)

Verdict: APPROVE for Phase 4D planning package inclusion.

This artifact is planning/docs only. It does not authorize code, executable tests, routes, backend/database work, login, payment, entitlement service, production analytics/Facebook integration, video infrastructure, deployment, secrets, or Phase 4E implementation. Phase 4E remains blocked until PHASE4D-010 returns APPROVE.

## Summary

PHASE4D-005 finalizes the fake-only entitlement acceptance criteria that later Phase 4E cards must implement with deterministic in-memory fixtures and tests. It lifts `phase4d-planning.md` §5 / §6 / §9 into a standalone gate, incorporates the PHASE4D-004 shared `idempotency_key` contract, and applies the resolved PHASE4D-006 Story Pass decisions:

- G-2 = D1: Story Pass is non-expiring per show for P0 fake-only acceptance.
- G-3 = S1: Story Pass is show-scoped; catalog-wide pass behavior is deferred.
- G-4 = R1: restore is account-bound by `fake_user_ref` only.
- G-5 = RR1: revoke/refund is represented only by a manual fake fixture; no user-facing refund flow.

The core invariant remains: `unlocked=1` is a UX hint only. Access authority is always the free-episode boundary or the fake entitlement evaluator decision.

## Evidence reviewed

| Input | Path | Evidence used |
| --- | --- | --- |
| MVP PRD | `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` | P0 route, free preview, locked episode, Unlock Drawer, same-episode unlocked return. |
| Prototype B secondary spec | `docs/moboreels/prototype-b-spec.md` | Secondary context only; PRD remains source of truth. |
| Phase 4D planning gate | `docs/moboreels/real-mvp/phase4d-planning.md` | §5 entitlement criteria, §6 Story Pass options, §8 Phase 4E evidence/test ordering, §9 hard stops and user-decision gates. |
| PHASE4D-004 shared idempotency contract | `docs/moboreels/real-mvp/phase4d-shared-idempotency-key-contract.md` | IDEM-G / IDEM-P / IDEM-D / IDEM-M obligations for generator shape, propagation, duplicates, and missing `fake_user_ref`. |
| Entitlement state-machine spike | `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md` | §7 evaluator contract, §9 URL/local-state authority matrix, §10 same-episode return behavior, §13 missing acceptance tests. |
| PHASE4D-006 PM decision | parent task `t_a22b8ddc` | Accepted D1 + S1 + R1 + RR1; E-09/E-10/E-14 can be final-approved; E-11 formally deferred. |

## Key findings

1. The acceptance matrix is feasible as fake-only planning if it remains limited to deterministic in-memory fixtures and a pure evaluator plus separate fake audit derivation/harness.
2. E-09, E-10, and E-14 can now be final-approved because PHASE4D-006 resolved the Story Pass scope, revoke, and restore gates.
3. E-11 must be formally deferred because PHASE4D-006 selected D1 non-expiring Story Pass. No `expiresAt` logic or expired-pass fixture belongs in P0 fake-only implementation.
4. `unlocked=1`, localStorage, cookies, query params, sessionStorage, IndexedDB, and browser history cannot contribute to an allow decision. They may only influence UX copy/debug after authority has already allowed access.
5. PHASE4D-004’s `idempotency_key` contract is binding for E-12 and all duplicate/no-op acceptance. Duplicate callbacks must not create a second grant, debit, unmarked success event, or distinct success redirect.

## Binding acceptance criteria

### A. Authority rule

The only allowed fake evaluator authority rule is:

```txt
canWatchEpisode = episode.number <= show.freeEpisodes
  OR evaluateAccess(input, fixtures).decision == "allow"
```

`urlUnlockedFlag`, `unlocked=1`, localStorage, cookies, query-string flags, and callback-only client state are never part of this rule.

### B. Evaluator contract

Phase 4E must model the entitlement decision as a pure function over explicit inputs and in-memory fixtures:

```txt
evaluateAccess(input, fixtures) -> EntitlementDecision
```

Required properties:

- no I/O;
- no backend/database/API calls;
- no reads from `window.location`, browser storage, clocks, globals, or module-level mutable state;
- no mutation of fixtures;
- deterministic deep-equal output for identical input and fixtures;
- `urlUnlockedFlag` accepted only as debug/telemetry input and excluded from `decision` and `authority`.

Required `EntitlementDecision` shape:

| Field | Required | Allowed values / notes |
| --- | --- | --- |
| `decision` | yes | `allow` or `deny` |
| `reason` | yes | one of the row-specific reasons in §C |
| `authority` | yes | `free_episode`, `active_single_episode_entitlement`, `active_story_pass_entitlement`, `restore_checked`, or `none` |
| `entitlementId` | conditional | present only when an active entitlement is the authority |

### C. Final Phase 4D entitlement rows

Every non-deferred row below is final-approved as a Phase 4E fake-only executable test obligation. Tests must use deterministic fake users, fake shows, fake transactions, fake entitlements, and fake audit events only.

| ID | Scenario | Required fixtures | Expected decision | Required audit / side-effect assertion | Status |
| --- | --- | --- | --- | --- | --- |
| E-01 | Free EP anonymous | anonymous; `show.freeEpisodes=5`; `episode=1` | `allow / free_episode / free_episode` | optional fake access-allowed audit from separate derivation/harness; no auth/payment/idempotency traffic | FINAL |
| E-02 | Free EP with forged `unlocked=1` | anonymous; `episode=1`; `urlUnlockedFlag=true` | same as E-01 | decision deep-equal to E-01 except optional debug fields; `unlocked=1` not authority | FINAL |
| E-03 | Locked EP anonymous | anonymous; `episode=6`; no entitlement | `deny / anonymous_locked_episode / none` | no grant, no payment event, no generated `idempotency_key`; Unlock Drawer may be UX response | FINAL |
| E-04 | Locked EP forged flag | anonymous; `episode=6`; `urlUnlockedFlag=true`; no entitlement | same as E-03 | decision deep-equal to E-03 except optional debug fields; no grant; no generated `idempotency_key` | FINAL |
| E-05 | Locked EP localStorage forged | `fake_user_001`; no matching entitlement; browser/local fixture claims unlocked | `deny / no_matching_entitlement / none` | evaluator ignores local/browser fixture; no grant; no audit mutation inside evaluator | FINAL |
| E-06 | Exact single-EP grant | `fake_user_001`; active entitlement for `show-a + episode=6` | `allow / active_single_episode_entitlement / active_single_episode_entitlement` | entitlement id returned; derived/recorded audit can include `access_allowed`; no new grant on evaluation | FINAL |
| E-07 | Single-EP grant wrong episode | active EP6 entitlement; request `show-a episode=7&unlocked=1` | `deny / no_matching_entitlement / none` | no scope leak; no new grant; flag ignored | FINAL |
| E-08 | Story Pass same show | active story pass for `fake_user_001 + show-a`; request locked `show-a episode=12` | `allow / active_story_pass_entitlement / active_story_pass_entitlement` | pass applies to all locked episodes in same `showId`; no expiry check under D1 | FINAL |
| E-09 | Story Pass other show | active story pass for `show-a`; request `show-b episode=6&unlocked=1` | `deny / no_matching_entitlement / none` | S1 show-scoped pass does not cross shows; flag ignored | FINAL under G-3=S1 |
| E-10 | Revoked grant with flag | revoked single-EP or story-pass fixture for target; `urlUnlockedFlag=true` | `deny / revoked_entitlement / none` | RR1 manual revoke fixture wins over stale URL/history; no restore from revoked entitlement | FINAL under G-5=RR1 |
| E-11 | Expired pass with flag | expired pass fixture | n/a | n/a | DEFERRED under G-2=D1 non-expiring; no expiry fixture, `expiresAt` logic, grace period, renew CTA, or expired-pass UI in P0 fake-only |
| E-12 | Duplicate grant retry | active EP6 entitlement plus replay of same PHASE4D-004 `idempotency_key` | access result remains the original allow for the matching entitlement | exactly one entitlement/grant/debit; exactly one duplicate marker as required by IDEM-D-01..IDEM-D-03 | FINAL; inherits PHASE4D-004 IDEM-D obligations |
| E-13 | Cancel/failure callback | fake transaction cancelled/failed; no entitlement | `deny / no_matching_entitlement / none` | same locked episode return; no `unlocked=1`; no grant; no success audit | FINAL |
| E-14 | Logout / login restore | active entitlement bound to `fake_user_001`; logout returns anonymous; login restores same fake account | anonymous locked access denies; logged-in restore allows via active entitlement | restore is account-bound by `fake_user_ref`; URL flag never restores access | FINAL under G-4=R1 |
| E-15 | Free chain anonymous | anonymous navigation EP1..EP(`freeEpisodes`) from `/variant-b/watch/[showId]?episode=1&source=facebook` | every free episode allows via `free_episode` | zero fake auth, zero fake payment, zero idempotency generation, zero backend/analytics/Facebook traffic | FINAL; must align with PHASE4D-008 FC-01..FC-06 |

### D. Audit-event boundary

Audit/event behavior must be outside the pure evaluator. Phase 4E may pick exactly one fake-only shape:

```txt
deriveEntitlementAuditEvents(input, decision, grantContext) -> EntitlementAuditEvent[]
```

or

```txt
fakeEntitlementHarness.recordDecision(input, decision, grantContext) -> void
```

Acceptance requirements:

- the evaluator itself never appends, pushes, writes, mutates, logs, or persists an audit event;
- audit artifacts are fake/in-memory only;
- every E-row test asserts both the evaluator decision and the derived/recorded audit expectation;
- duplicate/retry rows use `duplicate_grant_ignored` only in the fake derivation/harness, never as evaluator side effect;
- no audit event is sent to production analytics, Meta/Facebook, backend, database, file store, or queue.

### E. PHASE4D-004 idempotency obligations inherited by E-12 and paid-grant rows

The following PHASE4D-004 test IDs are binding for any Phase 4E card that touches entitlement grants, fake payment success, duplicate callbacks, restore, revoke, or paid CTA sequencing:

- IDEM-G-01..IDEM-G-13: canonical generator shape and invalid-input rejection.
- IDEM-P-01..IDEM-P-06: byte-equal propagation and no URL/DOM/attribution leakage.
- IDEM-D-01..IDEM-D-15: duplicate/no-op and mismatch rejection behavior.
- IDEM-M-01..IDEM-M-09: missing-`fake_user_ref` rejection and free-chain no-auth/no-payment proof.

At minimum, E-12 must cite and execute IDEM-D-01, IDEM-D-02, and IDEM-D-03. Any paid success path used by E-06/E-08/E-14 setup must cite IDEM-P-01 and IDEM-P-02. Any anonymous/free-chain row must preserve IDEM-M-06.

## Hidden dependencies

| Dependency | Why it matters | Bound for P0 fake-only |
| --- | --- | --- |
| Fake identity | `idempotency_key` generation requires `fake_user_ref`; restore requires account-bound fake identity. | Fake auth can occur only after paid CTA. Free preview cannot require auth. |
| Story Pass semantics | Scope, duration, restore, and revoke decisions determine E-09/E-10/E-11/E-14. | Resolved to D1/S1/R1/RR1; E-11 deferred. |
| Fake payment callback | Entitlement grants are downstream of fake success/cancel/failure and duplicate behavior. | Contract placeholders only; no provider SDK, public webhook, server runtime, persistence, or real payment. |
| Route builder | Same-episode return must survive auth/payment/grant/cancel/failure/revoke. | Use approved central route builder / fake harness equivalent only; no generic query passthrough. |
| Event taxonomy | Duplicate/no-op and `same_episode_resumed` are audit/evidence obligations. | Local/staging fake events only; no production analytics or Facebook/Meta traffic. |
| Free-chain test sequencing | Free preview is the acquisition-critical P0 path. | FC tests precede other Phase 4E artifacts; entitlement rows cannot introduce auth/payment before free preview. |

## Risks and mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| `unlocked=1` becomes authority via convenience checks. | Critical | E-02/E-04/E-05/E-07/E-09/E-10/E-14 all include forged/stale flag denial or non-authority assertions. |
| Story Pass leaks across shows. | High | E-09 final-approved under S1 show-scoped pass; catalog scope is deferred and disallowed. |
| Expiry work creeps into P0 despite D1. | Medium | E-11 formally deferred; `expiresAt`, grace periods, renewals, and expired-pass UI are stop conditions for P0. |
| Duplicate callback creates multiple entitlements/debits/events. | Critical | E-12 inherits PHASE4D-004 IDEM-D rows; byte-equal duplicate returns original route and creates no second grant/debit. |
| Fake audit harness becomes accidental persistence. | High | Audit is separate from evaluator and fake/in-memory only; no database/file/network writes. |
| Restore becomes receipt/login-provider work. | High | E-14 uses account-bound `fake_user_ref` only; no receipt, provider, OAuth, app-store, or real account system. |
| Free preview starts requiring auth because paid CTA requires `fake_user_ref`. | Critical | IDEM-M-06 and E-15 require zero auth/payment/idempotency traffic during free chain. |

## Missing acceptance criteria / tests to carry into Phase 4E

A Phase 4E fake-only implementation card that claims entitlement coverage must include all of the following before reviewer approval:

1. Executable deterministic tests for every FINAL E-row (E-01..E-10, E-12..E-15).
2. A skipped/deferred test marker or planning note for E-11 that cites G-2=D1 non-expiring; it must not implement expiry.
3. Pairwise tests proving `urlUnlockedFlag=true` and `urlUnlockedFlag=false` produce identical authority decisions for E-02/E-04 and any stale flag row.
4. Fixture tests for S1 show scope: `show-a` pass allows `show-a` locked episodes and denies `show-b`.
5. Manual revoke fixture tests for RR1: revoked grant denies future access even with stale `unlocked=1`.
6. Account-bound restore tests for R1: logout anonymous denies locked episode; login as the same `fake_user_ref` restores active entitlement; login as a different fake user denies.
7. Duplicate/no-op tests referencing PHASE4D-004 IDEM-D rows and proving no second entitlement/debit/unmarked success event.
8. Missing-`fake_user_ref` and free-chain no-auth/no-payment tests referencing IDEM-M rows.
9. Audit separation tests proving `evaluateAccess` is pure and audit is derived/recorded separately.
10. Static dependency evidence showing no banned SDKs/runtimes/imports were introduced.
11. Network evidence showing zero backend, Meta/Facebook, production analytics, auth-provider, payment-provider, CDN/video pipeline traffic.
12. URL/DOM snapshots proving no `idempotency_key` appears in Watch/Pass/Episode Sheet URLs or rendered copy.

## Infrastructure boundary check

Allowed in this PHASE4D-005 artifact:

- Markdown planning documentation.
- Fake-only acceptance criteria and test IDs.
- In-memory fixture descriptions using fake users, fake transactions, fake entitlement records, fake audit events.
- Cross-references to existing PRD/spike/Phase 4D docs.

Not allowed in this PHASE4D-005 artifact or any P0 Phase 4E card without later approval:

- real backend, API route, database, ORM, migration, queue, persistent server runtime, entitlement service, wallet, ledger, audit store;
- real login/auth/OAuth/OIDC/SAML/OTP/email/SMS/social provider, session store, production user account, credential store, or secret;
- real payment, subscription, Stripe/app-store/IAP, receipt, refund, chargeback, webhook, provider SDK, billing/tax data;
- real Meta Pixel/CAPI/Facebook SDK/Graph/Marketing API or production analytics vendor;
- real CDN/storage/video ingest/transcoding/DRM/captioning/signed playback URL pipeline;
- production deployment, DNS/cutover, production secrets, public service, real-user traffic;
- licensed, competitor, scraped, user-uploaded-without-rights, or otherwise uncleared content assets;
- legal/payment/subscription/refund/cancellation/tax/privacy copy finalization;
- treating `unlocked=1`, localStorage, cookies, query params, or client-only state as authoritative entitlement.

## Recommended plan edits

1. In `phase4d-planning.md` §5.2, update E-09/E-10/E-14 status from decision-gated draft to final-approved under S1/RR1/R1, and mark E-11 explicitly deferred under D1 if the master planning file is later refreshed.
2. In Phase 4E cards, name `urlUnlockedFlag` or `hasDisplayUnlockHint` only as debug/UX input; never name a variable as if it grants access.
3. Keep `evaluateAccess` pure and create a separate fake-only audit derivation/harness task; do not combine decision and audit mutation.
4. Make the first entitlement implementation task test-only: add E-row fixtures and failing tests before route wiring or Drawer behavior changes.
5. Cross-reference PHASE4D-004 §8 in any entitlement grant/duplicate card rather than duplicating or weakening IDEM-* rows.
6. Keep E-11 out of P0 implementation. If product later selects D2/D3, require a new planning card for expiry semantics before any code.
7. Preserve same-episode return for success, duplicate, cancel, failure, restore, and revoke; never route post-unlock users to Home or Pass by default.

## Phase 4E fake-only acceptance criteria and hard stops

Before any Phase 4E fake-only entitlement card can be approved, it must produce:

- executable tests for every FINAL E-row;
- explicit E-11 deferral evidence under D1;
- IDEM-* evidence inherited from PHASE4D-004 where applicable;
- route/URL evidence that same-episode context is preserved;
- network and dependency evidence proving no real providers or production infrastructure;
- reviewer-readable fixture dumps for representative allow, deny, restore, revoke, duplicate, and free-chain cases;
- confirmation that Phase 4E was not opened before PHASE4D-010 APPROVE.

Hard stops for Phase 4E entitlement work:

- any real backend/database/API/service/persistence/queue/ORM/migration;
- any real auth/payment/Facebook/analytics/video/CDN/provider SDK or secret;
- login/payment/pass/recharge/PWA prompt before free preview;
- returning success/cancel/failure/restore/revoke to Home, Search, Show Detail, or generic Pass instead of the same locked episode;
- treating `unlocked=1` or browser/client state as access authority;
- generating or accepting an `idempotency_key` without valid `fake_user_ref`;
- implementing expiry/E-11 under D1 non-expiring without a new product decision;
- using catalog-scoped Story Pass fixtures in P0;
- adding self-serve refund/revoke UI in P0;
- persisting fake audit/entitlement data beyond in-memory deterministic fixtures;
- beginning implementation before PHASE4D-010 returns APPROVE.

## Safe next step

Proceed to PHASE4D-008 (free-chain anonymous test plan) and PHASE4D-010 reviewer preparation. Do not open Phase 4E implementation until PHASE4D-010 approves the full Phase 4D planning package.

## Stop conditions

Stop and request explicit user approval if any follow-up proposes:

- changing D1/S1/R1/RR1 defaults for P0;
- reactivating E-11 expiry behavior;
- broadening Story Pass outside one `showId`;
- making restore receipt-bound or provider-bound;
- adding refund/revoke UI;
- weakening PHASE4D-004 `idempotency_key` requirements;
- moving fake auth before free preview;
- introducing any production infrastructure or real provider boundary.

End of PHASE4D-005 entitlement fake-only acceptance criteria.
