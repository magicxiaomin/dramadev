# Phase 4D Feasibility Challenge — PHASE4D-002

Verdict: REVISE

Approval posture: Phase 4D planning direction is mostly feasible and stays inside the intended fake-only/documentation boundary, but `docs/moboreels/real-mvp/phase4d-planning.md` should be revised before it becomes the downstream planning-gate contract. The current draft contains several contradictions and hidden implementation dependencies that could push later cards into server/runtime/persistence assumptions or impossible test sequencing.

This verdict does not authorize implementation. It does not authorize real auth, real payment, real backend/database, production analytics/Facebook integration, production video/CDN/storage, production deployment/DNS/secrets, NovelHub production infrastructure, licensed/competitor assets, or final legal/payment/subscription/refund/cancellation/tax/consent copy.

## Summary

The Phase 4D plan correctly carries forward the P0 route invariant, `unlocked=1` as UX hint only, attribution harmonization, callback-key convergence, shared idempotency, Story Pass open decisions, sample asset gates, free-chain tests, and 390 x 844 locked-vs-error evidence. However, it is not yet safe as a gate contract because it mixes planning-only language with implementation-blocking requirements, implies server-built callback/intent records in a fake-only phase, conflicts with its own pure evaluator requirement by requiring audit-event append side effects, and makes executable tests appear to pre-exist before any implementation card can begin.

Recommended disposition: REVISE the planning document, then re-review before allowing PHASE4D-003+ planning cards to depend on it.

## Evidence reviewed

- `docs/moboreels/real-mvp/phase4d-planning.md`
- `docs/moboreels/real-mvp/artifacts/phase4c-007-claude-review.md`
- `docs/moboreels/real-mvp/spike-review-package.md`
- `docs/moboreels/real-mvp/spikes/auth-return-path-contract.md`
- `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md`
- `docs/moboreels/real-mvp/spikes/fake-payment-callback.md`
- `docs/moboreels/real-mvp/spikes/safe-video-boundary.md`
- `docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md`
- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- `src/lib/query-params.ts`
- `src/lib/query-params.test.ts`

## Key findings

### 1. Fake payment callback matrix implies server/runtime/persistence concepts

Severity: blocker before downstream implementation planning

Evidence:
- Phase 4D plan §4.2 says `/fake-payment/start` stores purchase context in an "intent record" and `/fake-payment/callback` uses `return_to` as a "server-built URL".
- Fake payment spike §3, §5.2, §12, §14, and §17 forbid real webhook/public callback, backend, database, persistent service, provider SDK, payment secret, or server runtime.
- Phase 4D plan §1.2 also forbids real backend, database, queue, persistent server runtime, public service, and public callback URL.

Why this matters:
The words "server-built" and "intent record" are likely to be interpreted by implementation agents as permission to add API routes, server state, DB tables, queues, or persistent callback storage. That is out of P0 and conflicts with the fake-only/static baseline.

Required revision:
Replace the callback matrix language with fake-only wording:
- `purchase_intent` is an in-memory/test-fixture/local-session object only, not a backend record.
- `return_to` is constructed by the approved route builder or a fake-only test harness equivalent, not by a production server.
- `/fake-payment/*` route names are contract placeholders and may not imply public webhook endpoints, server runtime, persistent service, or deployment.
- Any implementation needing server state, public callback URLs, provider SDKs, secrets, or persistence is a stop condition.

### 2. Entitlement evaluator is declared pure, but also required to append audit events

Severity: blocker before PHASE4D-005 acceptance criteria are used

Evidence:
- Phase 4D plan §5.3 says the fake evaluator must be pure, deterministic, have no I/O, no side effects, and no `window.location` reads.
- Phase 4D plan §5.4 says "for every test row above, the evaluator appends a `EntitlementAuditEvent`."
- Entitlement spike §7 defines `evaluateAccess` as a decision function; §8 and §13 require audit behavior but do not require the pure decision function itself to mutate state.

Why this matters:
A pure evaluator cannot append events. If downstream tasks follow both statements literally, they will either violate purity or create hidden mutable state. Hidden mutable state is exactly the kind of accidental fake persistence that can drift toward a real service/database.

Required revision:
Split the contract into two components:
- `evaluateAccess(input, fixtures) -> EntitlementDecision` is pure and side-effect-free.
- `deriveEntitlementAuditEvents(input, decision, grantContext) -> EntitlementAuditEvent[]` or a fake harness wrapper records in-memory audit events for tests.

Acceptance criteria should assert both the decision and returned/derived audit events without requiring the evaluator to append to external state.

### 3. Test sequencing is internally impossible as written

Severity: blocker / planning contradiction

Evidence:
- Phase 4D plan §8 says tests "must exist before any fake-only implementation begins" and that each gate is a planning gate.
- §5.2 requires executable deterministic fake-evaluator tests against in-memory fixtures.
- §8.1 says free-chain anonymous tests are highest priority and must precede any other implementation.
- Phase 4D itself says no routes/services/tests are created (§3, §5, §8).

Why this matters:
Executable tests cannot exist before any implementation card is allowed to begin unless a separate test-only implementation card is authorized. The current wording risks deadlock: no implementation can start until tests exist, but tests require a test harness, route harness, fixtures, and likely code changes.

Required revision:
Clarify the gate ordering:
- Phase 4D cards produce test plans, required test IDs, fixture definitions, route matrices, and evidence formats only.
- Phase 4E fake-only implementation cards must start with test creation as the first implementation step, before feature wiring or route behavior changes.
- No Phase 4E card may be approved until those executable tests exist and pass.
- Free-chain tests should be the first Phase 4E test artifact, not a pre-existing artifact that blocks opening Phase 4E.

### 4. User-decision gates vs recommended defaults are ambiguous

Severity: blocker if unresolved before dependent planning cards

Evidence:
- Phase 4D plan §6 recommends defaults for Story Pass duration/scope/restore/revoke, but says PHASE4D-006 is a user-decision gate.
- §9.2 says G-2 through G-5 must be explicitly answered before downstream cards.
- §10 recommends PHASE4D-005 before PHASE4D-006, while PHASE4D-005 includes E-09, E-10, E-11, and E-14 rows whose fixture semantics depend on Story Pass scope, revoke, expiry, and restore choices.

Why this matters:
Downstream planners may treat the recommended defaults as approved product decisions, or may block because the user has not explicitly answered them. Either interpretation can cause churn.

Required revision:
State one of these policies explicitly:
- Policy A: defaults D1/S1/R1/RR1 are accepted for fake-only Phase 4E unless the user overrides them in PHASE4D-006; or
- Policy B: PHASE4D-006 must complete before PHASE4D-005 can finalize fixtures for E-09/E-10/E-11/E-14.

Recommended edit: choose Policy B for clarity, or mark PHASE4D-005 as draftable but not approvable until PHASE4D-006 resolves G-2 through G-5.

### 5. PHASE4D-010 dependency state is too weak

Severity: watch item

Evidence:
- Phase 4D plan §3 says PHASE4D-010 depends on PHASE4D-002..PHASE4D-009 all in REVIEW state.
- §106 says Phase 4E is not opened until PHASE4D-010 returns APPROVE.

Why this matters:
"In REVIEW state" is weaker than "approved" or "accepted." The reviewer gate should not run against cards that are merely waiting for review or still blocked by user decisions.

Recommended revision:
Change PHASE4D-010 dependency to: PHASE4D-002..PHASE4D-009 completed/approved, with any user-decision gates explicitly answered or marked deferred within fake-only bounds. If a board workflow requires REVIEW state, state that PHASE4D-010 may inspect drafts but cannot approve Phase 4D until every predecessor has reviewer approval or explicit deferral.

### 6. Callback-key matrix needs concrete value-domain/test obligations for current route parser gaps

Severity: watch item, can become blocker for PHASE4D-003

Evidence:
- Current `src/lib/query-params.ts` parses only `episode`, `unlocked`, and attribution on Watch; it does not parse `purchase_status`, `auth_result`, `drawer`, `drawer_intent`, `fake_user`, `idempotency_key`, or callback keys.
- Phase 4D plan §4.2 lists those keys in allowed inbound/outbound matrices but does not make parser/builder test obligations explicit.
- `src/lib/query-params.test.ts` currently covers attribution and unlocked return URLs only.

Why this matters:
If PHASE4D-003 is not explicit, implementation may hand-assemble query strings or broaden query passthroughs to preserve callback context. That would undermine the allow-list and route-builder authority goals.

Recommended revision:
For PHASE4D-003, require a test matrix for every callback key:
- accepted surfaces;
- allowed values/domain;
- max length;
- branch where it may appear;
- whether it may be emitted back to Watch;
- what happens on unknown, duplicate, malformed, or overlong values;
- whether route helpers parse/build it or explicitly drop it.

Do not allow `window.location` passthrough or generic `URLSearchParams(currentLocation)` copying.

### 7. Idempotency key shape has an unresolved pre-auth identity dependency

Severity: watch item / hidden dependency

Evidence:
- Phase 4D plan §4.3 recommends `idempotency_key = "fake_idem_" + fake_user_ref + "_" + show_id + "_" + intent_scope`.
- Auth spike allows paid actions to trigger fake auth after the CTA; fake payment spike says `fake_user_ref` is optional in purchase intent.
- PRD requires no login before free preview, and login only after paid action.

Why this matters:
If the key requires `fake_user_ref`, planners must decide whether fake auth always precedes fake payment, or whether anonymous/session-scoped purchase attempts are possible before fake auth succeeds. Without this, duplicate callback behavior may diverge across auth/payment/entitlement/event surfaces.

Recommended revision:
Add a Phase 4D decision row:
- Required sequence: paid CTA -> fake auth success creates `fake_user_ref` -> fake payment intent; or
- Session-scoped pre-auth key: `fake_session_ref` is used until fake auth binds the intent to `fake_user_ref`.

The safer P0 fake-only default is to require fake auth success before fake payment intent creation whenever a user identity is needed for entitlement grants, while still preserving no-login-before-free-preview.

### 8. Attribution length caps are planned but not tied to existing helper behavior

Severity: watch item

Evidence:
- Phase 4D plan §4.2 recommends string-typed values and 256/128 character caps.
- Auth spike §6.2 recommends a 256-character cap; event spike §7 recommends 128 for attribution.
- Current `src/lib/query-params.ts` copies allow-listed attribution values without length caps.

Why this matters:
Length caps are a security/privacy boundary. If Phase 4D makes caps acceptance criteria, it must specify where the cap is enforced and which cap wins.

Recommended revision:
Make PHASE4D-002 decide one canonical cap for attribution values and require tests for overlong values. Recommended default: 128 characters for attribution, because event taxonomy is the stricter contract. Non-attribution callback state can use 256 characters unless a surface-specific rule is stricter.

### 9. Sample asset gate is correct but PHASE4D-009 needs a no-asset fallback

Severity: watch item

Evidence:
- Phase 4D plan §7 blocks video proof until safe assets are logged.
- §8.7 and §10 still describe V-01..V-06 and PHASE4D-009 as planned after PHASE4D-007.

Why this matters:
If PHASE4D-007 returns "defer sample asset creation," PHASE4D-009 needs a defined terminal state rather than hanging indefinitely.

Recommended revision:
Add acceptance states for PHASE4D-009:
- APPROVE if rights-cleared asset evidence exists and matrix is planned;
- DEFERRED if PHASE4D-007 explicitly defers sample asset creation, with no video proof or playback-provider implementation authorized;
- BLOCKED if an implementation card tries to proceed without rights evidence.

## Hidden dependencies

- Fake payment callback design depends on a fake-only state carrier. The plan must explicitly choose local in-memory/test fixture/session storage behavior and forbid backend/persistence/public webhook interpretation.
- Shared idempotency depends on fake user/session sequencing. Decide whether fake auth is mandatory before fake payment intent creation or whether a session-scoped key exists.
- Entitlement test fixtures depend on Story Pass duration/scope/restore/revoke decisions. Either defaults must be explicitly approved for fake-only use or PHASE4D-006 must precede final PHASE4D-005 approval.
- Callback-key parsing depends on route helper changes/tests later. Without a contract, implementers may use unsafe query passthroughs.
- Test evidence depends on a harness. The planning gate should not demand executable tests before any implementation card can even create the harness.
- Video boundary proof depends on rights-cleared sample assets. Without assets, PHASE4D-009 must be formally deferred rather than quietly unblocked.

## Risks and mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Fake callback language leads to server/API/DB/public webhook work. | Critical | Replace "server-built" and "intent record" with local/fake/test-harness-only wording; add stop condition for runtime/persistence. |
| Pure evaluator gains hidden mutable audit state. | High | Split pure decision from event derivation or fake harness recording. |
| Phase 4E is deadlocked by "tests must exist before implementation." | High | Rephrase as test-first implementation requirement, not pre-open prerequisite. |
| Recommended Story Pass defaults are treated as product/legal approval. | High | Require explicit PHASE4D-006 decision or mark defaults fake-only/deferred with no real-provider effect. |
| Query callback keys become generic passthrough. | High | Require per-surface key/domain/max-length tests and central route helpers. |
| `idempotency_key` cannot be generated consistently before fake auth. | Medium | Define auth/payment ordering or session-bound pre-auth key. |
| Overlong attribution values leak into screenshots/logs/events. | Medium | Canonicalize a strict cap and test truncation/drop behavior. |
| Video proof proceeds with uncleared assets. | Critical | Keep PHASE4D-007 as hard gate and define PHASE4D-009 DEFERRED path. |

## Missing acceptance criteria / tests

Add these to the Phase 4D plan before downstream cards depend on it:

1. A fake-only callback state-carrier criterion: no server, API route, public callback URL, database, queue, persistent service, or deployment is required or implied.
2. A pure-evaluator criterion: access decisions are pure; audit events are returned/derived or recorded only by a fake in-memory harness.
3. A sequencing criterion: Phase 4D produces test plans; Phase 4E starts with executable tests before feature wiring; approval requires passing tests.
4. A Story Pass dependency criterion: PHASE4D-005 fixture rows dependent on pass semantics cannot be final-approved until PHASE4D-006 resolves or explicitly defers them.
5. A callback key matrix with value domains for `purchase_status`, `auth_result`, `drawer`, `drawer_intent`, `fake_user`, `result`, `intent`, `callback_id`, `purchase_intent_id`, `idempotency_key`, `return_to`, `copy_key`, and unknown/overlong keys.
6. A canonical attribution length cap and test expectations for values above the cap.
7. Explicit route-builder tests proving no generic query passthrough and no `window.location`-assembled `return_to`.
8. Idempotency-key tests for duplicate success, delayed success, refresh of unlocked return route, drawer reopen, and cross-intent/cross-episode non-collision.
9. A PHASE4D-009 deferred-state acceptance criterion when sample assets remain unavailable.
10. Network/dependency boundary evidence that fake event capture and free-chain tests add no Meta/Facebook/analytics/backend calls.

## Infrastructure boundary check

Current Phase 4D plan mostly preserves the infrastructure boundary, but the callback section leaks implementation terms that must be tightened.

Allowed after revision:
- Markdown planning contracts.
- Fake-only route/key/test matrices.
- In-memory/test-fixture/local-session state descriptions.
- Local/staging-only event and entitlement test plans.
- Rights-cleared asset evidence planning.

Not allowed:
- Real auth, real payment, provider SDKs, public webhooks, payment secrets, real account/session stores.
- Backend/API/database/ORM/migration/queue/wallet/ledger/entitlement service/persistent public service.
- Production analytics, Meta Pixel, CAPI, Facebook SDK, Graph API, Marketing API, third-party analytics endpoints, backend event ingestion.
- Production CDN/storage/video ingest/transcoding/DRM/signed URLs/vendor decisions.
- Production deployment, DNS/cutover, production secrets, real-user traffic.
- NovelHub production infrastructure.
- Licensed/competitor/scraped/uncleared assets.
- Final legal/payment/subscription/refund/cancellation/tax/consent copy.
- Treating `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, or any client-only state as access authority.

## Recommended plan edits

1. In §4.2, replace "intent record" and "server-built URL" with fake-only local/test-harness terms.
2. In §4.2, add a note that `/fake-payment/*` and `/fake-auth/*` are contract placeholders and not production endpoints or public webhooks.
3. In §5.3–§5.4, split pure entitlement evaluation from audit-event derivation/recording.
4. In §8, rephrase "tests must exist before any fake-only implementation begins" to "Phase 4E implementation must create and pass these tests before feature wiring can be approved."
5. In §6/§9.2/§10, clarify whether Story Pass defaults are accepted for fake-only use or PHASE4D-006 must precede final PHASE4D-005 approval.
6. In §3, change PHASE4D-010 predecessor condition from "all in REVIEW state" to "approved/completed or explicitly deferred within fake-only bounds."
7. In §4.3, define idempotency key behavior before fake auth success, or require fake auth success before fake payment intent creation.
8. In §4.1/§4.2, decide one canonical max length for attribution and callback values, and require overlong-value tests.
9. In §8.7/§10, define PHASE4D-009 DEFERRED if PHASE4D-007 does not produce safe asset evidence.
10. In §8.8, require dependency/static checks as part of evidence so no banned analytics/payment/auth/video packages or backend runtime are introduced.

## Safe next step

Revise `docs/moboreels/real-mvp/phase4d-planning.md` to remove the callback/server-state leakage, fix the evaluator/audit contradiction, clarify test sequencing, and resolve the Story Pass/default dependency ordering. After that revision, run an architect or reviewer gate before downstream Phase 4D planning cards rely on the document.

## Stop conditions

Block immediately if any follow-up proposes:

- Real auth provider, account/session/credential store, production secrets, real login, or real user identifiers.
- Real payment processor, app-store billing, subscription, receipt, refund, chargeback, public webhook, provider SDK, payment account, or payment data collection.
- Backend, database, ORM, migration, queue, wallet, ledger, entitlement service, persistent public service, or NovelHub production infrastructure.
- Meta Pixel, CAPI, Facebook SDK, Graph API, Marketing API, production analytics vendor, backend event collector, production dashboards, real identifiers, or ad feedback loops.
- Production CDN/object storage/video ingest/transcoding/encoding ladder/signed URL/DRM/captioning service or video vendor selection.
- Production deployment, DNS/cutover, production secrets, public traffic, or real-user traffic.
- Licensed, competitor-derived, scraped, user-uploaded-without-rights, or otherwise uncleared assets.
- Final legal/payment/subscription/refund/cancellation/tax/consent/privacy copy.
- Login, payment, pass/recharge, marketing opt-in, or PWA prompt before free preview.
- Returning post-unlock/cancel/failure users to Home, Pass, generic catalog, or a different episode instead of the same locked episode.
- Treating `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, or any client-only callback state as authoritative entitlement.
