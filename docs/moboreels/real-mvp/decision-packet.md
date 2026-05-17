# SceneFlow Real MVP — Phase 4B Decision Packet

Status: User-facing decision packet — default route selected by user on 2026-05-17T10:52:20Z
Scope: Decisions only. User selection authorizes Phase 4C documentation/spike planning under the default staging-only/fake-money/safe-sample-content boundary; it does not authorize real implementation.

## 1. Why this packet exists

The Real MVP planning package is now reviewed and approved for planning use. Before any real build work starts, the user/product owner needs to choose the first business direction.

This packet intentionally asks for only three decision groups first:

1. Target market + content source
2. Monetization model
3. Sequencing for auth / payment / video / analytics

## 2. Recommended default path

Recommended default for the next phase:

> Start with a staging-only, fake-money build-readiness track using legally safe/original sample content, while preserving the current mock P0 as the demo baseline.

This means:

- Do not connect real payment yet.
- Do not connect real Facebook Pixel/CAPI yet.
- Do not deploy production infrastructure yet.
- Do not ingest licensed/competitor assets without rights approval.
- Build only contracts/spikes that reduce uncertainty: auth return path, entitlement state machine, fake payment callback, and video-provider proof using safe sample media.

## 3. Decision Group A — Target market and content source

### A1. Target market

Choose one:

| Option | Meaning | Risk |
| --- | --- | --- |
| A1.1 US-first web/PWA | Optimize requirements around US privacy/payment/refund expectations | Simpler than multi-region but still needs legal review |
| A1.2 SEA-first web/PWA | Optimize for SEA short-drama traffic and mobile payments | More payment/localization complexity |
| A1.3 Undecided / staging only | Do not choose a launch market yet; use staging assumptions only | Safest for now; delays legal/payment specifics |

Recommended default: **A1.3 Undecided / staging only** until business chooses launch geography.

### A2. Content source

Choose one:

| Option | Meaning | Risk |
| --- | --- | --- |
| A2.1 Original placeholder content | Continue using original mock titles and newly created sample videos/assets | Safest legally; may not prove content-market fit |
| A2.2 Licensed partner sample | Use a small legally cleared partner catalog | Best MVP realism; requires rights proof |
| A2.3 User-provided assets later | Delay content decision; build with placeholders only | Safe but limits video/payment realism |

Recommended default: **A2.1 Original placeholder content** for staging spikes.

## 4. Decision Group B — Monetization model

Choose the first model to design around. This is not real-payment authorization; it only sets the product direction for spikes and contracts.

| Option | Meaning | Pros | Cons |
| --- | --- | --- | --- |
| B1 Single-episode unlock first | User pays/unlocks one locked episode at a time | Matches current primary CTA; lowest commitment | Requires pricing/coin clarity later |
| B2 Story Pass first | User buys access to the rest of the current drama | Stronger revenue per buyer | More disclosure/refund complexity |
| B3 Subscription first | User gets broader access for a recurring period | Familiar streaming model | Highest legal/payment/cancellation burden |
| B4 Hybrid: single EP + Story Pass | Keep current drawer hierarchy: single EP primary, Story Pass secondary | Best match to accepted Phase 3 flow | More SKU/entitlement complexity |
| B5 Fake-money staging only | Do not decide real monetization yet; simulate all states | Safest short-term | Delays business validation |

Recommended default: **B4 Hybrid: single EP + Story Pass**, but implemented first as **B5 fake-money staging only**.

## 5. Decision Group C — Sequencing

Choose what to validate first after planning.

### C1. Recommended sequence

1. Auth return-path spike
   - Prove login after paid CTA returns to the same locked episode and preserves attribution.
2. Entitlement state-machine spike
   - Prove server-authoritative grants/revocations/idempotency with fake users and fake transactions.
3. Fake payment callback spike
   - Prove success/cancel/failure/duplicate callback states with no real PSP.
4. Video provider sample spike
   - Prove mobile video playback states using safe/original sample media.
5. Event taxonomy / analytics staging spike
   - Define funnel events and local/staging event capture without production Meta integration.

Recommended default: **C1**.

### C2. Alternate sequence if business wants content realism first

1. Content/video provider sample spike
2. Watch shell integration
3. Entitlement fake gating
4. Fake payment
5. Auth return path

Use only if the next investor/stakeholder demo requires real video realism more than purchase-flow realism.

## 6. Explicit non-approvals

Unless the user separately approves them, this packet does not authorize:

- production deployment
- DNS/cutover
- production secrets
- real payment / subscriptions / Stripe / app-store purchases
- real login or production accounts
- real entitlement service for paid users
- real database/backend
- real Facebook Pixel/CAPI/API
- production analytics
- real licensed/competitor assets
- legal/compliance copy decisions

## 7. Minimal answer needed from user

The user can answer in this compact form:

```txt
A1: <target market option>
A2: <content option>
B: <monetization option>
C: <sequencing option>
```

Recommended default answer if the user wants maximum safety:

```txt
A1: A1.3 Undecided / staging only
A2: A2.1 Original placeholder content
B: B4 direction, B5 execution first
C: C1 recommended sequence
```

## 8. Next work package after decision

After the user chooses, create a Phase 4C build-readiness plan. It should still be documentation/spike-only unless explicitly approved otherwise.

Likely next documents/tasks:

- `docs/moboreels/real-mvp/spike-plan.md`
- Auth return-path spike spec
- Entitlement state-machine spike spec
- Fake payment callback spike spec
- Safe video sample spike spec
- Event taxonomy staging spec

Each spike must include stop conditions and evidence requirements.
