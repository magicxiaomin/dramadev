# Phase 5 P1 Q25: Remaining hard-stop questions escalation packet

Status: docs-only escalation packet. Planning only. No approval granted. No implementation authorized.

Question source: `docs/moboreels/phase-4g/phase-5-questions.md`, Q9-Q14, Q16, and Q19-Q23.

Primary PRD: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`.
Secondary source: `docs/moboreels/prototype-b-spec.md`, which points back to the PRD as the implementation source.

## Goal

Create a single escalation packet for the remaining Phase 5 hard-stop-gated questions so product, legal/compliance, data/privacy, security, architecture, QA/ops, and monetization owners can see exactly which decisions are still required before any future real integration work is considered.

This packet does not answer the gated questions, does not approve production work, and does not change P0/P1/P2 scope. It preserves the current P0 invariant:

`/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> mock unlock/pass -> same episode with unlocked=1`.

P0 must remain watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode. P0 must not return post-unlock users to Home, lose episode context, require login before free preview, show prompts before free preview, or implement real payment/backend/Facebook/video infrastructure.

## Context

The Phase 5 Questions document explicitly marks these topics as hard-stop or human/legal approval areas:

- Q9: real Facebook redirect/API work.
- Q10: Pixel/CAPI or production analytics.
- Q11: real payment.
- Q12: real subscription or Story Pass billing.
- Q13: real login.
- Q14: server-side entitlement.
- Q16: real video playback.
- Q19: licensed or competitor asset policy.
- Q20: backend content retrieval.
- Q21: database schema.
- Q22: future non-production QA environments / production-related environment changes.
- Q23: secrets management and real service integration review.

Existing Phase 5 `p1-decision-brief.md` already marks these questions as hard-stop/not-authorized and not substantively answered. This packet reconciles with that evidence by expanding the escalation requirements only; it does not duplicate product decisions or convert any hard stop into an approved scope item.

NovelHub is future infrastructure reference only. This packet does not authorize NovelHub production infrastructure, shared production runners, shared secret stores, production deployment, DNS, or cutover.

## PRD sections reviewed

- §1 Status: confirms the mobile PWA / web prototype target and Facebook ad conversion goal.
- §2 Strategic Context: defines the core journey from Facebook ad to Watch EP1, free episode chain, lock, mock purchase/unlock, and same-episode return.
- §3 Non-Goals: forbids Home/Search/Show Detail first, login before free preview, prompts before first playback, real payment, real subscription, real Facebook APIs, real video player, and competitor copying.
- §5 Core Product Principles: watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, return-to-same-episode.
- §6 P0 User Flow: defines EP1 landing, free chain, first locked episode, Unlock Drawer, mock unlock/pass, and `unlocked=1` same-episode continuation.
- §7 Route Requirements: defines `/variant-b/watch/[showId]?episode=1&source=facebook`, optional future attribution params, locked route, and unlocked return route.
- §8.4 Unlock Drawer / Payment Mock: states P0 can mock login and uses `unlocked=1` for mock unlock.
- §8.5 Story Pass / Unlock Options Page: requires mock status, local price/tax/renewal/cancellation/refund placeholders, and same-episode return after purchase success.
- §8.6 Unlock Success Return: requires same drama, same episode, unlocked state, and explicitly forbids Home return, Pass-page dead end, lost episode context, or continued locked state.
- §11 P0 Scope: includes fake player/content, mock unlock, same-episode return, single-episode primary CTA, Story Pass secondary CTA, and no first-playback PWA prompt.
- §12 P1 Scope: allows only future planning/mocks such as attribution event tracking, Pixel/CAPI planning, creative mapping, mock wallet/unlock history, and post-intent PWA prompt.
- §13 P2 Scope: defers real video player, backend retrieval, login, payment, subscription, wallet ledger, refund/cancellation flows, production analytics, Facebook CAPI, and server-side entitlement.
- §14 Developer Handoff Notes / Out of Scope: explicitly says not to implement real payment, real subscription, real video, real Facebook API, production analytics, production entitlement, production login, or real wallet ledger.
- §15 QA Acceptance Checklist: requires the P0 route, no login for EP1, no pre-preview prompts, first locked episode drawer, single-episode primary CTA, Story Pass secondary CTA, same-episode unlock return, no Home return, no lost episode context, and locked state distinct from weak-network/video errors.
- `prototype-b-spec.md`: reviewed as secondary source; it delegates implementation authority to the PRD and adds no approval for hard-stop areas.

## P0 scope

The only preserved P0 behavior relevant to this packet is:

1. User lands from the ad on `/variant-b/watch/[showId]?episode=1&source=facebook`.
2. EP1 and the configured free episode chain are playable without login, recharge, subscription, PWA install prompt, Story Pass prompt, real analytics consent wall, or real video provider dependency.
3. The first locked episode is derived from each drama's `freeEpisodes` value.
4. The Watch page enters a clear locked state and opens the Unlock Drawer.
5. The Unlock Drawer transparently shows drama title, episode number, mock balance, mock cost, single-episode unlock, Story Pass option, and Maybe Later / close behavior.
6. The first locked episode keeps single-episode unlock as primary CTA and Story Pass as secondary CTA.
7. Mock single-episode unlock or mock Story Pass purchase returns to `/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1`.
8. The user remains on the same drama and same episode, not Home, not Search, not Show Detail, and not a generic pass/catalog page.
9. `unlocked=1` remains a fake-only review signal until a separately approved production entitlement system exists.

## P1/P2 deferred scope

These are not approved by this packet. They remain deferred behind hard-stop escalation:

- Q9 real Facebook redirect/API work: deferred until product, legal/compliance, data/privacy, security, platform-policy, and engineering owners approve scope, data handling, compliance obligations, redirects, and API usage.
- Q10 Pixel/CAPI or production analytics: deferred until product analytics, data/privacy, legal/compliance, security, and engineering owners approve event taxonomy, consent rules, data minimization, retention, deduplication, and vendor configuration.
- Q11 real payment: deferred until product/monetization, legal/compliance, finance/tax, security, support/ops, and engineering owners approve provider, legal copy, test environment, refund policy, local pricing, tax handling, chargeback/support paths, and payment security boundaries.
- Q12 real subscription or Story Pass billing: deferred until product/monetization, legal/compliance, finance/tax, support/ops, security, and engineering owners approve renewal, cancellation, trial, local pricing, tax, receipt validation, subscription state, and support policies.
- Q13 real login: deferred until product, UX, security/privacy, legal/compliance, and engineering owners approve where login can appear without violating free-preview-first behavior.
- Q14 server-side entitlement: deferred until product, security, backend architecture, database, support/ops, and engineering owners approve the source of truth for unlocked episodes, Story Pass state, wallet/ledger linkage, refunds/revocations, and reconciliation.
- Q16 real video playback: deferred until product, architecture, content operations, legal/content rights, QA, observability/ops, and engineering owners approve provider boundary, hosting/streaming model, fallback states, error states, locked-vs-error distinction, and playback monitoring.
- Q19 licensed/competitor asset policy: deferred until legal, brand, content operations, product, and engineering owners approve asset sourcing, usage rights, prohibited sources, review process, repository hygiene, takedown path, and branch policy.
- Q20 backend content retrieval: deferred until product, backend architecture, security/privacy, content operations, QA, and engineering owners approve the Watch API contract, latency/error behavior, cache policy, versioning, and fake/test fixture separation.
- Q21 database schema: deferred until backend architecture, data/privacy, security, finance/ledger owners, product, support/ops, and engineering owners approve entities for shows, episodes, unlocks, pass state, wallet ledger, attribution, auditability, retention, and migrations.
- Q22 non-production QA environments: deferred until QA, ops/SRE, security, product, legal/compliance, and engineering owners approve allowed environments, data boundaries, access control, deployment isolation, evidence retention, and explicit no-production-DNS/no-production-secrets rules.
- Q23 secrets management and real service integration review: deferred until security, ops/SRE, engineering, legal/compliance, and vendor/API owners approve vault/storage, rotation, access review, incident response, local-dev rules, CI rules, and service onboarding checklist.

## Escalation approval matrix

The minimum approval set below is intentionally conservative. "User/UX" means a human product/UX owner must confirm the user-impact rules and copy/placement constraints; it is not an end-user consent mechanism and does not authorize data collection or implementation.

| Question | User/UX approval needed | Product approval needed | Legal/compliance approval needed | Ops/security/architecture approval needed |
| --- | --- | --- | --- | --- |
| Q9 Facebook redirect/API | Confirm no redirect breaks watch-first or same-episode return. | Confirm redirect/API scope and campaign purpose. | Confirm platform-policy, data handling, and compliance obligations. | Confirm API boundary, security review, and no production secrets/deploy without Q23/Q22. |
| Q10 Pixel/CAPI/analytics | Confirm consent/copy placement does not block free preview. | Confirm event taxonomy and measurement goals. | Confirm consent, minimization, retention, and vendor/privacy rules. | Confirm data flow, dedupe, access control, monitoring, and no production analytics until approved. |
| Q11 real payment | Confirm paid-action UX occurs only after free preview and first lock. | Confirm provider, single-episode purchase model, price display, and support promise. | Confirm legal copy, refund, tax/local price, payment disclosures, and test environment. | Confirm payment security, provider integration boundary, chargeback/support flow, and no real secrets without Q23. |
| Q12 subscription / Story Pass billing | Confirm subscription/pass copy is secondary at first lock and not pre-preview. | Confirm Story Pass scope, renewal model, cancellation policy, and local pricing strategy. | Confirm renewal/cancellation/tax/disclosure requirements and consumer-protection rules. | Confirm receipt validation, subscription-state handling, support/ops process, and secure integration boundary. |
| Q13 real login | Confirm login never appears before free preview and only appears at an approved point. | Confirm account requirement and conversion tradeoff. | Confirm privacy/account notices and any age/region obligations. | Confirm auth/session security, recovery flow, and no production login until approved. |
| Q14 server-side entitlement | Confirm unlock/pass state still returns users to the same episode. | Confirm entitlement product rules for episode unlocks, Story Pass, refunds, and revocation. | Confirm access-control, audit, refund/revocation, and retention obligations. | Confirm source of truth, backend/database boundaries, reconciliation, incident handling, and auditability. |
| Q16 real video playback | Confirm locked/error/offline UX remains distinct and preserves lock flow. | Confirm playback quality expectations and fallback behavior. | Confirm content-rights and any provider/compliance obligations. | Confirm provider boundary, hosting/CDN/monitoring, error taxonomy, observability, and no real video infra until approved. |
| Q19 asset policy | Confirm user-facing assets are safe, non-misleading, and brand-appropriate. | Confirm content style and allowed prototype asset categories. | Confirm rights, licensing, competitor restrictions, takedown process, and prohibited sources. | Confirm repository hygiene, review gates, branch policy, and asset provenance tracking. |
| Q20 backend content retrieval | Confirm loading/error UX does not replace locked state or block free preview unnecessarily. | Confirm Watch API product contract and content fields. | Confirm privacy/content/data handling obligations. | Confirm API contract, latency/error/caching rules, fake-vs-real data separation, and security review. |
| Q21 database schema | Confirm user-visible state is consistent for unlock/pass/history. | Confirm entity/product rules for shows, episodes, unlocks, wallet ledger, and attribution. | Confirm retention, audit, financial-record, and privacy obligations. | Confirm schema ownership, migrations, access control, backup/restore, auditability, and database security. |
| Q22 non-production QA environments | Confirm QA environment UX cannot be mistaken for production launch. | Confirm QA scope, evidence needs, and launch-readiness limitations. | Confirm non-production data policy and compliance constraints. | Confirm environment isolation, access control, no production DNS/cutover, no production secrets, and evidence retention. |
| Q23 secrets management | Confirm no user-visible flow depends on unmanaged secrets. | Confirm which real integrations are worth onboarding. | Confirm vendor/legal review and incident disclosure obligations. | Confirm vault/storage, rotation, access review, CI/local-dev rules, incident response, and service onboarding checklist. |

## Non-scope

This packet explicitly does not authorize or implement:

- Runtime code, fixtures, tests, CI, package, lockfile, browser-install, environment, or deployment changes.
- PRD edits, roadmap edits, or scope promotion.
- Real Facebook redirect/API, Pixel/CAPI, production analytics, attribution processing, consent tooling, or vendor setup.
- Real payment, real subscription, real Story Pass billing, refund/cancellation/renewal/local-pricing/tax flow, real wallet ledger, receipt validation, or chargeback workflow.
- Real login, production auth/session, account system, production entitlement, backend/database/API, or server-side access control.
- Real video player/provider/hosting/streaming/CDN/playback monitoring, production fallback, or real-network probe.
- Production deployment, DNS, cutover, production secrets, production service integration, or NovelHub production infrastructure.
- Legal/compliance/privacy/security/platform-policy/brand/content-rights decisions.
- Licensed, competitor, stock, third-party, or public-domain asset ingestion unless explicitly cleared by legal/content policy in a future approval.

## Assumptions

- The hard-stop labels in `phase-5-questions.md` remain authoritative until a human owner explicitly changes them.
- `p1-decision-brief.md` is already correct that Q9-Q14, Q16, and Q19-Q23 are not answered there; this packet only adds escalation detail.
- P0 remains fake-only and can use mock UI, mock content, mock balance, mock cost, mock unlock, and `unlocked=1` review state.
- P1 references to attribution/event tracking or Pixel/CAPI remain planning language only unless a later hard-stop approval authorizes implementation.
- P2 references to real backend, database, auth, payment, subscription, entitlement, video, analytics, and Facebook CAPI are not implementation tasks.
- Approval must be explicit, written, scoped, and owner-attributed; silence, green tests, or a prototype demo is not approval.
- Any future approval must preserve free-preview-first behavior and cannot introduce login, consent, payment, subscription, PWA install, recharge, or Story Pass prompts before the free preview chain.

## Acceptance criteria

This escalation packet is acceptable only if all of the following are true:

1. It is docs-only and creates no runtime, test, CI, deployment, secret, or infrastructure changes.
2. It lists Q9-Q14, Q16, and Q19-Q23 from `phase-5-questions.md` as hard-stop/human-approval items.
3. It names the exact approval domains required for each question: product, UX where applicable, legal/compliance, data/privacy, security, platform-policy where applicable, finance/tax where applicable, support/ops where applicable, QA/ops where applicable, content/legal where applicable, architecture, database/backend where applicable, and engineering.
4. It preserves the P0 invariant verbatim: `/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> mock unlock/pass -> same episode with unlocked=1`.
5. It states that P0 remains watch-first, free-preview-first, per-drama lock point, transparent unlock, single-episode unlock first, and return-to-same-episode.
6. It forbids post-unlock return to Home, lost episode context, login before free preview, prompts before free preview, and real payment/backend/Facebook/video infrastructure in P0.
7. It explicitly does not approve or implement real Facebook/API/analytics/auth/payment/subscription/backend/database/entitlement/video/deployment/DNS/secrets/assets/legal/compliance work.
8. It reconciles with existing `p1-decision-brief.md` by acknowledging that document already marks these questions as hard-stop/not-authorized.
9. It treats NovelHub only as future infrastructure reference and not as P0 or production infrastructure.
10. It provides a validation plan, risks/gates, recommended task graph, and open non-blocking questions.

## Validation plan

1. Read `docs/moboreels/phase-4g/phase-5-questions.md` and confirm Q9-Q14, Q16, and Q19-Q23 are all represented in this packet.
2. Read `docs/moboreels/phase-5/p1-decision-brief.md` lines 223-238 and confirm this packet does not contradict the existing hard-stop/not-authorized classification.
3. Read PRD §3, §5, §6, §7, §8.4-§8.6, §11-§15 and confirm every hard-stop guardrail in this packet is anchored to the current PRD scope split.
4. Confirm the P0 invariant appears exactly and no item redirects users to Home, loses episode context, requires login before free preview, or adds pre-preview prompts.
5. Confirm the document contains no implementation instructions for runtime code, tests, CI, real services, production deploy, DNS, secrets, or NovelHub production infrastructure.
6. Confirm every future real-work area requires explicit human approval before implementation.
7. Confirm `git diff -- docs/moboreels/phase-5/p1-q25-remaining-hard-stop-questions-escalation-packet.md` is docs-only.

## Risks/gates

- Over-authorization risk: readers may treat escalation language as approval. Gate: every section states planning only, no approval granted, no implementation authorized.
- P0 regression risk: real login, consent, payment, or prompt work could be inserted before free preview. Gate: free-preview-first remains non-negotiable and must be validated before any future scope expansion.
- Entitlement/security risk: `unlocked=1` could be mistaken for production access control. Gate: it remains fake-only until Q14 is explicitly approved with a server-side source of truth.
- Data/privacy risk: attribution params, Pixel/CAPI, or analytics could collect data before consent/data-minimization decisions. Gate: Q9/Q10 require data/privacy, legal/compliance, security, and product analytics approval.
- Monetization/legal risk: real payment/subscription copy, refund, renewal, cancellation, local pricing, or tax behavior could be prototyped as if approved. Gate: Q11/Q12 require monetization, finance/tax, legal/compliance, support/ops, security, and engineering approval.
- Asset-rights risk: licensed, competitor, stock, third-party, or public-domain assets could enter a prototype branch and later become production-contaminating. Gate: Q19 requires legal/content/brand approval before any such asset source is used.
- Infrastructure risk: non-production QA environments, secrets, or service integrations could accidentally touch production. Gate: Q22/Q23 require explicit environment isolation, secrets review, access control, and no-production-DNS/no-production-secrets constraints.
- False-confidence risk: green fake-only P0 tests could be mistaken for production readiness. Gate: P0 evidence validates only the fake watch-to-lock-to-mock-unlock path and cannot substitute for hard-stop approvals.

## Recommended task graph

1. Requirements owner maintains this escalation packet as the index for Q9-Q14, Q16, and Q19-Q23. No implementation.
2. Product/legal/data escalation task for Q9-Q10: define whether Facebook redirect/API, Pixel/CAPI, and production analytics should ever be considered, and if yes, require data handling, consent, minimization, retention, and compliance approvals before engineering scoping.
3. Monetization/legal/security escalation task for Q11-Q12: define whether real payment, subscriptions, or Story Pass billing should ever be considered, and if yes, require provider, legal copy, renewal/cancellation/refund/local-pricing/tax/test-environment approvals before engineering scoping.
4. UX/security/architecture escalation task for Q13-Q14: define whether real login and server-side entitlement should ever be considered, and if yes, require a flow placement that preserves free-preview-first plus an entitlement source-of-truth decision before engineering scoping.
5. Video/content/legal/QA escalation task for Q16/Q19: define whether real video playback and asset sources should ever be considered, and if yes, require provider boundary, fallback/error taxonomy, content-rights policy, and repository asset hygiene before engineering scoping.
6. Backend/data/ops escalation task for Q20-Q21: define whether backend retrieval and database schema should ever be considered, and if yes, require API contract, entity model, audit/retention rules, migration approach, and fake-vs-real data boundaries before engineering scoping.
7. QA/ops/security escalation task for Q22-Q23: define allowed non-production QA environments and secrets management process before any real service integration or environment wiring is scoped.
8. Final cross-functional hard-stop review: product, legal/compliance, data/privacy, security, monetization, support/ops, QA/ops, architecture, and engineering confirm which, if any, of the above escalation tasks move from planning to scoped implementation. This packet itself is not that approval.

## Open non-blocking questions

- Who is the single accountable approver for each hard-stop domain, and which decisions require joint approval instead of one owner?
- Should Q9 and Q10 be escalated together as one data/privacy/platform-policy gate, or separately as redirect/API scope and analytics/measurement scope?
- Should Q11 and Q12 share one monetization/legal gate, or should one-time single-episode unlock and recurring Story Pass subscription be reviewed separately?
- For Q13, is any post-lock login acceptable in future production if the user has already completed the free preview chain, or should login remain avoidable until after the user chooses a paid action?
- For Q14, what future system, if any, owns entitlement truth when both single-episode unlock and Story Pass state exist?
- For Q16, should locked state, weak-network state, provider-error state, and offline state have a formal copy/visual taxonomy before provider selection?
- For Q19, should the repository reject all external assets by default until legal/content approval creates an allowlist?
- For Q20-Q21, should backend/database discussions wait until content metadata and fake fixture requirements are stable?
- For Q22-Q23, should any non-production QA environment be allowed before secrets management is approved, or should those gates be sequential?
- Should future approval packets explicitly state that even full resolution of Q9-Q23 does not by itself authorize production deployment, DNS/cutover, or launch?
