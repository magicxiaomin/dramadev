# SceneFlow P0 demo package verification

Verified at: 2026-05-20 03:57:39 UTC

Scope: docs-only demo package under `docs/moboreels/demo/`. No runtime code was changed.

## Local gates run

From repository root:

```bash
bash acceptance/dramadev-p0.sh
```

Result: passed.

Covered by the wrapper:

- `node .github/scripts/review-gate-checks.mjs` — passed silently inside the wrapper.
- `pnpm check:banned-deps` — passed.
- `pnpm test:unit` — passed: 6 test files, 54 tests.
- `pnpm lint` — passed: no ESLint warnings or errors.
- `pnpm build` — passed: Next static build completed and generated routes including `/variant-b/watch/[showId]` and `/variant-b/pass`.

P0 e2e:

```bash
pnpm test:e2e:p0
```

First attempt result: failed because the local Hermes profile did not yet have the Playwright Chromium browser binary installed:

```txt
browserType.launch: Executable doesn't exist at /root/.hermes/profiles/dramadev-ops/home/.cache/ms-playwright/chromium-1097/chrome-linux/chrome
```

Environment remediation performed:

```bash
pnpm exec playwright install chromium
```

Second attempt result: passed.

```txt
2 passed (31.9s)
```

## Demo package files checked

- `docs/moboreels/demo/README.md`
- `docs/moboreels/demo/p0-demo-script.zh-CN.md`
- `docs/moboreels/demo/p0-route-list.md`
- `docs/moboreels/demo/p0-capture-checklist.md`
- `docs/moboreels/demo/p0-phone-preview.md`
- `docs/moboreels/demo/p0-safety-warnings.md`
- `docs/moboreels/demo/p0-verification.md`

## Safety confirmation

The package is documentation only and preserves the fake-only P0 invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

It does not add or request production deployment, DNS/cutover, public tunnels, real credentials, payment, subscription, login, Facebook API, analytics, backend, database, entitlement, video infrastructure, or NovelHub production infrastructure.
