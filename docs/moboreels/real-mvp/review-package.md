# SceneFlow Real MVP Review Package

Status: Draft for final reviewer gate
Scope: documentation review only; not an implementation approval.

## 1. Package contents

This review package covers the Real MVP planning artifacts created after the Phase 3 mock-only acceptance package was merged.

| Artifact | Purpose | Status |
| --- | --- | --- |
| `docs/moboreels/real-mvp/prd.md` | Product requirements for converting the mock flow into a real MVP | Draft; Claude requirements gate APPROVE |
| `docs/moboreels/real-mvp/architecture.md` | Target architecture and hard-stop gates | Draft; Claude architect gate APPROVE |
| `docs/moboreels/real-mvp/gap-risk-register.md` | Feasibility gap and risk register | Draft; feasibility verdict REVISE before build planning |
| `docs/moboreels/real-mvp/roadmap.md` | Roadmap from planning package to build-readiness gates | Draft synthesis |
| `.hermes/artifacts/real-mvp/requirements-result.json` | Requirements gate evidence | Local artifact, not committed |
| `.hermes/artifacts/real-mvp/architecture-result.json` | Architecture gate evidence | Local artifact, not committed |

## 2. Executive summary

The Real MVP planning package preserves the accepted Phase 3 conversion flow while identifying the additional systems needed for a real customer-facing product.

The package intentionally does **not** authorize implementation. It defines what must be decided before real build work starts:

- content rights and launch catalog
- target market and legal/compliance posture
- auth provider and login methods
- monetization model and payment rails
- entitlement and audit model
- video provider and playback boundary
- Facebook attribution / analytics / consent plan
- support, refund, and operational runbooks
- deployment/runtime/secrets plan

## 3. Flow to preserve

```txt
Facebook ad click
  -> /variant-b/watch/[showId]?episode=1&source=facebook
  -> EP1 and free chain without login or pay prompts
  -> first locked episode from show.freeEpisodes
  -> Unlock Drawer
  -> login only after paid CTA
  -> payment/pass/entitlement flow
  -> return to same episode with server-authoritative entitlement
```

Non-negotiable invariants:

1. Do not send Facebook ad traffic to Home/Search/Show Detail first.
2. Do not require login before free preview.
3. Do not show payment/subscription/pass prompts before the first locked episode.
4. Do not treat `unlocked=1` as a production entitlement.
5. Do not lose `showId`, `episode`, or attribution params during login/payment redirects.
6. Do not implement production services without explicit gate approval.

## 4. Gate evidence summary

### Requirements gate

- Role/tool: Claude Code requirements role
- Output: `docs/moboreels/real-mvp/prd.md`
- Verdict: APPROVE
- Blockers: none for planning package
- Open questions retained for business/legal/product approval gates

### Architecture gate

- Role/tool: Claude Code architect role
- Output: `docs/moboreels/real-mvp/architecture.md`
- Verdict: APPROVE for architecture artifact
- Blockers: G1-G12 remain hard stops before real implementation

### Feasibility/gap gate

- Role/tool: dramadev-feasibility
- Output: `docs/moboreels/real-mvp/gap-risk-register.md`
- Verdict: REVISE before any real-MVP build plan
- Meaning: planning can continue; implementation must not start until risks/decisions are resolved

## 5. Final reviewer checklist

The final reviewer should check:

- [ ] Package is clearly planning-only.
- [ ] It does not authorize real backend/database/auth/payment/Facebook/analytics/video/deployment/secrets.
- [ ] Phase 3 accepted route and free-preview invariants are preserved.
- [ ] `unlocked=1` is explicitly non-authoritative for production.
- [ ] Payment/subscription/pass semantics are not chosen without business/legal approval.
- [ ] Facebook Pixel/CAPI and analytics are gated behind consent/legal review.
- [ ] Content rights and licensed assets are not assumed.
- [ ] NovelHub is reference-only, not required infrastructure.
- [ ] Open questions are actionable and assigned to decision owners.
- [ ] Roadmap separates planning, decision gates, sandbox spikes, implementation planning, and pre-launch readiness.

## 6. Known non-blocking issues

- The package is long and should be summarized before stakeholder review.
- Pricing and offer mix are intentionally unresolved.
- The target market is intentionally unresolved.
- Real video provider and payment rails are intentionally unresolved.

These are not blockers for closing the planning package; they are blockers before real implementation.

## 7. Recommended reviewer verdict criteria

Approve if:

- Documentation is internally consistent.
- Hard stops are preserved.
- Next-step decision gates are clear.
- No production implementation is implied.

Request changes if:

- Any document implies implementation approval.
- Any production integration is treated as already selected.
- Any legal/payment/content/Meta/Facebook decision is made without an explicit gate.
- The Phase 3 watch-first/free-preview/same-episode invariants are weakened.

## 8. User-facing decision packet after approval

After final reviewer approval, present the user with only the first three decision groups:

1. Target market and content source.
2. Monetization model preference.
3. Auth/payment/video/analytics sequencing preference.

Do not ask the user to resolve every open question at once.
