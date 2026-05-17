# PHASE4C-001 — Auth Return-Path Contract Spike Spec

Status: Phase 4C spike spec (requirements/architect gate)
Scope class: documentation/spec only, staging-only, fake-money, safe original placeholder content
Predecessors: `docs/moboreels/real-mvp/spike-plan.md` §4 Spike 1, `docs/moboreels/real-mvp/decision-packet.md`, `docs/moboreels/real-mvp/prd.md`, `docs/moboreels/real-mvp/roadmap.md`, `docs/moboreels/real-mvp/gap-risk-register.md`
Authorization base: User-approved Phase 4B default route on 2026-05-17 (A1.3 / A2.1 / B4 direction + B5 execution / C1 sequence)

This document is a planning artifact only. It does not authorize, implement, or schedule any production work. Every concrete identifier (`/fake-auth/...`, `dramadev_auth_state`, etc.) named below is a contract placeholder for a future local/staging-only simulator, not a deployable endpoint.

## 1. Goal

Prove, on paper and in a later local/staging simulator only, that the paid-action login interruption preserves:

1. the exact same locked episode the user was trying to unlock,
2. the Unlock Drawer state that was open when they tapped the paid CTA,
3. all safe attribution params (`source`, `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, `utm_content`) that arrived with the Facebook ad landing,
4. the user's monetization intent (`single_episode_unlock` or `story_pass`),

without ever (a) requiring login before the free preview, (b) treating `unlocked=1` as authoritative access, or (c) connecting any real identity provider, backend, or production secret.

The spike succeeds when this contract is fully described, has explicit stop conditions, and has an evidence checklist a reviewer can run against a future local/staging fake simulator.

## 2. Preserved P0 invariants

The auth return-path contract must preserve every invariant accepted in the Phase 3 mock-only P0 (`docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`, reaffirmed in `prd.md` §3 and `roadmap.md` §1):

- **Watch-first landing.** `/variant-b/watch/[showId]?episode=1&source=facebook` lands directly on the Watch page. No interstitial, no Home redirect, no Show Detail redirect, no PWA install prompt, no login wall.
- **Free-preview-first.** EP1 through EP(`show.freeEpisodes`) play without any account, login prompt, paywall, recharge prompt, or pass prompt. (Same rule restated in `prd.md` §3.2 and `gap-risk-register.md` risk row "Login before preview hurts conversion".)
- **Per-drama lock point.** The lock point is `show.freeEpisodes`; the first locked episode opens the Unlock Drawer automatically (`prd.md` §3.3).
- **Login only at paid action.** Login is triggered only by Unlock Drawer primary CTA, secondary CTA, restore purchases, wallet/balance surfaces, or explicit cross-device resume (`prd.md` §3.4).
- **Same-episode return.** After auth (success, cancel, or failure), the user lands back on the same `(showId, episode)` with the Unlock Drawer reopened in the same state. They are never sent to Home, Show Detail, a generic catalog, or the Pass page on cancel.
- **Attribution params survive.** `source=facebook` and all attribution keys defined in `src/lib/query-params.ts` (`ATTRIBUTION_KEYS`) round-trip through the auth detour without loss or unsafe mutation.
- **`unlocked=1` is UX state only.** It is never accepted as proof of access. Entitlement authority is delegated to the Spike 2 contract (`spike-plan.md` §4 Spike 2). This spike must not introduce any path where `unlocked=1` alone grants playback.

## 3. Scope

### 3.1 Allowed

- Writing the contract, route shape, state-token shape, and return matrix in this document.
- Designing a local/staging "fake auth" simulator that lives only in non-production code paths and is clearly labelled as a mock surface in UI copy.
- Reusing the existing static Next export and existing `src/lib/query-params.ts` route helpers as the unmodified routing baseline.
- Defining a state token schema (`AuthReturnState`) that a future real provider could populate, without any real provider being chosen here.
- Original placeholder copy ("Sign in to unlock (fake)", "Mock auth — no account is created", etc.) clearly marked as non-production.

### 3.2 Not allowed (hard stops)

Per `spike-plan.md` §3 and `prd.md` §5.2, this spike must not propose, require, or assume:

- Any real OAuth, OIDC, SAML, OTP, email, SMS, or social login provider.
- Any production user account store, session store, or credential store.
- Any production secret, signing key, JWT signing service, or production HMAC.
- Any real backend, database, ledger, wallet, CDN, or video pipeline.
- Any real Facebook Pixel, CAPI, Meta API call, or production analytics endpoint.
- Any production deployment, DNS, cutover, persistent public service, or real traffic.
- Any licensed/competitor video, title, poster, copy, or music.
- Removing mock disclaimers or finalizing legal copy (gated on `prd.md` §8 Q-LEGAL-1).
- Any login wall, account capture form, marketing-opt-in default, or PWA install prompt before the free preview is complete.
- Treating `unlocked=1` as authoritative access on success.
- Decisions that belong to `prd.md` §8 Q-AUTH-1 (provider selection), Q-ATTR-1 (consent flow), or Q-PAY-1 (payment processor).

Any task that crosses these lines must stop and request explicit user approval per `spike-plan.md` §3.

## 4. Fake auth route/return contract

This is a contract sketch for the future local/staging simulator. No route below may be implemented as a production endpoint by this spike.

### 4.1 Entry route (from Unlock Drawer paid CTA)

When the user taps the primary or secondary CTA in the Unlock Drawer on a locked episode and is not already in a logged-in (fake) session:

```txt
Watch page                  /variant-b/watch/[showId]?episode=N&source=facebook&...
   |
   v  user taps "Unlock EP N" or "Story Pass" CTA
Fake auth start (planned)   /fake-auth/start?return_state=<opaque-token>
```

- The Watch page is responsible for building the `return_state` token before navigation.
- The Watch page must not strip attribution or change `episode` when constructing the token.
- The Watch page must not navigate to `/fake-auth/start` before the user has explicitly tapped a paid CTA.

### 4.2 Fake auth surface (staging only)

```txt
/fake-auth/start?return_state=<opaque-token>
   |
   v  user picks one of: Sign in (fake) / Cancel / Simulate failure
/fake-auth/callback?return_state=<opaque-token>&result=<success|cancel|failure>[&fake_user=<id>]
```

Constraints:

- The fake auth surface displays a banner: "Mock auth — no real account is created. Staging only."
- It accepts no real credentials. The only inputs are deterministic buttons.
- It never persists anything outside the current browser session.
- It never calls a third-party endpoint.

### 4.3 Return route (back to Watch)

```txt
/fake-auth/callback
   |
   v  controller validates return_state, picks branch by `result`
/variant-b/watch/[showId]?episode=N&<attribution>&drawer=open&drawer_intent=<intent>[&auth_result=<result>][&unlocked=1*]
```

`unlocked=1` may appear **only** on the `result=success` branch and **only** as a UX hint. A future Spike 2 entitlement check, not this flag, decides whether the episode plays. On any non-success branch, `unlocked=1` must not be present.

### 4.4 State token shape (`AuthReturnState`)

Conceptual schema (not a wire format choice):

```txt
AuthReturnState {
  showId:       string                  // exact showId from the originating Watch URL
  episode:      number                  // the locked episode the user tapped to unlock
  intent:       "single_episode_unlock" | "story_pass"
  drawer:       {
    open:        true                   // drawer must reopen after return
    focusedCta:  "primary" | "secondary"
  }
  attribution:  {                       // mirrors ATTRIBUTION_KEYS in src/lib/query-params.ts
    source?:        string
    campaign_id?:   string
    adset_id?:      string
    ad_id?:         string
    creative_id?:   string
    placement?:     string
    utm_source?:    string
    utm_campaign?:  string
    utm_content?:   string
  }
  nonce:        string                  // single-use replay-protection token (fake in staging)
  issuedAt:     ISO-8601 timestamp
  // No PII. No email, phone, password, card, or device fingerprint.
}
```

- Fields are required only for the keys above. Unknown query keys arriving at `/fake-auth/start` must be dropped (see §6).
- The token is opaque to the URL. Encoding is an implementation detail deferred to the simulator; it must be revocable and single-use in any future real version.
- `nonce` exists in the contract so the future real provider can implement replay protection. The staging simulator may treat it as a random string; it must still verify the token round-trips unchanged.

## 5. Required query/state fields

| Field | Origin | Required? | Notes |
| --- | --- | --- | --- |
| `showId` | path segment of Watch URL | Yes | Carried through unchanged. |
| `episode` | Watch query | Yes | Integer; clamp behavior matches `clampEpisode` in `src/lib/query-params.ts`. |
| `intent` | paid CTA tapped | Yes | `single_episode_unlock` for primary CTA, `story_pass` for secondary CTA. |
| `drawer.open` | derived | Yes | Always `true` on return. |
| `drawer.focusedCta` | paid CTA tapped | Yes | Mirrors which CTA initiated auth. |
| `attribution.source` | Watch query | Conditional | Required if present at landing; must not be invented. |
| `attribution.campaign_id` | Watch query | Conditional | Same rule. |
| `attribution.adset_id` | Watch query | Conditional | Same rule. |
| `attribution.ad_id` | Watch query | Conditional | Same rule. |
| `attribution.creative_id` | Watch query | Conditional | Same rule. |
| `attribution.placement` | Watch query | Conditional | Same rule. |
| `attribution.utm_source` | Watch query | Conditional | Same rule. |
| `attribution.utm_campaign` | Watch query | Conditional | Same rule. |
| `attribution.utm_content` | Watch query | Conditional | Same rule. |
| `nonce` | generated client-side (fake) | Yes | Single-use; documented as fake in staging. |
| `issuedAt` | generated client-side (fake) | Yes | For freshness checks in any future real version. |
| `auth_result` | added on return | Yes | `success` \| `cancel` \| `failure`. |
| `unlocked` | added on return | Conditional | Only on `auth_result=success` and only as UX hint. |
| `fake_user` | added on return | Optional | Opaque staging-only user ID, never PII. |

Any other key arriving on the Watch URL, the start URL, or the callback URL must be treated as unsafe and dropped before navigation (see §6.2).

## 6. Attribution preservation / filtering

The spike must define exactly how attribution keys are carried through the detour and how unknown/unsafe keys are filtered.

### 6.1 Preservation rules

- The allow-list is the existing `ATTRIBUTION_KEYS` constant in `src/lib/query-params.ts`. This spike does not authorize adding or removing keys; that would be a separate Q-ATTR-1 decision per `prd.md` §8.
- Every attribution key present on the original Watch URL must appear unchanged on the post-callback Watch URL on every branch (success, cancel, failure).
- Attribution keys must never be modified, normalized, or hashed in this spike. Hashing/pseudonymisation belongs to the Spike 5 (event taxonomy) contract and to the Q-ATTR-1 gate.
- The encoded `AuthReturnState` carries a copy of attribution so the callback handler can rehydrate the Watch URL even if the auth detour clobbered query strings.

### 6.2 Filtering rules

- The Watch page, the `/fake-auth/start` surface, and the `/fake-auth/callback` handler must each reject any query key that is not in: `{episode, unlocked, source, campaign_id, adset_id, ad_id, creative_id, placement, utm_source, utm_campaign, utm_content, return_state, result, fake_user, drawer, drawer_intent, auth_result}`.
- Rejected keys must be dropped silently; they must not appear in logs, evidence screenshots, or analytics payloads.
- Values must be string-typed and length-capped (recommend 256 chars per value) so a malformed deep link cannot exfiltrate arbitrary payloads through the detour. The simulator must enforce the cap before encoding `AuthReturnState`.
- No attribution key may ever be promoted into a server-side user profile field by this spike; it is routing/measurement context only.

## 7. No-login-before-free-preview requirements

This is the most load-bearing invariant for the funnel (`gap-risk-register.md` risk row "Login before preview hurts conversion"; `prd.md` §3.2/§3.4).

The spike spec must enforce, and the evidence checklist must prove:

1. Visiting `/variant-b/watch/[showId]?episode=1&source=facebook` never renders a login surface, auth prompt, account capture form, or PWA install banner before EP1 plays.
2. Playing EP1 through EP(`show.freeEpisodes`) requires zero auth calls — real or fake.
3. Tapping "next episode" inside the free chain does not trigger `/fake-auth/start`.
4. Opening the Episode Sheet, Show Detail, or Unlock Drawer during free preview does not trigger `/fake-auth/start`. The drawer may render and may show "Sign in to unlock" copy inside the CTA itself; tapping the CTA is the only trigger.
5. Reloading the Watch page during the free chain does not navigate the user to any auth route.
6. Returning from a hypothetical auth detour onto a free episode (e.g., the user manually edits `episode` to a free value) must still not gate playback behind login.

Any spec language, simulator design, or evidence task that violates any of (1)–(6) is a stop condition (see §10).

## 8. Same-locked-episode return requirements

For every branch of the success/cancel/failure matrix, the user must end on the exact same `(showId, episode)` they tried to unlock, with the Unlock Drawer in a consistent state:

- `showId` byte-equal to the originating URL segment.
- `episode` numerically equal to the originating `episode` query (post-clamp).
- All attribution keys present in §6.1 round-trip unchanged.
- The Unlock Drawer reopens automatically after navigation. The drawer's focused CTA matches the original `drawer.focusedCta` from `AuthReturnState`.
- No redirect to Home, Show Detail, the Pass page, a recharge surface, or a generic catalog occurs on cancel or failure.
- No silent navigation to a different `episode` (e.g., to the next free episode, or to EP1) occurs on any branch.
- A free-chain episode is never substituted for the originally locked episode, even on failure.
- Reload of the post-return URL must reproduce the same locked state and reopen the drawer (the URL is sufficient to rehydrate; no in-memory-only state is required).

## 9. Success / cancel / failure matrix

Each row is a scenario the future local/staging simulator and evidence checklist must cover. "Locked EP" means the first locked episode for the originating show (i.e., `show.freeEpisodes + 1`, or the specific locked `episode` the user tapped from).

| # | Scenario | Trigger | Expected `auth_result` | `unlocked` query on return | Final URL `episode` | Drawer state on return | Attribution preserved? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Anonymous land on free chain | Ad URL → EP1 | n/a (no auth) | absent | 1 | closed | yes | No `/fake-auth/*` route touched. |
| 2 | Free chain navigation | EP1 → EP2 ... → EP(freeEpisodes) | n/a | absent | unchanged | closed | yes | No auth call at any free step. |
| 3 | Arrive at first locked EP | Continue from free chain | n/a | absent | Locked EP | open, primary focused | yes | Drawer opens automatically; no `/fake-auth/*` yet. |
| 4 | Dismiss drawer with "Maybe later" | User taps dismiss | n/a | absent | Locked EP | closed; reopens on tap | yes | Still no auth route. |
| 5 | Primary CTA → fake auth success | Tap "Unlock EP N" | `success` | `1` (UX hint only) | Locked EP | open, primary focused, success toast | yes | Spike 2 entitlement is the authority on actual playback. |
| 6 | Secondary CTA → fake auth success | Tap "Story Pass" | `success` | `1` (UX hint only) | Locked EP | open, secondary focused, success toast | yes | Same locked episode; Pass page not used as the success surface. |
| 7 | Primary CTA → fake auth cancel | User taps Cancel in fake auth | `cancel` | absent | Locked EP | open, primary focused, non-error copy | yes | No Home/Show Detail redirect. |
| 8 | Secondary CTA → fake auth cancel | User taps Cancel in fake auth | `cancel` | absent | Locked EP | open, secondary focused, non-error copy | yes | Same locked episode. |
| 9 | Fake auth failure | Simulated provider failure | `failure` | absent | Locked EP | open, original focused CTA, error copy distinct from network/video error | yes | Error copy must not imply payment was charged. |
| 10 | Fake auth nonce reuse / replay | Click callback link twice | first `success`, second rejected | first `1`, second absent | Locked EP | reopens with non-error replay copy | yes | Simulator may surface a "session expired" placeholder; must not double-grant. |
| 11 | Tampered `return_state` | Hand-edited token | rejected | absent | Locked EP | open, original focused CTA, error copy | yes (from original URL or token, whichever is intact) | Must fail closed; never grants `unlocked=1`. |
| 12 | Missing `return_state` | Direct visit to `/fake-auth/callback` | rejected | absent | last known Watch URL or `/variant-b/watch/[showId]?episode=1` fallback | closed | best-effort | Must not navigate to Home or a catalog. |
| 13 | User edits URL to add `unlocked=1` without auth | Hand-edited Watch URL | n/a | present in URL only | unchanged | drawer still opens on locked EP | yes | Spike 2 entitlement check ignores the URL flag; this spike must not weaken that. |
| 14 | Manual back navigation mid-auth | Browser back from `/fake-auth/start` | n/a | absent | Locked EP | open, original focused CTA | yes | No auth call completes; state is unchanged. |

Each row must be reproducible from URL state alone (no in-memory-only assumptions), so the evidence checklist can be screenshotted/recorded deterministically.

## 10. Evidence checklist

A future local/staging implementation of this contract is acceptable for the Phase 4C reviewer gate only when every item below has reproducible evidence (test, screenshot, recording, or signed-off route table). This spike spec produces the checklist; producing the evidence belongs to the subsequent Phase 4D plan.

- [ ] Route table for §9 matrix rows 1–14, with expected URLs and drawer states, captured against a local/staging build.
- [ ] Automated test (unit or integration) proving rows 1–4 never touch `/fake-auth/*`.
- [ ] Automated test proving rows 5–9 land on the exact same `(showId, episode)` they started from.
- [ ] Automated test proving every attribution key in `ATTRIBUTION_KEYS` round-trips unchanged through rows 5–9.
- [ ] Automated test proving rows 10–12 fail closed (no `unlocked=1`, no entitlement assumption).
- [ ] Automated test proving row 13 does not grant playback in the future Spike-2-integrated build (cross-referenced; not required to be implemented in this spike).
- [ ] Manual or automated screenshot of the Unlock Drawer reopened with the correct focused CTA after success, cancel, and failure.
- [ ] Documented confirmation that no real OAuth/OTP/email/SMS provider is contacted by the simulator (e.g., network log shows zero third-party calls).
- [ ] Documented confirmation that no production secret is required to run the simulator.
- [ ] Documented confirmation that no PII (email, phone, card) is collected by the simulator surface.
- [ ] Mock disclaimer ("Mock auth — staging only") visible on every fake auth surface in every screenshot/recording.
- [ ] Reviewer-readable cross-reference to Spike 2 (entitlement) and Spike 5 (event taxonomy) for the parts this spike intentionally defers.
- [ ] Statement of what remains unapproved for real implementation: provider selection (Q-AUTH-1), consent flow (Q-ATTR-1), legal copy (Q-LEGAL-1), payment processor (Q-PAY-1).

## 11. Stop conditions

The spike must halt and request explicit user approval if any task or follow-on plan proposes any of the following. This list is exhaustive for this spike; it inherits from `spike-plan.md` §3 and §4 Spike 1:

- Selecting, integrating, or signing up for any real identity provider (email passwordless, phone OTP, Apple, Google, Auth0, Firebase Auth, Cognito, Supabase Auth, Clerk, etc.).
- Implementing any production user account store, session store, or credential store.
- Generating, storing, or rotating any production secret, signing key, or JWT signing service.
- Connecting any real backend, database, or persistent storage to the auth flow.
- Connecting any real payment processor, app-store IAP, or wallet service to the auth flow.
- Firing any real Facebook Pixel, CAPI, Meta API, or production analytics call from the auth surfaces.
- Deploying the fake auth simulator to a production domain, a public domain without a staging disclaimer, or behind production DNS.
- Adding any login wall, account capture form, marketing-opt-in default, email verification gate, or PWA install prompt to the free preview path.
- Treating `unlocked=1`, browser storage, or any client-only state as authoritative entitlement.
- Modifying `ATTRIBUTION_KEYS` in `src/lib/query-params.ts` without a separate Q-ATTR-1 decision.
- Replacing or removing the existing "mock"/"staging" disclaimers in any copy without an approved legal/product replacement (gated by Q-LEGAL-1).
- Using competitor or licensed titles, posters, drama art, music, or copy on any auth surface.
- Storing real email, phone, card, government ID, biometric, or device fingerprint data in any fake-user record.
- Re-opening Prototype A/C/D/E direction or moving auth to before the free preview.
- Beginning Phase 4D implementation before all five Phase 4C spike specs pass the reviewer gate.

## 12. Go/no-go recommendation

Recommendation: **GO for documentation/spec only, with the contract above as the deliverable for PHASE4C-001.**

This recommendation authorizes:

- Treating this document as the auth return-path contract input to Phase 4C synthesis (`spike-plan.md` task PHASE4C-006) and the independent reviewer gate (PHASE4C-007).
- Cross-referencing this contract from PHASE4C-002 (entitlement state machine), PHASE4C-003 (fake payment), and PHASE4C-005 (event taxonomy) so they share a single source of truth for auth detour fields.
- A later, separately authorized Phase 4D plan that builds a local/staging fake auth simulator strictly within §3.1, §4, §5, §6, §7, §8, §9, §10, and §11 of this document.

This recommendation does **not** authorize:

- Picking an auth provider (`prd.md` §8 Q-AUTH-1 remains open).
- Picking a consent flow or analytics vendor (Q-ATTR-1 remains open).
- Finalizing legal copy on any auth surface (Q-LEGAL-1 remains open).
- Any production deployment, DNS, secret, or real-money flow.

Open follow-ups to surface at the reviewer gate:

1. Confirm `AuthReturnState.nonce` and `issuedAt` are sufficient placeholders for the future real-provider replay-protection design, or whether a CSRF/state-token shape will be required earlier.
2. Confirm the §6.2 query allow-list is complete once Spike 3 (fake payment) and Spike 5 (event taxonomy) publish their own callback keys, since those keys may need to round-trip through `/fake-auth/*` too.
3. Confirm the §9 row-13 expectation against the Spike 2 entitlement contract: this spike asserts URL `unlocked=1` must never grant playback; Spike 2 must own the enforcement.
4. Confirm that drama-specific copy on the fake auth surface stays generic (no show titles or posters) until Q-CONTENT-1 is resolved.

When the reviewer gate returns APPROVE on this document plus PHASE4C-002 through PHASE4C-005, Phase 4C is complete for the auth path and Phase 4D may begin planning — not building — a local/staging simulator that conforms to this contract.
