# Branch protection recommendation

This document is a recommendation only. It does not apply repository settings.

## Suggested protected branch

Protect `main` when maintainers are ready.

## Suggested required checks

- `PR checks / lint, unit, build, and hard-stop checks`
- `NovelHub-style PR Review Gate / deterministic review gate`

## Suggested review rules

- Require at least one human approval.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution before merge.
- Do not enable auto-merge until maintainers have observed the workflow behavior on multiple PRs.

## Admin and bypass guidance

- Keep emergency bypass limited to repository owners.
- Document any bypass in the PR discussion.
- Never bypass hard-stop failures by changing labels alone.

## Out of scope for this retrofit

This branch intentionally does not apply branch settings, create secrets, or configure release actions.
