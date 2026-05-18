# PHASE4E-003A — QA executable test implementation plan for free-chain anonymous coverage

Verdict: APPROVE for drafting the Phase 4E executable-test card design. This artifact is planning/test-design only. It does not implement app behavior, executable tests, routes, auth, payment, backend, analytics, Facebook, video, database, entitlement, or production infrastructure.

## 1. Scope and source of truth

Primary source: `docs/moboreels/real-mvp/artifacts/phase4e-001-claude-requirements.md`.
Secondary planning input: `docs/moboreels/real-mvp/phase4d-008-free-chain-anonymous-test-plan.md`.
MVP source of truth remains `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`; `docs/moboreels/prototype-b-spec.md` is secondary only.

This plan translates the first Phase 4E test artifact into executable-test work items for:

- FC-01..FC-06.
- LFC-01..LFC-10.
- ENT-FC-01..ENT-FC-05, covering E-01, E-02, E-03, E-04, and E-15.
- IDEM-M-06 plus the negative IDEM-M-01 static-import guard required by PHASE4E-001 §4.4.
- Network egress and static dependency evidence.

The executable tests must consume PHASE4E-002 parser/helper outputs when they are available. Until PHASE4E-002 lands, this plan only names the helper seams and test fixtures; it must not add parallel URL parsing or builder authority.

## 2. Binding funnel invariant

All tests in this bundle are fake-only/staging-only and must preserve this route shape:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
  -> EP1 and every free episode anonymously
  -> first locked episode, episode = show.freeEpisodes + 1
  -> locked Watch state + Unlock Drawer
  -> mock Unlock EP / mock Story Pass only after the free preview
  -> /variant-b/watch/[showId]?episode=[lockedEpisode]&unlocked=1
```

Hard assertions across the bundle:

1. No Home redirect and no loss of `showId` or `episode` context.
2. No login, PWA, recharge, coin-pack, pass, Story Pass, or payment prompt before the first locked episode.
3. No real auth, real payment, backend, database, Facebook, analytics, video, CDN, or provider dependency.
4. `unlocked=1` is a UX hint only and is never access authority.
5. The first locked episode is a locked state, not a playback error state.
6. Mock unlock/pass success returns to the same locked episode with `unlocked=1`; cancel/failure/close stays on or returns to the same locked episode without granting authority.

## 3. Proposed executable artifact layout

Recommended files for the implementation card:

| Path | Purpose | Notes |
| --- | --- | --- |
| `tests/e2e/free-chain-anonymous.spec.ts` | FC-01..FC-06 and high-level P0 route/free-chain flow | Use 390x844 for core mobile assertions; can share fixtures with locked suite. |
| `tests/e2e/locked-drawer-and-sheet.spec.ts` | LFC-01..LFC-10 plus same-episode mock unlock/pass return checks | Starts from the canonical first locked episode and Episode Sheet interactions. |
| `tests/unit/free-chain-authority.test.ts` | ENT-FC-01..ENT-FC-05 / E-01..E-04 / E-15 authority decisions | Thin predicate only until full evaluator card; do not introduce full `evaluateAccess`. |
| `tests/fixtures/free-chain-canonical-show.ts` | Canonical show fixture adapter | May wrap existing `PRIMARY_SHOW_ID = midnight-lantern-oath`; freeze `freeEpisodes=5`, `lockedEpisode=6`, balance/cost. |
| `tests/harness/network-egress.ts` | Playwright route interception and request log | Fail on banned hosts, provider SDK endpoints, non-local origins outside explicit local/static allow-list. |
| `tests/harness/url-trace.ts` | URL/evidence recorder | Append current URL, expected route, and test ID after every navigation/interaction. |
| `scripts/check-free-chain-static-deps.ts` | Static import/dependency guard | No banned SDK/runtime imports; no idempotency generator import in free-chain route code. |
| `docs/moboreels/real-mvp/artifacts/phase4e-003-evidence/` | Evidence output directory | Store fixture dump, URL trace, screenshots, HAR/network log, static scan output. |

If the repository keeps test files under another convention by the time implementation begins, keep the same boundaries and map each file to the IDs below in the evidence bundle.

## 4. PHASE4E-002 dependency seam

The executable tests must not create a second source of truth for callback/query parsing. Implementation should import PHASE4E-002 outputs for:

- `buildWatchEpisodeHref` / Watch route construction.
- attribution allow-list preservation for `source`, `campaign_id`, `adset_id`, `ad_id`, `creative_id`, `placement`, `utm_source`, `utm_campaign`, `utm_content`.
- `unlocked=1` parse/build as UX hint only.
- enum/regex handling for callback keys when stale callback state is part of a fixture.
- explicit non-emission of `idempotency_key` on Watch, Pass, Show Detail, and Episode Sheet URLs.

Draft-only fallback before PHASE4E-002 is available:

- Define expected URLs as strings in the plan/evidence fixture, not reusable production helpers.
- Mark tests that require helper imports as `todo` or blocked in the implementation PR rather than shipping a parallel parser.
- Add a reviewer note that PHASE4E-003 cannot claim completion until PHASE4E-002 helpers exist and pass their own unit tests.

## 5. Canonical fixture requirements

Use one stable canonical show fixture:

- `showId`: `midnight-lantern-oath` unless PHASE4E-002/fixture owners rename it.
- `freeEpisodes`: 5.
- `lockedEpisode`: 6.
- `totalEpisodes`: 36.
- free episode chain: EP1..EP5.
- locked sample episodes: EP6 and EP7 for locked-click/sheet coverage.
- mock balance: 80.
- mock single-episode cost: 36.
- browser context: anonymous, no cookies, no localStorage, no sessionStorage, no IndexedDB authority, no prior auth/payment state.
- route attribution seed: `source=facebook`; optional matrix values for the nine attribution keys can be added after PHASE4E-002.

Fixture dump evidence should include the show ID, `freeEpisodes`, `lockedEpisode`, mock balance/cost, total episode count, storage/cookie emptiness, and the exact ad route.

## 6. Test matrix and executable assertions

### 6.1 FC-01..FC-06 — free-chain anonymous

| ID | Test name | Executable steps | Required assertions | Evidence |
| --- | --- | --- | --- | --- |
| FC-01 | `ad route opens EP1 anonymously` | New anonymous context; set viewport 390x844; navigate to `/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook`. | Watch page visible on EP1; URL remains Watch route with `episode=1` and `source=facebook`; no Home/Search/Show Detail redirect; no login/PWA/payment/recharge/pass prompt; no `/fake-auth/*` or `/fake-payment/*` request. | URL trace row, EP1 screenshot, network log. |
| FC-02 | `free chain continues through every free episode` | From EP1, mark/complete each free episode and follow Continue through EP5. | EP1..EP5 each reach playable/free state; each URL preserves show and correct episode; no prompt before locked boundary; no idempotency generation. | Step log and URL trace after every episode. |
| FC-03 | `reload restores each free episode from URL` | For each free episode URL EP1..EP5, reload. | Same episode is restored from URL; no login wall; no Home/Detail redirect; no fake entitlement required. | Reload trace per episode. |
| FC-04 | `episode sheet opens during free chain without auth` | On at least EP1 and EP5, open Episode Sheet. | Sheet opens; current episode highlighted; EP1..EP5 free/playable; locked episodes visibly locked; no auth/payment/pass route or request. | DOM snapshot/screenshot. |
| FC-05 | `manual free URL ignores stale callback and forged unlocked` | Navigate to a free episode with stale callback keys and `unlocked=1`, for example EP3. | Free episode plays anonymously because it is free; stale state does not create authority; no login/auth/payment route touched; parsed `unlocked` remains non-authority evidence only. | URL-edit trace and authority assertion output. |
| FC-06 | `free chain has zero banned network egress` | Capture all requests from initial ad route through EP5. | No backend/API/auth provider/payment provider/Meta/Facebook/production analytics/video-CDN/public-webhook/entitlement-service calls; only explicit local/static/mock assets allowed. | HAR or Playwright network JSON plus deny-list summary. |

### 6.2 LFC-01..LFC-10 — locked boundary, drawer, Episode Sheet, safe area

| ID | Test name | Executable steps | Required assertions | Evidence |
| --- | --- | --- | --- | --- |
| LFC-01 | `first locked episode opens locked state and drawer` | Complete EP5 and continue to EP6, or navigate directly after FC chain. | URL remains `/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook`; locked Watch state visible; Unlock Drawer auto-opens; no Home/Pass/Detail redirect. | URL trace, locked screenshot. |
| LFC-02 | `locked state is distinct from playback error` | Observe EP6 before entitlement. | Locked copy/CTA visible; no retry/network-error framing; playback progress does not advance as free playback; no playable provider source mounted if a provider exists. | DOM/screenshot comparison. |
| LFC-03 | `drawer contains required PRD content and CTAs` | Inspect open drawer on EP6. | Drawer includes title/story hook, drama title, EP6, mock balance, mock cost, primary `Unlock EP 6`, secondary `Get Story Pass`, tertiary `Maybe later`, copy indicating return to EP6. | Drawer DOM snapshot. |
| LFC-04 | `maybe later closes drawer and stays locked` | Click `Maybe later` or close drawer. | Drawer closes; URL stays EP6; locked state remains; no free playback; no auth/payment route starts. | Before/after URL and screenshot. |
| LFC-05 | `locked playback tap reopens same drawer` | After LFC-04, tap locked playback area/reopen control. | Same EP6 drawer reopens; no episode loss; no Home/Pass redirect. | Interaction trace. |
| LFC-06 | `episode sheet shows current/free/locked states` | Open Episode Sheet from EP6. | Current EP6 highlighted; EP1..EP5 free; EP6+ locked with price/unlock condition; current/free/locked states semantically and visually distinct. | Sheet screenshot/DOM. |
| LFC-07 | `locked episode click from sheet opens drawer for clicked episode` | From sheet, click EP7. | URL changes to EP7 Watch route; drawer opens for EP7; CTA/copy episode number matches EP7. | URL trace and drawer snapshot. |
| LFC-08 | `free episode click from sheet plays anonymously` | From locked state sheet, click EP2. | EP2 opens free/playable anonymously; no auth/payment/pass prompt; stale drawer not open. | Interaction trace. |
| LFC-09 | `show detail round trip preserves context` | From Watch EP6 or EP7, open Show Detail and return via Watch/back entry. | Show Detail is auxiliary only; return preserves same show and episode; no ad landing replacement; no Home redirect. | Round-trip URL trace. |
| LFC-10 | `390x844 safe area for P0 surfaces` | Set viewport 390x844; capture EP1, EP5, EP6 locked, drawer, sheet, Show Detail round trip. | Primary controls and drawer CTAs are visible/tappable inside safe area; no overlap hides `Unlock EP X`, `Get Story Pass`, or `Maybe later`. | Screenshot set under evidence directory. |

### 6.3 ENT-FC-01..ENT-FC-05 and E-01/E-02/E-03/E-04/E-15

These should be unit-level or thin integration assertions near the test fixture. They must not introduce the full entitlement evaluator planned for a later Phase 4E card.

Recommended temporary predicate name: `deriveFreeChainAccessDecision({ episode, freeEpisodes, unlockedFlag })`. It may exist only under tests or as a narrow fake-only helper if implementation reviewers approve. It returns a plain decision object for assertion, not a production grant.

| ID | E row | Test name | Expected decision |
| --- | --- | --- | --- |
| ENT-FC-01 | E-01 | `free episode anonymous allows free authority` | EP1/EP5 returns `{ result: 'allow', reason: 'free_episode', authority: 'free_episode' }`. |
| ENT-FC-02 | E-02 | `free episode forged unlocked flag is decision-equivalent` | EP3 with and without `unlocked=1` deep-equal on authority fields; `unlocked` may appear only as optional UX/debug field. |
| ENT-FC-03 | E-03 | `locked episode anonymous denies` | EP6 returns `{ result: 'deny', reason: 'anonymous_locked_episode', authority: 'none' }`; drawer is response, not authority. |
| ENT-FC-04 | E-04 | `locked forged unlocked flag still denies` | EP6 with `unlocked=1` and without fake entitlement deep-equal on denial authority; URL flag alone never unlocks. |
| ENT-FC-05 | E-15 | `free chain has zero auth payment idempotency backend analytics facebook traffic` | EP1..EP5 network/static evidence proves zero fake-auth, fake-payment, idempotency generator, backend, analytics, Facebook, or provider traffic. |

Implementation warning: current exploratory repository state includes `src/lib/lock.ts` accepting `unlocked` as display/access input for locked episodes. The executable tests must intentionally catch that as a failure unless a fake entitlement authority is introduced in-scope by the approved implementation card. Do not bless `unlocked=1` as authority.

### 6.4 IDEM-M-06 and IDEM-M-01 negative guard

| ID | Executable check | Required assertions | Evidence |
| --- | --- | --- | --- |
| IDEM-M-06 | Free-chain route + network + static scan | EP1..EP5 produces zero §3 idempotency generator calls, zero `/fake-auth/*`, zero `/fake-payment/*`, zero payment events, and zero generated keys in URL/storage/log fixtures. | Test assertion output, URL trace, network log. |
| IDEM-M-01 negative | Static import guard for free-chain code | Fail if free-chain Watch/page/helper code imports a future idempotency generator, fake-auth adapter, fake-payment adapter, payment-intent helper, ledger, wallet, or audit mutation helper. | Static-scan stdout in evidence. |

## 7. Network egress evidence plan

The Playwright harness should record every request with method, URL, resource type, initiator/test step, and test ID. It should fail on any non-allowed host/path.

Allowed during this fake-only suite:

- local Next.js app origin under test, for example `localhost` or `127.0.0.1`.
- framework/static files served by that same local origin, for example `/_next/static/*`.
- local fixture/mock assets committed in the repo if any are explicitly listed.

Denied examples:

- `facebook.com`, `connect.facebook.net`, `graph.facebook.com`, Meta Pixel/CAPI/Marketing API.
- Google Analytics, Segment, Amplitude, Mixpanel, PostHog, Plausible, Vercel Analytics, or any production analytics vendor.
- Stripe, app-store/IAP, payment processor, wallet, ledger, subscription, tax, chargeback, or refund provider.
- OAuth/OIDC/SAML/social-login/email/SMS auth provider.
- backend/API/database/queue/ORM/public webhook/entitlement service outside the local app fixture.
- video/CDN/storage/transcoding/DRM/caption/signed-URL provider.

The network log must be part of the final evidence package even if there are zero denied requests.

## 8. Static dependency/import evidence plan

`scripts/check-free-chain-static-deps.ts` should be deterministic and runnable in CI. It should inspect at minimum:

- `package.json` and lockfile for newly introduced banned SDK/runtime dependencies.
- `src/app/variant-b/watch/**`.
- `src/app/variant-b/show/**`.
- `src/app/variant-b/pass/**` only for URL-return helper usage; no real pass provider.
- `src/lib/**` helper imports used by the free-chain tests.
- test fixture/harness code to ensure it does not mask forbidden providers.

The check should fail on imports or string references that indicate real provider/back-end integration, including Meta/Facebook SDKs, production analytics SDKs, payment/auth SDKs, database/ORM/queue packages, video provider SDKs, idempotency-key generator imports in free-chain code, and `/fake-auth/*` or `/fake-payment/*` route registration from pre-locked free-chain code.

Expected command shape after implementation:

```txt
pnpm test:unit -- free-chain-authority
pnpm exec playwright test tests/e2e/free-chain-anonymous.spec.ts tests/e2e/locked-drawer-and-sheet.spec.ts
node scripts/check-free-chain-static-deps.ts
```

If Playwright is not yet available when implementation begins, the implementation card must either add it as dev-only test infrastructure with reviewer approval or block for test harness approval. This planning artifact does not add dependencies.

## 9. Evidence package manifest

Final implementation evidence should write or attach:

1. `test-id-map.md`: test file + test name mapped to FC-01..FC-06, LFC-01..LFC-10, ENT-FC-01..ENT-FC-05, E-01..E-04, E-15, IDEM-M-06.
2. `fixture-dump.json`: canonical show fixture, `freeEpisodes`, `lockedEpisode`, mock balance/cost, storage/cookie state, and ad route.
3. `url-trace.json`: route trace from ad route through every free episode, first locked episode, drawer close/reopen, Episode Sheet locked/free clicks, Show Detail round trip, mock unlock, mock pass, cancel/failure if included.
4. `network-log.json` or HAR: all requests plus allowed/denied summary.
5. `static-deps.txt`: static-scan output and dependency diff confirmation.
6. `authority-output.txt`: assertion output proving `unlocked=1` is non-authority.
7. `screenshots/390x844/`: EP1, last free EP5, first locked EP6, Unlock Drawer, Episode Sheet, Show Detail round trip, same-episode `unlocked=1` return.
8. `phase4d-010-approval.txt`: explicit line stating PHASE4D-010 APPROVE existed before Phase 4E implementation began.

## 10. Reviewer reject conditions for implementation

Reject or block the implementation if it:

- adds real auth, payment, subscription, backend, database, queue, ORM, migration, entitlement service, audit store, Facebook API, production analytics, video/CDN/provider, deployment, DNS, production secret, or public webhook work;
- adds login, fake-auth, payment, Story Pass, pass, recharge, coin-pack, marketing opt-in, or PWA prompts before the first locked episode;
- redirects ad/free/locked/mock-return users to Home or loses `showId`/`episode` context;
- treats `unlocked=1`, localStorage, cookies, sessionStorage, IndexedDB, history state, or query params as authoritative entitlement;
- implements the full entitlement evaluator, audit derivation, idempotency generator, fake payment callback, or paid CTA card in this first test artifact;
- widens the network allow-list beyond local/static/mock assets without explicit reviewer-approved justification;
- ships screenshots at a viewport other than 390x844 for LFC-10 evidence;
- marks tests as passing without consuming PHASE4E-002 parser/helper outputs once those helpers exist.

## 11. Acceptance checklist for this test-plan artifact

This planning artifact is complete when:

- FC-01, FC-02, FC-03, FC-04, FC-05, and FC-06 are each mapped to executable steps, assertions, and evidence.
- LFC-01, LFC-02, LFC-03, LFC-04, LFC-05, LFC-06, LFC-07, LFC-08, LFC-09, and LFC-10 are each mapped to executable steps, assertions, and evidence.
- ENT-FC-01, ENT-FC-02, ENT-FC-03, ENT-FC-04, and ENT-FC-05 are each mapped to E-01, E-02, E-03, E-04, and E-15 respectively.
- IDEM-M-06 and IDEM-M-01 negative static-import coverage are included.
- Network and static dependency evidence requirements are explicit.
- PHASE4E-002 helper dependency is explicit and does not create a parallel parser.
- Hard stops are preserved: fake-only/staging-only, no real providers/infrastructure, no pre-free-preview prompts, no Home redirect/episode loss, and no `unlocked=1` authority.

---

End of PHASE4E-003A QA executable test implementation plan.
