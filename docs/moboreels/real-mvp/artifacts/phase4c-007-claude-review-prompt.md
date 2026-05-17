# PHASE4C-007 independent Claude reviewer gate

You are the independent Claude Code reviewer for DramaDev / SceneFlow MVP Phase 4C spike package. This is a REVIEW GATE ONLY. Do not modify files. Do not authorize implementation beyond the exact verdict language requested.

Repository/source rules:
- Source of truth: docs/moboreels/scene-flow-facebook-ad-conversion-prd.md
- Secondary source: docs/moboreels/prototype-b-spec.md
- Review package: docs/moboreels/real-mvp/spike-review-package.md
- Spike artifacts:
  - docs/moboreels/real-mvp/spikes/auth-return-path-contract.md
  - docs/moboreels/real-mvp/spikes/entitlement-state-machine.md
  - docs/moboreels/real-mvp/spikes/fake-payment-callback.md
  - docs/moboreels/real-mvp/spikes/safe-video-boundary.md
  - docs/moboreels/real-mvp/spikes/event-taxonomy-staging.md

P0 route focus that must remain intact:
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> mock unlock/pass -> same episode with unlocked=1.

P0 must NOT:
- return post-unlock users to Home
- lose episode context
- require login before free preview
- show prompts before free preview
- implement real payment/backend/Facebook/video infra

Hard stops:
- production deployment, DNS/cutover, production secrets
- real payment/subscription/login/Facebook API/analytics/backend/database/entitlement
- destructive changes
- legal/compliance/brand-significant decisions
- licensed/competitor assets
- NovelHub production infra in P0

Task:
1. Read the PRD, secondary spec, review package, and all five spike artifacts.
2. Check whether the Phase 4C package is internally consistent, safe, and sufficient to hand off to a later Phase 4D implementation planning step.
3. Check whether the package accidentally authorizes any hard-stop work or violates P0 route invariants.
4. Pay special attention to the package's existing note that the entitlement state-machine spike says REVISE before implementation.
5. Produce a final gate verdict only in this form:

Verdict: APPROVE
or
Verdict: REQUEST_CHANGES

Then include:
- Summary: 3-6 bullets.
- Blockers: exact blockers if REQUEST_CHANGES; write "None" if APPROVE.
- Required follow-ups / watch items: bullets, including non-blocking items.
- Evidence reviewed: file list.
- Scope boundary confirmation: explicitly state whether no implementation is authorized and no hard-stop production work is authorized.

Decision standard:
- APPROVE means approve the spike package to proceed to the next planning gate only, not implementation. It may still require non-blocking follow-ups.
- REQUEST_CHANGES means exact blockers must be fixed before next planning gate.
