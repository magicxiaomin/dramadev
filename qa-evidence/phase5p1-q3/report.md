# PHASE5P1-Q3-007 QA fake-only drawer balance regression evidence

Verdict: PASS / GREEN for the P0 drawer-only mock-balance regression scope.

Caveat: the default primary fixture has sufficient balance (80 >= 36), so the runtime drawer primary CTA is `Unlock EP 6`. The insufficient-balance `Get coins to unlock` text is present as a source conditional in `src/app/variant-b/watch/[showId]/watch-stub.tsx`, but there is no route/query control to select the low-balance wallet variant without changing runtime code. I did not mutate production code to force that branch.

## Scope validated

Target viewport: 390x844 Chromium mobile context, deviceScaleFactor=3.
Target P0 route:
`/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook -> free episode chain -> EP6 first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1`.

## Commands run

- `pnpm test:unit -- src/lib/*.test.ts`
  - PASS: 6 files, 54 tests.
- `pnpm test:e2e:p0`
  - PASS: 2 Playwright P0 tests on `p0-mobile-390x844`.
- `pnpm lint`
  - PASS: no ESLint warnings/errors.
- `pnpm check:banned-deps`
  - PASS: production dependencies checked: next, react, react-dom.
- `node qa-evidence/phase5p1-q3/mock-balance-drawer-evidence.js`
  - PASS: local-only Playwright evidence capture/assertion script.
- `node qa-evidence/phase5p1-q3/capture-safe-area-viewport.js`
  - PASS: viewport-only drawer safe-area screenshot captured.

## Evidence artifacts

- Assertion JSON: `/root/projects/dramadev/qa-evidence/phase5p1-q3/mock-balance-drawer-evidence.json`
- Evidence script: `/root/projects/dramadev/qa-evidence/phase5p1-q3/mock-balance-drawer-evidence.js`
- Safe-area viewport capture helper: `/root/projects/dramadev/qa-evidence/phase5p1-q3/capture-safe-area-viewport.js`
- Screenshots:
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/01-ep1-free-no-prelock-balance.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/02-ep1-episode-sheet-cost-helper.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/03-ep5-last-free-no-prelock-balance.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/04-ep6-first-lock-drawer-fake-balance-cost.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/04b-ep6-drawer-viewport-safe-area.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/05-ep6-drawer-closed-same-locked-episode.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/06-ep6-reopened-from-locked-playback.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/07-ep6-post-fake-unlock-same-episode-source.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/08-story-pass-context-and-return.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/09-story-pass-return-same-unlocked-episode.png`
  - `/root/projects/dramadev/qa-evidence/phase5p1-q3/screenshots/10-ep7-direct-later-locked-drawer-only.png`

## Checklist result

- EP1 opens directly from Facebook ad watch route: PASS.
- EP1 free preview has no pre-lock balance/wallet/coin/recharge/Story Pass/subscription/login/payment-like UI in header/playback/quick entries/episode-complete CTA: PASS.
- Last free episode EP5 has no pre-lock balance/wallet/coin/recharge/Story Pass/subscription/login/payment-like UI in header/playback/quick entries/episode-complete CTA: PASS.
- Episode Sheet header stays free of pre-lock monetization copy: PASS.
- Episode Sheet locked-row cost-as-unlock-condition helper remains (`36 coins` on EP6 locked row): PASS.
- First locked episode EP6 opens automatically into locked state and Unlock Drawer: PASS.
- Locked state is distinct from error/network state: PASS; copy says `Locked boundary` / `EP 6 is locked`, with no error/network/failed text.
- Unlock Drawer shows title/episode/story context: PASS.
- `unlock-drawer-balance` shows fake drawer-only value `Drawer mock balance` / `80 coins`: PASS.
- `unlock-drawer-cost` shows fake drawer-only value `Drawer mock cost` / `36 coins`: PASS.
- CTA hierarchy: primary `Unlock EP 6`, secondary `Get Story Pass (mock)`, tertiary `Maybe later`: PASS.
- Drawer close stays on same locked EP6: PASS.
- Tapping locked playback reopens drawer: PASS.
- Fake single-episode unlock returns to `/variant-b/watch/midnight-lantern-oath?episode=6&source=facebook&unlocked=1`: PASS.
- Story Pass round trip returns to same locked episode with `unlocked=1` and preserves `source=facebook`: PASS.
- Direct later locked episode EP7 remains drawer-only for balance/cost display: PASS.
- No Home redirect or episode loss: PASS.
- Safe-area / bottom CTA visibility: PASS; viewport-only screenshot shows primary/secondary/tertiary drawer CTAs visible and not covered.
- No prod deps / hard-stop external requests observed: PASS; custom evidence run recorded `blockedRequests: []`, `consoleMessages: []`, and banned dependency check passed.

## Blockers

None for the default P0 drawer-only mock-balance regression. Only caveat is the insufficient-balance CTA branch is not runtime-selectable without a code change; it was not forced during QA.
