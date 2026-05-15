# CI runbook

## Workflows

- `PR checks`: runs on `pull_request`, checks out PR code, installs with pnpm/Node 22, and runs hard-stop checks, banned-dependency checks, unit tests, lint, and build.
- `NovelHub-style PR Review Gate`: posts the machine review verdict and labels. It is advisory plus status-enforced by its own workflow result.
- `PR labeler`: metadata-only label routing. It must not checkout or execute PR code.
- `Sanity check`: manual smoke workflow for repository health.
- `Sync labels`: manual/main-branch workflow that syncs labels from `.github/labels.yml`.

## Local equivalent

```bash
corepack enable
pnpm install --frozen-lockfile
node .github/scripts/review-gate-checks.mjs
pnpm check:banned-deps
pnpm test:unit
pnpm lint
pnpm build
```

## Failure triage

1. Read the first failing step log.
2. If hard-stop checks fail, remove or split the guarded scope before retrying.
3. If dependency install fails, confirm `pnpm-lock.yaml` matches `package.json`.
4. If lint/build/test fails, reproduce locally before pushing a fix.
5. Do not bypass CI with auto-merge or unreviewed branch settings.
