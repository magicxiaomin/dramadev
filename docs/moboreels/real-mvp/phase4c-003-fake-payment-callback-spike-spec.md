# SceneFlow Phase 4C-003 — Fake Payment Callback and Purchase-State Spike Spec

Status: Phase 4C spike spec, local/staging only, fake-money only
Verdict: REVISE before implementation planning; GO for a fake-payment simulator spike only after the dependencies and acceptance checks in this document are accepted
Linked plan: `docs/moboreels/real-mvp/spike-plan.md` §4 Spike 3
Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
Secondary planning inputs: `docs/moboreels/real-mvp/spike-plan.md`, `docs/moboreels/real-mvp/prd.md`, `docs/moboreels/real-mvp/architecture.md`

Important boundary: this is a feasibility/spec artifact. It does not authorize or implement Stripe, app-store billing, provider webhooks, real card data, real receipts, real refunds, legal refund/subscription copy, a backend/database, production entitlements, production analytics, Facebook/Meta APIs, deployment, DNS, secrets, or NovelHub production infrastructure.

## 1. Spike question

Given the accepted P0 flow:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain without login
-> first locked episode
-> Unlock Drawer
-> paid CTA only after first locked episode
-> fake payment adapter
-> fake callback / purchase result
-> same locked episode with unlocked=1 as UX state only
```

can SceneFlow model payment success, cancel, failure, duplicate success callbacks, delayed callbacks, and refund/revoke handoff in local/staging without connecting a payment service provider or treating `unlocked=1` as authoritative access?

## 2. Scope

### 2.1 In scope

- Fake payment adapter contract.
- Fake transaction IDs generated locally/staging only.
- Callback payload draft and idempotency requirements.
- Purchase-state matrix for local/staging.
- Same-episode return matrix for every required scenario.
- Placeholder copy clearly marked non-legal and non-production.
- Handoff requirements to the entitlement state-machine spike for grant/revoke simulation.
- Go/no-go recommendation for a later implementation plan.

### 2.2 Out of scope / hard stops

Stop immediately if any plan requires:

- Stripe, app-store billing, PSP SDKs, provider webhooks, provider API calls, or provider dashboard configuration.
- Real card numbers, real payment tokens, real receipts, real invoices, chargebacks, real refunds, or subscription renewal events.
- Legal finalization of refund, cancellation, subscription, tax, receipt, or consumer-protection copy.
- Real backend, database, ledger, wallet, production entitlement service, production analytics, Facebook/Meta API, deployment, DNS, or secrets.
- Treating `unlocked=1` as an authoritative entitlement.

## 3. Source-of-truth constraints to preserve

1. Watch-first route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. Free episodes must play without login, recharge, payment, pass, subscription, or install prompts.
3. The first locked episode is driven by `story.freeEpisodes`.
4. Unlock Drawer at the first locked episode keeps single-episode unlock as primary CTA and Story Pass as secondary CTA.
5. Successful fake unlock/purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
6. Cancel/failure/delayed paths must not return the user to Home, Search, Show Detail, or a generic payment status page.
7. `showId`, `episode`, and safe attribution params must survive the fake payment round trip.
8. `unlocked=1` is UX state only; entitlement authority belongs to Spike 2's fake entitlement evaluator and, later, a real gated service.

## 4. Fake adapter boundary

The fake adapter is a local/staging contract, not a PSP abstraction selected for production.

### 4.1 Proposed fake routes / events

These names are illustrative and must remain local/staging-only:

| Surface | Purpose | Allowed in Phase 4C? | Production meaning |
| --- | --- | --- | --- |
| `POST /fake-payment/start` or client-local equivalent | Create fake payment attempt from Unlock Drawer or Pass page | Yes, fake only | None; future PSP start flow is a separate gate |
| `POST /fake-payment/callback` or test harness equivalent | Simulate a callback result by fake transaction ID | Yes, fake only | None; future PSP webhook contract is separate |
| `GET /variant-b/watch/[showId]?episode=[n]&unlocked=1&purchase_state=success` | Post-success UX return | Yes, as UX state | Not authoritative entitlement |
| `GET /variant-b/watch/[showId]?episode=[n]&purchase_state=cancelled` | Cancel return to locked episode | Yes | Not a production PSP cancel URL |
| `GET /variant-b/watch/[showId]?episode=[n]&purchase_state=failed` | Failure return to locked episode | Yes | Not a production PSP failure URL |

If Phase 4D remains static-export-only, the callback can be a test harness function or local-only in-memory handler rather than an HTTP endpoint. Do not introduce a real server runtime only to support this spike.

### 4.2 Fake payment attempt object

```ts
type FakePaymentIntent = {
  fakePaymentIntentId: `fpi_${string}`;
  fakeTransactionId: `ftx_${string}`;
  idempotencyKey: string;
  userRef: `fake_user_${string}`;
  showId: string;
  episode: number;
  source?: string;
  attribution?: SafeAttributionParams;
  intent: 'single_episode_unlock' | 'story_pass';
  offerRef: 'single_episode' | 'story_pass';
  amountDisplay: string; // non-legal placeholder only, e.g. "36 coins" / "120 coins"
  currencyDisplay: 'coins' | 'FAKE_USD' | 'FAKE_LOCAL';
  status: 'started' | 'succeeded' | 'cancelled' | 'failed' | 'delayed' | 'duplicate_ignored' | 'revoked_simulated';
  createdAtIso: string;
  updatedAtIso: string;
  returnTo: string; // exact same watch episode route
};
```

### 4.3 Fake callback payload draft

```json
{
  "event_id": "fpevt_20260517_000001",
  "event_type": "fake_payment.succeeded",
  "fake_transaction_id": "ftx_20260517_ep6_000001",
  "fake_payment_intent_id": "fpi_20260517_ep6_000001",
  "idempotency_key": "fakepay:midnight-lantern-oath:6:fake_user_001:single_episode_unlock:ftx_20260517_ep6_000001",
  "user_ref": "fake_user_001",
  "show_id": "midnight-lantern-oath",
  "episode": 6,
  "intent": "single_episode_unlock",
  "offer_ref": "single_episode",
  "result": "success",
  "amount_display": "36 coins",
  "currency_display": "coins",
  "source": "facebook",
  "safe_attribution": {
    "campaign_id": "fake_campaign",
    "adset_id": "fake_adset",
    "ad_id": "fake_ad",
    "creative_id": "fake_creative",
    "placement": "fake_feed",
    "utm_source": "facebook",
    "utm_campaign": "fake_campaign"
  },
  "return_to": "/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1",
  "occurred_at_iso": "2026-05-17T00:00:00.000Z",
  "environment": "local_or_staging_fake_only",
  "non_production": true
}
```

Required callback fields:

- `event_id` for callback-event dedupe.
- `event_type` constrained to `fake_payment.succeeded`, `fake_payment.cancelled`, `fake_payment.failed`, `fake_payment.delayed`, `fake_payment.refund_revoke_simulated`.
- `fake_transaction_id` for the fake purchase attempt.
- `fake_payment_intent_id` for the fake start attempt.
- `idempotency_key` for grant dedupe.
- `user_ref`, `show_id`, `episode`, `intent`, `offer_ref`.
- `result` constrained to `success`, `cancelled`, `failed`, `delayed`, `refund_revoke_simulated`.
- `return_to`, which must be the same watch route and episode that launched the fake payment.
- `environment` and `non_production` markers.

Forbidden callback fields:

- Full card number, PAN, CVV, bank account, real payment token, real PSP customer ID, real receipt, real invoice ID, legal address, tax ID, unredacted email/phone, or Facebook/Meta user identifier.

## 5. Idempotency requirements

The fake simulator must make duplicate callback behavior observable because a future real PSP can deliver retries, out-of-order callbacks, or duplicate success events.

### 5.1 Idempotency key proposal

```txt
fakepay:{showId}:{episode}:{userRef}:{intent}:{fakeTransactionId}
```

Rules:

1. The first `success` callback for a key may request one fake entitlement grant from Spike 2's evaluator.
2. A second `success` callback with the same key is acknowledged as `duplicate_ignored`; it must not create a second grant, second transaction, or second charge-like UI state.
3. A `failed` or `cancelled` callback after a `success` for the same key must not revoke access automatically. It is flagged as an impossible/out-of-order fake event for review.
4. A `success` callback after `cancelled` or `failed` for the same key is allowed only if the fake test harness explicitly marks it as `delayed_success_after_nonterminal_return`; UX still returns to the same locked episode and then resumes after the grant.
5. A refund/revoke simulation must use a distinct audit event and be handed to Spike 2. It must not be modeled as a negative payment callback that directly manipulates client state.

### 5.2 Idempotency storage for spike

Allowed for Phase 4C:

- In-memory map in a local test harness.
- Browser local/session storage strictly for fake simulator state.
- Static JSON fixture used by a test matrix.

Not allowed:

- Production database table.
- Real ledger.
- PSP idempotency keys or provider API calls.
- Any persistent production account, wallet, or entitlement store.

## 6. Purchase-state matrix

| Scenario | Start surface | Fake callback / user result | Expected fake purchase state | Entitlement handoff | Required UX return |
| --- | --- | --- | --- | --- | --- |
| Single-episode success | Unlock Drawer primary CTA on first locked EP | `fake_payment.succeeded` with `intent=single_episode_unlock` | `succeeded` | Grant `(userRef, showId, episode)` once | Same watch route, same `episode`, `unlocked=1`, drawer closed or success toast |
| Story Pass success | Pass page / secondary CTA preserving `story` and `episode` | `fake_payment.succeeded` with `intent=story_pass` | `succeeded` | Grant pass covering current show; originally locked episode playable | Same watch route, original locked `episode`, `unlocked=1`, pass success copy |
| Cancel | User cancels fake payment sheet or test harness emits cancel | `fake_payment.cancelled` | `cancelled` | No grant | Same locked episode, no `unlocked=1`, drawer reopened or clear retry CTA |
| Failure | Fake simulator emits failure | `fake_payment.failed` | `failed` | No grant | Same locked episode, no `unlocked=1`, error copy and retry / Maybe later |
| Duplicate success callback | Same `idempotency_key` success delivered twice | First `succeeded`, second `duplicate_ignored` | `succeeded` plus duplicate audit marker | Exactly one grant | Same unlocked episode remains stable; no double-success UI |
| Delayed callback while user remains locked | User starts fake payment, returns/keeps locked while callback delayed | Later `fake_payment.succeeded` for same intent | `delayed` -> `succeeded` | Grant when success arrives | User remains on same locked episode until success; then same episode resumes with `unlocked=1` |
| Refund/revoke simulation | Support/test harness triggers revoke after prior success | `fake_payment.refund_revoke_simulated` or Spike 2 revoke action | `revoked_simulated` | Handoff to Spike 2 revoke/refund state | Current or next visit to same episode returns to locked state; no legal refund copy finalized |

## 7. Same-episode return matrix

| Scenario | Must preserve `showId` | Must preserve `episode` | Must preserve safe attribution | Success may add `unlocked=1` | Must avoid Home/Search/Detail | Drawer behavior |
| --- | --- | --- | --- | --- | --- | --- |
| Single-episode success | Yes | Yes, original locked episode | Yes | Yes | Yes | Closed or success state; playback resumes |
| Story Pass success | Yes | Yes, original locked episode from Pass page | Yes | Yes | Yes | Closed or pass success state; playback resumes |
| Cancel | Yes | Yes | Yes | No | Yes | Reopen with non-legal cancel placeholder |
| Failure | Yes | Yes | Yes | No | Yes | Reopen with non-legal failure placeholder and retry CTA |
| Duplicate success callback | Yes | Yes | Yes | Already present / unchanged | Yes | No second toast required; optional "already unlocked" debug marker |
| Delayed success while still locked | Yes | Yes | Yes | Added only when success is processed | Yes | Locked until callback; then close drawer / resume |
| Refund/revoke simulation | Yes | Yes | Yes if returning from support harness | No after revoke | Yes | Locked state with revoke placeholder; final refund/legal copy deferred |

Required route examples using the frozen P0 fixture:

```txt
Single-episode success:
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1&purchase_state=success&fake_transaction_id=ftx_...

Story Pass success:
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1&purchase_state=success&intent=story_pass&fake_transaction_id=ftx_...

Cancel:
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&purchase_state=cancelled&fake_transaction_id=ftx_...

Failure:
/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&purchase_state=failed&fake_transaction_id=ftx_...
```

Caution: query params are acceptable for local/staging visualization. Do not infer production authority from any client-visible param.

## 8. Placeholder copy — non-legal / non-production

Every copy string below is a placeholder and must be labeled in UI/test fixtures as non-legal and non-production.

| State | Placeholder copy |
| --- | --- |
| Fake payment started | `Test mode: fake checkout started. No real payment will be collected.` |
| Success | `Test mode: fake unlock complete. Returning to this episode.` |
| Story Pass success | `Test mode: fake Story Pass active for this story. Returning to this episode.` |
| Cancel | `Test mode: fake checkout cancelled. You are still on this locked episode.` |
| Failure | `Test mode: fake checkout failed. No real payment was attempted.` |
| Duplicate success | `Test mode: duplicate fake success ignored; access was already granted.` |
| Delayed callback | `Test mode: waiting for fake callback. Stay on this episode or try again.` |
| Refund/revoke simulation | `Test mode: fake access revoked for entitlement testing. Refund/revoke wording is not legal copy.` |

Do not use these strings as final consumer-facing payment, subscription, renewal, refund, tax, receipt, or cancellation copy.

## 9. Local/staging verification plan

Minimum evidence expected from an implementation spike or test harness:

1. Route matrix proving each scenario returns to `/variant-b/watch/[showId]` with the same `episode`.
2. Assertion that cancel/failure never set `unlocked=1`.
3. Assertion that success sets `unlocked=1` only as UX state and separately calls the fake entitlement grant handoff.
4. Assertion that duplicate success uses the same `idempotency_key` and creates only one fake grant.
5. Assertion that delayed success can resolve while the user remains on the locked episode.
6. Assertion that Story Pass success returns to the original locked episode, not to the Pass page or Home.
7. Snapshot or table showing all copy is marked non-legal / non-production.
8. Static/network check showing no Stripe, app-store, PSP, Meta/Facebook, analytics, backend/database, production deployment, or secret dependency.

## 10. Hidden dependencies and risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Entitlement contract not finalized | Payment success has no safe authority boundary without Spike 2 | Treat payment callback as a request to grant via fake entitlement evaluator, not as direct unlock authority |
| Auth return-path contract not finalized | Real purchase requires logged-in user, but Phase 4C is fake-only | Use `fake_user_*` and require later integration with Spike 1 before real implementation planning |
| Static export cannot host real callbacks | P0/P1 static export cannot receive PSP webhooks | Keep callbacks as local/staging fake harness events; real callback runtime is P2-gated |
| Query params could be mistaken as authority | `unlocked=1` is easy to overfit to | Mark all params as UX-only and require server-authoritative equivalent before production |
| Duplicate/delayed callbacks create double-grant bugs | Real PSPs retry and can be asynchronous | Idempotency key and duplicate ignored state must be tested before any PSP selection |
| Refund/revoke semantics cross legal/support boundaries | Refund copy, timing, and access revocation are legally sensitive | Hand off only state-machine simulation to Spike 2; legal/support approval remains a hard stop |
| Story Pass semantics are unresolved | Pass vs subscription vs episode pack affects purchase and revoke behavior | Use `story_pass` as current mock label only; do not finalize SKU, renewal, tax, or cancellation behavior |

## 11. Missing acceptance criteria to add before build planning

- Define whether delayed callback auto-navigates the current page or requires a visible "resume" action after success.
- Define maximum acceptable fake callback delay for local/staging tests.
- Define whether duplicate success should show any user-visible copy or only debug/audit state.
- Define exact safe attribution whitelist shared with auth and analytics spikes.
- Define minimal fake entitlement API shape with Spike 2: `grant`, `revoke`, `evaluate`, `audit`.
- Define how `purchase_state` query params are stripped or ignored after rendering so stale failure/cancel states do not persist unexpectedly.

## 12. Infrastructure boundary check

Approved for Phase 4C:

- Markdown spec.
- Local/staging fake adapter interface.
- In-memory, static fixture, or browser-local fake state.
- Fake transaction IDs and fake user refs.
- Test matrix and route assertions.

Not approved for Phase 4C:

- Stripe, Apple/Google billing, any PSP SDK/API/webhook/dashboard.
- Real card or payment data.
- Real receipt, invoice, tax, renewal, subscription, refund, chargeback, or legal disclosure handling.
- Real backend, database, ledger, entitlement service, wallet, production analytics, Meta/Facebook API, video infra, deployment, DNS, secrets, or NovelHub production infra.

## 13. Recommended plan edits

1. Make Spike 3 explicitly dependent on the Spike 2 entitlement contract for the grant/revoke interface, even if both docs are authored in parallel.
2. Keep the fake callback as a harness-level event if the repo remains static-export-only; do not introduce server runtime just for the spike.
3. Add idempotency acceptance tests before any purchase UI implementation task.
4. Add a route-preservation test for every purchase state: success, pass success, cancel, failure, duplicate success, delayed success, revoke.
5. Add a non-production copy audit check so payment/refund placeholders cannot be mistaken for legal copy.
6. Add a hard-stop checklist item: any proposed PSP integration automatically exits Phase 4C scope and requires explicit business/legal/finance approval.

## 14. Safe next step

Create a Phase 4D planning task only for a local/staging fake-payment harness that consumes this contract, Spike 1's auth return-path contract, and Spike 2's fake entitlement evaluator contract. The task should produce tests/evidence, not production integration.

## 15. Stop conditions

Stop and request human approval if the next plan or implementation requires:

- Real PSP, app-store billing, Stripe, provider webhooks, provider SDKs, real receipts, real refunds, real subscription copy, real tax/currency handling, card data, or payment secrets.
- Legal finalization of refund/subscription/cancellation/receipt copy.
- Real backend/database/ledger/wallet/entitlement production service.
- Production deployment, DNS/cutover, public staging with real traffic, or production secrets.
- Facebook/Meta API, Pixel, CAPI, or production analytics.
- A change that returns users to Home/Search/Show Detail after purchase/cancel/failure.
- A change that makes `unlocked=1` authoritative access.

## 16. Go/no-go recommendation

Verdict: REVISE before implementation planning; GO only for a local/staging fake simulator spike.

Rationale:

- The fake callback contract is feasible and useful as a Phase 4C evidence artifact.
- It preserves the P0 free-preview-first and same-episode-return invariants.
- It avoids real payment/provider/legal/backend infrastructure.
- It still depends on Spike 1 for auth return-path context and Spike 2 for authoritative fake grant/revoke semantics.

No-go for any real payment integration until business, legal, finance, security, and engineering gates explicitly approve a PSP, offer mix, legal copy, runtime, secrets, backend, entitlement, ledger, support, and refund/reconciliation plan.
