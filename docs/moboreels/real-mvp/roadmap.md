# SceneFlow Real MVP Roadmap

Status: Draft synthesis package
Owner: dramapm orchestration
Scope: documentation and planning only; this roadmap does not authorize implementation of production backend, database, auth, payment, entitlement, analytics, Facebook API, video infrastructure, DNS, deployment, or secrets.

## 1. Roadmap intent

This roadmap converts the Phase 4 planning artifacts into a build-readiness sequence:

- `docs/moboreels/real-mvp/prd.md`
- `docs/moboreels/real-mvp/architecture.md`
- `docs/moboreels/real-mvp/gap-risk-register.md`

The goal is to move from the accepted mock-only Phase 3 P0 to a real MVP plan while preserving the core conversion invariant:

```txt
Facebook Ad
-> Watch EP1 without login
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> login/payment only at paid action
-> entitlement grant
-> return to the same episode
```

## 2. Phase model

### Phase 4A — Planning package closure

Purpose: make the Real MVP PRD and target architecture reviewable.

Deliverables:

- Real MVP PRD
- Target architecture
- Gap/risk register
- Roadmap
- Review package
- Final independent reviewer verdict

Acceptance criteria:

- Every document clearly states planning-only status.
- Every hard-stop area is gated before implementation.
- Open questions are grouped by decision owner.
- Final reviewer gate either approves the package or produces concrete revision tasks.

### Phase 4B — Decision gates before build

Purpose: collect human/business/legal decisions needed before any real implementation can start.

Required decisions:

| Gate | Decision | Owner |
| --- | --- | --- |
| G1 | Build-start authorization for real MVP implementation | User / product owner |
| G2 | Target market and compliance baseline | Business + Legal |
| G3 | Launch content source and rights | Business + Legal |
| G4 | Monetization model: single EP, Story Pass, subscription, coins, or staged subset | Business + Finance + Product |
| G5 | Payment rails and refund policy | Finance + Legal |
| G6 | Auth provider and login methods | Product + Engineering |
| G7 | Video provider / hosting / playback boundary | Engineering + Legal |
| G8 | Facebook Pixel/CAPI/analytics and consent posture | Marketing + Legal + Data |
| G9 | Support/refund operations capacity | Operations + Finance |
| G10 | Deployment/runtime/secrets plan | Engineering + Ops |

No real implementation task should start until its relevant gate is explicitly approved.

### Phase 4C — Build-readiness spikes, still non-production

Purpose: validate risky choices in local/staging only, with fake or sandbox systems.

Candidate spikes:

1. Auth return-path spike
   - Verify login initiated from a locked episode returns to the same `showId`, `episode`, drawer state, and attribution params.
   - Use sandbox/fake identity only.

2. Entitlement state-machine spike
   - Model grants, revocations, idempotency, and same-episode return.
   - Use fake processor/webhook; no real money.

3. Payment copy and purchase-state spike
   - Test UI states for success, cancel, failure, duplicate callback, refund/revoke.
   - No production payment rails.

4. Video provider spike
   - Test legally cleared sample video with mobile playback states.
   - No licensed/competitor assets without approval.

5. Attribution/event taxonomy spike
   - Define and locally validate event names and dedupe keys.
   - No production Meta Pixel/CAPI until consent/legal gate.

Acceptance criteria:

- Each spike has explicit sandbox-only evidence.
- No production credentials or real user data are used.
- Each spike produces a go/no-go recommendation for build planning.

### Phase 4D — Implementation plan after gates

Purpose: only after decision gates, create implementable work packages.

Possible workstreams:

- Frontend contract hardening: preserve Phase 3 route and query invariants.
- API/backend contracts: catalog, entitlement, auth, payment adapter, attribution.
- Data model and audit ledger.
- Admin/content ops minimal workflow.
- Support/refund runbook.
- Integration and e2e acceptance tests.

This phase is not authorized by the current package.

### Phase 4E — Pre-launch readiness

Purpose: prove the real MVP is safe to expose to limited users.

Required evidence before any public traffic:

- Legal/compliance approval for target market.
- Content rights evidence.
- Payment/refund/receipt verification.
- Entitlement cannot be forged by URL/local state.
- Auth/payment redirects preserve episode context.
- Video failure, locked state, and weak network are distinct.
- Facebook/analytics consent and dedupe behavior are verified.
- Secrets, monitoring, rollback, and support escalation are in place.

## 3. Open decision list for user/business approval

These are not blockers for finishing the planning package; they become blockers before real implementation.

1. Which target market ships first?
2. What real content source is legally cleared?
3. Which monetization mix ships first: single episode, Story Pass, subscription, coin pack, or staged fake/sandbox first?
4. Which auth provider and login methods are acceptable?
5. Which payment rails are allowed for the distribution channel?
6. Is Facebook measurement required at launch, and if so Pixel, CAPI, or both?
7. What support/refund policy is required before charging users?
8. What video delivery approach is acceptable for MVP?
9. What deployment/runtime boundary is acceptable for staging vs production?
10. What metric threshold justifies moving from MVP to larger infrastructure investment?

## 4. Traceability

| Roadmap item | Source |
| --- | --- |
| Watch-first route invariant | `scene-flow-facebook-ad-conversion-prd.md`; Phase 3 acceptance package |
| Real user flows | `real-mvp/prd.md` §3 |
| Functional requirements | `real-mvp/prd.md` §4 |
| Target components and data model | `real-mvp/architecture.md` §2-4 |
| Risks and hidden dependencies | `real-mvp/gap-risk-register.md` |
| Hard-stop gates | `real-mvp/prd.md` §5/§8; `real-mvp/architecture.md` gates |

## 5. Current recommendation

Proceed only with Phase 4A closure and Phase 4B decisions. Do not start real implementation yet.

Recommended next action after reviewer gate:

1. Present the decision gates to the user.
2. Ask for target market, content source, and monetization preference first.
3. Only then create build-readiness spike cards.
