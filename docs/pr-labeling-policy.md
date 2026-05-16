# PR labeling policy

The PR labeler is a metadata-only helper. It may add area/type/risk labels based on branch name and changed-file paths, but it does not approve work and does not replace human review.

## Safety model

- Runs with least practical permissions: read repository metadata, read pull-request metadata, write issue labels.
- Uses `pull_request_target` only for label metadata.
- Must not checkout PR code.
- Must not install dependencies or execute contributor-controlled files.
- Must not merge, approve, or request changes.

## Author expectations

Authors should still select appropriate labels manually when automation is incomplete:

- exactly one primary `type:*` label
- at least one `area:*` label
- a `priority:*` label for roadmap relevance
- a `risk:*` label when the change is not documentation-only

## Protected scope

If a PR appears to include guarded areas such as backend/API routes, payment, auth, database, Facebook/analytics, secrets, or release infrastructure, do not rely on labels alone. Split or block the PR until an owner explicitly re-scopes it.
