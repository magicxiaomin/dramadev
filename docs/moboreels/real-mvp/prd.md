# SceneFlow Real MVP PRD

## 1. Status & Purpose

- Status: Draft (planning only). Not yet approved.
- Phase: Phase 4 — real MVP planning, gated by stakeholder/legal/business approval.
- Document owner: Product (REQUIREMENTS role).
- Predecessor: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` (mock-only P0, merged and accepted via the Phase 3 acceptance package).
- Source of truth for the user journey: the existing P0 PRD §6 user flow and §15 acceptance checklist.

### 1.1 Transition from mock-only P0 to real MVP

The current SceneFlow P0 (the merged Facebook ad conversion route at `/variant-b/watch/[showId]?episode=1&source=facebook`) is **mock-only**:

- The watch surface is a static prototype, not a real video player.
- Episode lock state is driven by local fixtures (`freeEpisodes`, `firstLockedEpisode`).
- "Unlock" is the URL query parameter `unlocked=1`. There is no wallet, ledger, or entitlement service.
- Story Pass is prototype UI; there is no subscription, renewal, refund, or processor.
- `source=facebook` is preserved as routing context only; no Pixel, CAPI, attribution, or analytics events are fired.
- No login, account, backend, database, or production deployment is connected.

This document describes what a **real MVP** must do to convert that mock journey into a shippable product, while preserving every invariant Phase 3 validated. It is a planning artifact: it does **not** authorize, implement, or schedule any of the production infrastructure described below. All hard-stop areas (real payment, login, backend, video, Facebook API, analytics, deployment, DNS, secrets, legal copy) remain gated on explicit human approvals listed in §6 and §8.

### 1.2 Document scope

In scope:
- Real MVP product thesis, target user, and end-to-end real user flows.
- Functional requirements by area, framed as planning specifications (not implementation tasks).
- Non-goals and the approval gates that protect them.
- Success metrics and the privacy/compliance cautions on every metric.
- Open questions that require user/business/legal sign-off.
- Acceptance criteria for when this PRD is considered ready to drive architecture and downstream planning.

Out of scope (and explicitly hard-stopped here):
- Implementing backend, database, login, payment, subscription, entitlement, analytics, Facebook API integrations, deployment, DNS, secrets, or any production infrastructure.
- Selecting specific commercial vendors (payment processors, identity providers, video CDNs, analytics platforms).
- Copying competitor or licensed content, posters, titles, copy, pricing, or creative.
- Requiring or implementing NovelHub production infrastructure for P0. NovelHub remains a **future infrastructure reference** only.
- Final legal/compliance copy, ToS, privacy policy, refund policy, age gating, or regional disclosures.

## 2. Product Thesis & Target User

### 2.1 Product thesis

> SceneFlow is the fastest path from a Facebook short-drama ad click to a paid unlock, because the user lands directly on the drama they saw, watches enough free episodes to commit, and is offered a low-friction unlock at the exact moment the story locks.

The real MVP keeps Prototype B / SceneFlow as the foundation and the Facebook ad conversion route as the primary funnel. The only thing the MVP changes versus today's prototype is **replacing each mocked surface with a real one** — playback, entitlement, login, and payment — without breaking the watch-first, free-preview-first, same-episode-return invariants.

### 2.2 Target user

The primary user is the same as the mock P0:

- A mobile user who clicked a Facebook ad for a trending short drama.
- Wants to continue watching the specific drama from the ad; not browsing a catalog.
- Will tolerate a small interruption only when they hit a locked episode.
- Will choose between a single-episode unlock and a longer-form pass/subscription based on perceived value of the specific story, not the platform.
- May or may not return on a second device; if they do, they expect to keep watching where they left off.

Secondary user (P1+): a returning user who came in through Home, Search, or a notification rather than an ad. The MVP must not optimize for them at the expense of the primary funnel.

### 2.3 What the MVP must prove

1. The watch-first ad route converts free previewers into paying unlockers at a measurable rate.
2. Entitlement state survives across sessions and devices once the user has an account.
3. Single-episode unlock and a story/subscription/pass option can coexist without one cannibalizing the other.
4. The flow is shippable with real payments and real video while still respecting the no-prompt-before-preview rule.

## 3. End-to-End Real User Flows

All flows assume the user has approved the relevant legal disclosures (final copy gated — see §8). Routes use the existing P0 shape so today's acceptance evidence remains valid.

### 3.1 Facebook ad landing

1. User clicks a Facebook ad for a specific drama.
2. Ad URL targets `/<route-prefix>/watch/[showId]?episode=1&source=facebook` plus optional attribution params (`campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_*`).
3. The Watch page loads directly. No interstitial, no redirect to Home/Search/Show Detail, no PWA install prompt, no login wall, no subscription/Story Pass prompt, no recharge prompt.
4. The page records the landing event locally (deferred attribution buffer) but does **not** fire any third-party network call until either (a) the user has accepted disclosures or (b) the user takes a payment-adjacent action — whichever is decided in §8 Q-ATTR-1.
5. The route preserves attribution params through the full session.

Real-vs-mock delta: today the Watch page is a static prototype with `PLAYING FREE PREVIEW` placeholder copy; in the real MVP it must host a real video provider boundary (see §4.2) while keeping the same chrome.

### 3.2 Free preview without login

1. User can play EP1–EP(freeEpisodes) for the landing show without any account.
2. No login wall, paywall, recharge prompt, Story Pass prompt, or PWA install prompt appears before or during free preview.
3. Episode complete → continue CTA works without login. P0 keeps manual continuation; P1 may add the 3-second auto-next.
4. Free watch progress is stored anonymously on-device (e.g., browser storage scoped to that origin). Server-side progress requires login (§3.5).
5. If the user navigates away and returns within the same anonymous session, they resume on their last watched free episode for the same show.

### 3.3 First locked episode

1. The lock point is per-drama, driven by the show's `freeEpisodes` value.
2. When `episode > show.freeEpisodes` and the user does not hold an entitlement covering that episode:
   - The Watch page enters its locked state (visually distinct from network/video error).
   - The Unlock Drawer opens automatically on first entry into the locked state.
3. The Unlock Drawer must show: drama title, episode number, current balance (after login, real; before login, "Sign in to see your balance" placeholder), single-episode cost, primary CTA (single-episode unlock), secondary CTA (Story Pass / subscription / multi-episode pass), and "Maybe later".
4. If the user dismisses the drawer with "Maybe later", they remain on the locked episode. Tapping the locked playback area reopens the drawer.
5. The locked state never auto-redirects to Home, Show Detail, or a generic catalog.

### 3.4 Login / account capture timing

The real MVP must **defer** account capture until it is genuinely needed, to protect free-preview throughput.

Triggers that require login (in priority order):
1. Tapping the primary CTA inside the Unlock Drawer (single-episode unlock).
2. Tapping the secondary CTA (Story Pass / subscription / multi-episode pass).
3. "Restore purchases" (§3.8).
4. Any wallet / balance / billing surface.
5. Cross-device resume requested by the user.

Triggers that must **not** require login:
- Landing on the Watch page.
- Playing any free episode.
- Opening the Episode Sheet.
- Opening Show Detail.
- Opening the Unlock Drawer (drawer can render with a "Sign in to unlock" CTA in place of the real unlock CTA).

Login UX requirements:
- Minimum-friction methods only (the specific providers — passwordless email, Apple, Google, phone OTP, etc. — are an open question, see §8 Q-AUTH-1).
- Login must return the user to the **exact same locked episode** they were trying to unlock, with the Unlock Drawer reopened. Same invariant as today's mock unlock.
- Login must never drop the source/attribution query params.
- No mandatory profile fields, no email verification gate, and no marketing opt-in defaults that violate target-market law (deferred to legal — see §8 Q-LEGAL-1).

### 3.5 Single-episode unlock

1. User taps "Unlock EP X" in the Unlock Drawer.
2. If not yet logged in, login flow (§3.4) runs and returns to the same drawer state.
3. The Unlock Drawer shows real balance and cost (from the entitlement service, §4.5).
4. If balance ≥ cost: the user confirms; the entitlement service grants a single-episode entitlement for `(showId, episodeNumber, userId)`, deducts the cost, and returns success.
5. If balance < cost: the primary CTA flips to "Get coins to unlock" → triggers the coin/top-up flow → returns to step 4.
6. On success, the client navigates to `/<route-prefix>/watch/[showId]?episode=[episodeNumber]&unlocked=1` (same shape as the mock P0), shows the success toast, and resumes playback.
7. The `unlocked=1` flag is **client UX state only**. The authoritative entitlement check is the entitlement service. The flag exists so that the post-purchase return is visually consistent with today's acceptance evidence.

### 3.6 Story pass / subscription / multi-episode pass options

The real MVP must support **at least one** longer-form purchase option beyond single-episode unlock. The exact mix is an open question (§8 Q-OFFER-1); this PRD defines the requirements that apply to whichever option(s) are chosen.

Options under consideration (planning-only — none authorized):
- **Story Pass**: one-time purchase that unlocks the rest of the current drama.
- **Subscription**: recurring purchase that unlocks all episodes for a window (week/month). May auto-renew.
- **Episode Pack**: pre-paid multi-episode bundle for the current drama only.

Requirements that apply to whichever option(s) ship:
1. The secondary CTA in the Unlock Drawer leads to the Pass page (`/<route-prefix>/pass?story=[showId]&episode=[episodeNumber]`), preserving show and episode context.
2. The Pass page is reframed around the current drama, not as a generic catalog access pitch.
3. The Pass page must clearly disclose: what is unlocked, for how long, whether it auto-renews, how to cancel, where the user lands after purchase, and the local price including tax.
4. Subscription-style options must include cancellation and renewal disclosures that satisfy target-market app-store and consumer-protection rules (final wording gated, §8 Q-LEGAL-1).
5. Purchase success returns the user to `/<route-prefix>/watch/[showId]?episode=[episodeNumber]&unlocked=1` for the originally locked episode.

### 3.7 Entitlement persistence & return-to-same-episode

Entitlement persistence is the load-bearing real-MVP invariant. The current `unlocked=1` mock works in-session only; the real MVP must persist entitlements across sessions and devices for a logged-in user.

Requirements:
1. After a successful single-episode unlock or pass purchase, the entitlement service records the grant against the user's account.
2. On subsequent visits, the Watch page asks the entitlement service whether the user holds an entitlement covering the requested `(showId, episodeNumber)` before rendering the locked state.
3. If the user holds an entitlement, the episode plays without a drawer; if not, the standard locked flow runs.
4. Entitlement evaluation runs server-side (or in a trusted service boundary). The client `unlocked=1` flag never grants access on its own.
5. After any unlock/purchase, the user returns to the same drama and same episode they were trying to watch. They are never sent to Home, the Pass page, or a catalog.

### 3.8 Restore purchases & multi-device basics

The real MVP must support at minimum:

1. **Same device, new session**: a logged-in user reopens the app and finds their previously unlocked episodes still unlocked, with no manual restore action.
2. **New device, same account**: a logged-in user on a new device sees all entitlements from their account; no manual restore action.
3. **Anonymous → logged in upgrade**: if a user purchased anonymously via an app-store mechanism (if such a flow is ever introduced — see §8 Q-OFFER-1), an explicit "Restore purchases" action must reconcile those purchases to the account. P0 of the real MVP can defer anonymous-purchase support entirely.
4. **Logged-in → logged-out**: logging out preserves entitlements on the account; they reappear on next login.
5. **Account recovery**: a clearly visible path to recover access if the user loses their login credential. Specifics gated on the auth provider decision (§8 Q-AUTH-1).

Receipt validation, fraud handling, and refund reconciliation are deferred to the production integration phase and are explicit hard stops for this PRD.

## 4. Functional Requirements by Area

Each area below describes **what the MVP must deliver** as a planning specification. None of these are tasked, scoped, or authorized for build by this PRD.

### 4.1 Content / catalog / admin ingestion

- The MVP needs at least one real drama with all episodes, posters, titles, synopses, and metadata. The exact source (licensed catalog, original commissioned content, partner feed) is **gated** — this PRD cannot authorize copying any competitor or licensed asset. See §8 Q-CONTENT-1.
- Each show must have: stable `showId`, title, logline, total episode count, `freeEpisodes`, ordered episode list with stable IDs, per-episode title and (optional) story hook, range tabs for long shows (e.g., 1-24 / 25-48), poster/key art with confirmed rights, and content rating/age suitability.
- Admin ingestion: there must be **some** way to add/update shows and episodes for the MVP launch — even if it is a manual editor-curated process initially. A full CMS is not required for the MVP.
- Versioning: changes to `freeEpisodes`, episode order, or pricing must be auditable so analytics and acceptance evidence remain interpretable.
- Originality: until §8 Q-CONTENT-1 is resolved, only original content created or licensed for this product can ship. The Phase 3 mock fixtures (`Midnight Lantern Oath`, etc.) are original and remain usable as placeholders for engineering testing but are **not** assumed to be the launch catalog.

### 4.2 Watch / playback shell vs. real video provider boundary

The MVP must separate the **watch shell** (route, chrome, episode sheet, drawer, lock state, completion UX, share/detail entries) from the **video playback provider** (the thing that actually decodes and streams bytes).

Requirements:
- The watch shell is product-owned and reused across providers.
- The playback provider is pluggable behind a small interface (load source, play, pause, seek, time updates, end event, error events, weak-network state).
- The MVP can ship with a single chosen provider; the architecture must not require rewriting the shell to switch providers later.
- The playback provider must communicate distinct states for: playing, paused, buffering / weak network, ended, error. The watch shell must render these distinctly from the locked state. (This is a continuation of the Phase 3 invariant that "locked state is visually distinct from weak network / video error state".)
- DRM, adaptive bitrate, captions/subtitles, multi-audio, and offline downloads are **not** required for the MVP. Captions are strongly recommended; the final accessibility floor is an open question (§8 Q-A11Y-1).
- Real video infrastructure (CDN, encoding, ingest, storage) is a hard stop for this PRD; it is part of the production integration gate, not the MVP planning artifact.

### 4.3 Auth / account

- A user has at most one identity. Anonymous browsing is a session, not an account; the session can be upgraded to an account via login.
- The account record must contain only what the MVP needs: a stable user ID, the login identifier (e.g., email, phone, OAuth subject), created-at, last-login-at, and a minimal locale/timezone signal for receipts and timestamps. Marketing fields are not required for the MVP.
- The auth surface must be reachable from the Unlock Drawer with a single tap.
- Logout must work without losing entitlements; re-login on the same device must restore the watch state.
- Account deletion must be supported to satisfy target-market law (see §8 Q-LEGAL-1) but the timeline and grace period are gated by legal review.
- Specific auth providers and password / passwordless / OAuth choices are an open question (§8 Q-AUTH-1).

### 4.4 Payment / subscription / pass purchase

- Real money must be collected through a vendor that is appropriate for the target market and app-store policy (gated, §8 Q-PAY-1).
- The payment surface must show local currency, local tax (where required), and disclosure copy required by target market law (gated, §8 Q-LEGAL-1).
- Single-episode unlock, story pass, subscription, and coin top-up are all **planning categories**, not committed product SKUs. The exact mix is an open question (§8 Q-OFFER-1).
- Recurring payments (subscriptions) require: explicit consent at purchase, accurate next-charge date, an in-product cancellation path, and renewal reminders if required by law. These requirements apply only if a subscription is included in the final launch mix.
- Receipts: the MVP must email or otherwise deliver a receipt for every real-money transaction. Receipt storage and access from the account surface are required.
- Refunds: a clear customer-support path must exist (§4.7). Self-serve refunds are not required for the MVP.
- The MVP must not store full card numbers or other PCI-scope data; vendor-hosted fields/tokens only.

### 4.5 Entitlement service

The entitlement service is the load-bearing real-MVP component. It owns the answer to: "Does this user have access to this episode right now?"

Requirements:
- Authoritative source of access decisions. The client never decides access on its own.
- Inputs: user ID, show ID, episode ID/number, current time, the user's grants (single-episode unlocks, story passes, active subscriptions, valid passes).
- Outputs: `granted: boolean`, plus enough metadata to drive the locked-state UX (which CTA to show, current balance, whether the user has a pass that covers this show, etc.).
- Idempotent grants: paying for the same episode twice must not double-charge or double-grant. The vendor's transaction ID anchors idempotency.
- Cross-device consistency: grants visible on Device A within a small bounded delay on Device B for the same account.
- Audit trail: every grant, revocation, and price/cost change is recorded. This is required for legal/customer-support traceability.
- The service must support the existing route shape — `?episode=[N]&unlocked=1` — as a UX hint only, with the real check happening server-side.

### 4.6 Attribution / analytics

- The MVP must measure the conversion funnel defined in PRD §10 (today's mock PRD): Ad Click → Watch Loaded → EP1 Start → EP1 Complete → Free Chain → First Lock Reached → Drawer Viewed → CTA Clicked → Pass/Coin Viewed → Unlock Success → Post-Unlock Play.
- Events must be designed with privacy compliance in mind: no PII in event payloads, hashed identifiers only where attribution requires them, target-market consent collected before any third-party event is fired.
- Facebook Pixel / CAPI integration is a candidate vehicle but is **not authorized** by this PRD. Selection and consent flow are open questions (§8 Q-ATTR-1).
- Server-side attribution (e.g., CAPI) is preferred over client-only Pixel where consent and reliability allow, but the choice is gated.
- Event naming, payload shape, and retention are planning items; the architecture phase must propose a concrete schema before any vendor is wired up.

### 4.7 Notifications / retention (MVP-relevant only)

In scope as planning:
- Transactional notifications: receipts, subscription renewal reminders (if a subscription is included), refund confirmations, account changes. Channels (email, in-app, push) and providers are open questions.

Out of scope for the real MVP:
- Marketing push notifications, re-engagement campaigns, lifecycle email, recommendation digests.

The PRD does **not** authorize collecting marketing consent or running campaigns in the MVP.

### 4.8 Customer support / refunds (MVP-relevant only)

- A clearly visible support contact must exist (in-product link, email, or both). The specific channel is gated by operations capacity (§8 Q-SUPPORT-1).
- A refund must be possible via that channel. Self-serve refund flows are not required for the MVP.
- The entitlement service must support a manual revoke / re-grant operation that customer support can use (planning-level; the specific tooling is for the production integration phase).
- Support must have read-only access to a user's purchase history and entitlement grants. Implementation of this back-office is a hard stop for this PRD.

## 5. Non-Goals & Approval Gates

### 5.1 Non-goals for the real MVP

The real MVP will not:
- Re-open the Prototype A/B/C/D/E direction.
- Add browse/search/Home as primary funnels. They remain auxiliary.
- Add an originals/recommendation engine.
- Add social features (comments, ratings, sharing beyond a simple share-link).
- Add downloads / offline playback.
- Add multi-language UI. (Multi-language ad landing pages are P1+ in the existing PRD.)
- Add a creator/uploader tool.
- Add server-side personalization or A/B testing infrastructure (campaign-level A/B is fine if the chosen ad platform supports it natively).
- Add age gating or geographic gating beyond what target-market law strictly requires.
- Add NovelHub production infra. NovelHub is a future infrastructure reference only.

### 5.2 Hard-stop approval gates

No work in the following areas may begin without an explicit, named human approval recorded against the corresponding open question in §8:

| Area | Gate (open question) | Approver type |
| --- | --- | --- |
| Content catalog / licensing | Q-CONTENT-1 | Business + Legal |
| Auth provider selection | Q-AUTH-1 | Business + Engineering lead |
| Payment processor selection | Q-PAY-1 | Business + Legal + Finance |
| Offer mix (single-ep / pass / subscription) | Q-OFFER-1 | Business |
| Attribution & analytics vendor + consent | Q-ATTR-1 | Legal + Business |
| Legal copy, ToS, privacy, refunds, age gating | Q-LEGAL-1 | Legal |
| Accessibility floor (captions, etc.) | Q-A11Y-1 | Business + Product |
| Customer support channel & SLA | Q-SUPPORT-1 | Business + Operations |
| Production deployment / DNS / secrets | (production integration gate) | Business + Security + Engineering lead |

Until each gate is signed, the corresponding area remains a planning specification only.

## 6. Success Metrics & Events

### 6.1 North-star metric

**First Lock Conversion Rate (FLCR)** (carried forward from the mock PRD §10):

> Number of unique users who complete an unlock or pass purchase / Number of unique users who reached the first locked episode in the same session.

### 6.2 Funnel metrics

The MVP must be able to report each step of:

1. Ad Click → Watch Page Loaded
2. Watch Page Loaded → EP1 Start
3. EP1 Start → EP1 Complete
4. EP1 Complete → Free Chain Continue
5. Free Chain → First Locked Episode Reached
6. First Locked Episode Reached → Unlock Drawer Viewed
7. Unlock Drawer Viewed → Unlock CTA Clicked (primary or secondary)
8. Unlock CTA Clicked → Pass/Coin Option Viewed (where applicable)
9. Unlock CTA Clicked → Unlock Success (real, not mock)
10. Unlock Success → Post-Unlock Episode Played

### 6.3 Supporting metrics

- Time from Ad Click to EP1 Start (latency / drop-off proxy).
- Time spent on each free episode (proxy for engagement before the lock).
- Distribution of single-episode unlocks vs. pass/subscription purchases at the first lock.
- Repeat unlock rate after the first paid unlock (within the same drama and across dramas).
- Cross-device entitlement-hit rate (sessions where a returning user's existing entitlement granted access without a fresh drawer).
- Login conversion at the Unlock Drawer (fraction of users who reach the drawer and complete login).
- Refund / chargeback rate.

### 6.4 Privacy & compliance cautions on every metric

- Every event must be designed with the assumption that the user has **not yet consented** to third-party tracking. Until consent is recorded, the MVP must either (a) not fire third-party calls, or (b) fire only consent-safe variants if such a thing is offered by the chosen vendor — final policy gated on Q-ATTR-1.
- User identifiers in analytics must be hashed or pseudonymous; raw email/phone must not appear in event payloads.
- Attribution params (`campaign_id`, etc.) must be treated as sensitive when joined to user identity; data retention is gated on Q-LEGAL-1.
- Region-based rules (e.g., consent regimes that require pre-consent blocking of analytics) must be honored. The geographic decision is gated on Q-LEGAL-1.
- Acceptance evidence (screenshots, recordings) must not embed real user data.
- The MVP must not measure or report success in a way that requires collecting more data than the lawful basis allows.

## 7. Open Questions Requiring Approval

These questions must be resolved before the relevant area in §4 / §5 can move from planning into architecture and build. Each maps to a gate in §5.2.

### Q-CONTENT-1 — Catalog source and rights

- What content ships at launch? Original, commissioned, licensed, or a partner feed?
- Who owns rights to the title, episodes, posters, copy, and translations?
- Does the launch catalog include the existing mock fixtures (`Midnight Lantern Oath`, etc.) or are they engineering-only placeholders?
- Approver: Business + Legal.

### Q-AUTH-1 — Auth provider and methods

- Which identity providers (email passwordless, phone OTP, Apple, Google, etc.) are offered?
- Self-hosted vs. vendor-hosted identity?
- Account recovery flow specifics.
- Approver: Business + Engineering lead.

### Q-PAY-1 — Payment processor and SKUs

- Which processor(s) for web payments?
- App-store policy: does the MVP ship as a web/PWA only, or also as native? If native, app-store IAP rules apply.
- Coin pack denominations (if coin packs are in the offer mix per Q-OFFER-1).
- Approver: Business + Legal + Finance.

### Q-OFFER-1 — Offer mix at the first lock

- Which of {single-episode unlock, story pass, subscription, episode pack, coin pack} ship in the MVP?
- Pricing per option, per market.
- Subscription cadence (weekly/monthly) and auto-renew default.
- Approver: Business.

### Q-ATTR-1 — Attribution / analytics vendor & consent flow

- Which analytics platform(s)? Pixel, CAPI, server-side analytics, first-party only?
- Consent flow: where and when is consent collected for users in regions that require it?
- Pre-consent attribution buffer policy.
- Approver: Legal + Business.

### Q-LEGAL-1 — Legal copy, regions, age, ToS

- Target launch markets and the consumer-protection / privacy regime in each.
- Final wording for ToS, privacy policy, refund policy, subscription disclosures, age suitability.
- Marketing-consent default and double-opt-in requirements per market.
- Approver: Legal.

### Q-A11Y-1 — Accessibility floor

- Captions/subtitles required at launch?
- Screen-reader behavior on the watch shell, episode sheet, and unlock drawer.
- Color/contrast and tap-target sizes (the existing 390×844 reference is mobile-only — confirm scope).
- Approver: Business + Product.

### Q-SUPPORT-1 — Customer support channel and SLA

- Email-only, in-product form, or chat? Hours / target response time?
- Refund authorization policy (auto vs. case-by-case).
- Back-office staffing assumption.
- Approver: Business + Operations.

## 8. Acceptance Criteria for PRD Readiness

This PRD is **ready** to drive the architecture artifact (`docs/moboreels/real-mvp/architecture.md`, currently outlined under the Phase 4-002 architecture prompt) when **all** of the following are true. Items that depend on open questions are explicitly marked.

- [ ] §1 status confirms the document is approved by the product owner.
- [ ] §2 product thesis and target user have been reviewed and signed by Business.
- [ ] §3 user flows preserve every Phase 3 invariant: watch-first landing, free preview without login, per-drama lock point, unlock drawer at the first locked episode, same-episode return after unlock, no Home redirect, no loss of `source=facebook` or other attribution.
- [ ] §4 functional requirements have been reviewed by Engineering for feasibility (no implementation, just feasibility).
- [ ] §5 non-goals and approval gates have been countersigned by each named approver type.
- [ ] §6 success metrics have been reviewed by Legal for privacy/compliance compatibility against target markets (depends on Q-LEGAL-1).
- [ ] §7 open questions Q-CONTENT-1, Q-AUTH-1, Q-PAY-1, Q-OFFER-1, Q-ATTR-1, Q-LEGAL-1, Q-A11Y-1, Q-SUPPORT-1 each have a named owner and a target decision date.
- [ ] The traceability link to `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` is reconfirmed — nothing in this PRD silently overrides the mock P0 invariants.
- [ ] No language in this document instructs implementation of any hard-stop area (production payment, login, backend, video, Facebook API, analytics, deployment, DNS, secrets, NovelHub production infra).
- [ ] No language in this document instructs use of competitor, licensed, or brand-significant assets.

When all boxes are checked, the architecture role (Phase 4-002) may proceed using this PRD as its primary requirements input.
