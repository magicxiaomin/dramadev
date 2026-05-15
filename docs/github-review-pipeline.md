# GitHub review pipeline

DramaDev uses a layered review pipeline inspired by NovelHub's governance pattern, adapted for a low-risk P0 static scaffold.

## Layers

1. **Templates** collect scope, guardrail, validation, and acceptance evidence.
2. **PR checks** run deterministic local gates on `pull_request` with checked-out PR code.
3. **Claude review gate** runs deterministic gates, optionally asks Claude Code for review, posts one upserted comment, and applies advisory labels.
4. **PR labeler** applies metadata labels without checking out or running PR code.
5. **Human review** remains required for final judgment and merge.

## Hard-stop categories

P0 review blocks or splits work that introduces backend/API routes, payment, auth, database persistence, Facebook/analytics integrations, secrets, release infrastructure, destructive operations, or copied competitor assets.

## Merge rule of thumb

A PR is merge-ready only when:

- CI is green.
- The review-gate comment says `REVIEW_DECISION: APPROVE` or a human owner has resolved the reason for changes requested.
- Required acceptance evidence is present.
- A human reviewer explicitly approves and merges.
