# Acceptance runbook

## Purpose

Use the P0 acceptance script to prove that a change remains inside the static DramaDev scaffold scope and still builds.

## Before running

- Work from the repository root.
- Keep the branch free of secrets and generated credentials.
- Do not add backend/API route, payment, auth, database, Facebook/analytics, or release-infrastructure changes as part of P0 acceptance.

## Command

```bash
bash acceptance/dramadev-p0.sh
```

For clean CI environments:

```bash
bash acceptance/dramadev-p0.sh --ci
```

## Evidence to paste into PRs

Paste the final command block and whether each step passed:

- hard-stop checks
- banned-dependency checks
- unit tests
- lint
- build

For visible UI changes, include route notes or screenshots in addition to script output.
