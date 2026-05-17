# SceneFlow Real MVP — Phase 4C Spike Review Package

Status: review-prep synthesis for PHASE4C-007 independent reviewer gate
Scope: documentation/spec synthesis only; not implementation approval
Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
Phase 4C plan: `docs/moboreels/real-mvp/spike-plan.md`
Generated for Kanban task: PHASE4C-006 / `t_8194a4b4`

## 1. Executive verdict

Phase 4C is ready to send to an independent reviewer gate as a spike/spec package, with one important qualification: the entitlement state-machine spike recommends **REVISE before implementation**, not immediate implementation.

Package-level recommendation: **GO to PHASE4C-007 reviewer gate; NO-GO for Phase 4D implementation until reviewer findings are resolved and the entitlement revise items are converted into bounded fake-only implementation criteria.**

Why this is safe to review:

- All five spikes produced concrete markdown contracts/specs.
- All five include explicit stop conditions or hard-stop boundaries.
- All five include evidence/checklist requirements suitable for reviewer verification.
- All five include go/no-go or verdict language.
- No spike authorizes real payment, real login/auth, real backend/database, production entitlement, production analytics/Facebook API, production deployment/DNS/secrets, production video infrastructure, or licensed/competitor assets.
- The P0 route invariant remains intact:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain without login
-> first locked episode
-> Unlock Drawer
-> fake auth/payment/grant simulation only after paid action
-> same locked episode with unlocked=1 as UX state only
```

## 2. Package contents

| Spike | Artifact | Parent task | Current verdict | Reviewer posture |
| --- | --- | --- | --- | --- |
| PHASE4C-001 Auth return-path contract | `docs/moboreels/real-mvp/spikes/auth-return-path-contract.md` | `t_0ae6fe21` | GO for documentation/spec only | Review consistency with same-episode return, attribution preservation, and no-login-before-preview. |
| PHASE4C-002 Entitlement state-machine | `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md` | `t_1febdef7` | REVISE before implementation; safe as fake/in-memory evaluator only | Review as the main implementation blocker before any Phase 4D build. |
| PHASE4C-003 Fake payment callback | `docs/moboreels/real-mvp/spikes/fake-payment-callback.md` | `t_8db31184` | APPROVE for fake-money local/staging spike only | Review idempotency, same-episode return, and fake-only boundaries. |
| PHASE4C-004 Safe video boundary | `docs/moboreels/real-mvp/spikes/safe-video-boundary.md` | `t_545a3c31` | GO for later local/staging implementation spike if safe assets and boundary tests pass | Review provider/access separation and safe media proof obligations. |
| PHASE4C-005 Event taxonomy staging | `docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md` | `t_a9e84ef8` | APPROVE for local/staging planning only | Review no-production-analytics boundary, event order, privacy/consent placeholders. |

## 3. Cross-spike invariant audit

| Invariant | Package result | Evidence pointers |
| --- | --- | --- |
| Watch-first Facebook route | Preserved. All spikes use `/variant-b/watch/[showId]?episode=1&source=facebook` as the entry route. | Spike plan §2; auth §2/§4; entitlement §1; payment §4; video §3; events §2. |
| Free preview before login/payment/pass prompts | Preserved. Auth starts only after paid CTA; fake payment starts after locked drawer action; analytics must be passive. | Auth §7; entitlement §3/§13; payment §4/§11 FP-001; video §3/§8; events §2/§10. |
| First locked episode opens Unlock Drawer | Preserved as the product gate before fake auth/payment. | Auth §2/§9; payment §4/§7; video §3/§6; events §6. |
| Same-episode return | Preserved across fake auth, fake payment, entitlement, Story Pass, cancel/failure, and resume semantics. | Auth §8/§9; entitlement §10; payment §8; events `same_episode_resumed`. |
| `unlocked=1` is UX only | Preserved and repeatedly called out as non-authoritative. Entitlement spike is explicit that this is the main hard guardrail. | Auth §3/§10/§11; entitlement §1/§7/§9/§17; payment §4/§13/§17; video §3/§5/§12; events §6/§12. |
| Attribution continuity | Preserved with allow-list filtering and local/staging-only debug posture. | Auth §6; payment §4/§8; events §7. |
| Fake-only payment/auth/entitlement | Preserved. No real providers, secrets, backend, webhooks, or stores are authorized. | Auth §3; entitlement §14/§17; payment §3/§14/§17. |
| Safe media only | Preserved. Video spike requires original or rights-cleared sample assets and no production CDN/storage/video pipeline. | Video §2/§7/§11/§12. |
| Local/staging analytics only | Preserved. Event spike forbids Meta/Facebook/API/production analytics and real identifiers. | Events §3/§9/§11/§13/§15. |

## 4. Spike-by-spike review prep

### 4.1 PHASE4C-001 — Auth return-path contract

Artifact: `docs/moboreels/real-mvp/spikes/auth-return-path-contract.md`

Reviewer-relevant summary:

- Defines a fake auth start/callback route shape for local/staging only.
- Defines `AuthReturnState` with `showId`, `episode`, unlock intent, drawer state, safe attribution, nonce, and issued timestamp.
- Requires success/cancel/failure/replay/tamper scenarios to return to the same locked episode.
- Explicitly preserves no-login-before-free-preview.
- Treats `unlocked=1` only as a success-branch UX hint and delegates authority to the entitlement spike.

Stop conditions present: yes.

Key hard stops:

- Real OAuth/OIDC/SAML/OTP/email/SMS/social login provider.
- Production account/session/credential store or secrets.
- Real backend/database/payment/Facebook/analytics/video infrastructure.
- Production deployment/DNS/cutover or real traffic.
- Login wall, account capture, marketing opt-in, or PWA prompt before free preview.
- Treating `unlocked=1` as access authority.

Evidence present / required:

- Route matrix rows 1-14.
- Required tests for no fake auth during EP1/free chain.
- Required tests for exact same `(showId, episode)` return.
- Required attribution round-trip tests.
- Required fail-closed tests for replay/tamper/missing state.
- Required screenshots for drawer reopen/focused CTA.
- Required confirmation of no real auth provider, no production secrets, and no PII.

Go/no-go: GO for documentation/spec only; later local/staging fake auth simulator must be separately planned and reviewer-gated.

Reviewer watch item:

- Auth §6.2 allow-list must stay compatible with payment/event callback keys, especially `purchase_status` and future fake-only state keys, without becoming a general query-param passthrough.

### 4.2 PHASE4C-002 — Entitlement state-machine contract

Artifact: `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md`

Reviewer-relevant summary:

- Defines the core future authority rule:

```txt
canWatchEpisode = episode.number <= show.freeEpisodes
  OR entitlementEvaluator(userOrSession, showId, episodeNumber).decision == allow
```

- Explicitly excludes `unlocked=1` from authority.
- Defines fake-only state model: anonymous preview, logged-in/no entitlement, single-episode grant, Story Pass grant, revoked/refunded, expired pass, duplicate grant retry.
- Defines future data-contract shapes for User, Show, Episode, Offer, Transaction, Entitlement, and EntitlementAuditEvent without authorizing persistence.
- Defines URL/local-state authority test matrix, including forged `unlocked=1`, localStorage forgery, cross-show Story Pass leakage, revoke, expiry, and duplicate grant.

Stop conditions present: yes.

Key hard stops:

- Treating `unlocked=1`, localStorage, cookies, or client-only state as authoritative access.
- Real backend/API/database/entitlement/wallet ledger.
- Production accounts, auth provider, payment provider, subscription, receipt, refund, chargeback, or webhook.
- Production analytics, Facebook/Meta Pixel/CAPI/API, secrets, deployment, DNS/cutover, or public traffic.
- Removing staging/mock disclaimers or using licensed/competitor assets.

Evidence present / required:

- State transition table for grant, duplicate grant, revoke, restore, logout/login.
- URL/local-state authority matrix.
- Missing acceptance criteria/test list for later fake evaluator.
- Infrastructure boundary check.

Go/no-go: REVISE before implementation; safe only as fake users, fake transactions, and in-memory evaluator spike.

Reviewer watch items:

- This is the package's main implementation blocker. Phase 4D should not build routes or persistent services until Story Pass scope/duration/restore/refund semantics are resolved or explicitly bounded for fake-only tests.
- Require a fake evaluator test artifact before any implementation plan claims entitlement readiness.

### 4.3 PHASE4C-003 — Fake payment callback and purchase-state contract

Artifact: `docs/moboreels/real-mvp/spikes/fake-payment-callback.md`

Reviewer-relevant summary:

- Defines a fake adapter named `fake_scene_flow_payment` with `money_mode: fake_money_only`.
- Covers success, cancel, failure, pending/delayed, duplicate success, Story Pass success, and revoke handoff.
- Requires canonical `return_to` to preserve `showId`, `episode`, `source`, and safe attribution.
- Requires idempotency key; duplicate success must not double-grant or double-charge even in fake state.
- Requires success to return to the same Watch episode with `unlocked=1` as UX state; cancel/failure/pending return to same locked episode without `unlocked=1`.

Stop conditions present: yes.

Key hard stops:

- Real payment, app-store billing, subscription, receipt, refund, chargeback, or payment webhook.
- Provider SDK, payment secret, public callback URL, or payment account configuration.
- Production backend/database/wallet/ledger/entitlement/auth/analytics/deployment/DNS/secrets.
- Real user/payment identifiers.
- Access granted based only on `unlocked=1`, local storage, or client-side callback state.
- Returning users to Home/Pass/generic catalog after success/cancel/failure.
- Finalizing legal/payment/subscription/refund/cancellation/tax copy.

Evidence present / required:

- Fake purchase intent and callback contract.
- Purchase state machine.
- Seven-scenario outcome matrix.
- Same-episode route builder requirements.
- Placeholder copy keys clearly marked non-production.
- Suggested local/staging tests FP-001 through FP-010.
- Infrastructure boundary check.

Go/no-go: APPROVE for fake-money local/staging spike only.

Reviewer watch item:

- Ensure any later fake callback implementation remains local/staging-only and does not accidentally require a server runtime, public webhook, provider SDK, secret, or persistent service.

### 4.4 PHASE4C-004 — Safe video sample / provider boundary

Artifact: `docs/moboreels/real-mvp/spikes/safe-video-boundary.md`

Reviewer-relevant summary:

- Separates Watch shell access state from playback provider state.
- Watch shell owns route, product chrome, episode list, locked/unlocked/free access state, Unlock Drawer, attribution, and same-episode return.
- Playback provider owns media load/play/pause/seek/progress/end/error only.
- Locked state must not mount/load playable media; playback errors must not become locked states.
- Defines provider interface and provider-to-shell state mapping.
- Defines 390 x 844 mobile viewport checklist.
- Requires original or rights-cleared sample asset log before implementation proof.

Stop conditions present: yes.

Key hard stops:

- Competitor, licensed, scraped, unclear, or brand-significant video/poster/audio/subtitle/music/title/copy.
- Production CDN/object storage/video ingest/transcoding/encoding ladder/signed URLs/DRM/persistent media pipeline.
- Production backend/database/entitlement/auth/payment/Facebook/analytics/deployment/DNS/secrets or NovelHub production infrastructure.
- Vendor decision that treats HLS, CDN, storage, DRM, captioning, encoding, or commercial player as approved.
- Removing mock/staging disclaimers or implying sample video is launch content.
- Locked state looking like buffering/offline/error or playback error opening Unlock Drawer.
- `unlocked=1` as real entitlement grant.

Evidence present / required:

- Provider interface draft.
- State mapping table.
- Mobile viewport checklist.
- Verification matrix template.
- Sample asset log template.
- Required confirmation that no production video/CDN/storage pipeline or licensed assets are introduced.

Go/no-go: GO for later local/staging-only implementation spike if safe asset rights are proven, the provider boundary is used, the Watch shell gates access before playback, the 390 x 844 matrix passes, and no hard stop is crossed.

Reviewer watch item:

- The sample asset log is still pending actual asset proof. Any implementation task must stop if safe/original media evidence is unavailable.

### 4.5 PHASE4C-005 — Event taxonomy and staging analytics contract

Artifact: `docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md`

Reviewer-relevant summary:

- Defines local/staging event taxonomy from ad landing through same-episode resume.
- Event names cover `ad_landing_viewed`, free episode events, locked episode, drawer, CTA, fake auth, fake payment, fake entitlement, and same-episode resume.
- Defines common event envelope with local/staging debug identifiers only.
- Defines dedupe keys and duplicate callback handling.
- Treats consent/privacy posture as placeholder only, not legal conclusion.
- Forbids Meta/Facebook SDK/Pixel/CAPI/API, production analytics endpoints, backend event ingestion, real identifiers, production dashboards, or ad feedback loops.

Stop conditions present: yes.

Key hard stops:

- Real Meta Pixel, CAPI, Facebook SDK, Marketing API, Graph API, or production ad-platform integration.
- Production analytics vendor or endpoint.
- Backend/database/event collector used by real users.
- Real login/auth/account identifiers/payment identifiers/IP/device fingerprinting/production user data.
- Consent/legal language presented as final.
- Production deployment, secrets, DNS/cutover, or real traffic.
- Any change that sends ad traffic to Home/Search/Show Detail first, requires login before free preview, or loses same-episode return.

Evidence present / required:

- Event table and required properties.
- Dedupe proposal and duplicate callback test cases.
- Consent/privacy requirements.
- Local/staging verification checklist.
- Network boundary evidence recommendations.
- Production analytics gate list.

Go/no-go: APPROVE for Phase 4C local/staging spike planning only; not authorization for production analytics.

Reviewer watch item:

- Event taxonomy includes `utm_medium` and `utm_term` in safe attribution while auth/payment focus on `utm_source`, `utm_campaign`, and `utm_content`. Reviewer should decide whether this is an intentional taxonomy extension or requires harmonization before implementation.

## 5. Hard-stop violation audit

Result: **No hard-stop violation found in the Phase 4C spike package.**

The reviewed artifacts are documentation/spec artifacts and do not introduce implementation of:

- real login/auth provider, account store, credentials, or production user data;
- real payment, subscription, app-store purchase, provider SDK, receipt/refund/chargeback/webhook, or payment data;
- real backend, database, wallet, ledger, entitlement service, queue, storage, CDN, video pipeline, or NovelHub production infrastructure;
- real Facebook Pixel, CAPI, Graph/Marketing API, production analytics vendor, or event collector;
- production deployment, DNS/cutover, production secrets, persistent public service, or real traffic;
- licensed/competitor/uncleared video, poster, title, copy, audio, music, or other assets;
- final legal/compliance/payment/refund/subscription/consent copy;
- pre-free-preview login/payment/pass/PWA prompt;
- Home/Search/Show Detail redirect before Watch entry;
- `unlocked=1` as future authority.

## 6. Evidence completeness matrix

| Requirement from spike plan §2 | Auth | Entitlement | Payment | Video | Events | Package result |
| --- | --- | --- | --- | --- | --- | --- |
| Concrete contract/spec | yes | yes | yes | yes | yes | complete |
| Explicit stop conditions | yes | yes | yes | yes | yes | complete |
| Evidence from local/staging verification or verification checklist | checklist/matrix | matrix/tests | matrix/tests | checklist/template | checklist/network evidence | complete for reviewer prep; implementation evidence still pending |
| Go/no-go recommendation | GO docs/spec only | REVISE before implementation | APPROVE fake-only | GO if safe-asset/boundary conditions pass | APPROVE staging-planning only | complete |
| No real production infrastructure dependency | yes | yes | yes | yes | yes | complete |

## 7. Consolidated reviewer checklist for PHASE4C-007

The independent reviewer should approve the package only if all items below pass:

- [ ] The package is clearly documentation/spec review only and does not authorize implementation.
- [ ] The P0 route remains `/variant-b/watch/[showId]?episode=1&source=facebook`.
- [ ] Free episodes remain playable without login, payment, pass prompt, subscription prompt, recharge prompt, PWA prompt, or Home redirect.
- [ ] Login/auth simulation starts only after a paid CTA in the Unlock Drawer.
- [ ] Fake payment starts only after the paid action and remains fake-money only.
- [ ] Success, cancel, failure, pending, duplicate, delayed, revoke/restore, and Story Pass cases preserve the same `showId` and `episode` context.
- [ ] `unlocked=1` is UX/display state only and never an authority for future access.
- [ ] Entitlement decisions require a future evaluator and deny forged/stale URL/local state.
- [ ] Attribution preservation is allow-listed and does not leak unsafe query params or real ad identifiers.
- [ ] No real OAuth/auth provider, payment provider, backend/database, entitlement service, analytics/Facebook API, video/CDN/storage pipeline, production deployment/DNS/secrets, or persistent public service is implied.
- [ ] Video provider boundary keeps playback states separate from locked/product access states.
- [ ] Safe media requirements are explicit; launch content and licensed assets are not assumed.
- [ ] Event taxonomy remains local/staging/debug only; production consent/legal/vendor decisions remain gated.
- [ ] Placeholder copy is not final legal/payment/refund/subscription/consent copy.
- [ ] Entitlement spike's REVISE-before-implementation verdict is retained as a blocker before Phase 4D build work.

Request changes if any of the following are found:

- Any artifact implies production implementation approval.
- Any artifact weakens free-preview-first or same-episode return.
- Any artifact treats `unlocked=1`, localStorage, cookies, or client-only callback state as access authority.
- Any artifact relies on real providers, secrets, persistence, public callbacks, production analytics, Meta/Facebook APIs, production video infrastructure, or licensed/competitor assets.
- Any artifact asks the user to resolve legal/payment/content/analytics/provider decisions by implication rather than through an explicit future approval gate.

## 8. Recommended next action after reviewer gate

If PHASE4C-007 returns APPROVE:

1. Create a Phase 4D planning card, not an implementation card.
2. Convert the entitlement revise items into acceptance criteria for a fake-only in-memory evaluator proof.
3. Create separate fake-only implementation spikes only after the Phase 4D plan is reviewed:
   - fake auth return-path simulator,
   - fake entitlement evaluator tests,
   - fake payment adapter/callback simulator,
   - safe sample playback provider proof,
   - local/staging event recorder tests.
4. Keep production gates closed for auth provider, payment provider, entitlement persistence, analytics/Meta, video/CDN/storage, content rights, legal copy, deployment, DNS, and secrets.

If PHASE4C-007 returns REQUEST_CHANGES:

1. Preserve this package as the synthesis baseline.
2. Create focused follow-up cards for each reviewer blocker.
3. Do not begin Phase 4D planning until blocker cards are complete and re-reviewed.

## 9. Final package recommendation

Recommendation: **GO to independent reviewer gate; NO-GO for implementation.**

The five spike specs are internally aligned around the accepted SceneFlow P0 conversion route and are safe to review because they remain local/staging/fake-only. The main unresolved implementation blocker is the entitlement contract's own REVISE verdict: before any build work, the team must prove the URL/local-state authority matrix with a fake evaluator and resolve or explicitly bound Story Pass scope, restore, refund/revoke, and expiry semantics.
