# Claude Code review process

The Claude review workflow is a review assistant, not an autonomous maintainer.

## Inputs

- PR diff and changed-file metadata from Git.
- Deterministic hard-stop results from `.github/scripts/review-gate-checks.mjs`.
- Local gate results for banned dependencies, tests, lint, and build.

## Output

The workflow renders a single PR comment containing:

- deterministic gate summary
- Claude review text when the secret is configured
- `REVIEW_DECISION: APPROVE` or `REVIEW_DECISION: REQUEST_CHANGES`
- labels to add/remove

## Secret behavior

If `ANTHROPIC_API_KEY` is unavailable, the workflow records a missing-Claude state and requests human review. Repository files must not contain or ask contributors to paste secrets.

## Reviewer responsibility

Human reviewers should verify that:

- the machine verdict matches the diff
- hard-stop categories were not bypassed
- acceptance evidence is credible
- any requested split or follow-up is tracked before merge
