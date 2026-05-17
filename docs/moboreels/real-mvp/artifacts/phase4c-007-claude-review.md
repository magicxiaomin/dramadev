I've read the PRD, secondary spec, the review package synthesis, and all five spike artifacts. Here is the gate verdict.

---

## Verdict: APPROVE

(Approval is for advancing the Phase 4C spike package to the next planning gate only. This verdict does **not** authorize Phase 4D implementation, and does **not** authorize any production work.)

### Summary

- All five spikes produce concrete, internally consistent contracts and each carries explicit hard-stop and stop-condition language; the P0 invariant chain (`/variant-b/watch/[showId]?episode=1&source=facebook` → free chain → first locked episode → Unlock Drawer → fake unlock/pass → same episode with `unlocked=1`) is preserved end-to-end.
- Cross-spike treatment of `unlocked=1` is uniformly "UX hint only, never authority"; the entitlement spike (§7, §9, §17) is unambiguous that URL flag, localStorage, cookies, and client-only state must be denied by the future evaluator. This is the most important load-bearing invariant and it holds.
- Free-preview-before-login is preserved across all five spikes: auth §7 (1)–(6), entitlement §3.1/§4 anonymous_preview row, payment §4/§11 FP-001, video §3/§6 free-state mapping, events §3/§10/§12.
- Same-episode return is preserved for success, cancel, failure, pending, delayed, duplicate, replay, tamper, revoke/refund, expired pass, and logout/login restore paths across auth §8/§9, entitlement §10, payment §7/§8, and events §10.
- No hard-stop work is authorized. No spike implies real OAuth/identity provider, real payment/app-store/webhook, production backend/database/entitlement/wallet, Meta Pixel/CAPI/SDK/Graph/Marketing API, production CDN/storage/video pipeline, production deployment/DNS/secrets, licensed/competitor assets, or final legal/payment/subscription/refund copy.
- The review package correctly preserves the entitlement spike's REVISE verdict and treats it as a Phase 4D implementation blocker rather than a gate blocker — this is the right framing for a documentation/spec gate.

### Blockers

None.

### Required follow-ups / watch items (non-blocking)

- **Attribution allow-list harmonization (Phase 4D planning input):** Auth §6.2 allow-lists `{utm_source, utm_campaign, utm_content}`; event taxonomy §7 additionally allow-lists `utm_medium` and `utm_term`; payment spike §4 uses an open `utm_*` glob. Before Phase 4D plans any shared route builder, the Phase 4D planning card must decide a single canonical attribution allow-list (recommend re-grounding on `ATTRIBUTION_KEYS` in `src/lib/query-params.ts`) so auth, payment, and events do not diverge during implementation. Today's package mentions this in §4.5 watch item; surface it explicitly as a Phase 4D acceptance criterion.
- **Entitlement REVISE → fake-only acceptance criteria:** Convert entitlement spike §9 URL/local-state authority matrix and §13 missing-tests list into explicit acceptance criteria for a Phase 4D fake-only in-memory evaluator before any route or persistence work is proposed.
- **Story Pass open semantics:** Duration, scope, restore, refund/revoke, and expiry semantics remain product/legal decisions per entitlement §11/§12/§15 and PRD §16 open questions. Phase 4D planning must either resolve these or explicitly bound them as "fake-only, deferred" — do not let them leak into implementation as undefined behavior.
- **Sample asset proof for video spike:** Video §11 sample asset log is entirely "Pending." Phase 4D must not begin a video boundary proof until original or rights-cleared sample media exists and is logged. The hard stop in video §12 already covers this; carry it forward as an explicit gate.
- **Callback key round-trip through fake auth surface:** Auth §6.2 allow-list does not yet include payment callback keys such as `purchase_status` or future fake-grant keys. Phase 4D planning should reconcile the union of callback keys across auth/payment/events so the round-trip remains lossless without becoming a general query-param passthrough.
- **Idempotency contract continuity:** Payment §5/§7 and entitlement §7 rule 6 each describe idempotency independently. Phase 4D should formalize a single `idempotency_key` contract shared by fake payment intents, fake grants, and fake audit events so duplicate-callback behavior is provably one decision, not three parallel ones.
- **Free-chain anonymous tests must be implementation-gate mandatory:** Multiple spikes mention this (auth §7, entitlement §13 item 1, payment FP-001, events §10), but it should be promoted to a Phase 4D "tests must exist before implementation" item rather than an emergent property of multiple specs.
- **Locked-state vs playback-error visual separation:** Video spike §6 is explicit and correct, but the package depends on Phase 4D acceptance evidence at 390 × 844; flag the 390 × 844 verification matrix as a Phase 4D gate item, not a "later nice to have."

### Evidence reviewed

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- `docs/moboreels/real-mvp/spike-review-package.md`
- `docs/moboreels/real-mvp/spikes/auth-return-path-contract.md`
- `docs/moboreels/real-mvp/spikes/entitlement-state-machine.md`
- `docs/moboreels/real-mvp/spikes/fake-payment-callback.md`
- `docs/moboreels/real-mvp/spikes/safe-video-boundary.md`
- `docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md`

### Scope boundary confirmation

This APPROVE verdict explicitly states:

- **No implementation is authorized.** This gate clears the spike/spec package for handoff to a Phase 4D planning step only. Phase 4D itself is planning, not building.
- **No hard-stop production work is authorized.** No real OAuth/OIDC/SAML/OTP/email/SMS/social login provider; no real payment processor, app-store IAP, subscription, receipt, refund, chargeback, or payment webhook; no production backend, database, entitlement service, wallet, ledger, queue, or persistent server runtime; no Meta Pixel, CAPI, Facebook SDK, Graph API, Marketing API, or any production analytics vendor; no production CDN, object storage, video ingest, transcoding, encoding ladder, signed playback URLs, DRM, or persistent media pipeline; no production deployment, DNS, cutover, secrets, public callback URL, or real-user traffic; no licensed, competitor, scraped, or otherwise uncleared content/poster/title/copy/audio/music; no finalization of legal/payment/subscription/cancellation/refund/tax/consent copy; no NovelHub production infrastructure in P0; no destructive operations; and `unlocked=1` remains UX state only and is never an authority for access.
- **Entitlement REVISE verdict is retained as a downstream blocker.** Phase 4D may not propose implementation of routes, services, or persistence until the entitlement §9 URL/local-state authority matrix is converted into fake-only acceptance criteria and Story Pass scope/duration/restore/refund/expiry questions are either resolved or explicitly bounded for fake-only tests.
