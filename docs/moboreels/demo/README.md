# SceneFlow P0 demo package

Linked kanban task: `t_8ce569ca` / DEMO-001.

This package prepares a concise, local-only stakeholder demo for the current fake-only SceneFlow P0 prototype. It is documentation only; it does not change runtime code or introduce production infrastructure.

Source of truth: `docs/moboreels/scene-flow-facebook-ad-conversion-prd.md`

Supporting prior evidence:

- `docs/moboreels/phase3-demo-script.md`
- `docs/moboreels/phase3-phone-preview.md`
- `docs/moboreels/phase3-acceptance/walkthrough.md`

Package contents:

1. `p0-demo-script.zh-CN.md` — one-page Chinese narration for a 2-3 minute demo.
2. `p0-route-list.md` — exact local route list for the P0 watch-first flow.
3. `p0-capture-checklist.md` — screenshot/capture checklist for EP1, EP6 lock, Unlock Drawer, mock unlock return, and Story Pass mock round trip.
4. `p0-phone-preview.md` — local/temporary non-production phone preview instructions.
5. `p0-safety-warnings.md` — explicit no-real-credentials/payment/secrets/sensitive-data warnings.
6. `p0-verification.md` — local gate results for this package.

Canonical P0 invariant:

```txt
/variant-b/watch/[showId]?episode=1&source=facebook -> free episode chain -> first locked episode -> Unlock Drawer -> fake unlock/pass -> same episode with unlocked=1
```

Concrete demo route:

```txt
/variant-b/watch/midnight-lantern-oath?episode=1&source=facebook
```

Non-goals for this package:

- No production deployment, DNS, cutover, public tunnel, or public preview URL.
- No production secrets, service credentials, or external account setup.
- No real payment, subscription, wallet, entitlement, login, analytics, Facebook API, backend, database, or video infrastructure.
- No NovelHub production infrastructure.
- No licensed, competitor-derived, or brand-significant assets.
