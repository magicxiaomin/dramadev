# Bot identity

DramaDev automation should be easy to identify and should never impersonate a human reviewer.

## Current bots

- `github-actions[bot]`: runs CI workflows, syncs labels, applies metadata labels, and posts review-gate comments.
- Claude Code review, when configured by maintainers, is invoked inside GitHub Actions and reported through the review-gate comment.

## Comment requirements

Automated comments should include:

- a stable hidden marker when the comment is meant to be updated in place
- the workflow name or bot identity
- a machine-readable verdict when the workflow enforces a status
- clear language that human review is still required before merge

## Boundaries

Bots must not:

- auto-merge PRs
- apply branch settings
- request or store secrets in repository files
- perform release actions
- claim final product acceptance without human review
