# Label taxonomy

DramaDev uses labels to keep P0 work reviewable, low-risk, and explicit. Labels are defined in `.github/labels.yml` and synced by the manual `Sync labels` workflow.

## Required label groups

- `type:*` describes the work category: bug, feature, chore, governance, or docs.
- `priority:*` describes urgency: `p0` for launch-critical, `p1` for important follow-up, `p2` for backlog.
- `area:*` describes ownership: frontend, content, acceptance, ci, or docs.
- `risk:*` describes expected review risk: low, medium, or high.
- `status:*` describes lifecycle: needs-triage, ready-for-review, blocked, needs-info, or accepted.

## Review-gate labels

The Claude review scaffold may apply:

- `claude-approved`
- `claude-changes-requested`
- `needs-human-review`
- `needs-human-merge`
- `needs-split`

These labels are advisory. A human reviewer still owns merge decisions.

## Scope guardrails

For P0, labels and automation must not imply approval for backend, payment, database, auth, Facebook/analytics, or release-infrastructure work. If a change touches any guarded area, label it `risk: high`, mark it blocked, and split it out for explicit owner approval.
