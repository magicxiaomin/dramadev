# SceneFlow Real MVP — Phase 4C Build-Readiness Spike Plan

Status: Phase 4C plan, staging-only / fake-money / safe-sample-content scope
Decision input: User selected the Phase 4B recommended default route on 2026-05-17T10:52:20Z.

## 1. Approved default route for Phase 4C planning

The user approved the safe default route from `decision-packet.md`:

```txt
A1: A1.3 Undecided / staging only
A2: A2.1 Original placeholder content
B: B4 direction, B5 execution first
C: C1 recommended sequence
```

Interpretation:

- Target market remains undecided; Phase 4C must use staging assumptions only.
- Content must be original placeholder / legally safe sample content only.
- Product direction preserves the current Unlock Drawer hierarchy: single-episode unlock primary, Story Pass secondary.
- Execution must be fake-money only; no real payment, subscription, login provider, production entitlement, production analytics, Facebook API, backend/database, production deployment, DNS/cutover, secrets, or licensed/competitor assets are authorized.
- Spikes should reduce uncertainty and produce evidence, not build production infrastructure.

## 2. Phase 4C objective

Validate the riskiest Real MVP contracts in local/staging using fake/sandbox boundaries while preserving the accepted P0 conversion invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain without login
-> first locked episode
-> Unlock Drawer
-> login/payment only after paid action
-> grant/return simulation
-> same episode with unlocked=1 as UX state only
```

Phase 4C is successful only if each spike produces:

1. a concrete contract/spec,
2. explicit stop conditions,
3. evidence from local/staging verification,
4. a go/no-go recommendation for a later implementation plan.

## 3. Hard-stop boundary

Stop and request explicit user approval if any task proposes or requires:

- real payment, Stripe, app-store purchase, subscription, receipt, refund, chargeback, or payment webhook,
- real login/auth provider, production user accounts, production entitlement checks, or production user data,
- real backend/database/wallet/ledger/storage/CDN/video pipeline,
- real Facebook Pixel/CAPI/API or production analytics,
- production deployment, DNS/cutover, production secrets, persistent public service, or real traffic,
- competitor/licensed/uncleared videos, titles, posters, copy, music, or other assets,
- removing mock/staging disclaimers without approved legal/product replacement copy.

## 4. Spike sequence

### Spike 1 — Auth return-path contract

**Purpose:** Prove the paid-action login interruption preserves episode context and attribution.

**Scope allowed:** Contract/spec and local/staging fake auth callback simulation only.

**Inputs:**

- Current P0 route shape: `/variant-b/watch/[showId]?episode=[n]&source=facebook`.
- PRD requirements: no login before free preview; login only after paid action; return to same locked episode with Unlock Drawer reopened.

**Required contract fields:**

- `showId`
- `episode`
- `source`
- safe attribution params (`campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_*`)
- `intent` (`single_episode_unlock` or `story_pass`)
- drawer state to reopen after return
- nonce/state token for replay protection in later real implementation

**Evidence required:**

- Local/staging route table or test matrix showing:
  - EP1/free chain does not require login.
  - paid CTA from first locked episode enters fake auth.
  - fake auth success returns to the same `showId` + `episode`.
  - attribution params are preserved or safely filtered.
  - failure/cancel returns to the locked episode, not Home.

**Stop conditions:**

- Any need for real OAuth/OTP/email provider.
- Any task that stores production users or secrets.
- Any login wall before free preview.

**Go/no-go output:** Auth return-path contract ready / revise, with exact route/query requirements.

### Spike 2 — Entitlement state-machine contract

**Purpose:** Replace `unlocked=1` as an authority with a server-authoritative future contract while keeping `unlocked=1` only as post-unlock UX state.

**Scope allowed:** State-machine spec, fake users, fake transactions, fake entitlement evaluator; no production backend/database.

**States to model:**

- anonymous preview
- logged-in no entitlement
- single-episode entitlement granted
- story-pass entitlement granted
- revoked/refunded entitlement
- expired entitlement if any time-scoped pass remains under consideration
- duplicate grant callback / idempotent retry

**Evidence required:**

- State transition table for grant, duplicate grant, revoke, restore, logout/login.
- Test matrix proving URL/local state cannot grant access by itself.
- Recommendation for the minimum future data contract: `User`, `Show`, `Episode`, `Offer`, `Transaction`, `Entitlement`, `EntitlementAuditEvent`.

**Stop conditions:**

- Any real database or persistent production account store.
- Any production entitlement service.
- Any acceptance of `unlocked=1` as authoritative access.

**Go/no-go output:** Entitlement contract ready / revise, with unresolved data-model questions.

### Spike 3 — Fake payment callback and purchase-state contract

**Purpose:** Prove success/cancel/failure/duplicate callback states without connecting a payment processor.

**Scope allowed:** Fake payment adapter contract, local/staging purchase-state matrix, fake transaction IDs.

**Scenarios required:**

- single-episode unlock success
- Story Pass success
- payment cancel
- payment failure
- duplicate success callback
- delayed callback while user remains on locked episode
- refund/revoke simulation handoff to Spike 2

**Evidence required:**

- Callback contract draft with idempotency key requirements.
- Same-episode return matrix for every scenario.
- Copy placeholders clearly marked as non-legal/non-production.

**Stop conditions:**

- Any Stripe/app-store/provider integration.
- Any real card/payment data.
- Any legal finalization of refund/subscription copy.

**Go/no-go output:** Fake payment simulator contract ready / revise.

### Spike 4 — Safe video sample/provider boundary

**Purpose:** Prove the Watch shell can separate playback states from locked states using safe/original sample media.

**Scope allowed:** Original sample media, local/static or staging-safe playback boundary, provider interface design.

**Provider boundary should expose:**

- load source
- play/pause
- time update/progress
- end event
- buffering/weak-network state
- error state
- poster/thumbnail metadata

**Evidence required:**

- Provider interface draft.
- State mapping from provider state to Watch shell UI.
- Mobile viewport checklist for playing, paused, buffering, ended, error, locked.
- Confirmation that all sample assets are original/safe placeholders.

**Stop conditions:**

- Any licensed/competitor/uncleared asset.
- Any production CDN/storage/video pipeline.
- Any DRM/encoding/storage decision treated as approved.

**Go/no-go output:** Video boundary ready / revise, with provider/vendor questions separated for later approval.

### Spike 5 — Event taxonomy and staging analytics contract

**Purpose:** Define funnel events and dedupe/consent placeholders without production Meta/Facebook integration.

**Scope allowed:** Event taxonomy, local/staging capture, no production third-party calls.

**Minimum event candidates:**

- `ad_landing_viewed`
- `free_episode_started`
- `free_episode_completed`
- `locked_episode_viewed`
- `unlock_drawer_opened`
- `unlock_cta_clicked`
- `auth_started`
- `auth_returned`
- `fake_payment_started`
- `fake_payment_succeeded`
- `fake_payment_failed`
- `entitlement_granted`
- `same_episode_resumed`

**Evidence required:**

- Event name/property table.
- Dedupe key proposal.
- Consent/privacy gating notes.
- Local/staging verification that no production Meta/Facebook call occurs.

**Stop conditions:**

- Any real Pixel, CAPI, Meta API, or production analytics endpoint.
- Any collection of real user/payment identifiers.
- Any consent/legal posture presented as final.

**Go/no-go output:** Event taxonomy ready / revise, with production analytics gate list.

## 5. Cross-spike acceptance checklist

Phase 4C can be considered complete only when all of the following are true:

- Free-preview-first invariant is preserved in every spike.
- Same-episode return is preserved across fake auth, fake payment, fake entitlement, and pass paths.
- Every spike explicitly says what remains unapproved for real implementation.
- No spike depends on real payment, login, backend/database, production analytics, Facebook API, production video infra, production deployment, secrets, or licensed assets.
- Every spike has evidence suitable for a reviewer gate.
- Reviewer gate returns APPROVE or concrete follow-up tasks.

## 6. Proposed Kanban task graph

```txt
PHASE4C-001 Auth return-path spike spec          [requirements/architect gate]
PHASE4C-002 Entitlement state-machine spike spec [architect + feasibility]
PHASE4C-003 Fake payment callback spike spec     [feasibility/dev]
PHASE4C-004 Safe video boundary spike spec       [feasibility/dev]
PHASE4C-005 Event taxonomy staging spec          [requirements/feasibility]
        \        |        |        |        /
         -> PHASE4C-006 Spike package synthesis/review prep [dramapm]
             -> PHASE4C-007 Independent reviewer gate [Claude Code reviewer]
```

Independent spike specs may run in parallel. Synthesis waits for all five. The final reviewer gate must use the mandated reviewer route before any Phase 4D implementation plan.

Current Kanban routing created from this plan:

| Phase 4C item | Kanban task | Assignee | Dependency |
| --- | --- | --- | --- |
| PHASE4C-001 Auth return-path spike spec | `t_82d1fd00` | `dramadev-requirements` | after PHASE4C-000 |
| PHASE4C-002 Entitlement state-machine spike spec | `t_129e5ca1` | `dramadev-architect` | after PHASE4C-000 |
| PHASE4C-003 Fake payment callback spike spec | `t_48761fc6` | `dramadev-feasibility` | after PHASE4C-000 |
| PHASE4C-004 Safe video boundary spike spec | `t_17573206` | `dramadev-feasibility` | after PHASE4C-000 |
| PHASE4C-005 Event taxonomy staging spec | `t_3367b790` | `dramadev-requirements` | after PHASE4C-000 |
| PHASE4C-006 Spike package synthesis/review prep | `t_853b8ae8` | `dramapm` | after PHASE4C-001..005 |
| PHASE4C-007 Independent reviewer gate | `t_d6a4f8df` | `dramadev-reviewer` | after PHASE4C-006 |
