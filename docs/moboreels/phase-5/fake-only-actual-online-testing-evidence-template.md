# Fake-only actual-online-testing evidence template

Status: TEMPLATE / DOCS-ONLY / FAKE-ONLY / NON-PRODUCTION
Date:
Reviewer / role:
Branch / PR:
Commit SHA:
Base URL:
Environment label: local / preview / staging / demo / other non-production
Test window, if externally reachable:
Preview owner / shutdown owner, if externally reachable:

> Boundary warning: This template collects fake-only, non-production evidence for the SceneFlow P0 Facebook-ad conversion route. It does not approve actual online testing, production launch, DNS/cutover, production secrets, real user traffic, real payment, real subscription, real login, Facebook/Meta API, Pixel/CAPI, analytics/tracking, backend, database, entitlement, video infrastructure, R2/CDN, NovelHub production infrastructure, licensed/competitor/uncleared assets, or legal/compliance/brand-significant decisions.
>
> Passing this template means only: fake-only local/non-production demo evidence supports the P0 invariant below. It is not launch readiness, integration readiness, production readiness, or legal/compliance approval.

## Canonical P0 invariant gate

Evidence must preserve this route and state sequence:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

Reviewer result for invariant gate:

- [ ] PASS: the invariant is preserved using fake-only/non-production state.
- [ ] FAIL: the invariant is broken.
- [ ] BLOCKED: route, environment, assets, browser, or approval boundary is unclear.

Blocking notes:

```txt

```

## 0. Hard boundary attestation

Mark any unchecked required row as FAIL or BLOCKED before continuing.

- [ ] This review is docs-only/fake-only/non-production.
- [ ] No production deployment, public launch, DNS/cutover, real ad traffic, real user traffic, or formal production domain routing was performed.
- [ ] No production secrets, paid production resources, production database, production storage, production CDN/R2, or NovelHub production infrastructure were used.
- [ ] No real payment, subscription, login/auth, wallet, refund, cancellation, entitlement, backend, database, analytics/tracking, Facebook/Meta API, Pixel/CAPI, or video infrastructure was required or observed.
- [ ] No real user data, PII, production logs, real account identifiers, real payment identifiers, real Facebook IDs, or private tokens are included in this evidence.
- [ ] Evidence uses only mock, self-owned, or explicitly authorized assets and copy; no licensed/competitor/uncleared titles, posters, videos, pricing, or copy are included.
- [ ] `unlocked=1` is treated only as fake review state and not as production entitlement.
- [ ] If the URL is externally reachable, access control/noindex/test window/owner/shutdown plan are recorded above.

Hard-stop observations:

```txt

```

## 1. Review setup metadata

| Field | Value |
| --- | --- |
| Reviewer / role |  |
| Date/time with timezone |  |
| Branch / PR |  |
| Commit SHA |  |
| Base URL |  |
| Environment label |  |
| Browser / device |  |
| Viewport | 390 x 844 primary unless explicitly noted |
| Show id used |  |
| Story title / mock title |  |
| Fixture `freeEpisodes` value, if known |  |
| First locked episode |  |
| Screenshot/evidence root path |  |
| Console log capture path, if any |  |
| Network capture/request notes path, if any |  |

Environment notes:

```txt

```

## 2. Browser / device / viewport evidence

Primary row:

- [ ] 390 x 844 mobile-first viewport used.
- [ ] Browser/device recorded above.
- [ ] Evidence is from local or explicitly non-production preview/demo environment.

Recommended supporting rows, if available without CI/package/browser-install changes:

- [ ] Chromium mobile emulation at 390 x 844.
- [ ] WebKit/Mobile Safari-equivalent manual evidence.
- [ ] Desktop browser responsive 390 x 844 as supporting evidence only.
- [ ] Desktop wide viewport catastrophic-layout smoke only; not used as sole P0 pass evidence.

Browser/viewport notes:

```txt

```

## 3. Facebook source landing evidence

Opened URL:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
```

Observed URL after load:

```txt

```

Expected state:

- [ ] Watch page opens directly.
- [ ] EP1 is active.
- [ ] `source=facebook` context is present or intentionally preserved by documented route-helper behavior.
- [ ] User is not sent to Home, Search, Genre, or Show Detail before playback.
- [ ] No login, recharge, Story Pass, PWA install, payment, or subscription prompt appears before playback.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| Landing screenshot |  |
| URL bar screenshot, if separate |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## 4. Free-preview-first evidence

Steps performed:

1. Start from EP1.
2. Complete or advance fake playback.
3. Continue through every free episode until immediately before the lock point.

Observed URL states:

```txt
EP1:
EP2 or next free episode:
Last free episode:
```

Expected state:

- [ ] Same show context is preserved through the free episode chain.
- [ ] Free episodes remain playable without login.
- [ ] No recharge prompt appears before the first locked episode.
- [ ] No Story Pass prompt appears before the first locked episode.
- [ ] No PWA install prompt interrupts first playback or the free-preview-first path.
- [ ] No payment or subscription prompt appears before the first locked episode.
- [ ] Episode Sheet, if opened, highlights the current episode and shows free episodes as playable.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| EP1 playback screenshot |  |
| Free-chain continuation screenshot |  |
| Last-free-episode screenshot |  |
| Episode Sheet screenshot, if used |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## 5. Per-drama first locked episode evidence

URL/state at first locked episode:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]
```

Expected trigger:

```txt
episode > story.freeEpisodes && unlocked !== true
```

Expected state:

- [ ] First locked episode number is recorded in setup metadata.
- [ ] The lock point matches the story `freeEpisodes` value, fixture notes, or observed UI behavior.
- [ ] Locked state appears only after the free episode chain.
- [ ] Locked state is visually distinct from weak network, video failure, or generic error.
- [ ] Fake playback progress does not imply that the locked episode is already playing.
- [ ] Unlock Drawer opens automatically on first entry.
- [ ] Closing the drawer keeps the user on the locked episode.
- [ ] Tapping the locked playback area reopens the drawer.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| First locked episode screenshot |  |
| Drawer auto-open screenshot |  |
| Drawer closed / locked state screenshot |  |
| Reopen interaction screenshot |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## 6. Unlock Drawer evidence

Expected drawer fields and hierarchy:

| Required observation | Value / notes |
| --- | --- |
| Drama title shown |  |
| Episode number shown |  |
| Fake/mock balance shown |  |
| Fake/mock cost shown |  |
| Primary CTA is single-episode unlock, e.g. `Unlock EP X` |  |
| Secondary CTA is Story Pass, e.g. `Get Story Pass` |  |
| Maybe later / close action is available |  |
| Return-to-same-episode explanation is visible |  |
| Mock/fake status is clear for purchase-like actions |  |
| Auto-unlock, if present, is hidden or clearly off by default |  |
| Primary CTA remains visible and usable at 390 x 844 safe area |  |

Expected state:

- [ ] Single-episode unlock remains primary at the first locked episode.
- [ ] Story Pass remains secondary at the first locked episode.
- [ ] Drawer can be closed without leaving the locked episode.
- [ ] Drawer can be reopened from the locked playback area.
- [ ] No real payment/subscription/login/backend/entitlement flow is required.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| Drawer open screenshot |  |
| CTA hierarchy screenshot |  |
| 390 x 844 safe-area screenshot |  |
| Drawer close/reopen screenshot |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## 7. Fake single-episode unlock return evidence

Action taken:

```txt
Clicked/tapped: Unlock EP [lockedEpisode]
```

Observed return URL:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

Expected state:

- [ ] Same show id is preserved.
- [ ] Same locked episode number is preserved.
- [ ] `unlocked=1` is present.
- [ ] `unlocked=1` is fake review state only, not production entitlement.
- [ ] User is not sent to Home.
- [ ] User is not stranded on Pass/options.
- [ ] Episode becomes playable/unlocked only in the fake state.
- [ ] No real payment, login, entitlement, backend, database, analytics, Facebook, or video service call is made.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| CTA tap/click screenshot, if captured |  |
| Return URL screenshot |  |
| Unlocked playable-state screenshot |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED

## 8. Fake Story Pass path evidence, if present

Use this section only if the fake Story Pass / pass-options path exists in the reviewed build. Mark BLOCKED if the path exists but context cannot be verified. Mark N/A if the path is not present and not required for this review.

Pass/options URL observed:

```txt
/variant-b/pass?story=[showId]&episode=[lockedEpisode]
```

Observed return URL after fake pass action:

```txt
/variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

Expected state:

- [ ] Pass/options page preserves story id and episode context.
- [ ] Page is framed around the current drama, not generic catalog access only.
- [ ] Copy is clearly mock/fake.
- [ ] No real subscription or payment terms are activated.
- [ ] Fake pass action returns to the same show and same episode with `unlocked=1`.
- [ ] User is not sent to Home and not stranded on Pass/options after fake action.
- [ ] No real payment, login, entitlement, backend, database, analytics, Facebook, or video service call is made.

Evidence:

| Evidence item | Path / observation |
| --- | --- |
| Pass/options page screenshot |  |
| Mock/fake copy screenshot |  |
| Return URL screenshot |  |
| Console observations |  |
| Network observations, fake-only |  |
| Notes |  |

Result:

- [ ] PASS
- [ ] FAIL
- [ ] BLOCKED
- [ ] N/A, path not present in reviewed fake-only build

## 9. Request / network hard-stop guard notes

Record observed requests or state explicitly that none were observed. Any request to a hard-stop category below marks the review FAIL and requires escalation.

| Category | Observed? | Host/path/details | Result |
| --- | --- | --- | --- |
| Payment / Stripe / app-store billing / other billing |  |  | PASS / FAIL / BLOCKED |
| Subscription / renewal / cancellation service |  |  | PASS / FAIL / BLOCKED |
| Auth / login / real account service |  |  | PASS / FAIL / BLOCKED |
| Facebook/Meta API, Pixel, CAPI, real campaign attribution |  |  | PASS / FAIL / BLOCKED |
| Analytics / tracking / third-party identifiers |  |  | PASS / FAIL / BLOCKED |
| Backend API / production API |  |  | PASS / FAIL / BLOCKED |
| Database / production storage |  |  | PASS / FAIL / BLOCKED |
| Entitlement / wallet ledger / unlock state service |  |  | PASS / FAIL / BLOCKED |
| Real video player / CDN / R2 / DRM / transcoding |  |  | PASS / FAIL / BLOCKED |
| Secrets or private token surfaces |  |  | PASS / FAIL / BLOCKED |
| Production domains or paid production resources |  |  | PASS / FAIL / BLOCKED |
| Licensed/competitor/uncleared asset sources |  |  | PASS / FAIL / BLOCKED |

Network summary:

```txt

```

Result:

- [ ] PASS: no hard-stop request category observed.
- [ ] FAIL: a hard-stop request category was observed.
- [ ] BLOCKED: network evidence is unavailable or inconclusive.

## 10. Optional existing automation cross-check, if already available

This section may cite existing local checks, CI links, or Playwright output if they already exist. Do not modify CI, install browsers, change package/lockfiles, or add runtime/test code for this template unless a separate task explicitly authorizes it.

Command or CI link:

```txt

```

Observed fake-only automated coverage:

- [ ] Route starts from `/variant-b/watch/[showId]?episode=1&source=facebook`.
- [ ] Free preview appears before login/recharge/Story Pass/PWA/payment/subscription prompts.
- [ ] First locked episode is reached by per-drama lock point.
- [ ] Unlock Drawer is observed.
- [ ] Fake unlock same-episode return includes `unlocked=1`.
- [ ] Fake pass/options return, if covered, preserves same episode and includes `unlocked=1`.
- [ ] Hard-stop real-service requests are guarded or absent.

Automation notes:

```txt

```

## 11. Final reviewer assessment

Decision:

- [ ] PASS FOR FAKE-ONLY NON-PRODUCTION P0 DEMO EVIDENCE ONLY.
- [ ] FAIL: P0 invariant not proven, route context lost, hard-stop request observed, prompt appears before free preview, unlock return loses episode/show context, evidence depends on real services, or uncleared assets are present.
- [ ] BLOCKED: environment, assets, route, browser, network evidence, or approval boundary is unclear.

Required PASS statements:

- [ ] The opened route starts from `/variant-b/watch/[showId]?episode=1&source=facebook`.
- [ ] Free episodes can be watched before login, recharge, Story Pass, PWA install, payment, or subscription prompts.
- [ ] The first locked episode is reached after the free episode chain.
- [ ] Unlock Drawer opens and keeps single-episode unlock primary and Story Pass secondary at first lock.
- [ ] Fake unlock/pass returns to the same show and same episode with `unlocked=1`.
- [ ] Post-unlock user is not returned to Home and does not lose episode context.
- [ ] No hard-stop real-service request, production resource, production secret, or uncleared asset is included.
- [ ] PASS is not interpreted as actual-online-testing approval, production approval, launch approval, integration approval, legal/compliance approval, or content-rights approval.

Reviewer decision / notes:

```txt

```

Follow-up suggestions, if any:

```txt

```

## 12. STOP conditions for future work

Stop and escalate for explicit human/product/security/legal/ops decision before any of the following:

- Production deployment, DNS/cutover, production domain routing, real ad traffic, or real user traffic.
- Production secrets, paid production resources, production database/storage/CDN/R2, or NovelHub production infrastructure.
- Real payment, subscription, login/auth, wallet, entitlement, backend, database, analytics/tracking, Facebook/Meta API, Pixel/CAPI, or video infrastructure.
- Stripe/Meta/Facebook production credentials, real user tracking, real accounts, real payment data, or production logs.
- CI/browser/package/workflow/runtime code changes not explicitly authorized by a separate task.
- Licensed/competitor/copied/uncleared title, poster, video, pricing, or copy.
- Any change that returns post-unlock users to Home, loses episode/show context, requires login before free preview, shows prompts before free preview, or treats `unlocked=1` as production entitlement.

## 13. Source traceability notes

This template traces to:

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md` §2, §3, §5-§11, §14, and §15.
- `docs/moboreels/prototype-b-spec.md`, which defers SceneFlow MVP behavior to the PRD.
- `docs/moboreels/phase-4g/evidence-template.md`, extended here without weakening fake-only P0 evidence requirements.
- `docs/moboreels/phase-5/actual-online-testing-readiness-checklist.md`, especially the distinction between fake-only staging/demo readiness and actual online-testing readiness.
- `docs/moboreels/phase-5/fake-only-actual-online-testing-evidence-template-requirements-packet.md` acceptance criteria and stop conditions.

Suggested verification statement:

```txt
PASS FOR TEMPLATE READINESS ONLY: The evidence template is sufficient to collect fake-only, non-production P0 demo evidence and contains hard-stop guards. It does not authorize actual online testing, production launch, real integrations, production services, or legal/compliance decisions.
```
