# Phase 4G Merge-Readiness QA Package

Status: docs-only, fake-only planning package.

This package was originally drafted while PR #19 and the now-closed stale harness PR #20 were awaiting human review/merge. Current harness evidence should use the merged clean replacement PR #23 (`feat/phase4f-p0-playwright-harness-clean2`). This docs package does not merge, approve, rebase, force-push, or otherwise alter PR #19, PR #20, or PR #23.

Source of truth:

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- PR #19: https://github.com/magicxiaomin/dramadev/pull/19
- PR #23 (merged clean replacement for stale PR #20): https://github.com/magicxiaomin/dramadev/pull/23
- Requirements advice: `/tmp/phase4g_requirements_advice.md`

P0 invariant for review:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook
-> free episode chain
-> first locked episode
-> Unlock Drawer
-> fake unlock/pass
-> same episode with unlocked=1
```

Recommended reading order:

1. `qa-readiness.md` - manual P0 QA checklist and browser/viewport matrix.
2. `evidence-template.md` - fill-in template for reviewer evidence.
3. `known-gaps.md` - explicit out-of-P0 and not-Phase-4G gaps.
4. `merge-order.md` - historical merge-order guidance, now reconciled to the merged PR #23 harness replacement.
5. `phase-5-questions.md` - questions only for later planning; no commitments.

Phase 4G boundaries:

- Docs only under `docs/moboreels/phase-4g/`.
- Fake-only observations and checklist language only.
- No runtime code, Playwright edits, CI edits, backend, database, analytics, Facebook API, real payment, real subscription, login, video infrastructure, secrets, DNS, or production deployment work.
