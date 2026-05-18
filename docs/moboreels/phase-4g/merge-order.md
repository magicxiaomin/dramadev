# Phase 4G Recommended Human Merge Order

Status: historical recommendation only, reconciled after stale PR #20 was closed and the clean replacement PR #23 merged. This document does not merge, approve, rebase, force-push, close, or alter any PR.

Relevant PRs:

1. PR #19: https://github.com/magicxiaomin/dramadev/pull/19 (`feat/phase4e-callback-query-contract`)
2. PR #23: https://github.com/magicxiaomin/dramadev/pull/23 (`feat/phase4f-p0-playwright-harness-clean2`) — merged clean replacement for stale PR #20 (https://github.com/magicxiaomin/dramadev/pull/20).

## Recommended order

### 1. Review PR #19 first

Reason: PR #19 centralizes callback/query contract behavior that PR #23's browser harness should rely on or align with.

Human review focus:

- `episode` parsing preserves valid episode context.
- `source=facebook` and allowed attribution params are preserved where intended.
- `unlocked=1` is the only fake unlock success signal.
- Watch, pass, and show route helpers preserve show/story and episode context.
- Invalid query values fail safely without sending the P0 path to Home.
- No real payment, Facebook API, analytics, login, entitlement, backend, database, video, secrets, DNS, or production deploy behavior is added.

### 2. Then review merged PR #23

Reason: PR #23 proves the end-to-end P0 browser path using the contract established by PR #19, replacing stale PR #20.

Human review focus:

- Harness starts from `/variant-b/watch/[showId]?episode=1&source=facebook` or an equivalent source-preserving helper.
- Harness verifies free-preview-before-prompts behavior.
- Harness reaches the first locked episode.
- Harness observes Unlock Drawer fields and CTA hierarchy.
- Harness verifies fake unlock/pass returns to the same episode with `unlocked=1`.
- Harness remains fake-only and does not require real service credentials.

## Rebase and conflict watch-items

Before a human merges either PR, check for conflicts in:

- Watch route files under `/variant-b/watch/[showId]`.
- Pass/options route files under `/variant-b/pass`.
- Shared query/callback helpers.
- Lock/free-episode helper logic.
- Tests around query params, lock state, and P0 browser flow.
- Package or lockfile changes that might affect Playwright or CI behavior.

Because PR #23 replaced stale PR #20, use PR #23 for any post-merge harness evidence instead of the closed PR #20 branch.

## Explicit no-history-rewrite rule

Do not force-push, rewrite history, reset shared branches, or alter PR #19 / PR #20 / PR #23 branches from Phase 4G docs work. If a conflict or stale branch exists, record the exact conflict/watch item and let the human PR owner choose the update strategy.

## No automated merge

This package does not authorize automated merge. Final merge remains a human action after review evidence and CI/status checks are acceptable.
