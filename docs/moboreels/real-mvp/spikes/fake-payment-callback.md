# SceneFlow Real MVP Spike 3 — Fake Payment Callback and Purchase-State Contract

Status: Phase 4C spike spec, staging/local only
Source plan: `docs/moboreels/real-mvp/spike-plan.md` §4 Spike 3
Primary PRD source: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
Scope boundary: fake-money only; no real payment processor, app-store purchase, provider SDK, real webhook, production backend, production database, real entitlement service, production analytics, production deployment, secrets, or real user/payment data.

## 1. Verdict

APPROVE for a fake-money local/staging spike, with strict infrastructure boundaries.

The spike is feasible as a documentation and contract exercise if it models payment-like outcomes through a fake adapter and treats every callback as synthetic test input. It must preserve the P0 invariant that all outcomes return the user to the same `showId` and `episode` context; only a fake success may set `unlocked=1`, and even then `unlocked=1` remains UX state, not an entitlement authority.

## 2. Goal

Define the fake purchase-state contract that a later local/staging simulator can exercise before any real payment work is approved.

The contract must answer:

1. What state is sent when a user starts a fake single-episode unlock or fake Story Pass purchase?
2. What fake callback payloads represent success, cancel, failure, duplicate success, delayed success, and refund/revoke handoff?
3. What route should the user land on after each outcome?
4. What idempotency and same-episode-return requirements must a future real integration preserve?

## 3. Non-goals and hard stops

This spike must not:

- connect a real payment processor or app-store billing path,
- name or install a provider SDK,
- create or receive a real webhook from the public internet,
- collect card, wallet, bank, store-account, receipt, tax, billing-address, or other payment data,
- create production users, subscriptions, ledgers, entitlements, receipts, refunds, chargebacks, or invoices,
- create production backend, database, queue, storage, deployment, DNS, secrets, or persistent public service,
- fire production analytics, Pixel, CAPI, or other third-party event calls,
- finalize legal copy for refund, subscription, cancellation, renewal, tax, or local price disclosures.

Stop immediately and request human approval if a downstream task proposes any of the above.

## 4. Baseline route invariant

The P0 route chain remains the source of truth:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain without login
-> first locked episode
-> Unlock Drawer
-> fake paid action
-> same locked episode outcome
```

Successful fake unlock returns to:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&source=facebook&unlocked=1
```

Cancel, failure, pending, or delayed states return to the same locked episode without `unlocked=1`:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&source=facebook&purchase_status=[cancelled|failed|pending]
```

Rules:

- Never return the user to Home.
- Never lose `showId`.
- Never lose `episode`.
- Preserve safe attribution params from the landing route (`source`, `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_*`) unless a param fails an allow-list filter.
- Never require login before the free preview chain.
- Never show a payment-like prompt before the first locked episode.
- Never treat `unlocked=1` as authoritative access for real payment or real entitlement.

## 5. Fake adapter model

Use a fake adapter name that cannot be mistaken for a real provider:

```txt
adapter: fake_scene_flow_payment
environment: local_or_staging_only
money_mode: fake_money_only
```

The fake adapter owns only synthetic state transitions. It may be represented by a local function, fixture, route mock, or test harness in a later implementation spike, but this spec does not authorize implementation.

### 5.1 Purchase intent contract

A fake purchase intent is created only after the user taps a paid action inside the Unlock Drawer or story-scoped Pass page.

Required fields:

| Field | Required | Notes |
| --- | --- | --- |
| `purchase_intent_id` | Yes | Internal fake ID, e.g. `fake_pi_<uuid>`; generated before callback simulation. |
| `idempotency_key` | Yes | Stable per attempted purchase; duplicate callbacks with the same key must not double-grant. |
| `show_id` | Yes | Current drama, from route. |
| `episode` | Yes | Current locked episode number. |
| `source` | Recommended | Preserve from route when present. |
| `attribution` | Optional | Allow-listed attribution params only. |
| `intent` | Yes | `single_episode_unlock` or `story_pass`. |
| `return_to` | Yes | Same-episode watch URL without outcome params. |
| `created_at` | Yes | ISO timestamp from fake environment. |
| `fake_user_ref` | Optional | Synthetic/staging-only identifier; must not be real PII. |
| `amount_label` | Optional | Display-only mock text, e.g. `36 coins` or `Mock Story Pass`; not legal price copy. |

Do not include card tokens, store receipts, billing addresses, tax fields, provider customer IDs, real emails, phone numbers, or production account IDs.

### 5.2 Fake callback contract

A fake callback is synthetic test input. It must never be exposed as a real public webhook contract.

Required fields:

| Field | Required | Allowed values / notes |
| --- | --- | --- |
| `callback_id` | Yes | Unique fake callback event ID, e.g. `fake_cb_<uuid>`. |
| `purchase_intent_id` | Yes | Matches the fake purchase intent. |
| `idempotency_key` | Yes | Same value as purchase intent. |
| `result` | Yes | `succeeded`, `cancelled`, `failed`, `pending`, `revoked`. |
| `intent` | Yes | `single_episode_unlock` or `story_pass`. |
| `show_id` | Yes | Must match purchase intent. |
| `episode` | Yes | Must match purchase intent. |
| `occurred_at` | Yes | ISO timestamp. |
| `reason_code` | Optional | `user_cancelled`, `fake_declined`, `fake_timeout`, `duplicate_callback`, `manual_revoke`, etc. |
| `return_to` | Yes | Same-episode watch URL. |
| `copy_key` | Recommended | Placeholder UI copy key, not final legal text. |

Validation rules:

- Reject callback if `show_id` or `episode` does not match the purchase intent.
- Reject callback if `intent` does not match the purchase intent.
- Treat repeated `succeeded` with the same `idempotency_key` as duplicate success: no second grant, no second success event, no second fake charge state.
- Treat `cancelled` and `failed` as terminal no-grant states unless a brand-new fake purchase intent is created.
- Treat `pending` as no-grant until a later synthetic `succeeded` callback arrives.
- Treat `revoked` as a handoff to the entitlement state-machine spike; do not design real refund mechanics here.

## 6. Purchase-state machine

```txt
idle_locked
  -> fake_purchase_started
      -> fake_payment_succeeded
          -> fake_entitlement_grant_requested
          -> same_episode_unlocked_return
      -> fake_payment_cancelled
          -> same_episode_locked_return
      -> fake_payment_failed
          -> same_episode_locked_return
      -> fake_payment_pending
          -> same_episode_pending_locked_state
          -> delayed_fake_payment_succeeded
              -> same_episode_unlocked_return
      -> duplicate_fake_success_callback
          -> idempotent_noop_then_same_episode_unlocked_return
      -> fake_revoke_requested
          -> handoff_to_entitlement_spike
```

State meanings:

| State | Meaning | Access result |
| --- | --- | --- |
| `idle_locked` | User is on first locked episode and drawer is available. | Locked. |
| `fake_purchase_started` | User clicked fake paid action. | Locked until fake success. |
| `fake_payment_succeeded` | Synthetic callback says success. | May return with `unlocked=1` as UX state. |
| `fake_payment_cancelled` | User cancelled fake flow. | Locked; drawer can reopen. |
| `fake_payment_failed` | Fake flow failed. | Locked; error copy appears in drawer. |
| `fake_payment_pending` | Delayed fake callback not resolved yet. | Locked or pending; no playback grant. |
| `duplicate_fake_success_callback` | Same idempotency key repeated after success. | No second grant; same final unlocked state. |
| `fake_revoke_requested` | Synthetic revoke/refund case for Spike 2. | Entitlement spike decides active vs revoked state. |

## 7. Scenario matrix

| Scenario | Start | Fake callback result | Expected route | Expected UI | Grant? | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Single-episode success | Locked EP X, primary CTA | `succeeded` + `intent=single_episode_unlock` | `/variant-b/watch/[showId]?episode=X&source=facebook&unlocked=1` plus safe attribution | Success toast, playable same episode | Fake grant once | Primary P0 success path. |
| Story Pass success | Pass page for story + EP X | `succeeded` + `intent=story_pass` | `/variant-b/watch/[showId]?episode=X&source=facebook&unlocked=1` plus safe attribution | Success toast, same episode resumes | Fake pass grant once | Pass scope is story-scoped in fake state; exact real offer mix remains gated. |
| Payment cancel | Locked EP X or pass page | `cancelled` | `/variant-b/watch/[showId]?episode=X&source=facebook&purchase_status=cancelled` | Locked episode, drawer reopened or reopenable, non-punitive cancel copy | No | Must not send to Home or pass page. |
| Payment failure | Locked EP X or pass page | `failed` | `/variant-b/watch/[showId]?episode=X&source=facebook&purchase_status=failed` | Locked episode, clear retry copy, no network-error styling | No | Failure copy is placeholder and non-legal. |
| Duplicate success callback | Already succeeded intent | second `succeeded` with same `idempotency_key` | Same final unlocked route as original success | No duplicate toast required; state remains unlocked | No new grant | Idempotency is the main acceptance criterion. |
| Delayed callback, user remains on locked episode | Pending fake intent | first `pending`, later `succeeded` | Pending route until success, then same unlocked return | Pending copy while waiting; then success toast and same episode resumes | Grant only on later success | Client must not grant on pending. |
| Delayed callback after user navigates away and returns | Pending fake intent, user reopens same watch route | later `succeeded` | Same episode unlocked return when resolved | Same episode context restored from `return_to` | Grant once | Must preserve return target from intent, not current unrelated route. |
| Revoke/refund simulation handoff | Previously fake succeeded | `revoked` or manual revoke fixture | Same episode route without authoritative unlock; exact handling owned by Spike 2 | Locked or revoked copy per entitlement spike | Revoke handled by Spike 2 | Do not design real refund mechanics here. |

## 8. Same-episode return requirements

Every fake purchase intent must store a canonical `return_to` value derived from the watch URL builders, not free-form navigation:

```txt
return_to = /variant-b/watch/[showId]?episode=[episode]&source=[source]&[safe_attribution]
```

Outcome-specific route builders append only outcome state:

```txt
success:   return_to + &unlocked=1&purchase_status=succeeded
cancel:    return_to + &purchase_status=cancelled
failure:   return_to + &purchase_status=failed
pending:   return_to + &purchase_status=pending
revoked:   return_to + &purchase_status=revoked
```

Acceptance checks:

- `showId` remains unchanged from purchase start to return.
- `episode` remains unchanged from purchase start to return.
- `source=facebook` remains present when it was present on entry.
- Safe attribution params round-trip through fake purchase start and fake callback handling.
- Unsafe or unknown params are dropped by allow-list filtering and never rendered as copy.
- Success from Pass page returns to Watch, not back to Pass.
- Cancel/failure from Pass page returns to the locked Watch episode, not Home and not a generic catalog.

## 9. Placeholder copy keys

All copy is placeholder-only and must remain visibly non-production in staging docs or UI.

| State | Copy key | Placeholder text |
| --- | --- | --- |
| success | `fake_payment.success` | `Fake unlock complete. Continue watching this episode.` |
| story pass success | `fake_payment.story_pass_success` | `Fake Story Pass active for this story. Continue watching this episode.` |
| cancel | `fake_payment.cancelled` | `Fake payment cancelled. You are still on this episode.` |
| failure | `fake_payment.failed` | `Fake payment failed. No fake unlock was granted.` |
| pending | `fake_payment.pending` | `Fake payment is pending. Keep this episode open or return later.` |
| duplicate | `fake_payment.duplicate_noop` | `Duplicate fake callback ignored.` |
| revoked | `fake_payment.revoked_placeholder` | `Fake access changed. Entitlement handling is covered by the entitlement spike.` |

Do not use this placeholder text as legal, refund, subscription, cancellation, renewal, tax, or production checkout copy.

## 10. Evidence required from a later implementation spike

A later implementation task may build a fake local/staging simulator only if it stays within the boundary above. Required evidence for that task:

1. Route table showing each outcome and final URL.
2. Test matrix proving success, cancel, failure, duplicate, delayed, and revoke handoff states.
3. Idempotency proof showing duplicate success with the same `idempotency_key` does not double-grant.
4. Same-episode proof for both primary single-episode unlock and Story Pass success.
5. Negative proof that pending/cancel/failure do not set `unlocked=1`.
6. Verification that no real provider SDK, real webhook endpoint, production analytics, backend, database, deployment, DNS, secrets, or payment data are introduced.
7. Screenshot or recording evidence that free preview is still available without login/payment prompts before the first locked episode.

## 11. Suggested local/staging test cases

These are acceptance tests for a future fake implementation, not current implementation instructions.

| Test ID | Given | When | Then |
| --- | --- | --- | --- |
| FP-001 | User lands on `/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook` | User watches free chain | No login/payment/pass prompt appears before first locked episode. |
| FP-002 | User is on first locked episode EP6 | User completes fake single-episode success | Route is `/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1`; episode context preserved. |
| FP-003 | User is on Pass page for EP6 | Fake Story Pass succeeds | User returns to Watch EP6 with `unlocked=1`; not Home and not Pass. |
| FP-004 | User starts fake purchase on EP6 | Fake cancel callback arrives | User returns/remains on Watch EP6 locked state with cancel copy; no `unlocked=1`. |
| FP-005 | User starts fake purchase on EP6 | Fake failure callback arrives | User returns/remains on Watch EP6 locked state with failure copy; no `unlocked=1`. |
| FP-006 | Fake success already processed | Duplicate fake success callback arrives | State is unchanged; no duplicate grant/event/copy loop. |
| FP-007 | Fake purchase is pending | Delayed success arrives while user remains on EP6 | Same episode becomes unlocked only after success callback. |
| FP-008 | Fake purchase is pending | User navigates away, then delayed success resolves | Stored `return_to` still points to original show/episode; unrelated route is not overwritten. |
| FP-009 | URL includes safe attribution params | Fake success/cancel/failure returns | Allow-listed params are preserved and unknown params are dropped. |
| FP-010 | Previously fake success is revoked in a synthetic fixture | Entitlement state-machine handles revoke | Access decision is delegated to Spike 2; fake payment spec does not invent real refund logic. |

## 12. Hidden dependencies

- Auth return-path contract: paid actions may later trigger login, so the fake purchase intent must compose with a separate login state token without losing `showId`, `episode`, `source`, or attribution.
- Entitlement state-machine contract: this spike only says when a fake success requests a fake grant; Spike 2 owns authoritative access states, revocation, restore, and URL-forgery resistance.
- Event taxonomy contract: fake payment events should map to staging/local event names, but no production analytics may be fired.
- Runtime/deployment boundary: static export remains the safe baseline; real callbacks normally require server runtime, which is out of scope here.
- Legal/product copy: all payment, refund, subscription, renewal, cancellation, tax, and receipt copy remains placeholder-only.

## 13. Risks and mitigations

| Risk | Severity | Mitigation |
| --- | --- | --- |
| Fake callback is mistaken for real payment readiness | Critical | Label adapter and copy as fake-only; no provider names, SDKs, secrets, public webhook, or payment data. |
| Duplicate callback creates double grant | Critical | Require `idempotency_key`; duplicate success is a no-op after first success. |
| Pending state grants access too early | High | Only `succeeded` can request fake grant; `pending`, `cancelled`, and `failed` keep locked state. |
| Payment outcome loses episode context | High | Store canonical `return_to` with `show_id`, `episode`, source, and safe attribution at intent creation. |
| Pass success returns to generic Pass/Home surface | High | Pass success must return to Watch for the originally locked episode. |
| Placeholder copy becomes production payment/legal copy | High | Keep copy keys marked placeholder and require legal/product approval before any real billing surface. |
| `unlocked=1` is treated as entitlement authority | Critical | State explicitly that `unlocked=1` is UX state only; Spike 2 must own access authority. |

## 14. Infrastructure boundary check

Allowed in this spike:

- Documentation/specification.
- Local/staging fake-money contracts.
- Synthetic IDs and callbacks.
- Test matrices and route matrices.
- Placeholder copy clearly marked non-production.

Not allowed in this spike:

- Real payment, app-store billing, subscription, receipt, refund, chargeback, or payment webhook.
- Real auth, user account, entitlement, ledger, wallet, database, backend, queue, or server runtime.
- Real analytics, Pixel, CAPI, Facebook API, third-party event calls, or production attribution pipeline.
- Real deployment, DNS, production secrets, public callback URL, or persistent public service.
- Legal finalization of payment, subscription, cancellation, refund, tax, or receipt copy.

## 15. Recommended plan edits before implementation

1. Split any future implementation into a fake local/staging simulator task and a separate reviewer task; do not combine fake and real payment planning.
2. Require tests for all seven scenario families: single-episode success, Story Pass success, cancel, failure, duplicate, delayed, revoke handoff.
3. Require a static boundary check confirming no provider SDK, real webhook endpoint, payment secret, database, analytics SDK, or deployment config was added.
4. Make route builders the only accepted way to construct `return_to` and outcome URLs.
5. Make the entitlement spike explicitly consume `fake_payment_succeeded` as input and reject URL/local-state-only access.
6. Keep all copy under `fake_payment.*` placeholder keys until product/legal approve final real-money copy.

## 16. Safe next step

Send this spec to the Phase 4C synthesis/review task together with the auth return-path and entitlement state-machine specs. A later developer may implement a local/staging fake simulator only after reviewer approval confirms that the simulator remains fake-money only and preserves same-episode return for every outcome.

## 17. Stop conditions

Stop and block if a future task asks to:

- connect any real payment, app-store, subscription, receipt, refund, chargeback, or payment webhook path,
- add a provider SDK, payment secret, public callback URL, or payment account configuration,
- introduce production backend, database, wallet, ledger, entitlement, auth, analytics, deployment, DNS, or secrets,
- collect or store real user/payment identifiers,
- grant access based only on `unlocked=1`, local storage, or client-side callback state in a real path,
- return users to Home/Pass/generic catalog after success/cancel/failure instead of the same locked episode,
- finalize legal/payment/subscription/refund/cancellation/tax copy without explicit legal/product approval.
