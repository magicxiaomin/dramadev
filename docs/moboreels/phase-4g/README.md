# Phase 4G Merge-Readiness QA Package

Status: docs-only, fake-only planning package.

This package supports human review of the SceneFlow P0 Facebook ad conversion flow while PR #19 and PR #20 are still awaiting human review/merge. It does not merge, approve, rebase, force-push, or otherwise alter PR #19 (`feat/phase4e-callback-query-contract`) or PR #20 (`feat/phase4f-p0-playwright-harness`).

Source of truth:

- `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`
- `docs/moboreels/prototype-b-spec.md`
- PR #19: https://github.com/magicxiaomin/dramadev/pull/19
- PR #20: https://github.com/magicxiaomin/dramadev/pull/20
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
4. `merge-order.md` - recommended human review/merge order for PR #19 then PR #20.
5. `phase-5-questions.md` - questions only for later planning; no commitments.

Phase 4G boundaries:

- Docs only under `docs/moboreels/phase-4g/`.
- Fake-only observations and checklist language only.
- No runtime code, Playwright edits, CI edits, backend, database, analytics, Facebook API, real payment, real subscription, login, video infrastructure, secrets, DNS, or production deployment work.
