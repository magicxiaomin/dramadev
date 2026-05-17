# Phase 4C Spike 2 — Entitlement State-Machine Contract

Status: spike spec / reviewer input
Verdict: REVISE before implementation; safe to prototype only as fake users, fake transactions, and an in-memory evaluator.
Scope boundary: no real backend, database, login provider, payment provider, production entitlement service, secrets, production analytics, Facebook API, or deployment.

## 1. Purpose

This spike defines the minimum future entitlement contract for SceneFlow's real MVP without building production entitlement infrastructure. It replaces the current mock-only `unlocked=1` URL flag as an authority with a future server-authoritative entitlement decision, while preserving `unlocked=1` only as a post-unlock UX hint for the existing P0 prototype route.

Primary invariant from the PRD:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain without login
-> first locked episode
-> Unlock Drawer
-> paid/login action only after user chooses an unlock action
-> grant/return simulation
-> same episode with unlocked=1 as UX state only
```

Authority rule for any future real/staging entitlement evaluator:

```txt
canWatchEpisode = episode.number <= show.freeEpisodes
  OR entitlementEvaluator(userOrSession, showId, episodeNumber).decision == allow
```

`unlocked=1` must never appear in the authority rule. It can only influence UX copy, toast/display state, or post-return drawer behavior after an already-authorized grant path.

## 2. Evidence reviewed

- `docs/moboreels/real-mvp/spike-plan.md`, Spike 2 requirements.
- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`, especially sections 5.3, 5.6, 6, 7, 8.3, 8.4, 8.6, 11, 12, 13, 14, and 15.
- `docs/moboreels/real-mvp/gap-risk-register.md`, entitlement/payment/auth risks.
- `src/lib/lock.ts`, current mock lock decision.
- `src/lib/query-params.ts`, current `unlocked=1` parsing/building.
- `src/app/variant-b/watch/[showId]/watch-stub.tsx`, current Watch/Unlock Drawer behavior.
- `src/app/variant-b/pass/pass-stub.tsx`, current mock pass return behavior.
- `src/lib/episode-sheet.ts`, current episode sheet unlocked display behavior.

Current repo baseline:

- `src/lib/lock.ts` treats `unlocked` as part of the client-side lock state.
- `src/lib/query-params.ts` parses `unlocked=1` into `query.unlocked` and can build return URLs with `unlocked=1`.
- `WatchStub` uses the flag for mock UX, including `lockState`, post-unlock copy, episode sheet unlocked display, and progress/playback state.
- This is acceptable only for the static P0 prototype. It is not acceptable as any future real/staging authority model.

## 3. Contract principles

1. Free-preview-first: anonymous users can watch episodes `1..show.freeEpisodes` without login, payment, prompts, or entitlement checks beyond story metadata.
2. Server-authoritative later: locked episode access must be decided by a trusted evaluator using user/session identity and entitlement records, not by query params or local client state.
3. Same-episode return: grant, cancel, failure, restore, and revoke outcomes always return to the same `showId` and `episode`; never Home.
4. Idempotent grants: duplicate payment/auth/callback retries must not create duplicate entitlements, duplicate coin debits, or conflicting audit events.
5. Explicit revocation: refunds, chargebacks, manual support reversals, or expired passes change future access decisions and are visible in audit history.
6. Mock-only now: Phase 4C may define contracts and use in-memory fake fixtures only; it must not introduce real persistence, services, webhooks, or production users.

## 4. State model

States to model in the fake evaluator:

| State | Meaning | Access to free episodes | Access to locked target episode |
| --- | --- | --- | --- |
| `anonymous_preview` | No logged-in user; ad/free preview flow only. | Allow. | Deny; show locked state and Unlock Drawer. |
| `logged_in_no_entitlement` | Fake logged-in user exists but has no matching grant. | Allow. | Deny; show locked state and Unlock Drawer. |
| `single_episode_granted` | Fake entitlement grants one `showId + episodeNumber`. | Allow. | Allow only for that exact episode. |
| `story_pass_granted` | Fake entitlement grants a story-scoped pass. | Allow. | Allow for all locked episodes in that show, subject to status/expiry. |
| `revoked_refunded` | Matching entitlement was revoked/refunded/charged back/manual-support reversed. | Allow. | Deny; show clear revoked/refunded locked state if needed. |
| `expired_pass` | Time-scoped pass exists but `expiresAt` is in the past. | Allow. | Deny; show expired-pass path if time-scoped pass remains in product scope. |
| `duplicate_grant_retry` | Same idempotency key/transaction is received again. | Depends on current active entitlement. | Must be same decision as the first successful grant; no duplicate grant. |

## 5. Fake data only

Use only deterministic fake entities in local tests or a throwaway evaluator. Example fixtures:

```ts
type FakeUser = {
  id: 'fake_user_anon' | 'fake_user_001' | 'fake_user_refunded';
  kind: 'anonymous' | 'logged_in';
};

type FakeTransaction = {
  id: string;                 // e.g. fake_txn_ep6_001
  idempotencyKey: string;     // e.g. fake_idem_user001_showA_ep6
  userId: string;
  showId: string;
  episodeNumber?: number;
  offerId: string;
  status: 'pending' | 'succeeded' | 'failed' | 'cancelled' | 'refunded';
  createdAt: string;
};

type FakeEntitlement = {
  id: string;
  userId: string;
  showId: string;
  episodeNumber?: number;     // present for single-episode grants
  scope: 'single_episode' | 'story_pass';
  sourceTransactionId: string;
  status: 'active' | 'revoked' | 'expired';
  grantedAt: string;
  expiresAt?: string;         // only if Story Pass becomes time-scoped
  revokedAt?: string;
  revokeReason?: 'refund' | 'chargeback' | 'manual_support' | 'test_reset';
};
```

Do not create a database table, migration, API route, auth provider, payment provider, webhook endpoint, or persistent production store for this spike.

## 6. Future minimum data contract

These are contract shapes for a later architecture plan, not implementation approval.

### `User`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Server-generated opaque ID; no real PII in this spike. |
| `status` | Yes | `anonymous_session`, `registered`, `disabled`, `deleted`. |
| `createdAt` | Yes | Audit/debug only. |
| `lastSeenAt` | Later | Not needed for fake evaluator unless tests need restore semantics. |

### `Show`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Matches route `[showId]`. |
| `title` | Yes | Original/cleared title only. |
| `freeEpisodes` | Yes | Defines free-preview boundary. |
| `totalEpisodes` | Yes | Bounds episode validation. |
| `availabilityStatus` | Later | Future content rights/region checks; do not implement now. |

### `Episode`

| Field | Required | Notes |
| --- | --- | --- |
| `showId` | Yes | Parent show. |
| `episodeNumber` | Yes | Positive integer within `totalEpisodes`. |
| `title` | Optional | Original placeholder in P0. |
| `storyHook` | Optional | UX only; not authority. |
| `availabilityStatus` | Later | Future content gating, separate from entitlement. |

### `Offer`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Stable offer ID for single EP or story pass. |
| `showId` | Yes | Story-scoped offer boundary. |
| `scope` | Yes | `single_episode` or `story_pass`. |
| `episodeNumber` | Conditional | Required for single-episode offers. |
| `priceKind` | Yes | `fake_coins` in this spike only. |
| `amount` | Yes | Fake amount only; no real currency. |
| `duration` | Open | Required only if Story Pass becomes time-scoped. |

### `Transaction`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Fake transaction ID in this spike. |
| `idempotencyKey` | Yes | Must be unique for the user/offer/attempt. |
| `userId` | Yes | Fake user only. |
| `offerId` | Yes | Links grant intent to offer. |
| `status` | Yes | `pending`, `succeeded`, `failed`, `cancelled`, `refunded`. |
| `provider` | Yes | `fake_payment_adapter` only in Phase 4C. |
| `providerReference` | No | Fake reference only; no real processor IDs. |

### `Entitlement`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Opaque entitlement ID. |
| `userId` | Yes | Owner. |
| `showId` | Yes | Story boundary. |
| `episodeNumber` | Conditional | Required for single-episode grant; absent for story pass. |
| `scope` | Yes | `single_episode` or `story_pass`. |
| `sourceTransactionId` | Yes | Links back to the fake transaction. |
| `status` | Yes | `active`, `revoked`, `expired`. |
| `grantedAt` | Yes | Required for audit. |
| `expiresAt` | Conditional | Only for time-scoped pass. |
| `revokedAt` / `revokeReason` | Conditional | Required when revoked. |

### `EntitlementAuditEvent`

| Field | Required | Notes |
| --- | --- | --- |
| `id` | Yes | Append-only event ID. |
| `entitlementId` | Conditional | Present after entitlement creation. |
| `transactionId` | Conditional | Present for grant/payment-related events. |
| `userId` | Yes | Fake user in this spike. |
| `eventType` | Yes | `grant_requested`, `grant_succeeded`, `duplicate_grant_ignored`, `restore_checked`, `revoke_succeeded`, `expired_checked`, `access_allowed`, `access_denied`. |
| `idempotencyKey` | Conditional | Required for grant/retry events. |
| `createdAt` | Yes | Ordered audit trail. |
| `reason` | Optional | Human-readable debug reason; no secrets/PII. |

## 7. Evaluator contract

Future production shape, exercised only as a fake local function in this spike:

```ts
type EntitlementDecision = {
  decision: 'allow' | 'deny';
  reason:
    | 'free_episode'
    | 'active_single_episode_entitlement'
    | 'active_story_pass_entitlement'
    | 'anonymous_locked_episode'
    | 'no_matching_entitlement'
    | 'revoked_entitlement'
    | 'expired_entitlement'
    | 'invalid_episode_or_show';
  authority: 'story_freeEpisodes' | 'entitlement_evaluator';
  entitlementId?: string;
};

function evaluateAccess(input: {
  userId?: string;
  showId: string;
  episodeNumber: number;
  urlUnlockedFlag?: boolean; // accepted only for telemetry/debugging in fake tests; ignored by authority
}): EntitlementDecision;
```

Rules:

1. If `episodeNumber <= show.freeEpisodes`, return `allow/free_episode/story_freeEpisodes` even for anonymous users.
2. If `episodeNumber > show.freeEpisodes` and no logged-in/fake user exists, return `deny/anonymous_locked_episode/entitlement_evaluator`.
3. If a matching active single-episode entitlement exists for exactly `showId + episodeNumber`, allow.
4. If a matching active story pass exists for `showId`, allow all locked episodes in that show.
5. If the only matching entitlement is revoked, deny even if `urlUnlockedFlag` is true.
6. If the only matching pass is expired, deny even if `urlUnlockedFlag` is true.
7. If `urlUnlockedFlag` is true but no active entitlement exists, deny. Record a debug/audit event only in fake/staging tests.

## 8. State transition table

| Event | From state | To state | Access result | Idempotency/audit requirement |
| --- | --- | --- | --- | --- |
| Land on EP1 from ad | none | `anonymous_preview` | Allow if episode <= `freeEpisodes`. | No user/login/payment event. |
| Continue to first locked EP | `anonymous_preview` | `anonymous_preview` locked | Deny locked episode; open Unlock Drawer. | Must preserve `showId`, `episode`, source/attribution. |
| Fake login after paid CTA | `anonymous_preview` | `logged_in_no_entitlement` | Deny until grant succeeds. | Return to same locked EP, drawer can reopen. |
| Fake single-EP grant success | `logged_in_no_entitlement` | `single_episode_granted` | Allow exact episode only. | Create one entitlement and one `grant_succeeded` audit event for idempotency key. |
| Duplicate single-EP grant callback | `single_episode_granted` | `single_episode_granted` | Allow exact episode only. | No second entitlement/debit; append `duplicate_grant_ignored`. |
| Fake Story Pass grant success | `logged_in_no_entitlement` | `story_pass_granted` | Allow all locked episodes for the same show. | Create one story-scoped entitlement. |
| Duplicate Story Pass grant callback | `story_pass_granted` | `story_pass_granted` | Same as original pass decision. | No duplicate entitlement/debit. |
| Revoke/refund single EP | `single_episode_granted` | `revoked_refunded` | Deny locked target episode after revocation. | Preserve original grant event; append revoke event and reason. |
| Revoke/refund Story Pass | `story_pass_granted` | `revoked_refunded` | Deny locked episodes previously covered by pass. | Append revoke event; do not delete history. |
| Expire time-scoped pass | `story_pass_granted` | `expired_pass` | Deny locked episodes after `expiresAt`. | Append/check expiry event; open question if pass is time-scoped. |
| Restore/login on another device | `logged_in_no_entitlement` | matching active grant state if found | Allow only if active entitlement exists. | `restore_checked` audit event; URL flag ignored. |
| Logout | any logged-in state | `anonymous_preview` | Free episodes allow; locked episodes deny. | Do not destroy entitlement; association remains with user account. |
| Login again | `anonymous_preview` | matching active grant state if found | Allow according to active entitlement. | Restore check uses account entitlements, not URL/local state. |

## 9. URL/local-state authority test matrix

This matrix is the proof obligation that `unlocked=1` is UX only.

| Case | User/session | URL | Stored/fake entitlement | Expected decision | Why |
| --- | --- | --- | --- | --- | --- |
| Free EP anonymous | anonymous | `/watch/show-a?episode=1` | none | Allow | Episode <= `freeEpisodes`. |
| Free EP with forged flag | anonymous | `/watch/show-a?episode=1&unlocked=1` | none | Allow | Free boundary, not flag. |
| Locked EP anonymous | anonymous | `/watch/show-a?episode=6` | none | Deny | Locked and no entitlement. |
| Locked EP forged flag | anonymous | `/watch/show-a?episode=6&unlocked=1` | none | Deny | URL flag ignored by authority. |
| Locked EP localStorage forged | logged in | `/watch/show-a?episode=6` | none; localStorage says unlocked | Deny | Local client state ignored by authority. |
| Exact single EP grant | fake_user_001 | `/watch/show-a?episode=6` | active EP6 entitlement | Allow | Matching active entitlement. |
| Single EP grant wrong episode | fake_user_001 | `/watch/show-a?episode=7&unlocked=1` | active EP6 entitlement | Deny | Exact-episode scope does not leak. |
| Story Pass same show | fake_user_001 | `/watch/show-a?episode=12` | active show-a story pass | Allow | Story-scoped active pass. |
| Story Pass other show | fake_user_001 | `/watch/show-b?episode=6&unlocked=1` | active show-a story pass | Deny | Show scope does not leak. |
| Revoked grant with flag | fake_user_refunded | `/watch/show-a?episode=6&unlocked=1` | revoked EP6 entitlement | Deny | Revocation wins over UX flag. |
| Expired pass with flag | fake_user_001 | `/watch/show-a?episode=10&unlocked=1` | expired story pass | Deny | Expiry wins over UX flag. |
| Duplicate grant retry | fake_user_001 | return to EP6 | existing active EP6 entitlement + same idempotency key | Allow; no duplicate | Idempotency replay returns original result. |
| Cancel/failure callback | fake_user_001 | return to EP6 | transaction cancelled/failed; no entitlement | Deny | Payment/auth state alone is not access. |

Acceptance for this spike: every fake evaluator test above must pass before any later implementation plan claims the entitlement contract is ready.

## 10. Same-episode return behavior

The entitlement decision must compose with the PRD's route behavior:

| Scenario | Return route | Drawer/playback state | Authority source |
| --- | --- | --- | --- |
| Free episode chain | `/variant-b/watch/[showId]?episode=[freeEpisode]&source=facebook` | Playback available. | `show.freeEpisodes`. |
| Locked EP before grant | `/variant-b/watch/[showId]?episode=[lockedEpisode]&source=facebook` | Locked state; Unlock Drawer opens. | Evaluator denies. |
| Fake grant success | `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1&source=facebook` | Post-unlock UX can show success/continue copy. | Evaluator allows due to fake active entitlement, not URL flag. |
| Fake grant duplicate retry | Same as original success route. | Same success state; no duplicate debit/grant. | Existing entitlement by idempotency key. |
| Fake cancel/failure | `/variant-b/watch/[showId]?episode=[lockedEpisode]&source=facebook` | Locked state; no network-error copy. | Evaluator denies. |
| Fake revoke/refund after prior success | `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1&source=facebook` may be present in stale browser history. | Must show locked/revoked state in real/staging evaluator. | Evaluator denies revoked entitlement; URL flag ignored. |

P0 static prototype may continue to display `unlocked=1` as mock success. Any later staging/real entitlement evaluator must be allowed to override that display if authority denies access.

## 11. Hidden dependencies

- Auth identity boundary: paid actions need a stable fake user for Phase 4C and a real user/session design later. Free preview must remain anonymous.
- Payment callback contract: grants should originate from a fake payment adapter in Phase 4C; real Stripe/app-store/webhooks remain unapproved.
- Story Pass semantics: duration, account scope, restore rules, refund behavior, and cross-device rules remain product/legal decisions.
- Support/refund operations: revocation reasons and audit history are required before real money.
- Content availability: entitlement is not the only gate; future content rights/region/availability checks must be separate from payment ownership.
- Metrics: entitlement-granted events can be named for staging only; production analytics/Meta integration is not approved.

## 12. Risks and mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| `unlocked=1` accidentally ships as real access control. | Critical | Delete/ignore URL flag from authority path; add tests where forged flag is denied. |
| Duplicate payment callback grants multiple entitlements or debits. | Critical | Make `idempotencyKey` required for transactions/grants; duplicate callbacks return prior result. |
| Story Pass scope leaks across unrelated shows. | High | Require `showId` on every offer/transaction/entitlement and test cross-show denial. |
| Revoked/refunded users keep stale access from browser history. | High | Authority checks current entitlement status on every locked episode access. |
| Login introduced before EP1/free chain. | High | Add tests for anonymous EP1 through `freeEpisodes` access. |
| Pass expiry is unclear. | Medium | Keep `expiresAt` optional and block real implementation until product selects non-expiring vs time-scoped pass. |
| Fake audit data becomes production schema by accident. | Medium | Mark all fake IDs and fixtures as staging-only; architecture review required before persistence. |

## 13. Missing acceptance criteria / tests

Add these to the later implementation plan before any code beyond a throwaway fake evaluator:

1. Anonymous EP1 and all `episode <= freeEpisodes` are allowed without login.
2. Anonymous locked episode is denied even with `unlocked=1`.
3. Logged-in fake user without entitlement is denied even with `unlocked=1` or localStorage mutations.
4. Single-episode grant allows exactly one `showId + episodeNumber`.
5. Story Pass grant allows locked episodes in the same story and denies other stories.
6. Duplicate grant callback with the same idempotency key does not create a second entitlement/audit grant/debit.
7. Cancelled/failed payment returns to the same locked episode and grants no entitlement.
8. Revoke/refund denies future access even from a stale `unlocked=1` URL.
9. Expired pass denies future access if time-scoped pass remains in scope.
10. Logout returns the browser to anonymous preview behavior; login/restore re-evaluates account entitlements.
11. Every decision returns a machine-readable reason for QA and support debugging.
12. No test creates or requires a real database, real backend, real auth provider, real payment provider, real production user, production analytics, or Facebook API.

## 14. Infrastructure boundary check

Allowed for this spike:

- Markdown contract/spec.
- In-memory fake evaluator pseudocode or tests, if a later dev task asks for executable evidence.
- Fake users, fake transactions, fake entitlement records, and fake audit events.
- Local/staging-only route/evaluator matrix.

Not allowed for this spike:

- Real backend/API/database/migration/ORM.
- Production entitlement service or wallet ledger.
- Real login/auth/OAuth/OTP/email provider.
- Real payment/subscription/Stripe/app-store purchase/webhook.
- Real Facebook Pixel/CAPI/API or production analytics endpoint.
- Production secrets, DNS/cutover, deployment, R2/storage/CDN/video pipeline.
- Competitor/licensed/uncleared content assets.

## 15. Recommended plan edits

1. Rename any future `unlocked` authority variable to `hasDisplayUnlockHint` or equivalent in client code, and reserve `entitlementDecision` for authoritative access.
2. Add a fake evaluator interface before any fake payment callback task so grant/cancel/failure/revoke paths all call the same decision contract.
3. Require an idempotency key on every fake transaction/grant event; make duplicate callback tests mandatory.
4. Split entitlement decisions from content availability decisions; do not use payment entitlement to imply rights/region/media availability.
5. Keep Story Pass duration/scope as an explicit open product/legal question until resolved.
6. Add stale browser history tests where `unlocked=1` remains present after revoke/expiry and access is denied.
7. Preserve the same-episode return path across auth/payment/entitlement outcomes before adding any production runtime.

## 16. Safe next step

Create a dev-owned throwaway fake evaluator test spike that implements only the matrix in section 9 using in-memory fixtures. The evaluator should run locally, use fake IDs only, and produce a reviewer-readable pass/fail report. Do not wire it into a real route, backend, database, auth provider, payment provider, or production analytics.

## 17. Stop conditions

Stop and request explicit approval if a follow-up task proposes or requires:

- Treating `unlocked=1`, localStorage, cookies, or client-only state as authoritative access.
- Any real database/backend/API/entitlement/wallet ledger implementation.
- Any production user accounts, login provider, payment provider, subscription, Stripe/app-store purchase, receipt, refund, chargeback, or webhook.
- Any production analytics, Facebook/Meta Pixel/CAPI/API, secrets, deployment, DNS/cutover, or public traffic.
- Removing mock/staging disclaimers or replacing legal/payment/pass/refund copy without product/legal approval.
- Using licensed, competitor, or otherwise uncleared content assets.

## 18. Go / no-go recommendation

Recommendation: REVISE before implementation.

The contract direction is feasible as a Phase 4C fake-only spike, but it is not ready for real implementation until product resolves Story Pass scope/duration/restore/refund semantics and engineering proves the section 9 matrix with a fake evaluator. The strongest guardrail is mandatory: `unlocked=1` may remain a P0 UX hint, but every future staging/real access decision must come from an entitlement evaluator and must deny forged/stale URL or local state.
