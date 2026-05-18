# PHASE4F-004 P0 Playwright harness note

Linked task: `t_5f485e4c`

This implementation adds a fake-only Playwright browser regression harness for the P0 SceneFlow Facebook ad conversion route:

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Scope boundaries:

- Canonical target is `PRIMARY_SHOW_ID` from `src/data/fixtures/shows.ts` (`midnight-lantern-oath`).
- The test derives `freeEpisodes` and `firstLockedEpisode` from the fixture data instead of hard-coding the secondary stub show.
- Browser coverage is Chromium-only at a mobile viewport of 390 x 844.
- The harness verifies the fake/static route behavior only. It does not add real payment, subscription, login, Facebook API, analytics, backend, database, entitlement, or video infrastructure.
- The local deterministic command is:

```bash
pnpm test:e2e:p0
```

CI posture:

- `.github/workflows/pr-checks.yml` keeps install, hard-stop checks, banned-deps, unit tests, lint, and build as the required gate sequence.
- The P0 browser regression is added as an advisory `continue-on-error: true` step after build for first landing.
- CI installs Chromium only with `pnpm exec playwright install chromium`; it intentionally does not use `playwright install --with-deps` and does not introduce secrets or production infrastructure.
- If hosted CI browser dependencies prove too costly or unavailable, the advisory step can fail without blocking the existing hard-stop gate while still surfacing artifacts/logs for follow-up.
