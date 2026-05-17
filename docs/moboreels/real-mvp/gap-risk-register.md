# Real MVP Gap / Risk Register — SceneFlow Mock P0 to Real MVP

Status: feasibility review
Verdict: REVISE before any real-MVP build plan
Scope reviewed: current mock-only SceneFlow P0, PRD source of truth, Phase 3 acceptance evidence, and repo implementation state.

## Summary

The mock P0 is a useful conversion-flow proof: a static Next export can deep-link from Facebook-style traffic to a watch page, preserve episode/source query params, progress through the free chain, hit the first locked episode, open the Unlock Drawer, and return mock unlock/pass users to the same episode with `unlocked=1`.

The real MVP gap is large. The current repo intentionally has no backend, auth, entitlement ledger, payment processor, production analytics, Facebook integration, real video player, content storage, or compliance layer. Treat the current app as a UX prototype and acceptance artifact only; do not evolve it into production by incrementally hiding mock copy and wiring real money/events behind the same lightweight state.

## Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- `docs/moboreels/phase3-acceptance/checklist.md`
- `docs/moboreels/phase3-acceptance/known-issues.md`
- `src/app/variant-b/watch/[showId]/watch-stub.tsx`
- `src/app/variant-b/pass/pass-stub.tsx`
- `src/data/fixtures/shows.ts`
- `src/lib/query-params.ts`
- `src/lib/lock.ts`
- `package.json`
- `next.config.mjs`

## Current mock baseline

- Static Next.js export only (`output: 'export'`).
- Client-side route/query parsing for `episode`, `unlocked`, and safe attribution params.
- Fixture stories in `src/data/fixtures/shows.ts`; primary P0 story has 36 episodes, `freeEpisodes: 5`, first lock at EP6, mocked coin balance/cost.
- Mock unlock is a URL flag, not durable entitlement: `/variant-b/watch/[showId]?episode=[episode]&unlocked=1`.
- Mock pass page preserves story/episode/source context and returns to the same unlocked episode.
- Phase 3 acceptance evidence says P0 route and mock flow pass locally, with explicit no-real-payment/auth/backend/Facebook/video/analytics boundary.

## Key feasibility findings

| Area | Feasibility | Finding |
| --- | --- | --- |
| Watch-first funnel | Feasible | The UX route shape is proven in a static prototype and should remain the real MVP's primary landing route. |
| Real content playback | High gap | Current vertical player is a placeholder; real video needs hosting, transcoding, streaming, poster/asset rights, failure states, and mobile performance work. |
| Entitlements/unlock | High gap | `unlocked=1` is not security. Real unlock needs server-authoritative ownership, wallet/pass state, idempotent transactions, restore behavior, and abuse controls. |
| Payments/coins/pass | High gap | Current pass/coins copy is mock-only. Real money introduces app-store/payment processor policy, taxes, refunds, chargebacks, receipts, renewal/cancellation semantics, and pricing localization. |
| Auth/account | High gap | Free preview can remain anonymous, but paid unlock/pass needs identity or durable anonymous-to-account migration without blocking the free chain. |
| Facebook attribution | Medium/high gap | Query params are preserved, but no Pixel/CAPI/events/consent/de-duplication/campaign mapping exists. Production analytics is explicitly outside P0. |
| Backend/database | High gap | No content, user, wallet, transaction, entitlement, analytics, or audit data model exists in code. NovelHub is reference only, not an implementation target for this P0. |
| Compliance/privacy | High gap | Real MVP needs privacy policy/terms, consent posture, payment disclosures, refund handling, data deletion/account support, minors/content policy review, and licensed content controls. |
| Testability | Medium gap | Unit coverage exists for route/lock helpers; real MVP needs integration/e2e tests for auth, payment callbacks, entitlements, event tracking, and video failure states. |

## Hidden dependencies

1. Content rights and asset pipeline: original/licensed videos, posters, titles, captions, thumbnails, and takedown process.
2. Video infrastructure: ingest, transcoding, storage/CDN, adaptive streaming, signed URLs, resume/progress, and network/error states distinct from locked state.
3. Identity model: anonymous preview sessions, login trigger point, account recovery, cross-device restore, and purchase association.
4. Wallet/entitlement service: coin balance, single-episode unlock, story pass, transaction ledger, idempotency, fraud/abuse limits, support/audit tooling.
5. Payment processor and app/channel policy: card/payment provider or platform purchase rules, refunds, tax/VAT, receipts, subscription/pass wording, and regional restrictions.
6. Facebook/Meta measurement: Pixel vs CAPI decision, event taxonomy, consent mode, dedupe keys, campaign/ad creative mapping, and privacy review.
7. Operational support: customer support workflows for failed unlocks, duplicate charges, refunds, account loss, and content complaints.
8. Security review: rate limits, replay protection, entitlement checks server-side, signed media URLs, webhook verification, and secret management.

## Risks and mitigations

| Risk | Severity | Why it matters | Mitigation |
| --- | --- | --- | --- |
| Mock URL unlock leaks into production | Critical | Anyone can append `unlocked=1`; this would bypass payment and corrupt metrics. | Delete URL-flag entitlement from any production path; require server-authoritative entitlement before playback. |
| Payment/pass semantics are unclear | Critical | Misleading subscription/pass/coin copy can create legal, refund, app-review, and user-trust issues. | Product/legal must define coin packs, story pass duration/scope, auto-renew status, cancellation/refund language before build. |
| Real video scope explodes MVP | High | Streaming infrastructure can dominate schedule and hide funnel learnings. | Spike minimal licensed/original video delivery separately; keep UX funnel branch mock until video provider/storage choice is approved. |
| Facebook analytics overreach | High | Pixel/CAPI and production attribution require consent/privacy/security work. | Start with an event taxonomy and local/staging instrumentation plan; no production Meta API or Pixel in current P0. |
| Login before preview hurts conversion | High | Violates the PRD's free-preview-first rule. | Make auth optional until paid action; add tests proving EP1-free chain does not require login. |
| Post-purchase context loss | High | Returning to Home/pass page after payment would break the core conversion promise. | Preserve `showId`, `episode`, and attribution through auth/payment redirects; add e2e coverage for callbacks and failures. |
| Static export assumptions break real routing | Medium | Dynamic auth/payment/video callbacks may need server runtime. | Decide deployment/runtime after backend architecture, not inside the current static P0. |
| Fixture data hides data-model gaps | Medium | Real stories have variable episode counts, prices, availability, locales, and lock rules. | Define a content schema and migration path before connecting a database. |
| Debug/mock copy becomes stakeholder-facing production copy | Medium | Current copy intentionally says mock/no payment; removing it requires UX/legal review. | Create real-MVP copy deck with legal/trust placeholders resolved before production demo. |

## Open questions

1. What is the real MVP's monetization unit: coins, single-episode cash purchase, story pass, subscription, or a phased subset?
2. Is Story Pass story-scoped, time-scoped, account-scoped, device-scoped, or subscription-like?
3. What identity is required for paid action, and how is anonymous watch progress/purchase intent preserved through login?
4. Which payment rails are allowed for the target distribution channel and geography?
5. What content source is legally cleared for real video/poster/title assets?
6. What is the minimum acceptable video stack for MVP: provider embed, HLS from managed storage/CDN, or custom pipeline?
7. What Facebook events are required for launch, and what consent/privacy posture is required before firing them?
8. What support/refund/restore flows are mandatory before charging real users?
9. What backend/runtime/deployment boundary is acceptable for staging vs production?
10. What metrics define success before investing in full NovelHub-like infrastructure?

## Compliance / payment / Facebook / auth concerns

- Compliance: real MVP needs privacy policy, terms, refund/cancellation language, data retention/deletion handling, content rights records, age/content sensitivity review, and support escalation paths.
- Payment: do not connect Stripe/app-store/payment rails until product/legal defines coin/pass/subscription semantics, receipts, refunds, taxes, chargebacks, pricing localization, and webhook reconciliation.
- Facebook/Meta: query-param preservation is safe for P0, but production Pixel/CAPI requires event taxonomy, consent handling, dedupe, server-side secret management, and review of what user/action data is transmitted.
- Auth: free preview must stay unauthenticated. Paid actions likely require login or a durable anonymous identity; the real plan must preserve `showId` and `episode` through auth redirects.

## Missing acceptance criteria / tests for real MVP

- Free preview remains playable without login, payment prompts, PWA prompts, or Story Pass prompts.
- Auth redirect from a locked episode returns to the same locked episode and reopens the correct payment/unlock state.
- Successful payment/webhook/receipt grants entitlement exactly once and resumes the same episode.
- Failed/cancelled payment returns to the same locked episode with clear non-error copy and no entitlement.
- Entitlement cannot be forged by URL params, local storage, or client-side state.
- Story Pass unlock scope is tested across all episodes in the story and does not leak to unrelated stories unless explicitly designed.
- Restore purchase/account recovery path proves paid access can be recovered.
- Video failure, weak network, offline, geo/content-unavailable, and locked states are visually and semantically distinct.
- Attribution params do not break routing and do not leak unsafe values into UI/logs.
- Meta/analytics events are deduped and gated by consent/privacy requirements.
- Mobile safe-area and drawer CTAs remain usable on common iOS/Android viewport sizes.

## Infrastructure boundary check

Allowed now:

- Documentation, feasibility planning, risk register updates.
- Mock-only static route review and local build/test verification.
- Event taxonomy drafts and data-model sketches that do not create production services.

Not allowed in current P0 / this task:

- Real backend, database, wallet, entitlement ledger, auth, payment, subscription, Stripe/app-store purchase, Facebook/Meta API, production analytics, R2/storage/CDN/video pipeline, production deployment, DNS/cutover, or secrets.
- NovelHub production infrastructure implementation. It may inform future architecture only.

## Recommended plan edits

1. Insert a real-MVP architecture gate before implementation: identity, entitlement, payment, content/video, analytics, compliance, and support owners must sign off.
2. Split real MVP into spikes before build commitments:
   - Video delivery spike with legally cleared sample assets.
   - Entitlement/payment state-machine spike with fake processor/webhook in local/staging only.
   - Auth-return-path spike preserving `showId`, `episode`, and attribution through login.
   - Event taxonomy/privacy spike for Facebook measurement without production Meta integration.
3. Keep the current mock P0 branch static and demonstrable; do not wire real services into the accepted mock path.
4. Add a production-readiness checklist that explicitly removes URL-flag unlock and mock copy before any paid-user test.
5. Define data contracts first: Story, Episode, Price, Wallet, Transaction, Entitlement, PlaybackAsset, AttributionEvent, and ConsentState.
6. Require e2e tests for the full paid path before any public traffic: ad route -> free chain -> lock -> login/payment -> entitlement -> same-episode playback.

## Safe next step

Produce a short real-MVP architecture/options brief that compares three paths: (A) continue mock-only for funnel demos, (B) staging-only fake backend/payment simulator, (C) real paid MVP with licensed content and full compliance/payment/auth/entitlement scope. Do not start real infrastructure until the option is selected.

## Stop conditions

Stop and request human approval if any plan or task proposes:

- Real payment/subscription/Stripe/app-store purchase or payment webhooks.
- Real login/auth provider, production user accounts, or production entitlement checks.
- Real Facebook/Meta Pixel/CAPI/API or production analytics.
- Real database/backend/storage/CDN/R2/video pipeline or deployment/DNS/cutover.
- Use of competitor/licensed/uncleared drama assets, titles, posters, videos, or copy.
- Removing mock-status disclaimers before legal/product replacement copy is approved.
